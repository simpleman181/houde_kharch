import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Lagori() {
  const [, setLocation] = useLocation();
  const [stacks, setStacks] = useState<number[]>([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [moves, setMoves] = useState(0);

  const knockStack = (index: number) => {
    if (gameState !== "playing" || stacks[index] === 0) return;

    const newStacks = [...stacks];
    newStacks[index] = 0;
    setStacks(newStacks);
    setMoves(moves + 1);

    const remaining = newStacks.filter((s) => s > 0).length;
    if (remaining === 0) {
      setGameState("won");
    } else if (Math.random() < 0.3) {
      setGameState("lost");
    }
  };

  const resetGame = () => {
    setStacks([1, 1, 1, 1, 1, 1, 1, 1, 1]);
    setGameState("playing");
    setMoves(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-orange-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-orange-300 hover:text-orange-200 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">लागोरी</h1>
        <p className="text-center text-orange-200 mb-8">
          मराठी पारंपरिक खेळ - सर्व स्टॅक खाली करा!
        </p>

        <div className="bg-orange-700 rounded-lg p-8 mb-6">
          <p className="text-center text-2xl font-bold mb-4">
            {gameState === "won"
              ? "🎉 तुम्ही जिंकला!"
              : gameState === "lost"
                ? "😢 गेम संपला!"
                : "खेळत आहो..."}
          </p>
          <p className="text-center text-xl mb-4">हालचाली: {moves}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {stacks.map((stack, idx) => (
              <button
                key={idx}
                onClick={() => knockStack(idx)}
                disabled={gameState !== "playing" || stack === 0}
                className={`h-24 rounded-lg font-bold text-2xl transition-all ${
                  stack === 0
                    ? "bg-gray-500 text-gray-300"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {stack === 0 ? "खाली" : "📦"}
              </button>
            ))}
          </div>

          <Button
            onClick={resetGame}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            नवीन खेळ
          </Button>
        </div>
      </div>
    </div>
  );
}
