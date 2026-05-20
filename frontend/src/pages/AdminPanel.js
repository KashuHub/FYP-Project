import React, { useState, useEffect } from 'react';
import { adminAPI, propertyAPI, placeAPI, experienceAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiSettings,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { FaHiking, FaHotel } from 'react-icons/fa';
import './AdminPanel.css';

const AdminPanel = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState({ properties: [], places: [], experiences: [] });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (tab === 'pending') fetchPending();
    if (tab === 'users') fetchUsers();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  const fetchDashboard = async () => {
    try {
      const { data } = await adminAPI.getDashboard();
      setStats(data.stats);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getPending();
      setPending({
        properties: data.pendingProperties || [],
        places: data.pendingPlaces || [],
        experiences: data.pendingExperiences || [],
      });
    } catch { toast.error('Failed to load pending items'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ search: userSearch });
      setUsers(data.users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getBookings();
      setBookings(data.bookings || []);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (type, id, status) => {
    const key = `${type}-${id}-${status}`;
    setActionLoading(key);
    try {
      if (type === 'property') await propertyAPI.approve(id, status);
      else if (type === 'place') await placeAPI.approve(id, { status });
      else if (type === 'experience') await experienceAPI.approve(id, { status });

      setPending(prev => ({
        ...prev,
        [`${type}s`]: prev[`${type}s`].filter(item => item._id !== id),
      }));
      toast.success(`${type} ${status}!`);
    } catch { toast.error('Action failed'); }
    finally { setActionLoading(null); }
  };

  const handleUserUpdate = async (id, data) => {
    try {
      await adminAPI.updateUser(id, data);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, ...data } : u));
      toast.success('User updated');
    } catch { toast.error('Failed to update user'); }
  };

  const totalPending = pending.properties.length + pending.places.length + pending.experiences.length;

  const StatCard = ({ icon, label, value, sub, color = 'var(--primary)' }) => (
    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-500)', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color, fontFamily: 'var(--font-display)' }}>{value}</div>
          {sub && <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginTop: 4 }}>{sub}</div>}
        </div>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
    </div>
  );

  const ApprovalCard = ({ item, type, nameField = 'title' }) => (
    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '18px 22px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <img
        src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'}
        alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 200 }}>
        <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
          {item[nameField]}
        </h4>
        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
          {item.location?.region && (
            <>
              <FiMapPin style={{ marginRight: 6 }} /> {item.location.region} ·{' '}
            </>
          )}
          Submitted by: <strong>{item.host?.name || item.createdBy?.name || 'Unknown'}</strong>
          {' · '}
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
        {item.price && <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>PKR {item.price?.toLocaleString()}</div>}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-sm"
          style={{ background: 'var(--success)', color: 'white' }}
          onClick={() => handleApprove(type, item._id, 'approved')}
          disabled={actionLoading === `${type}-${item._id}-approved`}
        >
          {actionLoading === `${type}-${item._id}-approved` ? '...' : <><FiCheck style={{ marginRight: 6 }} /> Approve</>}
        </button>
        <button
          className="btn btn-sm"
          style={{ background: 'var(--danger)', color: 'white' }}
          onClick={() => handleApprove(type, item._id, 'rejected')}
          disabled={actionLoading === `${type}-${item._id}-rejected`}
        >
          {actionLoading === `${type}-${item._id}-rejected` ? '...' : <><FiX style={{ marginRight: 6 }} /> Reject</>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiSettings /> Admin Panel</h1>
            <p>Manage users, listings, and approvals for Tourista GB</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 32 }}>
          <button className={`tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
            <FiSettings style={{ marginRight: 6 }} /> Dashboard
          </button>
          <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
            <FiClock style={{ marginRight: 6 }} /> Pending {totalPending > 0 && <span className="pending-badge">{totalPending}</span>}
          </button>
          <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <FiUsers style={{ marginRight: 6 }} /> Users
          </button>
          <button className={`tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
            <FiCalendar style={{ marginRight: 6 }} /> Bookings
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : stats ? (
              <>
                <div className="admin-stats-grid">
                  <StatCard icon={<FiUsers />} label="Total Users" value={stats.users?.total} sub={`${stats.users?.hosts} hosts`} />
                  <StatCard icon={<FaHotel />} label="Properties" value={stats.properties?.total} sub={`${stats.properties?.pending} pending`} color="var(--accent)" />
                  <StatCard icon={<FiMapPin />} label="Places" value={stats.places?.total} sub={`${stats.places?.pending} pending`} color="#28a745" />
                  <StatCard icon={<FaHiking />} label="Experiences" value={stats.experiences?.total} sub={`${stats.experiences?.pending} pending`} color="#6c3483" />
                  <StatCard icon={<FiCalendar />} label="Total Bookings" value={stats.bookings?.total} color="#17a2b8" />
                  <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`PKR ${(stats.revenue / 1000).toFixed(0)}K`} sub="Confirmed bookings" color="#e83e8c" />
                </div>

                <div className="admin-quick-actions">
                  <h3>Quick Actions</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => setTab('pending')}>
                      Review Pending ({(stats.properties?.pending || 0) + (stats.places?.pending || 0) + (stats.experiences?.pending || 0)})
                    </button>
                    <button className="btn btn-outline" onClick={() => setTab('users')}>Manage Users</button>
                    <button className="btn btn-ghost" onClick={() => setTab('bookings')}>View All Bookings</button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* PENDING TAB */}
        {tab === 'pending' && (
          <div>
            {loading ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : (
              <>
                {/* Properties */}
                <div className="admin-section">
                  <h3 className="admin-section-title">
                    <FaHotel style={{ marginRight: 6 }} /> Pending Properties
                    <span className="count-badge">{pending.properties.length}</span>
                  </h3>
                  {pending.properties.length === 0 ? (
                    <div className="admin-empty"><FiCheck style={{ marginRight: 6 }} /> No pending properties</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {pending.properties.map(item => (
                        <ApprovalCard key={item._id} item={item} type="property" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Places */}
                <div className="admin-section">
                  <h3 className="admin-section-title">
                    <FiMapPin style={{ marginRight: 6 }} /> Pending Places
                    <span className="count-badge">{pending.places.length}</span>
                  </h3>
                  {pending.places.length === 0 ? (
                    <div className="admin-empty"><FiCheck style={{ marginRight: 6 }} /> No pending places</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {pending.places.map(item => (
                        <ApprovalCard key={item._id} item={item} type="place" nameField="name" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Experiences */}
                <div className="admin-section">
                  <h3 className="admin-section-title">
                    <FaHiking style={{ marginRight: 6 }} /> Pending Experiences
                    <span className="count-badge">{pending.experiences.length}</span>
                  </h3>
                  {pending.experiences.length === 0 ? (
                    <div className="admin-empty"><FiCheck style={{ marginRight: 6 }} /> No pending experiences</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {pending.experiences.map(item => (
                        <ApprovalCard key={item._id} item={item} type="experience" />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ maxWidth: 400 }}
              />
              <button className="btn btn-primary btn-sm" onClick={fetchUsers}>
                <FiSearch style={{ marginRight: 6 }} /> Search
              </button>
            </div>

            {loading ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{user.email}</td>
                        <td>
                          <select
                            value={user.role}
                            onChange={e => handleUserUpdate(user._id, { role: e.target.value })}
                            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', fontSize: '0.82rem', cursor: 'pointer' }}
                          >
                            <option value="user">User</option>
                            <option value="host">Host</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
                            background: user.isActive ? 'rgba(40,167,69,0.12)' : 'rgba(220,53,69,0.12)',
                            color: user.isActive ? 'var(--success)' : 'var(--danger)'
                          }}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm"
                            style={{ background: user.isActive ? 'var(--danger)' : 'var(--success)', color: 'white' }}
                            onClick={() => handleUserUpdate(user._id, { isActive: !user.isActive })}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="admin-empty" style={{ textAlign: 'center', padding: 40 }}>No users found</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div>
            {loading ? (
              <div className="spinner-wrapper"><div className="spinner"></div></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest</th>
                      <th>Property</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontFamily: 'monospace' }}>
                          #{b._id.slice(-8).toUpperCase()}
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 600 }}>{b.user?.name}</div>
                            <div style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>{b.user?.email}</div>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', fontWeight: 500, maxWidth: 200 }}>
                          {b.property?.title || 'Experience'}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>
                          {b.checkIn ? (
                            <>
                              <div>{new Date(b.checkIn).toLocaleDateString()}</div>
                              <div style={{ color: 'var(--gray-400)' }}>→ {new Date(b.checkOut).toLocaleDateString()}</div>
                            </>
                          ) : b.experienceDate ? (
                            new Date(b.experienceDate).toLocaleDateString()
                          ) : '—'}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          PKR {b.totalPrice?.toLocaleString()}
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize',
                            background: b.status === 'confirmed' ? 'rgba(40,167,69,0.12)' : b.status === 'cancelled' ? 'rgba(220,53,69,0.12)' : b.status === 'completed' ? 'rgba(10,61,98,0.1)' : 'rgba(255,193,7,0.2)',
                            color: b.status === 'confirmed' ? 'var(--success)' : b.status === 'cancelled' ? 'var(--danger)' : b.status === 'completed' ? 'var(--primary)' : '#856404'
                          }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="admin-empty" style={{ textAlign: 'center', padding: 40 }}>No bookings found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
