'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  LogOut, Plus, Image, Sparkles, Clock, BarChart3, 
  Moon, Sun, CreditCard
} from 'lucide-react';
import ImageUpload from './ImageUpload';
import AdGenerator from './AdGenerator';
import AdsHistory from './AdsHistory';
import StatsOverview from './StatsOverview';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'generate' | 'history'>('overview');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                AI Ads Generator
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <CreditCard className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">25 Credits</span>
              </div>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <span className="text-gray-700">
                {user?.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 pb-4 border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 pb-4 border-b-2 ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image className="h-5 w-5" />
            <span>Upload Product</span>
          </button>
          
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center space-x-2 pb-4 border-b-2 ${
              activeTab === 'generate'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>Generate Ad</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 pb-4 border-b-2 ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="h-5 w-5" />
            <span>History</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <StatsOverview setActiveTab={setActiveTab} />}
        {activeTab === 'upload' && <ImageUpload />}
        {activeTab === 'generate' && <AdGenerator />}
        {activeTab === 'history' && <AdsHistory />}
      </main>
    </div>
  );
}
