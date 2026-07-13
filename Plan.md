# Markdown笔记应用开发步骤

## 步骤一：项目初始化与基础环境搭建
请帮我初始化一个基于Vite + React 18 + TypeScript的项目，并配置Tailwind CSS作为样式方案。同时安装项目所需的核心依赖库：react-markdown、remark-gfm、react-syntax-highlighter，以及辅助工具库：uuid、lodash、date-fns。请配置好tailwind.config.js和tsconfig.json，确保项目可以正常启动。

## 步骤二：类型定义与基础工具封装
根据技术设计文档，在src/types/note.ts中定义Note数据模型（包含id, title, content, createdAt, updatedAt字段）。然后在src/utils/storage.ts中封装LocalStorage的读写方法（Key为markdown_notes_data），在src/utils/format.ts中封装时间格式化和文本摘要提取的工具函数。

## 步骤三：核心自定义Hooks开发
在src/hooks目录下开发两个核心Hook。首先是useDebounce.ts，实现通用的防抖逻辑（默认延迟300ms）。然后是useNotes.ts，实现笔记的全局状态管理，包括从LocalStorage初始化读取数据、新建笔记（生成uuid和默认标题）、更新笔记（修改标题/内容并更新时间戳）、删除笔记，以及搜索关键词状态管理。

## 步骤四：应用骨架与三栏式布局搭建
在App.tsx中实现宽屏三栏式Flexbox布局。外层使用flex，左侧边栏固定宽度w-[250px]，中间编辑器区和右侧预览区使用flex-1自适应宽度，区域间使用border-r分割线增强视觉层次。创建components/Sidebar、components/Editor、components/Preview三个目录，并在App.tsx中引入这三个模块的基础空壳组件。

## 步骤五：左侧边栏组件开发
实现src/components/Sidebar下的所有组件。包括：SearchBar（带搜索图标的输入框，过滤笔记）；顶部“+ 新建笔记”主操作按钮；NoteItem（单条笔记卡片，显示标题、更新时间、内容摘要及垃圾桶删除图标，点击删除需触发二次确认模态框）；NoteList（按updatedAt倒序排列列表，列表为空或无搜索结果时显示友好的空状态提示文案）。

## 步骤六：中间编辑器组件开发
实现src/components/Editor下的组件。包括：TitleInput（大字号的单行文本输入框，用于编辑笔记标题）；ContentArea（多行文本域，使用等宽字体如Fira Code，行高适中，支持Tab键缩进）。这两个组件需要绑定当前选中笔记的数据，输入变更时通过防抖机制更新全局状态。

## 步骤七：右侧预览与代码高亮组件开发
实现src/components/Preview/MarkdownPreview.tsx组件。使用react-markdown解析Markdown内容，通过remark-gfm插件支持表格等GFM语法。覆写code组件的渲染逻辑，使用react-syntax-highlighter的Prism组件对代码块进行语法高亮，配置深色主题、显示行号，并在代码块右下角绝对定位一个“复制代码”按钮，点击调用navigator.clipboard.writeText复制内容。

## 步骤八：整体集成与交互体验完善
将左侧列表、中间编辑器、右侧预览三个模块与useNotes Hook集成。实现点击左侧笔记卡片同步加载右侧编辑器和预览区数据；输入内容时右侧预览区实时（防抖）更新渲染。检查所有组件的交互细节，如二次确认防误删、空状态提示、搜索实时过滤等功能是否正常运作，确保整体应用无Bug运行。

