import React, { useState, useEffect } from 'react';
import { propertyAPI, experienceAPI, placeAPI, bookingAPI } from '../services/api';
import { FiAlertTriangle, FiCalendar, FiCheck, FiEdit2, FiHome, FiMapPin, FiTrash2, FiUsers } from 'react-icons/fi';
import { FaHotel, FaHiking } from 'react-icons/fa';
import ImageUploader from '../components/common/ImageUploader';
import { toast } from 'react-toastify';
import './HostPanel.css';

const regions = ['Hunza','Skardu','Ghizer','Astore','Ghanche','Diamer','Nagar','Gilgit'];
const propertyTypes = ['hotel','guesthouse','cabin','resort','hostel','apartment'];
const amenitiesList = ['WiFi','Heating','Hot Water','Meals','Guide','Parking','Generator','Kitchen','Mountain View','River View'];
const expTypes = ['trekking','cultural','jeep-safari','camping','photography','fishing','rock-climbing'];

const initialPropForm = { title: '', description: '', propertyType: 'guesthouse', price: '', maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: [], location: { address: '', city: '', region: 'Hunza', latitude: '', longitude: '' }, rules: '' };
const initialExpForm = { title: '', description: '', type: 'trekking', price: '', maxGroupSize: 8, duration: { value: 1, unit: 'days' }, location: { name: '', region: 'Hunza', latitude: '', longitude: '' }, includes: '', requirements: '', difficultyLevel: 'Moderate' };

