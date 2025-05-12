import React, { useState, Suspense, lazy } from 'react';
import Welcome from './Welcome';
import Topics from './Topics';
import IonicNameToFormula from './IonicNameToFormula';
import IonicFormulaToName from './IonicFormulaToName';
import IonicNameToFormulaActivity from './IonicNameToFormulaActivity';
import IonicFormulaToNameActivity from './IonicFormulaToNameActivity';
import PeriodicTable from './PeriodicTable';
import IonicNamingInstructions from './IonicNamingInstructions';
import CovalentNamingInstructions from './CovalentNamingInstructions';
import IonicFormulaInstructions from './IonicFormulaInstructions';
import CovalentFormulaInstructions from './CovalentFormulaInstructions';
import CovalentNameToFormulaActivity from './CovalentNameToFormulaActivity';
import CovalentFormulaToNameActivity from './CovalentFormulaToNameActivity';
import TransitionMetalIonicTutorial from './TransitionMetalIonicTutorial';
import TransitionMetalIonicActivity from './TransitionMetalIonicActivity';
import TransitionMetalFormulaToNameActivity from './TransitionMetalFormulaToNameActivity';
import AtomicRadiusActivity from './AtomicRadiusActivity';
import PrefixPracticeActivity from './PrefixPracticeActivity';
import ShortHandConfigActivity from './ShortHandConfigActivity';
import ElectronegativityActivity from './ElectronegativityActivity';
import MetallicCharacterActivity from './MetallicCharacterActivity';
import LongHandConfigActivity from './LongHandConfigActivity';
import IdentifyElementActivity from './IdentifyElementActivity';
import ElectronConfigExceptionsActivity from './ElectronConfigExceptionsActivity';
import MoleToMoleActivity from './MoleToMoleActivity';
const IonizationEnergyActivity = lazy(() => import('./IonizationEnergyActivity'));




