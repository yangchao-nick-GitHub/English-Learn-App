/**
 * 进度编辑命令行工具
 * 在浏览器控制台使用
 *
 * 使用方法：
 * 1. 打开浏览器开发者工具 (F12)
 * 2. 在控制台输入以下命令：
 */
// 导入进度编辑功能
import * as ProgressEditor from './progressEditor'

// 将工具函数挂载到全局 window 对象，方便在控制台使用
declare global {
  interface Window {
    // 进度编辑工具
    qwertyGetProgress: () => Record<string, unknown>
    qwertySetProgress: (dictId: string, chapter: number, wordIndex: number, totalWords?: number) => void
    qwertyResetProgress: (dictId?: string) => void
    qwertyShowProgress: () => void
    qwertyJumpTo: (dictId: string, chapter: number, wordIndex: number) => void
    qwertyExportProgress: () => void
    qwertyImportProgress: (file: File) => Promise<void>

    // 快捷命令
    qwertyHelp: () => void
    qwertyPets3: (chapter: number, wordIndex?: number) => void
    qwertyPets32023: (chapter: number, wordIndex?: number) => void
    qwertyCoder: (chapter: number, wordIndex?: number) => void
  }
}

/**
 * 初始化进度编辑工具
 * 将工具函数挂载到 window 对象
 */
export const initProgressEditorCLI = () => {
  if (typeof window === 'undefined') return

  // 基础功能
  window.qwertyGetProgress = ProgressEditor.getCurrentProgress
  window.qwertySetProgress = ProgressEditor.setDictProgress
  window.qwertyShowProgress = ProgressEditor.showAllProgress
  window.qwertyExportProgress = ProgressEditor.exportProgress
  window.qwertyImportProgress = ProgressEditor.importProgress
  window.qwertyJumpTo = ProgressEditor.jumpToPosition

  // 重置进度
  window.qwertyResetProgress = (dictId?: string) => {
    if (dictId) {
      ProgressEditor.resetDictProgress(dictId)
      console.log(`已重置词书 "${dictId}" 的进度`)
    } else {
      ProgressEditor.resetAllProgress()
      console.log('已重置所有学习进度')
    }
  }

  // 快捷命令：设置 PETS3 进度
  window.qwertyPets3 = (chapter: number, wordIndex = 0) => {
    ProgressEditor.setDictProgress('pets3', chapter, wordIndex, 1942)
    console.log(`✅ PETS3: 已跳转到第 ${chapter + 1} 章，第 ${wordIndex + 1} 个单词`)
  }

  // 快捷命令：设置 PETS3-2023 进度
  window.qwertyPets32023 = (chapter: number, wordIndex = 0) => {
    ProgressEditor.setDictProgress('pets3-2023', chapter, wordIndex, 4449)
    console.log(`✅ PETS3-2023: 已跳转到第 ${chapter + 1} 章，第 ${wordIndex + 1} 个单词`)
  }

  // 快捷命令：设置 Coder Dict 进度
  window.qwertyCoder = (chapter: number, wordIndex = 0) => {
    ProgressEditor.setDictProgress('coder', chapter, wordIndex, 1700)
    console.log(`✅ Coder Dict: 已跳转到第 ${chapter + 1} 章，第 ${wordIndex + 1} 个单词`)
  }

  // 帮助信息
  window.qwertyHelp = () => {
    console.group('🎯 Qwerty Learner 进度编辑工具')
    console.log('')
    console.log('📖 查看当前进度:')
    console.log('   qwertyShowProgress()')
    console.log('')
    console.log('🎯 设置特定词书进度:')
    console.log('   qwertySetProgress(dictId, chapter, wordIndex, totalWords)')
    console.log('   例如: qwertySetProgress("pets3", 5, 10, 1942)')
    console.log('')
    console.log('⚡ 快捷命令:')
    console.log('   qwertyPets3(chapter, wordIndex)      // 设置 PETS3 进度')
    console.log('   qwertyPets32023(chapter, wordIndex)  // 设置 PETS3-2023 进度')
    console.log('   qwertyCoder(chapter, wordIndex)      // 设置 Coder Dict 进度')
    console.log('   例如: qwertyPets3(10, 5)  // 跳转到 PETS3 第11章第6个单词')
    console.log('')
    console.log('🦘 跳转到指定位置:')
    console.log('   qwertyJumpTo(dictId, chapter, wordIndex)')
    console.log('')
    console.log('🔄 重置进度:')
    console.log('   qwertyResetProgress()           // 重置所有进度')
    console.log('   qwertyResetProgress(dictId)     // 重置特定词书进度')
    console.log('')
    console.log('💾 导出/导入进度:')
    console.log('   qwertyExportProgress()          // 导出进度到文件')
    console.log('   qwertyImportProgress(file)      // 从文件导入进度')
    console.log('')
    console.log('📚 词书信息 (每章50单词):')
    console.log('   pets3:      1942 单词, 39 章')
    console.log('   pets3-2023: 4449 单词, 89 章')
    console.log('   coder:      1700 单词, 34 章')
    console.log('')
    console.groupEnd()
  }

  // 显示初始化消息
  console.log('🎯 Qwerty Learner 进度编辑工具已加载')
  console.log('输入 qwertyHelp() 查看使用帮助')
}

/**
 * 使用示例：
 *
 * // 1. 查看所有词书进度
 * qwertyShowProgress()
 *
 * // 2. 设置 PETS3 到第 10 章第 5 个单词
 * qwertyPets3(10, 5)
 *
 * // 3. 设置 Coder Dict 到第 20 章
 * qwertyCoder(20, 0)
 *
 * // 4. 跳转到 PETS3-2023 第 50 章第 10 个单词
 * qwertyJumpTo('pets3-2023', 50, 10)
 *
 * // 5. 重置 PETS3 进度
 * qwertyResetProgress('pets3')
 *
 * // 6. 重置所有进度
 * qwertyResetProgress()
 *
 * // 7. 导出进度到文件
 * qwertyExportProgress()
 *
 * // 8. 查看帮助
 * qwertyHelp()
 */
