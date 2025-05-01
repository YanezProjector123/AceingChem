import React, { useState } from 'react';

// Expanded periodic table data for more question variety
const elements = [
  // Period 1
  { symbol: 'H', name: 'Hydrogen', period: 1, group: 1, atomicRadius: 53 },
  { symbol: 'He', name: 'Helium', period: 1, group: 18, atomicRadius: 31 },
  // Period 2
  { symbol: 'Li', name: 'Lithium', period: 2, group: 1, atomicRadius: 167 },
  { symbol: 'Be', name: 'Beryllium', period: 2, group: 2, atomicRadius: 112 },
  { symbol: 'B', name: 'Boron', period: 2, group: 13, atomicRadius: 87 },
  { symbol: 'C', name: 'Carbon', period: 2, group: 14, atomicRadius: 67 },
  { symbol: 'N', name: 'Nitrogen', period: 2, group: 15, atomicRadius: 56 },
  { symbol: 'O', name: 'Oxygen', period: 2, group: 16, atomicRadius: 48 },
  { symbol: 'F', name: 'Fluorine', period: 2, group: 17, atomicRadius: 42 },
  { symbol: 'Ne', name: 'Neon', period: 2, group: 18, atomicRadius: 38 },
  // Period 3
  { symbol: 'Na', name: 'Sodium', period: 3, group: 1, atomicRadius: 190 },
  { symbol: 'Mg', name: 'Magnesium', period: 3, group: 2, atomicRadius: 145 },
  { symbol: 'Al', name: 'Aluminum', period: 3, group: 13, atomicRadius: 118 },
  { symbol: 'Si', name: 'Silicon', period: 3, group: 14, atomicRadius: 111 },
  { symbol: 'P', name: 'Phosphorus', period: 3, group: 15, atomicRadius: 98 },
  { symbol: 'S', name: 'Sulfur', period: 3, group: 16, atomicRadius: 88 },
  { symbol: 'Cl', name: 'Chlorine', period: 3, group: 17, atomicRadius: 79 },
  { symbol: 'Ar', name: 'Argon', period: 3, group: 18, atomicRadius: 71 },
  // Period 4
  { symbol: 'K', name: 'Potassium', period: 4, group: 1, atomicRadius: 243 },
  { symbol: 'Ca', name: 'Calcium', period: 4, group: 2, atomicRadius: 194 },
  { symbol: 'Sc', name: 'Scandium', period: 4, group: 3, atomicRadius: 184 },
  { symbol: 'Ti', name: 'Titanium', period: 4, group: 4, atomicRadius: 176 },
  { symbol: 'V', name: 'Vanadium', period: 4, group: 5, atomicRadius: 171 },
  { symbol: 'Cr', name: 'Chromium', period: 4, group: 6, atomicRadius: 166 },
  { symbol: 'Mn', name: 'Manganese', period: 4, group: 7, atomicRadius: 161 },
  { symbol: 'Fe', name: 'Iron', period: 4, group: 8, atomicRadius: 156 },
  { symbol: 'Co', name: 'Cobalt', period: 4, group: 9, atomicRadius: 152 },
  { symbol: 'Ni', name: 'Nickel', period: 4, group: 10, atomicRadius: 149 },
  { symbol: 'Cu', name: 'Copper', period: 4, group: 11, atomicRadius: 145 },
  { symbol: 'Zn', name: 'Zinc', period: 4, group: 12, atomicRadius: 142 },
  { symbol: 'Ga', name: 'Gallium', period: 4, group: 13, atomicRadius: 136 },
  { symbol: 'Ge', name: 'Germanium', period: 4, group: 14, atomicRadius: 125 },
  { symbol: 'As', name: 'Arsenic', period: 4, group: 15, atomicRadius: 114 },
  { symbol: 'Se', name: 'Selenium', period: 4, group: 16, atomicRadius: 103 },
  { symbol: 'Br', name: 'Bromine', period: 4, group: 17, atomicRadius: 94 },
  { symbol: 'Kr', name: 'Krypton', period: 4, group: 18, atomicRadius: 88 },
  // Period 5
  { symbol: 'Rb', name: 'Rubidium', period: 5, group: 1, atomicRadius: 265 },
  { symbol: 'Sr', name: 'Strontium', period: 5, group: 2, atomicRadius: 219 },
  { symbol: 'Y', name: 'Yttrium', period: 5, group: 3, atomicRadius: 212 },
  { symbol: 'Zr', name: 'Zirconium', period: 5, group: 4, atomicRadius: 206 },
  { symbol: 'Nb', name: 'Niobium', period: 5, group: 5, atomicRadius: 198 },
  { symbol: 'Mo', name: 'Molybdenum', period: 5, group: 6, atomicRadius: 190 },
  { symbol: 'Tc', name: 'Technetium', period: 5, group: 7, atomicRadius: 183 },
  { symbol: 'Ru', name: 'Ruthenium', period: 5, group: 8, atomicRadius: 178 },
  { symbol: 'Rh', name: 'Rhodium', period: 5, group: 9, atomicRadius: 173 },
  { symbol: 'Pd', name: 'Palladium', period: 5, group: 10, atomicRadius: 169 },
  { symbol: 'Ag', name: 'Silver', period: 5, group: 11, atomicRadius: 165 },
  { symbol: 'Cd', name: 'Cadmium', period: 5, group: 12, atomicRadius: 161 },
  { symbol: 'In', name: 'Indium', period: 5, group: 13, atomicRadius: 156 },
  { symbol: 'Sn', name: 'Tin', period: 5, group: 14, atomicRadius: 145 },
  { symbol: 'Sb', name: 'Antimony', period: 5, group: 15, atomicRadius: 133 },
  { symbol: 'Te', name: 'Tellurium', period: 5, group: 16, atomicRadius: 123 },
  { symbol: 'I', name: 'Iodine', period: 5, group: 17, atomicRadius: 115 },
  { symbol: 'Xe', name: 'Xenon', period: 5, group: 18, atomicRadius: 108 },
  // Period 6
  { symbol: 'Cs', name: 'Cesium', period: 6, group: 1, atomicRadius: 298 },
  { symbol: 'Ba', name: 'Barium', period: 6, group: 2, atomicRadius: 253 },
  { symbol: 'La', name: 'Lanthanum', period: 6, group: 3, atomicRadius: 195 },
  { symbol: 'Hf', name: 'Hafnium', period: 6, group: 4, atomicRadius: 208 },
  { symbol: 'Ta', name: 'Tantalum', period: 6, group: 5, atomicRadius: 200 },
  { symbol: 'W', name: 'Tungsten', period: 6, group: 6, atomicRadius: 193 },
  { symbol: 'Re', name: 'Rhenium', period: 6, group: 7, atomicRadius: 188 },
  { symbol: 'Os', name: 'Osmium', period: 6, group: 8, atomicRadius: 185 },
  { symbol: 'Ir', name: 'Iridium', period: 6, group: 9, atomicRadius: 180 },
  { symbol: 'Pt', name: 'Platinum', period: 6, group: 10, atomicRadius: 177 },
  { symbol: 'Au', name: 'Gold', period: 6, group: 11, atomicRadius: 174 },
  { symbol: 'Hg', name: 'Mercury', period: 6, group: 12, atomicRadius: 171 },
  { symbol: 'Tl', name: 'Thallium', period: 6, group: 13, atomicRadius: 156 },
  { symbol: 'Pb', name: 'Lead', period: 6, group: 14, atomicRadius: 154 },
  { symbol: 'Bi', name: 'Bismuth', period: 6, group: 15, atomicRadius: 143 },
  { symbol: 'Po', name: 'Polonium', period: 6, group: 16, atomicRadius: 135 },
  { symbol: 'At', name: 'Astatine', period: 6, group: 17, atomicRadius: 127 },
  { symbol: 'Rn', name: 'Radon', period: 6, group: 18, atomicRadius: 120 },
  // Period 7
  { symbol: 'Fr', name: 'Francium', period: 7, group: 1, atomicRadius: 348 },
  { symbol: 'Ra', name: 'Radium', period: 7, group: 2, atomicRadius: 283 },
  { symbol: 'Ac', name: 'Actinium', period: 7, group: 3, atomicRadius: 195 },
  { symbol: 'Rf', name: 'Rutherfordium', period: 7, group: 4, atomicRadius: 157 },
  { symbol: 'Db', name: 'Dubnium', period: 7, group: 5, atomicRadius: 149 },
  { symbol: 'Sg', name: 'Seaborgium', period: 7, group: 6, atomicRadius: 143 },
  { symbol: 'Bh', name: 'Bohrium', period: 7, group: 7, atomicRadius: 141 },
  { symbol: 'Hs', name: 'Hassium', period: 7, group: 8, atomicRadius: 134 },
  { symbol: 'Mt', name: 'Meitnerium', period: 7, group: 9, atomicRadius: 129 },
  { symbol: 'Ds', name: 'Darmstadtium', period: 7, group: 10, atomicRadius: 128 },
  { symbol: 'Rg', name: 'Roentgenium', period: 7, group: 11, atomicRadius: 121 },
  { symbol: 'Cn', name: 'Copernicium', period: 7, group: 12, atomicRadius: 122 },
  // Select lanthanides and actinides
  { symbol: 'Ce', name: 'Cerium', period: 6, group: 3, atomicRadius: 185 },
  { symbol: 'Pr', name: 'Praseodymium', period: 6, group: 3, atomicRadius: 247 },
  { symbol: 'Nd', name: 'Neodymium', period: 6, group: 3, atomicRadius: 206 },
  { symbol: 'Pm', name: 'Promethium', period: 6, group: 3, atomicRadius: 205 },
  { symbol: 'Sm', name: 'Samarium', period: 6, group: 3, atomicRadius: 238 },
  { symbol: 'Eu', name: 'Europium', period: 6, group: 3, atomicRadius: 231 },
  { symbol: 'Gd', name: 'Gadolinium', period: 6, group: 3, atomicRadius: 233 },
  { symbol: 'Tb', name: 'Terbium', period: 6, group: 3, atomicRadius: 225 },
  { symbol: 'Dy', name: 'Dysprosium', period: 6, group: 3, atomicRadius: 228 },
  { symbol: 'Ho', name: 'Holmium', period: 6, group: 3, atomicRadius: 226 },
  { symbol: 'Er', name: 'Erbium', period: 6, group: 3, atomicRadius: 226 },
  { symbol: 'Tm', name: 'Thulium', period: 6, group: 3, atomicRadius: 222 },
  { symbol: 'Yb', name: 'Ytterbium', period: 6, group: 3, atomicRadius: 222 },
  { symbol: 'Lu', name: 'Lutetium', period: 6, group: 3, atomicRadius: 217 },
  { symbol: 'Th', name: 'Thorium', period: 7, group: 3, atomicRadius: 179 },
  { symbol: 'Pa', name: 'Protactinium', period: 7, group: 3, atomicRadius: 161 },
  { symbol: 'U', name: 'Uranium', period: 7, group: 3, atomicRadius: 156 },
  { symbol: 'Np', name: 'Neptunium', period: 7, group: 3, atomicRadius: 155 },
  { symbol: 'Pu', name: 'Plutonium', period: 7, group: 3, atomicRadius: 154 },
  { symbol: 'Am', name: 'Americium', period: 7, group: 3, atomicRadius: 173 },
  { symbol: 'Cm', name: 'Curium', period: 7, group: 3, atomicRadius: 174 },
  { symbol: 'Bk', name: 'Berkelium', period: 7, group: 3, atomicRadius: 170 },
  { symbol: 'Cf', name: 'Californium', period: 7, group: 3, atomicRadius: 186 },
  { symbol: 'Es', name: 'Einsteinium', period: 7, group: 3, atomicRadius: 161 },
  { symbol: 'Fm', name: 'Fermium', period: 7, group: 3, atomicRadius: 156 },
  { symbol: 'Md', name: 'Mendelevium', period: 7, group: 3, atomicRadius: 153 },
  { symbol: 'No', name: 'Nobelium', period: 7, group: 3, atomicRadius: 151 },
  { symbol: 'Lr', name: 'Lawrencium', period: 7, group: 3, atomicRadius: 150 },
];

