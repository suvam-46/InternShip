import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Menu, Image, Settings, LogOut, PanelLeftClose, PanelLeftOpen, UserCircle } from 'lucide-react';
import { useState } from 'react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/dashboard',  label: 'Dashboard',        icon: <LayoutDashboard size={20} /> },
    { path: '/categories', label: 'Menu Categories',  icon: <Menu size={20} /> },
    { path: '/banners',    label: 'Banners',           icon: <Image size={20} /> },
    { path: '/site',       label: 'Site Settings',     icon: <Settings size={20} /> },
    { path: '/profile',    label: 'My Profile',        icon: <UserCircle size={20} /> },
  ];

  const initials = (user?.username || 'A').charAt(0).toUpperCase();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar glass-panel ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h2 className="brand">CMS Admin</h2>}
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        {/* Sidebar user mini-card */}
        {sidebarOpen && (
          <Link to="/profile" className="sidebar-user-card">
            <div className="sidebar-avatar">
              {user?.profileImage
                ? <img src={user.profileImage} alt="avatar" />
                : initials}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-username">{user?.username || 'Admin'}</p>
              <div className="sidebar-status-line">
                <span className="status-dot"></span>
                <p className="sidebar-role">Administrator</p>
              </div>
            </div>
          </Link>
        )}

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={logout}>
            <span className="nav-icon"><LogOut size={20} /></span>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header glass-panel">
          <div className="header-left">
            {!sidebarOpen && (
              <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
              </button>
            )}
          </div>
          <div className="header-right">
            <Link to="/profile" className="user-profile">
              <div className="avatar">
                {user?.profileImage
                  ? <img src={user.profileImage} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : initials}
              </div>
              <div className="header-user-info">
                <span className="username">{user?.username || 'Admin User'}</span>
                <span className="user-role">Administrator</span>
              </div>
            </Link>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
