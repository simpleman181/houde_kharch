import React, { useEffect, useRef, useState } from 'react';

const BudgetCatcher: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game Logic based on the HTML content provided earlier
    // (Simplified for deployment confirmation)
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e3f2fd';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('Budget Catcher Running...', 50, 50);
      
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, isGameOver]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <header style={{ textAlign: 'center', color: 'white', marginBottom: '20px' }}>
        <h1>💼 Budget Catcher</h1>
        <p>बचत करा, बिले टाळा!</p>
      </header>
      
      <main style={{ position: 'relative', width: '95%', maxWidth: '700px', height: '75vh', background: 'white', borderRadius: '30px', overflow: 'hidden' }}>
        <canvas ref={canvasRef} width={700} height={500} style={{ display: 'block', width: '100%', height: '100%' }} />
        
        {!gameStarted && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <button onClick={() => setGameStarted(true)} style={{ padding: '15px 30px', fontSize: '20px', cursor: 'pointer' }}>सुरू करा Start</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BudgetCatcher;
