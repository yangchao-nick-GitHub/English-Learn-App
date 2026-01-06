import { userProgressAtom, userStatsAtom } from '@/store'
import { useSetAtom } from 'jotai'

// 简化的进度保存函数 - 以当前显示的单词为进度点
export const saveCurrentWordProgress = (dictId: string, chapter: number, wordIndex: number, totalWords: number) => {
  const storedProgress = JSON.parse(localStorage.getItem('userProgress') || '{}')

  const today = new Date().toISOString().split('T')[0]
  const isNewDay = storedProgress.lastStudyDate !== today
  const studyDays = isNewDay ? (storedProgress.studyDays || 0) + 1 : storedProgress.studyDays || 0

  // 更新当前词库进度
  const dictProgress = { ...(storedProgress.dictProgress || {}) }

  if (!dictProgress[dictId]) {
    dictProgress[dictId] = {
      totalWords,
      learnedWords: 0,
      currentChapter: chapter,
      currentWordIndex: wordIndex,
    }
  }

  // 计算当前学习进度（基于整个词书的总单词数）
  const currentTotalPosition = chapter * totalWords + wordIndex
  const learnedWords = Math.max(dictProgress[dictId].learnedWords, currentTotalPosition + 1)

  // 更新进度数据
  dictProgress[dictId] = {
    totalWords, // 整个词书的总单词数
    learnedWords,
    currentChapter: chapter,
    currentWordIndex: wordIndex,
  }

  // 计算所有词库的总学习单词数
  const totalLearnedWords = Object.values(dictProgress).reduce((sum, progress) => {
    return sum + progress.learnedWords
  }, 0)

  const newProgress = {
    ...storedProgress,
    currentDictId: dictId,
    currentChapter: chapter,
    currentWordIndex: wordIndex,
    totalWordsInDict: totalWords,
    learnedWords: totalLearnedWords,
    studyDays,
    lastStudyDate: today,
    dictProgress,
  }

  localStorage.setItem('userProgress', JSON.stringify(newProgress))
  return newProgress
}

export const useProgressManager = () => {
  const setUserProgress = useSetAtom(userProgressAtom)
  const setUserStats = useSetAtom(userStatsAtom)

  // 保存当前显示的单词作为进度点
  const saveCurrentWord = (dictId: string, chapter: number, wordIndex: number, totalWords: number) => {
    // 立即保存到localStorage
    const newProgress = saveCurrentWordProgress(dictId, chapter, wordIndex, totalWords)

    // 同时更新atom状态
    setUserProgress(newProgress)
  }

  // 获取当前词库的学习进度百分比（基于整个词书）
  const getCurrentDictProgress = (dictId: string): number => {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}')
    const dictProgress = progress.dictProgress || {}
    const currentDictProgress = dictProgress[dictId]

    if (!currentDictProgress || currentDictProgress.totalWords === 0) {
      return 0
    }

    // 基于整个词书总量计算进度
    const learnedPercentage = (currentDictProgress.learnedWords / currentDictProgress.totalWords) * 100
    return Math.min(100, Math.max(0, learnedPercentage))
  }

  // 获取上次学习位置（最后显示的单词）
  const getLastStudyPosition = (dictId: string): { chapter: number; wordIndex: number } | null => {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}')
    const dictProgress = progress.dictProgress?.[dictId]

    if (!dictProgress) {
      return null
    }

    return {
      chapter: dictProgress.currentChapter,
      wordIndex: dictProgress.currentWordIndex,
    }
  }

  // 更新用户统计
  const updateStats = (studyTime: number, wordsTyped: number, typingSpeed: number, accuracy: number) => {
    setUserStats((prev) => {
      const totalStudyTime = prev.totalStudyTime + studyTime
      const totalWordsTyped = prev.totalWordsTyped + wordsTyped
      const totalTypingSpeed = (prev.totalTypingSpeed * prev.accuracy + typingSpeed * accuracy) / (prev.accuracy + accuracy) || typingSpeed
      const newAccuracy = (prev.accuracy + accuracy) / 2

      return {
        ...prev,
        totalStudyTime,
        totalWordsTyped,
        totalTypingSpeed,
        accuracy: newAccuracy,
      }
    })
  }

  // 获取连续学习天数
  const getStreakDays = (): number => {
    const stats = JSON.parse(localStorage.getItem('userStats') || '{}')
    return stats.streakDays || 0
  }

  return {
    saveCurrentWord,
    getCurrentDictProgress,
    getLastStudyPosition,
    updateStats,
    getStreakDays,
  }
}

// 检查并更新连续学习天数
export const updateStreakDays = () => {
  const stats = JSON.parse(localStorage.getItem('userStats') || '{}')
  const progress = JSON.parse(localStorage.getItem('userProgress') || '{}')
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  let streakDays = stats.streakDays || 0

  if (progress.lastStudyDate === today) {
    // 今天已经学习过，保持不变
  } else if (progress.lastStudyDate === yesterday) {
    // 昨天学习过，连续学习天数+1
    streakDays += 1
  } else if (progress.lastStudyDate !== today) {
    // 中断了，重新开始
    streakDays = 1
  }

  localStorage.setItem(
    'userStats',
    JSON.stringify({
      ...stats,
      streakDays,
    }),
  )

  return streakDays
}
