import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * DaltonLawActivity.js
 * Practice activity for Dalton's Law of Partial Pressures.
 * Supports random question generation for:
 *   - Finding total pressure from partials
 *   - Finding a missing partial pressure
 *   - Using mole fractions (optional, included for challenge)
 * UI/feedback matches established patterns (see IdealGasActivity.js, BoylesLawActivity.js).
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateDaltonProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
  
  // Types: total from partials, missing partial, mole fraction/partial
  // Adjust available problem types based on difficulty level
  let types = [];
  if (problemType === 0) {
    // Basic - only total pressure calculations
    types = ['total'];
  } else if (problemType === 1) {
    // Intermediate - total and missing partial
    types = ['total', 'missing'];
  } else {
    // Advanced/Challenging - all types including mole fraction
    types = ['total', 'missing', 'molefraction'];
  }
  
  const type = types[getRandomInt(0, types.length - 1)];
  let prompt = '', answer = 0, steps = [], partials = [], total = 0, missingIdx = 0, moleFractions = [], moles = [], whichGas = 0;
  let context = '';
  
  // Add scientific context for higher difficulties
  if (problemType >= 2) {
    const contexts = [
      'In a gas chromatography experiment, ',
      'During the analysis of a gas mixture, ',
      'In a sealed reaction vessel, ',
      'For a mixture of ideal gases, ',
      'When studying atmospheric composition, '
    ];
    context = contexts[getRandomInt(0, contexts.length - 1)];
  }

  // Adjust difficulty parameters
  let numGases, decimalPrecision, valueRange;
  
  switch(problemType) {
    case 0: // Basic
      numGases = getRandomInt(2, 3);
      decimalPrecision = 1;
      valueRange = { min: 0.5, max: 1.5 };
      break;
    case 1: // Intermediate
      numGases = getRandomInt(2, 4);
      decimalPrecision = 2;
      valueRange = { min: 0.4, max: 2.0 };
      break;
    case 2: // Advanced
      numGases = getRandomInt(3, 5);
      decimalPrecision = 2;
      valueRange = { min: 0.3, max: 2.5 };
      break;
    case 3: // Challenging
      numGases = getRandomInt(3, 6);
      decimalPrecision = 3;
      valueRange = { min: 0.25, max: 3.0 };
      break;
    default:
      numGases = getRandomInt(2, 4);
      decimalPrecision = 2;
      valueRange = { min: 0.4, max: 2.5 };
  }
  
  if (type === 'total') {
    // Find total given 2-4 partials (or more for higher difficulties)
    const n = numGases;
    partials = Array.from({length: n}, () => getRandomFloat(valueRange.min, valueRange.max, decimalPrecision));
    total = partials.reduce((a, b) => a + b, 0);
    
    // Create the prompt with appropriate wording based on difficulty
    if (problemType <= 1) {
      prompt = `${context}The partial pressures of ${n} gases in a mixture are ${partials.map((p,i) => `P${i+1} = ${p} atm`).join(', ')}. What is the total pressure (in atm)?`;
    } else {
      prompt = `${context}a gas mixture contains ${n} components with the following partial pressures: ${partials.map((p,i) => `P${i+1} = ${p} atm`).join(', ')}. Calculate the total pressure of the mixture in atmospheres.`;
    }
    
    answer = total;
    steps = [
      `Dalton's Law: P_total = sum of all partial pressures`,
      `Add all partial pressures: ${partials.map((p,i) => `P${i+1}`).join(' + ')} = ${partials.map(p => p.toFixed(decimalPrecision)).join(' + ')} = ${total.toFixed(decimalPrecision)} atm.`
    ];
  } else if (type === 'missing') {
    // Find a missing partial given total and others
    const n = numGases;
    partials = Array.from({length: n}, () => getRandomFloat(valueRange.min, valueRange.max, decimalPrecision));
    missingIdx = getRandomInt(0, n - 1);
    
    // For higher difficulties, make the missing value a bit harder to calculate
    let additionalValue;
    if (problemType <= 1) {
      additionalValue = getRandomFloat(valueRange.min, valueRange.max, decimalPrecision);
    } else {
      additionalValue = getRandomFloat(valueRange.min * 1.5, valueRange.max * 1.2, decimalPrecision);
    }
    
    total = partials.reduce((a, b) => a + b, 0) + additionalValue;
    const missingPartial = +(total - partials.reduce((a, b) => a + b, 0)).toFixed(decimalPrecision);
    
    if (problemType <= 1) {
      prompt = `${context}in a mixture, the total pressure is ${total.toFixed(decimalPrecision)} atm. The partial pressures of the other ${n} gases are ${partials.map((p,i) => `P${i+1} = ${p} atm`).join(', ')}. What is the partial pressure of the remaining gas (in atm)?`;
    } else {
      prompt = `${context}a gaseous mixture has a total pressure of ${total.toFixed(decimalPrecision)} atm. It contains ${n} gases with measured partial pressures of ${partials.map((p,i) => `P${i+1} = ${p} atm`).join(', ')}. Determine the partial pressure of the unidentified component in the mixture.`;
    }
    
    answer = missingPartial;
    steps = [
      `Dalton's Law: P_total = sum of all partial pressures`,
      `Rearrange to find missing partial: P_missing = P_total - sum of known partials`,
      `Add all known partial pressures: ${partials.map((p,i) => `P${i+1}`).join(' + ')} = ${partials.map(p => p.toFixed(decimalPrecision)).join(' + ')} = ${(partials.reduce((a, b) => a + b, 0)).toFixed(decimalPrecision)} atm.`,
      `Subtract from total: ${total.toFixed(decimalPrecision)} - ${(partials.reduce((a, b) => a + b, 0)).toFixed(decimalPrecision)} = ${missingPartial.toFixed(decimalPrecision)} atm.`
    ];
  } else {
    // Mole fraction type: find partial from mole fraction and total, or vice versa
    // Adjust complexity based on difficulty
    const n = problemType <= 1 ? 2 : getRandomInt(2, Math.min(4, problemType + 2));
    
    // For higher difficulties, use more complex mole ratios
    if (problemType <= 1) {
      moles = Array.from({length: n}, () => getRandomInt(1, 5));
    } else if (problemType === 2) {
      moles = Array.from({length: n}, () => getRandomFloat(0.5, 5, 1));
    } else {
      moles = Array.from({length: n}, () => getRandomFloat(0.2, 8, decimalPrecision));
    }
    
    total = getRandomFloat(valueRange.min * 2, valueRange.max * 1.5, decimalPrecision);
    whichGas = getRandomInt(0, n-1);
    const totalMoles = moles.reduce((a,b) => a+b, 0);
    moleFractions = moles.map(m => m/totalMoles);
    const pPartial = +(total * moleFractions[whichGas]).toFixed(decimalPrecision);
    
    if (problemType <= 1) {
      prompt = `${context}a mixture contains ${moles.map((m,i) => `${m} mol of gas ${String.fromCharCode(65+i)}`).join(', ')}. The total pressure is ${total} atm. What is the partial pressure of gas ${String.fromCharCode(65+whichGas)} (in atm)?`;
    } else {
      prompt = `${context}a gaseous mixture consists of ${moles.map((m,i) => `${m.toFixed(decimalPrecision)} mol of ${String.fromCharCode(65+i)}`).join(', ')}. Under conditions where the total pressure is ${total} atm, calculate the partial pressure exerted by ${String.fromCharCode(65+whichGas)} in atmospheres.`;
    }
    
    answer = pPartial;
    steps = [
      `Partial pressure can be calculated using: P_i = x_i × P_total (where x_i is the mole fraction)`,
      `Calculate total moles: ${moles.map(m => m.toFixed(decimalPrecision)).join(' + ')} = ${totalMoles.toFixed(decimalPrecision)} mol`,
      `Find mole fraction of gas ${String.fromCharCode(65+whichGas)}: x = moles / total moles = ${moles[whichGas].toFixed(decimalPrecision)} / ${totalMoles.toFixed(decimalPrecision)} = ${moleFractions[whichGas].toFixed(4)}`,
      `Calculate partial pressure: P_{${String.fromCharCode(65+whichGas)}} = ${moleFractions[whichGas].toFixed(4)} × ${total} = ${pPartial} atm.`
    ];
  }
  
  // Return with problem type for difficulty tracking
  return { prompt, answer, steps, problemType };
}

