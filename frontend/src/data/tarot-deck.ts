// Rider-Waite Major Arcana (22 cards)
// Image filenames follow: https://sacred-texts.com/tarot/ naming convention
// Local files stored in /public/cards/

export interface TarotCard {
  id: number
  name: string
  nameCn: string
  arcana: 'major'
  image: string // filename in /public/cards/
  uprightKeywords: string[]
  reversedKeywords: string[]
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    nameCn: '愚者',
    arcana: 'major',
    image: 'rw_the_fool.svg',
    uprightKeywords: ['新开始', '冒险', '自由', '天真'],
    reversedKeywords: ['鲁莽', '冒失', '不成熟'],
  },
  {
    id: 1,
    name: 'The Magician',
    nameCn: '魔术师',
    arcana: 'major',
    image: 'rw_the_magician.svg',
    uprightKeywords: ['意志力', '技能', '专注', '创造'],
    reversedKeywords: ['欺骗', '操控', '能力未发挥'],
  },
  {
    id: 2,
    name: 'The High Priestess',
    nameCn: '女祭司',
    arcana: 'major',
    image: 'rw_the_high_priestess.svg',
    uprightKeywords: ['直觉', '神秘', '内在知识', '潜意识'],
    reversedKeywords: ['隐藏的秘密', '压抑直觉', '混乱'],
  },
  {
    id: 3,
    name: 'The Empress',
    nameCn: '女皇',
    arcana: 'major',
    image: 'rw_the_empress.svg',
    uprightKeywords: ['丰盛', '母性', '创造力', '自然'],
    reversedKeywords: ['依赖', '创意阻塞', '贫乏'],
  },
  {
    id: 4,
    name: 'The Emperor',
    nameCn: '皇帝',
    arcana: 'major',
    image: 'rw_the_emperor.svg',
    uprightKeywords: ['权威', '结构', '稳定', '控制'],
    reversedKeywords: ['专制', '刚愎', '缺乏纪律'],
  },
  {
    id: 5,
    name: 'The Hierophant',
    nameCn: '教皇',
    arcana: 'major',
    image: 'rw_the_hierophant.svg',
    uprightKeywords: ['传统', '信仰', '导师', '制度'],
    reversedKeywords: ['叛逆', '颠覆', '新思想'],
  },
  {
    id: 6,
    name: 'The Lovers',
    nameCn: '恋人',
    arcana: 'major',
    image: 'rw_the_lovers.svg',
    uprightKeywords: ['爱情', '选择', '和谐', '价值观'],
    reversedKeywords: ['不和谐', '价值冲突', '犹豫'],
  },
  {
    id: 7,
    name: 'The Chariot',
    nameCn: '战车',
    arcana: 'major',
    image: 'rw_the_chariot.svg',
    uprightKeywords: ['意志', '控制', '胜利', '前进'],
    reversedKeywords: ['失控', '侵略', '阻碍'],
  },
  {
    id: 8,
    name: 'Strength',
    nameCn: '力量',
    arcana: 'major',
    image: 'rw_strength.svg',
    uprightKeywords: ['勇气', '耐心', '内在力量', '自我控制'],
    reversedKeywords: ['软弱', '不安', '缺乏信心'],
  },
  {
    id: 9,
    name: 'The Hermit',
    nameCn: '隐士',
    arcana: 'major',
    image: 'rw_the_hermit.svg',
    uprightKeywords: ['内省', '孤独', '指引', '智慧'],
    reversedKeywords: ['孤立', '迷失', '拒绝帮助'],
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameCn: '命运之轮',
    arcana: 'major',
    image: 'rw_wheel_of_fortune.svg',
    uprightKeywords: ['转变', '命运', '好运', '周期'],
    reversedKeywords: ['厄运', '抗拒变化', '失控'],
  },
  {
    id: 11,
    name: 'Justice',
    nameCn: '正义',
    arcana: 'major',
    image: 'rw_justice.svg',
    uprightKeywords: ['公正', '真理', '因果', '诚实'],
    reversedKeywords: ['不公正', '不诚实', '逃避责任'],
  },
  {
    id: 12,
    name: 'The Hanged Man',
    nameCn: '倒吊人',
    arcana: 'major',
    image: 'rw_the_hanged_man.svg',
    uprightKeywords: ['暂停', '放手', '新视角', '牺牲'],
    reversedKeywords: ['拖延', '抗拒', '无谓牺牲'],
  },
  {
    id: 13,
    name: 'Death',
    nameCn: '死神',
    arcana: 'major',
    image: 'rw_death.svg',
    uprightKeywords: ['转化', '结束', '过渡', '蜕变'],
    reversedKeywords: ['抗拒变化', '停滞', '腐朽'],
  },
  {
    id: 14,
    name: 'Temperance',
    nameCn: '节制',
    arcana: 'major',
    image: 'rw_temperance.svg',
    uprightKeywords: ['平衡', '耐心', '调和', '适度'],
    reversedKeywords: ['不平衡', '过度', '冲突'],
  },
  {
    id: 15,
    name: 'The Devil',
    nameCn: '恶魔',
    arcana: 'major',
    image: 'rw_the_devil.svg',
    uprightKeywords: ['束缚', '依附', '阴影', '物欲'],
    reversedKeywords: ['解脱', '自由', '觉醒'],
  },
  {
    id: 16,
    name: 'The Tower',
    nameCn: '塔',
    arcana: 'major',
    image: 'rw_the_tower.svg',
    uprightKeywords: ['突变', '颠覆', '启示', '混乱'],
    reversedKeywords: ['避免灾难', '缓慢变化', '恐惧'],
  },
  {
    id: 17,
    name: 'The Star',
    nameCn: '星星',
    arcana: 'major',
    image: 'rw_the_star.svg',
    uprightKeywords: ['希望', '信念', '启示', '平静'],
    reversedKeywords: ['失望', '绝望', '不信任'],
  },
  {
    id: 18,
    name: 'The Moon',
    nameCn: '月亮',
    arcana: 'major',
    image: 'rw_the_moon.svg',
    uprightKeywords: ['幻觉', '恐惧', '潜意识', '困惑'],
    reversedKeywords: ['释放恐惧', '清晰', '压抑情绪'],
  },
  {
    id: 19,
    name: 'The Sun',
    nameCn: '太阳',
    arcana: 'major',
    image: 'rw_the_sun.svg',
    uprightKeywords: ['喜悦', '成功', '活力', '乐观'],
    reversedKeywords: ['暂时的挫折', '过于乐观', '悲观'],
  },
  {
    id: 20,
    name: 'Judgement',
    nameCn: '审判',
    arcana: 'major',
    image: 'rw_judgement.svg',
    uprightKeywords: ['觉醒', '反思', '内心召唤', '赦免'],
    reversedKeywords: ['自我怀疑', '无法原谅', '忽视召唤'],
  },
  {
    id: 21,
    name: 'The World',
    nameCn: '世界',
    arcana: 'major',
    image: 'rw_the_world.svg',
    uprightKeywords: ['完成', '整合', '成就', '旅行'],
    reversedKeywords: ['未完成', '缺乏封闭', '停滞'],
  },
]

export type CardPosition = 'past' | 'present' | 'future'

export interface SelectedCard {
  card: TarotCard
  position: CardPosition
  reversed: boolean
}
