import React from 'react';

interface Props {
  n: number;
  t: number;
  iso: number;
  ev: number;
  TARGET_EV: number;
  brightnessOffsetStops: number;
}

const Viewfinder: React.FC<Props> = ({ n, t, iso, brightnessOffsetStops }) => {
  // Brightness mapping:
  // EV = TARGET_EV -> 100% brightness.
  // EV < TARGET_EV -> Brighter. 1 stop = 2x light. brightness % roughly 2^(Stops) * 100
  // To avoid extreme numbers, clamp it for CSS. Or use power curve.

  // Calculate relative light factor. 0 stops = 1x. +3 stops = 8x. -3 stops = 0.125x.
  const lightFactor = Math.pow(2, brightnessOffsetStops);
  let cssBrightness = lightFactor * 100;

  // DoF Blur mapping:
  // N = 1.4 -> very blurry background. N = 22 -> sharp.
  // max blur = 8px at f/1.4, min blur = 0px at f/22.
  const minN = 1.4;
  const maxN = 22;
  const blurFactor = (Math.log2(maxN) - Math.log2(n)) / (Math.log2(maxN) - Math.log2(minN)); // 1 for 1.4, 0 for 22
  const bgBlurPx = blurFactor * 12;

  // Motion Blur mapping:
  // Subject spins. Shutter speed determines how much motion is captured.
  // t is in seconds.
  // If t = 1s, it spins very fast relative to capture (lot of blur).
  // If t = 1/1000s, it's frozen.
  // Directional blur can be approximated with CSS animation and some blur, but let's use a spinning animation instead.
  // Wait, to simulate a still photo, CSS filters like `drop-shadow` or CSS blurry animation can be used, but standard "motion blur" in 2D without SVG is hard.
  // We can use a CSS spin animation that spins FASTER when shutter speed is slower (visualizing the result of a slow shutter).
  // Actually, standard way is to show the viewfinder "live" or show the "photo".
  // Let's show a spinning pinwheel, and when t is slow, we add a spin animation that looks blurred, or use multiple text-shadows/drop-shadows.
  // Easier: apply `filter: blur()` proportional to t. Since it's spinning, radial blur is needed.
  // We can just use an SVG filter for motion blur, or simply standard CSS blur to simulate it abstractly.
  const stdMotionBlurPx = (t / (1 / 2)) * 10; // at 1/2s -> 10px blur. 1/1000s -> ~0px.

  // Metering indicator calculation
  // -3 to +3 range mapping
  let meterValue = brightnessOffsetStops;
  if (meterValue > 3) meterValue = 3;
  if (meterValue < -3) meterValue = -3;
  const meterLeftPercent = 50 + (meterValue / 3) * 50; // -3 -> 0%, +3 -> 100%, 0 -> 50%

  return (
    <div className="panel viewfinder-panel">
      <h2>Camera Viewfinder</h2>

      <div className="viewfinder-container">
        <div className="scene" style={{ filter: `brightness(${cssBrightness}%)` }}>
          {/* Background Layer */}
          <div className="layer background-layer" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}landscape.png)`, filter: `blur(${bgBlurPx}px)` }}></div>

          {/* Foreground Layer */}
          <div className="layer foreground-layer">
            <img
              src={`${import.meta.env.BASE_URL}pinwheel.png`}
              alt="Subject"
              className="subject spin-animation"
              style={{ filter: `blur(${stdMotionBlurPx}px)` }}
            />
          </div>
        </div>

        {/* HUD Overlay */}
        <div className="hud-overlay">
          <div className="grid-line horizontal-1"></div>
          <div className="grid-line horizontal-2"></div>
          <div className="grid-line vertical-1"></div>
          <div className="grid-line vertical-2"></div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">F/{Math.round(n * 10) / 10}</div>
          <div className="status-item">{t >= 1 ? `${t}"` : `1/${Math.round(1 / t)}`}</div>
          <div className="status-item">ISO {iso}</div>
          <div className="meter-wrapper">
            <span>-3</span>
            <div className="meter-track">
              <div className="meter-indicator" style={{ left: `${meterLeftPercent}%` }}></div>
              <div className="meter-center"></div>
            </div>
            <span>+3</span>
          </div>
        </div>

        {/* Clipping Warning */}
        {cssBrightness > 400 && <div className="clipping-warning">과노출</div>}
        {cssBrightness < 20 && <div className="clipping-warning">저노출</div>}

      </div>

      <style>{`
        .viewfinder-panel {
          grid-column: 1 / -1;
        }
        .viewfinder-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background: #000;
          overflow: hidden;
          border-radius: 4px;
        }
        .scene {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          transition: filter 0.3s ease;
        }
        .layer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: cover;
          background-position: center;
        }
        .foreground-layer {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .subject {
          height: 60%;
          object-fit: contain;
          transition: filter 0.3s ease;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        
        .hud-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
        }
        .grid-line {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
        }
        .horizontal-1 { top: 33.33%; left: 0; right: 0; height: 1px; }
        .horizontal-2 { top: 66.66%; left: 0; right: 0; height: 1px; }
        .vertical-1 { left: 33.33%; top: 0; bottom: 0; width: 1px; }
        .vertical-2 { left: 66.66%; top: 0; bottom: 0; width: 1px; }
        
        .status-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40px;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          padding: 0 20px;
          color: var(--hud-color);
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          font-size: 1.2rem;
          gap: 20px;
        }
        
        .meter-wrapper {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }
        .meter-track {
          width: 150px;
          height: 4px;
          background: rgba(255,255,255,0.3);
          position: relative;
        }
        .meter-indicator {
          position: absolute;
          top: -6px;
          width: 4px;
          height: 16px;
          background: #ff0055;
          transition: left 0.3s ease;
          transform: translateX(-50%);
        }
        .meter-center {
          position: absolute;
          top: -4px;
          left: 50%;
          width: 2px;
          height: 12px;
          background: var(--hud-color);
          transform: translateX(-50%);
        }
        
        .clipping-warning {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #ff0055;
          font-family: 'Courier New';
          font-weight: bold;
          font-size: 1.5rem;
          text-shadow: 0 0 10px rgba(255,0,85,0.5);
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Viewfinder;
