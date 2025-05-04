import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';

const transitionMetalProblems = [
  // Iron
  { formula: 'FeCl₂', answer: 'Iron(II) chloride', explanation: 'Fe²⁺ and 2 Cl⁻ ions.' },
  { formula: 'FeCl₃', answer: 'Iron(III) chloride', explanation: 'Fe³⁺ and 3 Cl⁻ ions.' },
  { formula: 'FeO', answer: 'Iron(II) oxide', explanation: 'Fe²⁺ and O²⁻.' },
  { formula: 'Fe₂O₃', answer: 'Iron(III) oxide', explanation: '2 Fe³⁺ and 3 O²⁻.' },
  // Copper
  { formula: 'CuO', answer: 'Copper(II) oxide', explanation: 'Cu²⁺ and O²⁻.' },
  { formula: 'Cu₂O', answer: 'Copper(I) oxide', explanation: '2 Cu⁺ and O²⁻.' },
  { formula: 'CuCl', answer: 'Copper(I) chloride', explanation: 'Cu⁺ and Cl⁻.' },
  { formula: 'CuCl₂', answer: 'Copper(II) chloride', explanation: 'Cu²⁺ and 2 Cl⁻.' },
  // Chromium
  { formula: 'CrCl₂', answer: 'Chromium(II) chloride', explanation: 'Cr²⁺ and 2 Cl⁻.' },
  { formula: 'CrCl₃', answer: 'Chromium(III) chloride', explanation: 'Cr³⁺ and 3 Cl⁻.' },
  { formula: 'Cr₂O₃', answer: 'Chromium(III) oxide', explanation: '2 Cr³⁺ and 3 O²⁻.' },
  // Cobalt
  { formula: 'CoCl₂', answer: 'Cobalt(II) chloride', explanation: 'Co²⁺ and 2 Cl⁻.' },
  { formula: 'CoCl₃', answer: 'Cobalt(III) chloride', explanation: 'Co³⁺ and 3 Cl⁻.' },
  // Lead
  { formula: 'PbO', answer: 'Lead(II) oxide', explanation: 'Pb²⁺ and O²⁻.' },
  { formula: 'PbO₂', answer: 'Lead(IV) oxide', explanation: 'Pb⁴⁺ and 2 O²⁻.' },
  { formula: 'PbCl₂', answer: 'Lead(II) chloride', explanation: 'Pb²⁺ and 2 Cl⁻.' },
  { formula: 'PbCl₄', answer: 'Lead(IV) chloride', explanation: 'Pb⁴⁺ and 4 Cl⁻.' },
  // Tin
  { formula: 'SnO', answer: 'Tin(II) oxide', explanation: 'Sn²⁺ and O²⁻.' },
  { formula: 'SnO₂', answer: 'Tin(IV) oxide', explanation: 'Sn⁴⁺ and 2 O²⁻.' },
  { formula: 'SnCl₂', answer: 'Tin(II) chloride', explanation: 'Sn²⁺ and 2 Cl⁻.' },
  { formula: 'SnCl₄', answer: 'Tin(IV) chloride', explanation: 'Sn⁴⁺ and 4 Cl⁻.' },
];

function getRandomTransitionMetalProblem() {
  return transitionMetalProblems[Math.floor(Math.random() * transitionMetalProblems.length)];
}

export default function TransitionMetalIonicActivity({ onBack }) {
  const [showTable, setShowTable] = useState(false);
  const [problem, setProblem] = useState(getRandomTransitionMetalProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const correct = userAnswer.replace(/\s+/g, '').toLowerCase() === problem.answer.replace(/\s+/g, '').toLowerCase();
    if (correct) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${problem.answer}.\nExplanation: ${problem.explanation}\n\uD83D\uDCA1 Tip: For transition metals, use Roman numerals to indicate the charge. Name the cation (metal) first, then the anion. Balance charges to write the correct formula or name.`);
    }
  }

  function handleNext() {
    setProblem(getRandomTransitionMetalProblem());
    setUserAnswer('');
    setFeedback('');
  }

  return (
    <div className="center-container fade-in slide-up" style={{ position: 'relative', overflow: 'hidden' }}>
      <span className="floating-chem-icon" style={{ left: '8vw', top: '12vh', fontSize: '2.2em', animationDelay: '1.2s' }}>🧪</span>
      <div className="glass-card pop-in">
        <h2 className="ptable-title">Transition Metal Ionic Compound: Formula → Name</h2>
        <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Formula: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{problem.formula}</span></div>
        <form onSubmit={handleSubmit}>
          <input
            className="glow-input"
            type="text"
            placeholder="Enter name (e.g. Iron(III) chloride)"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            disabled={showTable}
            style={{ width: '100%', maxWidth: 420 }}
          />
        </form>
        {feedback && (
          <div className={feedback.startsWith('✅') ? 'feedback-correct' : 'feedback-incorrect'} style={{ whiteSpace: 'pre-line', fontSize: '1.08em', borderRadius: 16, margin: '16px 0', padding: '18px 16px', textAlign: 'left', maxWidth: 420, width: '100%', boxSizing: 'border-box', background: feedback.startsWith('✅') ? undefined : 'linear-gradient(90deg,#ff5ca7 0,#a259ec 100%)', color: feedback.startsWith('✅') ? undefined : '#fff', boxShadow: feedback.startsWith('✅') ? undefined : '0 2px 16px #a259ec55' }}>
            {feedback}
          </div>
        )}
        <button className="ptable-btn" onClick={handleNext}>Try Another</button>
        <button className="back-btn" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
