import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable'; // Assumes you have this component
import periodicTable from './periodic-table.json'; // Assumes you have this data
// REMOVE this import if IonizationEnergyActivity.css is imported globally (e.g., in index.js or App.js)
// If it's ONLY for this component, keep the import:
import './IonizationEnergyActivity.css';

// Utility functions (Keep as they are)
const getRandomInt = (max) => Math.floor(Math.random() * max);
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// --- Question generators (Keep as they are) ---
const generateTrendQuestion = () => {
  const elementsWithIE = periodicTable.filter(e => e.period <= 6 && e.ionizationEnergies && e.ionizationEnergies[0]);
  const elements = shuffle(elementsWithIE).slice(0, 2);
  if (elements.length < 2) {
    return { type: 'compare', question: 'Which element has a higher first ionization energy: Sodium or Magnesium?', options: ['Na', 'Mg'], correct: 'Mg', explanation: 'Magnesium has a higher first ionization energy due to its position in the periodic table.' };
  }
  const [a, b] = elements;
  const correctElement = a.ionizationEnergies[0] > b.ionizationEnergies[0] ? a : b;
  return { type: 'compare', question: `Which has higher first ionization energy: ${a.symbol} or ${b.symbol}?`, options: [a.symbol, b.symbol], correct: correctElement.symbol, explanation: `${correctElement.symbol} has higher IE. Ionization energy generally increases up and to the right on the periodic table.` };
};
const generateRankQuestion = () => {
  const elementsWithIE = periodicTable.filter(e => e.period <= 4 && e.ionizationEnergies && e.ionizationEnergies[0]);
  const elements = shuffle(elementsWithIE).slice(0, 3);
  if (elements.length < 3) {
    return { type: 'rank', question: 'Rank these elements from lowest to highest first ionization energy:', options: ['Na < Mg < Al', 'Mg < Na < Al', 'Al < Na < Mg'], correct: 'Na < Mg < Al', explanation: 'Sodium has the lowest, then Magnesium, and Aluminum has the highest first ionization energy.' };
  }
  const sortedElements = [...elements].sort((x, y) => x.ionizationEnergies[0] - y.ionizationEnergies[0]);
  const correctOrderSymbols = sortedElements.map(e => e.symbol);
  const correctOrderString = correctOrderSymbols.join(' < ');
  let optionsSet = new Set([correctOrderString]);
  while (optionsSet.size < 3) { optionsSet.add(shuffle([...correctOrderSymbols]).join(' < ')); }
  const options = shuffle(Array.from(optionsSet));
  return { type: 'rank', question: 'Rank these elements from lowest to highest first ionization energy:', options: options, correct: correctOrderString, explanation: `Correct order: ${correctOrderString}. Ionization energy generally increases up and to the right.` };
};
const exceptionPairs = [ { elements: ['N', 'O'], correct: 'N', reason: 'N has a half-filled stable 2p subshell, which provides extra stability.', category: 'Half-Filled Subshell' }, { elements: ['Be', 'B'], correct: 'Be', reason: 'Be has a full stable 2s subshell, while B starts filling 2p, giving Be higher stability.', category: 'Full Subshell' }, { elements: ['Mg', 'Al'], correct: 'Mg', reason: 'Mg has a full stable 3s subshell, while Al starts filling 3p, providing Mg more stability.', category: 'Full Subshell' }, { elements: ['P', 'S'], correct: 'P', reason: 'P has a half-filled stable 3p subshell, which provides extra electron configuration stability.', category: 'Half-Filled Subshell' }, { elements: ['As', 'Se'], correct: 'As', reason: 'As has a half-filled stable 4p subshell, giving it higher stability.', category: 'Half-Filled Subshell' }, { elements: ['K', 'Ca'], correct: 'Ca', reason: 'Ca has a more stable electron configuration due to its full 4s subshell.', category: 'Trend Exception' }, { elements: ['Ga', 'Ge'], correct: 'Ge', reason: 'Ge shows a slight deviation from expected trend due to its electron configuration.', category: 'Trend Exception' } ];
const generateExceptionQuestion = () => {
  const pairData = exceptionPairs[getRandomInt(exceptionPairs.length)];
  const elementDetails = pairData.elements.map(sym => periodicTable.find(el => el.symbol === sym)).filter(Boolean);
  if (elementDetails.length < 2) return generateTrendQuestion();
  const [a, b] = elementDetails;
  const questionTypes = [
    () => ({ type: 'exception', question: `Which has higher first ionization energy: ${a.symbol} or ${b.symbol}?`, options: [a.symbol, b.symbol], correct: pairData.correct, explanation: `${pairData.correct} has higher IE because ${pairData.reason}` }),
    () => ({ type: 'reasoning', question: `Why does ${pairData.correct} have a higher first ionization energy compared to its pair?`, options: ['More protons in the nucleus', 'More stable electron configuration', 'Smaller atomic radius', pairData.reason ], correct: pairData.reason, explanation: `The key is ${pairData.reason}. Electron configuration plays a crucial role in determining ionization energy.` }),
    () => ({ type: 'categorize', question: `What category best describes the ionization energy exception between ${a.symbol} and ${b.symbol}?`, options: ['Half-Filled Subshell', 'Full Subshell', 'Trend Exception', 'No Exception' ], correct: pairData.category, explanation: `This is a ${pairData.category} case. ${pairData.reason}` })
  ];
  return questionTypes[getRandomInt(questionTypes.length)]();
};
const generateMultiStageQuestion = () => {
  // Define the elements involved in this specific multi-stage question
  const elementsInQuestion = ['Na', 'Mg', 'Al', 'Si'];
  const highestIEElement = 'Si'; // The correct answer from stage 1

  const stages = [
    {
      type: 'trend',
      question: `Which of these elements has the highest first ionization energy: ${elementsInQuestion.join(', ')}?`,
      options: elementsInQuestion,
      correct: highestIEElement,
      explanation: `${highestIEElement} has the highest first ionization energy among these Period 3 elements, following the general trend.`
    },
    {
      type: 'reasoning',
      question: `We identified ${highestIEElement} as having the highest first ionization energy among ${elementsInQuestion.join(', ')}. What is the primary reason for ${highestIEElement}'s high ionization energy in this context?`,
      options: [
        'More valence electrons than the others',
        'Significantly smaller atomic radius than the others',
        'Stable half-filled p-subshell',
        'Highest effective nuclear charge attracting valence electrons strongly'
      ],
      correct: 'Highest effective nuclear charge attracting valence electrons strongly',
      explanation: `While ${highestIEElement} is closer to a noble gas configuration, the underlying reason for higher IE across a period is the increasing effective nuclear charge pulling valence electrons more tightly.`
    },
    {
      type: 'application',
      question: `Considering the general trend that first ionization energy increases across a period (like from Na to ${highestIEElement}), how does a higher ionization energy typically affect an element's chemical reactivity?`,
      options: [
        'Higher ionization energy means less reactive (harder to remove electron)',
        'Higher ionization energy means more reactive (easier to remove electron)',
        'Ionization energy has no direct effect on reactivity',
        'Reactivity only depends on the number of valence electrons'
      ],
      correct: 'Higher ionization energy means less reactive (harder to remove electron)',
      explanation: `Elements with higher ionization energies require more energy to remove an electron, making them generally less likely to form positive ions and thus less reactive as metals.`
    }
  ];

  return {
    type: 'multi-stage',
    stages: stages,
    explanation: 'This sequence explores ionization energy trends and their consequences.'
  };
};
// --- NEW: Generator for IE Jumps ---
const generateIEJumpQuestion = () => {
  // Find elements with at least 3 IE values
  const elementsWithEnoughIE = periodicTable.filter(e =>
    e.ionizationEnergies && e.ionizationEnergies.length >= 3 && e.number <= 36 // Limit to first few periods for clarity
  );
  if (elementsWithEnoughIE.length < 1) return generateTrendQuestion(); // Fallback

  const element = elementsWithEnoughIE[getRandomInt(elementsWithEnoughIE.length)];
  const ies = element.ionizationEnergies;

  let maxRatio = 0;
  let jumpIndex = 0; // Where the jump occurs (after removing the jumpIndex electron)

  for (let i = 0; i < ies.length - 1; i++) {
    if (ies[i] > 0) { // Avoid division by zero or using null values
      const ratio = ies[i+1] / ies[i];
      if (ratio > maxRatio) {
        maxRatio = ratio;
        jumpIndex = i + 1; // Jump happens after removing the (i+1)th electron
      }
    }
  }

  // Ensure a significant jump was found, otherwise fallback
  if (maxRatio < 2.5 || jumpIndex === 0) {
    return generateTrendQuestion(); // Fallback if no clear jump
  }

  const numberWords = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth']; // For options/explanation
  const correctOption = numberWords[jumpIndex] || `${jumpIndex}th`;

  // Create plausible distractors
  let options = new Set([correctOption]);
  if (jumpIndex > 1 && numberWords[jumpIndex - 1]) options.add(numberWords[jumpIndex - 1]);
  if (numberWords[jumpIndex + 1] && (jumpIndex+1) < ies.length) options.add(numberWords[jumpIndex + 1]);
  while (options.size < 3 && options.size < numberWords.length-1) {
    let randomIdx = getRandomInt(Math.min(ies.length, numberWords.length-1)) + 1; // +1 avoid zeroth
    if(numberWords[randomIdx]) options.add(numberWords[randomIdx]);
    else break; // stop if we run out of words
  }

  return {
    type: 'ie_jump',
    question: `For element ${element.symbol} (${element.name}), the largest jump in successive ionization energies occurs *after* removing which electron?`,
    options: shuffle(Array.from(options)),
    correct: correctOption,
    explanation: `The largest jump occurs after removing the ${correctOption} electron because this involves removing an electron from a stable inner shell (noble gas configuration), requiring significantly more energy.`
  };
};

