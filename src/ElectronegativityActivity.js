// src/components/ElectronegativityActivity.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ElectronegativityActivity.css';
import PropTypes from 'prop-types';
// Periodic Table import removed, Topics handles table visibility
import periodicTableData from './periodic-table.json'; // Corrected import name
import './ElectronegativityActivity.css'; // Create or adapt this CSS file

// --- Utility functions (Keep as is) ---
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
const safeNumber = (val) => (typeof val === 'number' && !isNaN(val));
const safeString = (val) => (typeof val === 'string' && val.length > 0);

// --- Element Filtering for Electronegativity ---
// Focus on elements with Pauling EN, exclude noble gases, f-block for general trends
const elementsWithEN = periodicTableData.filter(e =>
    safeNumber(e.period) && e.period <= 7 &&
    safeNumber(e.number) && e.number <= 118 && // Wider range might be okay for EN display
    safeNumber(e.electronegativityPauling) && e.electronegativityPauling > 0 && // Ensure EN exists and is positive
    e.category !== 'lanthanide' &&
    e.category !== 'actinide' &&
    e.group !== 18 // Exclude noble gases as EN trend/definition differs
);

const elementsWithRadius = elementsWithEN.filter(e => safeNumber(e.atomicRadius)); // Keep for relation questions

// Filter specifically for representative elements (s & p blocks, excluding Group 18)
const representativeElementsEN = elementsWithEN.filter(e => safeNumber(e.group) && (e.group <= 2 || (e.group >= 13 && e.group <= 17)));

// --- Fallback Question Generator ---
const fallbackQuestion = (reason = "Insufficient data for this question type.") => {
    console.warn("Using fallback question:", reason);
    // Try a basic direction question as fallback
    try {
        if (generators && generators.includes(generateENDirectionQuestion)) {
            return generateENDirectionQuestion();
        }
    } catch {}
    // Absolute fallback
    return { type: 'error', question: `Error: Failed to generate question. ${reason}`, options: [], correct: '', explanation: '', uid: `error_${Date.now()}` };
}

// --- Electronegativity Question Generators ---

// 1. Compare Two Elements EN
const generateENCompareQuestion = () => {
    const pool = Math.random() < 0.7 && representativeElementsEN.length >= 2 ? representativeElementsEN : elementsWithEN;
    if (pool.length < 2) return fallbackQuestion("Not enough elements with EN for comparison.");
    let a, b, attempts = 0;
    do {
        [a, b] = shuffle(pool).slice(0, 2); attempts++;
    } while ((!a || !b || a.symbol === b.symbol || Math.abs(a.electronegativityPauling - b.electronegativityPauling) < 0.1) && attempts < 30); // Avoid identical or very close EN values
    if (!a || !b) return fallbackQuestion("Couldn't find valid pair for EN comparison.");

    const higherEN = a.electronegativityPauling > b.electronegativityPauling ? a : b;
    const lowerEN = a === higherEN ? b : a;
    const askHigher = Math.random() < 0.5; // Randomly ask for higher or lower

    return {
        type: 'compare_en',
        question: `Which element has ${askHigher ? 'HIGHER' : 'LOWER'} electronegativity: ${a.symbol} or ${b.symbol}?`,
        options: [a.symbol, b.symbol], // Will be rendered as buttons
        correct: askHigher ? higherEN.symbol : lowerEN.symbol,
        explanation: `${higherEN.symbol} (EN ≈ ${higherEN.electronegativityPauling.toFixed(2)}) has higher EN than ${lowerEN.symbol} (EN ≈ ${lowerEN.electronegativityPauling.toFixed(2)}). EN generally increases up and to the right.`,
        uid: `compareEN:${[a.symbol, b.symbol].sort().join(':')}`
    };
};

