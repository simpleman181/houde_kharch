import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number;
  text: string;
  gravity: number;
}

interface Item {
  size: number;
  x: number;
  y: number;
  isMoney: boolean;
  isBonus: boolean;
  text: string;
  value: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  amplitude: number;
  frequency: number;
}

interface Player {
  width: number;
  height: number;
  x: number;
  y: number;
}

const BudgetCatcher: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameMessage, setGameMessage] = useState('');

  const gameDataRef = useRef({
    player: null as Player | null,
    items: [] as Item[],
    particles: [] as Particle[],
    inputX: 0,
    frameCount: 0,
    difficultyMultiplier: 1,
    comboTimer: 0,
    currentCombo: 0
  });

  const SPRITES = {
    player: '💼',
    money: '💵',
    bill: '🧾',
    bonus: '💰'
  };

  useEffect(() => {
    const backgroundParticles = ['💵', '💰', '💸', '🧾', '💼'];
    const bgContainer = document.getElementById('bgParticles');
    if (bgContainer) {
      bgContainer.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = backgroundParticles[Math.floor(Math.random() * backgroundParticles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        bgContainer.appendChild(particle);
      }
    }
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    if (gameDataRef.current.player) {
      gameDataRef.current.player.y = canvas.height - gameDataRef.current.player.height - 15;
      if (gameDataRef.current.player.x > canvas.width - gameDataRef.current.player.width) {
        gameDataRef.current.player.x = canvas.width / 2;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const updateInputPosition = (clientX: number) => {
    const canvas = canvasRef.current;
    const player = gameDataRef.current.player;
    if (!canvas || !player) return;

    const rect = canvas.getBoundingClientRect();
    let relativeX = clientX - rect.left;
    
    if (relativeX < player.width / 2) relativeX = player.width / 2;
    if (relativeX > canvas.width - player.width / 2) relativeX = canvas.width - player.width / 2;
    
    gameDataRef.current.inputX = relativeX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState === 'playing') {
      updateInputPosition(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState === 'playing') {
      e.preventDefault();
      updateInputPosition(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || !gameDataRef.current.player) return;
      
      const speed = 35;
      const player = gameDataRef.current.player;
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (e.key === 'ArrowLeft') gameDataRef.current.inputX -= speed;
      if (e.key === 'ArrowRight') gameDataRef.current.inputX += speed;
      
      if (gameDataRef.current.inputX < player.width/2) gameDataRef.current.inputX = player.width/2;
      if (gameDataRef.current.inputX > canvas.width - player.width/2) {
        gameDataRef.current.inputX = canvas.width - player.width/2;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const createPlayer = (): Player => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 65, height: 65, x: 300, y: 500 };
    
    return {
      width: 65,
      height: 65,
      x: canvas.width / 2,
      y: canvas.height - 65 - 15
    };
  };

  const createItem = (): Item => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      size: 45, x: 100, y: -60, isMoney: true, isBonus: false,
      text: SPRITES.money, value: 100, speed: 3, rotation: 0,
      rotationSpeed: 0.1, amplitude: 20, frequency: 0.01
    };

    const size = 45;
    const rand = Math.random();
    let isMoney: boolean, isBonus: boolean, text: string, value: number;

    if (rand > 0.95 && score > 500) {
      isMoney = true;
      isBonus = true;
      text = SPRITES.bonus;
      value = 500;
    } else {
      isMoney = rand > 0.25;
      isBonus = false;
      text = isMoney ? SPRITES.money : SPRITES.bill;
      value = 100;
    }

    return {
      size,
      x: Math.random() * (canvas.width - size * 2) + size,
      y: -60,
      isMoney,
      isBonus,
      text,
      value,
      speed: (Math.random() * 2 + 2.5) + (gameDataRef.current.difficultyMultiplier * 1.2),
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      amplitude: Math.random() * 30 + 20,
      frequency: Math.random() * 0.02 + 0.01
    };
  };

  const createParticle = (x: number, y: number, color: string, text = ''): Particle => {
    return {
      x,
      y,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 8,
      speedY: (Math.random() - 0.5) * 8 - 2,
      color,
      life: 1,
      text,
      gravity: 0.3
    };
  };

  const createExplosion = (x: number, y: number, color: string, emoji = '') => {
    for (let i = 0; i < 12; i++) {
      gameDataRef.current.particles.push(createParticle(x, y, color, i < 3 ? emoji : ''));
    }
  };

  const createFloatingScore = (x: number, y: number, value: number, isBonus: boolean) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-score';
    floatingText.textContent = isBonus ? `+₹${value} 🔥` : `+₹${value}`;
    floatingText.style.left = (x + rect.left - 30) + 'px';
    floatingText.style.top = (y + rect.top) + 'px';
    floatingText.style.color = isBonus ? '#ffa502' : '#00d084';
    container.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 1000);
  };

  const updateCombo = (caught: boolean) => {
    if (caught) {
      gameDataRef.current.currentCombo++;
      gameDataRef.current.comboTimer = 120;
      setCombo(gameDataRef.current.currentCombo);
    } else {
      gameDataRef.current.currentCombo = 0;
      gameDataRef.current.comboTimer = 0;
      setCombo(0);
    }
  };

  const handleGameOver = () => {
    const finalScore = score;
    setFinalScore(finalScore);
    
    if (finalScore < 1000) setGameMessage("चांगला प्रयत्न! अजून सराव करा");
    else if (finalScore < 3000) setGameMessage("छान! तुम्ही चांगले बचत केले");
    else if (finalScore < 5000) setGameMessage("अप्रतिम! Budget Master!");
    else setGameMessage("🏆 वाह! तुम्ही तर Financial Genius आहात!");

    setGameState('gameOver');
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { player, items, particles, frameCount } = gameDataRef.current;
    if (!player) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#e3f2fd');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gameDataRef.current.frameCount++;

    if (frameCount % 900 === 0) {
      gameDataRef.current.difficultyMultiplier += 0.3;
    }

    if (gameDataRef.current.comboTimer > 0) gameDataRef.current.comboTimer--;
    if (gameDataRef.current.comboTimer === 0 && gameDataRef.current.currentCombo > 0) {
      updateCombo(false);
    }

    const spawnRate = Math.max(25, 65 - (gameDataRef.current.difficultyMultiplier * 6));
    if (frameCount % Math.floor(spawnRate) === 0) {
      items.push(createItem());
    }

    // Update player
    player.x += (gameDataRef.current.inputX - player.x) * 0.25;

    // Draw player
    ctx.save();
    const wobble = Math.sin(frameCount * 0.1) * 2;
    ctx.translate(player.x, player.y + wobble);
    ctx.font = `${player.width}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fillText(SPRITES.player, 0, player.height / 2);
    ctx.restore();

    // Update and draw items
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;
      item.rotation += item.rotationSpeed;
      item.x += Math.sin(item.y * item.frequency) * 0.5;

      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      ctx.font = `${item.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (item.isBonus) {
        ctx.shadowColor = '#ffa502';
        ctx.shadowBlur = 20;
      }
      
      ctx.fillText(item.text, 0, 0);
      ctx.restore();

      // Collision detection
      const dx = item.x - player.x;
      const dy = item.y - (player.y + player.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (player.width / 2 + item.size / 2 - 8)) {
        if (item.isMoney) {
          let points = item.value;
          if (gameDataRef.current.currentCombo >= 3) {
            points = Math.floor(points * (1 + gameDataRef.current.currentCombo * 0.1));
          }
          
          setScore(prev => prev + points);
          createExplosion(item.x, item.y, '#00d084', '💰');
          createFloatingScore(item.x, item.y, points, item.isBonus);
          updateCombo(true);
        } else {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setTimeout(handleGameOver, 100);
            }
            return newLives;
          });
          createExplosion(item.x, item.y, '#ff4757', '💥');
          updateCombo(false);
          
          if (containerRef.current) {
            containerRef.current.style.transform = `translate(${Math.random() * 12 - 6}px, ${Math.random() * 12 - 6}px)`;
            setTimeout(() => {
              if (containerRef.current) containerRef.current.style.transform = 'none';
            }, 120);
          }
        }
        items.splice(i, 1);
        continue;
      }

      if (item.y > canvas.height + 70) {
        items.splice(i, 1);
      }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += p.gravity;
      p.life -= 0.02;

      ctx.globalAlpha = p.life;
      if (p.text) {
        ctx.font = `${p.size * 3}px Arial`;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (p.life <= 0) particles.splice(i, 1);
    }

    animationIdRef.current = requestAnimationFrame(animate);
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setCombo(0);
    gameDataRef.current.difficultyMultiplier = 1;
    gameDataRef.current.items = [];
    gameDataRef.current.particles = [];
    gameDataRef.current.frameCount = 0;
    gameDataRef.current.currentCombo = 0;
    gameDataRef.current.comboTimer = 0;

    resizeCanvas();
    const canvas = canvasRef.current;
    if (canvas) {
      gameDataRef.current.inputX = canvas.width / 2;
    }
    gameDataRef.current.player = createPlayer();

    setGameState('playing');
    animate();
  };

  useEffect(() => {
    resizeCanvas();
  }, []);

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundAttachment: 'fixed', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        
        .bg-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
        }

        .particle {
          position: absolute;
          font-size: 24px;
          animation: float 15s infinite ease-in-out;
          opacity: 0.6;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-30px) rotate(5deg); }
          50% { transform: translateY(-60px) rotate(-5deg); }
          75% { transform: translateY(-30px) rotate(3deg); }
        }

        .floating-score {
          position: absolute;
          font-size: 2rem;
          font-weight: 800;
          pointer-events: none;
          z-index: 100;
          animation: floatUp 1s ease-out forwards;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }

        @keyframes slideDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div className="bg-particles" id="bgParticles"></div>

      <header style={{ position: 'relative', textAlign: 'center', zIndex: 10, marginBottom: '20px', animation: 'slideDown 0.6s ease-out' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.3)', background: 'linear-gradient(45deg, #fff, #00d084)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          💼 Budget Catcher
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          बचत करा, बिले टाळा! Save Money, Avoid Bills!
        </p>
      </header>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '700px',
          height: '75vh',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.3)',
          zIndex: 1,
          animation: 'scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          transition: 'transform 0.1s'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            cursor: 'none',
            background: 'linear-gradient(180deg, #e3f2fd 0%, #fff 100%)'
          }}
        />

        {gameState === 'playing' && (
          <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', display: 'flex', justifyContent: 'space-between', gap: '15px', padding: 0, pointerEvents: 'none', zIndex: 5 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', fontWeight: 700, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px', border: '2px solid rgba(255,255,255,0.5)', color: '#00d084', flex: 1 }}>
              💰 ₹{score.toLocaleString('en-IN')}
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', fontWeight: 700, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px', border: '2px solid rgba(255,255,255,0.5)', color: '#ff4757' }}>
              ❤️ {lives}
            </div>
            {combo >= 3 && (
              <div style={{ background: 'linear-gradient(135deg, #ffa502, #ff6348)', color: 'white', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', fontWeight: 700, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px', border: '2px solid rgba(255,255,255,0.5)' }}>
                🔥 {combo}x
              </div>
            )}
          </div>
        )}

        {gameState === 'start' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)', backdropFilter: 'blur(15px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '40px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', animation: 'bounceIn 0.6s ease-out' }}>
              <h2 style={{ marginBottom: '15px', fontSize: '2.5rem', color: 'white', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>तयार आहात का?</h2>
              <p style={{ color: 'white', fontSize: '1.1rem', margin: '25px 0', textAlign: 'center', maxWidth: '85%', lineHeight: 1.8, fontWeight: 500, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                🖱️ Mouse किंवा Touch वापरा तुमचे Wallet नियंत्रित करण्यासाठी<br/>
                💵 <strong style={{ color: '#00d084', fontWeight: 700, textShadow: '0 0 10px rgba(0,208,132,0.5)' }}>Money (रुपये)</strong> पकडा • 🧾 <strong style={{ color: '#00d084', fontWeight: 700, textShadow: '0 0 10px rgba(0,208,132,0.5)' }}>Bills (बिले)</strong> टाळा
              </p>
              <button
                onClick={startGame}
                style={{ background: 'linear-gradient(135deg, #00d084, #00a8ff)', color: 'white', border: 'none', padding: '18px 50px', fontSize: '1.6rem', borderRadius: '60px', cursor: 'pointer', boxShadow: '0 8px 0 rgba(0,0,0,0.2), 0 12px 24px rgba(0,208,132,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', position: 'relative', overflow: 'hidden' }}
              >
                सुरू करा Start
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)', backdropFilter: 'blur(15px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '40px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', animation: 'bounceIn 0.6s ease-out' }}>
              <div style={{ fontSize: '1.4rem', color: 'white', marginBottom: '8px', fontWeight: 600, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                एकूण बचत Total Savings
              </div>
              <div style={{ fontSize: '4.5rem', fontWeight: 800, background: 'linear-gradient(45deg, #00d084, #00a8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '15px', textShadow: '0 4px 20px rgba(0,208,132,0.3)', animation: 'pulse 2s ease-in-out infinite' }}>
                ₹{finalScore.toLocaleString('en-IN')}
              </div>
              <p style={{ marginBottom: '30px', fontWeight: 700, color: 'white', fontSize: '1.5rem', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                {gameMessage}
              </p>
              <button
                onClick={startGame}
                style={{ background: 'linear-gradient(135deg, #00d084, #00a8ff)', color: 'white', border: 'none', padding: '18px 50px', fontSize: '1.6rem', borderRadius: '60px', cursor: 'pointer', boxShadow: '0 8px 0 rgba(0,0,0,0.2), 0 12px 24px rgba(0,208,132,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', position: 'relative', overflow: 'hidden' }}
              >
                पुन्हा प्रयत्न करा Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '25px', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500, textShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 1 }}>
        ⌨️ Arrow Keys • 🖱️ Mouse • 👆 Touch to Play
      </footer>
    </div>
  );
};

export default BudgetCatcher;