import { useState, useEffect } from 'react'
import './DesktopMenuBar.css'
import { useNavigate, useLocation } from 'react-router-dom';

// This component simulates a system tray menu bar for desktop applications
interface DesktopMenuBarProps {
  apiKey: string | null;
  onApiKeyChange: (key: string) => void;
}

function DesktopMenuBar({ apiKey, onApiKeyChange }: DesktopMenuBarProps) {
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const [apiKeyValue, setApiKeyValue] = useState(apiKey || '')
  const [isElectron, setIsElectron] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in an Electron environment
  useEffect(() => {
    try {
      // Check if running in Electron environment
      const isElectronEnv = window && window.process && window.process.type === 'renderer'
      setIsElectron(isElectronEnv)
    } catch (error) {
    }
  }, [])

  const handleSaveApiKey = (key: string) => {
    if (!key.trim()) return

    // Save to localStorage
    localStorage.setItem('ebird-api-key', key)

    // Update parent component
    onApiKeyChange(key)

    // Close the form
    setShowApiKeyForm(false)
  }

  const openApiKeyWindow = () => {
    setShowApiKeyForm(true)
  }

  const closeApiKeyWindow = () => {
    setShowApiKeyForm(false)
  }

  const goToHome = () => {
    navigate('/');
  }

  // Determine if we're on the home screen
  const isOnHomeScreen = location.pathname === '/';

  return (
    <div className="desktop-menu-bar">
      <div className="menu-bar-content">
        {/* Show Home button only when not on home screen */}
        {!isOnHomeScreen && (
          <div className="menu-item" onClick={goToHome}>
            <span className="menu-icon">🏠</span>
            <span className="menu-text">Home</span>
          </div>
        )}

        <div className="menu-item" onClick={openApiKeyWindow}>
          <span className="menu-icon">🔑</span>
          <span className="menu-text">API Key</span>
        </div>

        {/* In a real Electron app, this would be a system tray icon */}
        {isElectron && (
          <div className="system-tray-icon" title="eBird API">
            <span className="tray-icon">🌐</span>
          </div>
        )}
      </div>

      {/* API Key Form Modal */}
      {showApiKeyForm && (
        <div className="modal-overlay" onClick={closeApiKeyWindow}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Enter eBird API Key</h3>
            <p>
              Get your free API key at{' '}
              <a
                href="https://ebird.org/api/"
                target="_blank"
                rel="noopener noreferrer"
                className="api-key-link"
              >
                ebird.org/api
              </a>
            </p>

            <div className="api-key-input-container">
              <input
                type="password"
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="Paste your eBird API key here"
                className="api-key-input"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={closeApiKeyWindow}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveApiKey(apiKeyValue)}
                disabled={!apiKeyValue.trim()}
                className="save-button"
              >
                Save API Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DesktopMenuBar