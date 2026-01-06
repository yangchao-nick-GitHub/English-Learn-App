# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Qwerty Learner 是一个为键盘工作者设计的单词记忆与英语肌肉记忆锻炼软件，基于 React + TypeScript + Vite 构建。项目通过将英语单词记忆与键盘输入肌肉记忆锻炼相结合，帮助用户在背诵单词的同时巩固打字技能。

## 常用开发命令

### 安装与启动

```bash
yarn install        # 安装依赖
yarn start          # 启动开发服务器 (http://localhost:5173)
yarn dev            # 同上，启动开发服务器
```

### 构建与测试

```bash
yarn build          # 构建生产版本到 build 目录
yarn test           # 运行测试 (当前为占位符)
yarn test:e2e       # 运行 Playwright E2E 测试
```

### 代码质量

```bash
yarn lint           # 运行 ESLint 检查
yarn prettier       # 运行 Prettier 格式化
```

## 项目架构

### 核心技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 4
- **状态管理**: Jotai (原子化状态管理)
- **样式**: Tailwind CSS + CSS Modules
- **数据库**: Dexie (IndexedDB 封装)
- **路由**: React Router DOM v6
- **图表**: ECharts
- **E2E 测试**: Playwright
- **桌面应用**: Tauri (src-tauri 目录)

### 关键架构模式

#### 1. 状态管理 (Jotai)

项目使用 Jotai 的原子化状态管理，主要状态定义在 `src/store/index.ts` 中：

```typescript
// 主要状态 atoms
currentDictIdAtom // 当前词库ID
currentChapterAtom // 当前章节
userProgressAtom // 用户学习进度
pronunciationConfigAtom // 发音配置
keySoundsConfigAtom // 按键音效配置
fontSizeConfigAtom // 字体大小配置
```

状态持久化使用 `atomWithStorage`，自动同步到 localStorage。

#### 2. 数据持久化 (Dexie)

基于 IndexedDB 的本地存储，数据库类在 `src/utils/db/index.ts` 中：

```typescript
class RecordDB extends Dexie {
  wordRecords!: Table<IWordRecord, number> // 单词练习记录
  chapterRecords!: Table<IChapterRecord, number> // 章节练习记录
  reviewRecords!: Table<IReviewRecord, number> // 复习记录
  revisionDictRecords!: Table<IRevisionDictRecord, number>
  revisionWordRecords!: Table<IWordRecord, number>
}
```

#### 3. 打字状态管理

`src/pages/Typing/store/` 使用 React Context API 管理打字状态：

```typescript
interface TypingState {
  chapterData: {
    words: WordWithIndex[] // 当前章节单词
    index: number // 当前单词索引
    correctCount: number // 正确数
    wrongCount: number // 错误数
  }
  timerData: {
    time: number // 练习时间
    accuracy: number // 正确率
    wpm: number // 每分钟单词数
  }
  isTyping: boolean // 是否正在输入
  isFinished: boolean // 是否完成
}
```

#### 4. 词库系统

词库配置在 `src/resources/dictionary.ts` 中，当前项目已简化为 3 个词库：

- **PETS** (pets3): 全国英语等级考试词汇，1942 词，98 章
- **PETS-2023** (pets3-2023): 更新版 PETS 词汇，4449 词，223 章
- **Coder Dict** (coder): 程序员常用词，1700 词，85 章

词库文件为 JSON 格式，存放在 `public/dicts/` 目录。

### 目录结构

