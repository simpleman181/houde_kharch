import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function MemoryDoodle() {
  const [, setLocation] = useLocation();
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [message, setMessage] = useState("सुरू करण्यासाठी बटण दाबा");
  const [score, setScore] = useState(0);

  const colors = [
    { name: "लाल", color: "#ef4444" },
    { name: "निळा", color: "#3b82f6" },
    { name: "हिरवा", color: "#22c55e" },
    { name: "पिवळा", color: "#eab308" },
  ];

  const playSequence = async (seq: number[]) => {
    setGameActive(false);
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      flashButton(seq[i]);
    }
    setGameActive(true);
  };

  const flashButton = (index: number) => {
    const button = document.getElementById(`btn-${index}`);
    if (button) {
      button.style.opacity = "0.5";
      setTimeout(() => {
        button.style.opacity = "1";
      }, 300);
    }
  };

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setUserSequence([]);
    setScore(0);
    setMessage("क्रम लक्षात ठेवा!");
    playSequence(newSequence);
  };

  const handleButtonClick = (index: number) => {
    if (!gameActive) return;

    flashButton(index);
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setMessage(`गेम संपला! अंक: ${score}`);
      setGameActive(false);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(score + 1);
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setUserSequence([]);
      setMessage("पुढील स्तर!");
      setTimeout(() => playSequence(newSequence), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-cyan-400 hover:text-cyan-300 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">स्मृती डूडल</h1>
        <p className="text-center text-gray-300 mb-8">रंगांचा क्रम लक्षात ठेवा!</p>

        <div className="bg-slate-700 rounded-lg p-8 mb-6">
          <p className="text-center text-xl font-semibold mb-4">{message}</p>
          <p className="text-center text-2xl font-bold text-yellow-300">अंक: {score}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {colors.map((c, idx) => (
            <button
              key={idx}
              id={`btn-${idx}`}
              onClick={() => handleButtonClick(idx)}
              className="h-32 rounded-lg border-2 border-white hover:opacity-75 transition-opacity"
              style={{ backgroundColor: c.color }}
              disabled={!gameActive}
            >
              <span className="text-white font-bold">{c.name}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={startGame}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 text-lg"
        >
          नवीन खेळ सुरू करा
        </Button>
      </div>
    </div>
  );
}
