import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

// Combined Gas Law: (P1 * V1) / T1 = (P2 * V2) / T2
function getRandomProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);

  // Variables: P1, V1, T1, P2, V2, T2
  const variables = ['P1', 'V1', 'T1', 'P2', 'V2', 'T2'];
  let solveFor;
  
  // Generate random values based on difficulty level
  let P1, V1, T1, P2, V2, T2;
  
  if (problemType === 0) { // Basic
    // For basic problems, only solve for P2, V2, or T2 (simpler conceptually)
    solveFor = variables[Math.floor(Math.random() * 3) + 3]; // P2, V2, or T2
    
    // Basic: Simple whole numbers or 1 decimal place, easier calculations
    P1 = +(Math.random() * 2 + 1).toFixed(1); // 1.0-3.0 atm
    V1 = +(Math.random() * 10 + 1).toFixed(0); // 1-11 L (whole numbers)
    T1 = +(Math.random() * 50 + 273).toFixed(0); // 273-323 K (whole numbers)
    
    // Initialize with placeholder values that will be replaced
    P2 = +(Math.random() * 2 + 1).toFixed(1);
    V2 = +(Math.random() * 10 + 1).toFixed(0);
    T2 = +(Math.random() * 50 + 273).toFixed(0);
  } 
  else if (problemType === 1) { // Intermediate
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    
    // Moderate complexity with 1-2 decimal places
    P1 = +(Math.random() * 2 + 1).toFixed(1); // 1.0-3.0 atm
    V1 = +(Math.random() * 20 + 1).toFixed(1); // 1.0-21.0 L
    T1 = +(Math.random() * 100 + 200).toFixed(1); // 200.0-300.0 K
    P2 = +(Math.random() * 2 + 1).toFixed(1); // 1.0-3.0 atm
    V2 = +(Math.random() * 20 + 1).toFixed(1); // 1.0-21.0 L
    T2 = +(Math.random() * 100 + 200).toFixed(1); // 200.0-300.0 K
  } 
  else if (problemType === 2) { // Advanced
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    
    // More complex values with 2 decimal places and wider ranges
    P1 = +(Math.random() * 3 + 0.5).toFixed(2); // 0.50-3.50 atm
    V1 = +(Math.random() * 30 + 0.5).toFixed(2); // 0.50-30.50 L
    T1 = +(Math.random() * 150 + 200).toFixed(2); // 200.00-350.00 K
    P2 = +(Math.random() * 3 + 0.5).toFixed(2); // 0.50-3.50 atm
    V2 = +(Math.random() * 30 + 0.5).toFixed(2); // 0.50-30.50 L
    T2 = +(Math.random() * 150 + 200).toFixed(2); // 200.00-350.00 K
  } 
  else { // Challenging
    solveFor = variables[Math.floor(Math.random() * variables.length)];
    
    // Complex values with 3 decimal places and wider ranges
    P1 = +(Math.random() * 5 + 0.1).toFixed(3); // 0.100-5.100 atm
    V1 = +(Math.random() * 50 + 0.1).toFixed(3); // 0.100-50.100 L
    T1 = +(Math.random() * 300 + 100).toFixed(3); // 100.000-400.000 K
    P2 = +(Math.random() * 5 + 0.1).toFixed(3); // 0.100-5.100 atm
    V2 = +(Math.random() * 50 + 0.1).toFixed(3); // 0.100-50.100 L
    T2 = +(Math.random() * 300 + 100).toFixed(3); // 100.000-400.000 K
  }

  // Adjust the values to ensure the formula (P1*V1)/T1 = (P2*V2)/T2 holds
  // This ensures that for the variable we're solving for, we get a correct value
  switch (solveFor) {
    case 'P1':
      P1 = (P2 * V2 * T1) / (T2 * V1);
      break;
    case 'V1':
      V1 = (P2 * V2 * T1) / (T2 * P1);
      break;
    case 'T1':
      T1 = (T2 * P1 * V1) / (P2 * V2);
      break;
    case 'P2':
      P2 = (P1 * V1 * T2) / (T1 * V2);
      break;
    case 'V2':
      V2 = (P1 * V1 * T2) / (T1 * P2);
      break;
    case 'T2':
      T2 = (T1 * P2 * V2) / (P1 * V1);
      break;
    default:
      break;
  }
  
  // Educational context for higher difficulties
  let extraContext = '';
  if (problemType >= 2) {
    const contexts = [
      'In a closed system with a constant mass of gas,',
      'During a gas compression experiment,',
      'In a thermal equilibrium study,',
      'For a gas sample in a sealed container,',
      'In a laboratory pressure-volume analysis,'
    ];
    extraContext = contexts[Math.floor(Math.random() * contexts.length)] + ' ';
  }

  // Create the question and answer
  let question, answer, units;
  switch (solveFor) {
    case 'P1':
      answer = (P2 * V2 * T1) / (T2 * V1);
      question = `${extraContext}Given V1 = ${V1} L, T1 = ${T1} K, P2 = ${P2} atm, V2 = ${V2} L, T2 = ${T2} K, what is the initial pressure (P1) in atm?`;
      units = 'atm';
      break;
    case 'V1':
      answer = (P2 * V2 * T1) / (T2 * P1);
      question = `${extraContext}Given P1 = ${P1} atm, T1 = ${T1} K, P2 = ${P2} atm, V2 = ${V2} L, T2 = ${T2} K, what is the initial volume (V1) in L?`;
      units = 'L';
      break;
    case 'T1':
      answer = (T2 * P1 * V1) / (P2 * V2);
      question = `${extraContext}Given P1 = ${P1} atm, V1 = ${V1} L, P2 = ${P2} atm, V2 = ${V2} L, T2 = ${T2} K, what is the initial temperature (T1) in K?`;
      units = 'K';
      break;
    case 'P2':
      answer = (P1 * V1 * T2) / (T1 * V2);
      question = `${extraContext}Given P1 = ${P1} atm, V1 = ${V1} L, T1 = ${T1} K, V2 = ${V2} L, T2 = ${T2} K, what is the final pressure (P2) in atm?`;
      units = 'atm';
      break;
    case 'V2':
      answer = (P1 * V1 * T2) / (T1 * P2);
      question = `${extraContext}Given P1 = ${P1} atm, V1 = ${V1} L, T1 = ${T1} K, P2 = ${P2} atm, T2 = ${T2} K, what is the final volume (V2) in L?`;
      units = 'L';
      break;
    case 'T2':
      answer = (T1 * P2 * V2) / (P1 * V1);
      question = `${extraContext}Given P1 = ${P1} atm, V1 = ${V1} L, T1 = ${T1} K, P2 = ${P2} atm, V2 = ${V2} L, what is the final temperature (T2) in K?`;
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
    values: { P1, V1, T1, P2, V2, T2 },
    problemType // Include difficulty level
  };
}

