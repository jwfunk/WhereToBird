import React, { useState, useEffect } from 'react';
import './ReviewChecklists.css';

const ReviewChecklists = () => {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in a real app this would come from your backend
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChecklists([
        {
          id: 1,
          species: 'American Robin',
          count: 5,
          date: '2023-06-15',
          location: 'Central Park, NYC',
          notes: 'Seen in the morning'
        },
        {
          id: 2,
          species: 'Northern Cardinal',
          count: 3,
          date: '2023-06-14',
          location: 'Riverside Park, NYC',
          notes: 'Frequently heard'
        },
        {
          id: 3,
          species: 'Blue Jay',
          count: 2,
          date: '2023-06-13',
          location: 'Brooklyn Botanic Garden',
          notes: 'Very active'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="review-checklists-container">
        <header className="review-header">
          <h1>Review Recent Checklists</h1>
          <p>Loading your checklists...</p>
        </header>
        <main className="review-main">
          <div className="loading-message">Loading checklists...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-checklists-container">
        <header className="review-header">
          <h1>Review Recent Checklists</h1>
          <p>Error loading checklists</p>
        </header>
        <main className="review-main">
          <div className="error-message">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="review-checklists-container">
      <header className="review-header">
        <h1>Review Recent Checklists</h1>
        <p>View and manage your birding observations</p>
      </header>

      <main className="review-main">
        {checklists.length > 0 ? (
          <div className="checklists-grid">
            {checklists.map((checklist) => (
              <div key={checklist.id} className="checklist-card">
                <div className="checklist-header">
                  <h2>{checklist.species}</h2>
                  <span className="count">Count: {checklist.count}</span>
                </div>
                <div className="checklist-details">
                  <p><strong>Date:</strong> {checklist.date}</p>
                  <p><strong>Location:</strong> {checklist.location}</p>
                  <p><strong>Notes:</strong> {checklist.notes}</p>
                </div>
                <div className="checklist-actions">
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-checklists">
            <p>No checklists found. Submit your first checklist!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewChecklists;