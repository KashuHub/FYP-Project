import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';
import { IoSearch } from "react-icons/io5";
import { FaCalendar, FaHeart } from "react-icons/fa";

const statusColors = {
  pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'primary'
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await bookingAPI.getMy();
        setBookings(data.bookings || []);
      } catch {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await bookingAPI.cancel(id, 'Cancelled by user');
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--off-white)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ color: 'var(--primary-dark)', fontSize: '2rem' }}>My Bookings</h1>
          <Link to="/stays" className="btn btn-primary btn-sm"> <IoSearch style={{width:20 , height:20}}/> Find More Stays</Link>
        </div>

        {/* Status filter tabs */}
        <div className="tabs" style={{ marginBottom: 28 }}>
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
            <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-wrapper"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaCalendar /></div>
            <h3>No bookings {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h3>
            <p>Start exploring amazing stays in Gilgit-Baltistan!</p>
            <Link to="/stays" className="btn btn-primary">Browse Stays</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(booking => {
              const item = booking.property || booking.experience;
              const isProperty = booking.bookingType === 'property';
              const mainImg = item?.images?.[0]?.url;

              return (
                <div key={booking._id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'grid', gridTemplateColumns: '160px 1fr', gap: 0 }}>
                  {mainImg && (
                    <img src={mainImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 140 }} />
                  )}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--gray-900)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>{item?.title || item?.name}</h3>
                      <span className={`badge badge-${statusColors[booking.status]}`} style={{ textTransform: 'capitalize' }}>{booking.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 12 }}>
                      {isProperty ? '🏨 Property' : '🎯 Experience'} · Booking #{booking._id.slice(-8).toUpperCase()}
                    </p>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 14, flexWrap: 'wrap' }}>
                      {isProperty ? (
                        <>
                          <span>📅 Check-in: <strong>{new Date(booking.checkIn).toLocaleDateString()}</strong></span>
                          <span>📅 Check-out: <strong>{new Date(booking.checkOut).toLocaleDateString()}</strong></span>
                        </>
                      ) : (
                        <span>📅 Date: <strong>{new Date(booking.experienceDate).toLocaleDateString()}</strong></span>
                      )}
                      <span>👥 Guests: <strong>{booking.guests?.total}</strong></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>PKR {booking.totalPrice?.toLocaleString()}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}> total</span>
                        <span className={`badge badge-${booking.paymentStatus === 'paid' ? 'success' : 'warning'}`} style={{ marginLeft: 10, fontSize: '0.72rem' }}>{booking.paymentStatus}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Link to={isProperty ? `/stays/${item?._id}` : `/experiences/${item?._id}`} className="btn btn-ghost btn-sm">View</Link>
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button className="btn btn-sm" style={{ background: 'var(--danger)', color: 'white' }}
                            onClick={() => handleCancel(booking._id)} disabled={cancelling === booking._id}>
                            {cancelling === booking._id ? '...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
