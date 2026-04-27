import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, X, Loader2, 
  LayoutGrid, EyeOff, Utensils, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Toast from '../../components/Toast';
import ImageUpload from '../../components/ImageUpload';
import './AdminPages.css';

const emptyForm = { 
  name: '', 
  slug: '', 
  description: '', 
  image: '', 
  isActive: true 
};

const CategoryManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
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

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/category');
      setCategories(res.data?.data || []);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (cat) => {
    setEditTarget(cat);
    setForm({ 
      name: cat.name, 
      slug: cat.slug, 
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive ?? true
    });
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditTarget(null); setForm(emptyForm); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setForm(f => ({
      ...f,
      [name]: val,
      ...(name === 'name' && !editTarget ? { slug: value.toLowerCase().replace(/\s+/g, '-') } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await api.patch(`/category/${editTarget.id}`, form);
        showToast('Category updated!');
      } else {
        await api.post('/category', form);
        showToast('Category created!');
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/category/${id}`);
      showToast('Category deleted!');
      fetchCategories();
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
          <h1 className="page-title">Menu Categories</h1>
          <p className="page-subtitle">Manage sections like Breakfast, Lunch, Dinner</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="glass-panel table-wrapper">
        {loading ? (
          <div className="loading-state"><Loader2 className="spinner" size={32} /></div>
        ) : categories.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <LayoutGrid size={64} className="empty-icon" />
            <h3 className="empty-title">No Categories Found</h3>
            <p className="empty-desc">Create your first category (e.g. Breakfast) to start adding menu items.</p>
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: '0.5rem' }}>
              <Plus size={18} /> Create First Category
            </button>
          </div>
        ) : (
          <div className="table-container animate-fade-in">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name / Description</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '2.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className={!cat.isActive ? 'row-inactive' : ''}>
                    <td className="text-muted">{idx + 1}</td>
                    <td>
                      <div className="table-thumb-container">
                        {cat.image
                          ? <img src={cat.image} alt={cat.name} className="table-thumbnail" />
                          : <div className="table-placeholder"><LayoutGrid size={16} /></div>}
                        {!cat.isActive && <div className="thumb-overlay"><EyeOff size={14} /></div>}
                      </div>
                    </td>
                    <td>
                      <div className="cell-main">
                        <p className="font-medium">{cat.name}</p>
                        {cat.description && <p className="cell-sub">{cat.description}</p>}
                      </div>
                    </td>
                    <td><span className="badge">/{cat.slug}</span></td>
                    <td>
                      <span className={`status-pill ${cat.isActive ? 'active' : 'inactive'}`}>
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '1rem' }}>
                      <div className="action-btns">
                        <button 
                          className="btn btn-primary-lite" 
                          onClick={() => navigate(`/categories/${cat.id}/items`)}
                          title="Manage Items"
                        >
                          <Utensils size={16} /> Manage Items
                        </button>
                        <button className="btn btn-secondary icon-btn" onClick={() => openEdit(cat)} title="Edit">
                          <Pencil />
                        </button>
                        <button
                          className="btn btn-danger icon-btn"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleteId === cat.id}
                          title="Delete"
                        >
                          {deleteId === cat.id ? <Loader2 className="spinner" /> : <Trash2 />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content wide-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editTarget ? 'Edit Category' : 'Add Category'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="modal-grid">
                  <div className="modal-col-left">
                    <div className="form-group">
                      <label className="form-label">Category Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Breakfast" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Slug (URL) *</label>
                      <input name="slug" value={form.slug} onChange={handleChange} required placeholder="e.g. breakfast" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea 
                        name="description" 
                        value={form.description} 
                        onChange={handleChange} 
                        placeholder="Briefly describe this category..."
                        rows={6}
                      />
                    </div>
                  </div>
                  <div className="modal-col-right">
                    <ImageUpload 
                      label="Category Cover Image"
                      value={form.image}
                      onChange={(val) => setForm(f => ({ ...f, image: val }))}
                    />
                    
                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                      <label className="form-label">Status</label>
                      <label className="toggle-switch" style={{ width: '100%' }}>
                        <input 
                          type="checkbox" 
                          name="isActive" 
                          checked={form.isActive} 
                          onChange={handleChange} 
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">{form.isActive ? 'Active' : 'Visible'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="spinner" size={18} /> : (editTarget ? 'Save Changes' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
