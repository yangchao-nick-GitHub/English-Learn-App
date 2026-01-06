import './home.css'
import { currentChapterAtom, currentDictIdAtom, currentDictInfoAtom, userProgressAtom, userStatsAtom } from '@/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { Award, BookOpen, Clock, Flame, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface WordInfo {
  name: string
  meaning: string
}

const HomePage: React.FC = () => {
  const currentDictId = useAtomValue(currentDictIdAtom)
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const currentChapter = useAtomValue(currentChapterAtom)
  const setCurrentChapter = useSetAtom(currentChapterAtom)
  const userProgress = useAtomValue(userProgressAtom)
  const userStats = useAtomValue(userStatsAtom)
  const navigate = useNavigate()

  const [currentWord, setCurrentWord] = useState<WordInfo | null>(null)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [lastStudyPosition, setLastStudyPosition] = useState<{ chapter: number; wordIndex: number } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0) // 用于强制刷新组件

  // 监听自定义进度更新事件
  useEffect(() => {
    const handleProgressUpdate = () => {
      // 强制刷新组件，重新读取所有进度数据
      setRefreshKey((prev) => prev + 1)
    }

    window.addEventListener('progressUpdated', handleProgressUpdate)
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate)
    }
  }, [])

  useEffect(() => {
    // 计算当前词库的学习进度
    const dictProgress = userProgress.dictProgress[currentDictId]
    if (dictProgress && dictProgress.totalWords > 0) {
      const percentage = (dictProgress.learnedWords / dictProgress.totalWords) * 100
      setProgressPercentage(Math.min(100, Math.max(0, percentage)))

      // 设置上次学习位置
      setLastStudyPosition({
        chapter: dictProgress.currentChapter,
        wordIndex: dictProgress.currentWordIndex,
      })
    } else {
      setProgressPercentage(0)
      setLastStudyPosition(null)
    }
  }, [currentDictId, userProgress])

  // 单独的useEffect来获取当前单词，避免无限循环
  useEffect(() => {
    // 获取当前单词信息 - 显示上次学习的位置
    const fetchCurrentWord = async () => {
      try {
        const response = await fetch(`/dicts/${currentDictId}.json`)
        if (response.ok) {
          const data = await response.json()
          const chapters = data?.content || []

          // 优先显示上次学习的位置
          const targetChapter = lastStudyPosition?.chapter ?? currentChapter
          if (chapters[targetChapter]) {
            const words = chapters[targetChapter]?.words || []
            const targetWordIndex = lastStudyPosition?.wordIndex ?? 0
            if (words.length > 0 && words[targetWordIndex]) {
              setCurrentWord(words[targetWordIndex])
            } else if (words.length > 0) {
              setCurrentWord(words[0])
            }
          }
        }
      } catch (error) {
        console.error('获取当前单词失败:', error)
      }
    }

    fetchCurrentWord()
  }, [currentDictId, currentChapter, lastStudyPosition])

  // 格式化学习时间
  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分钟`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }

  // 计算当前学习位置
  const getCurrentPosition = (): string => {
    const dictProgress = userProgress.dictProgress[currentDictId]
    if (!dictProgress) {
      return '第 1 章，第 1 个单词'
    }
    const chapter = dictProgress.currentChapter + 1
    const wordIndex = dictProgress.currentWordIndex + 1
    return `第 ${chapter} 章，第 ${wordIndex} 个单词`
  }

  // 继续学习功能 - 跳转到上次学习的位置
  const handleContinueLearning = () => {
    if (lastStudyPosition) {
      // 设置到上次学习的章节
      setCurrentChapter(lastStudyPosition.chapter)
      navigate('/typing')
    } else {
      // 如果没有学习记录，直接跳转
      navigate('/typing')
    }
  }

  const statsCards = [
    {
      icon: BookOpen,
      label: '正在学习',
      value: currentDictInfo.name,
      color: '#3b82f6',
    },
    {
      icon: Target,
      label: '当前进度',
      value: getCurrentPosition(),
      color: '#10b981',
    },
    {
      icon: Award,
      label: '学习天数',
      value: `${userProgress.studyDays} 天`,
      color: '#f59e0b',
    },
    {
      icon: Clock,
      label: '学习时长',
      value: formatStudyTime(userStats.totalStudyTime),
      color: '#8b5cf6',
    },
    {
      icon: TrendingUp,
      label: '已学单词',
      value: `${userProgress.learnedWords} 个`,
      color: '#ec4899',
    },
    {
      icon: Flame,
      label: '连续学习',
      value: `${userStats.streakDays} 天`,
      color: '#ef4444',
    },
  ]

  return (
    <div className="home-container" key={refreshKey}>
      <div className="home-header">
        <h1 className="home-title">学习概览</h1>
        <p className="home-subtitle">欢迎回来！继续你的学习之旅吧</p>
      </div>

      {/* 学习进度概览 */}
      <div className="progress-section">
        <div className="progress-header">
          <h2 className="section-title">当前词库进度</h2>
          <div className="progress-percentage">{progressPercentage.toFixed(1)}%</div>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="progress-info">
          <span className="dict-name">{currentDictInfo.name}</span>
          <span className="word-count">
            {userProgress.dictProgress[currentDictId]?.learnedWords || 0} / {userProgress.dictProgress[currentDictId]?.totalWords || 0}{' '}
            个单词
          </span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 当前单词预览 */}
      {currentWord && (
        <div className="word-preview">
          <h3 className="preview-title">
            {lastStudyPosition ? `上次学习到：第${lastStudyPosition.chapter + 1}章第${lastStudyPosition.wordIndex + 1}词` : '今日单词预览'}
          </h3>
          <div className="word-card">
            <div className="word-name">{currentWord.name}</div>
            <div className="word-meaning">{currentWord.meaning}</div>
          </div>
        </div>
      )}

      {/* 快速开始按钮 */}
      <div className="quick-actions">
        <button className="action-button primary" onClick={handleContinueLearning}>
          <BookOpen size={20} />
          {lastStudyPosition ? '继续学习' : '开始学习'}
        </button>
        <button className="action-button secondary" onClick={() => navigate('/gallery')}>
          <Target size={20} />
          选择词库
        </button>
      </div>
    </div>
  )
}

export default HomePage
