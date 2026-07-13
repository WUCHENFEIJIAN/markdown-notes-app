# Markdown笔记应用技术设计文档 (v1.0)

## 1. 技术栈
*   **前端框架**：React 18 + TypeScript
*   **构建工具**：Vite
*   **样式方案**：Tailwind CSS
*   **Markdown解析**：react-markdown（配合 remark-gfm 支持表格等扩展语法）
*   **代码高亮**：react-syntax-highlighter
*   **数据存储**：LocalStorage
*   **辅助工具库**：
    *   `uuid`：用于生成笔记唯一标识符。
    *   `lodash`：用于实现防抖（debounce）功能。
    *   `date-fns`：用于格式化笔记的最后更新时间。


## 2. 项目结构
项目采用模块化、组件化的目录结构，便于维护和扩展。
```text
markdown-notes-app/
├── public/
├── src/
│   ├── assets/                # 静态资源（如图标等）
│   ├── components/            # 全局UI组件
│   │   ├── Sidebar/           # 左侧边栏组件
│   │   │   ├── SearchBar.tsx  # 搜索框
│   │   │   ├── NoteList.tsx   # 笔记列表
│   │   │   └── NoteItem.tsx   # 单个笔记卡片
│   │   ├── Editor/            # 中间编辑器组件
│   │   │   ├── TitleInput.tsx # 标题输入框
│   │   │   └── ContentArea.tsx# Markdown内容编辑区
│   │   └── Preview/           # 右侧预览组件
│   │       └── MarkdownPreview.tsx # 预览及代码高亮容器
│   ├── hooks/                 # 自定义Hooks
│   │   ├── useNotes.ts        # 笔记数据管理（CRUD及状态管理）
│   │   └── useDebounce.ts     # 防抖处理Hook
│   ├── types/                 # TypeScript类型定义
│   │   └── note.ts            # Note数据模型定义
│   ├── utils/                 # 工具函数
│   │   ├── storage.ts         # LocalStorage读写封装
│   │   └── format.ts          # 时间格式化、文本摘要提取等
│   ├── App.tsx                # 应用根组件，负责三栏式布局编排
│   ├── main.tsx               # 应用入口
│   └── index.css              # 全局样式与Tailwind引入
├── tailwind.config.js         # Tailwind配置
├── vite.config.ts             # Vite配置
├── tsconfig.json              # TS配置
└── package.json
```


## 3. 数据管理
*   **存储机制**：应用所有数据均存储在浏览器的 LocalStorage 中，Key可命名为 `markdown_notes_data`。
*   **数据结构**：每条笔记以对象形式存储，核心字段包括 `id` (字符串), `title` (字符串), `content` (字符串), `createdAt` (时间戳), `updatedAt` (时间戳)。
*   **状态管理**：采用 React Context 或自定义 Hooks (`useNotes`) 在顶层组件管理全局笔记状态，避免组件层层传递 props。状态内包含：笔记列表、当前选中的笔记ID、搜索关键词等。
*   **CRUD操作**：
    *   **Create**：点击“新建笔记”时，生成一个带有默认标题（如“无标题笔记”）和空内容的对象，插入到状态列表的最顶部，并同步写入 LocalStorage。
    *   **Read**：应用初始化时从 LocalStorage 读取数据，反序列化为笔记数组。根据选中的笔记ID获取当前展示的详情。
    *   **Update**：在编辑器中修改标题或内容时，更新内存中当前笔记对象的对应字段及 `updatedAt`，并防抖写入 LocalStorage。
    *   **Delete**：触发删除时弹出二次确认框，确认后从状态列表中过滤掉该条数据，并同步更新 LocalStorage。

    
## 4. 关键技术点
### 4.1 三栏式自适应布局
使用 Tailwind CSS 的 Flexbox 布局实现。外层容器采用 `flex`，左侧边栏固定宽度（`w-[250px]`），中间编辑器区和右侧预览区使用 `flex-1` 占据剩余空间，中间可通过 `border-r` 分割线增强视觉层次。
### 4.2 实时渲染与防抖处理
*   **防抖更新**：在编辑区输入内容时，直接更新 React 状态可能导致频繁重渲染。采用 `lodash.debounce` 或自定义 `useDebounce` Hook，设置 300ms 延迟。
*   **渲染机制**：将防抖后的文本内容传递给右侧预览组件，由 `react-markdown` 解析并实时渲染 HTML，避免输入卡顿。
### 4.3 Markdown解析与代码高亮
*   **组件配置**：使用 `react-markdown` 解析内容，并通过 `remark-gfm` 插件支持表格、删除线等语法。
*   **高亮定制**：通过配置 `react-markdown` 的 `components` 属性，覆写默认的 `code` 渲染逻辑。检测到代码块（多行）时，调用 `react-syntax-highlighter` 的 `Prism` 组件进行渲染。
*   **代码块特性**：配置高亮组件显示行号（`showLineNumbers`），应用深色主题背景，并在代码块右上角或右下角绝对定位一个“复制代码”按钮，点击时调用 `navigator.clipboard.writeText` 复制代码内容。
### 4.4 列表搜索与排序
*   **排序逻辑**：笔记列表在渲染前按 `updatedAt` 字段进行降序排序，确保最近修改的笔记排在最前。
*   **模糊搜索**：监听搜索框的输入，对当前所有的笔记列表进行过滤。过滤逻辑为：判断笔记的 `title` 和 `content` 中是否包含搜索关键词（不区分大小写，使用 `toLowerCase().includes()`）。搜索结果实时更新左侧列表。
### 4.5 空状态与交互体验
*   **空状态提示**：当笔记列表为空或搜索无结果时，侧边栏主体区域展示友好的空状态提示文案。
*   **二次确认**：删除笔记操作需阻断事件流，弹出模态框（Modal）或确认气泡（Popover），用户点击确认后才执行删除逻辑，防误删。
