import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function JanmashtamiDahiHandi() {
  const [, setLocation] = useLocation();
  const [handi, setHandi] = useState(100);
  const [message, setMessage] = useState("दही हंडी फोडा!");
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const attemptBreak = () => {
    setAttempts(attempts + 1);
    const damage = Math.floor(Math.random() * 40) + 10;
    const newHealth = Math.max(0, handi - damage);
    setHandi(newHealth);

    if (newHealth === 0) {
      setMessage("🎉 दही हंडी फोडली!");
      setWins(wins + 1);
    } else if (newHealth < 30) {
      setMessage("जवळपास आहेस!");
    } else if (newHealth < 60) {
      setMessage("अजून प्रयत्न करा!");
    }
  };

  const resetGame = () => {
    setHandi(100);
    setMessage("दही हंडी फोडा!");
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-blue-300 hover:text-blue-200 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">जन्माष्टमी - दही हंडी 🏺</h1>
        <p className="text-center text-blue-200 mb-8">
          कृष्णाचा जन्मदिन साजरा करा!
        </p>

        <div className="bg-blue-700 rounded-lg p-8 mb-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-32 h-40 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-b-3xl border-4 border-yellow-600 flex items-center justify-center text-6xl transition-all"
                style={{ opacity: handi / 100 }}
              >
                🏺
              </div>
              {handi === 0 && (
                <div className="absolute inset-0 text-4xl animate-bounce flex items-center justify-center">
                  💥
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-2xl font-bold mb-4">{message}</p>

          <div className="bg-blue-600 rounded-lg p-4 mb-6 text-center">
            <p className="text-lg">
              हंडीचे आरोग्य: {handi}%
            </p>
            <p className="text-lg">
              जिते: {wins} | प्रयत्न: {attempts}
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={attemptBreak}
              disabled={handi === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              हंडी फोडा
            </Button>
            <Button
              onClick={resetGame}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              नवीन हंडी
            </Button>
          </div>
        </div>

        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <p className="text-blue-100">
            जन्माष्टमी कृष्णाचा जन्मदिन आहे. दही हंडी फोडणे हा परंपरागत खेळ आहे!
          </p>
        </div>
      </div>
    </div>
  );
}
