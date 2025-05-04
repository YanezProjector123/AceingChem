import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import PeriodicTable from './PeriodicTable'; // Assuming this component exists

// Data (Assuming 'elements' array from your code is available here)
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
    if (pool.length < n) {
       console.warn(`pickUnique could not find ${n} elements matching criteria. Returning ${pool.length}. AllowFBlock=${allowFBlock}`);
        return shuffle(pool);
    }
    return shuffle(pool).slice(0, n);
};

// Helper filters
const mainGroups = [1, 2, 13, 14, 15, 16, 17, 18];
const isMainGroup = (el) => el && mainGroups.includes(el.group);

// --- Question Generators (Keep all generators as they were) ---

// 1. Compare Radii (Larger/Smaller)
const generateCompareQuestion = () => {
    const compareType = Math.random() < 0.5 ? 'larger' : 'smaller';
    let a, b;
    let attempts = 0;
    do {
        [a, b] = pickUnique(2);
        attempts++;
         if(!a || !b || a.symbol === b.symbol ||
           ( (a.category?.includes('lanthanide') || a.category?.includes('actinide')) !==
             (b.category?.includes('lanthanide') || b.category?.includes('actinide')) && attempts < 10)
         ) {
            a = null; b=null;
         }
    } while ((!a || !b) && attempts < 20);

    if (!a || !b) return null;

    const correctIdx = (compareType === 'larger')
        ? (a.atomicRadius > b.atomicRadius ? 0 : 1)
        : (a.atomicRadius < b.atomicRadius ? 0 : 1);
    const winner = correctIdx === 0 ? a : b;
    const loser = correctIdx === 0 ? b : a;

    let explanation = '';
    if (a.period === b.period && isMainGroup(a) && isMainGroup(b)) {
      explanation = `They are in the same period. Radius generally decreases left-to-right due to increasing effective nuclear charge (Zeff). ${winner.symbol} is further ${winner.group < loser.group ? 'left' : 'right'}.`;
    } else if (a.group === b.group && a.group !== 3 && isMainGroup(a) && isMainGroup(b)) {
       explanation = `They are in the same main group. Radius generally increases down a group due to adding electron shells. ${winner.symbol} is in period ${winner.period}.`;
    } else {
       explanation = `Compare their positions. Down a group increases size (more shells). Across a period decreases size (higher Zeff). ${winner.symbol} (P${winner.period}, G${winner.group}, ${winner.atomicRadius} pm) vs ${loser.symbol} (P${loser.period}, G${loser.group}, ${loser.atomicRadius} pm).`;
    }

    return {
        type: 'compare',
        prompt: `Which element has the ${compareType} atomic radius?`,
        elements: [a, b],
        correctIdx: correctIdx,
        explanation: explanation,
        uid: `compare:${compareType}:${[a.symbol,b.symbol].sort().join(':')}`
    };
};

// 2. Rank Radii (Increasing/Decreasing)
const generateRankQuestion = () => {
    const rankType = Math.random() < 0.5 ? 'increasing' : 'decreasing';
    let els = [];
    let attempts = 0;
    let strategy = 'random';
    do {
      attempts++;
       els = [];
       const choice = randInt(3);
       if (choice === 0 && attempts < 5) {
           const period = randInt(6) + 2;
           els = pickUnique(3, e => e.period === period && isMainGroup(e));
           strategy = 'period';
       } else if (choice === 1 && attempts < 10) {
           const group = mainGroups[randInt(mainGroups.length)];
           els = pickUnique(3, e => e.group === group);
           strategy = 'group';
       } else {
            els = pickUnique(3, e => isMainGroup(e));
           strategy = 'random_main';
       }
    } while(els.length !== 3 && attempts < 15)

    if (els.length !== 3) return null;

    const sorted = els.slice().sort((a, b) =>
        rankType === 'increasing' ? a.atomicRadius - b.atomicRadius : b.atomicRadius - a.atomicRadius
    );
    const correctOrderSymbols = sorted.map(e => e.symbol);

     let explanationHint = '';
     if(strategy === 'period') explanationHint = `All elements are in Period ${els[0].period}. Remember radius decreases across a period.`;
     else if (strategy === 'group') explanationHint = `All elements are in Group ${els[0].group}. Remember radius increases down a group.`;
     else explanationHint = `Compare positions carefully: larger radius down/left, smaller radius up/right.`;

    return {
        type: 'rank',
        prompt: `Arrange these elements in order of ${rankType} atomic radius:`,
        displayElements: shuffle(els.slice()),
        correctOrder: correctOrderSymbols,
        explanation: `Correct order: ${correctOrderSymbols.join(rankType === 'increasing' ? ' < ' : ' > ')}. ${explanationHint}`, // Adjust separator
        uid: `rank:${rankType}:${els.map(e=>e.symbol).sort().join(':')}`
    };
};

