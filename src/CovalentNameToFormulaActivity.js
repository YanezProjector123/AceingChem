import React, { useState } from 'react';

// Covalent compounds: only nonmetals, use prefixes (mono-, di-, tri-, etc.)
const covalentProblems = [
  // Carbon compounds
  { name: 'Carbon dioxide', answer: 'CO₂', explanation: 'Carbon is C, dioxide means 2 oxygens.' },
  { name: 'Carbon monoxide', answer: 'CO', explanation: 'Carbon is C, monoxide means 1 oxygen.' },
  { name: 'Carbon disulfide', answer: 'CS₂', explanation: 'Disulfide means 2 sulfurs.' },
  { name: 'Carbon tetrachloride', answer: 'CCl₄', explanation: 'Tetrachloride means 4 chlorines.' },
  { name: 'Carbon tetrafluoride', answer: 'CF₄', explanation: 'Tetrafluoride means 4 fluorines.' },
  { name: 'Carbon tetrabromide', answer: 'CBr₄', explanation: 'Tetrabromide means 4 bromines.' },
  { name: 'Carbon tetraiodide', answer: 'CI₄', explanation: 'Tetraiodide means 4 iodines.' },

  // Nitrogen compounds
  { name: 'Dinitrogen tetroxide', answer: 'N₂O₄', explanation: 'Dinitrogen means 2 nitrogens, tetroxide means 4 oxygens.' },
  { name: 'Nitrogen dioxide', answer: 'NO₂', explanation: 'Dioxide means 2 oxygens.' },
  { name: 'Dinitrogen trioxide', answer: 'N₂O₃', explanation: 'Trioxide means 3 oxygens.' },
  { name: 'Dinitrogen pentoxide', answer: 'N₂O₅', explanation: 'Pentoxide means 5 oxygens.' },
  { name: 'Dinitrogen monoxide', answer: 'N₂O', explanation: 'Monoxide means 1 oxygen.' },
  { name: 'Nitrogen monoxide', answer: 'NO', explanation: 'Monoxide means 1 oxygen.' },
  { name: 'Dinitrogen difluoride', answer: 'N₂F₂', explanation: 'Difluoride means 2 fluorines.' },
  { name: 'Nitrogen trifluoride', answer: 'NF₃', explanation: 'Trifluoride means 3 fluorines.' },
  { name: 'Nitrogen trichloride', answer: 'NCl₃', explanation: 'Trichloride means 3 chlorines.' },

  // Phosphorus compounds
  { name: 'Phosphorus pentachloride', answer: 'PCl₅', explanation: 'Pentachloride means 5 chlorines.' },
  { name: 'Phosphorus trichloride', answer: 'PCl₃', explanation: 'Trichloride means 3 chlorines.' },
  { name: 'Phosphorus triiodide', answer: 'PI₃', explanation: 'Triiodide means 3 iodines.' },
  { name: 'Phosphorus pentafluoride', answer: 'PF₅', explanation: 'Pentafluoride means 5 fluorines.' },
  { name: 'Tetraphosphorus decoxide', answer: 'P₄O₁₀', explanation: 'Tetraphosphorus means 4 phosphorus atoms, decoxide means 10 oxygens.' },
  { name: 'Tetraphosphorus trisulfide', answer: 'P₄S₃', explanation: 'Trisulfide means 3 sulfurs.' },
  { name: 'Phosphorus trioxide', answer: 'P₄O₆', explanation: 'Trioxide means 6 oxygens.' },

  // Sulfur compounds
  { name: 'Sulfur dioxide', answer: 'SO₂', explanation: 'Dioxide means 2 oxygens.' },
  { name: 'Sulfur trioxide', answer: 'SO₃', explanation: 'Trioxide means 3 oxygens.' },
  { name: 'Sulfur hexafluoride', answer: 'SF₆', explanation: 'Hexafluoride means 6 fluorines.' },
  { name: 'Sulfur dichloride', answer: 'SCl₂', explanation: 'Dichloride means 2 chlorines.' },
  { name: 'Sulfur tetrafluoride', answer: 'SF₄', explanation: 'Tetrafluoride means 4 fluorines.' },
  { name: 'Disulfur decafluoride', answer: 'S₂F₁₀', explanation: 'Disulfur means 2 sulfurs, decafluoride means 10 fluorines.' },
  { name: 'Dihydrogen disulfide', answer: 'H₂S₂', explanation: 'Dihydrogen means 2 hydrogens, disulfide means 2 sulfurs.' },

  // Halogen and oxygen compounds
  { name: 'Dichlorine monoxide', answer: 'Cl₂O', explanation: 'Dichlorine means 2 chlorines, monoxide means 1 oxygen.' },
  { name: 'Chlorine trifluoride', answer: 'ClF₃', explanation: 'Trifluoride means 3 fluorines.' },
  { name: 'Iodine pentafluoride', answer: 'IF₅', explanation: 'Pentafluoride means 5 fluorines.' },
  { name: 'Diiodine pentoxide', answer: 'I₂O₅', explanation: 'Diiodine means 2 iodines, pentoxide means 5 oxygens.' },
  { name: 'Dibromine monoxide', answer: 'Br₂O', explanation: 'Dibromine means 2 bromines, monoxide means 1 oxygen.' },
  { name: 'Bromine trifluoride', answer: 'BrF₃', explanation: 'Trifluoride means 3 fluorines.' },
  { name: 'Bromine pentafluoride', answer: 'BrF₅', explanation: 'Pentafluoride means 5 fluorines.' },
  { name: 'Iodine trifluoride', answer: 'IF₃', explanation: 'Trifluoride means 3 fluorines.' },
  { name: 'Iodine heptafluoride', answer: 'IF₇', explanation: 'Heptafluoride means 7 fluorines.' },
  { name: 'Dichlorine decafluoride', answer: 'Cl₂F₁₀', explanation: 'Dichlorine means 2 chlorines, decafluoride means 10 fluorines.' },

  // Silicon and selenium compounds
  { name: 'Silicon tetrachloride', answer: 'SiCl₄', explanation: 'Tetrachloride means 4 chlorines.' },
  { name: 'Silicon tetrafluoride', answer: 'SiF₄', explanation: 'Tetrafluoride means 4 fluorines.' },
  { name: 'Selenium hexafluoride', answer: 'SeF₆', explanation: 'Hexafluoride means 6 fluorines.' },
  { name: 'Selenium dioxide', answer: 'SeO₂', explanation: 'Dioxide means 2 oxygens.' },
  { name: 'Selenium tetrachloride', answer: 'SeCl₄', explanation: 'Tetrachloride means 4 chlorines.' },

  // Water and ammonia
  { name: 'Dihydrogen monoxide', answer: 'H₂O', explanation: 'Dihydrogen means 2 hydrogens, monoxide means 1 oxygen.' },
  { name: 'Ammonia', answer: 'NH₃', explanation: 'Ammonia is NH₃.' },
  { name: 'Hydrazine', answer: 'N₂H₄', explanation: 'Hydrazine is N₂H₄.' },

  // More exotic
  { name: 'Dinitrogen difluoride', answer: 'N₂F₂', explanation: 'Dinitrogen means 2 nitrogens, difluoride means 2 fluorines.' },
  { name: 'Tetraiodine nonoxide', answer: 'I₄O₉', explanation: 'Tetraiodine means 4 iodines, nonoxide means 9 oxygens.' },
  { name: 'Dibromine pentoxide', answer: 'Br₂O₅', explanation: 'Dibromine means 2 bromines, pentoxide means 5 oxygens.' },
  { name: 'Phosphorus pentabromide', answer: 'PBr₅', explanation: 'Pentabromide means 5 bromines.' },
  { name: 'Phosphorus tribromide', answer: 'PBr₃', explanation: 'Tribromide means 3 bromines.' },
  { name: 'Phosphorus triiodide', answer: 'PI₃', explanation: 'Triiodide means 3 iodines.' },
  { name: 'Dinitrogen tetrafluoride', answer: 'N₂F₄', explanation: 'Tetrafluoride means 4 fluorines.' },
  { name: 'Disulfur dichloride', answer: 'S₂Cl₂', explanation: 'Disulfur means 2 sulfurs, dichloride means 2 chlorines.' }
];

