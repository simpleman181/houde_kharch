import { useState } from 'react';
import { Link } from 'wouter';
import { games, categories } from '@/lib/games';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GameHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              🎮 मराठी खेळ संग्रह
            </h1>
            <p className="text-slate-600">
              मजेदार आणि शिक्षणीय खेळांचा संग्रह
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-200">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <div key={game.id} className="h-full">
              {game.status === 'available' ? (
                <Link href={game.path}>
                  <a className="block h-full">
                    <Card className={`h-full p-6 bg-gradient-to-br ${game.color} text-white hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-0`}>
                      <div className="flex flex-col h-full">
                        <div className="text-5xl mb-4">{game.emoji}</div>
                        <h2 className="text-2xl font-bold mb-2">{game.titleMarathi}</h2>
                        <p className="text-sm opacity-90 mb-4 flex-grow">{game.description}</p>
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                          खेळ सुरू करा
                        </Button>
                      </div>
                    </Card>
                  </a>
                </Link>
              ) : (
                <Card className={`h-full p-6 bg-gradient-to-br ${game.color} text-white opacity-60 border-0 relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">जल्द येत आहे</div>
                      <div className="text-sm opacity-75">Coming Soon</div>
                    </div>
                  </div>
                  <div className="flex flex-col h-full opacity-0">
                    <div className="text-5xl mb-4">{game.emoji}</div>
                    <h2 className="text-2xl font-bold mb-2">{game.titleMarathi}</h2>
                    <p className="text-sm opacity-90 mb-4 flex-grow">{game.description}</p>
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 mt-12">
        <div className="container py-8 text-center text-slate-600">
          <p>© 2026 मराठी खेळ संग्रह | Made with ❤️ for Marathi speakers</p>
        </div>
      </div>
    </div>
  );
}
