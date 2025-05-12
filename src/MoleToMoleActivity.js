import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ShortHandConfigActivity.css'; // Reusing styles for now, can create a dedicated one later

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

// Sample balanced chemical equations and problem types
const MOLE_CONVERSION_PROBLEMS = [
  {
    equation: "2 H₂ + O₂ → 2 H₂O",
    stoichiometry: { H2: 2, O2: 1, H2O: 2 },
    questionTypes: [
      { from: 'H2', to: 'O2', text: (moles) => `If you have ${moles} moles of H₂, how many moles of O₂ are required?` },
      { from: 'H2', to: 'H2O', text: (moles) => `If ${moles} moles of H₂ react completely, how many moles of H₂O are produced?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If you have ${moles} moles of O₂, how many moles of H₂O can be produced?` },
      { from: 'O2', to: 'H2', text: (moles) => `To produce H₂O with ${moles} moles of O₂, how many moles of H₂ are needed?` },
      { from: 'H2O', to: 'H2', text: (moles) => `To produce ${moles} moles of H₂O, how many moles of H₂ are required?` },
      { from: 'H2O', to: 'O2', text: (moles) => `If ${moles} moles of H₂O are formed, how many moles of O₂ were consumed?` },
    ]
  },
  {
    equation: "N₂ + 3 H₂ → 2 NH₃",
    stoichiometry: { N2: 1, H2: 3, NH3: 2 },
    questionTypes: [
      { from: 'N2', to: 'H2', text: (moles) => `To react completely with ${moles} moles of N₂, how many moles of H₂ are needed?` },
      { from: 'H2', to: 'NH3', text: (moles) => `If ${moles} moles of H₂ react, how many moles of NH₃ are formed?` },
      { from: 'N2', to: 'NH3', text: (moles) => `From ${moles} moles of N₂, how many moles of NH₃ can be synthesized?` },
      { from: 'NH3', to: 'N2', text: (moles) => `To produce ${moles} moles of NH₃, how many moles of N₂ are required?` },
      { from: 'NH3', to: 'H2', text: (moles) => `The formation of ${moles} moles of NH₃ requires how many moles of H₂?` },
    ]
  },
  {
    equation: "CH₄ + 2 O₂ → CO₂ + 2 H₂O",
    stoichiometry: { CH4: 1, O2: 2, CO2: 1, H2O: 2 },
    questionTypes: [
      { from: 'CH4', to: 'O2', text: (moles) => `How many moles of O₂ are needed to completely burn ${moles} moles of CH₄?` },
      { from: 'CH4', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of CH₄ produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are consumed in the combustion of CH₄, how many moles of H₂O are formed?` },
      { from: 'CO2', to: 'CH4', text: (moles) => `To produce ${moles} moles of CO₂ from CH₄ combustion, how many moles of CH₄ are needed?` },
      { from: 'H2O', to: 'O2', text: (moles) => `If ${moles} moles of H₂O are produced by CH₄ combustion, how many moles of O₂ were used?` },
    ]
  },
  // Added New Equations and Question Types:
  {
    equation: "2 KClO₃ → 2 KCl + 3 O₂", // Decomposition
    stoichiometry: { KClO3: 2, KCl: 2, O2: 3 },
    questionTypes: [
      { from: 'KClO3', to: 'O2', text: (moles) => `If ${moles} moles of KClO₃ decompose, how many moles of O₂ are produced?` },
      { from: 'KClO3', to: 'KCl', text: (moles) => `Decomposition of ${moles} moles of KClO₃ will yield how many moles of KCl?` },
      { from: 'O2', to: 'KClO3', text: (moles) => `To produce ${moles} moles of O₂, how many moles of KClO₃ must decompose?` },
      { from: 'KCl', to: 'O2', text: (moles) => `If ${moles} moles of KCl are formed, how many moles of O₂ are also produced?` },
    ]
  },
  {
    equation: "Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂", // Redox in blast furnace
    stoichiometry: { Fe2O3: 1, CO: 3, Fe: 2, CO2: 3 },
    questionTypes: [
      { from: 'Fe2O3', to: 'Fe', text: (moles) => `How many moles of Fe can be produced from ${moles} moles of Fe₂O₃?` },
      { from: 'CO', to: 'CO2', text: (moles) => `If ${moles} moles of CO react, how many moles of CO₂ are formed?` },
      { from: 'Fe2O3', to: 'CO', text: (moles) => `To react completely with ${moles} moles of Fe₂O₃, how many moles of CO are needed?` },
      { from: 'Fe', to: 'CO', text: (moles) => `Production of ${moles} moles of Fe requires how many moles of CO?` },
      { from: 'CO2', to: 'Fe2O3', text: (moles) => `If ${moles} moles of CO₂ are produced, how many moles of Fe₂O₃ reacted?` },
    ]
  },
  {
    equation: "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O", // Propane combustion
    stoichiometry: { C3H8: 1, O2: 5, CO2: 3, H2O: 4 },
    questionTypes: [
      { from: 'C3H8', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of propane (C₃H₈) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are consumed, how many moles of H₂O are formed during propane combustion?` },
      { from: 'C3H8', to: 'O2', text: (moles) => `How many moles of O₂ are required to burn ${moles} moles of C₃H₈ completely?` },
      { from: 'H2O', to: 'C3H8', text: (moles) => `If ${moles} moles of H₂O are produced from burning C₃H₈, how much C₃H₈ was used?` },
    ]
  },
  {
    equation: "2 Al + 3 Cl₂ → 2 AlCl₃", // Synthesis
    stoichiometry: { Al: 2, Cl2: 3, AlCl3: 2 },
    questionTypes: [
      { from: 'Al', to: 'AlCl3', text: (moles) => `Reaction of ${moles} moles of Al will produce how many moles of AlCl₃?` },
      { from: 'Cl2', to: 'AlCl3', text: (moles) => `If ${moles} moles of Cl₂ react, how many moles of AlCl₃ are formed?` },
      { from: 'AlCl3', to: 'Al', text: (moles) => `To synthesize ${moles} moles of AlCl₃, how many moles of Al are needed?` },
    ]
  },
  {
    equation: "Zn + 2 HCl → ZnCl₂ + H₂", // Single displacement
    stoichiometry: { Zn: 1, HCl: 2, ZnCl2: 1, H2: 1 },
    questionTypes: [
      { from: 'Zn', to: 'H2', text: (moles) => `If ${moles} moles of Zn react with HCl, how many moles of H₂ are produced?` },
      { from: 'HCl', to: 'ZnCl2', text: (moles) => `Reaction of ${moles} moles of HCl will produce how many moles of ZnCl₂?` },
      { from: 'ZnCl2', to: 'HCl', text: (moles) => `Formation of ${moles} moles of ZnCl₂ requires how many moles of HCl?` },
    ]
  },
  {
    equation: "AgNO₃ + NaCl → AgCl + NaNO₃", // Double displacement (precipitation)
    stoichiometry: { AgNO3: 1, NaCl: 1, AgCl: 1, NaNO3: 1 },
    questionTypes: [
      { from: 'AgNO3', to: 'AgCl', text: (moles) => `If ${moles} moles of AgNO₃ react, how many moles of AgCl precipitate?` },
      { from: 'NaCl', to: 'NaNO3', text: (moles) => `Reaction of ${moles} moles of NaCl will produce how many moles of NaNO₃?` },
    ]
  },
  {
    equation: "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O", // Glucose combustion
    stoichiometry: { C6H12O6: 1, O2: 6, CO2: 6, H2O: 6 },
    questionTypes: [
      { from: 'C6H12O6', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of glucose (C₆H₁₂O₆) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are used to burn glucose, how many moles of H₂O are formed?` },
      { from: 'CO2', to: 'O2', text: (moles) => `Production of ${moles} moles of CO₂ from glucose requires how many moles of O₂?` },
    ]
  },
  {
    equation: "2 SO₂ + O₂ → 2 SO₃", // Sulfur dioxide oxidation
    stoichiometry: { SO2: 2, O2: 1, SO3: 2 },
    questionTypes: [
      { from: 'SO2', to: 'SO3', text: (moles) => `If ${moles} moles of SO₂ react, how many moles of SO₃ are formed?` },
      { from: 'O2', to: 'SO3', text: (moles) => `Reaction of ${moles} moles of O₂ with SO₂ produces how many moles of SO₃?` },
    ]
  },
  {
    equation: "P₄ + 5 O₂ → P₄O₁₀", // Phosphorus combustion
    stoichiometry: { P4: 1, O2: 5, P4O10: 1 },
    questionTypes: [
      { from: 'P4', to: 'P4O10', text: (moles) => `Combustion of ${moles} moles of P₄ produces how many moles of P₄O₁₀?` },
      { from: 'O2', to: 'P4O10', text: (moles) => `If ${moles} moles of O₂ react to form P₄O₁₀, how many moles of P₄O₁₀ are made?` },
    ]
  },
  {
    equation: "WO₃ + 3 H₂ → W + 3 H₂O", // Tungsten oxide reduction
    stoichiometry: { WO3: 1, H2: 3, W: 1, H2O: 3 },
    questionTypes: [
      { from: 'WO3', to: 'W', text: (moles) => `Reduction of ${moles} moles of WO₃ with H₂ yields how many moles of W?` },
      { from: 'H2', to: 'H2O', text: (moles) => `If ${moles} moles of H₂ are used to reduce WO₃, how many moles of H₂O are produced?` },
    ]
  },
  {
    equation: "C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O", // Ethanol combustion
    stoichiometry: { C2H5OH: 1, O2: 3, CO2: 2, H2O: 3 },
    questionTypes: [
      { from: 'C2H5OH', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of ethanol (C₂H₅OH) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are consumed to burn ethanol, how many moles of H₂O are formed?` },
    ]
  },
  {
    equation: "SiCl₄ + 2 Mg → Si + 2 MgCl₂", // Silicon production
    stoichiometry: { SiCl4: 1, Mg: 2, Si: 1, MgCl2: 2 },
    questionTypes: [
      { from: 'SiCl4', to: 'Si', text: (moles) => `Reaction of ${moles} moles of SiCl₄ with Mg produces how many moles of Si?` },
      { from: 'Mg', to: 'MgCl2', text: (moles) => `If ${moles} moles of Mg react, how many moles of MgCl₂ are formed?` },
    ]
  },
  {
    equation: "4 Fe + 3 O₂ → 2 Fe₂O₃", // Rusting of Iron
    stoichiometry: { Fe: 4, O2: 3, Fe2O3: 2 },
    questionTypes: [
      { from: 'Fe', to: 'Fe2O3', text: (moles) => `If ${moles} moles of Fe rust completely, how many moles of Fe₂O₃ are formed?` },
      { from: 'O2', to: 'Fe2O3', text: (moles) => `Reaction of ${moles} moles of O₂ with Fe produces how many moles of Fe₂O₃?` },
    ]
  },
  {
    equation: "2 Na + Cl₂ → 2 NaCl", // Sodium and Chlorine reaction
    stoichiometry: { Na: 2, Cl2: 1, NaCl: 2 },
    questionTypes: [
        { from: 'Na', to: 'NaCl', text: (moles) => `How many moles of NaCl are produced from ${moles} moles of Na?` },
        { from: 'Cl2', to: 'NaCl', text: (moles) => `If ${moles} moles of Cl₂ react, how many moles of NaCl are formed?` },
    ]
  },
  {
    equation: "Mg + I₂ → MgI₂", // Magnesium and Iodine reaction
    stoichiometry: { Mg: 1, I2: 1, MgI2: 1 },
    questionTypes: [
        { from: 'Mg', to: 'MgI2', text: (moles) => `Reaction of ${moles} moles of Mg with I₂ produces how many moles of MgI₂?` },
        { from: 'I2', to: 'MgI2', text: (moles) => `How many moles of MgI₂ can be formed from ${moles} moles of I₂?` },
    ]
  },
  {
    equation: "2 C₂H₂ + 5 O₂ → 4 CO₂ + 2 H₂O", // Acetylene combustion
    stoichiometry: { C2H2: 2, O2: 5, CO2: 4, H2O: 2 },
    questionTypes: [
        { from: 'C2H2', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of acetylene (C₂H₂) produces how many moles of CO₂?` },
        { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are used to burn C₂H₂, how many moles of H₂O are formed?` },
        { from: 'C2H2', to: 'O2', text: (moles) => `How many moles of O₂ are needed to completely combust ${moles} moles of C₂H₂?` },
    ]
  },
  {
    equation: "CS₂ + 3 O₂ → CO₂ + 2 SO₂", // Carbon disulfide combustion
    stoichiometry: { CS2: 1, O2: 3, CO2: 1, SO2: 2 },
    questionTypes: [
        { from: 'CS2', to: 'CO2', text: (moles) => `If ${moles} moles of CS₂ are burned, how many moles of CO₂ are produced?` },
        { from: 'O2', to: 'SO2', text: (moles) => `Combustion using ${moles} moles of O₂ will produce how many moles of SO₂ (from CS₂)?` },
    ]
  },
  {
    equation: "Sn + 2 Cl₂ → SnCl₄", // Tin (IV) chloride synthesis
    stoichiometry: { Sn: 1, Cl2: 2, SnCl4: 1 },
    questionTypes: [
        { from: 'Sn', to: 'SnCl4', text: (moles) => `How many moles of SnCl₄ can be made from ${moles} moles of Sn?` },
        { from: 'Cl2', to: 'SnCl4', text: (moles) => `If ${moles} moles of Cl₂ react, how many moles of SnCl₄ are formed?` },
    ]
  },
  {
    equation: "3 CaCl₂ + 2 Na₃PO₄ → Ca₃(PO₄)₂ + 6 NaCl", // Calcium phosphate precipitation
    stoichiometry: { CaCl2: 3, Na3PO4: 2, Ca3PO4_2: 1, NaCl: 6 }, // Note: Ca3(PO4)2 key needs to be valid JS identifier
    questionTypes: [
        { from: 'CaCl2', to: 'Ca3PO4_2', text: (moles) => `Reaction of ${moles} moles of CaCl₂ produces how many moles of Ca₃(PO₄)₂?` },
        { from: 'Na3PO4', to: 'NaCl', text: (moles) => `If ${moles} moles of Na₃PO₄ react, how many moles of NaCl are formed?` },
    ]
  },
  // Add more equations and question types here
];

