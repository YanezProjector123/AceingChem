import React, { useState } from 'react';

export default function MeasurementLesson({ onBack }) {
  const [step, setStep] = useState(0);
  const [pollAnswer, setPollAnswer] = useState(null);
  const steps = [
    {
      title: 'Why Measure?',
      content: (
        <>
          <p>Imagine baking a cake with no measurements—yikes! Measurement makes science (and cake) possible.</p>
          <p>Would you eat a mystery cake?</p>
          <button className="ptable-btn" onClick={() => { setPollAnswer('yes'); setStep(step + 1); }}>Yes</button>
          <button className="ptable-btn" onClick={() => { setPollAnswer('no'); setStep(step + 1); }} style={{marginLeft:8}}>No</button>
        </>
      ),
    },
    {
      title: 'Meet the SI Units',
      content: (
        <>
          <p>Scientists use the SI system so everyone speaks the same measurement language.</p>
          <p>Match the unit to what it measures:</p>
          <ul>
            <li>Meter — <b>Length</b></li>
            <li>Gram — <b>Mass</b></li>
            <li>Second — <b>Time</b></li>
            <li>Kelvin — <b>Temperature</b></li>
          </ul>
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Next</button>
        </>
      ),
    },
    {
      title: 'Converting Units',
      content: (
        <>
          <p>Let’s convert: How many centimeters in a meter? (Hint: 100!)</p>
          <input placeholder="Type your answer!" style={{width:'80%',margin:'10px 0'}} />
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Next</button>
        </>
      ),
    },
    {
      title: 'Real-World Challenge',
      content: (
        <>
          <p>You need 250 mL of water for your experiment. Your beaker is marked in liters. How much is that in liters?</p>
          <input placeholder="Type your answer!" style={{width:'80%',margin:'10px 0'}} />
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Next</button>
        </>
      ),
    },
    {
      title: 'Recap & Badge',
      content: (
        <>
          <p>You’re now an SI Unit Superstar! Next time you measure, you’ll know exactly what to do.</p>
          <button className="ptable-btn" onClick={onBack}>Back to Lessons</button>
        </>
      ),
    },
  ];

  return (
    <div className="lesson-modal">
      <h2>{steps[step].title}</h2>
      <div>{steps[step].content}</div>
      {step > 0 && step < steps.length - 1 && (
        <button className="back-btn" style={{marginTop:12}} onClick={() => setStep(step - 1)}>Back</button>
      )}
      {step === 0 && (
        <button className="back-btn" style={{marginTop:12}} onClick={onBack}>Exit</button>
      )}
    </div>
  );
}
