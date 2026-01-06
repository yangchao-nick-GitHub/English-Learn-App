import './profile.css'
import { currentDictIdAtom, userProgressAtom, userStatsAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { Award, Calendar, Clock, Target, Trophy, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ProfileData {
  joinDate: string
  totalWordsTyped: number
  totalTime: number
  accuracy: number
  speed: number
  achievements: string[]
}

const ProfilePage: React.FC = () => {
  const userProgress = useAtomValue(userProgressAtom)
  const userStats = useAtomValue(userStatsAtom)
  const currentDictId = useAtomValue(currentDictIdAtom)

  const [profileData, setProfileData] = useState<ProfileData>({
    joinDate: '',
    totalWordsTyped: 0,
    totalTime: 0,
    accuracy: 0,
    speed: 0,
    achievements: [],
  })

  useEffect(() => {
    // 从本地存储获取用户数据
    const storedStats = JSON.parse(localStorage.getItem('userStats') || '{}')
    const storedProgress = JSON.parse(localStorage.getItem('userProgress') || '{}')

    // 计算加入日期（第一次学习的日期）
    const joinDate = storedProgress.lastStudyDate
      ? new Date(storedProgress.lastStudyDate).toLocaleDateString('zh-CN')
      : new Date().toLocaleDateString('zh-CN')

    // 生成成就列表
    const achievements = []
    if (storedProgress.studyDays >= 1) achievements.push('初学者')
    if (storedProgress.studyDays >= 7) achievements.push('坚持一周')
    if (storedProgress.studyDays >= 30) achievements.push('坚持一月')
    if (storedStats.streakDays >= 7) achievements.push('连续学习7天')
    if (storedStats.streakDays >= 30) achievements.push('连续学习30天')
    if (userProgress.learnedWords >= 100) achievements.push('百词斩')
    if (userProgress.learnedWords >= 1000) achievements.push('千词王')
    if (storedStats.totalWordsTyped >= 10000) achievements.push('打字达人')
    if (achievements.length === 0) achievements.push('开始学习之旅')

    setProfileData({
      joinDate,
      totalWordsTyped: storedStats.totalWordsTyped || 0,
      totalTime: storedStats.totalStudyTime || 0,
      accuracy: storedStats.accuracy || 0,
      speed: storedStats.totalTypingSpeed || 0,
      achievements,
    })
  }, [userProgress, userStats])

  // 格式化时间
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} 分钟`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours} 小时 ${mins} 分钟`
  }

  // 计算学习水平
  const getLevel = (): { level: string; progress: number } => {
    const learnedWords = userProgress.learnedWords
    let level = '初学者'
    let progress = 0

    if (learnedWords < 100) {
      level = '初学者'
      progress = (learnedWords / 100) * 100
    } else if (learnedWords < 500) {
      level = '进阶者'
      progress = ((learnedWords - 100) / 400) * 100
    } else if (learnedWords < 1000) {
      level = '熟练者'
      progress = ((learnedWords - 500) / 500) * 100
    } else if (learnedWords < 5000) {
      level = '专家'
      progress = ((learnedWords - 1000) / 4000) * 100
    } else {
      level = '大师'
      progress = 100
    }

    return { level, progress: Math.min(100, Math.max(0, progress)) }
  }

  const { level, progress: levelProgress } = getLevel()

  const statsCards = [
    {
      icon: Calendar,
      label: '加入时间',
      value: profileData.joinDate,
      color: '#3b82f6',
    },
    {
      icon: Clock,
      label: '总学习时长',
      value: formatTime(profileData.totalTime),
      color: '#8b5cf6',
    },
    {
      icon: Target,
      label: '总打字数',
      value: `${profileData.totalWordsTyped} 个`,
      color: '#10b981',
    },
    {
      icon: Zap,
      label: '平均打字速度',
      value: `${Math.round(profileData.speed)} WPM`,
      color: '#f59e0b',
    },
    {
      icon: Trophy,
      label: '平均正确率',
      value: `${Math.round(profileData.accuracy)}%`,
      color: '#ef4444',
    },
    {
      icon: Award,
      label: '连续学习',
      value: `${userStats.streakDays} 天`,
      color: '#ec4899',
    },
  ]

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">个人资料</h1>
        <p className="profile-subtitle">查看你的学习成果和成就</p>
      </div>

      {/* 用户信息卡片 */}
      <div className="user-card">
        <div className="user-avatar">
          <div className="avatar-placeholder">👤</div>
        </div>
        <div className="user-info">
          <h2 className="user-name">学习者</h2>
          <p className="user-level">{level}</p>
          <div className="level-progress">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${levelProgress}%` }}></div>
            </div>
            <span className="progress-text">{levelProgress.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="stats-section">
        <h3 className="section-title">学习统计</h3>
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
      </div>

      {/* 成就展示 */}
      <div className="achievements-section">
        <h3 className="section-title">成就徽章</h3>
        <div className="achievements-grid">
          {profileData.achievements.map((achievement, index) => (
            <div key={index} className="achievement-badge">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-name">{achievement}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 学习详情 */}
      <div className="details-section">
        <h3 className="section-title">学习详情</h3>
        <div className="detail-item">
          <span className="detail-label">学习天数</span>
          <span className="detail-value">{userProgress.studyDays} 天</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">已学单词</span>
          <span className="detail-value">{userProgress.learnedWords} 个</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">当前词库</span>
          <span className="detail-value">{currentDictId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">学习进度</span>
          <span className="detail-value">
            {userProgress.dictProgress[currentDictId]?.learnedWords || 0} / {userProgress.dictProgress[currentDictId]?.totalWords || 0}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