// --- NEW: Generator to Identify Group from IE Values ---
const generateIdentifyGroupQuestion = () => {
  // Focus on groups 1, 2, 13, 14 where jumps are clearer
  const targetGroups = [1, 2, 13, 14];
  const elementsWithEnoughIE = periodicTable.filter(e =>
    e.group && targetGroups.includes(e.group) &&
    e.ionizationEnergies && e.ionizationEnergies.length >= 4 && // Need at least 4 IEs
    e.period >= 2 && e.period <= 4 // Limit scope
  );

  if (elementsWithEnoughIE.length < 1) return generateRankQuestion(); // Fallback

  const element = elementsWithEnoughIE[getRandomInt(elementsWithEnoughIE.length)];
  const ies = element.ionizationEnergies.slice(0, 4).map(ie => Math.round(ie / 10) * 10); // Use first 4, round slightly

  let maxRatio = 0;
  let jumpIndex = 0;
  for (let i = 0; i < ies.length - 1; i++) {
    if (ies[i] > 0) {
      const ratio = ies[i+1] / ies[i];
      if (ratio > maxRatio) {
        maxRatio = ratio;
        jumpIndex = i + 1; // Jump occurs after removing (i+1)th electron
      }
    }
  }

  // Determine the likely group based on the jump index
  let correctGroup;
  if (jumpIndex === 1) correctGroup = 1;
  else if (jumpIndex === 2) correctGroup = 2;
  else if (jumpIndex === 3) correctGroup = 13;
  else if (jumpIndex === 4) correctGroup = 14; // Jump after 4th means group 14
  else return generateRankQuestion(); // Unexpected jump, fallback

  // Create options including the correct group and plausible distractors
  let options = new Set([`Group ${correctGroup}`]);
  const potentialDistractors = [1, 2, 13, 14, 15, 16];
  potentialDistractors.forEach(g => {
    if (g !== correctGroup && options.size < 4) {
      options.add(`Group ${g}`);
    }
  });

  return {
    type: 'identify_group',
    question: `An element has successive ionization energies (kJ/mol): ${ies.join(', ')}. To which group does this element likely belong?`,
    options: shuffle(Array.from(options)),
    correct: `Group ${correctGroup}`,
    explanation: `The largest jump occurs between IE${jumpIndex} and IE${jumpIndex + 1}, indicating the element has ${jumpIndex} valence electron(s) and likely belongs to Group ${correctGroup}.`
  };
};

