import React, { useState } from 'react';
import PropTypes from 'prop-types';

IdealGasLawActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  onShowPeriodicTable: PropTypes.func.isRequired,
};

export default function IdealGasLawActivity({ onBack, onShowPeriodicTable }) {
  // Generate a random problem each time the activity loads or restarts
  function randomInRange(min, max, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
  }
  function generateProblem() {
    // n: 0.5–3.5 mol, R: always 0.0821, T: 250–500 K, P: 0.8–3.0 atm
    const n = randomInRange(0.5, 3.5, 2);
    const R = 0.0821;
    const T = randomInRange(250, 500, 0);
    const P = randomInRange(0.8, 3.0, 2);
    const answer = Math.round((n * R * T / P) * 10) / 10;
    return { n, R, T, P, answer };
  }

  const [problem, setProblem] = useState(generateProblem());
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  // Step prompts using the random problem
  const prompts = [
    'Step 1: Rearrange PV = nRT to solve for V.',
    `Step 2: Substitute the values: n = ${problem.n}, R = ${problem.R}, T = ${problem.T}, P = ${problem.P}. Write the substituted formula.`,
    'Step 3: Calculate the volume V. (Round to 1 decimal place)'
  ];

  // Step checkers
  const checkers = [
    // Accepts various forms of rearrangement
    (input) => {
      const a = input.replace(/\s/g, '').toLowerCase();
      return a === 'v=nrt/p' || a === 'v=(nrt)/p' || a === 'v=n*r*t/p';
    },
    // Accepts any correct substitution (ignore whitespace, allow * or no * between numbers)
    (input) => {
      const a = input.replace(/\s/g, '').replace(/\*/g,'').replace(/\(/g,'').replace(/\)/g,'');
      return (
        a.includes(problem.n.toString().replace('.', '')) &&
        a.includes(problem.R.toString().replace('.', '')) &&
        a.includes(problem.T.toString()) &&
        a.includes(problem.P.toString().replace('.', ''))
      );
    },
    // Accepts numbers close to answer
    (input) => {
      const num = parseFloat(input);
      return num && Math.abs(num - problem.answer) < 0.2;
    }
  ];

  // Step feedback/hints
  const hints = [
    "Remember, to solve for V, divide both sides by P.",
    `Plug in the numbers: n = ${problem.n}, R = ${problem.R}, T = ${problem.T}, P = ${problem.P}.`,
    "Multiply numerator, then divide by denominator. Round to 1 decimal."
  ];

  // Solutions for hints only (not shown by default)
  const solutions = [
    'V = nRT / P',
    `(${problem.n})*(${problem.R})*(${problem.T})/(${problem.P})`,
    problem.answer + ' L'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkers[step](userInput)) {
      setFeedback('✅ Correct!');
      setShowHint(false);
      setTimeout(() => {
        setFeedback('');
        setUserInput('');
        setStep(step+1);
        setScore(score+1);
      }, 700);
    } else {
      setFeedback('❌ Try again.');
      setShowHint(true);
    }
  };

  const handleShowSolution = () => {
    setFeedback('The answer for this step is: ' + solutions[step]);
    setShowHint(false);
  };

  const handleRestart = () => {
    setProblem(generateProblem());
    setStep(0);
    setUserInput('');
    setFeedback('');
    setShowHint(false);
    setScore(0);
  };

  const [questionIdx, setQuestionIdx] = useState(0);

  // Conceptual and applied questions
  const questions = [
    {
      prompt: (
        <>
          <b>1. Conceptual:</b> If you keep the number of moles (n) and temperature (T) constant, what happens to the pressure (P) of a gas if you decrease the volume (V)?<br/>
          <i>Explain your reasoning using the Ideal Gas Law (PV = nRT).</i>
        </>
      ),
      check: (answer) => {
        const a = answer.toLowerCase();
        return (
          (a.includes('increase') || a.includes('go up') || a.includes('rise')) &&
          (a.includes('pressure') || a.includes('p')) &&
          (a.includes('volume') || a.includes('v'))
        );
      },
      explanation: 'According to PV = nRT, if n and T are constant, P and V are inversely related. So, decreasing V increases P.'
    },
    {
      prompt: (
        <>
          <b>2. Application:</b> You have a 2.0 L container holding 1.0 mol of an ideal gas at 300 K. What is the pressure (in atm)? (R = 0.0821 L·atm/mol·K)<br/>
          <i>Show your calculation and reasoning.</i>
        </>
      ),
      check: (answer) => {
        // Accept any answer close to 12.3 atm
        const num = parseFloat(answer);
        return num && Math.abs(num - 12.3) < 0.2;
      },
      explanation: 'P = nRT/V = (1.0 mol × 0.0821 × 300 K) / 2.0 L ≈ 12.3 atm.'
    },
    {
      prompt: (
        <>
          <b>3. Prediction:</b> If you double the temperature of a gas (in Kelvin) while keeping volume and moles constant, what will happen to the pressure? <br/>
          <i>Explain why.</i>
        </>
      ),
      check: (answer) => {
        const a = answer.toLowerCase();
        return (
          (a.includes('double') || a.includes('twice') || a.includes('2 times')) &&
          (a.includes('pressure') || a.includes('p')) &&
          (a.includes('temperature') || a.includes('t'))
        );
      },
      explanation: 'Since P = nRT/V, if n and V are constant, P is directly proportional to T. Doubling T doubles P.'
    },
    {
      prompt: (
        <>
          <b>4. Reflection:</b> Why does the Ideal Gas Law break down at very high pressures or very low temperatures?<br/>
          <i>Hint: Think about the assumptions of the law.</i>
        </>
      ),
      check: (answer) => {
        const a = answer.toLowerCase();
        return (
          a.includes('intermolecular') || a.includes('volume') || a.includes('not ideal')
        );
      },
      explanation: 'At high pressures/low temperatures, real gases deviate from ideal behavior due to intermolecular forces and finite molecular volume.'
    },
  ];


  return (
    <div className="igl-root" style={{maxWidth:'430px', minHeight:'97vh', margin:'0 auto', display:'flex', flexDirection:'column', justifyContent:'center'}}>
      <div className="igl-title" style={{fontSize:'1.5rem', margin:'0.7rem 0'}}>Ideal Gas Law: Step-by-Step</div>
      <div style={{textAlign:'center', marginBottom:8, fontSize:'1.07rem'}}>Let's go step by step!</div>
      <div className="igl-problem-card" style={{padding:'1rem 0.7rem', fontSize:'1.08rem', marginBottom:14, background:'rgba(56,189,248,0.07)', border:'1.5px solid #38bdf8', borderRadius:'11px', color:'#bae6fd', boxShadow:'0 1px 8px #38bdf822'}}>
        <b>Given:</b> n = {problem.n} mol, R = {problem.R} L·atm/mol·K, T = {problem.T} K, P = {problem.P} atm
      </div>
      <form onSubmit={handleSubmit} className="igl-form" style={{flexDirection:'column', alignItems:'stretch', background:'none', marginBottom:0}} autoComplete="off">
        <div className="igl-step" style={{marginBottom:10, fontWeight:600, fontSize:'1.08rem'}}>{prompts[step]}</div>
        <input
          type="text"
          className="igl-input"
          style={{fontSize:'1.18rem', minWidth:0, width:'97%', margin:'0 auto', marginBottom:6, padding:'0.7rem'}}
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder={step===0?"e.g. V = nRT / P": step===1?"e.g. (n)*(R)*(T)/(P)":"e.g. [your answer]"}
          required
          autoFocus
        />
        {feedback && <div className={"igl-feedback" + (feedback.startsWith('❌') ? " error" : "")}>{feedback}</div>}
        {showHint && <div className="igl-hint">{hints[step]} <button type="button" style={{fontSize:'1em',marginLeft:8}} className="igl-btn-secondary" onClick={handleShowSolution}>Show Solution</button></div>}
        <div style={{display:'flex', gap:'0.5rem', justifyContent:'center', marginTop:8, flexWrap:'wrap'}}>
          <button type="submit" className="igl-btn" style={{fontSize:'1.09rem',flex:'1 1 120px',minWidth:120}}>Check</button>
          <button type="button" className="igl-btn-secondary" style={{fontSize:'1.09rem',flex:'1 1 120px',minWidth:120}} onClick={onShowPeriodicTable}>Periodic Table</button>
          <button type="button" className="igl-btn-secondary" style={{fontSize:'1.09rem',flex:'1 1 120px',minWidth:120}} onClick={onBack}>Back</button>
        </div>
      </form>
      {step > 2 && (
        <div className="igl-problem-card" style={{textAlign:'center',marginTop:18, background:'rgba(16,185,129,0.09)', border:'1.5px solid #22d3ee', borderRadius:'11px', color:'#bbf7d0', boxShadow:'0 1px 8px #22d3ee22'}}>
          <div style={{fontWeight:700, marginBottom:8, fontSize:'1.15rem'}}>🎉 Done! You solved for V.</div>
          <button type="button" className="igl-btn" style={{marginTop:8, minWidth:140}} onClick={handleRestart}>Try Another</button>
          <button type="button" className="igl-btn-secondary" onClick={onShowPeriodicTable} style={{marginLeft:8, minWidth:140}}>Periodic Table</button>
          <button type="button" className="igl-btn-secondary" onClick={onBack} style={{marginLeft:8, minWidth:140}}>Back</button>
        </div>
      )}
    </div>
  );
}
