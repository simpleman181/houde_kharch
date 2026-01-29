import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Position {
  x: number;
  y: number;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

const TeddyChiDhav: React.FC = () => {
    const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>();

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver' | 'won'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);

  const gameDataRef = useRef({
    player: {
      x: 50,
      y: 200,
      width: 40,
      height: 50,
      velocityX: 0,
      velocityY: 0,
      speed: 5,
      jumpPower: 15,
      isOnGround: false,
      facingRight: true,
      isDead: false,
    },
    platforms: [] as Platform[],
    enemies: [] as Enemy[],
    coins: [] as Coin[],
    camera: { x: 0 },
    gravity: 0.6,
    keys: { left: false, right: false, jump: false },
    levelWidth: 3000,
    frameCount: 0,
  });

  const initLevel = () => {
    const platforms: Platform[] = [
      { x: 0, y: 450, width: 500, height: 50 },
      { x: 600, y: 450, width: 400, height: 50 },
      { x: 1100, y: 450, width: 500, height: 50 },
      { x: 1700, y: 450, width: 400, height: 50 },
      { x: 2200, y: 450, width: 800, height: 50 },
      { x: 250, y: 350, width: 120, height: 20 },
      { x: 450, y: 280, width: 120, height: 20 },
      { x: 700, y: 320, width: 150, height: 20 },
      { x: 900, y: 250, width: 100, height: 20 },
      { x: 1200, y: 300, width: 120, height: 20 },
      { x: 1450, y: 350, width: 150, height: 20 },
      { x: 1800, y: 280, width: 120, height: 20 },
      { x: 2000, y: 200, width: 100, height: 20 },
      { x: 2300, y: 320, width: 150, height: 20 },
      { x: 2600, y: 250, width: 200, height: 20 },
    ];

    const enemies: Enemy[] = [
      { x: 300, y: 410, width: 35, height: 35, velocityX: 2 },
      { x: 750, y: 410, width: 35, height: 35, velocityX: -2 },
      { x: 1300, y: 410, width: 35, height: 35, velocityX: 2 },
      { x: 1850, y: 410, width: 35, height: 35, velocityX: -2 },
      { x: 2400, y: 410, width: 35, height: 35, velocityX: 2 },
    ];

    const coins: Coin[] = [
      { x: 310, y: 320, collected: false },
      { x: 510, y: 250, collected: false },
      { x: 760, y: 290, collected: false },
      { x: 960, y: 220, collected: false },
      { x: 1260, y: 270, collected: false },
      { x: 1510, y: 320, collected: false },
      { x: 1860, y: 250, collected: false },
      { x: 2060, y: 170, collected: false },
      { x: 2360, y: 290, collected: false },
      { x: 2660, y: 220, collected: false },
    ];

    gameDataRef.current.platforms = platforms;
    gameDataRef.current.enemies = enemies;
    gameDataRef.current.coins = coins;
  };

  const drawTeddy = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, facingRight: boolean) => {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!facingRight) ctx.scale(-1, 1);
    
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(0, 5, width * 0.35, height * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.arc(0, -height * 0.25, width * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(-width * 0.22, -height * 0.38, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.22, -height * 0.38, width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#D2B48C';
    ctx.beginPath();
    ctx.ellipse(0, -height * 0.18, width * 0.15, width * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, -height * 0.22, width * 0.06, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(-width * 0.12, -height * 0.28, width * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.12, -height * 0.28, width * 0.05, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(-width * 0.1, -height * 0.3, width * 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.14, -height * 0.3, width * 0.02, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy, cameraX: number) => {
    const x = enemy.x - cameraX;
    const bounce = Math.sin(gameDataRef.current.frameCount * 0.15) * 3;
    
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.ellipse(x + enemy.width / 2, enemy.y + enemy.height / 2 + bounce, enemy.width * 0.5, enemy.height * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(x + enemy.width * 0.3, enemy.y + enemy.height * 0.3 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + enemy.width * 0.7, enemy.y + enemy.height * 0.3 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCoin = (ctx: CanvasRenderingContext2D, coin: Coin, cameraX: number) => {
    if (coin.collected) return;
    
    const x = coin.x - cameraX;
    const spin = Math.sin(gameDataRef.current.frameCount * 0.1);
    
    ctx.save();
    ctx.translate(x + 15, coin.y + 15);
    ctx.scale(Math.abs(spin), 1);
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#B8860B';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₹', 0, 0);
    
    ctx.restore();
  };

  const checkCollision = (rect1: any, rect2: any): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const update = () => {
    const { player, platforms, enemies, coins, keys, gravity, camera, levelWidth } = gameDataRef.current;
    
    if (player.isDead) return;

    if (keys.left) {
      player.velocityX = -player.speed;
      player.facingRight = false;
    } else if (keys.right) {
      player.velocityX = player.speed;
      player.facingRight = true;
    } else {
      player.velocityX *= 0.8;
    }

    player.velocityY += gravity;
    if (player.velocityY > 15) player.velocityY = 15;

    player.x += player.velocityX;
    player.y += player.velocityY;

    player.isOnGround = false;
    for (let platform of platforms) {
      if (checkCollision(player, platform)) {
        if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y + 5) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
          player.isOnGround = true;
        }
      }
    }

    if (keys.jump && player.isOnGround) {
      player.velocityY = -player.jumpPower;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      camera.x = player.x - canvas.width / 3;
      if (camera.x < 0) camera.x = 0;
      if (camera.x > levelWidth - canvas.width) camera.x = levelWidth - canvas.width;
    }

    enemies.forEach(enemy => {
      enemy.x += enemy.velocityX;
      
      if (enemy.x < 0 || enemy.x > levelWidth) {
        enemy.velocityX *= -1;
      }

      if (checkCollision(player, enemy)) {
        if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y + 10) {
          enemy.x = -1000;
          player.velocityY = -10;
          setScore(prev => prev + 100);
        } else {
          handlePlayerHit();
        }
      }
    });

    coins.forEach(coin => {
      if (!coin.collected) {
        const coinRect = { x: coin.x, y: coin.y, width: 30, height: 30 };
        if (checkCollision(player, coinRect)) {
          coin.collected = true;
          setCoins(prev => prev + 1);
          setScore(prev => prev + 50);
        }
      }
    });

    if (player.y > 600) {
      handlePlayerHit();
    }

    if (player.x > levelWidth - 100) {
      setGameState('won');
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    }

    if (player.x < 0) player.x = 0;
  };

  const handlePlayerHit = () => {
    const { player } = gameDataRef.current;
    player.isDead = true;
    
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setTimeout(() => setGameState('gameOver'), 500);
      } else {
        setTimeout(() => respawnPlayer(), 1000);
      }
      return newLives;
    });
  };

  const respawnPlayer = () => {
    gameDataRef.current.player = {
      x: 50, y: 200, width: 40, height: 50,
      velocityX: 0, velocityY: 0, speed: 5, jumpPower: 15,
      isOnGround: false, facingRight: true, isDead: false,
    };
    gameDataRef.current.camera.x = 0;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { player, platforms, enemies, coins, camera } = gameDataRef.current;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    platforms.forEach(platform => {
      const x = platform.x - camera.x;
      if (x + platform.width > 0 && x < canvas.width) {
        ctx.fillStyle = platform.height > 30 ? '#32CD32' : '#CD853F';
        ctx.fillRect(x, platform.y, platform.width, platform.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, platform.y, platform.width, platform.height);
      }
    });

    coins.forEach(coin => drawCoin(ctx, coin, camera.x));
    enemies.forEach(enemy => {
      if (enemy.x > -100) drawEnemy(ctx, enemy, camera.x);
    });

    if (!player.isDead) {
      drawTeddy(ctx, player.x - camera.x, player.y, player.width, player.height, player.facingRight);
    }

    const flagX = gameDataRef.current.levelWidth - 50 - camera.x;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(flagX, 400, 5, 50);
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(flagX + 5, 400);
    ctx.lineTo(flagX + 40, 415);
    ctx.lineTo(flagX + 5, 430);
    ctx.closePath();
    ctx.fill();

    gameDataRef.current.frameCount++;
  };

  const gameLoop = () => {
    if (gameState !== 'playing') return;
    update();
    draw();
    animationIdRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    initLevel();
    respawnPlayer();
    setScore(0);
    setLives(3);
    setCoins(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop();
    }
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        gameDataRef.current.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        gameDataRef.current.keys.right = true;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        gameDataRef.current.keys.jump = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') gameDataRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') gameDataRef.current.keys.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') gameDataRef.current.keys.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundAttachment: 'fixed', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
      `}</style>
            <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#fff', border: 'none', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>← Back</button>

      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 8px 0', fontWeight: 800, background: 'linear-gradient(45deg, #fff, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          🧸 टेडीची धाव
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
          Teddy Bear Platform Adventure
        </p>
      </header>

      <div ref={containerRef} style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '20px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ background: '#000', padding: '10px', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>💯 गुण: {score}</span>
          <span>💰 नाणी: {coins}</span>
          <span>❤️ जीव: {lives}</span>
        </div>

        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width="800" height="500" style={{ display: 'block', border: '4px solid #333', borderRadius: '0 0 10px 10px' }} />

          {gameState === 'start' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#FFD700' }}>🧸 टेडीची धाव</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center', maxWidth: '80%' }}>
                ⬅️➡️ डावे/उजवे • Space उडी<br/>
                👾 शत्रू टाळा • 💰 नाणी गोळा करा • 🚩 ध्वजापर्यंत पोहोचा
              </p>
              <button onClick={startGame} style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', padding: '15px 40px', fontSize: '1.5rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 800 }}>
                सुरू करा START
              </button>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(139,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#FFD700' }}>खेळ खल्लास! GAME OVER</h2>
              <p style={{ fontSize: '1.3rem', marginBottom: '25px' }}>गुण: {score} | नाणी: {coins}</p>
              <button onClick={startGame} style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', padding: '12px 35px', fontSize: '1.3rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 700 }}>
                पुन्हा TRY AGAIN
              </button>
            </div>
          )}

          {gameState === 'won' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,128,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '15px', color: '#FFD700' }}>🎉 विजय! YOU WIN! 🎉</h2>
              <p style={{ fontSize: '1.3rem', marginBottom: '25px' }}>गुण: {score} | नाणी: {coins}/10</p>
              <button onClick={startGame} style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', padding: '12px 35px', fontSize: '1.3rem', borderRadius: '50px', cursor: 'pointer', fontWeight: 700 }}>
                पुन्हा खेळा PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
        ⌨️ Arrow Keys / A-D • Space / W for Jump
      </div>
    </div>
  );
};

export default TeddyChiDhav;
