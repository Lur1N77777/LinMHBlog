import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../services/imageService';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const dataUrl = await uploadImage(file);
      setPreview(dataUrl);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Cover Image
      </label>

      {/* 图片预览区域 */}
      {(preview || value) && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={preview || value}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 上传选项 */}
      {!preview && !value && (
        <div className="space-y-3">
          {/* 本地上传按钮 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} className="text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Click to upload (max 2MB)
                </span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* 分隔符 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* URL 输入 */}
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="url"
              placeholder="Enter image URL"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-[#2c2c2e] border-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
