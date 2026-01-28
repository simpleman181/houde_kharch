import React, { useState, useEffect, useRef, useCallback, CSSProperties } from 'react';

// --- TYPES & INTERFACES ---
type GameID = 'menu' | 'hangman' | 'memory' | 'checkers' | 'pool' | 'tapmatch' | 'woodblocks' | 'connect4' | 'sliding' | 'mancala' | 'yatzy' | 'animalstack' | 'bonus';

interface GameState {
  score: number;
  isOver: boolean;
  message: string;
}

// --- STYLES (Matching Houde Kharch) ---
const STYLES = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'flex-direction',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  gameWrapper: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '20px',
    width: '100%',
    maxWidth: '600px',
    position: 'relative' as 'relative',
    overflow: 'hidden',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column' as 'flex-direction',
    alignItems: 'center',
  },
  header: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  btnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '15px',
    width: '100%',
  },
  gameBtn: {
    background: '#fff',
    border: '2px solid #4CAF50',
    color: '#4CAF50',
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s',
    fontSize: '14px',
  },
  gameBtnHover: {
    background: '#4CAF50',
    color: 'white',
  },
  canvas: {
    background: '#eee',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
  },
  modal: {
    position: 'absolute' as 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(255,255,255,0.9)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalTitle: {
    color: '#e74c3c',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  actionBtn: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  navBtn: {
    position: 'absolute' as 'absolute',
    top: '10px',
    left: '10px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 10,
  }
};

// --- SOUND UTILS ---
const playTone = (freq: number, type: OscillatorType = 'sine') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) {}
};

// --- GAME COMPONENTS ---

// 1. HANGMAN
const Hangman: React.FC<{ endGame: () => void }> = ({ endGame }) => {
  const words = ['REACT', 'TYPESCRIPT', 'CODING', 'MARATHI', 'DEVELOPER', 'INTERFACE'];
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(6);
  
  const initGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessed(new Set());
    setLives(6);
  };

  useEffect(initGame, []);

  const handleGuess = (letter: string) => {
    if (lives <= 0 || guessed.has(letter)) return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);
    if (!word.includes(letter)) {
      if (lives - 1 === 0) endGame();
      setLives(l => l - 1);
      playTone(150, 'sawtooth');
    } else {
      playTone(600);
    }
  };

  const display = word.split('').map(l => guessed.has(l) ? l : '_').join(' ');
  const isWin = display.replace(/ /g, '') === word;

  useEffect(() => { if(isWin) { playTone(800, 'square'); setTimeout(endGame, 1000); } }, [isWin]);

  return (
    <div>
      <h3>Lives: {lives}</h3>
      <h2 style={{ letterSpacing: '5px', margin: '20px 0' }}>{display}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
          <button 
            key={l} 
            onClick={() => handleGuess(l)} 
            style={{ 
              width: '30px', height: '30px', 
              background: guessed.has(l) ? '#ccc' : '#4CAF50', 
              color: 'white', border: 'none', borderRadius: '4px' 
            }}
          >{l}</button>
        ))}
      </div>
    </div>
  );
};

