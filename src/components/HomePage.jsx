import React from 'react';
import './HomePage.css';

const HomePage = ({ user, signOut, onNavigate }) => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome, {user?.username || 'User'}!</h1>
        <p>WhereToBird - Birding Made Easy</p>
      </header>

      <main className="home-main">
        <div className="tiles-container">
          <div
            className="tile submit-checklist"
            onClick={() => onNavigate('submit')}
          >
            <div className="tile-icon">📝</div>
            <h2>Submit New Checklist</h2>
            <p>Add your bird observations to the database</p>
          </div>

          <div
            className="tile review-checklists"
            onClick={() => onNavigate('review')}
          >
            <div className="tile-icon">📋</div>
            <h2>Review Recent Checklists</h2>
            <p>View and manage your recent observations</p>
          </div>

          <div
            className="tile map-view"
            onClick={() => onNavigate('map')}
          >
            <div className="tile-icon">🗺️</div>
            <h2>Map View</h2>
            <p>Explore birding locations near you</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <button onClick={signOut} className="logout-button">
          Sign Out
        </button>
      </footer>
    </div>
  );
};

export default HomePage;