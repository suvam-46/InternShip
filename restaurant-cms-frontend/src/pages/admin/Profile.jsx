import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, Loader2, Camera, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Toast from '../../components/Toast';
import ImageUpload from '../../components/ImageUpload';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile'); // 'profile' | 'password'
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState({
    username: '', email: '',
    primaryPhoneNumber: '', secondaryPhoneNumber: '', profileImage: '',
  });

  const [passwords, setPasswords] = useState({
    password: '', confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        email: user.email || '',
        primaryPhoneNumber: user.primaryPhoneNumber || '',
        secondaryPhoneNumber: user.secondaryPhoneNumber || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) =>
    setProfile(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePasswordChange = (e) =>
    setPasswords(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
      await api.put(`/admin/updateAdmin/${user.id}`, profile);
      updateUser(profile);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!user?.id) return;
    setSaving(true);
    try {
      await api.put(`/admin/updateAdmin/${user.id}`, { password: passwords.password });
      setPasswords({ password: '', confirmPassword: '' });
      showToast('Password changed successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Password update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.username || 'A').charAt(0).toUpperCase();

  return (
    <div className="profile-page animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your admin account information</p>
        </div>
      </div>

      <div className="profile-layout">

        {/* Left: Avatar card */}
        <div className="profile-sidebar">
          <div className="avatar-card glass-panel">
            <div className="avatar-wrapper">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Avatar" className="avatar-img" />
              ) : (
                <div className="avatar-initials">{initials}</div>
              )}
              <div className="avatar-ring" />
            </div>

            <h2 className="profile-name">{user?.username || 'Admin'}</h2>
            <p className="profile-email-label">{user?.email}</p>

            <div className="profile-badge">
              <CheckCircle size={13} /> Admin
            </div>

            <div className="profile-meta-list">
              {profile.primaryPhoneNumber && (
                <div className="profile-meta-item">
                  <Phone size={14} />
                  <span>{profile.primaryPhoneNumber}</span>
                </div>
              )}
              {profile.secondaryPhoneNumber && (
                <div className="profile-meta-item">
                  <Phone size={14} />
                  <span>{profile.secondaryPhoneNumber}</span>
                </div>
              )}
              {profile.email && (
                <div className="profile-meta-item">
                  <Mail size={14} />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Edit forms */}
        <div className="profile-main">
          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${tab === 'profile' ? 'active' : ''}`}
              onClick={() => setTab('profile')}
            >
              <User size={16} /> Edit Profile
            </button>
            <button
              className={`profile-tab ${tab === 'password' ? 'active' : ''}`}
              onClick={() => setTab('password')}
            >
              <Lock size={16} /> Change Password
            </button>
          </div>

          {/* Profile Tab */}
          {tab === 'profile' && (
            <form onSubmit={handleProfileSave} className="glass-panel profile-form">
              <div className="form-section-title">Personal Information</div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <div className="input-with-icon">
                    <User className="input-icon" size={17} />
                    <input name="username" value={profile.username} onChange={handleProfileChange} required placeholder="Your name" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <div className="input-with-icon">
                    <Mail className="input-icon" size={17} />
                    <input name="email" type="email" value={profile.email} onChange={handleProfileChange} required placeholder="your@email.com" />
                  </div>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Primary Phone</label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" size={17} />
                    <input name="primaryPhoneNumber" value={profile.primaryPhoneNumber} onChange={handleProfileChange} placeholder="+977 98XXXXXXXX" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Secondary Phone</label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" size={17} />
                    <input name="secondaryPhoneNumber" value={profile.secondaryPhoneNumber} onChange={handleProfileChange} placeholder="+977 98XXXXXXXX" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <ImageUpload 
                  label="Profile Image"
                  value={profile.profileImage}
                  onChange={(val) => setProfile(f => ({ ...f, profileImage: val }))}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="spinner" size={17} /> : <Save size={17} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordSave} className="glass-panel profile-form">
              <div className="form-section-title">Change Password</div>
              <p className="form-section-sub">Leave blank if you don't want to change your password.</p>

              <div className="form-group">
                <label className="form-label">New Password *</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={17} />
                  <input
                    name="password" type={showPwd ? 'text' : 'password'}
                    value={passwords.password} onChange={handlePasswordChange}
                    required minLength={6} placeholder="Min. 6 characters"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={17} />
                  <input
                    name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    value={passwords.confirmPassword} onChange={handlePasswordChange}
                    required placeholder="Re-enter new password"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {passwords.confirmPassword && (
                  <p className={`password-match ${passwords.password === passwords.confirmPassword ? 'match' : 'no-match'}`}>
                    {passwords.password === passwords.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <div className="password-rules">
                <p>Password requirements:</p>
                <ul>
                  <li className={passwords.password.length >= 6 ? 'met' : ''}>At least 6 characters</li>
                </ul>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="spinner" size={17} /> : <Lock size={17} />}
                  {saving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
