import React, { useState } from 'react';
import AtomicRadiusActivity from './AtomicRadiusActivity'; // Assuming this component exists

export default function Topics({
  onBack, // This onBack seems to be for navigating away from Topics entirely
  onIonicNaming,
  onCovalentNaming,
  onIonicFormula,
  onCovalentFormula,
  onIonicNameToFormulaActivity,
  onIonicFormulaToNameActivity,
  onCovalentNameToFormulaActivity,
  onCovalentFormulaToNameActivity,
  onTransitionMetalIonicTutorial,
  onTransitionMetalIonicActivity,
  onTransitionMetalFormulaToNameActivity,
  onAtomicRadiusActivityPeriodicTable // <-- Add this prop
}) {
  // State for collapsible sections
  const [showNomenclatureDropdown, setShowNomenclatureDropdown] = useState(false);
  // Periodic Trends dropdown state
  const [showPeriodicDropdown, setShowPeriodicDropdown] = useState(false);
  // State for which periodic activity is open
  const [periodicActivity, setPeriodicActivity] = useState(null); // null or 'atomic-radius'

  // Function to handle going back from the activity view to the topic list
  const handleBackFromActivity = () => {
    setPeriodicActivity(null);
  };

  return (
    <div className="center-container fade-in slide-up" style={{ textAlign: 'center' }}>
      {/* Main content wrapper */}
      <div>
        {/* Show Atomic Radius Activity if open */}
        {periodicActivity === 'atomic-radius' ? (
          <AtomicRadiusActivity onBack={handleBackFromActivity} onPeriodicTable={onAtomicRadiusActivityPeriodicTable} />
        ) : (
          // Otherwise, show the main topic list
          <> {/* Use a Fragment to avoid unnecessary div */}
            <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.3em', textShadow: '0 2px 18px #38bdf8aa, 0 1px 0 #fff' }}>Topics</h2>

            {/* Chemical Nomenclature Dropdown Section */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{
                  fontSize: '1.26em',
                  fontWeight: 800,
                  background: showNomenclatureDropdown
                    ? 'linear-gradient(90deg,#38bdf8 0,#a5b4fc 100%)'
                    : 'linear-gradient(90deg,#6366f1 0,#38bdf8 100%)',
                  color: '#fff',
                  borderRadius: 22,
                  padding: '18px 44px',
                  boxShadow: showNomenclatureDropdown ? '0 4px 32px #38bdf855, 0 1.5px 0 #fff' : '0 2px 24px #23234a55',
                  border: '2.5px solid #38bdf8',
                  transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
                  letterSpacing: 1.2,
                  position: 'relative',
                  outline: showNomenclatureDropdown ? '2px solid #a5b4fc' : 'none',
                  filter: showNomenclatureDropdown ? 'brightness(1.07)' : 'none',
                  textShadow: '0 2px 16px #38bdf8cc',
                  cursor: 'pointer',
                  width: 'auto',
                  display: 'inline-block'
                }}
                onClick={() => setShowNomenclatureDropdown(d => !d)}
              >
                <span role="img" aria-label="chemistry" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #a5b4fc)' }}>🧪</span>
                Chemical Nomenclature {showNomenclatureDropdown ? <span style={{ marginLeft: 8 }}>▲</span> : <span style={{ marginLeft: 8 }}>▼</span>}
              </button>

              {/* Spacer */}
              <div style={{ height: showNomenclatureDropdown ? 22 : 0, transition: 'height 0.3s' }} />

              {/* Nomenclature Dropdown Content */}
              {showNomenclatureDropdown && (
                <div style={{
                  marginTop: 0,
                  marginBottom: 8,
                  background: 'rgba(40, 40, 80, 0.9)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 18,
                  boxShadow: '0 4px 32px #38bdf855, 0 1.5px 0 #fff',
                  padding: '30px 26px',
                  display: 'inline-block',
                  minWidth: 355,
                  maxWidth: 650,
                  width: '90%',
                  border: '2.5px solid #6366f1',
                  position: 'relative',
                  zIndex: 2,
                }}>
                  <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* Standard: Main Group Ionic Compounds */}
                    <div style={{ background: 'linear-gradient(100deg,#f3e8ff 60%,#e0f7fa 100%)', borderRadius: 18, boxShadow: '0 2px 16px #b6f8e044', padding: '18px 18px 12px 18px', border: '1.5px solid #b6f8e0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟦</span>
                        <b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Main Group Ionic Compounds</b>
                      </div>
                      <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li><button className="ptable-btn" onClick={onIonicNaming} style={{ width: '97%', margin: '6px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#b6f8e0 0,#b6c8f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #b6f8e055', border: '1.5px solid #b6f8e0', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Tutorial: Ionic Naming Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onIonicFormula} style={{ width: '97%', margin: '6px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#b6c8f8 0,#b6f8e0 100%)', color: '#23234a', boxShadow: '0 2px 12px #b6c8f855', border: '1.5px solid #b6c8f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Tutorial: Ionic Formula Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onIonicNameToFormulaActivity} style={{ width: '97%', margin: '8px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#b6f8e0 0,#b6c8f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #b6f8e055', border: '1.5px solid #b6f8e0', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Activity: Name to Formula (Main Group)</button></li>
                        <li><button className="ptable-btn" onClick={onIonicFormulaToNameActivity} style={{ width: '97%', margin: '8px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#b6c8f8 0,#b6f8e0 100%)', color: '#23234a', boxShadow: '0 2px 12px #b6c8f855', border: '1.5px solid #b6c8f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Activity: Formula to Name (Main Group)</button></li>
                      </ul>
                    </div>
                    {/* Standard: Transition Metal Ionic Compounds */}
                    <div style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟩</span>
                        <b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Transition Metal Ionic Compounds</b>
                      </div>
                      <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li><button className="ptable-btn" onClick={onTransitionMetalIonicTutorial} style={{ width: '97%', margin: '6px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#e0b6f8 0,#b6c8f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #e0b6f855', border: '1.5px solid #e0b6f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Tutorial: Transition Metal Ionic</button></li>
                        <li><button className="ptable-btn" onClick={onTransitionMetalIonicActivity} style={{ width: '97%', margin: '8px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#b6c8f8 0,#e0b6f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #b6c8f855', border: '1.5px solid #b6c8f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Activity: Name to Formula (Transition Metal)</button></li>
                        <li><button className="ptable-btn" onClick={onTransitionMetalFormulaToNameActivity} style={{ width: '97%', margin: '8px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#e0b6f8 0,#b6c8f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #e0b6f855', border: '1.5px solid #e0b6f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Activity: Formula to Name (Transition Metal)</button></li>
                      </ul>
                    </div>
                    {/* Standard: Covalent Compounds */}
                    <div style={{ background: 'linear-gradient(100deg,#ffe0fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟪</span>
                        <b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Covalent Compounds</b>
                      </div>
                      <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li><button className="ptable-btn" onClick={onCovalentNaming} style={{ width: '97%', margin: '6px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#e0b6f8 0,#b6c8f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #e0b6f855', border: '1.5px solid #e0b6f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Tutorial: Covalent Naming Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onCovalentFormula} style={{ width: '97%', margin: '6px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#b6c8f8 0,#e0b6f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #b6c8f855', border: '1.5px solid #b6c8f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Tutorial: Covalent Formula Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onCovalentNameToFormulaActivity} style={{ width: '97%', margin: '8px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#e0b6f8 0,#b6c8f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #e0b6f855', border: '1.5px solid #e0b6f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Activity: Name to Formula (Covalent)</button></li>
                        <li><button className="ptable-btn" onClick={onCovalentFormulaToNameActivity} style={{ width: '97%', margin: '8px 0', borderRadius: 10, fontWeight: 700, fontSize: '1.08em', background: 'linear-gradient(90deg,#b6c8f8 0,#e0b6f8 100%)', color: '#23234a', boxShadow: '0 2px 12px #b6c8f855', border: '1.5px solid #b6c8f8', letterSpacing: 0.5, transition: 'all .18s', cursor: 'pointer' }}>Activity: Formula to Name (Covalent)</button></li>
                      </ul>
                    </div>
                  </div> {/* End list of standards */}
                </div>
              )}
            </div> {/* End Chemical Nomenclature Dropdown Section */}

            {/* Periodic Trends Dropdown Section */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{
                  fontSize: '1.26em',
                  fontWeight: 800,
                  background: showPeriodicDropdown
                    ? 'linear-gradient(90deg,#f59e42 0,#facc15 100%)'
                    : 'linear-gradient(90deg,#fef9c3 0,#f59e42 100%)',
                  color: '#23234a',
                  borderRadius: 22,
                  padding: '18px 44px',
                  boxShadow: showPeriodicDropdown ? '0 4px 32px #facc1555, 0 1.5px 0 #fff' : '0 2px 24px #f59e4244',
                  border: '2.5px solid #facc15',
                  transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
                  letterSpacing: 1.2,
                  position: 'relative',
                  outline: showPeriodicDropdown ? '2px solid #f59e42' : 'none',
                  filter: showPeriodicDropdown ? 'brightness(1.07)' : 'none',
                  textShadow: '0 2px 16px #facc15cc',
                  cursor: 'pointer',
                  width: 'auto',
                  display: 'inline-block'
                }}
                onClick={() => setShowPeriodicDropdown(d => !d)}
              >
                <span role="img" aria-label="periodic trends" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #facc15)' }}>📈</span>
                Periodic Trends {showPeriodicDropdown ? <span style={{ marginLeft: 8 }}>▲</span> : <span style={{ marginLeft: 8 }}>▼</span>}
              </button>

              {/* Spacer */}
              <div style={{ height: showPeriodicDropdown ? 22 : 0, transition: 'height 0.3s' }} />

              {/* Periodic Trends Dropdown Content */}
              {showPeriodicDropdown && (
                <div style={{
                  marginTop: 0,
                  marginBottom: 8,
                  background: 'rgba(252, 231, 187, 0.95)',
                  backdropFilter: 'blur(3px)',
                  borderRadius: 18,
                  boxShadow: '0 4px 24px #facc1555, 0 1px 0 #fff',
                  padding: '24px 20px 16px 20px',
                  maxWidth: 600,
                  width: '90%',
                  display: 'inline-block',
                  position: 'relative',
                  zIndex: 2,
                  border: '1.5px solid #facc15' // Added border consistent with other sections
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <span role="img" aria-label="periodic trends" style={{ fontSize: '1.6em', marginRight: 10 }}>📈</span>
                    <b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Periodic Trends</b>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
                    {/* Activities Card */}
                    <div style={{ flex: 1, minWidth: 210, background: '#fffde7', borderRadius: 12, boxShadow: '0 1px 8px #facc1533', padding: '12px 14px', border: '1.5px solid #facc15' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>📝</span>
                        <b style={{ fontSize: '1.09em', color: '#23234a' }}>Activities</b>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                        {/* *** CORRECTED BUTTON *** */}
                        <button
                          className="ptable-btn periodic-btn"
                          style={{
                            width: '100%',
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: '1.07em',
                            background: 'linear-gradient(90deg,#facc15 0,#f59e42 100%)',
                            color: '#23234a',
                            border: '2px solid #facc15',
                            boxShadow: '0 1px 8px #facc1533',
                            letterSpacing: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '12px 18px',
                            cursor: 'pointer',
                            transition: 'all .18s',
                            outline: 'none',
                          }}
                          onClick={() => setPeriodicActivity('atomic-radius')} // Added onClick handler
                        >
                          <span role="img" aria-label="radius">🟡</span> Atomic Radius Practice
                          {/* Removed coming soon span to make it clickable */}
                        </button>
                        {/* Other Placeholder Buttons */}
                        <button className="ptable-btn periodic-btn" style={{ /* ... existing styles ... */ opacity: 0.6, cursor: 'not-allowed' }} disabled> {/* Added opacity/cursor */}
                          <span role="img" aria-label="ionization">⚡</span> Ionization Energy Practice <span style={{ marginLeft: 'auto', fontWeight: 400, fontSize: '0.96em', color: '#0095b0' }}>(coming soon)</span>
                        </button>
                        <button className="ptable-btn periodic-btn" style={{ /* ... existing styles ... */ opacity: 0.6, cursor: 'not-allowed' }} disabled> {/* Added opacity/cursor */}
                          <span role="img" aria-label="electronegativity">🧲</span> Electronegativity Trends <span style={{ marginLeft: 'auto', fontWeight: 400, fontSize: '0.96em', color: '#a21caf' }}>(coming soon)</span>
                        </button>
                        <button className="ptable-btn periodic-btn" style={{ /* ... existing styles ... */ opacity: 0.6, cursor: 'not-allowed' }} disabled> {/* Added opacity/cursor */}
                          <span role="img" aria-label="metallic">🔩</span> Metallic Character Sorting <span style={{ marginLeft: 'auto', fontWeight: 400, fontSize: '0.96em', color: '#65a30d' }}>(coming soon)</span>
                        </button>
                      </div>
                    </div>
                     {/* Add placeholder for Lessons if needed */}
                    {/* <div style={{ flex: 1, minWidth: 210, background: '#fffaf0', ... }}> ... </div> */}
                  </div>
                </div>
              )}
            </div> {/* End Periodic Trends Dropdown Section */}

            {/* Back Button (for returning from Topics screen) */}
            {/* *** CORRECTED BUTTON AND PLACEMENT *** */}
            <button
              className="back-btn"
              onClick={onBack} // Use the prop passed into Topics
              style={{ marginTop: 28, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}
            >
              Back {/* Or "Back to Menu" etc. */}
            </button>
          </> // End Fragment for the main topic list
        )} {/* End Ternary Operator */}
      </div> {/* End Main content wrapper */}
    </div> // End root container
  );
}