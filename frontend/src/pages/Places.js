import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { placeAPI } from '../services/api';
import PlaceCard from '../components/common/PlaceCard';
import MapView from '../components/common/MapView';

const regions = ['Hunza','Skardu','Ghizer','Astore','Ghanche','Diamer','Nagar','Gilgit'];
const categories = ['valley','lake','meadow','glacier','fort','peak','village','plateau','waterfall'];

const Places = () => {
  const [searchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [mapPlaces, setMapPlaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    category: '',
    isHiddenGem: searchParams.get('isHiddenGem') || '',
    search: '',
    page: 1,
  });

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const [res, mapRes] = await Promise.all([
        placeAPI.getAll({ ...params, limit: 12 }),
        placeAPI.getMapData(),
      ]);
      setPlaces(res.data.places || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
      setMapPlaces(mapRes.data.places || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);

  const update = (key, value) => setFilters(p => ({ ...p, [key]: value, page: 1 }));

  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="page-hero">
        <div className="container page-hero-content">
          <h1>Places to Visit in GB</h1>
          <p>From turquoise lakes to ancient forts — explore the natural wonders of Gilgit-Baltistan</p>
        </div>
      </div>
      <div className="container">
        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" className="form-control" placeholder="🔍 Search places..." value={filters.search}
            onChange={e => update('search', e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <button className={`btn ${showMap ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setShowMap(!showMap)}>
            🗺️ {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {/* Region Filter */}
        <div style={{ marginBottom: 16 }}>
          <div className="filter-chips">
            <button className={`chip ${!filters.region ? 'active' : ''}`} onClick={() => update('region', '')}>All Regions</button>
            {regions.map(r => <button key={r} className={`chip ${filters.region === r ? 'active' : ''}`} onClick={() => update('region', r)}>{r}</button>)}
          </div>
        </div>

        {/* Category & Type filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div className="filter-chips">
            <button className={`chip ${!filters.category ? 'active' : ''}`} onClick={() => update('category', '')}>All Types</button>
            {categories.map(c => <button key={c} className={`chip ${filters.category === c ? 'active' : ''}`} onClick={() => update('category', c)} style={{ textTransform: 'capitalize' }}>{c}</button>)}
          </div>
          <button className={`chip ${filters.isHiddenGem === 'true' ? 'active' : ''}`} onClick={() => update('isHiddenGem', filters.isHiddenGem === 'true' ? '' : 'true')}>
            💎 Hidden Gems
          </button>
        </div>

        {/* Map */}
        {showMap && (
          <div style={{ marginBottom: 40 }}>
            <MapView places={mapPlaces} height="420px" fitBounds={true} />
          </div>
        )}

        <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 16 }}>
          {total} places found
        </div>

        {loading ? (
          <div className="spinner-wrapper"><div className="spinner"></div></div>
        ) : places.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏔</div>
            <h3>No places found</h3>
            <p>Try a different region or category.</p>
          </div>
        ) : (
          <div className="grid-3">
            {places.map(p => <PlaceCard key={p._id} place={p} />)}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            <button onClick={() => update('page', Math.max(1, filters.page - 1))} disabled={filters.page === 1}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={filters.page === p ? 'active' : ''} onClick={() => update('page', p)}>{p}</button>
            ))}
            <button onClick={() => update('page', Math.min(pages, filters.page + 1))} disabled={filters.page === pages}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;
