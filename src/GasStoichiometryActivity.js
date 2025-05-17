import React, { useState } from 'react';

// --- Core data: example reactions for diversity ---
const REACTIONS = [
  {
    equation: 'CH4 + 2 O2 → CO2 + 2 H2O',
    reactants: [
      { formula: 'CH4', molarMass: 16.04, state: 'g' },
      { formula: 'O2', molarMass: 32.00, state: 'g' }
    ],
    products: [
      { formula: 'CO2', molarMass: 44.01, state: 'g' },
      { formula: 'H2O', molarMass: 18.02, state: 'g' }
    ],
    coefficients: { CH4: 1, O2: 2, CO2: 1, H2O: 2 }
  },
  {
    equation: '2 NH3 → N2 + 3 H2',
    reactants: [
      { formula: 'NH3', molarMass: 17.03, state: 'g' }
    ],
    products: [
      { formula: 'N2', molarMass: 28.02, state: 'g' },
      { formula: 'H2', molarMass: 2.02, state: 'g' }
    ],
    coefficients: { NH3: 2, N2: 1, H2: 3 }
  },
  {
    equation: '2 KClO3 → 2 KCl + 3 O2',
    reactants: [
      { formula: 'KClO3', molarMass: 122.55, state: 's' }
    ],
    products: [
      { formula: 'KCl', molarMass: 74.55, state: 's' },
      { formula: 'O2', molarMass: 32.00, state: 'g' }
    ],
    coefficients: { KClO3: 2, KCl: 2, O2: 3 }
  },
  // Add more reactions for diversity
];

