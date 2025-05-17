import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

const R = 0.0821; // Ideal gas constant in L·atm/(mol·K)

function getRandomProblem() {
  // Randomly decide which variable to solve for
  const variables = ['P', 'V', 'n', 'T'];
  const solveFor = variables[Math.floor(Math.random() * variables.length)];

  // Generate random values for the other three
  let P = +(Math.random() * 3 + 1).toFixed(2); // atm
  let V = +(Math.random() * 20 + 1).toFixed(2); // L
  let n = +(Math.random() * 3 + 0.5).toFixed(2); // mol
  let T = +(Math.random() * 200 + 273).toFixed(2); // K

  let question, answer, units;
  switch (solveFor) {
    case 'P':
      answer = (n * R * T / V);
      question = `Given n = ${n} mol, V = ${V} L, T = ${T} K, what is the pressure (P) in atm?`;
      units = 'atm';
      break;
    case 'V':
      answer = (n * R * T / P);
      question = `Given n = ${n} mol, P = ${P} atm, T = ${T} K, what is the volume (V) in L?`;
      units = 'L';
      break;
    case 'n':
      answer = (P * V / (R * T));
      question = `Given P = ${P} atm, V = ${V} L, T = ${T} K, what is the number of moles (n)?`;
      units = 'mol';
      break;
    case 'T':
      answer = (P * V / (n * R));
      question = `Given P = ${P} atm, V = ${V} L, n = ${n} mol, what is the temperature (T) in K?`;
      units = 'K';
      break;
    default:
      break;
  }
  return {
    solveFor,
    question,
    answer: +answer.toFixed(3), // 3 decimal places
    units,
    values: { P, V, n, T },
  };
}

function round(val, decimals=3) {
  return +val.toFixed(decimals);
}

function getFeedback(solveFor, userAnswer, correctAnswer, values) {
  const tolerance = 0.01; // Acceptable error
  if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
    return { correct: true, message: 'Correct! Well done.' };
  }
  let steps = [];
  steps.push('PV = nRT');
  switch (solveFor) {
    case 'P':
      steps.push('P = (nRT) / V');
      steps.push(`P = (${values.n} × 0.0821 × ${values.T}) / ${values.V}`);
      steps.push(`P = ${((values.n * 0.0821 * values.T) / values.V).toFixed(3)} atm`);
      break;
    case 'V':
      steps.push('V = (nRT) / P');
      steps.push(`V = (${values.n} × 0.0821 × ${values.T}) / ${values.P}`);
      steps.push(`V = ${((values.n * 0.0821 * values.T) / values.P).toFixed(3)} L`);
      break;
    case 'n':
      steps.push('n = (PV) / (0.0821 × T)');
      steps.push(`n = (${values.P} × ${values.V}) / (0.0821 × ${values.T})`);
      steps.push(`n = ${(values.P * values.V / (0.0821 * values.T)).toFixed(3)} mol`);
      break;
    case 'T':
      steps.push('T = (PV) / (n × 0.0821)');
      steps.push(`T = (${values.P} × ${values.V}) / (${values.n} × 0.0821)`);
      steps.push(`T = ${(values.P * values.V / (values.n * 0.0821)).toFixed(3)} K`);
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

function IdealGasActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
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
        <h2 className="activity-title">Ideal Gas Law Practice</h2>
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

IdealGasActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

export default IdealGasActivity;
