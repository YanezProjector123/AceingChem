import React, { useState, useRef } from 'react';
import PeriodicTable from './PeriodicTable';
import electronConfigs from './electron-configs.json';
import './IonizationEnergyActivity.css'; // Reuse styles for consistency

const RECENT_HISTORY_LIMIT = 20;

const superscriptMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const subscriptMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };

function toChemUnicode(str) {
  if (!str) return '';
  // Always render numbers after orbital as superscript
  return str
    .replace(/\^(\d+)/g, (_, n) => n.split('').map(d => superscriptMap[d] || d).join(''))
    .replace(/([spdfg])(\d+)/g, (m, l, n) => l + n.split('').map(d => superscriptMap[d] || d).join(''));
}

function normalizeConfig(str) {
  if (!str) return '';
  let normalized = str.trim();
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '');
  normalized = normalized.replace(/\^/g, '');
  const unicodeMap = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
  };
  normalized = Array.from(normalized).map(char => unicodeMap[char] || char).join('');
  normalized = normalized.toLowerCase();
  // Remove noble gas core if present
  normalized = normalized.replace(/\[(he|ne|ar|kr|xe|rn|og)\]/g, '');
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  return normalized;
}

function normalizeSymbol(str) {
  if (!str) return '';
  return str.trim().toLowerCase();
}

function getLongConfigBreakdown(element) {
  if (!element || !element.full) return '<i>Element or configuration data missing.</i>';
  const atomicNumber = element.number || '?';
  const symbol = element.symbol || '?';
  const name = element.name || 'Unknown';
  const full = element.full;
  return `
    <b>Step 1:</b> ${name} (${symbol}) has atomic number ${atomicNumber}, so it has ${atomicNumber} electrons.<br>
    <b>Step 2:</b> Fill orbitals in order of increasing energy: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, ...<br>
    <b>Step 3:</b> Assign electrons to each subshell until all ${atomicNumber} are placed.<br>
    <b>Final Configuration:</b> ${toChemUnicode(full)}<br>
    <i>Note: ${name} ends with ${toChemUnicode(full.split(' ').pop())}, which influences its chemical properties.</i>
  `;
}

function getRandomQuestion(excludeUIDs = []) {
  // Two types: element-to-long-config, long-config-to-element
  const types = ['toLongConfig', 'toElementFromLong'];
  let tries = 0;
  let question = null;
  while (!question && tries < 50) {
    const type = types[Math.floor(Math.random() * types.length)];
    const entry = electronConfigs[Math.floor(Math.random() * electronConfigs.length)];
    let uid = `${type}:${entry.number}`;
    if (!excludeUIDs.includes(uid)) {
      if (type === 'toLongConfig') {
        question = {
          type,
          uid,
          symbol: entry.symbol,
          name: entry.name,
          number: entry.number,
          correct: entry.full,
          entry
        };
      } else {
        question = {
          type,
          uid,
          full: entry.full,
          correct: entry.symbol,
          entry
        };
      }
    }
    tries++;
  }
  return question;
}

