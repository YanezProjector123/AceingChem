import React, { useState } from 'react';

// Define reusable styles
const styles = {
  modalContainer: {
    background: 'rgba(30, 30, 55, 0.9)', // Dark semi-transparent background
    backdropFilter: 'blur(10px)',
    borderRadius: '25px',
    padding: '30px 40px', // Adjusted padding
    border: '3px solid rgba(192, 132, 252, 0.4)', // Purple border
    boxShadow: '0 0 30px rgba(192, 132, 252, 0.5), 0 0 10px rgba(255, 255, 255, 0.1) inset', // Outer glow + subtle inner
    textAlign: 'center',
    maxWidth: '550px', // Limit width
    margin: '40px auto', // Center horizontally and add top/bottom margin
    color: '#e0e0ff', // Default light text color for the container
    position: 'relative', // Needed for potential absolute positioning inside if required
  },
  title: {
    color: '#facc15', // Yellow/Orange like the example title
    fontWeight: 'bold',
    marginBottom: '25px',
    fontSize: '2em',
    textShadow: '0 0 10px rgba(250, 204, 21, 0.6)', // Glow effect
  },
  paragraph: {
    marginBottom: '20px',
    fontSize: '1.1em',
    lineHeight: '1.6',
    color: '#d1d5db', // Light grey/lavender text
  },
  buttonBase: {
    padding: '12px 28px',
    borderRadius: '15px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    margin: '10px 8px', // Spacing between buttons
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    outline: 'none',
  },
  buttonPrimary: { // For 'Yes', 'Next', 'Mixture'
    background: 'linear-gradient(to right, #facc15, #f59e42)', // Yellow/Orange gradient
    color: '#1f2937', // Dark text
  },
  buttonSecondary: { // For 'No', 'Pure Substance'
    background: 'linear-gradient(to right, #60a5fa, #3b82f6)', // Blue gradient
    color: '#ffffff', // Light text
  },
  buttonNavigation: { // For 'Back', 'Exit'
    background: 'linear-gradient(to right, #f472b6, #ec4899)', // Pink gradient like target
    color: '#ffffff', // Light text
    marginTop: '25px', // Extra top margin for nav buttons
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
    textAlign: 'left', // Align list items left for readability
    maxWidth: '300px', // Limit width of list
    display: 'inline-block', // Center the block
  },
  listItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '10px',
    color: '#e0e0ff',
  },
  listItemHighlight: { // For the classification (Solid, Liquid, etc.)
    color: '#facc15', // Highlight color
    fontWeight: 'bold',
    marginLeft: '5px',
  }
};

// Helper to merge base and specific styles
const mergeStyles = (...styleObjects) => Object.assign({}, ...styleObjects);

export default function ClassificationLesson({ onBack }) {
  const [step, setStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  // Note: sortResults state was declared but not used, removed for now.

  const steps = [
    // Step 0: What is Matter?
    {
      title: 'What is Matter?',
      content: (
        <>
          <p style={styles.paragraph}>Matter is anything that takes up space and has mass—even air!</p>
          <p style={styles.paragraph}>Is your favorite snack matter?</p>
          {/* Apply button styles */}
          <button
            style={mergeStyles(styles.buttonBase, styles.buttonPrimary)}
            onClick={() => { setQuizAnswer('yes'); setStep(step + 1); }}
          >
            Yes
          </button>
          <button
            style={mergeStyles(styles.buttonBase, styles.buttonSecondary)}
            onClick={() => { setQuizAnswer('no'); setStep(step + 1); }}
          >
            No
          </button>
        </>
      ),
    },
    // Step 1: States of Matter (Simplified presentation)
    {
      title: 'States of Matter',
      content: (
        <>
          <p style={styles.paragraph}>Matter exists in different states. Can you match these?</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Ice cube →<b style={styles.listItemHighlight}>Solid</b></li>
            <li style={styles.listItem}>Water →<b style={styles.listItemHighlight}>Liquid</b></li>
            <li style={styles.listItem}>Steam →<b style={styles.listItemHighlight}>Gas</b></li>
          </ul>
          <div> {/* Wrapper div for centering */}
            <button
              style={mergeStyles(styles.buttonBase, styles.buttonPrimary)}
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          </div>
        </>
      ),
    },
    // Step 2: Pure Substances vs Mixtures
    {
      title: 'Pure Substances vs Mixtures',
      content: (
        <>
          <p style={styles.paragraph}>A <b style={{color: styles.buttonPrimary.color}}>Pure Substance</b> has fixed composition (like Gold - Au). A <b style={{color: styles.buttonSecondary.color}}>Mixture</b> contains multiple substances not chemically bonded (like Saltwater - H₂O & NaCl).</p>
          <p style={styles.paragraph}>Is Saltwater a Pure Substance or a Mixture?</p>
          <button
            style={mergeStyles(styles.buttonBase, styles.buttonSecondary)} // Mixture is secondary here conceptually
            onClick={() => {setQuizAnswer('mixture'); setStep(step + 1);}}
          >
            Mixture
          </button>
          <button
            style={mergeStyles(styles.buttonBase, styles.buttonPrimary)} // Pure is primary here conceptually
            onClick={() => {setQuizAnswer('pure'); setStep(step + 1);}}
          >
            Pure Substance
          </button>
        </>
      ),
    },
     // Step 3: Sorting Game (Simplified presentation)
    {
      title: 'Sorting Challenge',
      content: (
        <>
          <p style={styles.paragraph}>Let's classify these:</p>
          <ul style={styles.list}>
             <li style={styles.listItem}>Oxygen (O₂) →<b style={styles.listItemHighlight}>Pure Substance</b></li>
             <li style={styles.listItem}>Trail Mix →<b style={styles.listItemHighlight}>Mixture</b></li>
             <li style={styles.listItem}>Gold (Au) →<b style={styles.listItemHighlight}>Pure Substance</b></li>
             <li style={styles.listItem}>Lemonade →<b style={styles.listItemHighlight}>Mixture</b></li>
           </ul>
          <div> {/* Wrapper div for centering */}
            <button
              style={mergeStyles(styles.buttonBase, styles.buttonPrimary)}
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          </div>
        </>
      ),
    },
    // Step 4: Recap & Badge
    {
      title: 'Recap & Badge',
      content: (
        <>
          <p style={styles.paragraph}>Awesome! You've mastered the basics of classifying matter!</p>
           <span role="img" aria-label="medal" style={{fontSize: '4em', display: 'block', margin: '15px 0'}}>🏅</span>
           {/* Navigation Button */}
           <button
             style={mergeStyles(styles.buttonBase, styles.buttonNavigation)}
             onClick={onBack}
           >
             Back to Topics
           </button>
        </>
      ),
    },
  ];

  return (
    // Apply container styles
    <div style={styles.modalContainer} className="fade-in"> {/* Added fade-in class */}
      {/* Apply title styles */}
      <h2 style={styles.title}>{steps[step].title}</h2>
      {/* Render current step's content */}
      <div>{steps[step].content}</div>

      {/* Conditional Navigation Buttons */}
      {step > 0 && step < steps.length - 1 && (
        <button
           style={mergeStyles(styles.buttonBase, styles.buttonNavigation)}
           onClick={() => setStep(step - 1)}
        >
          Back
        </button>
      )}
      {/* Show Exit button only on the first step */}
      {step === 0 && (
         <button
           style={mergeStyles(styles.buttonBase, styles.buttonNavigation)}
           onClick={onBack} // This onBack should take user out of the lesson
         >
           Exit Lesson
         </button>
      )}
    </div>
  );
}