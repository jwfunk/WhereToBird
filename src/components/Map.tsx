import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [mapZoom, setMapZoom] = useState(13);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setMapZoom(13);
        setLoading(false);
      },
      (err) => {
        console.error('Unable to retrieve your location:', err.message);
        setLoading(false);
      }
    );
  }, []);

  // Mock data for demonstration
  const mockMarkers = [
    { id: 1, position: [51.505, -0.09], species: 'American Robin', count: 5 },
    { id: 2, position: [51.51, -0.1], species: 'Northern Cardinal', count: 3 },
    { id: 3, position: [51.52, -0.08], species: 'Blue Jay', count: 2 },
  ];

  if (loading) {
    return (
      <div className="map-container">
        <header className="map-header">
          <h1>Map</h1>
          <p>Getting your location...</p>
        </header>
        <main className="map-main">
          <div className="loading-message">Loading map and location...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="map-container">
      <header className="map-header">
        <h1>Map</h1>
        <p>Explore birding locations near you</p>
      </header>

      <main className="map-main">
        <div className="map-wrapper">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  Your Location
                </Popup>
              </Marker>
            )}

            {/* Render mock markers */}
            {mockMarkers.map((marker) => (
              <Marker key={marker.id} position={marker.position}>
                <Popup>
                  <div className="marker-popup">
                    <h3>{marker.species}</h3>
                    <p>Count: {marker.count}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="map-info">
          <h2>Birding Locations</h2>
          <p>View nearby birding locations and observations on the map</p>
        </div>
      </main>
    </div>
  );
};

export default Map;