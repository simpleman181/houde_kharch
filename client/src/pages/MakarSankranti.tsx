import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function MakarSankranti() {
  const [, setLocation] = useLocation();
  const [kites, setKites] = useState(0);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const flyKite = () => {
    if (!gameActive) {
      setGameActive(true);
      setKites(0);
      setScore(0);
      return;
    }

    const newKites = kites + 1;
    setKites(newKites);

    const points = Math.floor(Math.random() * 50) + 10;
    setScore(score + points);

    if (newKites >= 10) {
      setGameActive(false);
    }
  };

  const resetGame = () => {
    setGameActive(false);
    setKites(0);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-300 text-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-sky-700 hover:text-sky-800 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">मकर संक्रांत 🪁</h1>
        <p className="text-center text-sky-700 mb-8">
          आकाशात पतंग उडवा!
        </p>

        <div className="bg-sky-200 rounded-lg p-8 mb-6 border-4 border-sky-400">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🪁</div>
            <p className="text-2xl font-bold text-sky-700">
              {gameActive ? "पतंग उडवत आहो..." : "सुरू करा!"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-sky-100 rounded-lg p-4 text-center">
              <p className="text-gray-600">पतंग</p>
              <p className="text-3xl font-bold text-sky-700">{kites}/10</p>
            </div>
            <div className="bg-sky-100 rounded-lg p-4 text-center">
              <p className="text-gray-600">अंक</p>
              <p className="text-3xl font-bold text-sky-700">{score}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={flyKite}
              disabled={!gameActive && kites > 0}
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
            >
              {gameActive ? "पतंग उडवा" : "सुरू करा"}
            </Button>
            <Button
              onClick={resetGame}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
            >
              रीसेट करा
            </Button>
          </div>
        </div>

        <div className="bg-sky-100 rounded-lg p-4 text-center border-2 border-sky-400">
          <p className="text-sky-700">
            मकर संक्रांत हा पतंगबाजीचा सण आहे. आकाशात रंगीन पतंग उडवा!
          </p>
        </div>
      </div>
    </div>
  );
}
