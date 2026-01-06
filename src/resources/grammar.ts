export interface GrammarModule {
  id: string
  title: string
  description: string
  icon: string
  fileName: string
  level: string
  topics: string[]
}

export const grammarModules: GrammarModule[] = [
  {
    id: 'basic',
    title: '基础语法',
    description: '学习英语基础语法知识，包括词性、冠词、介词和连词',
    icon: '📚',
    fileName: '01_基础语法.md',
    level: '初级',
    topics: ['词性', '冠词', '介词', '连词'],
  },
  {
    id: 'sentence',
    title: '句子构建',
    description: '掌握句子构建的核心要素：时态、语态、语气和主谓一致',
    icon: '🏗️',
    fileName: '02_句子构建.md',
    level: '中级',
    topics: ['时态', '语态', '语气', '主谓一致'],
  },
  {
    id: 'complex',
    title: '复杂结构',
    description: '理解复杂句式结构，包括从句、非谓语动词和倒装强调',
    icon: '🔗',
    fileName: '03_复杂结构.md',
    level: '中级',
    topics: ['从句', '非谓语动词', '倒装与强调'],
  },
  {
    id: 'advanced',
    title: '高级语法',
    description: '学习高级语法知识，包括虚拟语气、省略替代和标点符号',
    icon: '🎯',
    fileName: '04_高级语法.md',
    level: '高级',
    topics: ['虚拟语气', '省略与替代', '标点符号'],
  },
]

export const getGrammarModuleById = (id: string): GrammarModule | undefined => {
  return grammarModules.find((module) => module.id === id)
}

export const getGrammarModuleFilePath = (fileName: string): string => {
  return `/grammar/${fileName}`
}
