import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';
import ImageUpload from '../../components/ImageUpload';
import './AdminPages.css';

const SiteManager = () => {
  const [form, setForm] = useState({
    siteLogo: '', siteName: '', siteURL: '', description: '',
    contactEmail: '', contactPhone: '', address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await api.get('/site');
        const data = res.data?.data;
        if (data && Array.isArray(data) && data.length > 0) {
          const site = data[0];
          setForm({
            siteLogo: site.siteLogo || '',
            siteName: site.siteName || '',
            siteURL: site.siteURL || '',
            description: site.description || '',
            contactEmail: site.contactEmail || '',
            contactPhone: site.contactPhone || '',
            address: site.address || '',
          });
        }
      } catch {
        showToast('Could not load site settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Send data to backend - it will handle create or update automatically
      await api.post('/site', form);
      showToast('Site settings saved successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state"><Loader2 className="spinner" size={32} /></div>;

  return (
    <div className="admin-page animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Site Settings</h1>
          <p className="page-subtitle">Manage your restaurant's public information</p>
        </div>
        <button className="btn btn-primary" form="site-form" type="submit" disabled={saving}>
          {saving ? <Loader2 className="spinner" size={18} /> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <form id="site-form" onSubmit={handleSubmit}>
        <div className="settings-grid">
          <div className="glass-panel settings-card">
            <h2 className="section-title">Branding</h2>
            <div className="form-group">
              <label className="form-label">Site Name *</label>
              <input name="siteName" value={form.siteName} onChange={handleChange} required placeholder="My Restaurant" />
            </div>
            <div className="form-group">
              <ImageUpload 
                label="Site Logo *"
                value={form.siteLogo}
                onChange={(val) => setForm(f => ({ ...f, siteLogo: val }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Website URL</label>
              <input name="siteURL" value={form.siteURL} onChange={handleChange} placeholder="https://myrestaurant.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your restaurant..." style={{ width: '100%', resize: 'vertical' }} />
            </div>
          </div>

          <div className="glass-panel settings-card">
            <h2 className="section-title">Contact Information</h2>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} placeholder="contact@myrestaurant.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+1 234 567 8900" />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="123 Main St, City, Country" style={{ width: '100%', resize: 'vertical' }} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SiteManager;