const ElectronConfigLongActivity = ({ onBack }) => {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [recentUIDs, setRecentUIDs] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [inputMode, setInputMode] = useState('normal');
  const inputRef = useRef();

  React.useEffect(() => {
    setQuestion(getRandomQuestion(recentUIDs));
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    // eslint-disable-next-line
  }, [round]);

  const nextQuestion = () => {
    setRecentUIDs(uids => {
      const newUIDs = [...uids, question.uid];
      return newUIDs.length > RECENT_HISTORY_LIMIT ? newUIDs.slice(-RECENT_HISTORY_LIMIT) : newUIDs;
    });
    setRound(r => r + 1);
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const checkAnswer = () => {
    if (!question) return;
    let correct = false;
    let explanation = '';
    let correctAnswer = question.correct;
    let userChem = userAnswer;
    if (question.type === 'toLongConfig') {
      correct = normalizeConfig(userAnswer) === normalizeConfig(question.correct);
      userChem = toChemUnicode(userAnswer);
      if (correct) {
        explanation = `<span style='color:#10b981'>${toChemUnicode(correctAnswer)}</span><br/>Correct!`;
      } else {
        explanation = `<span style='color:#10b981'>Correct answer: ${toChemUnicode(correctAnswer)}</span><br/>` +
          `<span style='color:#f43f5e'>Your answer: ${userChem}</span><br/>` +
          `<br><b>Step-by-step breakdown:</b><br>` + getLongConfigBreakdown(question.entry);
      }
    } else if (question.type === 'toElementFromLong') {
      correct = normalizeSymbol(userAnswer) === normalizeSymbol(question.correct);
      if (correct) {
        explanation = `<span style='color:#10b981'>${question.correct}</span><br/>Correct!`;
      } else {
        explanation = `<span style='color:#10b981'>Correct answer: ${question.correct}</span><br/>` +
          `<span style='color:#f43f5e'>Your answer: ${userAnswer}</span><br/>` +
          `<br><b>Step-by-step breakdown:</b><br>` + getLongConfigBreakdown(question.entry);
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
  if (question.type === 'toLongConfig') {
    prompt = `Write the <b>full electron configuration</b> for <b>${question.symbol}</b> (${question.name}) (atomic number ${question.number}).`;
  } else if (question.type === 'toElementFromLong') {
    prompt = `Which element has the <b>full electron configuration</b> <span style='font-family:monospace'>${toChemUnicode(question.full)}</span>? (Enter symbol)`;
  }

  return (
    <div className="center-container fade-in slide-up">
      <div className="glass-card">
        <h2 className="ptable-title">Full Electron Configuration</h2>
        <div className="ie-score-round-display">
          Score: <span className="score-value">{score}</span> | Question: {round}
        </div>
        <div className="ie-question-prompt" aria-live="polite" dangerouslySetInnerHTML={{__html: prompt}} />
        <form onSubmit={e => { e.preventDefault(); if (!showFeedback) checkAnswer(); }} className="ie-answer-form" style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <input
            type="text"
            className="ie-input"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            disabled={showFeedback}
            placeholder={question.type === 'toLongConfig' ? 'e.g. 1s² 2s² 2p⁶ 3s¹' : 'e.g. Na'}
            style={{ width: '100%', maxWidth: 340, fontSize: '1.1em', margin: '18px 0 8px 0', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #38bdf8', textAlign: 'left' }}
            aria-label="Type your answer"
            autoFocus
            ref={inputRef}
          />
          {/* Power (superscript) and subscript buttons and number buttons for quick entry (only for toLongConfig) */}
          {question.type === 'toLongConfig' && !showFeedback && (
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
              <div style={{display:'flex',gap:4,justifyContent:'center',marginBottom:8}}>
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
                        const input = inputRef.current;
                        setUserAnswer(ans => ans + superNum);
                        if (input && input.setSelectionRange) {
                          setTimeout(() => {
                            input.focus();
                          }, 0);
                        }
                        setInputMode('normal');
                      } else if (inputMode === 'sub') {
                        const subNum = subscriptMap[n];
                        const input = inputRef.current;
                        setUserAnswer(ans => ans + subNum);
                        if (input && input.setSelectionRange) {
                          setTimeout(() => {
                            input.focus();
                          }, 0);
                        }
                        setInputMode('normal');
                      } else {
                        setUserAnswer(ans => ans + n);
                        const input = inputRef.current;
                        if (input && input.setSelectionRange) {
                          setTimeout(() => {
                            input.focus();
                          }, 0);
                        }
                      }
                    }}
                  >
                    {inputMode === 'super' ? superscriptMap[n] : inputMode === 'sub' ? subscriptMap[n] : n}
                  </button>
                ))}
              </div>
            </>
          )}
          <button type="submit" className="ie-button" style={{marginTop:8}} disabled={showFeedback}>Submit</button>
        </form>
        {showFeedback && (
          <div className={`ie-feedback ${feedback.type === 'correct' ? 'ie-feedback-correct' : 'ie-feedback-wrong'}`} style={{marginTop:16, width:'100%', textAlign:'center'}}>
            <div style={{fontWeight:700, fontSize:'1.1em', marginBottom:4}}>
              Correct Answer:
              <span style={{marginLeft:8, color:'#38bdf8'}}>{question.type === 'toLongConfig' ? toChemUnicode(question.correct) : question.correct}</span>
            </div>
            {!feedback.type === 'correct' && (
              <div style={{marginBottom:4}}>
                Your Answer:
                <span style={{marginLeft:8, color:'#f87171'}}>{question.type === 'toLongConfig' ? toChemUnicode(userAnswer) : userAnswer}</span>
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
              padding: 'min(3vw, 24px) 2vw',
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

export default ElectronConfigLongActivity; 