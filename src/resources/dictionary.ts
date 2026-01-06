import type { Dictionary, DictionaryResource } from '@/typings/index'
import { calcChapterCount } from '@/utils'

// 简化的词书配置 - 只保留PETS和Coder Dict
const simplifiedDicts: DictionaryResource[] = [
  // PETS 词书
  {
    id: 'pets3',
    name: 'PETS',
    description: '全国英语等级考试常考词汇',
    category: '中国考试',
    tags: ['PET'],
    url: '/dicts/PETS_3.json',
    length: 1942,
    language: 'en',
    languageCategory: 'en',
  },
  {
    id: 'pets3-2023',
    name: 'PETS-2023',
    description: '全国英语等级考试常考词汇',
    category: '中国考试',
    tags: ['PET'],
    url: '/dicts/PETS3-2023.json',
    length: 4449,
    language: 'en',
    languageCategory: 'en',
  },
  // Coder Dict 词书
  {
    id: 'coder',
    name: 'Coder Dict',
    description: '程序员常见单词词库',
    category: '代码练习',
    tags: ['通用'],
    url: '/dicts/it-words.json',
    length: 1700,
    language: 'code',
    languageCategory: 'code',
  },
]

/**
 * Built-in dictionaries in an array.
 */
export const dictionaryResources: DictionaryResource[] = [...simplifiedDicts]

export const dictionaries: Dictionary[] = dictionaryResources.map((resource) => ({
  ...resource,
  chapterCount: calcChapterCount(resource.length),
}))

/**
 * An object-map from dictionary IDs to dictionary themselves.
 */
export const idDictionaryMap: Record<string, Dictionary> = Object.fromEntries(dictionaries.map((dict) => [dict.id, dict]))
