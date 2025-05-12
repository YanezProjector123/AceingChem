import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './ShortHandConfigActivity.css';
import {
  configToSuperscript,
  normalizeIndividualToken,
  FeedbackVisual,
  IS_VALID_SUBSHELL_REGEX,
  IS_NOBLE_GAS_REGEX
} from './ActivityUtils'; // Import shared utilities

// Utility to reorder orbitals in a configuration string to s-p-d-f order
function reorderOrbitals(config) {
  // Split config into tokens (e.g., [Ne], 3s2, 3p6, etc.)
  const tokens = config.split(/\s+/);
  const core = tokens[0].startsWith('[') ? tokens.shift() : null;
  // Group by orbital type
  const s = [], p = [], d = [], f = [], other = [];
  tokens.forEach(token => {
    if (/s\d+$/.test(token)) s.push(token);
    else if (/p\d+$/.test(token)) p.push(token);
    else if (/d\d+$/.test(token)) d.push(token);
    else if (/f\d+$/.test(token)) f.push(token);
    else other.push(token);
  });
  const ordered = [...s, ...p, ...d, ...f, ...other];
  return [core, ...ordered].filter(Boolean).join(' ');
}

// --- ENSURE ALL CONFIGURATIONS IN ELEMENTS ARE s p d f ORDER ---
const ELEMENTS = [
  { element: 'H', atomicNumber: 1, configuration: reorderOrbitals('1s1') },
  { element: 'He', atomicNumber: 2, configuration: reorderOrbitals('1s2') },
  { element: 'Li', atomicNumber: 3, configuration: reorderOrbitals('[He] 2s1') },
  { element: 'Be', atomicNumber: 4, configuration: reorderOrbitals('[He] 2s2') },
  { element: 'B', atomicNumber: 5, configuration: reorderOrbitals('[He] 2s2 2p1') },
  { element: 'C', atomicNumber: 6, configuration: reorderOrbitals('[He] 2s2 2p2') },
  { element: 'N', atomicNumber: 7, configuration: reorderOrbitals('[He] 2s2 2p3') },
  { element: 'O', atomicNumber: 8, configuration: reorderOrbitals('[He] 2s2 2p4') },
  { element: 'F', atomicNumber: 9, configuration: reorderOrbitals('[He] 2s2 2p5') },
  { element: 'Ne', atomicNumber: 10, configuration: reorderOrbitals('[He] 2s2 2p6') },
  { element: 'Na', atomicNumber: 11, configuration: reorderOrbitals('[Ne] 3s1') },
  { element: 'Mg', atomicNumber: 12, configuration: reorderOrbitals('[Ne] 3s2') },
  { element: 'Al', atomicNumber: 13, configuration: reorderOrbitals('[Ne] 3s2 3p1') },
  { element: 'Si', atomicNumber: 14, configuration: reorderOrbitals('[Ne] 3s2 3p2') },
  { element: 'P', atomicNumber: 15, configuration: reorderOrbitals('[Ne] 3s2 3p3') },
  { element: 'S', atomicNumber: 16, configuration: reorderOrbitals('[Ne] 3s2 3p4') },
  { element: 'Cl', atomicNumber: 17, configuration: reorderOrbitals('[Ne] 3s2 3p5') },
  { element: 'Ar', atomicNumber: 18, configuration: reorderOrbitals('[Ne] 3s2 3p6') },
  { element: 'K', atomicNumber: 19, configuration: reorderOrbitals('[Ar] 4s1') },
  { element: 'Ca', atomicNumber: 20, configuration: reorderOrbitals('[Ar] 4s2') },
  { element: 'Sc', atomicNumber: 21, configuration: reorderOrbitals('[Ar] 3d1 4s2') },
  { element: 'Ti', atomicNumber: 22, configuration: reorderOrbitals('[Ar] 3d2 4s2') },
  { element: 'V', atomicNumber: 23, configuration: reorderOrbitals('[Ar] 3d3 4s2') },
  { element: 'Mn', atomicNumber: 25, configuration: reorderOrbitals('[Ar] 3d5 4s2') },
  { element: 'Fe', atomicNumber: 26, configuration: reorderOrbitals('[Ar] 3d6 4s2') },
  { element: 'Co', atomicNumber: 27, configuration: reorderOrbitals('[Ar] 3d7 4s2') },
  { element: 'Ni', atomicNumber: 28, configuration: reorderOrbitals('[Ar] 3d8 4s2') },
  { element: 'Zn', atomicNumber: 30, configuration: reorderOrbitals('[Ar] 3d10 4s2') },
  { element: 'Br', atomicNumber: 35, configuration: reorderOrbitals('[Ar] 3d10 4s2 4p5') },
  { element: 'Kr', atomicNumber: 36, configuration: reorderOrbitals('[Ar] 3d10 4s2 4p6') },
  { element: 'Sn', atomicNumber: 50, configuration: reorderOrbitals('[Kr] 4d10 5s2 5p2') },
  { element: 'I', atomicNumber: 53, configuration: reorderOrbitals('[Kr] 4d10 5s2 5p5') },
  { element: 'Xe', atomicNumber: 54, configuration: reorderOrbitals('[Kr] 4d10 5s2 5p6') },
  { element: 'Hg', atomicNumber: 80, configuration: reorderOrbitals('[Xe] 4f14 5d10 6s2') },
  { element: 'Pb', atomicNumber: 82, configuration: reorderOrbitals('[Xe] 4f14 5d10 6s2 6p2') }
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const QUESTION_TYPES = [
  'element-to-config', // Given element, pick config
  'config-to-element', // Given config, pick element
  'fill-in-blank'      // Given element, type config
];

function getRandomQuestionType(usedTypes) {
  // Try to rotate types for variety
  const unused = QUESTION_TYPES.filter(t => !usedTypes.includes(t));
  if (unused.length > 0) return unused[Math.floor(Math.random() * unused.length)];
  return QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
}

function getRandomElement(remaining) {
  return remaining[Math.floor(Math.random() * remaining.length)];
}

function getConstructiveFeedback(q, userAnswer, isCorrect) {
  if (isCorrect) {
    return {
      type: 'correct',
      userAnswer,
      message: q.type === 'element-to-config'
        ? 'Great job! Remember: Use the noble gas core closest to but less than the atomic number, then fill the remaining electrons in order.'
        : q.type === 'config-to-element'
        ? 'Correct! To identify the element, count the total electrons in the configuration or look for the highest energy subshell.'
        : 'Excellent! Double-check your spacing and subshell order for full credit on exams.',
      correct: q.correct,
      tip: null,
      missing: [],
      extra: [],
      howTo: []
    };
  }

  if (q.type === 'config-to-element') {
    return {
      type: 'incorrect',
      userAnswer,
      message: 'Incorrect.',
      correct: q.correct,
      tip: 'Count the total electrons in the configuration, or look for the highest energy subshell to identify the element. The periodic table can help!',
      missing: [],
      extra: [],
      howTo: []
    };
  }

  const originalCorrectAnswer = q.correct;
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
      if (IS_NOBLE_GAS_REGEX.test(rawUserToken)) {
        issue = `Noble gas core <code>${displayToken}</code> is not part of the correct configuration.`;
      } else if (IS_VALID_SUBSHELL_REGEX.test(normalizeIndividualToken(rawUserToken))) {
        issue = `Subshell <code>${displayToken}</code> is extra or incorrect.`;
      } else {
        issue = `<code>${displayToken}</code> is not a recognized noble gas core or a valid subshell format (e.g., 2s2, [Ar]).`;
      }
      userTokenIssues.push(issue);
    }
  });
  let nobleGasCoreFromCorrect = '';
  let nobleGasMatch = originalCorrectAnswer.match(IS_NOBLE_GAS_REGEX);
  if (nobleGasMatch) nobleGasCoreFromCorrect = nobleGasMatch[0];
  let howTo = [];
  const remainingCorrectSubshells = correctTokens.filter(t => !IS_NOBLE_GAS_REGEX.test(t));
  if (nobleGasCoreFromCorrect) {
    howTo.push({
      step: 1, text: 'Find the noble gas core:', code: nobleGasCoreFromCorrect,
      explanation: 'This represents all electrons up to that noble gas.'
    });
    if (remainingCorrectSubshells.length > 0) {
      howTo.push({ step: 2, text: 'Add the remaining subshells in order:', code: remainingCorrectSubshells, explanation: null });
    }
  } else {
    if (remainingCorrectSubshells.length > 0) {
      howTo.push({ step: 1, text: 'List all subshells in order:', code: remainingCorrectSubshells, explanation: null });
    }
  }
  return {
    type: 'incorrect', userAnswer, message: 'Incorrect. Review the details below:',
    correct: originalCorrectAnswer,
    tip: 'Always start with the noble gas core in brackets (if needed), then add the remaining electrons in s, p, d, f order. Ensure correct subshell format (e.g., 2s2, 3p5) and electron counts. Use the periodic table for help!',
    missing, extra: userTokenIssues, howTo
  };
}

// Generate plausible distractor configurations for a given element
function generateDistractorConfigs(correctConfig, allConfigs) {
  const distractors = new Set();
  // 1. Wrong order (swap s and p, or p and d)
  const tokens = correctConfig.split(/\s+/);
  const core = tokens[0].startsWith('[') ? tokens.shift() : null;
  const s = [], p = [], d = [], f = [], other = [];
  tokens.forEach(token => {
    if (/s\d+$/.test(token)) s.push(token);
    else if (/p\d+$/.test(token)) p.push(token);
    else if (/d\d+$/.test(token)) d.push(token);
    else if (/f\d+$/.test(token)) f.push(token);
    else other.push(token);
  });
  // Swap s and p
  if (p.length > 0) distractors.add([core, ...p, ...s, ...d, ...f, ...other].filter(Boolean).join(' '));
  // Swap p and d
  if (d.length > 0) distractors.add([core, ...s, ...d, ...p, ...f, ...other].filter(Boolean).join(' '));
  // 2. Off-by-one errors (add or subtract 1 from a subshell)
  tokens.forEach((token, idx) => {
    const match = token.match(/^(\d+[spdf])(\d+)$/);
    if (match) {
      const n = parseInt(match[2], 10);
      if (n > 1) {
        const arr = [...tokens];
        arr[idx] = match[1] + (n - 1);
        distractors.add([core, ...arr].filter(Boolean).join(' '));
      }
      if (n < 14) {
        const arr = [...tokens];
        arr[idx] = match[1] + (n + 1);
        distractors.add([core, ...arr].filter(Boolean).join(' '));
      }
    }
  });
  // 3. Use a config from another element with similar atomic number
  for (let cfg of allConfigs) {
    if (cfg !== correctConfig && !distractors.has(cfg)) {
      distractors.add(cfg);
      if (distractors.size >= 6) break;
    }
  }
  // Remove the correct answer if present
  distractors.delete(correctConfig);
  // Return up to 3 distractors
  return Array.from(distractors).slice(0, 3);
}

// Normalize a configuration string for answer checking
function normalizeConfig(config) {
  // Remove all whitespace, convert to s p d f order, remove superscripts, and ignore case
  let str = config.replace(/\s+/g, '');
  // Separate noble gas core from the rest
  let match = str.match(/^(\[[^\]]+\])(.+)$/i);
  let core = '', rest = '';
  if (match) {
    core = match[1].toUpperCase();
    rest = match[2];
  } else {
    rest = str;
  }
  // Insert a space between core and rest for reorderOrbitals
  let spaced = (core ? core + ' ' : '') + rest;
  // Convert to s p d f order, remove superscripts, and ignore case
  return reorderOrbitals(spaced)
    .replace(/([spdf])([⁰¹²³⁴⁵⁶⁷⁸⁹\d]+)/gi, (m, orb, num) => orb.toLowerCase() + num
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, d => '0123456789'['⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(d)]))
    .replace(/\s+/g, ' ')
    .trim();
}

const ShortHandConfigActivity = ({ onBack, onPeriodicTable, savedState, setSavedState }) => {
  const [remainingElements, setRemainingElements] = useState(savedState?.remainingElements || shuffle(ELEMENTS));
  const [usedElements, setUsedElements] = useState(savedState?.usedElements || []);
  const [usedTypes, setUsedTypes] = useState(savedState?.usedTypes || []);
  const [question, setQuestion] = useState(savedState?.question || null);
  const [userAnswer, setUserAnswer] = useState(savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(savedState?.showFeedback || false);

  const inputRef = useRef(null);

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

  useEffect(() => {
    if (setSavedState) {
      setSavedState({ remainingElements, usedElements, usedTypes, question, userAnswer, feedback, showFeedback });
    }
  }, [remainingElements, usedElements, usedTypes, question, userAnswer, feedback, showFeedback]);

  const generateQuestion = useCallback(() => {
    let nextElements = remainingElements;
    let nextUsed = usedElements;
    let nextUsedTypes = usedTypes;
    if (nextElements.length === 0) {
      nextElements = shuffle(ELEMENTS);
      nextUsed = [];
      nextUsedTypes = [];
    }
    const el = getRandomElement(nextElements);
    const qType = getRandomQuestionType(nextUsedTypes);
    setRemainingElements(nextElements.filter(e => e !== el));
    setUsedElements([...nextUsed, el]);
    setUsedTypes([...nextUsedTypes, qType].slice(-QUESTION_TYPES.length));
    let q = { type: qType, el };
    if (qType === 'element-to-config') {
      const correct = reorderOrbitals(el.configuration);
      const allConfigs = ELEMENTS.map(e => reorderOrbitals(e.configuration));
      const distractors = generateDistractorConfigs(correct, allConfigs);
      const options = shuffle([
        correct,
        ...distractors
      ]);
      q.prompt = `What is the short hand electron configuration for ${el.element} (Atomic Number: ${el.atomicNumber})?`;
      q.options = options;
      q.correct = correct;
    } else if (qType === 'config-to-element') {
      const options = shuffle([
        el.element,
        ...shuffle(ELEMENTS.filter(e => e !== el)).slice(0, 3).map(e => e.element)
      ]);
      q.prompt = `Which element has the configuration: ${reorderOrbitals(el.configuration)}?`;
      q.options = options;
      q.correct = el.element;
    } else {
      q.prompt = `Type the short hand electron configuration for ${el.element} (Atomic Number: ${el.atomicNumber}):`;
      q.correct = reorderOrbitals(el.configuration);
    }
    setQuestion(q);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
  }, [remainingElements, usedElements, usedTypes, setRemainingElements, setUsedElements, setUsedTypes, setQuestion, setUserAnswer, setFeedback, setShowFeedback]);

  useEffect(() => {
    if (!question) {
      generateQuestion();
    }
  }, [question, generateQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question) return;
    let isCorrect = false;
    if (question.type === 'fill-in-blank') {
      isCorrect = normalizeConfig(userAnswer) === normalizeConfig(question.correct);
    } else {
      isCorrect = userAnswer === question.correct;
    }
    setFeedback(getConstructiveFeedback(question, userAnswer, isCorrect));
    setShowFeedback(true);
  };

  const handleNext = () => {
    generateQuestion();
  };

  return (
    <div className="shc-activity-bg">
      <div className="shc-card">
        <h2 className="shc-title">
          <span role="img" aria-label="shorthand" className="shc-title-icon">✍️</span>
          Short Hand Electron Configuration
        </h2>
        {question && (
          <div key={question.prompt + (showFeedback ? '-feedback' : '-question')} className="shc-question-animate">
            <form onSubmit={handleSubmit} className="shc-form">
              <div className="shc-prompt">{question.prompt}</div>

              {question.type === 'fill-in-blank' && (
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
                      placeholder="e.g. [Ne] 3s2 3p1"
                      aria-label="Electron configuration input"
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
              )}

              {question.type === 'element-to-config' && question.options && (
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
                      {configToSuperscript(opt)}
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'config-to-element' && question.options && (
                <div className="shc-options">
                  {question.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      className={`shc-option-btn shc-element-option-btn${userAnswer === opt ? ' selected' : ''}`}
                      onClick={() => !showFeedback && setUserAnswer(opt)}
                      disabled={showFeedback}
                      style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
                    >
                      {opt}
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
          <FeedbackVisual feedback={feedback} configToSuperscript={configToSuperscript} />
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

ShortHandConfigActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func
};

export default ShortHandConfigActivity; 