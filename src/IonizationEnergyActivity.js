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
const generators = [ generateTrendQuestion, generateRankQuestion, generateExceptionQuestion, generateMultiStageQuestion ];
// --- End of Question Generators ---


const IonizationEnergyActivity = ({ onBack }) => {
  const [showTable, setShowTable] = useState(false);
  const [multiStageQuestion, setMultiStageQuestion] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [question, setQuestion] = useState(() => {
    const result = generators[getRandomInt(generators.length)]();
    if (result.type === 'multi-stage') {
      setMultiStageQuestion(result);
      setCurrentStage(0);
      return result.stages[0];
    }
    return result;
  });
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
      return; // Don't generate a new top-level question yet
    }

    // --- Logic for generating a NEW top-level question ---
    // Reset multi-stage tracking as we are starting fresh
    setMultiStageQuestion(null);
    setCurrentStage(0);

    let nextQuestionData;    // Will hold the full object returned by the generator
    let finalQuestionObject; // Will hold the specific question object to display (e.g., stages[0])
    let attempts = 0;        // Safety counter
    const maxAttempts = 10;  // Try up to 10 times to get a different question

    do {
      // 1. Select a random generator function
      const generatorIndex = getRandomInt(generators.length);
      nextQuestionData = generators[generatorIndex](); // Execute generator

      // 2. Determine the actual question object to display and compare
      if (nextQuestionData.type === 'multi-stage') {
        // For multi-stage, the first stage is what we display/compare initially
        finalQuestionObject = nextQuestionData.stages[0];
      } else {
        // For single-stage questions, it's the direct result
        finalQuestionObject = nextQuestionData;
      }

      attempts++;
      if (attempts > maxAttempts) {
        console.warn("Max attempts reached trying to find a different question. Allowing potential repeat.");
        break; // Prevent infinite loop
      }

      // 3. Loop Condition:
      // Continue looping IF:
      // - There's more than one generator type (a choice exists)
      // - AND the final question object we determined exists
      // - AND the previous question text exists
      // - AND the final question object's text is identical to the previous one
    } while (
      generators.length > 1 &&
      finalQuestionObject &&
      previousQuestionText &&
      finalQuestionObject.question === previousQuestionText
    );

    // 4. Set the state with the chosen question data (determined after the loop)
    if (nextQuestionData.type === 'multi-stage') {
      setMultiStageQuestion(nextQuestionData); // Store the full multi-stage sequence
      setCurrentStage(0);                      // Start at stage 0
      setQuestion(nextQuestionData.stages[0]); // Display the first stage
    } else {
      setMultiStageQuestion(null);             // Ensure multi-stage state is clear
      setQuestion(nextQuestionData);           // Display the single-stage question
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
  const radioTypes = ['compare', 'exception', 'reasoning', 'categorize', 'trend', 'application'];

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