import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">Mini-Tweeter</Link>
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/topics">Topics</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/recommendations">Graph</Link>

          <div className="notif-wrapper">
            <button
              className="notif-btn"
              onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) clearNotifications(); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
            </button>
            {showNotifs && (
              <div className="notif-dropdown">
                {notifications.length === 0
                  ? <p className="notif-empty">No new notifications</p>
                  : notifications.map((n, i) => (
                    <div key={i} className="notif-item">New message in <strong>{n.topicTitle}</strong></div>
                  ))
                }
              </div>
            )}
          </div>

          <span className="navbar-user">@{user.username}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      )}
    </nav>
  );
};
