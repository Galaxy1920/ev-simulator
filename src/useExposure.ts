import { useState, useMemo } from 'react';

// N (Aperture) values: sqrt(2) multiples
export const APERTURES = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22];

// t (Shutter Speed) values in seconds
export const SHUTTER_SPEEDS = [
  1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15, 1/8, 1/4, 1/2, 1
];

// ISO values
export const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];

export type ExposureRecord = {
  id: string;
  aperture: number;
  shutterSpeed: number;
  iso: number;
  ev: number;
  timestamp: string;
};

export function useExposure() {
  const [apertureIdx, setApertureIdx] = useState(6); // f/11 default
  const [shutterIdx, setShutterIdx] = useState(3); // 1/125 default
  const [isoIdx, setIsoIdx] = useState(1); // 200 default
  
  const [records, setRecords] = useState<ExposureRecord[]>([]);

  const n = APERTURES[apertureIdx];
  const t = SHUTTER_SPEEDS[shutterIdx];
  const iso = ISOS[isoIdx];

  const ev = useMemo(() => {
    // EV = 2*log2(N) - log2(t) - log2(ISO/100)
    const baseEv = 2 * Math.log2(n) - Math.log2(t);
    const isoOffset = Math.log2(iso / 100);
    return baseEv - isoOffset;
  }, [n, t, iso]);

  // Nominal Correct EV based on standard scenes (e.g., sunny 16 -> EV 15)
  // Nominal Correct EV based on user request (ISO 200, F/11, 1/125s)
  const TARGET_EV = (2 * Math.log2(11) - Math.log2(1/125)) - Math.log2(200 / 100);
  
  // Calculate difference. If EV < TARGET_EV, the simulated image gets brighter.
  // Wait, if scene gives TARGET_EV (10) of light, user sets EV of 8, that means camera is letting MORE light in.
  // Actually, EV is exposure value of camera setting. Lower EV setting means camera lets MORE light in (brighter result for same scene).
  // Brightness change factor: 2^(TARGET_EV - EV)
  // If Target is 10, Camera EV is 10, brightness = 1.
  // If Camera EV is 9, brightness = 2 (1 stop brighter).
  const brightnessOffsetStops = TARGET_EV - ev;

  const addRecord = () => {
    const newRecord: ExposureRecord = {
      id: Math.random().toString(36).substr(2, 9),
      aperture: n,
      shutterSpeed: t,
      iso: iso,
      ev: Number(ev.toFixed(2)),
      timestamp: new Date().toLocaleTimeString(),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  return {
    n, t, iso, ev, TARGET_EV, brightnessOffsetStops,
    apertureIdx, setApertureIdx,
    shutterIdx, setShutterIdx,
    isoIdx, setIsoIdx,
    records, addRecord
  };
}
