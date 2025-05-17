import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';
import periodicTable from './periodic-table.json';

// Helper function to get elements filtered by group, period, or difficulty
function getElementsByDifficulty(difficulty = 0) {
  const elements = periodicTable.filter(e => typeof e.electronConfiguration === 'string' && e.electronConfiguration.length > 0);
  
  if (difficulty === 0) { // Basic - main group elements from periods 1-3
    return elements.filter(e => e.group && (e.group < 3 || e.group > 12) && e.period <= 3);
  } else if (difficulty === 1) { // Intermediate - main group elements from periods 1-4
    return elements.filter(e => e.group && (e.group < 3 || e.group > 12) && e.period <= 4);
  } else if (difficulty === 2) { // Advanced - includes transition metals, periods 1-5
    return elements.filter(e => e.period <= 5);
  } else { // Challenging - all elements including lanthanides and actinides
    return elements;
  }
}

function getRandomElementWithConfig(difficulty = null) {
  const elements = getElementsByDifficulty(difficulty);
  return elements[Math.floor(Math.random() * elements.length)];
}

function getConfigEnding(config) {
  if (!config) return '';
  const parts = config.trim().split(' ');
  return parts[parts.length - 1];
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

export default function ElectronConfigurationActivity({ onBack, onShowPeriodicTable }) {
  const [question, setQuestion] = useState(() => generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  // State to track selected difficulty level
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  function generateQuestion(difficultyOverride = null) {
    // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
    const problemType = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
    
    // Randomly choose question type based on difficulty
    // For basic difficulty, we'll focus more on straightforward identification
    const questionType = (problemType === 0) ? (Math.random() < 0.7 ? 'identify-config' : 'identify-element') :
                         (Math.random() < 0.5 ? 'identify-element' : 'identify-config');
    
    if (questionType === 'identify-element') {
      // Type 1: Which element has this config ending?
      const el = getRandomElementWithConfig(problemType);
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
      // Add educational context for higher difficulties
      let contextPrefix = '';
      if (problemType >= 2) {
        const contexts = [
          'Based on orbital filling order, ',
          'From its position in the periodic table, ',
          'Looking at its electron structure, ',
          'Considering the aufbau principle, '
        ];
        contextPrefix = contexts[Math.floor(Math.random() * contexts.length)];
      }
      
      // Generate more or fewer distractors based on difficulty
      const numDistractors = problemType === 0 ? 2 : (problemType === 1 ? 3 : 4);
      
      return {
        type: 'identify-element',
        prompt: `${contextPrefix}Which element has an electron configuration ending in ...${ending}?`,
        options: shuffle(options),
        answer: el.symbol,
        explanation: `${el.name} (${el.symbol}) has configuration ending ${ending}.`,
        problemType // Include problem type for difficulty tracking
      };
    } else {
      // Type 2: What is the electron configuration of this element?
      const el = getRandomElementWithConfig(problemType);
      
      // Add educational context for higher difficulties
      let contextPrefix = '';
      if (problemType >= 2) {
        const contexts = [
          'Using the aufbau principle, ',
          'Following the electron configuration rules, ',
          'Based on its position in period ${el.period}, ',
          'As a ${el.category} element, '
        ];
        contextPrefix = contexts[Math.floor(Math.random() * contexts.length)];
      }
      
      // Pick distractors based on difficulty
      const pool = periodicTable.filter(e => e.symbol !== el.symbol && typeof e.electronConfiguration === 'string');
      // For higher difficulties, choose distractors from same group/period for more challenge
      const filteredPool = problemType >= 2 ? 
        pool.filter(e => e.group === el.group || e.period === el.period || Math.abs(e.atomicNumber - el.atomicNumber) < 5) : 
        pool;
      
      const distractors = [];
      const numDistractors = problemType <= 1 ? 2 : 3;
      while (distractors.length < numDistractors && filteredPool.length > 0) {
        const idx = Math.floor(Math.random() * filteredPool.length);
        const d = filteredPool[idx];
        if (!distractors.some(x => x.electronConfiguration === d.electronConfiguration)) distractors.push(d);
        filteredPool.splice(idx, 1);
      }
      
      const options = [el, ...distractors].map(e => e.electronConfiguration);
      return {
        type: 'identify-config',
        prompt: `${contextPrefix}What is the electron configuration of ${el.name} (${el.symbol})?`,
        options: shuffle(options),
        answer: el.electronConfiguration,
        explanation: `${el.name} (${el.symbol}) has configuration ${el.electronConfiguration}.`,
        problemType // Include problem type for difficulty tracking
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
    setQuestion(generateQuestion(selectedDifficulty));
    setUserAnswer('');
    setFeedback(null);
  }
  
  function handleDifficultyChange(level) {
    setSelectedDifficulty(level);
    setQuestion(generateQuestion(level));
    setUserAnswer('');
    setFeedback(null);
  }

  return (
    <div className="activity-container fade-in slide-up" style={{ maxWidth: 500, margin: '0 auto', background: '#f3f4f6', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px #23234a33' }}>
      <h2 style={{ fontWeight: 700, fontSize: '1.5em', color: '#23234a', marginBottom: 18 }}>Electron Configuration Activity</h2>
      
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
          {feedback.correct ? 
            [
              'Excellent! You got it right.',
              'Great job! That is correct.',
              'Perfect! You have a solid understanding of electron configurations.',
              'Outstanding work! You\'ve mastered this electron configuration.'
            ][question.problemType || 0] : 
            'That\'s not correct.'} <br />
          <span style={{ color: '#23234a', fontWeight: 400 }}>
            {feedback.explanation}
            {!feedback.correct && question.problemType >= 1 && (
              <span>
                <br/><br/>
                {question.problemType === 1 && 'Remember that electron configurations are built following the Aufbau principle, with orbitals filling in order of increasing energy.'}
                {question.problemType === 2 && 'Make sure to pay attention to the orbital filling order and exceptions due to half-filled and filled subshells.'}
                {question.problemType === 3 && 'For complex elements, remember that transition metals and heavy elements can have electron configuration exceptions due to stability of half-filled and filled d and f subshells.'}
              </span>
            )}
          </span>
          <button className="ptable-btn" style={{ marginTop: 16 }} onClick={handleNext}>Next Question</button>
        </div>
      )}
      <button className="back-btn" onClick={onBack} style={{ marginTop: 28, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a22' }}>Back</button>
    </div>
  );
} 