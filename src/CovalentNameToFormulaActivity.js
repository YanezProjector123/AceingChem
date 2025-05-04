import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';

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
  const [showTable, setShowTable] = useState(false);

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
    <>
      <div className="center-container fade-in slide-up">
        <div className="glass-card">
          <h2 className="ptable-title">Covalent Compound: Name → Formula</h2>
          <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Name: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{problem.name}</span></div>
          <form onSubmit={handleSubmit}>
            <input
              className="glow-input"
              type="text"
              placeholder="Enter formula (e.g. CO₂)"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              style={{
                width: '94vw',
                maxWidth: 420,
                fontSize: '1.15em',
                background: '#fff',
                color: '#23234a',
                border: '2px solid #b6f8e0',
                borderRadius: 10,
                padding: '12px 14px',
                margin: '0 auto 4px auto',
                fontWeight: 600,
                boxSizing: 'border-box',
                outline: 'none',
                boxShadow: '0 1px 8px #b6f8e022',
                display: 'block',
              }}
            />
            <div style={{
              position: 'relative',
              width: '94vw',
              maxWidth: 420,
              margin: '0 auto 16px auto',
              boxSizing: 'border-box',
            }}>
              <div style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                background: '#fff',
                borderRadius: 10,
                border: '1.5px solid #b6f8e0',
                padding: '6px 0 6px 6px',
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                minHeight: 54,
                alignItems: 'center',
                boxShadow: '0 2px 8px #b6f8e022',
                width: '100%',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                scrollbarColor: '#b6f8e0 #fff',
                scrollbarWidth: 'thin',
              }}>
                {["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"].map((sub, idx) => (
                  <button
                    key={sub}
                    type="button"
                    className="ptable-btn"
                    onClick={() => setUserAnswer(userAnswer + sub)}
                    tabIndex={-1}
                    style={{ minWidth: 44, minHeight: 38, fontSize: '1.5em', color: '#23234a', background: '#e0f7fa', border: '1.5px solid #b6f8e0', borderRadius: 8, margin: 0, padding: 0, flex: '0 0 auto', fontWeight: 700 }}
                  >{sub}</button>
                ))}
                {/* Right arrow icon as scroll cue */}
                <span style={{ display: 'inline-block', minWidth: 24, height: 38, verticalAlign: 'middle', marginLeft: 6, color: '#b6f8e0', fontSize: '1.5em', userSelect: 'none', pointerEvents: 'none' }}>→</span>
              </div>
              {/* Fade gradient overlay for scroll cue */}
              <div style={{
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                right: 0,
                width: 36,
                height: '100%',
                background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, #fff 80%)',
                borderRadius: '0 10px 10px 0',
                zIndex: 2,
              }} />
            </div>
            <button className="ptable-btn" type="submit">Submit</button>
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
