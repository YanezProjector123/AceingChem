import React, { useState } from 'react';
import './IonicNameToFormula.css';

// --- Begin shared chemistry logic (copied from IonicNameToFormula.js) ---
const cations = [
  { name: 'Lithium', symbol: 'Li', charge: 1 },
  { name: 'Sodium', symbol: 'Na', charge: 1 },
  { name: 'Potassium', symbol: 'K', charge: 1 },
  { name: 'Rubidium', symbol: 'Rb', charge: 1 },
  { name: 'Cesium', symbol: 'Cs', charge: 1 },
  { name: 'Beryllium', symbol: 'Be', charge: 2 },
  { name: 'Magnesium', symbol: 'Mg', charge: 2 },
  { name: 'Calcium', symbol: 'Ca', charge: 2 },
  { name: 'Strontium', symbol: 'Sr', charge: 2 },
  { name: 'Barium', symbol: 'Ba', charge: 2 },
  { name: 'Aluminum', symbol: 'Al', charge: 3 },
  { name: 'Iron(II)', symbol: 'Fe', charge: 2 },
  { name: 'Iron(III)', symbol: 'Fe', charge: 3 },
  { name: 'Copper(I)', symbol: 'Cu', charge: 1 },
  { name: 'Copper(II)', symbol: 'Cu', charge: 2 },
  { name: 'Zinc', symbol: 'Zn', charge: 2 },
  { name: 'Silver', symbol: 'Ag', charge: 1 },
  { name: 'Lead(II)', symbol: 'Pb', charge: 2 },
  { name: 'Lead(IV)', symbol: 'Pb', charge: 4 },
  { name: 'Tin(II)', symbol: 'Sn', charge: 2 },
  { name: 'Tin(IV)', symbol: 'Sn', charge: 4 },
  { name: 'Chromium(III)', symbol: 'Cr', charge: 3 },
  { name: 'Manganese(II)', symbol: 'Mn', charge: 2 },
  { name: 'Ammonium', symbol: 'NH4', charge: 1 },
];
const anions = [
  { name: 'Fluoride', symbol: 'F', charge: -1 },
  { name: 'Chloride', symbol: 'Cl', charge: -1 },
  { name: 'Bromide', symbol: 'Br', charge: -1 },
  { name: 'Iodide', symbol: 'I', charge: -1 },
  { name: 'Oxide', symbol: 'O', charge: -2 },
  { name: 'Sulfide', symbol: 'S', charge: -2 },
  { name: 'Nitride', symbol: 'N', charge: -3 },
  { name: 'Phosphide', symbol: 'P', charge: -3 },
  { name: 'Nitrate', symbol: 'NO3', charge: -1 },
  { name: 'Nitrite', symbol: 'NO2', charge: -1 },
  { name: 'Sulfate', symbol: 'SO4', charge: -2 },
  { name: 'Sulfite', symbol: 'SO3', charge: -2 },
  { name: 'Hydroxide', symbol: 'OH', charge: -1 },
  { name: 'Carbonate', symbol: 'CO3', charge: -2 },
  { name: 'Bicarbonate', symbol: 'HCO3', charge: -1, synonyms: ['Hydrogen Carbonate'] },
  { name: 'Hydrogen Carbonate', symbol: 'HCO3', charge: -1, synonyms: ['Bicarbonate'] },
  { name: 'Phosphate', symbol: 'PO4', charge: -3 },
  { name: 'Phosphite', symbol: 'PO3', charge: -3 },
  { name: 'Acetate', symbol: 'C2H3O2', charge: -1 },
  { name: 'Permanganate', symbol: 'MnO4', charge: -1 },
  { name: 'Chromate', symbol: 'CrO4', charge: -2 },
  { name: 'Dichromate', symbol: 'Cr2O7', charge: -2 },
  { name: 'Cyanide', symbol: 'CN', charge: -1 },
  { name: 'Perchlorate', symbol: 'ClO4', charge: -1 },
  { name: 'Chlorate', symbol: 'ClO3', charge: -1 },
  { name: 'Chlorite', symbol: 'ClO2', charge: -1 },
  { name: 'Hypochlorite', symbol: 'ClO', charge: -1 },
];
function toSubscript(num) {
  return num.toString().split('').map(d => String.fromCharCode(8320 + +d)).join('');
}
function getFormula(problem) {
  const catAbs = Math.abs(problem.cation.charge);
  const anAbs = Math.abs(problem.anion.charge);
  let subCat = anAbs;
  let subAn = catAbs;
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(subCat, subAn);
  subCat /= divisor;
  subAn /= divisor;
  let anionPart = problem.anion.symbol;
  if (subAn > 1 && anionPart.length > 1) {
    anionPart = `(${anionPart})`;
  }
  let formula = problem.cation.symbol;
  if (subCat > 1) formula += toSubscript(subCat);
  formula += anionPart;
  if (subAn > 1) formula += toSubscript(subAn);
  return formula;
}
function getCompoundName(problem) {
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  let names = [
    `${cap(problem.cation.name)} ${cap(problem.anion.name)}`
  ];
  if (problem.anion.synonyms && problem.anion.synonyms.length) {
    for (let syn of problem.anion.synonyms) {
      names.push(`${cap(problem.cation.name)} ${cap(syn)}`);
    }
  }
  if (problem.cation.synonyms && problem.cation.synonyms.length) {
    for (let syn of problem.cation.synonyms) {
      names.push(`${cap(syn)} ${cap(problem.anion.name)}`);
      if (problem.anion.synonyms && problem.anion.synonyms.length) {
        for (let synA of problem.anion.synonyms) {
          names.push(`${cap(syn)} ${cap(synA)}`);
        }
      }
    }
  }
  return names;
}
function normalizeName(str) {
  return str.replace(/[^a-z0-9]/gi, '').toLowerCase();
}
// --- End shared chemistry logic ---

