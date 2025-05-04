import React, { useState, Fragment } from 'react'; // Use Fragment if needed, or just <>
import AtomicRadiusActivity from './AtomicRadiusActivity';
import IonizationEnergyActivity from './IonizationEnergyActivity';
import ElectronegativityActivity from './ElectronegativityActivity';
import PeriodicTable from './PeriodicTable';
import CovalentFormulaToNameActivity from './CovalentFormulaToNameActivity';
import IonicFormulaToNameActivity from './IonicFormulaToNameActivity';
import MetallicCharacterActivity from './MetallicCharacterActivity';

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
}) {
  // State for collapsible sections
  const [showNomenclatureDropdown, setShowNomenclatureDropdown] = useState(false);
  const [showPeriodicDropdown, setShowPeriodicDropdown] = useState(false);

  // State for which periodic activity is open
  const [periodicActivity, setPeriodicActivity] = useState(null);

  // State for Full-Screen Periodic Table
  const [showingFullscreenTable, setShowingFullscreenTable] = useState(false);

  // Handlers
  const handleBackFromActivity = () => {
    setPeriodicActivity(null);
  };
  const handleShowFullscreenTable = () => {
    setShowingFullscreenTable(true);
  };
  const handleHideFullscreenTable = () => {
    setShowingFullscreenTable(false);
  };

  // Debug Log
  console.log(`Rendering Topics Component. State -> periodicActivity: ${periodicActivity}, showNomenclatureDropdown: ${showNomenclatureDropdown}, showPeriodicDropdown: ${showPeriodicDropdown}, showingFullscreenTable: ${showingFullscreenTable}`);

  return (
    <div className="center-container fade-in slide-up" style={{ textAlign: 'center', width: '100%', minHeight: '100vh' /* Ensure container can fill height */ }}>
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
        ) : (
          // --- Render the main Topic List ---
          <Fragment> {/* Or <> */}
            <h2 className="ptable-title" style={{ letterSpacing: 1.5, fontWeight: 800, fontSize: '2.3em', textShadow: '0 2px 18px #38bdf8aa, 0 1px 0 #fff' }}>Topics</h2>

            {/* --- Chemical Nomenclature Dropdown Section (Keep As Is) --- */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{ /* ... existing nomenclature button styles ... */ }}
                onClick={() => setShowNomenclatureDropdown(d => !d)}
              >
                <span role="img" aria-label="chemistry" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #a5b4fc)' }}>🧪</span>
                Chemical Nomenclature {showNomenclatureDropdown ? <span style={{ marginLeft: 8 }}>▲</span> : <span style={{ marginLeft: 8 }}>▼</span>}
              </button>
              <div style={{ height: showNomenclatureDropdown ? 22 : 0, transition: 'height 0.3s' }} />
              {showNomenclatureDropdown && (
                <div style={{ marginTop: 0, marginBottom: 8, background: 'rgba(40, 40, 80, 0.9)', backdropFilter: 'blur(4px)', borderRadius: 18, boxShadow: '0 4px 32px #38bdf855, 0 1.5px 0 #fff', padding: '30px 26px', display: 'inline-block', minWidth: 355, maxWidth: 650, width: '90%', border: '2.5px solid #6366f1', position: 'relative', zIndex: 2 }}>
                  {/* Inner container */}
                  <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* Main Group Ionic */}
                    <div style={{ background: 'linear-gradient(100deg,#f3e8ff 60%,#e0f7fa 100%)', borderRadius: 18, boxShadow: '0 2px 16px #b6f8e044', padding: '18px 18px 12px 18px', border: '1.5px solid #b6f8e0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟦</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Main Group Ionic Compounds</b></div>
                      <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li><button className="ptable-btn" onClick={onIonicNaming} style={{ /*...*/ }}>Tutorial: Ionic Naming Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onIonicFormula} style={{ /*...*/ }}>Tutorial: Ionic Formula Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onIonicNameToFormulaActivity} style={{ /*...*/ }}>Activity: Name to Formula (Main Group)</button></li>
                        <li><button className="ptable-btn" onClick={() => { onIonicFormulaToNameActivity(); setPeriodicActivity('ionic-formula-to-name'); }} style={{ /*...*/ }}>Activity: Formula to Name (Main Group)</button></li>
                      </ul>
                    </div>
                    {/* Transition Metal Ionic */}
                    <div style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟩</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Transition Metal Ionic Compounds</b></div>
                      <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li><button className="ptable-btn" onClick={onTransitionMetalIonicTutorial} style={{ /*...*/ }}>Tutorial: Transition Metal Ionic</button></li>
                        <li><button className="ptable-btn" onClick={onTransitionMetalIonicActivity} style={{ /*...*/ }}>Activity: Name to Formula (Transition Metal)</button></li>
                        <li><button className="ptable-btn" onClick={onTransitionMetalFormulaToNameActivity} style={{ /*...*/ }}>Activity: Formula to Name (Transition Metal)</button></li>
                      </ul>
                    </div>
                    {/* Covalent Compounds */}
                    <div style={{ background: 'linear-gradient(100deg,#ffe0fa 60%,#f3e8ff 100%)', borderRadius: 18, boxShadow: '0 2px 16px #e0b6f844', padding: '18px 18px 12px 18px', border: '1.5px solid #e0b6f8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="standard" style={{ fontSize: '1.6em', marginRight: 10 }}>🟪</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Standard: Covalent Compounds</b></div>
                      <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li><button className="ptable-btn" onClick={onCovalentNaming} style={{ /*...*/ }}>Tutorial: Covalent Naming Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onCovalentFormula} style={{ /*...*/ }}>Tutorial: Covalent Formula Instructions</button></li>
                        <li><button className="ptable-btn" onClick={onCovalentNameToFormulaActivity} style={{ /*...*/ }}>Activity: Name to Formula (Covalent)</button></li>
                        <li><button className="ptable-btn" onClick={() => { onCovalentFormulaToNameActivity(); setPeriodicActivity('covalent-formula-to-name'); }} style={{ /*...*/ }}>Activity: Formula to Name (Covalent)</button></li>
                      </ul>
                    </div>
                    {/* Prefix Practice - its own subcategory */}
                    <div style={{ background: 'linear-gradient(100deg,#e0f7fa 60%,#ffe0fa 100%)', borderRadius: 18, boxShadow: '0 2px 16px #a5b4fc44', padding: '18px 18px 12px 18px', border: '2px solid #a259ec', marginTop: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}><span role="img" aria-label="prefixes" style={{ fontSize: '1.6em', marginRight: 10 }}>🔤</span><b style={{ fontSize: '1.19em', letterSpacing: 0.5, color: '#23234a' }}>Prefixes (AP/Honors Must-Know)</b></div>
                      <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                        <li><button className="ptable-btn" onClick={onPrefixPracticeActivity} style={{ /*...*/ }}>Prefix Practice Activity</button></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div> {/* End Chemical Nomenclature Dropdown Section */}

            {/* --- Periodic Trends Dropdown Section --- */}
            <div style={{ margin: '36px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                className="ptable-btn"
                style={{ /* ... existing periodic trends button styles ... */ }}
                onClick={() => setShowPeriodicDropdown(d => !d)}
              >
                <span role="img" aria-label="periodic trends" style={{ marginRight: 10, fontSize: '1.2em', filter: 'drop-shadow(0 2px 6px #facc15)' }}>📈</span>
                Periodic Trends {showPeriodicDropdown ? <span style={{ marginLeft: 8 }}>▲</span> : <span style={{ marginLeft: 8 }}>▼</span>}
              </button>
              <div style={{ height: showPeriodicDropdown ? 22 : 0, transition: 'height 0.3s' }} />
              {showPeriodicDropdown && (
                <div style={{ marginTop: 0, marginBottom: 8, background: 'rgba(252, 231, 187, 0.95)', backdropFilter: 'blur(3px)', borderRadius: 18, boxShadow: '0 4px 24px #facc1555, 0 1px 0 #fff', padding: '24px 20px 16px 20px', maxWidth: 600, width: '90%', display: 'inline-block', position: 'relative', zIndex: 2, border: '1.5px solid #facc15' }}>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                        {/* Atomic Radius Button */}
                        <button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center' }}
                          onClick={() => setPeriodicActivity('atomic-radius')}
                        ><span role="img" aria-label="radius">🟡</span> Atomic Radius</button>
                        {/* Ionization Energy Button */}
                        <button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center' }}
                          onClick={() => setPeriodicActivity('ionization-energy')}
                        ><span role="img" aria-label="ionization">⚡</span> Ionization Energy</button>
                        {/* Electronegativity Button */}
                        <button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center' }}
                          onClick={() => setPeriodicActivity('electronegativity')}
                        ><span role="img" aria-label="electronegativity">🧲</span> Electronegativity Trends</button>
                        {/* Metallic Character Button */}
                        <button className="ptable-btn periodic-btn periodic-trend-btn" style={{ width: 240, alignSelf: 'center' }}
                          onClick={() => setPeriodicActivity('metallic-character')}
                        ><span role="img" aria-label="metallic">🔩</span> Metallic Character</button>
                      </div>
                      {/* *** NO NOMENCLATURE CONTENT HERE *** */}
                    </div> {/* End Activities Card */}
                    {/* Add placeholder for Lessons if needed */}
                  </div>
                </div>
              )}
            </div> {/* End Periodic Trends Dropdown Section */}

            {/* Back Button */}
            <button className="back-btn" onClick={onBack} style={{ marginTop: 28, fontWeight: 600, fontSize: '1.08em', borderRadius: 10, boxShadow: '0 2px 10px #23234a55' }}> Back </button>

          </Fragment>
        )}
      </>
    </div> // End root container
  );
}