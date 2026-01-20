import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Item {
  name: string;
  size: number; // in meters
  emoji: string;
  description: string;
}

const items: Item[] = [
  { name: 'मच्छर', size: 0.005, emoji: '🦟', description: '5 मिलिमीटर' },
  { name: 'मधुमक्खी', size: 0.015, emoji: '🐝', description: '15 मिलिमीटर' },
  { name: 'चिमणी', size: 0.05, emoji: '🐿️', description: '50 सेंटिमीटर' },
  { name: 'मानव', size: 1.7, emoji: '👤', description: '1.7 मीटर' },
  { name: 'हत्ती', size: 3, emoji: '🐘', description: '3 मीटर' },
  { name: 'व्हेल', size: 25, emoji: '🐋', description: '25 मीटर' },
  { name: 'स्टॅचू ऑफ लिबर्टी', size: 93, emoji: '🗽', description: '93 मीटर' },
  { name: 'एफिल टॉवर', size: 330, emoji: '🗼', description: '330 मीटर' },
  { name: 'माउंट एव्हरेस्ट', size: 8849, emoji: '⛰️', description: '8,849 मीटर' },
  { name: 'पृथ्वी', size: 12742000, emoji: '🌍', description: '12,742 किमी' },
  { name: 'सूर्य', size: 1391000000, emoji: '☀️', description: '1.39 अरब किमी' },
];

export default function SizeCompare() {
  const [selectedItems, setSelectedItems] = useState<number[]>([0, 1]);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelect = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleCompare = () => {
    if (selectedItems.length === 2) {
      setShowComparison(true);
    }
  };

  const handleReset = () => {
    setSelectedItems([0, 1]);
    setShowComparison(false);
  };

  const item1 = items[selectedItems[0]];
  const item2 = items[selectedItems[1]];
  const ratio = item2.size / item1.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-teal-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold">
              <ArrowLeft size={20} />
              परत
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">आकार तुलना</h1>
          <button
            onClick={handleReset}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            रीसेट
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Item Selection */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white">
              <h2 className="text-xl font-bold text-slate-900 mb-6">वस्तू निवडा (२ वस्तू)</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`p-4 rounded-lg transition-all ${
                      selectedItems.includes(idx)
                        ? 'ring-4 ring-teal-500 bg-teal-50'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-600">{item.description}</div>
                  </button>
                ))}
              </div>

              {/* Compare Button */}
              <Button
                onClick={handleCompare}
                disabled={selectedItems.length !== 2}
                className="w-full mt-8 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 font-bold text-lg py-6"
              >
                तुलना करा
              </Button>
            </Card>
          </div>

          {/* Comparison Result */}
          {showComparison && item1 && item2 && (
            <Card className="p-6 bg-white sticky top-24">
              <h3 className="font-bold text-slate-900 mb-6">तुलना परिणाम</h3>

              <div className="space-y-6">
                {/* Item 1 */}
                <div className="text-center">
                  <div className="text-4xl mb-2">{item1.emoji}</div>
                  <div className="font-bold text-slate-900">{item1.name}</div>
                  <div className="text-sm text-slate-600">{item1.description}</div>
                </div>

                {/* Comparison */}
                <div className="border-t-2 border-b-2 border-teal-200 py-4 text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {ratio > 1 ? '↑' : '↓'}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mt-2">
                    {ratio > 1
                      ? `${item2.name} ${ratio.toFixed(1)}x मोठा आहे`
                      : `${item1.name} ${(1 / ratio).toFixed(1)}x मोठा आहे`}
                  </div>
                </div>

                {/* Item 2 */}
                <div className="text-center">
                  <div className="text-4xl mb-2">{item2.emoji}</div>
                  <div className="font-bold text-slate-900">{item2.name}</div>
                  <div className="text-sm text-slate-600">{item2.description}</div>
                </div>
              </div>

              {/* Ratio Bar */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-600 mb-2">आकार प्रमाण:</div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-teal-500 h-3 rounded-full"
                    style={{
                      width: `${Math.min(100, (ratio / 100000) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
