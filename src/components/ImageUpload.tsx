 
'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploaded(false);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Store file info in localStorage for this demo
      const fileData = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: previewUrl,
        uploadedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('uploadedProduct', JSON.stringify(fileData));
      setUploaded(true);
      
      // Clean up previous uploads from localStorage if needed
      const existingUploads = JSON.parse(localStorage.getItem('productUploads') || '[]');
      existingUploads.push(fileData);
      localStorage.setItem('productUploads', JSON.stringify(existingUploads));
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Upload Product Image
        </h2>
        
        {!selectedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload a product image
            </h3>
            <p className="text-gray-500 mb-4">
              PNG, JPG, GIF up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose File
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-96 object-contain rounded-lg border"
              />
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              {!uploaded ? (
                <button
                  onClick={handleUpload}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save to Local Storage
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Saved!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
