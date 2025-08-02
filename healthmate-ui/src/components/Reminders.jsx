import './Reminders.css';

const remindersData = [
  { title: 'Oranges', note: 'Vitamin C boost during a cold' },
  { title: 'Heating Pad', note: 'Helps relieve back pain' },
  { title: 'Tej kêjn supplement', note: 'at 8:00 AM', status: 'Pending' },
];

const Reminders = () => (
  <section className="reminders-section">
    <h2>Reminders & Alerts</h2>
    <div className="cards-row">
      {remindersData.map(({ title, note, status }, i) => (
        <div className="card" key={i}>
          <p><strong>{title}</strong><br />{note}</p>
          {status && <span className="pending">{status}</span>}
        </div>
      ))}
    </div>
  </section>
);
export default Reminders;
