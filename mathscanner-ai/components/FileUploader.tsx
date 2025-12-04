import React, { useCallback } from 'react';
import { UploadIcon } from './Icon';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group h-64
        ${disabled ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : 'border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100'}
      `}
    >
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        id="file-upload"
        onChange={handleInputChange}
        disabled={disabled}
      />
      <label htmlFor="file-upload" className={`cursor-pointer w-full h-full flex flex-col items-center justify-center ${disabled ? 'cursor-not-allowed' : ''}`}>
        <div className={`p-4 rounded-full mb-3 ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white text-blue-500 group-hover:scale-110 transition-transform shadow-sm'}`}>
          <UploadIcon />
        </div>
        <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          Kéo thả file vào đây
        </p>
        <p className={`text-sm mt-2 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
          Hỗ trợ: PDF, PNG, JPG
        </p>
      </label>
    </div>
  );
};

export default FileUploader;