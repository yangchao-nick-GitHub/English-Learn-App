/**
 * 学习进度编辑工具
 * 用于手动修改词书学习进度
 */

interface DictProgress {
  totalWords: number
  learnedWords: number
  currentChapter: number
  currentWordIndex: number
}

interface UserProgress {
  currentDictId: string
  currentChapter: number
  currentWordIndex: number
  totalWordsInDict: number
  learnedWords: number
  studyDays: number
  lastStudyDate: string | null
  dictProgress: Record<string, DictProgress>
}

/**
 * 获取当前学习进度
 */
export const getCurrentProgress = (): UserProgress => {
  const progress = localStorage.getItem('userProgress')
  return progress ? JSON.parse(progress) : {}
}

/**
 * 设置特定词书的学习进度
 * @param dictId 词书ID (例如: 'pets3', 'coder')
 * @param chapter 章节号 (从0开始)
 * @param wordIndex 单词在章节中的索引 (从0开始)
 * @param totalWords 词书总单词数
 */
export const setDictProgress = (dictId: string, chapter: number, wordIndex: number, totalWords: number): void => {
  const progress = getCurrentProgress()
  const dictProgress = { ...(progress.dictProgress || {}) }

  // 计算当前学习进度（基于整个词书的总单词数）
  const currentTotalPosition = chapter * totalWords + wordIndex
  const learnedWords = currentTotalPosition + 1

  // 更新指定词书的进度
  dictProgress[dictId] = {
    totalWords,
    learnedWords,
    currentChapter: chapter,
    currentWordIndex: wordIndex,
  }

  // 计算所有词库的总学习单词数
  const totalLearnedWords = Object.values(dictProgress).reduce((sum, prog) => {
    return sum + prog.learnedWords
  }, 0)

  const newProgress: UserProgress = {
    ...progress,
    currentDictId: dictId,
    currentChapter: chapter,
    currentWordIndex: wordIndex,
    totalWordsInDict: totalWords,
    learnedWords: totalLearnedWords,
    dictProgress,
  }

  localStorage.setItem('userProgress', JSON.stringify(newProgress))
  console.log(`已更新词书 "${dictId}" 的学习进度:`, {
    章节: chapter,
    单词索引: wordIndex,
    总进度: `${learnedWords}/${totalWords} (${((learnedWords / totalWords) * 100).toFixed(1)}%)`,
  })
}

/**
 * 重置特定词书的进度
 * @param dictId 词书ID
 */
export const resetDictProgress = (dictId: string): void => {
  const progress = getCurrentProgress()
  const dictProgress = { ...(progress.dictProgress || {}) }

  delete dictProgress[dictId]

  const newProgress: UserProgress = {
    ...progress,
    dictProgress,
  }

  localStorage.setItem('userProgress', JSON.stringify(newProgress))
  console.log(`已重置词书 "${dictId}" 的学习进度`)
}

/**
 * 重置所有学习进度
 */
export const resetAllProgress = (): void => {
  localStorage.removeItem('userProgress')
  console.log('已重置所有学习进度')
}

/**
 * 显示当前所有词书的进度
 */
export const showAllProgress = (): void => {
  const progress = getCurrentProgress()
  const dictProgress = progress.dictProgress || {}

  console.group('📚 所有词书学习进度')

  if (Object.keys(dictProgress).length === 0) {
    console.log('暂无学习进度记录')
  } else {
    Object.entries(dictProgress).forEach(([dictId, prog]) => {
      const percentage = ((prog.learnedWords / prog.totalWords) * 100).toFixed(1)
      console.log(`📖 ${dictId}:`)
      console.log(`   章节: ${prog.currentChapter}`)
      console.log(`   单词索引: ${prog.currentWordIndex}`)
      console.log(`   进度: ${prog.learnedWords}/${prog.totalWords} (${percentage}%)`)
      console.log('---')
    })
  }

  console.groupEnd()
}

/**
 * 快捷设置：跳转到指定词书的特定位置
 * @param dictId 词书ID
 * @param chapter 章节号
 * @param wordIndex 单词索引
 */
export const jumpToPosition = (dictId: string, chapter: number, wordIndex: number): void => {
  // 获取词书信息
  const dictInfo = getDictInfo(dictId)
  if (!dictInfo) {
    console.error(`找不到词书 "${dictId}" 的信息`)
    return
  }

  // 验证参数
  if (chapter < 0 || chapter >= dictInfo.chapterCount) {
    console.error(`章节号 ${chapter} 超出范围 (0-${dictInfo.chapterCount - 1})`)
    return
  }

  if (wordIndex < 0 || wordIndex >= dictInfo.length) {
    console.error(`单词索引 ${wordIndex} 超出范围 (0-${dictInfo.length - 1})`)
    return
  }

  setDictProgress(dictId, chapter, wordIndex, dictInfo.length)
  console.log(`✅ 已跳转到词书 "${dictId}" 的第 ${chapter + 1} 章，第 ${wordIndex + 1} 个单词`)
}

/**
 * 获取词书信息
 */
function getDictInfo(dictId: string) {
  // 这里需要从实际词书配置中获取信息
  // 为了简化，这里返回基本信息
  const dictInfos: Record<string, { length: number; chapterCount: number }> = {
    pets3: { length: 1942, chapterCount: 98 },
    'pets3-2023': { length: 4449, chapterCount: 223 },
    coder: { length: 1700, chapterCount: 85 },
  }

  return dictInfos[dictId] || null
}

/**
 * 导出进度到JSON文件
 */
export const exportProgress = (): void => {
  const progress = getCurrentProgress()
  const dataStr = JSON.stringify(progress, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `qwerty-learner-progress-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
  console.log('✅ 进度已导出')
}

/**
 * 从JSON文件导入进度
 */
export const importProgress = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const progress = JSON.parse(e.target?.result as string)
        localStorage.setItem('userProgress', JSON.stringify(progress))
        console.log('✅ 进度已导入')
        resolve()
      } catch (error) {
        console.error('❌ 导入进度失败:', error)
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}