function round(val, decimals=3) {
  return +val.toFixed(decimals);
}

function getFeedback(solveFor, userAnswer, correctAnswer, values, problemType = 1) {
  // Adjust tolerance based on difficulty
  const tolerance = problemType === 0 ? 0.02 : 
                   problemType === 1 ? 0.01 : 
                   problemType === 2 ? 0.005 : 0.003;
  
  if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
    // Success message with educational content based on difficulty
    const successMessages = [
      'Correct! You have mastered the basic application of the Combined Gas Law.', // Basic
      'Correct! Well done applying the Combined Gas Law relationship.', // Intermediate
      'Excellent work! You have demonstrated advanced understanding of gas behavior.', // Advanced
      'Outstanding! You have successfully solved a challenging gas law problem.' // Challenging
    ];
    
    return { correct: true, message: successMessages[problemType] };
  }
  
  let steps = [];
  steps.push('(P1 × V1) / T1 = (P2 × V2) / T2');
  
  // Provide more context for basic difficulty levels
  if (problemType === 0) {
    steps.push('The Combined Gas Law relates pressure, volume, and temperature changes for a gas.');
  }
  switch (solveFor) {
    case 'P1':
      steps.push('P1 = (P2 × V2 × T1) / (T2 × V1)');
      steps.push(`P1 = (${values.P2} × ${values.V2} × ${values.T1}) / (${values.T2} × ${values.V1})`);
      steps.push(`P1 = ${((values.P2 * values.V2 * values.T1) / (values.T2 * values.V1)).toFixed(3)} atm`);
      break;
    case 'V1':
      steps.push('V1 = (P2 × V2 × T1) / (T2 × P1)');
      steps.push(`V1 = (${values.P2} × ${values.V2} × ${values.T1}) / (${values.T2} × ${values.P1})`);
      steps.push(`V1 = ${((values.P2 * values.V2 * values.T1) / (values.T2 * values.P1)).toFixed(3)} L`);
      break;
    case 'T1':
      steps.push('T1 = (T2 × P1 × V1) / (P2 × V2)');
      steps.push(`T1 = (${values.T2} × ${values.P1} × ${values.V1}) / (${values.P2} × ${values.V2})`);
      steps.push(`T1 = ${((values.T2 * values.P1 * values.V1) / (values.P2 * values.V2)).toFixed(3)} K`);
      break;
    case 'P2':
      steps.push('P2 = (P1 × V1 × T2) / (T1 × V2)');
      steps.push(`P2 = (${values.P1} × ${values.V1} × ${values.T2}) / (${values.T1} × ${values.V2})`);
      steps.push(`P2 = ${((values.P1 * values.V1 * values.T2) / (values.T1 * values.V2)).toFixed(3)} atm`);
      break;
    case 'V2':
      steps.push('V2 = (P1 × V1 × T2) / (T1 × P2)');
      steps.push(`V2 = (${values.P1} × ${values.V1} × ${values.T2}) / (${values.T1} × ${values.P2})`);
      steps.push(`V2 = ${((values.P1 * values.V1 * values.T2) / (values.T1 * values.P2)).toFixed(3)} L`);
      break;
    case 'T2':
      steps.push('T2 = (T1 × P2 × V2) / (P1 × V1)');
      steps.push(`T2 = (${values.T1} × ${values.P2} × ${values.V2}) / (${values.P1} × ${values.V1})`);
      steps.push(`T2 = ${((values.T1 * values.P2 * values.V2) / (values.P1 * values.V1)).toFixed(3)} K`);
      break;
    default:
      break;
  }
  steps.push(`Your answer: ${userAnswer}`);
  steps.push(`Correct answer: ${correctAnswer}`);
  
  // Educational notes based on difficulty level
  const educationalNotes = [
    'Remember that the Combined Gas Law combines Boyle\'s, Charles\'s, and Gay-Lussac\'s Laws into one relationship.', // Basic
    'The Combined Gas Law shows how all three gas variables (P, V, T) interact simultaneously.', // Intermediate
    'This application demonstrates the mathematical relationship between pressure, volume, and temperature in gas behavior.', // Advanced
    'In real-world scenarios, the Combined Gas Law helps predict how gases respond when multiple variables change at once.' // Challenging
  ];
  
  return {
    correct: false,
    message: (
      <div>
        <b>Not quite. Calculator steps:</b>
        <ol style={{textAlign:'left'}}>
          {steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
        <div style={{marginTop:'0.5em'}}>
          <p>Check each algebraic and calculation step above.</p>
          <p style={{fontStyle:'italic', marginTop:'0.5em', color:'#4b5563'}}>{educationalNotes[problemType]}</p>
        </div>
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

function CombinedGasLawActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
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
        <h2 className="activity-title">Combined Gas Law Practice</h2>
        
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
            Combined Gas Law: (P₁ × V₁) / T₁ = (P₂ × V₂) / T₂
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

CombinedGasLawActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

export default CombinedGasLawActivity;
