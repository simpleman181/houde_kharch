import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';

export default function Mandala() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#f97316');
  const [brushSize, setBrushSize] = useState(5);
  const [symmetry, setSymmetry] = useState(8);
  const [score, setScore] = useState(0);

  const colors = ['#f97316', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const drawWithSymmetry = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(brushSize / 2, brushSize / 2, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < symmetry; i++) {
      const angle = (i / symmetry) * Math.PI * 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const newAngle = Math.atan2(dy, dx) + angle;
      const newX = centerX + distance * Math.cos(newAngle);
      const newY = centerY + distance * Math.sin(newAngle);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(newX, newY, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Mirror effect
      ctx.beginPath();
      ctx.arc(centerX - (newX - centerX), newY, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    setScore(prev => prev + 1);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      drawWithSymmetry(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      drawWithSymmetry(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setScore(0);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `mandala-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold">
              <ArrowLeft size={20} />
              परत
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">मंडळ रंग</h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{score}</div>
            <p className="text-xs text-slate-600">अंक</p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card className="p-4 bg-white">
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full border-2 border-purple-200 rounded-lg cursor-crosshair bg-white"
              />
            </Card>
          </div>

          {/* Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-bold mb-3 text-slate-900">रंग निवडा</h3>
              <div className="grid grid-cols-3 gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-full h-10 rounded-lg transition-all ${
                      color === c ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold mb-3 text-slate-900">ब्रश आकार</h3>
              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={e => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-600 mt-2">{brushSize}px</p>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold mb-3 text-slate-900">सममिती</h3>
              <select
                value={symmetry}
                onChange={e => setSymmetry(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value={4}>4-गुणी</option>
                <option value={6}>6-गुणी</option>
                <option value={8}>8-गुणी</option>
                <option value={12}>12-गुणी</option>
              </select>
            </Card>

            <div className="space-y-2">
              <Button onClick={handleDownload} className="w-full bg-purple-500 hover:bg-purple-600">
                <Download size={16} className="mr-2" />
                डाउनलोड करा
              </Button>
              <Button onClick={handleClear} variant="outline" className="w-full">
                <RotateCcw size={16} className="mr-2" />
                साफ करा
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
