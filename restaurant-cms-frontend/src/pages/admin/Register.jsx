import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../services/api';
import './Login.css';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const res = await api.post('/admin/register', payload);
      const { token, username, email, id } = res.data.data;

      // Store admin info and token
      const userData = { id, username, email, token };
      localStorage.setItem('admin_user', JSON.stringify(userData));
      localStorage.setItem('admin_token', token);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in register-card">
        <div className="login-header">
          <div className="brand-icon">🍽️</div>
          <h2>Create Admin Account</h2>
          <p>Register to access the CMS dashboard</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username *</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                name="username"
                required
                placeholder="johndoe"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone numbers side by side */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Phone *</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  name="primaryPhoneNumber"
                  required
                  placeholder="+977 9800000000"
                  value={form.primaryPhoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Secondary Phone *</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  name="secondaryPhoneNumber"
                  required
                  placeholder="+977 9811111111"
                  value={form.secondaryPhoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm(v => !v)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide' : 'Show'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password match indicator */}
            {form.confirmPassword && (
              <p className={`password-match ${form.password === form.confirmPassword ? 'match' : 'no-match'}`}>
                {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? <Loader2 className="spinner" size={18} /> : 'Create Account'}
          </button>
        </form>

        <p className="login-footer-link">
          Already have an account?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
