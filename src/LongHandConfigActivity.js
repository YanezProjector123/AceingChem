import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ShortHandConfigActivity.css';
import {
  configToSuperscript,
  normalizeIndividualToken,
  FeedbackVisual,
  IS_VALID_SUBSHELL_REGEX,
} from './ActivityUtils';

// Provided longhand configuration data
const LONG_CONFIGS = {
  "H": "1s1",
  "He": "1s2",
  "Li": "1s2 2s1",
  "Be": "1s2 2s2",
  "B": "1s2 2s2 2p1",
  "C": "1s2 2s2 2p2",
  "N": "1s2 2s2 2p3",
  "O": "1s2 2s2 2p4",
  "F": "1s2 2s2 2p5",
  "Ne": "1s2 2s2 2p6",
  "Na": "1s2 2s2 2p6 3s1",
  "Mg": "1s2 2s2 2p6 3s2",
  "Al": "1s2 2s2 2p6 3s2 3p1",
  "Si": "1s2 2s2 2p6 3s2 3p2",
  "P": "1s2 2s2 2p6 3s2 3p3",
  "S": "1s2 2s2 2p6 3s2 3p4",
  "Cl": "1s2 2s2 2p6 3s2 3p5",
  "Ar": "1s2 2s2 2p6 3s2 3p6",
  "K": "1s2 2s2 2p6 3s2 3p6 4s1",
  "Ca": "1s2 2s2 2p6 3s2 3p6 4s2",
  "Sc": "1s2 2s2 2p6 3s2 3p6 4s2 3d1",
  "Ti": "1s2 2s2 2p6 3s2 3p6 4s2 3d2",
  "V": "1s2 2s2 2p6 3s2 3p6 4s2 3d3",
  "Mn": "1s2 2s2 2p6 3s2 3p6 4s2 3d5",
  "Fe": "1s2 2s2 2p6 3s2 3p6 4s2 3d6",
  "Co": "1s2 2s2 2p6 3s2 3p6 4s2 3d7",
  "Ni": "1s2 2s2 2p6 3s2 3p6 4s2 3d8",
  "Cu": "1s2 2s2 2p6 3s2 3p6 4s2 3d9",
  "Zn": "1s2 2s2 2p6 3s2 3p6 4s2 3d10",
  "Ga": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p1",
  "Ge": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p2",
  "As": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p3",
  "Se": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p4",
  "Br": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p5",
  "Kr": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6"
};

// Utility to reorder orbitals in a configuration string to s-p-d-f order
function reorderOrbitals(config) {
  const tokens = config.split(/\s+/);
  const s = [], p = [], d = [], f = [], other = [];
  tokens.forEach(token => {
    if (/s\d+$/.test(token)) s.push(token);
    else if (/p\d+$/.test(token)) p.push(token);
    else if (/d\d+$/.test(token)) d.push(token);
    else if (/f\d+$/.test(token)) f.push(token);
    else other.push(token);
  });
  const ordered = [...s, ...p, ...d, ...f, ...other];
  return ordered.join(' ');
}

