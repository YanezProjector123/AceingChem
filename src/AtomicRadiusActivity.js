import React, { useState, useEffect, useRef } from 'react';

// Data (Assuming 'elements' array from your code is available here)
// Expanded periodic table data for more question variety
const elements = [
  // ... (Keep the full elements array from your code) ...
  // Period 1
  { number: 1, symbol: 'H', name: 'Hydrogen', period: 1, group: 1, atomicRadius: 53, category: 'diatomic nonmetal' },
  { number: 2, symbol: 'He', name: 'Helium', period: 1, group: 18, atomicRadius: 31, category: 'noble gas' },
  // Period 2
  { number: 3, symbol: 'Li', name: 'Lithium', period: 2, group: 1, atomicRadius: 167, category: 'alkali metal' },
  { number: 4, symbol: 'Be', name: 'Beryllium', period: 2, group: 2, atomicRadius: 112, category: 'alkaline earth metal' },
  { number: 5, symbol: 'B', name: 'Boron', period: 2, group: 13, atomicRadius: 87, category: 'metalloid' },
  { number: 6, symbol: 'C', name: 'Carbon', period: 2, group: 14, atomicRadius: 67, category: 'polyatomic nonmetal' },
  { number: 7, symbol: 'N', name: 'Nitrogen', period: 2, group: 15, atomicRadius: 56, category: 'diatomic nonmetal' },
  { number: 8, symbol: 'O', name: 'Oxygen', period: 2, group: 16, atomicRadius: 48, category: 'diatomic nonmetal' },
  { number: 9, symbol: 'F', name: 'Fluorine', period: 2, group: 17, atomicRadius: 42, category: 'diatomic nonmetal' },
  { number: 10, symbol: 'Ne', name: 'Neon', period: 2, group: 18, atomicRadius: 38, category: 'noble gas' },
  // Period 3
  { number: 11, symbol: 'Na', name: 'Sodium', period: 3, group: 1, atomicRadius: 190, category: 'alkali metal' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', period: 3, group: 2, atomicRadius: 145, category: 'alkaline earth metal' },
  { number: 13, symbol: 'Al', name: 'Aluminum', period: 3, group: 13, atomicRadius: 118, category: 'post-transition metal' },
  { number: 14, symbol: 'Si', name: 'Silicon', period: 3, group: 14, atomicRadius: 111, category: 'metalloid' },
  { number: 15, symbol: 'P', name: 'Phosphorus', period: 3, group: 15, atomicRadius: 98, category: 'polyatomic nonmetal' },
  { number: 16, symbol: 'S', name: 'Sulfur', period: 3, group: 16, atomicRadius: 88, category: 'polyatomic nonmetal' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', period: 3, group: 17, atomicRadius: 79, category: 'diatomic nonmetal' },
  { number: 18, symbol: 'Ar', name: 'Argon', period: 3, group: 18, atomicRadius: 71, category: 'noble gas' },
  // Period 4
  { number: 19, symbol: 'K', name: 'Potassium', period: 4, group: 1, atomicRadius: 243, category: 'alkali metal' },
  { number: 20, symbol: 'Ca', name: 'Calcium', period: 4, group: 2, atomicRadius: 194, category: 'alkaline earth metal' },
  { number: 21, symbol: 'Sc', name: 'Scandium', period: 4, group: 3, atomicRadius: 184, category: 'transition metal' },
  { number: 22, symbol: 'Ti', name: 'Titanium', period: 4, group: 4, atomicRadius: 176, category: 'transition metal' },
  { number: 23, symbol: 'V', name: 'Vanadium', period: 4, group: 5, atomicRadius: 171, category: 'transition metal' },
  { number: 24, symbol: 'Cr', name: 'Chromium', period: 4, group: 6, atomicRadius: 166, category: 'transition metal' },
  { number: 25, symbol: 'Mn', name: 'Manganese', period: 4, group: 7, atomicRadius: 161, category: 'transition metal' },
  { number: 26, symbol: 'Fe', name: 'Iron', period: 4, group: 8, atomicRadius: 156, category: 'transition metal' },
  { number: 27, symbol: 'Co', name: 'Cobalt', period: 4, group: 9, atomicRadius: 152, category: 'transition metal' },
  { number: 28, symbol: 'Ni', name: 'Nickel', period: 4, group: 10, atomicRadius: 149, category: 'transition metal' },
  { number: 29, symbol: 'Cu', name: 'Copper', period: 4, group: 11, atomicRadius: 145, category: 'transition metal' },
  { number: 30, symbol: 'Zn', name: 'Zinc', period: 4, group: 12, atomicRadius: 142, category: 'transition metal' },
  { number: 31, symbol: 'Ga', name: 'Gallium', period: 4, group: 13, atomicRadius: 136, category: 'post-transition metal' },
  { number: 32, symbol: 'Ge', name: 'Germanium', period: 4, group: 14, atomicRadius: 125, category: 'metalloid' },
  { number: 33, symbol: 'As', name: 'Arsenic', period: 4, group: 15, atomicRadius: 114, category: 'metalloid' },
  { number: 34, symbol: 'Se', name: 'Selenium', period: 4, group: 16, atomicRadius: 103, category: 'polyatomic nonmetal' },
  { number: 35, symbol: 'Br', name: 'Bromine', period: 4, group: 17, atomicRadius: 94, category: 'diatomic nonmetal' },
  { number: 36, symbol: 'Kr', name: 'Krypton', period: 4, group: 18, atomicRadius: 88, category: 'noble gas' },
  // Period 5
  { number: 37, symbol: 'Rb', name: 'Rubidium', period: 5, group: 1, atomicRadius: 265, category: 'alkali metal' },
  { number: 38, symbol: 'Sr', name: 'Strontium', period: 5, group: 2, atomicRadius: 219, category: 'alkaline earth metal' },
  { number: 39, symbol: 'Y', name: 'Yttrium', period: 5, group: 3, atomicRadius: 212, category: 'transition metal' },
  { number: 40, symbol: 'Zr', name: 'Zirconium', period: 5, group: 4, atomicRadius: 206, category: 'transition metal' },
  { number: 41, symbol: 'Nb', name: 'Niobium', period: 5, group: 5, atomicRadius: 198, category: 'transition metal' },
  { number: 42, symbol: 'Mo', name: 'Molybdenum', period: 5, group: 6, atomicRadius: 190, category: 'transition metal' },
  { number: 43, symbol: 'Tc', name: 'Technetium', period: 5, group: 7, atomicRadius: 183, category: 'transition metal' },
  { number: 44, symbol: 'Ru', name: 'Ruthenium', period: 5, group: 8, atomicRadius: 178, category: 'transition metal' },
  { number: 45, symbol: 'Rh', name: 'Rhodium', period: 5, group: 9, atomicRadius: 173, category: 'transition metal' },
  { number: 46, symbol: 'Pd', name: 'Palladium', period: 5, group: 10, atomicRadius: 169, category: 'transition metal' },
  { number: 47, symbol: 'Ag', name: 'Silver', period: 5, group: 11, atomicRadius: 165, category: 'transition metal' },
  { number: 48, symbol: 'Cd', name: 'Cadmium', period: 5, group: 12, atomicRadius: 161, category: 'transition metal' },
  { number: 49, symbol: 'In', name: 'Indium', period: 5, group: 13, atomicRadius: 156, category: 'post-transition metal' },
  { number: 50, symbol: 'Sn', name: 'Tin', period: 5, group: 14, atomicRadius: 145, category: 'post-transition metal' },
  { number: 51, symbol: 'Sb', name: 'Antimony', period: 5, group: 15, atomicRadius: 133, category: 'metalloid' },
  { number: 52, symbol: 'Te', name: 'Tellurium', period: 5, group: 16, atomicRadius: 123, category: 'metalloid' },
  { number: 53, symbol: 'I', name: 'Iodine', period: 5, group: 17, atomicRadius: 115, category: 'diatomic nonmetal' },
  { number: 54, symbol: 'Xe', name: 'Xenon', period: 5, group: 18, atomicRadius: 108, category: 'noble gas' },
  // Period 6
  { number: 55, symbol: 'Cs', name: 'Cesium', period: 6, group: 1, atomicRadius: 298, category: 'alkali metal' },
  { number: 56, symbol: 'Ba', name: 'Barium', period: 6, group: 2, atomicRadius: 253, category: 'alkaline earth metal' },
  { number: 57, symbol: 'La', name: 'Lanthanum', period: 6, group: 3, atomicRadius: 195, category: 'lanthanide' },
  { number: 72, symbol: 'Hf', name: 'Hafnium', period: 6, group: 4, atomicRadius: 208, category: 'transition metal' },
  { number: 73, symbol: 'Ta', name: 'Tantalum', period: 6, group: 5, atomicRadius: 200, category: 'transition metal' },
  { number: 74, symbol: 'W', name: 'Tungsten', period: 6, group: 6, atomicRadius: 193, category: 'transition metal' },
  { number: 75, symbol: 'Re', name: 'Rhenium', period: 6, group: 7, atomicRadius: 188, category: 'transition metal' },
  { number: 76, symbol: 'Os', name: 'Osmium', period: 6, group: 8, atomicRadius: 185, category: 'transition metal' },
  { number: 77, symbol: 'Ir', name: 'Iridium', period: 6, group: 9, atomicRadius: 180, category: 'transition metal' },
  { number: 78, symbol: 'Pt', name: 'Platinum', period: 6, group: 10, atomicRadius: 177, category: 'transition metal' },
  { number: 79, symbol: 'Au', name: 'Gold', period: 6, group: 11, atomicRadius: 174, category: 'transition metal' },
  { number: 80, symbol: 'Hg', name: 'Mercury', period: 6, group: 12, atomicRadius: 171, category: 'transition metal' },
  { number: 81, symbol: 'Tl', name: 'Thallium', period: 6, group: 13, atomicRadius: 156, category: 'post-transition metal' },
  { number: 82, symbol: 'Pb', name: 'Lead', period: 6, group: 14, atomicRadius: 154, category: 'post-transition metal' },
  { number: 83, symbol: 'Bi', name: 'Bismuth', period: 6, group: 15, atomicRadius: 143, category: 'post-transition metal' },
  { number: 84, symbol: 'Po', name: 'Polonium', period: 6, group: 16, atomicRadius: 135, category: 'post-transition metal' },
  { number: 85, symbol: 'At', name: 'Astatine', period: 6, group: 17, atomicRadius: 127, category: 'metalloid' },
  { number: 86, symbol: 'Rn', name: 'Radon', period: 6, group: 18, atomicRadius: 120, category: 'noble gas' },
  // Period 7 - Radius data gets less certain
  { number: 87, symbol: 'Fr', name: 'Francium', period: 7, group: 1, atomicRadius: 348, category: 'alkali metal' },
  { number: 88, symbol: 'Ra', name: 'Radium', period: 7, group: 2, atomicRadius: 283, category: 'alkaline earth metal' },
  { number: 89, symbol: 'Ac', name: 'Actinium', period: 7, group: 3, atomicRadius: 195, category: 'actinide' },
  { number: 104, symbol: 'Rf', name: 'Rutherfordium', period: 7, group: 4, atomicRadius: 157, category: 'transition metal' }, // Radii are mostly calculated estimates beyond here
  { number: 105, symbol: 'Db', name: 'Dubnium', period: 7, group: 5, atomicRadius: 149, category: 'transition metal' },
  { number: 106, symbol: 'Sg', name: 'Seaborgium', period: 7, group: 6, atomicRadius: 143, category: 'transition metal' },
  { number: 107, symbol: 'Bh', name: 'Bohrium', period: 7, group: 7, atomicRadius: 141, category: 'transition metal' },
  { number: 108, symbol: 'Hs', name: 'Hassium', period: 7, group: 8, atomicRadius: 134, category: 'transition metal' },
  { number: 109, symbol: 'Mt', name: 'Meitnerium', period: 7, group: 9, atomicRadius: 129, category: 'transition metal' },
  { number: 110, symbol: 'Ds', name: 'Darmstadtium', period: 7, group: 10, atomicRadius: 128, category: 'transition metal' },
  { number: 111, symbol: 'Rg', name: 'Roentgenium', period: 7, group: 11, atomicRadius: 121, category: 'transition metal' },
  { number: 112, symbol: 'Cn', name: 'Copernicium', period: 7, group: 12, atomicRadius: 122, category: 'transition metal' },
  // Select lanthanides and actinides - filter these out mostly for basic trend questions
  // Assigning 'group: 3' is convention, but not useful for group trends here.
  { number: 58, symbol: 'Ce', name: 'Cerium', period: 6, group: 3, atomicRadius: 185, category: 'lanthanide' },
  // ... include other Lanthanides/Actinides if desired, marking category clearly
  { number: 71, symbol: 'Lu', name: 'Lutetium', period: 6, group: 3, atomicRadius: 217, category: 'lanthanide' },
  { number: 90, symbol: 'Th', name: 'Thorium', period: 7, group: 3, atomicRadius: 179, category: 'actinide' },
  { number: 103, symbol: 'Lr', name: 'Lawrencium', period: 7, group: 3, atomicRadius: 150, category: 'actinide' }, // Note group 3 is conventional placeholder
].map(el => ({ ...el, atomicRadius: el.atomicRadius || null })).filter(el => el.atomicRadius); // Ensure atomicRadius is present, set to null if not

// --- Utilities ---
const randInt = (n) => Math.floor(Math.random() * n);
const shuffle = (array) => {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Helper: get unique random elements, avoiding f-block unless specified
const pickUnique = (n, filterFn = null, allowFBlock = false) => {
    let pool = elements.filter(e => allowFBlock || (!e.category?.includes('lanthanide') && !e.category?.includes('actinide')));
    if (filterFn) {
        pool = pool.filter(filterFn);
    }
    // Ensure pool is large enough
     if (pool.length < n) {
       console.warn(`pickUnique could not find ${n} elements matching criteria. Returning ${pool.length}. AllowFBlock=${allowFBlock}`);
        return shuffle(pool); // Return what we have
    }
    return shuffle(pool).slice(0, n);
};

// Helper filters
const mainGroups = [1, 2, 13, 14, 15, 16, 17, 18];
const isMainGroup = (el) => mainGroups.includes(el.group);

// --- Question Generators ---

// 1. Compare Radii (Larger/Smaller)
const generateCompareQuestion = () => {
    const compareType = Math.random() < 0.5 ? 'larger' : 'smaller';
    // Pick 2, preferably main group or within same block type for clearer trends
    let a, b;
    let attempts = 0;
    do {
        [a, b] = pickUnique(2);
        attempts++;
         // Try again if we picked one f-block and one non-f block or same element, or elements are missing
         if(!a || !b || a.symbol === b.symbol ||
           ( (a.category?.includes('lanthanide') || a.category?.includes('actinide')) !==
             (b.category?.includes('lanthanide') || b.category?.includes('actinide')) && attempts < 10)
         ) {
            a = null; b=null; // Reset to force retry
         }
    } while ((!a || !b) && attempts < 20);

    if (!a || !b) return null; // Generator fails

    const correctIdx = (compareType === 'larger')
        ? (a.atomicRadius > b.atomicRadius ? 0 : 1)
        : (a.atomicRadius < b.atomicRadius ? 0 : 1);
    const winner = correctIdx === 0 ? a : b;
    const loser = correctIdx === 0 ? b : a;

    let explanation = '';
    if (a.period === b.period && isMainGroup(a) && isMainGroup(b)) {
      explanation = `They are in the same period. Radius generally decreases left-to-right due to increasing effective nuclear charge (Zeff). ${winner.symbol} is further ${winner.group < loser.group ? 'left' : 'right'}.`;
    } else if (a.group === b.group && a.group !== 3 && isMainGroup(a) && isMainGroup(b)) { // Avoid G3 complex comparisons
       explanation = `They are in the same main group. Radius generally increases down a group due to adding electron shells. ${winner.symbol} is in period ${winner.period}.`;
    } else { // Diagonal or complex case
       explanation = `Compare their positions. Down a group increases size (more shells). Across a period decreases size (higher Zeff). ${winner.symbol} (P${winner.period}, G${winner.group}, ${winner.atomicRadius} pm) vs ${loser.symbol} (P${loser.period}, G${loser.group}, ${loser.atomicRadius} pm).`;
    }

    return {
        type: 'compare',
        prompt: `Which element has the ${compareType} atomic radius?`,
        elements: [a, b], // Keep the original order for display/buttons
        correctIdx: correctIdx, // Index in the elements array
        explanation: explanation,
        // For history uniqueness, create a string representation
        uid: `compare:${compareType}:${[a.symbol,b.symbol].sort().join(':')}`
    };
};

// 2. Rank Radii (Increasing/Decreasing)
const generateRankQuestion = () => {
    const rankType = Math.random() < 0.5 ? 'increasing' : 'decreasing';
    // Pick 3 elements, try to keep them related (e.g., same period, same group, or simple diagonal)
    let els = [];
    let attempts = 0;
    let strategy = 'random'; // To potentially try different selection methods
    do {
      attempts++;
       els = []; // Reset
       const choice = randInt(3);
       if (choice === 0 && attempts < 5) { // Try same period
           const period = randInt(6) + 2; // Period 2-7
           els = pickUnique(3, e => e.period === period && isMainGroup(e));
           strategy = 'period';
       } else if (choice === 1 && attempts < 10) { // Try same group
           const group = mainGroups[randInt(mainGroups.length)];
           els = pickUnique(3, e => e.group === group);
           strategy = 'group';
       } else { // Default to random main group elements if others fail or by chance
            els = pickUnique(3, e => isMainGroup(e));
           strategy = 'random_main';
       }
       // Validate: Need exactly 3 elements for ranking
    } while(els.length !== 3 && attempts < 15)

    if (els.length !== 3) return null; // Generator fails

    const sorted = els.slice().sort((a, b) =>
        rankType === 'increasing' ? a.atomicRadius - b.atomicRadius : b.atomicRadius - a.atomicRadius
    );
    const correctOrderSymbols = sorted.map(e => e.symbol);

     // Provide clear hint based on selection strategy
     let explanationHint = '';
     if(strategy === 'period') explanationHint = `All elements are in Period ${els[0].period}. Remember radius decreases across a period.`;
     else if (strategy === 'group') explanationHint = `All elements are in Group ${els[0].group}. Remember radius increases down a group.`;
     else explanationHint = `Compare positions carefully: larger radius down/left, smaller radius up/right.`;

    return {
        type: 'rank',
        prompt: `Arrange these elements in order of ${rankType} atomic radius:`,
        // Store elements unsorted initially for the button display
        displayElements: shuffle(els.slice()), // Keep original els for correct sorting map later
        correctOrder: correctOrderSymbols,
        explanation: `Correct order: ${correctOrderSymbols.join(' < ')}. ${explanationHint}`,
        uid: `rank:${rankType}:${els.map(e=>e.symbol).sort().join(':')}`
    };
};

// 3. True/False Comparison
const generateTrueFalseQuestion = () => {
     let a, b;
     let attempts = 0;
     do {
         [a, b] = pickUnique(2); // Pick 2 different elements
         attempts++;
     } while((!a || !b || a.symbol === b.symbol) && attempts < 10)

     if (!a || !b) return null;

     const actualAnswer = a.atomicRadius > b.atomicRadius; // Is a > b true?
     // Randomly decide if the statement says A>B or B>A
     const statementIsTrueIf = Math.random() < 0.5; // 50% chance statement matches reality
     let prompt;
     if (statementIsTrueIf) { // Statement should reflect reality (a>b)
          prompt = `True or False: ${a.symbol} (${a.name}) has a larger atomic radius than ${b.symbol} (${b.name})?`;
     } else { // Statement should be the opposite of reality (make it say b>a)
          prompt = `True or False: ${b.symbol} (${b.name}) has a larger atomic radius than ${a.symbol} (${a.name})?`;
     }
     const correctAnswer = statementIsTrueIf; // If statement matches reality, the answer is true

      let explanation = `Comparing ${a.symbol} (${a.atomicRadius} pm) and ${b.symbol} (${b.atomicRadius} pm), the statement is ${correctAnswer}. `;
      // Add trend reasoning if simple case
       if (a.period === b.period && isMainGroup(a) && isMainGroup(b)) {
           explanation += `Radius decreases across Period ${a.period}.`;
       } else if (a.group === b.group && isMainGroup(a) && isMainGroup(b)) {
           explanation += `Radius increases down Group ${a.group}.`;
       }


     return {
         type: 'true_false',
         prompt: prompt,
         answer: correctAnswer, // The boolean value 'true' or 'false' for the statement
         explanation: explanation,
         // Unique ID for history, use sorted symbols
         uid: `tf:${[a.symbol, b.symbol].sort().join(':')}:${statementIsTrueIf}`
     };
};

// 4. General Trend Questions (NEW)
const generateGeneralTrendQuestion = () => {
    const trendType = Math.random() < 0.5 ? 'period' : 'group';

    if (trendType === 'period') {
         const options = ['Increases', 'Decreases', 'Stays roughly constant', 'Increases then decreases'];
         return {
             type: 'general_trend',
             prompt: 'How does atomic radius generally change moving from left to right across a period (main group elements)?',
             options: shuffle(options),
             correct: 'Decreases',
             explanation: 'Decreases. Increasing effective nuclear charge (Zeff) pulls the electron shells closer to the nucleus within the same period.',
             uid: `gentrend:period`
         }
    } else { // Group trend
          const options = ['Increases', 'Decreases', 'Stays roughly constant', 'Decreases then increases'];
          return {
              type: 'general_trend',
              prompt: 'How does atomic radius generally change moving down a group?',
              options: shuffle(options),
              correct: 'Increases',
              explanation: 'Increases. Each step down adds a new electron shell, placing valence electrons further from the nucleus and increasing shielding.',
              uid: `gentrend:group`
          }
    }
};

// 5. Reason for Trend Questions (NEW)
const generateReasonQuestion = () => {
    const reasonType = Math.random();
    if (reasonType < 0.33) { // Reason for decrease across period
         // Pick two distinct main group elements in the same period
         let a, b;
         let attempts = 0;
         do {
             const period = randInt(5) + 2; // Periods 2-6 main groups
             [a,b] = pickUnique(2, e => e.period === period && isMainGroup(e));
             attempts++;
         } while ((!a || !b || a.group === b.group) && attempts < 10); // Ensure different groups

         if(!a || !b) return null;

         const smaller = a.group < b.group ? b : a; // Element further right
         const larger = smaller === a ? b : a;

        const options = [
            "Increasing number of electron shells",
            "Increasing effective nuclear charge (Zeff)",
            "Decreasing electron-electron repulsion",
            "Decreasing number of protons"
        ];
         return {
             type: 'reason_trend',
             prompt: `Why is the atomic radius of ${smaller.symbol} generally smaller than that of ${larger.symbol}? (Both in Period ${smaller.period})`,
             options: shuffle(options),
             correct: "Increasing effective nuclear charge (Zeff)",
             explanation: `Moving across a period, protons are added (increasing Zeff), pulling electron shells tighter, thus decreasing the radius.`,
             uid: `reason:period:${[a.symbol,b.symbol].sort().join(':')}`
         }
    } else if (reasonType < 0.66) { // Reason for increase down group
         // Pick two distinct main group elements in the same group
          let a, b;
          let attempts = 0;
          do {
              const group = mainGroups[randInt(mainGroups.length)];
              [a,b] = pickUnique(2, e => e.group === group);
              attempts++;
          } while ((!a || !b || a.period === b.period) && attempts < 10); // Ensure different periods

          if(!a || !b) return null;

         const lower = a.period > b.period ? a : b; // Element further down
         const higher = lower === a ? b : a;

          const options = [
             "Addition of new electron shells",
             "Decreasing effective nuclear charge (Zeff)",
             "Increasing electron-electron repulsion in the core",
             "Valence electrons entering p-orbitals"
         ];
         return {
             type: 'reason_trend',
             prompt: `Why is the atomic radius of ${lower.symbol} generally larger than that of ${higher.symbol}? (Both in Group ${lower.group})`,
             options: shuffle(options),
             correct: "Addition of new electron shells",
             explanation: `Moving down a group, new electron shells are added, placing the valence electrons significantly further from the nucleus, which increases the radius.`,
              uid: `reason:group:${[a.symbol,b.symbol].sort().join(':')}`
         }

    } else { // Identify the *primary* factor for a given comparison
         let a, b;
         let attempts = 0;
         do { // Find two elements where one factor clearly dominates
            [a, b] = pickUnique(2, e => isMainGroup(e)); // Pick main group elements
             attempts++;
              // Avoid same period AND same group for this question type if possible
         } while ((!a || !b || (a.period === b.period && a.group === b.group)) && attempts < 10);

         if(!a || !b) return null;

         const larger = a.atomicRadius > b.atomicRadius ? a : b;
         const smaller = larger === a ? b : a;
         let primaryFactor = '';
         let otherFactor = '';

         if (larger.period > smaller.period && larger.group === smaller.group) { // Clearly down a group
            primaryFactor = 'Higher principal quantum number (n) / More electron shells';
            otherFactor = 'Lower effective nuclear charge (Zeff)';
         } else if (larger.period === smaller.period && larger.group < smaller.group) { // Clearly across a period (left is larger)
             primaryFactor = 'Lower effective nuclear charge (Zeff)';
             otherFactor = 'Same principal quantum number (n)';
         } else { // Diagonal or less clear - make generic statement or skip? Skip for now.
              return null; // Retry generator for clearer case
         }

          const options = [
             primaryFactor,
             otherFactor,
             "Electron-electron repulsion differences",
             "Number of neutrons in the nucleus"
         ];
         return {
              type: 'reason_factor',
             prompt: `Comparing ${larger.symbol} and ${smaller.symbol}, what is the PRIMARY factor making ${larger.symbol}'s radius larger?`,
              options: shuffle(options),
              correct: primaryFactor,
              explanation: `${primaryFactor} is the dominant reason. ${larger.period > smaller.period ? 'Adding shells drastically increases size.' : 'Lower Zeff allows the electron cloud to expand further within the same shell.'}`,
              uid: `reason:factor:${[a.symbol,b.symbol].sort().join(':')}`
         }
    }
};

// --- Generator Array ---
const questionGenerators = [
    generateCompareQuestion,      // Larger/Smaller comparison
    generateRankQuestion,         // Rank 3 elements
    generateTrueFalseQuestion,    // True/False A > B?
    generateGeneralTrendQuestion, // How does radius change across period/down group?
    generateReasonQuestion,       // Why does radius change? What's the primary factor?
    // Add back other types from original script if desired, converting them to this generator format
    // e.g., generateClosestValueQuestion, generatePeriodExtremeQuestion, etc.
];

// --- React Component ---

export default function AtomicRadiusActivityEnhanced({ onBack, onPeriodicTable }) {
    const RECENT_HISTORY_LIMIT = 15; // Adjust as needed

    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [recentQuestionUIDs, setRecentQuestionUIDs] = useState([]);
    const [question, setQuestion] = useState(null); // Initialize null
    const [feedback, setFeedback] = useState(null); // { type, message, correctIdx?, correctVal? }
    const [showNext, setShowNext] = useState(false);
    const [userAnswer, setUserAnswer] = useState(null); // For radio/select answers
    const [arrangeOrder, setArrangeOrder] = useState([]); // Indices of displayElements in user order
    const [isLoading, setIsLoading] = useState(true);


    // --- Function to Select Next Question ---
    const selectNextQuestion = (currentQuestionUid = null) => {
        let nextQ = null;
        let attempts = 0;
        const maxAttempts = questionGenerators.length * 3; // Try each generator a few times

        while (!nextQ && attempts < maxAttempts) {
            attempts++;
            const generator = questionGenerators[randInt(questionGenerators.length)];
            try {
                const candidateQ = generator();
                 // Check if generation failed, or if UID is invalid/recent
                if (candidateQ && candidateQ.uid && candidateQ.uid !== currentQuestionUid && !recentQuestionUIDs.includes(candidateQ.uid)) {
                    nextQ = candidateQ;
                } else if (candidateQ && !candidateQ.uid) {
                    console.warn("Generator produced question missing UID:", generator.name);
                }
                 // else: candidate failed or was recent, loop continues
            } catch (error) {
                console.error("Error in question generator:", generator.name, error);
            }
        }

         // Fallback if no unique question found after many tries
        if (!nextQ) {
            console.warn(`Max attempts (${maxAttempts}) reached finding unique question. Generating potentially repeating question.`);
            let fallbackAttempts = 0;
             while(!nextQ && fallbackAttempts < 5) {
                const generator = questionGenerators[randInt(questionGenerators.length)];
                nextQ = generator(); // Accept even if it might repeat
                 fallbackAttempts++;
             }
             // If still fails, provide error display
             if (!nextQ) {
                nextQ = {type: 'error', prompt: "Error: Could not generate a question.", explanation: "", uid: `error:${Date.now()}`};
             }
        }
        return nextQ;
    };


    // --- Initial Load ---
    useEffect(() => {
        console.log("AtomicRadiusActivityEnhanced Mounted");
        const initialQ = selectNextQuestion();
        setQuestion(initialQ);
        if(initialQ?.uid && initialQ.type !== 'error') {
           setRecentQuestionUIDs([initialQ.uid]);
        }
        setIsLoading(false);
         setRound(1);
         setScore(0);
    }, []); // Empty array = Run once on mount

    // --- Handlers ---
    function handleSimpleChoice(answerValue, correctValue) {
        setUserAnswer(answerValue); // Record user choice for potential styling
        if (answerValue === correctValue) {
            setScore(score + 1);
            setFeedback({ type: 'correct', message: 'Correct!', correctVal: correctValue });
        } else {
            setFeedback({
                type: 'incorrect',
                message: `Incorrect. Correct answer: ${correctValue}\n\n${question.explanation || ''}`,
                correctVal: correctValue
            });
        }
        setShowNext(true);
    }

    function handleButtonChoice(idx, correctIdx) {
        setUserAnswer(idx); // Index of the button chosen
        if (idx === correctIdx) {
            setScore(score + 1);
            setFeedback({ type: 'correct', message: 'Correct!', correctIdx: idx });
        } else {
            setFeedback({
                type: 'incorrect',
                message: `Incorrect.\n${question.explanation || ''}`,
                correctIdx: correctIdx
            });
        }
        setShowNext(true);
    }


    function handleArrangeSubmit() {
        // map arrangeOrder (indices of displayElements) back to symbols
        const userOrderSymbols = arrangeOrder.map(idx => question.displayElements[idx].symbol);
        const isCorrect = userOrderSymbols.join(',') === question.correctOrder.join(',');

        if (isCorrect) {
          setScore(score + 1);
          setFeedback({ type: 'correct', message: 'Correct order!' });
        } else {
          setFeedback({
            type: 'incorrect',
            message: `Incorrect. Correct order: ${question.correctOrder.join(' → ')}\n\n${question.explanation || ''}`,
            correctVal: question.correctOrder.join(' → ') // Store correct string
          });
        }
        setShowNext(true);
      }

    function handleNext() {
        setIsLoading(true);
        const currentUid = question?.uid;
        const nextQ = selectNextQuestion(currentUid);

         // Update History
         if (nextQ?.uid && nextQ.type !== 'error') {
            const updatedHistory = [...recentQuestionUIDs, nextQ.uid];
             setRecentQuestionUIDs(updatedHistory.slice(-RECENT_HISTORY_LIMIT)); // Keep only the last N
        }

        setQuestion(nextQ);
        // Reset UI state
        setFeedback(null);
        setShowNext(false);
        setUserAnswer(null);
        setArrangeOrder([]);
        setRound(round + 1);
        setIsLoading(false);
    }


    // --- Render Logic ---
    const renderOptions = () => {
      if (!question || !question.options) return null;

       // Radio buttons for text-based multiple choice
      return (
          <fieldset style={{ border: 'none', padding: 0, margin: '12px 0 8px 0', textAlign: 'left' }}>
              <legend className="sr-only">{question.prompt}</legend>
              {question.options.map((opt, index) => {
                  const optionId = `opt-${question.uid}-${index}`;
                   const isCorrect = feedback?.correctVal === opt;
                   const isSelectedIncorrect = feedback?.type === 'incorrect' && userAnswer === opt;

                   return (
                      <div key={optionId} style={{ margin: '6px 0', padding: '4px', borderRadius: '4px', background: isCorrect ? '#22c55e22' : (isSelectedIncorrect ? '#f472b622' : 'transparent') }}>
                          <input
                              type="radio"
                              id={optionId}
                              name={`answer-${question.uid}`}
                              value={opt}
                              checked={userAnswer === opt}
                              onChange={(e) => !feedback && setUserAnswer(e.target.value)}
                              disabled={!!feedback || isLoading}
                              aria-labelledby={`${optionId}-label`}
                              style={{ marginRight: '8px', accentColor: '#60a5fa' }} // Modern accent color
                          />
                          <label
                               id={`${optionId}-label`}
                               htmlFor={optionId}
                               style={{
                                  color: isCorrect ? '#22c55e' : (isSelectedIncorrect ? '#f472b6' : '#e5e7eb'),
                                  fontWeight: isCorrect || isSelectedIncorrect ? 600 : 400,
                                  cursor: feedback ? 'default' : 'pointer'
                               }}
                           >
                              {opt}
                          </label>
                      </div>
                  );
               })}
                {!feedback && userAnswer && (
                   <button type="button" onClick={() => handleSimpleChoice(userAnswer, question.correct)} className="ptable-btn submit-btn">
                       Submit
                   </button>
               )}
          </fieldset>
       );
    };


   if (isLoading && !question) {
       return <div style={{color: 'white', textAlign:'center', padding: '50px'}}>Loading Atomic Radius Activity...</div>;
   }
    if (!question || question.type === 'error') {
       return <div style={{color: 'red', textAlign:'center', padding: '50px'}}>{question?.prompt || 'Failed to load question.'} Please try refreshing.</div>;
   }


    // Main component structure using existing styles but adapted for new types
  return (
    <div className="center-container fade-in slide-up" style={/*... container styles ...*/ { background: 'radial-gradient(circle at 60% 40%, #2d314d 80%, #19172e 100%)', minHeight: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div style={/*... card styles ...*/ {
        background: 'rgba(30, 41, 59, 0.98)', padding: '20px 12px 16px', borderRadius: 10, boxShadow: '0 4px 16px #0005', minWidth: 280, maxWidth: 350, width: '90%', margin: '0 auto', position: 'relative', border: '1px solid #23234a', textAlign: 'center'
        }}>
        <h2 style={/*... h2 styles ...*/ { fontWeight: 700, fontSize: '1.12em', color: '#facc15', marginBottom: 7, letterSpacing: 0.2, textShadow: '0 1px 2px #23234a33',}}>
          Atomic Radius Practice
        </h2>

        {/* Prompt */}
        <div style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '1em', marginBottom: 10, minHeight: '40px', lineHeight: 1.4}}>
          {question.prompt}
        </div>


         {/* == Question Type Specific UI == */}

         {/* Type: compare (using buttons) */}
        {question.type === 'compare' && question.elements && (
          <div style={/* button container styles */ { display: 'flex', justifyContent: 'center', gap: 10, margin: '12px 0 8px 0', flexWrap: 'wrap'}}>
             {question.elements.map((el, idx) => {
                  const isCorrect = feedback?.correctIdx === idx;
                  const isSelected = userAnswer === idx; // User clicked this button index
                  const isSelectedIncorrect = feedback?.type === 'incorrect' && isSelected;
                 return (
                  <button
                     key={el.symbol}
                     className="ptable-btn choice-btn" // Add specific class?
                     style={{ /* base button style */
                       minWidth: 80, padding: '8px 5px', fontSize: '0.95em', fontWeight: 700, borderRadius: 7, color: '#0f172a', letterSpacing: 0.5, outline: 'none', cursor: feedback ? 'not-allowed' : 'pointer', transition: 'all .18s',
                       background: isCorrect ? 'linear-gradient(100deg,#4ade80 60%,#22c55e 100%)' : ( isSelectedIncorrect ? 'linear-gradient(100deg,#fca5a5 60%,#ef4444 100%)': 'linear-gradient(100deg,#bae6fd 60%,#60a5fa 100%)'),
                       border: `1px solid ${isCorrect ? '#22c55e' : (isSelectedIncorrect ? '#ef4444' : '#60a5fa')}`,
                       boxShadow: isCorrect ? '0 0 8px #22c55e44' : (isSelectedIncorrect ? '0 0 6px #ef444433' : '0 1px 4px #23234a33'),
                       opacity: (feedback && !isCorrect && !isSelectedIncorrect) ? 0.6 : 1, // Dim others on feedback unless it's the incorrect one selected
                      }}
                     onClick={() => !feedback && handleButtonChoice(idx, question.correctIdx)}
                     disabled={!!feedback}
                     aria-label={`Choose ${el.name}`}
                   >
                     {el.symbol}
                     <div style={{ fontSize: '0.7em', fontWeight: 400, marginTop: 2, opacity: 0.9 }}>{el.name}</div>
                     {feedback && <div style={{ fontSize: '0.7em', fontWeight: 600, marginTop: 3, color: isCorrect || isSelectedIncorrect ? '#1f2937':'#334155' }}>({el.atomicRadius} pm)</div>}
                   </button>
                 )
            })}
          </div>
        )}

         {/* Type: rank (draggable or select buttons in order) */}
        {question.type === 'rank' && question.displayElements && (
             <div style={{ margin: '12px 0 8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 {/* Selection Buttons */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                     {question.displayElements.map((el, idx) => {
                        const isSelected = arrangeOrder.includes(idx);
                         return (
                         <button
                            key={el.symbol}
                            className="ptable-btn rank-option-btn"
                            style={{/* ... */
                               minWidth: 80, padding: '8px 5px', fontSize: '0.95em', fontWeight: 700, borderRadius: 7, letterSpacing: 0.5, outline: 'none', transition: 'all .18s', marginBottom: 3,
                                background: isSelected ? '#6b7280' : 'linear-gradient(100deg,#fde68a 60%,#bae6fd 100%)',
                                color: isSelected ? '#e5e7eb' : '#0f172a',
                                border: `1px solid ${isSelected ? '#9ca3af' : '#60a5fa'}`,
                                boxShadow: '0 1px 4px #23234a22',
                                cursor: feedback || isSelected ? 'not-allowed' : 'pointer',
                                opacity: feedback || isSelected ? 0.6 : 1,
                             }}
                             onClick={() => {
                                if (feedback || isSelected) return;
                                setArrangeOrder([...arrangeOrder, idx]); // Add index to order
                             }}
                             disabled={feedback || isSelected}
                             aria-label={`Select ${el.name} to add to ranking`}
                         >
                            {el.symbol}
                             <div style={{ fontSize: '0.7em', fontWeight: 400, marginTop: 2, opacity: 0.9 }}>{el.name}</div>
                         </button>
                         );
                     })}
                 </div>
                 {/* Display Current Order */}
                {arrangeOrder.length > 0 && (
                    <div style={{ /* ... current order styles ... */ fontSize: '0.9em', color: '#93c5fd', marginTop: 4, marginBottom: 8, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', width: '100%'}}>
                       <span>Order: {arrangeOrder.map(idx => question.displayElements[idx]?.symbol).join(' → ')}</span>
                       {!feedback && (
                           <button onClick={() => setArrangeOrder(arrangeOrder.slice(0,-1))} style={{ background: 'none', border: 'none', color: '#f472b6', cursor: 'pointer', fontSize: '1.2em', padding: '0 5px' }} title="Undo Last">⌫</button>
                        )}
                     </div>
                 )}
                  {/* Submit Button */}
                 <button
                     className="ptable-btn submit-btn" // Style similarly to other submit buttons
                     style={{/* ... submit style ... */
                        background: 'linear-gradient(90deg,#f472b6 0,#60a5fa 100%)', color: '#fff', fontWeight: 700, fontSize: '0.96em', borderRadius: 6, boxShadow: '0 1px 4px #f472b611', padding: '6px 18px', margin: '5px 0 7px 0', border: 'none', letterSpacing: 1, outline: 'none', transition: 'all .18s',
                        cursor: arrangeOrder.length === question.displayElements.length && !feedback ? 'pointer' : 'not-allowed',
                         opacity: arrangeOrder.length === question.displayElements.length && !feedback ? 1 : 0.5,
                    }}
                     onClick={handleArrangeSubmit}
                     disabled={!!feedback || arrangeOrder.length !== question.displayElements.length}
                 >
                     Submit Order
                 </button>
            </div>
         )}


        {/* Type: true_false (Using buttons) */}
         {question.type === 'true_false' && (
             <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '12px 0 8px 0' }}>
                  {['true', 'false'].map(choice => {
                     const correctBool = question.answer; // Is the statement actually true?
                     const isCorrect = feedback && (choice === 'true' ? correctBool : !correctBool); // Is this the correct T/F button?
                     const isSelected = userAnswer === choice; // Did user click this?
                     const isSelectedIncorrect = feedback && isSelected && !isCorrect;
                     return (
                      <button
                          key={choice}
                          className="ptable-btn tf-btn"
                          style={{/* base styles */
                              minWidth: 80, padding: '8px 15px', fontSize: '0.95em', fontWeight: 700, borderRadius: 7, color: '#0f172a', letterSpacing: 0.5, outline: 'none', cursor: feedback ? 'not-allowed' : 'pointer', transition: 'all .18s',
                              background: isCorrect ? 'linear-gradient(100deg,#4ade80 60%,#22c55e 100%)' : ( isSelectedIncorrect ? 'linear-gradient(100deg,#fca5a5 60%,#ef4444 100%)' : (choice === 'true' ? 'linear-gradient(100deg,#bae6fd 60%,#60a5fa 100%)' : 'linear-gradient(100deg,#fde68a 60%,#fbbf24 100%)') ),
                              border: `1px solid ${isCorrect ? '#22c55e' : (isSelectedIncorrect ? '#ef4444' : (choice === 'true' ? '#60a5fa':'#fbbf24') )}`,
                              boxShadow: isCorrect ? '0 0 8px #22c55e44' : (isSelectedIncorrect ? '0 0 6px #ef444433' : '0 1px 4px #23234a33'),
                               opacity: (feedback && !isCorrect && !isSelected) ? 0.6 : 1,
                           }}
                          onClick={() => !feedback && handleSimpleChoice(choice, question.answer ? 'true' : 'false')}
                          disabled={!!feedback}
                          aria-label={`Choose ${choice}`}
                        >
                           {choice.charAt(0).toUpperCase() + choice.slice(1)}
                       </button>
                       );
                    })}
                </div>
             )}

         {/* Types: general_trend, reason_trend, reason_factor (Using radio buttons) */}
          {(question.type === 'general_trend' || question.type === 'reason_trend' || question.type === 'reason_factor') && (
            renderOptions()
          )}

          {/* == Feedback Area == */}
          <div style={{ margin: '5px 0 8px 0', fontWeight: 500, fontSize: '0.9em', minHeight: 30, lineHeight: 1.4 }}>
            {feedback && (
              <span style={{
                color: feedback.type === 'correct' ? '#4ade80' : '#fca5a5', // Brighter feedback colors
                 textShadow: feedback.type === 'correct' ? '0 1px 3px #22c55e33' : '0 1px 3px #ef444422',
                 whiteSpace: 'pre-line', // Allows \n for newlines
                display: 'inline-block',
                 maxWidth: '95%',
               }}>
                 <strong>{feedback.message.split('\n')[0]}</strong> {/* Bold first line */}
                 {feedback.message.includes('\n') && <br/>}
                 {feedback.message.split('\n').slice(1).join('\n')} {/* Rest of message */}
              </span>
            )}
           </div>

            {/* == Navigation Buttons == */}
           {showNext && (
              <button onClick={handleNext} className="ptable-btn next-btn" style={{ /* Reuse next button style */
                   background: 'linear-gradient(90deg,#f472b6 0,#60a5fa 100%)', color: '#fff', fontWeight: 700, fontSize: '0.96em', borderRadius: 6, boxShadow: '0 1px 4px #f472b611', padding: '6px 18px', margin: '0 0 7px 0', border: 'none', letterSpacing: 1, cursor: 'pointer', outline: 'none', transition: 'all .18s',
               }}>
                   NEXT
               </button>
           )}

          {/* Score/Round Display */}
         <div style={/*... score style ... */{ marginTop: 2, fontSize: '0.93em', color: '#60a5fa', fontWeight: 600, letterSpacing: 1 }}>
              Score: <span style={{ color: '#facc15', fontWeight: 900 }}>{score}</span>   |   Round: {round}
          </div>

           {/* Bottom Buttons (Table/Back) */}
         <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 7 }}>
              <button onClick={onPeriodicTable} className="ptable-btn" style={/*... table button style ...*/ {fontWeight: 700, fontSize: '0.96em', borderRadius: 6, background: 'linear-gradient(90deg,#60a5fa 0,#bae6fd 100%)', color: '#23234a', boxShadow: '0 2px 4px #60a5fa22', border: 'none', padding: '5px 16px', letterSpacing: 1, cursor: 'pointer', outline: 'none', transition: 'all .18s'}}>
                   Periodic Table
               </button>
               <button onClick={onBack} className="ptable-btn" style={/*... back button style ...*/ {fontWeight: 700, fontSize: '0.96em', borderRadius: 6, background: 'linear-gradient(90deg,#f472b6 0,#fde68a 100%)', color: '#23234a', boxShadow: '0 2px 4px #f472b611', border: 'none', padding: '5px 16px', letterSpacing: 1, cursor: 'pointer', outline: 'none', transition: 'all .18s'}}>
                  Back
               </button>
           </div>
       </div> {/* End Card */}
    </div> // End Container
  );
}