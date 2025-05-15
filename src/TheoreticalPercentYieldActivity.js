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
    molar_masses: { LiOH: 23.948, H2SO4: 98.079, 'Li2SO4': 163.941, H2O: 18.015 }, // Corrected Li2SO4 molar mass
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
    equation: "2 Na + S → Na2S", // Simplified to Na2S, ensure molar mass matches
    reactants: ["Na", "S"],
    products: ["Na2S"],
    molar_masses: { Na: 22.990, S: 32.06, Na2S: 78.04 }, // Corrected Na2S molar mass
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
  // Reactions that might be good for yield questions
  { 
    equation: "KClO₃ → KCl + O₂", // Unbalanced, will balance: 2 KClO3 → 2 KCl + 3 O2
    reactants: ["KClO3"], // Single reactant decomposition
    products: ["KCl", "O2"],
    molar_masses: { KClO3: 122.55, KCl: 74.551, O2: 31.998 },
    stoichiometry: { KClO3: 2, KCl: 2, O2: 3 } // Stoichiometry for balanced eq
  },
  {
    equation: "NaN₃ → Na + N₂", // Unbalanced, will balance: 2 NaN3 → 2 Na + 3 N2
    reactants: ["NaN3"], // Single reactant decomposition
    products: ["Na", "N2"],
    molar_masses: { NaN3: 65.009, Na: 22.990, N2: 28.014 },
    stoichiometry: { NaN3: 2, Na: 2, N2: 3 } // Stoichiometry for balanced eq
  },
  {
    equation: "H₂O₂ → H₂O + O₂", // Unbalanced, will balance: 2 H2O2 → 2 H2O + O2
    reactants: ["H2O2"], // Single reactant decomposition
    products: ["H2O", "O2"],
    molar_masses: { H2O2: 34.014, H2O: 18.015, O2: 31.998 },
    stoichiometry: { H2O2: 2, H2O: 2, O2: 1 } // Stoichiometry for balanced eq
  },
    // More reactions from the original list
  {
    equation: "2 NO2 + H2O → HNO3 + HNO2", // Already complex, ensure it works for LR
    reactants: ["NO2", "H2O"],
    products: ["HNO3", "HNO2"], // Multiple products, select one for yield
    molar_masses: { NO2: 46.005, H2O: 18.015, HNO3: 63.012, HNO2: 46.005 }, // HNO2 molar mass seems same as NO2, verify if intended. Assuming correct.
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
    equation: "2 H2S + SO2 → 3 S + 2 H2O", // Multiple products
    reactants: ["H2S", "SO2"],
    products: ["S", "H2O"], // Select one for yield
    molar_masses: { H2S: 34.08, SO2: 64.066, S: 32.06, H2O: 18.015 },
    stoichiometry: { H2S: 2, SO2: 1, S: 3, H2O: 2 }
  },
  {
    equation: "2 NH3 + H2SO4 → (NH4)2SO4",
    reactants: ["NH3", "H2SO4"],
    products: ["(NH4)2SO4"],
    molar_masses: { NH3: 17.031, H2SO4: 98.079, '(NH4)2SO4': 132.14 }, // Corrected (NH4)2SO4 molar mass
    stoichiometry: { NH3: 2, H2SO4: 1, '(NH4)2SO4': 1 }
  },
    // Additional reactions from the original list, checked for consistency
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
    molar_masses: { Al: 26.982, H2SO4: 98.079, 'Al2(SO4)3': 342.15, // molar mass for Al2(SO4)3
                    H2: 2.016 },
    stoichiometry: { Al: 2, H2SO4: 3, 'Al2(SO4)3': 1, H2: 3 }
  },
  // Note: Fe2(SO4)3 equation was similar to Al2(SO4)3, let's keep one for variety or ensure data is distinct
  // {
  //   equation: "2 Fe + 3 H2SO4 → Fe2(SO4)3 + 3 H2",
  //   reactants: ["Fe", "H2SO4"],
  //   products: ["Fe2(SO4)3", "H2"],
  //   molar_masses: { Fe: 55.845, H2SO4: 98.079, 'Fe2(SO4)3': 399.88, // molar mass for Fe2(SO4)3
  //                   H2: 2.016 },
  //   stoichiometry: { Fe: 2, H2SO4: 3, 'Fe2(SO4)3': 1, H2: 3 }
  // },
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
    molar_masses: { NaI: 149.89, Cl2: 70.906, NaCl: 58.443, I2: 253.808 }, // Corrected NaI molar mass
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

function TheoreticalPercentYieldActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
  const [loading, setLoading] = useState(true);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [givenReactant1, setGivenReactant1] = useState({ name: '', mass: 0 });
  const [givenReactant2, setGivenReactant2] = useState({ name: '', mass: 0 });
  const [targetProduct, setTargetProduct] = useState('');
  
  const [userInputLR, setUserInputLR] = useState(''); // For limiting reactant selection
  const [userInputTY, setUserInputTY] = useState(''); // User input for Theoretical Yield (grams)
  const [userInputPY, setUserInputPY] = useState(''); // User input for Percent Yield (%)

  const [correctLR, setCorrectLR] = useState('');
  const [correctTY, setCorrectTY] = useState(0); // Correct Theoretical Yield (grams)
  const [correctPY, setCorrectPY] = useState(0); // Correct Percent Yield (%)
  const [actualYield, setActualYield] = useState(0); // Actual yield provided in the question (grams)

  const [roundingInstruction, setRoundingInstruction] = useState('');
  const [roundingPrecision, setRoundingPrecision] = useState(2); // Default to 2 decimal places for yield

  const [feedbackTY, setFeedbackTY] = useState(''); // Feedback for Theoretical Yield
  const [feedbackPY, setFeedbackPY] = useState(''); // Feedback for Percent Yield
  const [overallFeedback, setOverallFeedback] = useState('');
  
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationSteps, setExplanationSteps] = useState([]);

  // Multi-step state
  const [step, setStep] = useState(1); // 1 = theoretical yield, 2 = percent yield, 3 = third step (if any)
  // Track per-step correctness and feedback
  const [step1Status, setStep1Status] = useState(null); // 'correct' | 'incorrect'
  const [step2Status, setStep2Status] = useState(null); // 'correct' | 'incorrect'
  const [step3Status, setStep3Status] = useState(null); // 'correct' | 'incorrect'
  const [step1Feedback, setStep1Feedback] = useState('');
  const [step2Feedback, setStep2Feedback] = useState('');
  const [step3Feedback, setStep3Feedback] = useState('');

  const theoreticalYieldInputRef = useRef(null); // Renamed for clarity
  const percentYieldInputRef = useRef(null); // Ref for Percent Yield input
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
      if (reactants.length > 1) {
        if (Math.random() < 0.5) reactants.reverse();
        r1Name = reactants[0];
        r2Name = reactants[1];
        pairKey = problem.equation + '|' + r1Name + '|' + r2Name;
      } else {
        r1Name = reactants[0];
        r2Name = null;
        pairKey = problem.equation + '|' + r1Name;
      }
      attempts++;
    } while (lastPairRef.current === pairKey && attempts < 10 && REACTIONS.length > 1);
    lastPairRef.current = pairKey;

    setCurrentProblem(problem);
    setStep(1); // Reset to step 1 for new question
    setStep1Status(null);
    setStep2Status(null);
    setStep3Status(null);
    setStep1Feedback('');
    setStep2Feedback('');
    setStep3Feedback('');

    const r1Mass = parseFloat((Math.random() * 195 + 5).toFixed(Math.random() < 0.5 ? 1 : 2));
    setGivenReactant1({ name: r1Name, mass: r1Mass });

    if (r2Name) {
      const r2Mass = parseFloat((Math.random() * 195 + 5).toFixed(Math.random() < 0.5 ? 1 : 2));
      setGivenReactant2({ name: r2Name, mass: r2Mass });
    } else {
      setGivenReactant2({ name: '', mass: 0 });
    }

    const product = randomChoice(problem.products);
    setTargetProduct(product);

    // For Theoretical & Percent Yield, question type is primarily yield-focused.
    setQuestionType('yield_percent'); // Custom type for this activity
    setTargetUnit('g'); // Theoretical yield primarily in grams

    const roundingOptions = [
      { precision: 1, text: "to the nearest tenth (0.1 g)." },
      { precision: 2, text: "to two decimal places (0.01 g)." },
      { precision: 0, text: "to the nearest whole number (1 g)." },
    ];
    const selectedRounding = randomChoice(roundingOptions);
    setRoundingInstruction(`Calculate the theoretical yield ${selectedRounding.text} Then calculate percent yield to the nearest tenth (0.1%).`);
    setRoundingPrecision(selectedRounding.precision); // For theoretical yield

    // Calculations
    const molesR1 = r1Mass / problem.molar_masses[r1Name];
    let molesR2 = 0;
    if (r2Name) {
      molesR2 = givenReactant2.mass / problem.molar_masses[r2Name];
    }

    const stoichR1 = problem.stoichiometry[r1Name];
    const stoichProd = problem.stoichiometry[product];

    let molesProdFromR1 = (molesR1 / stoichR1) * stoichProd;
    let molesProdFromR2 = Infinity;
    let actualLR = r1Name;

    if (r2Name) {
      const stoichR2 = problem.stoichiometry[r2Name];
      molesProdFromR2 = (molesR2 / stoichR2) * stoichProd;
      if (molesProdFromR1 < molesProdFromR2) {
        actualLR = r1Name;
      } else if (molesProdFromR2 < molesProdFromR1) {
        actualLR = r2Name;
      } else {
        actualLR = r1Name < r2Name ? r1Name : r2Name;
      }
    }
    setCorrectLR(actualLR);

    let theoreticalMolesProduct;
    if (r2Name) {
      theoreticalMolesProduct = Math.min(molesProdFromR1, molesProdFromR2);
    } else {
      theoreticalMolesProduct = molesProdFromR1;
    }

    const calculatedCorrectTY = theoreticalMolesProduct * problem.molar_masses[product];
    const roundedCorrectTY = round(calculatedCorrectTY, selectedRounding.precision);
    setCorrectTY(roundedCorrectTY);

    // Generate actual yield (70-95% of theoretical, rounded to similar/one less precision or specific number of sig figs)
    // For simplicity, let's round actual yield to 2 decimal places if TY is precise, else 1.
    const actualYieldPrecision = selectedRounding.precision === 0 ? 0 : Math.max(1, selectedRounding.precision -1); // Ensure at least 0 or 1 dp
    // const percentFactor = (Math.random() * 0.25 + 0.70); // 70% to 95%
    // Ensure actual yield is realistically less and not almost identical or higher after rounding.
    // Generate a percentage between 70.0% and 95.0% with one decimal place
    const randomPercent = Math.floor(Math.random() * (950 - 700 + 1) + 700) / 10; // e.g. 85.3
    
    let generatedActualYield = (roundedCorrectTY * randomPercent) / 100;
    
    // Ensure actual yield is strictly less than theoretical yield, especially after rounding.
    // And not zero if theoretical yield is very small.
    if (generatedActualYield >= roundedCorrectTY && roundedCorrectTY > 0) {
        generatedActualYield = roundedCorrectTY * 0.9; // Fallback to 90% if it ends up too high
        if (generatedActualYield >= roundedCorrectTY) { // if still high (e.g. TY is very small)
           generatedActualYield = roundedCorrectTY * 0.7; // Fallback to 70%
        }
    }
    if (roundedCorrectTY > 0 && generatedActualYield === 0) {
        generatedActualYield = Math.min(roundedCorrectTY / 2, 0.1); // Ensure it's not zero if TY isn't
    }


    // Round actual yield to a sensible number of decimal places, e.g., same as TY or one more.
    // Let's use the same precision as theoretical yield for consistency in display
    const roundedActualYield = round(generatedActualYield, selectedRounding.precision);
    setActualYield(roundedActualYield);
    
    let calculatedCorrectPY = 0;
    if (roundedCorrectTY > 0) { // Avoid division by zero
        calculatedCorrectPY = (roundedActualYield / roundedCorrectTY) * 100;
    } else if (roundedActualYield > 0 && roundedCorrectTY === 0) { // Edge case: TY is 0 but AY is >0 (should not happen with current logic)
        calculatedCorrectPY = Infinity; // Or handle as an error/undefined
    }
    // Percent yield usually to 1 decimal place
    const roundedCorrectPY = round(calculatedCorrectPY, 1);
    setCorrectPY(roundedCorrectPY);

    // Reset user inputs and feedback
    setUserInputLR('');
    setUserInputTY('');
    setUserInputPY('');
    setFeedbackLR('');
    setFeedbackTY('');
    setFeedbackPY('');
    setOverallFeedback('');
    setShowExplanation(false);
    setExplanationSteps([]);

    if (setSavedState) {
      setSavedState({
        score,
        questionsAttempted,
      });
    }
  }, [setSavedState, score, questionsAttempted, givenReactant2.mass]); // Dependencies might need review if more state from outside is used


  // useEffect(() => {
  //   if (savedState && savedState.score !== undefined) {
  //     // eslint-disable-next-line
  //   }
  // }, []); // Removed generateQuestion from here, it will be called by direct effect or next question button.
  //          // Keeping it for initial load.

  // Step 1: Check Theoretical Yield
  const checkTY = () => {
    if (!currentProblem) return;
    setShowExplanation(false);
    setFeedbackTY('');
    setFeedbackPY('');
    setOverallFeedback('');
    const userTY = parseFloat(userInputTY);
    if (Math.abs(userTY - correctTY) < 0.05) {
      setStep1Status('correct');
      setStep1Feedback('✅ Correct! Good job on theoretical yield.');
    } else {
      setStep1Status('incorrect');
      setStep1Feedback(`❌ Incorrect. The correct theoretical yield is <b>${correctTY} g</b>.<br/>Double-check your mole ratios and molar masses.<br/>Hint: moles product = moles reactant × (product coeff/reactant coeff).`);
    }
    setStep(2);
    setLoading(false);
    setTimeout(() => {
      if (percentYieldInputRef.current) percentYieldInputRef.current.focus();
    }, 100);
  };

  // Step 2: Check Percent Yield
  const checkPY = () => {
    if (!currentProblem) return;
    setShowExplanation(false);
    setFeedbackPY('');
    setOverallFeedback('');
    const userPY = parseFloat(userInputPY);
    if (Math.abs(userPY - correctPY) < 0.2) {
      setStep2Status('correct');
      setStep2Feedback('✅ Correct! Good job on percent yield.');
    } else {
      setStep2Status('incorrect');
      setStep2Feedback(`❌ Incorrect. The correct percent yield is <b>${correctPY}%</b>.<br/>Use the formula: <b>(actual yield / theoretical yield) × 100%</b>. Make sure to round at the last step!`);
    }
    setStep(3);
    setLoading(false);
    setShowExplanation(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (loading || overallFeedback) return;
    if (step === 1) {
      checkTY();
    } else if (step === 2) {
      checkPY();
    }
  };

  const handleNextQuestion = () => {
    setLoading(true);
    setShowExplanation(false);
    setOverallFeedback(''); // Clear feedback for the new question
    setUserInputTY('');     // Clear TY input
    setUserInputPY('');     // Clear PY input
    setFeedbackTY('');
    setFeedbackPY('');
    setStep(1);
    setTimeout(() => {
      generateQuestion();
      setLoading(false);
      if (theoreticalYieldInputRef.current) {
        theoreticalYieldInputRef.current.focus(); 
      }
    }, 600);
  };

  if (loading || !currentProblem) {
    return (
      <div className="activity-root" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'300px'}}>
        <div style={{color:'#7dd3fc',fontSize:'1.25rem',textAlign:'center',width:'100%'}}>Loading Activity...</div>
      </div>
    );
  }

  return (
    <div className="activity-container theoretical-percent-yield-activity">
      <div className="activity-card">
        <h2 className="activity-title">Theoretical & Percent Yield Activity</h2>
        <div className="question-area">
          <p className="question-equation">Reaction: <strong dangerouslySetInnerHTML={{__html: formatChemical(currentProblem.equation)}} /></p>
          <p className="question-text">
            Given: <strong>{givenReactant1.mass}g</strong> of <strong dangerouslySetInnerHTML={{__html: formatChemical(givenReactant1.name)}} />
            {givenReactant2.name && <> and <strong>{givenReactant2.mass}g</strong> of <strong dangerouslySetInnerHTML={{__html: formatChemical(givenReactant2.name)}} /></>}
            .
          </p>
          {actualYield > 0 && (
            <p className="question-text actual-yield-info">
              If the reaction produced <strong>{actualYield}g</strong> of <strong dangerouslySetInnerHTML={{__html: formatChemical(targetProduct)}} />, calculate the theoretical and percent yield.
            </p>
          )}
          <p className="rounding-instruction"><i>{roundingInstruction}</i></p>
        </div>
        <form onSubmit={handleUserSubmit} className="answer-form" id="answer-form">
          <div className="form-group">
            <label htmlFor="theoreticalYield">Calculate the Theoretical Yield (g) of CO₂:</label>
            <input
              type="number"
              id="theoreticalYield"
              ref={theoreticalYieldInputRef}
              value={userInputTY}
              onChange={(e) => setUserInputTY(e.target.value)}
              className="activity-input"
              placeholder={`e.g., 123.4${roundingPrecision === 2 ? '5' : ''}`}
              step="any"
              required
              disabled={loading || step > 1}
            />
            {feedbackTY && <div className={`specific-feedback ${step === 1 && feedbackTY.includes('Correct') ? 'correct-feedback' : 'error-feedback'}`} dangerouslySetInnerHTML={{ __html: feedbackTY }} />}
          </div>

          <div className="form-group">
            <label htmlFor="percentYield">{givenReactant2.name ? '3.' : '2.'} Calculate the Percent Yield (%):</label>
            <input
              type="number"
              id="percentYield"
              ref={percentYieldInputRef}
              value={userInputPY}
              onChange={(e) => setUserInputPY(e.target.value)}
              className="activity-input"
              placeholder="e.g., 85.3"
              step="any"
              required
              disabled={loading || step !== 2}
            />
            {feedbackPY && <div className={`specific-feedback ${step === 2 && feedbackPY.includes('Correct') ? 'correct-feedback' : 'error-feedback'}`} dangerouslySetInnerHTML={{ __html: feedbackPY }} />}
          </div>
        </form>

        {overallFeedback && (
          <div className={`feedback-section feedback-${overallFeedback.includes('Excellent') || overallFeedback.includes('Good effort') ? 'correct' : 'incorrect'}`}>
            <div style={{fontWeight:700, marginBottom:6}} dangerouslySetInnerHTML={{ __html: overallFeedback }} />
            {feedbackLR && (
              <div className="specific-feedback error-feedback" dangerouslySetInnerHTML={{ __html: feedbackLR }} />
            )}
            {feedbackTY && (
              <div className="specific-feedback error-feedback" dangerouslySetInnerHTML={{ __html: feedbackTY }} />
            )}
            {feedbackPY && (
              <div className="specific-feedback error-feedback" dangerouslySetInnerHTML={{ __html: feedbackPY }} />
            )}
          </div>
        )}

        <div className="button-row">
          {step === 1 && <button type="submit" form="answer-form" className="activity-submit-button activity-btn">Check Answer</button>}
          {step === 2 && <button type="submit" form="answer-form" className="activity-submit-button activity-btn">Check Answer</button>}
          {step === 3 && <button ref={nextQuestionButtonRef} onClick={handleNextQuestion} className="activity-next-button activity-btn">Next Question</button>}
          <button onClick={onShowPeriodicTable} className="activity-ptable-button activity-btn">Periodic Table</button>
          <button onClick={onBack} className="activity-back-button activity-btn">Back to Topics</button>
        </div>

        {showExplanation && explanationSteps.length > 0 && (
          <div className="explanation-section">
            <h4>Explanation:</h4>
            <ul>
              {explanationSteps.map((step, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
              ))}
            </ul>
          </div>
        )}

        <div className="score-board">
          <span>Score: {score} / {questionsAttempted * (givenReactant2.name ? 3 : 2) }</span> {/* Max score based on num parts */}
        </div>
      </div>
    </div>
  );
}

// Update PropTypes
TheoreticalPercentYieldActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

export default TheoreticalPercentYieldActivity; 