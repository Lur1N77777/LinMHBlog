import React, { useEffect } from 'react';
import { ArrowLeft, Clock, Share2, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';
import Comments from './Comments';

interface PostDetailProps {
  post: BlogPost;          // 当前显示的文章
  onBack: () => void;      // 返回按钮回调
  onOpenAI: () => void;    // 打开 AI 聊天回调
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onOpenAI }) => {
  
  // 进入详情页时自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="animate-fade-in pb-20 bg-white dark:bg-black min-h-screen">
      {/* Hero 区域：大图背景 */}
      <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        {/* 渐变遮罩，保证文字可读性 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* 返回按钮 */}
        <div className="absolute top-24 left-6 md:left-12">
           <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20"
          >
            <ArrowLeft size={16} /> Back to Journal
          </button>
        </div>

        {/* 标题和元数据信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-white/80 text-sm font-medium mb-3 uppercase tracking-wider">
            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">{post.category}</span>
            <span>{post.date}</span>
            <span className="flex items-center gap-1"><Clock size={14}/> {post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
             {/* 作者头像 (使用 ui-avatars 生成) */}
             <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden ring-2 ring-white/20">
                <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} />
             </div>
             <span className="text-white font-medium">{post.author}</span>
          </div>
        </div>
      </div>

      {/* 正文内容区域 */}
      <div className="max-w-2xl mx-auto px-6 mt-12">
        {/* 使用 Tailwind Typography 插件样式 (prose) */}
        <div className="prose prose-lg prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl">
          {/* 简易 Markdown 渲染：按行分割并根据前缀判断元素类型 */}
          {/* 注意：在生产环境中建议使用 react-markdown 等库 */}
          {post.content.split('\n').map((line, idx) => {
            if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{line.replace('## ', '')}</h2>;
            if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">{line.replace('### ', '')}</h3>;
            if (line.startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-300 my-6">{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('```')) return <div key={idx} className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800">Code Block Placeholder</div>;
            if (line.trim() === '') return <br key={idx} />;
            return <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{line}</p>;
          })}
        </div>

        <hr className="my-12 border-gray-200 dark:border-gray-800" />

        {/* 评论区 */}
        <Comments postId={post.id} />

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between">
           <div className="text-gray-500 dark:text-gray-400 text-sm">Thanks for reading.</div>
           <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                  <Share2 size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* 右下角悬浮 AI 按钮 */}
      <div className="fixed bottom-8 right-8 z-30">
        <button 
          onClick={onOpenAI}
          className="group flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        >
          <Sparkles size={20} className="group-hover:animate-spin" />
          <span className="font-semibold pr-1">Ask AI</span>
        </button>
      </div>
    </article>
  );
};

export default PostDetail;