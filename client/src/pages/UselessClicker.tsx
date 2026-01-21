import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function UselessClicker() {
  const [, setLocation] = useLocation();
  const [count, setCount] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles((prevParticles) => {
        const newParticles = prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0);

        newParticles.forEach((p) => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life / 200;
          ctx.fillRect(p.x, p.y, 10, 10);
          ctx.globalAlpha = 1;
        });

        return newParticles;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);

    const newParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.random() * 10 - 5,
        vy: Math.random() * 10 - 5,
        life: 200,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-cyan-400 hover:text-cyan-300 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">निरुपयोगी क्लिकर</h1>
        <p className="text-center text-gray-300 mb-12">
          कोणाचीही मदत न करता क्लिक करा!
        </p>

        <div className="flex flex-col items-center gap-8">
          <Button
            onClick={handleClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-8 text-3xl font-bold rounded-lg transform hover:scale-110 transition-transform"
          >
            मला क्लिक करा!
          </Button>

          <div className="bg-slate-800 rounded-lg p-8 w-full max-w-md text-center">
            <p className="text-gray-400 mb-2">क्लिक्स</p>
            <p className="text-6xl font-bold text-cyan-400">{count}</p>
          </div>

          {count > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md text-center">
              <p className="text-sm text-gray-400 mb-2">
                {count < 100
                  ? "अधिक क्लिक करा!"
                  : count < 500
                    ? "तुम्ही व्यसनी आहात! 😄"
                    : "तुम्ही खरोखर निरुपयोगी आहात! 🎉"}
              </p>
            </div>
          )}

          <Button
            onClick={() => setCount(0)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 w-full max-w-md"
          >
            रीसेट करा
          </Button>
        </div>
      </div>
    </div>
  );
}
