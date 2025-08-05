
import React, { useState } from 'react';
import './HealthInsights.css';
import InsightCard from './InsightCard';
import InsightModal from './InsightModal';

// Generate last 7 days' dates for X axis labels
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return days;
};

const last7Days = getLast7Days();

const insightsData = [
  {
    type: 'bp',
    title: 'Blood Pressure',
    summary: 'Stable (last week)',
    icon: '🩺',
    data: [120, 122, 119, 121, 120, 118, 121],
    unit: 'mmHg',
    sparkColor: '#4f8cff',
    dates: last7Days
  },
  {
    type: 'weight',
    title: 'Weight',
    summary: '+1.2 kg (2 weeks)',
    icon: '⚖️',
    data: [70, 70.2, 70.5, 71, 71.2, 71.3, 71.4],
    unit: 'kg',
    sparkColor: '#ffb347',
    dates: last7Days
  },
  {
    type: 'steps',
    title: 'Steps',
    summary: 'Avg. 7,200 steps/day',
    icon: '👟',
    data: [6500, 8000, 7200, 7000, 7500, 6900, 7300],
    unit: 'steps',
    sparkColor: '#4fd47e',
    dates: last7Days
  },
  {
    type: 'sleep',
    title: 'Sleep',
    summary: 'Avg. 6.8 hrs/night',
    icon: '🛌',
    data: [7, 6.5, 7.2, 6.8, 6.4, 7, 6.7],
    unit: 'hrs',
    sparkColor: '#8e7fff',
    dates: last7Days
  },
  {
    type: 'heart',
    title: 'Heart Rate',
    summary: 'Avg. 72 bpm',
    icon: '❤️',
    data: [70, 72, 74, 71, 73, 72, 72],
    unit: 'bpm',
    sparkColor: '#ff6b6b',
    dates: last7Days
  },
  {
    type: 'hydration',
    title: 'Hydration',
    summary: 'Try to drink 2L water/day',
    icon: '💧',
    data: [1.5, 1.7, 2, 1.8, 2.1, 1.9, 2],
    unit: 'L',
    sparkColor: '#4fc3f7',
    dates: last7Days
  },
//   {
//     type: 'magnesium',
//     title: 'Diet Suggestion',
//     summary: 'Consider adding magnesium-rich foods',
//     icon: '🥦',
//     data: [1, 1, 1, 1, 1, 1, 1],
//     unit: '',
//     sparkColor: '#6ad47e',
//     dates: last7Days
//   },
];

const HealthInsights = () => {
  const [modal, setModal] = useState({ open: false, insight: null });

  return (
    <section 
      className="history-section insights-section"
    >
      <h2 className="history-title insights-title">Your Health Insights</h2>
      <div className="cards-row insights-row">
        {insightsData.map((insight, i) => (
          <InsightCard
            key={i}
            {...insight}
            onClick={() => setModal({ open: true, insight })}
          />
        ))}
      </div>
      {modal.open && (
        <InsightModal
          insight={modal.insight}
          onClose={() => setModal({ open: false, insight: null })}
        />
      )}
    </section>
  );
};

export default HealthInsights;
