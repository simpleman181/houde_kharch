import React, { useState, useEffect, useRef } from 'react';

const SimonMemoryGame: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);

  const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
  const colorNames = ['लाल Red', 'निळा Blue', 'पिवळा Yellow', 'हिरवा Green'];
  const tones = [261.63, 329.63, 392.00, 523.25];

  useEffect(() => {
    const saved = localStorage.getItem('simonHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const playTone = (freq: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSeq([]);
    setRound(0);
    setGameState('playing');
    setTimeout(() => addToSequence(), 500);
  };

  const addToSequence = () => {
    const randomIdx = Math.floor(Math.random() * 4);
    const newSeq = [...sequence, randomIdx];
    setSequence(newSeq);
    setPlayerSeq([]);
    setIsPlaying(true);
    playSequence(newSeq);
  };

  const playSequence = (seq: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setActiveButton(null);
        return;
      }
      
      setActiveButton(seq[i]);
      playTone(tones[seq[i]]);
      
      setTimeout(() => setActiveButton(null), 400);
      i++;
    }, 700);
  };

  const handleClick = (idx: number) => {
    if (isPlaying || gameState !== 'playing') return;

    playTone(tones[idx]);
    setActiveButton(idx);
    setTimeout(() => setActiveButton(null), 200);

    if (navigator.vibrate) navigator.vibrate(30);

    const newPlayerSeq = [...playerSeq, idx];
    setPlayerSeq(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      playTone(100);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      if (round > highScore) {
        setHighScore(round);
        localStorage.setItem('simonHighScore', round.toString());
      }
      
      setGameState('gameOver');
    } else if (newPlayerSeq.length === sequence.length) {
      setRound(r => r + 1);
      setTimeout(() => addToSequence(), 1000);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundAttachment: 'fixed', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .simon-btn {
          transition: all 0.1s;
        }
        .simon-btn:hover:not(:disabled) {
          transform: scale(1.05);
          filter: brightness(1.2);
        }
        .simon-btn:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>

      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 8px 0', fontWeight: 800, background: 'linear-gradient(45deg, #fff, #00d084)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          🎵 मेमरी गेम
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
          Simon Says | पॅटर्न लक्षात ठेवा
        </p>
      </header>

      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '25px', padding: '30px', maxWidth: '500px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '15px', borderRadius: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>🎯 राउंड: {round}</span>
          <span>🏆 सर्वोत्तम: {highScore}</span>
        </div>

        {gameState === 'start' ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#667eea' }}>
              रंग आणि ध्वनीचा क्रम लक्षात ठेवा!
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
              • संगणक रंगांचा क्रम दाखवेल<br/>
              • तोच क्रम पुन्हा करा<br/>
              • प्रत्येक राउंडमध्ये एक रंग वाढतो
            </p>
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #00d084, #00a8ff)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                fontSize: '1.5rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 800,
                boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
              }}
            >
              सुरू करा START
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', minHeight: '400px' }}>
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(idx)}
                disabled={isPlaying}
                className="simon-btn"
                style={{
                  aspectRatio: '1',
                  borderRadius: '20px',
                  background: activeButton === idx ? `linear-gradient(135deg, ${color}, white)` : color,
                  border: activeButton === idx ? '5px solid white' : 'none',
                  boxShadow: activeButton === idx ? `0 0 30px ${color}, 0 0 50px ${color}` : '0 8px 0 rgba(0,0,0,0.2)',
                  cursor: isPlaying ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transform: activeButton === idx ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span style={{ fontSize: '3rem', marginBottom: '5px' }}>
                  {['🔴', '🔵', '🟡', '🟢'][idx]}
                </span>
                <span style={{ fontSize: '0.9rem' }}>
                  {colorNames[idx]}
                </span>
              </button>
            ))}
          </div>
        )}

        {isPlaying && gameState === 'playing' && (
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#667eea', fontSize: '1.2rem', fontWeight: 700, animation: 'pulse 1s infinite' }}>
            👀 लक्ष द्या... Watch!
          </div>
        )}

        {!isPlaying && gameState === 'playing' && playerSeq.length < sequence.length && (
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#00d084', fontSize: '1.2rem', fontWeight: 700, animation: 'pulse 1s infinite' }}>
            👆 तुमची पाळी... Your Turn!
          </div>
        )}
      </div>

      {gameState === 'gameOver' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(139,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'bounceIn 0.5s' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '40px', borderRadius: '25px', backdropFilter: 'blur(10px)', textAlign: 'center', maxWidth: '90%' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#FFD700' }}>
              खेळ खल्लास! GAME OVER
            </h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'white' }}>
              तुम्ही पोहोचलात राउंड: <strong>{round}</strong>
            </p>
            {round > highScore && (
              <p style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#FFD700', fontWeight: 700 }}>
                🏆 नवीन रेकॉर्ड! New High Score!
              </p>
            )}
            <p style={{ fontSize: '1.1rem', marginBottom: '25px', color: 'white' }}>
              सर्वोत्तम गुण: {highScore}
            </p>
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000',
                border: 'none',
                padding: '15px 40px',
                fontSize: '1.3rem',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 6px 0 #B8860B',
              }}
            >
              पुन्हा खेळा PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', textAlign: 'center' }}>
        🎨 रंगांवर क्लिक करा | Click Colors to Repeat Pattern
      </div>
    </div>
  );
};

export default SimonMemoryGame;