import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

const R = 0.0821; // Ideal gas constant in L·atm/(mol·K)

function getRandomProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
  
  // Randomly decide which variable to solve for
  const variables = ['P', 'V', 'n', 'T'];
  
  // For basic difficulty, only solve for P or V which are conceptually easier
  // For higher difficulties, include more complex variables
  let variablesToUse;
  if (problemType === 0) {
    variablesToUse = ['P', 'V']; // Basic: Just pressure and volume
  } else if (problemType === 1) {
    variablesToUse = ['P', 'V', 'n']; // Intermediate: Add moles
  } else {
    variablesToUse = variables; // Advanced/Challenging: All variables
  }
  
  const solveFor = variablesToUse[Math.floor(Math.random() * variablesToUse.length)];

  // Generate random values based on difficulty
  let P, V, n, T;
  
  // Basic: Simple 'nice' numbers, easier calculations
  // Intermediate: Moderate complexity
  // Advanced: More challenging values
  // Challenging: Complex values, potential unit conversions needed mentally
  
  if (problemType === 0) { // Basic
    P = +(Math.random() * 2 + 1).toFixed(1); // 1.0-3.0 atm, 1 decimal place
    V = +(Math.random() * 10 + 1).toFixed(1); // 1.0-11.0 L, 1 decimal place
    n = +(Math.random() * 2 + 1).toFixed(1); // 1.0-3.0 mol, 1 decimal place
    T = +(Math.random() * 100 + 273).toFixed(0); // 273-373 K, whole numbers
  } 
  else if (problemType === 1) { // Intermediate
    P = +(Math.random() * 3 + 1).toFixed(2); // 1.00-4.00 atm, 2 decimal places
    V = +(Math.random() * 20 + 1).toFixed(2); // 1.00-21.00 L, 2 decimal places
    n = +(Math.random() * 3 + 0.5).toFixed(2); // 0.50-3.50 mol, 2 decimal places
    T = +(Math.random() * 200 + 273).toFixed(1); // 273.0-473.0 K, 1 decimal place
  } 
  else if (problemType === 2) { // Advanced
    P = +(Math.random() * 5 + 0.5).toFixed(2); // 0.50-5.50 atm, 2 decimal places
    V = +(Math.random() * 30 + 0.5).toFixed(2); // 0.50-30.50 L, 2 decimal places
    n = +(Math.random() * 5 + 0.1).toFixed(2); // 0.10-5.10 mol, 2 decimal places
    T = +(Math.random() * 400 + 200).toFixed(1); // 200.0-600.0 K, 1 decimal place
  } 
  else { // Challenging
    P = +(Math.random() * 10 + 0.1).toFixed(3); // 0.100-10.100 atm, 3 decimal places
    V = +(Math.random() * 50 + 0.1).toFixed(3); // 0.100-50.100 L, 3 decimal places
    n = +(Math.random() * 10 + 0.01).toFixed(3); // 0.010-10.010 mol, 3 decimal places
    T = +(Math.random() * 600 + 100).toFixed(2); // 100.00-700.00 K, 2 decimal places
  }

  // Modified question phrasing based on difficulty
  let question, answer, units;
  let extraContext = '';
  
  // Add educational context for higher difficulties
  if (problemType >= 2) {
    const contexts = [
      'In a laboratory experiment,',
      'During a chemical reaction,',
      'In an industrial process,',
      'For a gas sample in a sealed container,',
      'In a gas chromatography analysis,'
    ];
    extraContext = contexts[Math.floor(Math.random() * contexts.length)] + ' ';
  }
  
  switch (solveFor) {
    case 'P':
      answer = (n * R * T / V);
      question = `${extraContext}Given n = ${n} mol, V = ${V} L, T = ${T} K, what is the pressure (P) in atm?`;
      units = 'atm';
      break;
    case 'V':
      answer = (n * R * T / P);
      question = `${extraContext}Given n = ${n} mol, P = ${P} atm, T = ${T} K, what is the volume (V) in L?`;
      units = 'L';
      break;
    case 'n':
      answer = (P * V / (R * T));
      question = `${extraContext}Given P = ${P} atm, V = ${V} L, T = ${T} K, what is the number of moles (n)?`;
      units = 'mol';
      break;
    case 'T':
      answer = (P * V / (n * R));
      question = `${extraContext}Given P = ${P} atm, V = ${V} L, n = ${n} mol, what is the temperature (T) in K?`;
      units = 'K';
      break;
    default:
      break;
  }
  
  // Calculate precision for answer based on difficulty
  const decimalPlaces = problemType === 0 ? 2 : (problemType === 1 ? 3 : 4);
  
  return {
    solveFor,
    question,
    answer: +answer.toFixed(decimalPlaces),
    units,
    values: { P, V, n, T },
    problemType // Include difficulty level
  };
}

