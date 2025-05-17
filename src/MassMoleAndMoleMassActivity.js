import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

// Reusing styles from ShortHandConfigActivity, consider dedicated CSS later


// Helper to shuffle array for random question selection
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Molar masses for common compounds (g/mol)
const MOLAR_MASSES = {
  H2O: 18.015,
  CO2: 44.01,
  NaCl: 58.44,
  NH3: 17.03,
  CH4: 16.04,
  O2: 32.00,
  Fe: 55.845,
  C6H12O6: 180.156, // Glucose
  SO2: 64.066,
  HCl: 36.46,
  KClO3: 122.55,
  Al: 26.982,
  // Additional compounds for more variety
  H2SO4: 98.072,    // Sulfuric Acid
  HNO3: 63.012,     // Nitric Acid
  H3PO4: 97.994,    // Phosphoric Acid
  NaOH: 39.997,     // Sodium Hydroxide
  KOH: 56.105,      // Potassium Hydroxide
  CaCOH2: 74.092,   // Calcium Hydroxide - Corrected formula to Ca(OH)2 for clarity, key remains CaCOH2 for simplicity in JS
  MgOH2: 58.319,    // Magnesium Hydroxide - Corrected formula to Mg(OH)2, key remains MgOH2
  KCl: 74.548,      // Potassium Chloride
  Na2SO4: 142.036,  // Sodium Sulfate
  KNO3: 101.102,    // Potassium Nitrate
  CaCO3: 100.086,   // Calcium Carbonate
  MgSO4: 120.361,   // Magnesium Sulfate
  NH42SO4: 132.134, // Ammonium Sulfate - Key for (NH4)2SO4
  CuSO4: 159.602,   // Copper(II) Sulfate
  C2H5OH: 46.069,   // Ethanol
  CH3COOH: 60.052,  // Acetic Acid
  SiO2: 60.083,     // Silicon Dioxide
  Fe2O3: 159.687,   // Iron(III) Oxide
  NO2: 46.005,      // Nitrogen Dioxide
  KMnO4: 158.034,   // Potassium Permanganate
  NaHCO3: 84.007,   // Sodium Bicarbonate
  C3H8: 44.097,     // Propane
  Al2O3: 101.961,   // Aluminum Oxide
  PCl5: 208.239,    // Phosphorus Pentachloride
  SF6: 146.05,      // Sulfur Hexafluoride
  AgNO3: 169.873,   // Silver Nitrate
  BaCl2: 208.233,   // Barium Chloride
  HBr: 80.912,      // Hydrogen Bromide
  KI: 166.003,      // Potassium Iodide
};

const MASS_MOLE_CONVERSION_PROBLEMS = Object.keys(MOLAR_MASSES).map(substance => ({
  substance: substance,
  molarMass: MOLAR_MASSES[substance],
  // No complex equation, the "equation" is just the substance itself for these conversions
  equation: substance, // For display consistency, though not a reaction
  questionTypes: [
    {
      type: 'mass-to-mole',
      text: (mass, sub) => `How many moles are there in ${mass.toFixed(2)} g of ${sub}?`
    },
    {
      type: 'mole-to-mass',
      text: (moles, sub) => `What is the mass in grams of ${moles.toFixed(2)} moles of ${sub}?`
    }
  ]
}));

