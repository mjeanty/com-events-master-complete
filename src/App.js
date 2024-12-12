import React, { useEffect, useState } from 'react';
import './App.css';
import backgroundImage from './0796e640-9c11-4990-b495-2e49cff86679.webp'; // Import the image

const GOOGLE_MAPS_API_KEY = '<YOUR_API_KEY>'; // Replace with your API key

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(() => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[new Date().getDay()];
  });

  useEffect(() => {
    fetch('/data/events.json')
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  const filteredEvents = events.filter((event) => event.Day === selectedDay);

  const getStaticMapUrl = (address) =>
    `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
      address
    )}&zoom=15&size=300x200&key=${GOOGLE_MAPS_API_KEY}`;

  const getInteractiveMapUrl = (address) =>
    `https://www.google.com/maps?q=${encodeURIComponent(address)}`;

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        color: '#fff', // Adjust text color for readability
        overflow: 'auto', // Ensure content scrolls if necessary
      }}
    >
      <header className="App-header">
        <h1>Comedy Events App</h1>
        <p>Select a day to view events:</p>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="dropdown"
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <div className="events-list">
          {filteredEvents.map((event) => (
            <div key={event['Mic Name']} className="event-item">
              <p>
                <span className="label">EVENT:</span> {event['Mic Name']}
              </p>
              <p>
                <span className="label">LOCATION:</span> {event.Location}
              </p>
              <p>
                <span className="label">ADDRESS:</span>{' '}
                <a
                  href={getInteractiveMapUrl(event.Address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {event.Address}
                </a>
              </p>
              <div className="map-box">
                <a
                  href={getInteractiveMapUrl(event.Address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={getStaticMapUrl(event.Address)}
                    alt={`Map of ${event.Address}`}
                    className="map-image"
                  />
                </a>
              </div>
              <p>
                <span className="label">Start Time:</span>{' '}
                {event['Start Time'] || '[AVAILABLE]'}
              </p>
              <hr />
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
