'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function ImageUpload({ onUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB max size
  });

  return (
    <div 
      {...getRootProps()} 
      className={`upload-container ${isDragActive ? 'border-green-500 bg-green-50/60 dark:bg-green-900/30' : ''} dark:border-green-700 dark:bg-gray-800/70`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center p-4">
        <Image 
          src="/img/upload-icon.svg" 
          alt="Upload" 
          width={80} 
          height={80} 
          className="mb-4 text-green-500"
        />
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
          {isDragActive ? 'Drop your plant image here' : 'Drop your plant image here'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          or click to browse from your device
        </p>
        <button className="btn-primary">
          Select Image
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Supported formats: JPG, PNG, WebP (max 10MB)
        </p>
      </div>
    </div>
  );
}
