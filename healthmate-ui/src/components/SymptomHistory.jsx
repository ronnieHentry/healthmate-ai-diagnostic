import './SymptomHistory.css';

const historyData = [
  { date: 'Jul 21', title: 'Cold & Flu' },
  { date: 'Jul 10', title: 'Headache' },
  { date: 'Jun 26', title: 'Back Pain' },
];

const SymptomHistory = ({ onViewDetails }) => (
  <section className="history-section">
    <h2>Assistant History</h2>
    <div className="cards-row">
      {historyData.map(({ date, title }) => (
        <div className="card" key={title}>
          <p>{date}</p>
          <h3>{title}</h3>
          <button onClick={() => onViewDetails(`Details about ${title}`)}>View Details</button>
        </div>
      ))}
    </div>
  </section>
);
export default SymptomHistory;
