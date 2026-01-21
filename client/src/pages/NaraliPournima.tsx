import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NaraliPournima() {
  const [, setLocation] = useLocation();
  const [coconuts, setCoconuts] = useState(0);
  const [message, setMessage] = useState("समुद्रात नारळ अर्पित करा!");
  const [offerings, setOfferings] = useState(0);

  const offerCoconut = () => {
    setCoconuts(coconuts + 1);
    setOfferings(offerings + 1);

    if (coconuts + 1 === 5) {
      setMessage("🌊 समुद्रदेवाला नमन!");
    } else if (coconuts + 1 < 5) {
      setMessage(`${5 - (coconuts + 1)} नारळ अजून...`);
    }
  };

  const resetGame = () => {
    setCoconuts(0);
    setOfferings(0);
    setMessage("समुद्रात नारळ अर्पित करा!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-500 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-blue-200 hover:text-blue-100 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">नारळी पौर्णिमा 🥥</h1>
        <p className="text-center text-blue-100 mb-8">
          समुद्रदेवाला नारळ अर्पित करा!
        </p>

        <div className="bg-blue-500 rounded-lg p-8 mb-6">
          <div className="flex justify-center mb-8">
            <div className="text-7xl animate-bounce">🌊</div>
          </div>

          <p className="text-center text-2xl font-bold mb-4">{message}</p>

          <div className="bg-blue-400 rounded-lg p-6 mb-6 text-center">
            <p className="text-lg">नारळ अर्पित केली: {coconuts}/5</p>
            <p className="text-lg">एकूण अर्पण: {offerings}</p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={offerCoconut}
              disabled={coconuts === 5}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
            >
              नारळ अर्पित करा 🥥
            </Button>
            <Button
              onClick={resetGame}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              रीसेट करा
            </Button>
          </div>
        </div>

        <div className="bg-blue-400 rounded-lg p-4 text-center">
          <p className="text-blue-900">
            नारळी पौर्णिमा हा समुद्र देवाचा पूजन करण्याचा दिवस आहे. मछुआरे या दिवशी समुद्रात नारळ अर्पित करतात.
          </p>
        </div>
      </div>
    </div>
  );
}
