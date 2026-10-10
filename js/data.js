/**
 * EduTiles: 지식의 땅
 * data.js — 초등학교 6학년 눈높이에 맞춘 사회과 퀴즈 (2022 개정 교육과정)
 * 
 * [초등학생 눈높이 개편 원칙]
 * 1. 질문 어투: "~은 무엇일까요?", "~하는 까닭은 무엇일까요?" 등 친근하고 명확한 문장
 * 2. 일상 속 사례 제시: 용돈, 장보기, 학용품, 과자, 부모님의 일 등 친숙한 비유 활용
 * 3. 해설 친절화: 초등학생이 술술 읽고 바로 이해할 수 있는 구어체와 재미있는 설명
 * 
 * [단원 구성]
 * 1. market_economy (1단원: 시장경제와 가계·기업) : 15문항
 * 2. economic_growth (2단원: 우리나라의 경제 발전과 생활) : 15문항
 * 3. world_trade (3단원: 나라 사이의 교류와 무역) : 15문항
 * 4. world_environment (4단원: 세계의 기후와 지구촌 환경) : 15문항
 */

const GAME_DATA = {

  // =========================================================
  // 1. QUESTIONS — 초등 6학년 눈높이 맞춤형 퀴즈 (총 60문항)
  // =========================================================
  questions: {

    // -------------------------------------------------------
    // 단원 1: 시장경제와 가계·기업 (market_economy) — 15문항
    // -------------------------------------------------------
    market_economy: [
      {
        id: 'me_001',
        subject: 'market_economy',
        difficulty: 1,
        question: '용돈은 정해져 있는데 사고 싶은 장난감이나 간식은 너무 많아요. 이처럼 원하는 것에 비해 돈이나 물건이 부족한 상태를 무엇이라고 할까요?',
        choices: ['자원의 희소성', '자원의 넉넉함', '물건의 다양성', '공짜 나눔'],
        answer: 0,
        explanation: '사람의 욕심은 끝이 없지만, 쓸 수 있는 돈이나 자원은 한정되어 있어요. 이것을 사회 시간에 "자원의 희소성"이라고 배워요!',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'me_002',
        subject: 'market_economy',
        difficulty: 1,
        question: '우리 가족처럼 함께 살며 부모님이 일해서 번 돈으로 음식이나 옷을 사고 생활하는 경제 단위를 무엇이라고 부를까요?',
        choices: ['가계', '기업', '정부', '공장'],
        answer: 0,
        explanation: '가정 살림을 꾸려나가는 단위를 "가계"라고 해요. 가계는 회사에서 일해 돈을 벌고, 마트에서 필요한 물건을 사며 생활해요.',
        reward: { resource: 'food', amount: 3 }
      },
      {
        id: 'me_003',
        subject: 'market_economy',
        difficulty: 1,
        question: '맛있는 과자나 스마트폰을 만들어 사람들에게 팔고, 그 대가로 이익(돈)을 얻는 곳은 어디일까요?',
        choices: ['기업 (회사)', '가계 (가정)', '학교', '동사무소'],
        answer: 0,
        explanation: '사람들이 필요로 하는 물건이나 편리한 서비스를 만들어서 판매해 이익을 얻는 곳을 "기업(회사)"이라고 해요.',
        reward: { resource: 'parts', amount: 3 }
      },
      {
        id: 'me_004',
        subject: 'market_economy',
        difficulty: 1,
        question: '물건을 살 때 가격, 품질, 나에게 정말 필요한지 등을 꼼꼼하게 따져보고 가장 큰 만족을 얻도록 사는 현명한 소비는?',
        choices: ['합리적 선택 (합리적 소비)', '충동구매', '자랑하기 위한 과소비', '친구 따라 사기'],
        answer: 0,
        explanation: '꼭 필요한지 생각하고 가격과 품질을 비교해서 가진 돈 안에서 가장 알뜰하고 기분 좋게 사는 것을 "합리적 선택"이라고 해요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'me_005',
        subject: 'market_economy',
        difficulty: 1,
        question: '전통시장이나 대형마트, 인터넷 쇼핑몰처럼 물건을 사려는 사람과 팔려는 사람이 만나 거래하는 곳을 무엇이라고 할까요?',
        choices: ['시장', '도서관', '체육관', '박물관'],
        answer: 0,
        explanation: '물건을 사고파는 모든 장소나 관계를 "시장"이라고 해요. 요즘에는 인터넷이나 스마트폰 앱도 편리한 시장 역할을 한답니다.',
        reward: { resource: 'parts', amount: 3 }
      },
      {
        id: 'me_006',
        subject: 'market_economy',
        difficulty: 2,
        question: '시장경제에서 떡볶이 가게 사장님들이 손님을 더 많이 모으기 위해 맛을 연구하고 가격을 낮추는 행동을 무엇이라고 할까요?',
        choices: ['자유로운 경쟁', '강제적인 명령', '나눠먹기', '독점 판매'],
        answer: 0,
        explanation: '가게들이 더 좋은 물건을 팔기 위해 서로 실력을 겨루는 것을 "자유로운 경쟁"이라고 해요. 경쟁 덕분에 소비자는 더 맛있고 싼 음식을 먹을 수 있어요!',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'me_007',
        subject: 'market_economy',
        difficulty: 1,
        question: '부모님이 회사나 일터에서 열심히 일한 대가로 받는 소중한 보수(월급)를 무엇이라고 부를까요?',
        choices: ['임금 (월급)', '세금', '기부금', '용돈'],
        answer: 0,
        explanation: '자신의 땀과 노력, 기술을 제공하고 일한 대가로 받는 돈을 "임금" 또는 "급여(월급)"라고 불러요.',
        reward: { resource: 'food', amount: 3 }
      },
      {
        id: 'me_008',
        subject: 'market_economy',
        difficulty: 2,
        question: '일하는 근로자가 너무 힘들지 않고 안전하게 일할 수 있도록, 헌법에서 보장하는 근로자의 기본 권리는?',
        choices: ['근로자의 권리 (노동권)', '물건을 공짜로 가질 권리', '마음대로 지각할 권리', '세금을 안 낼 권리'],
        answer: 0,
        explanation: '근로자는 정당한 월급을 받고 안전하고 건강한 환경에서 쉴 권리가 있어요. 헌법에서는 이를 지키기 위해 단결권 등 노동 3권을 보장해요.',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'me_009',
        subject: 'market_economy',
        difficulty: 2,
        question: '회사가 돈만 많이 버는 것에 그치지 않고, 환경을 보호하고 가난한 이웃을 돕는 착한 행동을 무엇이라고 할까요?',
        choices: ['기업의 사회적 책임', '기업의 비밀주의', '기업의 독점권', '기업의 가격 올리기'],
        answer: 0,
        explanation: '기업도 사회의 한 구성원이기 때문에, 안전한 제품을 만들고 환경을 지키며 이웃을 돕는 "사회적 책임"을 다해야 사람들에게 사랑받아요.',
        reward: { resource: 'parts', amount: 4 }
      },
      {
        id: 'me_010',
        subject: 'market_economy',
        difficulty: 2,
        question: '어느 날 인기 있는 캐릭터 빵을 사려는 사람은 엄청 많은데, 가게에 들어온 빵은 3개뿐이라면 빵의 가치와 가격은 어떻게 될까요?',
        choices: ['가격이 오르고 구하기 힘들어진다', '가격이 0원으로 떨어진다', '빵이 저절로 100개로 늘어난다', '아무런 변화가 없다'],
        answer: 0,
        explanation: '사고 싶은 사람(수요)은 많은데 물건(공급)이 적으면 물건이 귀해져서 가격이 오르게 돼요. 시장에서 가격이 정해지는 기본 원리예요!',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'me_011',
        subject: 'market_economy',
        difficulty: 2,
        question: '용돈 1,000원으로 아이스크림과 과자 중 고민하다 아이스크림을 샀어요. 이때 아쉽게 포기한 과자의 가치를 경제 용어로 무엇이라 할까요?',
        choices: ['기회비용', '공짜 비용', '생산 비용', '저금 비용'],
        answer: 0,
        explanation: '하나를 선택하면 다른 것을 포기해야 하죠? 이때 포기한 것의 가치를 "기회비용"이라고 해요. 포기한 것보다 선택한 것이 더 좋아야 현명한 선택이에요!',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'me_012',
        subject: 'market_economy',
        difficulty: 1,
        question: '지구를 위해 포장지가 적은 물건을 사거나, 동물과 환경을 아끼는 착한 기업의 제품을 골라 사는 소비를 무엇이라 할까요?',
        choices: ['윤리적 소비 (착한 소비)', '아무거나 사기', '충동구매', '돈 자랑 소비'],
        answer: 0,
        explanation: '물건이 싸고 좋은지뿐만 아니라 환경 보호, 공정한 대가, 동물 복지까지 생각하며 착하게 소비하는 것을 "윤리적 소비"라고 해요.',
        reward: { resource: 'research', amount: 3 }
      },
      {
        id: 'me_013',
        subject: 'market_economy',
        difficulty: 1,
        question: '산 물건에 문제가 있거나 피해를 보았을 때, 소비자의 억울함을 풀어주고 권리를 지켜주는 국가 기관은?',
        choices: ['한국소비자원', '기상청', '소방서', '교통경찰서'],
        answer: 0,
        explanation: '소비자가 산 물건이 고장 났거나 속아서 샀을 때, 이를 상담해 주고 문제를 해결하도록 도와주는 곳이 "한국소비자원"이에요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'me_014',
        subject: 'market_economy',
        difficulty: 2,
        question: '음식 포장지 뒤에 유통기한, 영양 성분, 알레르기 유발 물질이 적혀 있는 것은 소비자의 어떤 권리를 지키기 위한 것일까요?',
        choices: ['물건에 대한 정보를 알 권리', '음식을 무조건 공짜로 먹을 권리', '가격을 내 마음대로 깎을 권리', '가게 주인을 바꾸는 권리'],
        answer: 0,
        explanation: '소비자는 안전한 제품을 선택할 수 있도록 정확한 정보를 알 권리가 있어요. 그래서 과자 봉지 뒤에 성분과 유통기한이 꼭 적혀 있답니다.',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'me_015',
        subject: 'market_economy',
        difficulty: 2,
        question: '실패를 두려워하지 않고 새로운 아이디어로 멋진 제품을 만들어 세상을 편리하게 바꾸려는 기업인의 도전 정신을 무엇이라 할까요?',
        choices: ['기업가 정신', '귀차니즘', '따라 하기 정신', '욕심쟁이 정신'],
        answer: 0,
        explanation: '새로운 기술과 아이디어로 용기 있게 도전하여 좋은 일자리를 만들고 사회를 발전시키는 멋진 도전을 "기업가 정신"이라고 불러요.',
        reward: { resource: 'parts', amount: 4 }
      }
    ],

    // -------------------------------------------------------
    // 단원 2: 경제성장과 우리 생활 (economic_growth) — 15문항
    // -------------------------------------------------------
    economic_growth: [
      {
        id: 'eg_001',
        subject: 'economic_growth',
        difficulty: 1,
        question: '우리나라 안에서 1년 동안 만들어 낸 모든 물건과 서비스의 가치를 다 더한 것으로, 나라의 경제 크기를 보여주는 지표는?',
        choices: ['국내총생산 (GDP)', '시험 점수', '자동차 등록 대수', '전국 인구수'],
        answer: 0,
        explanation: '국내총생산(GDP)은 한 나라의 살림 규모가 얼마나 큰지, 공장과 가게에서 얼마나 많은 가치를 만들어 냈는지 알려주는 대표 성적표예요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'eg_002',
        subject: 'economic_growth',
        difficulty: 1,
        question: '1960년대 초, 가난했던 우리나라가 손재주와 부지런함을 살려 처음으로 활발하게 만들고 수출했던 물건들은?',
        choices: ['가발, 신발, 옷(섬유)', '우주선과 로봇', '인공위성과 비행기', '슈퍼컴퓨터'],
        answer: 0,
        explanation: '처음에는 큰 공장이나 기계가 부족해서, 사람의 손으로 정성껏 만들 수 있는 옷, 신발, 가발 같은 경공업 제품부터 시작해 발전했어요.',
        reward: { resource: 'parts', amount: 3 }
      },
      {
        id: 'eg_003',
        subject: 'economic_growth',
        difficulty: 2,
        question: '1970년대부터 나라가 더 크게 발전하기 위해 세운 제철소(철 만들기), 조선소(큰 배 만들기), 자동차 공장 등을 묶어 부르는 말은?',
        choices: ['중화학 공업', '농사 짓기', '단순 손뜨개질', '게임 개발'],
        answer: 0,
        explanation: '철을 만들고 큰 배와 자동차를 만드는 묵직하고 거대한 공업을 "중화학 공업"이라고 해요. 포항제철소와 조선소가 이때 세워졌어요!',
        reward: { resource: 'ore', amount: 4 }
      },
      {
        id: 'eg_004',
        subject: 'economic_growth',
        difficulty: 1,
        question: '전쟁의 폐허를 딛고 온 국민이 땀 흘려 세계가 깜짝 놀랄 만큼 빠른 속도로 경제를 성장시킨 대한민국의 기적을 무엇이라 부를까요?',
        choices: ['한강의 기적', '바다의 기적', '하늘의 기적', '설악산의 기적'],
        answer: 0,
        explanation: '외국 사람들은 한국이 한강 주변 서울을 중심으로 눈부시게 발전한 역사를 보며 놀라워하며 "한강의 기적"이라고 불렀답니다.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'eg_005',
        subject: 'economic_growth',
        difficulty: 1,
        question: '1970년 서울과 부산을 연결하여 전국 어디든 하루 만에 물건을 나를 수 있게 만든 우리나라 최초의 대표 고속도로는?',
        choices: ['경부고속도로', '골목길', '자전거 전용도로', '동네 산책로'],
        answer: 0,
        explanation: '경부고속도로가 뚫리면서 공장에서 만든 물건을 트럭에 싣고 항구와 전국 각지로 빠르게 운반할 수 있어 경제가 쑥쑥 자라났어요.',
        reward: { resource: 'parts', amount: 3 }
      },
      {
        id: 'eg_006',
        subject: 'economic_growth',
        difficulty: 1,
        question: '오늘날 우리나라가 전 세계에서 가장 잘 만들기로 유명하며, 스마트폰과 컴퓨터의 "두뇌" 역할을 하는 핵심 부품은?',
        choices: ['반도체', '유리구슬', '연필심', '벽돌'],
        answer: 0,
        explanation: '반도체는 전자제품에 꼭 들어가는 초정밀 전자 부품이에요. 우리나라는 세계 최고 수준의 반도체 기술을 자랑하고 있답니다!',
        reward: { resource: 'research', amount: 3 }
      },
      {
        id: 'eg_007',
        subject: 'economic_growth',
        difficulty: 1,
        question: '경제가 발전하면서 우리 조부모님 시절에 비해 오늘날 우리 생활이 좋아진 모습으로 알맞은 것은?',
        choices: ['영양과 위생이 좋아져 평균 수명이 길어졌다', '하루에 한 끼도 먹기 힘들어졌다', '차가 없어서 서울까지 걸어 다닌다', '전기가 안 들어와 밤에 촛불만 켠다'],
        answer: 0,
        explanation: '경제가 성장하면서 맛있는 음식, 깨끗한 아파트, 병원 치료, 편리한 스마트폰 등 우리의 의식주와 건강이 훨씬 좋아졌어요.',
        reward: { resource: 'food', amount: 3 }
      },
      {
        id: 'eg_008',
        subject: 'economic_growth',
        difficulty: 2,
        question: '경제가 빠르게 발전하는 과정에서 나타난 아쉽고 슬픈 문제점은 무엇일까요?',
        choices: ['부유한 사람과 가난한 사람의 소득 격차(빈부 격차)', '모든 사람이 백만장자가 된 것', '자연환경이 저절로 너무 깨끗해진 것', '일할 자리가 너무 많아서 남는 것'],
        answer: 0,
        explanation: '경제가 급격히 성장하면서 소득의 차이가 벌어지는 빈부 격차, 도시 집중 문제, 환경오염 같은 문제가 생겨 함께 해결해야 해요.',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'eg_009',
        subject: 'economic_growth',
        difficulty: 1,
        question: '아파서 병원에 갈 때 진료비 부담을 덜어주어 온 국민이 치료를 받을 수 있게 돕는 국가의 착한 제도는?',
        choices: ['국민건강보험', '자동차세', '놀이공원 자유이용권', '은행 대출'],
        answer: 0,
        explanation: '국민건강보험은 평소에 조금씩 보험료를 모아두었다가, 국민이 아플 때 병원비의 많은 부분을 지원해 주는 대표적인 사회 보장 제도예요.',
        reward: { resource: 'food', amount: 3 }
      },
      {
        id: 'eg_010',
        subject: 'economic_growth',
        difficulty: 1,
        question: '공장 매연과 매연 가스로 지구가 아파하지 않도록, 자연을 보호하면서 경제를 발전시키는 것을 무엇이라 할까요?',
        choices: ['친환경 녹색 성장 (지속가능한 성장)', '나무 마구 베기', '매연 마음대로 뿜기', '쓰레기 바다에 버리기'],
        answer: 0,
        explanation: '자연을 지키면서 태양광이나 바람 같은 깨끗한 에너지로 공장을 돌리는 것을 "친환경 녹색 성장"이라고 불러요.',
        reward: { resource: 'research', amount: 3 }
      },
      {
        id: 'eg_011',
        subject: 'economic_growth',
        difficulty: 2,
        question: '1970년대 초, 시골 마을의 초가지붕을 기와로 바꾸고 길을 넓히며 "우리도 잘살아 보자!"고 힘을 모았던 운동은?',
        choices: ['새마을 운동', '독립 만세 운동', '체육 대회', '금모으기 운동'],
        answer: 0,
        explanation: '"근면·자조·협동"의 정신으로 주민들이 힘을 모아 마을 길을 닦고 살림을 가꾸었던 운동이 "새마을 운동"이에요.',
        reward: { resource: 'food', amount: 4 }
      },
      {
        id: 'eg_012',
        subject: 'economic_growth',
        difficulty: 1,
        question: '근로자가 너무 오랜 시간 일해서 쓰러지지 않도록 휴식 시간을 보장하고 다치지 않게 지켜주는 법은?',
        choices: ['근로기준법', '도로교통법', '도서관법', '식품위생법'],
        answer: 0,
        explanation: '근로기준법은 일하는 사람의 건강과 행복을 위해 일하는 시간, 휴일, 안전 기준 등을 나라에서 법으로 정해둔 것이에요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'eg_013',
        subject: 'economic_growth',
        difficulty: 1,
        question: '열심히 일한 사람에게 회사 사장님이 법으로 정해진 금액보다 적게 주지 못하도록 정해둔 가장 낮은 임금 기준은?',
        choices: ['최저임금제도', '보너스제도', '칭찬 스티커', '기부금 제도'],
        answer: 0,
        explanation: '나라에서 "1시간에 최소한 이 금액 이상은 주어야 합니다"라고 정해둔 제도가 "최저임금제도"예요. 일하는 사람의 생활을 지켜줘요!',
        reward: { resource: 'food', amount: 3 }
      },
      {
        id: 'eg_014',
        subject: 'economic_growth',
        difficulty: 2,
        question: '옛날에는 다른 나라의 쌀과 밀가루 원조를 받던 가난한 한국이, 이제는 가난한 나라를 도와주는 자랑스러운 나라가 되었음을 뜻하는 말은?',
        choices: ['도움을 받던 나라에서 도움을 주는 나라로 성장했다', '더 가난한 나라가 되었다', '다른 나라와 담을 쌓았다', '원조를 더 많이 요구한다'],
        answer: 0,
        explanation: '대한민국은 세계 역사에서 다른 나라의 도움을 받던 나라(수혜국)에서 당당히 남을 돕는 나라(공여국)가 된 유일하고 멋진 나라예요!',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'eg_015',
        subject: 'economic_growth',
        difficulty: 2,
        question: '기름(휘발유) 대신 배터리 전기로 움직여 매연을 뿜지 않는 미래의 친환경 자동차는?',
        choices: ['전기 자동차 (전기차)', '증기 기관차', '석탄 자동차', '디젤 화물차'],
        answer: 0,
        explanation: '전기차나 수소차는 공기를 오염시키는 배기가스를 내뿜지 않아 지구 환경을 지키는 미래 친환경 기술의 대표 주자예요!',
        reward: { resource: 'research', amount: 4 }
      }
    ],

    // -------------------------------------------------------
    // 단원 3: 국가 간 거래와 무역 (world_trade) — 15문항
    // -------------------------------------------------------
    world_trade: [
      {
        id: 'wt_001',
        subject: 'world_trade',
        difficulty: 1,
        question: '우리나라와 미국, 일본 등 여러 나라가 서로 필요한 물건이나 서비스를 국경을 넘어 사고파는 것을 무엇이라 할까요?',
        choices: ['무역', '선물 교환', '이사', '여행'],
        answer: 0,
        explanation: '나라와 나라 사이에 물건과 기술, 서비스를 사고파는 국가 간의 큰 상업 활동을 "무역"이라고 불러요.',
        reward: { resource: 'parts', amount: 3 }
      },
      {
        id: 'wt_002',
        subject: 'world_trade',
        difficulty: 1,
        question: '우리나라 공장에서 정성껏 만든 자동차나 반도체를 외국에 파는 것을 무엇이라고 부를까요?',
        choices: ['수출', '수입', '환전', '배달'],
        answer: 0,
        explanation: '우리나라 제품을 비행기나 배에 싣고 다른 나라에 판매하는 것을 "수출"이라고 해요. 수출을 많이 하면 외화를 벌 수 있어요!',
        reward: { resource: 'parts', amount: 3 }
      },
      {
        id: 'wt_003',
        subject: 'world_trade',
        difficulty: 1,
        question: '우리나라에서 나지 않는 바나나, 커피, 기름(석유)을 다른 나라로부터 사 오는 것을 무엇이라고 할까요?',
        choices: ['수입', '수출', '기증', '자급자족'],
        answer: 0,
        explanation: '국내에 부족하거나 없는 자원과 물건을 다른 나라에서 돈을 주고 사 오는 것을 "수입"이라고 불러요.',
        reward: { resource: 'ore', amount: 3 }
      },
      {
        id: 'wt_004',
        subject: 'world_trade',
        difficulty: 1,
        question: '나라마다 자연환경과 기술이 달라서, 각자 잘 만드는 물건을 서로 무역하여 교환하면 어떤 점이 좋을까요?',
        choices: ['두 나라 모두 필요한 물건을 더 싸고 풍족하게 얻을 수 있다', '두 나라 모두 망하게 된다', '물건 가격이 100배로 비싸진다', '아무런 이익이 없다'],
        answer: 0,
        explanation: '우리는 잘 만드는 반도체를 팔고, 사우디아라비아에서는 석유를 사 오면 서로 부족한 것을 채우고 함께 풍요로워져요!',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'wt_005',
        subject: 'world_trade',
        difficulty: 1,
        question: '우리나라 땅속에서는 거의 나오지 않아 중동 나라들로부터 아주 많이 사 와야 하는 자동차와 공장의 필수 기름은?',
        choices: ['원유 (석유)', '수돗물', '참기름', '식용유'],
        answer: 0,
        explanation: '원유(석유)는 자동차를 달리게 하고 플라스틱을 만드는 필수 자원인데, 한국에서는 나지 않아 대부분 수입에 의존해요.',
        reward: { resource: 'ore', amount: 3 }
      },
      {
        id: 'wt_006',
        subject: 'world_trade',
        difficulty: 1,
        question: '오늘날 대한민국이 뛰어난 기술력으로 만들어 전 세계에 가장 자랑스럽게 많이 수출하는 대표 효자 물건은?',
        choices: ['반도체와 자동차', '열대 과일', '원목(통나무)', '모래와 자갈'],
        answer: 0,
        explanation: '대한민국은 뛰어난 기술로 반도체, 자동차, 스마트폰, 배(조선)를 만들어 전 세계로 널리 수출하고 있어요!',
        reward: { resource: 'parts', amount: 3 }
      },
      {
        id: 'wt_007',
        subject: 'world_trade',
        difficulty: 2,
        question: '외국에서 들어오는 수입 물품에 나라가 세금을 붙여서, 우리 농부나 공장이 피해를 보지 않게 보호하는 세금은?',
        choices: ['관세', '주민세', '소득세', '고속도로 통행료'],
        answer: 0,
        explanation: '외국 물건이 너무 싸게 들어오면 우리 공장이나 농가가 힘들어질 수 있어서, 국가가 국경에서 매기는 세금을 "관세"라고 해요.',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'wt_008',
        subject: 'world_trade',
        difficulty: 2,
        question: '두 나라가 약속하여 관세(세금)를 없애거나 줄여서, 서로 물건을 더 자유롭고 편하게 사고팔기로 맺는 협정은?',
        choices: ['자유 무역 협정 (FTA)', '기후 협약', '평화 조약', '스포츠 교류 협약'],
        answer: 0,
        explanation: 'FTA(자유 무역 협정)를 맺으면 관세 장벽이 낮아져서 우리 물건을 상대국에 더 많이 팔고, 상대국 물건도 싸게 살 수 있어요.',
        reward: { resource: 'parts', amount: 4 }
      },
      {
        id: 'wt_009',
        subject: 'world_trade',
        difficulty: 2,
        question: '나라들 사이에 무역 규칙을 정하고, 억울한 무역 다툼이 생겼을 때 공정하게 재판관처럼 해결해 주는 국제기구는?',
        choices: ['세계무역기구 (WTO)', '국제축구연맹 (FIFA)', '유네스코', '세계기상기구'],
        answer: 0,
        explanation: 'WTO(세계무역기구)는 전 세계 나라들이 반칙 없이 공정하게 무역을 할 수 있도록 규칙을 세우고 분쟁을 조정해 줘요.',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'wt_010',
        subject: 'world_trade',
        difficulty: 2,
        question: '미국 여행을 갈 때 우리나라 돈 1,300원을 미국 돈 1달러로 바꾸는 것처럼, 두 나라 돈 사이의 맞교환 가격 비율을 무엇이라 할까요?',
        choices: ['환율', '이자율', '할인율', '시청률'],
        answer: 0,
        explanation: '다른 나라 돈과 우리 돈을 바꿀 때의 교환 비율을 "환율"이라고 해요. 환율이 오르내리면 수출과 수입 물건의 가격도 달라져요.',
        reward: { resource: 'knowledge', amount: 4 }
      },
      {
        id: 'wt_011',
        subject: 'world_trade',
        difficulty: 1,
        question: '무역을 하다가 두 나라 사이에 의견이 맞지 않아 다툼이 생겼을 때, 가장 지혜롭고 올바른 해결 방법은?',
        choices: ['국제 규칙을 지키며 대화와 협상으로 서로 양보한다', '상대국과 당장 전쟁을 벌인다', '상대국 대사관을 부순다', '무역을 영원히 중단한다'],
        answer: 0,
        explanation: '무역 갈등은 어느 한쪽의 고집만 부리지 않고, 국제 규범을 지키며 대화와 외교 협상으로 상호 이익을 찾는 것이 정답이에요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'wt_012',
        subject: 'world_trade',
        difficulty: 2,
        question: '가난한 나라의 카카오(초콜릿 원료) 농가 어린이들에게 힘든 일을 시키지 않고, 농부에게 정당한 가격을 주어 거래하는 착한 무역은?',
        choices: ['공정 무역 (Fair Trade)', '독점 무역', '몰래 무역', '바가지 무역'],
        answer: 0,
        explanation: '초콜릿이나 커피를 살 때 공정 무역 마크가 붙은 것을 사면, 가난한 나라의 농부들이 정당한 땀의 대가를 받아 아이들을 학교에 보낼 수 있어요!',
        reward: { resource: 'food', amount: 4 }
      },
      {
        id: 'wt_013',
        subject: 'world_trade',
        difficulty: 2,
        question: '기름이나 철광석 같은 원자재를 외국에서 사 와서, 우리 공장에서 멋진 자동차나 반도체로 만들어 수출하는 무역 형태는?',
        choices: ['가공무역', '농산물 단순 수출', '물물교환', '보관무역'],
        answer: 0,
        explanation: '우리나라는 땅속 자원이 부족하지만 뛰어난 두뇌와 기술을 발휘해 원자재를 가공해서 비싼 완제품으로 만들어 수출하는 "가공무역" 강국이에요.',
        reward: { resource: 'parts', amount: 4 }
      },
      {
        id: 'wt_014',
        subject: 'world_trade',
        difficulty: 1,
        question: '오늘날 지구촌 나라들은 무역으로 그물망처럼 촘촘히 연결되어 있어서, 서로 돕고 의지하며 살아가는 관계를 무엇이라 할까요?',
        choices: ['상호 의존 관계', '완전한 남남 관계', '적대적 관계', '고립된 관계'],
        answer: 0,
        explanation: '지금 세계는 한 나라의 원자재가 막히면 다른 나라의 공장이 멈출 정도로 끈끈하게 서로 의지하고 있어요. 이를 "상호 의존"이라고 해요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'wt_015',
        subject: 'world_trade',
        difficulty: 2,
        question: '공장에서 만드는 물건뿐만 아니라, K-팝 노래나 드라마, 애니메이션, 게임처럼 전 세계로 뻗어 나가는 인기 수출 상품은?',
        choices: ['문화 콘텐츠 수출 (한류)', '석탄 수출', '원목 수출', '모래 수출'],
        answer: 0,
        explanation: '한국의 음악, 춤, 영화, 웹툰 같은 문화 콘텐츠(한류)는 세계인들에게 큰 즐거움을 주며 자랑스럽게 수출되고 있어요!',
        reward: { resource: 'knowledge', amount: 4 }
      }
    ],

    // -------------------------------------------------------
    // 단원 4: 세계의 환경과 지구촌 사람들 (world_environment) — 15문항
    // -------------------------------------------------------
    world_environment: [
      {
        id: 'we_001',
        subject: 'world_environment',
        difficulty: 1,
        question: '적도 주변에 위치하여 일 년 내내 여름처럼 덥고 비가 자주 와서, 키 큰 나무들이 빽빽한 정글(밀림)이 있는 기후는?',
        choices: ['열대 기후', '한대 기후', '건조 기후', '빙설 기후'],
        answer: 0,
        explanation: '적도 근처는 햇볕을 많이 받아 일 년 내내 덥고 소나기(스콜)가 내려요. 그래서 아마존 같은 울창한 열대 우림이 만들어져요.',
        reward: { resource: 'wood', amount: 3 }
      },
      {
        id: 'we_002',
        subject: 'world_environment',
        difficulty: 1,
        question: '비가 거의 오지 않아 모래사막이 넓게 펼쳐져 있고, 낙타를 타고 오아시스 주변에서 물을 구하는 기후는?',
        choices: ['건조 기후', '온대 기후', '냉대 기후', '한대 기후'],
        answer: 0,
        explanation: '비가 너무 적게 내리는 건조 기후 지역에서는 물이 있는 오아시스 주변에 모여 살거나, 풀을 찾아 이동하는 유목 생활을 해요.',
        reward: { resource: 'ore', amount: 3 }
      },
      {
        id: 'we_003',
        subject: 'world_environment',
        difficulty: 1,
        question: '봄, 여름, 가을, 겨울 사계절의 변화가 뚜렷하고 날씨가 온화하여 농사짓기 좋고 사람이 살기 가장 편한 기후는?',
        choices: ['온대 기후', '북극 기후', '사하라 기후', '남극 기후'],
        answer: 0,
        explanation: '우리나라가 속한 기후가 바로 "온대 기후"예요! 덥지도 춥지도 않은 따뜻한 날씨 덕분에 벼농사가 잘되고 마을과 도시가 크게 발달했어요.',
        reward: { resource: 'food', amount: 3 }
      },
      {
        id: 'we_004',
        subject: 'world_environment',
        difficulty: 1,
        question: '겨울이 무척 길고 추워서 뾰족한 소나무와 전나무 같은 침엽수림(타이가 숲)이 끝없이 펼쳐진 기후는?',
        choices: ['냉대 기후', '열대 기후', '사막 기후', '열대 초원 기후'],
        answer: 0,
        explanation: '러시아 시베리아나 캐나다 같은 추운 북쪽 나라의 기후예요. 추위를 잘 견디는 침엽수들이 울창해서 세계적인 목재 생산지가 돼요.',
        reward: { resource: 'wood', amount: 3 }
      },
      {
        id: 'we_005',
        subject: 'world_environment',
        difficulty: 1,
        question: '북극이나 남극처럼 일 년 내내 얼음과 눈으로 꽁꽁 얼어붙어 있어서 큰 나무가 한 그루도 자라지 못하는 가장 추운 기후는?',
        choices: ['한대 기후', '온대 기후', '열대 기후', '지중해 기후'],
        answer: 0,
        explanation: '가장 따뜻한 여름에도 얼음이 잘 녹지 않는 몹시 추운 기후예요. 이끼가 조금 자라는 툰드라나 빙하 대지가 나타나요.',
        reward: { resource: 'water', amount: 3 }
      },
      {
        id: 'we_006',
        subject: 'world_environment',
        difficulty: 1,
        question: '지구의 6개 대륙 중에서 대한민국, 중국, 인도 등이 속해 있으며 전 세계 인구의 절반 이상이 모여 사는 가장 큰 대륙은?',
        choices: ['아시아', '유럽', '아프리카', '오세아니아'],
        answer: 0,
        explanation: '우리가 살고 있는 아시아 대륙은 땅도 가장 넓고, 따뜻한 날씨와 기름진 평야가 많아 세계에서 가장 많은 사람이 살고 있어요.',
        reward: { resource: 'food', amount: 3 }
      },
      {
        id: 'we_007',
        subject: 'world_environment',
        difficulty: 1,
        question: '화석 연료 매연 때문에 지구의 온도가 점점 올라가서 빙하가 녹고 이상한 폭염과 홍수가 자주 일어나는 환경 문제는?',
        choices: ['지구 온난화 (기후 위기)', '빙하기 도래', '오존층 확장', '화산 폭발'],
        answer: 0,
        explanation: '온실가스가 온실 지붕처럼 지구를 덮어 지구가 뜨거워지는 현상을 "지구 온난화"라고 해요. 북극곰의 얼음 집이 녹아내리고 있어요.',
        reward: { resource: 'research', amount: 3 }
      },
      {
        id: 'we_008',
        subject: 'world_environment',
        difficulty: 2,
        question: '자연을 마구 파괴하지 않고 아껴 써서, 우리 후손(미래 세대)들도 깨끗한 지구에서 풍요롭게 살 수 있도록 하는 발전은?',
        choices: ['지속 가능한 발전', '자연 마구 파괴하기', '오늘만 살기 식 개발', '쓰레기 묻어두기'],
        answer: 0,
        explanation: '지금 우리가 쓰고 있는 맑은 물과 숲은 우리 것만이 아니에요. 미래에 태어날 아이들을 위해 아껴 쓰며 발전하는 것을 "지속 가능한 발전"이라고 해요.',
        reward: { resource: 'research', amount: 4 }
      },
      {
        id: 'we_009',
        subject: 'world_environment',
        difficulty: 2,
        question: '가난을 없애고, 모든 어린이가 학교에 가며, 지구 환경을 지키기 위해 유엔(UN)이 2030년까지 정해둔 17가지 약속은?',
        choices: ['지속가능발전목표 (SDGs)', '올림픽 종목 규칙', '세계 여행 계획표', '학교 시간표'],
        answer: 0,
        explanation: 'SDGs는 전 세계 사람들이 다 함께 힘을 모아 더 평화롭고 깨끗한 세상을 만들기 위해 정한 17개의 소중한 목표예요.',
        reward: { resource: 'research', amount: 4 }
      },
      {
        id: 'we_010',
        subject: 'world_environment',
        difficulty: 1,
        question: '전쟁을 막고 세계 평화를 지키며, 굶주린 이웃을 돕기 위해 전 세계 나라들이 모여 만든 가장 큰 국제기구는?',
        choices: ['국제연합 (UN)', '놀이공원 협회', '세계 만화가 협회', '동네 주민자치회'],
        answer: 0,
        explanation: '1945년에 만들어진 국제연합(UN)은 전 세계 거의 모든 나라가 모여 전쟁을 방지하고 인권과 평화를 지키는 지구촌의 본부예요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'we_011',
        subject: 'world_environment',
        difficulty: 1,
        question: '국경 없는 의사회나 그린피스처럼 정부가 아니면서도 지구 환경과 다친 사람들을 구하기 위해 자발적으로 일하는 단체는?',
        choices: ['비정부 기구 (NGO)', '영리 회사', '정부 부처', '은행'],
        answer: 0,
        explanation: '시민들이 자발적으로 모여 돈벌이가 아니라 공익과 봉사를 위해 활동하는 단체를 "비정부 기구(NGO)"라고 불러요.',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'we_012',
        subject: 'world_environment',
        difficulty: 1,
        question: '초등학생인 우리가 교실과 가정에서 지구 온난화를 막기 위해 실천할 수 있는 가장 훌륭한 행동은?',
        choices: ['사용하지 않는 방 전등 끄기와 플러그 뽑기', '양치할 때 수돗물 계속 틀어놓기', '가까운 놀이터도 자동차 타고 가기', '음식 많이 남기기'],
        answer: 0,
        explanation: '안 쓰는 전등 끄기, 텀블러 쓰기, 음식 남기지 않기, 가까운 길 걷기 등 우리 작은 실천이 지구의 온도를 낮춰줘요!',
        reward: { resource: 'research', amount: 3 }
      },
      {
        id: 'we_013',
        subject: 'world_environment',
        difficulty: 2,
        question: '지구 온난화로 바닷물이 불어나 섬 전체가 물에 잠길 위기에 처해 있는 태평양의 아름다운 산호초 섬나라는?',
        choices: ['투발루', '몽골', '스위스', '네팔'],
        answer: 0,
        explanation: '남태평양의 투발루는 해수면이 점점 높아져 집과 학교가 물에 잠기고 있어요. 기후 위기가 얼마나 심각한지 전 세계에 알리고 있답니다.',
        reward: { resource: 'water', amount: 4 }
      },
      {
        id: 'we_014',
        subject: 'world_environment',
        difficulty: 1,
        question: '우리나라 국민일 뿐만 아니라, 지구촌의 아픔과 환경 문제에 관심을 갖고 이웃을 도우려는 책임감 있는 어린이를 뜻하는 말은?',
        choices: ['세계 시민', '외국인 관광객', '욕심꾸러기', '나 몰라라 구경꾼'],
        answer: 0,
        explanation: '국경을 넘어 인류의 평화와 지구의 미래를 함께 고민하고 행동하는 멋진 사람을 "세계 시민"이라고 불러요. 우리 모두 세계 시민이에요!',
        reward: { resource: 'knowledge', amount: 3 }
      },
      {
        id: 'we_015',
        subject: 'world_environment',
        difficulty: 2,
        question: '매연을 뿜는 석탄이나 기름 대신, 따스한 햇빛(태양광)이나 시원한 바람(풍력)으로 전기를 만드는 친환경 에너지는?',
        choices: ['신재생 에너지', '화석 연료', '연탄', '디젤 기름'],
        answer: 0,
        explanation: '햇빛, 바람, 물 등 자연의 깨끗한 힘으로 만드는 에너지를 "신재생 에너지"라고 해요. 공기를 오염시키지 않는 미래의 착한 에너지예요!',
        reward: { resource: 'energy', amount: 4 }
      }
    ]
  },

  // =========================================================
  // 2. TILES — 6-2 사회과 탐험 타일 데이터
  // =========================================================
  tiles: {
    ruins: {
      emoji: '🏭',
      name: '산업·경제 개발지',
      subject: 'economic_growth',
      baseReward: { resource: 'parts', amount: 3 },
      color: '#5c677d',
      description: '우리나라의 눈부신 경제 성장 역사와 산업 발전의 현장입니다.'
    },
    forest: {
      emoji: '🌿',
      name: '지속가능 생태 구역',
      subject: 'world_environment',
      baseReward: { resource: 'wood', amount: 3 },
      color: '#2d6a4f',
      description: '세계의 다양한 자연환경과 지구촌 기후 위기 대응을 학습하는 생태 기지입니다.'
    },
    farmland: {
      emoji: '🏪',
      name: '시장경제 교역터',
      subject: 'market_economy',
      baseReward: { resource: 'food', amount: 3 },
      color: '#b08968',
      description: '가계와 기업이 만나 자유롭게 상품을 거래하고 합리적 선택을 배우는 시장입니다.'
    },
    river: {
      emoji: '🚢',
      name: '글로벌 무역 항만',
      subject: 'world_trade',
      baseReward: { resource: 'water', amount: 3 },
      color: '#1d3557',
      description: '세계 여러 나라와 자원 및 첨단 제품을 교역하는 국제 무역 항구입니다.'
    },
    mountain: {
      emoji: '⛰️',
      name: '지하자원 채굴 광산',
      subject: 'world_trade',
      baseReward: { resource: 'ore', amount: 2 },
      color: '#495057',
      description: '국제 무역에 필요한 핵심 광물과 원자재를 탐사하는 광산 지역입니다.'
    },
    ancientLibrary: {
      emoji: '📚',
      name: '경제·지혜 아카데미',
      subject: 'mixed',
      baseReward: { resource: 'knowledge', amount: 5 },
      color: '#6f2dbd',
      description: '시장경제, 경제발전, 국제 무역의 모든 원리를 탐구하는 지혜의 전당입니다.'
    },
    lab: {
      emoji: '🔬',
      name: '신산업 R&D 연구소',
      subject: 'economic_growth',
      baseReward: { resource: 'research', amount: 4 },
      color: '#0077b6',
      description: '반도체, 친환경 미래차 등 첨단 수출 기술과 지속가능 경제를 연구합니다.'
    },
    school: {
      emoji: '🏫',
      name: '초등 6학년 사회 탐구터',
      subject: 'mixed',
      baseReward: { resource: 'knowledge', amount: 4 },
      color: '#3a86ff',
      description: '6학년 2학기 사회과 핵심 개념을 배우고 힌트를 얻을 수 있는 학교입니다.'
    },
    headquarters: {
      emoji: '🏛️',
      name: '경제 본부 (중심 타운)',
      subject: null,
      baseReward: null,
      color: '#d4a373',
      description: '합리적인 자원 배분과 미래 번영을 계획하는 생존자들의 중심 거점입니다.'
    }
  },

  // =========================================================
  // 3. BUILDINGS — 건물 시스템
  // =========================================================
  buildings: {
    shelter: {
      id: 'shelter',
      emoji: '🏠',
      name: '경제 자립 쉘터',
      description: '생존자 가족들의 따뜻한 보금자리. 업그레이드하면 더 많은 인원을 수용합니다.',
      maxLevel: 5,
      costs: [
        { wood: 10 },
        { wood: 20, food: 10 },
        { wood: 30, food: 20, parts: 10 },
        { wood: 50, food: 30, parts: 20 },
        { wood: 80, food: 50, parts: 30, knowledge: 20 }
      ],
      effects: [
        '생존자 +2명 수용',
        '생존자 +4명 수용',
        '생존자 +6명 수용',
        '생존자 +8명 수용',
        '생존자 +10명 수용 + 매 턴 지식 +1'
      ],
      educationalFact: '가계(가정)는 회사에서 일해 번 돈으로 물건을 사며 생활하는 가장 기본적이고 따뜻한 경제 단위예요.'
    },
    farm: {
      id: 'farm',
      emoji: '🌾',
      name: '스마트 친환경 농장',
      description: '생산성을 높여 안정적인 식량을 공급합니다. 3턴마다 식량이 생산됩니다.',
      maxLevel: 5,
      costs: [
        { wood: 8, water: 5 },
        { wood: 15, water: 10, parts: 5 },
        { wood: 25, water: 20, parts: 10 },
        { wood: 40, water: 30, parts: 15, knowledge: 10 },
        { wood: 60, water: 50, parts: 20, knowledge: 20, research: 5 }
      ],
      effects: [
        '매 턴 식량 +3',
        '매 턴 식량 +6',
        '매 턴 식량 +10',
        '매 턴 식량 +15',
        '매 턴 식량 +20 + 물 소비 -20%'
      ],
      educationalFact: '농업은 우리가 매일 먹는 밥과 반찬을 만들어 주는 소중한 산업이에요. 요즘은 컴퓨터와 결합한 스마트팜으로 진화하고 있어요!'
    },
    library: {
      id: 'library',
      emoji: '📖',
      name: '경제 금융 도서관',
      description: '합리적인 경제 선택과 지식을 보존합니다. 퀴즈 정답 시 지식 보상이 대폭 증가합니다.',
      maxLevel: 5,
      costs: [
        { wood: 15, parts: 5 },
        { wood: 25, parts: 10, knowledge: 5 },
        { wood: 40, parts: 20, knowledge: 15 },
        { wood: 60, parts: 30, knowledge: 30, research: 10 },
        { wood: 100, parts: 50, knowledge: 50, research: 20 }
      ],
      effects: [
        '퀴즈 지식 보상 +10%',
        '퀴즈 지식 보상 +20% + 매 턴 지식 +1',
        '퀴즈 지식 보상 +30% + 매 턴 지식 +2',
        '퀴즈 지식 보상 +50% + 매 턴 지식 +3',
        '퀴즈 지식 보상 +75% + 매 턴 지식 +5 + 오답 힌트 제공'
      ],
      educationalFact: '용돈 기입장을 쓰고 저축과 투자의 원리를 배우면 어른이 되어서도 현명하게 부를 쌓을 수 있어요!'
    },
    workshop: {
      id: 'workshop',
      emoji: '🔧',
      name: '수출 가공 공작소',
      description: '부품과 제품을 제조하여 산업 생산력을 높입니다. 자원 수집 효율이 증가합니다.',
      maxLevel: 5,
      costs: [
        { wood: 12, parts: 8 },
        { wood: 20, parts: 15, ore: 5 },
        { wood: 35, parts: 25, ore: 15 },
        { wood: 55, parts: 40, ore: 25, energy: 5 },
        { wood: 90, parts: 60, ore: 40, energy: 15, knowledge: 15 }
      ],
      effects: [
        '자원 수집량 +10%',
        '자원 수집량 +20% + 부품 생산 +1/턴',
        '자원 수집량 +30% + 부품 생산 +2/턴',
        '자원 수집량 +40% + 부품 생산 +3/턴',
        '자원 수집량 +50% + 부품 생산 +5/턴 + 광석→부품 변환 가능'
      ],
      educationalFact: '대한민국은 외국에서 원자재를 수입해 멋진 완제품으로 만들어 수출하는 가공무역으로 세계적인 부강한 나라가 되었어요.'
    },
    school: {
      id: 'school',
      emoji: '🏫',
      name: '사회 경제 학교',
      description: '시장경제 원리와 공정한 무역을 교육합니다. 퀴즈에서 오답 1개를 자동으로 지워줍니다.',
      maxLevel: 5,
      costs: [
        { wood: 20, knowledge: 10 },
        { wood: 35, knowledge: 20, parts: 10 },
        { wood: 55, knowledge: 35, parts: 20 },
        { wood: 80, knowledge: 55, parts: 30, research: 15 },
        { wood: 120, knowledge: 80, parts: 45, research: 25 }
      ],
      effects: [
        '오답 1개 제거 (힌트 기능)',
        '오답 1개 제거 + 매 턴 지식 +2',
        '오답 1개 제거 + 정답 시 보너스 자원',
        '오답 1개 제거 + 모든 과목 지식 획득량 +15%',
        '오답 1개 제거 + 매 턴 지식 +5 + 모든 생존자 행복도 최대'
      ],
      educationalFact: '일하는 사람의 권리와 회사의 사회적 책임을 배우면 모두가 존중받는 따뜻한 경제를 만들 수 있어요.'
    },
    lab: {
      id: 'lab',
      emoji: '🔬',
      name: '첨단 산업 기술 연구소',
      description: '반도체, 배터리 등 미래 신성장 동력을 연구합니다. 고난도(⭐3) 퀴즈를 해금합니다.',
      maxLevel: 5,
      costs: [
        { parts: 15, research: 10 },
        { parts: 25, research: 20, ore: 10 },
        { parts: 40, research: 35, ore: 20, energy: 5 },
        { parts: 60, research: 55, ore: 30, energy: 15 },
        { parts: 100, research: 80, ore: 50, energy: 30, knowledge: 30 }
      ],
      effects: [
        '고급 퀴즈(난이도 3) 해금',
        '고급 퀴즈 해금 + 매 턴 연구 +2',
        '고급 퀴즈 해금 + 에너지 생산 +1/턴',
        '고급 퀴즈 해금 + 연구/에너지 생산 +50%',
        '모든 연구 비용 30% 감소 + 매 턴 연구 +5 + 에너지 +3'
      ],
      educationalFact: '과학기술 연구개발(R&D) 투자는 반도체, 스마트폰, 로봇처럼 세계를 깜짝 놀라게 할 물건을 만드는 힘이에요!'
    },
    medBay: {
      id: 'medBay',
      emoji: '🏥',
      name: '사회 보장 의료 센터',
      description: '국민건강보험처럼 생존자들의 건강을 보살피고 치료 혜택을 줍니다.',
      maxLevel: 5,
      costs: [
        { food: 10, water: 10, parts: 5 },
        { food: 20, water: 20, parts: 10 },
        { food: 35, water: 35, parts: 20, research: 10 },
        { food: 55, water: 55, parts: 30, research: 20 },
        { food: 80, water: 80, parts: 45, research: 35, knowledge: 20 }
      ],
      effects: [
        '생존자 건강 관리 지원',
        '생존자 능률 +10%',
        '생존자 능률 +20%',
        '생존자 능률 +30% + 지식 보너스',
        '완전한 복지 체계 완성 + 생존자 능률 +50%'
      ],
      educationalFact: '사회 보장 제도는 아프거나 어려운 국민을 위해 나라가 든든한 우산이 되어주는 제도예요.'
    },
    tower: {
      id: 'tower',
      emoji: '📡',
      name: '글로벌 무역 통신 타워',
      description: '전 세계 무역 시장과 실시간으로 환율과 시세를 교환하며 탐사 영역을 넓힙니다.',
      maxLevel: 5,
      costs: [
        { parts: 20, ore: 10 },
        { parts: 35, ore: 20, energy: 5 },
        { parts: 55, ore: 30, energy: 15, research: 10 },
        { parts: 80, ore: 50, energy: 25, research: 20, knowledge: 20 },
        { parts: 120, ore: 75, energy: 40, research: 35, knowledge: 40 }
      ],
      effects: [
        '탐색 범위 +1칸 + 지도 안개 제거',
        '탐색 범위 +2칸 + 타일 정보 미리 확인',
        '탐색 범위 +3칸 + 이벤트 조기 경보',
        '탐색 범위 +5칸 + 자원 풍부 지역 감지',
        '전체 지도 공개 + 매 턴 지식 +3 + 모든 방향 탐색'
      ],
      educationalFact: '인공위성과 인터넷 덕분에 우리는 방 안에서도 미국이나 유럽에 있는 물건을 클릭 한 번으로 살 수 있게 되었어요!'
    }
  },

  // =========================================================
  // 4. RESOURCES — 자원 데이터
  // =========================================================
  resources: {
    food: {
      emoji: '🍎',
      name: '식량',
      description: '가계의 소비와 생존에 꼭 필요한 기본 음식입니다.',
      baseProductionPerTurn: 0,
      color: '#e74c3c'
    },
    wood: {
      emoji: '🪵',
      name: '목재',
      description: '생산 시설을 짓는 데 필요한 나무 자재입니다.',
      baseProductionPerTurn: 0,
      color: '#8b4513'
    },
    parts: {
      emoji: '⚙️',
      name: '부품',
      description: '기계와 공장을 돌리기 위한 산업용 부품입니다.',
      baseProductionPerTurn: 0,
      color: '#7f8c8d'
    },
    knowledge: {
      emoji: '📚',
      name: '지식',
      description: '경제 퀴즈를 풀고 문명을 발전시키는 지적 자본입니다.',
      baseProductionPerTurn: 0,
      color: '#9b59b6'
    },
    water: {
      emoji: '💧',
      name: '물',
      description: '생명 유지와 배가 다니는 데 필요한 기본 자원입니다.',
      baseProductionPerTurn: 0,
      color: '#3498db'
    },
    research: {
      emoji: '🔬',
      name: '연구',
      description: '더 좋은 제품을 만들기 위한 과학기술 혁신 힘입니다.',
      baseProductionPerTurn: 0,
      color: '#1abc9c'
    },
    ore: {
      emoji: '🪨',
      name: '광석',
      description: '철과 배터리를 만드는 데 꼭 필요한 지하자원입니다.',
      baseProductionPerTurn: 0,
      color: '#e67e22'
    },
    energy: {
      emoji: '⚡',
      name: '에너지',
      description: '공장을 움직이고 불을 밝히는 친환경 전기 에너지입니다.',
      baseProductionPerTurn: 0,
      color: '#f1c40f'
    }
  },

  // =========================================================
  // 5. BIOMES — 세계 기후 바이옴
  // =========================================================
  biomes: {
    temperate: {
      id: 'temperate',
      name: '온대 기후 산업 지대',
      emoji: '🌳',
      description: '사계절이 뚜렷하고 따뜻하여 공장과 도시가 번창하는 살기 좋은 곳입니다.',
      tileWeights: { farmland: 30, forest: 30, river: 20, ruins: 10, school: 5, ancientLibrary: 5 },
      resourceModifiers: { food: 1.3, wood: 1.2, water: 1.0, ore: 0.8 },
      color: '#4a7a4a',
      educationalFact: '대한민국처럼 따뜻한 온대 기후 지역은 농사도 잘되고 첨단 공업 도시가 발달하기에 최적이에요.'
    },
    arid: {
      id: 'arid',
      name: '건조 기후 자원 지대',
      emoji: '🏜️',
      description: '사막 아래에 귀한 석유 자원이 묻혀 있는 에너지 무역 중심지입니다.',
      tileWeights: { ruins: 35, mountain: 30, farmland: 10, river: 5, lab: 10, ancientLibrary: 10 },
      resourceModifiers: { food: 0.7, wood: 0.5, water: 0.4, ore: 1.5 },
      color: '#a87a3a',
      educationalFact: '중동 사막 지역은 물이 부족하지만 땅속에 석유가 풍부해서 세계 여러 나라와 활발히 무역해요.'
    },
    boreal: {
      id: 'boreal',
      name: '냉·한대 삼림 지대',
      emoji: '❄️',
      description: '소나무와 침엽수가 가득한 시원하고 추운 원목 생산지입니다.',
      tileWeights: { forest: 40, mountain: 25, river: 15, ruins: 10, lab: 5, school: 5 },
      resourceModifiers: { food: 0.6, wood: 1.6, water: 1.2, ore: 1.3 },
      color: '#3a5a7a',
      educationalFact: '시베리아 같은 추운 북쪽 지역에는 타이가 침엽수림이 끝없이 펼쳐져 목재를 많이 생산해요.'
    },
    coastal: {
      id: 'coastal',
      name: '해양 무역 물류 지대',
      emoji: '🌊',
      description: '커다란 컨테이너 화물선이 오가며 세계 각국과 물건을 교역하는 항구입니다.',
      tileWeights: { river: 35, farmland: 20, ruins: 20, forest: 10, school: 10, ancientLibrary: 5 },
      resourceModifiers: { food: 1.4, wood: 0.9, water: 1.5, ore: 0.9 },
      color: '#2a6a8a',
      educationalFact: '부산항처럼 큰 항만은 우리 제품을 싣고 나가고 외국 자원을 들여오는 세계 무역의 관문이에요.'
    }
  },

  // =========================================================
  // 6. SUBJECTS — 초등 6-2 사회 학습 영역 메타데이터
  // =========================================================
  subjects: {
    market_economy:     { label: '1. 시장경제와 가계·기업', emoji: '🏪', color: '#f0a500' },
    economic_growth:    { label: '2. 경제성장과 우리 생활', emoji: '📈', color: '#4ecca3' },
    world_trade:        { label: '3. 국가 간 거래와 무역',   emoji: '🚢', color: '#4ab4ff' },
    world_environment:  { label: '4. 세계 환경과 지구촌',   emoji: '🌿', color: '#7ec850' },
    mixed:              { label: '전체 단원 통합 복습',       emoji: '📚', color: '#cc88ff' }
  }
};

// =========================================================
// DATA NORMALIZATION PATCH
// =========================================================
(function normalizeGameData() {
  for (const subjectQuestions of Object.values(GAME_DATA.questions)) {
    for (const q of subjectQuestions) {
      if (q.answerIndex === undefined && q.answer !== undefined) {
        q.answerIndex = q.answer;
      }
      if (!q.rewards && q.reward) {
        const r = q.reward;
        q.rewards = { [r.resource]: r.amount };
      }
    }
  }
  for (const tile of Object.values(GAME_DATA.tiles)) {
    if (!tile.rewards && tile.baseReward) {
      const r = tile.baseReward;
      tile.rewards = { [r.resource]: r.amount };
    }
  }
  console.log('[EduTiles 6-2 사회 눈높이 개편] GAME_DATA 로드 완료. 총 문제 수:', 
    Object.values(GAME_DATA.questions).reduce((s, a) => s + a.length, 0));
})();

// =========================================================
// CommonJS 호환 내보내기 (테스트 환경용)
// =========================================================
if (typeof module !== 'undefined') module.exports = GAME_DATA;
