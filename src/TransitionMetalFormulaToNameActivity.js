import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';

const transitionMetalFormulaToNameProblems = [
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

function getRandomTransitionMetalFormulaToNameProblem() {
  return transitionMetalFormulaToNameProblems[Math.floor(Math.random() * transitionMetalFormulaToNameProblems.length)];
}

export default function TransitionMetalFormulaToNameActivity({ onBack }) {
  const [problem, setProblem] = useState(getRandomTransitionMetalFormulaToNameProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showTable, setShowTable] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const correct = userAnswer.replace(/\s+/g, '').toLowerCase() === problem.answer.replace(/\s+/g, '').toLowerCase();
    if (correct) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${problem.answer}. Explanation: ${problem.explanation}`);
    }
  }

  function handleNext() {
    setProblem(getRandomTransitionMetalFormulaToNameProblem());
    setUserAnswer('');
    setFeedback('');
  }

  return (
    <>
      <div className="center-container fade-in slide-up">
        <div className="glass-card">
          <h2 className="ptable-title">Transition Metal Ionic: Formula → Name</h2>
          <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Formula: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{problem.formula}</span></div>
          <form onSubmit={handleSubmit}>
            <input
              className="glow-input"
              type="text"
              placeholder="Enter name (e.g. Iron(III) chloride)"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              disabled={showTable}
            />
            <button className="ptable-btn" type="submit" disabled={showTable}>Submit</button>
          </form>
          {feedback && (
            <div className={feedback.startsWith('✅') ? 'feedback-correct' : 'feedback-incorrect'}>
              {feedback}
            </div>
          )}
          <button className="ptable-btn" onClick={handleNext} disabled={showTable}>Try Another</button>
          {!showTable && <button className="ptable-btn" onClick={() => setShowTable(true)}>Show Periodic Table</button>}
          {!showTable && <button className="back-btn" onClick={onBack}>Back</button>}
        </div>
      </div>
      {showTable && (
        <div className="ptable-modal">
          <div className="glass-card" style={{ maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto' }}>
            <PeriodicTable onBack={() => setShowTable(false)} />
          </div>
        </div>
      )}
    </>
  );
}
