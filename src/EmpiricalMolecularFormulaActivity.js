  import React, { useState } from 'react';
import './ActivityModern.css';

// Element pool for random generation
const ELEMENTS = [
  { symbol: 'C', mass: 12.01 },
  { symbol: 'H', mass: 1.008 },
  { symbol: 'O', mass: 16.00 },
  { symbol: 'N', mass: 14.01 },
  { symbol: 'S', mass: 32.07 },
  { symbol: 'P', mass: 30.97 },
  { symbol: 'Cl', mass: 35.45 },
  { symbol: 'Ca', mass: 40.08 },
  { symbol: 'Na', mass: 22.99 },
  { symbol: 'Mg', mass: 24.31 },
];

function getRandomElements(num) {
  const shuffled = [...ELEMENTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function roundTo(n, d) { return Math.round(n * Math.pow(10, d)) / Math.pow(10, d); }

function generateEmpiricalProblem() {
  // Select 2-3 elements for the compound
  const numElements = Math.random() < 0.5 ? 2 : 3;
  const elements = getRandomElements(numElements);
  
  // Create simple mole ratios for elements (whole numbers 1-5)
  const moleRatios = [];
  for (let i = 0; i < numElements; i++) {
    // Generate integers between 1 and 5 for simple ratios
    moleRatios.push(Math.floor(Math.random() * 5) + 1);
  }
  
  // Calculate mass of each element based on mole ratios
  const masses = [];
  let totalMass = 0;
  for (let i = 0; i < numElements; i++) {
    const mass = moleRatios[i] * elements[i].mass;
    masses.push(mass);
    totalMass += mass;
  }
  
  // Calculate mass percentages (rounded to 1 decimal place)
  const percents = masses.map(mass => roundTo((mass / totalMass) * 100, 1));
  
  // Find the GCD of mole ratios to get the simplest ratio (empirical formula)
  const gcdValue = gcd(moleRatios);
  const empiricalRatios = moleRatios.map(ratio => ratio / gcdValue);
  
  // Build empirical formula string
  let empirical = '';
  for (let i = 0; i < numElements; i++) {
    empirical += elements[i].symbol;
    if (empiricalRatios[i] > 1) {
      empirical += empiricalRatios[i]; // Will be converted to subscript later
    }
  }
  
  // Determine molecular formula multiplier (1-4)
  const molecularMultiplier = Math.floor(Math.random() * 4) + 1;
  
  // Build molecular formula string
  let molecular = '';
  for (let i = 0; i < numElements; i++) {
    molecular += elements[i].symbol;
    const molecularRatio = empiricalRatios[i] * molecularMultiplier;
    if (molecularRatio > 1) {
      molecular += molecularRatio; // Will be converted to subscript later
    }
  }
  
  // Calculate empirical and molecular masses
  let empiricalMass = 0;
  for (let i = 0; i < numElements; i++) {
    empiricalMass += elements[i].mass * empiricalRatios[i];
  }
  empiricalMass = roundTo(empiricalMass, 2);
  
  const molecularMass = roundTo(empiricalMass * molecularMultiplier, 2);
  
  return {
    elements,
    percents,
    empirical,
    molecular,
    empiricalMass,
    molecularMass,
    molecularMultiplier
  };
}

function gcd(arr) {
  // Greatest common divisor for array of numbers
  function _gcd(a, b) { return b ? _gcd(b, a % b) : a; }
  return arr.reduce((a, b) => _gcd(a, b));
}

function normalizeFormula(str) {
  const subNum = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
  return str.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, s => subNum[s]).replace(/\s+/g,'').toUpperCase();
}

function toSubscript(str) {
  // Properly convert numbers to subscript
  return str.replace(/([0-9.]+)/g, match => {
    return Array.from(match).map(ch => {
      if (ch === '.') return '.';
      return String.fromCharCode(0x2080 + Number(ch));
    }).join('');
  });
}

export default function EmpiricalMolecularFormulaActivity({ onBack }) {
  const [problem, setProblem] = useState(generateEmpiricalProblem());
  const [empiricalInput, setEmpiricalInput] = useState('');
  const [molecularInput, setMolecularInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleCheck = () => {
    // Parse user input and compare with correct answers
    const normalizedEmpInput = normalizeFormula(empiricalInput);
    const normalizedMolInput = normalizeFormula(molecularInput);
    const correctEmpFormula = normalizeFormula(problem.empirical);
    const correctMolFormula = normalizeFormula(problem.molecular);
    
    const correctEmp = normalizedEmpInput === correctEmpFormula;
    const correctMol = normalizedMolInput === correctMolFormula;
    
    if (correctEmp && correctMol) {
      setFeedback({ 
        correct: true, 
        message: 'Correct! Well done. Both formulas are right.' 
      });
    } else {
      // Build educational feedback message
      let feedbackMsg = `Not quite.

`;
      
      if (!correctEmp && !correctMol) {
        feedbackMsg += `Both formulas need correction.

`;
      } else if (!correctEmp) {
        feedbackMsg += `Your empirical formula needs correction.

`;
      } else {
        feedbackMsg += `Your molecular formula needs correction.

`;
      }
      
      feedbackMsg += `Empirical formula: ${toSubscript(problem.empirical)}
`;
      feedbackMsg += `Molecular formula: ${toSubscript(problem.molecular)}
`;
      feedbackMsg += `Empirical mass: ${problem.empiricalMass} g/mol
`;
      feedbackMsg += `Molecular mass: ${problem.molecularMass} g/mol

`;
      
      feedbackMsg += `Note: The molecular formula is ${problem.molecularMultiplier} times the empirical formula.`;
      
      setFeedback({
        correct: false,
        message: feedbackMsg
      });
    }
  };

  const handleNext = () => {
    setProblem(generateEmpiricalProblem());
    setEmpiricalInput('');
    setMolecularInput('');
    setFeedback(null);
  };

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Empirical & Molecular Formula</h2>
        <div className="question-area">
          <p className="question-text">
            A compound contains the following elements by mass:            
            <ul style={{margin:'0.5em 0 0.5em 1.5em'}}>
              {problem.elements.map((el,i) => (
                <li key={el.symbol}><b>{el.symbol}</b>: {problem.percents[i].toFixed(1)}%</li>
              ))}
            </ul>
            The molar mass of the compound is <b>{problem.molecularMass} g/mol</b>.<br/><br/>
            <b>1.</b> Determine the empirical formula of the compound.<br/>
            <b>2.</b> Determine the molecular formula of the compound.
          </p>
        </div>
        <form onSubmit={e => {e.preventDefault(); handleCheck();}} style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
          <input
            className="activity-input"
            type="text"
            value={empiricalInput}
            onChange={e => setEmpiricalInput(e.target.value)}
            placeholder="Empirical formula (e.g. CH2O)"
            style={{ margin: '10px 0' }}
            autoComplete="off"
          />
          <div style={{ minHeight: 20, color: '#3b3b3b', fontSize: '1.1em', marginBottom: 4 }}>
            <span style={{opacity:0.7}}>Preview:</span> <span style={{fontFamily:'monospace',letterSpacing:1}}>{toSubscript(empiricalInput)}</span>
          </div>
          <input
            className="activity-input"
            type="text"
            value={molecularInput}
            onChange={e => setMolecularInput(e.target.value)}
            placeholder="Molecular formula (e.g. C2H4O2)"
            style={{ margin: '10px 0 20px 0' }}
            autoComplete="off"
          />
          <div style={{ minHeight: 20, color: '#3b3b3b', fontSize: '1.1em', marginBottom: 8 }}>
            <span style={{opacity:0.7}}>Preview:</span> <span style={{fontFamily:'monospace',letterSpacing:1}}>{toSubscript(molecularInput)}</span>
          </div>
          {feedback && (
            <>
              <div className={`feedback-container feedback-${feedback.correct ? 'correct' : 'incorrect'}`} style={{whiteSpace:'pre-line',marginBottom:14}}>{feedback.message}</div>
              <div style={{textAlign:'center',marginBottom:10}}>
                <button
                  className="activity-next-btn"
                  style={{
                    background: feedback.correct ? '#16a34a' : '#6366f1',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.08em',
                    border: 'none',
                    borderRadius: 8,
                    padding: '9px 28px',
                    marginTop: 5,
                    cursor: 'pointer',
                    boxShadow: '0 1px 8px #0002',
                    transition: 'background 0.2s',
                  }}
                  onClick={handleNext}
                >
                  Next Question
                </button>
              </div>
            </>
          )}
          <div className="button-row">
            {!feedback?.correct && (
              <button type="submit" className="activity-btn">Check Answer</button>
            )}
            {feedback?.correct && (
              <button type="button" className="activity-btn" onClick={handleNext}>Next</button>
            )}
            <button type="button" className="back-btn" onClick={onBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
    );
  }

