import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

function getRandomProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
  
  // Boyle's Law: P1V1 = P2V2
  // Randomly select which variable to solve for: P1, V1, P2, or V2
  const variables = ['P1', 'V1', 'P2', 'V2'];
  
  // Generate random values based on difficulty level
  let P1, V1, P2, V2;
  let solveFor;
  
  // For basic problems, only solve for P2 or V2 (simpler conceptually)
  if (problemType === 0) {
    solveFor = Math.random() < 0.5 ? 'P2' : 'V2';
    
    // Basic: Simple numbers with 1 decimal point, easier calculations
    P1 = +(Math.random() * 2 + 1).toFixed(1); // 1.0-3.0 atm
    V1 = +(Math.random() * 10 + 1).toFixed(0); // 1-11 L (whole numbers)
    
    // Make one of P2 or V2 a nice round number to simplify calculations
    if (solveFor === 'P2') {
      V2 = +(Math.random() * 10 + 1).toFixed(0); // Whole number
      P2 = (P1 * V1) / V2; // Will be calculated, not used for the problem
    } else { // solving for V2
      P2 = +(Math.random() * 2 + 1).toFixed(1);
      V2 = (P1 * V1) / P2; // Will be calculated, not used for the problem
    }
  } 
  else if (problemType === 1) {
    // Intermediate: Allow solving for any variable
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    
    // Intermediate: Moderate complexity, 2 decimal places
    P1 = +(Math.random() * 3 + 1).toFixed(2); // 1.00-4.00 atm
    V1 = +(Math.random() * 20 + 1).toFixed(1); // 1.0-21.0 L
    P2 = +(Math.random() * 3 + 1).toFixed(2); // 1.00-4.00 atm
    V2 = +(Math.random() * 20 + 1).toFixed(1); // 1.0-21.0 L
  } 
  else if (problemType === 2) {
    // Advanced: More challenging values with wider ranges
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    P1 = +(Math.random() * 5 + 0.5).toFixed(2); // 0.50-5.50 atm
    V1 = +(Math.random() * 30 + 0.5).toFixed(2); // 0.50-30.50 L
    P2 = +(Math.random() * 5 + 0.5).toFixed(2); // 0.50-5.50 atm
    V2 = +(Math.random() * 30 + 0.5).toFixed(2); // 0.50-30.50 L
  } 
  else { // Challenging
    // Could include values in different units that require conversion
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    P1 = +(Math.random() * 10 + 0.1).toFixed(3); // 0.100-10.100 atm
    V1 = +(Math.random() * 50 + 0.1).toFixed(3); // 0.100-50.100 L
    P2 = +(Math.random() * 10 + 0.1).toFixed(3); // 0.100-10.100 atm
    V2 = +(Math.random() * 50 + 0.1).toFixed(3); // 0.100-50.100 L
  }

  // Adjust the values to ensure the formula P1V1 = P2V2 holds
  // This ensures that for the variable we're solving for, we get a correct value
  switch (solveFor) {
    case 'P1':
      P1 = (P2 * V2) / V1;
      break;
    case 'V1':
      V1 = (P2 * V2) / P1;
      break;
    case 'P2':
      P2 = (P1 * V1) / V2;
      break;
    case 'V2':
      V2 = (P1 * V1) / P2;
      break;
    default:
      break;
  }
  
  // Educational context for higher difficulties
  let extraContext = '';
  if (problemType >= 2) {
    const contexts = [
      'In a gas compression experiment,',
      'During an isothermal process,',
      'In a pneumatic system,',
      'For a gas sample at constant temperature,',
      'In a piston-cylinder apparatus,'
    ];
    extraContext = contexts[Math.floor(Math.random() * contexts.length)] + ' ';
  }

  // Create the question and answer
  let question, answer, units;
  switch (solveFor) {
    case 'P1':
      answer = (P2 * V2) / V1;
      question = `${extraContext}Given V1 = ${V1} L, P2 = ${P2} atm, V2 = ${V2} L, what is the initial pressure (P1) in atm?`;
      units = 'atm';
      break;
    case 'V1':
      answer = (P2 * V2) / P1;
      question = `${extraContext}Given P1 = ${P1} atm, P2 = ${P2} atm, V2 = ${V2} L, what is the initial volume (V1) in L?`;
      units = 'L';
      break;
    case 'P2':
      answer = (P1 * V1) / V2;
      question = `${extraContext}Given P1 = ${P1} atm, V1 = ${V1} L, V2 = ${V2} L, what is the final pressure (P2) in atm?`;
      units = 'atm';
      break;
    case 'V2':
      answer = (P1 * V1) / P2;
      question = `${extraContext}Given P1 = ${P1} atm, V1 = ${V1} L, P2 = ${P2} atm, what is the final volume (V2) in L?`;
      units = 'L';
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
    values: { P1, V1, P2, V2 },
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
  steps.push("Boyle's Law: P₁V₁ = P₂V₂");
  
  // Add educational note for higher difficulties
  if (problemType >= 1) {
    steps.push("For a gas at constant temperature, pressure and volume are inversely proportional.");
  }
  
  // Rearrangement and calculation steps
  switch (solveFor) {
    case 'P1':
      steps.push('Rearrange to solve for P₁: P₁ = (P₂ × V₂) / V₁');
      steps.push(`P₁ = (${values.P2} × ${values.V2}) / ${values.V1}`);
      // More detailed intermediate steps for basic difficulty
      if (problemType === 0) {
        const P2V2 = (values.P2 * values.V2).toFixed(4);
        steps.push(`P₁ = ${P2V2} / ${values.V1}`);
      }
      steps.push(`P₁ = ${(values.P2 * values.V2 / values.V1).toFixed(problemType+2)} atm`);
      break;
    case 'V1':
      steps.push('Rearrange to solve for V₁: V₁ = (P₂ × V₂) / P₁');
      steps.push(`V₁ = (${values.P2} × ${values.V2}) / ${values.P1}`);
      if (problemType === 0) {
        const P2V2 = (values.P2 * values.V2).toFixed(4);
        steps.push(`V₁ = ${P2V2} / ${values.P1}`);
      }
      steps.push(`V₁ = ${(values.P2 * values.V2 / values.P1).toFixed(problemType+2)} L`);
      break;
    case 'P2':
      steps.push('Rearrange to solve for P₂: P₂ = (P₁ × V₁) / V₂');
      steps.push(`P₂ = (${values.P1} × ${values.V1}) / ${values.V2}`);
      if (problemType === 0) {
        const P1V1 = (values.P1 * values.V1).toFixed(4);
        steps.push(`P₂ = ${P1V1} / ${values.V2}`);
      }
      steps.push(`P₂ = ${(values.P1 * values.V1 / values.V2).toFixed(problemType+2)} atm`);
      break;
    case 'V2':
      steps.push('Rearrange to solve for V₂: V₂ = (P₁ × V₁) / P₂');
      steps.push(`V₂ = (${values.P1} × ${values.V1}) / ${values.P2}`);
      if (problemType === 0) {
        const P1V1 = (values.P1 * values.V1).toFixed(4);
        steps.push(`V₂ = ${P1V1} / ${values.P2}`);
      }
      steps.push(`V₂ = ${(values.P1 * values.V1 / values.P2).toFixed(problemType+2)} L`);
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
  
  // Add additional educational content for higher difficulties
  if (problemType >= 2) {
    steps.push("Remember: Boyle's Law only applies under constant temperature conditions.");
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

function BoylesLawActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
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
        <h2 className="activity-title">Boyle's Law Practice</h2>
        
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
            Boyle's Law: P₁V₁ = P₂V₂
          </div>
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

BoylesLawActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

export default BoylesLawActivity;
