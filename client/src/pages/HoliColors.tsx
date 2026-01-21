import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HoliColors() {
  const [, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [splashes, setSplashes] = useState<
    Array<{ x: number; y: number; color: string; particles: any[] }>
  >([]);
  const [clicks, setClicks] = useState(0);

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      splashes.forEach((splash, idx) => {
        splash.particles.forEach((p: any) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15;
          p.life--;

          ctx.fillStyle = splash.color;
          ctx.globalAlpha = p.life / 150;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        if (splash.particles.every((p: any) => p.life <= 0)) {
          splashes.splice(idx, 1);
        }
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();
  }, [splashes]);

  const createSplash = (x: number, y: number) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x,
        y,
        vx: Math.random() * 12 - 6,
        vy: Math.random() * 12 - 6,
        life: 150,
        size: Math.random() * 8 + 2,
      });
    }
    setSplashes([...splashes, { x, y, color, particles }]);
    setClicks(clicks + 1);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    createSplash(e.clientX, e.clientY);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="fixed top-0 left-0 w-full h-full cursor-crosshair"
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-blue-600 hover:text-blue-700 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">होळी - रंगांचा सण 🎨</h1>
        <p className="text-center text-gray-600 mb-8">
          रंग फेकून होळीचा सण साजरा करा!
        </p>

        <div className="bg-blue-50 rounded-lg p-6 text-center border-2 border-blue-200">
          <p className="text-2xl font-bold text-blue-600">
            रंग फेकले: {clicks}
          </p>
          <p className="text-gray-600 mt-2">
            होळी प्रेम, आनंद आणि रंगांचा सण आहे!
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            सर्वांना होळीच्या हार्दिक शुभेच्छा! 🌸
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            परत जा
          </Button>
        </div>
      </div>
    </div>
  );
}
