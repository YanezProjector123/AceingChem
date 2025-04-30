import React, { useState } from 'react';

// Expanded periodic table data for more question variety
const elements = [
  { symbol: 'H', name: 'Hydrogen', period: 1, group: 1, atomicRadius: 53 },
  { symbol: 'He', name: 'Helium', period: 1, group: 18, atomicRadius: 31 },
  { symbol: 'Li', name: 'Lithium', period: 2, group: 1, atomicRadius: 167 },
  { symbol: 'Be', name: 'Beryllium', period: 2, group: 2, atomicRadius: 112 },
  { symbol: 'B', name: 'Boron', period: 2, group: 13, atomicRadius: 87 },
  { symbol: 'C', name: 'Carbon', period: 2, group: 14, atomicRadius: 67 },
  { symbol: 'N', name: 'Nitrogen', period: 2, group: 15, atomicRadius: 56 },
  { symbol: 'O', name: 'Oxygen', period: 2, group: 16, atomicRadius: 48 },
  { symbol: 'F', name: 'Fluorine', period: 2, group: 17, atomicRadius: 42 },
  { symbol: 'Ne', name: 'Neon', period: 2, group: 18, atomicRadius: 38 },
  { symbol: 'Na', name: 'Sodium', period: 3, group: 1, atomicRadius: 190 },
  { symbol: 'Mg', name: 'Magnesium', period: 3, group: 2, atomicRadius: 145 },
  { symbol: 'Al', name: 'Aluminum', period: 3, group: 13, atomicRadius: 118 },
  { symbol: 'Si', name: 'Silicon', period: 3, group: 14, atomicRadius: 111 },
  { symbol: 'P', name: 'Phosphorus', period: 3, group: 15, atomicRadius: 98 },
  { symbol: 'S', name: 'Sulfur', period: 3, group: 16, atomicRadius: 88 },
  { symbol: 'Cl', name: 'Chlorine', period: 3, group: 17, atomicRadius: 79 },
  { symbol: 'Ar', name: 'Argon', period: 3, group: 18, atomicRadius: 71 },
  { symbol: 'K', name: 'Potassium', period: 4, group: 1, atomicRadius: 243 },
  { symbol: 'Ca', name: 'Calcium', period: 4, group: 2, atomicRadius: 194 },
  { symbol: 'Br', name: 'Bromine', period: 4, group: 17, atomicRadius: 94 },
  { symbol: 'Rb', name: 'Rubidium', period: 5, group: 1, atomicRadius: 265 },
  { symbol: 'Sr', name: 'Strontium', period: 5, group: 2, atomicRadius: 219 },
  { symbol: 'I', name: 'Iodine', period: 5, group: 17, atomicRadius: 115 },
  { symbol: 'Cs', name: 'Cesium', period: 6, group: 1, atomicRadius: 298 },
  { symbol: 'Ba', name: 'Barium', period: 6, group: 2, atomicRadius: 253 },
  { symbol: 'Fr', name: 'Francium', period: 7, group: 1, atomicRadius: 348 },
  { symbol: 'Ra', name: 'Radium', period: 7, group: 2, atomicRadius: 283 },
];

function getRandomPair() {
  // Only return pairs with different radii
  let i, j;
  do {
    i = Math.floor(Math.random() * elements.length);
    j = Math.floor(Math.random() * elements.length);
  } while (j === i || elements[i].atomicRadius === elements[j].atomicRadius);
  // Randomize left/right order
  return Math.random() > 0.5 ? [elements[i], elements[j]] : [elements[j], elements[i]];
}

