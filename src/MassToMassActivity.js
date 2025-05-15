import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

// Helper to shuffle array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Molar masses (g/mol) - Ensure all substances in problems are here
const MOLAR_MASSES = {
  H2: 2.016,      // Corrected H2
  O2: 31.998,     // Corrected O2
  H2O: 18.015,
  N2: 28.014,     // Corrected N2
  NH3: 17.031,    // Corrected NH3
  CH4: 16.043,    // Corrected CH4
  CO2: 44.01,
  KClO3: 122.55,
  KCl: 74.551,    // Corrected KCl
  Fe2O3: 159.687,
  CO: 28.010,     // Corrected CO
  Fe: 55.845,
  C3H8: 44.097,
  Al: 26.982,
  Cl2: 70.906,    // Corrected Cl2
  AlCl3: 133.341, // Corrected AlCl3
  Zn: 65.38,
  HCl: 36.461,    // Corrected HCl
  ZnCl2: 136.286, // Corrected ZnCl2
  AgNO3: 169.873,
  NaCl: 58.443,   // Corrected NaCl
  AgCl: 143.321,  // Corrected AgCl
  NaNO3: 84.994,  // Corrected NaNO3
  C6H12O6: 180.156,
  SO2: 64.066,
  SO3: 80.064,    // Added SO3
  P4: 123.896,    // Added P4
  P4O10: 283.888, // Added P4O10
  WO3: 231.84,    // Added WO3
  W: 183.84,      // Added W
  C2H5OH: 46.069,
  SiCl4: 169.898, // Added SiCl4
  Mg: 24.305,     // Corrected Mg
  Si: 28.085,     // Added Si
  MgCl2: 95.211,  // Corrected MgCl2
  Na: 22.990,     // Corrected Na
  I2: 253.808,    // Added I2
  MgI2: 278.113,  // Added MgI2
  C2H2: 26.038,   // Added C2H2
  CS2: 76.139,    // Added CS2
  Sn: 118.71,     // Added Sn
  SnCl4: 260.518, // Added SnCl4
  CaCl2: 110.984, // Added CaCl2
  Na3PO4: 163.941,// Added Na3PO4
  Ca3PO4_2: 310.177, // Added Ca3(PO4)2 (using Ca3PO4_2 as key)
  AlOH3: 78.003,    // Added Al(OH)3 as AlOH3
  H2SO4: 98.079,    // Corrected H2SO4
  Al2SO4_3: 342.153,// Added Al2(SO4)3 as Al2SO4_3
  C2H4: 28.054,     // Added C2H4
  NaBr: 102.894,   // Added NaBr
  Br2: 159.808,   // Added Br2
  HgO: 216.589,   // Added HgO
  Hg: 200.59,     // Added Hg
  BaCl2: 208.233,
  Na2SO4: 142.042, // Corrected Na2SO4
  BaSO4: 233.38,  // Added BaSO4
  NH4NO3: 80.043, // Added NH4NO3
  N2O: 44.013,    // Added N2O
  C6H6: 78.114,    // Added C6H6
  C6H5Cl: 112.559, // Added C6H5Cl
  KBr: 119.002,   // Added KBr
  KI: 166.003,
  SiO2: 60.083,
  C: 12.011,      // Added C
  PbNO3_2: 331.208, // Added Pb(NO3)2 as PbNO3_2
  PbI2: 461.008,    // Added PbI2
  KNO3: 101.102,
  MgOH2: 58.319,
  C5H12: 72.151,    // Added C5H12
  NaOH: 39.997,
  S: 32.06,       // Added S
  FeS: 87.91,     // Added FeS
  HBr: 80.912,
  SF6: 146.05,
  PCl5: 208.239,
  NO2: 46.005,
  KMnO4: 158.034,
  NaHCO3: 84.007,
  Al2O3: 101.961,
  CuSO4: 159.609,  // Corrected CuSO4
  CH3COOH: 60.052,
  // Ensure all substances in MOLE_CONVERSION_PROBLEMS below are also in MOLAR_MASSES
};


