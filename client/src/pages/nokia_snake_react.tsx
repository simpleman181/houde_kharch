import React, { useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

const NokiaChaSaap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameIntervalRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const gameDataRef = useRef({
    snake: [] as Position[],
    food: { x: 15, y: 15 } as Position,
    velocity: { x: 0, y: 0 } as Velocity,
    gridSize: 20,
    tileCount: 25,
    speed: 8, // FPS - Slower initial speed
  });

  // Load high score on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('nokiaChaSaapHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { gridSize, tileCount } = gameDataRef.current;
    
    // Background
    ctx.fillStyle = '#9ea792';
    ctx.fillRect(0, 0, width, height);
    
    // Grid lines
    ctx.strokeStyle = '#8c9681';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(width, i * gridSize);
      ctx.stroke();
    }
  };

  const placeFood = () => {
    const { snake, tileCount } = gameDataRef.current;
    let valid = false;
    let newFood: Position = { x: 0, y: 0 };

    while (!valid) {
      newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };

      valid = true;
      for (let part of snake) {
        if (part.x === newFood.x && part.y === newFood.y) {
          valid = false;
          break;
        }
      }
    }

    gameDataRef.current.food = newFood;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { snake, food, gridSize } = gameDataRef.current;

    drawGrid(ctx, canvas.width, canvas.height);

    // Draw food with animation
    ctx.fillStyle = '#000000';
    const foodPulse = Math.sin(Date.now() / 200) * 2;
    ctx.fillRect(
      food.x * gridSize + 2 - foodPulse,
      food.y * gridSize + 2 - foodPulse,
      gridSize - 4 + foodPulse * 2,
      gridSize - 4 + foodPulse * 2
    );

    // Draw snake with head distinction
    snake.forEach((part, index) => {
      if (index === 0) {
        // Head - slightly larger
        ctx.fillStyle = '#000000';
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        
        // Eyes
        ctx.fillStyle = '#9ea792';
        const eyeSize = 3;
        const eyeOffset = 4;
        if (gameDataRef.current.velocity.x > 0) { // Moving right
          ctx.fillRect(part.x * gridSize + gridSize - eyeOffset - eyeSize, part.y * gridSize + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(part.x * gridSize + gridSize - eyeOffset - eyeSize, part.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (gameDataRef.current.velocity.x < 0) { // Moving left
          ctx.fillRect(part.x * gridSize + eyeOffset, part.y * gridSize + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(part.x * gridSize + eyeOffset, part.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (gameDataRef.current.velocity.y > 0) { // Moving down
          ctx.fillRect(part.x * gridSize + eyeOffset, part.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
          ctx.fillRect(part.x * gridSize + gridSize - eyeOffset - eyeSize, part.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (gameDataRef.current.velocity.y < 0) { // Moving up
          ctx.fillRect(part.x * gridSize + eyeOffset, part.y * gridSize + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(part.x * gridSize + gridSize - eyeOffset - eyeSize, part.y * gridSize + eyeOffset, eyeSize, eyeSize);
        }
      } else {
        // Body
        ctx.fillStyle = '#000000';
        ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
      }
    });
  };

  const update = () => {
    const { snake, food, velocity, tileCount } = gameDataRef.current;

    // Move snake head
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      gameOver();
      return;
    }

    // Self collision
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
        return;
      }
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 10);
      placeFood();
      
      // Vibration feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Speed up slightly every 50 points (more gradual increase)
      if ((score + 10) % 50 === 0 && gameDataRef.current.speed < 15) {
        gameDataRef.current.speed += 0.5;
        if (gameIntervalRef.current) {
          clearInterval(gameIntervalRef.current);
          gameIntervalRef.current = window.setInterval(gameLoop, 1000 / gameDataRef.current.speed);
        }
      }
    } else {
      snake.pop();
    }
  };

  const gameLoop = () => {
    if (isPaused) return;
    update();
    draw();
  };

  const gameOver = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    const currentScore = score;
    setFinalScore(currentScore);

    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('nokiaChaSaapHighScore', currentScore.toString());
    }

    setGameState('gameOver');
    
    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Screen shake
    if (containerRef.current) {
      containerRef.current.style.animation = 'shake 0.5s';
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.animation = '';
        }
      }, 500);
    }
  };

  const startGame = () => {
    gameDataRef.current.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    gameDataRef.current.velocity = { x: 1, y: 0 };
    gameDataRef.current.speed = 8;
    
    setScore(0);
    setIsPaused(false);
    setGameState('playing');
    
    placeFood();

    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    gameIntervalRef.current = window.setInterval(gameLoop, 1000 / gameDataRef.current.speed);
  };

  const handleInput = (direction: string) => {
    if (gameState !== 'playing' || isPaused) return;

    const { velocity } = gameDataRef.current;

    switch (direction) {
      case 'ArrowUp':
        if (velocity.y !== 1) gameDataRef.current.velocity = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (velocity.y !== -1) gameDataRef.current.velocity = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (velocity.x !== 1) gameDataRef.current.velocity = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (velocity.x !== -1) gameDataRef.current.velocity = { x: 1, y: 0 };
        break;
    }
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setIsPaused((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
        handleInput(e.code);
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isPaused]);

  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', 'Courier New', monospace", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundAttachment: 'fixed', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden', position: 'relative', padding: '20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 208, 132, 0.5); }
          50% { box-shadow: 0 0 40px rgba(0, 208, 132, 0.8); }
        }

        @keyframes slideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .btn-control {
          transition: all 0.15s ease;
        }

        .btn-control:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }

        .btn-control:active {
          transform: scale(0.95) translateY(2px);
        }
      `}</style>

      <header style={{ textAlign: 'center', marginBottom: '20px', animation: 'slideIn 0.6s ease-out' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 8px 0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', background: 'linear-gradient(45deg, #fff, #00d084)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          🐍 No-kiaa Cha Saap
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, margin: 0 }}>
          Nokia 3310 आठवणी | Classic Snake Game
        </p>
      </header>

      <div
        ref={containerRef}
        style={{
          background: 'linear-gradient(135deg, #4a4a4a, #2a2a2a)',
          padding: '25px',
          borderRadius: '35px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '95vw',
          border: '3px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center', color: '#ccc', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '5px', fontWeight: 600 }}>
          Nokia 3310 Edition
        </div>

        <div style={{ position: 'relative', background: '#9ea792', padding: '12px', borderRadius: '15px', boxShadow: 'inset 0 0 25px rgba(0,0,0,0.3)', border: '5px solid #333' }}>
          <canvas
            ref={canvasRef}
            width="500"
            height="500"
            style={{
              display: 'block',
              background: '#9ea792',
              imageRendering: 'pixelated',
            }}
          />

          {/* Scanlines */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none', zIndex: 5 }} />

          {/* Score Board */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#000', fontSize: '15px', pointerEvents: 'none', zIndex: 6, fontFamily: "'Courier New', monospace" }}>
            <span>SCORE: {score}</span>
            <span>HI: {highScore}</span>
          </div>

          {/* Pause Indicator */}
          {isPaused && gameState === 'playing' && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', color: '#000', opacity: 0.7, zIndex: 6, animation: 'bounceIn 0.3s ease-out' }}>
              ⏸
            </div>
          )}

          {/* Start Screen */}
          {gameState === 'start' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(158, 167, 146, 0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, textAlign: 'center' }}>
              <h2 style={{ color: '#000', fontSize: '2.5rem', margin: '0 0 15px 0', textShadow: '3px 3px 0px rgba(255,255,255,0.4)', fontWeight: 800 }}>
                साप (SNAKE)
              </h2>
              <p style={{ color: '#000', margin: '10px 0 25px 0', fontWeight: 700, fontSize: '1.1rem' }}>
                तयार आहात का? Ready to Play?
              </p>
              <button
                onClick={startGame}
                style={{
                  background: 'linear-gradient(135deg, #333, #111)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 35px',
                  fontFamily: "'Poppins', monospace",
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 0 #000, 0 8px 15px rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  transition: 'all 0.15s',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(6px)';
                  e.currentTarget.style.boxShadow = '0 0 0 #000';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 0 #000, 0 8px 15px rgba(0,0,0,0.3)';
                }}
              >
                सुरू करा START
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameOver' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(158, 167, 146, 0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, textAlign: 'center', animation: 'bounceIn 0.5s ease-out' }}>
              <h2 style={{ color: '#000', fontSize: '2.5rem', margin: '0 0 15px 0', textShadow: '3px 3px 0px rgba(255,255,255,0.4)', fontWeight: 800 }}>
                खेळ खल्लास! GAME OVER
              </h2>
              <p style={{ color: '#000', margin: '10px 0 8px 0', fontWeight: 700, fontSize: '1.1rem' }}>
                तुमचा Score: {finalScore}
              </p>
              {finalScore >= highScore && finalScore > 0 && (
                <p style={{ color: '#000', margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 600 }}>
                  🏆 नवीन रेकॉर्ड! New High Score!
                </p>
              )}
              <button
                onClick={startGame}
                style={{
                  background: 'linear-gradient(135deg, #333, #111)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 35px',
                  fontFamily: "'Poppins', monospace",
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 0 #000, 0 8px 15px rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  transition: 'all 0.15s',
                  marginTop: '10px',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(6px)';
                  e.currentTarget.style.boxShadow = '0 0 0 #000';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 0 #000, 0 8px 15px rgba(0,0,0,0.3)';
                }}
              >
                पुन्हा खेळा TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* Virtual D-Pad */}
        <div style={{ display: 'grid', gridTemplateColumns: '65px 65px 65px', gridTemplateRows: '55px 55px 55px', gap: '8px', marginTop: '10px' }}>
          <div style={{ gridColumn: 2, gridRow: 1 }}>
            <button
              onMouseDown={() => handleInput('ArrowUp')}
              onTouchStart={(e) => { e.preventDefault(); handleInput('ArrowUp'); }}
              className="btn-control"
              style={{
                background: 'linear-gradient(135deg, #444, #222)',
                border: 'none',
                borderRadius: '10px',
                color: '#00d084',
                fontSize: '28px',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #1a1a1a, 0 6px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontWeight: 'bold',
              }}
            >
              ▲
            </button>
          </div>
          
          <div style={{ gridColumn: 1, gridRow: 2 }}>
            <button
              onMouseDown={() => handleInput('ArrowLeft')}
              onTouchStart={(e) => { e.preventDefault(); handleInput('ArrowLeft'); }}
              className="btn-control"
              style={{
                background: 'linear-gradient(135deg, #444, #222)',
                border: 'none',
                borderRadius: '10px',
                color: '#00d084',
                fontSize: '28px',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #1a1a1a, 0 6px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontWeight: 'bold',
              }}
            >
              ◀
            </button>
          </div>

          <div style={{ gridColumn: 2, gridRow: 2 }}>
            <button
              onClick={togglePause}
              className="btn-control"
              style={{
                background: 'linear-gradient(135deg, #555, #333)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffa502',
                fontSize: '24px',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #1a1a1a, 0 6px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontWeight: 'bold',
              }}
            >
              {isPaused ? '▶' : '⏸'}
            </button>
          </div>

          <div style={{ gridColumn: 3, gridRow: 2 }}>
            <button
              onMouseDown={() => handleInput('ArrowRight')}
              onTouchStart={(e) => { e.preventDefault(); handleInput('ArrowRight'); }}
              className="btn-control"
              style={{
                background: 'linear-gradient(135deg, #444, #222)',
                border: 'none',
                borderRadius: '10px',
                color: '#00d084',
                fontSize: '28px',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #1a1a1a, 0 6px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontWeight: 'bold',
              }}
            >
              ▶
            </button>
          </div>

          <div style={{ gridColumn: 2, gridRow: 3 }}>
            <button
              onMouseDown={() => handleInput('ArrowDown')}
              onTouchStart={(e) => { e.preventDefault(); handleInput('ArrowDown'); }}
              className="btn-control"
              style={{
                background: 'linear-gradient(135deg, #444, #222)',
                border: 'none',
                borderRadius: '10px',
                color: '#00d084',
                fontSize: '28px',
                cursor: 'pointer',
                boxShadow: '0 5px 0 #1a1a1a, 0 6px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontWeight: 'bold',
              }}
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '25px', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', textAlign: 'center', fontWeight: 500 }}>
        ⌨️ Arrow Keys • 👆 Touch Controls • Space for Pause
      </div>
    </div>
  );
};

export default NokiaChaSaap;