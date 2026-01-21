import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function DiwaliCelebration() {
  const [, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fireworks, setFireworks] = useState<
    Array<{ x: number; y: number; particles: any[] }>
  >([]);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworks.forEach((fw, idx) => {
        fw.particles.forEach((p: any) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1;
          p.life--;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life / 100;
          ctx.fillRect(p.x, p.y, 4, 4);
        });

        if (fw.particles.every((p: any) => p.life <= 0)) {
          fireworks.splice(idx, 1);
        }
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();
  }, [fireworks]);

  const createFirework = (x: number, y: number) => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x,
        y,
        vx: Math.random() * 10 - 5,
        vy: Math.random() * 10 - 5,
        life: 100,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`,
      });
    }
    setFireworks([...fireworks, { x, y, particles }]);
    setClicks(clicks + 1);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    createFirework(e.clientX, e.clientY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="fixed top-0 left-0 w-full h-full cursor-crosshair"
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-cyan-400 hover:text-cyan-300 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">दिवाळी उत्सव 🪔</h1>
        <p className="text-center text-gray-300 mb-8">
          आकाशात फटाके फोडा! क्लिक करा आणि प्रकाश फैलवा!
        </p>

        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            फटाके: {clicks}
          </p>
          <p className="text-gray-300 mt-2">
            दिवाळीचा सण प्रकाशाचा आहे. आनंद साजरा करा!
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-300 mb-4">
            दिवाळीचे विशेष: प्रकाश, रंग आणि खुशियां!
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            परत जा
          </Button>
        </div>
      </div>
    </div>
  );
}
