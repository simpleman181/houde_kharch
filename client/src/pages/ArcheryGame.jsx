import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Types & Interfaces ---
interface Arrow {
  x: number;
  y: number;
  angle: number;
  speed: number;
  id: number;
}

interface Target {
  x: number;
  y: number;
  radius: number;
  speed: number;
  direction: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

// --- Sound Helper ---
const playSound = (type: 'shoot' | 'hit' | 'gameover') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'shoot') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

const ArcheryGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [highScore, setHighScore] = useState<number>(0);

  const arrowsRef = useRef<Arrow[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const targetRef = useRef<Target>({
    x: 0,
    y: 100,
    radius: 30,
    speed: 2,
    direction: 1
  });
  const arrowIdRef = useRef(0);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('archeryHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      
      targetRef.current.x = rect.width / 2;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setupCanvas);
    setupCanvas();
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 1. Update & Draw Target
    const target = targetRef.current;
    
    target.x += target.speed * target.direction;
    
    if (target.x + target.radius > width || target.x - target.radius < 0) {
      target.direction *= -1;
      target.y = Math.max(50, Math.min(height / 2, target.y + (Math.random() - 0.5) * 100));
    }

    // Draw Target with glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255, 107, 107, 0.6)';
    
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();
    ctx.strokeStyle = '#ee5a52';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 0.66, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 0.33, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();

    // 2. Update & Draw Arrows
    arrowsRef.current = arrowsRef.current.filter(arrow => {
      arrow.x += Math.cos(arrow.angle) * arrow.speed;
      arrow.y += Math.sin(arrow.angle) * arrow.speed;

      const dx = arrow.x - target.x;
      const dy = arrow.y - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < target.radius) {
        setScore(s => s + 10);
        createParticles(arrow.x, arrow.y, '#ff6b6b');
        createParticles(arrow.x, arrow.y, '#ffd93d');
        playSound('hit');
        return false;
      }

      if (arrow.x < 0 || arrow.x > width || arrow.y < 0 || arrow.y > height) {
        return false;
      }

      drawArrow(ctx, arrow.x, arrow.y, arrow.angle);
      return true;
    });

    // 3. Update & Draw Particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Gravity
      p.life -= 0.02;
      
      if (p.life > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        return true;
      }
      return false;
    });

    // 4. Draw Bow
    const bowX = width / 2;
    const bowY = height - 60;
    const angleToMouse = Math.atan2(mousePos.y - bowY, mousePos.x - bowX);

    drawBow(ctx, bowX, bowY, angleToMouse);

    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, mousePos]);

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 1.0,
        color
      });
    }
  };

  const drawBow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 221, 61, 0.5)';
    
    ctx.beginPath();
    ctx.arc(0, 0, 40, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffd93d';
    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(0, 40);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.restore();
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Shaft with glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 221, 61, 0.6)';
    
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(10, 0);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffd93d';
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Tip
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(5, -6);
    ctx.lineTo(5, 6);
    ctx.closePath();
    ctx.fillStyle = '#ff6b6b';
    ctx.fill();

    // Feathers
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-26, -6);
    ctx.lineTo(-20, -2);
    ctx.closePath();
    ctx.fillStyle = '#6bcf7f';
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-26, 6);
    ctx.lineTo(-20, 2);
    ctx.closePath();
    ctx.fillStyle = '#6bcf7f';
    ctx.fill();

    ctx.restore();
  };

  const startGame = () => {
    arrowsRef.current = [];
    particlesRef.current = [];
    setScore(0);
    setTimeLeft(60);
    targetRef.current = {
      x: (canvasRef.current?.width || 800) / 2 / (window.devicePixelRatio||1),
      y: 100,
      radius: 30,
      speed: 3,
      direction: 1
    };
    setGameState('playing');
    requestRef.current = requestAnimationFrame(updateGame);
  };

  const endGame = () => {
    setGameState('gameover');
    playSound('gameover');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('archeryHighScore', score.toString());
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, updateGame]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleClick = () => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const bowX = width / 2;
    const bowY = height - 60;

    const angle = Math.atan2(mousePos.y - bowY, mousePos.x - bowX);

    arrowsRef.current.push({
      x: bowX + Math.cos(angle) * 40,
      y: bowY + Math.sin(angle) * 40,
      angle: angle,
      speed: 15,
      id: arrowIdRef.current++
    });

    playSound('shoot');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px',
        maxWidth: '700px',
        width: '100%',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 10px 0',
            fontWeight: 800
          }}>
            🏹 धनुर्विद्या Archery
          </h1>
          <p style={{
            color: '#6c757d',
            fontSize: '1rem',
            margin: 0
          }}>
            Test Your Precision & Aim
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6bcf7f 0%, #4caf50 100%)',
            padding: '15px',
            borderRadius: '15px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(107, 207, 127, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '5px' }}>Score</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{score}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            padding: '15px',
            borderRadius: '15px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '5px' }}>Time</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{timeLeft}s</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #ffd93d 0%, #f9ca24 100%)',
            padding: '15px',
            borderRadius: '15px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 217, 61, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '5px' }}>Best</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{highScore}</div>
          </div>
        </div>

        {/* Game Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '450px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          border: '3px solid rgba(255, 255, 255, 0.3)'
        }}>
          <canvas 
            ref={canvasRef} 
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block', 
              cursor: 'crosshair' 
            }}
          />

          {/* Start Overlay */}
          {gameState === 'start' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '40px',
                borderRadius: '20px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{
                  color: 'white',
                  marginBottom: '20px',
                  fontSize: '1.8rem',
                  fontWeight: 600
                }}>
                  तुमची शूटिंग स्किल चाचणी करा!
                </h2>
                <button 
                  onClick={startGame}
                  style={{
                    background: 'linear-gradient(135deg, #ffd93d 0%, #f9ca24 100%)',
                    color: '#333',
                    border: 'none',
                    padding: '15px 50px',
                    fontSize: '1.3rem',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(255, 217, 61, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(255, 217, 61, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 217, 61, 0.4)';
                  }}
                >
                  सुरू करा START
                </button>
                <p style={{
                  marginTop: '25px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6'
                }}>
                  🖱️ Move mouse to aim<br/>
                  🎯 Click to shoot arrows<br/>
                  ⏱️ Hit targets before time runs out!
                </p>
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'gameover' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.97) 0%, rgba(118, 75, 162, 0.97) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '40px',
                borderRadius: '20px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{
                  color: '#ff6b6b',
                  fontSize: '2rem',
                  marginBottom: '10px',
                  fontWeight: 700
                }}>
                  खेळ खल्लास!
                </h2>
                <h3 style={{
                  color: 'white',
                  fontSize: '2.5rem',
                  marginBottom: '30px',
                  fontWeight: 800
                }}>
                  GAME OVER
                </h3>
                
                <div style={{
                  background: 'white',
                  padding: '25px 40px',
                  borderRadius: '15px',
                  marginBottom: '30px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '8px' }}>
                    तुमचा एकूण गुण
                  </div>
                  <div style={{
                    color: '#667eea',
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    lineHeight: 1
                  }}>
                    {score}
                  </div>
                  {score === highScore && score > 0 && (
                    <div style={{
                      color: '#ffd93d',
                      fontSize: '0.9rem',
                      marginTop: '10px',
                      fontWeight: 600
                    }}>
                      🎉 New High Score!
                    </div>
                  )}
                </div>

                <button 
                  onClick={startGame}
                  style={{
                    background: 'linear-gradient(135deg, #6bcf7f 0%, #4caf50 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 50px',
                    fontSize: '1.2rem',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(107, 207, 127, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(107, 207, 127, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(107, 207, 127, 0.4)';
                  }}
                >
                  पुन्हा खेळा PLAY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            padding: '15px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🖱️</div>
            <div style={{ fontSize: '0.85rem', color: '#495057', fontWeight: 600 }}>
              Move to Aim
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🎯</div>
            <div style={{ fontSize: '0.85rem', color: '#495057', fontWeight: 600 }}>
              Target Focus
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔫</div>
            <div style={{ fontSize: '0.85rem', color: '#495057', fontWeight: 600 }}>
              Click to Shoot
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ArcheryGame;
