import atomForConfig from './atomForConfig'
import { reviewInfoAtom } from './reviewInfoAtom'
import { DISMISS_START_CARD_DATE_KEY, defaultFontSizeConfig } from '@/constants'
import { idDictionaryMap } from '@/resources/dictionary'
import { correctSoundResources, keySoundResources, wrongSoundResources } from '@/resources/soundResource'
import type {
  Dictionary,
  InfoPanelState,
  LoopWordTimesOption,
  PhoneticType,
  PronunciationType,
  WordDictationOpenBy,
  WordDictationType,
} from '@/typings'
import type { ReviewRecord } from '@/utils/db/record'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const currentDictIdAtom = atomWithStorage('currentDict', 'coder')

export const currentDictInfoAtom = atom<Dictionary>((get) => {
  const id = get(currentDictIdAtom)
  let dict = idDictionaryMap[id]
  // 如果 dict 不存在，则返回 pets3. Typing 中会检查 DictId 是否存在，如果不存在则会重置为 pets3
  if (!dict) {
    dict = idDictionaryMap.pets3
  }
  return dict
})

export const currentChapterAtom = atomWithStorage('currentChapter', 0)

// 从 userProgress 中恢复当前词书和章节的函数
export const syncFromUserProgress = () => {
  try {
    const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}')
    if (userProgress.currentDictId && userProgress.currentChapter !== undefined) {
      // 更新 localStorage 中的单独配置项，确保与 userProgress 同步
      localStorage.setItem('currentDict', userProgress.currentDictId)
      localStorage.setItem('currentChapter', userProgress.currentChapter.toString())
      return {
        currentDictId: userProgress.currentDictId,
        currentChapter: userProgress.currentChapter,
        currentWordIndex: userProgress.currentWordIndex || 0,
      }
    }
  } catch (error) {
    console.warn('Failed to sync from userProgress:', error)
  }
  return null
}

export const loopWordConfigAtom = atomForConfig<{ times: LoopWordTimesOption }>('loopWordConfig', {
  times: 1,
})

export const keySoundsConfigAtom = atomForConfig('keySoundsConfig', {
  isOpen: true,
  isOpenClickSound: true,
  volume: 1,
  resource: keySoundResources[0],
})

export const hintSoundsConfigAtom = atomForConfig('hintSoundsConfig', {
  isOpen: true,
  volume: 1,
  isOpenWrongSound: true,
  isOpenCorrectSound: true,
  wrongResource: wrongSoundResources[0],
  correctResource: correctSoundResources[0],
})

export const pronunciationConfigAtom = atomForConfig('pronunciation', {
  isOpen: true,
  volume: 1,
  type: 'us' as PronunciationType,
  name: '美音',
  isLoop: false,
  isTransRead: false,
  transVolume: 1,
  rate: 1,
})

export const fontSizeConfigAtom = atomForConfig('fontsize', defaultFontSizeConfig)

export const pronunciationIsOpenAtom = atom((get) => get(pronunciationConfigAtom).isOpen)

export const pronunciationIsTransReadAtom = atom((get) => get(pronunciationConfigAtom).isTransRead)

export const randomConfigAtom = atomForConfig('randomConfig', {
  isOpen: false,
})

export const isShowPrevAndNextWordAtom = atomWithStorage('isShowPrevAndNextWord', true)

export const isIgnoreCaseAtom = atomWithStorage('isIgnoreCase', true)

export const isShowAnswerOnHoverAtom = atomWithStorage('isShowAnswerOnHover', true)

export const isTextSelectableAtom = atomWithStorage('isTextSelectable', false)

export const reviewModeInfoAtom = reviewInfoAtom({
  isReviewMode: false,
  reviewRecord: undefined as ReviewRecord | undefined,
})
export const isReviewModeAtom = atom((get) => get(reviewModeInfoAtom).isReviewMode)

export const phoneticConfigAtom = atomForConfig('phoneticConfig', {
  isOpen: true,
  type: 'us' as PhoneticType,
})

export const isOpenDarkModeAtom = atomWithStorage('isOpenDarkModeAtom', window.matchMedia('(prefers-color-scheme: dark)').matches)

export const isShowSkipAtom = atom(false)

export const isInDevModeAtom = atom(false)

export const infoPanelStateAtom = atom<InfoPanelState>({
  donate: false,
  vsc: false,
  community: false,
  redBook: false,
})

export const wordDictationConfigAtom = atomForConfig('wordDictationConfig', {
  isOpen: false,
  type: 'hideAll' as WordDictationType,
  openBy: 'auto' as WordDictationOpenBy,
})

export const dismissStartCardDateAtom = atomWithStorage<Date | null>(DISMISS_START_CARD_DATE_KEY, null)

// 学习进度相关状态
export interface UserProgress {
  currentDictId: string
  currentChapter: number
  currentWordIndex: number
  totalWordsInDict: number
  learnedWords: number
  studyDays: number
  lastStudyDate: string | null
  dictProgress: Record<
    string,
    {
      totalWords: number
      learnedWords: number
      currentChapter: number
      currentWordIndex: number
    }
  >
}

export const userProgressAtom = atomWithStorage<UserProgress>('userProgress', {
  currentDictId: 'coder',
  currentChapter: 0,
  currentWordIndex: 0,
  totalWordsInDict: 0,
  learnedWords: 0,
  studyDays: 0,
  lastStudyDate: null,
  dictProgress: {
    coder: {
      totalWords: 1700,
      learnedWords: 0,
      currentChapter: 0,
      currentWordIndex: 0,
    },
  },
})

// 用户学习统计
export interface UserStats {
  totalStudyTime: number // 分钟
  totalWordsTyped: number
  totalTypingSpeed: number // 平均 WPM
  accuracy: number // 正确率
  streakDays: number // 连续学习天数
}

export const userStatsAtom = atomWithStorage<UserStats>('userStats', {
  totalStudyTime: 0,
  totalWordsTyped: 0,
  totalTypingSpeed: 0,
  accuracy: 0,
  streakDays: 0,
})

// for dev test
//   dismissStartCardDateAtom = atom<Date | null>(new Date())