function App() {
  const [screen, setScreen] = useState('welcome');
  const [fade, setFade] = useState(true);
  // historyStack now stores objects: {screen, state}
  const [historyStack, setHistoryStack] = useState([]);
  // For Atomic Radius menu/activities
  const [atomicRadiusScreen, setAtomicRadiusScreen] = useState(null); // null|'menu'|'standard'|'trend'|'explanation')
  // state for tutorial/problem screens
  const [ionicNamingState, setIonicNamingState] = useState({});
  const [covalentNamingState, setCovalentNamingState] = useState({});
  const [ionicFormulaState, setIonicFormulaState] = useState({});
  const [covalentFormulaState, setCovalentFormulaState] = useState({});
  // Add state for ShortHandConfigActivity
  const [shConfigState, setShConfigState] = useState(null);
  const [longConfigState, setLongConfigState] = useState(null);
  const [identifyElementState, setIdentifyElementState] = useState(null);
  const [electronConfigExceptionsState, setElectronConfigExceptionsState] = useState(null);
  const [moleToMoleState, setMoleToMoleState] = useState(null);

  // Helper for smooth fade transitions
  const handleTransition = (nextScreen) => {
    setFade(false);
    setTimeout(() => {
      setScreen(nextScreen);
      setFade(true);
    }, 300); // match CSS fade duration
  };

  // Push current screen and state, then go to ptable
  const goToPeriodicTable = (fromScreen, state) => {
    setHistoryStack(h => [...h, {screen: fromScreen, state}]);
    handleTransition('ptable');
  };

  // Periodic Activity Handler
  const handlePeriodicActivity = (activity) => {
    if (activity === 'atomic-radius') setScreen('atomicRadiusActivity');
    else if (activity === 'ionization-energy') setScreen('ionizationEnergyActivity');
    else if (activity === 'electronegativity') setScreen('electronegativityActivity');
    else if (activity === 'metallic-character') setScreen('metallicCharacterActivity');
    else if (activity === 'noble-gas-config') setScreen('shorthandConfigActivity');
    else if (activity === 'covalent-formula-to-name') setScreen('covalentFormulaToNameActivity');
    else if (activity === 'ionic-formula-to-name') setScreen('ionicFormulaToNameActivity');
    else if (activity === 'ionic-name-to-formula') setScreen('ionicNameToFormulaActivity');
    else if (activity === 'covalent-name-to-formula') setScreen('covalentNameToFormulaActivity');
    else if (activity === 'covalent-formula-to-name') setScreen('covalentFormulaToNameActivity');
    else if (activity === 'prefix-practice') setScreen('prefixPracticeActivity');
    else if (activity === 'transition-metal-ionic-tutorial') setScreen('transitionMetalIonicTutorial');
    else if (activity === 'transition-metal-ionic') setScreen('transitionMetalIonicActivity');
    else if (activity === 'transition-metal-formula-to-name') setScreen('transitionMetalFormulaToNameActivity');
    else if (activity === 'ionization-energy') setScreen('ionizationEnergyActivity');
    else if (activity === 'long-hand-config') setScreen('longHandConfigActivity');
    else if (activity === 'identify-element') setScreen('identifyElementActivity');
    else if (activity === 'electron-config-exceptions') setScreen('electronConfigExceptionsActivity');
    else if (activity === 'mole-to-mole') setScreen('moleToMoleActivity');
    else setScreen('topics');
  };

  // Restore the previous screen and state
  const handlePTableBack = () => {
    if (historyStack.length > 0) {
      const last = historyStack[historyStack.length - 1];
      setHistoryStack(h => h.slice(0, h.length - 1));
      if (last.screen === 'ionicNamingInstructions') {
        setIonicNamingState(last.state || {});
      } else if (last.screen === 'covalentNamingInstructions') {
        setCovalentNamingState(last.state || {});
      } else if (last.screen === 'ionicFormulaInstructions') {
        setIonicFormulaState(last.state || {});
      } else if (last.screen === 'covalentFormulaInstructions') {
        setCovalentFormulaState(last.state || {});
      } else if (last.screen === 'shorthandConfigActivity') {
        setShConfigState(last.state || null);
      } else if (last.screen === 'longHandConfigActivity') {
        setLongConfigState(last.state || null);
      } else if (last.screen === 'identifyElementActivity') {
        setIdentifyElementState(last.state || null);
      } else if (last.screen === 'electronConfigExceptionsActivity') {
        setElectronConfigExceptionsState(last.state || null);
      } else if (last.screen === 'moleToMoleActivity') {
        setMoleToMoleState(last.state || null);
      }
      handleTransition(last.screen);
    } else {
      handleTransition('topics');
    }
  };

  return (
    <div className={`app-bg ${fade ? 'fade-in' : 'fade-out'}`}>

      {screen === 'welcome' && <Welcome onNext={() => handleTransition('topics')} />}
      {screen === 'topics' && (
        <Topics
          onBack={() => setScreen('welcome')}
          onAtomicRadiusActivityPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'atomicRadiusActivity'}]); handleTransition('ptable'); }}
          onIonicNaming={() => setScreen('ionicNamingInstructions')}
          onCovalentNaming={() => setScreen('covalentNamingInstructions')}
          onIonicFormula={() => setScreen('ionicFormulaInstructions')}
          onCovalentFormula={() => setScreen('covalentFormulaInstructions')}
          onIonicNameToFormulaActivity={() => setScreen('ionicNameToFormulaActivity')}
          onIonicFormulaToNameActivity={() => setScreen('ionicFormulaToNameActivity')}
          onCovalentNameToFormulaActivity={() => setScreen('covalentNameToFormulaActivity')}
          onCovalentFormulaToNameActivity={() => setScreen('covalentFormulaToNameActivity')}
          onPrefixPracticeActivity={() => setScreen('prefixPracticeActivity')}
          onTransitionMetalIonicTutorial={() => setScreen('transitionMetalIonicTutorial')}
          onTransitionMetalIonicActivity={() => setScreen('transitionMetalIonicActivity')}
          onTransitionMetalFormulaToNameActivity={() => setScreen('transitionMetalFormulaToNameActivity')}
          onIonizationEnergyActivity={() => setScreen('ionizationEnergyActivity')}
          onLongHandConfigActivity={() => setScreen('longHandConfigActivity')}
          onPeriodicActivity={handlePeriodicActivity}
        />
      )}
      {screen === 'ionicNamingInstructions' && (
        <IonicNamingInstructions
          onBack={() => setScreen('topics')}
          onPeriodicTable={state => goToPeriodicTable('ionicNamingInstructions', state)}
          savedState={ionicNamingState}
          setSavedState={setIonicNamingState}
        />
      )}
      {screen === 'covalentNamingInstructions' && (
        <CovalentNamingInstructions
          onBack={() => setScreen('topics')}
          onPeriodicTable={state => goToPeriodicTable('covalentNamingInstructions', state)}
          savedState={covalentNamingState}
          setSavedState={setCovalentNamingState}
        />
      )}
      {screen === 'ionicFormulaInstructions' && (
        <IonicFormulaInstructions
          onBack={() => setScreen('topics')}
          onPeriodicTable={state => goToPeriodicTable('ionicFormulaInstructions', state)}
          savedState={ionicFormulaState}
          setSavedState={setIonicFormulaState}
        />
      )}
      {screen === 'covalentFormulaInstructions' && (
        <CovalentFormulaInstructions
          onBack={() => setScreen('topics')}
          onPeriodicTable={state => goToPeriodicTable('covalentFormulaInstructions', state)}
          savedState={covalentFormulaState}
          setSavedState={setCovalentFormulaState}
        />
      )}
      {screen === 'ionic' && <IonicNameToFormula 
        onBack={() => handleTransition('topics')}
        onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'ionic'}]); handleTransition('ptable'); }}
      />}
      {screen === 'formulaToName' && <IonicFormulaToName 
        onBack={() => handleTransition('topics')}
        onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'formulaToName'}]); handleTransition('ptable'); }}
      />}
      {screen === 'ionicNameToFormulaActivity' && (
        <IonicNameToFormulaActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'ionicNameToFormulaActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'ionicFormulaToNameActivity' && (
        <IonicFormulaToNameActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'ionicFormulaToNameActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'ptable' && <PeriodicTable onBack={handlePTableBack} />}
      {screen === 'atomicRadiusActivity' && (
        <AtomicRadiusActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'atomicRadiusActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'covalentNameToFormulaActivity' && (
        <CovalentNameToFormulaActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'covalentNameToFormulaActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'covalentFormulaToNameActivity' && (
        <CovalentFormulaToNameActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'covalentFormulaToNameActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'transitionMetalIonicTutorial' && (
        <TransitionMetalIonicTutorial
          onBack={() => setScreen('topics')}
        />
      )}
      {screen === 'transitionMetalIonicActivity' && (
        <TransitionMetalIonicActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'transitionMetalIonicActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'transitionMetalFormulaToNameActivity' && (
        <TransitionMetalFormulaToNameActivity
          onBack={() => setScreen('topics')}
        />
      )}
      {screen === 'ionizationEnergyActivity' && (
        <Suspense fallback={<div style={{color:'#fff',textAlign:'center',marginTop:40}}>Loading Activity...</div>}>
          <IonizationEnergyActivity
            onBack={() => setScreen('topics')}
            onPeriodicTable={() => { 
              setHistoryStack(h => [...h, {screen: 'ionizationEnergyActivity'}]); 
              handleTransition('ptable'); 
            }}
          />
        </Suspense>
      )}
      {screen === 'prefixPracticeActivity' && (
        <PrefixPracticeActivity
          onBack={() => setScreen('topics')}
        />
      )}
      {screen === 'shorthandConfigActivity' && (
        <ShortHandConfigActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => {
            setShConfigState({
              remaining: shConfigState?.remaining,
              used: shConfigState?.used,
              usedTypes: shConfigState?.usedTypes,
              question: shConfigState?.question,
              userAnswer: shConfigState?.userAnswer,
              feedback: shConfigState?.feedback,
              showFeedback: shConfigState?.showFeedback
            });
            setHistoryStack(h => [...h, {screen: 'shorthandConfigActivity', state: shConfigState}]);
            handleTransition('ptable');
          }}
          savedState={shConfigState}
          setSavedState={setShConfigState}
        />
      )}
      {screen === 'electronegativityActivity' && (
        <ElectronegativityActivity
          onBack={() => setScreen('topics')}
          onShowPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'electronegativityActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'metallicCharacterActivity' && (
        <MetallicCharacterActivity
          onBack={() => setScreen('topics')}
          onShowPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'metallicCharacterActivity'}]); handleTransition('ptable'); }}
        />
      )}
      {screen === 'longHandConfigActivity' && (
        <LongHandConfigActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => {
            setLongConfigState({
              remaining: longConfigState?.remaining,
              used: longConfigState?.used,
              usedTypes: longConfigState?.usedTypes,
              question: longConfigState?.question,
              userAnswer: longConfigState?.userAnswer,
              feedback: longConfigState?.feedback,
              showFeedback: longConfigState?.showFeedback
            });
            setHistoryStack(h => [...h, {screen: 'longHandConfigActivity', state: longConfigState}]);
            handleTransition('ptable');
          }}
          savedState={longConfigState}
          setSavedState={setLongConfigState}
        />
      )}
      {screen === 'identifyElementActivity' && (
        <IdentifyElementActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { 
            setHistoryStack(h => [...h, {screen: 'identifyElementActivity', state: identifyElementState}]); 
            handleTransition('ptable');
          }}
          savedState={identifyElementState}
          setSavedState={setIdentifyElementState}
        />
      )}
      {screen === 'electronConfigExceptionsActivity' && (
        <ElectronConfigExceptionsActivity
          onBack={() => setScreen('topics')}
          onPeriodicTable={() => { 
            setHistoryStack(h => [...h, {screen: 'electronConfigExceptionsActivity', state: electronConfigExceptionsState}]); 
            handleTransition('ptable');
          }}
          savedState={electronConfigExceptionsState}
          setSavedState={setElectronConfigExceptionsState}
        />
      )}
      {screen === 'moleToMoleActivity' && (
        <MoleToMoleActivity
          onBack={handlePTableBack}
          onPeriodicTable={() => goToPeriodicTable('moleToMoleActivity', moleToMoleState)}
          savedState={moleToMoleState}
          setSavedState={(s) => setMoleToMoleState(s)}
        />
      )}
    </div>
  );
}

export default App;
