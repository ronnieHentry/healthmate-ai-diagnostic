import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Health suggestions based on parameter and data
function getSuggestion(insight) {
  const avg = insight.data.reduce((a, b) => a + b, 0) / insight.data.length;
  switch (insight.type) {
    case 'bp':
      if (avg > 130) return 'Your BP is a bit high. Consider reducing salt intake.';
      if (avg < 90) return 'Your BP is low. Stay hydrated and consult your doctor.';
      return 'Your BP is in a healthy range.';
    case 'weight':
      if (insight.data[insight.data.length - 1] > insight.data[0]) return 'Weight is increasing. Monitor your diet and activity.';
      if (insight.data[insight.data.length - 1] < insight.data[0]) return 'Weight is decreasing. Ensure you are eating enough.';
      return 'Weight is stable.';
    case 'steps':
      if (avg < 5000) return 'Try to walk more for better health.';
      if (avg > 10000) return 'Great job staying active!';
      return 'You are moderately active.';
    case 'sleep':
      if (avg < 7) return 'Try to get at least 7 hours of sleep.';
      return 'Your sleep duration is good.';
    case 'heart':
      if (avg > 90) return 'Heart rate is high. Consider relaxation techniques.';
      if (avg < 60) return 'Heart rate is low. If you feel dizzy, consult a doctor.';
      return 'Heart rate is normal.';
    case 'hydration':
      if (avg < 1.5) return 'Increase your water intake.';
      if (avg > 2.5) return 'Hydration is excellent!';
      return 'You are drinking a healthy amount of water.';
    case 'magnesium':
      return 'Consider adding magnesium-rich foods like spinach, nuts, and seeds.';
    default:
      return '';
  }
}

const CustomTooltip = ({ active, payload, label, insight }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ background: '#fff', border: '1px solid #eee', padding: 10, borderRadius: 6 }}>
        <div><b>{label}</b></div>
        <div>{insight.title}: {payload[0].value} {insight.unit}</div>
        <div style={{ marginTop: 4, color: '#4f8cff', fontSize: 13 }}>{getSuggestion(insight)}</div>
      </div>
    );
  }
  return null;
};

const InsightModal = ({ insight, onClose }) => {
  // Use insight.dates for X axis if available, else fallback to index
  const chartData = insight.dates
    ? insight.data.map((v, i) => ({ x: insight.dates[i], y: v }))
    : insight.data.map((v, i) => ({ x: i + 1, y: v }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{insight.title} Trend</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <XAxis dataKey="x" />
            <YAxis label={{ value: insight.unit, angle: -90, position: 'insideLeft', offset: 0 }} />
            <Tooltip content={<CustomTooltip insight={insight} />} />
            <Legend payload={[{ value: insight.unit ? `${insight.title} (${insight.unit})` : insight.title, type: 'line', color: insight.sparkColor }]} />
            <Line type="monotone" dataKey="y" stroke={insight.sparkColor} strokeWidth={2} name={insight.unit ? `${insight.title} (${insight.unit})` : insight.title} />
          </LineChart>
        </ResponsiveContainer>
        <button onClick={onClose} style={{marginTop: 16}}>Close</button>
      </div>
    </div>
  );
};

export default InsightModal;
