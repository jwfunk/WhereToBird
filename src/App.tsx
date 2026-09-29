import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './App.css'
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
Amplify.configure(outputs);
// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [userLocation, setUserLocation] = useState(null)
  const [checklists, setChecklists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]) // Default to London
  const [mapZoom, setMapZoom] = useState(13)

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        setMapCenter([latitude, longitude])
        setMapZoom(13)
        // Simulate fetching checklists for demo purposes
        simulateFetchChecklists(latitude, longitude)
      },
      (err) => {
        setError(`Unable to retrieve your location: ${err.message}`)
        setLoading(false)
      }
    )
  }
  const client = generateClient<Schema>()
  const writeAPIKey = async () => {
    await client.models.UserData.create({
      ebirdAPIKey: window.prompt("api?"),
      Email: window.prompt("Email?")
    })
  }

  // Simulate fetching checklists from eBird API
  const simulateFetchChecklists = (latitude, longitude) => {
    // In a real app, this would call the eBird API
    setTimeout(() => {
      const mockChecklists = [
        {
          id: 1,
          speciesCode: 'American Robin',
          count: 5,
          obsDt: '2023-06-15',
          lat: latitude + (Math.random() - 0.5) * 0.1,
          lng: longitude + (Math.random() - 0.5) * 0.1
        },
        {
          id: 2,
          speciesCode: 'Northern Cardinal',
          count: 3,
          obsDt: '2023-06-14',
          lat: latitude + (Math.random() - 0.5) * 0.1,
          lng: longitude + (Math.random() - 0.5) * 0.1
        },
        {
          id: 3,
          speciesCode: 'Blue Jay',
          count: 2,
          obsDt: '2023-06-13',
          lat: latitude + (Math.random() - 0.5) * 0.1,
          lng: longitude + (Math.random() - 0.5) * 0.1
        }
      ]
      setChecklists(mockChecklists)
      setLoading(false)
    }, 1500)
  }

  // Initialize on component mount
  useEffect(() => {
    getUserLocation()
  }, [])

  return (
    <Authenticator>
      {({ signOut, user }) => (
    <div className="app">
      <header className="app-header">
        <h1>WhereToBird</h1>
        <p>Find birding checklists near your location</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <p>Getting your location and finding nearby checklists...</p>
          </div>
        )}

        <div className="map-container">
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

            {/* Render checklists on the map */}
            {checklists.map((checklist) => {
              if (checklist.lat && checklist.lng) {
                return (
                  <Marker key={checklist.id} position={[checklist.lat, checklist.lng]}>
                    <Popup>
                      <div className="checklist-popup">
                        <h3>{checklist.speciesCode}</h3>
                        <p>Count: {checklist.count || 'N/A'}</p>
                        <p>Date: {checklist.obsDt}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              }
              return null
            })}
          </MapContainer>
        </div>

        <div className="checklists-section">
          <button onClick={writeAPIKey}>Add</button>
          <h2>Nearby Checklists</h2>
          {checklists.length > 0 ? (
            <div className="checklists-list">
              {checklists.map((checklist) => (
                <div key={checklist.id} className="checklist-item">
                  <h3>{checklist.speciesCode}</h3>
                  <p>Count: {checklist.count || 'N/A'}</p>
                  <p>Date: {checklist.obsDt || 'N/A'}</p>
                  <p>Location: {checklist.lat?.toFixed(4)}, {checklist.lng?.toFixed(4)}</p>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p>No checklists found. Please try again later.</p>
          )}
        </div>
      </main>
    </div>)}
    </Authenticator>
  )
}

export default App