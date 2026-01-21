import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function PerfectShapeDrawer() {
  const [, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setPoints([]);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints((prev) => [...prev, { x, y }]);

    ctx.lineTo(x, y);
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    calculateScore();
  };

  const calculateScore = () => {
    if (points.length < 10) {
      setScore("अधिक काढा!");
      return;
    }

    const centerX = points.reduce((a, p) => a + p.x, 0) / points.length;
    const centerY = points.reduce((a, p) => a + p.y, 0) / points.length;
    const radii = points.map(
      (p) => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2)
    );
    const avgR = radii.reduce((a, r) => a + r, 0) / radii.length;
    const variance = radii.reduce((a, r) => a + (r - avgR) ** 2, 0) / radii.length;
    const scoreValue = Math.max(0, 100 - variance).toFixed(2);
    setScore(`परिपूर्णता: ${scoreValue}%`);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setScore("");
    setPoints([]);
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

        <h1 className="text-4xl font-bold text-center mb-2">परिपूर्ण वर्तुळ काढा</h1>
        <p className="text-center text-gray-300 mb-8">
          जितक्या परिपूर्ण वर्तुळ काढाल तितके अधिक अंक!
        </p>

        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full border-2 border-cyan-400 cursor-crosshair"
          />
        </div>

        {score && (
          <div className="bg-slate-700 rounded-lg p-4 mb-6 text-center">
            <p className="text-2xl font-bold text-cyan-400">{score}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={clearCanvas}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
          >
            साफ करा
          </Button>
          <Button
            onClick={() => setLocation("/")}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            परत जा
          </Button>
        </div>
      </div>
    </div>
  );
}