const R = 0.0821; // L·atm/(mol·K)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pickRandom(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateGasStoichProblem(difficultyOverride = null) {
  // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
  const difficulty = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
  
  // Pick a random reaction
  const reaction = pickRandom(REACTIONS);
  
  // Select question type based on difficulty
  // Basic level focuses on simpler types
  let types = [];
  
  if (difficulty === 0) { // Basic
    types = ['mass-to-volume', 'volume-to-mass', 'mole-to-volume'];
  } else if (difficulty === 1) { // Intermediate
    types = ['mass-to-volume', 'volume-to-mass', 'volume-to-volume', 'mole-to-volume'];
  } else if (difficulty === 2) { // Advanced
    types = ['mass-to-volume', 'volume-to-mass', 'volume-to-volume', 'mole-to-volume', 'limiting-reactant'];
  } else { // Challenging
    types = ['volume-to-volume', 'mole-to-volume', 'limiting-reactant'];
  }
  
  const type = pickRandom(types);
  // Set temperature and pressure conditions based on difficulty level
  let T, P;
  
  if (difficulty === 0) { // Basic - STP or close to it
    T = getRandomInt(273, 300); // K, around STP (273.15 K)
    P = getRandomFloat(0.95, 1.05, 2); // atm, close to 1 atm
  } else if (difficulty === 1) { // Intermediate - slightly varied conditions
    T = getRandomInt(250, 350); // K
    P = getRandomFloat(0.8, 1.5, 2); // atm
  } else if (difficulty === 2) { // Advanced - more varied conditions
    T = getRandomInt(220, 380); // K
    P = getRandomFloat(0.6, 2.0, 2); // atm
  } else { // Challenging - extreme conditions
    T = getRandomInt(200, 450); // K
    P = getRandomFloat(0.4, 2.5, 2); // atm
  }

  // Pick substances
  const allSubstances = [...reaction.reactants, ...reaction.products];
  const gasSubstances = allSubstances.filter(s => s.state === 'g');
  const nonGasSubstances = allSubstances.filter(s => s.state !== 'g');

  // Track problem details
  let known, unknown, knownAmount, prompt, answer, steps;
  
  // Educational context based on difficulty
  let educationalContext = '';
  if (difficulty >= 1) {
    const contexts = [
      'Remember to use the stoichiometric relationships in the balanced equation.',
      'Apply the ideal gas law PV = nRT where appropriate.',
      'The ideal gas constant R = 0.0821 L·atm/(mol·K).',
      'The volume of a gas depends on temperature, pressure, and amount.'
    ];
    educationalContext = contexts[Math.floor(Math.random() * contexts.length)];
  }

  // For most questions, pick one known, one unknown, ensure at least one is a gas
  if (type === 'mass-to-volume') {
    known = pickRandom(nonGasSubstances.length ? nonGasSubstances : reaction.reactants);
    unknown = pickRandom(gasSubstances);
    // Defensive: if either is missing, try again
    if (!known || !unknown) return generateGasStoichProblem(difficulty);
    
    // Scale knownAmount based on difficulty (smaller/rounder for basic, larger/more complex for advanced)
    if (difficulty === 0) { // Basic
      knownAmount = getRandomInt(5, 20) * 2; // Even numbers, smaller range
    } else if (difficulty === 1) { // Intermediate
      knownAmount = getRandomInt(4, 30); // Wider range
    } else if (difficulty === 2) { // Advanced
      knownAmount = getRandomFloat(2.5, 35, 1); // Decimal values
    } else { // Challenging
      knownAmount = getRandomFloat(1.8, 40, 2); // More precise decimal values
    }
    // Calculate moles of known
    const molesKnown = knownAmount / known.molarMass;
    // Stoichiometry
    const ratio = reaction.coefficients[unknown.formula] / reaction.coefficients[known.formula];
    const molesUnknown = molesKnown * ratio;
    // Use PV=nRT for unknown
    const V = (molesUnknown * R * T) / P;
    answer = V;
    prompt = <>Given {knownAmount} g of <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} />, what volume of <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /> (in L) is produced at {T} K and {P} atm?</>;
    steps = [
      <>1. Convert grams of <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} /> to moles: {knownAmount} g / {known.molarMass} g/mol = {molesKnown.toFixed(3)} mol</>,
      <>2. Use stoichiometry: {molesKnown.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} /> × ({reaction.coefficients[unknown.formula]}/{reaction.coefficients[known.formula]}) = {molesUnknown.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /></>,
      <>3. Use PV=nRT to find volume: V = nRT/P = ({molesUnknown.toFixed(3)} mol) × ({R}) × ({T} K) / ({P} atm) = {V.toFixed(3)} L</>
    ];
  } else if (type === 'volume-to-mass') {
    known = pickRandom(gasSubstances);
    unknown = pickRandom(nonGasSubstances.length ? nonGasSubstances : reaction.products);
    if (!known || !unknown) return generateGasStoichProblem();
    knownAmount = getRandomInt(2, 40); // liters
    // Use PV=nRT to get moles of known
    const molesKnown = (knownAmount * P) / (R * T);
    // Stoichiometry
    const ratio = reaction.coefficients[unknown.formula] / reaction.coefficients[known.formula];
    const molesUnknown = molesKnown * ratio;
    const gramsUnknown = molesUnknown * unknown.molarMass;
    answer = gramsUnknown;
    prompt = <>Given {knownAmount} L of <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} /> at {T} K and {P} atm, what mass (g) of <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /> is produced?</>;
    steps = [
      <>1. Use PV=nRT to find moles of <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} />: n = PV/RT = ({P} atm × {knownAmount} L) / ({R} × {T} K) = {molesKnown.toFixed(3)} mol</>,
      <>2. Use stoichiometry: {molesKnown.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} /> × ({reaction.coefficients[unknown.formula]}/{reaction.coefficients[known.formula]}) = {molesUnknown.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /></>,
      <>3. Convert moles to grams: {molesUnknown.toFixed(3)} mol × {unknown.molarMass} g/mol = {gramsUnknown.toFixed(3)} g</>
    ];
  } else if (type === 'volume-to-volume') {
    known = pickRandom(gasSubstances);
    // Defensive: known must exist and there must be at least one other gas
    if (!known || gasSubstances.length < 2) return generateGasStoichProblem();
    unknown = pickRandom(gasSubstances.filter(s => s.formula !== known.formula));
    if (!unknown) return generateGasStoichProblem();
    knownAmount = getRandomInt(2, 40); // liters
    // Use PV=nRT to get moles of known
    const molesKnown = (knownAmount * P) / (R * T);
    // Stoichiometry
    const ratio = reaction.coefficients[unknown.formula] / reaction.coefficients[known.formula];
    const molesUnknown = molesKnown * ratio;
    // Use PV=nRT for unknown
    const V = (molesUnknown * R * T) / P;
    answer = V;
    prompt = <>Given {knownAmount} L of <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} /> at {T} K and {P} atm, what volume of <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /> (in L) is produced at the same conditions?</>;
    steps = [
      <>1. Use PV=nRT to find moles of <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} />: n = PV/RT = ({P} atm × {knownAmount} L) / ({R} × {T} K) = {molesKnown.toFixed(3)} mol</>,
      <>2. Use stoichiometry: {molesKnown.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} /> × ({reaction.coefficients[unknown.formula]}/{reaction.coefficients[known.formula]}) = {molesUnknown.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /></>,
      <>3. Use PV=nRT to find volume: V = nRT/P = ({molesUnknown.toFixed(3)} mol) × ({R}) × ({T} K) / ({P} atm) = {V.toFixed(3)} L</>
    ];
  } else if (type === 'mole-to-volume') {
    known = pickRandom(allSubstances);
    unknown = pickRandom(gasSubstances);
    if (!known || !unknown) return generateGasStoichProblem();
    knownAmount = getRandomFloat(0.5, 5, 2); // moles
    // Stoichiometry
    const ratio = reaction.coefficients[unknown.formula] / reaction.coefficients[known.formula];
    const molesUnknown = knownAmount * ratio;
    // Use PV=nRT for unknown
    const V = (molesUnknown * R * T) / P;
    answer = V;
    prompt = <>Given {knownAmount} mol of <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} />, what volume of <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /> (in L) is produced at {T} K and {P} atm?</>;
    steps = [
      <>1. Use stoichiometry: {knownAmount} mol <span dangerouslySetInnerHTML={{__html: renderFormula(known.formula)}} /> × ({reaction.coefficients[unknown.formula]}/{reaction.coefficients[known.formula]}) = {molesUnknown.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(unknown.formula)}} /></>,
      <>2. Use PV=nRT to find volume: V = nRT/P = ({molesUnknown.toFixed(3)} mol) × ({R}) × ({T} K) / ({P} atm) = {V.toFixed(3)} L</>
    ];
  } else if (type === 'limiting-reactant') {
    // For simplicity: pick two reactants, both gases
    const reactants = gasSubstances.length >= 2 ? gasSubstances.slice(0, 2) : reaction.reactants.slice(0, 2);
    if (reactants.length < 2) return generateGasStoichProblem(); // fallback
    const [r1, r2] = reactants;
    if (!r1 || !r2) return generateGasStoichProblem();
    const amt1 = getRandomInt(2, 40); // liters
    const amt2 = getRandomInt(2, 40); // liters
    // Find moles
    const n1 = (amt1 * P) / (R * T);
    const n2 = (amt2 * P) / (R * T);
    // Limiting: compare n1/coefficient1 vs n2/coefficient2
    const ratio1 = n1 / reaction.coefficients[r1.formula];
    const ratio2 = n2 / reaction.coefficients[r2.formula];
    const limiting = ratio1 < ratio2 ? r1 : r2;
    const product = pickRandom(reaction.products.filter(s => s.state === 'g'));
    if (!product) return generateGasStoichProblem();
    const productCoeff = reaction.coefficients[product.formula];
    const limitingMoles = Math.min(ratio1, ratio2) * productCoeff;
    const V = (limitingMoles * R * T) / P;
    answer = V;
    prompt = <>Given {amt1} L of <span dangerouslySetInnerHTML={{__html: renderFormula(r1.formula)}} /> and {amt2} L of <span dangerouslySetInnerHTML={{__html: renderFormula(r2.formula)}} /> at {T} K and {P} atm, what is the maximum volume of <span dangerouslySetInnerHTML={{__html: renderFormula(product.formula)}} /> (in L) that can be produced? (Limiting reactant)</>;
    steps = [
      <>1. Use PV=nRT to find moles: n1 = ({amt1} L × {P} atm) / ({R} × {T} K) = {n1.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(r1.formula)}} />, n2 = ({amt2} L × {P} atm) / ({R} × {T} K) = {n2.toFixed(3)} mol <span dangerouslySetInnerHTML={{__html: renderFormula(r2.formula)}} /></>,
      <>2. Divide by coefficients: n1/{reaction.coefficients[r1.formula]} = {(n1/reaction.coefficients[r1.formula]).toFixed(3)}, n2/{reaction.coefficients[r2.formula]} = {(n2/reaction.coefficients[r2.formula]).toFixed(3)}</>,
      <>3. Limiting reactant is <span dangerouslySetInnerHTML={{__html: renderFormula(limiting.formula)}} />.</>,
      <>4. Moles of product: limiting × product coefficient = {limitingMoles.toFixed(3)} mol</>,
      <>5. Use PV=nRT to find volume: V = nRT/P = ({limitingMoles.toFixed(3)} mol) × ({R}) × ({T} K) / ({P} atm) = {V.toFixed(3)} L</>
    ];
  }
  // Include educational context in steps based on difficulty
  if (difficulty >= 1 && educationalContext) {
    steps.push(<>4. {educationalContext}</>);
  }
  
  // Include specific guidance based on difficulty level
  if (difficulty === 2 || difficulty === 3) {
    steps.push(<>
      {difficulty === 2 ? 
        'Advanced Tip: Always check your units throughout calculations to avoid errors.' : 
        'Challenge Tip: Under non-standard conditions, the behavior of real gases may deviate slightly from ideal gas law predictions.'}
    </>);
  }
  
  return {
    type,
    prompt,
    answer,
    steps,
    reaction,
    difficulty // Include difficulty in the returned object
  };
}

