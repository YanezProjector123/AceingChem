import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';
import periodicTable from './periodic-table.json';
import './IonizationEnergyActivity.css';

// Utility functions
const getRandomInt = (max) => Math.floor(Math.random() * max);
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Question generators
const generateTrendQuestion = () => {
  const elements = shuffle(periodicTable.filter(e => e.period <= 6)).slice(0, 2);
  const [a, b] = elements.sort((x, y) => {
    if (x.period !== y.period) return x.period - y.period;
    return y.group - x.group;
  });
  
  return {
    type: 'compare',
    question: `Which has higher ionization energy: ${a.symbol} or ${b.symbol}?`,
    options: [a.symbol, b.symbol],
    correct: a.symbol,
    explanation: `${a.symbol} has higher IE as it's ${a.period < b.period ? 'higher up the group' : 'further right in the period'}.`
  };
};

const generateRankQuestion = () => {
  const elements = shuffle(periodicTable.filter(e => e.period <= 4)).slice(0, 3);
  const correctOrder = [...elements].sort((x, y) => {
    if (x.period !== y.period) return x.period - y.period;
    return y.group - x.group;
  }).map(e => e.symbol);
  
  return {
    type: 'rank',
    question: 'Rank these elements from lowest to highest ionization energy:',
    options: [
      correctOrder.join(' < '),
      [...correctOrder].reverse().join(' < '),
      shuffle([...correctOrder]).join(' < ')
    ],
    correct: correctOrder.join(' < '),
    explanation: `Correct order: ${correctOrder.join(' < ')} based on periodic trends.`
  };
};

const generateExceptionQuestion = () => {
  const pairs = [
    { elements: ['N', 'O'], correct: 'N', reason: 'N has half-filled 2p subshell (more stable)' },
    { elements: ['Be', 'B'], correct: 'Be', reason: 'Be has full 2s subshell (more stable)' },
    { elements: ['Mg', 'Al'], correct: 'Mg', reason: 'Mg has full 3s subshell (more stable)' }
  ];
  const pair = pairs[getRandomInt(pairs.length)];
  
  return {
    type: 'exception',
    question: `Which has higher ionization energy: ${pair.elements[0]} or ${pair.elements[1]}?`,
    options: pair.elements,
    correct: pair.correct,
    explanation: `${pair.correct} has higher IE because ${pair.reason}.`
  };
};

const IonizationEnergyActivity = ({ onBack }) => {
  const [showTable, setShowTable] = useState(false);
  const [question, setQuestion] = useState(() => {
    const generators = [generateTrendQuestion, generateRankQuestion, generateExceptionQuestion];
    return generators[getRandomInt(generators.length)]();
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowFeedback(true);
  };

  const handleNext = () => {
    const generators = [generateTrendQuestion, generateRankQuestion, generateExceptionQuestion];
    setQuestion(generators[getRandomInt(generators.length)]());
    setUserAnswer('');
    setShowFeedback(false);
  };

  return (
    <div className="ie-activity-root">
      <h2>Ionization Energy Practice</h2>
      
      <button 
        className="ptable-btn" 
        onClick={() => setShowTable(true)}
      >
        Periodic Table Reference
      </button>

      <div className="ie-question-card">
        <div className="ie-question">{question.question}</div>
        
        <form onSubmit={handleSubmit}>
          {question.type === 'compare' || question.type === 'exception' ? (
            <div className="ie-options">
              {question.options.map(opt => (
                <label key={opt} className="ie-option">
                  <input
                    type="radio"
                    name="answer"
                    value={opt}
                    checked={userAnswer === opt}
                    onChange={() => setUserAnswer(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <select 
              className="ie-select"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            >
              <option value="">Select ranking</option>
              {question.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          
          <button type="submit" disabled={!userAnswer}>Submit</button>
        </form>

        {showFeedback && (
          <div className="ie-feedback">
            {userAnswer === question.correct ? (
              <div className="correct">Correct! {question.explanation}</div>
            ) : (
              <div className="incorrect">
                Incorrect. The correct answer is: {question.correct}. {question.explanation}
              </div>
            )}
            <button onClick={handleNext}>Next Question</button>
          </div>
        )}
      </div>

      {showTable && (
        <div className="ie-table-modal">
          <div className="ie-table-container">
            <PeriodicTable onBack={() => setShowTable(false)} />
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>Back to Topics</button>
    </div>
  );
};

export default IonizationEnergyActivity;
