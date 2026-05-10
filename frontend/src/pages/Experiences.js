import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { experienceAPI } from '../services/api';
import ExperienceCard from '../components/common/ExperienceCard';

const regions = ['Hunza','Skardu','Ghizer','Astore','Ghanche','Diamer','Nagar','Gilgit'];
const types = ['trekking','cultural','jeep-safari','camping','photography','fishing','rock-climbing'];
const typeLabels = { trekking:'🥾 Trekking', cultural:'🎭 Cultural', 'jeep-safari':'🚙 Jeep Safari', camping:'⛺ Camping', photography:'📷 Photography', fishing:'🎣 Fishing', 'rock-climbing':'🧗 Rock Climbing' };

const Experiences = () => {
  const [searchParams] = useSearchParams();
  const [experiences, setExperiences] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    region: '',
    maxPrice: '',
    search: '',
    page: 1,
  });

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 12 };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await experienceAPI.getAll(params);
      setExperiences(data.experiences || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  const update = (key, value) => setFilters(p => ({ ...p, [key]: value, page: 1 }));

  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="page-hero">
        <div className="container page-hero-content">
          <h1>Experiences in Gilgit-Baltistan</h1>
          <p>Adventure, culture, and wilderness — led by expert local guides</p>
        </div>
      </div>
      <div className="container">
        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input type="text" className="form-control" placeholder="🔍 Search experiences..." value={filters.search}
            onChange={e => update('search', e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <input type="number" className="form-control" placeholder="Max Price (PKR)" value={filters.maxPrice}
            onChange={e => update('maxPrice', e.target.value)} style={{ width: 180 }} />
        </div>

        {/* Type Filter */}
        <div style={{ marginBottom: 16 }}>
          <div className="filter-chips">
            <button className={`chip ${!filters.type ? 'active' : ''}`} onClick={() => update('type', '')}>All Types</button>
            {types.map(t => <button key={t} className={`chip ${filters.type === t ? 'active' : ''}`} onClick={() => update('type', t)}>{typeLabels[t]}</button>)}
          </div>
        </div>

        {/* Region Filter */}
        <div style={{ marginBottom: 24 }}>
          <div className="filter-chips">
            <button className={`chip ${!filters.region ? 'active' : ''}`} onClick={() => update('region', '')}>All Regions</button>
            {regions.map(r => <button key={r} className={`chip ${filters.region === r ? 'active' : ''}`} onClick={() => update('region', r)}>{r}</button>)}
          </div>
        </div>

        <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 16 }}>
          {total} experiences found
        </div>

        {loading ? (
          <div className="spinner-wrapper"><div className="spinner"></div></div>
        ) : experiences.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🥾</div>
            <h3>No experiences found</h3>
            <p>Try different filters.</p>
          </div>
        ) : (
          <div className="grid-3">
            {experiences.map(e => <ExperienceCard key={e._id} experience={e} />)}
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

export default Experiences;
