import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Industry {
  id: string;
  name: string;
  emoji: string;
  baseIncome: number;
  cost: number;
  owned: number;
}

export default function Clicker() {
  const [money, setMoney] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [industries, setIndustries] = useState<Industry[]>([
    { id: 'sugar', name: 'साखर उद्योग', emoji: '🍬', baseIncome: 1, cost: 10, owned: 0 },
    { id: 'textile', name: 'वस्त्र उद्योग', emoji: '🧵', baseIncome: 10, cost: 100, owned: 0 },
    { id: 'it', name: 'आय.टी. क्षेत्र', emoji: '💻', baseIncome: 100, cost: 1000, owned: 0 },
    { id: 'pharma', name: 'औषध उद्योग', emoji: '💊', baseIncome: 500, cost: 5000, owned: 0 },
    { id: 'auto', name: 'ऑटोमोटिव्ह', emoji: '🚗', baseIncome: 1000, cost: 10000, owned: 0 },
    { id: 'real-estate', name: 'रिअल एस्टेट', emoji: '🏢', baseIncome: 5000, cost: 50000, owned: 0 },
  ]);

  // Auto-income from industries
  useEffect(() => {
    const interval = setInterval(() => {
      const income = industries.reduce((sum, ind) => sum + (ind.baseIncome * ind.owned), 0);
      setMoney(prev => prev + income);
      setTotalIncome(income);
    }, 1000);

    return () => clearInterval(interval);
  }, [industries]);

  const handleClick = () => {
    setMoney(prev => prev + 1);
  };

  const handleBuy = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    if (!industry) return;

    if (money >= industry.cost) {
      setMoney(prev => prev - industry.cost);
      setIndustries(industries.map(i =>
        i.id === industryId
          ? { ...i, owned: i.owned + 1, cost: Math.ceil(i.cost * 1.15) }
          : i
      ));
    }
  };

  const handleReset = () => {
    if (confirm('तुमचा प्रगती रीसेट करायचा?')) {
      setMoney(0);
      setIndustries(industries.map(i => ({ ...i, owned: 0, cost: i.baseIncome * 10 })));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold">
              <ArrowLeft size={20} />
              परत
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">महाराष्ट्र उद्योग</h1>
          <Button onClick={handleReset} variant="outline" size="sm">
            रीसेट करा
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Click Area */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white sticky top-20">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                  ₹{money.toLocaleString('en-IN')}
                </div>
                <p className="text-sm opacity-90 mb-4">
                  प्रति सेकंद: ₹{totalIncome.toLocaleString('en-IN')}
                </p>
                <Button
                  onClick={handleClick}
                  className="w-full bg-white text-orange-600 hover:bg-slate-100 font-bold text-lg py-6"
                >
                  क्लिक करा! 🏭
                </Button>
              </div>
            </Card>
          </div>

          {/* Industries */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industries.map(industry => (
                <Card key={industry.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-3xl mb-2">{industry.emoji}</div>
                      <h3 className="font-bold text-slate-900">{industry.name}</h3>
                      <p className="text-sm text-slate-600">
                        ₹{industry.baseIncome.toLocaleString('en-IN')}/सेकंद
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        {industry.owned}
                      </div>
                      <p className="text-xs text-slate-500">मालकीचे</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBuy(industry.id)}
                    disabled={money < industry.cost}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                  >
                    ₹{industry.cost.toLocaleString('en-IN')} खरेदी करा
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
