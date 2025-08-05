import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaUserPlus, FaHome, FaChartBar } from 'react-icons/fa';
import './Header.css';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <FaUsers className="logo-icon" />
          <h1>Sistema de Pessoas</h1>
        </div>
        
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <FaHome /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/persons" 
                className={`nav-link ${isActive('/persons') ? 'active' : ''}`}
              >
                <FaUsers /> Listar Pessoas
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/persons/new" 
                className={`nav-link ${isActive('/persons/new') ? 'active' : ''}`}
              >
                <FaUserPlus /> Cadastrar
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 