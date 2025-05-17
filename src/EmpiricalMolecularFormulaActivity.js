  import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

// Element pool for random generation
const ELEMENTS = [
  // Common nonmetals
  { symbol: 'H', mass: 1.008, category: 'nonmetal' },
  { symbol: 'C', mass: 12.01, category: 'nonmetal' },
  { symbol: 'N', mass: 14.01, category: 'nonmetal' },
  { symbol: 'O', mass: 16.00, category: 'nonmetal' },
  { symbol: 'P', mass: 30.97, category: 'nonmetal' },
  { symbol: 'S', mass: 32.07, category: 'nonmetal' },
  
  // Halogens
  { symbol: 'F', mass: 19.00, category: 'halogen' },
  { symbol: 'Cl', mass: 35.45, category: 'halogen' },
  { symbol: 'Br', mass: 79.90, category: 'halogen' },
  { symbol: 'I', mass: 126.90, category: 'halogen' },
  
  // Alkali metals
  { symbol: 'Li', mass: 6.94, category: 'alkali' },
  { symbol: 'Na', mass: 22.99, category: 'alkali' },
  { symbol: 'K', mass: 39.10, category: 'alkali' },
  
  // Alkaline earth metals
  { symbol: 'Be', mass: 9.01, category: 'alkaline' },
  { symbol: 'Mg', mass: 24.31, category: 'alkaline' },
  { symbol: 'Ca', mass: 40.08, category: 'alkaline' },
  { symbol: 'Sr', mass: 87.62, category: 'alkaline' },
  { symbol: 'Ba', mass: 137.33, category: 'alkaline' },
  
  // Transition metals
  { symbol: 'Ti', mass: 47.87, category: 'transition' },
  { symbol: 'V', mass: 50.94, category: 'transition' },
  { symbol: 'Cr', mass: 52.00, category: 'transition' },
  { symbol: 'Mn', mass: 54.94, category: 'transition' },
  { symbol: 'Fe', mass: 55.85, category: 'transition' },
  { symbol: 'Co', mass: 58.93, category: 'transition' },
  { symbol: 'Ni', mass: 58.69, category: 'transition' },
  { symbol: 'Cu', mass: 63.55, category: 'transition' },
  { symbol: 'Zn', mass: 65.38, category: 'transition' },
  { symbol: 'Ag', mass: 107.87, category: 'transition' },
  { symbol: 'Au', mass: 196.97, category: 'transition' },
  { symbol: 'Hg', mass: 200.59, category: 'transition' },
  
  // Other metals
  { symbol: 'Al', mass: 26.98, category: 'metal' },
  { symbol: 'Sn', mass: 118.71, category: 'metal' },
  { symbol: 'Pb', mass: 207.2, category: 'metal' },
  
  // Metalloids
  { symbol: 'B', mass: 10.81, category: 'metalloid' },
  { symbol: 'Si', mass: 28.09, category: 'metalloid' },
  { symbol: 'As', mass: 74.92, category: 'metalloid' },
];

