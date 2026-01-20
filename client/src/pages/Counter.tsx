import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Counter {
  id: string;
  name: string;
  emoji: string;
  date: string;
  createdAt: string;
}

export default function Counter() {
  const [counters, setCounters] = useState<Counter[]>(() => {
    const saved = localStorage.getItem('marathi-counters');
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎉');

  const emojis = ['🎉', '💒', '🎂', '🏆', '📚', '🚗', '💼', '🏠', '✈️', '💍', '👶', '🎓'];

  useEffect(() => {
    localStorage.setItem('marathi-counters', JSON.stringify(counters));
  }, [counters]);

  const calculateDays = (targetDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleAddCounter = () => {
    if (!newName.trim() || !newDate) return;

    const counter: Counter = {
      id: Date.now().toString(),
      name: newName,
      emoji: newEmoji,
      date: newDate,
      createdAt: new Date().toISOString(),
    };

    setCounters([...counters, counter]);
    setNewName('');
    setNewDate('');
    setNewEmoji('🎉');
  };

  const handleDelete = (id: string) => {
    setCounters(counters.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-green-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold">
              <ArrowLeft size={20} />
              परत
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">दिवसांची गणना</h1>
          <div className="text-right text-sm text-slate-600">
            {counters.length} गणना
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Add New Counter */}
        <Card className="p-6 mb-8 bg-white">
          <h2 className="text-xl font-bold mb-4 text-slate-900">नवीन गणना जोडा</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                नाव
              </label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="उदा: विवाह"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                तारीख
              </label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                इमोजी
              </label>
              <select
                value={newEmoji}
                onChange={e => setNewEmoji(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-xl"
              >
                {emojis.map(emoji => (
                  <option key={emoji} value={emoji}>
                    {emoji}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddCounter}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                जोडा
              </Button>
            </div>
          </div>
        </Card>

        {/* Counters Grid */}
        {counters.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-slate-600 text-lg">कोणतीही गणना नाही</p>
            <p className="text-slate-500">वर नवीन गणना जोडा</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counters.map(counter => {
              const days = calculateDays(counter.date);
              const isPast = days < 0;
              const isToday = days === 0;

              return (
                <Card
                  key={counter.id}
                  className={`p-6 bg-gradient-to-br ${
                    isToday
                      ? 'from-yellow-100 to-yellow-50 border-2 border-yellow-400'
                      : isPast
                      ? 'from-slate-100 to-slate-50'
                      : 'from-green-100 to-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{counter.emoji}</div>
                    <button
                      onClick={() => handleDelete(counter.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {counter.name}
                  </h3>

                  <div className="mb-4">
                    <p className="text-sm text-slate-600 mb-1">
                      {new Date(counter.date).toLocaleDateString('mr-IN')}
                    </p>
                  </div>

                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold mb-2 ${
                        isToday
                          ? 'text-yellow-600'
                          : isPast
                          ? 'text-slate-600'
                          : 'text-green-600'
                      }`}
                    >
                      {Math.abs(days)}
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {isToday
                        ? 'आज!'
                        : isPast
                        ? 'दिवस आधी'
                        : 'दिवस उरले'}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