function round(val, decimals=3) {
  return +val.toFixed(decimals);
}

function getFeedback(solveFor, userAnswer, correctAnswer, values, problemType) {
  // Adjust tolerance based on difficulty level
  const tolerance = problemType === 0 ? 0.02 : // More forgiving for Basic
                   problemType === 1 ? 0.01 : // Standard for Intermediate
                   problemType === 2 ? 0.005 : // Stricter for Advanced
                   0.002; // Very strict for Challenging
  
  if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
    // Success message with difficulty-appropriate feedback
    let successMsg = 'Correct! Well done.';
    
    // Add extra praise for higher difficulties
    if (problemType >= 2) {
      successMsg += ` Great job solving this ${problemType === 3 ? 'challenging' : 'advanced'} problem!`;
    }
    
    return { correct: true, message: successMsg };
  }
  
  // Enhanced step-by-step solution with more educational content
  let steps = [];
  steps.push('Ideal Gas Law: PV = nRT');
  
  // Add educational note for higher difficulties
  if (problemType >= 1) {
    steps.push(`Where: P = pressure (atm), V = volume (L), n = moles, R = ${R} L·atm/(mol·K), T = temperature (K)`);
  }
  
  // Rearrangement and calculation steps
  switch (solveFor) {
    case 'P':
      steps.push('Rearrange to solve for P: P = (nRT) / V');
      steps.push(`P = (${values.n} × ${R} × ${values.T}) / ${values.V}`);
      // More detailed intermediate steps for basic difficulty
      if (problemType === 0) {
        const nRT = (values.n * R * values.T).toFixed(4);
        steps.push(`P = ${nRT} / ${values.V}`);
      }
      steps.push(`P = ${((values.n * R * values.T) / values.V).toFixed(problemType+2)} atm`);
      break;
    case 'V':
      steps.push('Rearrange to solve for V: V = (nRT) / P');
      steps.push(`V = (${values.n} × ${R} × ${values.T}) / ${values.P}`);
      if (problemType === 0) {
        const nRT = (values.n * R * values.T).toFixed(4);
        steps.push(`V = ${nRT} / ${values.P}`);
      }
      steps.push(`V = ${((values.n * R * values.T) / values.P).toFixed(problemType+2)} L`);
      break;
    case 'n':
      steps.push('Rearrange to solve for n: n = (PV) / (RT)');
      steps.push(`n = (${values.P} × ${values.V}) / (${R} × ${values.T})`);
      if (problemType === 0) {
        const PV = (values.P * values.V).toFixed(4);
        const RT = (R * values.T).toFixed(4);
        steps.push(`n = ${PV} / ${RT}`);
      }
      steps.push(`n = ${(values.P * values.V / (R * values.T)).toFixed(problemType+2)} mol`);
      break;
    case 'T':
      steps.push('Rearrange to solve for T: T = (PV) / (nR)');
      steps.push(`T = (${values.P} × ${values.V}) / (${values.n} × ${R})`);
      if (problemType === 0) {
        const PV = (values.P * values.V).toFixed(4);
        const nR = (values.n * R).toFixed(4);
        steps.push(`T = ${PV} / ${nR}`);
      }
      steps.push(`T = ${(values.P * values.V / (values.n * R)).toFixed(problemType+2)} K`);
      break;
    default:
      break;
  }
  
  // Add explanation about the error
  const error = Math.abs(userAnswer - correctAnswer);
  const errorPercentage = (error / correctAnswer * 100).toFixed(2);
  
  steps.push(`Your answer: ${userAnswer}`);
  steps.push(`Correct answer: ${correctAnswer}`);
  
  // For higher difficulties, add more detailed error analysis
  if (problemType >= 1) {
    steps.push(`Difference: ${error.toFixed(4)} (${errorPercentage}% off)`);
  }
  
  // Add additional tips based on the size and direction of the error
  let tipMessage = '';
  if (userAnswer > correctAnswer * 1.5) {
    tipMessage = 'Your answer is significantly too large. Check your unit conversions and calculations carefully.';
  } else if (userAnswer < correctAnswer * 0.5) {
    tipMessage = 'Your answer is significantly too small. Check your unit conversions and calculations carefully.';
  } else if (userAnswer > correctAnswer) {
    tipMessage = 'Your answer is a bit too large. Double-check your arithmetic.';
  } else {
    tipMessage = 'Your answer is a bit too small. Double-check your arithmetic.';
  }
  
  return {
    correct: false,
    message: (
      <div>
        <b>Not quite. Let's work through this step-by-step:</b>
        <ol style={{textAlign:'left', lineHeight: '1.5'}}>
          {steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
        <div style={{marginTop:'0.8em', fontStyle: 'italic'}}>{tipMessage}</div>
        <div style={{marginTop:'0.5em'}}>Check each algebraic and calculation step above.</div>
      </div>
    )
  };
}

