import React, { useState, Suspense, lazy } from 'react';

// Eagerly loaded core components
import Welcome from './Welcome';
import Topics from './Topics';

// Lazy loaded screen/activity components
const IonicNameToFormula = lazy(() => import('./IonicNameToFormula'));
const IonicFormulaToName = lazy(() => import('./IonicFormulaToName'));
const IonicNameToFormulaActivity = lazy(() => import('./IonicNameToFormulaActivity'));
const IonicFormulaToNameActivity = lazy(() => import('./IonicFormulaToNameActivity'));
const PeriodicTable = lazy(() => import('./PeriodicTable'));
const IonicNamingInstructions = lazy(() => import('./IonicNamingInstructions'));
const CovalentNamingInstructions = lazy(() => import('./CovalentNamingInstructions'));
const IonicFormulaInstructions = lazy(() => import('./IonicFormulaInstructions'));
const CovalentFormulaInstructions = lazy(() => import('./CovalentFormulaInstructions'));
const CovalentNameToFormulaActivity = lazy(() => import('./CovalentNameToFormulaActivity'));
const CovalentFormulaToNameActivity = lazy(() => import('./CovalentFormulaToNameActivity'));
const TransitionMetalIonicTutorial = lazy(() => import('./TransitionMetalIonicTutorial'));
const TransitionMetalIonicActivity = lazy(() => import('./TransitionMetalIonicActivity'));
const TransitionMetalFormulaToNameActivity = lazy(() => import('./TransitionMetalFormulaToNameActivity'));
const AtomicRadiusActivity = lazy(() => import('./AtomicRadiusActivity'));
const IonizationEnergyActivity = lazy(() => import('./IonizationEnergyActivity'));
const PrefixPracticeActivity = lazy(() => import('./PrefixPracticeActivity'));
const ShortHandConfigActivity = lazy(() => import('./ShortHandConfigActivity'));
const ElectronegativityActivity = lazy(() => import('./ElectronegativityActivity'));
const MetallicCharacterActivity = lazy(() => import('./MetallicCharacterActivity'));
const LongHandConfigActivity = lazy(() => import('./LongHandConfigActivity'));
const IdentifyElementActivity = lazy(() => import('./IdentifyElementActivity'));
const ElectronConfigExceptionsActivity = lazy(() => import('./ElectronConfigExceptionsActivity'));
const MoleToMoleActivity = lazy(() => import('./MoleToMoleActivity'));
const MassMoleAndMoleMassActivity = lazy(() => import('./MassMoleAndMoleMassActivity'));
const MassToMassActivity = lazy(() => import('./MassToMassActivity'));
const LimitingReactantActivity = lazy(() => import('./LimitingReactantActivity'));
const TheoreticalPercentYieldActivity = lazy(() => import('./TheoreticalPercentYieldActivity'));

