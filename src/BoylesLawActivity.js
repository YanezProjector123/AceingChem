import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

function getRandomProblem() {
  // Boyle's Law: P1V1 = P2V2
  // Randomly select which variable to solve for: P1, V1, P2, or V2
  const variables = ['P1', 'V1', 'P2', 'V2'];
  const solveFor = variables[Math.floor(Math.random() * variables.length)];

  // Generate random values for the other three
  let P1 = +(Math.random() * 2 + 1).toFixed(2); // atm
  let V1 = +(Math.random() * 20 + 1).toFixed(2); // L
  let P2 = +(Math.random() * 2 + 1).toFixed(2); // atm
  let V2 = +(Math.random() * 20 + 1).toFixed(2); // L

  let question, answer, units;
  switch (solveFor) {
    case 'P1':
      answer = (P2 * V2) / V1;
      question = `Given V1 = ${V1} L, P2 = ${P2} atm, V2 = ${V2} L, what is the initial pressure (P1) in atm?`;
      units = 'atm';
      break;
    case 'V1':
      answer = (P2 * V2) / P1;
      question = `Given P1 = ${P1} atm, P2 = ${P2} atm, V2 = ${V2} L, what is the initial volume (V1) in L?`;
      units = 'L';
      break;
    case 'P2':
      answer = (P1 * V1) / V2;
      question = `Given P1 = ${P1} atm, V1 = ${V1} L, V2 = ${V2} L, what is the final pressure (P2) in atm?`;
      units = 'atm';
      break;
    case 'V2':
      answer = (P1 * V1) / P2;
      question = `Given P1 = ${P1} atm, V1 = ${V1} L, P2 = ${P2} atm, what is the final volume (V2) in L?`;
      units = 'L';
      break;
    default:
      break;
  }
  return {
    solveFor,
    question,
    answer: +answer.toFixed(3),
    units,
    values: { P1, V1, P2, V2 },
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
  steps.push('P1V1 = P2V2');
  switch (solveFor) {
    case 'P1':
      steps.push('P1 = (P2 × V2) / V1');
      steps.push(`P1 = (${values.P2} × ${values.V2}) / ${values.V1}`);
      steps.push(`P1 = ${(values.P2 * values.V2 / values.V1).toFixed(3)} atm`);
      break;
    case 'V1':
      steps.push('V1 = (P2 × V2) / P1');
      steps.push(`V1 = (${values.P2} × ${values.V2}) / ${values.P1}`);
      steps.push(`V1 = ${(values.P2 * values.V2 / values.P1).toFixed(3)} L`);
      break;
    case 'P2':
      steps.push('P2 = (P1 × V1) / V2');
      steps.push(`P2 = (${values.P1} × ${values.V1}) / ${values.V2}`);
      steps.push(`P2 = ${(values.P1 * values.V1 / values.V2).toFixed(3)} atm`);
      break;
    case 'V2':
      steps.push('V2 = (P1 × V1) / P2');
      steps.push(`V2 = (${values.P1} × ${values.V1}) / ${values.P2}`);
      steps.push(`V2 = ${(values.P1 * values.V1 / values.P2).toFixed(3)} L`);
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

function BoylesLawActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
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
        <h2 className="activity-title">Boyle's Law Practice</h2>
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

BoylesLawActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

export default BoylesLawActivity;
