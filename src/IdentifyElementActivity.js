import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ShortHandConfigActivity.css'; // Reusing styles for now
import { configToSuperscript, FeedbackVisual } from './ActivityUtils';

// Data: Elements and their configurations
// Merged shorthand configs for elements up to Ca for now.
const ELEMENT_DATA = [
  { name: 'Hydrogen', symbol: 'H', atomicNumber: 1, config: '1s1', shorthandConfig: '1s1' },
  { name: 'Helium', symbol: 'He', atomicNumber: 2, config: '1s2', shorthandConfig: '1s2' },
  { name: 'Lithium', symbol: 'Li', atomicNumber: 3, config: '1s2 2s1', shorthandConfig: '[He] 2s1' },
  { name: 'Beryllium', symbol: 'Be', atomicNumber: 4, config: '1s2 2s2', shorthandConfig: '[He] 2s2' },
  { name: 'Boron', symbol: 'B', atomicNumber: 5, config: '1s2 2s2 2p1', shorthandConfig: '[He] 2s2 2p1' },
  { name: 'Carbon', symbol: 'C', atomicNumber: 6, config: '1s2 2s2 2p2', shorthandConfig: '[He] 2s2 2p2' },
  { name: 'Nitrogen', symbol: 'N', atomicNumber: 7, config: '1s2 2s2 2p3', shorthandConfig: '[He] 2s2 2p3' },
  { name: 'Oxygen', symbol: 'O', atomicNumber: 8, config: '1s2 2s2 2p4', shorthandConfig: '[He] 2s2 2p4' },
  { name: 'Fluorine', symbol: 'F', atomicNumber: 9, config: '1s2 2s2 2p5', shorthandConfig: '[He] 2s2 2p5' },
  { name: 'Neon', symbol: 'Ne', atomicNumber: 10, config: '1s2 2s2 2p6', shorthandConfig: '[He] 2s2 2p6' },
  { name: 'Sodium', symbol: 'Na', atomicNumber: 11, config: '1s2 2s2 2p6 3s1', shorthandConfig: '[Ne] 3s1' },
  { name: 'Magnesium', symbol: 'Mg', atomicNumber: 12, config: '1s2 2s2 2p6 3s2', shorthandConfig: '[Ne] 3s2' },
  { name: 'Aluminum', symbol: 'Al', atomicNumber: 13, config: '1s2 2s2 2p6 3s2 3p1', shorthandConfig: '[Ne] 3s2 3p1' },
  { name: 'Silicon', symbol: 'Si', atomicNumber: 14, config: '1s2 2s2 2p6 3s2 3p2', shorthandConfig: '[Ne] 3s2 3p2' },
  { name: 'Phosphorus', symbol: 'P', atomicNumber: 15, config: '1s2 2s2 2p6 3s2 3p3', shorthandConfig: '[Ne] 3s2 3p3' },
  { name: 'Sulfur', symbol: 'S', atomicNumber: 16, config: '1s2 2s2 2p6 3s2 3p4', shorthandConfig: '[Ne] 3s2 3p4' },
  { name: 'Chlorine', symbol: 'Cl', atomicNumber: 17, config: '1s2 2s2 2p6 3s2 3p5', shorthandConfig: '[Ne] 3s2 3p5' },
  { name: 'Argon', symbol: 'Ar', atomicNumber: 18, config: '1s2 2s2 2p6 3s2 3p6', shorthandConfig: '[Ne] 3s2 3p6' },
  { name: 'Potassium', symbol: 'K', atomicNumber: 19, config: '1s2 2s2 2p6 3s2 3p6 4s1', shorthandConfig: '[Ar] 4s1' },
  { name: 'Calcium', symbol: 'Ca', atomicNumber: 20, config: '1s2 2s2 2p6 3s2 3p6 4s2', shorthandConfig: '[Ar] 4s2' },
  // Add more elements as needed, avoiding Cr, Cu for now (and other common exceptions)
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getConstructiveFeedbackForIdentifyElement(correctElement, userAnswerSymbol, displayedConfig) {
  const isCorrect = userAnswerSymbol === correctElement.symbol;
  if (isCorrect) {
    return {
      type: 'correct',
      userAnswer: userAnswerSymbol,
      message: `Correct! ${configToSuperscript(displayedConfig)} is the configuration for ${correctElement.name} (${correctElement.symbol}).`,
      correct: correctElement.symbol,
      tip: 'Well done! You correctly identified the element.',
      missing: [], extra: [], howTo: []
    };
  }
  return {
    type: 'incorrect',
    userAnswer: userAnswerSymbol,
    message: `Incorrect. You chose ${userAnswerSymbol}.`,
    correct: correctElement.symbol,
    tip: `${configToSuperscript(displayedConfig)} is the configuration for ${correctElement.name} (${correctElement.symbol}). To find the element, count total electrons or check the highest energy subshell.`,
    missing: [], extra: [], // Not really applicable here in the same way
    howTo: [
      {
        step: 1, text: 'Configuration given:',
        code: configToSuperscript(displayedConfig)
      },
      {
        step: 2, text: 'Correct Element:',
        code: `${correctElement.name} (${correctElement.symbol})`,
        explanation: `Count the electrons: For ${correctElement.symbol}, there are ${correctElement.atomicNumber} electrons. This matches the given configuration.`
      }
    ]
  };
}

const IdentifyElementActivity = ({ onBack, onPeriodicTable, savedState, setSavedState }) => {
  // Initialize state from savedState if available, otherwise use defaults.
  const [availableElements, setAvailableElements] = useState(
    () => (savedState?.availableElements && savedState.availableElements.length > 0)
           ? savedState.availableElements
           : shuffleArray([...ELEMENT_DATA])
  );
  const [currentQuestion, setCurrentQuestion] = useState(() => savedState?.currentQuestion || null);
  const [userAnswer, setUserAnswer] = useState(() => savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(() => savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(() => savedState?.showFeedback || false);

  const generateQuestion = useCallback(() => {
    let elementsToUse = availableElements;
    if (elementsToUse.length === 0) {
      elementsToUse = shuffleArray([...ELEMENT_DATA]);
    }
    const correctElement = elementsToUse[0];
    setAvailableElements(elementsToUse.slice(1));

    // Generate distractors (other element symbols)
    const otherElements = shuffleArray(ELEMENT_DATA.filter(el => el.symbol !== correctElement.symbol));
    const distractors = otherElements.slice(0, 3).map(el => el.symbol);
    const options = shuffleArray([correctElement.symbol, ...distractors]);

    // Randomly choose to display shorthand or full config
    const useShorthand = Math.random() < 0.5;
    let displayedConfigValue = correctElement.config;
    let configTypeLabel = "Complete Configuration";

    if (useShorthand && correctElement.shorthandConfig) {
      displayedConfigValue = correctElement.shorthandConfig;
      configTypeLabel = "Noble Gas Configuration";
    }
    
    // For H and He, shorthand is same as full, so label it as "Complete" for clarity,
    // or "Standard Notation"
    if (correctElement.atomicNumber <= 2) {
        configTypeLabel = "Standard Notation";
    }

    setCurrentQuestion({
      element: correctElement,
      displayedConfig: displayedConfigValue,
      configType: configTypeLabel,
      options: options,
      correctSymbol: correctElement.symbol
    });
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
  }, [availableElements]);

  useEffect(() => {
    // If there's no current question after attempting to load from savedState,
    // then generate a new one. This handles initial load and returning from ptable
    // when there was no question saved or if the saved question was null.
    if (!currentQuestion) {
      generateQuestion();
    }
  }, [currentQuestion, generateQuestion]);
  
  // Save state up to the App component.
  useEffect(() => {
    if (setSavedState) {
        setSavedState({ availableElements, currentQuestion, userAnswer, feedback, showFeedback });
    }
  }, [availableElements, currentQuestion, userAnswer, feedback, showFeedback, setSavedState]);


  const handleSubmit = () => {
    if (!userAnswer || !currentQuestion) return;
    const feedbackResult = getConstructiveFeedbackForIdentifyElement(currentQuestion.element, userAnswer, currentQuestion.displayedConfig);
    setFeedback(feedbackResult);
    setShowFeedback(true);
  };

  const handleNext = () => {
    generateQuestion();
  };

  if (!currentQuestion) {
    return <div>Loading question...</div>; // Or a loading spinner
  }

  return (
    <div className="shc-activity-bg"> {/* Reusing from ShortHandConfigActivity.css */}
      <div className="shc-card">        {/* Reusing from ShortHandConfigActivity.css */}
        <h2 className="shc-title">      {/* Reusing from ShortHandConfigActivity.css */}
          <span role="img" aria-label="identify" className="shc-title-icon">🔎</span>
          Identify Element from Configuration
        </h2>
        
        <div className="shc-form"> {/* Using shc-form for consistent spacing */}
          <div className="shc-prompt" style={{ marginBottom: '10px' }}> {/* Reduced bottom margin slightly */}
            Which element has the following <br /> 
            <em style={{ fontSize: '0.9em', fontWeight: 'normal', color: '#f0f0f0cc' }}>({currentQuestion.configType})</em>:
            <br />
            <strong style={{ fontSize: '1.2em', marginTop: '5px', display: 'inline-block' }}>
              {configToSuperscript(currentQuestion.displayedConfig)}
            </strong>
          </div>

          <div className="shc-options"> {/* Reusing from ShortHandConfigActivity.css */}
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
            Next
          </button>
        )}

        <div className="shc-action-row"> {/* Reusing from ShortHandConfigActivity.css */}
          <button type="button" className="shc-action-btn" onClick={onPeriodicTable}>
            Periodic Table
          </button>
          <button type="button" className="shc-action-btn shc-back-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

IdentifyElementActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onPeriodicTable: PropTypes.func.isRequired, // If you want this button
  savedState: PropTypes.object,
  setSavedState: PropTypes.func
};

export default IdentifyElementActivity; 