// 3. True/False Comparison
const generateTrueFalseQuestion = () => {
     let a, b;
     let attempts = 0;
     do {
         [a, b] = pickUnique(2);
         attempts++;
     } while((!a || !b || a.symbol === b.symbol) && attempts < 10)

     if (!a || !b) return null;

     const actualAnswer = a.atomicRadius > b.atomicRadius;
     const statementIsTrueIf = Math.random() < 0.5;
     let prompt;
     if (statementIsTrueIf) {
          prompt = `True or False: ${a.symbol} (${a.name}) has a larger atomic radius than ${b.symbol} (${b.name})?`;
     } else {
          prompt = `True or False: ${b.symbol} (${b.name}) has a larger atomic radius than ${a.symbol} (${a.name})?`;
     }
     const correctAnswer = statementIsTrueIf;

      let explanation = `Comparing ${a.symbol} (${a.atomicRadius} pm) and ${b.symbol} (${b.atomicRadius} pm), the statement is ${correctAnswer ? 'True' : 'False'}. `; // Corrected display
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
         uid: `tf:${[a.symbol, b.symbol].sort().join(':')}:${statementIsTrueIf}`
     };
};

// 4. General Trend Questions
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
    } else {
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

// 5. Reason for Trend Questions
const generateReasonQuestion = () => {
    const reasonType = Math.random();
    if (reasonType < 0.33) { // Reason for decrease across period
         let a, b;
         let attempts = 0;
         do {
             const period = randInt(5) + 2;
             [a,b] = pickUnique(2, e => e.period === period && isMainGroup(e));
             attempts++;
         } while ((!a || !b || a.group === b.group) && attempts < 10);

         if(!a || !b) return null;

         const smaller = a.group < b.group ? b : a;
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
          let a, b;
          let attempts = 0;
          do {
              const group = mainGroups[randInt(mainGroups.length)];
              [a,b] = pickUnique(2, e => e.group === group);
              attempts++;
          } while ((!a || !b || a.period === b.period) && attempts < 10);

          if(!a || !b) return null;

         const lower = a.period > b.period ? a : b;
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
         do {
            [a, b] = pickUnique(2, e => isMainGroup(e));
             attempts++;
         } while ((!a || !b || (a.period === b.period && a.group === b.group)) && attempts < 10);

         if(!a || !b) return null;

         const larger = a.atomicRadius > b.atomicRadius ? a : b;
         const smaller = larger === a ? b : a;
         let primaryFactor = '';
         let otherFactor = '';

         if (larger.period > smaller.period && larger.group === smaller.group) {
            primaryFactor = 'Higher principal quantum number (n) / More electron shells';
            otherFactor = 'Lower effective nuclear charge (Zeff)';
         } else if (larger.period === smaller.period && larger.group < smaller.group) {
             primaryFactor = 'Lower effective nuclear charge (Zeff)';
             otherFactor = 'Same principal quantum number (n)';
         } else {
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
    generateCompareQuestion,
    generateRankQuestion,
    generateTrueFalseQuestion,
    generateGeneralTrendQuestion,
    generateReasonQuestion,
];

// --- React Component ---

export default function AtomicRadiusActivityEnhanced({ onBack, onPeriodicTable }) {
    const RECENT_HISTORY_LIMIT = 15;

    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [recentQuestionUIDs, setRecentQuestionUIDs] = useState([]);
    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [showNext, setShowNext] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [arrangeOrder, setArrangeOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTable, setShowTable] = useState(false); // <<<--- ADDED STATE FOR TABLE

    // --- Function to Select Next Question (Keep as is) ---
    const selectNextQuestion = (currentQuestionUid = null) => {
        let nextQ = null;
        let attempts = 0;
        const maxAttempts = questionGenerators.length * 3;

        while (!nextQ && attempts < maxAttempts) {
            attempts++;
            const generator = questionGenerators[randInt(questionGenerators.length)];
            try {
                const candidateQ = generator();
                if (candidateQ && candidateQ.uid && candidateQ.uid !== currentQuestionUid && !recentQuestionUIDs.includes(candidateQ.uid)) {
                    nextQ = candidateQ;
                } else if (candidateQ && !candidateQ.uid) {
                    console.warn("Generator produced question missing UID:", generator.name);
                }
            } catch (error) {
                console.error("Error in question generator:", generator.name, error);
            }
        }

        if (!nextQ) {
            console.warn(`Max attempts (${maxAttempts}) reached finding unique question. Generating potentially repeating question.`);
            let fallbackAttempts = 0;
             while(!nextQ && fallbackAttempts < 5) {
                const generator = questionGenerators[randInt(questionGenerators.length)];
                nextQ = generator();
                 fallbackAttempts++;
             }
             if (!nextQ) {
                nextQ = {type: 'error', prompt: "Error: Could not generate a question.", explanation: "", uid: `error:${Date.now()}`};
             }
        }
        return nextQ;
    };

    // --- Initial Load (Keep as is) ---
    useEffect(() => {
        console.log("AtomicRadiusActivityEnhanced Mounted");
        setIsLoading(true); // Start loading
        const initialQ = selectNextQuestion();
        setQuestion(initialQ);
        if(initialQ?.uid && initialQ.type !== 'error') {
           setRecentQuestionUIDs([initialQ.uid]);
        }
        setRound(1);
        setScore(0);
        setShowTable(false); // Ensure table is hidden initially
        setIsLoading(false); // Finish loading
    }, []);

    // --- Handlers (Keep existing handlers as is) ---
    function handleSimpleChoice(answerValue, correctValue) {
        if (feedback) return; // Prevent multiple submissions
        setUserAnswer(answerValue);
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
        if (feedback) return; // Prevent multiple submissions
        setUserAnswer(idx);
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
        if (feedback) return; // Prevent multiple submissions
        const userOrderSymbols = arrangeOrder.map(idx => question.displayElements[idx].symbol);
        const isCorrect = userOrderSymbols.join(',') === question.correctOrder.join(',');

        if (isCorrect) {
          setScore(score + 1);
          setFeedback({ type: 'correct', message: 'Correct order!' });
        } else {
          setFeedback({
            type: 'incorrect',
            message: `Incorrect. Correct order: ${question.correctOrder.join(' → ')}\n\n${question.explanation || ''}`,
            correctVal: question.correctOrder.join(' → ')
          });
        }
        setShowNext(true);
      }

    function handleNext() {
        setIsLoading(true);
        const currentUid = question?.uid;
        const nextQ = selectNextQuestion(currentUid);

         if (nextQ?.uid && nextQ.type !== 'error') {
            const updatedHistory = [...recentQuestionUIDs, nextQ.uid];
             setRecentQuestionUIDs(updatedHistory.slice(-RECENT_HISTORY_LIMIT));
        }

        setQuestion(nextQ);
        setFeedback(null);
        setShowNext(false);
        setUserAnswer('');
        setArrangeOrder([]);
        setRound(round + 1);
        setIsLoading(false);
    }

    // --- MODIFIED: Toggle Periodic Table Handler ---
    const togglePeriodicTable = () => {
        setShowTable(prevShowTable => !prevShowTable);
        // Still call the prop if the parent needs to know
        if (typeof onPeriodicTable === 'function') {
            onPeriodicTable(); // Let parent know button was clicked
        }
    };


    // --- Render Logic (Keep renderOptions as is) ---
    const renderOptions = () => {
        if (!question || !question.options) return null;

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
                                style={{ marginRight: '8px', accentColor: '#60a5fa' }}
                            />
                            <label
                                id={`${optionId}-label`}
                                htmlFor={optionId}
                                style={{
                                    color: isCorrect ? '#4ade80' : (isSelectedIncorrect ? '#fca5a5' : '#e5e7eb'), // Adjusted feedback colors
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
                    <button type="button" onClick={() => handleSimpleChoice(userAnswer, question.correct)} className="ptable-btn submit-btn" disabled={isLoading}>
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


    // --- Main component structure ---
  return (
    <div className="mca-activity-root center-container fade-in slide-up">
      <div className="mca-question-card glass-card">
        <h2 className="ptable-title">Atomic Radius Activity</h2>
        <div className="en-score-round-display">
          Score: <span className="score-value">{score}</span> | Question: {round}
        </div>
        <div className="mca-question-prompt">{question.prompt}</div>
        {/* == Question Type Specific UI == */}
        {/* Type: compare (using buttons) */}
        {question.type === 'compare' && question.elements && (
          <div className="mca-options-group">
            {question.elements.map((el, idx) => {
              const isCorrect = feedback?.correctIdx === idx;
              const isSelected = userAnswer === idx;
              const isSelectedIncorrect = feedback?.type === 'incorrect' && isSelected;
              return (
                <button
                  key={el.symbol}
                  className={`mca-option${isSelected ? ' selected' : ''}${feedback ? ' disabled' : ''}`}
                  onClick={() => !feedback && handleButtonChoice(idx, question.correctIdx)}
                  disabled={!!feedback || isLoading}
                  aria-label={`Choose ${el.name}`}
                >
                  {el.symbol}
                  <div style={{ fontSize: '0.7em', fontWeight: 400, marginTop: 2, opacity: 0.9 }}>{el.name}</div>
                  {feedback && <div style={{ fontSize: '0.7em', fontWeight: 600, marginTop: 3 }}>{el.atomicRadius} pm</div>}
                </button>
              )
            })}
          </div>
        )}
        {/* Type: rank (draggable or select buttons in order) */}
        {question.type === 'rank' && question.displayElements && (
          <div className="mca-options-group">
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {question.displayElements.map((el, idx) => {
                const isSelected = arrangeOrder.includes(idx);
                return (
                  <button
                    key={el.symbol}
                    className={`mca-option${isSelected ? ' selected' : ''}${feedback ? ' disabled' : ''}`}
                    onClick={() => {
                      if (feedback || isSelected) return;
                      setArrangeOrder([...arrangeOrder, idx]);
                    }}
                    disabled={!!feedback || isSelected || isLoading}
                    aria-label={`Select ${el.name} to add to ranking`}
                  >
                    {el.symbol}
                    <div style={{ fontSize: '0.7em', fontWeight: 400, marginTop: 2, opacity: 0.9 }}>{el.name}</div>
                  </button>
                );
              })}
            </div>
            {arrangeOrder.length > 0 && (
              <div style={{ fontSize: '0.9em', color: '#93c5fd', marginTop: 4, marginBottom: 8, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', width: '100%' }}>
                <span>Order: {arrangeOrder.map(idx => question.displayElements[idx]?.symbol).join(' → ')}</span>
                {!feedback && (
                  <button onClick={() => setArrangeOrder(arrangeOrder.slice(0, -1))} style={{ background: 'none', border: 'none', color: '#f472b6', cursor: 'pointer', fontSize: '1.2em', padding: '0 5px' }} title="Undo Last" disabled={isLoading}>⌫</button>
                )}
              </div>
            )}
            <button
              className="mca-btn"
              onClick={handleArrangeSubmit}
              disabled={!!feedback || arrangeOrder.length !== question.displayElements.length || isLoading}
              style={{ marginTop: 8 }}
            >
              Submit Order
            </button>
          </div>
        )}
        {/* Type: true_false (Using buttons) */}
        {question.type === 'true_false' && (
          <div className="mca-options-group">
            {['true', 'false'].map(choice => {
              const correctBool = question.answer;
              const isCorrect = feedback && (choice === 'true' ? correctBool : !correctBool);
              const isSelected = userAnswer === choice;
              const isSelectedIncorrect = feedback && isSelected && !isCorrect;
              return (
                <button
                  key={choice}
                  className={`mca-option${isSelected ? ' selected' : ''}${feedback ? ' disabled' : ''}`}
                  onClick={() => !feedback && handleSimpleChoice(choice, question.answer ? 'true' : 'false')}
                  disabled={!!feedback || isLoading}
                  aria-label={`Choose ${choice}`}
                >
                  {choice.charAt(0).toUpperCase() + choice.slice(1)}
                </button>
              );
            })}
          </div>
        )}
        {/* Types: general_trend, reason_trend, reason_factor (Using custom radio buttons) */}
        {(question.type === 'general_trend' || question.type === 'reason_trend' || question.type === 'reason_factor') && (
          <>
            <div className="mca-options-group">
              {question.options.map((opt, index) => {
                const isSelected = userAnswer === opt;
                const isCorrect = feedback?.correctVal === opt;
                const isSelectedIncorrect = feedback?.type === 'incorrect' && userAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`mca-option${isSelected ? ' selected' : ''}${isCorrect ? ' correct' : ''}${isSelectedIncorrect ? ' incorrect' : ''}`}
                    onClick={() => !feedback && setUserAnswer(opt)}
                    disabled={!!feedback || isLoading}
                    aria-label={opt}
                    style={{ marginBottom: 0 }}
                  >
                    {opt}
                  </button>
                );
              })}
              {!feedback && userAnswer !== '' && (
                <button type="button" onClick={() => handleSimpleChoice(userAnswer, question.correct)} className="mca-btn" disabled={isLoading} style={{ marginTop: 18, alignSelf: 'center' }}>
                  Submit
                </button>
              )}
              {feedback && (
                <div className={`mca-feedback ${feedback.type}`}> 
                  <strong>{feedback.message.split('\n')[0]}</strong>
                  {feedback.type === 'incorrect' && feedback.correctVal && (
                    <div className="correct-answer-info">Correct Answer: <strong>{feedback.correctVal}</strong></div>
                  )}
                  {question.explanation && <p className="explanation-text">{question.explanation}</p>}
                </div>
              )}
            </div>
          </>
        )}
        {/* == Feedback Area == */}
        {/* Only show feedback here for question types NOT handled above */}
        {!(question.type === 'general_trend' || question.type === 'reason_trend' || question.type === 'reason_factor') && feedback && !(
          question.type === 'general_trend' || question.type === 'reason_trend' || question.type === 'reason_factor') && (
          <div className={`mca-feedback ${feedback.type}`}>
            <span style={{
              color: feedback.type === 'correct' ? '#4ade80' : '#fca5a5',
              textShadow: feedback.type === 'correct' ? '0 1px 3px #22c55e33' : '0 1px 3px #ef444422',
              whiteSpace: 'pre-line',
              display: 'inline-block',
              maxWidth: '95%',
            }}>
              <strong>{feedback.message.split('\n')[0]}</strong>
              {feedback.message.includes('\n') && <br />}
              {feedback.message.split('\n').slice(1).join(' ')}
            </span>
          </div>
        )}
        {/* == Navigation Buttons == */}
        <div className="mca-btn-row">
          <button className="mca-btn mca-ptable-btn" onClick={togglePeriodicTable} disabled={isLoading}>{showTable ? 'Hide' : 'Show'} Periodic Table</button>
          <button className="mca-btn" onClick={onBack} disabled={isLoading}>Back</button>
          {showNext && (
            <button className="mca-btn" onClick={handleNext} disabled={isLoading}>Next</button>
          )}
        </div>
        {/* Periodic Table Modal */}
        {showTable && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}>
            <div style={{
              background: '#1e293b',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              maxWidth: '95%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <PeriodicTable onBack={togglePeriodicTable} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ADDED: PropTypes for the component
AtomicRadiusActivityEnhanced.propTypes = {
    onBack: PropTypes.func.isRequired,
    onPeriodicTable: PropTypes.func // Still accept prop, but not used for toggling here
};

// ADDED: Default props
AtomicRadiusActivityEnhanced.defaultProps = {
    onPeriodicTable: () => {} // Provide a no-op default
};