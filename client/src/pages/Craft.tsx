import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface CraftItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface Recipe {
  ingredients: string[];
  result: CraftItem;
}

const items: CraftItem[] = [
  { id: 'water', name: 'पाणी', emoji: '💧', color: 'bg-blue-100' },
  { id: 'fire', name: 'आग', emoji: '🔥', color: 'bg-red-100' },
  { id: 'earth', name: 'माती', emoji: '🌍', color: 'bg-yellow-100' },
  { id: 'air', name: 'हवा', emoji: '💨', color: 'bg-cyan-100' },
  { id: 'plant', name: 'वनस्पती', emoji: '🌱', color: 'bg-green-100' },
  { id: 'animal', name: 'प्राणी', emoji: '🦁', color: 'bg-orange-100' },
  { id: 'human', name: 'मानव', emoji: '👤', color: 'bg-purple-100' },
  { id: 'tool', name: 'साधन', emoji: '🔧', color: 'bg-gray-100' },
];

const recipes: Recipe[] = [
  {
    ingredients: ['water', 'earth'],
    result: { id: 'mud', name: 'चिखल', emoji: '🪨', color: 'bg-amber-100' },
  },
  {
    ingredients: ['fire', 'water'],
    result: { id: 'steam', name: 'वाफ', emoji: '☁️', color: 'bg-slate-100' },
  },
  {
    ingredients: ['plant', 'animal'],
    result: { id: 'ecosystem', name: 'इकोसिस्टम', emoji: '🌿', color: 'bg-lime-100' },
  },
  {
    ingredients: ['human', 'tool'],
    result: { id: 'technology', name: 'तंत्रज्ञान', emoji: '⚙️', color: 'bg-indigo-100' },
  },
  {
    ingredients: ['fire', 'earth'],
    result: { id: 'volcano', name: 'ज्वालामुखी', emoji: '🌋', color: 'bg-red-200' },
  },
  {
    ingredients: ['water', 'air'],
    result: { id: 'cloud', name: 'ढग', emoji: '⛅', color: 'bg-blue-200' },
  },
];

export default function Craft() {
  const [discovered, setDiscovered] = useState<CraftItem[]>(items);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const handleCraft = () => {
    if (selected.length !== 2) {
      setMessage('२ वस्तू निवडा');
      return;
    }

    const sortedSelected = selected.sort();
    const recipe = recipes.find(r => {
      const sortedIngredients = r.ingredients.sort();
      return sortedIngredients[0] === sortedSelected[0] && sortedIngredients[1] === sortedSelected[1];
    });

    if (recipe) {
      if (!discovered.find(d => d.id === recipe.result.id)) {
        setDiscovered([...discovered, recipe.result]);
        setMessage(`✨ ${recipe.result.name} शोधून काढले!`);
      } else {
        setMessage(`तुम्ही आधीच ${recipe.result.name} शोधून काढले आहे!`);
      }
    } else {
      setMessage('हा संयोजन काम करत नाही');
    }

    setSelected([]);
  };

  const handleClear = () => {
    setDiscovered(items);
    setSelected([]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold">
              <ArrowLeft size={20} />
              परत
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">मराठी रचना</h1>
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
          >
            <Trash2 size={18} />
            रीसेट
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Craft Area */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white">
              <h2 className="text-xl font-bold text-slate-900 mb-6">वस्तू निवडा</h2>
              
              {/* Available Items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {discovered.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      selected.includes(item.id)
                        ? 'ring-4 ring-purple-500 scale-110'
                        : item.color + ' hover:shadow-lg'
                    }`}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="text-sm">{item.name}</div>
                  </button>
                ))}
              </div>

              {/* Selected Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-700 mb-3">निवडलेली वस्तू:</h3>
                <div className="flex gap-4 min-h-16">
                  {selected.map((id, idx) => {
                    const item = discovered.find(d => d.id === id);
                    return (
                      <div key={idx} className="bg-purple-100 p-4 rounded-lg flex flex-col items-center">
                        <div className="text-3xl mb-2">{item?.emoji}</div>
                        <div className="text-sm font-semibold">{item?.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg mb-6 font-semibold ${
                  message.includes('✨')
                    ? 'bg-green-100 text-green-800'
                    : message.includes('आधीच')
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              {/* Craft Button */}
              <Button
                onClick={handleCraft}
                className="w-full bg-purple-500 hover:bg-purple-600 font-bold text-lg py-6"
              >
                रचना करा ✨
              </Button>
            </Card>
          </div>

          {/* Discovered Items */}
          <div>
            <Card className="p-6 bg-white sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">शोधून काढलेली वस्तू</h3>
              <div className="space-y-2">
                {discovered.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
                एकूण: {discovered.length}/{items.length + recipes.length}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