function getRandomCovalentNameToFormulaProblem() {
  return covalentProblems[Math.floor(Math.random() * covalentProblems.length)];
}

export default function CovalentNameToFormulaActivity({ onBack, onCovalentFormulaToNameActivity, onPeriodicTable }) {
  const [problem, setProblem] = useState(getRandomCovalentNameToFormulaProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const correct = userAnswer.replace(/\s+/g, '').toLowerCase() === problem.answer.replace(/\s+/g, '').toLowerCase();
    if (correct) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${problem.answer}. Explanation: ${problem.explanation}\nHow to get it right next time: Use the prefixes to determine the number of atoms for each element, and write the formula accordingly.`);
    }
  }

  function handleNext() {
    setProblem(getRandomCovalentNameToFormulaProblem());
    setUserAnswer('');
    setFeedback('');
  }

  return (
    <div className="center-container fade-in slide-up" style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto' }}>
      <h2 className="ptable-title">Covalent Compound: Name → Formula</h2>
      <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Name: <span style={{ color: '#38bdf8', fontWeight: 700 }}>{problem.name}</span></div>
      <form onSubmit={handleSubmit}>
        <input
          className="ptable-btn"
          style={{ fontSize: '1.15em', margin: '8px 0', padding: '10px 18px', borderRadius: 7 }}
          type="text"
          placeholder="Enter formula (e.g. CO₂)"
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
        />
        <div style={{ margin: '6px 0', display: 'flex', justifyContent: 'center', gap: 4 }}>
          {["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"].map((sub, idx) => (
            <button
              key={sub}
              type="button"
              className="ptable-btn"
              style={{ minWidth: 34, padding: '4px 0', fontSize: '1.18em', borderRadius: 6, fontWeight: 700, background: '#f3e8ff', color: '#23234a', border: '1.5px solid #e0b6f8', margin: 0 }}
              onClick={() => setUserAnswer(userAnswer + sub)}
              tabIndex={-1}
            >{sub}</button>
          ))}
        </div>
        <button className="ptable-btn" type="submit" style={{ margin: '8px 0' }}>Submit</button>
      </form>
      {feedback && <div style={{ margin: '10px 0', fontWeight: 600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7' }}>{feedback}</div>}
      <button className="ptable-btn" style={{ marginTop: 18, marginRight: 8 }} onClick={handleNext}>Try Another</button>
      <button className="ptable-btn" style={{ marginTop: 18, background: '#23234a', marginRight: 8 }} onClick={() => onPeriodicTable && onPeriodicTable()}>Show Periodic Table</button>
      <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
    </div>
  );
}
