import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Pencil, Trash2, X, Loader2, 
  ChevronLeft, Utensils, IndianRupee, Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';
import ImageUpload from '../../components/ImageUpload';
import './AdminPages.css';

const emptyForm = { 
  item: '', 
  price: '', 
  image: '', 
  categoryId: '' 
};

const MenuItemManager = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ ...emptyForm, categoryId });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const catRes = await api.get(`/category`);
      const cat = catRes.data?.data?.find(c => c.id === categoryId);
      if (cat) setCategory(cat);

      const res = await api.get(`/menu-item/category/${categoryId}`);
      setItems(res.data?.data || []);
    } catch {
      showToast('Failed to load menu items', 'error');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, categoryId });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setForm({ 
      item: item.item, 
      price: item.price, 
      image: item.image || '',
      categoryId
    });
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditTarget(null); setForm({ ...emptyForm, categoryId }); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTarget) {
        await api.patch(`/menu-item/${editTarget.id}`, form);
        showToast('Item updated!');
      } else {
        await api.post('/menu-item', form);
        showToast('Item added to menu!');
      }
      closeModal();
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/menu-item/${id}`);
      showToast('Item deleted!');
      fetchData();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary icon-btn" onClick={() => navigate('/categories')} title="Back">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">{category ? `${category.name} Items` : 'Category Items'}</h1>
            <p className="page-subtitle">Add and manage dishes in this category</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="glass-panel table-wrapper">
        {loading ? (
          <div className="loading-state"><Loader2 className="spinner" size={32} /></div>
        ) : items.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <Utensils size={64} className="empty-icon" />
            <h3 className="empty-title">No Items Yet</h3>
            <p className="empty-desc">This category is empty. Start adding your delicious dishes here!</p>
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: '0.5rem' }}>
              <Plus size={18} /> Add First Item
            </button>
          </div>
        ) : (
          <div className="table-container animate-fade-in">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'right', paddingRight: '2.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td>
                      <div className="table-thumb-container">
                        {it.image
                          ? <img src={it.image} alt={it.item} className="table-thumbnail" />
                          : <div className="table-placeholder"><ImageIcon size={16} /></div>}
                      </div>
                    </td>
                    <td><p className="font-medium">{it.item}</p></td>
                    <td><span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>NPR {it.price}</span></td>
                    <td style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '1rem' }}>
                      <div className="action-btns">
                        <button className="btn btn-secondary icon-btn" onClick={() => openEdit(it)} title="Edit">
                          <Pencil />
                        </button>
                        <button
                          className="btn btn-danger icon-btn"
                          onClick={() => handleDelete(it.id)}
                          disabled={deleteId === it.id}
                          title="Delete"
                        >
                          {deleteId === it.id ? <Loader2 className="spinner" /> : <Trash2 />}
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
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editTarget ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Item Name *</label>
                  <input name="item" value={form.item} onChange={handleChange} required placeholder="e.g. Scrambled Eggs" />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (NPR) *</label>
                  <div className="input-with-icon">
                    <span className="input-icon-text">NPR</span>
                    <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="0.00" style={{ paddingLeft: '3.5rem' }} />
                  </div>
                </div>
                <div className="form-group">
                  <ImageUpload 
                    label="Item Image"
                    value={form.image}
                    onChange={(val) => setForm(f => ({ ...f, image: val }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="spinner" size={18} /> : (editTarget ? 'Update Item' : 'Add to Menu')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemManager;