```
src/
├── components/           # 通用组件
│   ├── ui/              # Radix UI 组件封装 (button, dialog, tooltip 等)
│   ├── Layout.tsx       # 主布局
│   ├── Sidebar.tsx      # 侧边栏导航
│   └── ...
├── pages/               # 页面组件
│   ├── Typing/          # 主打字练习页面
│   │   ├── components/  # 打字相关子组件
│   │   ├── hooks/       # 自定义 hooks
│   │   └── store/       # 打字状态管理 (Context)
│   ├── Gallery-N/       # 词库选择页面 (新版)
│   ├── Analysis/        # 数据分析页面 (ECharts 图表)
│   ├── ErrorBook/       # 错题本页面
│   ├── ProgressEditor/  # 学习进度编辑页面
│   └── Mobile/          # 移动端页面
├── store/               # 全局状态管理 (Jotai atoms)
│   ├── index.ts         # 主要状态定义
│   ├── atomForConfig.ts # 配置项状态工厂函数
│   └── reviewInfoAtom.ts
├── utils/
│   ├── db/              # 数据库操作 (Dexie)
│   │   ├── index.ts     # 数据库初始化
│   │   ├── record.ts    # 数据记录模型
│   │   └── ...
│   ├── progressEditor.ts      # 进度编辑工具
│   ├── progressEditorCLI.ts   # 控制台命令工具
│   └── ...
├── resources/           # 资源配置
│   ├── dictionary.ts    # 词库配置
│   └── soundResource.ts # 音效资源
├── hooks/               # 自定义 React Hooks
├── typings/             # TypeScript 类型定义
└── constants/           # 常量定义
```

### 路由结构

```typescript
/                    # 主页，根据设备重定向
/typing             # 主打字练习页面
/gallery            # 词库选择和浏览
/analysis           # 学习数据分析 (ECharts 可视化)
/error-book         # 错题本
/progress-editor    # 学习进度编辑页面
/mobile             # 移动端页面
```

## 开发注意事项

### 状态管理

- 新增状态优先使用 Jotai atom，遵循现有模式
- 使用 `atomWithStorage` 实现状态持久化
- 配置项使用 `atomForConfig` 工厂函数创建

### 样式开发

- 使用 Tailwind CSS 工具类，保持样式一致性
- 复杂组件样式使用 CSS Modules (`.module.css`)
- 支持深色模式 (`dark:` 前缀)

### 类型安全

- 充分利用 TypeScript，避免 `any` 类型
- 类型定义集中在 `src/typings/` 目录
- 使用接口定义数据结构

### 数据库操作

- 通过 Dexie 进行数据持久化
- 注意事务处理和错误处理
- 数据记录模型在 `src/utils/db/record.ts`

### 词库扩展

新增词库需要：

1. 准备 JSON 格式词库文件，放入 `public/dicts/`
2. 在 `src/resources/dictionary.ts` 中配置词库信息
3. 使用 `calcChapterCount` 计算章节数

### 进度管理工具

项目提供浏览器控制台命令行工具 (`src/utils/progressEditorCLI.ts`)：

```javascript
// 查看帮助
qwertyHelp()

// 设置词库进度
qwertyPets3(10, 5) // PETS3 第10章第5个单词
qwertyCoder(20, 0) // Coder Dict 第20章开头

// 导出/导入进度
qwertyExportProgress()
qwertyImportProgress(file)
```

详细用法见 `PROGRESS_EDITOR_GUIDE.md`。

## 重要配置文件

- **vite.config.ts**: Vite 构建配置，包含插件、路径别名 (`@/*`)、构建优化
- **tsconfig.json**: TypeScript 配置，支持路径别名 `@/*`，CSS Modules camelCase
- **tailwind.config.js**: Tailwind CSS 配置，包含自定义主题和断点
- **playwright.config.ts**: E2E 测试配置，测试 URL 指向生产环境

## 测试策略

项目使用 Playwright 进行 E2E 测试：

- 测试文件位于 `tests/e2e/` 目录
- 支持多浏览器测试
- 默认超时时间 30s

## 构建部署

- 生产构建输出到 `build/` 目录
- 支持静态部署 (Vercel, GitHub Pages 等)
- 环境变量通过 `REACT_APP_DEPLOY_ENV` 配置
- Tauri 桌面版配置在 `src-tauri/` 目录

## 贡献准则

1. 在开始 PR 前先在 Issue 区讨论
2. 尽早创建 draft PR 进行讨论
3. 遵循代码风格规范 (ESLint + Prettier)
4. 友好协作，接受 Code Review 反馈

详细贡献准则见 `docs/CONTRIBUTING.md`。
