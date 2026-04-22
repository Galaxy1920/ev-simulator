import React from 'react';
import { BlockMath } from 'react-katex';

interface Props {
  n: number;
  t: number;
  iso: number;
  ev: number;
}

const MathDisplay: React.FC<Props> = ({ n, t, iso, ev }) => {
  const aperturePart = 2 * Math.log2(n);
  const shutterPart = -Math.log2(t);
  const isoPart = Math.log2(iso / 100);

  const formulaStr = `EV = 2\\log_2(N) - \\log_2(t) - \\log_2\\left(\\frac{ISO}{100}\\right)`;
  const substStr = `EV = 2\\log_2(${n}) - \\log_2(${t >= 1 ? t : `1/${Math.round(1 / t)}`}) - \\log_2\\left(\\frac{${iso}}{100}\\right)`;
  const calcStr = `EV = ${aperturePart.toFixed(2)} ${shutterPart >= 0 ? '+' : ''}${shutterPart.toFixed(2)} - ${isoPart.toFixed(2)} = ${ev.toFixed(2)}`;

  return (
    <div className="panel math-display">
      <h2>실시간 노출 계산 엔진</h2>
      <div className="math-container">
        <BlockMath math={formulaStr} />
        <BlockMath math={substStr} />
        <BlockMath math={calcStr} />
      </div>

      <div className="offset-explanation">
        <h3>노출 요소 분석</h3>
        <p>
          조리개 기여도 ($2\log_2(N)$): <span className="highlight">{aperturePart.toFixed(2)}</span> stops
        </p>
        <p>
          셔터 스피드 기여도 ($-\log_2(t)$): <span className="highlight">{shutterPart.toFixed(2)}</span> stops
        </p>
        <p>
          ISO 기여도 ($-\log_2(ISO/100)$): <span className="highlight">{-isoPart.toFixed(2)}</span> stops
        </p>
        <p className="summary">
          최종 EV: <strong>{ev.toFixed(2)}</strong> (EV가 낮을수록 더 밝은 설정입니다)
        </p>
      </div>

      <style>{`
        .math-display .math-container {
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        .math-display .offset-explanation p {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dashed #444;
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .math-display .offset-explanation .highlight {
          color: var(--hud-color);
          font-family: monospace;
          font-weight: bold;
        }
        .math-display .offset-explanation .summary {
          border: none;
          color: var(--accent-hover);
          font-size: 1.1rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MathDisplay;
