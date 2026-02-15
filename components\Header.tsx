import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Moon, Sun } from 'lucide-react';
import { APP_NAME } from '../constants';
import { ViewState } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewState) => void; // 导航回调函数
  currentView: ViewState;                // 当前所在页面
  onSearchClick: () => void;             // 点击搜索回调
  isDarkMode: boolean;                   // 当前是否为深色模式
  toggleDarkMode: () => void;            // 切换深色模式
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  currentView, 
  onSearchClick,
  isDarkMode,
  toggleDarkMode 
}) => {
  const [isScrolled, setIsScrolled] = useState(false); // 监听页面是否滚动
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 移动端菜单开关

  // 监听滚动事件，用于改变 Header 的背景样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 生成导航项的样式类名：处理选中态和悬停态，适配深色模式
  const navClass = (view: ViewState) => 
    `cursor-pointer text-sm font-medium transition-colors duration-300 ${
      currentView === view 
        ? 'text-black dark:text-white' 
        : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
    }`;

  return (
    <>
      {/* 顶部 Header 栏 */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          // 如果滚动了或者移动端菜单打开了，显示玻璃拟态背景，否则全透明
          isScrolled || isMobileMenuOpen
            ? 'glass-panel shadow-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('HOME')}
            className="text-xl font-bold tracking-tight cursor-pointer select-none text-black dark:text-white"
          >
            {APP_NAME}
          </div>

          {/* 桌面端导航菜单 (hidden md:flex) */}
          <nav className="hidden md:flex items-center space-x-8">
            <div onClick={() => onNavigate('HOME')} className={navClass('HOME')}>Journal</div>
            <div onClick={() => onNavigate('ABOUT')} className={navClass('ABOUT')}>About</div>
            {/* 分隔线 */}
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-2"></div>
            
            {/* 搜索按钮 */}
            <button 
              onClick={onSearchClick}
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <Search size={18} />
            </button>
            
            {/* 深色模式切换按钮 */}
            <button 
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                onClick={toggleDarkMode}
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          {/* 移动端菜单切换按钮 (md:hidden) */}
          <div className="md:hidden flex items-center gap-4 text-black dark:text-white">
             <button onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={onSearchClick}>
                <Search size={20} />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* 移动端全屏菜单遮罩层 */}
      <div 
        className={`fixed inset-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div 
            onClick={() => { onNavigate('HOME'); setIsMobileMenuOpen(false); }} 
            className="text-3xl font-semibold text-gray-900 dark:text-white"
          >
            Journal
          </div>
          <div 
            onClick={() => { onNavigate('ABOUT'); setIsMobileMenuOpen(false); }} 
            className="text-3xl font-semibold text-gray-900 dark:text-white"
          >
            About
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;