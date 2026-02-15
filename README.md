# Lumina Blog - 个人博客系统使用说明

这是一个基于 React, TypeScript 和 Tailwind CSS 构建的高性能、高颜值的个人博客系统。它模仿了 Apple 官网的审美风格，拥有流畅的 iOS 级动画效果，并集成了 Google Gemini AI 功能。

## 目录结构与文件说明

以下是项目中每个文件的作用及修改指南：

### 1. 核心配置文件

- **`index.html`**
  - **作用**: 网站的入口 HTML 文件。包含 Tailwind CSS 的配置、全局样式（字体、滚动条隐藏、玻璃拟态效果）以及动画关键帧定义。
  - **如何修改**:
    - **修改字体**: 在 `tailwind.config` 的 `fontFamily` 中修改。
    - **修改深色模式颜色**: 在 `colors.dark` 对象中修改十六进制颜色代码。
    - **修改动画速度**: 在 `animation` 对象中调整时间（如 `0.5s`）。

- **`metadata.json`**
  - **作用**: 定义应用的基本元数据（名称、描述）。通常用于打包工具或 SEO。

### 2. 数据与类型定义

- **`constants.ts`**
  - **作用**: 存放网站的静态常量数据。
  - **如何修改**:
    - **修改网站名称**: 修改 `APP_NAME` 变量的值（例如改为 "My Blog."）。
    - **修改初始文章**: 修改 `BLOG_POSTS` 数组。这是网站初始化时默认加载的文章数据（如果本地缓存为空）。

- **`types.ts`**
  - **作用**: TypeScript 的类型定义文件。定义了文章 (`BlogPost`)、视图状态 (`ViewState`) 等数据结构，保证代码的健壮性。

### 3. 主逻辑与入口

- **`index.tsx`**
  - **作用**: React 的挂载入口。将 `App` 组件渲染到 HTML 的 `root` 节点上。

- **`App.tsx`**
  - **作用**: 整个应用程序的主组件。
  - **功能**:
    - **路由管理**: 控制当前显示的是主页、文章详情、关于页面还是管理员后台。
    - **状态管理**: 管理文章列表数据（包含本地存储 `localStorage` 的读取与保存）、深色模式状态、模态框的开关。
    - **管理员逻辑**: 这里包含硬编码的管理员密码逻辑。
  - **如何修改**:
    - **修改管理员密码**: 搜索 `handleLoginAttempt` 函数，将 `password === 'admin'` 中的 `'admin'` 改为你想要的密码。

### 4. 服务层

- **`services/geminiService.ts`**
  - **作用**: 负责与 Google Gemini API 进行通信。
  - **如何修改**:
    - **配置 API Key**: 代码默认从环境变量读取，或者你可以为了测试直接将 `apiKey` 变量赋值为你的 Key（**注意：生产环境请勿直接暴露 Key**）。
    - **修改 AI 人设**: 修改 `systemInstruction` 变量中的提示词，改变 AI 的回答风格。

### 5. 组件库 (`components/`)

- **`Header.tsx`** (顶部导航栏)
  - 包含 Logo、菜单链接、搜索按钮和深色模式切换开关。
  - 处理滚动时的玻璃拟态效果变化。

- **`PostCard.tsx`** (文章卡片)
  - 首页展示的单个文章预览卡片。包含悬停放大动画和图片展示。

- **`PostDetail.tsx`** (文章详情页)
  - 展示文章的完整内容。
  - **功能**: 包含 Hero 大图、Markdown 内容渲染（简易版）、以及右下角的 "Ask AI" 悬浮按钮。

- **`AdminDashboard.tsx`** (后台管理)
  - 管理员专用的界面。
  - **功能**: 添加新文章、编辑现有文章、删除文章。支持 Markdown 格式输入。

- **`LoginModal.tsx`** (登录弹窗)
  - 漂亮的 iOS 风格密码输入弹窗，用于进入后台管理。

- **`AIChat.tsx`** (AI 聊天框)
  - 点击 "Ask AI" 后弹出的对话框。
  - 处理与 Gemini API 的消息发送和接收 UI。

- **`SearchOverlay.tsx`** (搜索全屏层)
  - 点击搜索图标弹出的全屏搜索界面。支持实时过滤文章标题、摘要和分类。

---

## 常见修改指南 (FAQ)

### Q1: 我怎么把网站名字改成我自己的？
打开 `constants.ts` 文件，找到最后一行：
```typescript
export const APP_NAME = "Lumina."; // 把 "Lumina." 改成你的名字
```

### Q2: 管理员密码在哪里改？默认是多少？
默认密码是 `admin`。
打开 `App.tsx` 文件，搜索 `handleLoginAttempt` 函数：
```typescript
const handleLoginAttempt = (password: string) => {
  if (password === 'admin') { // 改这里
     // ...
  }
  // ...
};
```

### Q3: 为什么 AI 功能没反应？
你需要一个 Google Gemini 的 API Key。
1. 去 Google AI Studio 申请 Key。
2. 打开 `services/geminiService.ts`。
3. 临时测试可以将 `const apiKey = process.env.API_KEY || '';` 改为 `const apiKey = '你的_API_KEY';`。

### Q4: 怎么添加新文章？
1. 在网页底部点击那个**锁**的图标。
2. 输入密码（默认 `admin`）。
3. 进入后台，在左侧表单填写标题、摘要、内容（支持 Markdown）和图片链接，点击保存即可。数据会保存在你的浏览器中。

### Q5: 怎么更换所有的默认背景图？
默认使用的是 `picsum.photos` 的随机图。你可以在 `constants.ts` 中修改初始数据的 `imageUrl`，或者在后台添加文章时填入你自己的图片 URL。

---

## 技术栈
- **核心框架**: React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS (包含自定义动画配置)
- **图标库**: Lucide React
- **AI 模型**: Google Gemini (`gemini-3-flash-preview`)