// 2. SOUND MEMORY (Simon Says)
const SoundMemory: React.FC<{ endGame: () => void }> = ({ endGame }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [round, setRound] = useState(0);

  const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
  const tones = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C5

  const addToSeq = () => {
    const r = Math.floor(Math.random() * 4);
    const newSeq = [...sequence, r];
    setSequence(newSeq);
    setPlayerSeq([]);
    setIsPlaying(true);
    playSeq(newSeq);
  };

  const playSeq = (seq: number[]) => {
    let i = 0;
    const intv = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(intv);
        setIsPlaying(false);
        return;
      }
      playTone(tones[seq[i]], 'triangle');
      // Flash effect logic simplified here
      i++;
    }, 600);
  };

  const handleClick = (idx: number) => {
    if (isPlaying) return;
    playTone(tones[idx], 'triangle');
    const newP = [...playerSeq, idx];
    setPlayerSeq(newP);
    if (newP[newP.length - 1] !== sequence[newP.length - 1]) {
      playTone(100, 'sawtooth');
      endGame();
    } else if (newP.length === sequence.length) {
      setRound(r => r + 1);
      setTimeout(addToSeq, 1000);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>Round: {round}</div>
      {colors.map((c, i) => (
        <button 
          key={i} 
          onClick={() => handleClick(i)}
          style={{ width: '80px', height: '80px', borderRadius: '50%', background: c, border: '4px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transition: '0.1s' }}
          disabled={isPlaying}
        />
      ))}
    </div>
  );
};

// 3. CHECKERS (Simplified)
const Checkers: React.FC = () => {
  const [board, setBoard] = useState<(string|null)[][]>(Array(8).fill(null).map(()=>Array(8).fill(null)));
  const [turn, setTurn] = useState<'red'|'black'>('red');
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const initBoard = () => {
    const b = Array(8).fill(null).map(()=>Array(8).fill(null));
    for(let r=0;r<8;r++) {
      for(let c=0;c<8;c++) {
        if((r+c)%2===1) {
          if(r<3) b[r][c]='black';
          if(r>4) b[r][c]='red';
        }
      }
    }
    setBoard(b);
  };
  useEffect(initBoard, []);

  const move = (r: number, c: number) => {
    if(!selected) {
      if(board[r][c]===turn) setSelected([r,c]);
      return;
    }
    const [sr, sc] = selected;
    if(Math.abs(r-sr)===1 && Math.abs(c-sc)===1 && !board[r][c]) {
      const b = [...board.map(row=>[...row])];
      b[r][c] = b[sr][sc];
      b[sr][sc] = null;
      setBoard(b);
      setTurn(turn==='red'?'black':'red');
      setSelected(null);
      playTone(300);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 40px)' }}>
      {board.map((row, r) => row.map((cell, c) => (
        <div 
          key={`${r}-${c}`} 
          onClick={() => move(r,c)}
          style={{
            width: '40px', height: '40px',
            background: (r+c)%2===0 ? '#eee' : '#333',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            boxShadow: selected?.[0]===r && selected?.[1]===c ? 'inset 0 0 0 3px yellow' : 'none'
          }}
        >
          {cell && <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: cell, border: '2px solid white' }} />}
        </div>
      ))}
    </div>
  );
};

// 4. POOL (Canvas Billiards - Simplified)
const PoolGame: React.FC<{ endGame: () => void }> = ({ endGame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    let balls: any[] = [{x:100, y:300, dx:0, dy:0, c:'white', r:10}];
    // Rack balls
    for(let i=0;i<5;i++) {
      for(let j=0;j<=i;j++) {
        balls.push({x: 400 + i*20, y: 300 - i*10 + j*20, dx:0, dy:0, c: `hsl(${Math.random()*360},70%,50%)`, r:10});
      }
    }
    let cue = { x: 100, y: 300, power: 0, angle: 0 };
    let dragging = false;

    const update = () => {
      ctx.clearRect(0,0,canvas.width, canvas.height);
      
      // Physics
      let moving = false;
      balls.forEach(b => {
        b.x += b.dx; b.y += b.dy;
        b.dx *= 0.98; b.dy *= 0.98;
        if(b.x<b.r||b.x>canvas.width-b.r) { b.dx*=-1; b.x=Math.max(b.r, Math.min(canvas.width-b.r, b.x)); }
        if(b.y<b.r||b.y>canvas.height-b.r) { b.dy*=-1; b.y=Math.max(b.r, Math.min(canvas.height-b.r, b.y)); }
        if(Math.abs(b.dx)>0.1 || Math.abs(b.dy)>0.1) moving = true;
      });

      // Collision
      for(let i=0;i<balls.length;i++) {
        for(let j=i+1;j<balls.length;j++) {
          let b1=balls[i], b2=balls[j];
          let dx=b2.x-b1.x, dy=b2.y-b1.y, dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<20) {
            let angle=Math.atan2(dy,dx);
            let sin=Math.sin(angle), cos=Math.cos(angle);
            // rotate velocities... simplified swap
            let temp=b1.dx; b1.dx=b2.dx; b2.dx=temp;
            temp=b1.dy; b1.dy=b2.dy; b2.dy=temp;
            // Separate
            let overlap = 20 - dist;
            b1.x -= overlap/2 * cos; b1.y -= overlap/2 * sin;
            b2.x += overlap/2 * cos; b2.y += overlap/2 * sin;
          }
        }
      }

      // Draw Cue Line
      if(!moving && dragging) {
        ctx.beginPath(); ctx.moveTo(balls[0].x, balls[0].y);
        ctx.lineTo(cue.x, cue.y); ctx.strokeStyle='white'; ctx.stroke();
      }

      // Draw Balls
      balls.forEach(b => {
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
        ctx.fillStyle=b.c; ctx.fill();
        ctx.strokeStyle='#000'; ctx.stroke();
      });

      // Pocket logic (simplified)
      const pockets = [[0,0],[600,0],[0,400],[600,400]];
      balls.forEach((b, i) => {
        if(i===0) return;
        pockets.forEach(p => {
          let d = Math.sqrt((b.x-p[0])**2 + (b.y-p[1])**2);
          if(d<30) balls.splice(i, 1);
        });
      });

      if(balls.length === 1) endGame();

      requestAnimationFrame(update);
    };
    update();

    const handleDown = (e: any) => {
      if(balls.some((b,i)=>i>0 && (Math.abs(b.dx)>0.1||Math.abs(b.dy)>0.1))) return;
      dragging=true;
    };
    const handleMove = (e: any) => {
      if(!dragging) return;
      const rect = canvas.getBoundingClientRect();
      cue.x = e.clientX - rect.left;
      cue.y = e.clientY - rect.top;
    };
    const handleUp = (e: any) => {
      if(!dragging) return;
      dragging=false;
      let dx = balls[0].x - cue.x;
      let dy = balls[0].y - cue.y;
      let dist = Math.sqrt(dx*dx+dy*dy);
      if(dist<10) return;
      let power = Math.min(dist/10, 10);
      balls[0].dx = (dx/dist)*power;
      balls[0].dy = (dy/dist)*power;
      playTone(100);
    };

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleUp);
  }, []);

  return <canvas ref={canvasRef} width={600} height={400} style={STYLES.canvas} />;
};

