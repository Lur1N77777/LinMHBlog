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
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Modals State
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // State for posts (persisted in local storage)
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('lumina_posts');
        return saved ? JSON.parse(saved) : BLOG_POSTS;
    }
    return BLOG_POSTS;
  });

  // State for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
       return localStorage.getItem('theme') === 'dark' || 
       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // State for Admin Login
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('lumina_posts', JSON.stringify(posts));
  }, [posts]);

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

  // Navigation Handlers
  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('POST_DETAIL');
    setIsAIChatOpen(false);
  };

  const handleBack = () => {
    setCurrentView('HOME');
    setSelectedPost(null);
  };

  const handleLoginAttempt = (password: string) => {
    if (password === 'admin') {
       setIsAdminLoggedIn(true);
       setCurrentView('ADMIN');
       setIsLoginModalOpen(false);
       setLoginError(false);
    } else {
       setLoginError(true);
    }
  };

  const handleSavePost = (post: BlogPost) => {
    setPosts(prev => {
        const exists = prev.find(p => p.id === post.id);
        if (exists) {
            return prev.map(p => p.id === post.id ? post : p);
        }
        return [post, ...prev];
    });
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
        setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

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
      
      {currentView !== 'ADMIN' && (
        <Header 
            onNavigate={setCurrentView} 
            currentView={currentView} 
            onSearchClick={() => setIsSearchOpen(true)}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        />
      )}
      
      {renderContent()}

      {/* Modals */}
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
      
      {/* Footer */}
      <footer className="py-12 text-center text-sm text-gray-400 dark:text-gray-600 flex flex-col items-center gap-4">
         <p>&copy; {new Date().getFullYear()} Lumina Blog. Crafted with precision.</p>
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