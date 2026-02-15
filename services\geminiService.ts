import { GoogleGenAI } from "@google/genai";

// 从环境变量获取 API Key
// 注意：在实际生产环境中，建议通过后端代理请求，而不是在前端直接暴露 Key
const apiKey = process.env.API_KEY || '';

// 初始化 Google GenAI 客户端
const ai = new GoogleGenAI({ apiKey });

/**
 * 生成博客问答响应
 * @param prompt 用户的问题
 * @param context 当前博客文章的内容（作为上下文）
 * @returns AI 生成的回答
 */
export const generateBlogResponse = async (
  prompt: string,
  context: string
): Promise<string> => {
  try {
    if (!apiKey) {
      return "Please configure the API_KEY in your environment variables to use the AI features.";
    }

    // 系统提示词：定义 AI 的角色、目标和限制
    const systemInstruction = `
      You are an intelligent assistant for the "Lumina" blog.
      You have access to the content of the blog post the user is currently reading.
      Your goal is to answer user questions about the specific blog post, summarize sections, or provide insights based on the text.
      
      Rules:
      1. Be concise, elegant, and helpful.
      2. Keep the tone professional yet warm, matching the blog's aesthetic.
      3. If the answer isn't in the context, say so politely.
      
      Current Blog Post Context:
      ${context}
    `;

    // 调用 Gemini API 生成内容
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // 使用最新的 Flash 模型，速度快
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while communicating with the AI services.";
  }
};