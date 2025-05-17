import React, { useState } from 'react';
import './ActivityModern.css';

// Helper for random integer in range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Vapor pressure of water table (torr) at common temps (°C)
const vaporPressureTable = [
  { temp: 10, vp: 9.2 },
  { temp: 15, vp: 12.8 },
  { temp: 20, vp: 17.5 },
  { temp: 25, vp: 23.8 },
  { temp: 30, vp: 31.8 },
  { temp: 35, vp: 42.2 },
  { temp: 40, vp: 55.3 }
];

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

function generateProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const difficulty = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
  
  // Types: find dry gas pressure, find collected gas moles, find collected gas volume
  let types = [];
  
  // Restrict problem types based on difficulty level
  if (difficulty === 0) { // Basic level - simple dry pressure problems
    types = ['dryPressure'];
  } else if (difficulty === 1) { // Intermediate level - dry pressure and moles
    types = ['dryPressure', 'moles'];
  } else if (difficulty === 2) { // Advanced level - all problem types
    types = ['dryPressure', 'moles', 'volume'];
  } else { // Challenging level - more complex moles and volume problems
    types = ['moles', 'volume'];
  }
  
  const type = types[getRandomInt(0, types.length - 1)];
  
  // Select temperature range based on difficulty
  let tempIndex;
  if (difficulty === 0) { // Basic - standard temps (20-25°C)
    tempIndex = getRandomInt(2, 3);
  } else if (difficulty === 1) { // Intermediate - common temps (15-30°C)
    tempIndex = getRandomInt(1, 4);
  } else if (difficulty === 2) { // Advanced - wider range (10-35°C)
    tempIndex = getRandomInt(0, 5);
  } else { // Challenging - all temps including uncommon ones (10-40°C)
    tempIndex = getRandomInt(0, vaporPressureTable.length - 1);
  }
  
  const tempObj = vaporPressureTable[tempIndex];
  const temp = tempObj.temp;
  const vaporPressure = tempObj.vp;
  // Adjust parameters based on difficulty level
  let totalPressure, collectedVolume;
  
  if (difficulty === 0) { // Basic - simpler, rounded values
    totalPressure = getRandomInt(745, 775); // torr, closer to 760 (1 atm)
    collectedVolume = getRandomInt(25, 50) * 10 / 10; // 25.0-50.0 L, tends to be whole numbers
  } else if (difficulty === 1) { // Intermediate - standard range
    totalPressure = getRandomInt(740, 780); // torr
    collectedVolume = getRandomInt(200, 500) / 10; // 20.0-50.0 L
  } else if (difficulty === 2) { // Advanced - wider range
    totalPressure = getRandomInt(720, 790); // torr
    collectedVolume = getRandomInt(150, 550) / 10; // 15.0-55.0 L
  } else { // Challenging - extreme values
    totalPressure = getRandomInt(700, 800); // torr
    collectedVolume = getRandomInt(125, 625) / 10; // 12.5-62.5 L with more decimal precision
  }
  const R = 62.4; // L·torr/(mol·K)
  const T = temp + 273.15;
  let dryPressure = totalPressure - vaporPressure;
  dryPressure = Math.round(dryPressure * 10) / 10;

  let prompt, answer, explanation;

  if (type === 'dryPressure') {
    prompt = `A gas is collected over water at ${temp}°C. The total pressure is ${totalPressure} torr. What is the pressure (in torr) of the dry gas? (Vapor pressure of water at this temperature: ${vaporPressure} torr)`;
    answer = dryPressure;
    explanation = `Dry gas pressure = Total pressure - Vapor pressure = ${totalPressure} - ${vaporPressure} = ${dryPressure} torr.`;
  } else if (type === 'moles') {
    prompt = `A gas is collected over water at ${temp}°C and occupies ${collectedVolume} L. The total pressure is ${totalPressure} torr. How many moles of dry gas were collected? (Vapor pressure of water at this temperature: ${vaporPressure} torr)`;
    answer = ((dryPressure * collectedVolume) / (R * T));
    answer = Math.round(answer * 1000) / 1000;
    explanation = `First, find dry gas pressure: ${totalPressure} - ${vaporPressure} = ${dryPressure} torr.\nThen use PV = nRT:\n(${dryPressure} torr) * (${collectedVolume} L) = n * (62.4) * (${T} K)\nSolve for n: n = PV / RT = (${dryPressure} * ${collectedVolume}) / (62.4 * ${T}) = ${answer} mol.`;
  } else if (type === 'volume') {
    const moles = getRandomInt(10, 40) / 100; // 0.10-0.40 mol
    prompt = `A sample of ${moles} mol of gas is collected over water at ${temp}°C. The total pressure is ${totalPressure} torr. What volume (in L) does the dry gas occupy? (Vapor pressure of water at this temperature: ${vaporPressure} torr)`;
    answer = ((moles * 62.4 * T) / dryPressure);
    answer = Math.round(answer * 100) / 100;
    explanation = `First, find dry gas pressure: ${totalPressure} - ${vaporPressure} = ${dryPressure} torr.\nThen use PV = nRT, solve for V:\nV = nRT / P = (${moles} * 62.4 * ${T}) / ${dryPressure} = ${answer} L.`;
  }

  // Add more educational context based on difficulty level
  if (difficulty >= 1) {
    explanation += '\n\nRemember: When gas is collected over water, the total pressure equals the sum of the dry gas pressure and water vapor pressure.'
  }
  
  if (difficulty >= 2) {
    explanation += ` The total pressure includes both the gas you're collecting and the water vapor in the container at ${temp}°C.`
  }
  
  if (difficulty === 3) {
    explanation += ` Note that vapor pressure of water varies with temperature, so always check the appropriate vapor pressure value for your specific experimental conditions.`
  }
  
  return {
    prompt,
    answer,
    explanation,
    type,
    difficulty // Include difficulty level in the returned problem
  };
}

