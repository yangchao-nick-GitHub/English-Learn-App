import './editor.css'
import { userProgressAtom } from '@/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'

interface DictProgress {
  dictId: string
  dictName: string
  totalWords: number
  currentChapter: number
  currentWordIndex: number
}

const ProgressEditorPage: React.FC = () => {
  const userProgress = useAtomValue(userProgressAtom)
  const setUserProgress = useSetAtom(userProgressAtom)
  const [message, setMessage] = useState('')

  // 监听自定义进度更新事件
  useEffect(() => {
    const handleProgressUpdate = () => {
      // 当进度更新时，atom会自动更新，不需要额外操作
      console.log('Progress updated via event')
    }

    window.addEventListener('progressUpdated', handleProgressUpdate)
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate)
    }
  }, [])

  // 获取所有词书的进度
  const getAllDictsProgress = (): DictProgress[] => {
    const dictProgress = userProgress.dictProgress || {}

    const dicts: DictProgress[] = [
      {
        dictId: 'pets3',
        dictName: 'PETS',
        totalWords: 1942,
        currentChapter: 0,
        currentWordIndex: 0,
      },
      {
        dictId: 'pets3-2023',
        dictName: 'PETS-2023',
        totalWords: 4449,
        currentChapter: 0,
        currentWordIndex: 0,
      },
      {
        dictId: 'coder',
        dictName: 'Coder Dict',
        totalWords: 1700,
        currentChapter: 0,
        currentWordIndex: 0,
      },
    ]

    // 更新每个词书的进度
    return dicts.map((dict) => {
      let dictData = dictProgress[dict.dictId]

      // Fallback: 如果是当前选中的词书，且没有详细进度数据，则使用全局进度
      // 这确保了在初始化或数据迁移过程中，当前词书的显示与全局状态保持一致
      if (!dictData && dict.dictId === userProgress.currentDictId) {
        dictData = {
          totalWords: userProgress.totalWordsInDict || dict.totalWords,
          learnedWords: userProgress.learnedWords,
          currentChapter: userProgress.currentChapter,
          currentWordIndex: userProgress.currentWordIndex,
        }
      }

      if (dictData) {
        return {
          ...dict,
          currentChapter: dictData.currentChapter,
          currentWordIndex: dictData.currentWordIndex,
        }
      }
      return dict
    })
  }

  // 保存学习进度
  const handleSaveProgress = () => {
    try {
      const dictSelect = document.getElementById('dictSelect') as HTMLSelectElement
      const chapterInput = document.getElementById('chapterInput') as HTMLInputElement
      const wordInput = document.getElementById('wordInput') as HTMLInputElement

      const selectedDictId = dictSelect.value
      // 用户输入的是从1开始的，转换为从0开始的内部索引
      const chapter = parseInt(chapterInput.value) - 1
      const wordIndex = parseInt(wordInput.value) - 1

      // 验证输入
      if (isNaN(chapter) || chapter < 0) {
        setMessage('❌ 章节号无效 (请输入 >= 1 的整数)')
        return
      }
      if (isNaN(wordIndex) || wordIndex < 0 || wordIndex >= 50) {
        setMessage('❌ 单词索引无效 (1-50)')
        return
      }

      // 获取词书信息
      const dictInfo = getAllDictsProgress().find((d) => d.dictId === selectedDictId)
      if (!dictInfo) {
        setMessage('❌ 找不到词书信息')
        return
      }

      if (chapter >= Math.ceil(dictInfo.totalWords / 50)) {
        setMessage(`❌ 章节号超出范围 (1-${Math.ceil(dictInfo.totalWords / 50)})`)
        return
      }

      // 计算学习进度
      const totalPosition = chapter * 50 + wordIndex
      const learnedWords = totalPosition + 1

      // 更新 dictProgress
      const dictProgress = { ...userProgress.dictProgress }

      // 更新当前选择的词书进度
      dictProgress[selectedDictId] = {
        totalWords: dictInfo.totalWords,
        learnedWords: learnedWords,
        currentChapter: chapter,
        currentWordIndex: wordIndex,
      }

      // 计算总学习单词数
      const totalLearnedWords = Object.values(dictProgress).reduce((sum: number, prog: any) => sum + (prog.learnedWords || 0), 0)

      const newProgress = {
        ...userProgress,
        currentDictId: selectedDictId,
        currentChapter: chapter,
        currentWordIndex: wordIndex,
        totalWordsInDict: dictInfo.totalWords,
        learnedWords: totalLearnedWords,
        studyDays: userProgress.studyDays || 1,
        lastStudyDate: new Date().toISOString().split('T')[0],
        dictProgress,
      }

      // 通过 atom更新，这会自动同步到 localStorage 并触发所有使用该atom的组件更新
      setUserProgress(newProgress)
      localStorage.setItem('userProgress', JSON.stringify(newProgress))

      // 同步到单独的配置项，确保全局状态一致
      localStorage.setItem('currentDict', selectedDictId)
      localStorage.setItem('currentChapter', chapter.toString())

      // 触发自定义事件，通知其他页面更新
      window.dispatchEvent(new Event('progressUpdated'))

      // 显示成功消息
      setMessage('✅ 学习进度已保存！')

      // 清除消息
      setTimeout(() => {
        setMessage('')
      }, 2000)

      // 重新加载页面以更新所有显示
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      setMessage('❌ 保存失败: ' + (error as Error).message)
    }
  }

  const allDictsProgress = getAllDictsProgress()

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1 className="editor-title">📚 学习进度管理</h1>
        <p className="editor-subtitle">简单直观地管理你的学习进度</p>
      </div>

      {message && <div className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</div>}

      <div className="editor-content">
        {/* 当前学习设置 */}
        <div className="card highlight">
          <h2>🎯 当前学习设置</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>选择词书</label>
              <select
                id="dictSelect"
                className="form-control"
                value={userProgress.currentDictId}
                onChange={(e) => {
                  const newDictId = e.target.value
                  const dictInfo = allDictsProgress.find((d) => d.dictId === newDictId)
                  if (dictInfo) {
                    // 更新表单中的章节和单词索引为选中词书的当前值（转换为1-based显示）
                    const chapterInput = document.getElementById('chapterInput') as HTMLInputElement
                    const wordInput = document.getElementById('wordInput') as HTMLInputElement
                    if (chapterInput) chapterInput.value = (dictInfo.currentChapter + 1).toString()
                    if (wordInput) wordInput.value = (dictInfo.currentWordIndex + 1).toString()
                  }
                }}
              >
                {allDictsProgress.map((dict) => (
                  <option key={dict.dictId} value={dict.dictId}>
                    {dict.dictName}
                  </option>
                ))}
              </select>
            </div>
            <div className="setting-item">
              <label>当前章节 (1-MAX)</label>
              <input id="chapterInput" type="number" className="form-control" min="1" defaultValue={userProgress.currentChapter + 1} />
            </div>
            <div className="setting-item">
              <label>单词索引 (1-50)</label>
              <input
                id="wordInput"
                type="number"
                className="form-control"
                min="1"
                max="50"
                defaultValue={userProgress.currentWordIndex + 1}
              />
            </div>
          </div>
          <div className="info-text">💡 每章包含50个单词，输入1代表第1章/第1个单词</div>
          <button className="btn btn-primary" onClick={handleSaveProgress}>
            ✅ 保存学习进度
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProgressEditorPage
