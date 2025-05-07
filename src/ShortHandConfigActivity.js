import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ShortHandConfigActivity.css';

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
  // Special feedback for config-to-element (multiple choice)
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
  const correct = normalizeConfig(q.correct);
  const user = normalizeConfig(userAnswer);
  const correctTokens = correct.split(' ');
  const userTokens = user.split(' ');
  const correctSet = new Set(correctTokens);
  const userSet = new Set(userTokens);
  const missing = Array.from(correctSet).filter(c => !userSet.has(c));
  const extra = Array.from(userSet).filter(u => !correctSet.has(u));
  let nobleGasCore = '';
  let nobleGasMatch = q.correct.match(/^\[[^\]]+\]/);
  if (nobleGasMatch) nobleGasCore = nobleGasMatch[0];

  // How to build the correct answer
  let howTo = [];
  if (nobleGasCore) {
    howTo.push({
      step: 1,
      text: `Find the noble gas core: `,
      code: nobleGasCore,
      explanation: `This represents all electrons up to that noble gas.`
    });
    howTo.push({
      step: 2,
      text: `Add the remaining subshells in order:`,
      code: correctTokens.filter(t => !/^\[.*\]$/.test(t)),
      explanation: null
    });
  } else {
    howTo.push({
      step: 1,
      text: `Start from the beginning: List all subshells in order:`,
      code: correctTokens,
      explanation: null
    });
  }
  return {
    type: 'incorrect',
    userAnswer,
    message: 'Incorrect.',
    correct: q.correct,
    tip: 'Always start with the noble gas core in brackets (if needed), then add the remaining electrons in s, p, d, f order. Only use valid subshells (s, p, d, f). You can always check the periodic table for help!',
    missing,
    extra,
    howTo
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

// Utility to convert subshell numbers to superscript (e.g., s2 -> s²)
function configToSuperscript(config) {
  // Replace all occurrences of a letter (s/p/d/f) followed by digits with the letter and the digits as superscript
  return config.replace(/([spdf])(\d+)/g, (match, orb, num) => orb + num.split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join(''));
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

function FeedbackVisual({ feedback, configToSuperscript }) {
  if (!feedback) return null;
  if (feedback.type === 'correct') {
    return (
      <div className="shc-feedback-correct-card">
        <div className="shc-feedback-block shc-feedback-correct-main">
          <span role="img" aria-label="correct" className="shc-feedback-icon">✅</span>
          <span>{feedback.message}</span>
        </div>
      </div>
    );
  }
  // Determine if the answer is empty or clearly off
  let userAnswerDisplay = null;
  if (!feedback.userAnswer || !feedback.userAnswer.trim()) {
    userAnswerDisplay = <span className="shc-feedback-user-answer-empty">(No answer entered)</span>;
  } else {
    userAnswerDisplay = <span className="shc-feedback-user-answer-pill">{configToSuperscript(feedback.userAnswer)}</span>;
  }
  return (
    <div className="shc-feedback-visual-card">
      <div className="shc-feedback-block shc-feedback-user" style={{background:'#1a1a2a', borderLeftColor:'#38bdf8', borderRadius: '8px', padding:'14px 0 10px 14px', marginBottom:18}}>
        <span className="shc-feedback-label" style={{color:'#38bdf8', fontSize:'1.08em'}}>📝 What you wrote:</span>
        {userAnswerDisplay}
        {!feedback.userAnswer || !feedback.userAnswer.trim() ? (
          <div className="shc-feedback-user-explanation" style={{color:'#b6f8e0', fontSize:'0.98em', marginTop:4}}>
            You did not enter an answer. Try typing the electron configuration in the box above!
          </div>
        ) : null}
      </div>
      {feedback.missing && feedback.missing.length > 0 && (
        <div className="shc-feedback-block shc-feedback-missing">
          <span className="shc-feedback-label">➖ What's missing:</span>
          <ul>
            {feedback.missing.map((m, i) => (
              <li key={i}>{/^\[.*\]$/.test(m) ? <>Noble gas core: <code>{m}</code></> : <>Subshell: <code>{m}</code></>}</li>
            ))}
          </ul>
        </div>
      )}
      {feedback.extra && feedback.extra.length > 0 && (
        <div className="shc-feedback-block shc-feedback-extra">
          <span className="shc-feedback-label">➕ What's extra or incorrect:</span>
          <ul>
            {feedback.extra.map((e, i) => (
              <li key={i}>{!/^[\[].*[\]]$/.test(e) && !/^\d+[spdf]\d+$/.test(e)
                ? <><code>{e}</code> is not a valid subshell (only s, p, d, f are allowed).</>
                : <>Extra or incorrect subshell: <code>{e}</code></>}</li>
            ))}
          </ul>
        </div>
      )}
      {feedback.howTo && feedback.howTo.length > 0 && (
        <div className="shc-feedback-block shc-feedback-howto">
          <span className="shc-feedback-label">🔎 How to build the correct answer:</span>
          <ol>
            {feedback.howTo.map((step, i) => (
              <li key={i}>
                <b>{step.text}</b>{' '}
                {Array.isArray(step.code)
                  ? step.code.map((c, j) => <code key={j} style={{marginRight:4}}>{c}</code>)
                  : step.code && <code>{step.code}</code>}
                {step.explanation && <span className="shc-feedback-explanation"> {step.explanation}</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="shc-feedback-block shc-feedback-correct-answer">
        <span className="shc-feedback-label">✅ Correct answer:</span>
        <span className="shc-feedback-correct-value">{configToSuperscript(feedback.correct)}</span>
      </div>
      <div className="shc-feedback-block shc-feedback-tip">
        <span className="shc-feedback-label">💡 Tip:</span>
        <span>{feedback.tip}</span>
      </div>
    </div>
  );
}

const ShortHandConfigActivity = ({ onBack, onPeriodicTable, savedState, setSavedState }) => {
  const [remaining, setRemaining] = useState(savedState?.remaining || shuffle(ELEMENTS));
  const [used, setUsed] = useState(savedState?.used || []);
  const [usedTypes, setUsedTypes] = useState(savedState?.usedTypes || []);
  const [question, setQuestion] = useState(savedState?.question || null);
  const [userAnswer, setUserAnswer] = useState(savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(savedState?.showFeedback || false);

  // Save state on any change
  React.useEffect(() => {
    if (setSavedState) {
      setSavedState({ remaining, used, usedTypes, question, userAnswer, feedback, showFeedback });
    }
    // eslint-disable-next-line
  }, [remaining, used, usedTypes, question, userAnswer, feedback, showFeedback]);

  // Generate a new question
  const generateQuestion = () => {
    let nextElements = remaining;
    let nextUsed = used;
    let nextUsedTypes = usedTypes;
    if (nextElements.length === 0) {
      nextElements = shuffle(ELEMENTS);
      nextUsed = [];
      nextUsedTypes = [];
    }
    const el = getRandomElement(nextElements);
    const qType = getRandomQuestionType(nextUsedTypes);
    setRemaining(nextElements.filter(e => e !== el));
    setUsed([...nextUsed, el]);
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
  };

  React.useEffect(() => {
    if (!question) generateQuestion();
    // eslint-disable-next-line
  }, []);

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
              {question.type === 'fill-in-blank' ? (
                <>
                  <input
                    type="text"
                    className="shc-input"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    disabled={showFeedback}
                    autoFocus
                    autoComplete="off"
                    placeholder="e.g. [Ne] 3s2 3p1"
                  />
                  <div style={{ minHeight: 24, color: '#b6f8e0', fontSize: '1.13em', marginTop: 2, textAlign: 'center', letterSpacing: 1 }}>
                    {userAnswer && configToSuperscript(userAnswer)}
                  </div>
                </>
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
                      {configToSuperscript(opt)}
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