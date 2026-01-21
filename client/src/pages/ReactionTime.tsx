import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ReactionTime() {
  const [, setLocation] = useLocation();
  const [gameState, setGameState] = useState<
    "waiting" | "ready" | "testing" | "result"
  >("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startTest = () => {
    setGameState("ready");
    setReactionTime(null);

    const delay = Math.random() * 3000 + 1000;
    setTimeout(() => {
      setGameState("testing");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "testing" && startTime) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setBestTime(bestTime === null ? time : Math.min(bestTime, time));
      setGameState("result");
    }
  };

  const getCategory = (time: number) => {
    if (time < 200) return "⚡ अद्भुत!";
    if (time < 300) return "🔥 उत्तम!";
    if (time < 400) return "👍 चांगले!";
    if (time < 500) return "😐 सामान्य";
    return "🐢 धीमे";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-red-300 hover:text-red-200 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">
          प्रतिक्रिया वेळ चाचणी
        </h1>
        <p className="text-center text-red-200 mb-8">
          जितक्या लवकर क्लिक कराल तितक्या चांगले!
        </p>

        <div className="bg-red-700 rounded-lg p-12 mb-8 text-center">
          {gameState === "waiting" && (
            <div>
              <p className="text-2xl mb-6">सुरू करण्यासाठी खालील बटणावर क्लिक करा</p>
              <Button
                onClick={startTest}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-xl"
              >
                सुरू करा
              </Button>
            </div>
          )}

          {gameState === "ready" && (
            <div>
              <p className="text-3xl font-bold text-yellow-300">
                प्रतीक्षा करा...
              </p>
              <p className="text-gray-300 mt-4">
                हिरव्या रंगाची प्रतीक्षा करा!
              </p>
            </div>
          )}

          {gameState === "testing" && (
            <div
              onClick={handleClick}
              className="bg-green-500 rounded-lg p-20 cursor-pointer hover:bg-green-600 transition-all"
            >
              <p className="text-4xl font-bold">क्लिक करा!</p>
            </div>
          )}

          {gameState === "result" && reactionTime !== null && (
            <div>
              <p className="text-2xl mb-4">तुमची प्रतिक्रिया वेळ:</p>
              <p className="text-5xl font-bold text-yellow-300 mb-2">
                {reactionTime}
              </p>
              <p className="text-xl mb-6">मिलीसेकंद</p>
              <p className="text-2xl mb-6">{getCategory(reactionTime)}</p>

              {bestTime && (
                <p className="text-lg text-gray-300 mb-6">
                  सर्वोत्तम वेळ: {bestTime} ms
                </p>
              )}

              <Button
                onClick={startTest}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
              >
                पुन्हा प्रयत्न करा
              </Button>
            </div>
          )}
        </div>

        {gameState !== "waiting" && (
          <Button
            onClick={() => {
              setGameState("waiting");
              setReactionTime(null);
              setBestTime(null);
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            नवीन खेळ सुरू करा
          </Button>
        )}
      </div>
    </div>
  );
}