// Mass-to-Mass problems, adapted from MoleToMoleActivity
const MASS_TO_MASS_PROBLEMS = [
  {
    equation: "2 H₂ + O₂ → 2 H₂O",
    stoichiometry: { H2: 2, O2: 1, H2O: 2 },
    substances: ['H2', 'O2', 'H2O']
  },
  {
    equation: "N₂ + 3 H₂ → 2 NH₃",
    stoichiometry: { N2: 1, H2: 3, NH3: 2 },
    substances: ['N2', 'H2', 'NH3']
  },
  {
    equation: "CH₄ + 2 O₂ → CO₂ + 2 H₂O",
    stoichiometry: { CH4: 1, O2: 2, CO2: 1, H2O: 2 },
    substances: ['CH4', 'O2', 'CO2', 'H2O']
  },
  {
    equation: "2 KClO₃ → 2 KCl + 3 O₂",
    stoichiometry: { KClO3: 2, KCl: 2, O2: 3 },
    substances: ['KClO3', 'KCl', 'O2']
  },
  {
    equation: "Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂",
    stoichiometry: { Fe2O3: 1, CO: 3, Fe: 2, CO2: 3 },
    substances: ['Fe2O3', 'CO', 'Fe', 'CO2']
  },
  {
    equation: "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O",
    stoichiometry: { C3H8: 1, O2: 5, CO2: 3, H2O: 4 },
    substances: ['C3H8', 'O2', 'CO2', 'H2O']
  },
  {
    equation: "2 Al + 3 Cl₂ → 2 AlCl₃",
    stoichiometry: { Al: 2, Cl2: 3, AlCl3: 2 },
    substances: ['Al', 'Cl2', 'AlCl3']
  },
  {
    equation: "Zn + 2 HCl → ZnCl₂ + H₂",
    stoichiometry: { Zn: 1, HCl: 2, ZnCl2: 1, H2: 1 },
    substances: ['Zn', 'HCl', 'ZnCl2', 'H2']
  },
  {
    equation: "AgNO₃ + NaCl → AgCl + NaNO₃",
    stoichiometry: { AgNO3: 1, NaCl: 1, AgCl: 1, NaNO3: 1 },
    substances: ['AgNO3', 'NaCl', 'AgCl', 'NaNO3']
  },
  {
    equation: "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O",
    stoichiometry: { C6H12O6: 1, O2: 6, CO2: 6, H2O: 6 },
    substances: ['C6H12O6', 'O2', 'CO2', 'H2O']
  },
  {
    equation: "2 SO₂ + O₂ → 2 SO₃",
    stoichiometry: { SO2: 2, O2: 1, SO3: 2 },
    substances: ['SO2', 'O2', 'SO3']
  },
  {
    equation: "P₄ + 5 O₂ → P₄O₁₀",
    stoichiometry: { P4: 1, O2: 5, P4O10: 1 },
    substances: ['P4', 'O2', 'P4O10']
  },
  {
    equation: "WO₃ + 3 H₂ → W + 3 H₂O",
    stoichiometry: { WO3: 1, H2: 3, W: 1, H2O: 3 },
    substances: ['WO3', 'H2', 'W', 'H2O']
  },
  {
    equation: "C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O",
    stoichiometry: { C2H5OH: 1, O2: 3, CO2: 2, H2O: 3 },
    substances: ['C2H5OH', 'O2', 'CO2', 'H2O']
  },
  {
    equation: "SiCl₄ + 2 Mg → Si + 2 MgCl₂",
    stoichiometry: { SiCl4: 1, Mg: 2, Si: 1, MgCl2: 2 },
    substances: ['SiCl4', 'Mg', 'Si', 'MgCl2']
  },
  {
    equation: "4 Fe + 3 O₂ → 2 Fe₂O₃",
    stoichiometry: { Fe: 4, O2: 3, Fe2O3: 2 },
    substances: ['Fe', 'O2', 'Fe2O3']
  },
  {
    equation: "2 Na + Cl₂ → 2 NaCl",
    stoichiometry: { Na: 2, Cl2: 1, NaCl: 2 },
    substances: ['Na', 'Cl2', 'NaCl']
  },
  {
    equation: "Mg + I₂ → MgI₂",
    stoichiometry: { Mg: 1, I2: 1, MgI2: 1 },
    substances: ['Mg', 'I2', 'MgI2']
  },
  {
    equation: "2 C₂H₂ + 5 O₂ → 4 CO₂ + 2 H₂O",
    stoichiometry: { C2H2: 2, O2: 5, CO2: 4, H2O: 2 },
    substances: ['C2H2', 'O2', 'CO2', 'H2O']
  },
  {
    equation: "CS₂ + 3 O₂ → CO₂ + 2 SO₂",
    stoichiometry: { CS2: 1, O2: 3, CO2: 1, SO2: 2 },
    substances: ['CS2', 'O2', 'CO2', 'SO2']
  },
  {
    equation: "Sn + 2 Cl₂ → SnCl₄",
    stoichiometry: { Sn: 1, Cl2: 2, SnCl4: 1 },
    substances: ['Sn', 'Cl2', 'SnCl4']
  },
  {
    equation: "3 CaCl₂ + 2 Na₃PO₄ → Ca₃(PO₄)₂ + 6 NaCl",
    stoichiometry: { CaCl2: 3, Na3PO4: 2, Ca3PO4_2: 1, NaCl: 6 },
    substances: ['CaCl2', 'Na3PO4', 'Ca3PO4_2', 'NaCl']
  },
  {
    equation: "2 Al(OH)₃ + 3 H₂SO₄ → Al₂(SO₄)₃ + 6 H₂O",
    stoichiometry: { AlOH3: 2, H2SO4: 3, Al2SO4_3: 1, H2O: 6 },
    substances: ['AlOH3', 'H2SO4', 'Al2SO4_3', 'H2O']
  },
  {
    equation: "C₂H₄ + 3 O₂ → 2 CO₂ + 2 H₂O",
    stoichiometry: { C2H4: 1, O2: 3, CO2: 2, H2O: 2 },
    substances: ['C2H4', 'O2', 'CO2', 'H2O']
  },
  {
    equation: "2 NaBr + Cl₂ → 2 NaCl + Br₂",
    stoichiometry: { NaBr: 2, Cl2: 1, NaCl: 2, Br2: 1 },
    substances: ['NaBr', 'Cl2', 'NaCl', 'Br2']
  },
  {
    equation: "H₂ + Cl₂ → 2 HCl",
    stoichiometry: { H2: 1, Cl2: 1, HCl: 2 },
    substances: ['H2', 'Cl2', 'HCl']
  },
  {
    equation: "2 HgO → 2 Hg + O₂",
    stoichiometry: { HgO: 2, Hg: 2, O2: 1 },
    substances: ['HgO', 'Hg', 'O2']
  },
  {
    equation: "BaCl₂ + Na₂SO₄ → BaSO₄ + 2 NaCl",
    stoichiometry: { BaCl2: 1, Na2SO4: 1, BaSO4: 1, NaCl: 2 },
    substances: ['BaCl2', 'Na2SO4', 'BaSO4', 'NaCl']
  },
  {
    equation: "NH₄NO₃ → N₂O + 2 H₂O",
    stoichiometry: { NH4NO3: 1, N2O: 1, H2O: 2 },
    substances: ['NH4NO3', 'N2O', 'H2O']
  },
  {
    equation: "C₆H₆ + Cl₂ → C₆H₅Cl + HCl",
    stoichiometry: { C6H6: 1, Cl2: 1, C6H5Cl: 1, HCl: 1 },
    substances: ['C6H6', 'Cl2', 'C6H5Cl', 'HCl']
  },
  {
    equation: "2 KBr + I₂ → 2 KI + Br₂",
    stoichiometry: { KBr: 2, I2: 1, KI: 2, Br2: 1 },
    substances: ['KBr', 'I2', 'KI', 'Br2']
  },
  {
    equation: "SiO₂ + 2 C → Si + 2 CO",
    stoichiometry: { SiO2: 1, C: 2, Si: 1, CO: 2 },
    substances: ['SiO2', 'C', 'Si', 'CO']
  },
  {
    equation: "Pb(NO₃)₂ + 2 KI → PbI₂ + 2 KNO₃",
    stoichiometry: { PbNO3_2: 1, KI: 2, PbI2: 1, KNO3: 2 },
    substances: ['PbNO3_2', 'KI', 'PbI2', 'KNO3']
  },
  {
    equation: "2 HCl + Mg(OH)₂ → MgCl₂ + 2 H₂O",
    stoichiometry: { HCl: 2, MgOH2: 1, MgCl2: 1, H2O: 2 },
    substances: ['HCl', 'MgOH2', 'MgCl2', 'H2O']
  },
  {
    equation: "C₅H₁₂ + 8 O₂ → 5 CO₂ + 6 H₂O",
    stoichiometry: { C5H12: 1, O2: 8, CO2: 5, H2O: 6 },
    substances: ['C5H12', 'O2', 'CO2', 'H2O']
  },
  {
    equation: "H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O",
    stoichiometry: { H2SO4: 1, NaOH: 2, Na2SO4: 1, H2O: 2 },
    substances: ['H2SO4', 'NaOH', 'Na2SO4', 'H2O']
  },
  {
    equation: "Fe + S → FeS",
    stoichiometry: { Fe: 1, S: 1, FeS: 1 },
    substances: ['Fe', 'S', 'FeS']
  }
];

