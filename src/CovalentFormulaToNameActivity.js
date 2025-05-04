import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import PeriodicTable from './PeriodicTable'; // Import the PeriodicTable component
import './CovalentFormulaToNameActivity.css';

// Covalent compounds data (keep as is)
const covalentProblems = [
  { formula: 'CO₂', answer: 'Carbon dioxide', explanation: 'CO₂ is carbon and 2 oxygens, so it is carbon dioxide.' },
  { formula: 'CO', answer: 'Carbon monoxide', explanation: 'CO is carbon and 1 oxygen, so it is carbon monoxide.' },
  { formula: 'N₂O₄', answer: 'Dinitrogen tetroxide', explanation: 'N₂O₄ is 2 nitrogens and 4 oxygens, so it is dinitrogen tetroxide.' },
  { formula: 'NO₂', answer: 'Nitrogen dioxide', explanation: 'NO₂ is nitrogen and 2 oxygens, so it is nitrogen dioxide.' },
  { formula: 'SF₆', answer: 'Sulfur hexafluoride', explanation: 'SF₆ is sulfur and 6 fluorines, so it is sulfur hexafluoride.' },
  { formula: 'H₂O', answer: 'Dihydrogen monoxide', explanation: 'H₂O is 2 hydrogens and 1 oxygen, so it is dihydrogen monoxide.' },
  { formula: 'PCl₅', answer: 'Phosphorus pentachloride', explanation: 'PCl₅ is phosphorus and 5 chlorines, so it is phosphorus pentachloride.' },
  { formula: 'N₂O₅', answer: 'Dinitrogen pentoxide', explanation: 'N₂O₅ is 2 nitrogens and 5 oxygens, so it is dinitrogen pentoxide.' },
  { formula: 'SO₂', answer: 'Sulfur dioxide', explanation: 'SO₂ is sulfur and 2 oxygens, so it is sulfur dioxide.' },
  { formula: 'SO₃', answer: 'Sulfur trioxide', explanation: 'SO₃ is sulfur and 3 oxygens, so it is sulfur trioxide.' },
  { formula: 'PCl₃', answer: 'Phosphorus trichloride', explanation: 'PCl₃ is phosphorus and 3 chlorines, so it is phosphorus trichloride.' },
  { formula: 'Cl₂O', answer: 'Dichlorine monoxide', explanation: 'Cl₂O is 2 chlorines and 1 oxygen, so it is dichlorine monoxide.' },
  { formula: 'NO', answer: 'Nitrogen monoxide', explanation: 'NO is nitrogen and 1 oxygen, so it is nitrogen monoxide.' },
  { formula: 'H₂S₂', answer: 'Dihydrogen disulfide', explanation: 'H₂S₂ is 2 hydrogens and 2 sulfurs, so it is dihydrogen disulfide.' },
  { formula: 'P₄O₁₀', answer: 'Tetraphosphorus decoxide', explanation: 'P₄O₁₀ is 4 phosphorus and 10 oxygens, so it is tetraphosphorus decoxide.' }
];

function getRandomCovalentFormulaToNameProblem() {
  return covalentProblems[Math.floor(Math.random() * covalentProblems.length)];
}

export default function CovalentFormulaToNameActivity({ onBack, onCovalentNameToFormulaActivity, onPeriodicTable }) {
  // Use useState with initialization function
  const [problem, setProblem] = useState(() => getRandomCovalentFormulaToNameProblem());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef(null);
  const [showTable, setShowTable] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return; // Prevent submitting empty answer
    const correct = input.replace(/\s+/g, '').toLowerCase() === problem.answer.replace(/\s+/g, '').toLowerCase();
    if (correct) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${problem.answer}. Explanation: ${problem.explanation}\nHow to get it right next time: Use the subscripts to determine the number of atoms for each element, and apply the correct prefixes for each.`);
    }
  }

  function handleNext() {
    setProblem(getRandomCovalentFormulaToNameProblem());
    setInput('');
    setFeedback('');
  }

  return (
    // Wrap in a fragment or div to contain the modal
    <>
      <div className="center-container fade-in slide-up">
        <div className="glass-card">
          <h2 className="ptable-title">Covalent Compound: Formula → Name</h2>
          <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Formula: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{problem.formula}</span></div>
          <form onSubmit={handleSubmit}>
            <input
              className="glow-input"
              type="text"
              placeholder="Enter name (e.g. Carbon dioxide)"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!!feedback}
              ref={inputRef}
            />
            <button className="ptable-btn" type="submit" disabled={!!feedback || !input.trim()}>Submit</button>
          </form>
          {feedback && (
            <div className={feedback.startsWith('✅') ? 'feedback-correct' : 'feedback-incorrect'}>
              {feedback}
            </div>
          )}
          <button className="ptable-btn" onClick={handleNext} disabled={showTable}>Try Another</button>
          {!showTable && (
            <button className="ptable-btn" onClick={() => setShowTable(true)}>Show Periodic Table</button>
          )}
          {!showTable && (
            <button className="back-btn" onClick={onBack}>Back</button>
          )}
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

// Add PropTypes for better component definition
CovalentFormulaToNameActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onCovalentNameToFormulaActivity: PropTypes.func, // Optional prop to switch modes
  onPeriodicTable: PropTypes.func // Still accept prop, parent might want to know
};

CovalentFormulaToNameActivity.defaultProps = {
  onPeriodicTable: () => {}, // Default no-op
  onCovalentNameToFormulaActivity: null
};