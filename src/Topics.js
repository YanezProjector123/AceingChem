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
  updateSavedState
}) {
  // State for collapsible sections - changed to accordion style
  const [activeSection, setActiveSection] = useState(null); // null, 'nomenclature', 'periodic', 'electronConfig', 'stoichiometry'
  const sectionRefs = useRef({}); // To store refs for each section content

  // State for Full-Screen Periodic Table
  const [showingFullscreenTable, setShowingFullscreenTable] = useState(false);

  // Handlers
  const handleBackFromActivity = () => {
    onPeriodicActivity(null);
    setActiveSection(null); // Also close any open section when an activity is chosen or back is pressed
  };
  const handleShowFullscreenTable = () => {
    setShowingFullscreenTable(true);
  };
  const handleHideFullscreenTable = () => {
    setShowingFullscreenTable(false);
  };

  // Debug Log
  console.log(`Rendering Topics Component. State -> periodicActivity: ${periodicActivity}, activeSection: ${activeSection}, showingFullscreenTable: ${showingFullscreenTable}`);

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

  return (
    <div className="center-container fade-in slide-up" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Floating chemistry icons */}
      <span className="floating-chem-icon" style={{ left: '6vw', top: '10vh', fontSize: '2.2em', animationDelay: '0.5s' }}>🧪</span>
      <span className="floating-chem-icon" style={{ left: '85vw', top: '15vh', fontSize: '2em', animationDelay: '2.5s' }}>🧫</span>
      <span className="floating-chem-icon" style={{ left: '18vw', top: '80vh', fontSize: '2.5em', animationDelay: '1.2s' }}>🧬</span>
      <span className="floating-chem-icon" style={{ left: '70vw', top: '85vh', fontSize: '2.1em', animationDelay: '3.2s' }}>⚗️</span>
      {showingFullscreenTable ? (
        // Render Fullscreen Periodic Table as an overlay instead of replacing content
        <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.60)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#23234a', borderRadius:18, boxShadow:'0 6px 32px #b6f8e099', padding:30, maxWidth:900, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
            <PeriodicTable />
            <button className="ptable-btn" style={{position:'absolute', top:18, right:18, background:'#b6f8e0', color:'#23234a', fontWeight:700, borderRadius:10}} onClick={handleHideFullscreenTable}>Close</button>
          </div>
        </div>
      ) : null}
      
      {/* Render Activity or Topic List - Now always visible */}
      <>
        {periodicActivity === 'atomic-radius' ? (
          <AtomicRadiusActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} />
        ) : periodicActivity === 'ionization-energy' ? (
          <IonizationEnergyActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} />
        ) : periodicActivity === 'electronegativity' ? (
          <ElectronegativityActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} />
        ) : periodicActivity === 'covalent-formula-to-name' ? (
          <CovalentFormulaToNameActivity 
            key="covalentFormulaToName" 
            onBack={handleBackFromActivity} 
            onShowPeriodicTable={handleShowFullscreenTable} 
            onPeriodicTable={handleShowFullscreenTable}
          />
        ) : periodicActivity === 'ionic-formula-to-name' ? (
          <IonicFormulaToNameActivity
            key="ionicFormulaToName"
            onBack={handleBackFromActivity}
            onShowPeriodicTable={handleShowFullscreenTable}
            onPeriodicTable={handleShowFullscreenTable}
          />
        ) : periodicActivity === 'metallic-character' ? (
          <MetallicCharacterActivity onBack={handleBackFromActivity} onShowPeriodicTable={handleShowFullscreenTable} />
        ) : periodicActivity === 'identify-element' ? (
          <>
            <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
              Attempting to load Identify Element Activity...
            </p>
            <IdentifyElementActivity 
              onBack={handleBackFromActivity} 
              onPeriodicTable={handleShowFullscreenTable} 
              savedState={savedStates?.['identify-element']} 
              setSavedState={(s) => updateSavedState('identify-element', s)} 
            />
          </>
        ) : periodicActivity === 'long-hand-config' ? (
          <LongHandConfigActivity
            onBack={handleBackFromActivity}
            onPeriodicTable={handleShowFullscreenTable}
            savedState={savedStates?.['long-hand-config']}
            setSavedState={(s) => updateSavedState('long-hand-config', s)}
          />
        ) : (
          // --- Render the main Topic List ---
          <Fragment> {/* Or <> */}
            <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.3em', textShadow: '0 2px 18px #38bdf8aa, 0 1px 0 #fff' }}>Topics</h2>

            {/* --- Chemical Nomenclature Dropdown Section (Unique Style) --- */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{ background: 'linear-gradient(100deg,#f3e8ff 60%,#b6f8e0 100%)', color: '#23234a', fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px', boxShadow: '0 2px 12px #b6f8e055', border: '2px solid #6366f1', letterSpacing: 0.5, marginBottom: 8, marginTop: 8, transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #6366f1aa)', width: '100%', maxWidth: 400, textShadow: '0px 1px 3px rgba(99, 102, 241, 0.4)' }}
                onClick={() => handleToggleSection('nomenclature')}
              >
                <span role="img" aria-label="chemistry" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #a5b4fc)' }}>🧪</span>
                Chemical Nomenclature 
                <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'nomenclature' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {activeSection === 'nomenclature' && (
                <div // Animator DIV for Nomenclature
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
                  <div // Inner Content DIV for Nomenclature (with ref)
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
                    {/* Inner container */}
                    <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 32 }}>
                      {/* Main Group Ionic */}
                      <div style={{ background: 'linear-gradient(100deg,#f3e8ff 60%,#e0f7fa 100%)', borderRadius: 18, boxShadow: '0 2px 16px #b6f8e044', padding: '18px 18px 12px 18px', border: '1.5px solid #b6f8e0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟦</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Main Group Ionic Compounds</b></div>
                        <ul className="topic-btn-group">
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onIonicNaming}>Tutorial: Ionic Naming Instructions</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onIonicFormula}>Tutorial: Ionic Formula Instructions</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onIonicNameToFormulaActivity}>Activity: Name to Formula (Main Group)</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => { onIonicFormulaToNameActivity(); onPeriodicActivity('ionic-formula-to-name'); }}>Activity: Formula to Name (Main Group)</button></li>
                        </ul>
                      </div>
                      {/* Transition Metal Ionic */}
                      <div style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟩</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Transition Metal Ionic Compounds</b></div>
                        <ul className="topic-btn-group">
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onTransitionMetalIonicTutorial}>Tutorial: Transition Metal Ionic</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onTransitionMetalIonicActivity}>Activity: Name to Formula (Transition Metal)</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onTransitionMetalFormulaToNameActivity}>Activity: Formula to Name (Transition Metal)</button></li>
                        </ul>
                      </div>
                      {/* Covalent Compounds */}
                      <div style={{ background: 'linear-gradient(100deg,#ffe0fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟪</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Covalent Compounds</b></div>
                        <ul className="topic-btn-group">
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onCovalentNaming}>Tutorial: Covalent Naming Instructions</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onCovalentFormula}>Tutorial: Covalent Formula Instructions</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={onCovalentNameToFormulaActivity}>Activity: Name to Formula (Covalent)</button></li>
                          <li><button className="ptable-btn" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => { onCovalentFormulaToNameActivity(); onPeriodicActivity('covalent-formula-to-name'); }}>Activity: Formula to Name (Covalent)</button></li>
                        </ul>
                      </div>
                      {/* Prefix Practice - its own subcategory */}
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
            </div> {/* End Chemical Nomenclature Dropdown Section */}

            {/* --- Periodic Trends Dropdown Section (Unique Style) --- */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{ background: 'linear-gradient(100deg,#fffde7 60%,#facc15 100%)', color: '#23234a', fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px', boxShadow: '0 2px 12px #facc1555', border: '2px solid #facc15', letterSpacing: 0.5, marginBottom: 8, marginTop: 8, transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #facc15aa)', width: '100%', maxWidth: 400, textShadow: '0px 1px 3px rgba(250, 204, 21, 0.5)' }}
                onClick={() => handleToggleSection('periodic')}
              >
                <span role="img" aria-label="periodic trends" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #facc15)' }}>📈</span>
                Periodic Trends 
                <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'periodic' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {activeSection === 'periodic' && (
                <div // Animator DIV for Periodic Trends
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
                  <div // Inner Content DIV for Periodic Trends (with ref)
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
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                      <span role="img" aria-label="periodic trends" style={{ fontSize: '1.6em', marginRight: 10 }}>📈</span>
                      <b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Periodic Trends</b>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {/* *** Activities Card - CORRECTED CONTENT *** */}
                      <div style={{ flex: 1, minWidth: 210, maxWidth: 280, background: '#fffde7', borderRadius: 12, boxShadow: '0 1px 8px #facc1533', padding: '12px 14px', border: '1.5px solid #facc15' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>📝</span>
                          <b style={{ fontSize: '1.09em', color: '#23234a' }}>Activities</b>
                        </div>
                        {/* This div should ONLY contain the periodic trend activity buttons */}
                        <ul className="topic-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                          {/* Atomic Radius Button */}
                          <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
                            onClick={() => onPeriodicActivity('atomic-radius')}
                          ><span role="img" aria-label="radius">🟡</span> Atomic Radius</button></li>
                          {/* Ionization Energy Button */}
                          <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
                            onClick={() => onPeriodicActivity('ionization-energy')}
                          ><span role="img" aria-label="ionization">⚡</span> Ionization Energy</button></li>
                          {/* Electronegativity Button */}
                          <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
                            onClick={() => onPeriodicActivity('electronegativity')}
                          ><span role="img" aria-label="electronegativity">🧲</span> Electronegativity Trends</button></li>
                          {/* Metallic Character Button */}
                          <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
                            onClick={() => onPeriodicActivity('metallic-character')}
                          ><span role="img" aria-label="metallic">🔩</span> Metallic Character</button></li>
                        </ul>
                        {/* *** NO NOMENCLATURE CONTENT HERE *** */}
                      </div> {/* End Activities Card */}
                      {/* Add placeholder for Lessons if needed */}
                    </div>
                  </div>
                </div>
              )}
            </div> {/* End Periodic Trends Dropdown Section */}

            {/* --- Electron Configuration Dropdown Section (with activity button) --- */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#b6f8e0 100%)', color: '#23234a', fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px', boxShadow: '0 2px 12px #b6f8e055', border: '2px solid #38bdf8', letterSpacing: 0.5, marginBottom: 8, marginTop: 8, transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #38bdf8aa)', width: '100%', maxWidth: 400, textShadow: '0px 1px 3px rgba(56, 189, 248, 0.5)' }}
                onClick={() => handleToggleSection('electronConfig')}
              >
                <span role="img" aria-label="electron config" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #38bdf8)' }}>🧲</span>
                Electron Configuration 
                <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'electronConfig' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {activeSection === 'electronConfig' && (
                <div // Animator DIV for Electron Config
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
                  <div // Inner Content DIV for Electron Config (with ref)
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
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                      <span role="img" aria-label="electron config" style={{ fontSize: '1.6em', marginRight: 10 }}>🧲</span>
                      <b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Electron Configuration</b>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <div style={{ flex: 1, minWidth: 210, maxWidth: 280, background: '#e0f7fa', borderRadius: 12, boxShadow: '0 1px 8px #38bdf833', padding: '12px 14px', border: '1.5px solid #38bdf8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>🔬</span>
                          <b style={{ fontSize: '1.09em', color: '#23234a' }}>Activities</b>
                        </div>
                        <ul className="topic-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                          <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('noble-gas-config')}>
                            <span role="img" aria-label="shorthand">✍️</span> Noble Gas Configuration
                          </button></li>
                          <li><button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} onClick={() => onPeriodicActivity('long-hand-config')}>
                            <span role="img" aria-label="longhand">📝</span> Complete Configuration
                          </button></li>
                          <li><button 
                            className="ptable-btn periodic-btn periodic-trend-btn" 
                            style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} 
                            onClick={() => onPeriodicActivity('identify-element')}
                          >
                            <span role="img" aria-label="identify">🔎</span> Identify Element from Configuration
                          </button></li>
                          <li><button 
                            className="ptable-btn periodic-btn periodic-trend-btn" 
                            style={{ width: 240, alignSelf: 'center', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }} 
                            onClick={() => onPeriodicActivity('electron-config-exceptions')}
                          >
                            <span role="img" aria-label="exceptions">⚠️</span> Exceptions & Special Cases
                          </button></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> {/* End Electron Configuration Dropdown Section */}

            {/* --- Stoichiometry Dropdown Section (New) --- */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{
                  background: 'linear-gradient(100deg, #ffe2e6 60%, #ffc2c9 100%)', 
                  color: '#3b3b58', 
                  fontWeight: 800, borderRadius: 12, fontSize: '1.15em', padding: '12px 32px',
                  boxShadow: '0 2px 12px #ffc2c955', border: '2px solid #ff8fab', 
                  letterSpacing: 0.5, marginBottom: 8, marginTop: 8, 
                  transition: 'all 0.25s ease-in-out, transform 0.2s ease-in-out',
                  cursor: 'pointer', filter: 'drop-shadow(0 2px 8px #ff8fabaa)',
                  width: '100%', maxWidth: 400,
                  textShadow: '0px 1px 3px rgba(255, 143, 171, 0.5)'
                }}
                onClick={() => handleToggleSection('stoichiometry')}
              >
                <span role="img" aria-label="stoichiometry" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #ff8fab)' }}>⚖️</span>
                Stoichiometry 
                <span style={{ marginLeft: 8, display: 'inline-block', transition: 'transform 0.3s ease-in-out', transform: activeSection === 'stoichiometry' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {activeSection === 'stoichiometry' && (
                <div // Animator DIV for Stoichiometry
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
                  <div // Inner Content DIV for Stoichiometry (with ref)
                    ref={el => sectionRefs.current.stoichiometry = el}
                    style={{
                      background: 'rgba(255, 226, 230, 0.95)', backdropFilter: 'blur(3px)', borderRadius: 18, 
                      boxShadow: '0 4px 24px #ffc2c955, 0 1px 0 #fff',
                      /* padding: '24px 20px 16px 20px', // Original padding for when open */
                      maxWidth: 600, width: '95vw', display: 'inline-block',
                      position: 'relative', zIndex: 2, border: '2px solid #ff8fab',
                      padding: activeSection === 'stoichiometry' ? '24px 20px 16px 20px' : '0px 20px', // Animated padding
                      transition: 'padding 0.4s ease-in-out',
                      visibility: activeSection === 'stoichiometry' ? 'visible' : 'hidden',
                      marginTop: 0,
                      marginBottom: 0
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                      <span role="img" aria-label="stoichiometry" style={{ fontSize: '1.6em', marginRight: 10 }}>⚖️</span>
                      <b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#3b3b58' }}>Stoichiometry Calculations</b>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {/* Activities Card for Stoichiometry */}
                      <div style={{ flex: 1, minWidth: 210, maxWidth: 400, background: '#fff0f2', borderRadius: 12, boxShadow: '0 1px 8px #ffc2c933', padding: '12px 14px', border: '1.5px solid #ff8fab' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <span role="img" aria-label="activity" style={{ fontSize: '1.3em', marginRight: 8 }}>⚙️</span>
                          <b style={{ fontSize: '1.09em', color: '#3b3b58' }}>Activities</b>
                        </div>
                        <ul className="topic-btn-group" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                          <li><button className="ptable-btn periodic-btn" style={{ width: '90%', alignSelf: 'center', background: '#ffe2e6', borderColor: '#ffc2c9', color: '#2A2F45', fontFamily: "'Nunito', sans-serif", fontWeight: 700}} onClick={() => onPeriodicActivity('mole-to-mole')}><span role="img" aria-label="moles">🔄</span> Mole-to-Mole Conversions</button></li>
                          <li><button className="ptable-btn periodic-btn" style={{ width: '90%', alignSelf: 'center', background: '#ffe2e6', borderColor: '#ffc2c9', color: '#2A2F45', fontFamily: "'Nunito', sans-serif", fontWeight: 700}} onClick={() => alert('Mass-Mole Conversions: Not implemented yet')}><span role="img" aria-label="balance">⚖️</span> Mass-Mole & Mole-Mass</button></li>
                          <li><button className="ptable-btn periodic-btn" style={{ width: '90%', alignSelf: 'center', background: '#ffe2e6', borderColor: '#ffc2c9', color: '#2A2F45', fontFamily: "'Nunito', sans-serif", fontWeight: 700}} onClick={() => alert('Mass-to-Mass Calculations: Not implemented yet')}><span role="img" aria-label="scale">📏</span> Mass-to-Mass Calculations</button></li>
                          <li><button className="ptable-btn periodic-btn" style={{ width: '90%', alignSelf: 'center', background: '#ffe2e6', borderColor: '#ffc2c9', color: '#2A2F45', fontFamily: "'Nunito', sans-serif", fontWeight: 700}} onClick={() => alert('Limiting Reactant: Not implemented yet')}><span role="img" aria-label="limit">🧱</span> Limiting Reactant</button></li>
                          <li><button className="ptable-btn periodic-btn" style={{ width: '90%', alignSelf: 'center', background: '#ffe2e6', borderColor: '#ffc2c9', color: '#2A2F45', fontFamily: "'Nunito', sans-serif", fontWeight: 700}} onClick={() => alert('Theoretical & Percent Yield: Not implemented yet')}><span role="img" aria-label="percent">🎯</span> Theoretical & Percent Yield</button></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> {/* End Stoichiometry Dropdown Section */}

            {/* Back Button */}
            <button className="back-btn" onClick={onBack} style={{ marginTop: 28, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}> Back </button>

          </Fragment>
        )}
      </>
    </div> // End root container
  );
}