export default function MassToMassActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
  const [currentProblemSet, setCurrentProblemSet] = useState(() => savedState?.currentProblemSet || shuffleArray([...MASS_TO_MASS_PROBLEMS]));
  const [problemIndex, setProblemIndex] = useState(() => savedState?.problemIndex || 0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(() => savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(() => savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(() => savedState?.showFeedback || false);
  const [score, setScore] = useState(() => savedState?.score || 0);
  const [questionsAttempted, setQuestionsAttempted] = useState(() => savedState?.questionsAttempted || 0);
  const inputRef = useRef(null);

  const generateQuestion = useCallback(() => {
    if (problemIndex >= currentProblemSet.length) {
      setFeedback({ type: 'info', message: `Set complete! Your score: ${score}/${questionsAttempted}. Starting new set.` });
      setShowFeedback(true);
      return;
    }

    const problem = currentProblemSet[problemIndex];
    const substancesInProblem = problem.substances;
    let givenSubstance, findSubstance;

    // Ensure given and find substances are different
    do {
      givenSubstance = substancesInProblem[Math.floor(Math.random() * substancesInProblem.length)];
      findSubstance = substancesInProblem[Math.floor(Math.random() * substancesInProblem.length)];
    } while (givenSubstance === findSubstance);

    const givenMolarMass = MOLAR_MASSES[givenSubstance];
    const findMolarMass = MOLAR_MASSES[findSubstance];
    const stoicRatioGiven = problem.stoichiometry[givenSubstance];
    const stoicRatioFind = problem.stoichiometry[findSubstance];

    if (!givenMolarMass || !findMolarMass || !stoicRatioGiven || !stoicRatioFind) {
        console.error("Molar mass or stoichiometry missing for problem:", problem, givenSubstance, findSubstance);
        // Skip this question and try to generate another one
        setProblemIndex(prev => prev + 1); 
        return;
    }
    
    const roundingOptions = [
      { type: 'default', precision: 3, textSuffix: '', placeholderSuffix: '(e.g., 1.234)' },
      { type: 'tenth', precision: 1, textSuffix: ' Round to the nearest tenth.', placeholderSuffix: '(e.g., 1.2)' },
      { type: 'hundredth', precision: 2, textSuffix: ' Round to the nearest hundredth.', placeholderSuffix: '(e.g., 1.23)' },
    ];
    const selectedRounding = roundingOptions[Math.floor(Math.random() * roundingOptions.length)];

    const givenMass = parseFloat((Math.random() * 99 + 1).toFixed(2)); // Random mass between 1.00 and 100.00 g

    // Calculation: Mass Given -> Moles Given -> Moles Find -> Mass Find
    const molesGiven = givenMass / givenMolarMass;
    const molesFind = (molesGiven / stoicRatioGiven) * stoicRatioFind;
    const rawCorrectAnswer = molesFind * findMolarMass;
    
    const correctAnswer = parseFloat(rawCorrectAnswer.toFixed(selectedRounding.precision));

    const questionText = `In the reaction: ${problem.equation}. If you start with ${givenMass.toFixed(2)} g of ${givenSubstance}, what mass of ${findSubstance} (in grams) will be produced/reacted?${selectedRounding.textSuffix}`;

    setCurrentQuestion({
      equation: problem.equation,
      text: questionText,
      correctAnswer, // Rounded as per instruction
      rawCorrectAnswer, // Unrounded for default comparison
      givenSubstance,
      findSubstance,
      givenMass,
      givenMolarMass,
      findMolarMass,
      stoicRatioGiven,
      stoicRatioFind,
      roundingType: selectedRounding.type,
      precision: selectedRounding.precision,
      placeholderSuffix: selectedRounding.placeholderSuffix,
    });
    setUserAnswer('');
    if (inputRef.current) {
        inputRef.current.focus();
    }
  }, [problemIndex, currentProblemSet, score, questionsAttempted]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion, problemIndex]);

  useEffect(() => {
    if (setSavedState) {
      setSavedState({
        currentProblemSet, problemIndex, score, questionsAttempted,
        userAnswer, feedback, showFeedback,
      });
    }
  }, [currentProblemSet, problemIndex, score, questionsAttempted, userAnswer, feedback, showFeedback, setSavedState]);

  const checkAnswer = (answerString) => {
    if (!currentQuestion || showFeedback) return;

    const answer = parseFloat(answerString);
    if (isNaN(answer)) {
      setFeedback({ type: 'incorrect', message: 'Please enter a valid number.' });
      setShowFeedback(true);
      return;
    }

    setQuestionsAttempted(prev => prev + 1);
    const {
        correctAnswer: instructedCorrectAnswer, rawCorrectAnswer, roundingType, precision,
        givenSubstance, findSubstance, givenMass, givenMolarMass, findMolarMass,
        stoicRatioGiven, stoicRatioFind, equation
    } = currentQuestion;

    let isCorrect = false;
    if (roundingType === 'tenth' || roundingType === 'hundredth') {
      isCorrect = Math.abs(parseFloat(answer.toFixed(precision)) - instructedCorrectAnswer) < (0.00001 / Math.pow(10, precision));
    } else { // default
       isCorrect = Math.abs(answer - rawCorrectAnswer) < 0.01 * rawCorrectAnswer || Math.abs(answer - rawCorrectAnswer) < 0.05;
       if (!isCorrect && Math.abs(answer - instructedCorrectAnswer) < 0.0005) { // check against default rounded (3 places)
        isCorrect = true;
       }
    }

    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'Correct! Excellent work!' });
      setScore(prev => prev + 1);
    } else {
      const finalCorrectAnswerDisplay = instructedCorrectAnswer.toFixed(precision);
      const molesGivenCalc = givenMass / givenMolarMass;
      const molesFindCalc = (molesGivenCalc / stoicRatioGiven) * stoicRatioFind;
      
      let explanation = `Let's solve for the mass of ${findSubstance} from ${givenMass.toFixed(2)} g of ${givenSubstance} in: ${equation}\n\n`;
      explanation += `1. Convert mass of ${givenSubstance} to moles:\n`;
      explanation += `   Moles ${givenSubstance} = Mass / Molar Mass = ${givenMass.toFixed(2)} g / ${givenMolarMass.toFixed(3)} g/mol = ${molesGivenCalc.toFixed(4)} moles.\n\n`;
      explanation += `2. Use stoichiometry to find moles of ${findSubstance}:\n`;
      explanation += `   Mole ratio from equation: ${stoicRatioGiven} moles ${givenSubstance} : ${stoicRatioFind} moles ${findSubstance}.\n`;
      explanation += `   Moles ${findSubstance} = (Moles ${givenSubstance} / ${stoicRatioGiven}) * ${stoicRatioFind} = (${molesGivenCalc.toFixed(4)} / ${stoicRatioGiven}) * ${stoicRatioFind} = ${molesFindCalc.toFixed(4)} moles.\n\n`;
      explanation += `3. Convert moles of ${findSubstance} to mass:\n`;
      explanation += `   Mass ${findSubstance} = Moles * Molar Mass = ${molesFindCalc.toFixed(4)} moles * ${findMolarMass.toFixed(3)} g/mol = ${rawCorrectAnswer.toFixed(4)} g.\n\n`;

      if (roundingType !== 'default') {
        explanation += `4. Rounded to the nearest ${roundingType}: ${finalCorrectAnswerDisplay} g.\n\n`;
      } else {
        explanation += `4. The answer is approximately ${finalCorrectAnswerDisplay} g.\n\n`;
      }
      explanation += `So, the correct answer is ${finalCorrectAnswerDisplay} g.`;
      
      setFeedback({ type: 'incorrect', message: `Not quite.\n${explanation}` });
    }
    setShowFeedback(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
        setFeedback({ type: 'incorrect', message: 'Please enter an answer.' });
        setShowFeedback(true);
        return;
    }
    checkAnswer(userAnswer);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setFeedback(null);
    if (problemIndex >= currentProblemSet.length - 1) {
        setCurrentProblemSet(shuffleArray([...MASS_TO_MASS_PROBLEMS]));
        setProblemIndex(0);
    } else {
        setProblemIndex(prev => prev + 1);
    }
  };

  if (!currentQuestion && !(showFeedback && feedback?.type === 'info')) {
    return <div className="center-container"><p>Loading mass-to-mass calculation question...</p></div>;
  }
  
  if (showFeedback && feedback?.type === 'info') {
    return (
      <div className="activity-container">
        <div className="activity-card" style={{ textAlign: 'center' }}>
          <h2 className="activity-title" style={{ fontSize: '1.8em' }}>Set Complete!</h2>
          <div className={`feedback-container feedback-${feedback.type}`} style={{ margin: '20px 0', padding: '15px', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.1em' }}>{feedback.message}</p>
          </div>
          <button className="activity-btn" onClick={handleNextQuestion}>Start New Set</button>
          <button className="back-btn" style={{ marginLeft: '15px' }} onClick={onBack}>Back to Topics</button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Mass-to-Mass Calculations</h2>
        
        {currentQuestion && (
          <>
            <div className="question-area">
              <p className="question-equation" style={{ marginBottom: '15px' }}>
                Reaction: {currentQuestion.equation.split(' ').map((part, index) => 
                  !isNaN(parseInt(part)) && parseInt(part) === parseFloat(part) && (index === 0 || currentQuestion.equation.split(' ')[index-1] === '→' || currentQuestion.equation.split(' ')[index-1] === '+')
                  ? <strong key={index}>{part} </strong> 
                  : <span key={index}>{part} </span>
                )}
              </p>
              <p className="question-text" style={{ fontSize: '1.1em' }}>{currentQuestion.text}</p>
            </div>

            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <input
                ref={inputRef}
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`Your answer (grams) ${currentQuestion.placeholderSuffix || ''}`}
                className="activity-input"
                style={{ margin: '10px 0 20px 0' }}
                disabled={showFeedback}
              />

              {showFeedback && feedback && (
                <div className={`feedback-container feedback-${feedback.type}`}>
                  <h3>{feedback.type === 'correct' ? 'Correct!' : feedback.type === 'incorrect' ? 'Incorrect.' : 'Info:'}</h3>
                  <p>{feedback.message}</p>
                </div>
              )}

              <div className="button-row">
                {showFeedback ? (
                  <button type="button" className="activity-btn" onClick={handleNextQuestion}>Next Question</button>
                ) : (
                  <button type="submit" className="activity-btn" disabled={!userAnswer || showFeedback}>Submit</button>
                )}
                {onShowPeriodicTable && (
                     <button type="button" className="activity-btn" onClick={onShowPeriodicTable}>Periodic Table</button>
                )}
                <button type="button" className="back-btn" onClick={onBack}>Back to Topics</button>
              </div>
            </form>
            <p className="score-display">Score: {score} / {questionsAttempted}</p>
          </>
        )}
      </div>
    </div>
  );
}

MassToMassActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

MassToMassActivity.defaultProps = {
  onShowPeriodicTable: null,
  savedState: null,
  setSavedState: () => {},
}; 