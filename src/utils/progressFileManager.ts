/**
 * 学习进度文件管理器
 * 用于在 JSON 文件和 localStorage 之间同步学习进度
 */

interface DictProgressConfig {
  词书ID: string
  词书名称: string
  词书描述: string
  总单词数: number
  总章节数: number
  每章单词数: number
  当前进度: {
    章节: number
    单词索引: number
    已学单词数: number
    完成百分比: number
    学习状态: string
  }
}

interface LearningProgressConfig {
  版本: string
  说明: string
  最后更新: string
  用户信息: {
    昵称: string
    学习天数: number
    总学习单词数: number
  }
  当前学习设置: {
    当前词书: string
    当前章节: number
    当前单词索引: number
    说明: string
  }
  词书列表: DictProgressConfig[]
  学习目标: {
    每日目标单词数: number
    目标完成日期: string
    备注: string
  }
  使用说明: {
    如何修改进度: string
    章节从0开始: string
    单词索引从0开始: string
    修改后生效: string
    备份建议: string
  }
}

/**
 * 从 JSON 配置加载进度到 localStorage
 */
export const loadProgressFromFile = async (): Promise<void> => {
  try {
    const response = await fetch('/user-learning-progress.json')
    if (!response.ok) {
      throw new Error('无法读取进度文件')
    }

    const config: LearningProgressConfig = await response.json()

    // 转换为 localStorage 格式
    const dictProgress: Record<string, any> = {}

    config.词书列表.forEach((dict) => {
      const { 章节, 单词索引 } = dict.当前进度
      dictProgress[dict.词书ID] = {
        totalWords: dict.总单词数,
        learnedWords: dict.当前进度.已学单词数,
        currentChapter: 章节,
        currentWordIndex: 单词索引,
      }
    })

    // 计算总学习单词数
    const totalLearnedWords = Object.values(dictProgress).reduce((sum: number, prog: any) => {
      return sum + prog.learnedWords
    }, 0)

    const progressData = {
      currentDictId: config.当前学习设置.当前词书,
      currentChapter: config.当前学习设置.当前章节,
      currentWordIndex: config.当前学习设置.当前单词索引,
      totalWordsInDict: 0, // 会从当前词书获取
      learnedWords: totalLearnedWords,
      studyDays: config.用户信息.学习天数,
      lastStudyDate: new Date().toISOString().split('T')[0],
      dictProgress,
    }

    localStorage.setItem('userProgress', JSON.stringify(progressData))
    console.log('✅ 学习进度已从文件加载')
    return progressData
  } catch (error) {
    console.error('❌ 加载进度文件失败:', error)
    throw error
  }
}

/**
 * 将当前 localStorage 进度保存为 JSON 文件内容
 */
export const saveProgressToFile = (): LearningProgressConfig => {
  const progress = JSON.parse(localStorage.getItem('userProgress') || '{}')

  const config: LearningProgressConfig = {
    版本: '1.0',
    说明: 'Qwerty Learner 学习进度配置文件 - 可以手动编辑此文件来改变学习进度',
    最后更新: new Date().toISOString().split('T')[0],

    用户信息: {
      昵称: '学习者',
      学习天数: progress.studyDays || 0,
      总学习单词数: progress.learnedWords || 0,
    },

    当前学习设置: {
      当前词书: progress.currentDictId || 'pets3',
      当前章节: progress.currentChapter || 0,
      当前单词索引: progress.currentWordIndex || 0,
      说明: '下次学习时将从第' + ((progress.currentChapter || 0) + 1) + '章第' + ((progress.currentWordIndex || 0) + 1) + '个单词开始',
    },

    词书列表: [
      {
        词书ID: 'pets3',
        词书名称: 'PETS',
        词书描述: '全国英语等级考试常考词汇',
        总单词数: 1942,
        总章节数: 39,
        每章单词数: 50,
        当前进度: getProgressFromDict(progress, 'pets3', 1942),
      },
      {
        词书ID: 'pets3-2023',
        词书名称: 'PETS-2023',
        词书描述: '全国英语等级考试常考词汇 (2023版)',
        总单词数: 4449,
        总章节数: 89,
        每章单词数: 50,
        当前进度: getProgressFromDict(progress, 'pets3-2023', 4449),
      },
      {
        词书ID: 'coder',
        词书名称: 'Coder Dict',
        词书描述: '程序员常见单词词库',
        总单词数: 1700,
        总章节数: 34,
        每章单词数: 50,
        当前进度: getProgressFromDict(progress, 'coder', 1700),
      },
    ],

    学习目标: {
      每日目标单词数: 50,
      目标完成日期: '2024-12-31',
      备注: '每天坚持学习50个新单词',
    },

    使用说明: {
      如何修改进度: "修改'当前学习设置'中的章节和单词索引即可",
      章节从0开始: '第1章对应章节=0，第2章对应章节=1',
      单词索引从0开始: '每章第1个单词对应索引=0',
      修改后生效: '保存文件后刷新页面即可',
      备份建议: '建议定期备份此文件',
    },
  }

  return config
}

/**
 * 从进度数据中获取特定词书的进度信息
 */
function getProgressFromDict(progress: any, dictId: string, totalWords: number) {
  const dictProgress = progress.dictProgress?.[dictId]

  if (!dictProgress) {
    return {
      章节: 0,
      单词索引: 0,
      已学单词数: 0,
      完成百分比: 0.0,
      学习状态: '未开始',
    }
  }

  const percentage = (dictProgress.learnedWords / totalWords) * 100
  let status = '未开始'
  if (percentage > 0) status = '进行中'
  if (percentage >= 100) status = '已完成'

  return {
    章节: dictProgress.currentChapter,
    单词索引: dictProgress.currentWordIndex,
    已学单词数: dictProgress.learnedWords,
    完成百分比: Math.round(percentage * 10) / 10,
    学习状态: status,
  }
}

/**
 * 导出当前进度为 JSON 文件
 */
export const exportProgressAsFile = (): void => {
  const config = saveProgressToFile()
  const dataStr = JSON.stringify(config, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'user-learning-progress.json'
  link.click()
  URL.revokeObjectURL(url)
  console.log('✅ 学习进度已导出为文件')
}

/**
 * 显示当前学习进度摘要
 */
export const showProgressSummary = (): void => {
  const config = saveProgressToFile()

  console.group('📚 学习进度摘要')
  console.log('👤 学习者信息:')
  console.log(`   学习天数: ${config.用户信息.学习天数} 天`)
  console.log(`   总学习单词: ${config.用户信息.总学习单词数} 个`)
  console.log('')
  console.log('📖 当前学习:')
  const currentDict = config.词书列表.find((d) => d.词书ID === config.当前学习设置.当前词书)
  console.log(`   词书: ${currentDict?.词书名称 || '未知'}`)
  console.log(`   位置: 第${config.当前学习设置.当前章节 + 1}章第${config.当前学习设置.当前单词索引 + 1}个单词`)
  console.log('')
  console.log('📊 各词书进度:')
  config.词书列表.forEach((dict) => {
    const { 章节, 单词索引, 完成百分比, 学习状态 } = dict.当前进度
    console.log(`   ${dict.词书名称}: ${学习状态} (${完成百分比}%)`)
    console.log(`      当前位置: 第${章节 + 1}章第${单词索引 + 1}个单词`)
  })
  console.groupEnd()
}
