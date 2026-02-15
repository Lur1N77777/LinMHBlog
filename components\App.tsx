import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PostCard from './components/PostCard';
import PostDetail from './components/PostDetail';
import AIChat from './components/AIChat';
import AdminDashboard from './components/AdminDashboard';
import SearchOverlay from './components/SearchOverlay';
import LoginModal from './components/LoginModal';
import { BLOG_POSTS } from './constants';
import { BlogPost, ViewState } from './types';
import { Lock } from 'lucide-react';

function App() {
  // 视图状态：控制当前显示页面
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  // 选中的文章，用于详情页显示
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // 模态框状态控制
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // 文章列表数据状态
  // 初始化时尝试从 localStorage 读取，实现数据持久化，如果没有则使用默认数据
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('lumina_posts');
        return saved ? JSON.parse(saved) : BLOG_POSTS;
    }
    return BLOG_POSTS;
  });

  // 深色模式状态
  // 初始化时检测系统偏好或 localStorage 配置
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
       return localStorage.getItem('theme') === 'dark' || 
       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // 管理员登录状态
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // 当文章列表变化时，同步保存到 localStorage
  useEffect(() => {
    localStorage.setItem('lumina_posts', JSON.stringify(posts));
  }, [posts]);

  // 当深色模式变化时，更新 HTML class 和 localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // 处理文章点击：切换视图到详情页
  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('POST_DETAIL');
    setIsAIChatOpen(false);
  };

  // 处理返回主页
  const handleBack = () => {
    setCurrentView('HOME');
    setSelectedPost(null);
  };

  // 处理管理员登录尝试
  const handleLoginAttempt = (password: string) => {
    if (password === 'admin') { // 默认密码为 admin
       setIsAdminLoggedIn(true);
       setCurrentView('ADMIN');
       setIsLoginModalOpen(false);
       setLoginError(false);
    } else {
       setLoginError(true);
    }
  };

  // 保存文章（新增或编辑）
  const handleSavePost = (post: BlogPost) => {
    setPosts(prev => {
        const exists = prev.find(p => p.id === post.id);
        if (exists) {
            // 如果存在则更新
            return prev.map(p => p.id === post.id ? post : p);
        }
        // 如果不存在则添加到头部
        return [post, ...prev];
    });
  };

  // 删除文章
  const handleDeletePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
        setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  // 根据当前视图状态渲染不同的内容
  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 animate-fade-in min-h-screen">
            <div className="mb-16 md:mb-24 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Insights for the <br /> 
                <span className="text-gray-500 dark:text-gray-400">Curious Mind.</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                A digital garden exploring design, technology, and the subtle art of living well in a hyper-connected world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {posts.map((post, index) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onClick={handlePostClick}
                  index={index}
                />
              ))}
            </div>
          </main>
        );
      
      case 'POST_DETAIL':
        return selectedPost ? (
          <PostDetail 
            post={selectedPost} 
            onBack={handleBack} 
            onOpenAI={() => setIsAIChatOpen(true)}
          />
        ) : null;
      
      case 'ABOUT':
        return (
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 animate-fade-in min-h-screen">
                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">About</h1>
                <div className="prose prose-lg text-gray-600 dark:text-gray-400">
                    <p>
                        Welcome to Lumina. This is a concept blog demonstrating high-performance React patterns, 
                        Tailwind styling with an Apple-inspired aesthetic, and integration with the latest Google Gemini models.
                    </p>
                    <p>
                        The goal is to create a reading experience that feels native, fluid, and calm.
                        No clutter, just content.
                    </p>
                    <p className="mt-8 font-medium text-gray-900 dark:text-white">
                        Built with React, TypeScript, Tailwind CSS, and Gemini API.
                    </p>
                </div>
                 <button 
                    onClick={() => setCurrentView('HOME')}
                    className="mt-12 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                 >
                    Back to Journal
                 </button>
            </main>
        );

      case 'ADMIN':
        if (!isAdminLoggedIn) { setCurrentView('HOME'); return null; }
        return (
            <AdminDashboard 
                posts={posts} 
                onSave={handleSavePost} 
                onDelete={handleDeletePost}
                onLogout={() => { setIsAdminLoggedIn(false); setCurrentView('HOME'); }}
            />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 bg-[#f5f5f7] dark:bg-black transition-colors duration-300">
      
      {/* 顶部导航栏 (非后台模式显示) */}
      {currentView !== 'ADMIN' && (
        <Header 
            onNavigate={setCurrentView} 
            currentView={currentView} 
            onSearchClick={() => setIsSearchOpen(true)}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        />
      )}
      
      {/* 主内容区域 */}
      {renderContent()}

      {/* 各种全局模态框组件 */}
      <AIChat 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)}
        context={selectedPost?.content || ''}
      />

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        onSelectPost={handlePostClick}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginAttempt}
        isError={loginError}
      />
      
      {/* 底部 Footer */}
      <footer className="py-12 text-center text-sm text-gray-400 dark:text-gray-600 flex flex-col items-center gap-4">
         <p>&copy; {new Date().getFullYear()} Lumina Blog. Crafted with precision.</p>
         {/* 管理员登录触发器 (仅在非后台模式显示) */}
         {currentView !== 'ADMIN' && (
            <button 
                onClick={() => {
                    setLoginError(false);
                    setIsLoginModalOpen(true);
                }} 
                className="opacity-30 hover:opacity-100 transition-opacity p-2"
                aria-label="Admin Login"
            >
                <Lock size={14} />
            </button>
         )}
      </footer>
    </div>
  );
}

export default App;