// 2. Rank Elements by EN
const generateENRankQuestion = () => {
    const pool = representativeElementsEN.length >= 4 ? representativeElementsEN : elementsWithEN;
    if (pool.length < 3) return fallbackQuestion("Not enough elements for EN ranking.");
    let elements;
    let attempts = 0;
    // Try to get elements from the same period or group for clearer trends sometimes
    const samePeriodOrGroup = Math.random() < 0.5;
    let targetPeriodOrGroup;
    if (samePeriodOrGroup) {
        targetPeriodOrGroup = shuffle(pool)[0][Math.random() < 0.5 ? 'period' : 'group'];
    }

    do {
        let potentialElements;
        if (samePeriodOrGroup && targetPeriodOrGroup) {
            potentialElements = pool.filter(e => e.period === targetPeriodOrGroup || e.group === targetPeriodOrGroup);
        } else {
            potentialElements = pool;
        }
        if (potentialElements.length < 3) potentialElements = pool; // Fallback if filter too strict
        elements = shuffle(potentialElements).slice(0, getRandomInt(2) + 3); // 3 or 4 elements
        attempts++;
    } while(elements.length < 3 && attempts < 20);

    if (elements.length < 3) return fallbackQuestion("Could not find 3 rankable elements with EN.");

    const increasing = Math.random() < 0.5;
    const sortedElements = [...elements].sort((x, y) => increasing
        ? x.electronegativityPauling - y.electronegativityPauling
        : y.electronegativityPauling - x.electronegativityPauling
    );
    const correctOrderSymbols = sortedElements.map(e => e.symbol);
    const separator = increasing ? ' < ' : ' > ';
    const correctOrderString = correctOrderSymbols.join(separator);

    let optionsSet = new Set([correctOrderString]);
    let optionAttempts = 0;
    while (optionsSet.size < 3 && optionAttempts < 20) {
         optionsSet.add(shuffle([...correctOrderSymbols]).join(separator)); optionAttempts++;
    }
    const options = shuffle(Array.from(optionsSet));

    return {
        type: 'rank_en',
        question: `Rank these elements by electronegativity (${increasing ? 'LOWEST to HIGHEST' : 'HIGHEST to LOWEST'}): ${elements.map(e => e.symbol).join(', ')}`,
        options: options, // Rendered as dropdown/select
        correct: correctOrderString,
        explanation: `Correct order (${increasing ? 'Inc.' : 'Dec.'}): ${correctOrderString}. EN increases up and right.`,
        uid: `rankEN:${elements.map(e => e.symbol).sort().join(':')}`
    };
};

// 3. Identify Highest/Lowest EN in a Set
const generateENIdentifyExtremesQuestion = () => {
    const pool = representativeElementsEN.length >= 4 ? representativeElementsEN : elementsWithEN;
    if (pool.length < 3) return fallbackQuestion("Not enough elements for EN extremes.");
    let elements;
    let attempts = 0;
    do {
        elements = shuffle(pool).slice(0, getRandomInt(3) + 3); // 3 to 5 elements
        attempts++;
    } while(elements.length < 3 && attempts < 15);
    if (elements.length < 3) return fallbackQuestion("Could not find set for EN extremes.");

    const findHighest = Math.random() < 0.5;
    let extremeElement = elements[0];
    for(let i = 1; i < elements.length; i++) {
        if (findHighest && elements[i].electronegativityPauling > extremeElement.electronegativityPauling) {
            extremeElement = elements[i];
        } else if (!findHighest && elements[i].electronegativityPauling < extremeElement.electronegativityPauling) {
            extremeElement = elements[i];
        }
    }

    return {
        type: 'identify_extreme_en',
        question: `Which element has the ${findHighest ? 'HIGHEST' : 'LOWEST'} electronegativity in this set: ${elements.map(e => e.symbol).join(', ')}?`,
        options: shuffle(elements.map(e => e.symbol)), // Rendered as radio buttons
        correct: extremeElement.symbol,
        explanation: `${extremeElement.symbol} (EN ≈ ${extremeElement.electronegativityPauling.toFixed(2)}) is the ${findHighest ? 'highest' : 'lowest'}. EN increases up and right.`,
        uid: `extremeEN:${elements.map(e => e.symbol).sort().join(':')}`
    };
};

