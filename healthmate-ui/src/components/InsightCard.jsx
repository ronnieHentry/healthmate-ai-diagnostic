import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const InsightCard = ({ title, summary, data, unit, sparkColor, onClick }) => (
  <div className="card card-insight" onClick={onClick} style={{ cursor: 'pointer' }}>
    <div className="card-header-insight">
      <span className="card-icon-insight" role="img" aria-label="insight">💡</span>
      <div>
        <div className="insight-content">{title}</div>
        <div className="insight-summary">{summary}</div>
      </div>
    </div>
    <div style={{ width: '100%', height: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((v, i) => ({ x: i, y: v }))} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <Line type="monotone" dataKey="y" stroke={sparkColor} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default InsightCard;
