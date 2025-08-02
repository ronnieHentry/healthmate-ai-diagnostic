import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>💙 HealthMate</div>
      <nav className="nav-links">
        <div className="profile-pic">John Doe</div>
      </nav>
    </header>
  );
};
export default Header;
