import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

// Graham's Law: rate1/rate2 = sqrt(M2/M1)
const gasData = [
  { name: 'Hydrogen', M: 2.02 },
  { name: 'Helium', M: 4.00 },
  { name: 'Nitrogen', M: 28.0 },
  { name: 'Oxygen', M: 32.0 },
  { name: 'Carbon dioxide', M: 44.0 },
  { name: 'Chlorine', M: 70.9 },
  { name: 'Sulfur dioxide', M: 64.1 },
  { name: 'Methane', M: 16.0 },
  { name: 'Ammonia', M: 17.0 },
  { name: 'Argon', M: 39.9 },
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomProblem() {
  // Three types: 1) ratio, 2) unknown molar mass, 3) inverse
  const type = getRandomInt(1, 3);
  let prompt, answer, steps, units = '';

  if (type === 1) {
    // Given two gases, find rate1/rate2
    const i1 = getRandomInt(0, gasData.length - 1);
    let i2 = getRandomInt(0, gasData.length - 1);
    while (i2 === i1) i2 = getRandomInt(0, gasData.length - 1);
    const gas1 = gasData[i1];
    const gas2 = gasData[i2];
    answer = Math.sqrt(gas2.M / gas1.M);
    prompt = `What is the ratio of the rate of effusion of ${gas1.name} to ${gas2.name}? (rate₁/rate₂)`;
    steps = [
      `Graham's Law: rate₁/rate₂ = sqrt(M₂/M₁)`,
      `M₁ = ${gas1.M} g/mol, M₂ = ${gas2.M} g/mol`,
      `rate₁/rate₂ = sqrt(${gas2.M} / ${gas1.M}) = ${answer.toFixed(3)}`
    ];
    units = '';
  } else if (type === 2) {
    // Given rate ratio and M2, find M1
    const i2 = getRandomInt(0, gasData.length - 1);
    const gas2 = gasData[i2];
    const rateRatio = +(Math.random() * 1.5 + 0.5).toFixed(2); // 0.5 to 2.0
    answer = gas2.M / (rateRatio * rateRatio);
    prompt = `A gas effuses at a rate ${rateRatio} times that of ${gas2.name}. What is its molar mass (g/mol)?`;
    steps = [
      `Graham's Law: rate₁/rate₂ = sqrt(M₂/M₁)`,
      `rate₁/rate₂ = ${rateRatio}, M₂ = ${gas2.M}`,
      `(${rateRatio}) = sqrt(${gas2.M}/M₁)`,
      `Square both sides: (${rateRatio})² = ${gas2.M}/M₁`,
      `M₁ = ${gas2.M} / (${rateRatio})² = ${answer.toFixed(2)} g/mol`
    ];
    units = 'g/mol';
  } else {
    // Given rate ratio and M1, find M2
    const i1 = getRandomInt(0, gasData.length - 1);
    const gas1 = gasData[i1];
    const rateRatio = +(Math.random() * 1.5 + 0.5).toFixed(2); // 0.5 to 2.0
    answer = gas1.M * (rateRatio * rateRatio);
    prompt = `If ${gas1.name} effuses at a rate ${rateRatio} times that of another gas, what is the molar mass (g/mol) of the other gas?`;
    steps = [
      `Graham's Law: rate₁/rate₂ = sqrt(M₂/M₁)`,
      `rate₁/rate₂ = ${rateRatio}, M₁ = ${gas1.M}`,
      `(${rateRatio}) = sqrt(M₂/${gas1.M})`,
      `Square both sides: (${rateRatio})² = M₂/${gas1.M}`,
      `M₂ = ${gas1.M} * (${rateRatio})² = ${answer.toFixed(2)} g/mol`
    ];
    units = 'g/mol';
  }

  return {
    prompt,
    answer: +answer.toFixed(3),
    steps,
    units
  };
}

export default function GrahamLawActivity({ onBack, onShowPeriodicTable }) {
  const [problem, setProblem] = useState(getRandomProblem());
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
    // Accept within 2% for ratios, 5% for molar mass
    const tolerance = problem.units === '' ? 0.02 * Math.abs(problem.answer) : 0.05 * Math.abs(problem.answer);
    const correct = Math.abs(userVal - problem.answer) <= tolerance;
    setFeedback({
      correct,
      message: correct ? 'Correct! Well done.' : 'Not quite. See the steps below.',
      steps: problem.steps
    });
    setShowSteps(true);
  }

  function handleNext() {
    setProblem(getRandomProblem());
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Graham's Law of Effusion</h2>
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