export default function MassMoleAndMoleMassActivity({ onBack, onShowPeriodicTable, savedState, setSavedState }) {
  // Add difficulty selection state consistent with other activities
  const [selectedDifficulty, setSelectedDifficulty] = useState(savedState?.selectedDifficulty || 0);
  
  const [currentProblemSet, setCurrentProblemSet] = useState(() => savedState?.currentProblemSet || shuffleArray([...MASS_MOLE_CONVERSION_PROBLEMS]));
  const [problemIndex, setProblemIndex] = useState(() => savedState?.problemIndex || 0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(() => savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(() => savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(() => savedState?.showFeedback || false);
  const [score, setScore] = useState(() => savedState?.score || 0);
  const [questionsAttempted, setQuestionsAttempted] = useState(() => savedState?.questionsAttempted || 0);
  const inputRef = useRef(null);

  // Helper function to get difficulty text
  const getDifficultyText = (level) => {
    switch(level) {
      case 0: return 'Basic';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      case 3: return 'Challenging';
      default: return 'Intermediate';
    }
  };

  // Handle difficulty change
  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    // Reset the current activity state with the new difficulty
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    // Save to state
    if (setSavedState) {
      setSavedState({
        ...savedState,
        selectedDifficulty: level,
      });
    }
    // Generate a new question with this difficulty level
    generateQuestionWithDifficulty(level);
  };

  // Modified question generator that uses difficulty levels
  const generateQuestionWithDifficulty = useCallback((difficultyLevel = selectedDifficulty) => {
    if (problemIndex >= currentProblemSet.length) {
      setFeedback({ type: 'info', message: `Set complete! Your score: ${score}/${questionsAttempted}. Starting new set.` });
      setShowFeedback(true);
      return;
    }

    // Get a problem from the current set
    const problem = currentProblemSet[problemIndex];
    const questionTypeIndex = Math.floor(Math.random() * problem.questionTypes.length);
    const questionTemplate = problem.questionTypes[questionTypeIndex];

    // Generate values based on difficulty level
    let value; // mass(g) or moles based on question type
    
    if (questionTemplate.type === 'mass-to-mole') {
      // Mass is given, ask for moles - adjust ranges based on difficulty
      if (difficultyLevel === 0) { // Basic - simple rounded values
        value = Math.round(5 + Math.random() * 45); // 5-50g, whole numbers
      } else if (difficultyLevel === 1) { // Intermediate
        value = parseFloat((5 + Math.random() * 70).toFixed(1)); // 5-75g, one decimal
      } else if (difficultyLevel === 2) { // Advanced
        value = parseFloat((5 + Math.random() * 95).toFixed(2)); // 5-100g, two decimals
      } else { // Challenging
        value = parseFloat((2 + Math.random() * 148).toFixed(3)); // 2-150g, three decimals
      }
    } else {
      // Moles is given, ask for mass - adjust ranges based on difficulty
      if (difficultyLevel === 0) { // Basic - simple values
        value = parseFloat((0.5 + Math.random() * 4.5).toFixed(1)); // 0.5-5 moles, one decimal
      } else if (difficultyLevel === 1) { // Intermediate
        value = parseFloat((0.25 + Math.random() * 6.75).toFixed(2)); // 0.25-7 moles, two decimals
      } else if (difficultyLevel === 2) { // Advanced
        value = parseFloat((0.1 + Math.random() * 9.9).toFixed(2)); // 0.1-10 moles, two decimals
      } else { // Challenging
        value = parseFloat((0.05 + Math.random() * 11.95).toFixed(3)); // 0.05-12 moles, three decimals
      }
    }

    const substance = problem.substance;
    const molarMass = problem.molarMass;

    const roundingOptions = [
      { type: 'default', precision: 3, textSuffix: '', placeholderSuffix: '(e.g., 1.234)' },
      { type: 'tenth', precision: 1, textSuffix: ' Round your answer to the nearest tenth.', placeholderSuffix: '(e.g., 1.2)' },
      { type: 'hundredth', precision: 2, textSuffix: ' Round your answer to the nearest hundredth.', placeholderSuffix: '(e.g., 1.23)' },
    ];
    const selectedRounding = roundingOptions[Math.floor(Math.random() * roundingOptions.length)];

    let givenValue, rawCorrectAnswer, questionText, unit;

    if (questionTemplate.type === 'mass-to-mole') {
      givenValue = parseFloat((Math.random() * 99 + 1).toFixed(2));
      rawCorrectAnswer = givenValue / molarMass;
      questionText = questionTemplate.text(givenValue, substance) + selectedRounding.textSuffix;
      unit = 'moles';
    } else { // mole-to-mass
      givenValue = parseFloat((Math.random() * 4.9 + 0.1).toFixed(2));
      rawCorrectAnswer = givenValue * molarMass;
      questionText = questionTemplate.text(givenValue, substance) + selectedRounding.textSuffix;
      unit = 'grams';
    }
    
    // The correctAnswer stored is what we precisely expect IF rounded, or to a default precision.
    const correctAnswer = parseFloat(rawCorrectAnswer.toFixed(selectedRounding.precision));

    setCurrentQuestion({
      type: questionTemplate.type,
      text: questionText,
      equation: problem.equation,
      unit: unit,
      correctAnswer: correctAnswer,
      substance: substance,
      molarMass: molarMass,
      givenValue: value,
      conversionType: questionTemplate.type,
      precision: selectedRounding.precision,
      difficulty: difficultyLevel // Add difficulty level to question object
    });
    setUserAnswer('');
    if (inputRef.current) {
        inputRef.current.focus();
    }
  }, [problemIndex, currentProblemSet, score, questionsAttempted]);

  useEffect(() => {
    generateQuestionWithDifficulty(selectedDifficulty);
  }, [generateQuestionWithDifficulty, problemIndex, selectedDifficulty]);

  useEffect(() => {
    // Save the current activity state to parent component if provided
    if (setSavedState) {
      setSavedState({
        currentProblemSet,
        problemIndex,
        currentQuestion,
        userAnswer,
        feedback,
        showFeedback,
        score,
        questionsAttempted,
        selectedDifficulty // Add selected difficulty to saved state
      });
    }
  }, [currentProblemSet, problemIndex, currentQuestion, userAnswer, feedback, showFeedback, score, questionsAttempted, selectedDifficulty, setSavedState]);

  const checkAnswer = (answerString) => {
    if (!currentQuestion || showFeedback) return;

    const answer = parseFloat(answerString);
    if (isNaN(answer)) {
      setFeedback({ type: 'incorrect', message: 'Please enter a valid number.' });
      setShowFeedback(true);
      return;
    }

    setQuestionsAttempted(prev => prev + 1);
    let explanation = '';
    const { 
        substance, molarMass, givenValue, conversionType, 
        correctAnswer: instructedCorrectAnswer, // This is the value rounded as per instruction
        rawCorrectAnswer, // The more precise calculation
        roundingType, precision 
    } = currentQuestion;

    let isCorrect = false;

    if (roundingType === 'tenth' || roundingType === 'hundredth') {
      // User's answer must match the correctAnswer when both are rounded to the specified precision.
      // We also compare against the instructedCorrectAnswer which is already rounded.
      isCorrect = Math.abs(parseFloat(answer.toFixed(precision)) - instructedCorrectAnswer) < (0.00001 / Math.pow(10, precision)); // very small tolerance for exact match after rounding
    } else { // default rounding (currently implies answer to 3 decimal places is in instructedCorrectAnswer)
       // For default, compare against the more precise rawCorrectAnswer with a wider tolerance.
       // The instructedCorrectAnswer for default is already rawCorrectAnswer.toFixed(3)
       isCorrect = Math.abs(answer - rawCorrectAnswer) < 0.01 * rawCorrectAnswer || Math.abs(answer - rawCorrectAnswer) < 0.05;
       // If the above is false, but they matched the 3-decimal rounded, also count as correct for default
       if (!isCorrect && Math.abs(answer - instructedCorrectAnswer) < 0.0005) {
        isCorrect = true;
       }
    }

    if (isCorrect) {
      // Enhanced feedback based on difficulty level
      let successMessage;
      
      // Difficulty-specific feedback messages
      switch(currentQuestion.difficulty) {
        case 0:
          successMessage = 'Correct! You have mastered the basic conversion formula.'; 
          break;
        case 1:
          successMessage = 'Great job! You are handling these intermediate conversions well.'; 
          break;
        case 2:
          successMessage = 'Excellent work! You have successfully tackled this advanced conversion problem.'; 
          break;
        case 3:
          successMessage = 'Outstanding! You have mastered this challenging conversion with precision.'; 
          break;
        default:
          successMessage = 'Correct! Great job!';
      }
      
      setFeedback({ type: 'correct', message: successMessage });
      setScore(prev => prev + 1);
    } else {
      const finalCorrectAnswerDisplay = instructedCorrectAnswer.toFixed(precision);
      if (conversionType === 'mass-to-mole') {
        explanation = `Let's break it down for converting mass of ${substance} to moles:\n\n` +
          `1. You were given: ${givenValue.toFixed(2)} g of ${substance}.\n` +
          `2. The molar mass of ${substance} is ${molarMass.toFixed(3)} g/mol.\n` +
          `3. To find moles, use the formula: moles = mass / molar mass (${givenValue.toFixed(2)} / ${molarMass.toFixed(3)} = ${rawCorrectAnswer.toFixed(4)}...).\n`;
        if (roundingType !== 'default') {
          explanation += `4. Rounded to the nearest ${roundingType}: ${finalCorrectAnswerDisplay} moles.\n\n`;
        } else {
          explanation += `4. The answer is approximately ${finalCorrectAnswerDisplay} moles.\n\n`;
        }
        explanation += `So, the correct answer is ${finalCorrectAnswerDisplay} moles.`;
      } else { // mole-to-mass
        explanation = `Let's break it down for converting moles of ${substance} to mass:\n\n` +
          `1. You were given: ${givenValue.toFixed(2)} moles of ${substance}.\n` +
          `2. The molar mass of ${substance} is ${molarMass.toFixed(3)} g/mol.\n` +
          `3. To find mass, use the formula: mass = moles × molar mass (${givenValue.toFixed(2)} × ${molarMass.toFixed(3)} = ${rawCorrectAnswer.toFixed(4)}...).\n`;
        if (roundingType !== 'default') {
          explanation += `4. Rounded to the nearest ${roundingType}: ${finalCorrectAnswerDisplay} g.\n\n`;
        } else {
          explanation += `4. The answer is approximately ${finalCorrectAnswerDisplay} g.\n\n`;
        }
        explanation += `So, the correct answer is ${finalCorrectAnswerDisplay} grams.`;
      }
      setFeedback({
        type: 'incorrect',
        message: `Not quite.\n${explanation}`
      });
    }
    setShowFeedback(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault(); // Prevent form submission page reload
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
    setUserAnswer('');

    if (problemIndex >= currentProblemSet.length -1 ) {
        // Reshuffle and start from the beginning if at the end of the set
        setCurrentProblemSet(shuffleArray([...MASS_MOLE_CONVERSION_PROBLEMS]));
        setProblemIndex(0);
    } else {
        setProblemIndex(prev => prev + 1);
    }
    // Maintain the selected difficulty when generating a new question
    generateQuestionWithDifficulty(selectedDifficulty);
  };

  if (!currentQuestion && !(showFeedback && feedback?.type === 'info')) {
    return <div className="center-container"><p>Loading mass/mole conversion question...</p></div>;
  }
  
  // Handle case where set is complete and feedback is shown
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
        <h2 className="activity-title">Mass-Mole & Mole-Mass Conversions</h2>
        
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
        
        {/* Difficulty indicator */}
        {currentQuestion && (
          <div style={{
            display: 'inline-block',
            background: currentQuestion.difficulty === 0 ? '#4ade80' : 
                      currentQuestion.difficulty === 1 ? '#60a5fa' : 
                      currentQuestion.difficulty === 2 ? '#a78bfa' : '#f87171',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.85em',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '10px'
          }}>
            {getDifficultyText(currentQuestion.difficulty)}
          </div>
        )}
        
        {currentQuestion && (
          <>
            <div className="question-area">
              <p className="question-equation">
                Substance: {currentQuestion.equation}
              </p>
              <p className="question-text">{currentQuestion.text}</p>
            </div>

            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <input
                ref={inputRef}
                type="number"
                step="any" // Allow decimals
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`Your answer (${currentQuestion.unit}) ${currentQuestion.placeholderSuffix || ''}`}
                className="activity-input"
                style={{ margin: '10px 0 20px 0' }}
                disabled={showFeedback}
              />

              {showFeedback && feedback && (
                <div
                  className={`feedback-container feedback-${feedback.type}`}
                >
                  <h3> 
                    {feedback.type === 'correct' ? 'Correct!' : feedback.type === 'incorrect' ? 'Incorrect.' : 'Info:'}
                  </h3>
                  <p>
                    {feedback.message}
                  </p>
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

MassMoleAndMoleMassActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
};

MassMoleAndMoleMassActivity.defaultProps = {
  onShowPeriodicTable: null, // Or a () => {} if preferred for optional functions
  savedState: null,
  setSavedState: () => {},
}; 