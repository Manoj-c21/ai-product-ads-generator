'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { generateImageWithOpenAI, generateImageWithStability } from '@/lib/ai-service';

interface ProductData {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export default function AdGenerator() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [mood, setMood] = useState('energetic');
  const [aiProvider, setAiProvider] = useState('stability');
  const [generatedAd, setGeneratedAd] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load uploaded product from localStorage
  useEffect(() => {
    const uploaded = localStorage.getItem('uploadedProduct');
    if (uploaded) {
      setProductData(JSON.parse(uploaded));
    }
  }, []);

  const generateAd = async () => {
    if (!productData) {
      alert('Please upload a product image first!');
      return;
    }

    if (!prompt.trim()) {
      alert('Please enter a description for your ad!');
      return;
    }

    setLoading(true);
    
    try {
      let generatedImageUrl;
      
      if (aiProvider === 'openai') {
        generatedImageUrl = await generateImageWithOpenAI(prompt, style, mood);
      } else {
        generatedImageUrl = await generateImageWithStability(prompt, style, mood);
      }
      
      setGeneratedAd(generatedImageUrl);
      
      // Save generated ad to localStorage
      const adData = {
        id: Date.now().toString(),
        imageUrl: generatedImageUrl,
        prompt: prompt,
        style: style,
        mood: mood,
        createdAt: new Date().toISOString(),
        originalProduct: productData,
        aiProvider: aiProvider
      };
      
      const existingAds = JSON.parse(localStorage.getItem('generatedAds') || '[]');
      existingAds.push(adData);
      localStorage.setItem('generatedAds', JSON.stringify(existingAds));
      
    } catch (error) {
      console.error('Error generating ad:', error);
      alert('Failed to generate ad. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAd = () => {
    if (generatedAd) {
      const link = document.createElement('a');
      link.href = generatedAd;
      link.download = `ai-ad-${Date.now()}.png`;
      link.click();
    }
  };

  if (!productData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Product Uploaded
          </h2>
          <p className="text-gray-600 mb-6">
            Please upload a product image first to generate AI ads.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
            Generate AI Ad
          </h2>

          {/* Product Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Your Product</h3>
            <div className="border rounded-lg p-4">
              <img 
                src={productData.url} 
                alt="Product" 
                className="w-full h-32 object-contain mb-2"
              />
              <p className="text-sm text-gray-600">{productData.name}</p>
            </div>
          </div>

          {/* Ad Prompt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Description/Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the ad you want to create (e.g., 'Premium smartphone with sleek design for tech-savvy professionals')"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Style
            </label>
            <select 
              value={style} 
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="modern">Modern & Minimal</option>
              <option value="vintage">Vintage & Classic</option>
              <option value="bold">Bold & Colorful</option>
              <option value="elegant">Elegant & Luxury</option>
              <option value="playful">Playful & Fun</option>
            </select>
          </div>

          {/* Mood Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood/Tone
            </label>
            <select 
              value={mood} 
              onChange={(e) => setMood(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="energetic">Energetic & Dynamic</option>
              <option value="calm">Calm & Peaceful</option>
              <option value="professional">Professional & Trust</option>
              <option value="exciting">Exciting & Adventurous</option>
              <option value="cozy">Cozy & Comfortable</option>
            </select>
          </div>

          {/* AI Provider Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <select 
              value={aiProvider} 
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="stability">Stability AI (₹3.30/image)</option>
              <option value="openai">OpenAI DALL-E 3 (₹14/image)</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateAd}
            disabled={loading || !prompt.trim()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Generating Ad...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate AI Ad</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column - Generated Ad */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Generated Ad</h3>
          
          {!generatedAd ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your AI-generated ad will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={generatedAd} 
                  alt="Generated Ad" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Ad Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Ad Details</h4>
                <p className="text-sm text-gray-600 mb-1"><strong>Prompt:</strong> {prompt}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Style:</strong> {style}</p>
                <p className="text-sm text-gray-600"><strong>Mood:</strong> {mood}</p>
                <p className="text-sm text-gray-600"><strong>Provider:</strong> {aiProvider}</p>
              </div>
              
              {/* Download Button */}
              <button
                onClick={downloadAd}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>Download Ad</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
