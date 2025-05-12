import React from 'react';

// Regex to validate a single, well-formed subshell token (e.g., 2s2, 3d10)
export const IS_VALID_SUBSHELL_REGEX = /^\d+[spdf]\d+$/;
// Regex to validate a noble gas core token (e.g., [He], [Ar])
export const IS_NOBLE_GAS_REGEX = /^\\[[a-zA-Z]+\\]$/;

// Utility to convert subshell numbers to superscript (e.g., s2 -> s²)
export function configToSuperscript(config) {
  if (typeof config !== 'string') return '';
  return config.replace(/([spdf])(\d+)/g, (match, orb, num) => orb + num.split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join(''));
}

// Helper function to normalize a single subshell/core token for comparison
export function normalizeIndividualToken(token) {
  if (!token) return '';
  if (IS_NOBLE_GAS_REGEX.test(token)) {
    return token.toUpperCase();
  }
  return token.toLowerCase()
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, d => '0123456789'['⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(d)]);
}

// Feedback Visual Component
export function FeedbackVisual({ feedback }) {
  if (!feedback) return null;

  // Use global CSS classes for feedback styling
  const cardClass = feedback.type === 'correct' ? 'feedback-correct' : 'feedback-incorrect';
  
  // For incorrect feedback, the main message is now part of the feedback object itself
  // and detailed breakdown (missing, extra, howTo) is handled below.

  if (feedback.type === 'correct') {
    return (
      <div className={cardClass} style={{ textAlign: 'center' }}> {/* Use global class */}
        <span role="img" aria-label="correct" style={{ marginRight: 8 }}>✅</span>
        {feedback.message}
        {feedback.tip && <div style={{ fontSize: '0.9em', marginTop: '8px', fontWeight: 'normal' }}>{feedback.tip}</div>}
      </div>
    );
  }

  // Incorrect feedback detailed display
  let userAnswerDisplay = null;
  if (!feedback.userAnswer || !feedback.userAnswer.trim()) {
    userAnswerDisplay = <span className="shc-feedback-user-answer-empty">(No answer entered)</span>;
  } else {
    // Assuming shc-feedback-user-answer-pill is defined in a shared CSS (like ShortHandConfigActivity.css or global style.css)
    userAnswerDisplay = <span className="shc-feedback-user-answer-pill">{configToSuperscript(feedback.userAnswer)}</span>;
  }

  return (
    // Using shc-feedback-visual-card structure if it's general enough, or adapt
    <div className={`shc-feedback-visual-card ${cardClass}`}> {/* Add feedback-incorrect to the main card for themed background */}
      <div className="shc-feedback-block shc-feedback-general-message" style={{textAlign: 'center', fontWeight:'bold', marginBottom: '16px'}}>
         {feedback.message} {/* General message like "Incorrect. Review details." */}
      </div>

      <div className="shc-feedback-block shc-feedback-user">
        <span className="shc-feedback-label">📝 What you wrote:</span>
        {userAnswerDisplay}
      </div>

      {feedback.missing && feedback.missing.length > 0 && (
        <div className="shc-feedback-block shc-feedback-missing">
          <span className="shc-feedback-label">➖ What's missing:</span>
          <ul>
            {feedback.missing.map((m, i) => (
              <li key={i}>
                {IS_NOBLE_GAS_REGEX.test(m) ? 'Noble gas core: ' : 'Subshell: '}
                <code>{configToSuperscript(m)}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.extra && feedback.extra.length > 0 && (
        <div className="shc-feedback-block shc-feedback-extra">
          <span className="shc-feedback-label">➕ What's extra or incorrect:</span>
          <ul>
            {feedback.extra.map((issueMsg, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: issueMsg }} />
            ))}
          </ul>
        </div>
      )}

      {feedback.howTo && feedback.howTo.length > 0 && (
        <div className="shc-feedback-block shc-feedback-howto">
          <span className="shc-feedback-label">🔎 How to build the correct answer:</span>
          <ol>
            {feedback.howTo.map((step, i) => (
              <li key={i}>
                <b>{step.text}</b>{' '}
                {IS_NOBLE_GAS_REGEX.test(step.code) ? (
                  <code>{configToSuperscript(step.code)}</code>
                ) : Array.isArray(step.code) ? (
                  step.code.map((c, j) => <code key={j} style={{marginRight:4}}>{configToSuperscript(c)}</code>)
                ) : step.code ? (
                  <code>{configToSuperscript(step.code)}</code>
                ) : null}
                {step.explanation && <span className="shc-feedback-explanation"> {step.explanation}</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="shc-feedback-block shc-feedback-correct-answer">
        <span className="shc-feedback-label">✅ Correct answer:</span>
        <span className="shc-feedback-correct-value">{configToSuperscript(feedback.correct)}</span>
      </div>
      
      {feedback.tip && (
        <div className="shc-feedback-block shc-feedback-tip">
          <span className="shc-feedback-label">💡 Tip:</span>
          <span>{feedback.tip}</span>
        </div>
      )}
    </div>
  );
} 