import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ColorMatcher() {
  const [, setLocation] = useLocation();
  const [targetColor, setTargetColor] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [round, setRound] = useState(1);

  const colors = [
    { name: "लाल", hex: "#ef4444" },
    { name: "निळा", hex: "#3b82f6" },
    { name: "हिरवा", hex: "#22c55e" },
    { name: "पिवळा", hex: "#eab308" },
    { name: "गुलाबी", hex: "#ec4899" },
    { name: "नारिंगी", hex: "#f97316" },
    { name: "जांभळा", hex: "#a855f7" },
    { name: "टर्कोइज", hex: "#06b6d4" },
  ];

  const generateRound = () => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(target.hex);

    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    setOptions(shuffled.map((c) => c.hex).slice(0, 4));
    setMessage("");
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleColorClick = (hex: string) => {
    if (hex === targetColor) {
      setScore(score + 1);
      setMessage("बरोबर! 🎉");
      setTimeout(() => {
        setRound(round + 1);
        generateRound();
      }, 1000);
    } else {
      setMessage("चुकीचे! पुन्हा प्रयत्न करा.");
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

        <h1 className="text-4xl font-bold text-center mb-2">रंग जुळवणे</h1>
        <p className="text-center text-gray-300 mb-8">
          राउंड {round} | अंक: {score}
        </p>

        <div className="bg-slate-700 rounded-lg p-8 mb-8">
          <p className="text-center text-gray-300 mb-4">हा रंग निवडा:</p>
          <div
            className="w-full h-32 rounded-lg mb-4 border-4 border-white shadow-lg"
            style={{ backgroundColor: targetColor }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {options.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleColorClick(color)}
              className="h-24 rounded-lg border-2 border-white hover:border-yellow-300 transition-all transform hover:scale-105"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {message && (
          <div
            className={`text-center text-xl font-bold mb-4 ${
              message.includes("बरोबर") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <Button
          onClick={() => {
            setScore(0);
            setRound(1);
            generateRound();
          }}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          नवीन खेळ सुरू करा
        </Button>
      </div>
    </div>
  );
}