// Utility to render chemical formulas with subscripts/superscripts
function renderFormula(formula) {
  // Replace numbers with <sub>number</sub>
  let rendered = formula.replace(/([A-Za-z])([0-9]+)/g, (m, l, n) => l + '<sub>' + n + '</sub>');
  // Replace ^... for charges/powers with <sup>...</sup>
  rendered = rendered.replace(/\^([\d\+\-]+)/g, (m, p) => '<sup>' + p + '</sup>');
  return rendered;
}

// Utility to render a full equation (with +, →, etc.)
function renderEquation(equation) {
  // Split by spaces to find formulas
  return equation.split(' ').map((part, i) => {
    // Only render as formula if it contains a letter followed by a number
    if (/[A-Za-z][0-9]/.test(part)) {
      return <span key={i} dangerouslySetInnerHTML={{__html: renderFormula(part)}} />;
    }
    return <span key={i}> {part} </span>;
  });
}

export default function GasStoichiometryActivity({ onBack, onShowPeriodicTable }) {
  // State to track selected difficulty level
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [problem, setProblem] = useState(() => generateGasStoichProblem(selectedDifficulty));
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const userVal = parseFloat(userAnswer);
    if (isNaN(userVal)) {
      setFeedback({ correct: false, message: 'Please enter a valid number.' });
      return;
    }
    const correct = Math.abs(userVal - problem.answer) < 0.05 * Math.abs(problem.answer);
    setFeedback({
      correct,
      message: correct ? 'Correct! Well done.' : 'Not quite. See the steps below.',
      steps: problem.steps
    });
    setShowSteps(true);
  }

  function handleNext() {
    setProblem(generateGasStoichProblem(selectedDifficulty));
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }
  
  function handleDifficultyChange(level) {
    setSelectedDifficulty(level);
    setProblem(generateGasStoichProblem(level));
    setUserAnswer('');
    setFeedback(null);
    setShowSteps(false);
  }
  
  // Helper function to get difficulty text - consistent with other activities
  function getDifficultyText(level) {
    switch(level) {
      case 0: return 'Basic';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      case 3: return 'Challenging';
      default: return 'Intermediate';
    }
  }

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Gas Stoichiometry Practice</h2>
        
        {/* Difficulty selector - consistent with other activities */}
        <div className="difficulty-selector" style={{ marginBottom: 15, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: '0.95em', color: '#23234a' }}>Select Difficulty Level:</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[0, 1, 2, 3].map(level => (
              <button 
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={selectedDifficulty === level ? 'selected-difficulty' : ''}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: selectedDifficulty === level ? '#4f46e5' : '#e5e7eb',
                  color: selectedDifficulty === level ? 'white' : '#4b5563',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  flex: 1,
                  minWidth: '80px',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {getDifficultyText(level)}
              </button>
            ))}
          </div>
        </div>
        
        {onShowPeriodicTable && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 12px 0' }}>
            <button className="activity-btn" type="button" onClick={onShowPeriodicTable}>
              Periodic Table
            </button>
          </div>
        )}
        <div className="question-area">
          <div className="question-equation" style={{marginBottom: 6, fontWeight: 600}}>{renderEquation(problem.reaction.equation)}</div>
          <p className="question-text" style={{ fontSize: '1.15em' }}>{problem.prompt}</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <input
            type="number"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder={problem.type === 'volume-to-mass' ? 'Your answer (g)' : 'Your answer (L)'}
            className="activity-input"
            style={{ margin: '10px 0 20px 0' }}
            disabled={feedback && feedback.correct}
            step="any"
          />
          {feedback && (
            <div className={`feedback-container feedback-${feedback.correct ? 'correct' : 'incorrect'}`}>
              {feedback.correct ? 
                [
                  'Excellent! You\'ve mastered the basics of gas stoichiometry.',
                  'Great job! You\'re handling intermediate gas stoichiometry problems well.',
                  'Outstanding work! You\'ve tackled an advanced gas stoichiometry problem.',
                  'Impressive! You\'ve solved a challenging gas stoichiometry problem!'
                ][problem.difficulty || 0] : 
                feedback.message}
            </div>
          )}
          <div className="button-row">
            {!feedback?.correct && (
              <button type="submit" className="activity-btn" disabled={!userAnswer}>Check Answer</button>
            )}
            {feedback && (
              <button type="button" className="activity-btn" onClick={handleNext}>Next</button>
            )}
            <button type="button" className="back-btn" onClick={onBack}>Back</button>
          </div>
        </form>
        {feedback && showSteps && feedback.steps && (
          <div className="feedback-container feedback-steps" style={{marginTop:'1.2em'}}>
            <b>Calculator steps:</b>
            <ol style={{textAlign:'left', margin:'0.7em 0 0 1.2em', padding:0}}>
              {feedback.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

