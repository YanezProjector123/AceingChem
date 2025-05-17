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

function generateDaltonProblem() {
  // Types: total from partials, missing partial, mole fraction/partial
  const types = ['total', 'missing', 'molefraction'];
  const type = types[getRandomInt(0, types.length - 1)];
  let prompt = '', answer = 0, steps = [], partials = [], total = 0, missingIdx = 0, moleFractions = [], moles = [], whichGas = 0;

  if (type === 'total') {
    // Find total given 2-4 partials
    const n = getRandomInt(2, 4);
    partials = Array.from({length: n}, () => getRandomFloat(0.4, 2.5, 2));
    total = partials.reduce((a, b) => a + b, 0);
    prompt = `The partial pressures of ${n} gases in a mixture are ${partials.map((p,i) => `P${i+1} = ${p} atm`).join(', ')}. What is the total pressure (in atm)?`;
    answer = total;
    steps = [
      `Add all partial pressures: ${partials.map((p,i) => `P${i+1}`).join(' + ')} = ${partials.map(p => p.toFixed(2)).join(' + ')} = ${total.toFixed(2)} atm.`
    ];
  } else if (type === 'missing') {
    // Find a missing partial given total and others
    const n = getRandomInt(2, 4);
    partials = Array.from({length: n}, () => getRandomFloat(0.5, 2.5, 2));
    missingIdx = getRandomInt(0, n - 1);
    total = partials.reduce((a, b) => a + b, 0) + getRandomFloat(0.5, 2.5, 2);
    const missingPartial = +(total - partials.reduce((a, b) => a + b, 0)).toFixed(2);
    prompt = `In a mixture, the total pressure is ${total.toFixed(2)} atm. The partial pressures of the other ${n} gases are ${partials.map((p,i) => `P${i+1} = ${p} atm`).join(', ')}. What is the partial pressure of the remaining gas (in atm)?`;
    answer = missingPartial;
    steps = [
      `Add all known partial pressures: ${partials.map((p,i) => `P${i+1}`).join(' + ')} = ${partials.map(p => p.toFixed(2)).join(' + ')} = ${(partials.reduce((a, b) => a + b, 0)).toFixed(2)} atm.`,
      `Subtract from total: ${total.toFixed(2)} - ${(partials.reduce((a, b) => a + b, 0)).toFixed(2)} = ${missingPartial.toFixed(2)} atm.`
    ];
  } else {
    // Mole fraction type: find partial from mole fraction and total, or vice versa
    const n = getRandomInt(2, 3);
    moles = Array.from({length: n}, () => getRandomInt(1, 6));
    total = getRandomFloat(1.0, 3.5, 2);
    whichGas = getRandomInt(0, n-1);
    const totalMoles = moles.reduce((a,b) => a+b, 0);
    moleFractions = moles.map(m => m/totalMoles);
    const pPartial = +(total * moleFractions[whichGas]).toFixed(2);
    prompt = `A mixture contains ${moles.map((m,i) => `${m} mol of gas ${String.fromCharCode(65+i)}`).join(', ')}. The total pressure is ${total} atm. What is the partial pressure of gas ${String.fromCharCode(65+whichGas)} (in atm)?`;
    answer = pPartial;
    steps = [
      `Find mole fraction: x = moles of A / total moles = ${moles[whichGas]} / ${totalMoles} = ${moleFractions[whichGas].toFixed(2)}`,
      `Partial pressure = mole fraction × total pressure = ${moleFractions[whichGas].toFixed(2)} × ${total} = ${pPartial} atm.`
    ];
  }
  return { prompt, answer, steps };
}

export default function DaltonLawActivity({ onBack, onShowPeriodicTable }) {
  const [problem, setProblem] = useState(generateDaltonProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const userVal = parseFloat(userAnswer);
    if (isNaN(userVal)) {
      setFeedback({ correct: false, message: 'Please enter a valid number.' });
      return;
    }
    const correct = Math.abs(userVal - problem.answer) < 0.05 * Math.abs(problem.answer);
    setFeedback({
      correct,
      message: correct ? 'Correct! Well done.' : 'Not quite. See the steps below.',
      steps: problem.steps
    });
    setShowSteps(true);
  }

  function handleNext() {
    setProblem(generateDaltonProblem()); // Always generate a new random problem
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Dalton's Law of Partial Pressures</h2>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 12px 0' }}>
          <button className="activity-btn" type="button" onClick={onShowPeriodicTable}>
            Periodic Table
          </button>
        </div>
        <div className="question-area">
          <p className="question-text" style={{ fontSize: '1.15em' }}>{problem.prompt}</p>
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