export default function AtomicRadiusActivity({ onBack, onPeriodicTable }) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [pair, setPair] = useState(getRandomPair());
  const [feedback, setFeedback] = useState(null); // {type: 'correct'|'incorrect', message: string, correctIdx: 0|1}
  const [showNext, setShowNext] = useState(false);

  function handleGuess(choice) {
    const [a, b] = pair;
    let correctIdx = a.atomicRadius > b.atomicRadius ? 0 : 1;
    let chosenIdx = choice === 'left' ? 0 : 1;
    if (chosenIdx === correctIdx) {
      setScore(score + 1);
      setFeedback({ type: 'correct', message: 'Correct! Great job!', correctIdx });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Incorrect. Hint: Atomic radius increases as you go down a group and decreases as you move across a period (left to right).\n\n${pair[correctIdx].symbol} (${pair[correctIdx].name}) has a larger radius (${pair[correctIdx].atomicRadius} pm) than ${pair[1-correctIdx].symbol} (${pair[1-correctIdx].name}, ${pair[1-correctIdx].atomicRadius} pm).`,
        correctIdx
      });
    }
    setShowNext(true);
  }

  function handleNext() {
    setPair(getRandomPair());
    setFeedback(null);
    setShowNext(false);
    setRound(round + 1);
  }

  // Neon-glow style helpers
  const boxShadowGlow = '0 0 32px #facc1566, 0 2px 32px #38bdf866';
  const correctGlow = '0 0 24px #22c55e88, 0 2px 24px #22c55e55';
  const wrongGlow = '0 0 24px #dc262688, 0 2px 24px #dc262655';
  const neutralGlow = '0 0 24px #f59e4288, 0 2px 24px #38bdf855';

  return (
    <div className="center-container fade-in slide-up" style={{
      textAlign: 'center',
      minHeight: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 60% 40%, #2d314d 80%, #19172e 100%)',
      minHeight: '100vh',
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.98)',
        padding: '20px 12px 16px',
        borderRadius: 10,
        boxShadow: '0 4px 16px #0005',
        minWidth: 200,
        maxWidth: 260,
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        border: '1px solid #23234a',
      }}>
        <h2 style={{
          fontWeight: 700,
          fontSize: '1.12em',
          color: '#facc15',
          marginBottom: 7,
          letterSpacing: 0.2,
          textShadow: '0 1px 2px #23234a33',
        }}>
          Atomic Radius
        </h2>
        <div style={{
          color: '#60a5fa',
          fontWeight: 600,
          fontSize: '0.93em',
          marginBottom: 10,
          textShadow: '0 1px 2px #23234a22',
        }}>
          Which element has the <span style={{ color: '#facc15', fontWeight: 800 }}>larger atomic radius</span>?
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          margin: '12px 0 8px 0',
          flexWrap: 'wrap',
        }}>
          {[0, 1].map(idx => (
            <button
              key={idx}
              className="ptable-btn"
              style={{
                minWidth: 54,
                minHeight: 38,
                fontSize: '1em',
                fontWeight: 700,
                borderRadius: 7,
                background:
                  idx === 0
                    ? 'linear-gradient(100deg,#fde68a 60%,#fbbf24 100%)'
                    : 'linear-gradient(100deg,#bae6fd 60%,#60a5fa 100%)',
                color: '#23234a',
                border: feedback && feedback.correctIdx === idx
                  ? '2px solid #22c55e'
                  : '1px solid ' + (idx === 0 ? '#fbbf24' : '#60a5fa'),
                boxShadow:
                  feedback && feedback.correctIdx === idx
                    ? '0 0 6px #22c55e44'
                    : feedback && feedback.type === 'incorrect' && feedback.correctIdx !== idx
                    ? '0 0 4px #f472b622'
                    : '0 1px 4px #23234a22',
                letterSpacing: 1,
                transition: 'all .18s',
                cursor: feedback ? 'not-allowed' : 'pointer',
                opacity: feedback && feedback.type === 'incorrect' && feedback.correctIdx !== idx ? 0.5 : 1,
                outline: 'none',
                marginBottom: 3,
              }}
              onClick={() => !feedback && handleGuess(idx === 0 ? 'left' : 'right')}
              disabled={!!feedback}
              tabIndex={0}
              aria-label={`Choose ${pair[idx].name}`}
            >
              {pair[idx].symbol}
              <div style={{ fontSize: '0.7em', fontWeight: 400, marginTop: 1 }}>{pair[idx].name}</div>
            </button>
          ))}
        </div>
        <div style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '0.94em', minHeight: 20 }}>
          {feedback && (
            <span style={{
              color: feedback.type === 'correct' ? '#22c55e' : '#f472b6',
              textShadow: feedback.type === 'correct' ? '0 2px 4px #22c55e22' : '0 2px 4px #f472b611',
              whiteSpace: 'pre-line',
              display: 'inline-block',
              maxWidth: 180,
            }}>
              {feedback.message}
            </span>
          )}
        </div>
        {showNext && (
          <button
            className="ptable-btn"
            style={{
              background: 'linear-gradient(90deg,#f472b6 0,#60a5fa 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.96em',
              borderRadius: 6,
              boxShadow: '0 1px 4px #f472b611',
              padding: '6px 18px',
              margin: '0 0 7px 0',
              border: 'none',
              letterSpacing: 1,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all .18s',
            }}
            onClick={handleNext}
          >
            NEXT
          </button>
        )}
        <div style={{ marginTop: 2, fontSize: '0.93em', color: '#60a5fa', fontWeight: 600, letterSpacing: 1 }}>
          Score: <span style={{ color: '#facc15', fontWeight: 900 }}>{score}</span> &nbsp; | &nbsp; Round: {round}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 7 }}>
          <button
            className="ptable-btn"
            style={{
              fontWeight: 700,
              fontSize: '0.96em',
              borderRadius: 6,
              background: 'linear-gradient(90deg,#60a5fa 0,#bae6fd 100%)',
              color: '#23234a',
              boxShadow: '0 2px 4px #60a5fa22',
              border: 'none',
              padding: '5px 16px',
              letterSpacing: 1,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all .18s',
            }}
            onClick={onPeriodicTable}
          >
            Periodic Table
          </button>
          <button
            className="ptable-btn"
            style={{
              fontWeight: 700,
              fontSize: '0.96em',
              borderRadius: 6,
              background: 'linear-gradient(90deg,#f472b6 0,#fde68a 100%)',
              color: '#23234a',
              boxShadow: '0 2px 4px #f472b611',
              border: 'none',
              padding: '5px 16px',
              letterSpacing: 1,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all .18s',
            }}
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