// Normalize a configuration string for answer checking
function normalizeConfig(config) {
  let str = config.replace(/\s+/g, '');
  let match = str.match(/^(\[[^\]]+\])(.+)$/i);
  let core = '', rest = '';
  if (match) {
    core = match[1].toUpperCase();
    rest = match[2];
  } else {
    rest = str;
  }
  let spaced = (core ? core + ' ' : '') + rest;
  return reorderOrbitals(spaced)
    .replace(/([spdf])([⁰¹²³⁴⁵⁶⁷⁸⁹\d]+)/gi, (m, orb, num) => orb.toLowerCase() + num
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, d => '0123456789'['⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(d)]))
    .replace(/\s+/g, ' ')
    .trim();
}

const ELEMENTS = Object.entries(LONG_CONFIGS).map(([element, configuration], i) => ({
  element,
  atomicNumber: i + 1,
  configuration: reorderOrbitals(configuration)
}));

const QUESTION_TYPES = [
  'element-to-config',
  'config-to-element',
  'fill-in-blank'
];

function getRandomQuestionType(usedTypes) {
  const unused = QUESTION_TYPES.filter(t => !usedTypes.includes(t));
  if (unused.length > 0) return unused[Math.floor(Math.random() * unused.length)];
  return QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
}

function getRandomElement(remaining) {
  return remaining[Math.floor(Math.random() * remaining.length)];
}

function generateDistractorConfigs(correctConfig, allConfigs) {
  const distractors = new Set();
  const tokens = correctConfig.split(/\s+/);
  const s = [], p = [], d = [], f = [], other = [];
  tokens.forEach(token => {
    if (/s\d+$/.test(token)) s.push(token);
    else if (/p\d+$/.test(token)) p.push(token);
    else if (/d\d+$/.test(token)) d.push(token);
    else if (/f\d+$/.test(token)) f.push(token);
    else other.push(token);
  });
  if (p.length > 0) distractors.add([...p, ...s, ...d, ...f, ...other].join(' '));
  if (d.length > 0) distractors.add([...s, ...d, ...p, ...f, ...other].join(' '));
  tokens.forEach((token, idx) => {
    const match = token.match(/^(\d+[spdf])(\d+)$/);
    if (match) {
      const n = parseInt(match[2], 10);
      if (n > 1) {
        const arr = [...tokens];
        arr[idx] = match[1] + (n - 1);
        distractors.add(arr.join(' '));
      }
      if (n < 14) {
        const arr = [...tokens];
        arr[idx] = match[1] + (n + 1);
        distractors.add(arr.join(' '));
      }
    }
  });
  for (let cfg of allConfigs) {
    if (cfg !== correctConfig && !distractors.has(cfg)) {
      distractors.add(cfg);
      if (distractors.size >= 6) break;
    }
  }
  distractors.delete(correctConfig);
  return Array.from(distractors).slice(0, 3);
}

// NEW: Constructive feedback function for Long-Hand
function getConstructiveFeedbackLongHand(questionData, userAnswer, isCorrect, difficulty = 0) {
  const originalCorrectAnswer = questionData.correct; // e.g., "1s2 2s2 2p4"

  if (isCorrect) {
    // Provide more detailed feedback based on difficulty level
    let message, tip;
    
    switch(difficulty) {
      case 0:
        message = 'Correct! You got it right.';
        tip = 'You correctly wrote the basic full electron configuration.';
        break;
      case 1:
        message = 'Great job! You nailed this intermediate problem.';
        tip = 'You correctly identified all subshells and electron distribution.';
        break;
      case 2:
        message = 'Excellent work! You mastered this advanced configuration.';
        tip = 'You accurately handled the more complex electron configuration patterns.';
        break;
      case 3:
        message = 'Outstanding! Perfect answer on this challenging problem.';
        tip = 'You demonstrated expert knowledge of electron configurations.';
        break;
      default:
        message = 'Correct!';
        tip = 'Great job! You wrote the full electron configuration in the correct order.';
    }
    
    return {
      type: 'correct',
      userAnswer,
      message,
      correct: originalCorrectAnswer,
      tip,
      missing: [], extra: [], howTo: [] // Ensure all fields for FeedbackVisual
    };
  }

  // For incorrect answers:
  const correctTokens = originalCorrectAnswer.split(/\s+/).filter(Boolean);
  const rawUserTokens = userAnswer.trim().split(/\s+/).filter(Boolean);

  const normalizedCorrectTokensForComparison = correctTokens.map(normalizeIndividualToken);
  const normalizedUserTokensForComparison = rawUserTokens.map(normalizeIndividualToken);

  const missing = [];
  const correctTokenSetForComparison = new Set(normalizedCorrectTokensForComparison);

  normalizedCorrectTokensForComparison.forEach((normCorrectToken, index) => {
    if (!normalizedUserTokensForComparison.includes(normCorrectToken)) {
      missing.push(correctTokens[index]);
    }
  });

  const userTokenIssues = [];
  rawUserTokens.forEach(rawUserToken => {
    const normalizedUserToken = normalizeIndividualToken(rawUserToken);
    if (!correctTokenSetForComparison.has(normalizedUserToken)) {
      let issue = '';
      const displayToken = configToSuperscript(rawUserToken);
      // For long-hand, we don't expect noble gas cores in the answer.
      if (IS_VALID_SUBSHELL_REGEX.test(normalizeIndividualToken(rawUserToken))) {
        issue = `Subshell <code>${displayToken}</code> is extra or incorrect for this element.`;
      } else if (/^\[[a-zA-Z]+\]$/.test(rawUserToken)) { // Check if it looks like a noble gas core
        issue = `<code>${displayToken}</code> is a noble gas core. For long-hand configuration, write out all subshells.`;
      } else {
        issue = `<code>${displayToken}</code> is not a recognized subshell format (e.g., 1s2, 2p6).`;
      }
      userTokenIssues.push(issue);
    }
  });

  // How to build for long-hand is just listing the correct subshells.
  const howTo = [];
  if (correctTokens.length > 0) {
    howTo.push({
      step: 1,
      text: 'The correct long-hand configuration lists subshells in this order:',
      code: correctTokens, // Array of original formatted strings
      explanation: 'Ensure electron counts are correct for each subshell.'
    });
  }
  
  // Adjust the feedback message based on difficulty level
  let message = 'Incorrect. Please review the details:';
  let tip = 'Write the full configuration from 1s onwards. Ensure subshells (s, p, d, f) are in the correct order of filling and have the correct number of electrons.';
  
  switch(difficulty) {
    case 0:
      message = 'Not quite right. Let\'s review:';
      tip += ' For basic configurations, focus on the main s and p subshells.';
      break;
    case 1:
      message = 'Incorrect. Let\'s analyze your answer:';
      tip += ' At this intermediate level, pay attention to the filling order of orbitals.';
      break;
    case 2:
      message = 'That\'s not correct. Here\'s a detailed analysis:';
      tip += ' For advanced configurations, remember the aufbau principle and diagonal filling.';
      break;
    case 3:
      message = 'Challenging! Your answer needs some adjustments:';
      tip += ' At this level, precision in electron distribution is crucial.';
      break;
  }
  
  return {
    type: 'incorrect',
    userAnswer,
    message,
    correct: originalCorrectAnswer,
    tip,
    missing,
    extra: userTokenIssues,
    howTo
  };
}

function LongHandConfigActivity({ onBack, onPeriodicTable, savedState, setSavedState }) {
  // Add difficulty selection state consistent with other activities
  const [selectedDifficulty, setSelectedDifficulty] = useState(savedState?.selectedDifficulty || 0);
  
  const [remaining, setRemaining] = useState(savedState?.remaining || ELEMENTS.slice());
  const [used, setUsed] = useState(savedState?.used || []);
  const [usedTypes, setUsedTypes] = useState(savedState?.usedTypes || []);
  const [question, setQuestion] = useState(savedState?.question || null);
  const [userAnswer, setUserAnswer] = useState(savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(savedState?.showFeedback || false);
  const inputRef = useRef(null);
  
  // Helper function to get difficulty text
  const getDifficultyText = (level) => {
    switch(level) {
      case 0: return 'Basic';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      case 3: return 'Challenging';
      default: return 'Basic';
    }
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    // Reset the current activity state with the new difficulty
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    // Generate a new question with this difficulty level
    generateQuestion(level);
  };

  useEffect(() => {
    if (setSavedState) {
      setSavedState({ remaining, used, usedTypes, question, userAnswer, feedback, showFeedback, selectedDifficulty });
    }
  }, [remaining, used, usedTypes, question, userAnswer, feedback, showFeedback, setSavedState, selectedDifficulty]);

  const generateQuestion = (difficultyLevel = selectedDifficulty) => {
    let nextElements = remaining;
    let nextUsed = used;
    let nextUsedTypes = usedTypes;
    if (nextElements.length === 0) {
      nextElements = ELEMENTS.slice();
      nextUsed = [];
      nextUsedTypes = [];
    }
    
    // Filter elements based on difficulty level
    let availableElements = [...nextElements];
    if (difficultyLevel === 0) { // Basic - first 10 elements
      availableElements = availableElements.filter(el => el.atomicNumber <= 10);
    } else if (difficultyLevel === 1) { // Intermediate - first 20 elements
      availableElements = availableElements.filter(el => el.atomicNumber <= 20);
    } else if (difficultyLevel === 2) { // Advanced - first 30 elements
      availableElements = availableElements.filter(el => el.atomicNumber <= 30);
    }
    // Difficulty 3 (Challenging) will use all elements
    
    // If no elements are available for this difficulty, use all elements
    if (availableElements.length === 0) {
      availableElements = nextElements;
    }
    
    const el = getRandomElement(availableElements);
    const qType = getRandomQuestionType(nextUsedTypes);
    setRemaining(nextElements.filter(e => e !== el));
    setUsed([...nextUsed, el]);
    setUsedTypes([...nextUsedTypes, qType].slice(-QUESTION_TYPES.length));
    
    // Store difficulty in the question object
    let q = { type: qType, el, difficulty: difficultyLevel };
    
    // Adjust question content based on difficulty
    if (qType === 'element-to-config') {
      const correct = reorderOrbitals(el.configuration);
      const allConfigs = ELEMENTS.map(e => reorderOrbitals(e.configuration));
      const distractors = generateDistractorConfigs(correct, allConfigs);
      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
      
      // Adjust prompt based on difficulty
      if (difficultyLevel >= 2) {
        q.prompt = `What is the long hand electron configuration for ${el.element} (Z=${el.atomicNumber})?`;
      } else {
        q.prompt = `What is the long hand electron configuration for ${el.element} (Atomic Number: ${el.atomicNumber})?`;
      }
      
      q.options = options;
      q.correct = correct;
    } else if (qType === 'config-to-element') {
      // Create more challenging distractors for higher difficulties
      let distractorCount = difficultyLevel === 0 ? 2 : 3;
      
      const options = [el.element, ...ELEMENTS.filter(e => e !== el)
        .sort(() => 0.5 - Math.random())
        .slice(0, distractorCount)
        .map(e => e.element)]
        .sort(() => Math.random() - 0.5);
      
      q.prompt = `Which element has the configuration: ${configToSuperscript(reorderOrbitals(el.configuration))}?`;
      q.options = options;
      q.correct = el.element;
    } else { // fill-in-blank
      if (difficultyLevel === 0) {
        q.prompt = `Type the long hand electron configuration for ${el.element} (Atomic Number: ${el.atomicNumber}):`;
      } else if (difficultyLevel >= 2) {
        q.prompt = `Write the complete electron configuration for ${el.element} (Z=${el.atomicNumber}):`;
      } else {
        q.prompt = `Enter the electron configuration for ${el.element} (Atomic Number: ${el.atomicNumber}):`;
      }
      q.correct = reorderOrbitals(el.configuration);
    }
    
    setQuestion(q);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
  };

  useEffect(() => {
    if (!question) generateQuestion();
  }, [question, generateQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question) return;

    let isCorrect = (question.type === 'fill-in-blank') 
      ? normalizeConfig(userAnswer) === normalizeConfig(question.correct)
      : userAnswer === question.correct;

    // Pass difficulty level to feedback function
    setFeedback(getConstructiveFeedbackLongHand(question, userAnswer, isCorrect, question.difficulty || selectedDifficulty));
    setShowFeedback(true);
  };

  const handleNext = () => {
    // Maintain the selected difficulty when generating a new question
    generateQuestion(selectedDifficulty);
  };

  const handleInsertOpenBracket = () => {
    setUserAnswer(prev => prev + '[');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInsertCloseBracket = () => {
    setUserAnswer(prev => prev + ']');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="shc-activity-bg">
      <div className="shc-card">
        <h2 className="shc-title">
          <span role="img" aria-label="longhand" className="shc-title-icon">📝</span>
          Complete Electron Configuration
        </h2>
        
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
        
        {/* Difficulty indicator */}
        {question && question.difficulty !== undefined && (
          <div style={{
            display: 'inline-block',
            background: question.difficulty === 0 ? '#4ade80' : 
                       question.difficulty === 1 ? '#60a5fa' : 
                       question.difficulty === 2 ? '#a78bfa' : '#f87171',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.85em',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '10px'
          }}>
            {getDifficultyText(question.difficulty)}
          </div>
        )}
        {question && (
          <div key={question.prompt + (showFeedback ? '-feedback' : '-question')} className="shc-question-animate">
            <form onSubmit={handleSubmit} className="shc-form">
              <div className="shc-prompt">{question.prompt}</div>
              {question.type === 'fill-in-blank' ? (
                <div className="shc-input-section">
                  <div className="shc-input-row">
                    <input
                      type="text"
                      className="shc-input"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      disabled={showFeedback}
                      autoFocus
                      autoComplete="off"
                      placeholder="e.g. 1s2 2s2 2p1"
                      ref={inputRef}
                    />
                  </div>
                  <div className="shc-bracket-buttons-row">
                    <button type="button" onClick={handleInsertOpenBracket} className="shc-bracket-button shc-bracket-button-open">
                      [
                    </button>
                    <button type="button" onClick={handleInsertCloseBracket} className="shc-bracket-button shc-bracket-button-close">
                      ]
                    </button>
                  </div>
                  <div className="shc-superscript-preview">
                    {userAnswer && configToSuperscript(userAnswer)}
                  </div>
                </div>
              ) : (
                <div className="shc-options">
                  {question.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      className={`shc-option-btn${userAnswer === opt ? ' selected' : ''}`}
                      onClick={() => !showFeedback && setUserAnswer(opt)}
                      disabled={showFeedback}
                      style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
                    >
                      {question.type === 'config-to-element' ? opt : configToSuperscript(opt)}
                    </button>
                  ))}
                </div>
              )}
              {!showFeedback && (
                <button type="submit" className="shc-submit-btn" disabled={!userAnswer}>
                  Submit
                </button>
              )}
            </form>
          </div>
        )}
        {showFeedback && feedback && (
          <FeedbackVisual feedback={feedback} />
        )}
        {showFeedback && (
          <button type="button" className="shc-next-btn shc-question-animate" onClick={handleNext}>
            Next
          </button>
        )}
        <div className="shc-action-row">
          <button type="button" className="shc-action-btn" onClick={onPeriodicTable}>
            Periodic Table
          </button>
          <button type="button" className="shc-action-btn shc-back-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

LongHandConfigActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func
};

export default LongHandConfigActivity; 