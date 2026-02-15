import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { BlogPost } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, posts, onSelectPost }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当搜索框打开时，自动聚焦输入框并禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // 实时搜索过滤逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = posts.filter(
      post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.category.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query, posts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className="max-w-3xl mx-auto px-6 pt-24 h-full flex flex-col">
        
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        {/* 巨大的搜索输入框 */}
        <div className="relative mb-12">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={32} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Journal..."
            className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-800 py-4 pl-12 text-3xl font-bold text-gray-900 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-700 transition-colors"
          />
        </div>

        {/* 搜索结果列表 */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          {results.length > 0 ? (
            <div className="grid gap-4">
              {results.map(post => (
                <div 
                  key={post.id}
                  onClick={() => { onSelectPost(post); onClose(); }}
                  className="group flex gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <img src={post.imageUrl} alt={post.title} className="w-24 h-24 object-cover rounded-lg bg-gray-200" />
                  <div>
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wide">{post.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{post.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center text-gray-400 mt-20">No stories found matching "{query}"</div>
          ) : (
             <div className="text-center text-gray-400 mt-20">Start typing to search...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;