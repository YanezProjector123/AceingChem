import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';
import periodicTable from './periodic-table.json';

function getRandomElementWithConfig() {
  const elements = periodicTable.filter(e => typeof e.electronConfiguration === 'string' && e.electronConfiguration.length > 0);
  return elements[Math.floor(Math.random() * elements.length)];
}

function getConfigEnding(config) {
  if (!config) return '';
  const parts = config.trim().split(' ');
  return parts[parts.length - 1];
}

export default function ElectronConfigurationActivity({ onBack, onShowPeriodicTable }) {
  const [question, setQuestion] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  function generateQuestion() {
    // Randomly choose question type
    if (Math.random() < 0.5) {
      // Type 1: Which element has this config ending?
      const el = getRandomElementWithConfig();
      const ending = getConfigEnding(el.electronConfiguration);
      // Pick 2 distractors
      const pool = periodicTable.filter(e => e.symbol !== el.symbol && typeof e.electronConfiguration === 'string');
      const distractors = [];
      while (distractors.length < 2 && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        const d = pool[idx];
        if (!distractors.some(x => x.symbol === d.symbol)) distractors.push(d);
        pool.splice(idx, 1);
      }
      const options = [el, ...distractors].map(e => e.symbol);
      return {
        type: 'identify-element',
        prompt: `Which element has an electron configuration ending in ...${ending}?`,
        options: shuffle(options),
        answer: el.symbol,
        explanation: `${el.name} (${el.symbol}) has configuration ending ${ending}.`,
      };
    } else {
      // Type 2: What is the electron configuration of this element?
      const el = getRandomElementWithConfig();
      // Pick 2 distractors
      const pool = periodicTable.filter(e => e.symbol !== el.symbol && typeof e.electronConfiguration === 'string');
      const distractors = [];
      while (distractors.length < 2 && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        const d = pool[idx];
        if (!distractors.some(x => x.electronConfiguration === d.electronConfiguration)) distractors.push(d);
        pool.splice(idx, 1);
      }
      const options = [el, ...distractors].map(e => e.electronConfiguration);
      return {
        type: 'identify-config',
        prompt: `What is the electron configuration of ${el.name} (${el.symbol})?`,
        options: shuffle(options),
        answer: el.electronConfiguration,
        explanation: `${el.name} (${el.symbol}) has configuration ${el.electronConfiguration}.`,
      };
    }
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (userAnswer === question.answer) {
      setFeedback({ correct: true, explanation: question.explanation });
    } else {
      setFeedback({ correct: false, explanation: question.explanation });
    }
  }

  function handleNext() {
    setQuestion(generateQuestion());
    setUserAnswer('');
    setFeedback(null);
  }

  return (
    <div className="activity-container fade-in slide-up" style={{ maxWidth: 500, margin: '0 auto', background: '#f3f4f6', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px #23234a33' }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.5em', color: '#23234a', marginBottom: 18 }}>Electron Configuration Activity</h2>
      <button className="ptable-btn" style={{ marginBottom: 18 }} onClick={onShowPeriodicTable}>Show Periodic Table</button>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18, fontWeight: 600 }}>{question.prompt}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map((opt, i) => (
            <label key={i} style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', boxShadow: '0 1px 4px #23234a11', cursor: 'pointer' }}>
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={userAnswer === opt}
                onChange={() => setUserAnswer(opt)}
                style={{ marginRight: 10 }}
              />
              {opt}
            </label>
          ))}
        </div>
        <button className="ptable-btn" type="submit" style={{ marginTop: 18, width: '100%' }} disabled={!userAnswer || feedback}>Submit</button>
      </form>
      {feedback && (
        <div style={{ marginTop: 18, color: feedback.correct ? '#059669' : '#dc2626', fontWeight: 600 }}>
          {feedback.correct ? 'Correct!' : 'Incorrect.'} <br />
          <span style={{ color: '#23234a', fontWeight: 400 }}>{feedback.explanation}</span>
          <button className="ptable-btn" style={{ marginTop: 16 }} onClick={handleNext}>Next Question</button>
        </div>
      )}
      <button className="back-btn" onClick={onBack} style={{ marginTop: 28, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a22' }}>Back</button>
    </div>
  );
} 