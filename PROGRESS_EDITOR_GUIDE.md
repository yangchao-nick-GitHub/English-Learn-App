# 学习进度编辑工具使用指南

## 概述

Qwerty Learner 的学习进度存储在浏览器的 localStorage 中。现在你可以通过浏览器控制台方便地查看和修改学习进度。

## 数据存储结构

学习进度存储在 `localStorage` 的 `userProgress` 键中，包含以下信息：

```typescript
{
  currentDictId: string          // 当前选择的词书ID
  currentChapter: number         // 当前章节号
  currentWordIndex: number       // 当前单词索引
  totalWordsInDict: number       // 当前词书总单词数
  learnedWords: number           // 总学习单词数
  studyDays: number              // 学习天数
  lastStudyDate: string | null   // 最后学习日期
  dictProgress: {                // 各词书进度详情
    [dictId: string]: {
      totalWords: number         // 词书总单词数
      learnedWords: number       // 已学习单词数
      currentChapter: number     // 当前章节
      currentWordIndex: number   // 当前单词索引
    }
  }
}
```

## 使用方法

### 1. 打开浏览器控制台

- Windows/Linux: 按 `F12` 或 `Ctrl+Shift+J`
- Mac: 按 `Cmd+Option+J`

### 2. 查看帮助信息

在控制台输入：

```javascript
qwertyHelp()
```

### 3. 查看当前所有词书进度

```javascript
qwertyShowProgress()
```

### 4. 设置词书进度

#### 方法一：使用快捷命令

```javascript
// 设置 PETS3 到第 10 章第 5 个单词
qwertyPets3(10, 5)

// 设置 Coder Dict 到第 20 章开头
qwertyCoder(20, 0)
```

#### 方法二：使用通用命令

```javascript
qwertySetProgress(dictId, chapter, wordIndex, totalWords)

// 例如：设置 PETS3 到第 15 章第 8 个单词
qwertySetProgress('pets3', 15, 8, 1942)
```

#### 方法三：使用跳转命令

```javascript
qwertyJumpTo(dictId, chapter, wordIndex)

// 例如：跳转到 PETS3-2023 第 50 章第 10 个单词
qwertyJumpTo('pets3-2023', 50, 10)
```

### 5. 重置进度

```javascript
// 重置特定词书进度
qwertyResetProgress('pets3')

// 重置所有进度
qwertyResetProgress()
```

### 6. 导出/导入进度

```javascript
// 导出进度到 JSON 文件
qwertyExportProgress()

// 从文件导入进度（需要传入 File 对象）
qwertyImportProgress(file)
```

## 词书信息参考

| 词书 ID    | 名称       | 总单词数 | 章节数 |
| ---------- | ---------- | -------- | ------ |
| pets3      | PETS       | 1942     | 98     |
| pets3-2023 | PETS-2023  | 4449     | 223    |
| coder      | Coder Dict | 1700     | 85     |

## 使用示例

### 示例 1：跳转到 PETS3 第 20 章

```javascript
// 跳转到第20章开头（第0个单词）
qwertyPets3(20, 0)
```

### 示例 2：跳转到 Coder Dict 第 10 章第 15 个单词

```javascript
qwertyCoder(10, 15)
```

### 示例 3：查看和修改进度

```javascript
// 1. 查看当前进度
qwertyShowProgress()

// 2. 跳转到 PETS3 第30章
qwertyPets3(30, 0)

// 3. 刷新页面或点击"继续学习"，系统会从第30章开始
```

### 示例 4：备份和恢复进度

```javascript
// 1. 导出当前进度
qwertyExportProgress()
// 浏览器会下载一个 JSON 文件

// 2. 稍后恢复进度时，可以使用导入功能
// (需要在页面中实现文件选择器)
```

## 直接操作 localStorage

如果你想直接查看或修改原始数据，可以使用：

```javascript
// 查看原始数据
JSON.parse(localStorage.getItem('userProgress'))

// 直接修改数据
const progress = JSON.parse(localStorage.getItem('userProgress') || '{}')
progress.dictProgress['pets3'].currentChapter = 50
progress.dictProgress['pets3'].currentWordIndex = 10
localStorage.setItem('userProgress', JSON.stringify(progress))
```

## 注意事项

1. **章节从 0 开始计数**：第 1 章是 `chapter: 0`，第 10 章是 `chapter: 9`
2. **单词索引从 0 开始**：每章的第 1 个单词是 `wordIndex: 0`
3. **总单词数**：必须使用词书的实际总单词数，否则进度计算会不准确
4. **刷新页面**：修改进度后需要刷新页面或重新进入记单词页面才能生效
5. **数据备份**：建议定期使用 `qwertyExportProgress()` 备份学习进度

## 故障排除

### 进度修改后没有生效

1. 刷新浏览器页面
2. 检查是否有语法错误
3. 确认参数值在有效范围内

### 找不到命令

1. 确认在正确的页面（不是移动端页面）
2. 刷新页面重新加载工具
3. 检查浏览器控制台是否有错误信息

### 进度计算不准确

1. 确认使用了正确的 `totalWords` 参数
2. 检查词书 ID 是否正确
3. 查看原始数据验证计算逻辑