const MoleToMoleActivity = ({ onBack, savedState, setSavedState, onPeriodicTable }) => {
  const [currentProblemSet, setCurrentProblemSet] = useState(() => savedState?.currentProblemSet || shuffleArray([...MOLE_CONVERSION_PROBLEMS]));
  const [problemIndex, setProblemIndex] = useState(() => savedState?.problemIndex || 0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(() => savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(() => savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(() => savedState?.showFeedback || false);
  const [score, setScore] = useState(() => savedState?.score || 0);
  const [questionsAttempted, setQuestionsAttempted] = useState(() => savedState?.questionsAttempted || 0);

  const generateQuestion = useCallback(() => {
    if (problemIndex >= currentProblemSet.length) {
      console.log("Completed all problems in this set!");
      setFeedback({ type: 'info', message: `Set complete! Your score: ${score}/${questionsAttempted}. Starting new set.` });
      setShowFeedback(true);
      return; 
    }

    const problem = currentProblemSet[problemIndex];
    const questionTypeIndex = Math.floor(Math.random() * problem.questionTypes.length);
    const questionTemplate = problem.questionTypes[questionTypeIndex];
    
    const givenMoles = parseFloat((Math.random() * 9 + 1).toFixed(1)); 
    const fromSubstance = questionTemplate.from;
    const toSubstance = questionTemplate.to;

    const molesFromCoefficient = problem.stoichiometry[fromSubstance];
    const molesToCoefficient = problem.stoichiometry[toSubstance];
    
    const correctAnswer = (givenMoles / molesFromCoefficient) * molesToCoefficient;

    setCurrentQuestion({
      equation: problem.equation,
      text: questionTemplate.text(givenMoles),
      correctAnswer: parseFloat(correctAnswer.toFixed(3)),
      fromSubstance,
      toSubstance,
      givenMoles,
      molesFromCoefficient, 
      molesToCoefficient   
    });
    
    setUserAnswer('');
  }, [problemIndex, currentProblemSet, score, questionsAttempted]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion, problemIndex]); // Regenerate if problemIndex changes (e.g. next question)

  // Save state whenever key variables change
  useEffect(() => {
    if (setSavedState) {
      setSavedState({
        currentProblemSet,
        problemIndex,
        score,
        questionsAttempted,
        userAnswer, 
        feedback,   
        showFeedback 
      });
    }
  }, [currentProblemSet, problemIndex, score, questionsAttempted, userAnswer, feedback, showFeedback, setSavedState]);


  const checkAnswer = (answerString) => {
    if (!currentQuestion || showFeedback) return; // Don't check if no question or feedback shown

    const answer = parseFloat(answerString);
    if (isNaN(answer)) {
        setFeedback({ type: 'incorrect', message: 'Please enter a valid number.' });
        setShowFeedback(true);
        return;
    }

    setQuestionsAttempted(prev => prev + 1);

    if (Math.abs(answer - currentQuestion.correctAnswer) < 0.01) {
      setFeedback({ type: 'correct', message: 'Correct! Great job!' });
      setScore(prev => prev + 1);
    } else {
      const { equation, fromSubstance, toSubstance, givenMoles, correctAnswer, molesFromCoefficient, molesToCoefficient } = currentQuestion;
      
      const explanation = `Let's break it down for the reaction: ${equation}\n\n` +
        `1. You started with: ${givenMoles} moles of ${fromSubstance}.\n` +
        `2. The problem asks for moles of ${toSubstance}.\n` +
        `3. From the balanced equation, the stoichiometric coefficients are:\n` +
        `   - ${fromSubstance}: ${molesFromCoefficient}\n` +
        `   - ${toSubstance}: ${molesToCoefficient}\n` +
        `4. This means the mole ratio of ${fromSubstance} to ${toSubstance} is ${molesFromCoefficient} : ${molesToCoefficient}.\n` +
        `5. To calculate the moles of ${toSubstance}:\n` +
        `   (${givenMoles} moles ${fromSubstance}) * (${molesToCoefficient} moles ${toSubstance} / ${molesFromCoefficient} moles ${fromSubstance})\n` +
        `   = ${correctAnswer.toFixed(3)} moles of ${toSubstance}.\n\n` +
        `So, the correct answer is ${correctAnswer.toFixed(3)} moles.`;

      setFeedback({ 
        type: 'incorrect', 
        message: `Not quite.\n${explanation}`
      });
    }
    setShowFeedback(true);
  };

  const handleUserSubmit = () => {
    checkAnswer(userAnswer);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setFeedback(null);

    if (problemIndex >= currentProblemSet.length -1 && feedback?.type === 'info' && feedback.message.startsWith('Set complete!')) {
        setCurrentProblemSet(shuffleArray([...MOLE_CONVERSION_PROBLEMS]));
        setProblemIndex(0);
    } else if (problemIndex < currentProblemSet.length) {
        setProblemIndex(prev => prev + 1);
    }
  };

  if (!currentQuestion && !(showFeedback && feedback?.type === 'info' && feedback.message.startsWith('Set complete!'))) {
    return <div className="center-container"><p>Loading mole conversion question...</p></div>; // Basic loading state
  }

  return (
    <div className="center-container fade-in slide-up">
      <div className="glass-card" style={{ minWidth: '320px', maxWidth: '650px' }}>
        <h2 className="ptable-title" style={{ fontSize: '1.8em' }}>Mole-to-Mole Conversions</h2>
        
        <div style={{ margin: '20px 0', padding: '15px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: 'var(--accent3)', letterSpacing: '0.5px' }}>
            {currentQuestion.equation.split(' ').map((part, index) => 
              isNaN(parseInt(part)) ? <span key={index}>{part} </span> : <strong style={{color: 'var(--accent2)'}} key={index}>{part} </strong>
            )}
          </p>
          <p style={{ fontSize: '1.1em', color: 'var(--text)', marginTop: '10px' }}>{currentQuestion.text}</p>
        </div>

        <input 
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer (moles)"
          className="glow-input" 
          style={{ width: '80%', padding: '12px', margin: '10px 0 20px 0', fontSize: '1.1em' }}
          disabled={showFeedback} // Disable input when feedback is shown
        />

        {showFeedback && feedback && (
          <div 
            className="feedback-container" 
            style={{
              padding: '20px',
              margin: '20px 0',
              borderRadius: '8px',
              borderLeft: `6px solid ${feedback.type === 'correct' ? 'var(--correct-green-vibrant, #66BB6A)' : feedback.type === 'incorrect' ? 'var(--incorrect-red-vibrant, #EF5350)' : 'var(--info-blue-vibrant, #42A5F5)'}`,
              backgroundColor: `var(--feedback-bg-dark, rgba(30, 30, 45, 0.85))`,
              boxShadow: `var(--feedback-shadow-dark, '0 4px 12px rgba(0,0,0,0.3)')`,
              // Text color for children will be light by default if not overridden
            }}
          >
            <h3 
              style={{
                marginTop: 0,
                marginBottom: '12px',
                color: feedback.type === 'correct' ? 'var(--correct-green-vibrant, #66BB6A)' : feedback.type === 'incorrect' ? 'var(--incorrect-red-vibrant, #EF5350)' : 'var(--info-blue-vibrant, #42A5F5)', // Using vibrant colors for title
                fontSize: '1.35em',
                fontWeight: '600',
              }}
            >
              {feedback.type === 'correct' ? 'Correct!' : feedback.type === 'incorrect' ? 'Incorrect.' : 'Info:'}
            </h3>
            <p style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              lineHeight: '1.65',
              marginTop: '0',
              marginBottom: '0',
              color: `var(--text-feedback-on-dark, #E0E0E0)`,
              fontSize: '1em',
            }}>
              {feedback.message}
            </p>
          </div>
        )}

        <div className="button-row" style={{ marginTop: '20px' }}>
          {showFeedback ? (
            <button className="ptable-btn" onClick={handleNextQuestion}>Next Question</button>
          ) : (
            <button className="ptable-btn" onClick={handleUserSubmit} disabled={!userAnswer || showFeedback}>Submit</button>
          )}
          <button className="ptable-btn" style={{ marginLeft: '15px' }} onClick={onPeriodicTable}>Periodic Table</button>
          <button className="back-btn" style={{ marginLeft: '15px' }} onClick={onBack}>Back to Topics</button>
        </div>
        <p style={{color: 'var(--accent3)', marginTop: '20px', fontSize: '1.1em'}}>Score: {score} / {questionsAttempted}</p>
      </div>
    </div>
  );
};

MoleToMoleActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
  onPeriodicTable: PropTypes.func.isRequired,
};

export default MoleToMoleActivity; 