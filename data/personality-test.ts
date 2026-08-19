import { TestQuestion } from "../lib/personality-test";

export const personalityTest: TestQuestion[] = [
  {
    no: 1,
    question: "对象突然半小时没回微信，你的第一反应是：",
    answerOptions: [
      { type: "A", answer: "在忙吧，刚好我也做自己的事（独立松弛型）", score: "E" },
      { type: "B", answer: "开始胡思乱想，反复刷新聊天框（粘人敏感型）", score: "I" },
    ],
  },
  {
    no: 2,
    question: "周末你更希望和另一半怎么度过：",
    answerOptions: [
      { type: "A", answer: "一起去打卡热门网红餐厅、户外市集（外向探索型）", score: "E" },
      { type: "B", answer: "窝在家里看电影、点外卖，享受两人世界（内向享受型）", score: "I" },
    ],
  },
  {
    no: 3,
    question: "在恋爱中出现分歧冲突时，你的处理方式通常是：",
    answerOptions: [
      { type: "A", answer: "讲逻辑摆事实，必须当场把道理说清楚（理智客观型）", score: "T" },
      { type: "B", answer: "更关注对方情绪与语气，希望被哄被抱抱（情感偏向型）", score: "F" },
    ],
  },
  {
    no: 4,
    question: "关于未来的恋爱与婚姻计划，你倾向于：",
    answerOptions: [
      { type: "A", answer: "有清晰的时间表和规划，喜欢一切尽在掌握（掌控计划型）", score: "J" },
      { type: "B", answer: "随遇而安，走一步看一步，顺其自然（随性自由型）", score: "P" },
    ],
  },
  {
    no: 5,
    question: "当你对另一半产生不满时，你会：",
    answerOptions: [
      { type: "A", answer: "直接明确表达自己的需求和边界（直球沟通型）", score: "E" },
      { type: "B", answer: "默默憋在心里看对方能不能发现（傲娇内敛型）", score: "I" },
    ],
  },
  {
    no: 6,
    question: "收到对方送的礼物但其实不是很喜欢，你的反应是：",
    answerOptions: [
      { type: "A", answer: "依然夸赞心意，照顾对方感受（高情商顾虑型）", score: "F" },
      { type: "B", answer: "礼貌感谢，但会真诚建议下次买什么（实用主义型）", score: "T" },
    ],
  },
  {
    no: 7,
    question: "如果恋爱中遇到冷战，你通常会：",
    answerOptions: [
      { type: "A", answer: "受不了压抑气氛，主动找话题打破僵局（主动破冰型）", score: "E" },
      { type: "B", answer: "开启自我防御模式，比对方更冷淡（高冷防御型）", score: "I" },
    ],
  },
  {
    no: 8,
    question: "你认为好的恋爱关系最不可或缺的是：",
    answerOptions: [
      { type: "A", answer: "三观一致、能进行深度灵魂共鸣（精神契合型）", score: "N" },
      { type: "B", answer: "细节落地、踏实陪伴与物质安全感（现实稳定型）", score: "S" },
    ],
  },
  {
    no: 9,
    question: "对于恋爱中的私人空间和隐私，你的态度是：",
    answerOptions: [
      { type: "A", answer: "需要独立边界，给彼此足够的私人时间（独立边界型）", score: "I" },
      { type: "B", answer: "希望无保留分享，随时想联系对方（全情陪伴型）", score: "E" },
    ],
  },
  {
    no: 10,
    question: "约会时突然遇到突发状况（如餐厅关门），你的反应是：",
    answerOptions: [
      { type: "A", answer: "迅速寻找备选方案，冷静解决问题（果断冷静型）", score: "T" },
      { type: "B", answer: "当作意外的小惊喜，开启临时探险（浪漫随性型）", score: "P" },
    ],
  },
  {
    no: 11,
    question: "面对吃醋场景，你呈现出的状态更像是：",
    answerOptions: [
      { type: "A", answer: "小霸王护食，大方表达占有欲（炽热霸道型）", score: "E" },
      { type: "B", answer: "表面云淡风轻，内心疯狂吃醋生闷气（傲娇吃醋型）", score: "I" },
    ],
  },
  {
    no: 12,
    question: "理想中你最心动的伴侣类型是：",
    answerOptions: [
      { type: "A", answer: "阳光开朗大狗狗，提供满满情绪价值（情绪充沛型）", score: "F" },
      { type: "B", answer: "成熟稳重智商高，关键时刻靠得住（情绪稳定型）", score: "T" },
    ],
  },
  {
    no: 13,
    question: "当你生病发烧时，你更希望另一半做的是：",
    answerOptions: [
      { type: "A", answer: "立刻带着药和热粥奔赴到身边（行动落地型）", score: "S" },
      { type: "B", answer: "温柔开导、讲故事陪伴安慰情绪（情绪陪伴型）", score: "N" },
    ],
  },
  {
    no: 14,
    question: "在恋爱消费与金钱观上，你更认同：",
    answerOptions: [
      { type: "A", answer: "精打细算，为两人未来的小家庭存钱（长远规划型）", score: "J" },
      { type: "B", answer: "及时行乐，愿为当下的浪漫快乐买单（享乐即时型）", score: "P" },
    ],
  },
  {
    no: 15,
    question: "去参加朋友聚会时，你倾向于：",
    answerOptions: [
      { type: "A", answer: "热衷带上对象介绍给身边所有人（晒恩爱社交型）", score: "E" },
      { type: "B", answer: "更喜欢给彼此保留独立的圈子（圈子独立型）", score: "I" },
    ],
  },
  {
    no: 16,
    question: "关于过往的前任历史，你的态度是：",
    answerOptions: [
      { type: "A", answer: "翻篇即彻底清零，绝不再有任何瓜葛（干净利落型）", score: "T" },
      { type: "B", answer: "偶尔感伤，但不影响当下的感情（感性念旧型）", score: "F" },
    ],
  },
  {
    no: 17,
    question: "恋爱纪念日或恋爱节日的仪式感：",
    answerOptions: [
      { type: "A", answer: "必须精心准备，仪式感是感情的保鲜剂（仪式感至上）", score: "J" },
      { type: "B", answer: "简简单单即可，陪伴比形式更重要（务实陪伴型）", score: "P" },
    ],
  },
  {
    no: 18,
    question: "当两人吵架陷入僵局，你心中的底线是：",
    answerOptions: [
      { type: "A", answer: "无论谁对谁错，男/女方必须先低头服软（情绪被呵护）", score: "F" },
      { type: "B", answer: "看谁逻辑站得住脚，客观谁错谁道歉（原则原则型）", score: "T" },
    ],
  },
  {
    no: 19,
    question: "对方精心做了一顿饭但味道非常难吃，你会：",
    answerOptions: [
      { type: "A", answer: "笑着吃完并大加赞赏辛苦付出（情绪高情商）", score: "F" },
      { type: "B", answer: "肯定心意，但坦诚指出咸淡并提改进（真实坦诚型）", score: "T" },
    ],
  },
  {
    no: 20,
    question: "如果有人公开向你的另一半示好，你会：",
    answerOptions: [
      { type: "A", answer: "宣示主权，霸气挡在对方身前（宣示主权型）", score: "E" },
      { type: "B", answer: "静观其变，看伴侣如何自行处理（信任观察型）", score: "I" },
    ],
  },
  {
    no: 21,
    question: "面临事业/学业发展与陪伴恋人的冲突时，你会：",
    answerOptions: [
      { type: "A", answer: "优先事业个人成长，面包是一切的基础（理智成长型）", score: "T" },
      { type: "B", answer: "优先考虑感情与陪伴，爱高于一切（爱至上型）", score: "F" },
    ],
  },
  {
    no: 22,
    question: "对于恋爱中“看对方手机”这件事：",
    answerOptions: [
      { type: "A", answer: "坦坦荡荡可以互看，没有不可告人的秘密（坦诚透明型）", score: "S" },
      { type: "B", answer: "互相信任尊重隐私，绝对不看对方手机（尊重边界型）", score: "N" },
    ],
  },
  {
    no: 23,
    question: "理想中求婚或重大仪式场景：",
    answerOptions: [
      { type: "A", answer: "亲朋好友齐聚的浩大浪漫现场（瞩目浪漫型）", score: "E" },
      { type: "B", answer: "只有两个人的私密温馨时刻（私密真挚型）", score: "I" },
    ],
  },
  {
    no: 24,
    question: "你对“灵魂伴侣 (Soulmate)”的理解更偏向：",
    answerOptions: [
      { type: "A", answer: "命中注定的心灵默契与神奇吸引（宿命吸引型）", score: "N" },
      { type: "B", answer: "漫长时光中互相磨合经营出来的默契（磨合成长型）", score: "S" },
    ],
  },
];
