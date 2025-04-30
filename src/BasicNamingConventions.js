import React, { useState } from 'react';
import './IonicNameToFormula.css';

const LESSONS = [
  {
    type: 'info',
    title: 'What Are Naming Instructions?',
    text: `Naming conventions in chemistry help us write and speak the correct name for any compound. You'll learn how to name ionic, covalent, and acid compounds, and how to decode a name into a formula!`,
  },
  {
    type: 'info',
    title: 'Key Rules',
    text: `1. For ionic compounds: Name the cation (positive ion) first, then the anion (negative ion).\n2. For covalent compounds: Use prefixes (mono-, di-, tri-, etc.) to show the number of atoms.\n3. For acids: If it starts with H and is aqueous, it's an acid! Name depends on the anion.`,
  },
  {
    type: 'problem',
    prompt: 'What is the name of NaCl?',
    answer: 'Sodium Chloride',
    explanation: 'Na is sodium (a cation), Cl is chloride (an anion). Name the cation first, then the anion with -ide ending.'
  },
  {
    type: 'problem',
    prompt: 'Name the compound: CO2',
    answer: 'Carbon Dioxide',
    explanation: 'CO2 is a covalent compound. Use prefixes: "di-" means two oxygens. So, Carbon Dioxide.'
  },
  {
    type: 'problem',
    prompt: 'What is the name of H2SO4 (aq)?',
    answer: 'Sulfuric Acid',
    explanation: 'This is an acid. The anion is sulfate, so it becomes sulfuric acid.'
  },
  {
    type: 'word',
    prompt: 'Word Problem: A white solid is made from sodium ions and carbonate ions. What is its chemical name?',
    answer: 'Sodium Carbonate',
    explanation: 'Sodium ions (Na+) and carbonate ions (CO3^2-) make Sodium Carbonate.'
  },
  {
    type: 'word',
    prompt: 'Word Problem: You mix hydrochloric acid with sodium hydroxide and get a salt. What is the name of the salt?',
    answer: 'Sodium Chloride',
    explanation: 'Hydrochloric acid (HCl) and sodium hydroxide (NaOH) react to form sodium chloride (NaCl) and water.'
  },
];

import { useEffect } from 'react';