// 4. Trend Direction Question
const generateENDirectionQuestion = () => {
    const axis = Math.random() < 0.5 ? 'across a period (left to right)' : 'down a group (top to bottom)';
    const correctBehavior = axis.includes('across') ? 'Increases' : 'Decreases';
    const incorrectBehavior = correctBehavior === 'Increases' ? 'Decreases' : 'Increases';

    return {
        type: 'direction_en',
        question: `How does electronegativity generally change as you move ${axis}?`,
        options: shuffle([correctBehavior, incorrectBehavior, 'Stays about the same', 'Increases then decreases']),
        correct: correctBehavior,
        explanation: `Electronegativity generally ${correctBehavior.toLowerCase()} ${axis}. This is due to ${axis.includes('across') ? 'increasing effective nuclear charge' : 'increased electron shells and shielding'}.`,
        uid: `directionEN:${axis.includes('across') ? 'across' : 'down'}`
    };
};

// 5. Reason for Trend Question
const generateENReasonQuestion = () => {
    const across = Math.random() < 0.5;
    const questionSubject = across ? 'across a period (left to right)' : 'down a group';
    const correctReason = across
        ? 'Increasing effective nuclear charge (Zeff)'
        : 'Increased number of electron shells and shielding';
    const distractors = across
        ? ['Decreasing Zeff', 'Increased shielding', 'Adding electrons to the same shell']
        : ['Decreasing shielding', 'Decreasing number of shells', 'Increasing Zeff pulls outer electrons closer'];

    return {
        type: 'reason_en',
        question: `What is the primary reason electronegativity generally ${across ? 'increases' : 'decreases'} ${questionSubject}?`,
        options: shuffle([correctReason, ...shuffle(distractors).slice(0, 2)]), // Correct + 2 distractors
        correct: correctReason,
        explanation: `The trend is driven by ${correctReason.toLowerCase()}, which affects the nucleus's pull on bonding electrons.`,
        uid: `reasonEN:${across ? 'across' : 'down'}`
    };
};

// 6. Identify Most Electronegative Element (Static)
const generateMostENQuestion = () => {
    return {
        type: 'static_most_en',
        question: `Which element has the highest electronegativity?`,
        options: shuffle(['F', 'O', 'Cl', 'N', 'Cs']), // Include common high EN and a low one
        correct: 'F',
        explanation: 'Fluorine (F) is the most electronegative element, assigned 3.98 on the Pauling scale. It most strongly attracts shared electrons.',
        uid: 'staticMostEN'
    };
};

// 7. True/False Statements for EN
const trueFalseStatementsEN = [
    { statement: 'Electronegativity measures the energy required to remove an electron.', correct: false, explanation: 'False. That describes ionization energy. Electronegativity measures the attraction for SHARED electrons in a bond.' },
    { statement: 'Electronegativity generally increases from left to right across a period.', correct: true, explanation: 'True. Increasing effective nuclear charge pulls bonding electrons more strongly.' },
    { statement: 'Electronegativity generally increases down a group.', correct: false, explanation: 'False. It decreases down a group because valence electrons are further from the nucleus and more shielded.' },
    { statement: 'Fluorine (F) is the most electronegative element.', correct: true, explanation: 'True. Fluorine has the highest tendency to attract electrons in a bond.' },
    { statement: 'Cesium (Cs) is one of the least electronegative elements.', correct: true, explanation: 'True. Alkali metals, especially those lower down, readily give up electrons and have low attraction for shared electrons.' },
    { statement: 'Noble gases have the highest electronegativity values.', correct: false, explanation: 'False. Pauling electronegativity is often not defined or is very low for noble gases as they rarely form bonds.' },
    { statement: 'Metals generally have lower electronegativity values than nonmetals.', correct: true, explanation: 'True. Metals tend to lose electrons (low EN), while nonmetals tend to gain or share them strongly (high EN).' },
    { statement: 'Electronegativity difference between two atoms determines bond polarity.', correct: true, explanation: 'True. A large difference leads to ionic bonds, a small difference to polar covalent, and near zero difference to nonpolar covalent bonds.' },
    { statement: 'Atomic radius and electronegativity are directly proportional.', correct: false, explanation: 'False. They are generally inversely related. Larger atoms (larger radius) usually have lower electronegativity.' },
];
const generateTrueFalseQuestionEN = () => {
    if (!trueFalseStatementsEN || trueFalseStatementsEN.length === 0) return fallbackQuestion("No T/F statements defined for EN.");
    const index = getRandomInt(trueFalseStatementsEN.length);
    const selected = trueFalseStatementsEN[index];
    return {
        type: 'true_false_en',
        question: `True or False: ${selected.statement}`,
        options: ['True', 'False'],
        correct: selected.correct ? 'True' : 'False',
        explanation: selected.explanation,
        uid: `tfEN:${index}` // UID based on statement index
    };
};

