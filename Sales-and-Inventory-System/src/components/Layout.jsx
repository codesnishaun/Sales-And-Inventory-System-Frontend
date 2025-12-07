import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Tatea Bites</h2>
          <p>Sales and Inventory System</p>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/inventory" 
            className={`nav-item ${isActive('/inventory') ? 'active' : ''}`}
          >
            <span className="nav-icon">🫘</span>
            <span>Inventory</span>
          </Link>
          <Link 
            to="/sales" 
            className={`nav-item ${isActive('/sales') ? 'active' : ''}`}
          >
            <span className="nav-icon">🥐</span>
            <span>Sales</span>
          </Link>
          <Link 
            to="/sales/history" 
            className={`nav-item ${isActive('/sales/history') ? 'active' : ''}`}
          >
            <span className="nav-icon">📔</span>
            <span>Sales Log</span>
          </Link>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

