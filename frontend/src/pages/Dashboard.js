import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, uploadAPI } from '../services/api';
import ImageUploader from '../components/common/ImageUploader';
import { FaCalendarAlt, FaHeart, FaHome, FaCog, FaSearch, FaHiking } from "react-icons/fa";
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);

  const handleAvatarUploaded = async (imgs) => {
    if (!imgs.length) return;
    const url = imgs[0].url;
    setNewAvatar(url);
    // immediately persist avatar to profile
    try {
      const { data } = await authAPI.updateProfile({ ...form, avatar: url });
      updateUser(data.user);
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to save avatar');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (newAvatar) payload.avatar = newAvatar;
      const { data } = await authAPI.updateProfile(payload);
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditing(false);
      setNewAvatar(null);
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--off-white)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ marginBottom: 32, color: 'var(--primary-dark)', fontSize: '2rem' }}>My Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Profile Card */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', color: 'white', fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', flexShrink: 0 }}>
              {user?.avatar
                ? <img src={user?.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h3 style={{ marginBottom: 4, color: 'var(--primary-dark)' }}>{user?.name}</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', marginBottom: 8 }}>{user?.email}</p>
            <span className={`role-badge role-${user?.role}`} style={{ fontSize: '0.78rem', padding: '3px 12px', borderRadius: 99, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: 16 }}>
              {user?.role}
            </span>
            {user?.bio && <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', lineHeight: 1.6, borderTop: '1px solid var(--gray-200)', paddingTop: 16 }}>{user.bio}</p>}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 16, width: '100%' }} onClick={() => setEditing(true)}> Edit Profile</button>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { to: '/my-bookings', icon: <FaCalendarAlt />, label: 'My Bookings', desc: 'View & manage bookings' },
                { to: '/wishlist', icon: <FaHeart />, label: 'Wishlist', desc: 'Saved properties' },
                ...(user?.role === 'host' || user?.role === 'admin' ? [{ to: '/host', icon: <FaHome />, label: 'Host Panel', desc: 'Manage your listings' }] : []),
                ...(user?.role === 'admin' ? [{ to: '/admin', icon: <FaCog />, label: 'Admin Panel', desc: 'Manage everything' }] : []),
                { to: '/stays', icon: <FaSearch />, label: 'Find Stays', desc: 'Explore GB properties' },
                { to: '/experiences', icon: <FaHiking />, label: 'Experiences', desc: 'Book adventures' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px 22px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-200)', transition: 'var(--transition)', display: 'block' }}
                  className="card" onMouseOver={e => e.currentTarget.style.transform='translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform=''}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>{link.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)', marginBottom: 4 }}>{link.label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{link.desc}</div>
                </Link>
              ))}
            </div>

            {/* Account info */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)' }}>Account Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Phone', value: user?.phone || '—' },
                  { label: 'Role', value: user?.role },
                  { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ color: 'var(--gray-600)', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ color: 'var(--gray-900)', fontWeight: 600, textTransform: row.label === 'Role' ? 'capitalize' : 'none' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editing && (
          <div className="modal-overlay" onClick={() => setEditing(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <button className="modal-close" onClick={() => setEditing(false)}>×</button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Profile Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.4rem', flexShrink: 0 }}>
                      {newAvatar || user?.avatar
                        ? <img src={newAvatar || user?.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <ImageUploader
                        type="avatar"
                        maxFiles={1}
                        onUploaded={handleAvatarUploaded}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" className="form-control" placeholder="+92 300 0000000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea className="form-control" rows={3} placeholder="Tell travelers about yourself..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} maxLength={500} />
                  <small style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{form.bio.length}/500</small>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
