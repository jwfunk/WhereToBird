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
import DesktopMenuBar from './components/DesktopMenuBar.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import SubmitChecklist from './components/SubmitChecklist';
import ReviewChecklists from './components/ReviewChecklists';
import Map from './components/Map';

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
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })
  const [userObservations, setUserObservations] = useState([])

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
        // Fetch real checklists from eBird API
        fetchChecklists(latitude, longitude)
      },
      (err) => {
        setError('Unable to retrieve your location. Using default location.')
        // Use default location if geolocation fails
        fetchChecklists(51.505, -0.09)
      }
    )
  }

  // Mock function to simulate fetching checklists
  const fetchChecklists = (latitude, longitude) => {
    // This would be replaced with actual API call
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
    <Router>
      <Authenticator>
        {({ signOut, user }) => (
          <div className="app">
            <DesktopMenuBar
              apiKey={localStorage.getItem('ebird-api-key')}
              onApiKeyChange={(key) => {
                // Update local storage and also set it in the state if needed
                localStorage.setItem('ebird-api-key', key);
              }}
            />

            <Routes>
              {/* Home page route - shown when user is signed in */}
              <Route
                path="/"
                element={
                  user ? (
                    <Home />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Submit Checklist page */}
              <Route
                path="/submit-checklist"
                element={
                  user ? (
                    <SubmitChecklist />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Review Checklists page */}
              <Route
                path="/review-checklists"
                element={
                  user ? (
                    <ReviewChecklists />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Map page */}
              <Route
                path="/map"
                element={
                  user ? (
                    <Map />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Default route - redirect to home if user is signed in */}
              <Route
                path="*"
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </div>
        )}
      </Authenticator>
    </Router>
  )
}

export default App