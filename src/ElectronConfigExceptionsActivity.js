import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ShortHandConfigActivity.css'; // Reusing styles for now
import { configToSuperscript, FeedbackVisual } from './ActivityUtils';

// Data: Elements with exceptional configurations
const EXCEPTION_ELEMENT_DATA = [
  { 
    name: 'Chromium', 
    symbol: 'Cr', 
    atomicNumber: 24, 
    actualConfig: '[Ar] 4s1 3d5', 
    expectedConfig: '[Ar] 4s2 3d4',
    reason: 'A half-filled d subshell (3d5) is more stable.' 
  },
  { 
    name: 'Copper', 
    symbol: 'Cu', 
    atomicNumber: 29, 
    actualConfig: '[Ar] 4s1 3d10', 
    expectedConfig: '[Ar] 4s2 3d9',
    reason: 'A completely filled d subshell (3d10) is more stable.' 
  },
  { 
    name: 'Molybdenum', 
    symbol: 'Mo', 
    atomicNumber: 42, 
    actualConfig: '[Kr] 5s1 4d5', 
    expectedConfig: '[Kr] 5s2 4d4',
    reason: 'A half-filled d subshell (4d5) is more stable.' 
  },
  { 
    name: 'Silver', 
    symbol: 'Ag', 
    atomicNumber: 47, 
    actualConfig: '[Kr] 5s1 4d10', 
    expectedConfig: '[Kr] 5s2 4d9',
    reason: 'A completely filled d subshell (4d10) is more stable.' 
  },
  { 
    name: 'Gold', 
    symbol: 'Au', 
    atomicNumber: 79, 
    actualConfig: '[Xe] 6s1 4f14 5d10', 
    expectedConfig: '[Xe] 6s2 4f14 5d9',
    reason: 'A completely filled d subshell (5d10) is more stable.' 
  },
  { 
    name: 'Palladium', 
    symbol: 'Pd', 
    atomicNumber: 46, 
    actualConfig: '[Kr] 4d10', 
    expectedConfig: '[Kr] 5s2 4d8',
    reason: 'A completely filled d subshell (4d10) and empty 5s is uniquely stable for Palladium.'
  },
  // Add more lanthanides/actinides or other tricky ones later if needed
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper function to get difficulty text - consistent with other activities
function getDifficultyText(level) {
  switch(level) {
    case 0: return 'Basic';
    case 1: return 'Intermediate';
    case 2: return 'Advanced';
    case 3: return 'Challenging';
    default: return 'Intermediate';
  }
}

// Generates feedback (can be enhanced for exceptions)
function getFeedbackForException(correctElement, userAnswerSymbol, displayedConfig, questionType, difficulty = 0) {
  const isCorrect = userAnswerSymbol === correctElement.symbol; // Assuming type 'config-to-element' for now
  
  if (isCorrect) {
    // Provide different feedback messages based on difficulty level
    const successMessages = [
      `Correct! ${configToSuperscript(displayedConfig)} is the actual configuration for ${correctElement.name} (${correctElement.symbol}).`,
      `Well done! You've identified that ${configToSuperscript(displayedConfig)} is the actual configuration for ${correctElement.name}.`,
      `Excellent! ${correctElement.name} (${correctElement.symbol}) is indeed the exception with configuration ${configToSuperscript(displayedConfig)}.`,
      `Outstanding! You've mastered this challenging electron configuration exception for ${correctElement.name}.`
    ];
    
    return {
      type: 'correct',
      userAnswer: userAnswerSymbol,
      message: successMessages[difficulty] || successMessages[0],
      correct: correctElement.symbol,
      tip: correctElement.reason || 'Well done! This is an important exception to remember.',
      missing: [], extra: [], howTo: []
    };
  }
  return {
    type: 'incorrect',
    userAnswer: userAnswerSymbol,
    message: `Incorrect. You chose ${userAnswerSymbol}.`,
    correct: correctElement.symbol,
    tip: `${configToSuperscript(displayedConfig)} is the actual configuration for ${correctElement.name} (${correctElement.symbol}). ${correctElement.reason}`,
    missing: [], extra: [],
    howTo: [
      { step: 1, text: 'Configuration given:', code: configToSuperscript(displayedConfig) },
      { step: 2, text: 'Correct Element:', code: `${correctElement.name} (${correctElement.symbol})`, explanation: correctElement.reason }
    ]
  };
}


const ElectronConfigExceptionsActivity = ({ onBack, onPeriodicTable, savedState, setSavedState }) => {
  // Add difficulty selection state - consistent with other activities
  const [selectedDifficulty, setSelectedDifficulty] = useState(() => savedState?.selectedDifficulty || null);
  
  const [availableElements, setAvailableElements] = useState(
    () => (savedState?.availableElements && savedState.availableElements.length > 0)
           ? savedState.availableElements
           : shuffleArray([...EXCEPTION_ELEMENT_DATA])
  );
  const [currentQuestion, setCurrentQuestion] = useState(() => savedState?.currentQuestion || null);
  const [userAnswer, setUserAnswer] = useState(() => savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(() => savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(() => savedState?.showFeedback || false);

  const generateQuestion = useCallback((difficultyOverride = null) => {
    // Set difficulty level (0-3: Basic, Intermediate, Advanced, Challenging)
    const difficulty = difficultyOverride !== null ? difficultyOverride : Math.floor(Math.random() * 4);
    
    let elementsToUse = availableElements;
    if (elementsToUse.length === 0) {
      elementsToUse = shuffleArray([...EXCEPTION_ELEMENT_DATA]); // Reshuffle if all used
    }
    const correctElement = elementsToUse[0];
    setAvailableElements(elementsToUse.slice(1));

    // Determine question type based on difficulty
    let displayedConfig, questionType;
    
    if (difficulty === 0) { // Basic - show actual config and ask for element (easier)
      displayedConfig = correctElement.actualConfig;
      questionType = 'config-to-element';
    } else if (difficulty === 1) { // Intermediate - still show actual config
      displayedConfig = correctElement.actualConfig;
      questionType = 'config-to-element';
    } else { // Advanced/Challenging - may show expected config and ask why it's wrong, or actual config
      // For now, stick with actual config but with more context
      displayedConfig = correctElement.actualConfig;
      questionType = 'config-to-element';
    }
    
    // Generate distractors (other element symbols from the exception list or general list)
    const otherExceptionSymbols = EXCEPTION_ELEMENT_DATA.filter(el => el.symbol !== correctElement.symbol).map(el => el.symbol);
    
    // Vary number of distractors based on difficulty
    const numDistractors = difficulty < 2 ? 3 : 4; // More options for harder difficulties
    const distractors = shuffleArray(otherExceptionSymbols).slice(0, numDistractors);
    const options = shuffleArray([correctElement.symbol, ...distractors]);

    setCurrentQuestion({
      element: correctElement,
      displayedConfig: displayedConfig,
      questionType: questionType,
      options: options,
      correctSymbol: correctElement.symbol,
      promptText: `Which element, known for its exceptional electron configuration, has the actual configuration:`,
      difficulty: difficulty // Include difficulty level in question object
    });
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
  }, [availableElements]);

  useEffect(() => {
    if (!currentQuestion) {
      generateQuestion(selectedDifficulty);
    }
  }, [currentQuestion, generateQuestion, selectedDifficulty]);
  
  useEffect(() => {
    if (setSavedState) {
        setSavedState({ 
          availableElements, 
          currentQuestion, 
          userAnswer, 
          feedback, 
          showFeedback,
          selectedDifficulty 
        });
    }
  }, [availableElements, currentQuestion, userAnswer, feedback, showFeedback, selectedDifficulty, setSavedState]);

  const handleSubmit = () => {
    if (!userAnswer || !currentQuestion) return;
    const feedbackResult = getFeedbackForException(
      currentQuestion.element, 
      userAnswer, 
      currentQuestion.displayedConfig, 
      currentQuestion.questionType,
      currentQuestion.difficulty // Pass difficulty level to feedback function
    );
    setFeedback(feedbackResult);
    setShowFeedback(true);
  };

  const handleNext = () => {
    generateQuestion(selectedDifficulty);
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (level) => {
    setSelectedDifficulty(level);
    // Reset the current activity state
    generateQuestion(level);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
  };

  if (!currentQuestion) {
    return <div style={{textAlign: 'center', color: 'white', marginTop: '30px'}}>Loading exception question...</div>;
  }

  return (
    <div className="shc-activity-bg">
      <div className="shc-card">
        <h2 className="shc-title">
          <span role="img" aria-label="warning" className="shc-title-icon">⚠️</span>
          Electron Configuration Exceptions
        </h2>
        
        {/* Difficulty selector - consistent with other activities */}
        <div style={{ marginBottom: 15, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 600, fontSize: '0.95em', color: '#f8fafc' }}>Select Difficulty Level:</label>
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
        
        <div className="shc-form">
          <div className="shc-prompt" style={{ marginBottom: '10px' }}>
            {currentQuestion.promptText} <br />
            <strong style={{ fontSize: '1.2em', marginTop: '8px', display: 'inline-block' }}>
              {configToSuperscript(currentQuestion.displayedConfig)}
            </strong>
          </div>

          <div className="shc-options">
            {currentQuestion.options.map((optionSymbol) => (
              <button
                key={optionSymbol}
                type="button"
                className={`shc-option-btn ${userAnswer === optionSymbol ? 'selected' : ''}`}
                onClick={() => !showFeedback && setUserAnswer(optionSymbol)}
                disabled={showFeedback}
              >
                {optionSymbol}
              </button>
            ))}
          </div>

          {!showFeedback && (
            <button 
              type="button" 
              className="shc-submit-btn" 
              onClick={handleSubmit} 
              disabled={!userAnswer}
            >
              Submit
            </button>
          )}
        </div>

        {showFeedback && feedback && (
          <FeedbackVisual feedback={feedback} />
        )}

        {showFeedback && (
          <button type="button" className="shc-next-btn" onClick={handleNext}>
            Next Question
          </button>
        )}

        <div className="shc-action-row">
          <button type="button" className="shc-action-btn" onClick={onPeriodicTable}>
            Periodic Table
          </button>
          <button type="button" className="shc-action-btn shc-back-btn" onClick={onBack}>
            Back to Topics
          </button>
        </div>
      </div>
    </div>
  );
};

ElectronConfigExceptionsActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onPeriodicTable: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func
};

export default ElectronConfigExceptionsActivity; 