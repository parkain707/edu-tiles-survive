/**
 * ============================================================
 * EduTiles: 지식의 땅 - Complete Game Engine
 * Version 1.0
 * Architecture: Event-driven, class-based, pure JavaScript
 * Requires: data.js (GAME_DATA), style.css
 * ============================================================
 */

'use strict';

/* ============================================================
   GLOBAL GAME STATE
   ============================================================ */

/** @type {Object} Central game state object - single source of truth */
const gameState = {
  turn: 1,
  knowledgePoints: 0,
  targetKnowledgePoints: 60, // 기본 5분 빠른 모드 목표

  // 단계별 목표 및 축하 시스템
  currentDifficultyMode: 'quick', // 'quick' (60점), 'normal' (150점), 'master' (300점)
  currentStage: 1, // 1~3단계
  clearedStages: [], // 이미 축하를 받은 단계 기록

  // All 8 resource types with starting values
  resources: {
    food:      25,
    wood:      25,
    parts:     15,
    knowledge: 0,
    water:     25,
    research:  0,
    ore:       0,
    energy:    0
  },

  tiles: [],          // 10x10 flat array of tile objects
  buildings: {},      // { buildingKey: { level, builtTurn } }
  survivors: { count: 3, maxCount: 10 },

  exploredCount: 1,   // Start with HQ tile explored
  currentSubject: 'mixed',

  // Quiz tracking
  score: { totalAnswered: 0, correct: 0, incorrect: 0 },
  currentQuiz: null,  // Active quiz data
  pendingTile: null,  // Tile awaiting exploration after correct answer

  // Student Profile & Pause System
  studentName: '게스트',
  studentPin: '',
  isPaused: false,

  messages: [],       // Game message log entries
  gameWon: false,
  gameLost: false,
  isQuizOpen: false,

  // Internal turn-based timers for passive building effects
  _lastFarmTurn: 1,
};

// 난이도 모드별 목표 설정
const DIFFICULTY_CONFIGS = {
  quick: {
    name: '⚡ 빠른 체험 (5분)',
    targetKnowledge: 60,
    targetBuildings: 2,
    stages: [
      { stage: 1, reqKnowledge: 20, reqBuildings: 0, title: '🌱 1단계: 시장의 첫걸음', rewardTitle: '경제 꿈나무', bonus: { food: 20, wood: 20, parts: 10 }, desc: '시장의 원리를 이해하고 첫 자원을 훌륭하게 확보했습니다!' },
      { stage: 2, reqKnowledge: 40, reqBuildings: 1, title: '📈 2단계: 번영의 기초', rewardTitle: '생산의 달인', bonus: { food: 30, wood: 30, parts: 20 }, desc: '기반 시설을 세우고 생활을 안정적으로 이끌었습니다!' },
      { stage: 3, reqKnowledge: 60, reqBuildings: 2, title: '🏆 3단계: 빠른 코스 완주!', rewardTitle: '초등 경제 마스터', bonus: { food: 50, wood: 50, parts: 30 }, desc: '빠른 코스 목표를 모두 달성하여 훌륭하게 자립했습니다!' }
    ]
  },
  normal: {
    name: '🎯 표준 수업 (15분)',
    targetKnowledge: 150,
    targetBuildings: 4,
    stages: [
      { stage: 1, reqKnowledge: 40, reqBuildings: 1, title: '🏪 1단계: 시장경제 마스터', rewardTitle: '합리적 소비자', bonus: { food: 30, wood: 30, parts: 15 }, desc: '가계와 기업의 역할을 명확히 이해하고 시장을 활성화했습니다!' },
      { stage: 2, reqKnowledge: 90, reqBuildings: 2, title: '🚢 2단계: 글로벌 무역 도약', rewardTitle: '글로벌 무역왕', bonus: { food: 40, wood: 40, parts: 25 }, desc: '수출과 수입의 원리를 깨우치고 항만을 번창시켰습니다!' },
      { stage: 3, reqKnowledge: 150, reqBuildings: 4, title: '🌟 3단계: 지속가능 번영 완성', rewardTitle: '사회과 최우등생', bonus: { food: 60, wood: 60, parts: 40 }, desc: '표준 수업 코스를 완벽하게 통과하여 지속 가능한 도시를 완성했습니다!' }
    ]
  },
  master: {
    name: '👑 심화 탐험',
    targetKnowledge: 300,
    targetBuildings: 6,
    stages: [
      { stage: 1, reqKnowledge: 80, reqBuildings: 2, title: '🏭 1단계: 산업화의 기적', rewardTitle: '산업 혁신가', bonus: { food: 40, wood: 40, parts: 30 }, desc: '우리나라 경제성장의 핵심을 파악하고 공업을 부흥시켰습니다!' },
      { stage: 2, reqKnowledge: 180, reqBuildings: 4, title: '🌿 2단계: 기후·생태 수호자', rewardTitle: '지구촌 평화대사', bonus: { food: 60, wood: 60, parts: 40 }, desc: '지구촌 환경 문제와 SDGs 목표를 깊이 있게 체득했습니다!' },
      { stage: 3, reqKnowledge: 300, reqBuildings: 6, title: '👑 3단계: 전설의 경제 사령관', rewardTitle: '그랜드 마스터', bonus: { food: 100, wood: 100, parts: 60 }, desc: '모든 심화 지식을 마스터하고 전설적인 이상 도시를 건립했습니다!' }
    ]
  }
};

/* ============================================================
   CONSTANTS
   ============================================================ */

const GRID_SIZE      = 10;      // 10x10 grid
const TILE_SIZE      = 60;      // pixels per tile
const CANVAS_SIZE    = 600;     // 600x600px canvas
const HQ_X           = 4;       // HQ grid position X
const HQ_Y           = 4;       // HQ grid position Y
// Teacher-requested reset: isolate new records from any still-open old game tabs.
const RECORDS_EPOCH  = '20261012_reset1';
const SAVE_KEY       = `edutiles_save_${RECORDS_EPOCH}`;
const PROFILES_KEY   = `edutiles_profiles_${RECORDS_EPOCH}`; // Student profile slots
const LEADERBOARD_KEY = `edutiles_leaderboard_${RECORDS_EPOCH}`;
const AUTO_SAVE_TURNS = 5;      // Auto-save every N turns

// Tile type weights for random generation (must sum to 100)
const TILE_WEIGHTS = [
  { type: 'ruins',          weight: 20 },
  { type: 'forest',         weight: 20 },
  { type: 'farmland',       weight: 20 },
  { type: 'river',          weight: 15 },
  { type: 'mountain',       weight: 10 },
  { type: 'ancientLibrary', weight: 5  },
  { type: 'lab',            weight: 5  },
  { type: 'school',         weight: 5  },
];

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

/**
 * Pick a weighted random item from an array of { type, weight } objects.
 * @param {Array<{type:string, weight:number}>} weighted
 * @returns {string} chosen type key
 */
function weightedRandom(weighted) {
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  let rand = Math.random() * total;
  for (const item of weighted) {
    rand -= item.weight;
    if (rand <= 0) return item.type;
  }
  return weighted[weighted.length - 1].type;
}

/**
 * Get 1D array index from (x, y) grid coords.
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function tileIndex(x, y) {
  return y * GRID_SIZE + x;
}

/**
 * Get all valid orthogonal neighbors of (x, y).
 * @param {number} x
 * @param {number} y
 * @returns {Array<{x:number, y:number}>}
 */
function getNeighbors(x, y) {
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  return dirs
    .map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
    .filter(({ x, y }) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE);
}

/**
 * Pick a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Clamp a number between min and max.
 */
function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

/**
 * Format a resource name to Korean label using GAME_DATA.
 */
function resLabel(key) {
  return GAME_DATA.resources[key]?.emoji + ' ' + GAME_DATA.resources[key]?.name || key;
}

/* ============================================================
   CLASS: TileMap
   Manages the 10x10 grid of tiles with fog-of-war logic.
   ============================================================ */

class TileMap {
  constructor() {
    this.grid = []; // flat array, length GRID_SIZE*GRID_SIZE
  }

  /**
   * Initialize the tile grid.
   * - Center tile (HQ_X, HQ_Y) is explored.
   * - All other tiles are randomly typed and fogged.
   * - Tiles adjacent to HQ are marked canExplore.
   */
  init() {
    this.grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isHQ = (x === HQ_X && y === HQ_Y);
        this.grid.push({
          x,
          y,
          type:       isHQ ? 'hq' : weightedRandom(TILE_WEIGHTS),
          explored:   isHQ,
          canExplore: false,   // Will be set after grid is built
          building:   null,
        });
      }
    }
    // Mark tiles adjacent to HQ as explorable
    this._updateExplorability();
  }

  /**
   * Load grid from saved data.
   * @param {Array} savedGrid
   */
  loadFrom(savedGrid) {
    this.grid = savedGrid;
  }

  /**
   * Get tile at grid position (x, y).
   * @returns {Object|null}
   */
  getTile(x, y) {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return null;
    return this.grid[tileIndex(x, y)];
  }

  /**
   * Mark a tile as explored and propagate canExplore to neighbors.
   * @param {number} x
   * @param {number} y
   */
  exploreTile(x, y) {
    const tile = this.getTile(x, y);
    if (!tile || tile.explored) return;
    tile.explored = true;
    tile.canExplore = false;
    gameState.exploredCount++;
    this._updateExplorability();
  }

  /**
   * Recompute which unexplored tiles are adjacent to any explored tile.
   * @private
   */
  _updateExplorability() {
    // Reset all canExplore flags first
    for (const tile of this.grid) {
      if (!tile.explored) tile.canExplore = false;
    }
    // Mark unexplored tiles adjacent to explored ones
    for (const tile of this.grid) {
      if (!tile.explored) continue;
      for (const neighbor of getNeighbors(tile.x, tile.y)) {
        const n = this.getTile(neighbor.x, neighbor.y);
        if (n && !n.explored) n.canExplore = true;
      }
    }
  }

  /**
   * Get all tiles matching a predicate.
   * @param {Function} predicate
   * @returns {Array}
   */
  filter(predicate) {
    return this.grid.filter(predicate);
  }

  /**
   * Count explored tiles.
   */
  get exploredCount() {
    return this.grid.filter(t => t.explored).length;
  }
}

