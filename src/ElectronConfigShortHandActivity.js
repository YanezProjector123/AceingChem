import React, { useState, useRef } from 'react';
import PeriodicTable from './PeriodicTable';
import electronConfigs from './electron-configs.json';
import './IonizationEnergyActivity.css'; // Reuse styles for consistency

const RECENT_HISTORY_LIMIT = 20;

const subscriptMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const superscriptMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };

function toChemUnicode(str) {
  if (!str) return '';
  // Always render numbers after orbital as superscript
  return str
    .replace(/\^(\d+)/g, (_, n) => n.split('').map(d => superscriptMap[d] || d).join(''))
    .replace(/([spdfg])(\d+)/g, (m, l, n) => l + n.split('').map(d => superscriptMap[d] || d).join(''))
    .replace(/\[(He|Ne|Ar|Kr|Xe|Rn|Og)\]/g, m => m);
}

function normalizeConfig(str) {
  if (!str) return '';

  let normalized = str.trim(); // Trim leading/trailing whitespace
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width/invisible chars
  normalized = normalized.replace(/\^/g, ''); // Removes caret symbol if used for superscript

  // Convert unicode digits (subscript and superscript) back to standard digits
  const unicodeMap = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
  };
  normalized = Array.from(normalized).map(char => unicodeMap[char] || char).join('');

  normalized = normalized.toLowerCase();

  // --- Enhanced logic to handle orbital order and partial matching ---

  const nobleGasMatch = normalized.match(/^\[(he|ne|ar|kr|xe|rn|og)\]/);
  let nobleGasPart = '';
  let restPart = normalized;

  if (nobleGasMatch) {
    nobleGasPart = nobleGasMatch[0]; // Keep the lowercase noble gas tag, e.g., "[kr]"
    restPart = normalized.substring(nobleGasPart.length);
  }

  // Find all orbital terms: pattern is digit(s) followed by s, p, d, f, g, then digit(s) (the exponent)
  const orbitalTermsRegex = /(\d+[spdfg]\d+)/g;
  const orbitalTerms = [];
  let match;
  while ((match = orbitalTermsRegex.exec(restPart)) !== null) {
      orbitalTerms.push(match[1]); // match[1] is the captured group (e.g., "4d10")
  }

  // Sort orbital terms: First by principal quantum number (the initial digit(s)), then by orbital type (s<p<d<f<g)
  const typeOrder = 'spdfg';
  orbitalTerms.sort((a, b) => {
    const aParts = a.match(/^(\d+)([spdfg])(\d+)$/);
    const bParts = b.match(/^(\d+)([spdfg])(\d+)$/);
    if (!aParts || !bParts) return 0;
    const aNum = parseInt(aParts[1], 10);
    const aType = aParts[2];
    const bNum = parseInt(bParts[1], 10);
    const bType = bParts[2];
    const numCompare = aNum - bNum;
    if (numCompare !== 0) {
      return numCompare;
    }
    return typeOrder.indexOf(aType) - typeOrder.indexOf(bType);
  });

  // Join the sorted orbital terms
  const sortedRest = orbitalTerms.join('');

  // Return the normalized noble gas part followed by the canonical orbital terms
  return nobleGasPart + sortedRest;
}

function normalizeSymbol(str) {
  return (str || '').trim().toLowerCase();
}

