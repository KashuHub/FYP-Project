import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isHost, wishlistCount } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [staysOpen, setStaysOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setProfileOpen(false); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏔</span>
          <span className="logo-text">Tourista</span>
          <span className="logo-tag">GB</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>

          {/* Stays dropdown */}
          <div className="dropdown" onMouseEnter={() => setStaysOpen(true)} onMouseLeave={() => setStaysOpen(false)}>
            <NavLink to="/stays" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Stays ▾
            </NavLink>
            {staysOpen && (
              <div className="dropdown-menu">
                <Link to="/stays?type=hotel" className="dropdown-item">🏨 Hotels</Link>
                <Link to="/stays?type=guesthouse" className="dropdown-item">🏡 Guest Houses</Link>
                <Link to="/stays?type=cabin" className="dropdown-item">🪵 Cabins</Link>
                <Link to="/stays?type=resort" className="dropdown-item">✨ Luxury Resorts</Link>
              </div>
            )}
          </div>

          {/* Experiences dropdown */}
          <div className="dropdown" onMouseEnter={() => setExpOpen(true)} onMouseLeave={() => setExpOpen(false)}>
            <NavLink to="/experiences" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Experiences ▾
            </NavLink>
            {expOpen && (
              <div className="dropdown-menu">
                <Link to="/experiences?type=trekking" className="dropdown-item">🥾 Trekking Tours</Link>
                <Link to="/experiences?type=cultural" className="dropdown-item">🎭 Cultural Tours</Link>
                <Link to="/experiences?type=jeep-safari" className="dropdown-item">🚙 Jeep Safari</Link>
                <Link to="/experiences?type=camping" className="dropdown-item">⛺ Camping</Link>
              </div>
            )}
          </div>

          <NavLink to="/places" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Places</NavLink>
          <NavLink to="/become-host" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Become a Host</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
        </div>

        {/* Auth area */}
        <div className="navbar-auth">
          {user ? (
            <div className="profile-dropdown" ref={profileRef}>
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="avatar" style={{ position: 'relative' }}>
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : user.name?.charAt(0)?.toUpperCase()
                  }
                  {wishlistCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -4, right: -4,
                      background: '#dc3545', color: '#fff',
                      borderRadius: '50%', width: 16, height: 16,
                      fontSize: '0.6rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid white',
                    }}>
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </div>
                <span className="profile-name">{user.name?.split(' ')[0]}</span>
                <span className="chevron">▾</span>
              </button>
              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-header">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                    <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  </div>
                  <div className="profile-menu-items">
                    <Link to="/dashboard" className="profile-menu-item" onClick={() => setProfileOpen(false)}>📊 Dashboard</Link>
                    <Link to="/my-bookings" className="profile-menu-item" onClick={() => setProfileOpen(false)}>📅 My Bookings</Link>
                    <Link to="/wishlist" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                      ❤️ Wishlist
                      {wishlistCount > 0 && (
                        <span style={{
                          marginLeft: 'auto', background: '#dc3545', color: '#fff',
                          borderRadius: '99px', padding: '1px 7px',
                          fontSize: '0.72rem', fontWeight: 700,
                        }}>
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    {isHost && <Link to="/host" className="profile-menu-item" onClick={() => setProfileOpen(false)}>🏠 Host Panel</Link>}
                    {isAdmin && <Link to="/admin" className="profile-menu-item" onClick={() => setProfileOpen(false)}>⚙️ Admin Panel</Link>}
                    <button className="profile-menu-item logout-btn" onClick={handleLogout}>🚪 Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/stays" className="mobile-link" onClick={() => setMobileOpen(false)}>Stays</Link>
          <Link to="/experiences" className="mobile-link" onClick={() => setMobileOpen(false)}>Experiences</Link>
          <Link to="/places" className="mobile-link" onClick={() => setMobileOpen(false)}>Places to Visit</Link>
          <Link to="/become-host" className="mobile-link" onClick={() => setMobileOpen(false)}>Become a Host</Link>
          <Link to="/about" className="mobile-link" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" className="mobile-link" onClick={() => setMobileOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/my-bookings" className="mobile-link" onClick={() => setMobileOpen(false)}>My Bookings</Link>
              <Link to="/wishlist" className="mobile-link" onClick={() => setMobileOpen(false)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                ❤️ Wishlist
                {wishlistCount > 0 && (
                  <span style={{ background: '#dc3545', color: '#fff', borderRadius: '99px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {isHost && <Link to="/host" className="mobile-link" onClick={() => setMobileOpen(false)}>Host Panel</Link>}
              {isAdmin && <Link to="/admin" className="mobile-link" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
              <button className="mobile-link logout-mobile" onClick={() => { handleLogout(); setMobileOpen(false); }}>Logout</button>
            </>
          ) : (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-ghost" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
