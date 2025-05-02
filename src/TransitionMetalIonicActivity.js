import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';

const transitionMetalProblems = [
  // Iron
  { formula: 'FeCl₂', answer: 'Iron(II) chloride', explanation: 'Fe²⁺ and 2 Cl⁻ ions.' },
  { formula: 'FeCl₃', answer: 'Iron(III) chloride', explanation: 'Fe³⁺ and 3 Cl⁻ ions.' },
  { formula: 'FeO', answer: 'Iron(II) oxide', explanation: 'Fe²⁺ and O²⁻.' },
  { formula: 'Fe₂O₃', answer: 'Iron(III) oxide', explanation: '2 Fe³⁺ and 3 O²⁻.' },
  // Copper
  { formula: 'CuO', answer: 'Copper(II) oxide', explanation: 'Cu²⁺ and O²⁻.' },
  { formula: 'Cu₂O', answer: 'Copper(I) oxide', explanation: '2 Cu⁺ and O²⁻.' },
  { formula: 'CuCl', answer: 'Copper(I) chloride', explanation: 'Cu⁺ and Cl⁻.' },
  { formula: 'CuCl₂', answer: 'Copper(II) chloride', explanation: 'Cu²⁺ and 2 Cl⁻.' },
  // Chromium
  { formula: 'CrCl₂', answer: 'Chromium(II) chloride', explanation: 'Cr²⁺ and 2 Cl⁻.' },
  { formula: 'CrCl₃', answer: 'Chromium(III) chloride', explanation: 'Cr³⁺ and 3 Cl⁻.' },
  { formula: 'Cr₂O₃', answer: 'Chromium(III) oxide', explanation: '2 Cr³⁺ and 3 O²⁻.' },
  // Cobalt
  { formula: 'CoCl₂', answer: 'Cobalt(II) chloride', explanation: 'Co²⁺ and 2 Cl⁻.' },
  { formula: 'CoCl₃', answer: 'Cobalt(III) chloride', explanation: 'Co³⁺ and 3 Cl⁻.' },
  // Lead
  { formula: 'PbO', answer: 'Lead(II) oxide', explanation: 'Pb²⁺ and O²⁻.' },
  { formula: 'PbO₂', answer: 'Lead(IV) oxide', explanation: 'Pb⁴⁺ and 2 O²⁻.' },
  { formula: 'PbCl₂', answer: 'Lead(II) chloride', explanation: 'Pb²⁺ and 2 Cl⁻.' },
  { formula: 'PbCl₄', answer: 'Lead(IV) chloride', explanation: 'Pb⁴⁺ and 4 Cl⁻.' },
  // Tin
  { formula: 'SnO', answer: 'Tin(II) oxide', explanation: 'Sn²⁺ and O²⁻.' },
  { formula: 'SnO₂', answer: 'Tin(IV) oxide', explanation: 'Sn⁴⁺ and 2 O²⁻.' },
  { formula: 'SnCl₂', answer: 'Tin(II) chloride', explanation: 'Sn²⁺ and 2 Cl⁻.' },
  { formula: 'SnCl₄', answer: 'Tin(IV) chloride', explanation: 'Sn⁴⁺ and 4 Cl⁻.' },
];

function getRandomTransitionMetalProblem() {
  return transitionMetalProblems[Math.floor(Math.random() * transitionMetalProblems.length)];
}

export default function TransitionMetalIonicActivity({ onBack }) {
  const [showTable, setShowTable] = useState(false);
  const [problem, setProblem] = useState(getRandomTransitionMetalProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const correct = userAnswer.replace(/\s+/g, '').toLowerCase() === problem.answer.replace(/\s+/g, '').toLowerCase();
    if (correct) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${problem.answer}. Explanation: ${problem.explanation}`);
    }
  }

  function handleNext() {
    setProblem(getRandomTransitionMetalProblem());
    setUserAnswer('');
    setFeedback('');
  }

  return (
    <div className="center-container fade-in slide-up tmi-activity-root" style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto', filter: showTable ? 'blur(3px)' : 'none', transition: 'filter 0.3s ease-out' }}>
      <h2 className="ptable-title">Transition Metal Ionic Compound: Formula → Name</h2>
      <div style={{ margin: '20px 0', fontWeight: 600, fontSize: '1.13em' }}>Formula: <span style={{ color: '#38bdf8', fontWeight: 700 }}>{problem.formula}</span></div>
      <form onSubmit={handleSubmit}>
        <input
          className="ptable-btn"
          style={{ fontSize: '1.15em', margin: '8px 0', padding: '10px 18px', borderRadius: 7 }}
          type="text"
          placeholder="Enter name (e.g. Iron(III) chloride)"
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          disabled={showTable}
        />
        <button className="ptable-btn" type="submit" style={{ margin: '8px 0' }} disabled={showTable}>Submit</button>
      </form>
      {feedback && <div style={{ margin: '10px 0', fontWeight: 600, color: feedback.startsWith('✅') ? '#5eead4' : '#ff5ca7' }}>{feedback}</div>}
      {!showTable && <>
        <button className="ptable-btn" style={{ marginTop: 18, marginRight: 8 }} onClick={handleNext}>Try Another</button>
        <button className="ptable-btn" style={{ marginTop: 18, background: '#4e46a1' }} onClick={() => setShowTable(true)}>Show Periodic Table</button>
        <button className="back-btn" onClick={onBack} style={{ marginTop: 18, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}>Back</button>
      </>}
      {showTable && (
        <div className="tmi-modal" style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.60)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#23234a', borderRadius:18, boxShadow:'0 6px 32px #b6f8e099', padding:30, maxWidth:900, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
            <PeriodicTable />
            <button className="ptable-btn" style={{position:'absolute', top:18, right:18, background:'#b6f8e0', color:'#23234a', fontWeight:700, borderRadius:10}} onClick={()=>setShowTable(false)}>Close</button>
            <button className="ptable-btn" style={{position:'absolute', top:18, right:120, background:'#b6f8e0', color:'#23234a', fontWeight:700, borderRadius:10}} onClick={onBack}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
