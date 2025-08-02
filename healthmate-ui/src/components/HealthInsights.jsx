import './HealthInsights.css';

const insightsData = [
  { content: 'Average blood pressure', sub: 'last month', value: '120/80 mmHg' },
  { content: '+1.2 kg', sub: '2 weeks' },
  { content: 'Consider adding magnesium-rich foods to your diet', wide: true },
];

const HealthInsights = () => (
  <section className="insights-section">
    <h2>Your Health Insights</h2>
    <div className="cards-row">
      {insightsData.map(({ content, sub, value, wide }, i) => (
        <div className={`card${wide ? ' wide' : ''}`} key={i}>
          <p>{content} {sub && <span>{sub}</span>}</p>
          {value && <h3>{value}</h3>}
        </div>
      ))}
    </div>
  </section>
);
export default HealthInsights;