// --- NEW: Generator for True/False Conceptual Questions ---
const trueFalseStatements = [
  { statement: 'Ionization energy generally increases from left to right across a period.', correct: true, explanation: 'True. Increasing effective nuclear charge across a period holds valence electrons more tightly, increasing IE.' },
  { statement: 'Ionization energy always increases smoothly from left to right across a period without exceptions.', correct: false, explanation: 'False. Exceptions occur, like between Group 2 (Be, Mg) and Group 13 (B, Al), and between Group 15 (N, P) and Group 16 (O, S), due to electron configurations (full/half-full subshells).' },
  { statement: 'Ionization energy generally decreases down a group.', correct: true, explanation: 'True. Electrons are added to higher energy levels further from the nucleus, and shielding increases, making valence electrons easier to remove.' },
  { statement: 'The second ionization energy (IE2) of an element is always lower than its first ionization energy (IE1).', correct: false, explanation: 'False. Removing an electron from a positive ion (IE2) always requires more energy than removing one from a neutral atom (IE1) due to increased effective nuclear charge.' },
  { statement: 'Sodium (Na) has a very large second ionization energy compared to its first.', correct: true, explanation: 'True. After removing the first electron (valence), the second electron must be removed from a stable inner shell (like Neon), requiring much more energy.' },
  { statement: 'Magnesium (Mg) has a larger jump between IE2 and IE3 than between IE1 and IE2.', correct: true, explanation: 'True. Mg is in Group 2. Removing the first two valence electrons is easier than removing the third, which comes from a stable inner shell.' },
  { statement: 'Noble gases have the lowest first ionization energies in their respective periods.', correct: false, explanation: 'False. Noble gases have complete, stable electron shells and the highest effective nuclear charge in their period, giving them the highest first ionization energies.' },
  { statement: 'Elements with low ionization energies tend to be nonmetals.', correct: false, explanation: 'False. Elements with low ionization energies easily lose electrons to form positive ions, which is characteristic of metals.' },
];

const generateTrueFalseQuestion = () => {
  const selected = trueFalseStatements[getRandomInt(trueFalseStatements.length)];
  return {
    type: 'true_false',
    question: `True or False: ${selected.statement}`,
    options: ['True', 'False'],
    correct: selected.correct ? 'True' : 'False',
    explanation: selected.explanation
  };
};

// --- NEW: Generator for Comparing Second Ionization Energies ---
const generateIE2CompareQuestion = () => {
  // Find elements with at least 2 IE values
  const elementsWithIE2 = periodicTable.filter(e =>
    e.ionizationEnergies && e.ionizationEnergies.length >= 2 && e.period <= 4 && e.ionizationEnergies[1] // Ensure IE2 exists
  );
  if (elementsWithIE2.length < 2) return generateTrendQuestion(); // Fallback

  const elements = shuffle(elementsWithIE2).slice(0, 2);
  const [a, b] = elements;

  // Compare IE2 values
  const correctElement = a.ionizationEnergies[1] > b.ionizationEnergies[1] ? a : b;
  const incorrectElement = correctElement === a ? b : a;

  // Basic explanation - can be enhanced later
  let explanation = `${correctElement.symbol} has a higher second ionization energy (IE2) than ${incorrectElement.symbol}. `;
  if (correctElement.group === 1 && incorrectElement.group === 2) {
    explanation += `Removing the second electron from ${correctElement.symbol} (Group 1) involves breaking a stable noble gas configuration, requiring much more energy than removing the second valence electron from ${incorrectElement.symbol} (Group 2).`;
  } else {
    explanation += 'Factors like effective nuclear charge and electron configuration after the first ionization influence IE2.';
  }

  return {
    type: 'compare_ie2',
    question: `Which element has a higher *second* ionization energy (IE2): ${a.symbol} or ${b.symbol}?`,
    options: [a.symbol, b.symbol],
    correct: correctElement.symbol,
    explanation: explanation
  };
};

// --- UPDATED generators array ---
const generators = [
  generateTrendQuestion,
  generateRankQuestion,
  generateExceptionQuestion,
  generateMultiStageQuestion,
  generateIEJumpQuestion,       // <-- ADDED
  generateIdentifyGroupQuestion,// <-- ADDED
  generateTrueFalseQuestion,    // <-- ADDED
  generateIE2CompareQuestion    // <-- ADDED
];
// --- End of Question Generators ---


const RECENT_HISTORY_LIMIT = 30; // How many questions to remember

