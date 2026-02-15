import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { generateBlogResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatProps {
  isOpen: boolean;    // 是否显示
  onClose: () => void; // 关闭回调
  context: string;    // 博客文章内容（上下文）
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, context }) => {
  // 聊天记录状态
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I can help you summarize this article or answer specific questions about it.' }
  ]);
  const [input, setInput] = useState(''); // 输入框状态
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const messagesEndRef = useRef<HTMLDivElement>(null); // 用于滚动到底部的 ref

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // 处理发送消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // 1. 添加用户消息到列表
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 2. 调用 Gemini API
    const responseText = await generateBlogResponse(userMsg.text, context);

    // 3. 添加 AI 回复到列表
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 黑色半透明背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* 聊天窗口主体 */}
      <div className="bg-white dark:bg-[#1c1c1e] w-full max-w-md h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-slide-up z-50 ring-1 ring-black/5 dark:ring-white/10">
        
        {/* 顶部标题栏 */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
               <Bot size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Lumina AI</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* 消息列表区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* 消息气泡：用户（蓝色），AI（白色/深灰色） */}
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-[#2c2c2e] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {/* 加载中动画 */}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-white dark:bg-[#2c2c2e] p-3 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700 shadow-sm flex gap-1">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 底部输入框 */}
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#2c2c2e] rounded-full px-4 py-2 ring-2 ring-transparent focus-within:ring-blue-100 dark:focus-within:ring-blue-900 transition-all">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the article..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-full transition-all ${
                input.trim() 
                  ? 'bg-blue-600 text-white hover:scale-110' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;