function getShorthandBreakdown(element) {
  if (!element || !element.shorthand) return '<i>Element or configuration data missing.</i>';
  const atomicNumber = element.number || '?';
  const symbol = element.symbol || '?';
  const name = element.name || 'Unknown';
  const shorthand = element.shorthand;
  // Noble gases in order
  const nobleGases = [
    { symbol: 'He', number: 2 },
    { symbol: 'Ne', number: 10 },
    { symbol: 'Ar', number: 18 },
    { symbol: 'Kr', number: 36 },
    { symbol: 'Xe', number: 54 },
    { symbol: 'Rn', number: 86 },
    { symbol: 'Og', number: 118 },
  ];
  let noble = nobleGases.filter(ng => ng.number < atomicNumber).pop();
  if (!noble) noble = nobleGases[0];
  const nobleCore = noble.symbol;
  const nobleNumber = noble.number;
  const electronsLeft = atomicNumber - nobleNumber;
  const rest = shorthand.replace(`[${nobleCore}]`, '').trim();
  const restChem = toChemUnicode(rest);
  return `
    <b>Step 1:</b> ${name} (${symbol}) has atomic number ${atomicNumber}, so it has ${atomicNumber} electrons.<br>
    <b>Step 2:</b> The nearest noble gas with fewer electrons is [${nobleCore}] (${nobleNumber} electrons).<br>
    <b>Step 3:</b> Subtract: ${atomicNumber} - ${nobleNumber} = ${electronsLeft} electrons left to fill.<br>
    <b>Step 4:</b> These electrons fill: ${restChem}<br>
    <b>Final Configuration:</b> ${toChemUnicode(shorthand)}<br>
    <i>Note: ${name} ends with a completely filled 5d<sub>10</sub> and 6s<sub>2</sub> shell, which contributes to its stability and low reactivity.</i>
  `;
}

function getRandomQuestion(excludeUIDs = []) {
  // Two types: element-to-config, config-to-element
  const types = ['toConfig', 'toElement'];
  let tries = 0;
  let question = null;
  while (!question && tries < 50) {
    const type = types[Math.floor(Math.random() * types.length)];
    const entry = electronConfigs[Math.floor(Math.random() * electronConfigs.length)];
    let uid = `${type}:${entry.number}`;
    if (!excludeUIDs.includes(uid)) {
      if (type === 'toConfig') {
        question = {
          type,
          uid,
          symbol: entry.symbol,
          name: entry.name,
          number: entry.number,
          correct: entry.shorthand,
          entry
        };
      } else {
        question = {
          type,
          uid,
          shorthand: entry.shorthand,
          correct: entry.symbol,
          entry
        };
      }
    }
    tries++;
  }
  return question;
}

