import React from 'react';
import type { ExposureRecord } from '../useExposure';

interface Props {
  records: ExposureRecord[];
  onSave: () => void;
}

const DataLog: React.FC<Props> = ({ records, onSave }) => {
  return (
    <div className="panel datalog-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, border: 'none' }}>노출 데이터 로그</h2>
        <button className="button" onClick={onSave}>현재 설정 기록</button>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>시간</th>
              <th>조리개</th>
              <th>셔터</th>
              <th>ISO</th>
              <th>EV</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  기록된 데이터가 없습니다. "현재 설정 기록"을 클릭하세요.
                </td>
              </tr>
            ) : (
              records.map(record => (
                <tr key={record.id}>
                  <td>{record.timestamp}</td>
                  <td>f/{record.aperture}</td>
                  <td>{record.shutterSpeed >= 1 ? `${record.shutterSpeed}s` : `1/${Math.round(1/record.shutterSpeed)}`}</td>
                  <td>{record.iso}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--hud-color)' }}>{record.ev}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .datalog-panel {
          grid-column: 1 / -1;
        }
        .table-container {
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid var(--border-color);
          border-radius: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        th, td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        th {
          background: #1e1e1e;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        tr:last-child td {
          border-bottom: none;
        }
        tr:hover td {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default DataLog;