/* ============================================================
   CLASS: ResourceSystem
   Manages all 8 resource types: gain, spend, check.
   ============================================================ */

class ResourceSystem {
  /**
   * Add resources from a resource map { food: n, wood: n, ... }
   * @param {Object} amounts
   * @param {number} [multiplier=1.0] - applied to all values (Library bonus)
   */
  add(amounts, multiplier = 1.0) {
    for (const [key, rawAmount] of Object.entries(amounts)) {
      if (!(key in gameState.resources)) continue;
      // Knowledge gets a library multiplier if Library is built
      let amount = rawAmount;
      if (key === 'knowledge' && buildingSystem.isBuilt('library')) {
        amount = Math.floor(amount * 1.5);
      }
      amount = Math.floor(amount * multiplier);
      gameState.resources[key] = Math.max(0, gameState.resources[key] + amount);
      uiManager.pulseResource(key, amount > 0 ? 'gain' : 'loss');
    }
    // Update knowledge points tracking
    if (amounts.knowledge) {
      gameState.knowledgePoints = Math.min(
        gameState.targetKnowledgePoints,
        gameState.knowledgePoints + Math.floor((amounts.knowledge || 0) *
          (buildingSystem.isBuilt('library') ? 1.5 : 1.0))
      );
    }
    uiManager.updateHUD();
    uiManager.updateSidebar();
  }

  /**
   * Spend resources. Returns false if insufficient funds.
   * @param {Object} costs  { food: n, wood: n, ... }
   * @returns {boolean}
   */
  spend(costs) {
    if (!this.canAfford(costs)) return false;
    for (const [key, amount] of Object.entries(costs)) {
      if (key in gameState.resources) {
        gameState.resources[key] -= amount;
        uiManager.pulseResource(key, 'loss');
      }
    }
    uiManager.updateHUD();
    uiManager.updateSidebar();
    return true;
  }

  /**
   * Check if current resources cover the costs.
   * @param {Object} costs
   * @returns {boolean}
   */
  canAfford(costs) {
    return Object.entries(costs).every(
      ([key, amount]) => (gameState.resources[key] ?? 0) >= amount
    );
  }

  /**
   * Get current amount of a single resource.
   * @param {string} key
   * @returns {number}
   */
  get(key) {
    return gameState.resources[key] ?? 0;
  }

  /**
   * Passive resource generation from buildings called each turn.
   */
  processTurnEffects() {
    const turn = gameState.turn;

    // Farm: +2 food every 3 turns
    if (buildingSystem.isBuilt('farm') && (turn - gameState._lastFarmTurn) >= 3) {
      const farmLevel = buildingSystem.getLevel('farm');
      const foodGain = 2 * farmLevel;
      this.add({ food: foodGain });
      gameState._lastFarmTurn = turn;
      gameManager.addMessage(`🌾 농장에서 식량 +${foodGain} 생산됨`, 'success');
    }

    // Shelter: increases survivor max capacity by 2 per level
    if (buildingSystem.isBuilt('shelter')) {
      const level = buildingSystem.getLevel('shelter');
      gameState.survivors.maxCount = 3 + level * 2;
    }

    // Energy Tower: generate energy every turn
    if (buildingSystem.isBuilt('broadcastTower')) {
      const level = buildingSystem.getLevel('broadcastTower');
      this.add({ energy: level });
    }

    // Research Lab: generate research every 2 turns
    if (buildingSystem.isBuilt('lab') && turn % 2 === 0) {
      const level = buildingSystem.getLevel('lab');
      this.add({ research: level });
    }
  }
}

/* ============================================================
   CLASS: QuizSystem
   Presents questions from GAME_DATA.questions, checks answers,
   applies bonuses from School building.
   ============================================================ */

class QuizSystem {
  /**
   * Select a random question based on the current subject filter.
   * Subject is determined by the tile type or global setting.
   * @param {string} tileType  - tile type key (may influence subject)
   * @returns {Object|null} Question object from GAME_DATA.questions
   */
  getQuestion(tileType) {
    const subject = gameState.currentSubject;
    const tileData = GAME_DATA.tiles[tileType] || {};
    const preferredSubject = tileData.subject || subject;

    let pool = [];

    if (preferredSubject === 'mixed' || !GAME_DATA.questions[preferredSubject]) {
      // Flatten all questions across all subjects
      for (const subjectQuestions of Object.values(GAME_DATA.questions)) {
        pool.push(...subjectQuestions);
      }
    } else {
      pool = [...GAME_DATA.questions[preferredSubject]];
    }

    // Lab building: unlock difficulty 3 questions; otherwise cap at 2
    if (!buildingSystem.isBuilt('lab')) {
      pool = pool.filter(q => (q.difficulty || 1) <= 2);
    }

    if (pool.length === 0) {
      // Fallback: use all questions
      for (const q of Object.values(GAME_DATA.questions)) pool.push(...q);
    }

    const question = randomFrom(pool);
    if (!question) return null;

    // Shuffle a copy and track the original indices so the answer follows its choice.
    const order = question.choices.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const answerIndex = order.indexOf(question.answerIndex);
    return {
      ...question,
      choices: order.map(index => question.choices[index]),
      answer: answerIndex,
      answerIndex,
    };
  }

  /**
   * Open the quiz modal for a tile click.
   * @param {Object} tile
   */
  startQuiz(tile) {
    if (gameState.isQuizOpen) return;

    const question = this.getQuestion(tile.type);
    if (!question) {
      gameManager.addMessage('⚠️ 질문을 찾을 수 없습니다. 타일 탐험 완료!', 'warning');
      tileMap.exploreTile(tile.x, tile.y);
      resourceSystem.add(GAME_DATA.tiles[tile.type]?.rewards || {});
      renderer.render();
      return;
    }

    gameState.currentQuiz = { question, tile, attempts: 0, isCorrect: null, lastChoice: null };
    gameState.pendingTile = tile;
    gameState.isQuizOpen = true;

    uiManager.showQuizModal(question, tile);
  }

  /**
   * Evaluate the player's answer choice.
   * @param {number} choiceIndex  0-3
   */
  submitAnswer(choiceIndex) {
    const quiz = gameState.currentQuiz;
    if (!gameState.isQuizOpen || !quiz || quiz.isCorrect !== null) return;
    const { question, tile } = quiz;
    if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex >= question.choices.length) return;
    const isCorrect = (choiceIndex === question.answerIndex);
    quiz.lastChoice = choiceIndex;
    quiz.isCorrect = isCorrect;

    gameState.score.totalAnswered++;
    gameState.currentQuiz.attempts++;

    if (isCorrect) {
      gameState.score.correct++;
      // Compute rewards from tile type + bonus for quick answer
      const tileData = GAME_DATA.tiles[tile.type] || {};
      const rewards = { ...(tileData.rewards || {}), ...(question.rewards || {}) };
      resourceSystem.add(rewards);

      uiManager.showAnswerResult(true, question, rewards);
      gameManager.addMessage(
        `✅ 정답! "${tile.type}" 지역 탐험 성공. 보상 획득!`, 'success'
      );
    } else {
      gameState.score.incorrect++;
      uiManager.showAnswerResult(false, question, {});
      gameManager.addMessage(`❌ 오답. 설명을 읽고 다시 도전하세요!`, 'error');
    }
  }

  /**
   * Called when player clicks "계속" (Continue) after a correct answer.
   * Finalizes tile exploration.
   */
  confirmExploration() {
    if (gameState.currentQuiz?.isCorrect !== true) return;
    const tile = gameState.pendingTile;
    if (!tile) return;

    tileMap.exploreTile(tile.x, tile.y);
    renderer.triggerRevealEffect(tile.x, tile.y, performance.now());

    gameState.isQuizOpen = false;
    gameState.currentQuiz = null;
    gameState.pendingTile = null;

    uiManager.hideQuizModal();
    renderer.render();
    gameManager.nextTurn();
    gameManager.checkWinCondition();
    uiManager.updateSidebar();
  }

  /**
   * Called when player retries after a wrong answer.
   */
  retryQuestion() {
    const quiz = gameState.currentQuiz;
    if (!quiz || quiz.isCorrect !== false) return;
    quiz.isCorrect = null;
    quiz.lastChoice = null;
    const { question, tile } = quiz;
    uiManager.resetQuizChoices(question, tile);
  }
}

/* ============================================================
   CLASS: BuildingSystem
   Handles building construction and upgrades.
   ============================================================ */

