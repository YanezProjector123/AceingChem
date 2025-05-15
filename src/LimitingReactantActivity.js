import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './StoichiometryActivity.css';

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

const REACTIONS = [
  {
    equation: "N₂ + 3 H₂ → 2 NH₃",
    reactants: ["N2", "H2"],
    products: ["NH3"],
    molar_masses: { N2: 28.014, H2: 2.016, NH3: 17.031 },
    stoichiometry: { N2: 1, H2: 3, NH3: 2 }
  },
  {
    equation: "CH₄ + 2 O₂ → CO₂ + 2 H₂O",
    reactants: ["CH4", "O2"],
    products: ["CO2", "H2O"],
    molar_masses: { CH4: 16.043, O2: 31.998, CO2: 44.01, H2O: 18.015 },
    stoichiometry: { CH4: 1, O2: 2, CO2: 1, H2O: 2 }
  },
  {
    equation: "2 Al + 3 Cl₂ → 2 AlCl₃",
    reactants: ["Al", "Cl2"],
    products: ["AlCl3"],
    molar_masses: { Al: 26.982, Cl2: 70.906, AlCl3: 133.341 },
    stoichiometry: { Al: 2, Cl2: 3, AlCl3: 2 }
  },
  {
    equation: "Zn + 2 HCl → ZnCl₂ + H₂",
    reactants: ["Zn", "HCl"],
    products: ["ZnCl2", "H2"],
    molar_masses: { Zn: 65.38, HCl: 36.461, ZnCl2: 136.286, H2: 2.016 },
    stoichiometry: { Zn: 1, HCl: 2, ZnCl2: 1, H2: 1 }
  },
  {
    equation: "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O",
    reactants: ["C3H8", "O2"],
    products: ["CO2", "H2O"],
    molar_masses: { C3H8: 44.097, O2: 31.998, CO2: 44.01, H2O: 18.015 },
    stoichiometry: { C3H8: 1, O2: 5, CO2: 3, H2O: 4 }
  },
  {
    equation: "P₄ + 5 O₂ → P₄O₁₀",
    reactants: ["P4", "O2"],
    products: ["P4O10"],
    molar_masses: { P4: 123.896, O2: 31.998, P4O10: 283.888 },
    stoichiometry: { P4: 1, O2: 5, P4O10: 1 }
  },
  {
    equation: "WO₃ + 3 H₂ → W + 3 H₂O",
    reactants: ["WO3", "H2"],
    products: ["W", "H2O"],
    molar_masses: { WO3: 231.84, H2: 2.016, W: 183.84, H2O: 18.015 },
    stoichiometry: { WO3: 1, H2: 3, W: 1, H2O: 3 }
  },
  {
    equation: "SiCl₄ + 2 Mg → Si + 2 MgCl₂",
    reactants: ["SiCl4", "Mg"],
    products: ["Si", "MgCl2"],
    molar_masses: { SiCl4: 169.898, Mg: 24.305, Si: 28.085, MgCl2: 95.211 },
    stoichiometry: { SiCl4: 1, Mg: 2, Si: 1, MgCl2: 2 }
  },
  {
    equation: "2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O",
    reactants: ["C2H6", "O2"],
    products: ["CO2", "H2O"],
    molar_masses: { C2H6: 30.07, O2: 31.998, CO2: 44.01, H2O: 18.015 },
    stoichiometry: { C2H6: 2, O2: 7, CO2: 4, H2O: 6 }
  },
  {
    equation: "2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O",
    reactants: ["C4H10", "O2"],
    products: ["CO2", "H2O"],
    molar_masses: { C4H10: 58.12, O2: 31.998, CO2: 44.01, H2O: 18.015 },
    stoichiometry: { C4H10: 2, O2: 13, CO2: 8, H2O: 10 }
  },
  {
    equation: "Fe₂O₃ + 6 HCl → 2 FeCl₃ + 3 H₂O",
    reactants: ["Fe2O3", "HCl"],
    products: ["FeCl3", "H2O"],
    molar_masses: { Fe2O3: 159.687, HCl: 36.461, FeCl3: 162.20, H2O: 18.015 },
    stoichiometry: { Fe2O3: 1, HCl: 6, FeCl3: 2, H2O: 3 }
  },
  {
    equation: "2 Cu + O₂ → 2 CuO",
    reactants: ["Cu", "O2"],
    products: ["CuO"],
    molar_masses: { Cu: 63.546, O2: 31.998, CuO: 79.545 },
    stoichiometry: { Cu: 2, O2: 1, CuO: 2 }
  },
  {
    equation: "Cu + 2 AgNO₃ → Cu(NO₃)₂ + 2 Ag",
    reactants: ["Cu", "AgNO3"],
    products: ["Cu(NO3)2", "Ag"],
    molar_masses: { Cu: 63.546, AgNO3: 169.873, 'Cu(NO3)2': 187.554, Ag: 107.868 },
    stoichiometry: { Cu: 1, AgNO3: 2, 'Cu(NO3)2': 1, Ag: 2 }
  },
  {
    equation: "SO₃ + H₂O → H₂SO₄",
    reactants: ["SO3", "H2O"],
    products: ["H2SO4"],
    molar_masses: { SO3: 80.064, H2O: 18.015, H2SO4: 98.079 },
    stoichiometry: { SO3: 1, H2O: 1, H2SO4: 1 }
  },
  {
    equation: "2 Na + Cl₂ → 2 NaCl",
    reactants: ["Na", "Cl2"],
    products: ["NaCl"],
    molar_masses: { Na: 22.990, Cl2: 70.906, NaCl: 58.443 },
    stoichiometry: { Na: 2, Cl2: 1, NaCl: 2 }
  },
  {
    equation: "P₄ + 6 Cl₂ → 4 PCl₃",
    reactants: ["P4", "Cl2"],
    products: ["PCl3"],
    molar_masses: { P4: 123.896, Cl2: 70.906, PCl3: 137.33 },
    stoichiometry: { P4: 1, Cl2: 6, PCl3: 4 }
  },
  {
    equation: "CS₂ + 3 O₂ → CO₂ + 2 SO₂",
    reactants: ["CS2", "O2"],
    products: ["CO2", "SO2"],
    molar_masses: { CS2: 76.139, O2: 31.998, CO2: 44.01, SO2: 64.066 },
    stoichiometry: { CS2: 1, O2: 3, CO2: 1, SO2: 2 }
  },
  {
    equation: "2 H₂S + 3 O₂ → 2 SO₂ + 2 H₂O",
    reactants: ["H2S", "O2"],
    products: ["SO2", "H2O"],
    molar_masses: { H2S: 34.08, O2: 31.998, SO2: 64.066, H2O: 18.015 },
    stoichiometry: { H2S: 2, O2: 3, SO2: 2, H2O: 2 }
  },
  {
    equation: "SOCl₂ + H₂O → SO₂ + 2 HCl",
    reactants: ["SOCl2", "H2O"],
    products: ["SO2", "HCl"],
    molar_masses: { SOCl2: 118.97, H2O: 18.015, SO2: 64.066, HCl: 36.461 },
    stoichiometry: { SOCl2: 1, H2O: 1, SO2: 1, HCl: 2 }
  },
  {
    equation: "2 LiOH + H₂SO₄ → Li₂SO₄ + 2 H₂O",
    reactants: ["LiOH", "H2SO4"],
    products: ["Li2SO4", "H2O"],
    molar_masses: { LiOH: 23.948, H2SO4: 98.079, 'Li2SO4': 163.941, H2O: 18.015 },
    stoichiometry: { LiOH: 2, H2SO4: 1, 'Li2SO4': 1, H2O: 2 }
  },
  {
    equation: "2 K + Br2 → 2 KBr",
    reactants: ["K", "Br2"],
    products: ["KBr"],
    molar_masses: { K: 39.098, Br2: 159.808, KBr: 119.002 },
    stoichiometry: { K: 2, Br2: 1, KBr: 2 }
  },
  {
    equation: "2 Na + S → Na2S",
    reactants: ["Na", "S"],
    products: ["Na2S"],
    molar_masses: { Na: 22.990, S: 32.06, Na2S: 163.941 },
    stoichiometry: { Na: 2, S: 1, Na2S: 1 }
  },
  {
    equation: "2 H2 + O2 → 2 H2O",
    reactants: ["H2", "O2"],
    products: ["H2O"],
    molar_masses: { H2: 2.016, O2: 31.998, H2O: 18.015 },
    stoichiometry: { H2: 2, O2: 1, H2O: 2 }
  },
  {
    equation: "2 Fe + 3 Cl2 → 2 FeCl3",
    reactants: ["Fe", "Cl2"],
    products: ["FeCl3"],
    molar_masses: { Fe: 55.845, Cl2: 70.906, FeCl3: 162.20 },
    stoichiometry: { Fe: 2, Cl2: 3, FeCl3: 2 }
  },
  {
    equation: "2 Al + 3 Br2 → 2 AlBr3",
    reactants: ["Al", "Br2"],
    products: ["AlBr3"],
    molar_masses: { Al: 26.982, Br2: 159.808, AlBr3: 266.69 },
    stoichiometry: { Al: 2, Br2: 3, AlBr3: 2 }
  },
  {
    equation: "C2H4 + H2 → C2H6",
    reactants: ["C2H4", "H2"],
    products: ["C2H6"],
    molar_masses: { C2H4: 28.054, H2: 2.016, C2H6: 30.07 },
    stoichiometry: { C2H4: 1, H2: 1, C2H6: 1 }
  },
  {
    equation: "2 KClO3 → 2 KCl + 3 O2",
    reactants: ["KClO3", "O2"],
    products: ["KCl", "O2"],
    molar_masses: { KClO3: 122.55, KCl: 74.551, O2: 31.998 },
    stoichiometry: { KClO3: 2, KCl: 2, O2: 3 }
  },
  {
    equation: "2 NaN3 → 2 Na + 3 N2",
    reactants: ["NaN3", "N2"],
    products: ["Na", "N2"],
    molar_masses: { NaN3: 65.009, Na: 22.990, N2: 28.014 },
    stoichiometry: { NaN3: 2, Na: 2, N2: 3 }
  },
  {
    equation: "2 H2O2 → 2 H2O + O2",
    reactants: ["H2O2", "O2"],
    products: ["H2O", "O2"],
    molar_masses: { H2O2: 34.014, H2O: 18.015, O2: 31.998 },
    stoichiometry: { H2O2: 2, H2O: 2, O2: 1 }
  },
  {
    equation: "2 NO2 + H2O → HNO3 + HNO2",
    reactants: ["NO2", "H2O"],
    products: ["HNO3", "HNO2"],
    molar_masses: { NO2: 46.005, H2O: 18.015, HNO3: 63.012, HNO2: 46.005 },
    stoichiometry: { NO2: 2, H2O: 1, HNO3: 1, HNO2: 1 }
  },
  {
    equation: "2 SO2 + O2 → 2 SO3",
    reactants: ["SO2", "O2"],
    products: ["SO3"],
    molar_masses: { SO2: 64.066, O2: 31.998, SO3: 80.064 },
    stoichiometry: { SO2: 2, O2: 1, SO3: 2 }
  },
  {
    equation: "2 NO + O2 → 2 NO2",
    reactants: ["NO", "O2"],
    products: ["NO2"],
    molar_masses: { NO: 30.006, O2: 31.998, NO2: 46.005 },
    stoichiometry: { NO: 2, O2: 1, NO2: 2 }
  },
  {
    equation: "2 CO + O2 → 2 CO2",
    reactants: ["CO", "O2"],
    products: ["CO2"],
    molar_masses: { CO: 28.010, O2: 31.998, CO2: 44.01 },
    stoichiometry: { CO: 2, O2: 1, CO2: 2 }
  },
  {
    equation: "2 H2S + SO2 → 3 S + 2 H2O",
    reactants: ["H2S", "SO2"],
    products: ["S", "H2O"],
    molar_masses: { H2S: 34.08, SO2: 64.066, S: 32.06, H2O: 18.015 },
    stoichiometry: { H2S: 2, SO2: 1, S: 3, H2O: 2 }
  },
  {
    equation: "2 NH3 + H2SO4 → (NH4)2SO4",
    reactants: ["NH3", "H2SO4"],
    products: ["(NH4)2SO4"],
    molar_masses: { NH3: 17.031, H2SO4: 98.079, '(NH4)2SO4': 283.38 },
    stoichiometry: { NH3: 2, H2SO4: 1, '(NH4)2SO4': 1 }
  },
  {
    equation: "2 Na + 2 H2O → 2 NaOH + H2",
    reactants: ["Na", "H2O"],
    products: ["NaOH", "H2"],
    molar_masses: { Na: 22.990, H2O: 18.015, NaOH: 39.997, H2: 2.016 },
    stoichiometry: { Na: 2, H2O: 2, NaOH: 2, H2: 1 }
  },
  {
    equation: "2 K + 2 H2O → 2 KOH + H2",
    reactants: ["K", "H2O"],
    products: ["KOH", "H2"],
    molar_masses: { K: 39.098, H2O: 18.015, KOH: 56.106, H2: 2.016 },
    stoichiometry: { K: 2, H2O: 2, KOH: 2, H2: 1 }
  },
  {
    equation: "2 Al + 3 H2SO4 → Al2(SO4)3 + 3 H2",
    reactants: ["Al", "H2SO4"],
    products: ["Al2(SO4)3", "H2"],
    molar_masses: { Al: 26.982, H2SO4: 98.079, 'Al2(SO4)3': 342.153, H2: 2.016 },
    stoichiometry: { Al: 2, H2SO4: 3, 'Al2(SO4)3': 1, H2: 3 }
  },
  {
    equation: "2 Fe + 3 H2SO4 → Fe2(SO4)3 + 3 H2",
    reactants: ["Fe", "H2SO4"],
    products: ["Fe2(SO4)3", "H2"],
    molar_masses: { Fe: 55.845, H2SO4: 98.079, 'Fe2(SO4)3': 342.153, H2: 2.016 },
    stoichiometry: { Fe: 2, H2SO4: 3, 'Fe2(SO4)3': 1, H2: 3 }
  },
  {
    equation: "2 NaCl + H2SO4 → Na2SO4 + 2 HCl",
    reactants: ["NaCl", "H2SO4"],
    products: ["Na2SO4", "HCl"],
    molar_masses: { NaCl: 58.443, H2SO4: 98.079, Na2SO4: 142.042, HCl: 36.461 },
    stoichiometry: { NaCl: 2, H2SO4: 1, Na2SO4: 1, HCl: 2 }
  },
  {
    equation: "2 KBr + Cl2 → 2 KCl + Br2",
    reactants: ["KBr", "Cl2"],
    products: ["KCl", "Br2"],
    molar_masses: { KBr: 119.002, Cl2: 70.906, KCl: 74.551, Br2: 159.808 },
    stoichiometry: { KBr: 2, Cl2: 1, KCl: 2, Br2: 1 }
  },
  {
    equation: "2 KI + Cl2 → 2 KCl + I2",
    reactants: ["KI", "Cl2"],
    products: ["KCl", "I2"],
    molar_masses: { KI: 166.003, Cl2: 70.906, KCl: 74.551, I2: 253.808 },
    stoichiometry: { KI: 2, Cl2: 1, KCl: 2, I2: 1 }
  },
  {
    equation: "2 NaBr + Cl2 → 2 NaCl + Br2",
    reactants: ["NaBr", "Cl2"],
    products: ["NaCl", "Br2"],
    molar_masses: { NaBr: 102.894, Cl2: 70.906, NaCl: 58.443, Br2: 159.808 },
    stoichiometry: { NaBr: 2, Cl2: 1, NaCl: 2, Br2: 1 }
  },
  {
    equation: "2 NaI + Cl2 → 2 NaCl + I2",
    reactants: ["NaI", "Cl2"],
    products: ["NaCl", "I2"],
    molar_masses: { NaI: 166.003, Cl2: 70.906, NaCl: 58.443, I2: 253.808 },
    stoichiometry: { NaI: 2, Cl2: 1, NaCl: 2, I2: 1 }
  },
];

