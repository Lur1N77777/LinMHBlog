import React, { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { BlogPost } from '../types';
import { getCommentCount } from '../services/commentService';

interface PostCardProps {
  post: BlogPost;                  // 文章数据对象
  onClick: (post: BlogPost) => void; // 点击回调
  index: number;                   // 索引，用于计算动画延迟
}

// 首页显示的文章预览卡片
const PostCard: React.FC<PostCardProps> = ({ post, onClick, index }) => {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    setCommentCount(getCommentCount(post.id));
  }, [post.id]);

  return (
    <div 
      onClick={() => onClick(post)}
      // animate-slide-up: 应用上滑出现动画
      // group: 用于控制子元素的悬停效果
      className="group cursor-pointer flex flex-col gap-4 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }} // 阶梯式动画延迟，实现瀑布流出现效果
    >
      {/* 图片容器：处理悬停放大效果 */}
      <div className="overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-[4/3] relative">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        {/* 黑色遮罩，悬停时变暗一点点 */}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* 文本内容 */}
      <div className="flex flex-col gap-2">
        {/* 元数据：分类和日期 */}
        <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
          <span className="text-blue-600 dark:text-blue-400">{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
          {commentCount > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {commentCount}
              </span>
            </>
          )}
        </div>
        
        {/* 标题 */}
        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {post.title}
        </h3>
        
        {/* 摘要：限制显示2行 */}
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* "阅读更多" 链接，悬停时出现 */}
        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white mt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
          Read Article <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;