const IonizationEnergyActivity = ({ onBack }) => {
  const [showTable, setShowTable] = useState(false);
  const [multiStageQuestion, setMultiStageQuestion] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [question, setQuestion] = useState(generateTrendQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer) return; // Don't submit if no answer selected
    setShowFeedback(true);
    if (userAnswer === question.correct) {
        // Only increment score if it's not part of a multi-stage sequence *already answered*
        // Or if it's the final stage of multi-stage, or a single stage question
       if (!multiStageQuestion || currentStage === multiStageQuestion.stages.length -1 || !showFeedback) {
            setScore(prevScore => prevScore + 1);
       }
    }
     // No return needed here for multi-stage, feedback shows, next click handles progression
  };

  const handleNext = () => {
    // Store the text of the question that was just answered/shown
    const previousQuestionText = question?.question;

    // --- Logic for finishing/progressing multi-stage ---
    if (multiStageQuestion && currentStage < multiStageQuestion.stages.length - 1) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setQuestion(multiStageQuestion.stages[nextStage]); // Show next stage
      setUserAnswer('');
      setShowFeedback(false);
      // Don't update history here, it's part of the same conceptual question
      return;
    }

    // --- Logic for generating a NEW top-level question ---
    // Reset multi-stage tracking as we are starting fresh
    setMultiStageQuestion(null);
    setCurrentStage(0);

    let nextQuestionData;
    let finalQuestionObject = null; // Initialize outside the loop
    let attempts = 0;
    // Increase maxAttempts slightly to account for history checks
    const maxAttempts = 20;

    do {
      // 1. Select a random generator function
      const generatorIndex = getRandomInt(generators.length);
      nextQuestionData = generators[generatorIndex](); // Execute generator

      // 2. Determine the actual question object to display and compare
      if (nextQuestionData.type === 'multi-stage') {
        finalQuestionObject = nextQuestionData.stages[0];
      } else {
        finalQuestionObject = nextQuestionData;
      }

      attempts++;
      if (attempts > maxAttempts) {
        console.warn(`Max attempts (${maxAttempts}) reached trying to find a non-recent question. Allowing potential repeat.`);
        break; // Prevent infinite loop
      }

      // 3. Loop Condition: REVISED
      // Continue looping IF:
      // - More than one generator type exists (variety possible)
      // - AND the determined question object is valid
      // - AND ( EITHER the question is identical to the immediately preceding one
      //         OR the question text is found within the recent history )
    } while (
      generators.length > 1 &&
      finalQuestionObject?.question && // Ensure we have a question text to check
      (
        (previousQuestionText && finalQuestionObject.question === previousQuestionText) ||
        recentQuestions.includes(finalQuestionObject.question) // Check if in history
      )
    );

    // --- Update History BEFORE setting the new question ---
    if (finalQuestionObject?.question) { // Check if we have a valid question object
      const currentQuestionText = finalQuestionObject.question;
      // Create the updated history
      const updatedHistory = [...recentQuestions, currentQuestionText];
      // Trim the history if it exceeds the limit
      if (updatedHistory.length > RECENT_HISTORY_LIMIT) {
        // Use slice to get the last RECENT_HISTORY_LIMIT elements
        setRecentQuestions(updatedHistory.slice(updatedHistory.length - RECENT_HISTORY_LIMIT));
      } else {
        setRecentQuestions(updatedHistory);
      }
    }

    // 4. Set the state with the chosen question data (determined after the loop)
    if (nextQuestionData.type === 'multi-stage') {
      setMultiStageQuestion(nextQuestionData);
      setCurrentStage(0);
      setQuestion(nextQuestionData.stages[0]);
    } else {
      // Ensure multi-stage state is clear if it's a single question
      // setMultiStageQuestion(null); // Already done above
      setQuestion(nextQuestionData);
    }

    // Reset UI elements for the new question
    setUserAnswer('');
    setShowFeedback(false);
    setRound(prevRound => prevRound + 1);
  };

  const togglePeriodicTable = () => {
    setShowTable(!showTable);
  };

  // Determine which types use radio buttons
  const radioTypes = [
    'compare', 'exception', 'reasoning', 'categorize', 'trend', 'application',
    'ie_jump', 'identify_group', 'true_false', 'compare_ie2'
  ];

  return (
    // Apply the root class for overall container styling
    // You might apply this class in a parent component instead
    <div className="ie-activity-root" style={{ textAlign: 'center' }}>

      {/* Main Card */}
      <div className="ie-question-card">

        {/* Title - Kept simple, assuming CSS handles it */}
        <h2 style={{ color: '#facc15', marginBottom: '10px', fontSize: '1.2em' }}>
          Ionization Energy
        </h2>

        {/* Score and Round Display */}
         <div style={{ margin: '5px 0 15px 0', fontSize: '0.95em', color: '#a5b4fc', fontWeight: 600, letterSpacing: 0.5 }}>
           Score: <span style={{ color: '#fde047', fontWeight: 700 }}>{score}</span> | Round: {round}
         </div>

        {/* Question Prompt */}
        <div className="ie-question-prompt">
          {question?.question || 'Loading question...'} {/* Added fallback */}
        </div>

        {/* Form for Answers */}
        {/* Check if question exists before rendering form */}
        {question && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>

            {/* --- Radio Buttons Group (Handles multiple types) --- */}
            {radioTypes.includes(question.type) && (
              <fieldset className="ie-answer-group">
                {/* Optional: Add a legend if needed */}
                {/* <legend>Select the best option:</legend> */}
                {(question.options || []).map(opt => (
                  <div key={opt} className="ie-answer-option">
                    <input
                      type="radio"
                      id={`option-${opt.replace(/\s+/g, '-')}`} // Create unique ID
                      name="answer"
                      value={opt}
                      checked={userAnswer === opt}
                      onChange={() => !showFeedback && setUserAnswer(opt)}
                      disabled={showFeedback}
                      // style={{ marginRight: '10px' }} // Use CSS instead
                    />
                    <label htmlFor={`option-${opt.replace(/\s+/g, '-')}`}>
                      {opt}
                    </label>
                  </div>
                ))}
              </fieldset>
            )}

            {/* --- Select Dropdown (Rank Type) --- */}
            {question.type === 'rank' && (
              <fieldset className="ie-answer-group">
                 {/* <legend>Select the correct ranking:</legend> */}
                 <select
                    className="ie-select" // Use CSS class
                    value={userAnswer}
                    onChange={(e) => !showFeedback && setUserAnswer(e.target.value)}
                    disabled={showFeedback}
                    // style={{ width: '100%' }} // Use CSS instead
                 >
                    <option value="">Select Ranking...</option>
                    {(question.options || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                 </select>
              </fieldset>
            )}

            {/* --- Submit / Next Button --- */}
            {!showFeedback && userAnswer && (
              <button
                type="submit"
                className="ie-button ie-button-submit" // Use CSS classes
                disabled={!userAnswer || showFeedback}
              >
                Submit
              </button>
            )}

            {showFeedback && (
               <button
                type="button" // Important: Change type to prevent form submission
                onClick={handleNext}
                className="ie-button ie-button-next" // Use CSS classes
               >
                 {multiStageQuestion && currentStage < multiStageQuestion.stages.length - 1 ? 'Next Step' : 'Next Question'}
               </button>
            )}
          </form>
        )} {/* End of question check */}


        {/* --- Feedback Area --- */}
        {showFeedback && question && ( // Check question exists
          <div className="ie-feedback">
            {userAnswer === question.correct ? (
              <div className="correct"> {/* Use CSS class */}
                  Correct! {question.explanation}
              </div>
            ) : (
              <div className="incorrect"> {/* Use CSS class */}
                Incorrect. The correct answer is: {question.correct}. <br /> {question.explanation}
              </div>
            )}
          </div>
        )}

        {/* --- Buttons for Periodic Table and Back --- */}
        {/* Placed outside the form, inside the card */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button
            className="ie-button ie-periodic-table-button" // Use CSS classes
            style={{ width: 'auto', flexGrow: 1 }} // Allow buttons to share space
            onClick={togglePeriodicTable}
          >
            Periodic Table
          </button>

          <button
             className="ie-button" // Generic button style, maybe add a specific class?
             style={{ background: '#dc2626', color: 'white', width: 'auto', flexGrow: 1 }} // Example: Red back button
            onClick={onBack}
          >
            Back
          </button>
        </div>

      </div> {/* End of ie-question-card */}


      {/* --- Periodic Table Modal --- */}
      {showTable && (
        <div className="ie-table-modal"> {/* Use CSS class */}
          <div className="ie-table-container"> {/* Use CSS class */}
            <PeriodicTable onBack={togglePeriodicTable} /> {/* Assumes PeriodicTable has its own close/back mechanism */}
          </div>
        </div>
      )}

    </div> // End of ie-activity-root
  );
};

export default IonizationEnergyActivity;