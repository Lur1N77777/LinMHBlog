import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 获取 HTML 中的根节点
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 创建 React 根实例并渲染 App 组件
// React.StrictMode 用于在开发模式下检查潜在问题
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);