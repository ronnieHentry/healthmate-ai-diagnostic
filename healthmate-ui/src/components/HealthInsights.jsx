import './HealthInsights.css';

const insightsData = [
  { content: 'Average blood pressure', sub: 'last month', value: '120/80 mmHg' },
  { content: '+1.2 kg', sub: '2 weeks' },
  { content: 'Consider adding magnesium-rich foods to your diet', wide: true },
];

const HealthInsights = () => (
  <section className="history-section insights-section">
    <h2 className="history-title insights-title">Your Health Insights</h2>
    <div className="cards-row insights-row">
      {insightsData.map(({ content, sub, value, wide }, i) => (
        <div className={`card card-insight${wide ? ' wide' : ''}`} key={i}>
          <div className="card-header-insight">
            <span className="card-icon-insight" role="img" aria-label="insight">💡</span>
            <p className="insight-content">{content} {sub && <span className="insight-sub">{sub}</span>}</p>
          </div>
          {value && <h3 className="insight-value">{value}</h3>}
        </div>
      ))}
    </div>
  </section>
);
export default HealthInsights;
