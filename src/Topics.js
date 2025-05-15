import React, { useState, Fragment, useRef, useEffect } from 'react'; // Use Fragment if needed, or just <>
import AtomicRadiusActivity from './AtomicRadiusActivity';
import IonizationEnergyActivity from './IonizationEnergyActivity';
import ElectronegativityActivity from './ElectronegativityActivity';
import PeriodicTable from './PeriodicTable';
import CovalentFormulaToNameActivity from './CovalentFormulaToNameActivity';
import IonicFormulaToNameActivity from './IonicFormulaToNameActivity';
import MetallicCharacterActivity from './MetallicCharacterActivity';
import IdentifyElementActivity from './IdentifyElementActivity';
import LongHandConfigActivity from './LongHandConfigActivity';
import MassMoleAndMoleMassActivity from './MassMoleAndMoleMassActivity';
import TheoreticalPercentYieldActivity from './TheoreticalPercentYieldActivity';
// import MassToMassActivity from './MassToMassActivity';
import './Topics.css'; // Assuming you have a Topics.css for general styling

// Helper component for Accordion items
const AccordionItem = ({ title, titleBackgroundColor, contentBackgroundColor, children, isOpen, onClick }) => {
  return (
    <div className="accordion-item">
      <button
        className="accordion-title"
        onClick={onClick}
        aria-expanded={isOpen}
        style={{
          backgroundColor: titleBackgroundColor || '#007bff', // Default blue, can be overridden
          color: 'white',
          padding: '15px',
          width: '100%',
          textAlign: 'left',
          border: 'none',
          borderBottom: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '1.1em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div
          className="accordion-content"
          style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderTop: 'none',
            backgroundColor: contentBackgroundColor || '#f9f9f9' // Default light grey
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default function Topics({
  onBack,
  // Nomenclature Props...
  onIonicNaming,
  onCovalentNaming,
  onIonicFormula,
  onCovalentFormula,
  onIonicNameToFormulaActivity,
  onIonicFormulaToNameActivity,
  onCovalentNameToFormulaActivity,
  onCovalentFormulaToNameActivity,
  onPrefixPracticeActivity,
  onTransitionMetalIonicTutorial,
  onTransitionMetalIonicActivity,
  onTransitionMetalFormulaToNameActivity,
  onElectronConfigShortHandActivity,
  onLongHandConfigActivity,
  onPeriodicActivity,
  periodicActivity,
  savedStates,
  updateSavedState,
  onGasLawActivity
}) {
  // State for collapsible sections - changed to accordion style
  // Default to 'gas-laws' open unless another section is set
  const [activeSection, setActiveSection] = useState('gas-laws'); // 'gas-laws', 'nomenclature', etc.
  const sectionRefs = useRef({}); // To store refs for each section content

  // State for Full-Screen Periodic Table
  const [showingFullscreenTable, setShowingFullscreenTable] = useState(false);

  // Handlers
  const handleBackFromActivity = () => {
    onPeriodicActivity(null);
    // setActiveSection(null); // Decide if returning from activity should close section
  };
  const handleShowFullscreenTable = () => {
    setShowingFullscreenTable(true);
  };
  const handleHideFullscreenTable = () => {
    setShowingFullscreenTable(false);
  };

  const handleToggleSection = (sectionName) => {
    setActiveSection(prevSection => (prevSection === sectionName ? null : sectionName));
  };

  useEffect(() => {
    if (activeSection && sectionRefs.current[activeSection]) {
      const sectionElement = sectionRefs.current[activeSection];
      
      setTimeout(() => {
        if (sectionRefs.current[activeSection]) { 
          const elementRect = sectionElement.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const elementHeight = sectionElement.offsetHeight;
          const viewportHeight = window.innerHeight;

          let targetScrollY = absoluteElementTop - (viewportHeight / 2) + (elementHeight / 2);
          targetScrollY = Math.max(0, targetScrollY); 

          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        }
      }, 150); 
    }
  }, [activeSection]); 

  // If an activity is active, render it directly (as App.js changes screen state)
  // This part might be redundant if App.js's main renderScreen handles all activity displays
  // However, keeping it for clarity if Topics itself is meant to switch to these views
  if (periodicActivity) {
    if (periodicActivity === 'atomic-radius') return <AtomicRadiusActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['atomic-radius']} setSavedState={(s) => updateSavedState('atomic-radius', s)} />;
    if (periodicActivity === 'ionization-energy') return <IonizationEnergyActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['ionization-energy']} setSavedState={(s) => updateSavedState('ionization-energy', s)} />;
    if (periodicActivity === 'electronegativity') return <ElectronegativityActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['electronegativity']} setSavedState={(s) => updateSavedState('electronegativity', s)} />;
    if (periodicActivity === 'covalent-formula-to-name') return <CovalentFormulaToNameActivity key="covalentFormulaToName" onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['covalent-formula-to-name']} setSavedState={(s) => updateSavedState('covalent-formula-to-name', s)} />;
    if (periodicActivity === 'ionic-formula-to-name') return <IonicFormulaToNameActivity key="ionicFormulaToName" onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['ionic-formula-to-name']} setSavedState={(s) => updateSavedState('ionic-formula-to-name', s)} />;
    if (periodicActivity === 'metallic-character') return <MetallicCharacterActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['metallic-character']} setSavedState={(s) => updateSavedState('metallic-character', s)} />;
    if (periodicActivity === 'identify-element') return <IdentifyElementActivity onBack={handleBackFromActivity} onPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['identify-element']} setSavedState={(s) => updateSavedState('identify-element', s)} />;
    if (periodicActivity === 'long-hand-config') return <LongHandConfigActivity onBack={handleBackFromActivity} onPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['long-hand-config']} setSavedState={(s) => updateSavedState('long-hand-config', s)} />;
    if (periodicActivity === 'mass-mole-and-mole-mass') return <MassMoleAndMoleMassActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['mass-mole-and-mole-mass']} setSavedState={(s) => updateSavedState('mass-mole-and-mole-mass', s)} />;
    if (periodicActivity === 'theoretical-percent-yield') return <TheoreticalPercentYieldActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} savedState={savedStates?.['theoretical-percent-yield']} setSavedState={(s) => updateSavedState('theoretical-percent-yield', s)} />;
    // Note: MassToMassActivity, MoleToMoleActivity etc. are rendered by App.js based on screen state.
    // No need for explicit rendering here if App.js controls it.
  }

  return (
    <div className="center-container fade-in slide-up" style={{ position: 'relative', overflowY: 'auto', paddingBottom: '80px' }}>
      {/* Floating chemistry icons */}
      <span className="floating-chem-icon" style={{ left: '6vw', top: '10vh', fontSize: '2.2em', animationDelay: '0.5s' }}>🧪</span>
      <span className="floating-chem-icon" style={{ left: '85vw', top: '15vh', fontSize: '2em', animationDelay: '2.5s' }}>🧫</span>
      <span className="floating-chem-icon" style={{ left: '18vw', top: '80vh', fontSize: '2.5em', animationDelay: '1.2s' }}>🧬</span>
      <span className="floating-chem-icon" style={{ left: '70vw', top: '85vh', fontSize: '2.1em', animationDelay: '3.2s' }}>⚗️</span>
      
      {showingFullscreenTable && (
        <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.60)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#23234a', borderRadius:18, boxShadow:'0 6px 32px #b6f8e099', padding:30, maxWidth:900, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
            <PeriodicTable />
            <button className="ptable-btn" style={{position:'absolute', top:18, right:18, background:'#b6f8e0', color:'#23234a', fontWeight:700, borderRadius:10}} onClick={handleHideFullscreenTable}>Close</button>
          </div>
        </div>
      )}
      
      <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.3em', textShadow: '0 2px 18px #38bdf8aa, 0 1px 0 #fff', margin: '20px 0 40px 0' }}>Topics</h2>

      {/* --- Chemical Nomenclature Dropdown Section --- */}
      <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          className="ptable-btn"
          style={{ background: 'linear-gradient(100deg,#f3e8ff 60%,#b6f8e0 100%)', color: '#23234a', fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px', boxShadow: '0 2px 12px #b6f8e055', border: '2px solid #6366f1', letterSpacing: 0.5, marginBottom: 8, marginTop: 8, transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #6366f1aa)', width: '100%', maxWidth: 400, textShadow: '0px 1px 3px rgba(99, 102, 241, 0.4)' }}
          onClick={() => handleToggleSection('nomenclature')}
          aria-expanded={activeSection === 'nomenclature'}
          aria-controls="nomenclature-section"
        >
          <span role="img" aria-label="chemistry" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #a5b4fc)' }}>🧪</span>
          Chemical Nomenclature 
          <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'nomenclature' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
        {activeSection === 'nomenclature' && (
          <div
            id="nomenclature-section"
            role="region"
            style={{
              maxHeight: activeSection === 'nomenclature' ? '2000px' : '0px',
              opacity: activeSection === 'nomenclature' ? 1 : 0,
              transform: activeSection === 'nomenclature' ? 'translateY(0)' : 'translateY(-10px)',
              overflow: 'hidden',
              transition: `max-height 0.5s ease-in-out, opacity 0.3s ease-in-out ${activeSection === 'nomenclature' ? '0.15s' : '0s'}, transform 0.3s ease-in-out ${activeSection === 'nomenclature' ? '0.15s' : '0s'}, margin-bottom 0.5s ease-in-out`,
              marginBottom: activeSection === 'nomenclature' ? '8px' : '0px',
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center' 
            }}
          >
            <div
              ref={el => sectionRefs.current.nomenclature = el}
              style={{
                background: 'rgba(99, 102, 241, 0.10)', backdropFilter: 'blur(4px)', borderRadius: 18, 
                boxShadow: '0 4px 32px #6366f155, 0 1.5px 0 #fff', 
                display: 'inline-block', minWidth: 260, maxWidth: 650, width: '95vw', 
                border: '2.5px solid #6366f1', position: 'relative', zIndex: 2,
                padding: activeSection === 'nomenclature' ? '30px 26px' : '0px 26px',
                transition: 'padding 0.4s ease-in-out',
                visibility: activeSection === 'nomenclature' ? 'visible' : 'hidden',
                marginTop: 0, 
                marginBottom: 0 
              }}
            >
              <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ background: 'linear-gradient(100deg,#f3e8ff 60%,#e0f7fa 100%)', borderRadius: 18, boxShadow: '0 2px 16px #b6f8e044', padding: '18px 18px 12px 18px', border: '1.5px solid #b6f8e0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟦</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Main Group Ionic Compounds</b></div>
                  <ul className="topic-btn-group">
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onIonicNaming}>Tutorial: Ionic Naming Instructions</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onIonicFormula}>Tutorial: Ionic Formula Instructions</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onIonicNameToFormulaActivity}>Activity: Name to Formula (Main Group)</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('ionic-formula-to-name')}>Activity: Formula to Name (Main Group)</button></li>
                  </ul>
                </div>
                <div style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟩</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Transition Metal Ionic Compounds</b></div>
                  <ul className="topic-btn-group">
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onTransitionMetalIonicTutorial}>Tutorial: Transition Metal Ionic</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onTransitionMetalIonicActivity}>Activity: Name to Formula (Transition Metal)</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onTransitionMetalFormulaToNameActivity}>Activity: Formula to Name (Transition Metal)</button></li>
                  </ul>
                </div>
                <div style={{ background: 'linear-gradient(100deg,#ffe0fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟪</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Covalent Compounds</b></div>
                  <ul className="topic-btn-group">
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onCovalentNaming}>Tutorial: Covalent Naming Instructions</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onCovalentFormula}>Tutorial: Covalent Formula Instructions</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onCovalentNameToFormulaActivity}>Activity: Name to Formula (Covalent)</button></li>
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('covalent-formula-to-name')}>Activity: Formula to Name (Covalent)</button></li>
                  </ul>
                </div>
                <div style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#ffe0fa 100%)', borderRadius: 18, boxShadow: '0 2px 16px #a5b4fc44', padding: '18px 18px 12px 18px', border: '2px solid #a259ec', marginTop: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="prefixes" style={{ fontSize: '1.6em', marginRight: 10 }}>🔤</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Prefixes (AP/Honors Must-Know)</b></div>
                  <ul className="topic-btn-group">
                    <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onPrefixPracticeActivity}>Prefix Practice Activity</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Periodic Trends Dropdown Section --- */}
      <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          className="ptable-btn"
          style={{ background: 'linear-gradient(100deg,#fffde7 60%,#facc15 100%)', color: '#23234a', fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px', boxShadow: '0 2px 12px #facc1555', border: '2px solid #facc15', letterSpacing: 0.5, marginBottom: 8, marginTop: 8, transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #facc15aa)', width: '100%', maxWidth: 400, textShadow: '0px 1px 3px rgba(250, 204, 21, 0.5)' }}
          onClick={() => handleToggleSection('periodic')}
          aria-expanded={activeSection === 'periodic'}
          aria-controls="periodic-section"
        >
          <span role="img" aria-label="periodic trends" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #facc15)' }}>📈</span>
          Periodic Trends 
          <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'periodic' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
        {activeSection === 'periodic' && (
          <div 
            id="periodic-section"
            role="region"
            style={{
              maxHeight: activeSection === 'periodic' ? '2000px' : '0px',
              opacity: activeSection === 'periodic' ? 1 : 0,
              transform: activeSection === 'periodic' ? 'translateY(0)' : 'translateY(-10px)',
              overflow: 'hidden',
              transition: `max-height 0.5s ease-in-out, opacity 0.3s ease-in-out ${activeSection === 'periodic' ? '0.15s' : '0s'}, transform 0.3s ease-in-out ${activeSection === 'periodic' ? '0.15s' : '0s'}, margin-bottom 0.5s ease-in-out`,
              marginBottom: activeSection === 'periodic' ? '8px' : '0px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div
              ref={el => sectionRefs.current.periodic = el}
              style={{ 
                background: 'rgba(252, 231, 187, 0.95)', backdropFilter: 'blur(3px)', borderRadius: 18, 
                boxShadow: '0 4px 24px #facc1555, 0 1px 0 #fff', 
                maxWidth: 600, width: '95vw', display: 'inline-block', 
                position: 'relative', zIndex: 2, border: '1.5px solid #facc15',
                padding: activeSection === 'periodic' ? '24px 20px 16px 20px' : '0px 20px',
                transition: 'padding 0.4s ease-in-out',
                visibility: activeSection === 'periodic' ? 'visible' : 'hidden',
                marginTop: 0,
                marginBottom: 0
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ flex: 1, minWidth: 210, background: '#fffde7', borderRadius: 12, boxShadow: '0 1px 8px #facc1533', padding: '12px 14px', border: '1.5px solid #facc15' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>📝</span>
                    <b style={{ fontSize: '1.09em', color: '#23234a' }}>Activities</b>
                  </div>
                  <ul className="topic-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, listStyleType: 'none', paddingLeft: 0 }}>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('atomic-radius')}><span role="img" aria-label="radius">🟡</span> Atomic Radius</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('ionization-energy')}><span role="img" aria-label="ionization">⚡</span> Ionization Energy</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('electronegativity')}><span role="img" aria-label="electronegativity">🧲</span> Electronegativity Trends</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('metallic-character')}><span role="img" aria-label="metallic">🔩</span> Metallic Character</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Electron Configuration Dropdown Section --- */}
      <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          className="ptable-btn"
          style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#b6f8e0 100%)', color: '#23234a', fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px', boxShadow: '0 2px 12px #b6f8e055', border: '2px solid #38bdf8', letterSpacing: 0.5, marginBottom: 8, marginTop: 8, transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #38bdf8aa)', width: '100%', maxWidth: 400, textShadow: '0px 1px 3px rgba(56, 189, 248, 0.5)' }}
          onClick={() => handleToggleSection('electronConfig')}
          aria-expanded={activeSection === 'electronConfig'}
          aria-controls="electronConfig-section"
        >
          <span role="img" aria-label="electron config" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #38bdf8)' }}>💡</span>
          Electron Configuration 
          <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'electronConfig' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
        {activeSection === 'electronConfig' && (
          <div
            id="electronConfig-section"
            role="region"
            style={{
              maxHeight: activeSection === 'electronConfig' ? '2000px' : '0px',
              opacity: activeSection === 'electronConfig' ? 1 : 0,
              transform: activeSection === 'electronConfig' ? 'translateY(0)' : 'translateY(-10px)',
              overflow: 'hidden',
              transition: `max-height 0.5s ease-in-out, opacity 0.3s ease-in-out ${activeSection === 'electronConfig' ? '0.15s' : '0s'}, transform 0.3s ease-in-out ${activeSection === 'electronConfig' ? '0.15s' : '0s'}, margin-bottom 0.5s ease-in-out`,
              marginBottom: activeSection === 'electronConfig' ? '8px' : '0px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div
              ref={el => sectionRefs.current.electronConfig = el}
              style={{ 
                background: 'rgba(182, 248, 224, 0.95)', backdropFilter: 'blur(3px)', borderRadius: 18, 
                boxShadow: '0 4px 24px #38bdf855, 0 1px 0 #fff', 
                maxWidth: 600, width: '95vw', display: 'inline-block', 
                position: 'relative', zIndex: 2, border: '2px solid #38bdf8',
                padding: activeSection === 'electronConfig' ? '24px 20px 16px 20px' : '0px 20px',
                transition: 'padding 0.4s ease-in-out',
                visibility: activeSection === 'electronConfig' ? 'visible' : 'hidden',
                marginTop: 0,
                marginBottom: 0
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ flex: 1, minWidth: 210, background: '#e0f7fa', borderRadius: 12, boxShadow: '0 1px 8px #38bdf833', padding: '12px 14px', border: '1.5px solid #38bdf8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>🔬</span>
                    <b style={{ fontSize: '1.09em', color: '#23234a' }}>Activities</b>
                  </div>
                  <ul className="topic-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, listStyleType: 'none', paddingLeft: 0 }}>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('noble-gas-config')}><span role="img" aria-label="shorthand">✍️</span> Noble Gas Configuration</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('long-hand-config')}><span role="img" aria-label="longhand">📝</span> Complete Configuration</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('identify-element')}><span role="img" aria-label="identify">🔎</span> Identify Element</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('electron-config-exceptions')}><span role="img" aria-label="exceptions">⚠️</span> Exceptions</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Stoichiometry Dropdown Section --- */}
      <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          className="ptable-btn"
          style={{
            background: 'linear-gradient(100deg,#d1fae5 60%,#6ee7b7 100%)', 
            color: '#065f46', 
            fontWeight: 800, 
            borderRadius: 12, 
            fontSize: '1.15em', 
            padding: '12px 32px', 
            boxShadow: '0 2px 12px #6ee7b755', 
            border: '2px solid #34d399', 
            letterSpacing: 0.5, 
            marginBottom: 8, 
            marginTop: 8, 
            transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', 
            cursor: 'pointer', 
            filter: 'drop-shadow(0 2px 8px #34d399aa)', 
            width: '100%', 
            maxWidth: 400,
            textShadow: '0px 1px 3px rgba(52, 211, 153, 0.5)'
          }}
          onClick={() => handleToggleSection('stoichiometry')}
          aria-expanded={activeSection === 'stoichiometry'}
          aria-controls="stoichiometry-section"
        >
          <span role="img" aria-label="stoichiometry" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #6ee7b7)' }}>⚖️</span>
          Stoichiometry 
          <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'stoichiometry' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
        {activeSection === 'stoichiometry' && (
          <div
            id="stoichiometry-section"
            role="region"
            style={{
              maxHeight: activeSection === 'stoichiometry' ? '2000px' : '0px',
              opacity: activeSection === 'stoichiometry' ? 1 : 0,
              transform: activeSection === 'stoichiometry' ? 'translateY(0)' : 'translateY(-10px)',
              overflow: 'hidden',
              transition: `max-height 0.5s ease-in-out, opacity 0.3s ease-in-out ${activeSection === 'stoichiometry' ? '0.15s' : '0s'}, transform 0.3s ease-in-out ${activeSection === 'stoichiometry' ? '0.15s' : '0s'}, margin-bottom 0.5s ease-in-out`,
              marginBottom: activeSection === 'stoichiometry' ? '8px' : '0px',
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center' 
            }}
          >
            <div
              ref={el => sectionRefs.current.stoichiometry = el}
              style={{
                background: 'rgba(236, 253, 245, 0.95)', 
                backdropFilter: 'blur(4px)', 
                borderRadius: 18, 
                boxShadow: '0 4px 32px rgba(16, 185, 129, 0.35), 0 1.5px 0 #fff',
                display: 'inline-block', 
                minWidth: 260, 
                maxWidth: 650, 
                width: '95vw', 
                border: '2.5px solid rgba(16, 185, 129, 0.8)', 
                position: 'relative', 
                zIndex: 2,
                padding: activeSection === 'stoichiometry' ? '24px 20px 16px 20px' : '0px 20px',
                transition: 'padding 0.4s ease-in-out',
                visibility: activeSection === 'stoichiometry' ? 'visible' : 'hidden',
                marginTop: 0, 
                marginBottom: 0 
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ flex: 1, minWidth: 210, background: '#e0f7fa', borderRadius: 12, boxShadow: '0 1px 8px rgba(52, 211, 153, 0.2)', padding: '12px 14px', border: '1.5px solid #34d399' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>⚙️</span>
                    <b style={{ fontSize: '1.09em', color: '#065f46' }}>Activities</b>
                  </div>
                  <ul className="topic-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, listStyleType: 'none', paddingLeft: 0 }}>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('mass-to-mass')}><span role="img" aria-label="mass-mass" style={{ marginRight: '8px' }}>⚖️</span>Mass-to-Mass Calculations</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('mass-mole-and-mole-mass')}><span role="img" aria-label="mass-mole" style={{ marginRight: '8px' }}>🧪</span>Mass-Mole & Mole-Mass</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('mole-to-mole')}><span role="img" aria-label="mole-mole" style={{ marginRight: '8px' }}>🔄</span>Mole-to-Mole Conversions</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('limiting-reactant')}><span role="img" aria-label="limiting-reactant" style={{ marginRight: '8px' }}>🧪</span>Limiting Reactant</button></li>
                    <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('theoretical-percent-yield')}><span role="img" aria-label="yield" style={{ marginRight: '8px' }}>🎯</span>Theoretical & Percent Yield</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* --- Gases & Gas Laws Lab Dropdown Section --- */}
      <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          className="ptable-btn"
          style={{ background: 'linear-gradient(100deg,#e0f2fe 60%,#60a5fa 100%)', color: '#1e40af', fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px', boxShadow: '0 2px 12px #60a5fa55', border: '2px solid #60a5fa', letterSpacing: 0.5, marginBottom: 8, marginTop: 8, transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #60a5fa88)', width: '100%', maxWidth: 400, textShadow: '0px 1px 3px rgba(96, 165, 250, 0.4)' }}
          onClick={() => handleToggleSection('gases')}
          aria-expanded={activeSection === 'gases'}
          aria-controls="gases-section"
        >
          <span role="img" aria-label="gases" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #60a5fa)' }}>💨</span>
          Gas Laws & Activities
          <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'gases' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
        {activeSection === 'gases' && (
          <div
            id="gases-section"
            role="region"
            ref={el => sectionRefs.current.gases = el}
            style={{
              background: 'rgba(224,242,254,0.97)',
              borderRadius: 18,
              boxShadow: '0 4px 32px #60a5fa33',
              display: 'inline-block',
              minWidth: 260,
              maxWidth: 650,
              width: '95vw',
              border: '2.5px solid #60a5fa',
              position: 'relative',
              zIndex: 2,
              padding: activeSection === 'gases' ? '24px 20px 16px 20px' : '0px 20px',
              transition: 'padding 0.4s ease-in-out',
              visibility: activeSection === 'gases' ? 'visible' : 'hidden',
              marginTop: 0,
              marginBottom: 0
            }}
          >

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ flex: 1, minWidth: 210, background: '#e0f2fe', borderRadius: 12, boxShadow: '0 1px 8px #60a5fa22', padding: '12px 14px', border: '1.5px solid #60a5fa' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>🧮</span>
                  <b style={{ fontSize: '1.09em', color: '#1e40af' }}>Gas Law Activities</b>
                </div>
                <ul className="topic-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, listStyleType: 'none', paddingLeft: 0 }}>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('ideal-gas-law')}><span role="img" aria-label="ideal-gas" style={{ marginRight: '8px' }}>📦</span>Ideal Gas Law</button></li>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('boyles-law')}><span role="img" aria-label="boyle" style={{ marginRight: '8px' }}>🔵</span>Boyle's Law</button></li>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('charles-law')}><span role="img" aria-label="charles" style={{ marginRight: '8px' }}>🟥</span>Charles's Law</button></li>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('combined-gas-law')}><span role="img" aria-label="combined" style={{ marginRight: '8px' }}>🟪</span>Combined Gas Law</button></li>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('gas-stoichiometry')}><span role="img" aria-label="stoich" style={{ marginRight: '8px' }}>⚗️</span>Gas Stoichiometry (at STP)</button></li>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('daltons-law')}><span role="img" aria-label="dalton" style={{ marginRight: '8px' }}>⚪</span>Dalton's Law of Partial Pressures</button></li>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('grahams-law')}><span role="img" aria-label="graham" style={{ marginRight: '8px' }}>🧬</span>Graham's Law of Effusion</button></li>
                  <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: '100%', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onGasLawActivity('collecting-gas-over-water')}><span role="img" aria-label="water" style={{ marginRight: '8px' }}>💧</span>Collecting Gas Over Water</button></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button className="back-btn" onClick={onBack} style={{ fontWeight: 600, fontSize: '1.08em', borderRadius: 10, padding: '10px 20px', boxShadow: '0 2px 10px #23234a55' }}>Back to Main Menu</button>
      </div>
    </div>
  );
}

// CSS classes like .ptable-btn, .periodic-btn, .topic-btn-group etc. would be in Topics.css
// .stoich-btn class mentioned in comments is not actively used if all styling is inline or via generic .ptable-btn