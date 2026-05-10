import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🏔');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200" alt="GB" />
        <div className="auth-bg-overlay"></div>
      </div>
      <div className="auth-card-wrap">
        <div className="auth-card">
          <Link to="/" className="auth-logo">🏔 Tourista GB</Link>
          <h2>Welcome back</h2>
          <p className="auth-sub">Sign in to continue your adventure</p>

          <div className="demo-accounts">
            <p>Demo accounts:</p>
            <div className="demo-btns">
              <button className="demo-btn" onClick={() => setForm({ email: 'admin@tourista.pk', password: 'admin123' })}>Admin</button>
              <button className="demo-btn" onClick={() => setForm({ email: 'karim@host.pk', password: 'host123' })}>Host</button>
              <button className="demo-btn" onClick={() => setForm({ email: 'ali@user.pk', password: 'user123' })}>User</button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="form-control" placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--gray-500)' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.warning('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Tourista 🏔');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1200" alt="GB" />
        <div className="auth-bg-overlay"></div>
      </div>
      <div className="auth-card-wrap">
        <div className="auth-card">
          <Link to="/" className="auth-logo">🏔 Tourista GB</Link>
          <h2>Create an account</h2>
          <p className="auth-sub">Join thousands of GB travelers</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" placeholder="Your name" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Min 6 characters" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
            </div>
            <div className="form-group">
              <label>I want to</label>
              <div className="role-selector">
                <label className={`role-option ${form.role === 'user' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={() => setForm(p => ({ ...p, role: 'user' }))} />
                  <span className="role-icon">🧳</span>
                  <span><strong>Explore & Book</strong><small>Travel & book stays</small></span>
                </label>
                <label className={`role-option ${form.role === 'host' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="host" checked={form.role === 'host'} onChange={() => setForm(p => ({ ...p, role: 'host' }))} />
                  <span className="role-icon">🏠</span>
                  <span><strong>Host & Earn</strong><small>List your property</small></span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
