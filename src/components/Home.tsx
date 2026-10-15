import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleTileClick = (tile: string) => {
    switch(tile) {
      case 'submit':
        navigate('/submit-checklist');
        break;
      case 'review':
        navigate('/review-checklists');
        break;
      case 'map':
        navigate('/map');
        break;
      default:
        break;
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>WhereToBird</h1>
        <p>Welcome to your birding companion!</p>
      </header>

      <main className="home-main">
        <div className="tiles-container">
          <div
            className="tile submit-tile"
            onClick={() => handleTileClick('submit')}
          >
            <div className="tile-icon">📝</div>
            <h2>Submit New Checklist</h2>
            <p>Create and submit a new birding checklist</p>
          </div>

          <div
            className="tile review-tile"
            onClick={() => handleTileClick('review')}
          >
            <div className="tile-icon">📋</div>
            <h2>Review Recent Checklists</h2>
            <p>View and manage your recent checklists</p>
          </div>

          <div
            className="tile map-tile"
            onClick={() => handleTileClick('map')}
          >
            <div className="tile-icon">🗺️</div>
            <h2>Map</h2>
            <p>Explore birding locations on the map</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;