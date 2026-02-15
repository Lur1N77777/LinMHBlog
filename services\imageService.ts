/**
 * 图片上传服务
 * 注意：此服务使用 base64 存储，仅适用于小图片
 * 生产环境建议使用云存储服务（如 Cloudinary, AWS S3 等）
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB 限制
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * 验证图片文件
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '仅支持 JPEG, PNG, GIF, WebP 格式' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '图片大小不能超过 2MB' };
  }
  return { valid: true };
};

/**
 * 将图片转换为 base64
 * 返回 Promise<string> 图片的 data URL
 */
export const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const validation = validateImage(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('图片读取失败'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 从 URL 或 base64 获取图片
 * 如果是有效的 base64 则直接返回，否则假设是 URL
 */
export const getImageUrl = (imageSource: string): string => {
  if (imageSource.startsWith('data:') || imageSource.startsWith('http')) {
    return imageSource;
  }
  // 默认使用随机图片
  return `https://picsum.photos/800/600?random=${Date.now()}`;
};
