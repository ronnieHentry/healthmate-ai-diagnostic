import './Reminders.css';

const remindersData = [
  { title: 'Oranges', note: 'Vitamin C boost during a cold' },
  { title: 'Heating Pad', note: 'Helps relieve back pain' },
  { title: 'Tej kêjn supplement', note: 'at 8:00 AM', status: 'Pending' },
];

const Reminders = () => (
  <section className="history-section reminders-section">
    <h2 className="history-title reminders-title">Reminders & Alerts</h2>
    <div className="cards-row reminders-row">
      {remindersData.map(({ title, note, status }, i) => (
        <div className="card card-reminder" key={i}>
          <div className="card-header-reminder">
            <span className="card-icon-reminder" role="img" aria-label="reminder">⏰</span>
            <strong>{title}</strong>
          </div>
          <p className="reminder-note">{note}</p>
          {status && <span className="pending">{status}</span>}
        </div>
      ))}
    </div>
  </section>
);
export default Reminders;
