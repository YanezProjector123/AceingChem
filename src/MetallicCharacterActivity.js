import React, { useState, useEffect, useRef } from 'react';
import PeriodicTable from './PeriodicTable';
import periodicTableData from './periodic-table.json';
import './MetallicCharacterActivity.css';

// --- Utility functions (reuse from EN activity) ---
const getRandomInt = (max) => Math.floor(Math.random() * max);
const shuffle = (array) => {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// --- Tutorial Content ---
const Tutorial = ({ onNext }) => (
  <div className="en-question-card" style={{ marginBottom: 24 }}>
    <h2 className="en-card-title">Metallic Character Tutorial</h2>
    <ul style={{ textAlign: 'left', fontSize: '1.08em', margin: '0 auto', maxWidth: 600 }}>
      <li><b>Metallic character</b> describes how strongly an element exhibits the properties of metals (shiny, malleable, good conductor, forms cations, etc.).</li>
      <li>On the periodic table, <b>metallic character increases</b> as you move <b>down a group</b> and <b>to the left across a period</b>.</li>
      <li>Nonmetals (upper right) have low metallic character; metals (left and center) have high metallic character; metalloids are in between.</li>
      <li>Elements with high metallic character tend to <b>lose electrons easily</b> and form positive ions (cations).</li>
      <li>Examples: <b>Na</b> (sodium) is more metallic than <b>Mg</b> (magnesium); <b>Cs</b> (cesium) is one of the most metallic elements.</li>
    </ul>
    <button className="ptable-btn" style={{ marginTop: 18 }} onClick={onNext}>Start Practice</button>
  </div>
);

const MetallicCharacterActivity = ({ onBack, onShowPeriodicTable }) => {
  // --- State ---
  const [showTutorial, setShowTutorial] = useState(true);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const RECENT_HISTORY_LIMIT = 10;
  const [recentQuestionUIDs, setRecentQuestionUIDs] = useState([]);
  const generatorQueue = useRef([]);

  // --- Question Generators ---
  // Helper filters
  const metals = periodicTableData.filter(e => e.category && e.category.includes('metal') && e.symbol.length > 1 ? false : true);
  const nonmetals = periodicTableData.filter(e => e.category && e.category.includes('nonmetal') && e.symbol.length > 1 ? false : true);
  const metalloids = periodicTableData.filter(e => e.category && e.category.includes('metalloid') && e.symbol.length > 1 ? false : true);
  const mainGroups = [1, 2, 13, 14, 15, 16, 17, 18];
  const isMainGroup = (el) => el && mainGroups.includes(el.group);

  // Helper for unique, plausible distractors
  function getUniqueDistractors(correct, pool, count, excludeList = []) {
    const filtered = pool.filter(e => e.symbol !== correct.symbol && !excludeList.includes(e.symbol));
    return shuffle(filtered).slice(0, count);
  }

  // 1. Compare: Which is more metallic?
  function generateCompareQuestion() {
    const pool = metals.concat(nonmetals).filter(e => e.symbol && e.name);
    if (pool.length < 2) return fallbackQuestion('Not enough elements for compare.');
    let [a, b] = shuffle(pool).slice(0, 2);
    // Use periodic table position for metallicity
    const metallicOrder = (el) => (el.group || 20) - (el.period || 0) * 0.1;
    const moreMetallic = metallicOrder(a) < metallicOrder(b) ? a : b;
    // Get a unique plausible distractor
    const distractor = getUniqueDistractors(a, pool, 1, [b.symbol])[0];
    const options = shuffle([a, b, distractor]).map(e => `${e.name} (${e.symbol})`);
    return {
      type: 'compare',
      question: `Which element is more metallic?`,
      options,
      correct: `${moreMetallic.name} (${moreMetallic.symbol})`,
      explanation: `${moreMetallic.name} (${moreMetallic.symbol}) is further left and/or down on the periodic table, so it is more metallic.`,
      uid: `compare:${a.symbol}:${b.symbol}`
    };
  }

  // 2. Rank: Rank by metallic character
  function generateRankQuestion() {
    const pool = metals.concat(nonmetals).filter(e => e.symbol && e.name);
    if (pool.length < 3) return fallbackQuestion('Not enough elements for rank.');
    let els = shuffle(pool).slice(0, 3);
    // Ensure uniqueness
    els = Array.from(new Set(els.map(e => e.symbol))).map(sym => pool.find(e => e.symbol === sym));
    // Sort by metallicity (left/down = more metallic)
    const metallicity = (el) => (el.period || 0) * 100 - (el.group || 20);
    const sorted = [...els].sort((a, b) => metallicity(b) - metallicity(a));
    const correctOrder = sorted.map(e => `${e.name} (${e.symbol})`).join(' > ');
    let optionsSet = new Set([correctOrder]);
    let attempts = 0;
    while (optionsSet.size < 3 && attempts < 10) {
      const shuffled = shuffle([...sorted]).map(e => `${e.name} (${e.symbol})`).join(' > ');
      optionsSet.add(shuffled);
      attempts++;
    }
    return {
      type: 'rank',
      question: `Rank these by metallic character (most to least): ${els.map(e => `${e.name} (${e.symbol})`).join(', ')}`,
      options: shuffle(Array.from(optionsSet)),
      correct: correctOrder,
      explanation: `Down and left = more metallic. Correct: ${correctOrder}`,
      uid: `rank:${els.map(e => e.symbol).join(':')}`
    };
  }

  // 3. Trend Direction
  function generateTrendDirectionQuestion() {
    const axis = Math.random() < 0.5 ? 'across a period (left to right)' : 'down a group (top to bottom)';
    const correct = axis.includes('across') ? 'Decreases' : 'Increases';
    return {
      type: 'trend_direction',
      question: `How does metallic character change as you move ${axis}?`,
      options: shuffle(['Increases', 'Decreases', 'Stays the same']),
      correct,
      explanation: `Metallic character increases down a group and decreases across a period (left to right).`,
      uid: `trend:${axis}`
    };
  }

  // 4. Reasoning
  function generateReasoningQuestion() {
    const direction = Math.random() < 0.5 ? 'down a group' : 'across a period';
    const correct = direction === 'down a group'
      ? 'Atoms get larger and lose electrons more easily'
      : 'Atoms have higher nuclear charge and hold electrons more tightly';
    const options = direction === 'down a group'
      ? [correct, 'Atoms get smaller and attract electrons more', 'Atoms become more nonmetallic']
      : [correct, 'Atoms get larger and lose electrons more easily', 'Atoms become more metallic'];
    return {
      type: 'reasoning',
      question: `Why does metallic character ${direction === 'down a group' ? 'increase' : 'decrease'} ${direction}?`,
      options: shuffle(options),
      correct,
      explanation: correct,
      uid: `reason:${direction}`
    };
  }

  // 5. True/False
  function generateTrueFalseQuestion() {
    const facts = [
      { q: 'Metallic character increases down a group.', a: 'True', exp: 'Down a group, atoms lose electrons more easily.' },
      { q: 'Metallic character increases across a period.', a: 'False', exp: 'It decreases across a period.' },
      { q: 'Nonmetals are more metallic than metals.', a: 'False', exp: 'Metals are more metallic.' },
      { q: 'Metalloids have intermediate metallic character.', a: 'True', exp: 'Metalloids are between metals and nonmetals.' },
    ];
    const pick = facts[getRandomInt(facts.length)];
    return {
      type: 'true_false',
      question: pick.q,
      options: ['True', 'False'],
      correct: pick.a,
      explanation: pick.exp,
      uid: `tf:${pick.q}`
    };
  }

  // 6. Identify: Most/least metallic in a set
  function generateIdentifyQuestion() {
    const pool = metals.concat(nonmetals).filter(e => e.symbol && e.name);
    if (pool.length < 4) return fallbackQuestion('Not enough elements for identify.');
    let els = shuffle(pool).slice(0, 4);
    // Ensure uniqueness
    els = Array.from(new Set(els.map(e => e.symbol))).map(sym => pool.find(e => e.symbol === sym));
    const metallicity = (el) => (el.period || 0) * 100 - (el.group || 20);
    const most = els.reduce((a, b) => metallicity(a) > metallicity(b) ? a : b);
    const least = els.reduce((a, b) => metallicity(a) < metallicity(b) ? a : b);
    const askMost = Math.random() < 0.5;
    const options = shuffle(els).map(e => `${e.name} (${e.symbol})`);
    return {
      type: 'identify',
      question: `Which is the ${askMost ? 'most' : 'least'} metallic: ${els.map(e => `${e.name} (${e.symbol})`).join(', ')}?`,
      options,
      correct: askMost ? `${most.name} (${most.symbol})` : `${least.name} (${least.symbol})`,
      explanation: `${askMost ? most.name : least.name} (${askMost ? most.symbol : least.symbol}) is ${askMost ? 'down/left' : 'up/right'} on the table.`,
      uid: `identify:${els.map(e => e.symbol).join(':')}:${askMost}`
    };
  }

  // 7. Property Link
  function generatePropertyLinkQuestion() {
    const props = [
      { p: 'Good conductor of electricity', a: 'Metal' },
      { p: 'Brittle and dull', a: 'Nonmetal' },
      { p: 'Forms cations easily', a: 'Metal' },
      { p: 'Often a semiconductor', a: 'Metalloid' },
      { p: 'Poor conductor of heat', a: 'Nonmetal' },
    ];
    const pick = props[getRandomInt(props.length)];
    return {
      type: 'property_link',
      question: `Which type of element is usually: ${pick.p}?`,
      options: ['Metal', 'Nonmetal', 'Metalloid'],
      correct: pick.a,
      explanation: `This is a property of a ${pick.a.toLowerCase()}.`,
      uid: `prop:${pick.p}`
    };
  }

  // 8. Category Classification
  function generateCategoryClassificationQuestion() {
    const pool = metals.concat(nonmetals, metalloids).filter(e => e.symbol && e.name);
    // Get one of each category, all unique
    const metal = metals[getRandomInt(metals.length)];
    const nonmetal = nonmetals[getRandomInt(nonmetals.length)];
    const metalloid = metalloids[getRandomInt(metalloids.length)];
    const all = shuffle([metal, nonmetal, metalloid]);
    const el = all[getRandomInt(all.length)];
    let cat = 'Metalloid';
    if (metals.includes(el)) cat = 'Metal';
    else if (nonmetals.includes(el)) cat = 'Nonmetal';
    const options = shuffle([metal, nonmetal, metalloid]).map(e => `${e.name} (${e.symbol})`);
    return {
      type: 'category_classification',
      question: `Is ${el.name} (${el.symbol}) a metal, nonmetal, or metalloid?`,
      options,
      correct: cat,
      explanation: `${el.name} (${el.symbol}) is a ${cat.toLowerCase()}.`,
      uid: `cat:${el.symbol}`
    };
  }

  // 9. Exception/Edge Case
  function generateExceptionQuestion() {
    // Which is a metalloid?
    if (metalloids.length < 1) return fallbackQuestion('No metalloids for exception.');
    const m = metalloids[getRandomInt(metalloids.length)];
    // Get unique distractors (not metalloids, not the correct answer)
    const distractorPool = periodicTableData.filter(e => e.symbol !== m.symbol && !metalloids.includes(e));
    const distractors = shuffle(distractorPool).slice(0, 3);
    const options = shuffle([m, ...distractors]).map(e => `${e.name} (${e.symbol})`);
    return {
      type: 'exception',
      question: `Which of these is a metalloid?`,
      options,
      correct: `${m.name} (${m.symbol})`,
      explanation: `${m.name} (${m.symbol}) is a metalloid (borderline between metals and nonmetals).`,
      uid: `exception:${[m.symbol, ...distractors.map(e => e.symbol)].join(':')}`
    };
  }

  // 10. Application
  function generateApplicationQuestion() {
    const pool = metals.concat(nonmetals).filter(e => e.symbol && e.name);
    const el = pool[getRandomInt(pool.length)];
    const isMetal = metals.includes(el);
    return {
      type: 'application',
      question: `Would ${el.name} (${el.symbol}) more likely form a cation or anion?`,
      options: ['Cation', 'Anion'],
      correct: isMetal ? 'Cation' : 'Anion',
      explanation: isMetal ? `${el.name} (${el.symbol}) is a metal and forms cations.` : `${el.name} (${el.symbol}) is a nonmetal and forms anions.`,
      uid: `app:${el.symbol}`
    };
  }

  const generators = [
    generateCompareQuestion,
    generateRankQuestion,
    generateTrendDirectionQuestion,
    generateReasoningQuestion,
    generateTrueFalseQuestion,
    generateIdentifyQuestion,
    generatePropertyLinkQuestion,
    generateCategoryClassificationQuestion,
    generateExceptionQuestion,
    generateApplicationQuestion
  ];

  const fallbackQuestion = (reason = "Insufficient data for this question type.") => {
    return { type: 'error', question: `Error: Failed to generate question. ${reason}`, options: [], correct: '', explanation: '', uid: `error_${Date.now()}` };
  };

  // --- getNextQuestion (copied from EN activity) ---
  const getNextQuestion = (currentQuestionUid = null) => {
    if (generators.length === 0) {
      return { type: 'error', question: 'Error: No metallic character question generators defined.', uid: `error_${Date.now()}` };
    }
    if (generatorQueue.current.length === 0) {
      generatorQueue.current = shuffle([...Array(generators.length).keys()]);
    }
    let nextQData = null;
    let attempts = 0;
    const maxAttemptsPerCycle = generators.length * 2;
    while (!nextQData && attempts < maxAttemptsPerCycle) {
      attempts++;
      if (generatorQueue.current.length === 0) {
        generatorQueue.current = shuffle([...Array(generators.length).keys()]);
      }
      const queueIndex = getRandomInt(generatorQueue.current.length);
      const generatorIndex = generatorQueue.current[queueIndex];
      const generatorFunc = generators[generatorIndex];
      try {
        const candidateQ = generatorFunc();
        if (candidateQ && candidateQ.uid && candidateQ.uid !== currentQuestionUid && !recentQuestionUIDs.includes(candidateQ.uid)) {
          nextQData = candidateQ;
          nextQData.generatorFunction = generatorFunc;
          generatorQueue.current.splice(queueIndex, 1);
        }
      } catch (error) {
        // skip
      }
    }
    if (!nextQData) {
      nextQData = fallbackQuestion("Could not generate unique metallic character question.");
      generatorQueue.current = shuffle([...Array(generators.length).keys()]);
    }
    return nextQData;
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    if (!showTutorial) {
      const initialQData = getNextQuestion();
      setQuestion(initialQData);
      if (initialQData?.uid) {
        setRecentQuestionUIDs([initialQData.uid]);
      }
      setIsLoading(false);
      setRound(1);
      setScore(0);
      setMissedQuestions([]);
      setReviewMode(false);
      setReviewIndex(0);
    }
  }, [showTutorial]);

  // --- Handlers ---
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!userAnswer || !question || showFeedback || isLoading) return;
    let isCorrect = userAnswer === question.correct;
    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? 'Correct!' : 'Incorrect.',
      explanation: question.explanation,
      correctAnswer: question.correct
    });
    setShowFeedback(true);
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    } else {
      setMissedQuestions(prev => [...prev, question]);
    }
  };

  const handleNext = () => {
    if (isLoading) return;
    const currentQuestionUid = question?.uid;
    setIsLoading(true);
    const nextQData = getNextQuestion(currentQuestionUid);
    if (nextQData?.uid && nextQData.type !== 'error') {
      setRecentQuestionUIDs(prevHistory => [...prevHistory, nextQData.uid].slice(-RECENT_HISTORY_LIMIT));
    }
    setQuestion(nextQData);
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    setRound(prevRound => prevRound + 1);
    setIsLoading(false);
  };

  const handleShowTable = () => setShowTable(true);
  const handleHideTable = () => setShowTable(false);

  // --- Review Missed Questions ---
  const startReview = () => {
    setReviewMode(true);
    setReviewIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
  };
  const handleReviewNext = () => {
    setReviewIndex(idx => idx + 1);
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
  };
  const handleReviewBack = () => {
    setReviewMode(false);
    setReviewIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
  };

  // --- Render ---
  if (showTutorial) {
    return <Tutorial onNext={() => setShowTutorial(false)} />;
  }
  if (showTable) {
    return <PeriodicTable onBack={handleHideTable} />;
  }
  if (reviewMode && missedQuestions.length > 0) {
    const q = missedQuestions[reviewIndex];
    return (
      <div className="mca-activity-root center-container fade-in slide-up">
        <div className="mca-question-card glass-card">
          <h2 className="ptable-title">Metallic Character Activity</h2>
          <div className="en-score-round-display">
            Missed: {reviewIndex + 1} / {missedQuestions.length}
          </div>
          <div className="mca-prompt">{q.question}</div>
          <form onSubmit={e => {
            e.preventDefault();
            if (!userAnswer || showFeedback) return;
            const isCorrect = userAnswer === q.correct;
            setFeedback({
              type: isCorrect ? 'correct' : 'incorrect',
              message: isCorrect ? 'Correct!' : 'Incorrect.',
              explanation: isCorrect ? '' : '',
              correctAnswer: q.correct
            });
            setShowFeedback(true);
            if (isCorrect) {
              setTimeout(() => {
                setMissedQuestions(prev => prev.filter((_, i) => i !== reviewIndex));
                setReviewIndex(idx => Math.max(0, idx - (reviewIndex === 0 ? 0 : 1)));
                setShowFeedback(false);
                setFeedback(null);
                setUserAnswer('');
              }, 900);
            }
          }} className="mca-answer-form">
            {Array.isArray(q.options) && q.options.length > 0 && (
              q.type === 'rank' ? (
                <select
                  className="mca-select"
                  value={userAnswer}
                  onChange={e => !showFeedback && setUserAnswer(e.target.value)}
                  disabled={showFeedback}
                  required
                  aria-label="Select the correct ranking">
                  <option value="" disabled={!!userAnswer}>Select Ranking...</option>
                  {q.options.map((opt, idx) => (
                    <option key={`rank-${q.uid}-${idx}`} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="mca-options-group">
                  {q.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      className={`mca-option${userAnswer === opt ? ' selected' : ''}${showFeedback ? ' disabled' : ''}`}
                      onClick={() => !showFeedback && setUserAnswer(opt)}
                      disabled={showFeedback}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )
            )}
            <button className="mca-submit-btn" type="submit" disabled={showFeedback || !userAnswer} style={{ marginTop: 18 }}>Submit</button>
          </form>
          {showFeedback && feedback && (
            <div className={`mca-feedback ${feedback.type}`}>{feedback.message}</div>
          )}
          <div className="mca-btn-row">
            <button className="mca-btn" onClick={handleReviewBack}>Back</button>
            {reviewIndex < missedQuestions.length - 1 ? (
              <button className="mca-btn" onClick={handleReviewNext}>Next</button>
            ) : (
              <button className="mca-btn" onClick={handleReviewBack}>Back to Practice</button>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (!question || question.type === 'error') {
    return (
      <div className="mca-activity-root center-container fade-in slide-up">
        <div className="mca-question-card glass-card">
          <h2 className="ptable-title">Metallic Character Activity</h2>
          <div className="en-activity-root error-message">
            <h2>Error</h2>
            <p>{question?.question || 'Failed to load questions.'}</p>
            <p>{question?.explanation || 'Please check the console for details or try refreshing.'}</p>
            <button onClick={onBack} className="en-button en-button-back">Back to Menu</button>
          </div>
        </div>
      </div>
    );
  }
  // --- Render answer options based on question.type ---
  const radioTypes = ['trend_direction', 'reasoning', 'true_false', 'property_link', 'category_classification', 'exception', 'application'];
  const buttonChoiceTypes = ['compare', 'identify'];
  const selectTypes = ['rank'];

  return (
    <div className="mca-activity-root center-container fade-in slide-up">
      <div className="mca-question-card glass-card">
        <h2 className="ptable-title">Metallic Character Activity</h2>
        <div className="en-score-round-display">
          Score: <span className="score-value">{score}</span> | Question: {round}
        </div>
        <div className="mca-prompt">{question.question}</div>
        <form onSubmit={handleSubmit} className="mca-answer-form">
          {/* Render pill-style options for all except rank/select */}
          {selectTypes.includes(question.type) && Array.isArray(question.options) ? (
            <select
              className="mca-select"
              value={userAnswer}
              onChange={(e) => !showFeedback && setUserAnswer(e.target.value)}
              disabled={showFeedback || isLoading}
              required
              aria-label="Select the correct ranking">
              <option value="" disabled={!!userAnswer}>Select Ranking...</option>
              {question.options.map((opt, idx) => (
                <option key={`rank-${question.uid}-${idx}`} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <div className="mca-options-group">
              {question.options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  className={`mca-option${userAnswer === opt ? ' selected' : ''}${showFeedback ? ' disabled' : ''}`}
                  onClick={() => !showFeedback && setUserAnswer(opt)}
                  disabled={showFeedback || isLoading}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          <button className="mca-submit-btn" type="submit" disabled={showFeedback || isLoading || !userAnswer} style={{ marginTop: 18 }}>Submit</button>
        </form>
        {showFeedback && feedback && (
          <div className={`mca-feedback ${feedback.type}`}>{feedback.message}<br /><span>{feedback.explanation}</span></div>
        )}
        <div className="mca-btn-row">
          <button className="mca-btn mca-ptable-btn" onClick={handleShowTable}>Show Periodic Table</button>
          <button className="mca-btn" onClick={onBack}>Back</button>
          {missedQuestions.length > 0 && !reviewMode && round >= 10 && (
            <button className="mca-btn" onClick={startReview}>Review Missed</button>
          )}
          {showFeedback && (
            <button className="mca-btn" onClick={handleNext}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetallicCharacterActivity; 