const HostPanel = () => {
  const [tab, setTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropForm, setShowPropForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [propForm, setPropForm] = useState(initialPropForm);
  const [expForm, setExpForm] = useState(initialExpForm);
  const [saving, setSaving] = useState(false);
  const [editingProp, setEditingProp] = useState(null);
  const [uploadedPropImages, setUploadedPropImages] = useState([]);
  const [uploadedExpImages, setUploadedExpImages] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [propRes, expRes, bookRes] = await Promise.all([
          propertyAPI.getMy(),
          experienceAPI.getMy(),
          bookingAPI.getHostBookings(),
        ]);
        setProperties(propRes.data.properties || []);
        setExperiences(expRes.data.experiences || []);
        setBookings(bookRes.data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handlePropSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...propForm,
        rules: propForm.rules ? propForm.rules.split('\n').filter(Boolean) : [],
        images: uploadedPropImages.length > 0
          ? uploadedPropImages
          : [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }],
      };
      if (editingProp) {
        const { data } = await propertyAPI.update(editingProp, payload);
        setProperties(prev => prev.map(p => p._id === editingProp ? data.property : p));
        toast.success('Property updated (pending re-approval)');
      } else {
        const { data } = await propertyAPI.create(payload);
        setProperties(prev => [data.property, ...prev]);
        toast.success('Property submitted for approval!');
      }
      setPropForm(initialPropForm);
      setUploadedPropImages([]);
      setShowPropForm(false);
      setEditingProp(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...expForm,
        includes: expForm.includes ? expForm.includes.split('\n').filter(Boolean) : [],
        requirements: expForm.requirements ? expForm.requirements.split('\n').filter(Boolean) : [],
        images: uploadedExpImages.length > 0
          ? uploadedExpImages
          : [{ url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800' }],
      };
      const { data } = await experienceAPI.create(payload);
      setExperiences(prev => [data.experience, ...prev]);
      toast.success('Experience submitted for approval!');
      setExpForm(initialExpForm);
      setUploadedExpImages([]);
      setShowExpForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProp = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await propertyAPI.delete(id);
      setProperties(prev => prev.filter(p => p._id !== id));
      toast.success('Property deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      await bookingAPI.confirm(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'confirmed' } : b));
      toast.success('Booking confirmed!');
    } catch {
      toast.error('Failed to confirm');
    }
  };

  const toggleAmenity = (a) => {
    setPropForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a]
    }));
  };

  const statusBadge = (s) => {
    const colors = { pending: '#856404', approved: '#155724', rejected: '#721c24' };
    const bgs = { pending: '#fff3cd', approved: '#d4edda', rejected: '#f8d7da' };
    return <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, color: colors[s] || '#333', background: bgs[s] || '#eee', textTransform: 'capitalize' }}>{s}</span>;
  };

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--off-white)', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ marginBottom: 8, color: 'var(--primary-dark)', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FiHome /> Host Panel
        </h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: 32 }}>Manage your properties, experiences, and bookings</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Properties', value: properties.length, icon: FaHotel },
            { label: 'Approved', value: properties.filter(p => p.status === 'approved').length, icon: FiCheck },
            { label: 'Experiences', value: experiences.length, icon: FaHiking },
            { label: 'Total Bookings', value: bookings.length, icon: FiCalendar },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}><s.icon /></div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}

        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 28 }}>
          <button className={`tab ${tab === 'properties' ? 'active' : ''}`} onClick={() => setTab('properties')}>
            <FaHotel style={{ marginRight: 6 }} /> Properties
          </button>
          <button className={`tab ${tab === 'experiences' ? 'active' : ''}`} onClick={() => setTab('experiences')}>
            <FaHiking style={{ marginRight: 6 }} /> Experiences
          </button>
          <button className={`tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
            <FiCalendar style={{ marginRight: 6 }} /> Bookings
          </button>
        </div>

        {/* PROPERTIES TAB */}
        {tab === 'properties' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="btn btn-primary" onClick={() => { setShowPropForm(true); setEditingProp(null); setPropForm(initialPropForm); setUploadedPropImages([]); }}>+ Add Property</button>
            </div>

            {loading ? <div className="spinner-wrapper"><div className="spinner"></div></div> :
              properties.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon"><FaHotel /></div><h3>No properties yet</h3><p>Add your first property to start hosting!</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {properties.map(p => (
                    <div key={p._id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{p.title}</h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}><FiMapPin style={{ marginRight: 6 }} /> {p.location?.region} · PKR {p.price?.toLocaleString()}/night · {p.propertyType}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {statusBadge(p.status)}
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingProp(p._id); setPropForm({ ...p, rules: p.rules?.join('\n') || '' }); setShowPropForm(true); }}>
                          <FiEdit2 style={{ marginRight: 6 }} /> Edit
                        </button>
                        <button className="btn btn-sm" style={{ background: 'var(--danger)', color: 'white' }} onClick={() => handleDeleteProp(p._id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* EXPERIENCES TAB */}
        {tab === 'experiences' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="btn btn-primary" onClick={() => setShowExpForm(true)}>+ Add Experience</button>
            </div>
            {loading ? <div className="spinner-wrapper"><div className="spinner"></div></div> :
              experiences.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon"><FaHiking /></div><h3>No experiences yet</h3></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {experiences.map(e => (
                    <div key={e._id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <img src={e.images?.[0]?.url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=200'} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{e.title}</h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}><FiMapPin style={{ marginRight: 6 }} /> {e.location?.region} · PKR {e.price?.toLocaleString()}/person · {e.type}</div>
                      </div>
                      <div>{statusBadge(e.status)}</div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div>
            {loading ? <div className="spinner-wrapper"><div className="spinner"></div></div> :
              bookings.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon"><FiCalendar /></div><h3>No bookings yet</h3></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {bookings.map(b => (
                    <div key={b._id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '18px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{b.property?.title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                          Guest: {b.user?.name} · {b.user?.email}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: 4 }}>
                          {b.checkIn && (
                            <span><FiCalendar style={{ marginRight: 6 }} /> {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</span>
                          )}
                          {' · '}<FiUsers style={{ margin: '0 6px' }} /> {b.guests?.total} guests
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>PKR {b.totalPrice?.toLocaleString()}</div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          {statusBadge(b.status)}
                          {b.status === 'pending' && (
                            <button className="btn btn-sm" style={{ background: 'var(--success)', color: 'white' }} onClick={() => handleConfirmBooking(b._id)}>
                              <FiCheck style={{ marginRight: 6 }} /> Confirm
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ADD PROPERTY MODAL */}
        {showPropForm && (
          <div className="modal-overlay" onClick={() => setShowPropForm(false)}>
            <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingProp ? 'Edit Property' : 'Add New Property'}</h3>
                <button className="modal-close" onClick={() => setShowPropForm(false)}>×</button>
              </div>
              <form onSubmit={handlePropSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label>Property Title *</label>
                  <input type="text" className="form-control" value={propForm.title} onChange={e => setPropForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Mountain View Guesthouse Hunza" />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea className="form-control" rows={4} value={propForm.description} onChange={e => setPropForm(p => ({ ...p, description: e.target.value }))} required placeholder="Describe your property..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Property Type *</label>
                    <select className="form-control form-select" value={propForm.propertyType} onChange={e => setPropForm(p => ({ ...p, propertyType: e.target.value }))} required>
                      {propertyTypes.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price per Night (PKR) *</label>
                    <input type="number" className="form-control" value={propForm.price} onChange={e => setPropForm(p => ({ ...p, price: e.target.value }))} required min="0" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Max Guests *</label>
                    <input type="number" className="form-control" value={propForm.maxGuests} onChange={e => setPropForm(p => ({ ...p, maxGuests: e.target.value }))} min="1" required />
                  </div>
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input type="number" className="form-control" value={propForm.bedrooms} onChange={e => setPropForm(p => ({ ...p, bedrooms: e.target.value }))} min="1" />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input type="number" className="form-control" value={propForm.bathrooms} onChange={e => setPropForm(p => ({ ...p, bathrooms: e.target.value }))} min="1" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Region *</label>
                  <select className="form-control form-select" value={propForm.location.region} onChange={e => setPropForm(p => ({ ...p, location: { ...p.location, region: e.target.value } }))} required>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Full Address *</label>
                  <input type="text" className="form-control" value={propForm.location.address} onChange={e => setPropForm(p => ({ ...p, location: { ...p.location, address: e.target.value, city: e.target.value.split(',')[0] } }))} required placeholder="e.g. Karimabad, Hunza" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Latitude *</label>
                    <input type="number" step="any" className="form-control" value={propForm.location.latitude} onChange={e => setPropForm(p => ({ ...p, location: { ...p.location, latitude: e.target.value } }))} required placeholder="e.g. 36.3167" />
                  </div>
                  <div className="form-group">
                    <label>Longitude *</label>
                    <input type="number" step="any" className="form-control" value={propForm.location.longitude} onChange={e => setPropForm(p => ({ ...p, location: { ...p.location, longitude: e.target.value } }))} required placeholder="e.g. 74.6500" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Amenities</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {amenitiesList.map(a => (
                      <button type="button" key={a} className={`chip ${propForm.amenities.includes(a) ? 'active' : ''}`} onClick={() => toggleAmenity(a)}>{a}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>House Rules (one per line)</label>
                  <textarea className="form-control" rows={3} value={propForm.rules} onChange={e => setPropForm(p => ({ ...p, rules: e.target.value }))} placeholder="No smoking&#10;Quiet after 10pm&#10;No pets" />
                </div>
                <div className="form-group">
                  <label>Property Images</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 8 }}>
                    Upload up to 10 images. First image will be the cover photo.
                  </p>
                  <ImageUploader
                    type="property"
                    existingImages={uploadedPropImages}
                    onUploaded={(imgs) => setUploadedPropImages(prev => [...prev, ...imgs])}
                    onRemove={(pubId) => setUploadedPropImages(prev => prev.filter(i => i.public_id !== pubId))}
                  />
                  {uploadedPropImages.length === 0 && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--accent-dark)', marginTop: 6 }}>
                      <FiAlertTriangle style={{ marginRight: 6 }} /> No images uploaded yet — a placeholder will be used
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingProp ? 'Update Property' : 'Submit for Approval'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowPropForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD EXPERIENCE MODAL */}
        {showExpForm && (
          <div className="modal-overlay" onClick={() => setShowExpForm(false)}>
            <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Experience</h3>
                <button className="modal-close" onClick={() => setShowExpForm(false)}>×</button>
              </div>
              <form onSubmit={handleExpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label>Experience Title *</label>
                  <input type="text" className="form-control" value={expForm.title} onChange={e => setExpForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea className="form-control" rows={4} value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Type *</label>
                    <select className="form-control form-select" value={expForm.type} onChange={e => setExpForm(p => ({ ...p, type: e.target.value }))} required>
                      {expTypes.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.replace('-', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price per Person (PKR) *</label>
                    <input type="number" className="form-control" value={expForm.price} onChange={e => setExpForm(p => ({ ...p, price: e.target.value }))} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Duration *</label>
                    <input type="number" className="form-control" value={expForm.duration.value} onChange={e => setExpForm(p => ({ ...p, duration: { ...p.duration, value: e.target.value } }))} required min="1" />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <select className="form-control form-select" value={expForm.duration.unit} onChange={e => setExpForm(p => ({ ...p, duration: { ...p.duration, unit: e.target.value } }))}>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Max Group Size *</label>
                    <input type="number" className="form-control" value={expForm.maxGroupSize} onChange={e => setExpForm(p => ({ ...p, maxGroupSize: e.target.value }))} required min="1" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Region *</label>
                    <select className="form-control form-select" value={expForm.location.region} onChange={e => setExpForm(p => ({ ...p, location: { ...p.location, region: e.target.value } }))} required>
                      {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select className="form-control form-select" value={expForm.difficultyLevel} onChange={e => setExpForm(p => ({ ...p, difficultyLevel: e.target.value }))}>
                      {['Easy','Moderate','Difficult','Expert'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Latitude *</label>
                    <input type="number" step="any" className="form-control" value={expForm.location.latitude} onChange={e => setExpForm(p => ({ ...p, location: { ...p.location, latitude: e.target.value } }))} required />
                  </div>
                  <div className="form-group">
                    <label>Longitude *</label>
                    <input type="number" step="any" className="form-control" value={expForm.location.longitude} onChange={e => setExpForm(p => ({ ...p, location: { ...p.location, longitude: e.target.value } }))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>What's Included (one per line)</label>
                  <textarea className="form-control" rows={3} value={expForm.includes} onChange={e => setExpForm(p => ({ ...p, includes: e.target.value }))} placeholder="Professional guide&#10;All meals&#10;Equipment" />
                </div>
                <div className="form-group">
                  <label>Requirements (one per line)</label>
                  <textarea className="form-control" rows={2} value={expForm.requirements} onChange={e => setExpForm(p => ({ ...p, requirements: e.target.value }))} placeholder="Good physical fitness&#10;Minimum age 12" />
                </div>
                <div className="form-group">
                  <label>Experience Images</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 8 }}>
                    Upload up to 6 images. First image will be the cover photo.
                  </p>
                  <ImageUploader
                    type="experience"
                    existingImages={uploadedExpImages}
                    onUploaded={(imgs) => setUploadedExpImages(prev => [...prev, ...imgs])}
                    onRemove={(pubId) => setUploadedExpImages(prev => prev.filter(i => i.public_id !== pubId))}
                  />
                  {uploadedExpImages.length === 0 && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--accent-dark)', marginTop: 6 }}>
                      <FiAlertTriangle style={{ marginRight: 6 }} /> No images uploaded yet — a placeholder will be used
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Submit for Approval'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowExpForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostPanel;
