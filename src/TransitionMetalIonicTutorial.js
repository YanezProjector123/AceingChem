import React, { useState } from 'react';

const exampleQuestions = [
  {
    formula: 'FeCl₂',
    answer: 'Iron(II) chloride',
    explanation: 'Fe is iron, a transition metal. Cl is chloride. The (II) shows iron is +2 here.'
  },
  {
    formula: 'FeCl₃',
    answer: 'Iron(III) chloride',
    explanation: 'Fe is iron, a transition metal. Cl is chloride. The (III) shows iron is +3 here.'
  },
  {
    formula: 'CuO',
    answer: 'Copper(II) oxide',
    explanation: 'Cu is copper, a transition metal. O is oxide. The (II) shows copper is +2 here.'
  },
  {
    formula: 'Cu₂O',
    answer: 'Copper(I) oxide',
    explanation: 'Cu is copper, a transition metal. O is oxide. The (I) shows copper is +1 here.'
  },
  {
    formula: 'PbO₂',
    answer: 'Lead(IV) oxide',
    explanation: 'Pb is lead, a transition metal. O is oxide. The (IV) shows lead is +4 here.'
  },
  {
    formula: 'SnCl₄',
    answer: 'Tin(IV) chloride',
    explanation: 'Sn is tin, a transition metal. Cl is chloride. The (IV) shows tin is +4 here.'
  },
];

export default function TransitionMetalIonicTutorial({ onBack }) {
  const [step, setStep] = useState(0); // 0 = tutorial, 1 = question
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [questionIdx, setQuestionIdx] = useState(0);

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      setInput('');
      setFeedback('');
      setQuestionIdx(Math.floor(Math.random() * exampleQuestions.length));
    } else {
      // Next question
      setInput('');
      setFeedback('');
      setQuestionIdx(Math.floor(Math.random() * exampleQuestions.length));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === exampleQuestions[questionIdx].answer.toLowerCase()) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback('❌ Not quite. Try again.');
    }
  };

  return (
    <div className="center-container fade-in slide-up" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
      <h2 className="ptable-title">Transition Metal Ionic Bonds Tutorial</h2>
      <div className="glass-card" style={{ padding: '30px 30px 18px 30px', fontSize: '1.13em', background: 'rgba(40,40,80,0.90)', color: '#e0e7ff', borderRadius: 18, boxShadow: '0 4px 32px #b6f8e055', marginBottom: 24 }}>
        {step === 0 && (
          <>
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <p><b>Transition metals</b> (like iron, copper, chromium, etc.) can form more than one type of positive ion (cation), so their ionic compounds require special naming rules.</p>
              <ul>
                <li><b>Roman numerals</b> are used in the name to indicate the charge of the transition metal cation. For example: <b>Iron(III) chloride</b> is FeCl₃, where iron has a +3 charge.</li>
                <li>The nonmetal (anion) is named as usual (chloride, oxide, etc.).</li>
                <li>Common transition metals with multiple charges include iron (Fe²⁺/Fe³⁺), copper (Cu⁺/Cu²⁺), chromium (Cr²⁺/Cr³⁺), cobalt (Co²⁺/Co³⁺), lead (Pb²⁺/Pb⁴⁺), tin (Sn²⁺/Sn⁴⁺), and others.</li>
              </ul>
              <p><b>Examples:</b></p>
              <ul>
                <li>FeCl₂: Iron(II) chloride (iron has a +2 charge)</li>
                <li>FeCl₃: Iron(III) chloride (iron has a +3 charge)</li>
                <li>CuO: Copper(II) oxide (copper has a +2 charge)</li>
                <li>Cu₂O: Copper(I) oxide (copper has a +1 charge)</li>
              </ul>
              <p><b>Key Points:</b></p>
              <ul>
                <li>Always specify the charge of the transition metal with a Roman numeral in parentheses.</li>
                <li>Balance charges to determine the correct formula.</li>
                <li>Practice both naming (formula → name) and formula writing (name → formula) for compounds with transition metals.</li>
              </ul>
            </div>
            <button className="ptable-btn" style={{ marginTop: 18 }} onClick={handleNext}>Try Example Questions</button>
          </>
        )}
        {step === 1 && (
          <>
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <b>Example:</b> <span style={{ color: '#b6f8e0' }}>{exampleQuestions[questionIdx].formula}</span><br />
              <span style={{ fontSize: '1.05em' }}>What is the name of this compound?</span>
            </div>
            <form onSubmit={handleSubmit} style={{ marginBottom: 10 }}>
              <input
                className="glow-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type the name here"
                style={{ fontSize: '1.1em', width: '90%', maxWidth: 340, marginBottom: 10 }}
              />
              <br />
              <button className="ptable-btn" type="submit" style={{ margin: '8px 0' }}>Submit</button>
            </form>
            {feedback && <div style={{ margin: '10px 0', fontWeight: 600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7' }}>{feedback}</div>}
            <div style={{ marginTop: 10, background: 'rgba(182,248,224,0.13)', borderRadius: 10, padding: '12px 16px', color: '#b6f8e0' }}>{exampleQuestions[questionIdx].explanation}</div>
            <button className="ptable-btn" style={{ marginTop: 18, marginRight: 8 }} onClick={handleNext}>Try Another</button>
            <button className="ptable-btn" style={{ marginTop: 18, background: '#4e46a1' }} onClick={() => setStep(0)}>Review Tutorial</button>
          </>
        )}
      </div>
      <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
    </div>
  );
}

