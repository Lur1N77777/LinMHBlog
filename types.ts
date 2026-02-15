// 定义博客文章的数据结构
export interface BlogPost {
  id: string;        // 唯一标识符
  title: string;     // 文章标题
  excerpt: string;   // 文章摘要/简介
  content: string;   // 文章正文（支持 Markdown 格式）
  author: string;    // 作者名
  date: string;      // 发布日期
  readTime: string;  // 阅读预估时间
  category: string;  // 分类（如 Design, Tech）
  imageUrl: string;  // 封面图片 URL
}

// 定义当前视图的状态，用于简单的路由切换
// HOME: 主页, POST_DETAIL: 文章详情, ABOUT: 关于页, ADMIN: 后台管理
export type ViewState = 'HOME' | 'POST_DETAIL' | 'ABOUT' | 'ADMIN';

// 定义聊天消息结构
export interface ChatMessage {
  role: 'user' | 'model'; // 消息发送者：用户或 AI 模型
  text: string;           // 消息内容
}

// 定义评论数据结构
export interface Comment {
  id: string;           // 唯一标识符
  postId: string;       // 所属文章 ID
  author: string;       // 评论者名称
  content: string;      // 评论内容
  date: string;         // 评论时间
  avatar?: string;      // 评论者头像 URL
}