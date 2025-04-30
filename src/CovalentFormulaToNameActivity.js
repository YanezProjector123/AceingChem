import React, { useState } from 'react';

// Covalent compounds: only nonmetals, use prefixes (mono-, di-, tri-, etc.)
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
  const [problem, setProblem] = useState(getRandomCovalentFormulaToNameProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const correct = userAnswer.replace(/\s+/g, '').toLowerCase() === problem.answer.replace(/\s+/g, '').toLowerCase();
    if (correct) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${problem.answer}. Explanation: ${problem.explanation}\nHow to get it right next time: Use the subscripts to determine the number of atoms for each element, and apply the correct prefixes for each.`);
    }
  }

  function handleNext() {
    setProblem(getRandomCovalentFormulaToNameProblem());
    setUserAnswer('');
    setFeedback('');
  }

  return (
    <div className="center-container fade-in slide-up" style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto' }}>
      <h2 className="ptable-title">Covalent Compound: Formula → Name</h2>
      <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Formula: <span style={{ color: '#38bdf8', fontWeight: 700 }}>{problem.formula}</span></div>
      <form onSubmit={handleSubmit}>
        <input
          className="ptable-btn"
          style={{ fontSize: '1.15em', margin: '8px 0', padding: '10px 18px', borderRadius: 7 }}
          type="text"
          placeholder="Enter name (e.g. Carbon dioxide)"
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
        />
        <button className="ptable-btn" type="submit" style={{ margin: '8px 0' }}>Submit</button>
      </form>
      {feedback && <div style={{ margin: '10px 0', fontWeight: 600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7' }}>{feedback}</div>}
      <button className="ptable-btn" style={{ marginTop: 18, marginRight: 8 }} onClick={handleNext}>Try Another</button>
      <button className="ptable-btn" style={{ marginTop: 18, background: '#23234a', marginRight: 8 }} onClick={() => onPeriodicTable && onPeriodicTable()}>Show Periodic Table</button>
      <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
    </div>
  );
}
