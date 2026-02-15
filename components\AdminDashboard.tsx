import React, { useState } from 'react';
import { BlogPost } from '../types';
import { Trash2, Edit2, Plus, LogOut, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface AdminDashboardProps {
  posts: BlogPost[];               // 现有的文章列表
  onSave: (post: BlogPost) => void; // 保存文章回调
  onDelete: (id: string) => void;   // 删除文章回调
  onLogout: () => void;             // 退出登录回调
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, onSave, onDelete, onLogout }) => {
  const [editingId, setEditingId] = useState<string | null>(null); // 当前正在编辑的文章ID
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 重置表单到初始状态
  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setImageUrl('');
    setEditingId(null);
  };

  // 填充表单以进行编辑
  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setImageUrl(post.imageUrl);
  };

  // 提交表单处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: editingId || Date.now().toString(), // 如果是编辑则用原ID，否则生成新时间戳ID
      title,
      excerpt,
      content,
      category,
      imageUrl: imageUrl || `https://picsum.photos/800/600?random=${Date.now()}`, // 默认随机图片
      author: 'Admin', // 默认为管理员
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min read`, // 简单估算阅读时间
    };
    onSave(newPost);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-32 pb-20 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editorial Dashboard</h1>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 左侧：编辑/新建表单 */}
          <div className="bg-white dark:bg-[#1c1c1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
             <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                {editingId ? <Edit2 size={20} /> : <Plus size={20} />} 
                {editingId ? 'Edit Article' : 'New Article'}
             </h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                   <input required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                   <input required className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" value={category} onChange={e => setCategory(e.target.value)} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                   <textarea required rows={3} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={excerpt} onChange={e => setExcerpt(e.target.value)} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown)</label>
                   <textarea required rows={8} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-none font-mono text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={content} onChange={e => setContent(e.target.value)} />
                </div>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                />
                
                <div className="flex gap-3 pt-4">
                    {editingId && (
                        <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> Save Article
                    </button>
                </div>
             </form>
          </div>

          {/* 右侧：文章列表 */}
          <div className="space-y-4">
             <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Existing Stories</h2>
             {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-[#1c1c1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 group">
                   <img src={post.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                   <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{post.title}</h3>
                      <p className="text-xs text-gray-500">{post.date}</p>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(post)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => onDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;