const LoadingFallback = <div style={{color:'#fff',textAlign:'center',marginTop:40, fontSize: '1.2em'}}>Loading Activity...</div>;

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
  const [massMoleState, setMassMoleState] = useState(null);
  const [massToMassState, setMassToMassState] = useState(null);
  const [limitingReactantState, setLimitingReactantState] = useState(null);
  const [theoreticalPercentYieldState, setTheoreticalPercentYieldState] = useState(null);

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
    else if (activity === 'prefix-practice') setScreen('prefixPracticeActivity');
    else if (activity === 'transition-metal-ionic-tutorial') setScreen('transitionMetalIonicTutorial');
    else if (activity === 'transition-metal-ionic') setScreen('transitionMetalIonicActivity');
    else if (activity === 'transition-metal-formula-to-name') setScreen('transitionMetalFormulaToNameActivity');
    else if (activity === 'long-hand-config') setScreen('longHandConfigActivity');
    else if (activity === 'identify-element') setScreen('identifyElementActivity');
    else if (activity === 'electron-config-exceptions') setScreen('electronConfigExceptionsActivity');
    else if (activity === 'mole-to-mole') setScreen('moleToMoleActivity');
    else if (activity === 'mass-mole-and-mole-mass') setScreen('massMoleAndMoleMassActivity');
    else if (activity === 'mass-to-mass') setScreen('massToMassActivity');
    else if (activity === 'limiting-reactant') setScreen('limitingReactantActivity');
    else if (activity === 'theoretical-percent-yield') setScreen('theoretical-percent-yield');
    else setScreen('topics');
  };

  // Gas Law Activity Handler
  const handleGasLawActivity = (key) => {
    switch (key) {
      case 'ideal-gas-law': setScreen('ideal-gas-law'); break;
      case 'boyles-law': setScreen('boyles-law'); break;
      case 'charles-law': setScreen('charles-law'); break;
      case 'combined-gas-law': setScreen('combined-gas-law'); break;
      case 'gas-stoichiometry': setScreen('gas-stoichiometry'); break;
      case 'daltons-law': setScreen('daltons-law'); break;
      case 'grahams-law': setScreen('grahams-law'); break;
      case 'collecting-gas-over-water': setScreen('collecting-gas-over-water'); break;
      default: setScreen('topics');
    }
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
      } else if (last.screen === 'massMoleAndMoleMassActivity') {
        setMassMoleState(last.state || null);
      } else if (last.screen === 'massToMassActivity') {
        setMassToMassState(last.state || null);
      } else if (last.screen === 'limitingReactantActivity') {
        setLimitingReactantState(last.state || null);
      } else if (last.screen === 'theoreticalPercentYieldActivity') {
        setTheoreticalPercentYieldState(last.state || null);
      }
      handleTransition(last.screen);
    } else {
      handleTransition('topics');
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <Welcome onNext={() => handleTransition('topics')} />;
      case 'topics':
        return (
          <Topics
            onBack={() => setScreen('welcome')}
            onGasLawActivity={handleGasLawActivity}
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
        );
      case 'ionicNamingInstructions':
        return <IonicNamingInstructions onBack={() => setScreen('topics')} onPeriodicTable={state => goToPeriodicTable('ionicNamingInstructions', state)} savedState={ionicNamingState} setSavedState={setIonicNamingState} />;
      case 'covalentNamingInstructions':
        return <CovalentNamingInstructions onBack={() => setScreen('topics')} onPeriodicTable={state => goToPeriodicTable('covalentNamingInstructions', state)} savedState={covalentNamingState} setSavedState={setCovalentNamingState} />;
      case 'ionicFormulaInstructions':
        return <IonicFormulaInstructions onBack={() => setScreen('topics')} onPeriodicTable={state => goToPeriodicTable('ionicFormulaInstructions', state)} savedState={ionicFormulaState} setSavedState={setIonicFormulaState} />;
      case 'covalentFormulaInstructions':
        return <CovalentFormulaInstructions onBack={() => setScreen('topics')} onPeriodicTable={state => goToPeriodicTable('covalentFormulaInstructions', state)} savedState={covalentFormulaState} setSavedState={setCovalentFormulaState} />;
      case 'ionic':
        return <IonicNameToFormula onBack={() => handleTransition('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'ionic'}]); handleTransition('ptable'); }} />;
      case 'formulaToName':
        return <IonicFormulaToName onBack={() => handleTransition('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'formulaToName'}]); handleTransition('ptable'); }} />;
      case 'ionicNameToFormulaActivity':
        return <IonicNameToFormulaActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'ionicNameToFormulaActivity'}]); handleTransition('ptable'); }} />;
      case 'ionicFormulaToNameActivity':
        return <IonicFormulaToNameActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'ionicFormulaToNameActivity'}]); handleTransition('ptable'); }} />;
      case 'ptable':
        return <PeriodicTable onBack={handlePTableBack} />;
      case 'atomicRadiusActivity':
        return <AtomicRadiusActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'atomicRadiusActivity'}]); handleTransition('ptable'); }} />;
      case 'covalentNameToFormulaActivity':
        return <CovalentNameToFormulaActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'covalentNameToFormulaActivity'}]); handleTransition('ptable'); }} />;
      case 'covalentFormulaToNameActivity':
        return <CovalentFormulaToNameActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'covalentFormulaToNameActivity'}]); handleTransition('ptable'); }} />;
      case 'transitionMetalIonicTutorial':
        return <TransitionMetalIonicTutorial onBack={() => setScreen('topics')} />;
      case 'transitionMetalIonicActivity':
        return <TransitionMetalIonicActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'transitionMetalIonicActivity'}]); handleTransition('ptable'); }} />;
      case 'transitionMetalFormulaToNameActivity':
        return <TransitionMetalFormulaToNameActivity onBack={() => setScreen('topics')} />;
      case 'ionizationEnergyActivity':
        return <IonizationEnergyActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'ionizationEnergyActivity'}]); handleTransition('ptable'); }} />;
      case 'prefixPracticeActivity':
        return <PrefixPracticeActivity onBack={() => setScreen('topics')} />;
      case 'shorthandConfigActivity':
        return <ShortHandConfigActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setShConfigState({ remaining: shConfigState?.remaining, used: shConfigState?.used, usedTypes: shConfigState?.usedTypes, question: shConfigState?.question, userAnswer: shConfigState?.userAnswer, feedback: shConfigState?.feedback, showFeedback: shConfigState?.showFeedback }); setHistoryStack(h => [...h, {screen: 'shorthandConfigActivity', state: shConfigState}]); handleTransition('ptable'); }} savedState={shConfigState} setSavedState={setShConfigState} />;
      case 'electronegativityActivity':
        return <ElectronegativityActivity onBack={() => setScreen('topics')} onShowPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'electronegativityActivity'}]); handleTransition('ptable'); }} />;
      case 'metallicCharacterActivity':
        return <MetallicCharacterActivity onBack={() => setScreen('topics')} onShowPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'metallicCharacterActivity'}]); handleTransition('ptable'); }} />;
      case 'longHandConfigActivity':
        return <LongHandConfigActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setLongConfigState({ remaining: longConfigState?.remaining, used: longConfigState?.used, usedTypes: longConfigState?.usedTypes, question: longConfigState?.question, userAnswer: longConfigState?.userAnswer, feedback: longConfigState?.feedback, showFeedback: longConfigState?.showFeedback }); setHistoryStack(h => [...h, {screen: 'longHandConfigActivity', state: longConfigState}]); handleTransition('ptable'); }} savedState={longConfigState} setSavedState={setLongConfigState} />;
      case 'identifyElementActivity':
        return <IdentifyElementActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'identifyElementActivity', state: identifyElementState}]); handleTransition('ptable'); }} savedState={identifyElementState} setSavedState={setIdentifyElementState} />;
      case 'electronConfigExceptionsActivity':
        return <ElectronConfigExceptionsActivity onBack={() => setScreen('topics')} onPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'electronConfigExceptionsActivity', state: electronConfigExceptionsState}]); handleTransition('ptable'); }} savedState={electronConfigExceptionsState} setSavedState={setElectronConfigExceptionsState} />;
      case 'moleToMoleActivity':
        return <MoleToMoleActivity onBack={handlePTableBack} onPeriodicTable={() => goToPeriodicTable('moleToMoleActivity', moleToMoleState)} savedState={moleToMoleState} setSavedState={(s) => setMoleToMoleState(s)} />;
      case 'massMoleAndMoleMassActivity':
        return <MassMoleAndMoleMassActivity onBack={handlePTableBack} onShowPeriodicTable={() => goToPeriodicTable('massMoleAndMoleMassActivity', massMoleState)} savedState={massMoleState} setSavedState={setMassMoleState} />;
      case 'massToMassActivity':
        return <MassToMassActivity onBack={handlePTableBack} onShowPeriodicTable={() => goToPeriodicTable('massToMassActivity', massToMassState)} savedState={massToMassState} setSavedState={setMassToMassState} />;
      case 'limitingReactantActivity':
        return <LimitingReactantActivity onBack={handlePTableBack} onShowPeriodicTable={() => goToPeriodicTable('limitingReactantActivity', limitingReactantState)} savedState={limitingReactantState} setSavedState={setLimitingReactantState} />;
      case 'theoretical-percent-yield':
        return <TheoreticalPercentYieldActivity onBack={handlePTableBack} onShowPeriodicTable={() => goToPeriodicTable('theoretical-percent-yield', theoreticalPercentYieldState)} savedState={theoreticalPercentYieldState} setSavedState={setTheoreticalPercentYieldState} />;
      default:
        return <Welcome onNext={() => handleTransition('topics')} />;
    }
  };

  return (
    <div className={`app-bg ${fade ? 'fade-in' : 'fade-out'}`}>
      <Suspense fallback={LoadingFallback}>
        {renderScreen()}
      </Suspense>
    </div>
  );
}

export default App;
