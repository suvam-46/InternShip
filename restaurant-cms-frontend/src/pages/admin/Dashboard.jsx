import { useState, useEffect } from 'react';
import { 
  Menu, Image, Settings, TrendingUp, ArrowUpRight, Clock, User, 
  Activity, PlusCircle, LayoutGrid, ChevronRight, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ categories: 0, banners: 0 });
  const [site, setSite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [catRes, bannerRes, siteRes] = await Promise.allSettled([
          api.get('/category'),
          api.get('/banner'),
          api.get('/site'),
        ]);

        if (catRes.status === 'fulfilled') {
          const data = catRes.value.data?.data || [];
          setCategories(data);
          setStats(s => ({ ...s, categories: data.length }));
        }
        if (bannerRes.status === 'fulfilled') {
          const data = bannerRes.value.data?.data || [];
          setBanners(data);
          setStats(s => ({ ...s, banners: data.length }));
        }
        if (siteRes.status === 'fulfilled') {
          const data = siteRes.value.data?.data;
          setSite(Array.isArray(data) ? data[0] : data);
        }
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const now = new Date();

  if (loading) {
    return (
      <div className="dashboard-loading-overlay">
        <Loader2 className="spinner" size={48} />
        <p>Updating Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page animate-fade-in">

      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <p className="hero-greeting">{greeting()}, {user?.username || 'Admin'} 👋</p>
          <h1 className="hero-title">
            {site?.siteName ? `Welcome to ${site.siteName}` : 'Welcome to Restaurant CMS'}
          </h1>
          <p className="hero-sub">
            <Clock size={14} style={{ display: 'inline', marginRight: 5 }} />
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {site?.siteLogo && (
          <div className="hero-logo-wrap">
            <img src={site.siteLogo} alt="Site Logo" className="hero-logo" />
          </div>
        )}
        <div className="hero-glow" />
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-row">
        {[
          {
            label: 'Categories',
            value: stats.categories,
            icon: <LayoutGrid size={20} />,
            color: '#6366f1',
            bg: 'rgba(99,102,241,0.12)',
            link: '/categories',
            trend: '+2 new'
          },
          {
            label: 'Banners',
            value: stats.banners,
            icon: <Image size={20} />,
            color: '#10b981',
            bg: 'rgba(16,185,129,0.12)',
            link: '/banners',
            trend: 'Active'
          },
          {
            label: 'Site Status',
            value: site ? 'Live' : 'Not Set',
            icon: <Settings size={20} />,
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.12)',
            link: '/site',
            trend: 'Optimized'
          },
          {
            label: 'Admin',
            value: user?.username?.split(' ')[0] || 'Profile',
            icon: <User size={20} />,
            color: '#ec4899',
            bg: 'rgba(236,72,153,0.12)',
            link: '/profile',
            trend: 'Verified'
          },
        ].map(({ label, value, icon, color, bg, link, trend }) => (
          <Link to={link} key={label} className="stat-card glass-panel">
            <div className="stat-card-inner">
              <div className="stat-icon-wrap" style={{ background: bg, color }}>
                {icon}
              </div>
              <div className="stat-body">
                <p className="stat-label">{label}</p>
                <p className="stat-value">{value}</p>
              </div>
            </div>
            <div className="stat-footer">
              <span className="stat-trend" style={{ color }}>{trend}</span>
              <ArrowUpRight size={14} className="stat-arrow" style={{ color }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">

        {/* Categories Section */}
        <div className="glass-panel dash-panel">
          <div className="panel-header">
            <h2 className="panel-title"><Menu size={16} /> Categories Overview</h2>
            <Link to="/categories" className="panel-link">View All <ChevronRight size={14} /></Link>
          </div>
          {categories.length === 0 ? (
            <div className="panel-empty">
              <LayoutGrid size={40} className="empty-icon" />
              <p>No categories created yet.</p>
              <Link to="/categories" className="btn btn-sm btn-outline">Add New</Link>
            </div>
          ) : (
            <ul className="item-list">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id} className="item-row">
                  <div className="item-thumb" style={{ backgroundImage: cat.image ? `url(${cat.image})` : 'none' }}>
                    {!cat.image && <LayoutGrid size={14} />}
                  </div>
                  <div className="item-info">
                    <p className="item-name">{cat.name}</p>
                    <span className="item-slug">/{cat.slug}</span>
                  </div>
                  <div className="item-status">
                    <span className="dot active"></span>
                    Active
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity & Quick Actions */}
        <div className="dashboard-sub-grid">
          <div className="glass-panel dash-panel">
            <div className="panel-header">
              <h2 className="panel-title"><Activity size={16} /> Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <Link to="/categories" className="action-item">
                <div className="action-icon cat"><PlusCircle size={20} /></div>
                <span>New Category</span>
              </Link>
              <Link to="/banners" className="action-item">
                <div className="action-icon ban"><PlusCircle size={20} /></div>
                <span>New Banner</span>
              </Link>
              <Link to="/site" className="action-item">
                <div className="action-icon site"><Settings size={20} /></div>
                <span>Site Settings</span>
              </Link>
              <Link to="/profile" className="action-item">
                <div className="action-icon prof"><User size={20} /></div>
                <span>Admin Profile</span>
              </Link>
            </div>
          </div>

          <div className="glass-panel dash-panel">
            <div className="panel-header">
              <h2 className="panel-title"><TrendingUp size={16} /> Recent Updates</h2>
            </div>
            <div className="recent-activity">
              <div className="activity-item">
                <div className="activity-dot blue"></div>
                <div className="activity-content">
                  <p className="activity-text"><strong>Site info</strong> was updated</p>
                  <span className="activity-time">Just now</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot green"></div>
                <div className="activity-content">
                  <p className="activity-text">New <strong>category</strong> added</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot pink"></div>
                <div className="activity-content">
                  <p className="activity-text"><strong>Profile image</strong> changed</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Site Health / Info */}
      {site && (
        <div className="glass-panel site-health-card">
          <div className="health-info">
            <div className="health-main">
              <h2 className="health-title">{site.siteName} Status</h2>
              <div className="status-badges">
                <span className="status-badge green">● Operational</span>
                <span className="status-badge blue">● HTTPS Enabled</span>
                <span className="status-badge orange">● v1.0.4</span>
              </div>
            </div>
            <div className="health-meta">
              <div className="meta-col">
                <span className="meta-label">Primary Email</span>
                <span className="meta-value">{site.contactEmail || 'Not set'}</span>
              </div>
              <div className="meta-col">
                <span className="meta-label">Support Phone</span>
                <span className="meta-value">{site.contactPhone || 'Not set'}</span>
              </div>
            </div>
          </div>
          <div className="health-visual">
            <div className="visual-bar-wrap">
              <div className="visual-bar" style={{ width: '94%' }}></div>
            </div>
            <span className="visual-label">94% Site Completion</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
