import { useState, useEffect } from 'react';
import { items, INITIAL_MONEY, Item } from '@/lib/items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [money, setMoney] = useState(INITIAL_MONEY);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [gameOver, setGameOver] = useState(false);

  // Format currency in Indian numbering system
  const formatCurrency = (value: number): string => {
    if (value >= 10000000000) {
      return `₹${(value / 10000000000).toFixed(2)} खरब`;
    }
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} कोटी`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} लाख`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(2)} हजार`;
    }
    return `₹${value}`;
  };

  const buyItem = (item: Item, quantity: number) => {
    if (quantity <= 0) return;
    
    const totalCost = item.price * quantity;
    if (totalCost <= money) {
      setMoney(money - totalCost);
      setCart({
        ...cart,
        [item.id]: (cart[item.id] || 0) + quantity,
      });
    }
  };

  const sellItem = (item: Item, quantity: number) => {
    if (quantity <= 0 || !cart[item.id] || cart[item.id] < quantity) return;
    
    const totalRefund = item.price * quantity;
    setMoney(money + totalRefund);
    
    const newQuantity = cart[item.id] - quantity;
    if (newQuantity === 0) {
      const newCart = { ...cart };
      delete newCart[item.id];
      setCart(newCart);
    } else {
      setCart({
        ...cart,
        [item.id]: newQuantity,
      });
    }
  };

  const resetGame = () => {
    setMoney(INITIAL_MONEY);
    setCart({});
    setGameOver(false);
  };

  // Check if money is nearly zero
  useEffect(() => {
    if (money < 1 && Object.keys(cart).length > 0) {
      setGameOver(true);
    }
  }, [money, cart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                बिल गेट्सचे पैसे खर्च करा
              </h1>
              <p className="text-muted-foreground mt-1">Spend Bill Gates' Money</p>
            </div>
            <Button 
              onClick={resetGame}
              variant="outline"
              className="text-sm"
            >
              रीसेट करा (Reset)
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Money Counter */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Money Display */}
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">
                  उरलेले पैसे
                </p>
                <p className="text-3xl font-bold text-primary break-words" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                  {formatCurrency(money)}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  ${money.toLocaleString()}
                </p>
              </Card>

              {/* Cart Summary */}
              {Object.keys(cart).length > 0 && (
                <Card className="p-4 bg-card border-border">
                  <h3 className="font-bold text-foreground mb-3" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                    तुमचा खरेदी ({Object.keys(cart).length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(cart).map(([itemId, quantity]) => {
                      const item = items.find(i => i.id === itemId);
                      if (!item) return null;
                      return (
                        <div 
                          key={itemId}
                          className="text-sm flex justify-between items-center pb-2 border-b border-border last:border-b-0"
                        >
                          <span className="text-foreground">
                            {item.emoji} {quantity}x
                          </span>
                          <span className="text-accent font-semibold">
                            {formatCurrency(item.price * quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Game Over Message */}
              {gameOver && (
                <Card className="p-4 bg-gradient-to-br from-accent/20 to-secondary/20 border-accent/50">
                  <p className="text-sm font-bold text-accent" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                    🎉 बधाई! तुम्ही सर्व पैसे खर्च केले!
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Congratulations! You spent all the money!
                  </p>
                </Card>
              )}
            </div>
          </aside>

          {/* Items Grid */}
          <section className="lg:col-span-3">
            <div className="space-y-8">
              {/* Food & Dining */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary/30" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                  🍔 खाना व जेवण
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.filter(i => i.category === 'food').map(item => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onBuy={(qty) => buyItem(item, qty)}
                      onSell={(qty) => sellItem(item, qty)}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </div>

              {/* Technology */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary/30" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                  📱 तंत्रज्ञान
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.filter(i => i.category === 'tech').map(item => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onBuy={(qty) => buyItem(item, qty)}
                      onSell={(qty) => sellItem(item, qty)}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary/30" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                  🚗 वाहने
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.filter(i => i.category === 'vehicles').map(item => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onBuy={(qty) => buyItem(item, qty)}
                      onSell={(qty) => sellItem(item, qty)}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </div>

              {/* Luxury Items */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary/30" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                  💎 विलास वस्तू
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.filter(i => i.category === 'luxury').map(item => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onBuy={(qty) => buyItem(item, qty)}
                      onSell={(qty) => sellItem(item, qty)}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </div>

              {/* Property */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary/30" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                  🏠 संपत्ती
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.filter(i => i.category === 'property').map(item => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onBuy={(qty) => buyItem(item, qty)}
                      onSell={(qty) => sellItem(item, qty)}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </div>

              {/* Experiences */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 pb-3 border-b-2 border-primary/30" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                  ✈️ अनुभव
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.filter(i => i.category === 'experiences').map(item => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      quantity={cart[item.id] || 0}
                      onBuy={(qty) => buyItem(item, qty)}
                      onSell={(qty) => sellItem(item, qty)}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>बिल गेट्सचे पैसे खर्च करा - Neal.fun inspired game in Marathi</p>
          <p className="mt-2">मजेदार खेळ! आपल्या सर्व पैसे खर्च करा! 🎉</p>
        </div>
      </footer>
    </div>
  );
}

// Item Card Component
interface ItemCardProps {
  item: Item;
  quantity: number;
  onBuy: (quantity: number) => void;
  onSell: (quantity: number) => void;
  formatCurrency: (value: number) => string;
}

function ItemCard({ item, quantity, onBuy, onSell, formatCurrency }: ItemCardProps) {
  const [buyInput, setBuyInput] = useState('1');
  const [sellInput, setSellInput] = useState('1');

  return (
    <Card className="item-card overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{item.emoji}</div>
        {quantity > 0 && (
          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            {quantity}
          </span>
        )}
      </div>

      <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
        {item.nameMarathi}
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        {item.nameEnglish}
      </p>

      <p className="item-price mb-4">
        {formatCurrency(item.price)}
      </p>

      {/* Buy Section */}
      <div className="space-y-2 mb-3 pb-3 border-b border-border">
        <div className="flex gap-2">
          <Input
            type="number"
            min="1"
            value={buyInput}
            onChange={(e) => setBuyInput(e.target.value)}
            className="money-input h-8 text-sm flex-1"
            placeholder="1"
          />
          <Button
            onClick={() => {
              onBuy(parseInt(buyInput) || 1);
              setBuyInput('1');
            }}
            className="buy-button h-8 px-3 text-sm"
          >
            खरेदी
          </Button>
        </div>
      </div>

      {/* Sell Section */}
      {quantity > 0 && (
        <div className="flex gap-2">
          <Input
            type="number"
            min="1"
            max={quantity}
            value={sellInput}
            onChange={(e) => setSellInput(e.target.value)}
            className="money-input h-8 text-sm flex-1"
            placeholder="1"
          />
          <Button
            onClick={() => {
              onSell(parseInt(sellInput) || 1);
              setSellInput('1');
            }}
            variant="outline"
            className="sell-button h-8 px-3 text-sm"
          >
            विक्रय
          </Button>
        </div>
      )}
    </Card>
  );
}