// Helper function to get difficulty text - matches implementation in EmpiricalMolecularFormulaActivity
function getDifficultyText(level) {
  switch(level) {
    case 0: return 'Basic';
    case 1: return 'Intermediate';
    case 2: return 'Advanced';
    case 3: return 'Challenging';
    default: return 'Intermediate';
  }
}

function IdealGasActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
  const [problem, setProblem] = useState(() => getRandomProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // State to track selected difficulty level
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) {
      setFeedback({ correct: false, message: 'Please enter a valid number.' });
      return;
    }
    const fb = getFeedback(problem.solveFor, parsed, problem.answer, problem.values, problem.problemType);
    setFeedback(fb);
    setShowAnswer(true);
  };

  const handleNext = () => {
    // Use the selected difficulty if user has chosen one, otherwise random
    setProblem(getRandomProblem(selectedDifficulty));
    setUserAnswer('');
    setFeedback(null);
    setShowAnswer(false);
  };
  
  // Handle difficulty selection
  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    setProblem(getRandomProblem(level));
    setUserAnswer('');
    setFeedback(null);
    setShowAnswer(false);
  };

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Ideal Gas Law Practice</h2>
        
        {/* Difficulty selector */}
        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Difficulty Level:</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2, 3].map(level => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                style={{
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  background: selectedDifficulty === level || (selectedDifficulty === null && problem.problemType === level) ?
                    (level === 0 ? '#4ade80' : level === 1 ? '#60a5fa' : level === 2 ? '#f59e0b' : '#ef4444') :
                    '#e5e7eb',
                  color: selectedDifficulty === level || (selectedDifficulty === null && problem.problemType === level) ? 'white' : '#4b5563',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {getDifficultyText(level)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Current difficulty indicator */}
        <div style={{
          display: 'inline-block',
          background: problem.problemType === 0 ? '#4ade80' : 
                     problem.problemType === 1 ? '#60a5fa' : 
                     problem.problemType === 2 ? '#f59e0b' : 
                     '#ef4444',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          padding: '2px 8px',
          borderRadius: '4px',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {getDifficultyText(problem.problemType)}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 12px 0' }}>
          <button className="activity-btn" type="button" onClick={onShowPeriodicTable}>
            Periodic Table
          </button>
        </div>
        <div className="question-area">
          <p className="question-text" style={{ fontSize: '1.15em' }}>{problem.question}</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <input
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder={`Your answer (${problem.units})`}
            className="activity-input"
            style={{ margin: '10px 0 20px 0' }}
            disabled={showAnswer}
            step="any"
          />
          {feedback && (
            <div className={`feedback-container feedback-${feedback.correct ? 'correct' : 'incorrect'}`}>{feedback.message}</div>
          )}
          <div className="button-row">
            {!showAnswer && (
              <button type="submit" className="activity-btn" disabled={!userAnswer}>Check Answer</button>
            )}
            {showAnswer && (
              <button type="button" className="activity-btn" onClick={handleNext}>Next</button>
            )}
            <button type="button" className="back-btn" onClick={onBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

IdealGasActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

export default IdealGasActivity;