export default function CollectingGasOverWaterActivity({ onBack, onShowPeriodicTable }) {
  // State to track selected difficulty level
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [problem, setProblem] = useState(() => generateProblem(selectedDifficulty));
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  function getFeedback(problem, userAnswer) {
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) {
      return { correct: false, message: 'Please enter a valid number.' };
    }
    let correct = false;
    // Adjust tolerance based on difficulty level - more lenient for basic, stricter for advanced
    let tolerance = problem.difficulty === 0 ? 0.02 :
                  problem.difficulty === 1 ? 0.015 :
                  problem.difficulty === 2 ? 0.01 : 0.005;
    let steps = [];
    if (problem.type === 'dryPressure') {
      tolerance = 0.2;
      correct = Math.abs(parsed - problem.answer) < tolerance;
      steps.push('Dry gas pressure = Total pressure - Vapor pressure');
      steps.push(`= ${problem.prompt.match(/total pressure is (\d+) torr/)[1]} - ${problem.prompt.match(/Vapor pressure.*: (\d+\.?\d*) torr/)[1]}`);
      steps.push(`= ${problem.answer} torr`);
    } else if (problem.type === 'moles') {
      tolerance = 0.02;
      correct = Math.abs(parsed - problem.answer) < tolerance;
      steps.push('First, dry gas pressure = Total pressure - Vapor pressure');
      steps.push(`= ${problem.prompt.match(/total pressure is (\d+) torr/)[1]} - ${problem.prompt.match(/Vapor pressure.*: (\d+\.?\d*) torr/)[1]}`);
      steps.push(`= ${problem.explanation.match(/= (\d+\.?\d*) torr/)[1]} torr`);
      steps.push('Then use PV = nRT:');
      steps.push(`n = PV / RT`);
      steps.push(`= (${problem.explanation.match(/(\d+\.?\d*) torr/)[1]} × ${problem.prompt.match(/occupies (\d+\.?\d*) L/)[1]}) / (62.4 × ${problem.prompt.match(/at (\d+)°C/)[1]} + 273.15)`);
      steps.push(`= ${problem.answer} mol`);
    } else if (problem.type === 'volume') {
      tolerance = 0.1;
      correct = Math.abs(parsed - problem.answer) < tolerance;
      steps.push('First, dry gas pressure = Total pressure - Vapor pressure');
      steps.push(`= ${problem.prompt.match(/total pressure is (\d+) torr/)[1]} - ${problem.prompt.match(/Vapor pressure.*: (\d+\.?\d*) torr/)[1]}`);
      steps.push(`= ${problem.explanation.match(/= (\d+\.?\d*) torr/)[1]} torr`);
      steps.push('Then use PV = nRT, solve for V:');
      steps.push(`V = nRT / P`);
      steps.push(`= (${problem.prompt.match(/sample of (\d+\.?\d*) mol/)[1]} × 62.4 × (${problem.prompt.match(/at (\d+)°C/)[1]} + 273.15)) / ${problem.explanation.match(/= (\d+\.?\d*) torr/)[1]}`);
      steps.push(`= ${problem.answer} L`);
    }
    if (correct) {
      // Provide different feedback messages based on difficulty level
      const successMessages = [
        'Correct! You\'ve mastered the basics of gas collection over water.',
        'Great job! You\'re handling gas collection calculations well.',
        'Excellent work! You\'ve correctly addressed this advanced gas collection problem.',
        'Outstanding! You\'ve solved a challenging gas collection problem with precision.'
      ];
      return { correct: true, message: successMessages[problem.difficulty || 0] };
    }
    return {
      correct: false,
      message: (
        <div>
          <b>Not quite. Calculator steps:</b>
          <ol style={{textAlign:'left'}}>
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
          <div style={{marginTop:'0.5em'}}>Check each algebraic and calculation step above.<br/>Your answer: {userAnswer}<br/>Correct answer: {problem.answer}</div>
        </div>
      )
    };
  }

  const handleCheck = () => {
    const fb = getFeedback(problem, userAnswer);
    setFeedback(fb);
    setShowExplanation(!fb.correct);
  };


  const handleNext = () => {
    setProblem(generateProblem(selectedDifficulty));
    setUserAnswer('');
    setFeedback(null);
    setShowExplanation(false);
  };
  
  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    setProblem(generateProblem(level));
    setUserAnswer('');
    setFeedback(null);
    setShowExplanation(false);
  };

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Collecting Gas Over Water</h2>
        
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
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 12px 0' }}>
          <button className="activity-btn" type="button" onClick={onShowPeriodicTable}>
            Periodic Table
          </button>
        </div>
        <div className="question-area">
          <p className="question-text" style={{ fontSize: '1.15em' }}>{problem.prompt}</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); handleCheck(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <input
            className="activity-input"
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            step="any"
            style={{ margin: '10px 0 20px 0' }}
            disabled={feedback === 'Correct!'}
          />
          {feedback && (
            <div className={`feedback-container feedback-${feedback.correct ? 'correct' : 'incorrect'}`}>{feedback.message}</div>
          )}
          {showExplanation && <div className="explanation">{problem.explanation}</div>}
          <div className="button-row">
            {feedback !== 'Correct!' && (
              <button type="submit" className="activity-btn" disabled={!userAnswer}>Check Answer</button>
            )}
            {feedback === 'Correct!' && (
              <button type="button" className="activity-btn" onClick={handleNext}>Next</button>
            )}
            <button type="button" className="back-btn" onClick={onBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
