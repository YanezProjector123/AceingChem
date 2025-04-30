import React, { useState } from 'react';
import './IonicNameToFormula.css';

// Elements and anions as per your list
const cations = [
  // Alkali metals
  { name: 'Lithium', symbol: 'Li', charge: 1 },
  { name: 'Sodium', symbol: 'Na', charge: 1 },
  { name: 'Potassium', symbol: 'K', charge: 1 },
  { name: 'Rubidium', symbol: 'Rb', charge: 1 },
  { name: 'Cesium', symbol: 'Cs', charge: 1 },
  // Alkaline earth metals
  { name: 'Beryllium', symbol: 'Be', charge: 2 },
  { name: 'Magnesium', symbol: 'Mg', charge: 2 },
  { name: 'Calcium', symbol: 'Ca', charge: 2 },
  { name: 'Strontium', symbol: 'Sr', charge: 2 },
  { name: 'Barium', symbol: 'Ba', charge: 2 },
  // Aluminum
  { name: 'Aluminum', symbol: 'Al', charge: 3 },
  // Transition metals (common AP Chem)
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
  // Ammonium
  { name: 'Ammonium', symbol: 'NH4', charge: 1 },
];

const anions = [
  // Halides
  { name: 'Fluoride', symbol: 'F', charge: -1 },
  { name: 'Chloride', symbol: 'Cl', charge: -1 },
  { name: 'Bromide', symbol: 'Br', charge: -1 },
  { name: 'Iodide', symbol: 'I', charge: -1 },
  // Oxide, sulfide, nitride, phosphide
  { name: 'Oxide', symbol: 'O', charge: -2 },
  { name: 'Sulfide', symbol: 'S', charge: -2 },
  { name: 'Nitride', symbol: 'N', charge: -3 },
  { name: 'Phosphide', symbol: 'P', charge: -3 },
  // Polyatomic ions (AP Chem must-know)
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

// --- SHUFFLE AND CYCLE SYSTEM ---
let allProblems = [];
let usedProblems = [];

function shuffleProblems() {
  allProblems = [];
  for (const cation of cations) {
    for (const anion of anions) {
      // Don't allow same element for both cation/anion (e.g. "Sodium Sodium")
      if (cation.symbol !== anion.symbol) {
        allProblems.push({ cation, anion });
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = allProblems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProblems[i], allProblems[j]] = [allProblems[j], allProblems[i]];
  }

  usedProblems = [];
}

function getRandomProblem() {
  if (allProblems.length === 0) {
    shuffleProblems();
  }

  // Cycle through all before repeating
  const problem = allProblems.pop();
  usedProblems.push(problem);
  // When all used, reshuffle
  if (allProblems.length === 0) {
    shuffleProblems();
  }

  return problem;
}

// Helper to get subscript unicode
const subscriptMap = {
  '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084', '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
};

function toSubscript(num) {
  return num.toString().split('').map(d => String.fromCharCode(8320 + +d)).join('');
}

// Helper to normalize formula (remove spaces, lowercase, convert all subscripts to normal digits)
function normalizeFormula(str) {
  if (!str) return '';
  // Convert unicode subscripts to normal digits
  const subMap = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
  str = str.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => subMap[d] || d);
  return str.replace(/\s+/g, '').toLowerCase();
}

// Helper to calculate formula
function getFormula(problem) {
  // Criss-cross method
  const catAbs = Math.abs(problem.cation.charge);
  const anAbs = Math.abs(problem.anion.charge);
  let subCat = anAbs;
  let subAn = catAbs;
  // Reduce subscripts if possible
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(subCat, subAn);
  subCat /= divisor;
  subAn /= divisor;

  // Format anion (parentheses if polyatomic and subscript > 1)
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
  // Capitalize both cation and anion names
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  let names = [
    `${cap(problem.cation.name)} ${cap(problem.anion.name)}`
  ];
  // Accept synonyms for anion
  if (problem.anion.synonyms && problem.anion.synonyms.length) {
    for (let syn of problem.anion.synonyms) {
      names.push(`${cap(problem.cation.name)} ${cap(syn)}`);
    }
  }

  // Accept synonyms for cation (future-proof)
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

function subscriptExplanation(problem) {
  const catAbs = Math.abs(problem.cation.charge);
  const anAbs = Math.abs(problem.anion.charge);
  let subCat = anAbs;
  let subAn = catAbs;
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(subCat, subAn);
  subCat /= divisor;
  subAn /= divisor;
  let expl = '';
  if (subCat > 1) expl += `You need ${subCat} ${problem.cation.symbol} ions`;
  if (subAn > 1) expl += `${expl ? ' and ' : ''} ${subAn} ${problem.anion.symbol} ions`;
  if (expl) expl += ' to balance the charges.';
  if (subAn > 1 && problem.anion.symbol.length > 1) expl += ' Parentheses are needed around polyatomic ions when more than one is present.';
  return expl || '';
}

function IonicNameToFormula({ onBack, onPeriodicTable }) {
  // Add global background glow for this screen
  // (This should be rendered at the root of the return statement)

  const [problem, setProblem] = useState(getRandomProblem());
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [explanation, setExplanation] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);

  // Educational, step-by-step examples
  const examples = [
    {
      title: 'Sodium Chloride',
      formula: 'NaCl',
      steps: [
        { icon: '🧂', text: 'Step 1: Identify the ions.\nSodium is Na⁺ and chloride is Cl⁻.' },
        { icon: '⚖️', text: 'Step 2: Balance the charges.\nNa⁺ and Cl⁻ balance 1:1, so only one of each is needed.' },
        { icon: '📝', text: 'Step 3: Write the formula.\nCombine the symbols: NaCl (no subscripts needed).' },
      ],
      tip: 'Tip: If the charges are equal and opposite, just write the symbols together!'
    },
    {
      title: 'Calcium Phosphate',
      formula: 'Ca₃(PO₄)₂',
      steps: [
        { icon: '🔎', text: 'Step 1: Identify the ions.\nCalcium is Ca²⁺ and phosphate is PO₄³⁻.' },
        { icon: '⚖️', text: 'Step 2: Balance the charges.\nFind the lowest common multiple of 2 and 3: need 3 Ca²⁺ and 2 PO₄³⁻ to balance to zero.' },
        { icon: '📝', text: 'Step 3: Write the formula.\nWrite Ca₃(PO₄)₂. Use parentheses around PO₄ because there is more than one.' },
      ],
      tip: 'Tip: Always use parentheses for polyatomic ions if there is more than one!'
    },
    {
      title: 'Ammonium Sulfate',
      formula: '(NH₄)₂SO₄',
      steps: [
        { icon: '🔎', text: 'Step 1: Identify the ions.\nAmmonium is NH₄⁺ and sulfate is SO₄²⁻.' },
        { icon: '⚖️', text: 'Step 2: Balance the charges.\nNeed 2 NH₄⁺ for every SO₄²⁻ to balance charges.' },
        { icon: '📝', text: 'Step 3: Write the formula.\nWrite (NH₄)₂SO₄. Parentheses show there are two ammonium ions.' },
      ],
      tip: 'Tip: Parentheses are used when more than one polyatomic ion is needed!'
    },
    {
      title: 'Aluminum Oxide',
      formula: 'Al₂O₃',
      steps: [
        { icon: '🔎', text: 'Step 1: Identify the ions.\nAluminum is Al³⁺ and oxide is O²⁻.' },
        { icon: '⚖️', text: 'Step 2: Balance the charges.\nNeed 2 Al³⁺ and 3 O²⁻ to balance charges (2×3 = 3×2).' },
        { icon: '📝', text: 'Step 3: Write the formula.\nWrite Al₂O₃. No parentheses needed.' },
      ],
      tip: 'Tip: Use the criss-cross method for tricky ratios!'
    },
  ];

  const correctFormula = getFormula(problem);

  const handleInput = (e) => setInput(e.target.value);

  const handleSubscript = (n) => {
    setInput(input + toSubscript(n));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = normalizeFormula(input);
    const correct = normalizeFormula(correctFormula);
    if (user === correct) {
      setFeedback('Correct! 🎉');
      setExplanation(
        `<div style='margin-bottom: 6px;'><b>Congratulations!</b> You got it right! <b>${getCompoundName(problem)}</b> is written as <b>${correctFormula}</b>.</div>\n` +
        `<ul style='padding-left: 20px; margin: 0 0 4px 0;'>` +
          `<li><b>Why?</b> The charges of <b>${problem.cation.symbol}</b> (${problem.cation.charge > 0 ? '+' : ''}${problem.cation.charge}) and <b>${problem.anion.symbol}</b> (${problem.anion.charge}) must balance to zero.</li>` +
          `<li><b>How?</b> ${subscriptExplanation(problem)}</li>` +
        `</ul>` +
        `<div style='margin-top: 6px;'>Keep practicing to master ionic formulas!</div>`
      );
      setShowNext(true);
    } else if (input.trim() !== '') {
      setFeedback("Incorrect.");
      setExplanation(
        `<div><b>Why is it wrong?</b> The correct ionic formula must balance the charges of the cation (${problem.cation.symbol}, ${problem.cation.charge > 0 ? '+' : ''}${problem.cation.charge}) and the anion (${problem.anion.symbol}, ${problem.anion.charge}).<br/>Remember to criss-cross the charges to get the subscripts and use parentheses for polyatomic ions if needed.</div>`
      );
      setShowNext(true);
    } else {
      setFeedback('');
      setShowNext(false);
      setExplanation('');
    }
  };

  // Explain why parentheses or subscripts are used
  function subscriptExplanation(problem) {
    const catAbs = Math.abs(problem.cation.charge);
    const anAbs = Math.abs(problem.anion.charge);
    let subCat = anAbs;
    let subAn = catAbs;
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(subCat, subAn);
    subCat /= divisor;
    subAn /= divisor;
    let expl = '';
    if (subCat > 1) expl += `You need ${subCat} ${problem.cation.symbol} ions`;
    if (subAn > 1) expl += `${expl ? ' and ' : ''} ${subAn} ${problem.anion.symbol} ions`;
    if (expl) expl += ' to balance the charges.';
    if (subAn > 1 && problem.anion.symbol.length > 1) expl += ' Parentheses are needed around polyatomic ions when more than one is present.';
    return expl || '';
  }

  return (
    <div className="center-container fade-in" style={{minWidth: 340, maxWidth: 420}}>
      <div style={{ marginBottom: 16 }}>
        <strong>Write the formula for:</strong> <span style={{ color: '#7c3aed', fontWeight: 600 }}>{getCompoundName(problem)}</span>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Enter formula (e.g. NaCl)"
          className="glow-input"
          style={{ width: '100%', maxWidth: 320 }}
        />
        <button type="submit" className="glow-btn" style={{ padding: '10px 20px', fontSize: '1rem' }}>Check</button>
      </form>

      <div className="subscript-btn-card">
        <div className="subscript-btn-label">
          <span className="subscript-icon">₁</span> Subscript buttons
        </div>
        <div className="subscript-btn-grid">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button
              key={n}
              type="button"
              className="subscript-btn"
              data-tooltip={`Insert subscript ${toSubscript(n)}`}
              onClick={() => setInput(input + toSubscript(n))}
            >
              {toSubscript(n)}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: '#ff5ca7', display: 'block', marginTop: 10, fontWeight: 500 }}>
          Tip: Use these to write formulas like H₂O or Ca₃(PO₄)₂!
        </span>
      </div>
      <button className="glow-btn" type="button" onClick={() => setShowExample(true)}>
        <span role="img" aria-label="Lightbulb">💡</span> Example
      </button>
      {/* Educational Example Modal */}
      {showExample && (
        <div className="ionictutor-example-modal-bg modal-bg" onClick={e => { if (e.target.className.includes('modal-bg')) setShowExample(false); }}>
          <div className="ionictutor-example-modal ionictutor-modal-glow">
            <h2 className="ptable-title" style={{
              letterSpacing: 1.5,
              fontWeight: 900,
              fontSize: '2.2em',
              textShadow: '0 2px 18px #38bdf8bb, 0 1px 0 #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
            }}>
              <span role="img" aria-label="chemistry" style={{ fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #a5b4fc)' }}>🧪</span>
              Ionic Name to Formula Practice
            </h2>
            <div className="ionictutor-example-nav">
              <button className="glow-btn" onClick={() => setExampleIdx(idx => Math.max(idx-1, 0))} disabled={exampleIdx === 0}>⟵ Prev</button>
              <span style={{ fontWeight: 700, fontSize: '1.09em', color: '#fff', textShadow: '0 2px 8px #a259ec77' }}>{examples[exampleIdx].title} <span style={{ color: '#a5b4fc', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.97em', marginLeft: 4, textShadow: '0 2px 8px #ff5ca799' }}>→ {examples[exampleIdx].formula}</span></span>
              <button className="glow-btn" onClick={() => setExampleIdx(idx => Math.min(idx+1, examples.length-1))} disabled={exampleIdx === examples.length-1}>Next ⟶</button>
            </div>
            <div className="ionictutor-example-steps">
              {examples[exampleIdx].steps.map((step, i) => (
                <div className="ionictutor-example-step">
                  <span className="ionictutor-step-icon">{step.icon}</span>
                  <span dangerouslySetInnerHTML={{__html: step.text.replace(/\n/g, '<br/>')}} />
                </div>
              ))}
            </div>
            <span className="ionictutor-tip">{examples[exampleIdx].tip}</span>
            <button className="glow-btn" onClick={() => setShowExample(false)}>Got it!</button>
          </div>
        </div>
      )}
      <button className="glow-btn" onClick={onPeriodicTable}>Periodic Table</button>
      {feedback && <div style={{ marginBottom: 6, color: feedback.startsWith('Correct') ? 'var(--correct-color)' : 'var(--incorrect-color)', fontWeight: 600 }}>{feedback}</div>}
      {explanation && (
        <div
          key={feedback === 'Incorrect.' ? 'wrong-'+problem.cation.symbol+problem.anion.symbol : 'right-'+problem.cation.symbol+problem.anion.symbol}
          className={feedback === 'Incorrect.' ? 'explanation-animate-wrong' : ''}
          style={{
            marginBottom: 10,
            color: feedback === 'Incorrect.' ? '#fff' : 'var(--text-color)',
            fontSize: '1em',
            background: feedback === 'Incorrect.' ? 'linear-gradient(90deg,#ff5ca7 0,#a259ec 100%)' : 'var(--background-color)',
            borderRadius: 12,
            padding: '12px 16px',
            border: feedback === 'Incorrect.' ? '2.5px solid #ff5ca7' : 'none',
            boxShadow: feedback === 'Incorrect.' ? '0 2px 16px #ff5ca755' : 'none',
            transition: 'all 0.35s',
            animation: feedback === 'Incorrect.' ? 'shake-wrong 0.5s' : 'none',
          }}
          dangerouslySetInnerHTML={{ __html: explanation }}
        />
      )}
      <>
        {showNext && (
          <button
            className="next-btn"
            style={{ marginTop: 8, marginRight: 10, background: 'var(--correct-color)', color: '#fff', fontWeight: 600 }}
            onClick={() => {
              setProblem(getRandomProblem());
              setInput('');
              setFeedback('');
              setExplanation('');
              setShowNext(false);
            }}
          >
            Next
          </button>
        )}
        <button className="dark-back-btn" onClick={onBack} style={{ marginTop: 8 }}>Back</button>
      </>
    </div>
  );
}

export default IonicNameToFormula;