import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Laugh, 
  Copy, 
  Code, 
  Zap, 
  Skull, 
  Ghost, 
  Grid3X3, 
  History,
  Heart,
  Trash2,
  Check
} from 'lucide-react';

interface Joke {
  id?: number;
  type: 'single' | 'twopart';
  category: string;
  joke?: string;
  setup?: string;
  delivery?: string;
  error?: boolean;
  message?: string;
}

interface HistoryItem {
  id: number;
  joke: Joke;
}

const categories = [
  { id: 'all', label: 'All', icon: Grid3X3, api: 'Any' },
  { id: 'programming', label: 'Programming', icon: Code, api: 'Programming' },
  { id: 'pun', label: 'Pun', icon: Zap, api: 'Pun' },
  { id: 'dark', label: 'Dark', icon: Skull, api: 'Dark' },
  { id: 'spooky', label: 'Spooky', icon: Ghost, api: 'Spooky' }
];

function App() {
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [jokeHistory, setJokeHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  useEffect(() => {
    // Load saved data
    const savedHistory = localStorage.getItem('jokeHistory');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedHistory) {
      setJokeHistory(JSON.parse(savedHistory));
    }
    
    if (savedDarkMode === 'true' || (savedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('jokeHistory', JSON.stringify(jokeHistory));
  }, [jokeHistory]);

  const fetchJoke = async () => {
    setIsLoading(true);
    setShowDelivery(false);
    
    const category = categories.find(c => c.id === activeCategory)?.api || 'Any';
    const apiUrl = `https://v2.jokeapi.dev/joke/${category}?blacklistFlags=religious,political,racist,sexist`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      setCurrentJoke(data);
      addToHistory(data);
      
      if (data.type === 'twopart') {
        setTimeout(() => setShowDelivery(true), 1500);
      }
    } catch (error) {
      setCurrentJoke({
        type: 'single',
        category: 'Error',
        joke: "Oops! Couldn't fetch a joke. Try again later.",
        error: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = (joke: Joke) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      joke
    };
    
    setJokeHistory(prev => [newItem, ...prev.slice(0, 2)]);
  };

  const copyJoke = async (joke?: Joke) => {
    const targetJoke = joke || currentJoke;
    if (!targetJoke) return;

    let textToCopy = '';
    if (targetJoke.type === 'single') {
      textToCopy = targetJoke.joke || '';
    } else {
      textToCopy = `${targetJoke.setup}\n${targetJoke.delivery}`;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearHistory = () => {
    setJokeHistory([]);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Programming: 'from-blue-500 to-purple-600',
      Pun: 'from-yellow-400 to-orange-500',
      Dark: 'from-red-500 to-pink-600',
      Spooky: 'from-purple-600 to-indigo-700',
      default: 'from-indigo-500 to-blue-600'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const getReactionEmoji = (category: string) => {
    const emojis = {
      Programming: '👨‍💻',
      Pun: '😏',
      Dark: '😈',
      Spooky: '👻',
      default: '😂'
    };
    return emojis[category as keyof typeof emojis] || emojis.default;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="relative mb-6">
            {/* Floating emojis around main logo */}
            <div className="absolute -top-4 -left-8 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>
              🎭
            </div>
            <div className="absolute -top-2 -right-6 text-xl animate-bounce" style={{animationDelay: '1s'}}>
              🤣
            </div>
            <div className="absolute -bottom-2 -left-4 text-lg animate-bounce" style={{animationDelay: '1.5s'}}>
              😄
            </div>
            <div className="absolute -bottom-4 -right-8 text-2xl animate-bounce" style={{animationDelay: '2s'}}>
              🎪
            </div>
            
            {/* Main logo with enhanced animation */}
            <div className="relative inline-block">
              <div className="text-8xl animate-pulse hover:animate-spin transition-all duration-500 cursor-pointer">
                😂
              </div>
              {/* Glow effect behind emoji */}
              <div className="absolute inset-0 text-8xl blur-xl opacity-30 animate-pulse">
                😂
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black mb-2 relative">
              <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Laugh
              </span>
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent animate-gradient-x" style={{animationDelay: '0.5s'}}>
                X
              </span>
              
              {/* Sparkle effects */}
              <div className="absolute -top-2 left-1/4 text-yellow-400 animate-ping">
                ✨
              </div>
              <div className="absolute -top-1 right-1/4 text-pink-400 animate-ping" style={{animationDelay: '1s'}}>
                ⭐
              </div>
            </h1>
            
            <div className="relative">
              <p className={`text-xl md:text-2xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Your daily dose of laughter ✨
              </p>
              <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                Powered by humor, fueled by giggles 🚀
              </p>
            </div>
            
            {/* Fun stats or tagline */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white/70 text-gray-600'
            } backdrop-blur-sm shadow-lg`}>
              <span className="text-green-500 animate-pulse">●</span>
              <span className="text-sm font-medium">
                {jokeHistory.length > 0 ? `${jokeHistory.length} jokes delivered` : 'Ready to make you smile'}
              </span>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <div className={`flex flex-wrap gap-2 p-3 rounded-2xl shadow-lg ${
            isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm'
          }`}>
            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                  : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
              }`}
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Category filters */}
            {categories.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={category.label}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto flex-grow">
          {/* Joke Card */}
          <div className={`relative mb-8 p-8 rounded-3xl shadow-2xl transition-all duration-500 transform ${
            currentJoke 
              ? `bg-gradient-to-br ${getCategoryColor(currentJoke.category)} text-white`
              : isDarkMode
              ? 'bg-gray-800/50 backdrop-blur-sm text-gray-200'
              : 'bg-white/70 backdrop-blur-sm text-gray-800'
          } ${isLoading ? 'scale-95 opacity-75' : 'scale-100 opacity-100'}`}>
            
            {/* Joke Content */}
            <div className="min-h-[200px] flex flex-col justify-center items-center text-center">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full"></div>
                  <p className="text-lg font-medium">Finding the perfect joke...</p>
                </div>
              ) : currentJoke ? (
                <div className="w-full space-y-6">
                  {currentJoke.type === 'single' ? (
                    <div className="animate-fade-in">
                      <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4">
                        {currentJoke.joke}
                      </p>
                      <div className="text-5xl animate-bounce">
                        {getReactionEmoji(currentJoke.category)}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="animate-fade-in">
                        <p className="text-xl md:text-2xl font-medium leading-relaxed">
                          {currentJoke.setup}
                        </p>
                      </div>
                      
                      {showDelivery && (
                        <div className="animate-slide-up">
                          <p className="text-xl md:text-2xl font-bold leading-relaxed mb-4">
                            {currentJoke.delivery}
                          </p>
                          <div className="text-5xl animate-bounce">
                            {getReactionEmoji(currentJoke.category)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl animate-pulse">🎭</div>
                  <p className="text-xl font-medium">Click the button below to get a joke!</p>
                </div>
              )}
            </div>

            {/* Category badge */}
            {currentJoke && !currentJoke.error && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {currentJoke.category}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={fetchJoke}
              disabled={isLoading}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white'
              }`}
            >
              <Laugh size={24} />
              <span>{isLoading ? 'Getting Joke...' : 'Get Random Joke'}</span>
            </button>

            <button
              onClick={() => copyJoke()}
              disabled={!currentJoke || isLoading}
              className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3 ${
                !currentJoke || isLoading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : copied
                  ? 'bg-green-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* History Section */}
          <div className={`rounded-3xl shadow-xl p-6 ${
            isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold flex items-center gap-3 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                <History className="text-indigo-500" size={28} />
                Previous Laughs
              </h2>
              
              {jokeHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                    isDarkMode 
                      ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {jokeHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your joke history will appear here
                  </p>
                </div>
              ) : (
                jokeHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-gray-200' 
                        : 'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        {item.joke.type === 'single' ? (
                          <p className="font-medium leading-relaxed">{item.joke.joke}</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="font-medium leading-relaxed">{item.joke.setup}</p>
                            <p className="leading-relaxed">{item.joke.delivery}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getReactionEmoji(item.joke.category)}</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.joke.category} • {new Date(item.id).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => copyJoke(item.joke)}
                        className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                          isDarkMode 
                            ? 'text-indigo-400 hover:bg-indigo-600/20' 
                            : 'text-indigo-600 hover:bg-indigo-100'
                        }`}
                        title="Copy joke"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${
            isDarkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white/70 text-gray-600'
          }`}>
            <span>Made with</span>
            <Heart className="text-red-500 animate-pulse" size={18} />
            <span>and laughter</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;