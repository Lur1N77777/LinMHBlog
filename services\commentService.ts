import { Comment } from '../types';

const STORAGE_KEY = 'lumina_comments';

/**
 * 评论服务 - 使用 localStorage 存储评论数据
 * 在生产环境中可替换为后端 API
 */

// 获取本地存储的评论
export const getComments = (): Comment[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load comments:', error);
    return [];
  }
};

// 获取某篇文章的所有评论
export const getCommentsByPostId = (postId: string): Comment[] => {
  const allComments = getComments();
  return allComments
    .filter(comment => comment.postId === postId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// 添加新评论
export const addComment = (comment: Omit<Comment, 'id' | 'date'>): Comment => {
  const allComments = getComments();
  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
  };
  allComments.push(newComment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  return newComment;
};

// 删除评论
export const deleteComment = (commentId: string): void => {
  const allComments = getComments();
  const filtered = allComments.filter(comment => comment.id !== commentId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// 获取评论数量
export const getCommentCount = (postId: string): number => {
  const allComments = getComments();
  return allComments.filter(comment => comment.postId === postId).length;
};
