'use client';

import { useState, useEffect } from 'react';
import { Clock, Download, Trash2 } from 'lucide-react';

interface GeneratedAd {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  mood: string;
  createdAt: string;
}

export default function AdsHistory() {
  const [ads, setAds] = useState<GeneratedAd[]>([]);

  useEffect(() => {
    const savedAds = localStorage.getItem('generatedAds');
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    }
  }, []);

  const deleteAd = (id: string) => {
    const updatedAds = ads.filter(ad => ad.id !== id);
    setAds(updatedAds);
    localStorage.setItem('generatedAds', JSON.stringify(updatedAds));
  };

  const downloadAd = (imageUrl: string, id: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-ad-${id}.png`;
    link.click();
  };

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No ads generated yet</h3>
        <p className="text-gray-600">Your generated ads will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ads.map((ad) => (
        <div key={ad.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={ad.imageUrl} 
            alt="Generated Ad" 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ad.prompt}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{ad.style}</span>
              <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadAd(ad.imageUrl, ad.id)}
                className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <Download className="h-3 w-3" />
                <span>Download</span>
              </button>
              <button
                onClick={() => deleteAd(ad.id)}
                className="flex items-center justify-center p-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
