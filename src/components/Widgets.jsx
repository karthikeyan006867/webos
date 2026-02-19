import { useState, useEffect } from 'react'
import './Widgets.css'

const Widgets = ({ onClose }) => {
  const [weather] = useState({
    temp: 72,
    condition: 'Partly Cloudy',
    location: 'New York, NY'
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const newsItems = [
    { id: 1, title: 'Breaking: Important news headline', source: 'News Source', time: '2h ago' },
    { id: 2, title: 'Technology advances in AI', source: 'Tech News', time: '4h ago' },
    { id: 3, title: 'Market trends show growth', source: 'Finance', time: '6h ago' },
  ]

  const calendarEvents = [
    { id: 1, title: 'Team Meeting', time: '2:00 PM' },
    { id: 2, title: 'Project Review', time: '4:30 PM' },
  ]

  return (
    <div className="widgets-panel">
      <div className="widgets-header">
        <h3>Widgets</h3>
        <button className="close-widgets" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div className="widgets-content">
        {/* Weather Widget */}
        <div className="widget weather-widget">
          <div className="widget-header">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
            </svg>
            <span>Weather</span>
          </div>
          <div className="weather-content">
            <div className="weather-temp">{weather.temp}°F</div>
            <div className="weather-condition">{weather.condition}</div>
            <div className="weather-location">{weather.location}</div>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="widget calendar-widget">
          <div className="widget-header">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
            </svg>
            <span>Calendar</span>
          </div>
          <div className="calendar-content">
            <div className="calendar-date">
              <div className="date-day">{currentTime.getDate()}</div>
              <div className="date-month">
                {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="calendar-events">
              {calendarEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-time">{event.time}</div>
                  <div className="event-title">{event.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Widget */}
        <div className="widget news-widget">
          <div className="widget-header">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 14H6v-2h2v2zm0-3H6V9h2v2zm0-3H6V6h2v2zm7 6h-5v-2h5v2zm3-3h-8V9h8v2zm0-3h-8V6h8v2z"/>
            </svg>
            <span>News</span>
          </div>
          <div className="news-content">
            {newsItems.map(item => (
              <div key={item.id} className="news-item">
                <div className="news-title">{item.title}</div>
                <div className="news-meta">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Widgets
