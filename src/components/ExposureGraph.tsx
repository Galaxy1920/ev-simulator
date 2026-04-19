import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { SHUTTER_SPEEDS } from '../useExposure';

interface Props {
  n: number;
  t: number;
  iso: number;
  ev: number;
}

const ExposureGraph: React.FC<Props> = ({ n, t, iso, ev }) => {
  // Generate data points for the equivalent exposure curve
  const data = useMemo(() => {
    return SHUTTER_SPEEDS.map(shutter => {
      // Calculate N required to maintain 'ev' at the current ISO with this 'shutter'
      // EV = 2*log2(N) - log2(t) - log2(ISO/100)
      // 2*log2(N) = EV + log2(t) + log2(ISO/100)
      // N = 2 ^ ((EV + log2(t) + log2(ISO/100)) / 2)
      
      const isoOffset = Math.log2(iso / 100);
      const reqN = Math.pow(2, (ev + Math.log2(shutter) + isoOffset) / 2);
      
      return {
        shutter,
        shutterLabel: shutter >= 1 ? `${shutter}s` : `1/${Math.round(1/shutter)}`,
        aperture: reqN > 32 || reqN < 0.5 ? null : Number(reqN.toFixed(1)) // cap the curve
      };
    }).filter(d => d.aperture !== null);
  }, [ev, iso]);

  return (
    <div className="panel graph-panel">
      <h2>Equivalent Exposure Curve (Constant EV)</h2>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="shutterLabel" 
              stroke="#888" 
              label={{ value: 'Shutter Speed (t)', position: 'insideBottom', offset: -10, fill: '#888' }} 
            />
            <YAxis 
              yAxisId="left"
              stroke="#888" 
              domain={['auto', 'auto']}
              label={{ value: 'Aperture (N)', angle: -90, position: 'insideLeft', fill: '#888' }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: any) => [`f/${value}`, 'Aperture']}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="aperture" 
              stroke="var(--accent-color)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: 'var(--accent-color)' }} 
              activeDot={{ r: 6 }} 
              isAnimationActive={false} // Disable animation for real-time feel
            />
            <ReferenceDot 
              yAxisId="left"
              x={t >= 1 ? `${t}s` : `1/${Math.round(1/t)}`} 
              y={n} 
              r={6} 
              fill="#ff0055" 
              stroke="#fff" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        .graph-panel {
          grid-column: 1 / -1;
        }
        .graph-container {
          width: 100%;
          height: 300px;
        }
      `}</style>
    </div>
  );
};

export default ExposureGraph;
