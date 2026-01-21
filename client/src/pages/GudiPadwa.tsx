import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function GudiPadwa() {
  const [, setLocation] = useLocation();
  const [gudiHeight, setGudiHeight] = useState(0);
  const [message, setMessage] = useState("गुडी उभारा!");
  const [celebrations, setCelebrations] = useState(0);

  const raiseGudi = () => {
    if (gudiHeight < 100) {
      setGudiHeight(gudiHeight + 10);
      if (gudiHeight + 10 === 100) {
        setMessage("🎉 गुडी पूर्ण झाली!");
        setCelebrations(celebrations + 1);
      }
    }
  };

  const resetGudi = () => {
    setGudiHeight(0);
    setMessage("गुडी उभारा!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-amber-300 hover:text-amber-200 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">गुडी पाडवा 🚩</h1>
        <p className="text-center text-amber-200 mb-8">
          मराठी नववर्षाचा सण - गुडी उभारा!
        </p>

        <div className="bg-amber-700 rounded-lg p-8 mb-6">
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-64 border-4 border-amber-300 rounded-t-full">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-full transition-all"
                style={{ height: `${gudiHeight}%` }}
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl">
                🚩
              </div>
            </div>
          </div>

          <p className="text-center text-2xl font-bold mb-4">{message}</p>
          <p className="text-center text-xl mb-6">
            गुडी उभारली: {celebrations}
          </p>

          <div className="flex gap-4">
            <Button
              onClick={raiseGudi}
              disabled={gudiHeight === 100}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              गुडी उभारा
            </Button>
            <Button
              onClick={resetGudi}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
            >
              रीसेट करा
            </Button>
          </div>
        </div>

        <div className="bg-amber-600 rounded-lg p-4 text-center">
          <p className="text-amber-100">
            गुडी पाडवा मराठी नववर्षाचा सण आहे. नवीन सुरुवातीचा दिवस!
          </p>
        </div>
      </div>
    </div>
  );
}
