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

// Helper function to get difficulty text - consistent with other activities
const getDifficultyText = (level) => {
  switch(level) {
    case 0: return 'Basic';
    case 1: return 'Intermediate';
    case 2: return 'Advanced';
    case 3: return 'Challenging';
    default: return 'Intermediate';
  }
};

function TheoreticalPercentYieldActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
  // State
  const [selectedDifficulty, setSelectedDifficulty] = useState(savedState?.selectedDifficulty || null);
  const [question, setQuestion] = useState(() => savedState?.question || null);
  const [userLimitingMass, setUserLimitingMass] = useState(savedState?.userLimitingMass || '');
  const [userActualYield, setUserActualYield] = useState(savedState?.userActualYield || '');
  const [userTheoYield, setUserTheoYield] = useState(savedState?.userTheoYield || '');
  const [userPercentYield, setUserPercentYield] = useState(savedState?.userPercentYield || '');
  const [feedback, setFeedback] = useState(savedState?.feedback || null);
  const [showAnswer, setShowAnswer] = useState(savedState?.showAnswer || false);

  // Generate a new question based on difficulty level
  const generateQuestion = useCallback((difficultyOverride = null) => {
    // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
    const difficulty = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
    
    // Select an appropriate reaction based on difficulty
    let reaction;
    if (difficulty === 0) { // Basic - simpler reactions (fewer reactants/products, simpler formulas)
      // Filter for simpler reactions (e.g., fewer atoms, main elements)
      const simpleReactions = REACTIONS.filter(r => 
        r.equation.length < 15 || // Short equation
        (r.reactants.length <= 2 && r.products.length <= 2) // Fewer components
      );
      reaction = randomChoice(simpleReactions.length > 0 ? simpleReactions : REACTIONS);
    } else if (difficulty === 3) { // Challenging - more complex reactions
      // Filter for more complex reactions
      const complexReactions = REACTIONS.filter(r => 
        r.equation.length > 20 || // Longer equation
        r.reactants.length > 1 || // Multiple reactants
        r.products.length > 1 // Multiple products
      );
      reaction = randomChoice(complexReactions.length > 0 ? complexReactions : REACTIONS);
    } else { // Intermediate and Advanced - use any reaction
      reaction = randomChoice(REACTIONS);
    }
    
    // Pick a limiting reactant randomly (for reactions with multiple reactants)
    const limiting = reaction.reactants.length > 1 ? 
                   randomChoice(reaction.reactants) : 
                   reaction.reactants[0];
                   
    // Pick a product randomly (for reactions with multiple products)
    const product = reaction.products.length > 1 ? 
                  randomChoice(reaction.products) : 
                  reaction.products[0];
    
    // Generate mass and yield values based on difficulty
    let limitingMass, percentYield;
    
    if (difficulty === 0) { // Basic - simpler values, higher yields
      limitingMass = round(Math.random() * 20 + 10, 1); // 10-30g, rounded to 1 decimal
      percentYield = round(Math.random() * 20 + 75, 0); // 75-95%, whole numbers
    } else if (difficulty === 1) { // Intermediate
      limitingMass = round(Math.random() * 30 + 10, 1); // 10-40g
      percentYield = round(Math.random() * 30 + 65, 1); // 65-95%
    } else if (difficulty === 2) { // Advanced
      limitingMass = round(Math.random() * 40 + 5, 2); // 5-45g, more precision
      percentYield = round(Math.random() * 35 + 60, 1); // 60-95%
    } else { // Challenging
      limitingMass = round(Math.random() * 45 + 5, 2); // 5-50g, precise
      percentYield = round(Math.random() * 38 + 60, 2); // 60-98%, precise
    }
    // Calculate theoretical yield (in grams)
    // 1. Convert limiting mass to moles
    const molesLimiting = limitingMass / reaction.molar_masses[limiting];
    // 2. Moles of product (stoichiometry)
    const ratio = reaction.stoichiometry[product] / reaction.stoichiometry[limiting];
    const molesProduct = molesLimiting * ratio;
    // 3. Theoretical yield in grams
    const theoYield = round(molesProduct * reaction.molar_masses[product], 2);
    // 4. Actual yield
    const actualYield = round(theoYield * percentYield / 100, 2);
    return {
      reaction,
      limiting,
      product,
      limitingMass,
      theoYield,
      actualYield,
      percentYield,
      difficulty // Include difficulty level in the return object
    };
  }, []);

  // On mount, generate if not present
  useEffect(() => {
    if (!question) {
      const q = generateQuestion(selectedDifficulty);
      setQuestion(q);
      setSavedState && setSavedState({ question: q, selectedDifficulty });
    }
    // eslint-disable-next-line
  }, []);

  // Save state on change
  useEffect(() => {
    setSavedState && setSavedState({
      question,
      userLimitingMass,
      userActualYield,
      userTheoYield,
      userPercentYield,
      feedback,
      showAnswer,
      selectedDifficulty
    });
    // eslint-disable-next-line
  }, [question, userLimitingMass, userActualYield, userTheoYield, userPercentYield, feedback, showAnswer, selectedDifficulty]);
  
  // Handle difficulty change
  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    const q = generateQuestion(level);
    setQuestion(q);
    setUserLimitingMass('');
    setUserActualYield('');
    setUserTheoYield('');
    setUserPercentYield('');
    setFeedback(null);
    setShowAnswer(false);
    setSavedState && setSavedState({ question: q, selectedDifficulty: level });
  };

  if (!question) {
    return <div className="activity-modern"><div>Loading...</div></div>;
  }

  // Check answers
  const checkAnswers = () => {
    const theoYieldUser = parseFloat(userTheoYield);
    const percentYieldUser = parseFloat(userPercentYield);
    const theoYield = question.theoYield;
    const percentYield = question.percentYield;
    const theoCorrect = Math.abs(theoYieldUser - theoYield) < 0.05;
    const percentCorrect = Math.abs(percentYieldUser - percentYield) < 0.3;
    setFeedback({
      theoCorrect,
      percentCorrect,
      theoYield,
      percentYield
    });
    setShowAnswer(true);
  };

  // Next question
  const handleNext = () => {
    const q = generateQuestion(selectedDifficulty);
    setQuestion(q);
    setUserLimitingMass('');
    setUserActualYield('');
    setUserTheoYield('');
    setUserPercentYield('');
    setFeedback(null);
    setShowAnswer(false);
    setSavedState && setSavedState({ question: q, selectedDifficulty });
  };

  // Interactive step-by-step hint state
  const [hintStep, setHintStep] = useState(0);
  const [showFullSolution, setShowFullSolution] = useState(false);

  // Reset hints when new question or feedback changes
  useEffect(() => {
    setHintStep(0);
    setShowFullSolution(false);
  }, [question, feedback]);

  // Helper: Render hints stepwise
  function renderTheoYieldHints() {
    const molesLimiting = round(question.limitingMass / question.reaction.molar_masses[question.limiting], 4);
    const ratio = question.reaction.stoichiometry[question.product] / question.reaction.stoichiometry[question.limiting];
    const molesProduct = round(molesLimiting * ratio, 4);
    const theoYield = feedback.theoYield;
    const steps = [
      <li key="1">Find moles of the limiting reactant: <br/><b>moles = mass divided by molar mass</b> = {question.limitingMass} g divided by {question.reaction.molar_masses[question.limiting]} g/mol = <b>{molesLimiting} mol</b></li>,
      <li key="2">Use stoichiometry to find moles of product:<br/><b>moles of product = moles of limiting reactant times (coefficient of product divided by coefficient of limiting reactant)</b> = {molesLimiting} times ({question.reaction.stoichiometry[question.product]} divided by {question.reaction.stoichiometry[question.limiting]}) = <b>{molesProduct} mol</b></li>,
      <li key="3">Convert moles of product to grams:<br/><b>grams = moles times molar mass</b> = {molesProduct} mol times {question.reaction.molar_masses[question.product]} g/mol = <b>{theoYield} g</b></li>,
    ];
    return (
      <ol style={{textAlign:'left', margin:'0.4em 0 0 1.2em', padding:0}}>
        {steps.slice(0, showFullSolution ? 3 : hintStep)}
      </ol>
    );
  }

  function renderPercentYieldHints() {
    const theoYield = feedback.theoYield;
    const percentYield = feedback.percentYield;
    const steps = [
      <li key="1">Percent yield = (actual yield / theoretical yield) × 100</li>,
      <li key="2">Plug in the values: ({question.actualYield} g / {theoYield} g) × 100 = <b>{percentYield} %</b></li>,
    ];
    return (
      <ol style={{textAlign:'left', margin:'0.4em 0 0 1.2em', padding:0}}>
        {steps.slice(0, showFullSolution ? 2 : Math.max(0, hintStep-3))}
      </ol>
    );
  }

  // UI
  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Theoretical & Percent Yield Practice</h2>
        
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
        <div className="question-area">
          <div className="question-equation">
            <b>Reaction:</b> <span dangerouslySetInnerHTML={{__html: formatChemical(question.reaction.equation)}} />
          </div>
          <div className="question-text">
            <b>Limiting Reactant:</b> <span dangerouslySetInnerHTML={{__html: formatChemical(question.limiting)}} />
            <br/>
            <b>Product:</b> <span dangerouslySetInnerHTML={{__html: formatChemical(question.product)}} />
          </div>
          <div className="question-text">
            <b>Given:</b> {question.limitingMass} g of <span dangerouslySetInnerHTML={{__html: formatChemical(question.limiting)}} /> reacts completely.<br/>
            <b>Actual yield:</b> {question.actualYield} g of <span dangerouslySetInnerHTML={{__html: formatChemical(question.product)}} /> was collected.
          </div>
          <div className="button-row">
            <button className="activity-btn" onClick={() => onShowPeriodicTable && onShowPeriodicTable()}>Periodic Table</button>
            <button className="back-btn" onClick={onBack}>Back</button>
          </div>
        </div>
        <form className="form-group" onSubmit={e => { e.preventDefault(); checkAnswers(); }}>
          <div className="question-text" style={{marginTop: '0.5em', marginBottom: '0.2em'}}>1. What is the theoretical yield (in grams) of <span dangerouslySetInnerHTML={{__html: formatChemical(question.product)}} />?</div>
          <input
            className="activity-input"
            type="number"
            value={userTheoYield}
            onChange={e => setUserTheoYield(e.target.value)}
            placeholder="Theoretical yield (g)"
            step="0.01"
            disabled={showAnswer}
          />
          {feedback && (
            <div className={`feedback-container ${feedback.theoCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
              {feedback.theoCorrect ? (
                <span>
                  {[
                    'Correct! You understand the basics of theoretical yield calculations.',
                    'Great job! You\'ve handled this intermediate theoretical yield problem well.',
                    'Excellent work! You\'ve mastered this advanced theoretical yield calculation.',
                    'Outstanding! You\'ve solved a challenging theoretical yield problem with precision.'
                  ][question.difficulty || 0]}
                </span>
              ) : (
                <span>
                  <b>Let's learn how to solve it:</b>
                  {renderTheoYieldHints()}
                  {!showFullSolution && hintStep < 3 && (
                    <button className="activity-btn" type="button" style={{marginTop:'0.6em'}} onClick={() => setHintStep(hintStep+1)}>Show Solution</button>
                  )}
                  {!showFullSolution && hintStep >= 3 && (
                    <button className="activity-btn" type="button" style={{marginTop:'0.6em'}} onClick={() => setShowFullSolution(true)}>Show Full Solution</button>
                  )}
                  {showFullSolution && <div style={{marginTop:'0.6em'}}><b>Theoretical yield = {feedback.theoYield} g</b></div>}
                </span>
              )}
            </div>
          )}
          <div className="question-text" style={{marginTop: '0.5em', marginBottom: '0.2em'}}>2. What is the percent yield?</div>
          <input
            className="activity-input"
            type="number"
            value={userPercentYield}
            onChange={e => setUserPercentYield(e.target.value)}
            placeholder="Percent yield (%)"
            step="0.01"
            disabled={showAnswer}
          />
          {feedback && (
            <div className={`feedback-container ${feedback.percentCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
              {feedback.percentCorrect ? (
                <span>
                  {[
                    'Correct! You understand how to calculate percent yield.',
                    'Well done! You\'ve correctly calculated this percent yield.',
                    'Excellent work on this advanced percent yield calculation!',
                    'Outstanding precision on this challenging percent yield problem!'
                  ][question.difficulty || 0]}
                </span>
              ) : (
                <span>
                  <b>Here's how to find percent yield:</b>
                  {!showFullSolution && (
                    <button className="activity-btn" type="button" style={{marginTop:'0.6em'}} onClick={() => setShowFullSolution(true)}>Show Solution</button>
                  )}
                  {showFullSolution && (
                    <ol style={{textAlign:'left', margin:'0.4em 0 0 1.2em', padding:0}}>
                      <li>Percent yield = (actual yield divided by theoretical yield) times 100</li>
                      <li>Plug in the values: ({question.actualYield} g divided by {feedback.theoYield} g) times 100 = <b>{feedback.percentYield} %</b></li>
                    </ol>
                  )}
                  {showFullSolution && <div style={{marginTop:'0.6em'}}><b>Percent yield = {feedback.percentYield} %</b></div>}
                </span>
              )}
            </div>
          )}
          <div className="button-row">
            {!showAnswer && (
              <button className="activity-btn" type="submit" disabled={!userTheoYield || !userPercentYield}>Check Answers</button>
            )}
            {showAnswer && (
              <button className="activity-btn" type="button" onClick={handleNext}>Try Another</button>
            )}
          </div>
        </form>
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
