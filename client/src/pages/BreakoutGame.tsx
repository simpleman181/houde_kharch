import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Types & Interfaces ---
interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  speed: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dx: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
  maxHits: number;
  color: string;
  points: number;
  visible: boolean;
  powerUp?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

interface PowerUp {
  x: number;
  y: number;
  type: string;
  width: number;
  height: number;
  dy: number;
  icon: string;
  color: string;
}

interface ComboPopup {
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
}

// --- Sound Helper ---
const playSound = (type: 'paddle' | 'brick' | 'wall' | 'powerup' | 'lose' | 'win' | 'combo') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    switch (type) {
      case 'paddle':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'brick':
        osc.type = 'square';
        osc.frequency.setValueAtTime(660, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case 'wall':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'powerup':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'lose':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'win':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case 'combo':
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
    }
  } catch (e) {
    console.error('Audio error:', e);
  }
};

const BreakoutGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game State
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameover' | 'win'>('start');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [combo, setCombo] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [showRules, setShowRules] = useState<boolean>(false);

  // Game Entities
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 8, speed: 4 });
  const paddleRef = useRef<Paddle>({ x: 0, y: 0, width: 100, height: 15, speed: 8, dx: 0 });
  const bricksRef = useRef<Brick[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const comboPopupsRef = useRef<ComboPopup[]>([]);
  const comboCountRef = useRef<number>(0);
  const lastHitTimeRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Power-up states
  const [activePowerUps, setActivePowerUps] = useState<{
    widePaddle?: number;
    slowBall?: number;
    multiBall?: number;
  }>({});

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('breakoutHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Canvas Setup
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setupCanvas);
    setupCanvas();
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  // Initialize Game
  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    // Initialize ball
    ballRef.current = {
      x: width / 2,
      y: height - 50,
      dx: 4 * (Math.random() > 0.5 ? 1 : -1),
      dy: -4,
      radius: 8,
      speed: 4 + (level - 1) * 0.5
    };
    
    // Initialize paddle
    paddleRef.current = {
      x: width / 2 - 50,
      y: height - 30,
      width: 100,
      height: 15,
      speed: 8,
      dx: 0
    };
    
    // Create bricks
    createBricks();
  }, [level]);

  // Create Bricks
  const createBricks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width / (window.devicePixelRatio || 1);
    const brickWidth = 70;
    const brickHeight = 25;
    const padding = 8;
    const offsetX = 35;
    const offsetY = 60;
    const rows = 5 + Math.floor(level / 2);
    const cols = Math.floor((width - offsetX * 2) / (brickWidth + padding));

    const bricks: Brick[] = [];
    const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#667eea', '#f093fb'];
    const powerUpChance = 0.15;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const maxHits = Math.min(Math.ceil(row / 2) + 1, 3);
        const powerUp = Math.random() < powerUpChance ? 
          ['wide', 'slow', 'multi'][Math.floor(Math.random() * 3)] : undefined;
        
        bricks.push({
          x: offsetX + col * (brickWidth + padding),
          y: offsetY + row * (brickHeight + padding),
          width: brickWidth,
          height: brickHeight,
          hits: 0,
          maxHits: maxHits,
          color: colors[row % colors.length],
          points: maxHits * 10,
          visible: true,
          powerUp: powerUp
        });
      }
    }
    
    bricksRef.current = bricks;
  };

  // Create Particles
  const createParticles = (x: number, y: number, color: string, count: number = 12) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1.0,
        size: Math.random() * 4 + 2,
        color
      });
    }
  };

  // Create Power-up Drop
  const createPowerUp = (x: number, y: number, type: string) => {
    const powerUpConfig: { [key: string]: { icon: string; color: string } } = {
      wide: { icon: '⬌', color: '#667eea' },
      slow: { icon: '🐌', color: '#ffd93d' },
      multi: { icon: '⚡', color: '#ff6b6b' }
    };
    
    const config = powerUpConfig[type] || powerUpConfig.wide;
    
    powerUpsRef.current.push({
      x: x,
      y: y,
      type: type,
      width: 30,
      height: 30,
      dy: 2,
      icon: config.icon,
      color: config.color
    });
  };

  // Activate Power-up
  const activatePowerUp = (type: string) => {
    playSound('powerup');
    const duration = 10000; // 10 seconds
    
    switch (type) {
      case 'wide':
        paddleRef.current.width = 150;
        setActivePowerUps(prev => ({ ...prev, widePaddle: Date.now() + duration }));
        break;
      case 'slow':
        ballRef.current.dx *= 0.6;
        ballRef.current.dy *= 0.6;
        setActivePowerUps(prev => ({ ...prev, slowBall: Date.now() + duration }));
        break;
      case 'multi':
        // Multi-ball implementation would be more complex
        setActivePowerUps(prev => ({ ...prev, multiBall: Date.now() + duration }));
        break;
    }
  };

  // Create Combo Popup
  const createComboPopup = (x: number, y: number, comboCount: number) => {
    let text = '';
    let color = '#ffd93d';
    
    if (comboCount === 3) {
      text = 'COMBO x3!';
      color = '#ffd93d';
    } else if (comboCount === 5) {
      text = 'SUPER x5!';
      color = '#ff6b6b';
    } else if (comboCount === 10) {
      text = 'MEGA x10!';
      color = '#667eea';
    } else if (comboCount >= 15) {
      text = `ULTRA x${comboCount}!`;
      color = '#f093fb';
    }
    
    if (text) {
      comboPopupsRef.current.push({
        x,
        y: y - 20,
        text,
        life: 1.0,
        color
      });
      playSound('combo');
    }
  };

  // Game Loop
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update paddle
    const paddle = paddleRef.current;
    paddle.x += paddle.dx;
    paddle.x = Math.max(0, Math.min(width - paddle.width, paddle.x));

    // Draw paddle with glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#667eea';
    ctx.fillStyle = 'linear-gradient(to bottom, #667eea, #764ba2)';
    const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    paddleGradient.addColorStop(0, '#667eea');
    paddleGradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;

    // Update ball
    const ball = ballRef.current;
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
      ball.dx *= -1;
      playSound('wall');
    }
    if (ball.y - ball.radius < 0) {
      ball.dy *= -1;
      playSound('wall');
    }

    // Ball collision with paddle
    if (
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      // Add spin based on where ball hits paddle
      const hitPos = (ball.x - paddle.x) / paddle.width;
      const angle = (hitPos - 0.5) * Math.PI / 3; // -60 to 60 degrees
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      ball.dx = speed * Math.sin(angle);
      ball.dy = -speed * Math.cos(angle);
      playSound('paddle');
    }

    // Ball falls below paddle - lose life
    if (ball.y + ball.radius > height) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameState('gameover');
          playSound('lose');
        } else {
          playSound('lose');
          // Reset ball and paddle
          ball.x = width / 2;
          ball.y = height - 50;
          ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
          ball.dy = -4;
          paddle.x = width / 2 - paddle.width / 2;
        }
        comboCountRef.current = 0;
        setCombo(0);
        return newLives;
      });
    }

    // Draw ball with glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffd93d';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd93d';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball collision with bricks
    bricksRef.current.forEach(brick => {
      if (!brick.visible) return;

      if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
      ) {
        ball.dy *= -1;
        brick.hits++;

        if (brick.hits >= brick.maxHits) {
          brick.visible = false;
          
          // Update combo
          const now = Date.now();
          if (now - lastHitTimeRef.current < 1000) {
            comboCountRef.current++;
          } else {
            comboCountRef.current = 1;
          }
          lastHitTimeRef.current = now;
          setCombo(comboCountRef.current);

          // Score with combo multiplier
          const multiplier = Math.min(Math.floor(comboCountRef.current / 3) + 1, 5);
          setScore(s => s + brick.points * multiplier);
          
          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, 15);
          createComboPopup(brick.x + brick.width / 2, brick.y + brick.height / 2, comboCountRef.current);
          
          // Drop power-up
          if (brick.powerUp) {
            createPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.powerUp);
          }
          
          playSound('brick');
        } else {
          playSound('brick');
        }
      }
    });

    // Draw bricks
    bricksRef.current.forEach(brick => {
      if (!brick.visible) return;

      const alpha = 1 - (brick.hits / brick.maxHits) * 0.5;
      ctx.globalAlpha = alpha;
      
      // Brick gradient
      const brickGradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
      brickGradient.addColorStop(0, brick.color);
      brickGradient.addColorStop(1, adjustColor(brick.color, -20));
      ctx.fillStyle = brickGradient;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      
      // Brick border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      
      // Power-up indicator
      if (brick.powerUp) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', brick.x + brick.width / 2, brick.y + brick.height / 2);
      }
      
      ctx.globalAlpha = 1.0;
    });

    // Update & Draw Power-ups
    powerUpsRef.current = powerUpsRef.current.filter(powerUp => {
      powerUp.y += powerUp.dy;

      // Check collision with paddle
      if (
        powerUp.y + powerUp.height > paddle.y &&
        powerUp.y < paddle.y + paddle.height &&
        powerUp.x + powerUp.width > paddle.x &&
        powerUp.x < paddle.x + paddle.width
      ) {
        activatePowerUp(powerUp.type);
        return false;
      }

      // Remove if off screen
      if (powerUp.y > height) return false;

      // Draw power-up
      ctx.fillStyle = powerUp.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = powerUp.color;
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(powerUp.icon, powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
      
      return true;
    });

    // Update & Draw Particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.02;
      
      if (p.life > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        return true;
      }
      return false;
    });

    // Update & Draw Combo Popups
    comboPopupsRef.current = comboPopupsRef.current.filter(popup => {
      popup.y -= 1.5;
      popup.life -= 0.015;
      
      if (popup.life > 0) {
        ctx.font = 'bold 20px Poppins';
        ctx.textAlign = 'center';
        ctx.fillStyle = popup.color;
        ctx.globalAlpha = popup.life;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeText(popup.text, popup.x, popup.y);
        ctx.fillText(popup.text, popup.x, popup.y);
        ctx.globalAlpha = 1.0;
        return true;
      }
      return false;
    });

    // Check for level complete
    const allBricksGone = bricksRef.current.every(brick => !brick.visible);
    if (allBricksGone) {
      setLevel(prev => prev + 1);
      setLives(prev => Math.min(prev + 1, 5)); // Bonus life
      playSound('win');
      setTimeout(() => {
        initializeGame();
      }, 1000);
    }

    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState, initializeGame]);

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Check power-up expiration
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      if (activePowerUps.widePaddle && now > activePowerUps.widePaddle) {
        paddleRef.current.width = 100;
        setActivePowerUps(prev => ({ ...prev, widePaddle: undefined }));
      }
      
      if (activePowerUps.slowBall && now > activePowerUps.slowBall) {
        const speed = 4 + (level - 1) * 0.5;
        const currentSpeed = Math.sqrt(ballRef.current.dx ** 2 + ballRef.current.dy ** 2);
        const ratio = speed / currentSpeed;
        ballRef.current.dx *= ratio;
        ballRef.current.dy *= ratio;
        setActivePowerUps(prev => ({ ...prev, slowBall: undefined }));
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [activePowerUps, level]);

  // Start Game
  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    comboCountRef.current = 0;
    setActivePowerUps({});
    particlesRef.current = [];
    powerUpsRef.current = [];
    comboPopupsRef.current = [];
    initializeGame();
    setGameState('playing');
  };

  // End Game
  useEffect(() => {
    if (gameState === 'gameover') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('breakoutHighScore', score.toString());
      }
    }
  }, [gameState, score, highScore]);

  // Animation loop
  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, updateGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
        paddleRef.current.dx = -paddleRef.current.speed;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
        paddleRef.current.dx = paddleRef.current.speed;
      }
      if (e.key === ' ' && gameState === 'playing') {
        setGameState('paused');
      } else if (e.key === ' ' && gameState === 'paused') {
        setGameState('playing');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = false;
        if (!keysRef.current.right) paddleRef.current.dx = 0;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = false;
        if (!keysRef.current.left) paddleRef.current.dx = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

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
        maxWidth: '900px',
        width: '100%',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 8px 0',
            fontWeight: 800
          }}>
            🎮 ब्रेकआऊट खेळ
          </h1>
          <p style={{ color: '#6c757d', fontSize: '1rem', margin: 0 }}>
            Breakout Master Challenge
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6bcf7f 0%, #4caf50 100%)',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(107, 207, 127, 0.3)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px' }}>गुण Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{score}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px' }}>जीवन Lives</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{'❤️'.repeat(lives)}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #ffd93d 0%, #f9ca24 100%)',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 217, 61, 0.3)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px' }}>स्तर Level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{level}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px' }}>कॉम्बो Combo</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{combo > 0 ? `x${combo}` : '-'}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px' }}>सर्वोत्तम Best</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{highScore}</div>
          </div>
        </div>

        {/* Active Power-ups Bar */}
        {(activePowerUps.widePaddle || activePowerUps.slowBall || activePowerUps.multiBall) && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            border: '2px solid rgba(102, 126, 234, 0.3)'
          }}>
            {activePowerUps.widePaddle && (
              <div style={{
                background: '#667eea',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                ⬌ रुंद पॅडल Wide Paddle
              </div>
            )}
            {activePowerUps.slowBall && (
              <div style={{
                background: '#ffd93d',
                color: '#333',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                🐌 हळू चेंडू Slow Ball
              </div>
            )}
            {activePowerUps.multiBall && (
              <div style={{
                background: '#ff6b6b',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                ⚡ एकाधिक चेंडू Multi Ball
              </div>
            )}
          </div>
        )}

        {/* Game Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '550px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          border: '3px solid rgba(255, 255, 255, 0.3)'
        }}>
          <canvas 
            ref={canvasRef}
            style={{ 
              width: '100%', 
              height: '100%', 
              display: 'block'
            }}
          />

          {/* Start Screen */}
          {gameState === 'start' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '50px',
                borderRadius: '25px',
                textAlign: 'center',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎮</div>
                <h2 style={{
                  color: 'white',
                  marginBottom: '15px',
                  fontSize: '2rem',
                  fontWeight: 700
                }}>
                  ब्रेकआऊटमध्ये स्वागत!
                </h2>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.1rem',
                  marginBottom: '20px',
                  lineHeight: 1.6
                }}>
                  सर्व विटा फोडा आणि उच्च गुण मिळवा!<br/>
                  कॉम्बो बोनस मिळवण्यासाठी सलग विटा फोडा!
                </p>
                
                <button 
                  onClick={startGame}
                  style={{
                    background: 'linear-gradient(135deg, #ffd93d 0%, #f9ca24 100%)',
                    color: '#333',
                    border: 'none',
                    padding: '18px 60px',
                    fontSize: '1.4rem',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 10px 25px rgba(255, 217, 61, 0.4)',
                    transition: 'all 0.3s ease',
                    marginBottom: '15px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 217, 61, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 217, 61, 0.4)';
                  }}
                >
                  🎯 सुरू करा
                </button>
                
                <button 
                  onClick={() => setShowRules(true)}
                  style={{
                    background: 'transparent',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    padding: '12px 30px',
                    fontSize: '1rem',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  📖 नियम पहा
                </button>
              </div>
            </div>
          )}

          {/* Paused Screen */}
          {gameState === 'paused' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                textAlign: 'center',
                color: 'white'
              }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>⏸️</h2>
                <h3 style={{ fontSize: '2rem', marginBottom: '15px' }}>थांबलेले PAUSED</h3>
                <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                  सुरू ठेवण्यासाठी SPACE दाबा
                </p>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
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
                padding: '50px',
                borderRadius: '25px',
                textAlign: 'center',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h2 style={{
                  color: '#ff6b6b',
                  fontSize: '2.2rem',
                  marginBottom: '10px',
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}>
                  खेळ खल्लास!
                </h2>
                <h3 style={{
                  color: 'white',
                  fontSize: '3rem',
                  marginBottom: '30px',
                  fontWeight: 800,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}>
                  GAME OVER
                </h3>
                
                <div style={{
                  background: 'white',
                  padding: '30px 50px',
                  borderRadius: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ color: '#6c757d', fontSize: '0.95rem', marginBottom: '10px' }}>
                    अंतिम गुण
                  </div>
                  <div style={{
                    color: '#667eea',
                    fontSize: '4rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: '10px'
                  }}>
                    {score}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginTop: '15px',
                    fontSize: '0.9rem',
                    color: '#6c757d'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>पोहोचलेले स्तर</div>
                      <div style={{ fontSize: '1.5rem', color: '#667eea', fontWeight: 700 }}>{level}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>सर्वोच्च कॉम्बो</div>
                      <div style={{ fontSize: '1.5rem', color: '#ffd93d', fontWeight: 700 }}>x{combo}</div>
                    </div>
                  </div>
                  {score === highScore && score > 0 && (
                    <div style={{
                      color: '#ffd93d',
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginTop: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>🏆</span>
                      नवीन विक्रम!
                    </div>
                  )}
                </div>

                <button 
                  onClick={startGame}
                  style={{
                    background: 'linear-gradient(135deg, #6bcf7f 0%, #4caf50 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '18px 60px',
                    fontSize: '1.3rem',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 10px 25px rgba(107, 207, 127, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(107, 207, 127, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(107, 207, 127, 0.4)';
                  }}
                >
                  🔄 पुन्हा खेळा
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Info */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '15px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⬅️ ➡️</div>
              <div style={{ fontSize: '0.9rem', color: '#495057', fontWeight: 600 }}>
                पॅडल हलवा
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                Arrow Keys / A,D
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⎵</div>
              <div style={{ fontSize: '0.9rem', color: '#495057', fontWeight: 600 }}>
                थांबवा/सुरू करा
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                Space Bar
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontSize: '0.9rem', color: '#495057', fontWeight: 600 }}>
                पॉवर-अप पकडा
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                Catch falling items
              </div>
            </div>
          </div>
        </div>

        {/* Power-ups Legend */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          padding: '20px',
          borderRadius: '15px',
          border: '2px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '15px', fontWeight: 600, color: '#495057' }}>
            ⚡ पॉवर-अप | Power-ups
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#667eea',
                color: 'white',
                width: '35px',
                height: '35px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>⬌</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#495057' }}>रुंद पॅडल</div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>Wide Paddle (10s)</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#ffd93d',
                color: 'white',
                width: '35px',
                height: '35px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>🐌</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#495057' }}>हळू चेंडू</div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>Slow Ball (10s)</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#ff6b6b',
                color: 'white',
                width: '35px',
                height: '35px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>⚡</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#495057' }}>एकाधिक चेंडू</div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>Multi Ball (10s)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '25px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              fontWeight: 800
            }}>
              📖 खेळण्याचे नियम
            </h2>
            
            <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#495057' }}>
              <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>🎯 उद्देश:</h3>
              <p>सर्व विटा फोडा आणि शक्य तितक्या जास्त गुण मिळवा!</p>
              
              <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>🎮 कसे खेळायचे:</h3>
              <ul style={{ paddingLeft: '25px' }}>
                <li>Arrow keys किंवा A/D keys वापरून पॅडल हलवा</li>
                <li>चेंडू उचलण्यासाठी आणि विटा फोडण्यासाठी पॅडल वापरा</li>
                <li>चेंडू जमिनीवर पडू देऊ नका - तुम्ही एक जीवन गमवाल!</li>
                <li>Space bar दाबून खेळ थांबवा/सुरू करा</li>
              </ul>
              
              <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>⚡ पॉवर-अप:</h3>
              <ul style={{ paddingLeft: '25px' }}>
                <li><strong>⬌ रुंद पॅडल:</strong> तुमचा पॅडल 10 सेकंदांसाठी मोठा होतो</li>
                <li><strong>🐌 हळू चेंडू:</strong> चेंडू 10 सेकंदांसाठी हळू होतो</li>
                <li><strong>⚡ एकाधिक चेंडू:</strong> अधिक नाश करण्यासाठी अतिरिक्त शक्ती!</li>
              </ul>
              
              <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>🔥 कॉम्बो सिस्टम:</h3>
              <ul style={{ paddingLeft: '25px' }}>
                <li>सलग विटा फोडल्यास कॉम्बो मल्टिप्लायर वाढतो</li>
                <li>उच्च कॉम्बो = जास्त गुण!</li>
                <li>चेंडू चुकल्यास कॉम्बो रीसेट होतो</li>
              </ul>
              
              <h3 style={{ color: '#667eea', marginTop: '20px', marginBottom: '10px' }}>🎖️ गुण:</h3>
              <ul style={{ paddingLeft: '25px' }}>
                <li>विविध रंगाच्या विटा = विविध गुण</li>
                <li>अनेक हिट घेणाऱ्या विटा जास्त गुण देतात</li>
                <li>स्तर पूर्ण केल्यावर बोनस जीवन मिळते</li>
                <li>प्रत्येक स्तरात अधिक कठीण पॅटर्न आणि जास्त वेग</li>
              </ul>
            </div>
            
            <button 
              onClick={() => setShowRules(false)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                fontSize: '1.1rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 700,
                marginTop: '30px',
                width: '100%',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
            >
              समजले! Got it!
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default BreakoutGame;