// Helper function to get difficulty text - consistent with other activities
function getDifficultyText(level) {
  switch(level) {
    case 0: return 'Basic';
    case 1: return 'Intermediate';
    case 2: return 'Advanced';
    case 3: return 'Challenging';
    default: return 'Intermediate';
  }
}

export default function DaltonLawActivity({ onBack, onShowPeriodicTable }) {
  const [problem, setProblem] = useState(() => generateDaltonProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  // State to track selected difficulty level
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const userVal = parseFloat(userAnswer);
    if (isNaN(userVal)) {
      setFeedback({ correct: false, message: 'Please enter a valid number.' });
      return;
    }
    
    // Adjust tolerance based on difficulty level
    const toleranceFactors = [0.08, 0.05, 0.03, 0.015]; // More lenient for basic, stricter for challenging
    const tolerance = toleranceFactors[problem.problemType || 1] * Math.abs(problem.answer);
    const correct = Math.abs(userVal - problem.answer) < tolerance;
    
    // Difficulty-specific success messages
    const successMessages = [
      'Correct! You have successfully applied Dalton\'s Law for a basic problem.',
      'Well done! Your calculation accurately applies the relationship between partial pressures.',
      'Excellent work! You have mastered the application of Dalton\'s Law for complex gas mixtures.',
      'Outstanding! You have correctly solved a challenging gas mixture problem.'
    ];
    
    setFeedback({
      correct,
      message: correct ? successMessages[problem.problemType || 1] : 'Not quite. See the steps below.',
      steps: problem.steps
    });
    setShowSteps(true);
  }

  function handleNext() {
    // Use the selected difficulty if user has chosen one, otherwise random
    setProblem(generateDaltonProblem(selectedDifficulty));
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }
  
  // Handler for difficulty selection
  function handleDifficultyChange(level) {
    setSelectedDifficulty(level);
    setProblem(generateDaltonProblem(level));
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Dalton's Law of Partial Pressures</h2>
        
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
          {getDifficultyText(problem.problemType || 1)}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 12px 0' }}>
          <button className="activity-btn" type="button" onClick={onShowPeriodicTable}>
            Periodic Table
          </button>
        </div>
        <div className="question-area">
          <p className="question-text" style={{ fontSize: '1.15em' }}>{problem.prompt}</p>
          
          {/* Law formula reminder - educational enhancement */}
          <div style={{
            background: '#f3f4f6',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            marginTop: '12px',
            color: '#4b5563',
            fontStyle: 'italic'
          }}>
            Dalton's Law: P₁ + P₂ + ... + Pₙ = Pₜₒₜₐₗ
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <input
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            className="activity-input"
            style={{ margin: '10px 0 20px 0' }}
            disabled={showSteps}
            step="any"
          />
          {feedback && (
            <div className={`feedback-container feedback-${feedback.correct ? 'correct' : 'incorrect'}`}>{feedback.message}</div>
          )}
          {feedback && showSteps && feedback.steps && (
            <div className="feedback-container feedback-steps">
              <b>Calculator steps:</b>
              <ol style={{textAlign:'left', margin:'0.7em 0 0 1.2em', padding:0}}>
                {feedback.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          )}
          <div className="button-row">
            {!showSteps && (
              <button type="submit" className="activity-btn" disabled={!userAnswer}>Check Answer</button>
            )}
            {showSteps && (
              <button type="button" className="activity-btn" onClick={handleNext}>Next</button>
            )}
            <button type="button" className="back-btn" onClick={onBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

DaltonLawActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired
};
