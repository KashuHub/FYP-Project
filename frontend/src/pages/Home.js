import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { propertyAPI, placeAPI, experienceAPI } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';
import PlaceCard from '../components/common/PlaceCard';
import ExperienceCard from '../components/common/ExperienceCard';
import MapView from '../components/common/MapView';
import './Home.css';

const regions = [
  { name: 'Hunza', emoji: '🏔', desc: 'Cherry blossoms & ancient forts', color: '#0a3d62' },
  { name: 'Skardu', emoji: '🏕', desc: 'Gateway to K2 & Karakoram', color: '#1a6fa8' },
  { name: 'Astore', emoji: '🦅', desc: 'Deosai & Nanga Parbat base', color: '#0e5c3a' },
  { name: 'Ghizer', emoji: '🌊', desc: 'Phander Lake & green valleys', color: '#6a3d1f' },
  { name: 'Nagar', emoji: '❄️', desc: 'Glaciers & pristine peaks', color: '#2c3e50' },
  { name: 'Gilgit', emoji: '🕌', desc: 'Cultural hub of GB', color: '#7b341e' },
];

const stats = [
  { value: '120+', label: 'Verified Properties' },
  { value: '50+', label: 'Destinations' },
  { value: '30+', label: 'Unique Experiences' },
  { value: '10K+', label: 'Happy Travelers' },
];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: '', dates: '', guests: 1 });
  const [properties, setProperties] = useState([]);
  const [places, setPlaces] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [mapData, setMapData] = useState({ properties: [], places: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, placeRes, expRes, mapPropRes, mapPlaceRes] = await Promise.all([
          propertyAPI.getAll({ limit: 6, sort: 'rating' }),
          placeAPI.getAll({ isFeatured: true, limit: 6 }),
          experienceAPI.getAll({ limit: 4 }),
          propertyAPI.getMapData(),
          placeAPI.getMapData(),
        ]);
        setProperties(propRes.data.properties || []);
        setPlaces(placeRes.data.places || []);
        setExperiences(expRes.data.experiences || []);
        setMapData({
          properties: mapPropRes.data.properties || [],
          places: mapPlaceRes.data.places || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.location) params.set('region', search.location);
    if (search.guests > 1) params.set('guests', search.guests);
    navigate(`/stays?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1800&q=80"
            alt="Gilgit-Baltistan"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content container">
          <div className="hero-badge">🇵🇰 Gilgit-Baltistan, Pakistan</div>
          <h1 className="hero-title">
            Discover the <span>Roof of the World</span>
          </h1>
          <p className="hero-subtitle">
            Explore majestic valleys, ancient forts, and breathtaking peaks. 
            Book authentic stays and unforgettable experiences in GB.
          </p>

          {/* Search Panel */}
          <form className="search-panel" onSubmit={handleSearch}>
            <div className="search-field">
              <label>📍 Destination</label>
              <select
                value={search.location}
                onChange={e => setSearch({ ...search, location: e.target.value })}
                className="form-control form-select"
              >
                <option value="">All Regions</option>
                {regions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <label>📅 Check-in Date</label>
              <input
                type="date"
                className="form-control"
                value={search.dates}
                onChange={e => setSearch({ ...search, dates: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <label>👥 Guests</label>
              <select
                value={search.guests}
                onChange={e => setSearch({ ...search, guests: e.target.value })}
                className="form-control form-select"
              >
                {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-accent btn-search">
              🔍 Search
            </button>
          </form>

          <div className="hero-quick-links">
            <Link to="/experiences?type=trekking" className="quick-link">🥾 Trekking</Link>
            <Link to="/places?isHiddenGem=true" className="quick-link">💎 Hidden Gems</Link>
            <Link to="/experiences?type=jeep-safari" className="quick-link">🚙 Jeep Safari</Link>
            <Link to="/stays?type=cabin" className="quick-link">🪵 Cabins</Link>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-indicator">↓</div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE BY REGION */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Explore by Region</h2>
          <p className="section-subtitle">Each valley of Gilgit-Baltistan holds a unique world waiting to be discovered</p>
          <div className="regions-grid">
            {regions.map(region => (
              <Link
                key={region.name}
                to={`/places?region=${region.name}`}
                className="region-card"
                style={{ '--region-color': region.color }}
              >
                <div className="region-emoji">{region.emoji}</div>
                <h3>{region.name}</h3>
                <p>{region.desc}</p>
                <span className="region-explore">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST STAYS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Best Places to Stay</h2>
              <p className="section-subtitle">Handpicked stays across Gilgit-Baltistan</p>
            </div>
            <Link to="/stays" className="btn btn-outline">View All Stays →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* PLACES TO VISIT */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Must-Visit Places</h2>
              <p className="section-subtitle">Iconic destinations that will take your breath away</p>
            </div>
            <Link to="/places" className="btn btn-outline">All Places →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {places.map(p => <PlaceCard key={p._id} place={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* INTERACTIVE MAP */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Explore the Map</h2>
          <p className="section-subtitle">Find stays and places across Gilgit-Baltistan</p>
          <div className="map-legend">
            <span><span className="legend-dot" style={{ background: '#0a3d62' }}></span> Stays</span>
            <span><span className="legend-dot" style={{ background: '#e8a838' }}></span> Places</span>
            <span><span className="legend-dot" style={{ background: '#28a745' }}></span> Experiences</span>
          </div>
          <MapView
            properties={mapData.properties}
            places={mapData.places}
            height="480px"
            fitBounds={true}
          />
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Local Experiences</h2>
              <p className="section-subtitle">Authentic adventures led by local guides</p>
            </div>
            <Link to="/experiences" className="btn btn-outline">All Experiences →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner"></div></div>
          ) : (
            <div className="grid-4">
              {experiences.map(e => <ExperienceCard key={e._id} experience={e} />)}
            </div>
          )}
        </div>
      </section>

      {/* BECOME A HOST CTA */}
      <section className="host-cta">
        <div className="container">
          <div className="host-cta-inner">
            <div className="host-cta-text">
              <h2>Share Your Home with the World</h2>
              <p>List your guesthouse, hotel, or cabin on Tourista and reach thousands of travelers exploring Gilgit-Baltistan every year.</p>
              <Link to="/become-host" className="btn btn-accent btn-lg">Become a Host →</Link>
            </div>
            <div className="host-cta-img">
              <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600" alt="Become a host" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY TOURISTA */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why Tourista?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>The only platform built specifically for GB tourism</p>
          <div className="features-grid">
            {[
              { icon: '🏔', title: 'GB Focused', desc: 'Every listing, experience, and guide is specific to Gilgit-Baltistan.' },
              { icon: '✅', title: 'Verified Listings', desc: 'All properties and experiences are reviewed and approved before publishing.' },
              { icon: '🗺️', title: 'Interactive Maps', desc: 'Explore stays, places, and routes on live interactive maps.' },
              { icon: '🔒', title: 'Secure Booking', desc: 'JWT-secured accounts with transparent, direct booking system.' },
              { icon: '👨‍💼', title: 'Local Hosts', desc: 'Book directly with local hosts who know GB inside out.' },
              { icon: '📞', title: '24/7 Support', desc: 'Emergency contacts and travel support available around the clock.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
