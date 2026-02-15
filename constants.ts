import { BlogPost } from './types';

// 默认的博客文章列表
// 如果本地存储中没有数据，将使用此列表初始化
export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Minimalism in Digital Design',
    excerpt: 'Exploring how less creates more in the world of modern user interface design.',
    content: `
# The Art of Minimalism

Minimalism is not just about removing elements; it's about adding meaning. In digital design, every pixel typically fights for the user's attention. By stripping away the non-essential, we amplify the essential.

## White Space is an Active Element

White space (or negative space) is often misunderstood as "empty" space. However, in UI design, it is a layout tool as powerful as color or typography. It dictates hierarchy, improves readability, and creates a sense of luxury and calm.

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint-Exupéry

## Typography as Interface

When you remove heavy borders, gradients, and shadows, typography steps forward. The weight, size, and leading of your type become the primary interface elements. A well-set headline can guide a user better than a flashy button.

### Core Principles
1. **Clarity**: The interface should be self-explanatory.
2. **Efficiency**: Reduce the cognitive load.
3. **Consistency**: Build trust through predictable patterns.

Embracing minimalism allows us to build faster, more accessible, and more timeless digital products.
    `,
    author: 'Alex Chen',
    date: 'Oct 12, 2023',
    readTime: '4 min read',
    category: 'Design',
    imageUrl: 'https://picsum.photos/800/600?random=1',
  },
  {
    id: '2',
    title: 'Understanding React Server Components',
    excerpt: 'A deep dive into the future of React and how RSCs change the paradigm.',
    content: `
# React Server Components (RSC)

React Server Components represent the biggest shift in the React ecosystem since Hooks. They allow us to render components exclusively on the server, reducing the bundle size sent to the client.

## Why RSC?

Traditional React apps (CSR) send a large JavaScript bundle to the browser. The browser then executes this bundle to render the UI. With RSC, we can do the heavy lifting on the server.

*   **Zero Bundle Size**: Server components' code is not sent to the client.
*   **Direct Backend Access**: Query your database directly inside your component without an API layer in between.

## The Hybrid Model

The beauty of RSC is that it combines the best of server-side rendering with the rich interactivity of client-side React. You can interleave Server Components and Client Components seamlessly.

\`\`\`tsx
// ServerComponent.tsx
import db from './db';

async function NoteList() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => <p>{note.title}</p>)}
    </div>
  );
}
\`\`\`

This paradigm shift requires a mental model adjustment, but the performance benefits for content-heavy applications are undeniable.
    `,
    author: 'Alex Chen',
    date: 'Nov 05, 2023',
    readTime: '6 min read',
    category: 'Engineering',
    imageUrl: 'https://picsum.photos/800/600?random=2',
  },
  {
    id: '3',
    title: 'Captured Moments: A Week in Tokyo',
    excerpt: 'A photo journal of neon lights, quiet shrines, and endless rain.',
    content: `
# Tokyo: A City of Contrasts

Tokyo is a city that never truly sleeps, yet offers pockets of profound silence. Last week, I wandered through the streets of Shinjuku and the gardens of the Imperial Palace.

## Shinjuku Nights

The neon lights of Kabukicho are overwhelming in the best way possible. It feels like stepping into a cyberpunk future. The energy is palpable, a constant hum of humanity moving in sync.

## Meiji Shrine

Just a few stops away lies the Meiji Shrine. Surrounded by a massive forest, the sounds of the city fade away. It's a reminder that nature and technology can coexist.

I recommend everyone visit Tokyo at least once. It challenges your perceptions of order, chaos, and beauty.
    `,
    author: 'Alex Chen',
    date: 'Dec 15, 2023',
    readTime: '3 min read',
    category: 'Photography',
    imageUrl: 'https://picsum.photos/800/600?random=3',
  },
  {
    id: '4',
    title: 'The Future of AI Assistants',
    excerpt: 'How LLMs are transforming our daily workflows and creative processes.',
    content: `
# AI as a Partner, Not a Replacement

The narrative around AI often centers on replacement. However, the most powerful use case I've found is **augmentation**.

## Coding with AI

Using tools like Gemini allows me to prototype faster. It's not about letting the AI write the code blindly, but using it to scaffold ideas, write boilerplate, and explain complex regex.

## Creative Writing

AI can be a cure for writer's block. Asking an LLM to "describe a rainy scene in a noir style" gives me a starting point that I can refine and make my own.

The future belongs to those who learn to dance with these algorithms, directing them with intent and creativity.
    `,
    author: 'Alex Chen',
    date: 'Jan 10, 2024',
    readTime: '5 min read',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/800/600?random=4',
  }
];

// 全局应用名称
export const APP_NAME = "Lumina.";