// 5. TAP MATCH (Memory)
const TapMatch: React.FC = () => {
  const icons = ['🐶','🐱','🐭','🐹','🐰','🦊'];
  const [cards, setCards] = useState<{id:number, icon:string, open:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<Set<number>>(new Set());

  useEffect(() => {
    const deck = [...icons, ...icons].sort(() => Math.random()-0.5);
    setCards(deck.map((icon, i) => ({id:i, icon, open:false})));
  }, []);

  const click = (idx: number) => {
    if(flipped.length === 2 || flipped.includes(idx) || solved.has(idx)) return;
    const newFlip = [...flipped, idx];
    setFlipped(newFlip);
    if(newFlip.length === 2) {
      const [a,b] = newFlip;
      if(cards[a].icon === cards[b].icon) {
        setSolved(new Set([...solved, a, b]));
        setFlipped([]);
        playTone(600);
        if(solved.size + 2 === cards.length) alert('Won!');
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 70px)', gap: '10px' }}>
      {cards.map(c => (
        <div 
          key={c.id}
          onClick={() => click(c.id)}
          style={{
            width: '70px', height: '70px', background: flipped.includes(c.id)||solved.has(c.id)?'#fff':'#4CAF50',
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px',
            borderRadius: '8px', cursor: 'pointer'
          }}
        >
          {(flipped.includes(c.id) || solved.has(c.id)) && c.icon}
        </div>
      ))}
    </div>
  );
};

// 6. WOOD BLOCKS (Simplified 10x10 Grid Clicker)
const WoodBlocks: React.FC = () => {
  // Just a placeholder for the complex Drag & Drop logic
  // Implementing simple Grid Filler
  return <div style={{padding:'20px', background:'#ddd'}}>Wood Blocks (Lite Version)<br/>Select Block -> Click Grid to place.<br/><small>(Full logic requires drag-drop library)</small></div>;
};

// 7. CONNECT 4
const Connect4: React.FC = () => {
  const [grid, setGrid] = useState<(0|1|2)[][]>(Array(6).fill(0).map(()=>Array(7).fill(0)));
  const [turn, setTurn] = useState<1|2>(1);

  const drop = (c: number) => {
    const newGrid = [...grid.map(r=>[...r])];
    for(let r=5; r>=0; r--) {
      if(newGrid[r][c]===0) {
        newGrid[r][c] = turn;
        setGrid(newGrid);
        setTurn(turn===1?2:1);
        playTone(turn===1?400:300);
        // Check win logic omitted for brevity
        return;
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div>Turn: {turn===1?'Red':'Yellow'}</div>
      {grid.map((row, r) => (
        <div key={r} style={{ display: 'flex', gap: '5px' }}>
          {row.map((cell, c) => (
            <div 
              key={c}
              onClick={() => drop(c)}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: cell===0?'#eee':(cell===1?'#e74c3c':'#f1c40f'),
                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// 8. SLIDING PUZZLE
const SlidingPuzzle: React.FC = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  
  useEffect(() => {
    let arr = Array.from({length:15}, (_,i)=>i+1);
    arr.push(0); // empty
    // Simple shuffle
    for(let i=arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setTiles(arr);
  }, []);

  const move = (idx: number) => {
    const emptyIdx = tiles.indexOf(0);
    const validMoves = [idx-1, idx+1, idx-4, idx+4];
    if(validMoves.includes(emptyIdx)) {
      const newTiles = [...tiles];
      [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
      setTiles(newTiles);
      playTone(200);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 70px)', gap: '5px' }}>
      {tiles.map((t, i) => (
        <div 
          key={i}
          onClick={() => move(i)}
          style={{
            width: '70px', height: '70px', background: t===0?'transparent':'#3498db',
            color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', borderRadius: '4px'
          }}
        >
          {t||''}
        </div>
      ))}
    </div>
  );
};

// 9. MANCALA
const Mancala: React.FC = () => {
  const [board, setBoard] = useState<number[]>(Array(14).fill(4)); // 0-5 P1, 6 Store P1, 7-12 P2, 13 Store P2
  const [turn, setTurn] = useState<0|7>(0);
  const [winner, setWinner] = useState<string|null>(null);

  // Init stores
  useEffect(() => { 
    const b = [...board];
    b[6]=0; b[13]=0; 
    setBoard(b); 
  }, []);

  const sow = (idx: number) => {
    if (winner) return;
    // Simple validation: Must be own pit and not store
    if (turn===0 && (idx>5 || idx===6)) return;
    if (turn===7 && (idx<7 || idx===13)) return;
    if (board[idx]===0) return;

    let stones = board[idx];
    let b = [...board];
    b[idx] = 0;
    let pos = idx;
    
    while(stones > 0) {
      pos = (pos + 1) % 14;
      // Skip opponent store
      if ((turn === 0 && pos === 13) || (turn === 7 && pos === 6)) continue;
      b[pos]++;
      stones--;
    }

    // Capture logic (Simplified)
    // Turn switch
    if (pos !== 6 && pos !== 13) {
      setTurn(turn===0?7:0);
    } else {
      playTone(800); // Free turn
    }
    setBoard(b);
    
    // Check win
    const p1Side = b.slice(0,6).reduce((a,b)=>a+b,0);
    const p2Side = b.slice(7,13).reduce((a,b)=>a+b,0);
    if(p1Side===0 || p2Side===0) {
      setWinner(b[6]>b[13]?"Player 1":"Player 2");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(6, 40px)', gap:'5px'}}>
        {board.slice(7,13).reverse().map((n,i) => (
          <div key={i} style={{width:'40px', height:'40px', borderRadius:'50%', background:'#eee', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer', border: turn===7?'2px solid blue':'none'}} onClick={()=>sow(12-i)}>{n}</div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        <div style={{width:'50px', height:'150px', background:'#333', color:'white', display:'flex', justifyContent:'center', alignItems:'center'}}>{board[13]}</div>
        <div style={{width:'50px', height:'150px', background:'#333', color:'white', display:'flex', justifyContent:'center', alignItems:'center'}}>{board[6]}</div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(6, 40px)', gap:'5px'}}>
        {board.slice(0,6).map((n,i) => (
          <div key={i} style={{width:'40px', height:'40px', borderRadius:'50%', background:'#eee', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer', border: turn===0?'2px solid red':'none'}} onClick={()=>sow(i)}>{n}</div>
        ))}
      </div>
      {winner && <div style={{position:'absolute', background:'white', padding:'10px'}}>{winner} Wins!</div>}
    </div>
  );
};

// 10. YATZY
const Yatzy: React.FC = () => {
  const [dice, setDice] = useState<number[]>([1,2,3,4,5]);
  const [locked, setLocked] = useState<boolean[]>([false,false,false,false,false]);
  const [rolls, setRolls] = useState(0);

  const roll = () => {
    if(rolls >= 3) return;
    setDice(dice.map((d,i) => locked[i]?d:Math.floor(Math.random()*6)+1));
    setRolls(r=>r+1);
    playTone(300);
  };

  return (
    <div>
      <div style={{display:'flex', gap:'10px', margin:'20px'}}>
        {dice.map((d,i) => (
          <div 
            key={i}
            onClick={() => { if(rolls>0) setLocked(l=>{ const nl=[...l]; nl[i]=!nl[i]; return nl; }) }}
            style={{
              width:'60px', height:'60px', background: locked[i]?'#555':'white',
              border:'2px solid #333', borderRadius:'8px', fontSize:'30px', display:'flex', justifyContent:'center', alignItems:'center', color: locked[i]?'#aaa':'black'
            }}
          >{d}</div>
        ))}
      </div>
      <button onClick={roll} style={STYLES.actionBtn}>Roll ({rolls}/3)</button>
      <button onClick={()=>{setRolls(0); setLocked([false,false,false,false,false]);}} style={{...STYLES.actionBtn, background:'gray'}}>Reset</button>
    </div>
  );
};

// 11. ANIMAL STACK (Tower Stacker Canvas)
const AnimalStack: React.FC<{ endGame: () => void }> = ({ endGame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    let stack: {x:number, w:number, color:string}[] = [{x:150, w:300, color:'#e74c3c'}];
    let current = {x:150, w:300, color: '#3498db', dir: 2};
    let dropping = false;
    let dropY = 0;

    const loop = () => {
      ctx.fillStyle = '#eee';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      // Stack
      stack.forEach((b, i) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x - b.w/2, canvas.height - 50 - i*30 - dropY, b.w, 30);
      });

      if(!dropping) {
        current.x += current.dir;
        if(current.x + current.w/2 > canvas.width || current.x - current.w/2 < 0) current.dir *= -1;
        ctx.fillStyle = current.color;
        ctx.fillRect(current.x - current.w/2, canvas.height - 50 - stack.length*30, current.w, 30);
      } else {
        dropY += 5;
        ctx.fillStyle = current.color;
        ctx.fillRect(current.x - current.w/2, canvas.height - 50 - stack.length*30 - dropY, current.w, 30);
        
        if(dropY >= 30) {
          // Land
          const top = stack[stack.length-1];
          const overlap = Math.min(current.x + current.w/2, top.x + top.w/2) - Math.max(current.x - current.w/2, top.x - top.w/2);
          
          if(overlap < 10) {
             endGame(); // Miss
             return;
          }
          
          // Trim
          let newX = (current.x + top.x) / 2;
          stack.push({x: newX, w: overlap, color: current.color});
          setScore(s=>s+1);
          current = {x: 150, w: overlap, color: `hsl(${Math.random()*360}, 70%, 50%)`, dir: 2 * (Math.random()>0.5?1:-1)};
          dropY = 0;
          dropping = false;
          playTone(400 + stack.length*20);
        }
      }
      
      requestAnimationFrame(loop);
    };
    
    const handleInput = () => { if(!dropping) dropping = true; };
    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', handleInput);
    
    loop();
  }, []);

  return <div style={{position:'relative'}}><div style={{position:'absolute', top:0, left:0, fontSize:'20px', fontWeight:'bold'}}>Score: {score}</div><canvas ref={canvasRef} width={300} height={500} style={STYLES.canvas} /></div>;
};

// --- MAIN GAME HUB COMPONENT ---
export const GameHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameID>('menu');
  const [gameOver, setGameOver] = useState(false);

  const startGame = (id: GameID) => {
    setActiveGame(id);
    setGameOver(false);
  };

  const handleGameOver = () => {
    setGameOver(true);
    playTone(100, 'sawtooth');
  };

  const renderGame = () => {
    switch(activeGame) {
      case 'hangman': return <Hangman endGame={handleGameOver} />;
      case 'memory': return <SoundMemory endGame={handleGameOver} />;
      case 'checkers': return <Checkers />;
      case 'pool': return <PoolGame endGame={handleGameOver} />;
      case 'tapmatch': return <TapMatch />;
      case 'woodblocks': return <WoodBlocks />;
      case 'connect4': return <Connect4 />;
      case 'sliding': return <SlidingPuzzle />;
      case 'mancala': return <Mancala />;
      case 'yatzy': return <Yatzy />;
      case 'animalstack': return <AnimalStack endGame={handleGameOver} />;
      default: return <div>Select a game</div>;
    }
  };

  return (
    <div style={STYLES.container}>
      {activeGame === 'menu' ? (
        <div style={STYLES.gameWrapper}>
          <h1 style={STYLES.header}>🎮 Game Hub</h1>
          <div style={STYLES.btnGrid}>
            <button style={STYLES.gameBtn} onClick={() => startGame('hangman')}>📝 Hangman</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('memory')}>🔊 Sound Memory</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('checkers')}>♟️ Checkers</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('pool')}>🎱 Pool</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('tapmatch')}>🧩 Tap Match</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('woodblocks')}>🧱 Wood Blocks</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('connect4')}>🔴 4 in a Row</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('sliding')}>🔲 Sliding Puzzle</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('mancala')}>🥥 Mancala</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('yatzy')}>🎲 Yatzy</button>
            <button style={STYLES.gameBtn} onClick={() => startGame('animalstack')}>🦁 Animal Stack</button>
          </div>
        </div>
      ) : (
        <div style={STYLES.gameWrapper}>
          <button style={STYLES.navBtn} onClick={() => setActiveGame('menu')}>← Back</button>
          {gameOver && (
            <div style={STYLES.modal}>
              <h2 style={STYLES.modalTitle}>खेळ खल्लास ! GAME OVER</h2>
              <button style={STYLES.actionBtn} onClick={() => startGame(activeGame)}>Play Again</button>
              <button style={{...STYLES.actionBtn, background:'#e74c3c'}} onClick={() => setActiveGame('menu')}>Exit</button>
            </div>
          )}
          <h2 style={STYLES.header}>{activeGame.toUpperCase()}</h2>
          <div style={{flex:1, width:'100%', display:'flex', justifyContent:'center', alignItems:'center', overflow:'auto'}}>
            {renderGame()}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHub;