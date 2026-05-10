import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix default marker icon for webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (color = '#0a3d62') => {
  return L.divIcon({
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    className: ''
  });
};

const propertyIcon = createCustomIcon('#0a3d62');
const placeIcon = createCustomIcon('#e8a838');
const expIcon = createCustomIcon('#28a745');

const FitBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers?.length > 0) {
      const bounds = markers.map(m => [m.lat, m.lng]);
      if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, markers]);
  return null;
};

const MapView = ({
  center = [36.3167, 74.6500],
  zoom = 8,
  properties = [],
  places = [],
  experiences = [],
  height = '500px',
  fitBounds = false,
  singlePin = null,
}) => {
  const allMarkers = [
    ...properties.map(p => ({ lat: p.location?.latitude, lng: p.location?.longitude })),
    ...places.map(p => ({ lat: p.location?.latitude, lng: p.location?.longitude })),
    ...experiences.map(e => ({ lat: e.location?.latitude, lng: e.location?.longitude })),
  ].filter(m => m.lat && m.lng);

  return (
    <MapContainer
      center={singlePin || center}
      zoom={singlePin ? 13 : zoom}
      style={{ height, width: '100%', borderRadius: '14px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {fitBounds && allMarkers.length > 1 && <FitBounds markers={allMarkers} />}

      {singlePin && (
        <Marker position={singlePin} icon={propertyIcon} />
      )}

      {properties.map((p) => (
        p.location?.latitude && p.location?.longitude && (
          <Marker key={p._id} position={[p.location.latitude, p.location.longitude]} icon={propertyIcon}>
            <Popup>
              <div style={{ minWidth: 160 }}>
                {p.images?.[0]?.url && (
                  <img src={p.images[0].url} alt={p.title} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                )}
                <strong style={{ fontSize: '0.9rem' }}>{p.title}</strong><br />
                <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>PKR {p.price?.toLocaleString()} / night</span><br />
                <Link to={`/stays/${p._id}`} style={{ color: '#0a3d62', fontSize: '0.8rem', fontWeight: 600 }}>View →</Link>
              </div>
            </Popup>
          </Marker>
        )
      ))}

      {places.map((p) => (
        p.location?.latitude && p.location?.longitude && (
          <Marker key={p._id} position={[p.location.latitude, p.location.longitude]} icon={placeIcon}>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong style={{ fontSize: '0.9rem' }}>{p.name}</strong><br />
                <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>{p.location?.region}</span><br />
                <Link to={`/places/${p._id}`} style={{ color: '#e8a838', fontSize: '0.8rem', fontWeight: 600 }}>Explore →</Link>
              </div>
            </Popup>
          </Marker>
        )
      ))}

      {experiences.map((e) => (
        e.location?.latitude && e.location?.longitude && (
          <Marker key={e._id} position={[e.location.latitude, e.location.longitude]} icon={expIcon}>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong style={{ fontSize: '0.9rem' }}>{e.title}</strong><br />
                <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>PKR {e.price?.toLocaleString()} / person</span><br />
                <Link to={`/experiences/${e._id}`} style={{ color: '#28a745', fontSize: '0.8rem', fontWeight: 600 }}>Book →</Link>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapView;