// Get random elements with different strategies for more varied compounds
function getRandomElements(num) {
  // Different selection strategies for more variety
  const strategy = Math.floor(Math.random() * 5);
  
  let pool = [];
  
  switch(strategy) {
    case 0: // Common organic compounds (C, H, O, N)
      pool = ELEMENTS.filter(el => ['C','H','O','N'].includes(el.symbol));
      break;
    case 1: // Inorganic compounds with metals
      pool = [
        ...ELEMENTS.filter(el => el.category === 'metal' || el.category === 'transition' || el.category === 'alkaline'),
        ...ELEMENTS.filter(el => el.category === 'nonmetal').slice(0, 4)
      ];
      break;
    case 2: // Compounds with halogens
      pool = [
        ...ELEMENTS.filter(el => el.category === 'halogen'),
        ...ELEMENTS.filter(el => el.category !== 'halogen').slice(0, 10)
      ];
      break;
    case 3: // Compounds with metalloids
      pool = [
        ...ELEMENTS.filter(el => el.category === 'metalloid'),
        ...ELEMENTS.filter(el => el.category !== 'metalloid').slice(0, 10)
      ];
      break;
    default: // Completely random
      pool = [...ELEMENTS];
      break;
  }
  
  // Ensure we have at least num elements in our pool
  if (pool.length < num) {
    pool = [...ELEMENTS]; // Fallback to all elements if subset is too small
  }
  
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function roundTo(n, d) { return Math.round(n * Math.pow(10, d)) / Math.pow(10, d); }

function generateEmpiricalProblem(difficultyOverride = null) {
  // Use provided difficulty or random
  const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4); // 0-3: basic, intermediate, advanced, challenging
  
  // Select 2-4 elements based on difficulty
  const numElements = problemType === 0 ? 2 : (problemType === 1 ? 3 : (Math.random() < 0.7 ? 3 : 4));
  const elements = getRandomElements(numElements);
  
  // Create mole ratios with varying complexity based on problem type
  const moleRatios = [];
  for (let i = 0; i < numElements; i++) {
    if (problemType === 0) {
      // Basic: Simple small integers (1-3)
      moleRatios.push(Math.floor(Math.random() * 3) + 1);
    } else if (problemType === 1) {
      // Intermediate: Medium integers (1-5)
      moleRatios.push(Math.floor(Math.random() * 5) + 1);
    } else if (problemType === 2) {
      // Advanced: Larger integers (1-8)
      moleRatios.push(Math.floor(Math.random() * 8) + 1);
    } else {
      // Challenging: Mix of small and large (1-10)
      moleRatios.push(Math.floor(Math.random() * 10) + 1);
    }
  }
  
  // For organic compounds, adjust ratios to be more realistic
  if (elements.some(el => el.symbol === 'C') && 
      elements.some(el => el.symbol === 'H')) {
    // Common organic patterns have higher H:C ratios
    const cIndex = elements.findIndex(el => el.symbol === 'C');
    const hIndex = elements.findIndex(el => el.symbol === 'H');
    if (cIndex !== -1 && hIndex !== -1) {
      // Adjust hydrogen to be 2-4x carbon for realism
      moleRatios[hIndex] = moleRatios[cIndex] * (Math.floor(Math.random() * 3) + 2);
    }
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
  
  // Order elements in conventional order for chemical formulas
  // Generally: C, H, then alphabetical for others (with some exceptions)
  const orderedIndices = [...Array(numElements).keys()].sort((a, b) => {
    // Carbon first
    if (elements[a].symbol === 'C') return -1;
    if (elements[b].symbol === 'C') return 1;
    // Hydrogen second
    if (elements[a].symbol === 'H') return -1;
    if (elements[b].symbol === 'H') return 1;
    // Oxygen comes before other elements
    if (elements[a].symbol === 'O') return -1;
    if (elements[b].symbol === 'O') return 1;
    // Alphabetical for the rest
    return elements[a].symbol.localeCompare(elements[b].symbol);
  });
  
  // Build empirical formula string with proper element ordering
  let empirical = '';
  for (const i of orderedIndices) {
    empirical += elements[i].symbol;
    if (empiricalRatios[i] > 1) {
      empirical += empiricalRatios[i]; // Will be converted to subscript later
    }
  }
  
  // Determine molecular formula multiplier with more variety
  let molecularMultiplier;
  if (problemType <= 1) {
    // Basic/Intermediate: Simple multipliers (1-4)
    molecularMultiplier = Math.floor(Math.random() * 4) + 1;
  } else if (problemType === 2) {
    // Advanced: Larger multipliers (2-6)
    molecularMultiplier = Math.floor(Math.random() * 5) + 2;
  } else {
    // Challenging: Wide range (1-8)
    molecularMultiplier = Math.floor(Math.random() * 8) + 1;
  }
  
  // Build molecular formula string with proper ordering
  let molecular = '';
  for (const i of orderedIndices) {
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
    molecularMultiplier,
    orderedIndices, // Include for reference in feedback
    problemType    // Include for potential difficulty-based feedback
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

export default function EmpiricalMolecularFormulaActivity({ onBack, savedState, setSavedState }) {
  // PropTypes are defined at the end of this file
  // Add difficulty selection state - consistent with other activities
  const [selectedDifficulty, setSelectedDifficulty] = useState(savedState?.selectedDifficulty || 0);
  
  const [problem, setProblem] = useState(generateEmpiricalProblem(selectedDifficulty));
  const [empiricalInput, setEmpiricalInput] = useState('');
  const [molecularInput, setMolecularInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Helper function to identify compound types for educational feedback
  const getCompoundType = (elements) => {
    // Check if it's an organic compound
    if (elements.some(el => el.symbol === 'C') && elements.some(el => el.symbol === 'H')) {
      if (elements.some(el => el.symbol === 'O')) {
        return 'organic oxygen-containing';
      }
      return 'organic hydrocarbon';
    }
    
    // Check if it's an ionic compound (metal + nonmetal)
    const hasMetal = elements.some(el => ['alkali', 'alkaline', 'transition', 'metal'].includes(el.category));
    const hasNonmetal = elements.some(el => ['nonmetal', 'halogen'].includes(el.category));
    if (hasMetal && hasNonmetal) {
      return 'ionic';
    }
    
    // Check if it's an acid
    if (elements.some(el => el.symbol === 'H') && elements.some(el => ['F', 'Cl', 'Br', 'I'].includes(el.symbol))) {
      return 'acid';
    }
    
    // Check if it's an oxide
    if (elements.some(el => el.symbol === 'O') && elements.length === 2) {
      return 'oxide';
    }
    
    return 'molecular';
  };

  const handleCheck = () => {
    // Parse user input and compare with correct answers
    const normalizedEmpInput = normalizeFormula(empiricalInput);
    const normalizedMolInput = normalizeFormula(molecularInput);
    const correctEmpFormula = normalizeFormula(problem.empirical);
    const correctMolFormula = normalizeFormula(problem.molecular);
    
    const correctEmp = normalizedEmpInput === correctEmpFormula;
    const correctMol = normalizedMolInput === correctMolFormula;
    
    if (correctEmp && correctMol) {
      // Enhanced success feedback based on problem type
      let successMsg = 'Correct! Well done. Both formulas are right.';
      
      // Add educational information based on problem difficulty
      // Enhanced success messages based on difficulty level
      if (problem.problemType === 0) {
        successMsg += `\n\nExcellent work on this basic formula problem! You've shown a good understanding of empirical and molecular formulas.`;
      } else if (problem.problemType === 1) {
        successMsg += `\n\nGreat job on this intermediate-level problem! You've demonstrated solid understanding of how to calculate empirical and molecular formulas.`;
      } else if (problem.problemType === 2) {
        successMsg += `\n\nWell done solving this advanced formula problem! Your understanding of the relationship between empirical and molecular formulas is excellent.`;
      } else {
        successMsg += `\n\nOutstanding work on this challenging problem! You've mastered the concepts of empirical and molecular formulas at a high level.`;
      }
      
      // Add compound-specific information
      const compoundType = getCompoundType(problem.elements);
      successMsg += `

You correctly identified the ${compoundType} compound with empirical formula ${toSubscript(problem.empirical)} and molecular formula ${toSubscript(problem.molecular)}.`;
      
      setFeedback({ 
        correct: true, 
        message: successMsg 
      });
    } else {
      // Enhanced educational feedback message based on problem type
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
      
      // Add standard correction information with difficulty-specific guidance
      feedbackMsg += `Empirical formula: ${toSubscript(problem.empirical)}
`;
      feedbackMsg += `Molecular formula: ${toSubscript(problem.molecular)}
`;
      feedbackMsg += `Empirical mass: ${problem.empiricalMass} g/mol
`;
      feedbackMsg += `Molecular mass: ${problem.molecularMass} g/mol

`;
      
      // Add difficulty-specific educational guidance
      if (problem.problemType === 0) {
        feedbackMsg += `Basic level hint: Remember to convert mass percentages to moles by dividing by atomic mass, then find the simplest whole-number ratio.

`;
      } else if (problem.problemType === 1) {
        feedbackMsg += `Intermediate level hint: After finding the mole ratio for each element, make sure to divide by the smallest value to get the simplest ratio.

`;
      } else if (problem.problemType === 2) {
        feedbackMsg += `Advanced level hint: Be sure to carefully calculate the n-value (molecular/empirical mass ratio) and round to the nearest whole number when determining the molecular formula.

`;
      } else {
        feedbackMsg += `Challenging level hint: For complex compounds, pay close attention to precision in your calculations. Small rounding errors can lead to incorrect formulas.

`;
      }
      
      // Add educational relationship explanation
      feedbackMsg += `The molecular formula (${toSubscript(problem.molecular)}) is ${problem.molecularMultiplier} times the empirical formula (${toSubscript(problem.empirical)}).

`;
      
      // Add problem-specific tips
      if (problem.molecularMultiplier > 1) {
        feedbackMsg += `Remember: To find the molecular formula, multiply the empirical formula by ${problem.molecularMultiplier}.
`;
        feedbackMsg += `This multiplier can be found by dividing the molecular mass (${problem.molecularMass} g/mol) by the empirical mass (${problem.empiricalMass} g/mol).
`;
      }
      
      setFeedback({
        correct: false,
        message: feedbackMsg
      });
    }
  };

  // Handle difficulty change
  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    // Reset the current activity state
    setProblem(generateEmpiricalProblem(level));
    setEmpiricalInput('');
    setMolecularInput('');
    setFeedback(null);
    // Save difficulty preference
    if (setSavedState) {
      setSavedState({
        ...savedState,
        selectedDifficulty: level,
      });
    }
  };

  const handleNext = () => {
    setProblem(generateEmpiricalProblem(selectedDifficulty));
    setEmpiricalInput('');
    setMolecularInput('');
    setFeedback(null);
  };

  // Helper function to get difficulty text
  const getDifficultyText = (level) => {
    switch(level) {
      case 0: return 'Basic';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      case 3: return 'Challenging';
      default: return 'Intermediate';
    }
  };

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Empirical & Molecular Formula</h2>
        
        {/* Difficulty selector - consistent with other activities */}
        <div className="difficulty-selector" style={{ marginBottom: 15, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: '0.95em', color: '#23234a' }}>Select Difficulty Level:</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[0, 1, 2, 3].map(level => (
              <button 
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={selectedDifficulty === level ? 'selected-difficulty' : ''}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: selectedDifficulty === level ? '#4f46e5' : '#e5e7eb',
                  color: selectedDifficulty === level ? 'white' : '#4b5563',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  flex: 1,
                  minWidth: '80px',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {getDifficultyText(level)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Difficulty indicator */}
        <div style={{
          display: 'inline-block',
          background: problem.problemType === 0 ? '#4ade80' : 
                     problem.problemType === 1 ? '#60a5fa' : 
                     problem.problemType === 2 ? '#a78bfa' : '#f87171',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.85em',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {getDifficultyText(problem.problemType)}
        </div>
        
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
          
          {/* Compound type hint for educational value */}
          <div style={{
            background: '#f3f4f6',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            marginTop: '8px',
            color: '#4b5563'
          }}>
            <strong>Hint:</strong> This is a {getCompoundType(problem.elements)} compound.
          </div>
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

EmpiricalMolecularFormulaActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func
};
