'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Zap, Download, Clock, 
  Activity, Star, Plus, Sparkles
} from 'lucide-react';

interface StatsOverviewProps {
  setActiveTab: (tab: 'overview' | 'upload' | 'generate' | 'history') => void;
}

export default function StatsOverview({ setActiveTab }: StatsOverviewProps) {
  const [stats, setStats] = useState({
    totalAds: 0,
    creditsUsed: 0,
    creditsRemaining: 25,
    favoriteStyle: 'No data',
    totalDownloads: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Get REAL data from localStorage
    const savedAds = JSON.parse(localStorage.getItem('generatedAds') || '[]');
    const uploadedProduct = localStorage.getItem('uploadedProduct');
    
    // Calculate real statistics
    const totalAds = savedAds.length;
    const creditsUsed = savedAds.length;
    const creditsRemaining = Math.max(0, 25 - creditsUsed);
    
    // Find actual favorite style
    const styles = savedAds.map((ad: any) => ad.style).filter(Boolean);
    let favoriteStyle = 'No data';
    if (styles.length > 0) {
      const styleCounts = styles.reduce((acc: any, style: string) => {
        acc[style] = (acc[style] || 0) + 1;
        return acc;
      }, {});
      favoriteStyle = Object.keys(styleCounts).reduce((a, b) => 
        styleCounts[a] > styleCounts[b] ? a : b
      );
    }
    
    // Get recent activity (last 5 activities)
    const recentActivity = savedAds
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    setStats({
      totalAds,
      creditsUsed,
      creditsRemaining,
      favoriteStyle,
      totalDownloads: totalAds, // Assume all generated ads can be downloaded
      recentActivity
    });
  }, []);

  const statCards = [
    {
      title: 'Ads Generated',
      value: stats.totalAds,
      icon: Zap,
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Credits Remaining',
      value: `${stats.creditsRemaining}/25`,
      icon: Activity,
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Available Downloads',
      value: stats.totalDownloads,
      icon: Download,
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Top Style',
      value: stats.favoriteStyle,
      icon: Star,
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Dynamic quick actions with click handlers
  const quickActions = [
    {
      title: 'Upload New Product',
      description: stats.totalAds === 0 ? 'Get started with your first upload' : 'Add another product image',
      icon: Plus,
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-600',
      onClick: () => setActiveTab('upload')
    },
    {
      title: 'Generate AI Ad',
      description: stats.totalAds === 0 && !localStorage.getItem('uploadedProduct') ? 'Upload a product first' : `Create ad #${stats.totalAds + 1}`,
      icon: Sparkles,
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-600',
      onClick: () => setActiveTab('generate'),
      disabled: stats.totalAds === 0 && !localStorage.getItem('uploadedProduct')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section - Dynamic content */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {stats.totalAds === 0 ? 'Welcome to AI Ads Generator!' : `Welcome back! You've created ${stats.totalAds} ads`}
            </h1>
            <p className="text-blue-100 text-lg">
              {stats.creditsRemaining > 0 
                ? `${stats.creditsRemaining} credits remaining to create amazing ads`
                : 'All credits used! Time to upgrade or wait for refill'
              }
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-200" />
                <span className="text-blue-100">
                  {stats.totalAds === 0 ? 'Ready to start' : 'Ready for more'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-200" />
                <span className="text-blue-100">AI-powered quality</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Zap className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </p>
                <p className="text-gray-600 text-sm">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((ad: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Generated {ad.style} style ad
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(ad.createdAt).toLocaleDateString()} at {new Date(ad.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    #{ad.id}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No activity yet</p>
                <p className="text-sm text-gray-400">Upload a product image to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button 
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r ${action.bgColor} border ${action.borderColor} hover:scale-105 transition-all duration-200 ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-10 h-10 ${action.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Credits Warning (if low) */}
      {stats.creditsRemaining <= 5 && stats.creditsRemaining > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800">Low Credits Warning</h4>
              <p className="text-sm text-yellow-700">
                You have {stats.creditsRemaining} credits remaining. Consider upgrading soon!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
