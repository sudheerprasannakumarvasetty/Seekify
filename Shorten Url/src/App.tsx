import React, { useState, useEffect } from 'react';
import { Copy, Link, BarChart3, Clock, Trash2, ExternalLink, Check } from 'lucide-react';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  clicks: number;
}

function App() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('shortenedUrls');
    if (saved) {
      const parsed = JSON.parse(saved);
      setShortenedUrls(parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      })));
    }
  }, []);

  // Save to localStorage whenever shortenedUrls changes
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortCode = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;
    
    const isValid = validateUrl(url);
    setIsValidUrl(isValid);
    
    if (!isValid) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const shortCode = generateShortCode();
    const newShortenedUrl: ShortenedUrl = {
      id: Date.now().toString(),
      originalUrl: url,
      shortCode,
      shortUrl: `https://seek.ly/${shortCode}`,
      createdAt: new Date(),
      clicks: 0
    };

    setShortenedUrls(prev => [newShortenedUrl, ...prev]);
    setUrl('');
    setIsLoading(false);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const deleteUrl = (id: string) => {
    setShortenedUrls(prev => prev.filter(item => item.id !== id));
  };

  const incrementClicks = (id: string) => {
    setShortenedUrls(prev => 
      prev.map(item => 
        item.id === id ? { ...item, clicks: item.clicks + 1 } : item
      )
    );
  };

  const totalUrls = shortenedUrls.length;
  const totalClicks = shortenedUrls.reduce((sum, item) => sum + item.clicks, 0);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Glass Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/4 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-white/6 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.02%22%3E%3Cpath%20d=%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-100"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-pulse">
              <Link className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white ml-6 tracking-tight">Seekify</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your long URLs into short, shareable links with beautiful analytics
          </p>
        </div>

        {/* Stats Cards */}
        {totalUrls > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Link className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-3xl font-bold text-white">{totalUrls}</p>
                  <p className="text-gray-300 text-sm">URLs Shortened</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-3xl font-bold text-white">{totalClicks}</p>
                  <p className="text-gray-300 text-sm">Total Clicks</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* URL Shortener Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-200 mb-3">
                  Enter your long URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setIsValidUrl(true);
                    }}
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    className={`w-full px-6 py-4 bg-white/5 backdrop-blur-lg border-2 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 ${
                      !isValidUrl ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:border-white/40'
                    }`}
                  />
                  {!isValidUrl && (
                    <p className="text-red-400 text-sm mt-2">Please enter a valid URL</p>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!url.trim() || isLoading}
                className="w-full bg-white/20 backdrop-blur-lg text-white py-4 px-8 rounded-2xl font-semibold hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-white/30"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Shortening...
                  </div>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Shortened URLs List */}
        {shortenedUrls.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent URLs</h2>
              <p className="text-gray-300">{shortenedUrls.length} URLs created</p>
            </div>
            
            <div className="space-y-4">
              {shortenedUrls.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.01] shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <Link className="w-4 h-4 text-white mr-2 flex-shrink-0" />
                        <p className="text-white font-medium truncate">{item.shortUrl}</p>
                      </div>
                      <p className="text-gray-300 text-sm truncate mb-2">{item.originalUrl}</p>
                      <div className="flex items-center text-xs text-gray-400 space-x-4">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.createdAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          {item.clicks} clicks
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          incrementClicks(item.id);
                          window.open(item.originalUrl, '_blank');
                        }}
                        className="p-2 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border border-white/20"
                        title="Visit URL"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(item.shortUrl, item.id)}
                        className="p-2 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border border-white/20"
                        title="Copy short URL"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => deleteUrl(item.id)}
                        className="p-2 bg-white/10 backdrop-blur-lg hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-lg transition-all duration-200 border border-white/20 hover:border-red-500/30"
                        title="Delete URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {shortenedUrls.length === 0 && (
          <div className="text-center py-12">
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-white/20 animate-pulse">
              <Link className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No URLs shortened yet</h3>
            <p className="text-gray-300">Enter a URL above to get started with Seekify</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;