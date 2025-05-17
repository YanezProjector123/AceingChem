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

function generateProblem() {
  // Types: find dry gas pressure, find collected gas moles, find collected gas volume
  const types = ['dryPressure', 'moles', 'volume'];
  const type = types[getRandomInt(0, types.length - 1)];
  const tempObj = vaporPressureTable[getRandomInt(0, vaporPressureTable.length - 1)];
  const temp = tempObj.temp;
  const vaporPressure = tempObj.vp;
  const totalPressure = getRandomInt(740, 780); // torr
  const collectedVolume = getRandomInt(200, 600) / 10; // 20.0-60.0 L
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

  return {
    prompt,
    answer,
    explanation,
    type
  };
}

export default function CollectingGasOverWaterActivity({ onBack, onShowPeriodicTable }) {
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  function getFeedback(problem, userAnswer) {
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) {
      return { correct: false, message: 'Please enter a valid number.' };
    }
    let correct = false;
    let tolerance = 0.01;
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
      return { correct: true, message: 'Correct! Well done.' };
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
    setProblem(generateProblem());
    setUserAnswer('');
    setFeedback(null);
    setShowExplanation(false);
  };

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Collecting Gas Over Water</h2>
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
