# Markdown 笔记应用

轻量级 Markdown 笔记应用，浏览器本地运行，零后端依赖。主打**实时预览**与**代码高亮**，支持笔记管理、拖拽布局、导出 MD/PDF。

## 功能

- **三栏布局** — 侧边栏笔记列表 + Markdown 编辑器 + 实时预览，栏宽可拖拽调整
- **实时预览** — 编辑内容即时渲染，所见即所得
- **代码高亮** — 基于 Prism.js 的语法高亮，支持行号显示和代码复制
- **Markdown 快捷键** — Tab/Shift+Tab 缩进，Enter 列表续行，Ctrl+B/I/K 快速排版
- **笔记管理** — 新建、删除、搜索笔记，数据持久化到浏览器 LocalStorage
- **导出** — 一键导出 Markdown 源文件（`.md`）和 PDF（通过浏览器打印）
- **深色主题** — 低对比度暗色界面，Notion 风格排版，代码块极深背景
- **纯前端** — 无需后端服务器，所有数据存储在浏览器本地

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite v8 |
| 样式 | Tailwind CSS v3 |
| Markdown | react-markdown v9 + remark-gfm + remark-breaks |
| 高亮 | react-syntax-highlighter (Prism) |
| 部署 | Vercel |

## 本地运行

```bash
# 克隆仓库
git clone https://github.com/WUCHENFEIJIAN/markdown-notes-app.git
cd markdown-notes-app/markdown-notes-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

开发服务器默认运行在 `http://localhost:5173`。

## 项目结构

```
├── README.md
├── Plan.md                    # 开发计划
├── PRD.md                     # 产品需求文档
├── Tech_Design.md             # 技术设计文档
└── markdown-notes-app/        # 应用代码
    ├── src/
    │   ├── components/
    │   │   ├── Editor/        # 编辑器（标题 + 内容区）
    │   │   ├── Preview/       # 预览区（Markdown 渲染）
    │   │   ├── Sidebar/       # 侧边栏（笔记列表 + 搜索）
    │   │   ├── ExportToolbar.tsx  # 导出工具栏
    │   │   └── ResizeHandle.tsx   # 拖拽手柄
    │   ├── hooks/             # 自定义 Hooks（笔记、防抖、拖拽）
    │   ├── utils/             # 工具函数（编辑器、导出、存储）
    │   └── types/             # TypeScript 类型定义
    ├── index.html
    ├── vite.config.ts
    └── tailwind.config.js
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 增加缩进 / 列表嵌套 |
| `Shift + Tab` | 减少缩进 / 列表降级 |
| `Enter` | 列表项自动续行 |
| `Ctrl/Cmd + B` | 加粗 |
| `Ctrl/Cmd + I` | 斜体 |
| `Ctrl/Cmd + K` | 插入链接 |
| `Ctrl/Cmd + Z` | 撤销 |
| `Ctrl/Cmd + Y` | 重做 |

## 数据存储

所有笔记数据存储在浏览器 LocalStorage 中（键名 `markdown_notes_data`），使用 JSON 序列化。换浏览器或清除缓存会导致数据丢失，建议定期导出备份。

## License

MIT
