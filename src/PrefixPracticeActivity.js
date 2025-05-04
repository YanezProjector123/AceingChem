import React, { useState } from 'react';

const PREFIXES = [
  { number: 1, prefix: 'mono' },
  { number: 2, prefix: 'di' },
  { number: 3, prefix: 'tri' },
  { number: 4, prefix: 'tetra' },
  { number: 5, prefix: 'penta' },
  { number: 6, prefix: 'hexa' },
  { number: 7, prefix: 'hepta' },
  { number: 8, prefix: 'octa' },
  { number: 9, prefix: 'nona' },
  { number: 10, prefix: 'deca' },
];

function getRandomPrefixProblem() {
  return PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
}

export default function PrefixPracticeActivity({ onBack }) {
  const [problem, setProblem] = useState(getRandomPrefixProblem());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim().toLowerCase() === problem.prefix) {
      setFeedback('✅ Correct!');
      setShowAnswer(true);
    } else {
      setFeedback(`❌ Not quite. The correct prefix for ${problem.number} is "${problem.prefix}".\n\uD83D\uDCA1 Tip: Try memorizing the Greek prefixes for 1-10. For example: mono-, di-, tri-, tetra-, penta-, hexa-, hepta-, octa-, nona-, deca-.`);
      setShowAnswer(true);
    }
  }

  function handleNext() {
    setProblem(getRandomPrefixProblem());
    setInput('');
    setFeedback('');
    setShowAnswer(false);
  }

  return (
    <div className="center-container fade-in slide-up" style={{ position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <span className="floating-chem-icon" style={{ left: '8vw', top: '12vh', fontSize: '2.2em', animationDelay: '1.2s' }}>🧪</span>
      <div className="glass-card pop-in">
        <h2 className="ptable-title">Prefix Practice (AP/Honors Must-Know)</h2>
        <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>
          What is the Greek prefix for <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.2em' }}>{problem.number}</span>?
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="glow-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type the prefix here (e.g. di)"
            autoFocus
            disabled={showAnswer}
            style={{ width: '100%', maxWidth: 420 }}
          />
        </form>
        {feedback && (
          <div className={feedback.startsWith('✅') ? 'feedback-correct' : 'feedback-incorrect'} style={{ whiteSpace: 'pre-line', fontSize: '1.08em', borderRadius: 16, margin: '12px 0', fontWeight: 600, padding: '18px 16px', textAlign: 'left', maxWidth: 420, width: '100%', boxSizing: 'border-box', background: feedback.startsWith('✅') ? undefined : 'linear-gradient(90deg,#ff5ca7 0,#a259ec 100%)', color: feedback.startsWith('✅') ? undefined : '#fff', boxShadow: feedback.startsWith('✅') ? undefined : '0 2px 16px #a259ec55' }}>
            {feedback}
          </div>
        )}
        <button className="ptable-btn" onClick={handleNext} style={{ marginTop: 8 }}>{showAnswer ? 'Next' : 'Try Another'}</button>
        <button className="back-btn" onClick={onBack} style={{ marginTop: 18 }}>Back</button>
      </div>
    </div>
  );
} 