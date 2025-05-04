import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import PeriodicTable from './PeriodicTable'; // Assuming this component exists
// Assuming periodic-table.json contains fields like:
// number, symbol, name, period, group, category,
// ionizationEnergies (array), electronConfiguration, atomicRadius, electronegativityPauling
import periodicTable from './periodic-table.json';
import './IonizationEnergyActivity.css'; // Make sure this CSS file exists and is relevant

// --- Utility functions ---
const getRandomInt = (max) => Math.floor(Math.random() * max);
const shuffle = (array) => {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
const numberWords = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth']; // Extended slightly

// --- Enhanced Element Filtering (Ensure data validity) ---
const safeNumber = (val) => (typeof val === 'number' && !isNaN(val));
const safeString = (val) => (typeof val === 'string' && val.length > 0);

const elementsWithIE1 = periodicTable.filter(e =>
    safeNumber(e.period) && e.period <= 7 &&
    safeNumber(e.number) && e.number <= 103 && // Limit range where data is somewhat reliable
    Array.isArray(e.ionizationEnergies) && safeNumber(e.ionizationEnergies[0]) && e.ionizationEnergies[0] > 0 &&
    !['La', 'Ac'].includes(e.symbol) // Avoid placeholder elements if they lack real data
).filter(e => e.category !== 'lanthanide' && e.category !== 'actinide'); // Exclude f-block for most general questions

const elementsWithIE2 = elementsWithIE1.filter(e => e.ionizationEnergies.length >= 2 && safeNumber(e.ionizationEnergies[1]));
const elementsWithIE3Plus = elementsWithIE1.filter(e => e.ionizationEnergies.length >= 3 && safeNumber(e.ionizationEnergies[2]));
const elementsWithConfig = elementsWithIE1.filter(e => safeString(e.electronConfiguration));
const elementsWithRadius = elementsWithIE1.filter(e => safeNumber(e.atomicRadius));
const elementsWithEN = elementsWithIE1.filter(e => safeNumber(e.electronegativityPauling));

// Filter specifically for representative elements (s & p blocks)
const representativeElementsIE1 = elementsWithIE1.filter(e => safeNumber(e.group) && (e.group <= 2 || e.group >= 13));

// --- Fallback Question Generator ---
const fallbackQuestion = (reason = "Insufficient data for this question type.") => {
    console.warn("Using fallback question:", reason);
    // Prioritize True/False as it's self-contained
    if (trueFalseStatements && trueFalseStatements.length > 0) {
       try { return generateTrueFalseQuestion(); } catch {}
    }
    // If T/F somehow fails, try a basic trend as ultimate fallback
    try {
        if (generators.includes(generateTrendQuestion)) { // Check if defined
            return generateTrendQuestion();
        }
    } catch {}
    // Absolute fallback
    return { type: 'error', question: `Error: Failed to generate question. ${reason}`, options: [], correct: '', explanation: '', uid: `error_${Date.now()}` };
}

// --- Question Generators ---

// 1. Generate Trend Question (Comparison IE1)
const generateTrendQuestion = () => {
    const pool = Math.random() < 0.7 && representativeElementsIE1.length >= 2 ? representativeElementsIE1 : elementsWithIE1;
    if (pool.length < 2) return fallbackQuestion("Not enough elements with IE1 for trend comparison.");
    let a, b, attempts = 0;
    do {
        [a, b] = shuffle(pool).slice(0, 2); attempts++;
    } while ((!a || !b || a.symbol === b.symbol) && attempts < 20);
    if (!a || !b) return fallbackQuestion("Couldn't find valid pair for trend comparison.");
    const correctElement = a.ionizationEnergies[0] > b.ionizationEnergies[0] ? a : b;
    return {
        type: 'compare',
        question: `Which has higher first ionization energy: ${a.symbol} or ${b.symbol}?`,
        options: [a.symbol, b.symbol],
        correct: correctElement.symbol,
        explanation: `${correctElement.symbol} (IE1 ≈ ${Math.round(correctElement.ionizationEnergies[0])}) has higher IE1. IE generally increases up and to the right.`,
        uid: `compareIE1:${[a.symbol,b.symbol].sort().join(':')}`
    };
};

// 2. Generate Rank Question (IE1) - Focus on simpler cases
const generateRankQuestion = () => {
    const elementsPool = elementsWithIE1.filter(e => e.period <= 5 && (isMainGroup(e) || (e.period >= 4 && e.group >= 3 && e.group <= 12))); // Main groups + Per 4/5 d-block
    if (elementsPool.length < 3) return fallbackQuestion("Not enough elements for ranking.");
    let elements;
    let attempts = 0;
    do { // Ensure we get 3 valid elements with IE1
        elements = shuffle(elementsPool).slice(0, 3); attempts++;
    } while(elements.length < 3 && attempts < 10); // Add check for array length

     // Ensure all have IE data after selection
     if (elements.length < 3 || !elements.every(el => el?.ionizationEnergies?.[0])) {
          return fallbackQuestion("Could not find 3 rankable elements with IE1.");
     }

    const sortedElements = [...elements].sort((x, y) => x.ionizationEnergies[0] - y.ionizationEnergies[0]);
    const correctOrderSymbols = sortedElements.map(e => e.symbol);
    const correctOrderString = correctOrderSymbols.join(' < ');
    let optionsSet = new Set([correctOrderString]);
    let optionAttempts = 0;
    while (optionsSet.size < 3 && optionAttempts < 20) { optionsSet.add(shuffle([...correctOrderSymbols]).join(' < ')); optionAttempts++;} // Generate some distractors
    const options = shuffle(Array.from(optionsSet));
    return {
        type: 'rank',
        question: `Rank these elements from lowest to highest first ionization energy: ${elements.map(e => e.symbol).join(', ')}`,
        options: options,
        correct: correctOrderString,
        explanation: `Correct order: ${correctOrderString}. Consider period/group trends and potential exceptions.`,
        uid: `rankIE1:${elements.map(e => e.symbol).sort().join(':')}`
    };
};

// 3. Generate Exception Question - Uses static list, checks data availability
const exceptionPairs = [
    { elements: ['N', 'O'], correct: 'N', reason: 'N has a half-filled stable 2p³ subshell.', category: 'Half-Filled Subshell Stability' },
    { elements: ['Be', 'B'], correct: 'Be', reason: 'Be has a full stable 2s² subshell.', category: 'Full Subshell Stability' },
    { elements: ['Mg', 'Al'], correct: 'Mg', reason: 'Mg has a full stable 3s² subshell.', category: 'Full Subshell Stability' },
    { elements: ['P', 'S'], correct: 'P', reason: 'P has a half-filled stable 3p³ subshell.', category: 'Half-Filled Subshell Stability' },
    { elements: ['As', 'Se'], correct: 'As', reason: 'As has a half-filled stable 4p³ subshell.', category: 'Half-Filled Subshell Stability' },
    { elements: ['Zn', 'Ga'], correct: 'Zn', reason: 'Zn has full 4s² and 3d¹⁰. Easier to remove Ga\'s 4p¹.', category: 'Full Subshell Stability' },
    { elements: ['Cd', 'In'], correct: 'Cd', reason: 'Cd has full 5s² and 4d¹⁰. Easier to remove In\'s 5p¹.', category: 'Full Subshell Stability' },
    { elements: ['Hg', 'Tl'], correct: 'Hg', reason: 'Hg has full 6s² and 5d¹⁰. Easier to remove Tl\'s 6p¹.', category: 'Full Subshell Stability' },
];
const generateExceptionQuestion = () => {
    const validPairs = exceptionPairs.filter(pair => {
        const el1 = elementsWithIE1.find(e => e.symbol === pair.elements[0]);
        const el2 = elementsWithIE1.find(e => e.symbol === pair.elements[1]);
        return el1 && el2; // Ensure both elements exist in our filtered data
    });
    if (validPairs.length === 0) return fallbackQuestion("No valid exception pairs found with available data.");
    const pairData = validPairs[getRandomInt(validPairs.length)];
    const elementDetails = pairData.elements.map(sym => elementsWithIE1.find(el => el.symbol === sym));
    const [a, b] = elementDetails;
    const otherElementSymbol = pairData.elements.find(sym => sym !== pairData.correct);
    const actualHigherIE = a.ionizationEnergies[0] > b.ionizationEnergies[0] ? a.symbol : b.symbol;
    const isExpectedException = actualHigherIE === pairData.correct;
    const questionType = randInt(3);

    if (questionType === 0) {
        return {
            type: 'exception',
            question: `Which usually has higher IE1: ${a.symbol} or ${b.symbol}? (Consider configuration exceptions)`,
            options: [a.symbol, b.symbol], correct: pairData.correct,
            explanation: `Due to ${pairData.reason}, ${pairData.correct} often has higher IE1 than trend predicts. ${ isExpectedException ? 'Data confirms here.' : `Data shows ${actualHigherIE} higher here.` }`,
            uid: `exceptComp:${[a.symbol, b.symbol].sort().join(':')}` };
    } else if (questionType === 1) {
         return {
             type: 'reasoning',
             question: `Why does ${pairData.correct}'s IE1 deviate high compared to ${otherElementSymbol}?`,
             options: shuffle(['Larger size', 'Fewer protons', 'd-orbital contraction', pairData.reason]),
             correct: pairData.reason, explanation: `Stability from ${pairData.reason.toLowerCase()} requires more energy to remove electron.`,
             uid: `exceptReason:${pairData.correct}:${otherElementSymbol}`};
    } else {
         return {
            type: 'categorize',
             question: `The IE1 exception between ${pairData.correct}/${otherElementSymbol} relates to:`,
             options: shuffle(['Relativistic effects', 'Lanthanide contraction', pairData.category, 'Increased shielding']),
             correct: pairData.category, explanation: `Classified under ${pairData.category}. (${pairData.reason})`,
            uid: `exceptCat:${[a.symbol, b.symbol].sort().join(':')}`};
    }
};


// 4a. Generate Multi-Stage Question - Period 3
const generatePeriod3MultiStageQuestion = () => {
    const elementsInQuestion = ['Na', 'Mg', 'Al', 'Si'];
    const elementData = elementsInQuestion.map(sym => elementsWithIE1.find(el => el.symbol === sym)).filter(el => el);
    if (elementData.length !== elementsInQuestion.length) return fallbackQuestion("Missing data for P3 multi-stage");
    const sortedByIE = [...elementData].sort((a, b) => b.ionizationEnergies[0] - a.ionizationEnergies[0]);
    const highestIEElement = sortedByIE[0].symbol; // Si
    const lowestIEElement = sortedByIE[sortedByIE.length - 1].symbol; // Na
    const stageSet = [ /* Using corrected stages from previous examples */
       [{ type: 'trend', question: `Among ${elementsInQuestion.join(', ')}, highest first IE?`, options: shuffle([...elementsInQuestion]), correct: highestIEElement, explanation: `${highestIEElement} highest. IE increases across.` }, { type: 'reasoning', question: `Why ${highestIEElement}'s IE1 highest here?`, options: shuffle([`Largest radius`, `Highest effective nuclear charge (Zeff)`, `Full d-orbitals`]), correct: `Highest effective nuclear charge (Zeff)`, explanation: `Highest Zeff.` }, { type: 'application', question: `${highestIEElement} is classified as a...?`, options: ['Metal', 'Metalloid', 'Nonmetal'], correct: 'Metalloid', explanation: `High IE => Less metallic character.` }],
       [{ type: 'trend', question: `Among ${elementsInQuestion.join(', ')}, lowest first IE?`, options: shuffle([...elementsInQuestion]), correct: lowestIEElement, explanation: `${lowestIEElement} lowest. Easiest removal.` }, { type: 'reasoning', question: `Why ${lowestIEElement}'s IE1 lowest?`, options: shuffle([`High Zeff`, `Low Zeff & single valence e⁻ in new shell`, `Half-filled p-subshell`]), correct: `Low Zeff & single valence e⁻ in new shell`, explanation: `Easy removal from new shell.` }, { type: 'application', question: `Low IE1 means ${lowestIEElement} forms ions with charge...?`, options: ['+1', '-1', '+2'], correct: '+1', explanation: `Loses one e⁻ readily.` }],
       [{ type: 'trend_exception', question: `Between Mg and Al, higher IE1?`, options: ['Mg', 'Al'], correct: 'Mg', explanation: `Mg>Al is an exception.` }, { type: 'reasoning', question: `Why Mg > Al for IE1?`, options: shuffle([`Mg more protons`, `Al's e⁻ easier from p-subshell`, `Mg's full, stable 3s subshell`, `Al smaller`]), correct: `Mg's full, stable 3s subshell`, explanation: `Stable 3s² vs easier 3p¹ removal.` }, { type: 'application', question: `Forming +2 ion relatively easier for?`, options: ['Mg', 'Al'], correct: 'Mg', explanation: `Mg easier to lose 2nd e⁻ (IE2 Mg < IE2 Al).` }]
    ];
    return { type: 'multi-stage', source: 'Period 3', stages: shuffle(stageSet)[0], uid: `multiP3:${Date.now()}` }; // Use Date for UID on multi for simplicity
};

// 4b. Generate Multi-Stage Question - Period 2
const generatePeriod2MultiStageQuestion = () => {
     const elementsInQuestion = ['Li', 'Be', 'B', 'N', 'O'];
     const elementData = elementsInQuestion.map(sym => elementsWithIE1.find(el => el.symbol === sym)).filter(el => el);
     if (elementData.length !== elementsInQuestion.length) return fallbackQuestion("Missing data for P2 multi-stage");
     const stagesN_O = [ /* As defined previously */
         { type: 'trend_exception', question: `Between N and O, higher IE1?`, options: ['N', 'O'], correct: 'N', explanation: `N>O is an exception.`}, { type: 'reasoning', question: `Why N > O for IE1?`, options: shuffle(['N smaller', 'O more protons', 'N has stable half-filled 2p³', 'O lower Zeff']), correct: 'N has stable half-filled 2p³', explanation: `Stable 2p³ vs easier paired 2p⁴ removal.` }, { type: 'application', question: `Higher IE1 suggests N is...?`, options: ['More likely N⁺', 'Less likely N⁺', 'Equally likely N⁺'], correct: 'Less likely N⁺', explanation: `Harder removal => less likely cation.`}
     ];
     const stagesBe_B = [ /* As defined previously */
          { type: 'trend_exception', question: `Between Be and B, higher IE1?`, options: ['Be', 'B'], correct: 'Be', explanation: `Be>B is an exception.` }, { type: 'reasoning', question: `Why Be > B for IE1?`, options: shuffle(['Be fewer protons', 'B stable 2p⁶', 'Be has stable, full 2s²', 'B larger']), correct: 'Be has stable, full 2s²', explanation: `Stable 2s² vs easier 2p¹ removal.` }, { type: 'application', question: `Easier electron removal suggests more metallic character for?`, options: ['Be', 'B'], correct: 'B', explanation: `Lower IE1 (B) implies easier electron removal.` }
     ];
      const stagesLi = [ /* As defined previously */
          { type: 'trend', question: `Among ${elementsInQuestion.join(', ')}, lowest IE1?`, options: shuffle(elementsInQuestion), correct: 'Li', explanation: `Li lowest in Period 2.` }, { type: 'reasoning', question: `Why Li IE1 so low?`, options: shuffle(['e⁻ in n=1', 'High Zeff', 'Single valence e⁻ in n=2 shell', 'Full p-subshell']), correct: 'Single valence e⁻ in n=2 shell', explanation: `Single shielded e⁻ easy to remove.` }, { type: 'application', question: `Low IE1 means Li forms what ion?`, options: ['Li⁺', 'Li⁻', 'Li²⁺'], correct: 'Li⁺', explanation: `Loses one e⁻ for stable 1s².` }
     ];
     const allStageSets = [stagesN_O, stagesBe_B, stagesLi];
     return { type: 'multi-stage', source: 'Period 2', stages: shuffle(allStageSets)[0], uid: `multiP2:${Date.now()}` };
};


// 5. Generate IE Jump Question
const generateIEJumpQuestion = () => {
    const elementsPool = elementsWithIE3Plus.filter(e => e.period >= 2 && e.period <= 6 && e.group >= 1 && e.group <= 18);
    if (elementsPool.length < 1) return fallbackQuestion("Not enough elements for IE jump analysis.");
    let element, ies, maxRatio, jumpIndex, attempts = 0;
    do {
        element = elementsPool[getRandomInt(elementsPool.length)];
        if (!element || !Array.isArray(element.ionizationEnergies)) { attempts++; continue; }
        const iesRaw = element.ionizationEnergies.filter(safeNumber);
        if (iesRaw.length < 3) { attempts++; ies=null; continue; }
        maxRatio = 0; jumpIndex = 0;
        let significantJump = false;
        for (let i = 0; i < iesRaw.length - 1; i++) { const ratio = iesRaw[i + 1] / iesRaw[i]; if (ratio > maxRatio) { maxRatio = ratio; jumpIndex = i + 1; if (ratio > 1.9) significantJump=true;} }
        if (!significantJump || jumpIndex === 0) ies = null; else ies = iesRaw;
        attempts++;
    } while (!ies && attempts < 15);
    if (!ies) return fallbackQuestion("Couldn't find element with clear IE jump.");
    const correctOrdinal = numberWords[jumpIndex] || `${jumpIndex}th`;
    const explanation = `Largest jump after removing the ${correctOrdinal} electron means ${element.symbol} likely has ${jumpIndex} valence electron(s) (Group ${element.group || 'predicted'}). Next e⁻ comes from core shell.`;
    let options = new Set([correctOrdinal]);
    if (jumpIndex > 1 && numberWords[jumpIndex - 1]) options.add(numberWords[jumpIndex - 1]);
    if ((jumpIndex + 1) < ies.length && numberWords[jumpIndex + 1]) options.add(numberWords[jumpIndex + 1]);
    let oa=0; while(options.size < 3 && oa++ < 10) { let rIdx = getRandomInt(Math.min(ies.length-1, numberWords.length-1)) + 1; let word = numberWords[rIdx]; if(word && !options.has(word))options.add(word); }
    return {
        type: 'ie_jump',
        question: `For ${element.symbol}, the largest jump in successive IE occurs after removing which electron?`,
        options: shuffle(Array.from(options)),
        correct: correctOrdinal,
        explanation: explanation,
        uid: `iejump:${element.symbol}`
    };
};

// 6. Generate Identify Group Question
const generateIdentifyGroupQuestion = () => {
     const targetGroups = [1, 2, 13, 14, 15, 16, 17];
     const elementsPool = elementsWithIE3Plus.filter(e => safeNumber(e.group) && targetGroups.includes(e.group) && e.period >= 2 && e.period <= 6);
     if (elementsPool.length < 1) return fallbackQuestion("Not enough elements for Group ID question.");
     let element, ies, actualGroup, jumpIndex, attempts = 0;
     do {
         element = elementsPool[getRandomInt(elementsPool.length)];
         if (!element || !Array.isArray(element.ionizationEnergies)) { attempts++; continue; }
         const numIEsToShow = Math.min(element.ionizationEnergies.length, 6);
         const iesRaw = element.ionizationEnergies.slice(0, numIEsToShow).map(ie => safeNumber(ie) ? Math.round(ie) : null).filter(ie => ie !== null);
         if (iesRaw.length < 3) { ies = null; attempts++; continue; }
         let maxRatio = 0; jumpIndex = 0; let significantJump = false;
         for (let i = 0; i < iesRaw.length - 1; i++) { const ratio = iesRaw[i + 1] / iesRaw[i]; if (ratio > maxRatio) { maxRatio = ratio; jumpIndex = i + 1; if(ratio > 1.9) significantJump=true;} }
         const groupMap = { 1: 1, 2: 2, 3: 13, 4: 14, 5: 15, 6: 16, 7:17 };
         const predictedGroup = groupMap[jumpIndex];
         actualGroup = element.group;
         if (!significantJump || predictedGroup === undefined || predictedGroup !== actualGroup) ies = null; else ies = iesRaw;
         attempts++;
     } while (!ies && attempts < 15);
     if (!ies) return fallbackQuestion("Couldn't find element with jump matching group.");
     let optionsSet = new Set([`Group ${actualGroup}`]);
     shuffle([...targetGroups]).forEach(g => { if (g !== actualGroup && optionsSet.size < 4) optionsSet.add(`Group ${g}`); });
     while (optionsSet.size < 3){ let rg = [1,2,13,14,15,16,17,18][randInt(8)]; if(!optionsSet.has(`Group ${rg}`)) optionsSet.add(`Group ${rg}`); }
     return {
         type: 'identify_group',
         question: `Element IEs (kJ/mol): ${ies.join(', ')}... Which Group?`,
         options: shuffle(Array.from(optionsSet)),
         correct: `Group ${actualGroup}`,
         explanation: `Jump after IE${jumpIndex} indicates ${jumpIndex} valence e⁻, so Group ${actualGroup}.`,
         uid: `groupid:${element.symbol}`
     };
};

// 7. Generate True/False Question - USER PROVIDED LIST
// This is the exact list provided in the user prompt
const trueFalseStatements = [
    { statement: 'Ionization energy generally increases from left to right across a period.', correct: true, explanation: 'True. Increasing effective nuclear charge (Zeff) holds valence electrons tighter.' },
    { statement: 'Ionization energy generally decreases down a group.', correct: true, explanation: 'True. Valence electrons are in higher energy shells, further from the nucleus, and experience more shielding.' },
    { statement: 'Exceptions to the IE trend across a period (like Be>B and N>O) occur due to the stability of full or half-filled subshells.', correct: true, explanation: 'True. Electron configuration stability plays a key role.' },
    { statement: 'The second ionization energy (IE2) of any element is always lower than its first ionization energy (IE1).', correct: false, explanation: 'False. IE2 is always higher than IE1 because removing an electron from a positive ion is harder than from a neutral atom.' },
    { statement: 'Alkali metals (Group 1) have the lowest first ionization energies in their respective periods.', correct: true, explanation: 'True. They readily lose their single valence electron to achieve a noble gas configuration.' },
    { statement: 'Noble gases (Group 18) have the highest first ionization energies in their respective periods.', correct: true, explanation: 'True. Their stable electron octet (or duet for He) makes removing an electron very difficult.' },
    { statement: 'Removing a core electron always requires less energy than removing a valence electron.', correct: false, explanation: 'False. Removing core electrons (closer to the nucleus, less shielded) requires significantly MORE energy than removing valence electrons.' },
    { statement: 'For Magnesium (Mg), the largest jump in ionization energy occurs between IE2 and IE3.', correct: true, explanation: 'True. Mg (Group 2) has 2 valence electrons. IE3 involves removing a core electron from the stable [Ne] configuration.' },
    { statement: 'An element with configuration 1s²2s²2p⁶3s¹ likely has a very high second ionization energy (IE2).', correct: true, explanation: 'True (Element is Na). After losing the 3s¹ electron (IE1), IE2 requires breaking into the stable n=2 shell.' },
    { statement: 'Elements with lower ionization energies tend to be nonmetals.', correct: false, explanation: 'False. Lower IE means easier electron loss, which is characteristic of METALS.' },
    { statement: 'Ionization energy is the energy released when an atom gains an electron.', correct: false, explanation: 'False. That describes electron affinity. Ionization energy is the energy REQUIRED to REMOVE an electron.' },
    { statement: 'Across Period 3 (Na to Ar), Aluminum (Al) has a lower IE1 than Magnesium (Mg).', correct: true, explanation: 'True. This is an exception. Removing Al\'s single 3p electron is easier than removing one of Mg\'s stable, paired 3s electrons.' },
    { statement: 'The third ionization energy of Boron (B) is exceptionally high compared to its IE1 and IE2.', correct: true, explanation: 'True. Boron (Group 13) has 3 valence electrons (2s², 2p¹). IE3 removes the last valence electron (from 2s). IE4 requires breaking the stable 1s² core, causing the jump.' }, // Explanation refined for clarity
    { statement: 'Generally, ionization energy correlates inversely with atomic radius (larger radius, lower IE).', correct: true, explanation: 'True. Electrons further from the nucleus are held less tightly and require less energy to remove.' },
    // NOTE: Ensure statements below match your data and desired scope
    { statement: 'Transition metals (d-block) show a relatively gradual increase in ionization energy across a period compared to main group elements.', correct: true, explanation: 'True. Added d-electrons shield outer s-electrons somewhat effectively.' },
    { statement: 'The Lanthanide Contraction causes IE1 of elements like Hf and Ta to be higher than otherwise expected.', correct: true, explanation: 'True. Poor 4f shielding increases Zeff for valence electrons.' },
];
const generateTrueFalseQuestion = () => {
    if (!trueFalseStatements || trueFalseStatements.length === 0) return fallbackQuestion("No T/F statements defined.");
    const index = getRandomInt(trueFalseStatements.length);
    const selected = trueFalseStatements[index];
    return {
        type: 'true_false',
        question: `True or False: ${selected.statement}`,
        options: ['True', 'False'],
        correct: selected.correct ? 'True' : 'False',
        explanation: selected.explanation,
        uid: `tf:${index}` // UID based on statement index
    };
};


// 8. Generate IE2 Compare Question
const generateIE2CompareQuestion = () => {
    if (elementsWithIE2.length < 2) return fallbackQuestion("Not enough elements with IE2 for comparison.");
    let a, b, attempts = 0;
    do {
        [a, b] = shuffle(elementsWithIE2).slice(0, 2); attempts++;
    } while ((!a || !b || a.symbol === b.symbol) && attempts < 20);
    if (!a || !b) return fallbackQuestion("Couldn't find pair for IE2 comparison.");
    const ie2_a = a.ionizationEnergies[1];
    const ie2_b = b.ionizationEnergies[1];
    const correctElement = ie2_a > ie2_b ? a : b;
    let explanation = `${correctElement.symbol} (IE2 ≈ ${Math.round(correctElement.ionizationEnergies[1])}) has higher IE2 than ${a === correctElement ? b.symbol : a.symbol} (IE2 ≈ ${Math.round(a === correctElement ? b.ionizationEnergies[1] : a.ionizationEnergies[1])}). Reflects removing e⁻ from +1 ion.`;
    if (correctElement.group === 1) explanation += ` Removing 2nd e⁻ breaks noble gas config.`
    return {
        type: 'compare_ie2',
        question: `Higher *second* ionization energy (IE2): ${a.symbol} or ${b.symbol}?`,
        options: [a.symbol, b.symbol],
        correct: correctElement.symbol,
        explanation: explanation,
        uid: `compareIE2:${[a.symbol, b.symbol].sort().join(':')}`
    };
};

// 9. Generate Successive IE Question
const generateSuccessiveIECompareQuestion = () => {
    const elementsPool = elementsWithIE3Plus.filter(e => e.period >= 2 && e.period <= 4); // Focus on first few periods
    if (elementsPool.length < 1) return fallbackQuestion("Not enough elements for successive IE analysis.");
    let element, ies, attempts=0;
    do{
       element = elementsPool[getRandomInt(elementsPool.length)];
       ies = element.ionizationEnergies.filter(safeNumber);
       attempts++;
    }while((!ies || ies.length < 3) && attempts < 10);
    if (!ies || ies.length < 3) return fallbackQuestion("Element for Successive IE missing data.");

    const typeChoice = Math.random();
    if(typeChoice < 0.5){ // General increase reason
       const index = getRandomInt(ies.length - 1);
       const ie_n = Math.round(ies[index]); const ie_n_plus_1 = Math.round(ies[index+1]);
       const num_n = index + 1; const num_n_plus_1 = index + 2;
       return {
           type: 'successive_reason_general',
            question: `Why is IE${num_n_plus_1} (~${ie_n_plus_1}) of ${element.symbol} higher than IE${num_n} (~${ie_n})?`,
           options: shuffle(["Removing e⁻ from + ion is harder", "Atom's size increases", "Repulsion increases", "Nuclear charge decreases"]),
           correct: "Removing e⁻ from + ion is harder", explanation: `Removing e⁻ from an increasingly positive ion requires more energy due to increased Zeff.`,
            uid: `succReasonGen:${element.symbol}:${num_n}`
       };
    } else { // General order
        return {
            type: 'successive_order',
            question: `For ${element.symbol}, correct ordering of first few IEs?`,
            options: shuffle(["IE1 < IE2 < IE3", "IE1 > IE2 > IE3", "IE3 < IE1 < IE2", "IE1 ≈ IE2 ≈ IE3"]),
            correct: "IE1 < IE2 < IE3", explanation: `Successive IEs always increase.`,
             uid: `succOrder:${element.symbol}`
       };
    }
     // Can add back specific core shell question if needed
};


// 10. Generate Configuration Link Question (Requires electronConfiguration field)
const generateConfigLinkQuestion = () => {
    if (elementsWithConfig.length < 2) return fallbackQuestion("Not enough elements with config data.");
    let element, otherElement, attempts=0;
    do {
        element = elementsWithConfig[getRandomInt(elementsWithConfig.length)];
        otherElement = elementsWithConfig[getRandomInt(elementsWithConfig.length)];
        if(!element?.ionizationEnergies?.[0] || !otherElement?.ionizationEnergies?.[0]) { element=null; otherElement=null;} // Need IE1 for compare variant
        attempts++;
    } while ((!element || !otherElement || element.symbol === otherElement.symbol) && attempts < 20);
    if (!element || !otherElement) return fallbackQuestion("Couldn't find pair for config link.");

    const config = element.electronConfiguration;
    const simpleConfig = config.split(' ').slice(-1)[0] || config; // Just last part or full if single term

     const choice = Math.random();
     if(choice < 0.4) { // Compare IE1
         const ie1_el = element.ionizationEnergies[0]; const ie1_other = otherElement.ionizationEnergies[0];
         const ratio = Math.max(ie1_el, ie1_other) / Math.min(ie1_el, ie1_other);
         let correctChoice;
         if (ratio > 1.3) correctChoice = ie1_el > ie1_other ? 'Higher' : 'Lower'; else correctChoice = 'Similar';
         return {
             type: 'config_link_compare',
             question: `Element config ends ...${simpleConfig}. Compared to ${otherElement.symbol}, its IE1 is likely?`,
             options: ['Higher', 'Lower', 'Similar'], correct: correctChoice,
             explanation: `Comparing ${element.symbol} (${Math.round(ie1_el)}) vs ${otherElement.symbol} (${Math.round(ie1_other)}), it's ${correctChoice.toLowerCase()}. Config dictates stability, shielding, etc.`,
             uid: `confComp:${element.symbol}:${otherElement.symbol}`
         };
     } else if (choice < 0.8) { // Reason based on config
         let feature = "its valence electron configuration"; // Generic default
          if (config.match(/p[36]$/)) feature = `stability of the ${config.match(/p\d$/)} subshell`;
          else if (config.match(/s2$/)) feature = `stability of the filled ${config.match(/s\d$/)} subshell`;
          else if (config.match(/p1$/)) feature = `the single p-electron outside stable s-shell`;
          else if (config.match(/s1$/)) feature = `the single valence s-electron`;
          return {
             type: 'config_reason',
             question: `IE1 for element ending ...${simpleConfig} is strongly influenced by:`,
             options: shuffle([feature, "Number of core electrons", "Atomic mass", "Presence of d-orbitals"]),
             correct: feature, explanation: `Valence config determines ease of removal. Factors like subshell (s/p/d/f), filling (half/full), and shell number (n) matter.`,
             uid: `confReason:${element.symbol}`
         };
     } else { // Identify Element (use simple cases)
         const pool = elementsWithConfig.filter(e => e.period <= 3); // Limit to P1-3 for simpler unique endings
         if (pool.length < 3) return generateConfigLinkQuestion(); // Need options, retry if pool too small
         const target = pool[getRandomInt(pool.length)];
         const targetConfigEnd = target.electronConfiguration.split(' ').pop();
         let options = new Set([target.symbol]);
         shuffle(pool).forEach(el => { if (el.symbol !== target.symbol && options.size < 3) options.add(el.symbol); });
         return {
             type: 'config_identify',
             question: `An element's config ends ...${targetConfigEnd}. Which element?`,
             options: shuffle(Array.from(options)), correct: target.symbol,
             explanation: `Config ending ...${targetConfigEnd} belongs to ${target.name} (${target.symbol}, P${target.period}, G${target.group}).`,
              uid: `confID:${targetConfigEnd}`
         };
     }
};


// 11. Generate Relation to Other Trends Question (Requires atomicRadius, electronegativityPauling)
const generateTrendRelationQuestion = () => {
    const hasRadius = elementsWithRadius.length > 5;
    const hasEN = elementsWithEN.length > 5;
    const trendTypes = [];
    if (hasRadius) trendTypes.push({ name: 'Atomic Radius', relation: 'Inverse', explanation: 'Larger atoms (more shells/shielding) hold electrons less tightly => Lower IE.' });
    if (hasEN) trendTypes.push({ name: 'Electronegativity', relation: 'Direct', explanation: 'High EN means atoms attract electrons strongly (incl. their own) => Higher IE.' });
    if (trendTypes.length === 0) return fallbackQuestion("Not enough Radius/EN data for trend relation.");
    const chosenTrend = trendTypes[getRandomInt(trendTypes.length)];
    const correctRelation = `Generally ${chosenTrend.relation} Correlation`;
    const incorrectRelation = `Generally ${chosenTrend.relation === 'Inverse' ? 'Direct' : 'Inverse'} Correlation`;
    return {
        type: 'trend_relation',
        question: `General relationship between First Ionization Energy and ${chosenTrend.name}?`,
        options: shuffle([correctRelation, incorrectRelation, 'No Consistent Correlation']),
        correct: correctRelation,
        explanation: `${chosenTrend.explanation}`,
        uid: `trendRel:${chosenTrend.name.replace(/\s+/g, '')}`
    };
};

// --- Array of all Generator Functions ---
// Order can influence probability slightly if queue isn't perfectly random picking
const generators = [
    generateTrendQuestion,           // ~9%
    generateRankQuestion,            // ~9%
    generateExceptionQuestion,       // ~9%
    generatePeriod3MultiStageQuestion,// ~4.5% (combined multi ~9%)
    generatePeriod2MultiStageQuestion,// ~4.5%
    generateIEJumpQuestion,          // ~9%
    generateIdentifyGroupQuestion,   // ~9%
    generateTrueFalseQuestion,       // ~9%
    generateIE2CompareQuestion,      // ~9%
    generateSuccessiveIECompareQuestion, // ~9%
    generateConfigLinkQuestion,      // ~9% (requires config data)
    generateTrendRelationQuestion,   // ~9% (requires radius/EN data)
];
// Ensure the limit accommodates the number of unique *underlying* questions possible
const RECENT_HISTORY_LIMIT = Math.max(15, generators.length * 2);


// --- React Component ---
const IonizationEnergyActivity = ({ onBack, onPeriodicTable = () => {} }) => {
    if (typeof onBack !== 'function') {
        throw new Error('onBack prop must be a function');
    }

    const [showTable, setShowTable] = useState(false);
    const [multiStageQuestion, setMultiStageQuestion] = useState(null); // Stores the full multi-stage object
    const [question, setQuestion] = useState(null); // Current single question/stage
    const [currentStage, setCurrentStage] = useState(0);
    const [userAnswer, setUserAnswer] = useState(''); // Holds the selected option value
    const [feedback, setFeedback] = useState(null); // { type: 'correct'/'incorrect', message, explanation?, correct? }
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1); // Tracks number of top-level questions presented
    const [isLoading, setIsLoading] = useState(true);

    // Generator queue and history state using UIDs
    const generatorQueue = useRef([]);
    const [recentQuestionUIDs, setRecentQuestionUIDs] = useState([]);

     // Function to get next question - Refined logic from previous steps
     const getNextQuestion = (currentQuestionUid = null) => {
        if (generators.length === 0) {
             return { type: 'error', question: 'Error: No question generators defined.', uid: `error_${Date.now()}` };
        }
        if (generatorQueue.current.length === 0) {
             console.log("Reshuffling generator queue.");
             generatorQueue.current = shuffle([...Array(generators.length).keys()]);
             // Avoid immediate repeat of the last generator *type* if possible
             const lastGeneratorIndex = generators.findIndex(g => g === question?.generatorFunction);
             if (lastGeneratorIndex !== -1 && generatorQueue.current[0] === lastGeneratorIndex && generatorQueue.current.length > 1) {
                 [generatorQueue.current[0], generatorQueue.current[1]] = [generatorQueue.current[1], generatorQueue.current[0]];
             }
        }
        let nextQData = null;
        let attempts = 0;
        const maxAttemptsPerCycle = generators.length * 2; // Allow trying each generator ~twice

        while (!nextQData && attempts < maxAttemptsPerCycle) {
            attempts++;
            if (generatorQueue.current.length === 0) { // Reshuffle if exhausted mid-search
                 console.log("Reshuffling mid-search.");
                 generatorQueue.current = shuffle([...Array(generators.length).keys()]);
            }
            const queueIndex = getRandomInt(generatorQueue.current.length); // Pick random from *remaining* queue
            const generatorIndex = generatorQueue.current[queueIndex];
            const generatorFunc = generators[generatorIndex];
             console.log(`Attempt ${attempts}: Trying generator ${generatorFunc.name || `index ${generatorIndex}`}`);
            try {
                const candidateQ = generatorFunc();
                // Validation: Need a question object with a valid UID that isn't the current one or recent
                 if (candidateQ && candidateQ.uid && candidateQ.uid !== currentQuestionUid && !recentQuestionUIDs.includes(candidateQ.uid)) {
                    nextQData = candidateQ;
                    nextQData.generatorFunction = generatorFunc; // Tag the generator used
                     generatorQueue.current.splice(queueIndex, 1); // Remove used generator index
                     console.log(`Selected question UID: ${nextQData.uid}`);
                 } else if (candidateQ && (!candidateQ.uid || candidateQ.uid === currentQuestionUid || recentQuestionUIDs.includes(candidateQ.uid))){
                      console.log(`Skipping UID: ${candidateQ?.uid} (Invalid, current, or recent)`);
                 } else if (!candidateQ) {
                      console.warn(`Generator ${generatorFunc.name} returned null/undefined.`);
                 }
            } catch (error) {
                console.error(`Error in generator ${generatorFunc.name}:`, error);
                 // Consider removing failing generator from queue for this round? Could be risky.
                 // generatorQueue.current.splice(queueIndex, 1);
            }
        } // End while loop

         // Fallback if loop failed
        if (!nextQData) {
            console.warn(`Max attempts reached finding unique question. Using fallback.`);
             nextQData = fallbackQuestion("Could not generate unique question.");
            generatorQueue.current = shuffle([...Array(generators.length).keys()]); // Reset queue
        }
         return nextQData;
    };


    // --- Initial Load Effect ---
    useEffect(() => {
        console.log("IonizationEnergyActivity Mounted. Generating initial question.");
        const initialQData = getNextQuestion();
        if (initialQData.type === 'multi-stage') {
            setMultiStageQuestion(initialQData);
            setQuestion(initialQData.stages[0]);
            if (initialQData.stages[0]?.uid) setRecentQuestionUIDs([initialQData.stages[0].uid]);
        } else {
            setMultiStageQuestion(null);
            setQuestion(initialQData);
            if (initialQData?.uid) setRecentQuestionUIDs([initialQData.uid]);
        }
        setIsLoading(false);
        setRound(1);
        setScore(0);
    }, []);


    // --- Event Handlers ---
    const handleSubmit = (e) => {
        e?.preventDefault(); // Prevent default if called from form submit
        if (!userAnswer || !question || showFeedback || isLoading) return;
        let isCorrect = userAnswer === question.correct;
         setFeedback({
            type: isCorrect ? 'correct' : 'incorrect',
            message: isCorrect ? 'Correct!' : 'Incorrect.',
             explanation: question.explanation,
             correctAnswer: question.correct // Store correct answer for display
         });
         setShowFeedback(true);
         if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleBack = () => {
        onBack();
    }

    const handleNext = () => {
        if (isLoading) return;
        const currentQuestionUid = question?.uid;

        // Progress Multi-stage if applicable
        if (multiStageQuestion && currentStage < multiStageQuestion.stages.length - 1) {
            const nextStageIndex = currentStage + 1;
            const nextStageQuestion = multiStageQuestion.stages[nextStageIndex];
            setCurrentStage(nextStageIndex);
            setQuestion(nextStageQuestion);
            // Add stage UID to history if it's unique
            if (nextStageQuestion?.uid && !recentQuestionUIDs.includes(nextStageQuestion.uid)) {
                 setRecentQuestionUIDs(prevHistory => [...prevHistory, nextStageQuestion.uid].slice(-RECENT_HISTORY_LIMIT));
            }
             setUserAnswer('');
            setShowFeedback(false);
            setFeedback(null);
            // Keep the round number the same during a multi-stage question
            return; // Don't fetch a new top-level question yet
        }

        // --- Generate New Top-Level Question ---
        setIsLoading(true);
        const nextQData = getNextQuestion(currentQuestionUid); // Pass current UID to avoid immediate repeat

         // Update history with the new top-level question's UID
         if (nextQData?.uid && nextQData.type !== 'error') {
            setRecentQuestionUIDs(prevHistory => [...prevHistory, nextQData.uid].slice(-RECENT_HISTORY_LIMIT));
         }

         // Update state based on whether the new question is multi-stage or single
        if (nextQData.type === 'multi-stage' && Array.isArray(nextQData.stages) && nextQData.stages.length > 0) {
            setMultiStageQuestion(nextQData); // Store the whole multi-stage object
            setCurrentStage(0); // Reset stage index
            setQuestion(nextQData.stages[0]); // Set the first stage as the current question
        } else {
            setMultiStageQuestion(null); // Clear any previous multi-stage data
            setCurrentStage(0);
            setQuestion(nextQData); // Set the single new question
        }

        // Reset UI for the new question (or first stage)
        setUserAnswer('');
        setShowFeedback(false);
        setFeedback(null);
        setRound(prevRound => prevRound + 1); // Increment round for new top-level questions
        setIsLoading(false);
    };

    const togglePeriodicTable = () => {
        setShowTable(prevShowTable => {
            if (!prevShowTable) {
                onPeriodicTable();
            }
            return !prevShowTable;
        });
    };

     // Define types requiring radio buttons (adapt based on your generators)
     // This list tells the JSX which question types use the standard radio button group
    const radioTypes = ['exception', 'reasoning', 'categorize', 'trend', 'application', 'ie_jump', 'identify_group', 'true_false', 'compare_ie2', 'successive_reason_general', 'successive_order', 'config_link_compare', 'config_reason', 'config_identify', 'trend_relation'];
     // Add 'compare' here if you prefer radio buttons for symbol comparison instead of separate buttons
    const buttonChoiceTypes = ['compare', 'compare_ie2']; // Types where buttons represent the choices (e.g., element symbols)

     // Function to create reasonably unique IDs for options
    const createOptionId = (optionText, index) => {
        const sanitized = String(optionText ?? '').replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 20) || `opt${index}`;
        return `q${round}-${currentStage}-${sanitized}-${index}`; // Include round and stage for uniqueness
    };

    // --- Render Logic ---

    // Loading state prior to first question
     if (isLoading && !question) {
        return <div className="ie-activity-root loading-message">Loading Ionization Energy Activity...</div>;
    }

    // Error state if initial question generation failed fundamentally
     if (!question || question.type === 'error') {
         return (
            <div className="ie-activity-root error-message">
                <h2>Error</h2>
                <p>{question?.question || 'Failed to load questions.'}</p>
                <p>{question?.explanation || 'Please check the console for details or try refreshing.'}</p>
                <button onClick={onBack} className="ie-button ie-button-back">Back to Menu</button>
            </div>
         );
     }

     // Determine which element symbols are choices for buttonChoiceTypes
     const choiceElements = (buttonChoiceTypes.includes(question.type) && Array.isArray(question.options))
        ? question.options.map(optSymbol => elements.find(el => el.symbol === optSymbol)).filter(el => el)
        : [];


    // Main Render Output
    return (
        <div className="center-container fade-in slide-up">
            <div className="glass-card">
                <h2 className="ptable-title">Ionization Energy Activity</h2>
                <div className="ie-score-round-display">
                  Score: <span className="score-value">{score}</span> | Question: {round}
                  {multiStageQuestion && ` (Step ${currentStage + 1} of ${multiStageQuestion.stages.length})`}
                </div>

                 {/* Question Prompt */}
                <div className="ie-question-prompt" aria-live="polite">
                   {question.question || 'Loading question...'}
                </div>

                {/* Answer Area - Conditional Rendering based on question type */}
                <form onSubmit={handleSubmit} className="ie-answer-form">

                    {/* Render Radio Buttons for appropriate types */}
                    {radioTypes.includes(question.type) && Array.isArray(question.options) && !buttonChoiceTypes.includes(question.type) && (
                        <fieldset className="ie-answer-group">
                            <legend className="sr-only">{question.question}</legend>
                            {question.options.map((opt, index) => {
                                const optionValue = typeof opt !== 'string' ? JSON.stringify(opt) : opt; // Handle non-string options if necessary
                                const optionDisplay = String(opt ?? '');
                                const optionId = createOptionId(optionValue, index);
                                return (
                                    <div key={optionId} className="ie-answer-option">
                                        <input
                                            type="radio"
                                            id={optionId}
                                            name={`answer-${question.uid}`} // Unique name per question instance
                                            value={optionValue}
                                            checked={userAnswer === optionValue}
                                            onChange={() => !showFeedback && setUserAnswer(optionValue)}
                                            disabled={showFeedback || isLoading}
                                            aria-labelledby={`${optionId}-label`}
                                        />
                                        <label id={`${optionId}-label`} htmlFor={optionId}>{optionDisplay}</label>
                                    </div>
                                );
                            })}
                        </fieldset>
                    )}

                    {/* Render Buttons for specific choice types (like element symbols) */}
                     {buttonChoiceTypes.includes(question.type) && choiceElements.length > 0 && (
                         <div className="ie-button-choices">
                            {choiceElements.map((el) => (
                                 <button
                                     key={el.symbol}
                                     type="button"
                                     className={`ie-choice-button ${userAnswer === el.symbol ? 'selected' : ''} ${showFeedback ? 'disabled' : ''}`}
                                      onClick={() => !showFeedback && setUserAnswer(el.symbol)}
                                     disabled={showFeedback || isLoading}
                                 >
                                    {el.symbol} <span className="element-name">({el.name || ''})</span>
                                </button>
                            ))}
                         </div>
                     )}


                     {/* Render Select Dropdown for 'rank' type */}
                     {question.type === 'rank' && Array.isArray(question.options) && (
                        <fieldset className="ie-answer-group">
                             <legend className="sr-only">{question.question}</legend>
                             <select
                                className="ie-select"
                                value={userAnswer}
                                onChange={(e) => !showFeedback && setUserAnswer(e.target.value)}
                                disabled={showFeedback || isLoading}
                                required
                                aria-label="Select the correct ranking">
                                 <option value="" disabled={!!userAnswer}>Select Ranking...</option>
                                 {question.options.map((opt, index) => (
                                     <option key={`${createOptionId(opt,index)}`} value={opt}>
                                         {opt}
                                     </option>
                                 ))}
                             </select>
                        </fieldset>
                     )}

                    {/* Submit Button (conditionally shown) */}
                     {userAnswer && !showFeedback && (
                        <button type="submit" className="ie-button ie-button-submit" disabled={isLoading}>
                             Submit Answer
                         </button>
                     )}
                 </form>

                {/* Feedback Area */}
                 {showFeedback && feedback && (
                    <div className={`ie-feedback ${feedback.type}`}>
                        <strong>{feedback.message}</strong>
                        {feedback.type === 'incorrect' && feedback.correctAnswer && (
                            <div className="correct-answer-info">
                                Correct Answer: <strong>{feedback.correctAnswer}</strong>
                            </div>
                        )}
                        {feedback.explanation && <p className="explanation-text">{feedback.explanation}</p>}
                    </div>
                 )}

                {/* NEXT Button (conditionally shown) */}
                 {showFeedback && (
                     <button type="button" onClick={handleNext} className="ie-button ie-button-next" disabled={isLoading}>
                         {multiStageQuestion && currentStage < multiStageQuestion.stages.length - 1 ? 'Next Step' : 'Next Question'}
                     </button>
                 )}

                {/* Action Buttons: Periodic Table / Back */}
                 <div className="ie-action-buttons">
                    <button type="button" className="ie-button ie-periodic-table-button" onClick={togglePeriodicTable} disabled={isLoading}>
                         {showTable ? 'Hide' : 'Show'} Periodic Table
                     </button>
                     <button type="button" className="ie-button ie-button-back" onClick={onBack} disabled={isLoading}>
                         Back to Menu
                    </button>
                 </div>

             </div> {/* End Card */}

            {/* Periodic Table Modal */}
             {showTable && (
                <div className="ptable-modal">
                    <div className="glass-card" style={{ maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto' }}>
                         <PeriodicTable onBack={togglePeriodicTable} /> {/* Pass toggle function */}
                     </div>
                 </div>
             )}
        </div> // End Root
    );
};

// Make sure helper functions are accessible if defined outside (they are in this case)
IonizationEnergyActivity.propTypes = {
    onBack: PropTypes.func.isRequired,
    onPeriodicTable: PropTypes.func
};

IonizationEnergyActivity.defaultProps = {
    onPeriodicTable: () => {}
};

export default IonizationEnergyActivity;