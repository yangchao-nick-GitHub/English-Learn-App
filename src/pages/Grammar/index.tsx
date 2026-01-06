import { getGrammarModuleFilePath, grammarModules } from '../../resources/grammar'
import styles from './grammar.module.css'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const GrammarPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleModuleClick = async (moduleId: string) => {
    const module = grammarModules.find((m) => m.id === moduleId)
    if (!module) return

    setSelectedModule(moduleId)
    setLoading(true)
    setError(null)

    try {
      const filePath = getGrammarModuleFilePath(module.fileName)
      const response = await fetch(filePath)

      if (!response.ok) {
        throw new Error(`无法加载文件: ${response.statusText}`)
      }

      const text = await response.text()
      setContent(text)
    } catch (err) {
      console.error('加载语法内容失败:', err)
      setError('加载内容失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedModule(null)
    setContent('')
    setError(null)
  }

  if (selectedModule) {
    const module = grammarModules.find((m) => m.id === selectedModule)

    if (loading) {
      return (
        <div className={styles.grammarContainer}>
          <div className={styles.loadingSpinner}>
            <Loader2 size={48} className="animate-spin" />
            <p style={{ marginTop: '1rem' }}>加载中...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className={styles.grammarContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeft size={20} />
            返回模块选择
          </button>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorTitle}>加载失败</div>
            <div className={styles.errorMessage}>{error}</div>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.grammarContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft size={20} />
          返回模块选择
        </button>

        <div className={styles.contentViewer}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>{module?.title}</h1>
            <p className={styles.contentDescription}>{module?.description}</p>
          </div>

          <div className={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.grammarContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>语法学习</h1>
        <p className={styles.subtitle}>系统学习英语语法，提升语言理解能力</p>
      </div>

      <div className={styles.moduleGrid}>
        {grammarModules.map((module) => (
          <div
            key={module.id}
            className={styles.moduleCard}
            onClick={() => handleModuleClick(module.id)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleModuleClick(module.id)
              }
            }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>{module.icon}</div>
              <div className={styles.cardTitle}>{module.title}</div>
            </div>

            <p className={styles.cardDescription}>{module.description}</p>

            <div className={styles.cardMeta}>
              <span className={`${styles.levelBadge} ${styles[`level${module.level}`]}`}>{module.level}</span>
              <div className={styles.topicsList}>
                {module.topics.map((topic) => (
                  <span key={topic} className={styles.topic}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GrammarPage
