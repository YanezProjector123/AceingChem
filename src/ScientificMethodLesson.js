import React, { useState } from 'react';

export default function ScientificMethodLesson({ onBack }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: 'Welcome, Science Detective!',
      content: (
        <>
          <p>Ready to solve mysteries like a real scientist? Let's explore the Scientific Method together!</p>
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Start</button>
        </>
      ),
    },
    {
      title: 'Step 1: Observation',
      content: (
        <>
          <p>Every investigation starts with an observation. Look around you—what do you notice?</p>
          <input placeholder="Type something you notice!" style={{width:'80%',margin:'10px 0'}} />
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Next</button>
        </>
      ),
    },
    {
      title: 'Step 2: Question',
      content: (
        <>
          <p>Great! Now, turn your observation into a question. (e.g., 'Why is the sky blue?')</p>
          <input placeholder="Turn your observation into a question!" style={{width:'80%',margin:'10px 0'}} />
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Next</button>
        </>
      ),
    },
    {
      title: 'Step 3: Hypothesis',
      content: (
        <>
          <p>A hypothesis is an educated guess. What do you think the answer might be?</p>
          <input placeholder="Write your hypothesis!" style={{width:'80%',margin:'10px 0'}} />
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Next</button>
        </>
      ),
    },
    {
      title: 'Step 4: Experiment',
      content: (
        <>
          <p>Time to test your hypothesis! Imagine you could do any experiment—what would you try?</p>
          <input placeholder="Describe your experiment!" style={{width:'80%',margin:'10px 0'}} />
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Next</button>
        </>
      ),
    },
    {
      title: 'Step 5: Results & Conclusion',
      content: (
        <>
          <p>What do you think would happen? What would you conclude?</p>
          <input placeholder="Describe your results and conclusion!" style={{width:'80%',margin:'10px 0'}} />
          <button className="ptable-btn" onClick={() => setStep(step + 1)}>Finish</button>
        </>
      ),
    },
    {
      title: 'Recap',
      content: (
        <>
          <p>You've just used the Scientific Method! Every scientist starts with a question—keep asking and exploring!</p>
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
