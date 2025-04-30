import React, { useState } from 'react';
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

function App() {
  const [screen, setScreen] = useState('welcome');
  const [fade, setFade] = useState(true);
  // historyStack now stores objects: {screen, state}
  const [historyStack, setHistoryStack] = useState([]);
  // state for tutorial/problem screens
  const [ionicNamingState, setIonicNamingState] = useState({});
  const [covalentNamingState, setCovalentNamingState] = useState({});
  const [ionicFormulaState, setIonicFormulaState] = useState({});
  const [covalentFormulaState, setCovalentFormulaState] = useState({});

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
          onTransitionMetalIonicTutorial={() => setScreen('transitionMetalIonicTutorial')}
          onTransitionMetalIonicActivity={() => setScreen('transitionMetalIonicActivity')}
          onTransitionMetalFormulaToNameActivity={() => setScreen('transitionMetalFormulaToNameActivity')}
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
        />
      )}
      {screen === 'covalentFormulaToNameActivity' && (
        <CovalentFormulaToNameActivity
          onBack={() => setScreen('topics')}
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
        />
      )}
      {screen === 'transitionMetalFormulaToNameActivity' && (
        <TransitionMetalFormulaToNameActivity
          onBack={() => setScreen('topics')}
        />
      )}
    </div>
  );
}

export default App;