function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 2; i--) {
    const j = 2 + Math.floor(Math.random() * (i - 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function BasicNamingInstructions({ onBack, onPeriodicTable, step, setStep }) {
  const [input, setInput] = React.useState('');
  const [feedback, setFeedback] = React.useState('');
  const [showNext, setShowNext] = React.useState(false);
  const [lessonOrder, setLessonOrder] = React.useState(LESSONS);

  React.useEffect(() => {
    // Only shuffle problems/word problems, keep first two info cards in place
    const newOrder = shuffle(LESSONS);
    setLessonOrder(newOrder);
    if (typeof step !== 'number') setStep(0);
    setInput('');
    setFeedback('');
    setShowNext(false);
    // eslint-disable-next-line
  }, []);

  const lesson = lessonOrder[step || 0];
  const [practiceProblem, setPracticeProblem] = React.useState(null);
  const [practiceInput, setPracticeInput] = React.useState('');
  const [practiceFeedback, setPracticeFeedback] = React.useState('');
  
  // Pool of practice problems for infinite practice
  const PRACTICE_POOL = LESSONS.filter(l => l.type === 'problem' || l.type === 'word');
  function getRandomPractice() {
    return PRACTICE_POOL[Math.floor(Math.random() * PRACTICE_POOL.length)];
  }
  React.useEffect(() => {
    if (step >= LESSONS.length - 1 && !practiceProblem) {
      setPracticeProblem(getRandomPractice());
      setPracticeInput('');
      setPracticeFeedback('');
    }
    // eslint-disable-next-line
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lesson.type === 'problem' || lesson.type === 'word') {
      if (input.trim().toLowerCase() === lesson.answer.toLowerCase()) {
        setFeedback('Correct! 🎉 ' + (lesson.explanation || ''));
        setShowNext(true);
      } else {
        setFeedback('Incorrect. Try again!\n\nHint: ' + (lesson.explanation || '')); 
        setShowNext(false);
      }
    }
  };

  const handleNext = () => {
    setStep(s => Math.min(s + 1, LESSONS.length - 1));
    setInput('');
    setFeedback('');
    setShowNext(false);
  };

  return (
    <div>
      <div className="global-bg-glow" />
      <div className="glass-card fade-in slide-up" style={{ textAlign: 'center' }}>
        <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.3em', textShadow: '0 2px 18px #a259ecaa, 0 1px 0 #fff' }}>
          <span role="img" aria-label="chemistry" style={{ fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #a5b4fc)' }}>🧪</span>
          Basic Naming Instructions
        </h2>
        {step < LESSONS.length - 1 ? (
          <>
            {lesson.type === 'info' && (
              <div className="result-box feedback-animate" style={{
                background: 'linear-gradient(90deg,#a5b4fc 0,#38bdf8 100%)',
                color: '#222',
                borderRadius: 14,
                padding: '20px 26px',
                boxShadow: '0 2px 16px #a259ec55',
                margin: '18px 0',
                fontSize: '1.13em',
              }}>
                <b>{lesson.title}</b>
                <div style={{marginTop:8, whiteSpace:'pre-line'}}>{lesson.text}</div>
              </div>
            )}
            {(lesson.type === 'problem' || lesson.type === 'word') && (
              <>
                <div className="result-box feedback-animate" style={{
                  background: 'linear-gradient(90deg,#a5b4fc 0,#38bdf8 100%)',
                  color: '#222',
                  borderRadius: 14,
                  padding: '20px 26px',
                  boxShadow: '0 2px 16px #a259ec55',
                  margin: '18px 0',
                  fontSize: '1.13em',
                }}>
                  <b>{lesson.type === 'problem' ? 'Practice Problem:' : 'Word Problem:'}</b>
                  <div style={{marginTop:8}}>{lesson.prompt}</div>
                </div>
                <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
                  <input
                    className="glow-input"
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your answer here..."
                    style={{ width: 240, marginRight: 10 }}
                    disabled={showNext}
                  />
                  <button className="glow-btn" type="submit" disabled={showNext}>Check</button>
                </form>
                {feedback && (
                  <div className="result-box feedback-animate" style={{
                    background: feedback.startsWith('Correct') ? 'linear-gradient(90deg,#5eead4 0,#38bdf8 100%)' : 'linear-gradient(90deg,#ff5ca7 0,#a259ec 100%)',
                    color: '#fff',
                    borderRadius: 14,
                    padding: '20px 26px',
                    boxShadow: '0 2px 16px #a259ec55',
                    margin: '18px 0',
                    fontSize: '1.13em',
                    whiteSpace: 'pre-line',
                  }}>{feedback}</div>
                )}
              </>
            )}
            <button className="glow-btn" onClick={handleNext} disabled={!showNext && lesson.type !== 'info'}>Next</button>
          </>
        ) : (
          <div>
            <div className="result-box feedback-animate" style={{
              background: 'linear-gradient(90deg,#a5b4fc 0,#38bdf8 100%)',
              color: '#222',
              borderRadius: 14,
              padding: '20px 26px',
              boxShadow: '0 2px 16px #a259ec55',
              margin: '18px 0',
              fontSize: '1.13em',
            }}>
              <b>Great job finishing the tutorial!</b>
              <div style={{marginTop:10, marginBottom:10}}>
                You're ready to move on! Try these next:
              </div>
            </div>
            <div style={{marginTop:22, textAlign:'center'}}>
              <b>Ready for a challenge?</b>
              <div style={{margin:'10px 0 8px 0'}}>Try these next:</div>
              <button className="glow-btn" style={{marginRight:12}} onClick={() => onBack('ionic')}>Ionic Compounds: Name → Formula</button>
              <button className="glow-btn" onClick={() => onBack('formulaToName')}>Ionic Compounds: Formula → Name</button>
            </div>
          </div>
        )}
        <button className="glow-btn" onClick={onPeriodicTable} style={{ marginTop: 18, marginRight: 10 }}>Periodic Table</button>
        <button className="glow-btn" onClick={onBack} style={{ marginTop: 24 }}>Back</button>
      </div>
    </div>
  );
}

export default BasicNamingInstructions;