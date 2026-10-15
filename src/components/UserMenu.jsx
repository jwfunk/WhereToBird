import { useState } from 'react'

function UserMenu({ user, apiKey, onApiKeyChange }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const [apiKeyValue, setApiKeyValue] = useState(apiKey || '')

  const handleSaveApiKey = (key) => {
    if (!key.trim()) return

    // Save to localStorage
    localStorage.setItem('ebird-api-key', key)

    // Update parent component
    onApiKeyChange(key)

    // Close the form
    setShowApiKeyForm(false)
    setShowMenu(false)
  }

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('ebird-api-key')
    onApiKeyChange('')
    setShowMenu(false)
  }

  return (
    <div className="user-menu-container">
      <button
        className="user-menu-button"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="User menu"
      >
        <span className="user-icon">👤</span>
        {user ? (
          <span className="user-name">{user.username}</span>
        ) : (
          <span className="user-name">Guest</span>
        )}
      </button>

      {showMenu && (
        <div className="user-menu-dropdown">
          <div className="menu-content">
            {!apiKey ? (
              <div className="menu-item">
                <p>No API key configured</p>
                <button
                  onClick={() => {
                    setShowApiKeyForm(true)
                    setShowMenu(false)
                  }}
                  className="primary-button"
                >
                  Add API Key
                </button>
              </div>
            ) : (
              <div className="menu-item">
                <p>API key configured</p>
                <button
                  onClick={() => {
                    setShowApiKeyForm(true)
                    setShowMenu(false)
                  }}
                  className="secondary-button"
                >
                  Change API Key
                </button>
              </div>
            )}

            {user && (
              <div className="menu-item">
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* API Key Form Modal */}
      {showApiKeyForm && (
        <div className="modal-overlay" onClick={() => setShowApiKeyForm(false)}>
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
                onClick={() => setShowApiKeyForm(false)}
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

export default UserMenu