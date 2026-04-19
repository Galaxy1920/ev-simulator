
import './App.css';
import { useExposure } from './useExposure';
import Viewfinder from './components/Viewfinder';
import MathDisplay from './components/MathDisplay';
import InputControls from './components/InputControls';
import ExposureGraph from './components/ExposureGraph';
import DataLog from './components/DataLog';

function App() {
  const exposureState = useExposure();

  return (
    <div className="app-container">
      <header style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'var(--accent-color)', margin: 0 }}>EV Simulator Pro</h1>
        <p style={{ color: '#aaa' }}>Interactive Exposure Value Calculator & Camera Interface</p>
      </header>

      {/* Main Layout: Viewfinder on top wide, Controls & Math side-by-side, then Graph, then DataLog */}
      <Viewfinder 
        n={exposureState.n}
        t={exposureState.t}
        iso={exposureState.iso}
        ev={exposureState.ev}
        TARGET_EV={exposureState.TARGET_EV}
        brightnessOffsetStops={exposureState.brightnessOffsetStops}
      />
      
      <InputControls 
        apertureIdx={exposureState.apertureIdx} setApertureIdx={exposureState.setApertureIdx}
        shutterIdx={exposureState.shutterIdx} setShutterIdx={exposureState.setShutterIdx}
        isoIdx={exposureState.isoIdx} setIsoIdx={exposureState.setIsoIdx}
      />

      <MathDisplay 
        n={exposureState.n}
        t={exposureState.t}
        iso={exposureState.iso}
        ev={exposureState.ev}
      />

      <ExposureGraph 
        n={exposureState.n}
        t={exposureState.t}
        iso={exposureState.iso}
        ev={exposureState.ev}
      />

      <DataLog 
        records={exposureState.records}
        onSave={exposureState.addRecord}
      />
    </div>
  );
}

export default App;