class BuildingSystem {
  /**
   * Attempt to build or upgrade a building by key.
   * @param {string} key  - building key from GAME_DATA.buildings
   * @returns {boolean}
   */
  build(key) {
    const buildingData = GAME_DATA.buildings[key];
    if (!buildingData) {
      gameManager.addMessage(`⚠️ 알 수 없는 건물: ${key}`, 'warning');
      return false;
    }

    const current = gameState.buildings[key];
    const currentLevel = current ? current.level : 0;
    const maxLevel = buildingData.maxLevel || 3;

    if (currentLevel >= maxLevel) {
      gameManager.addMessage(`🏗️ ${buildingData.name} 최대 레벨 달성!`, 'info');
      return false;
    }

    const cost = buildingData.costs[currentLevel]; // Cost for next level
    if (!cost) {
      gameManager.addMessage(`🏗️ ${buildingData.name} 업그레이드 불가`, 'warning');
      return false;
    }

    if (!resourceSystem.canAfford(cost)) {
      gameManager.addMessage(
        `💸 자원 부족: ${buildingData.name} 건설 불가`, 'error'
      );
      uiManager.showToast(`자원이 부족합니다!`, 'error');
      return false;
    }

    // Deduct resources
    resourceSystem.spend(cost);

    // Register or upgrade building
    if (current) {
      current.level++;
      current.upgradedTurn = gameState.turn;
    } else {
      gameState.buildings[key] = {
        level: 1,
        builtTurn: gameState.turn,
      };
    }

    const newLevel = gameState.buildings[key].level;
    gameManager.addMessage(
      `🏗️ ${buildingData.emoji} ${buildingData.name} Lv.${newLevel} 건설 완료!`, 'success'
    );
    uiManager.showToast(`${buildingData.emoji} ${buildingData.name} 완공!`, 'success');

    // Apply immediate effects
    this._applyBuildingEffect(key, newLevel);

    uiManager.updateSidebar();
    gameManager.checkWinCondition();
    return true;
  }

  /**
   * Check if a building has been built (any level).
   * @param {string} key
   * @returns {boolean}
   */
  isBuilt(key) {
    return !!(gameState.buildings[key] && gameState.buildings[key].level > 0);
  }

  /**
   * Get the current level of a building (0 if not built).
   * @param {string} key
   * @returns {number}
   */
  getLevel(key) {
    return gameState.buildings[key]?.level || 0;
  }

  /**
   * Apply immediate passive effects when a building is first constructed.
   * @param {string} key
   * @param {number} level
   * @private
   */
  _applyBuildingEffect(key, level) {
    switch (key) {
      case 'shelter':
        gameState.survivors.maxCount = 3 + level * 2;
        break;
      case 'medBay':
        // Heal: restore food and add a survivor
        resourceSystem.add({ food: 10 * level });
        if (gameState.survivors.count < gameState.survivors.maxCount) {
          gameState.survivors.count = Math.min(
            gameState.survivors.maxCount,
            gameState.survivors.count + 1
          );
        }
        break;
      default:
        break;
    }
  }

  /**
   * Get the count of unique buildings built (regardless of level).
   * @returns {number}
   */
  get builtCount() {
    return Object.keys(gameState.buildings).length;
  }

  /**
   * Total buildings available (from GAME_DATA).
   * @returns {number}
   */
  get totalBuildings() {
    return Object.keys(GAME_DATA.buildings).length;
  }
}

/* ============================================================
   CLASS: Renderer
   Handles all canvas drawing: tiles, fog, grid, highlights.
   ============================================================ */

