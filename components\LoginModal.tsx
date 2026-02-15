import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;                // 是否显示
  onClose: () => void;            // 关闭回调
  onLogin: (password: string) => void; // 提交登录回调
  isError: boolean;               // 是否显示错误状态
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, isError }) => {
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 打开弹窗时自动聚焦输入框并清空密码
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setPassword('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* 模糊背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* 登录卡片 */}
      <div className="bg-white dark:bg-[#1c1c1e] w-full max-w-sm rounded-3xl shadow-2xl p-8 relative animate-scale-up ring-1 ring-black/5 dark:ring-white/10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-900 dark:text-white">
            <Lock size={32} />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Author Access</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter password (admin) to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-[#2c2c2e] text-center text-2xl font-bold tracking-widest p-4 rounded-2xl border-2 outline-none transition-colors text-gray-900 dark:text-white ${isError ? 'border-red-500 shake' : 'border-transparent focus:border-blue-500'}`}
                placeholder="••••"
              />
            </div>
            {isError && <p className="text-red-500 text-sm text-center font-medium animate-pulse">Incorrect password</p>}
            
            <button 
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Access Dashboard <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;