// 8. Relation to Other Trends (Radius)
const generateENTrendRelationQuestion = () => {
    if (elementsWithRadius.length < 5) return fallbackQuestion("Not enough Radius data for trend relation.");

    const chosenTrend = { name: 'Atomic Radius', relation: 'Inverse', explanation: 'Larger atoms (more shells/shielding) generally hold bonding electrons less tightly => Lower EN.' };
    const correctRelation = `Generally ${chosenTrend.relation} Correlation`;
    const incorrectRelation = `Generally ${chosenTrend.relation === 'Inverse' ? 'Direct' : 'Inverse'} Correlation`;

    return {
        type: 'trend_relation_en',
        question: `What is the general relationship between Electronegativity and ${chosenTrend.name}?`,
        options: shuffle([correctRelation, incorrectRelation, 'No Consistent Correlation']),
        correct: correctRelation,
        explanation: `${chosenTrend.explanation}`,
        uid: `trendRelEN:${chosenTrend.name.replace(/\s+/g, '')}`
    };
};

// 9. Generate EN <-> Chemical Character Link Question
const generateENCharacterLinkQuestion = () => {
    // Focus on elements with clearly high or low EN from representative blocks
    const highENPool = representativeElementsEN.filter(e => e.electronegativityPauling >= 2.8); // e.g., N, O, F, P, S, Cl, Br, I
    const lowENPool = representativeElementsEN.filter(e => e.electronegativityPauling <= 1.3); // e.g., Li, Na, K, Be, Mg, Ca, Al? (Al is borderline)

    if (highENPool.length < 1 || lowENPool.length < 1) {
        return fallbackQuestion("Not enough elements with distinctly high/low EN for character link.");
    }

    let element;
    let isHighEN;
    // Choose whether to feature a high or low EN element
    if (Math.random() < 0.5) {
        element = highENPool[getRandomInt(highENPool.length)];
        isHighEN = true;
    } else {
        element = lowENPool[getRandomInt(lowENPool.length)];
        isHighEN = false;
    }

    const approxEN = element.electronegativityPauling.toFixed(1); // Round EN for the question
    const correctCharacter = isHighEN ? 'Nonmetal' : 'Metal';
    const incorrectCharacter = isHighEN ? 'Metal' : 'Nonmetal';

    // Determine distractors - Metalloid is a good one if possible
    const options = shuffle([
        correctCharacter,
        incorrectCharacter,
        'Metalloid' // Include Metalloid as a common distractor
    ]);

    const explanation = isHighEN
        ? `A high electronegativity (like ${element.symbol}'s ≈ ${approxEN}) indicates a strong attraction for electrons, which is characteristic of nonmetals.`
        : `A low electronegativity (like ${element.symbol}'s ≈ ${approxEN}) indicates a weaker attraction for electrons (often easily lost), which is characteristic of metals.`;

    return {
        type: 'en_character_link',
        question: `${element.symbol} has a relatively ${isHighEN ? 'high' : 'low'} electronegativity (around ${approxEN}). This property suggests ${element.symbol} behaves primarily as a:`,
        options: options, // Rendered as radio buttons
        correct: correctCharacter,
        explanation: explanation,
        uid: `enCharLink:${element.symbol}`
    };
};

// --- Array of all EN Generator Functions ---
const generators = [
    generateENCompareQuestion,        // ~12.5%
    generateENRankQuestion,           // ~12.5%
    generateENIdentifyExtremesQuestion, // ~12.5%
    generateENDirectionQuestion,      // ~12.5%
    generateENReasonQuestion,         // ~12.5%
    generateMostENQuestion,           // ~12.5%
    generateTrueFalseQuestionEN,      // ~12.5%
    generateENTrendRelationQuestion,  // ~12.5% (Requires Radius data)
    generateENCharacterLinkQuestion   // ~12.5%
];
const RECENT_HISTORY_LIMIT = Math.max(15, generators.length * 2);


