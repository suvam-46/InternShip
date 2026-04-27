import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';
import ImageUpload from '../../components/ImageUpload';
import './AdminPages.css';

const emptyForm = { bannerTitle: '', bannerImage: '', bannerLink: '', buttonText: '' };

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/banner');
      setBanners(res.data?.data || []);
    } catch {
      showToast('Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModal(true); };
  const openEdit = (b) => { setEditTarget(b); setForm({ bannerTitle: b.bannerTitle || '', bannerImage: b.bannerImage, bannerLink: b.bannerLink || '', buttonText: b.buttonText || '' }); setModal(true); };
  const closeModal = () => { setModal(false); setEditTarget(null); setForm(emptyForm); };
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await api.patch(`/banner/${editTarget.id}`, form);
        showToast('Banner updated!');
      } else {
        await api.post('/banner', form);
        showToast('Banner created!');
      }
      closeModal();
      fetchBanners();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/banner/${id}`);
      showToast('Banner deleted!');
      fetchBanners();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Banners</h1>
          <p className="page-subtitle">Manage your homepage promotional banners</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><Loader2 className="spinner" size={32} /></div>
      ) : banners.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <ImageIcon size={64} className="empty-icon" />
          <h3 className="empty-title">No Banners Found</h3>
          <p className="empty-desc">Create eye-catching banners to promote your restaurant specials and offers.</p>
          <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: '0.5rem' }}>
            <Plus size={18} /> Add Your First Banner
          </button>
        </div>
      ) : (
        <div className="banner-grid animate-fade-in">
          {banners.map((banner) => (
            <div key={banner.id} className="glass-panel banner-card">
              <div className="banner-preview" style={{ backgroundImage: `url(${banner.bannerImage})` }}>
                {banner.bannerTitle && <span className="banner-overlay-title">{banner.bannerTitle}</span>}
              </div>
              <div className="banner-info">
                <div>
                  <span className="badge">{banner.buttonText || 'No Button'}</span>
                  {banner.bannerLink && (
                    <a href={banner.bannerLink} target="_blank" rel="noopener noreferrer" className="banner-link">
                      <ExternalLink size={12} /> {banner.bannerLink}
                    </a>
                  )}
                </div>
                <div className="action-btns">
                  <button className="btn btn-secondary icon-btn" onClick={() => openEdit(banner)} title="Edit">
                    <Pencil />
                  </button>
                  <button
                    className="btn btn-danger icon-btn"
                    onClick={() => handleDelete(banner.id)}
                    disabled={deleteId === banner.id}
                    title="Delete"
                  >
                    {deleteId === banner.id ? <Loader2 className="spinner" /> : <Trash2 />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editTarget ? 'Edit Banner' : 'Add Banner'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <ImageUpload 
                    label="Banner Image *"
                    value={form.bannerImage}
                    onChange={(val) => setForm(f => ({ ...f, bannerImage: val }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Banner Title</label>
                  <input name="bannerTitle" value={form.bannerTitle} onChange={handleChange} placeholder="e.g. Summer Special" />
                </div>
                <div className="form-group">
                  <label className="form-label">Link URL</label>
                  <input name="bannerLink" value={form.bannerLink} onChange={handleChange} placeholder="https://example.com/offer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Button Text</label>
                  <input name="buttonText" value={form.buttonText} onChange={handleChange} placeholder="e.g. Order Now" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="spinner" size={18} /> : (editTarget ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;