const ElectronConfigShortHandActivity = ({ onBack }) => {
  const [showTable, setShowTable] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [inputMode, setInputMode] = useState('normal'); // 'normal' | 'sub' | 'super'
  const recentUIDs = useRef([]);

  // Generate the next question
  const nextQuestion = () => {
    const q = getRandomQuestion(recentUIDs.current);
    setQuestion(q);
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    setRound(r => r + 1);
    if (q && q.uid) {
      recentUIDs.current = [...recentUIDs.current.slice(-RECENT_HISTORY_LIMIT), q.uid];
    }
  };

  React.useEffect(() => {
    if (!question) nextQuestion();
    // eslint-disable-next-line
  }, []);

  // Feedback logic
  const checkAnswer = () => {
    if (!question) return;
    let correct = false;
    let explanation = '';
    let correctAnswer = question.correct;
    let userChem = userAnswer;
    if (question.type === 'toConfig') {
      correct = normalizeConfig(userAnswer) === normalizeConfig(question.correct);
      userChem = toChemUnicode(userAnswer);
      if (correct) {
        explanation = `<span style='color:#10b981'>${toChemUnicode(correctAnswer)}</span><br/>Correct!`;
      } else {
        explanation = `<span style='color:#10b981'>Correct answer: ${toChemUnicode(correctAnswer)}</span><br/>` +
          `<span style='color:#f43f5e'>Your answer: ${userChem}</span><br/>` +
          `<br><b>Step-by-step breakdown:</b><br>` + getShorthandBreakdown(question.entry);
      }
    } else if (question.type === 'toElement') {
      correct = normalizeSymbol(userAnswer) === normalizeSymbol(question.correct);
      if (correct) {
        explanation = `<span style='color:#10b981'>${question.correct}</span><br/>Correct!`;
      } else {
        explanation = `<span style='color:#10b981'>Correct answer: ${question.correct}</span><br/>` +
          `<span style='color:#f43f5e'>Your answer: ${userAnswer}</span><br/>` +
          `<br><b>Step-by-step breakdown:</b><br>` + getShorthandBreakdown(question.entry);
      }
    }
    setFeedback({
      type: correct ? 'correct' : 'incorrect',
      message: correct ? 'Correct!' : 'Not quite. See the correct answer and explanation below.',
      explanation,
      correctAnswer: toChemUnicode(correctAnswer),
      userChem
    });
    setShowFeedback(true);
    if (correct) {
      setScore(s => s + 1);
    }
  };

  if (!question) return <div className="ie-activity-root loading-message">Loading...</div>;

  let prompt = '';
  if (question.type === 'toConfig') {
    prompt = `Write the short hand electron configuration for ${question.symbol} (${question.name}) (atomic number ${question.number}).`;
  } else if (question.type === 'toElement') {
    prompt = `Which element has the short hand configuration ${toChemUnicode(question.shorthand)}? (Enter symbol)`;
  }

  return (
    <div className="center-container fade-in slide-up">
      <div className="glass-card">
        <h2 className="ptable-title">Short Hand Electron Configuration</h2>
        <div className="ie-score-round-display">
          Score: <span className="score-value">{score}</span> | Question: {round}
        </div>
        <div className="ie-question-prompt" aria-live="polite">{prompt}</div>
        <form onSubmit={e => { e.preventDefault(); if (!showFeedback) checkAnswer(); }} className="ie-answer-form" style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <input
            type="text"
            className="ie-input"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            disabled={showFeedback}
            placeholder={question.type === 'toConfig' ? 'e.g. [Ne] 3s¹ 3p⁵' : 'e.g. Cl'}
            style={{ width: '100%', maxWidth: 340, fontSize: '1.1em', margin: '18px 0 8px 0', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #38bdf8', textAlign: 'left' }}
            aria-label="Type your answer"
            autoFocus
          />
          {/* Power (superscript) and subscript buttons and number buttons for quick entry (only for toConfig) */}
          {question.type === 'toConfig' && !showFeedback && (
            <>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:8}}>
                <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <button
                      type="button"
                      className={`ie-button subscript-btn${inputMode==='sub' ? ' selected' : ''}`}
                      style={{width:44,minWidth:44,padding:'6px 0',fontSize:'1.25em',margin:0,background:inputMode==='sub'?'#38bdf8':'#23234a',color:inputMode==='sub'?'#23234a':'#a5b4fc',border:'2px solid #38bdf8',borderRadius:6,boxShadow:'none',fontWeight:600}}
                      aria-label="Subscript mode (Xₙ)"
                      title="Subscript mode (Xₙ)"
                      tabIndex={0}
                      onClick={() => setInputMode(inputMode==='sub' ? 'normal' : 'sub')}
                    >
                      X<sub style={{fontSize:'0.85em',verticalAlign:'sub'}}>ₙ</sub>
                    </button>
                    <span style={{fontSize:'0.93em',color:'#a5b4fc',marginTop:2}}>Subscript</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <button
                      type="button"
                      className={`ie-button subscript-btn${inputMode==='super' ? ' selected' : ''}`}
                      style={{width:44,minWidth:44,padding:'6px 0',fontSize:'1.25em',margin:0,background:inputMode==='super'?'#38bdf8':'#23234a',color:inputMode==='super'?'#23234a':'#a5b4fc',border:'2px solid #38bdf8',borderRadius:6,boxShadow:'none',fontWeight:600}}
                      aria-label="Power (superscript) mode (Xⁿ)"
                      title="Power (superscript) mode (Xⁿ)"
                      tabIndex={0}
                      onClick={() => setInputMode(inputMode==='super' ? 'normal' : 'super')}
                    >
                      X<sup style={{fontSize:'0.85em',verticalAlign:'super'}}>ⁿ</sup>
                    </button>
                    <span style={{fontSize:'0.93em',color:'#a5b4fc',marginTop:2}}>Power</span>
                  </div>
                </div>
                <div style={{fontSize:'0.97em',color:'#60a5fa',marginTop:4,marginBottom:2,textAlign:'center',maxWidth:260}}>
                  Toggle subscript or power, then click a number to insert as a subscript or superscript.
                </div>
              </div>
              <div className="subscript-buttons" style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:12}}>
                {[1,2,3,4,5,6,7,8,9,0].map(n => (
                  <button
                    type="button"
                    key={n}
                    className="ie-button subscript-btn"
                    style={{width:36,minWidth:36,padding:'6px 0',fontSize:'1.1em',margin:0,background:'#23234a',color:'#a5b4fc',border:'1px solid #38bdf8',borderRadius:6,boxShadow:'none'}}
                    aria-label={`Insert ${inputMode==='super'?'superscript':inputMode==='sub'?'subscript':'normal'} ${n}`}
                    tabIndex={0}
                    onClick={() => {
                      if (inputMode === 'super') {
                        const superNum = superscriptMap[n];
                        const input = document.activeElement;
                        setUserAnswer(ans => ans + superNum);
                        if (input && input.setSelectionRange) {
                          setTimeout(() => {
                            input.focus();
                          }, 0);
                        }
                        setInputMode('normal');
                      } else if (inputMode === 'sub') {
                        const subNum = subscriptMap[n];
                        const input = document.activeElement;
                        setUserAnswer(ans => ans + subNum);
                        if (input && input.setSelectionRange) {
                          setTimeout(() => {
                            input.focus();
                          }, 0);
                        }
                        setInputMode('normal');
                      } else {
                        setUserAnswer(ans => ans + n);
                        const input = document.activeElement;
                        if (input && input.setSelectionRange) {
                          setTimeout(() => {
                            input.focus();
                          }, 0);
                        }
                      }
                    }}
                  >
                    <span style={{fontVariant:'normal',fontSize:'1.1em',verticalAlign:inputMode==='super'?'super':inputMode==='sub'?'sub':'baseline'}}>{inputMode==='super'?superscriptMap[n]:inputMode==='sub'?subscriptMap[n]:n}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {!showFeedback && (
            <button type="submit" className="ie-button ie-button-submit" style={{maxWidth:220,alignSelf:'center'}}>Submit</button>
          )}
        </form>
        {/* Feedback Section */}
        {showFeedback && (
          <div className={`ie-feedback ${feedback.type === 'correct' ? 'ie-feedback-correct' : 'ie-feedback-wrong'}`} style={{marginTop:16, width:'100%', textAlign:'center'}}>
            <div style={{fontWeight:700, fontSize:'1.1em', marginBottom:4}}>
              Correct Answer:
              <span style={{marginLeft:8, color:'#38bdf8'}}>{question.type === 'toConfig' ? toChemUnicode(question.correct) : question.correct}</span>
            </div>
            {!feedback.type === 'correct' && (
              <div style={{marginBottom:4}}>
                Your Answer:
                <span style={{marginLeft:8, color:'#f87171'}}>{question.type === 'toConfig' ? toChemUnicode(userAnswer) : userAnswer}</span>
              </div>
            )}
            <div style={{marginTop:8, fontSize:'0.98em', color:feedback.type === 'correct' ? '#22c55e' : '#f87171', background:'#fff2', borderRadius:8, padding:'8px 12px', display:'inline-block'}}>
              <span dangerouslySetInnerHTML={{__html: feedback.explanation}} />
            </div>
          </div>
        )}
        {showFeedback && (
          <button type="button" onClick={nextQuestion} className="ie-button ie-button-next">Next</button>
        )}
        <div className="ie-action-buttons">
          <button type="button" className="ie-button ie-periodic-table-button" onClick={() => setShowTable(t => !t)}>
            {showTable ? 'Hide' : 'Show'} Periodic Table
          </button>
          <button type="button" className="ie-button ie-button-back" onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </div>
      {showTable && (
        <div className="ptable-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.55)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}>
          <div
            className="glass-card"
            style={{
              maxWidth: '100vw',
              maxHeight: '97vh',
              width: '100%',
              height: 'auto',
              overflowX: 'auto',
              overflowY: 'auto',
              boxSizing: 'border-box',
              padding: 'min(3vw, 24px) 2vw', // extra horizontal padding
              margin: 0,
              borderRadius: window.innerWidth < 600 ? 8 : 24,
              background: 'rgba(36, 28, 54, 0.97)',
              position: 'relative',
              zIndex: 1001,
            }}
          >
            <div style={{ minWidth: 340, width: '100%', overflowX: 'auto' }}>
              <PeriodicTable onBack={() => setShowTable(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectronConfigShortHandActivity;