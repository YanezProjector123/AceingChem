import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

function getRandomProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);

  // Charles's Law: V1/T1 = V2/T2
  // Randomly select which variable to solve for: V1, T1, V2, or T2
  const variables = ['V1', 'T1', 'V2', 'T2'];
  
  // Generate random values based on difficulty level
  let V1, T1, V2, T2;
  let solveFor;
  
  // For basic problems, only solve for V2 or T2 (simpler conceptually)
  if (problemType === 0) {
    solveFor = Math.random() < 0.5 ? 'V2' : 'T2';
    
    // Basic: Simple numbers with 1 decimal place or whole numbers, easier calculations
    V1 = +(Math.random() * 10 + 1).toFixed(0); // 1-11 L (whole numbers)
    T1 = +(Math.random() * 50 + 273).toFixed(0); // 273-323 K (whole numbers)
    
    // Make one of V2 or T2 a nice round number to simplify calculations
    if (solveFor === 'V2') {
      T2 = +(Math.random() * 50 + 273).toFixed(0); // Whole number
      V2 = (V1 * T2) / T1; // Will be calculated, not used for the problem
    } else { // solving for T2
      V2 = +(Math.random() * 10 + 1).toFixed(0);
      T2 = (V2 * T1) / V1; // Will be calculated, not used for the problem
    }
  } 
  else if (problemType === 1) {
    // Intermediate: Allow solving for any variable
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    
    // Intermediate: Moderate complexity, 1-2 decimal places
    V1 = +(Math.random() * 20 + 1).toFixed(1); // 1.0-21.0 L
    T1 = +(Math.random() * 100 + 273).toFixed(1); // 273.0-373.0 K
    V2 = +(Math.random() * 20 + 1).toFixed(1); // 1.0-21.0 L
    T2 = +(Math.random() * 100 + 273).toFixed(1); // 273.0-373.0 K
  } 
  else if (problemType === 2) {
    // Advanced: More challenging values with wider ranges
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    V1 = +(Math.random() * 30 + 0.5).toFixed(2); // 0.50-30.50 L
    T1 = +(Math.random() * 200 + 200).toFixed(1); // 200.0-400.0 K
    V2 = +(Math.random() * 30 + 0.5).toFixed(2); // 0.50-30.50 L
    T2 = +(Math.random() * 200 + 200).toFixed(1); // 200.0-400.0 K
  } 
  else { // Challenging
    // Could include values in different units that require conversion
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    V1 = +(Math.random() * 50 + 0.1).toFixed(3); // 0.100-50.100 L
    T1 = +(Math.random() * 300 + 100).toFixed(2); // 100.00-400.00 K
    V2 = +(Math.random() * 50 + 0.1).toFixed(3); // 0.100-50.100 L
    T2 = +(Math.random() * 300 + 100).toFixed(2); // 100.00-400.00 K
  }

  // Adjust the values to ensure the formula V1/T1 = V2/T2 holds
  // This ensures that for the variable we're solving for, we get a correct value
  switch (solveFor) {
    case 'V1':
      V1 = (V2 * T1) / T2;
      break;
    case 'T1':
      T1 = (V1 * T2) / V2;
      break;
    case 'V2':
      V2 = (V1 * T2) / T1;
      break;
    case 'T2':
      T2 = (V2 * T1) / V1;
      break;
    default:
      break;
  }
  
  // Educational context for higher difficulties
  let extraContext = '';
  if (problemType >= 2) {
    const contexts = [
      'In a temperature-controlled experiment,',
      'During a gas expansion process,',
      'For a closed system under constant pressure,',
      'In a thermal expansion study,',
      'For a gas sample in a fixed-pressure environment,'
    ];
    extraContext = contexts[Math.floor(Math.random() * contexts.length)] + ' ';
  }

  // Create the question and answer
  let question, answer, units;
  switch (solveFor) {
    case 'V1':
      answer = (V2 * T1) / T2;
      question = `${extraContext}Given T1 = ${T1} K, V2 = ${V2} L, T2 = ${T2} K, what is the initial volume (V1) in L?`;
      units = 'L';
      break;
    case 'T1':
      answer = (V1 * T2) / V2;
      question = `${extraContext}Given V1 = ${V1} L, V2 = ${V2} L, T2 = ${T2} K, what is the initial temperature (T1) in K?`;
      units = 'K';
      break;
    case 'V2':
      answer = (V1 * T2) / T1;
      question = `${extraContext}Given V1 = ${V1} L, T1 = ${T1} K, T2 = ${T2} K, what is the final volume (V2) in L?`;
      units = 'L';
      break;
    case 'T2':
      answer = (V2 * T1) / V1;
      question = `${extraContext}Given V1 = ${V1} L, T1 = ${T1} K, V2 = ${V2} L, what is the final temperature (T2) in K?`;
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
    values: { V1, T1, V2, T2 },
    problemType // Include difficulty level
  };
}

function round(val, decimals=3) {
  return +val.toFixed(decimals);
}

function getFeedback(solveFor, userAnswer, correctAnswer, values) {
  const tolerance = 0.01;
  if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
    return { correct: true, message: 'Correct! Well done.' };
  }
  let steps = [];
  steps.push('V1/T1 = V2/T2');
  switch (solveFor) {
    case 'V1':
      steps.push('V1 = (V2 × T1) / T2');
      steps.push(`V1 = (${values.V2} × ${values.T1}) / ${values.T2}`);
      steps.push(`V1 = ${(values.V2 * values.T1 / values.T2).toFixed(3)} L`);
      break;
    case 'T1':
      steps.push('T1 = (V1 × T2) / V2');
      steps.push(`T1 = (${values.V1} × ${values.T2}) / ${values.V2}`);
      steps.push(`T1 = ${(values.V1 * values.T2 / values.V2).toFixed(3)} K`);
      break;
    case 'V2':
      steps.push('V2 = (V1 × T2) / T1');
      steps.push(`V2 = (${values.V1} × ${values.T2}) / ${values.T1}`);
      steps.push(`V2 = ${(values.V1 * values.T2 / values.T1).toFixed(3)} L`);
      break;
    case 'T2':
      steps.push('T2 = (V2 × T1) / V1');
      steps.push(`T2 = (${values.V2} × ${values.T1}) / ${values.V1}`);
      steps.push(`T2 = ${(values.V2 * values.T1 / values.V1).toFixed(3)} K`);
      break;
    default:
      break;
  }
  steps.push(`Your answer: ${userAnswer}`);
  steps.push(`Correct answer: ${correctAnswer}`);
  return {
    correct: false,
    message: (
      <div>
        <b>Not quite. Calculator steps:</b>
        <ol style={{textAlign:'left'}}>
          {steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
        <div style={{marginTop:'0.5em'}}>Check each algebraic and calculation step above.</div>
      </div>
    )
  };
}

function CharlesLawActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
  const [problem, setProblem] = useState(() => getRandomProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) {
      setFeedback({ correct: false, message: 'Please enter a valid number.' });
      return;
    }
    const fb = getFeedback(problem.solveFor, parsed, problem.answer, problem.values);
    setFeedback(fb);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setProblem(getRandomProblem());
    setUserAnswer('');
    setFeedback(null);
    setShowAnswer(false);
  };

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Charles's Law Practice</h2>
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

CharlesLawActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

export default CharlesLawActivity;
