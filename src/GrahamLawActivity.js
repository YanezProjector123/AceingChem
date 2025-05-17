import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

// Graham's Law: rate1/rate2 = sqrt(M2/M1)
const gasData = [
  // Common gases (Basic)
  { name: 'Hydrogen', M: 2.02, category: 'basic' },
  { name: 'Helium', M: 4.00, category: 'basic' },
  { name: 'Nitrogen', M: 28.0, category: 'basic' },
  { name: 'Oxygen', M: 32.0, category: 'basic' },
  { name: 'Carbon dioxide', M: 44.0, category: 'basic' },
  { name: 'Methane', M: 16.0, category: 'basic' },
  
  // Intermediate gases
  { name: 'Chlorine', M: 70.9, category: 'intermediate' },
  { name: 'Sulfur dioxide', M: 64.1, category: 'intermediate' },
  { name: 'Ammonia', M: 17.0, category: 'intermediate' },
  { name: 'Argon', M: 39.9, category: 'intermediate' },
  { name: 'Neon', M: 20.2, category: 'intermediate' },
  { name: 'Carbon monoxide', M: 28.0, category: 'intermediate' },
  
  // Advanced gases
  { name: 'Nitrous oxide', M: 44.0, category: 'advanced' },
  { name: 'Xenon', M: 131.3, category: 'advanced' },
  { name: 'Propane', M: 44.1, category: 'advanced' },
  { name: 'Krypton', M: 83.8, category: 'advanced' },
  { name: 'Ethane', M: 30.1, category: 'advanced' },
  { name: 'Butane', M: 58.1, category: 'advanced' },
  
  // Challenging gases
  { name: 'Hydrogen sulfide', M: 34.1, category: 'challenging' },
  { name: 'Radon', M: 222.0, category: 'challenging' },
  { name: 'Sulfur hexafluoride', M: 146.1, category: 'challenging' },
  { name: 'Hexane', M: 86.2, category: 'challenging' },
  { name: 'Ozone', M: 48.0, category: 'challenging' },
  { name: 'Acetylene', M: 26.0, category: 'challenging' }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
  
  // Filter gases by difficulty category
  let availableGases = [];
  switch(problemType) {
    case 0: // Basic - only basic gases
      availableGases = gasData.filter(gas => gas.category === 'basic');
      break;
    case 1: // Intermediate - basic and intermediate gases
      availableGases = gasData.filter(gas => gas.category === 'basic' || gas.category === 'intermediate');
      break;
    case 2: // Advanced - intermediate and advanced gases
      availableGases = gasData.filter(gas => gas.category === 'intermediate' || gas.category === 'advanced');
      break;
    case 3: // Challenging - advanced and challenging gases
      availableGases = gasData.filter(gas => gas.category === 'advanced' || gas.category === 'challenging');
      break;
    default:
      availableGases = gasData;
  }
  
  // For basic difficulty, only do the simpler type of problem (ratio calculation)
  // For higher difficulties, include all problem types
  let type;
  if (problemType === 0) {
    type = 1; // Only ratio calculations for basic difficulty
  } else {
    type = getRandomInt(1, 3); // All problem types for higher difficulties
  }
  
  let prompt, answer, steps, units = '';
  let context = '';
  
  // Add scientific context for higher difficulties
  if (problemType >= 2) {
    const contexts = [
      'In a laboratory diffusion experiment, ',
      'In a study of gas kinetics, ',
      'During a gas separation procedure, ',
      'In a molecular diffusion analysis, ',
      'For an effusion rate measurement, '
    ];
    context = contexts[getRandomInt(0, contexts.length - 1)];
  }

  // Generate problem details based on type and difficulty
  if (type === 1) {
    // Given two gases, find rate1/rate2
    const i1 = getRandomInt(0, availableGases.length - 1);
    let i2 = getRandomInt(0, availableGases.length - 1);
    while (i2 === i1) i2 = getRandomInt(0, availableGases.length - 1);
    const gas1 = availableGases[i1];
    const gas2 = availableGases[i2];
    answer = Math.sqrt(gas2.M / gas1.M);
    
    // Different question formats based on difficulty
    if (problemType === 0) {
      prompt = `What is the ratio of the rate of effusion of ${gas1.name} to ${gas2.name}? (rate₁/rate₂)`;
    } else {
      prompt = `${context}calculate the ratio of the effusion rate of ${gas1.name} (molar mass = ${gas1.M} g/mol) to ${gas2.name} (molar mass = ${gas2.M} g/mol). Express your answer as rate₁/rate₂.`;
    }
    
    steps = [
      `Graham's Law: rate₁/rate₂ = sqrt(M₂/M₁)`,
      `M₁ = ${gas1.M} g/mol, M₂ = ${gas2.M} g/mol`,
      `rate₁/rate₂ = sqrt(${gas2.M} / ${gas1.M}) = ${answer.toFixed(problemType + 3)}`
    ];
    units = '';
  } else if (type === 2) {
    // Given rate ratio and M2, find M1
    const i2 = getRandomInt(0, availableGases.length - 1);
    const gas2 = availableGases[i2];
    
    // Adjust rate ratio complexity based on difficulty
    let rateRatio;
    if (problemType === 1) {
      rateRatio = +(Math.random() * 1.0 + 0.5).toFixed(1); // 0.5 to 1.5, 1 decimal place
    } else if (problemType === 2) {
      rateRatio = +(Math.random() * 1.5 + 0.5).toFixed(2); // 0.5 to 2.0, 2 decimal places
    } else {
      rateRatio = +(Math.random() * 2.0 + 0.3).toFixed(3); // 0.3 to 2.3, 3 decimal places
    }
    
    answer = gas2.M / (rateRatio * rateRatio);
    prompt = `${context}a gas effuses at a rate ${rateRatio} times that of ${gas2.name} (molar mass = ${gas2.M} g/mol). What is the molar mass (g/mol) of the unknown gas?`;
    
    steps = [
      `Graham's Law: rate₁/rate₂ = sqrt(M₂/M₁)`,
      `rate₁/rate₂ = ${rateRatio}, M₂ = ${gas2.M}`,
      `(${rateRatio}) = sqrt(${gas2.M}/M₁)`,
      `Square both sides: (${rateRatio})² = ${gas2.M}/M₁`,
      `M₁ = ${gas2.M} / (${rateRatio})² = ${answer.toFixed(problemType + 1)} g/mol`
    ];
    units = 'g/mol';
  } else {
    // Given rate ratio and M1, find M2
    const i1 = getRandomInt(0, availableGases.length - 1);
    const gas1 = availableGases[i1];
    
    // Adjust rate ratio complexity based on difficulty
    let rateRatio;
    if (problemType === 1) {
      rateRatio = +(Math.random() * 1.0 + 0.5).toFixed(1); // 0.5 to 1.5, 1 decimal place
    } else if (problemType === 2) {
      rateRatio = +(Math.random() * 1.5 + 0.5).toFixed(2); // 0.5 to 2.0, 2 decimal places
    } else {
      rateRatio = +(Math.random() * 2.0 + 0.3).toFixed(3); // 0.3 to 2.3, 3 decimal places
    }
    
    answer = gas1.M * (rateRatio * rateRatio);
    prompt = `${context}if ${gas1.name} (molar mass = ${gas1.M} g/mol) effuses at a rate ${rateRatio} times that of another gas, what is the molar mass (g/mol) of that other gas?`;
    
    steps = [
      `Graham's Law: rate₁/rate₂ = sqrt(M₂/M₁)`,
      `rate₁/rate₂ = ${rateRatio}, M₁ = ${gas1.M}`,
      `(${rateRatio}) = sqrt(M₂/${gas1.M})`,
      `Square both sides: (${rateRatio})² = M₂/${gas1.M}`,
      `M₂ = ${gas1.M} * (${rateRatio})² = ${answer.toFixed(problemType + 1)} g/mol`
    ];
    units = 'g/mol';
  }

  // Set precision based on difficulty level
  const decimals = problemType === 0 ? 2 : (problemType === 1 ? 3 : 4);

  return {
    prompt,
    answer: +answer.toFixed(decimals),
    steps,
    units,
    problemType // Include problem type for difficulty tracking
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

export default function GrahamLawActivity({ onBack, onShowPeriodicTable }) {
  const [problem, setProblem] = useState(() => getRandomProblem());
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
    // Adjust tolerance based on difficulty level and question type
    const baseTolerance = problem.units === '' ? 0.02 : 0.05; // Base tolerance values
    const difficultyFactor = [1.5, 1.0, 0.7, 0.5][problem.problemType || 1]; // Stricter at higher levels
    const tolerance = baseTolerance * difficultyFactor * Math.abs(problem.answer);
    
    const correct = Math.abs(userVal - problem.answer) <= tolerance;
    
    // Enhanced success messages based on difficulty level
    const successMessages = [
      'Correct! You have successfully applied Graham\'s Law for a basic problem.',
      'Well done! Your calculation accurately applies the relationship between effusion rates and molar mass.',
      'Excellent work! You have mastered the application of Graham\'s Law for complex gas scenarios.',
      'Outstanding! You have correctly solved a challenging problem using Graham\'s Law principles.'
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
    setProblem(getRandomProblem(selectedDifficulty));
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }
  
  // Handler for difficulty selection
  function handleDifficultyChange(level) {
    setSelectedDifficulty(level);
    setProblem(getRandomProblem(level));
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Graham's Law of Effusion</h2>
        
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
            Graham's Law: rate₁/rate₂ = √(M₂/M₁)
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <input
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder={problem.units ? `Your answer (${problem.units})` : 'Your answer'}
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

GrahamLawActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired
};