function getRandomProblem() {
  const cation = cations[Math.floor(Math.random() * cations.length)];
  let anion;
  do {
    anion = anions[Math.floor(Math.random() * anions.length)];
  } while (anion.symbol === cation.symbol);
  return { cation, anion };
}

export default function IonicFormulaToName({ onBack, onPeriodicTable }) {
  const [problem, setProblem] = useState(getRandomProblem());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const formula = getFormula(problem);
  const correctNames = getCompoundName(problem).map(normalizeName);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = normalizeName(input);
    if (correctNames.includes(user)) {
      setFeedback('Correct! 🎉');
      setShowNext(true);
    } else if (input.trim() !== '') {
      setFeedback(
        `Incorrect.\n\n- Check that both the cation and anion names are correct.\n- Watch out for spelling mistakes.\n- Capitalization, spaces, and subscript style do not matter.\n\nHow to get it right next time:\n1. Identify the cation: ${problem.cation.name}\n2. Identify the anion: ${problem.anion.name}\n3. Write the cation name first, then the anion name.\n4. Make sure to use the standard ionic naming rules (e.g., no prefixes, proper endings).\n\nTry again or press Next for a new question.`
      );
      setShowNext(true);
    } else {
      setFeedback('');
      setShowNext(false);
    }
  };

  const handleNext = () => {
    setProblem(getRandomProblem());
    setInput('');
    setFeedback('');
    setShowNext(false);
  };

  // Add floaty animation keyframes and borderGlowSpin if not present
  if (typeof document !== 'undefined' && !document.getElementById('iftn-floaty-keyframes')) {
    const style = document.createElement('style');
    style.id = 'iftn-floaty-keyframes';
    style.innerHTML = `
      @keyframes borderGlowSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes floaty { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-30px) scale(1.18); } }
      .iftn-flask-anim { animation: flask-bounce 2.6s infinite cubic-bezier(.7,0,.3,1.1); filter: drop-shadow(0 4px 24px #38bdf8cc); }
      @keyframes flask-bounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-12px) scale(1.08); } }
    `;
    document.head.appendChild(style);
  }
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 60% 40%, #a5b4fc 0%, #38bdf8 40%, #23234a 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Floating sparkles/particles */}
      {[...Array(14)].map((_,i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random()*100}%`,
          left: `${Math.random()*100}%`,
          width: 10 + Math.random()*10,
          height: 10 + Math.random()*10,
          borderRadius: '50%',
          background: `radial-gradient(circle, #fff 0%, #38bdf8 60%, transparent 100%)`,
          opacity: 0.13 + Math.random()*0.14,
          filter: 'blur(1.5px)',
          zIndex: 0,
          animation: `floaty 9s linear ${Math.random()*7}s infinite alternate`,
          pointerEvents: 'none',
        }} />
      ))}
      <div style={{
        background: 'rgba(41, 45, 72, 0.95)',
        borderRadius: 36,
        boxShadow: '0 8px 48px #6366f1bb, 0 2px 16px #38bdf8cc',
        padding: '48px 38px 42px 38px',
        maxWidth: 520,
        width: '95%',
        border: '2.5px solid #38bdf8',
        backdropFilter: 'blur(7px)',
        position: 'relative',
        zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Animated border glow */}
        <div style={{
          position: 'absolute',
          top: -8, left: -8, right: -8, bottom: -8,
          borderRadius: 44,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'conic-gradient(from 0deg, #38bdf8, #a5b4fc, #ff5ca7, #38bdf8)',
          filter: 'blur(14px) brightness(1.5)',
          opacity: 0.33,
          animation: 'borderGlowSpin 7s linear infinite',
        }} />
        <div className="iftn-flask-anim" style={{ fontSize: '3.1em', marginBottom: 12, zIndex: 2 }}>
          🧪
        </div>
        <h2 className="ptable-title" style={{
          letterSpacing: 1.5,
          fontWeight: 900,
          fontSize: '2.1em',
          textShadow: '0 2px 18px #38bdf8bb, 0 1px 0 #fff',
          color: '#fff',
          marginBottom: 10,
          zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          Ionic Formula to Name Practice
        </h2>
        <div style={{ marginBottom: 16 }}>
          <strong>What is the name of:</strong> <span style={{ color: '#a259ec', fontWeight: 700 }}>{getFormula(problem)}</span>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 28, zIndex: 2 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type the name (e.g., Ammonium Sulfate)"
            style={{
              padding: '15px 18px',
              fontSize: '1.15em',
              borderRadius: 12,
              border: 'none',
              marginRight: 16,
              background: 'rgba(30,32,50,0.98)',
              color: '#fff',
              width: 270,
              boxShadow: '0 1px 12px #23234a77',
              outline: 'none',
              transition: 'box-shadow 0.2s',
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          />
          <button type="submit" className="ptable-btn" style={{ fontWeight: 700, fontSize: '1.11em', padding: '13px 32px', borderRadius: 12, background: 'linear-gradient(90deg,#23234a 0,#a259ec 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 10px #23234a55', cursor: 'pointer', transition: 'all .18s', letterSpacing: 0.5 }}>Check</button>
        </form>
        <button className="glow-btn" style={{marginBottom: 16}} onClick={() => setShowExamples(true)}>
          <span role="img" aria-label="lightbulb" style={{marginRight:8}}>💡</span> Examples
        </button>
        <button className="ptable-btn" onClick={onPeriodicTable} style={{ marginTop: 8, marginBottom: 12, fontWeight:700, fontSize:'1.07em', background:'linear-gradient(90deg,#5eead4 0,#38bdf8 100%)', color:'#23234a', borderRadius:10, boxShadow:'0 2px 10px #5eead455', padding:'12px 28px', border:'none', cursor:'pointer', transition:'all .18s', letterSpacing:0.5, display:'flex', alignItems:'center', gap:8 }}><span role="img" aria-label="table">🧬</span> Periodic Table</button>
        <button className="back-btn" onClick={onBack} style={{ marginTop: 8, fontWeight:600, fontSize:'1.07em', background:'linear-gradient(90deg,#ff5ca7 0,#a259ec 100%)', color:'#fff', borderRadius:10, boxShadow:'0 2px 10px #a259ec55', padding:'12px 28px', border:'none', cursor:'pointer', transition:'all .18s', letterSpacing:0.5 }}>Back</button>
        {showExamples && (
          <div className="ionictutor-example-modal-bg modal-bg" style={{zIndex: 2000}} onClick={e => { if (e.target.className.includes('modal-bg')) setShowExamples(false); }}>
            <div className="ionictutor-example-modal ionictutor-modal-glow" style={{color:'#f3f3f3'}}>
              <h2 className="ptable-title" style={{
                letterSpacing: 1.5,
                fontWeight: 900,
                fontSize: '2.2em',
                textShadow: '0 2px 18px #38bdf8bb, 0 1px 0 #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
              }}>
                <span role="img" aria-label="chemistry" style={{ fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #a5b4fc)' }}>🧪</span>
                Examples
              </h2>
              <ul style={{margin:'0 0 12px 0', paddingLeft:22, color:'#e0e7ff', fontSize:'1em', listStyle:'disc'}}>
                <li><span style={{color:'#b6b8f8', fontWeight:600}} dangerouslySetInnerHTML={{__html: 'NH4NO3'.replace(/([0-9]+)/g, s => s.split('').map(d => String.fromCharCode(8320 + +d)).join(''))}} />: Ammonium Nitrate</li>
                <li><span style={{color:'#c9b6f8', fontWeight:600}} dangerouslySetInnerHTML={{__html: 'Ca3(PO4)2'.replace(/([0-9]+)/g, s => s.split('').map(d => String.fromCharCode(8320 + +d)).join(''))}} />: Calcium Phosphate</li>
                <li><span style={{color:'#b6e4f8', fontWeight:600}} dangerouslySetInnerHTML={{__html: 'K2SO4'.replace(/([0-9]+)/g, s => s.split('').map(d => String.fromCharCode(8320 + +d)).join(''))}} />: Potassium Sulfate</li>
                <li><span style={{color:'#b6f8e0', fontWeight:600}} dangerouslySetInnerHTML={{__html: 'Mg(OH)2'.replace(/([0-9]+)/g, s => s.split('').map(d => String.fromCharCode(8320 + +d)).join(''))}} />: Magnesium Hydroxide</li>
                <li><span style={{color:'#e0b6f8', fontWeight:600}} dangerouslySetInnerHTML={{__html: 'Fe2O3'.replace(/([0-9]+)/g, s => s.split('').map(d => String.fromCharCode(8320 + +d)).join(''))}} />: Iron(III) Oxide</li>
                <li><span style={{color:'#b6c8f8', fontWeight:600}} dangerouslySetInnerHTML={{__html: '(NH4)2CrO4'.replace(/([0-9]+)/g, s => s.split('').map(d => String.fromCharCode(8320 + +d)).join(''))}} />: Ammonium Chromate</li>
              </ul>
              <button className="glow-btn" style={{marginTop:4}} onClick={() => setShowExamples(false)}>Close</button>
            </div>
          </div>
        )}
        {feedback && (
          <div className="result-box feedback-animate" style={{
            margin: '18px 0',
            fontSize: '1.13em',
            background: feedback.startsWith('Correct')
              ? 'linear-gradient(90deg,#b6f8e0 0,#c9b6f8 100%)'
              : 'linear-gradient(90deg,#e0b6f8 0,#b6c8f8 100%)',
            color: '#23234a',
            borderRadius: 14,
            padding: '20px 26px',
            boxShadow: '0 2px 16px #b6b8f855',
            border: feedback.startsWith('Correct') ? '2px solid #b6f8e0' : '2px solid #e0b6f8',
            transition: 'all 0.35s',
            animation: 'fadeIn 0.7s',
          }}>
            {feedback.includes('Incorrect') ? (
              <>
                <div style={{fontWeight:700, fontSize:'1.18em', marginBottom:8, color:'#b6b8f8', letterSpacing:'0.02em'}}>Incorrect.</div>
                <ul style={{margin:'0 0 12px 0', paddingLeft:22, color:'#b6c8f8', fontSize:'1em', listStyle:'disc'}}>
                  <li>Check that both the <b>cation</b> and <b>anion</b> names are correct.</li>
                  <li>Watch out for spelling mistakes.</li>
                  <li>Capitalization, spaces, and subscript style do not matter.</li>
                </ul>
                <div style={{margin:'0 0 8px 0', color:'#c9b6f8', fontWeight:600}}>How to get it right next time:</div>
                <ol style={{paddingLeft:22, color:'#c9b6f8', fontSize:'1em', marginBottom:8}}>
                  {feedback.match(/cation: ([^\n]*)/) && <li>Identify the cation: <span style={{color:'#b6b8f8', fontWeight:700}}>{feedback.match(/cation: ([^\n]*)/)[1]}</span></li>}
                  {feedback.match(/anion: ([^\n]*)/) && <li>Identify the anion: <span style={{color:'#b6b8f8', fontWeight:700}}>{feedback.match(/anion: ([^\n]*)/)[1]}</span></li>}
                  <li>Write the cation name first, then the anion name.</li>
                  <li>Make sure to use the standard ionic naming rules (e.g., no prefixes, proper endings).</li>
                </ol>
                <div style={{marginTop:8, color:'#e0e7ff'}}>Press <b>Next</b> for a new question.</div>
              </>
            ) : (
              <>{feedback}</>
            )}
          </div>
        )}
        {showNext && (
          <button className="glow-btn" style={{ marginBottom: 18 }} onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
}
