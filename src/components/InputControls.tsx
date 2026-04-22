import React from 'react';
import { APERTURES, SHUTTER_SPEEDS, ISOS } from '../useExposure';

interface Props {
  apertureIdx: number;
  setApertureIdx: (idx: number) => void;
  shutterIdx: number;
  setShutterIdx: (idx: number) => void;
  isoIdx: number;
  setIsoIdx: (idx: number) => void;
}

const InputControls: React.FC<Props> = ({ 
  apertureIdx, setApertureIdx, 
  shutterIdx, setShutterIdx, 
  isoIdx, setIsoIdx 
}) => {
  return (
    <div className="panel input-controls">
      <h2>카메라 설정</h2>
      
      <div className="control-group">
        <label>
          조리개 (N): <span>f/{APERTURES[apertureIdx]}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max={APERTURES.length - 1} 
          step="1" 
          value={apertureIdx}
          onChange={(e) => setApertureIdx(Number(e.target.value))}
        />
        <div className="slider-ticks">
          <span>f/1.4</span>
          <span>f/22</span>
        </div>
      </div>

      <div className="control-group">
        <label>
          셔터 스피드 (t): <span>{SHUTTER_SPEEDS[shutterIdx] >= 1 ? `${SHUTTER_SPEEDS[shutterIdx]}s` : `1/${Math.round(1/SHUTTER_SPEEDS[shutterIdx])}s`}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max={SHUTTER_SPEEDS.length - 1} 
          step="1" 
          value={shutterIdx}
          onChange={(e) => setShutterIdx(Number(e.target.value))}
        />
        <div className="slider-ticks">
          <span>1/1000s</span>
          <span>1s</span>
        </div>
      </div>

      <div className="control-group">
        <label>
          ISO 감도: <span>{ISOS[isoIdx]}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max={ISOS.length - 1} 
          step="1" 
          value={isoIdx}
          onChange={(e) => setIsoIdx(Number(e.target.value))}
        />
        <div className="slider-ticks">
          <span>100</span>
          <span>6400</span>
        </div>
      </div>
      
      <style>{`
        .input-controls .control-group {
          margin-bottom: 1.5rem;
        }
        .input-controls label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .input-controls label span {
          color: var(--accent-color);
          font-family: monospace;
          font-size: 1.1rem;
        }
        .input-controls input[type="range"] {
          width: 100%;
          cursor: pointer;
        }
        .input-controls .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #888;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default InputControls;
