import React, { useState } from 'react';
import './SubmitChecklist.css';

const SubmitChecklist = () => {
  const [formData, setFormData] = useState({
    species: '',
    count: 1,
    date: new Date().toISOString().split('T')[0],
    time: '00:00',
    location: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Checklist submitted successfully!');
  };

  return (
    <div className="submit-checklist-container">
      <header className="submit-header">
        <h1>Submit New Checklist</h1>
        <p>Add your birding observations to the database</p>
      </header>

      <main className="submit-main">
        <form onSubmit={handleSubmit} className="checklist-form">
          <div className="form-group">
            <label htmlFor="species">Species *</label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="count">Count *</label>
              <input
                type="number"
                id="count"
                name="count"
                value={formData.count}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Checklist
          </button>
        </form>
      </main>
    </div>
  );
};

export default SubmitChecklist;