class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.hoveredTile = null;  // { x, y }
    this.selectedTile = null; // { x, y }
    this._animFrame = null;
    this._revealEffects = []; // [ { x, y, alpha, startTime } ]
  }

  /**
   * Start the render loop using requestAnimationFrame.
   */
  startLoop() {
    const loop = (timestamp) => {
      this.render(timestamp);
      this._animFrame = requestAnimationFrame(loop);
    };
    this._animFrame = requestAnimationFrame(loop);
  }

  /**
   * Stop the render loop.
   */
  stopLoop() {
    if (this._animFrame) cancelAnimationFrame(this._animFrame);
  }

  /**
   * Main render function - draws entire tile map.
   * @param {number} [timestamp]
   */
  render(timestamp = performance.now()) {
    const ctx = this.ctx;
    const { canvas } = this;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw background
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw each tile
    for (const tile of tileMap.grid) {
      this._drawTile(ctx, tile, timestamp);
    }

    // Draw grid lines on top
    this._drawGrid(ctx);

    // Draw reveal flash effects
    this._drawRevealEffects(ctx, timestamp);
  }

  /**
   * Draw a single tile.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} tile
   * @param {number} timestamp
   * @private
   */
  _drawTile(ctx, tile, timestamp) {
    const px = tile.x * TILE_SIZE;
    const py = tile.y * TILE_SIZE;
    const tileData = GAME_DATA.tiles[tile.type] || {};
    const isHovered  = this.hoveredTile  && this.hoveredTile.x  === tile.x && this.hoveredTile.y  === tile.y;
    const isSelected = this.selectedTile && this.selectedTile.x === tile.x && this.selectedTile.y === tile.y;

    if (!tile.explored) {
      // === FOGGED TILE ===
      if (tile.canExplore) {
        // Explorable tiles: glowing vibrant border + question pulse + sparkles
        const pulse = Math.sin(timestamp / 350) * 0.15 + 0.25;
        ctx.fillStyle = `rgba(78,204,163,${pulse})`;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = '#1a2238';
        ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);

        // Vibrant glowing border
        ctx.strokeStyle = '#4ecca3';
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);

        if (isHovered) {
          ctx.fillStyle = 'rgba(78,204,163,0.3)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }

        // Animated bouncing question mark
        const bounceY = Math.sin(timestamp / 250) * 2;
        ctx.font = 'bold 24px Nanum Gothic, sans-serif';
        ctx.fillStyle = isHovered ? '#ffea79' : '#4ecca3';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❓', px + TILE_SIZE / 2, py + TILE_SIZE / 2 + bounceY);
      } else {
        // Deep fog with subtle grid pattern
        ctx.fillStyle = '#0d111e';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Subtle cloud fog icon
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☁️', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
      }
    } else {
      // === EXPLORED TILE (생동감 넘치는 영토 효과) ===
      const color = tileData.color || '#334455';

      // Base terrain color with rich gradient
      const grad = ctx.createLinearGradient(px, py, px, py + TILE_SIZE);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(10,15,30,0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Light border around explored land
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

      // Draw big friendly emoji
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tileData.emoji || '🟫', px + TILE_SIZE / 2, py + TILE_SIZE / 2 - 5);

      // Draw friendly badge text
      ctx.font = 'bold 9px Nanum Gothic, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(tileData.name || tile.type, px + TILE_SIZE / 2, py + TILE_SIZE - 9);
      ctx.shadowBlur = 0; // reset

      // Draw building icon with shiny badge
      if (tile.building) {
        const bData = GAME_DATA.buildings[tile.building] || {};
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE - 11, py + 11, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '13px serif';
        ctx.fillText(bData.emoji || '🏠', px + TILE_SIZE - 11, py + 12);
      }

      // Hover highlight
      if (isHovered) {
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }

    // === SELECTION GLOW ===
    if (isSelected) {
      ctx.strokeStyle = '#ffea79';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);

      const glowAlpha = Math.sin(timestamp / 200) * 0.2 + 0.35;
      ctx.fillStyle = `rgba(255,234,121,${glowAlpha})`;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    }

    // HQ marker (본부 특별 디자인)
    if (tile.type === 'hq') {
      ctx.font = '32px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏛️', px + TILE_SIZE / 2, py + TILE_SIZE / 2 - 5);

      ctx.font = 'bold 10px Nanum Gothic, sans-serif';
      ctx.fillStyle = '#ffea79';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 4;
      ctx.fillText('★본부★', px + TILE_SIZE / 2, py + TILE_SIZE - 8);
      ctx.shadowBlur = 0;
    }
  }

  /**
   * Draw grid lines over the entire canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  _drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      const pos = i * TILE_SIZE;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(CANVAS_SIZE, pos);
      ctx.stroke();
    }
  }

  /**
   * Draw animated tile reveal flash & colorful fireworks particle effects.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} timestamp
   * @private
   */
  _drawRevealEffects(ctx, timestamp) {
    this._revealEffects = this._revealEffects.filter(effect => {
      const elapsed = timestamp - effect.startTime;
      const duration = 900;
      if (elapsed > duration) return false;

      const progress = elapsed / duration;
      const alpha = 1 - progress;
      const cx = effect.x * TILE_SIZE + TILE_SIZE / 2;
      const cy = effect.y * TILE_SIZE + TILE_SIZE / 2;

      ctx.save();

      // Expanding Shockwave ring
      const ringRadius = (TILE_SIZE * 0.5) + progress * (TILE_SIZE * 1.5);
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 204, 0, ${alpha * 0.8})`;
      ctx.lineWidth = 4 * (1 - progress);
      ctx.stroke();

      // Central golden flash
      const flashSize = TILE_SIZE * (1 + progress * 0.4);
      ctx.fillStyle = `rgba(78, 204, 163, ${alpha * 0.4})`;
      ctx.fillRect(cx - flashSize / 2, cy - flashSize / 2, flashSize, flashSize);

      // Colorful burst particles (8방향 폭죽)
      const particleColors = ['#ffcc00', '#4ecca3', '#ff6b81', '#70a1ff', '#eccc68'];
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const dist = progress * (TILE_SIZE * 1.2);
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const pSize = Math.max(1, 4 * (1 - progress));

        ctx.fillStyle = particleColors[i % particleColors.length];
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return true;
    });
  }

  /**
   * Trigger a reveal flash animation at a grid position.
   * @param {number} x
   * @param {number} y
   * @param {number} timestamp
   */
  triggerRevealEffect(x, y, timestamp) {
    this._revealEffects.push({ x, y, startTime: timestamp });
  }

  /**
   * Convert canvas pixel coordinates to tile grid coords.
   * @param {number} px  canvas-relative X
   * @param {number} py  canvas-relative Y
   * @returns {{x:number, y:number}|null}
   */
  pixelToTile(px, py) {
    const x = Math.floor(px / TILE_SIZE);
    const y = Math.floor(py / TILE_SIZE);
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return null;
    return { x, y };
  }
}

/* ============================================================
   CLASS: UIManager
   Manages all DOM updates, modal states, message log, toasts.
   ============================================================ */

class UIManager {
  constructor() {
    // Cache DOM element references
    this.hudResources  = document.getElementById('hud-resources');
    this.sidebar       = document.getElementById('sidebar');
    this.quizOverlay   = document.getElementById('quiz-modal-overlay');
    this.quizModal     = document.getElementById('quiz-modal');
    this.quizQuestion  = document.getElementById('quiz-question');
    this.quizChoices   = document.getElementById('quiz-choices');
    this.quizExplain   = document.getElementById('quiz-explanation');
    this.quizRewards   = document.getElementById('quiz-reward-info');
    this.quizActionRow = document.getElementById('quiz-action-row');
    this.messageLog    = document.getElementById('message-log');
    this.toastContainer= document.getElementById('toast-container');
    this.winOverlay    = document.getElementById('win-screen-overlay');
    this.tileInfoPanel = document.getElementById('tile-info-panel');
    this.knowledgeBar  = document.getElementById('knowledge-bar-fill');
    this.knowledgeText = document.getElementById('knowledge-bar-text');
    this.turnDisplay   = document.getElementById('turn-display');
    this.survDisplay   = document.getElementById('survivor-display');
    this.buildingsPanel= document.getElementById('buildings-panel');
    this.exploredText  = document.getElementById('explored-text');
    this.stageOverlay    = document.getElementById('stage-clear-overlay');
    this.stageTitleEl    = document.getElementById('current-stage-title');
    this.tutorialOverlay = document.getElementById('welcome-tutorial-overlay');

    // New Modal Elements
    this.pauseOverlay    = document.getElementById('pause-overlay');
    this.studentOverlay  = document.getElementById('student-modal-overlay');
    this.studentNameEl   = document.getElementById('current-student-name');
    this.leaderboardOverlay = document.getElementById('leaderboard-overlay');
    this.leaderboardBody    = document.getElementById('leaderboard-body');
    this.savedProfilesList  = document.getElementById('saved-profiles-list');

    this._resourceElements = {};
  }

  /**
   * Build all DOM structure for the HUD resource badges.
   * Called once on game init.
   */
  buildHUD() {
    const hudEl = this.hudResources;
    if (!hudEl) return;
    hudEl.innerHTML = '';
    for (const [key, data] of Object.entries(GAME_DATA.resources)) {
      const item = document.createElement('div');
      item.className = 'resource-item';
      item.dataset.res = key;
      item.title = data.name;
      item.innerHTML = `
        <span class="res-emoji">${data.emoji}</span>
        <span class="res-count" id="res-${key}">0</span>
      `;
      hudEl.appendChild(item);
      this._resourceElements[key] = item;
    }
    this.updateHUD();
  }

  /**
   * Update all resource counters in the HUD.
   */
  updateHUD() {
    for (const [key, amount] of Object.entries(gameState.resources)) {
      const el = document.getElementById(`res-${key}`);
      if (el) el.textContent = amount;
    }
    if (this.turnDisplay) {
      this.turnDisplay.textContent = `턴 ${gameState.turn}`;
    }
  }

  /**
   * Trigger a pulse animation on a resource badge.
   * @param {string} key
   * @param {'gain'|'loss'} type
   */
  pulseResource(key, type) {
    const el = this._resourceElements[key];
    if (!el) return;
    el.classList.remove('pulse-gain', 'pulse-loss');
    void el.offsetWidth; // Reflow to restart animation
    el.classList.add(type === 'gain' ? 'pulse-gain' : 'pulse-loss');
    setTimeout(() => el.classList.remove('pulse-gain', 'pulse-loss'), 600);
  }

  /**
   * Rebuild the sidebar buildings panel and status info.
   */
  updateSidebar() {
    this._updateStatus();
    this._updateBuildingsPanel();
  }

  /**
   * Update status section in sidebar.
   * @private
   */
  _updateStatus() {
    // Knowledge progress bar
    const pct = clamp((gameState.knowledgePoints / gameState.targetKnowledgePoints) * 100, 0, 100);
    if (this.knowledgeBar)  this.knowledgeBar.style.width = pct + '%';
    if (this.knowledgeText) {
      this.knowledgeText.textContent =
        `${gameState.knowledgePoints} / ${gameState.targetKnowledgePoints}`;
    }

    // Exploration progress
    if (this.exploredText) {
      this.exploredText.textContent =
        `${gameState.exploredCount} / ${GRID_SIZE * GRID_SIZE}`;
    }

    // Survivor dots
    if (this.survDisplay) {
      this.survDisplay.innerHTML = '';
      for (let i = 0; i < gameState.survivors.maxCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'survivor-dot' + (i < gameState.survivors.count ? '' : ' lost');
        this.survDisplay.appendChild(dot);
      }
    }
  }

  /**
   * Rebuild the buildings panel cards.
   * @private
   */
  _updateBuildingsPanel() {
    const panel = this.buildingsPanel;
    if (!panel) return;
    panel.innerHTML = '';

    for (const [key, data] of Object.entries(GAME_DATA.buildings)) {
      const currentLevel = buildingSystem.getLevel(key);
      const isBuilt      = buildingSystem.isBuilt(key);
      const maxLevel     = data.maxLevel || 3;
      const isMaxed      = currentLevel >= maxLevel;
      const nextCost     = isMaxed ? null : (data.costs[currentLevel] || null);
      const canAfford    = nextCost ? resourceSystem.canAfford(nextCost) : false;

      const card = document.createElement('div');
      card.className = `building-card ${isBuilt ? 'built' : ''} ${isMaxed ? 'maxed' : ''}`;
      card.innerHTML = `
        <div class="building-header">
          <span class="building-emoji">${data.emoji}</span>
          <span class="building-name">${data.name}</span>
          ${isBuilt
            ? `<span class="building-level-badge">Lv.${currentLevel}</span>`
            : `<span class="building-level-badge text-muted">미건설</span>`
          }
        </div>
        <div class="building-desc">${data.description}</div>
        ${nextCost ? `
          <div class="building-cost">
            ${Object.entries(nextCost).map(([r, amt]) => {
              const res = GAME_DATA.resources[r];
              const has = resourceSystem.get(r) >= amt;
              return `<span class="cost-badge ${has ? 'affordable' : 'unaffordable'}">
                ${res?.emoji || ''} ${amt}
              </span>`;
            }).join('')}
          </div>` : ''
        }
        ${isMaxed
          ? `<div class="text-teal text-xs font-bold">✅ 최대 레벨</div>`
          : `<button class="btn btn-sm ${canAfford ? 'btn-success' : 'btn-primary'}"
               onclick="buildingSystem.build('${key}')"
               ${canAfford ? '' : 'disabled'}>
               ${isBuilt ? '⬆️ 업그레이드' : '🏗️ 건설'}
             </button>`
        }
      `;
      panel.appendChild(card);
    }
  }

  /**
   * Show the quiz modal with a question.
   * @param {Object} question
   * @param {Object} tile
   */
  showQuizModal(question, tile) {
    const tileData = GAME_DATA.tiles[tile.type] || {};
    const subjectData = GAME_DATA.subjects?.[question.subject] || { label: question.subject || '일반', emoji: '📖' };

    // Set subject tag and difficulty
    const subjectTag = document.getElementById('quiz-subject-tag');
    const difficultyEl = document.getElementById('quiz-difficulty');
    const tileInfoEl = document.getElementById('quiz-tile-label');

    if (subjectTag) subjectTag.textContent = `${subjectData.emoji || ''} ${subjectData.label || question.subject || '일반'}`;
    if (difficultyEl) difficultyEl.textContent = '⭐'.repeat(question.difficulty || 1);
    if (tileInfoEl) tileInfoEl.textContent = `${tileData.emoji || ''} ${tileData.name || tile.type}`;

    // Set question text
    if (this.quizQuestion) this.quizQuestion.textContent = question.question;

    // Build choice buttons
    this._buildChoices(question, tile);

    // Hide explanation
    if (this.quizExplain) this.quizExplain.classList.remove('visible');
    if (this.quizActionRow) this.quizActionRow.innerHTML = '';

    // Show overlay
    if (this.quizOverlay) {
      this.quizOverlay.classList.add('visible');
    }
  }

  /**
   * Build the 4 choice buttons inside the quiz modal.
   * @param {Object} question
   * @param {Object} tile
   * @private
   */
  _buildChoices(question, tile) {
    if (!this.quizChoices) return;
    this.quizChoices.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    question.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice';
      btn.dataset.index = idx;
      btn.innerHTML = `
        <span class="quiz-choice-letter">${letters[idx]}</span>
        <span>${choice}</span>
      `;
      btn.addEventListener('click', () => quizSystem.submitAnswer(idx));
      this.quizChoices.appendChild(btn);
    });

    // School building: eliminate one wrong answer as a hint
    if (buildingSystem.isBuilt('school')) {
      this._applySchoolHint(question);
    }
  }

  /**
   * School building perk: grey out one wrong answer choice.
   * @param {Object} question
   * @private
   */
  _applySchoolHint(question) {
    const buttons = this.quizChoices.querySelectorAll('.quiz-choice');
    // Find wrong answers and eliminate one randomly
    const wrongIndices = [];
    for (let i = 0; i < question.choices.length; i++) {
      if (i !== question.answerIndex) wrongIndices.push(i);
    }
    if (wrongIndices.length === 0) return;
    const toEliminate = randomFrom(wrongIndices);
    buttons[toEliminate].classList.add('eliminated');
    buttons[toEliminate].disabled = true;
    const hintEl = document.createElement('div');
    hintEl.className = 'text-xs text-teal mt-sm';
    hintEl.textContent = '🏫 학교 효과: 오답 1개 제거됨';
    this.quizChoices.parentNode.insertBefore(hintEl, this.quizChoices.nextSibling);
  }

  /**
   * Show the answer result (correct/wrong) with explanation.
   * @param {boolean} isCorrect
   * @param {Object} question
   * @param {Object} rewards
   */
  showAnswerResult(isCorrect, question, rewards) {
    // Disable all choice buttons
    const buttons = this.quizChoices.querySelectorAll('.quiz-choice');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.add('disabled');
      if (idx === question.answerIndex) btn.classList.add('correct');
      else if (btn.dataset.index == gameState.currentQuiz?.lastChoice) btn.classList.add('wrong');
    });

    // Show explanation panel
    if (this.quizExplain) {
      const header = this.quizExplain.querySelector('.explanation-header');
      const iconEl = this.quizExplain.querySelector('.explanation-icon');
      const textEl = document.getElementById('explanation-text');

      if (header) {
        header.className = `explanation-header ${isCorrect ? 'result-correct' : 'result-wrong'}`;
      }
      if (iconEl) iconEl.textContent = isCorrect ? '✅' : '❌';
      const headerText = header?.querySelector('.explanation-title');
      if (headerText) headerText.textContent = isCorrect ? '정답입니다!' : '오답입니다.';

      if (textEl) textEl.textContent = question.explanation || '설명이 없습니다.';

      // Show rewards if correct
      if (this.quizRewards) {
        this.quizRewards.innerHTML = '';
        if (isCorrect && Object.keys(rewards).length > 0) {
          for (const [key, amt] of Object.entries(rewards)) {
            const res = GAME_DATA.resources[key];
            if (!res || !amt) continue;
            const badge = document.createElement('span');
            badge.className = 'reward-badge';
            badge.textContent = `${res.emoji} +${Math.floor(
              key === 'knowledge' && buildingSystem.isBuilt('library') ? amt * 1.5 : amt
            )} ${res.name}`;
            this.quizRewards.appendChild(badge);
          }
        }
      }

      this.quizExplain.classList.add('visible');
    }

    // Action buttons
    if (this.quizActionRow) {
      this.quizActionRow.innerHTML = '';
      if (isCorrect) {
        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn btn-success';
        continueBtn.textContent = '계속 탐험 →';
        continueBtn.addEventListener('click', () => quizSystem.confirmExploration());
        this.quizActionRow.appendChild(continueBtn);
      } else {
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn-primary';
        retryBtn.textContent = '🔄 다시 도전';
        retryBtn.addEventListener('click', () => quizSystem.retryQuestion());
        this.quizActionRow.appendChild(retryBtn);

        const skipBtn = document.createElement('button');
        skipBtn.className = 'btn btn-danger';
        skipBtn.textContent = '❌ 포기';
        skipBtn.addEventListener('click', () => this.hideQuizModal(true));
        this.quizActionRow.appendChild(skipBtn);
      }
    }
  }

  /**
   * Reset quiz choices for a retry attempt.
   * @param {Object} question
   * @param {Object} tile
   */
  resetQuizChoices(question, tile) {
    if (this.quizExplain) this.quizExplain.classList.remove('visible');
    this._buildChoices(question, tile);
    // Remove school hint if it was re-added
    const hint = this.quizModal?.querySelector('.school-hint');
    if (hint) hint.remove();
    if (this.quizActionRow) this.quizActionRow.innerHTML = '';
  }

  /**
   * Hide the quiz modal.
   * @param {boolean} [cancelled=false] - if true, player gave up
   */
  hideQuizModal(cancelled = false) {
    if (this.quizOverlay) this.quizOverlay.classList.remove('visible');
    gameState.isQuizOpen = false;
    if (cancelled) {
      gameState.currentQuiz = null;
      gameState.pendingTile = null;
      gameManager.addMessage('🚫 탐험 포기. 자원 소모 없음.', 'warning');
    }
  }

  /**
   * Show a toast notification.
   * @param {string} message
   * @param {'success'|'error'|'warning'} type
   * @param {number} [duration=3000]
   */
  showToast(message, type = 'success', duration = 3000) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  /**
   * Add a message to the message log display.
   * @param {string} text
   * @param {string} type
   */
  appendMessage(text, type) {
    if (!this.messageLog) return;
    const entry = document.createElement('div');
    entry.className = `message-entry type-${type}`;
    entry.innerHTML = `
      <span class="message-turn">T${gameState.turn}</span>
      <span class="message-text">${text}</span>
    `;
    this.messageLog.appendChild(entry);
    // Keep only last 20 entries
    while (this.messageLog.children.length > 20) {
      this.messageLog.removeChild(this.messageLog.firstChild);
    }
    this.messageLog.scrollTop = this.messageLog.scrollHeight;
  }

  /**
   * Show tile info tooltip panel.
   * @param {Object} tile
   */
  showTileInfo(tile) {
    if (!this.tileInfoPanel) return;
    const tileData = GAME_DATA.tiles[tile.type] || {};
    const nameEl = this.tileInfoPanel.querySelector('.tile-info-name');
    const descEl = this.tileInfoPanel.querySelector('.tile-info-desc');
    const statusEl = this.tileInfoPanel.querySelector('.tile-info-status');

    if (nameEl) nameEl.innerHTML = `<span>${tileData.emoji || '❓'}</span> ${tileData.name || tile.type}`;
    if (descEl) descEl.textContent = tileData.description || '';
    if (statusEl) {
      if (tile.type === 'hq') {
        statusEl.textContent = '🏛️ 본부 - 탐험 시작점';
      } else if (tile.explored) {
        statusEl.textContent = tile.building
          ? `건물: ${GAME_DATA.buildings[tile.building]?.name || tile.building}`
          : '✅ 탐험 완료';
      } else if (tile.canExplore) {
        statusEl.textContent = '🔍 클릭하여 탐험 (퀴즈 필요)';
        statusEl.style.color = '#4ecca3';
      } else {
        statusEl.textContent = '🌫️ 미탐험 지역';
        statusEl.style.color = '#556080';
      }
    }
    this.tileInfoPanel.classList.add('visible');
  }

  /**
   * Hide tile info tooltip.
   */
  hideTileInfo() {
    if (this.tileInfoPanel) this.tileInfoPanel.classList.remove('visible');
  }

  /**
   * Show large celebration modal when a stage is cleared.
   * @param {Object} stageData
   */
  showStageClearModal(stageData) {
    if (!this.stageOverlay) return;
    const titleEl = document.getElementById('stage-clear-title');
    const descEl  = document.getElementById('stage-clear-desc');
    const rewTitle= document.getElementById('stage-reward-title');
    const rewBonus= document.getElementById('stage-reward-bonus');

    if (titleEl)  titleEl.textContent  = `🌟 축하합니다! ${stageData.stage}단계를 달성했습니다!`;
    if (descEl)   descEl.textContent   = stageData.desc;
    if (rewTitle) rewTitle.textContent = stageData.rewardTitle;
    if (rewBonus) {
      const b = stageData.bonus || {};
      rewBonus.textContent = `🍎+${b.food || 0}  🪵+${b.wood || 0}  ⚙️+${b.parts || 0}`;
    }

    this.stageOverlay.classList.add('visible');
  }

  /**
   * Hide stage clear celebration modal.
   */
  hideStageClearModal() {
    if (this.stageOverlay) this.stageOverlay.classList.remove('visible');
  }

  /**
   * Show welcome tutorial modal.
   */
  showTutorialModal() {
    if (this.tutorialOverlay) this.tutorialOverlay.classList.add('visible');
  }

  /**
   * Hide welcome tutorial modal.
   */
  hideTutorialModal() {
    if (this.tutorialOverlay) this.tutorialOverlay.classList.remove('visible');
  }

  /**
   * Show the win screen overlay.
   * @param {Object} stats
   */
  /**
   * Show the win screen overlay with full score formula and grade badge.
   * @param {Object} stats
   */
  showWinScreen(stats) {
    if (!this.winOverlay) return;
    const winScreen = document.getElementById('win-screen');
    if (winScreen) {
      const statsContainer = winScreen.querySelector('.win-stats');
      if (statsContainer) {
        // Compute Grade Badge & Color
        let gradeBadge = 'grade-s';
        if (stats.grade === 'A') gradeBadge = 'grade-a';
        else if (stats.grade === 'B') gradeBadge = 'grade-b';
        else if (stats.grade === 'C') gradeBadge = 'grade-c';

        statsContainer.innerHTML = `
          <div class="win-stat-item" style="grid-column: span 2; background: rgba(255,215,0,0.15); border: 1px solid var(--accent-gold);">
            <div class="win-stat-label" style="color: var(--accent-gold); font-weight:800;">🏆 최종 평가 점수</div>
            <div class="win-stat-value" style="color: #ffd700; font-size: 24px;">${stats.finalScore}점 <span class="badge-grade ${gradeBadge}">${stats.grade}등급 (${stats.gradeTitle})</span></div>
          </div>
          <div class="win-stat-item">
            <div class="win-stat-label">탐험가</div>
            <div class="win-stat-value" style="color: var(--accent-teal);">${stats.studentName}</div>
          </div>
          <div class="win-stat-item">
            <div class="win-stat-label">총 턴수</div>
            <div class="win-stat-value">${stats.turns}턴</div>
          </div>
          <div class="win-stat-item">
            <div class="win-stat-label">지식 포인트</div>
            <div class="win-stat-value">${stats.knowledge}점</div>
          </div>
          <div class="win-stat-item">
            <div class="win-stat-label">정답률</div>
            <div class="win-stat-value">${stats.accuracy}%</div>
          </div>
          <div class="win-stat-item">
            <div class="win-stat-label">개척 타일</div>
            <div class="win-stat-value">${stats.explored}개</div>
          </div>
          <div class="win-stat-item">
            <div class="win-stat-label">건축 시설</div>
            <div class="win-stat-value">${stats.buildings}개</div>
          </div>
        `;
      }
    }
    this.winOverlay.classList.add('visible');
  }

  /**
   * Update student badge in HUD.
   */
  updateStudentDisplay() {
    if (this.studentNameEl) {
      this.studentNameEl.textContent = gameState.studentName || '게스트';
    }
  }

  /**
   * Show Pause modal.
   */
  showPauseModal() {
    gameState.isPaused = true;
    if (this.pauseOverlay) this.pauseOverlay.classList.add('visible');
  }

  /**
   * Hide Pause modal.
   */
  hidePauseModal() {
    gameState.isPaused = false;
    if (this.pauseOverlay) this.pauseOverlay.classList.remove('visible');
  }

  /**
   * Show Student Profile / Login modal.
   */
  showStudentModal() {
    if (!this.studentOverlay) return;
    const nameInput = document.getElementById('student-name-input');
    const pinInput  = document.getElementById('student-pin-input');
    if (nameInput) nameInput.value = (gameState.studentName !== '게스트') ? gameState.studentName : '';
    if (pinInput) pinInput.value = '';

    this.renderSavedProfilesList();
    this.studentOverlay.classList.add('visible');
  }

  /**
   * Hide Student Profile modal.
   */
  hideStudentModal() {
    if (this.studentOverlay) this.studentOverlay.classList.remove('visible');
  }

  /**
   * Render list of saved student chips.
   */
  renderSavedProfilesList() {
    if (!this.savedProfilesList) return;
    const profiles = saveSystem.getAllProfiles();
    const names = Object.keys(profiles);

    if (names.length === 0) {
      this.savedProfilesList.innerHTML = `<span style="color:var(--text-muted);font-size:12px;">아직 저장된 탐험가가 없습니다.</span>`;
      return;
    }

    this.savedProfilesList.innerHTML = names.map(name => `
      <div class="saved-profile-chip" onclick="uiManager.selectProfileChip('${name}')">
        <span>👤 ${name}</span>
      </div>
    `).join('');
  }

  /**
   * Autofill name input when chip is clicked.
   */
  selectProfileChip(name) {
    const nameInput = document.getElementById('student-name-input');
    const pinInput  = document.getElementById('student-pin-input');
    if (nameInput) nameInput.value = name;
    if (pinInput) pinInput.focus();
  }

  /**
   * Show Leaderboard modal.
   */
  showLeaderboardModal() {
    if (!this.leaderboardOverlay) return;
    this.renderLeaderboard();
    this.leaderboardOverlay.classList.add('visible');
  }

  /**
   * Hide Leaderboard modal.
   */
  hideLeaderboardModal() {
    if (this.leaderboardOverlay) this.leaderboardOverlay.classList.remove('visible');
  }

  /**
   * Render records in leaderboard table.
   */
  renderLeaderboard() {
    if (!this.leaderboardBody) return;
    const records = saveSystem.getLeaderboard();

    if (records.length === 0) {
      this.leaderboardBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">
            아직 완주한 탐험가 기록이 없습니다. 먼저 도전해 보세요!
          </td>
        </tr>
      `;
      return;
    }

    this.leaderboardBody.innerHTML = records.map((rec, idx) => {
      let rankClass = '';
      let rankBadge = `${idx + 1}위`;
      if (idx === 0) { rankClass = 'rank-gold'; rankBadge = '🥇 1위'; }
      else if (idx === 1) { rankClass = 'rank-silver'; rankBadge = '🥈 2위'; }
      else if (idx === 2) { rankClass = 'rank-bronze'; rankBadge = '🥉 3위'; }

      let gradeBadge = 'grade-s';
      if (rec.grade === 'A') gradeBadge = 'grade-a';
      else if (rec.grade === 'B') gradeBadge = 'grade-b';
      else if (rec.grade === 'C') gradeBadge = 'grade-c';

      return `
        <tr>
          <td class="${rankClass}">${rankBadge}</td>
          <td style="font-weight:700;">${rec.studentName || '탐험가'}</td>
          <td style="color:var(--accent-gold); font-weight:800;">${rec.finalScore}점</td>
          <td>${rec.accuracy}%</td>
          <td>${rec.explored}개</td>
          <td><span class="badge-grade ${gradeBadge}">${rec.grade}등급</span></td>
          <td style="color:var(--text-muted); font-size:11px;">${rec.date || '-'}</td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Switch the active sidebar tab.
   * @param {string} tabName  'status' | 'buildings'
   */
  switchTab(tabName) {
    document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
    const tab = document.querySelector(`.sidebar-tab[data-tab="${tabName}"]`);
    const panel = document.getElementById(`panel-${tabName}`);
    if (tab) tab.classList.add('active');
    if (panel) panel.classList.add('active');
  }
}

/* ============================================================
   CLASS: SaveSystem
   Handles localStorage persistence.
   ============================================================ */

class SaveSystem {
  /**
   * Remove records from before the teacher's reset on each browser's next visit.
   * Current-epoch records and other games' storage are preserved.
   */
  clearPreviousRecords() {
    try {
      for (const key of ['edutiles_save', 'edutiles_profiles', 'edutiles_leaderboard']) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('[SaveSystem] Previous records could not be removed:', e);
    }
  }

  /**
   * Serialize and save gameState + tileMap to localStorage.
   * If a student profile is active, also saves into that student's profile slot.
   */
  save() {
    try {
      const saveData = {
        version: '1.0',
        savedAt: new Date().toISOString(),
        gameState: {
          ...gameState,
          currentQuiz: null, // Don't persist open quiz state
          pendingTile: null,
          isQuizOpen: false,
          isPaused: false,
        },
        tiles: tileMap.grid,
      };

      // 1. General active slot save
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));

      // 2. If student is identified, persist to their personal profile slot
      if (gameState.studentName && gameState.studentName !== '게스트') {
        this.saveProfile(gameState.studentName, gameState.studentPin, saveData);
      }

      uiManager.showToast(`💾 [${gameState.studentName}] 저장 완료!`, 'success', 2000);
      gameManager.addMessage(`💾 ${gameState.studentName} 학생의 기록이 저장되었습니다.`, 'system');
      return true;
    } catch (e) {
      console.error('[SaveSystem] Save failed:', e);
      uiManager.showToast('저장 실패: ' + e.message, 'error');
      return false;
    }
  }

  /**
   * Load game state from localStorage and restore.
   * @returns {boolean} true if loaded successfully
   */
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        uiManager.showToast('저장 데이터가 없습니다.', 'warning');
        return false;
      }

      const saveData = JSON.parse(raw);
      return this.applySaveData(saveData);
    } catch (e) {
      console.error('[SaveSystem] Load failed:', e);
      uiManager.showToast('불러오기 실패: ' + e.message, 'error');
      return false;
    }
  }

  /**
   * Apply unpacked save data to current game.
   */
  applySaveData(saveData) {
    if (!saveData.gameState || !saveData.tiles) throw new Error('손상된 저장 데이터');

    // Restore game state
    Object.assign(gameState, saveData.gameState);
    gameState.isPaused = false;

    // Restore tile map
    tileMap.loadFrom(saveData.tiles);

    // Refresh UI
    uiManager.updateStudentDisplay();
    uiManager.updateHUD();
    uiManager.updateSidebar();
    renderer.render();

    uiManager.showToast(`💾 [${gameState.studentName}] 불러오기 완료 (턴 ${gameState.turn})`, 'success');
    gameManager.addMessage(`💾 저장된 게임을 불러왔습니다. (탐험가: ${gameState.studentName})`, 'system');
    return true;
  }

  /**
   * Save a specific student's profile.
   */
  saveProfile(name, pin, saveData) {
    try {
      const profiles = this.getAllProfiles();
      profiles[name] = {
        name,
        pin: pin || '',
        updatedAt: new Date().toISOString(),
        saveData: saveData
      };
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('[SaveSystem] Failed to save profile:', e);
    }
  }

  /**
   * Get all registered student profiles.
   */
  getAllProfiles() {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Attempt to load a student profile with PIN verification.
   * Master override PIN: '0000' (선생님 마스터키)
   */
  loadProfile(name, inputPin) {
    const profiles = this.getAllProfiles();
    const prof = profiles[name];
    if (!prof) {
      return { success: false, message: '등록되지 않은 이름입니다.' };
    }

    // Check PIN (0000 is teacher master bypass)
    if (prof.pin && prof.pin !== inputPin && inputPin !== '0000') {
      return { success: false, message: '비밀번호(4자리 PIN)가 일치하지 않습니다.' };
    }

    if (prof.saveData) {
      this.applySaveData(prof.saveData);
      return { success: true, message: '기록을 성공적으로 불러왔습니다!' };
    } else {
      gameState.studentName = name;
      gameState.studentPin = prof.pin;
      uiManager.updateStudentDisplay();
      return { success: true, message: '새 탐험가로 시작합니다!' };
    }
  }

  /**
   * Record a finished game record to the class Leaderboard.
   */
  recordScore(record) {
    try {
      const list = this.getLeaderboard();
      list.push({
        ...record,
        date: new Date().toLocaleDateString('ko-KR')
      });
      // Sort by final score descending
      list.sort((a, b) => b.finalScore - a.finalScore);
      // Keep top 30
      const trimmed = list.slice(0, 30);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('[SaveSystem] Failed to record score:', e);
    }
  }

  /**
   * Get leaderboard list.
   */
  getLeaderboard() {
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Delete saved game data.
   */
  deleteSave() {
    localStorage.removeItem(SAVE_KEY);
    uiManager.showToast('🗑️ 활성 저장 데이터 삭제됨', 'warning');
  }

  /**
   * Check if a save exists.
   * @returns {boolean}
   */
  hasSave() {
    return !!localStorage.getItem(SAVE_KEY);
  }
}

/* ============================================================
   CLASS: GameManager
   Singleton orchestrating the entire game loop and events.
   ============================================================ */

class GameManager {
  constructor() {
    this._initialized = false;
  }

  /**
   * Initialize the entire game: build DOM, init systems, start render loop.
   */
  init() {
    if (this._initialized) return;
    this._initialized = true;

    console.log('[GameManager] Initializing EduTiles: 지식의 땅');

    // Clear old student records before checking for saved games or profiles.
    saveSystem.clearPreviousRecords();

    // Initialize subsystems
    tileMap.init();
    uiManager.buildHUD();
    uiManager.updateSidebar();

    // Set up canvas event listeners
    this._bindCanvasEvents();

    // Set up button events
    this._bindUIEvents();

    // Start render loop
    renderer.startLoop();

    // Welcome message
    this.addMessage('🌍 지식의 땅에 오신 것을 환영합니다! 타일을 탐험하여 생존하세요.', 'info');
    this.addMessage('💡 팁: 탐험 가능한 타일(빛나는 타일)을 클릭하면 퀴즈가 시작됩니다.', 'system');

    // Show first sidebar tab
    uiManager.switchTab('status');

    // Auto-Resume check: If previous game exists, inform the player
    if (saveSystem.hasSave()) {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const sName = parsed.gameState?.studentName || '이전 탐험가';
          const sTurn = parsed.gameState?.turn || 1;
          this.addMessage(`📂 저장된 이전 탐험 기록이 있습니다. (${sName}, 턴 ${sTurn}) [불러오기]를 눌러 이어할 수 있습니다.`, 'warning');
        }
      } catch (e) {}
    }

    console.log('[GameManager] Initialization complete.');
  }

  /**
   * Bind mouse events on the canvas (click, hover).
   * @private
   */
  _bindCanvasEvents() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // Mouse move → hover highlight + tile info panel
    canvas.addEventListener('mousemove', (e) => {
      if (gameState.isQuizOpen || gameState.isPaused) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_SIZE / rect.width;
      const scaleY = CANVAS_SIZE / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top)  * scaleY;
      const coords = renderer.pixelToTile(px, py);
      if (coords) {
        renderer.hoveredTile = coords;
        const tile = tileMap.getTile(coords.x, coords.y);
        if (tile) uiManager.showTileInfo(tile);
      }
    });

    // Mouse leave → clear hover
    canvas.addEventListener('mouseleave', () => {
      renderer.hoveredTile = null;
      uiManager.hideTileInfo();
    });

    // Click → explore tile if possible
    canvas.addEventListener('click', (e) => {
      if (gameState.isQuizOpen || gameState.gameWon || gameState.isPaused) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_SIZE / rect.width;
      const scaleY = CANVAS_SIZE / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top)  * scaleY;
      const coords = renderer.pixelToTile(px, py);
      if (!coords) return;

      const tile = tileMap.getTile(coords.x, coords.y);
      if (!tile) return;

      if (tile.explored) {
        // Select explored tile for info
        renderer.selectedTile = coords;
        uiManager.showTileInfo(tile);
      } else if (tile.canExplore) {
        // Start quiz for this tile
        renderer.selectedTile = coords;
        quizSystem.startQuiz(tile);
      } else {
        this.addMessage('⚠️ 이 타일에 접근할 수 없습니다. 인접한 타일을 먼저 탐험하세요.', 'warning');
      }
    });

    // Mobile / Tablet Touch Support (터치 스크린 최적화)
    canvas.addEventListener('touchstart', (e) => {
      if (gameState.isQuizOpen || gameState.gameWon || gameState.isPaused) return;
      if (e.touches.length === 0) return;
      e.preventDefault(); // 스크롤 방지하고 타일 선택 우선

      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_SIZE / rect.width;
      const scaleY = CANVAS_SIZE / rect.height;
      const px = (touch.clientX - rect.left) * scaleX;
      const py = (touch.clientY - rect.top)  * scaleY;
      const coords = renderer.pixelToTile(px, py);
      if (!coords) return;

      const tile = tileMap.getTile(coords.x, coords.y);
      if (!tile) return;

      if (tile.explored) {
        renderer.selectedTile = coords;
        uiManager.showTileInfo(tile);
      } else if (tile.canExplore) {
        renderer.selectedTile = coords;
        quizSystem.startQuiz(tile);
      } else {
        this.addMessage('⚠️ 이 타일에 접근할 수 없습니다. 인접한 타일을 먼저 탐험하세요.', 'warning');
      }
    }, { passive: false });
  }

  /**
   * Bind all UI button events.
   * @private
   */
  _bindUIEvents() {
    // Sidebar tabs
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
      tab.addEventListener('click', () => uiManager.switchTab(tab.dataset.tab));
    });

    // Save / Load buttons
    const saveBtn = document.getElementById('btn-save');
    const loadBtn = document.getElementById('btn-load');
    const newBtn  = document.getElementById('btn-new');

    if (saveBtn) saveBtn.addEventListener('click', () => saveSystem.save());
    if (loadBtn) loadBtn.addEventListener('click', () => saveSystem.load());
    if (newBtn)  newBtn.addEventListener('click',  () => this.newGame());

    // Subject selector
    document.querySelectorAll('.subject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.currentSubject = btn.dataset.subject;
        this.addMessage(`📚 학습 주제 변경: ${btn.textContent}`, 'info');
      });
    });

    // Difficulty Mode Selector (quick / normal / master)
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setDifficultyMode(btn.dataset.mode);
      });
    });

    // Stage Clear Modal Continue Button
    const stageContBtn = document.getElementById('btn-stage-continue');
    if (stageContBtn) {
      stageContBtn.addEventListener('click', () => {
        uiManager.hideStageClearModal();
      });
    }

    // Tutorial Modal Events
    const tutorialStartBtn = document.getElementById('btn-tutorial-start');
    if (tutorialStartBtn) {
      tutorialStartBtn.addEventListener('click', () => {
        uiManager.hideTutorialModal();
      });
    }

    const guideOpenBtn = document.getElementById('btn-guide-open');
    if (guideOpenBtn) {
      guideOpenBtn.addEventListener('click', () => {
        uiManager.showTutorialModal();
      });
    }

    // Win screen restart
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) restartBtn.addEventListener('click', () => this.newGame());

    // Pause button and modal events
    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) pauseBtn.addEventListener('click', () => uiManager.showPauseModal());

    const pauseResumeBtn = document.getElementById('btn-pause-resume');
    if (pauseResumeBtn) pauseResumeBtn.addEventListener('click', () => uiManager.hidePauseModal());

    const pauseSaveBtn = document.getElementById('btn-pause-save');
    if (pauseSaveBtn) pauseSaveBtn.addEventListener('click', () => saveSystem.save());

    // Student Badge & Profile Modal events
    const studentBadge = document.getElementById('student-badge');
    if (studentBadge) studentBadge.addEventListener('click', () => uiManager.showStudentModal());

    const studentCloseBtn = document.getElementById('btn-student-close');
    if (studentCloseBtn) studentCloseBtn.addEventListener('click', () => uiManager.hideStudentModal());

    const studentGuestBtn = document.getElementById('btn-student-guest');
    if (studentGuestBtn) {
      studentGuestBtn.addEventListener('click', () => {
        gameState.studentName = '게스트';
        gameState.studentPin = '';
        uiManager.updateStudentDisplay();
        uiManager.hideStudentModal();
        uiManager.showToast('👤 게스트 모드로 진행합니다.', 'info');
      });
    }

    const studentLoginBtn = document.getElementById('btn-student-login');
    if (studentLoginBtn) {
      studentLoginBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('student-name-input');
        const pinInput  = document.getElementById('student-pin-input');
        const name = (nameInput?.value || '').trim();
        const pin  = (pinInput?.value || '').trim();

        if (!name) {
          uiManager.showToast('이름 또는 학번/별명을 입력해 주세요!', 'warning');
          return;
        }

        const profiles = saveSystem.getAllProfiles();
        if (profiles[name]) {
          // Existing student profile → verify PIN
          const res = saveSystem.loadProfile(name, pin);
          if (res.success) {
            uiManager.showToast(res.message, 'success');
            uiManager.hideStudentModal();
          } else {
            uiManager.showToast(res.message, 'error');
          }
        } else {
          // New student profile creation
          if (pin && pin.length !== 4) {
            uiManager.showToast('PIN 번호는 숫자 4자리여야 합니다!', 'warning');
            return;
          }
          gameState.studentName = name;
          gameState.studentPin = pin;
          saveSystem.save();
          uiManager.updateStudentDisplay();
          uiManager.hideStudentModal();
          uiManager.showToast(`🎉 새로운 탐험가 [${name}] 등록 완료!`, 'success');
        }
      });
    }

    // Leaderboard Modal events
    const leaderboardBtn = document.getElementById('btn-leaderboard');
    if (leaderboardBtn) leaderboardBtn.addEventListener('click', () => uiManager.showLeaderboardModal());

    const leaderboardCloseBtn = document.getElementById('btn-leaderboard-close');
    if (leaderboardCloseBtn) leaderboardCloseBtn.addEventListener('click', () => uiManager.hideLeaderboardModal());
  }

  /**
   * Change current difficulty mode and update targets.
   * @param {'quick'|'normal'|'master'} modeKey
   */
  setDifficultyMode(modeKey) {
    const config = DIFFICULTY_CONFIGS[modeKey];
    if (!config) return;

    gameState.currentDifficultyMode = modeKey;
    gameState.targetKnowledgePoints = config.targetKnowledge;
    gameState.clearedStages = []; // 리셋 시 단계 축하 기록 갱신

    this.checkStageProgression();
    uiManager.updateSidebar();

    this.addMessage(`⏱️ 난이도 모드 변경: ${config.name} (목표: 지식 ${config.targetKnowledge}점, 시설 ${config.targetBuildings}개)`, 'success');
    uiManager.showToast(`🎯 모드 전환: ${config.name}`, 'success');
  }

  /**
   * Check if player achieved the next stage milestone and trigger big celebration.
   */
  checkStageProgression() {
    const config = DIFFICULTY_CONFIGS[gameState.currentDifficultyMode];
    if (!config) return;

    const currentK = gameState.knowledgePoints;
    const currentB = buildingSystem.builtCount;

    // Check each stage milestone
    for (const stageData of config.stages) {
      const stageKey = `${gameState.currentDifficultyMode}_${stageData.stage}`;
      if (gameState.clearedStages.includes(stageKey)) continue;

      if (currentK >= stageData.reqKnowledge && currentB >= stageData.reqBuildings) {
        // Clear this stage!
        gameState.clearedStages.push(stageKey);
        gameState.currentStage = Math.min(stageData.stage + 1, config.stages.length);

        // Update stage badge title in sidebar
        if (uiManager.stageTitleEl) {
          uiManager.stageTitleEl.textContent = stageData.title;
        }

        // Grant stage bonus rewards
        if (stageData.bonus) {
          resourceSystem.add(stageData.bonus);
        }

        // Trigger BIG celebration modal!
        uiManager.showStageClearModal(stageData);
        this.addMessage(`🎉 [단계 통과!] ${stageData.title} 완료! 보너스 획득!`, 'success');
        break; // Show one celebration at a time
      }
    }

    // Update stage title display if not cleared
    const nextStage = config.stages.find(s => !gameState.clearedStages.includes(`${gameState.currentDifficultyMode}_${s.stage}`));
    if (nextStage && uiManager.stageTitleEl) {
      uiManager.stageTitleEl.textContent = nextStage.title;
    }
  }

  /**
   * Advance to the next turn and trigger passive effects.
   */
  nextTurn() {
    gameState.turn++;
    resourceSystem.processTurnEffects();

    // Auto-save every N turns
    if (gameState.turn % AUTO_SAVE_TURNS === 0) {
      saveSystem.save();
    }

    this.checkStageProgression();
    uiManager.updateHUD();
    uiManager.updateSidebar();
  }

  /**
   * Check win conditions based on the current difficulty mode.
   */
  checkWinCondition() {
    if (gameState.gameWon) return;

    this.checkStageProgression();

    const config = DIFFICULTY_CONFIGS[gameState.currentDifficultyMode];
    const targetK = config ? config.targetKnowledge : gameState.targetKnowledgePoints;
    const targetB = config ? config.targetBuildings : 2;

    const knowledgeOk = gameState.knowledgePoints >= targetK;
    const buildingsOk = buildingSystem.builtCount >= targetB;

    if (knowledgeOk && buildingsOk) {
      gameState.gameWon = true;
      const totalAnswered = gameState.score.totalAnswered;
      const accuracy = totalAnswered > 0
        ? Math.round((gameState.score.correct / totalAnswered) * 100)
        : 0;

      // 🏆 Final Score Calculation Formula (종합 점수 확정 공식)
      // 1. Knowledge Base Score (지식 점수)
      const knowledgeScore = gameState.knowledgePoints * 2;
      // 2. Accuracy Bonus (정답률 보너스: 최대 150점)
      const accuracyBonus = Math.round(accuracy * 1.5);
      // 3. Exploration Bonus (개척 타일 보너스: 타일당 6점, 최대 600점)
      const explorationBonus = tileMap.exploredCount * 6;
      // 4. Buildings Bonus (건물 레벨당 25점)
      let buildingLevelSum = 0;
      for (const b of Object.values(gameState.buildings)) {
        buildingLevelSum += (b.level || 1);
      }
      const buildingBonus = buildingLevelSum * 25;
      // 5. Turn Speed Penalty (턴 소요에 따른 미세 차감, 최소 0)
      const turnPenalty = Math.min(Math.floor(gameState.turn * 1.5), 100);

      const finalScore = Math.max(0, knowledgeScore + accuracyBonus + explorationBonus + buildingBonus - turnPenalty);

      // Determine Grade & Title
      let grade = 'C';
      let gradeTitle = '성장하는 경제 꿈나무';
      if (finalScore >= 800) {
        grade = 'S';
        gradeTitle = '국가 경제 총사령관';
      } else if (finalScore >= 600) {
        grade = 'A';
        gradeTitle = '스마트 경제 학자';
      } else if (finalScore >= 400) {
        grade = 'B';
        gradeTitle = '성실한 무역 상인';
      }

      const winStats = {
        studentName:   gameState.studentName || '게스트',
        finalScore,
        grade,
        gradeTitle,
        turns:         gameState.turn,
        knowledge:     gameState.knowledgePoints,
        accuracy,
        explored:      tileMap.exploredCount,
        totalAnswered,
        buildings:     buildingSystem.builtCount,
      };

      // Record to Leaderboard
      saveSystem.recordScore(winStats);

      uiManager.showWinScreen(winStats);
      this.addMessage(`🏆 [대승리] ${config ? config.name : '게임'} 최종 정복! 최종 점수: ${finalScore}점 (${grade}등급)`, 'success');
    }
  }

  /**
   * Add a message to the game log.
   * @param {string} text
   * @param {'success'|'error'|'warning'|'info'|'system'} [type='info']
   */
  addMessage(text, type = 'info') {
    const entry = { text, type, turn: gameState.turn };
    gameState.messages.push(entry);
    if (gameState.messages.length > 50) gameState.messages.shift();
    uiManager.appendMessage(text, type);
  }

  /**
   * Start a completely new game, resetting all state.
   */
  newGame() {
    // Reset game state to defaults
    gameState.turn = 1;
    gameState.knowledgePoints = 0;
    gameState.currentStage = 1;
    gameState.clearedStages = [];
    const cfg = DIFFICULTY_CONFIGS[gameState.currentDifficultyMode || 'quick'];
    gameState.targetKnowledgePoints = cfg ? cfg.targetKnowledge : 60;

    gameState.resources = { food: 25, wood: 25, parts: 15, knowledge: 0, water: 25, research: 0, ore: 0, energy: 0 };
    gameState.buildings = {};
    gameState.survivors = { count: 3, maxCount: 3 };
    gameState.exploredCount = 1;
    gameState.currentSubject = 'mixed';
    gameState.score = { totalAnswered: 0, correct: 0, incorrect: 0 };
    gameState.messages = [];
    gameState.gameWon = false;
    gameState.gameLost = false;
    gameState.isQuizOpen = false;
    gameState.currentQuiz = null;
    gameState.pendingTile = null;
    gameState._lastFarmTurn = 1;

    // Re-init tile map
    tileMap.init();

    // Re-init renderer state
    renderer.hoveredTile = null;
    renderer.selectedTile = null;
    renderer._revealEffects = [];

    // Hide overlays
    if (uiManager.quizOverlay)  uiManager.quizOverlay.classList.remove('visible');
    if (uiManager.winOverlay)   uiManager.winOverlay.classList.remove('visible');
    if (uiManager.stageOverlay) uiManager.stageOverlay.classList.remove('visible');

    // Update UI
    this.checkStageProgression();
    uiManager.buildHUD();
    uiManager.updateSidebar();
    uiManager.hideTileInfo();

    // Reset message log
    if (uiManager.messageLog) uiManager.messageLog.innerHTML = '';

    this.addMessage('🌍 새 게임 시작! 지식의 땅을 정복하세요!', 'success');
    this.addMessage('💡 본부(HQ)에서 시작하여 주변 타일을 탐험하세요.', 'system');

    console.log('[GameManager] New game started.');
  }
}

/* ============================================================
   SYSTEM INSTANTIATION
   Global singletons - order matters (UIManager before others)
   ============================================================ */

const tileMap        = new TileMap();
const uiManager      = new UIManager();
const resourceSystem = new ResourceSystem();
const quizSystem     = new QuizSystem();
const buildingSystem = new BuildingSystem();
const saveSystem     = new SaveSystem();
const renderer       = new Renderer(document.getElementById('canvas'));
const gameManager    = new GameManager();

/* ============================================================
   ENTRY POINT
   Start the game when the DOM is ready.
   ============================================================ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => gameManager.init());
} else {
  // DOM already loaded
  gameManager.init();
}

/* ============================================================
   GLOBAL EXPOSURE (for onclick handlers in HTML)
   ============================================================ */
window.gameManager    = gameManager;
window.buildingSystem = buildingSystem;
window.quizSystem     = quizSystem;
window.saveSystem     = saveSystem;
window.uiManager      = uiManager;
