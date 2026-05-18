import React, { useState, useEffect, useCallback } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';
import './Stays.css';

const regions = ['Hunza','Skardu','Ghizer','Astore','Ghanche','Diamer','Nagar','Gilgit'];
const types = ['hotel','guesthouse','cabin','resort','hostel','apartment'];
const amenitiesList = ['WiFi','Heating','Hot Water','Meals','Guide','Parking','Generator','Kitchen','Mountain View'];

const Stays = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    type: searchParams.get('type') || '',
    minPrice: '', maxPrice: '',
    amenities: [],
    sort: 'rating',
    search: '',
    page: 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, amenities: filters.amenities.join(',') };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await propertyAPI.getAll(params);
      setProperties(data.properties || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ region: '', type: '', minPrice: '', maxPrice: '', amenities: [], sort: 'rating', search: '', page: 1 });
    setSearchParams({});
  };

  return (
    <div className="stays-page">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container page-hero-content">
          <h1>Stays in Gilgit-Baltistan</h1>
          <p>From luxury mountain resorts to cozy guesthouses — find your perfect stay</p>
        </div>
      </div>

      <div className="container">
        {/* Top bar */}
        <div className="stays-topbar">
          <div className="stays-search">
            <input
              type="text"
              className="form-control"
              placeholder="Search stays..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>
          <div className="stays-controls">
            <select
              className="form-control form-select"
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="">Newest</option>
            </select>
            <button
              className={`btn btn-ghost btn-sm ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter style={{ marginRight: 6 }} /> Filters {filters.amenities.length > 0 || filters.type || filters.region ? `(active)` : ''}
            </button>
            {(filters.region || filters.type || filters.amenities.length > 0 || filters.minPrice) && (
              <button className="btn btn-sm" style={{ background: 'var(--danger)', color: 'white' }} onClick={clearFilters}>
                <FiX style={{ marginRight: 6 }} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-group">
              <label>Region</label>
              <div className="filter-chips">
                <button className={`chip ${!filters.region ? 'active' : ''}`} onClick={() => updateFilter('region', '')}>All</button>
                {regions.map(r => (
                  <button key={r} className={`chip ${filters.region === r ? 'active' : ''}`} onClick={() => updateFilter('region', r)}>{r}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Property Type</label>
              <div className="filter-chips">
                <button className={`chip ${!filters.type ? 'active' : ''}`} onClick={() => updateFilter('type', '')}>All Types</button>
                {types.map(t => (
                  <button key={t} className={`chip ${filters.type === t ? 'active' : ''}`} onClick={() => updateFilter('type', t)} style={{ textTransform: 'capitalize' }}>{t}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Price Range (PKR per night)</label>
              <div className="price-range">
                <input type="number" className="form-control" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
                <span>—</span>
                <input type="number" className="form-control" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
              </div>
            </div>
            <div className="filter-group">
              <label>Amenities</label>
              <div className="filter-chips">
                {amenitiesList.map(a => (
                  <button key={a} className={`chip ${filters.amenities.includes(a) ? 'active' : ''}`} onClick={() => toggleAmenity(a)}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="stays-results-bar">
          <span>{total} {total === 1 ? 'stay' : 'stays'} found</span>
        </div>

        {loading ? (
          <div className="spinner-wrapper" style={{ minHeight: 300 }}><div className="spinner"></div></div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaMountain /></div>
            <h3>No stays found</h3>
            <p>Try adjusting your filters or search in a different region.</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid-3">
            {properties.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button onClick={() => updateFilter('page', Math.max(1, filters.page - 1))} disabled={filters.page === 1}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={filters.page === p ? 'active' : ''} onClick={() => updateFilter('page', p)}>{p}</button>
            ))}
            <button onClick={() => updateFilter('page', Math.min(pages, filters.page + 1))} disabled={filters.page === pages}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stays;
