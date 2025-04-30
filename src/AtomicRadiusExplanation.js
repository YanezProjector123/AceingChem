import React, { useState } from 'react';

const questions = [
  {
    prompt: 'Why does atomic radius decrease across a period (left to right)?',
    answer: 'Increased nuclear charge pulls electrons closer.'
  },
  {
    prompt: 'Why does atomic radius increase down a group?',
    answer: 'More energy levels/shells are added.'
  },
  {
    prompt: 'Name an exception to the general atomic radius trend and explain why it occurs.',
    answer: 'Transition metals can show irregularities due to d-subshell filling.'
  }
];

export default function AtomicRadiusExplanation({ onBack }) {
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="center-container fade-in slide-up" style={{ minHeight: '100vh', textAlign: 'center', background: 'radial-gradient(circle at 60% 40%, #2d314d 80%, #19172e 100%)' }}>
      <div style={{ background: 'rgba(30,41,59,0.98)', padding: 24, borderRadius: 18, boxShadow: '0 4px 16px #0005', maxWidth: 540, margin: '0 auto' }}>
        <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: 1.5 }}>Explanation & Reflection</h2>
        <div style={{ color: '#a5b4fc', marginBottom: 18 }}>Reflect on these atomic radius questions:</div>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>{questions[idx].prompt}</div>
        {showAnswer ? (
          <div style={{ color: '#5eead4', marginBottom: 14 }}>{questions[idx].answer}</div>
        ) : (
          <button className="ptable-btn" style={{ marginBottom: 14 }} onClick={() => setShowAnswer(true)}>Show Answer</button>
        )}
        <div>
          <button className="ptable-btn" disabled={idx === 0} onClick={() => { setIdx(idx-1); setShowAnswer(false); }} style={{ marginRight: 10 }}>Previous</button>
          <button className="ptable-btn" disabled={idx === questions.length-1} onClick={() => { setIdx(idx+1); setShowAnswer(false); }}>Next</button>
        </div>
        <button className="back-btn" style={{ marginTop: 24 }} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