// --- React Component ---
const ElectronegativityActivity = ({ onBack, onShowPeriodicTable }) => {
    if (typeof onBack !== 'function') {
        throw new Error('onBack prop must be a function');
    }
    // Ensure the required prop is passed
    if (typeof onShowPeriodicTable !== 'function') {
        console.warn("onShowPeriodicTable prop MUST be provided from the parent component (e.g., Topics)!");
        // Provide a dummy function to prevent runtime errors if not passed, but log warning
        onShowPeriodicTable = () => { console.error("Attempted to show periodic table, but onShowPeriodicTable prop was missing!"); };
    }

    const [question, setQuestion] = useState(null); // Current single question
    const [userAnswer, setUserAnswer] = useState(''); // Holds the selected option value
    const [feedback, setFeedback] = useState(null); // { type: 'correct'/'incorrect', message, explanation?, correct? }
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1); // Tracks number of questions presented
    const [isLoading, setIsLoading] = useState(true);

    // Question type definitions
    const radioTypes = [
        'identify_extreme_en',
        'direction_en',
        'reason_en',
        'static_most_en',
        'true_false_en',
        'trend_relation_en',
        'en_character_link'
    ];
    const buttonChoiceTypes = ['compare_en'];
    const selectTypes = ['rank_en'];

    // Create unique option identifier
    const createOptionId = (optionValue, index) => {
        // Use a combination of option value, index, and a random component
        const sanitizedValue = String(optionValue)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_');
        return `option_${sanitizedValue}_${index}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const generatorQueue = useRef([]);
    const [recentQuestionUIDs, setRecentQuestionUIDs] = useState([]);

    // --- getNextQuestion Function (Simplified - No multi-stage check) ---
    const getNextQuestion = (currentQuestionUid = null) => {
        if (generators.length === 0) {
             return { type: 'error', question: 'Error: No EN question generators defined.', uid: `error_${Date.now()}` };
        }
        if (generatorQueue.current.length === 0) {
             console.log("Reshuffling EN generator queue.");
             generatorQueue.current = shuffle([...Array(generators.length).keys()]);
        }

        let nextQData = null;
        let attempts = 0;
        const maxAttemptsPerCycle = generators.length * 2;

        while (!nextQData && attempts < maxAttemptsPerCycle) {
            attempts++;
            if (generatorQueue.current.length === 0) {
                 console.log("Reshuffling mid-search.");
                 generatorQueue.current = shuffle([...Array(generators.length).keys()]);
            }
            const queueIndex = getRandomInt(generatorQueue.current.length);
            const generatorIndex = generatorQueue.current[queueIndex];
            const generatorFunc = generators[generatorIndex];
             console.log(`Attempt ${attempts}: Trying EN generator ${generatorFunc.name || `index ${generatorIndex}`}`);

            try {
                const candidateQ = generatorFunc();
                 if (candidateQ && candidateQ.uid && candidateQ.uid !== currentQuestionUid && !recentQuestionUIDs.includes(candidateQ.uid)) {
                    nextQData = candidateQ;
                    nextQData.generatorFunction = generatorFunc;
                     generatorQueue.current.splice(queueIndex, 1); // Remove used generator index
                     console.log(`Selected EN question UID: ${nextQData.uid}`);
                 } else if (candidateQ && (!candidateQ.uid || candidateQ.uid === currentQuestionUid || recentQuestionUIDs.includes(candidateQ.uid))){
                      console.log(`Skipping EN UID: ${candidateQ?.uid} (Invalid, current, or recent)`);
                 } else if (!candidateQ) {
                      console.warn(`EN Generator ${generatorFunc.name} returned null/undefined.`);
                 }
            } catch (error) {
                console.error(`Error in EN generator ${generatorFunc.name}:`, error);
            }
        }

        if (!nextQData) {
            console.warn(`Max attempts reached finding unique EN question. Using fallback.`);
             nextQData = fallbackQuestion("Could not generate unique EN question.");
            generatorQueue.current = shuffle([...Array(generators.length).keys()]);
        }
         return nextQData;
    };

    // --- Initial Load Effect ---
    useEffect(() => {
        console.log("ElectronegativityActivity Mounted. Generating initial question.");
        const initialQData = getNextQuestion();
        console.log("Initial Question Generated:", initialQData);
        setQuestion(initialQData); // Directly set the question
        if (initialQData?.uid) {
            console.log(`Setting recent question UID: ${initialQData.uid}`);
            setRecentQuestionUIDs([initialQData.uid]);
        }
        setIsLoading(false);
        setRound(1);
        setScore(0);
    }, []); // Keep dependencies empty for mount only

    // --- Event Handlers ---
    const handleSubmit = (e) => {
        e?.preventDefault();
        console.log('Submit triggered', { userAnswer, question, showFeedback, isLoading });
        if (!userAnswer || !question || showFeedback || isLoading) return;
        let isCorrect = userAnswer === question.correct;
        console.log(`Answer submission: ${isCorrect ? 'Correct' : 'Incorrect'}`);
         setFeedback({
            type: isCorrect ? 'correct' : 'incorrect',
            message: isCorrect ? 'Correct!' : 'Incorrect.',
             explanation: question.explanation,
             correctAnswer: question.correct
         });
         setShowFeedback(true);
         if (isCorrect) {
            setScore(prevScore => prevScore + 1);
            console.log(`Score increased to: ${score + 1}`);
        }
    };

    const handleBack = () => {
        onBack();
    }

    // --- handleNext (Simplified - Always gets a new question) ---
    const handleNext = () => {
        if (isLoading) return;
        const currentQuestionUid = question?.uid;

        setIsLoading(true);
        const nextQData = getNextQuestion(currentQuestionUid);

         if (nextQData?.uid && nextQData.type !== 'error') {
            setRecentQuestionUIDs(prevHistory => [...prevHistory, nextQData.uid].slice(-RECENT_HISTORY_LIMIT));
         }

        setQuestion(nextQData); // Set the single new question

        // Reset UI
        setUserAnswer('');
        setShowFeedback(false);
        setFeedback(null);
        setRound(prevRound => prevRound + 1); // Increment round for new question
        setIsLoading(false);
    };

    // --- Render Logic ---

     if (isLoading && !question) {
        return <div className="en-activity-root loading-message">Loading Electronegativity Activity...</div>;
    }

     if (!question || question.type === 'error') {
         return (
            <div className="en-activity-root error-message">
                <h2>Error</h2>
                <p>{question?.question || 'Failed to load questions.'}</p>
                <p>{question?.explanation || 'Please check the console for details or try refreshing.'}</p>
                <button onClick={onBack} className="en-button en-button-back">Back to Menu</button>
            </div>
         );
     }

     // Get element details for button choices
     const choiceElements = (buttonChoiceTypes.includes(question.type) && Array.isArray(question.options))
        ? question.options.map(optSymbol => periodicTableData.find(el => el.symbol === optSymbol)).filter(el => el)
        : [];

    // Main Render Output
    return (
        // Use en- prefix for CSS classes for clarity
        <div className="en-activity-root" style={{ textAlign: 'center' }}>
            {isLoading && <div className="loading-overlay">Loading...</div>}
            <div className={`en-question-card ${isLoading ? 'loading' : ''}`}>
                {/* Header */}
                <h2 className="en-card-title">Electronegativity Practice</h2>
                <div className="en-score-round-display">
                  Score: <span className="score-value">{score}</span> | Question: {round}
                </div>

                 {/* Question Prompt */}
                <div className="en-question-prompt" aria-live="polite">
                   {question.question || 'Loading question...'}
                </div>

                {/* Answer Area */}
                <form onSubmit={handleSubmit} className="en-answer-form">

                    {/* Radio Buttons */}
                    {radioTypes.includes(question.type) && Array.isArray(question.options) && (
                        <fieldset className="en-answer-group">
                            <legend className="sr-only">{question.question}</legend>
                            {question.options.map((opt, index) => {
                                const optionValue = typeof opt !== 'string' ? JSON.stringify(opt) : opt;
                                const optionDisplay = String(opt ?? '');
                                const optionId = createOptionId(optionValue, index);
                                return (
                                    <div
                                        key={optionId}
                                        className="en-answer-option"
                                        onClick={() => {
                                            if (!showFeedback && !isLoading) {
                                                console.log(`Div clicked, setting answer: ${optionValue}`);
                                                setUserAnswer(optionValue);
                                            }
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            id={optionId}
                                            name={`answer-${question.uid}`}
                                            value={optionValue}
                                            checked={userAnswer === optionValue}
                                            onChange={() => {
                                                if (!showFeedback && !isLoading) {
                                                    console.log(`Radio onChange triggered for: ${optionValue}`);
                                                }
                                            }}
                                            disabled={showFeedback || isLoading}
                                            aria-labelledby={`${optionId}-label`}
                                            style={{ pointerEvents: 'none' }}
                                        />
                                        <label
                                            id={`${optionId}-label`}
                                            htmlFor={optionId}
                                        >
                                            {optionDisplay}
                                        </label>
                                    </div>
                                );
                            })}
                        </fieldset>
                    )}

                    {/* Buttons for Choices */}
                     {buttonChoiceTypes.includes(question.type) && choiceElements.length > 0 && (
                         <div className="en-button-choices">
                            {choiceElements.map((el) => (
                                 <button key={el.symbol} type="button"
                                     className={`en-choice-button ${userAnswer === el.symbol ? 'selected' : ''} ${showFeedback ? 'disabled' : ''}`}
                                     onClick={() => !showFeedback && setUserAnswer(el.symbol)}
                                     disabled={showFeedback || isLoading} >
                                    {el.symbol} <span className="element-name">({el.name || ''})</span>
                                </button> ))}
                         </div>
                     )}

                     {/* Select Dropdown for Ranking */}
                     {selectTypes.includes(question.type) && Array.isArray(question.options) && (
                        <fieldset className="en-answer-group">
                             <legend className="sr-only">{question.question}</legend>
                             <select className="en-select" value={userAnswer}
                                onChange={(e) => !showFeedback && setUserAnswer(e.target.value)}
                                disabled={showFeedback || isLoading} required aria-label="Select the correct ranking">
                                 <option value="" disabled={!!userAnswer}>Select Ranking...</option>
                                 {question.options.map((opt, index) => (
                                     <option key={`${createOptionId(opt,index)}`} value={opt}>{opt}</option>
                                 ))}
                             </select>
                        </fieldset>
                     )}

                    {/* Submit Button */}
                     {userAnswer && !showFeedback && (
                        <button type="submit" className="en-button en-button-submit" disabled={isLoading}>
                             Submit Answer
                         </button>
                     )}
                 </form>

                {/* Feedback Area */}
                 {showFeedback && feedback && (
                    <div className={`en-feedback ${feedback.type}`}>
                        <strong>{feedback.message}</strong>
                        {feedback.type === 'incorrect' && feedback.correctAnswer && (
                            <div className="correct-answer-info"> Correct Answer: <strong>{feedback.correctAnswer}</strong> </div>
                        )}
                        {feedback.explanation && <p className="explanation-text">{feedback.explanation}</p>}
                    </div>
                 )}

                {/* NEXT Button */}
                 {showFeedback && (
                     <button type="button" onClick={handleNext} className="en-button en-button-next" disabled={isLoading}>
                         Next Question
                     </button>
                 )}

                {/* Action Buttons */}
                 <div className="en-action-buttons">
                    <button
                        type="button"
                        className="en-button en-periodic-table-button"
                        onClick={onShowPeriodicTable}
                        disabled={isLoading}
                     >
                         Show Periodic Table
                     </button>
                     <button
                        type="button"
                        className="en-button en-button-back"
                        onClick={onBack}
                        disabled={isLoading}
                     >
                         Back to Menu
                    </button>
                 </div>
             </div> {/* End Card */}
        </div>
    );
};

ElectronegativityActivity.propTypes = {
    onBack: PropTypes.func.isRequired,
    onShowPeriodicTable: PropTypes.func.isRequired
};

export default ElectronegativityActivity;