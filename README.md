<div align="center">
<img src="src/assets/logo.svg" alt="Logo" />

<h1>English Learning App</h1>

<p>基于 Qwerty Learner 二次开发的英语学习应用</p>

<p>
  <a href="./docs/README_EN.md">English</a> |
  <a href="./docs/README_JP.md">日本語</a>
</p>

<p align="center" style="display: flex; justify-content: center; gap: 10px;">
  <a href="https://github.com/Realkai42/qwerty-learner/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Realkai42/qwerty-learner" alt="License"></a>
  <a><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/></a>
  <a><img src="https://img.shields.io/badge/Powered%20by-React-blue"/></a>
  <a><img src="https://img.shields.io/badge/Forked%20from-Qwerty%20Learner-orange"/></a>
</p>
</div>

---

## ⭐ 项目简介

本项目是对 [Qwerty Learner](https://github.com/Realkai42/qwerty-learner) 的**二次原创开发版本**。在保留原有核心功能的基础上，进行了重要的界面优化和功能扩展，特别增加了**现代化侧边栏导航系统**和**语法学习模块**，为用户提供更完整、更便捷的英语学习体验。

### 🎯 核心理念

> 为键盘工作者设计的单词记忆与英语肌肉记忆锻炼软件 + 系统化的英语语法学习平台

---

## 🆕 新增特性（相比原版）

### 🎨 全新侧边栏导航系统

这是本次二次开发最核心的功能升级，完全重构了应用的导航体验：

#### ✨ 主要特点

- **直观的图标导航** - 使用 Lucide React 图标库，提供清晰的视觉引导
  - 🏠 主页
  - 📖 记单词 (原打字练习)
  - 📚 词库管理
  - 💻 语法学习（新增）
  - ⚙️ 进度管理

- **响应式设计**
  - **桌面端**：侧边栏固定显示，宽度 220px，自动为主内容留出空间
  - **移动端**：可折叠侧边栏，点击菜单按钮展开/收起，带遮罩层交互

- **智能交互**
  - 当前页面高亮显示（蓝色左边框 + 背景色）
  - 悬停效果，提升用户体验
  - 移动端点击后自动收起侧边栏

- **深色模式完美支持**
  - 自动适配系统主题
  - 所有组件均提供深色模式样式

#### 📸 界面展示

```
桌面端布局：
┌──────────┬──────────────────────┐
│          │                      │
│  侧边栏  │    主内容区域        │
│          │                      │
│  主页    │                      │
│  记单词  │                      │
│  词库    │                      │
│  语法    │                      │
│  进度    │                      │
│          │                      │
└──────────┴──────────────────────┘

移动端布局：
┌──────────────────────────┐
│ ☰  Qwerty Learner    ✕  │  ← 可折叠侧边栏
├──────────────────────────┤
│  主页                    │
│  记单词                  │
│  词库                    │
│  语法                    │
│  进度管理                │
├──────────────────────────┤
│  快乐学习，每天进步      │
└──────────────────────────┘
```

### 📚 新增语法学习模块

- 系统化的英语语法学习内容
- 包含基础语法、句子构建、复杂结构、高级语法四大模块
- 与词汇学习形成完整的英语学习体系

### 🎯 其他优化

- 重新设计的整体布局，侧边栏 + 内容区的经典应用架构
- 优化的移动端体验
- 更流畅的页面切换和导航
- 改进的视觉层次和信息架构

---

## 🛠 功能列表

### 原版核心功能

#### 词库系统

内置了多种英语学习词库：

- **考试词汇**：CET-4、CET-6、考研英语、专业四级、专业八级
- **留学考试**：GMAT、GRE、IELTS、SAT、TOEFL
- **程序员专区**：程序员常用词、多种编程语言 API（JavaScript、Node.js、Java、Linux Command 等）
- **其他词库**：高考、中考、商务英语、BEC、人教版 3-9 年级等

#### 单词练习功能

- **音标显示与发音** - 帮助记忆单词读音
- **默写模式** - 章节练习后可选择默写巩固
- **速度与正确率统计** - 实时显示 WPM（每分钟单词数）和准确率
- **智能错误处理** - 输入错误需重新输入，确保正确的肌肉记忆

#### 数据分析

- ECharts 可视化图表展示学习进度
- 详细的学习数据分析报告
- 错题本功能

#### 进度管理

- 可视化进度编辑器
- 支持导入/导出学习进度
- 浏览器控制台命令行工具支持

---

## 🎨 设计思想

### 原版设计理念（保留）

软件设计的目标群体为以英语作为主要工作语言的键盘工作者。部分人会出现输入母语时的打字速度快于英语的情况，因为多年的母语输入练就了非常坚固的肌肉记忆 💪，而英语输入的肌肉记忆相对较弱，易出现输入英语时"提笔忘字"的现象。

同时为了巩固英语技能，也需要持续的背诵单词 📕，本软件将英语单词的记忆与英语键盘输入的肌肉记忆的锻炼相结合，可以在背诵单词的同时巩固肌肉记忆。

为了避免造成错误的肌肉记忆，设计上如果用户单词输入错误则需要重新输入单词，尽可能确保用户维持正确的肌肉记忆。

### 本次扩展理念

在原有打字 + 记词的基础上，我们认识到：

1. **学习内容的完整性** - 单词记忆需要配合语法学习才能真正掌握英语
2. **用户体验的连贯性** - 统一的侧边栏导航让功能切换更加流畅
3. **学习路径的清晰性** - 从词汇到语法，从练习到复习，形成完整的学习闭环

---

## 📸 在线访问

**原版项目**: <https://qwerty.kaiyi.cool/>

**本二次开发版本**：本地部署（参见下方运行指南）

镜像仓库:
- [GitCode: RealKai42/qwerty-learner](https://gitcode.com/RealKai42/qwerty-learner/overview)
- [Gitee: KaiyiWing/qwerty-learner](https://gitee.com/KaiyiWing/qwerty-learner)

原版 VSCode 插件：
[VSCode Plugin Market](https://marketplace.visualstudio.com/items?itemName=Kaiyi.qwerty-learner) |
[GitHub](https://github.com/Realkai42/qwerty-learner-vscode)

---

## 🚀 快速开始

### 环境准备

1. **NodeJS** - 推荐 v16+
2. **Git**
3. **Yarn**

#### 验证环境

```bash
node --version
git --version
yarn --version
```

或使用自动检查脚本：
- Windows: 执行 `scripts/pre-check.ps1`
- MacOS: 执行 `scripts/pre-check.sh`

### 本地运行

#### 方式一：手动安装

```bash
# 1. 克隆本仓库
git clone https://github.com/yangchao-nick-GitHub/English-Learn-App.git

# 2. 进入项目目录
cd English-Learn-App

# 3. 安装依赖
yarn install

# 4. 启动开发服务器
yarn start
```

项目将在 `http://localhost:5173/` 启动

#### 方式二：脚本安装（推荐）

**Windows 用户**:
```powershell
cd scripts
.\install.ps1
```

**MacOS 用户**:
```bash
cd scripts
./install.sh
```

### 构建生产版本

```bash
yarn build
```

构建产物将输出到 `build/` 目录。

---

## 🏗️ 技术架构

### 核心技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 4
- **状态管理**: Jotai (原子化状态管理)
- **路由**: React Router DOM v6
- **样式**: Tailwind CSS + CSS Modules
- **数据库**: Dexie (IndexedDB 封装)
- **图表**: ECharts
- **图标**: Lucide React（侧边栏）

### 二次开发主要改动

#### 1. 新增侧边栏组件

**文件位置**: `src/components/Sidebar/`

- `index.tsx` - 侧边栏主组件
- `sidebar.css` - 完整样式系统（含深色模式）

**核心实现**:
- 使用 Lucide React 图标库
- React Router 集成
- 响应式状态管理
- CSS 变量主题系统

#### 2. 路由扩展

新增路由：
- `/` - 主页
- `/grammar` - 语法学习（全新）
- `/progress-editor` - 进度管理

#### 3. 布局重构

- 桌面端：220px 固定宽度侧边栏 + 主内容区
- 移动端：全屏折叠式侧边栏 + 遮罩层

---

## 📖 项目结构

```
src/
├── components/
│   ├── Sidebar/              # ⭐ 新增：侧边栏组件
│   │   ├── index.tsx
│   │   └── sidebar.css
│   ├── Layout.tsx
│   └── ui/                   # Radix UI 组件封装
├── pages/
│   ├── Typing/               # 打字练习页面
│   ├── Gallery-N/            # 词库选择
│   ├── Grammar/              # ⭐ 新增：语法学习页面
│   ├── Analysis/             # 数据分析
│   ├── ErrorBook/            # 错题本
│   ├── ProgressEditor/       # 进度管理
│   ├── Home/                 # 主页
│   └── Mobile/               # 移动端页面
├── store/                    # Jotai 全局状态
├── utils/
│   └── db/                   # Dexie 数据库操作
├── resources/                # 词库配置
└── hooks/                    # 自定义 Hooks
```

---

## 🎯 使用指南

### 侧边栏导航

1. **桌面端**: 侧边栏始终显示，点击图标切换页面
2. **移动端**: 点击左上角菜单按钮展开/收起侧边栏
3. **当前页面**: 蓝色高亮 + 左边框指示
4. **深色模式**: 自动跟随系统设置

### 学习流程建议

```
1. 选择词库 → 2. 开始记单词练习 → 3. 查看数据分析
                                           ↓
4. 学习语法知识 ← 5. 复习错题本 ← 6. 管理学习进度
```

---

## 🤝 贡献指南

### 贡献代码

欢迎提交 PR！请遵循以下流程：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献词库

参考 [导入词典指南](./docs/toBuildDict.md)

详细贡献准则：[CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

## 🏆 致谢

### 原项目

**Qwerty Learner** by [RealKai42](https://github.com/Realkai42)

本项目基于优秀的开源项目 [Qwerty Learner](https://github.com/Realkai42/qwerty-learner) 进行二次开发，感谢原作者的开源精神。

### 原项目荣誉

- Github 全球趋势榜上榜项目
- V2EX 全站热搜项目
- Gitee 全站推荐项目
- [少数派首页推荐](https://sspai.com/post/67535)
- GitCode G-Star 计划毕业项目
- Gitee GVP (最有价值项目)

### 技术支持

- [React](https://github.com/facebook/react) - 前端框架
- [Tailwind CSS](https://tailwindcss.com) - 样式框架
- [Lucide React](https://lucide.dev) - 图标库（侧边栏）
- [Dexie.js](https://dexie.org) - IndexedDB 封装

### 数据来源

- 字典数据: [kajweb/dict](https://github.com/kajweb/dict)
- 语音数据: [有道词典](https://www.youdao.com/) 开放 API

---

## 📝 开源协议

本项目基于 [MIT License](https://github.com/Realkai42/qwerty-learner/blob/master/LICENSE) 开源，与原项目保持一致。

---

## ☕️ 支持原项目

如果您喜欢这个项目，也欢迎支持原作者：

[原项目捐赠链接](https://github.com/Realkai42/qwerty-learner#-buy-us-a-coffe)

---

## 📞 联系方式

- **本二次开发版本**: [yangchao-nick-GitHub](https://github.com/yangchao-nick-GitHub)
- **原项目**: [Realkai42](https://github.com/Realkai42)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**

Made with ❤️ by [yangchao-nick](https://github.com/yangchao-nick-GitHub)
Based on [Qwerty Learner](https://github.com/Realkai42/qwerty-learner) by [RealKai42](https://github.com/Realkai42)

</div>
