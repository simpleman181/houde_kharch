import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NagPanchami() {
  const [, setLocation] = useLocation();
  const [snakes, setSnakes] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [worshipped, setWorshipped] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setGameActive(true);
    setWorshipped(0);
    setSnakes([]);
    spawnSnakes();
  };

  const spawnSnakes = () => {
    const newSnakes = [];
    for (let i = 0; i < 5; i++) {
      newSnakes.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
      });
    }
    setSnakes(newSnakes);
  };

  const worshipSnake = (id: number) => {
    setSnakes(snakes.filter((s) => s.id !== id));
    setWorshipped(worshipped + 1);

    if (worshipped + 1 === 5) {
      setGameActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-green-300 hover:text-green-200 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">नाग पंचमी 🐍</h1>
        <p className="text-center text-green-200 mb-8">
          सर्प देवताला पूजा करा!
        </p>

        <div className="bg-green-700 rounded-lg p-8 mb-6">
          {!gameActive ? (
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">
                {worshipped === 0
                  ? "नाग पंचमीचा सण"
                  : `${worshipped}/5 सर्पांना पूजा केली`}
              </p>
              <Button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {worshipped === 0 ? "सुरू करा" : "पुन्हा खेळा"}
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-center text-xl font-bold mb-6">
                सर्पांना क्लिक करून पूजा करा!
              </p>
              <p className="text-center text-lg mb-8">
                पूजा केली: {worshipped}/5
              </p>

              <div className="relative w-full h-96 bg-green-800 rounded-lg overflow-hidden border-2 border-green-500">
                {snakes.map((snake) => (
                  <button
                    key={snake.id}
                    onClick={() => worshipSnake(snake.id)}
                    className="absolute text-5xl hover:scale-125 transition-transform"
                    style={{
                      left: `${snake.x}%`,
                      top: `${snake.y}%`,
                    }}
                  >
                    🐍
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-green-600 rounded-lg p-4 text-center">
          <p className="text-green-100">
            नाग पंचमी हा सर्प देवताचा पूजन करण्याचा दिवस आहे.
          </p>
        </div>
      </div>
    </div>
  );
}