// Utility for random ints
function randInt(n) {
  return Math.floor(Math.random() * n);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate a random question variation
function getRandomQuestion() {
  const types = [
    'larger', // Which is larger?
    'smaller', // Which is smaller?
    'arrange_increasing', // Arrange in increasing order
    'arrange_decreasing', // Arrange in decreasing order
    'true_false', // True/False: X > Y
    'closest', // Closest to a value
    'largest_in_period', // Largest in period
    'smallest_in_period', // Smallest in period
    'largest_in_group', // Largest in group
    'smallest_in_group', // Smallest in group
  ];
  const type = types[randInt(types.length)];
  let q = { type };

  // Helper: get unique random elements
  function pickUnique(n, filterFn) {
    let pool = filterFn ? elements.filter(filterFn) : elements;
    pool = shuffle(pool);
    return pool.slice(0, n);
  }

  if (type === 'larger' || type === 'smaller') {
    const [a, b] = pickUnique(2);
    q.elements = [a, b];
    q.correctIdx = (type === 'larger') ? (a.atomicRadius > b.atomicRadius ? 0 : 1) : (a.atomicRadius < b.atomicRadius ? 0 : 1);
    q.prompt = `Which element has the ${type === 'larger' ? 'larger' : 'smaller'} atomic radius?`;
  } else if (type === 'arrange_increasing' || type === 'arrange_decreasing') {
    const els = pickUnique(3);
    q.elements = shuffle(els);
    q.correctOrder = els.slice().sort((a, b) => type === 'arrange_increasing' ? a.atomicRadius - b.atomicRadius : b.atomicRadius - a.atomicRadius).map(e => e.symbol);
    q.prompt = `Arrange these elements in order of ${type === 'arrange_increasing' ? 'increasing' : 'decreasing'} atomic radius:`;
  } else if (type === 'true_false') {
    const [a, b] = pickUnique(2);
    q.elements = [a, b];
    q.answer = a.atomicRadius > b.atomicRadius;
    q.prompt = `True or False: ${a.symbol} (${a.name}) has a larger atomic radius than ${b.symbol} (${b.name})?`;
  } else if (type === 'closest') {
    const els = pickUnique(3);
    const target = els[randInt(3)].atomicRadius + randInt(40) - 20; // random offset
    q.elements = els;
    q.target = target;
    q.correctIdx = els.reduce((bestIdx, el, idx, arr) => Math.abs(el.atomicRadius - target) < Math.abs(arr[bestIdx].atomicRadius - target) ? idx : bestIdx, 0);
    q.prompt = `Which element has an atomic radius closest to ${target} pm?`;
  } else if (type === 'largest_in_period' || type === 'smallest_in_period') {
    const period = randInt(7) + 1;
    const pool = elements.filter(e => e.period === period);
    if (pool.length < 2) return getRandomQuestion(); // retry
    const els = pickUnique(3, e => e.period === period);
    q.elements = shuffle(els);
    q.period = period;
    q.correctIdx = els.reduce((bestIdx, el, idx, arr) => {
      if (type === 'largest_in_period') return el.atomicRadius > arr[bestIdx].atomicRadius ? idx : bestIdx;
      else return el.atomicRadius < arr[bestIdx].atomicRadius ? idx : bestIdx;
    }, 0);
    q.prompt = `Which element in period ${period} has the ${type === 'largest_in_period' ? 'largest' : 'smallest'} atomic radius?`;
  } else if (type === 'largest_in_group' || type === 'smallest_in_group') {
    const group = [1, 2, 13, 14, 15, 16, 17, 18][randInt(8)];
    const pool = elements.filter(e => e.group === group);
    if (pool.length < 2) return getRandomQuestion(); // retry
    const els = pickUnique(3, e => e.group === group);
    q.elements = shuffle(els);
    q.group = group;
    q.correctIdx = els.reduce((bestIdx, el, idx, arr) => {
      if (type === 'largest_in_group') return el.atomicRadius > arr[bestIdx].atomicRadius ? idx : bestIdx;
      else return el.atomicRadius < arr[bestIdx].atomicRadius ? idx : bestIdx;
    }, 0);
    q.prompt = `Which group ${group} element has the ${type === 'largest_in_group' ? 'largest' : 'smallest'} atomic radius?`;
  }
  return q;
}


export default function AtomicRadiusActivity({ onBack, onPeriodicTable }) {
  const RECENT_HISTORY_LIMIT = 30; // How many questions to remember

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [recentQuestions, setRecentQuestions] = useState([]);
  // Initialize question state using the non-repeating logic
  const [question, setQuestion] = useState(() => {
    // Initial generation needs the loop too, though history is empty
    let initialQ;
    let attempts = 0;
    const maxAttempts = 10; // Safety for initial load
    do {
      initialQ = getRandomQuestion();
      attempts++;
      if (attempts > maxAttempts) {
        console.warn("Max attempts reached during initial question generation.");
        break;
      }
    } while (!initialQ?.prompt); // Ensure initial question is valid

    // Set initial history (just this first question)
    if (initialQ?.prompt) {
      setRecentQuestions([initialQ.prompt]);
    }
    return initialQ;
  });
  const [feedback, setFeedback] = useState(null); // {type, message, ...}
  const [showNext, setShowNext] = useState(false);
  const [arrangeOrder, setArrangeOrder] = useState([]); // for arrange questions
  const [trueFalseChoice, setTrueFalseChoice] = useState(null); // for true/false

  function handleGuess(idx) {
    // For single-choice questions
    if (idx === question.correctIdx) {
      setScore(score + 1);
      setFeedback({ type: 'correct', message: 'Correct! Great job!', correctIdx: idx });
    } else {
      let correct = question.elements[question.correctIdx];
      setFeedback({
        type: 'incorrect',
        message: `Incorrect. Hint: Atomic radius increases as you go down a group and decreases as you move across a period (left to right).\n\n${correct.symbol} (${correct.name}) has a ${question.type.includes('larg') ? 'larger' : 'smaller'} radius (${correct.atomicRadius} pm).`,
        correctIdx: question.correctIdx
      });
    }
    setShowNext(true);
  }

  function handleArrangeSubmit() {
    const userOrder = arrangeOrder.map(idx => question.elements[idx].symbol);
    const isCorrect = userOrder.join() === question.correctOrder.join();
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ type: 'correct', message: 'Correct order! Well done!' });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Incorrect. Correct order: ${question.correctOrder.join(' → ')}`
      });
    }
    setShowNext(true);
  }

  function handleTrueFalse(choice) {
    setTrueFalseChoice(choice);
    if (choice === (question.answer ? 'true' : 'false')) {
      setScore(score + 1);
      setFeedback({ type: 'correct', message: 'Correct! Great job!' });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `Incorrect. The statement is ${question.answer ? 'true' : 'false'}.` });
    }
    setShowNext(true);
  }

  function handleNext() {
    const previousQuestionPrompt = question?.prompt; // Store previous prompt

    let nextQ;
    let attempts = 0;
    const maxAttempts = 20; // Safety net

    do {
      nextQ = getRandomQuestion();
      attempts++;
      if (attempts > maxAttempts) {
        console.warn(`Max attempts (${maxAttempts}) reached trying to find a non-recent question. Allowing potential repeat.`);
        break;
      }
      // Loop if the new question prompt is null, same as previous, or in recent history
    } while (
      !nextQ?.prompt ||
      (elements.length > RECENT_HISTORY_LIMIT && // Only check history if enough elements exist
       (nextQ.prompt === previousQuestionPrompt || recentQuestions.includes(nextQ.prompt)))
    );

    // Update History
    if (nextQ?.prompt) {
      const updatedHistory = [...recentQuestions, nextQ.prompt];
      if (updatedHistory.length > RECENT_HISTORY_LIMIT) {
        setRecentQuestions(updatedHistory.slice(-RECENT_HISTORY_LIMIT)); // Keep only the last N
      } else {
        setRecentQuestions(updatedHistory);
      }
    }

    // Set New Question and Reset UI State
    setQuestion(nextQ);
    setFeedback(null);
    setShowNext(false);
    setArrangeOrder([]);
    setTrueFalseChoice(null);
    setRound(round + 1);
  }

  // Neon-glow style helpers
  const boxShadowGlow = '0 0 32px #facc1566, 0 2px 32px #38bdf866';
  const correctGlow = '0 0 24px #22c55e88, 0 2px 24px #22c55e55';
  const wrongGlow = '0 0 24px #dc262688, 0 2px 24px #dc262655';
  const neutralGlow = '0 0 24px #f59e4288, 0 2px 24px #38bdf855';

  return (
    <div className="center-container fade-in slide-up" style={{
      textAlign: 'center',
      minHeight: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at 60% 40%, #2d314d 80%, #19172e 100%)',
      minHeight: '100vh',
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.98)',
        padding: '20px 12px 16px',
        borderRadius: 10,
        boxShadow: '0 4px 16px #0005',
        minWidth: 200,
        maxWidth: 260,
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        border: '1px solid #23234a',
      }}>
        <h2 style={{
          fontWeight: 700,
          fontSize: '1.12em',
          color: '#facc15',
          marginBottom: 7,
          letterSpacing: 0.2,
          textShadow: '0 1px 2px #23234a33',
        }}>
          Atomic Radius
        </h2>
        <div style={{
          color: '#60a5fa',
          fontWeight: 600,
          fontSize: '0.93em',
          marginBottom: 10,
          textShadow: '0 1px 2px #23234a22',
        }}>
          {question.prompt}
        </div>
        {/* Render question type UI */}
        {['larger', 'smaller', 'largest_in_period', 'smallest_in_period', 'largest_in_group', 'smallest_in_group', 'closest'].includes(question.type) && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            margin: '12px 0 8px 0',
            flexWrap: 'wrap',
          }}>
            {question.elements.map((el, idx) => (
              <button
                key={idx}
                className="ptable-btn"
                style={{
                  minWidth: 54,
                  minHeight: 38,
                  fontSize: '1em',
                  fontWeight: 700,
                  borderRadius: 7,
                  background:
                    idx === 0
                      ? 'linear-gradient(100deg,#fde68a 60%,#fbbf24 100%)'
                      : 'linear-gradient(100deg,#bae6fd 60%,#60a5fa 100%)',
                  color: '#23234a',
                  border: feedback && feedback.correctIdx === idx
                    ? '2px solid #22c55e'
                    : '1px solid ' + (idx === 0 ? '#fbbf24' : '#60a5fa'),
                  boxShadow:
                    feedback && feedback.correctIdx === idx
                      ? '0 0 6px #22c55e44'
                      : feedback && feedback.type === 'incorrect' && feedback.correctIdx !== idx
                      ? '0 0 4px #f472b622'
                      : '0 1px 4px #23234a22',
                  letterSpacing: 1,
                  transition: 'all .18s',
                  cursor: feedback ? 'not-allowed' : 'pointer',
                  opacity: feedback && feedback.type === 'incorrect' && feedback.correctIdx !== idx ? 0.5 : 1,
                  outline: 'none',
                  marginBottom: 3,
                }}
                onClick={() => !feedback && handleGuess(idx)}
                disabled={!!feedback}
                tabIndex={0}
                aria-label={`Choose ${el.name}`}
              >
                {el.symbol}
                <div style={{ fontSize: '0.7em', fontWeight: 400, marginTop: 1 }}>{el.name}</div>
              </button>
            ))}
          </div>
        )}
        {['arrange_increasing', 'arrange_decreasing'].includes(question.type) && question.elements && (
          <div style={{ margin: '12px 0 8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {question.elements.map((el, idx) => (
                <button
                  key={el.symbol}
                  className="ptable-btn"
                  style={{
                    minWidth: 54, minHeight: 38, fontSize: '1em', fontWeight: 700, borderRadius: 7,
                    background: arrangeOrder.includes(idx) ? '#6b7280' : 'linear-gradient(100deg,#fde68a 60%,#bae6fd 100%)',
                    color: arrangeOrder.includes(idx) ? '#e5e7eb' : '#23234a',
                    border: '1px solid #60a5fa',
                    boxShadow: '0 1px 4px #23234a22',
                    letterSpacing: 1,
                    transition: 'all .18s',
                    outline: 'none',
                    marginBottom: 3,
                    cursor: feedback || arrangeOrder.includes(idx) ? 'not-allowed' : 'pointer',
                    opacity: feedback || arrangeOrder.includes(idx) ? 0.6 : 1,
                  }}
                  onClick={() => {
                    if (feedback || arrangeOrder.includes(idx)) return;
                    setArrangeOrder([...arrangeOrder, idx]);
                  }}
                  disabled={feedback || arrangeOrder.includes(idx)}
                  tabIndex={0}
                  aria-label={`Select ${el.name}`}
                >
                  {el.symbol}
                  <div style={{ fontSize: '0.7em', fontWeight: 400, marginTop: 1 }}>{el.name}</div>
                </button>
              ))}
            </div>
            {arrangeOrder.length > 0 && (
              <div style={{ fontSize: '0.9em', color: '#93c5fd', marginTop: 4, marginBottom: 8, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', width: '100%' }}>
                <span>Your Order: {arrangeOrder.map(idx => question.elements[idx]?.symbol).join(' → ')}</span>
                {!feedback && (
                  <button onClick={() => setArrangeOrder([])} style={{ background: 'none', border: 'none', color: '#f472b6', cursor: 'pointer', fontSize: '1.2em', padding: '0 5px' }} title="Reset Order">↺</button>
                )}
              </div>
            )}
            <button
              className="ptable-btn"
              style={{
                background: 'linear-gradient(90deg,#f472b6 0,#60a5fa 100%)', color: '#fff', fontWeight: 700, fontSize: '0.96em', borderRadius: 6, boxShadow: '0 1px 4px #f472b611', padding: '6px 18px', margin: '5px 0 7px 0', border: 'none', letterSpacing: 1, outline: 'none', transition: 'all .18s',
                cursor: arrangeOrder.length === question.elements.length && !feedback ? 'pointer' : 'not-allowed',
                opacity: arrangeOrder.length === question.elements.length && !feedback ? 1 : 0.5,
              }}
              onClick={handleArrangeSubmit}
              disabled={!!feedback || arrangeOrder.length !== question.elements.length}
            >
              Submit Order
            </button>
          </div>
        )}
        {question.type === 'true_false' && (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '12px 0 8px 0' }}>
            <button
              className="ptable-btn"
              style={{ minWidth: 54, minHeight: 38, fontSize: '1em', fontWeight: 700, borderRadius: 7, background: 'linear-gradient(100deg,#fde68a 60%,#bae6fd 100%)', color: '#23234a', border: '1px solid #60a5fa', boxShadow: '0 1px 4px #23234a22', letterSpacing: 1, transition: 'all .18s', outline: 'none', marginBottom: 3 }}
              onClick={() => !feedback && handleTrueFalse('true')}
              disabled={!!feedback}
            >
              True
            </button>
            <button
              className="ptable-btn"
              style={{ minWidth: 54, minHeight: 38, fontSize: '1em', fontWeight: 700, borderRadius: 7, background: 'linear-gradient(100deg,#fbbf24 60%,#f472b6 100%)', color: '#23234a', border: '1px solid #f472b6', boxShadow: '0 1px 4px #23234a22', letterSpacing: 1, transition: 'all .18s', outline: 'none', marginBottom: 3 }}
              onClick={() => !feedback && handleTrueFalse('false')}
              disabled={!!feedback}
            >
              False
            </button>
          </div>
        )}
        <div style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '0.94em', minHeight: 20 }}>
          {feedback && (
            <span style={{
              color: feedback.type === 'correct' ? '#22c55e' : '#f472b6',
              textShadow: feedback.type === 'correct' ? '0 2px 4px #22c55e22' : '0 2px 4px #f472b611',
              whiteSpace: 'pre-line',
              display: 'inline-block',
              maxWidth: 180,
            }}>
              {feedback.message}
            </span>
          )}
        </div>
        {showNext && (
          <button
            className="ptable-btn"
            style={{
              background: 'linear-gradient(90deg,#f472b6 0,#60a5fa 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.96em',
              borderRadius: 6,
              boxShadow: '0 1px 4px #f472b611',
              padding: '6px 18px',
              margin: '0 0 7px 0',
              border: 'none',
              letterSpacing: 1,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all .18s',
            }}
            onClick={handleNext}
          >
            NEXT
          </button>
        )}
        <div style={{ marginTop: 2, fontSize: '0.93em', color: '#60a5fa', fontWeight: 600, letterSpacing: 1 }}>
          Score: <span style={{ color: '#facc15', fontWeight: 900 }}>{score}</span> &nbsp; | &nbsp; Round: {round}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 7 }}>
          <button
            className="ptable-btn"
            style={{
              fontWeight: 700,
              fontSize: '0.96em',
              borderRadius: 6,
              background: 'linear-gradient(90deg,#60a5fa 0,#bae6fd 100%)',
              color: '#23234a',
              boxShadow: '0 2px 4px #60a5fa22',
              border: 'none',
              padding: '5px 16px',
              letterSpacing: 1,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all .18s',
            }}
            onClick={onPeriodicTable}
          >
            Periodic Table
          </button>
          <button
            className="ptable-btn"
            style={{
              fontWeight: 700,
              fontSize: '0.96em',
              borderRadius: 6,
              background: 'linear-gradient(90deg,#f472b6 0,#fde68a 100%)',
              color: '#23234a',
              boxShadow: '0 2px 4px #f472b611',
              border: 'none',
              padding: '5px 16px',
              letterSpacing: 1,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all .18s',
            }}
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