const round = (value, precision) => {
    if (precision === null || precision === undefined) return value;
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

// Helper to format chemical formulas with subscripts/superscripts
function formatChemical(formula) {
  if (!formula) return '';
  // Replace numbers with <sub>number</sub>
  let formatted = formula
    .replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>') // e.g. H2O -> H<sub>2</sub>O
    .replace(/_([0-9]+)/g, '<sub>$1</sub>') // e.g. Ca3PO4_2 -> Ca3PO4<sub>2</sub>
    .replace(/\^([\d\+\-]+)/g, '<sup>$1</sup>'); // e.g. SO4^2- -> SO4<sup>2-</sup>
  // Replace charges at the end (e.g. Fe3+)
  formatted = formatted.replace(/([A-Za-z\)\]])([\d]+)([\+\-])/, '$1<sub>$2</sub><sup>$3</sup>');
  return formatted;
}

// Add helper for random choice
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function LimitingReactantActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [givenReactant1, setGivenReactant1] = useState({ name: '', mass: 0 });
  const [givenReactant2, setGivenReactant2] = useState({ name: '', mass: 0 });
  const [targetProduct, setTargetProduct] = useState('');
  
  const [userInputLR, setUserInputLR] = useState(''); // For limiting reactant selection

  const [correctLR, setCorrectLR] = useState('');
  const [roundingInstruction, setRoundingInstruction] = useState('');
  const [roundingPrecision, setRoundingPrecision] = useState(2); // Default to 2 decimal places for yield

  const [feedbackLR, setFeedbackLR] = useState('');
  const [overallFeedback, setOverallFeedback] = useState('');
  
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationSteps, setExplanationSteps] = useState([]);

  const inputTYRef = useRef(null);
  const nextQuestionButtonRef = useRef(null);

  const [questionType, setQuestionType] = useState('yield');
  const [targetUnit, setTargetUnit] = useState('g');
  // Track last used reaction and reactant order
  const lastPairRef = useRef(null);

  const generateQuestion = useCallback(() => {
    if (REACTIONS.length === 0) return;
    let problem, reactants, r1Name, r2Name, pairKey;
    let attempts = 0;
    do {
      problem = randomChoice(REACTIONS);
      reactants = [...problem.reactants];
      if (Math.random() < 0.5) reactants.reverse();
      r1Name = reactants[0];
      r2Name = reactants[1];
      pairKey = problem.equation + '|' + r1Name + '|' + r2Name;
      attempts++;
    } while (lastPairRef.current === pairKey && attempts < 10);
    lastPairRef.current = pairKey;
    setCurrentProblem(problem);
    // Expanded mass range and precision
    const r1Mass = parseFloat((Math.random() * 195 + 5).toFixed(Math.random() < 0.5 ? 1 : 2));
    const r2Mass = parseFloat((Math.random() * 195 + 5).toFixed(Math.random() < 0.5 ? 1 : 2));
    setGivenReactant1({ name: r1Name, mass: r1Mass });
    setGivenReactant2({ name: r2Name, mass: r2Mass });
    // Randomly select product if multiple
    const product = randomChoice(problem.products);
    setTargetProduct(product);
    // Randomize question type
    const qTypes = ['yield', 'limiting', 'moles', 'excess'];
    const qType = randomChoice(qTypes);
    setQuestionType(qType);
    // Randomize units for yield/moles
    let unit = 'g';
    if (qType === 'moles' || (qType === 'yield' && Math.random() < 0.3)) unit = 'mol';
    setTargetUnit(unit);
    // Rounding
    const roundingOptions = [
      { precision: 1, text: "to the nearest tenth." },
      { precision: 2, text: "to two decimal places." },
      { precision: 0, text: "to the nearest whole number." },
      { precision: null, text: "(no specific rounding)." }
    ];
    const selectedRounding = randomChoice(roundingOptions);
    setRoundingInstruction(selectedRounding.text);
    setRoundingPrecision(selectedRounding.precision);
    // Calculate moles
    const molesR1 = r1Mass / problem.molar_masses[r1Name];
    const molesR2 = r2Mass / problem.molar_masses[r2Name];
    const stoichR1 = problem.stoichiometry[r1Name];
    const stoichR2 = problem.stoichiometry[r2Name];
    const stoichProd = problem.stoichiometry[product];
    const molesProdFromR1 = (molesR1 / stoichR1) * stoichProd;
    const molesProdFromR2 = (molesR2 / stoichR2) * stoichProd;
    let actualLR = '';
    let theoreticalMolesProduct = 0;
    if (molesProdFromR1 < molesProdFromR2) {
      actualLR = r1Name;
      theoreticalMolesProduct = molesProdFromR1;
    } else {
      actualLR = r2Name;
      theoreticalMolesProduct = molesProdFromR2;
    }
    setCorrectLR(actualLR);
    // Set correct answer for each type
    // (Removed setCorrectTY calls and related variables since only limiting reactant is needed)
    setUserInputLR('');
    setFeedbackLR('');
    setOverallFeedback('');
    setShowExplanation(false);
    setExplanationSteps([]);
    if (setSavedState) {
      setSavedState({
        score,
        questionsAttempted,
      });
    }
  }, [setSavedState, score, questionsAttempted]);

  useEffect(() => {
    if (savedState && savedState.score !== undefined) {
        setScore(savedState.score);
        setQuestionsAttempted(savedState.questionsAttempted);
    } else {
        setScore(0);
        setQuestionsAttempted(0);
    }
    generateQuestion();
    // eslint-disable-next-line
  }, []);

  const checkAnswer = () => {
    if (!currentProblem) return;
    setShowExplanation(false);
    let lrCorrect = false;
    let explanation = [];
    let feedbackMsg = '';
    let feedbackType = '';

    if (userInputLR === correctLR) {
      lrCorrect = true;
    }

    // Feedback logic: only correct if limiting reactant is correct
    if (lrCorrect) {
      setScore(score + 1);
      feedbackMsg = '✅ Correct! The limiting reactant is correct.';
      feedbackType = 'correct';
    } else {
      feedbackMsg = '❌ Incorrect.';
      feedbackType = 'incorrect';
      feedbackMsg += ' Your limiting reactant selection is incorrect.';
    }
    setOverallFeedback(feedbackMsg);
    setFeedbackLR(lrCorrect ? '' : `Limiting Reactant: The correct answer is ${formatChemical(correctLR)}.`);
    setQuestionsAttempted(questionsAttempted + 1);

    // --- Nicer Explanation Formatting ---
    const molesR1 = givenReactant1.mass / currentProblem.molar_masses[givenReactant1.name];
    const molesR2 = givenReactant2.mass / currentProblem.molar_masses[givenReactant2.name];
    const stoichR1 = currentProblem.stoichiometry[givenReactant1.name];
    const stoichR2 = currentProblem.stoichiometry[givenReactant2.name];
    const stoichProd = currentProblem.stoichiometry[targetProduct];
    const molesProdFromR1 = (molesR1 / stoichR1) * stoichProd;
    const molesProdFromR2 = (molesR2 / stoichR2) * stoichProd;
    const theoreticalMolesProduct = molesProdFromR1 < molesProdFromR2 ? molesProdFromR1 : molesProdFromR2;
    const theoreticalYieldActual = theoreticalMolesProduct * currentProblem.molar_masses[targetProduct];

    explanation.push(
      `<b>Given:</b> <span style='color:#fff'>${givenReactant1.mass}g ${formatChemical(givenReactant1.name)}, ${givenReactant2.mass}g ${formatChemical(givenReactant2.name)}</span>`
    );
    explanation.push(
      `<b>Equation:</b> <span style='color:#fff'>${formatChemical(currentProblem.equation)}</span>`
    );
    explanation.push('<b>Step 1:</b> Find moles of each reactant.');
    explanation.push(
      `&bull; ${formatChemical(givenReactant1.name)}: ${givenReactant1.mass} / ${currentProblem.molar_masses[givenReactant1.name]} = <b>${molesR1.toFixed(4)} mol</b>`
    );
    explanation.push(
      `&bull; ${formatChemical(givenReactant2.name)}: ${givenReactant2.mass} / ${currentProblem.molar_masses[givenReactant2.name]} = <b>${molesR2.toFixed(4)} mol</b>`
    );
    explanation.push('<b>Step 2:</b> Use stoichiometry to find max product from each reactant.');
    explanation.push(
      `&bull; From ${formatChemical(givenReactant1.name)}: <b>${molesProdFromR1.toFixed(4)} mol ${formatChemical(targetProduct)}</b>`
    );
    explanation.push(
      `&bull; From ${formatChemical(givenReactant2.name)}: <b>${molesProdFromR2.toFixed(4)} mol ${formatChemical(targetProduct)}</b>`
    );
    explanation.push('<b>Step 3:</b> Limiting reactant is the one that makes less product.');
    explanation.push(
      `&bull; <b>Limiting Reactant: <span style='color:#facc15'>${formatChemical(correctLR)}</span></b>`
    );
    setExplanationSteps(explanation);
    setShowExplanation(true);

    if (setSavedState) {
      setSavedState({
        score,
        questionsAttempted: questionsAttempted + 1,
      });
    }
  };
  
  const handleUserSubmit = (e) => {
    e.preventDefault();
    checkAnswer();
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    generateQuestion();
    if (inputTYRef.current) {
        inputTYRef.current.focus(); 
    }
  };

  if (!currentProblem) {
    return <div className="activity-container">Loading Limiting Reactant problems...</div>;
  }

  return (
    <div className="activity-container limiting-reactant-activity">
      <div className="activity-card">
        <h2 className="activity-title">Limiting Reactant & Theoretical Yield</h2>
        <div className="question-area">
          <p className="question-equation">Reaction: <strong dangerouslySetInnerHTML={{__html: formatChemical(currentProblem.equation)}} /></p>
          <p className="question-text">
            Given: <strong>{givenReactant1.mass}g</strong> of <strong dangerouslySetInnerHTML={{__html: formatChemical(givenReactant1.name)}} /> and <strong>{givenReactant2.mass}g</strong> of <strong dangerouslySetInnerHTML={{__html: formatChemical(givenReactant2.name)}} />.
          </p>
        </div>
        <form onSubmit={handleUserSubmit} className="answer-form" id="answer-form">
          <div className="form-group">
            <label htmlFor="limitingReactant">1. Identify the Limiting Reactant:</label>
            <select 
              id="limitingReactant"
              value={userInputLR}
              onChange={(e) => setUserInputLR(e.target.value)}
              className="activity-input"
              required
            >
              <option value="">-- Select Reactant --</option>
              <option value={givenReactant1.name} dangerouslySetInnerHTML={{__html: formatChemical(givenReactant1.name)}} />
              <option value={givenReactant2.name} dangerouslySetInnerHTML={{__html: formatChemical(givenReactant2.name)}} />
            </select>
          </div>
        </form>

        {overallFeedback && (
          <div className={`feedback-section feedback-${overallFeedback.includes('Correct') ? 'correct' : 'incorrect'}`}
            style={{fontSize:'1.08em',lineHeight:1.7}}>
            <div style={{fontWeight:700,marginBottom:6}}>{overallFeedback}</div>
            {feedbackLR && (
              <div
                style={{ color: '#222', marginBottom: 2, fontWeight: 600 }}
                dangerouslySetInnerHTML={{ __html: feedbackLR }}
              />
            )}
          </div>
        )}

        <div className="button-row">
          {!overallFeedback && <button type="submit" form="answer-form" className="activity-submit-button activity-btn">Check Answer</button>}
          {overallFeedback && <button ref={nextQuestionButtonRef} onClick={handleNextQuestion} className="activity-next-button activity-btn">Next Question</button>}
          <button onClick={onShowPeriodicTable} className="activity-ptable-button activity-btn">Periodic Table</button>
          <button onClick={onBack} className="activity-back-button activity-btn">Back to Topics</button>
        </div>

        <div className="score-board">
          <span>Score: {score}</span>
        </div>
      </div>
    </div>
  );
}

LimitingReactantActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
}; 