const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

function createGame() {
  const context = vm.createContext({ console: { log() {} }, performance: { now: () => 0 } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8'), context);
  const source = fs.readFileSync(path.join(__dirname, '../js/game.js'), 'utf8');
  // Load real engine classes without booting the canvas or browser UI.
  vm.runInContext(source.slice(0, source.indexOf('const tileMap        = new TileMap();')) + `
    const tileMap = new TileMap();
    const uiManager = {
      showQuizModal() {}, showAnswerResult() {}, resetQuizChoices() {}, hideQuizModal() {},
      pulseResource() {}, updateHUD() {}, updateSidebar() {},
    };
    const resourceSystem = new ResourceSystem();
    const quizSystem = new QuizSystem();
    const buildingSystem = { isBuilt: () => false };
    const renderer = { render() {}, triggerRevealEffect() {} };
    const gameManager = { addMessage() {}, nextTurn() {}, checkWinCondition() {} };
  `, context);
  return script => vm.runInContext(script, context);
}

test('all 60 questions preserve the correct text through all 24 choice permutations', () => {
  const run = createGame();
  assert.equal(run('Object.values(GAME_DATA.questions).flat().length'), 60);
  run(`
    const originals = Object.values(GAME_DATA.questions).flat();
    const snapshot = JSON.stringify(originals);
    const random = Math.random;
    for (const original of originals) {
      GAME_DATA.questions = { test: [original] };
      gameState.currentSubject = 'test';
      const positions = new Set();
      const permutations = new Set();
      for (let a = 0; a < 4; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 2; c++) {
        const values = [0, (a + 0.5) / 4, (b + 0.5) / 3, (c + 0.5) / 2];
        Math.random = () => values.shift();
        const question = quizSystem.getQuestion('unknown');
        if (question === original || question.choices === original.choices) throw Error('shared question mutated');
        if (question.choices[question.answerIndex] !== original.choices[original.answerIndex]) throw Error('wrong answer mapping');
        if (question.answer !== question.answerIndex) throw Error('answer fields disagree');
        if (question.question !== original.question || question.explanation !== original.explanation) throw Error('question content changed');
        permutations.add(JSON.stringify(question.choices));
        positions.add(question.answerIndex);
      }
      if (positions.size !== 4 || permutations.size !== 24) throw Error('choice positions are biased');
    }
    Math.random = random;
    if (JSON.stringify(originals) !== snapshot) throw Error('question bank mutated');
  `);
});

test('wrong first choice cannot gain rewards or expand; retry preserves order and correct answer pays once', () => {
  const run = createGame();
  run(`
    tileMap.init();
    const tile = tileMap.getTile(5, 4);
    tile.type = 'forest';
    const original = GAME_DATA.questions.market_economy[0];
    GAME_DATA.questions = { test: [original] };
    gameState.currentSubject = 'test';
    Math.random = () => 0;
    quizSystem.startQuiz(tile);
    if (gameState.currentQuiz.question.answerIndex === 0) throw Error('first choice stayed correct');
    const choices = JSON.stringify(gameState.currentQuiz.question.choices);
    const resources = JSON.stringify(gameState.resources);
    quizSystem.confirmExploration();
    for (const invalid of [-1, 4, 0.5, '0', NaN]) quizSystem.submitAnswer(invalid);
    if (gameState.score.totalAnswered !== 0 || tile.explored) throw Error('invalid/unanswered quiz changed state');
    quizSystem.submitAnswer(0);
    if (gameState.score.incorrect !== 1 || JSON.stringify(gameState.resources) !== resources) throw Error('wrong answer awarded resources');
    quizSystem.submitAnswer(gameState.currentQuiz.question.answerIndex);
    quizSystem.confirmExploration();
    if (tile.explored || gameState.exploredCount !== 1 || gameState.score.totalAnswered !== 1) throw Error('wrong answer expanded territory or repeated submission counted');
    quizSystem.retryQuestion();
    if (JSON.stringify(gameState.currentQuiz.question.choices) !== choices) throw Error('retry shuffled the explanation answer');
    quizSystem.submitAnswer(gameState.currentQuiz.question.answerIndex);
    const awarded = JSON.stringify(gameState.resources);
    if (awarded === resources || gameState.score.correct !== 1) throw Error('correct answer did not reward');
    quizSystem.retryQuestion();
    quizSystem.submitAnswer(gameState.currentQuiz.question.answerIndex);
    if (JSON.stringify(gameState.resources) !== awarded || gameState.score.totalAnswered !== 2) throw Error('duplicate reward');
    quizSystem.confirmExploration();
    quizSystem.confirmExploration();
    quizSystem.submitAnswer(0);
    if (!tile.explored || gameState.exploredCount !== 2 || gameState.currentQuiz !== null) throw Error('correct answer did not complete exactly one exploration');
  `);
});

test('school hint excludes the shuffled correct choice and result marks the actual wrong choice', () => {
  const run = createGame();
  run(`
    const buttons = Array.from({ length: 4 }, (_, index) => ({
      dataset: { index: String(index) }, disabled: false,
      classList: { values: new Set(), add(value) { this.values.add(value); } },
    }));
    const ui = Object.create(UIManager.prototype);
    ui.quizChoices = { querySelectorAll: () => buttons, parentNode: { insertBefore() {} } };
    const document = { createElement: () => ({}) };
    const question = { choices: ['wrong', 'wrong', 'right', 'wrong'], answerIndex: 2 };
    Math.random = () => 0.5;
    ui._applySchoolHint(question);
    if (buttons[2].disabled || buttons.filter(b => b.disabled).length !== 1) throw Error('hint disabled correct answer');
    gameState.currentQuiz = { lastChoice: 3 };
    ui.showAnswerResult(false, question, {});
    if (!buttons.every(b => b.disabled)) throw Error('answered buttons remain enabled');
    if (!buttons[2].classList.values.has('correct') || !buttons[3].classList.values.has('wrong')) throw Error('result highlighted wrong positions');
  `);
});

test('immediate tile reveal render uses the animation clock and never draws a negative radius', () => {
  const run = createGame();
  run(`
    performance.now = () => 20000;
    const scene = Object.create(Renderer.prototype);
    scene.canvas = {};
    scene.ctx = {
      clearRect() {}, fillRect() {}, save() {}, beginPath() {}, stroke() {}, fill() {}, restore() {},
      arc(x, y, radius) { if (radius < 0) throw Error('negative reveal radius'); },
    };
    scene._drawGrid = () => {};
    scene._revealEffects = [];
    scene.triggerRevealEffect(5, 4, performance.now());
    scene.render();
    if (scene._revealEffects.length !== 1) throw Error('reveal disappeared');
    scene.render(21000);
    if (scene._revealEffects.length !== 0) throw Error('reveal did not expire');
  `);
});
