import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { Comment } from '../types';
import { getCommentsByPostId, addComment } from '../services/commentService';

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // 加载评论
  useEffect(() => {
    const loadedComments = getCommentsByPostId(postId);
    setComments(loadedComments);
  }, [postId, isExpanded]); // 依赖 isExpanded 确保提交后刷新

  // 提交评论
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !newComment.trim()) return;

    addComment({
      postId,
      author: authorName.trim(),
      content: newComment.trim(),
    });

    setNewComment('');
    // 不重置作者名，方便连续评论
  };

  return (
    <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>
      </div>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          {!isExpanded ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full text-left text-gray-500 dark:text-gray-400 py-3 px-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              Write a comment...
            </button>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                  Post Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1c1c1e] transition-colors"
            >
              {/* 头像 */}
              <div className="flex-shrink-0">
                {comment.avatar ? (
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>

              {/* 评论内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comment.author}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {comment.date}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
