import { useState, useEffect } from 'react'
import './Taskbar.css'

const Taskbar = ({ onStartClick, onWidgetsClick, showStartMenu, windows, activeWindow, onWindowClick, onTaskManagerOpen, onSettingsOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showTray, setShowTray] = useState(false)
  const [showTaskbarMenu, setShowTaskbarMenu] = useState(false)
  const [taskbarMenuPos, setTaskbarMenuPos] = useState({ x: 0, y: 0 })
  const [showQuickSettings, setShowQuickSettings] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const pinnedApps = [
    { id: 'edge', name: 'Microsoft Edge', icon: '🌐' },
    { id: 'explorer', name: 'File Explorer', icon: '📁' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'store', name: 'Microsoft Store', icon: '🛒' },
  ]

  const handleTaskbarContextMenu = (e) => {
    e.preventDefault()
    setTaskbarMenuPos({ x: e.clientX, y: e.clientY })
    setShowTaskbarMenu(true)
  }

  const handleTaskManagerClick = () => {
    setShowTaskbarMenu(false)
    if (onTaskManagerOpen) {
      onTaskManagerOpen()
    }
  }

  return (
    <div className="taskbar" onContextMenu={handleTaskbarContextMenu} onClick={() => setShowTaskbarMenu(false)}>
      <div className="taskbar-left">
        <button 
          className={`start-button ${showStartMenu ? 'active' : ''}`}
          onClick={onStartClick}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="8" height="8" rx="1"/>
            <rect x="13" y="3" width="8" height="8" rx="1"/>
            <rect x="3" y="13" width="8" height="8" rx="1"/>
            <rect x="13" y="13" width="8" height="8" rx="1"/>
          </svg>
        </button>

        <button className="search-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span>Search</span>
        </button>

        <button className="widgets-button" onClick={onWidgetsClick}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"/>
          </svg>
        </button>
      </div>

      <div className="taskbar-center">
        <div className="pinned-apps">
          {pinnedApps.map(app => (
            <button key={app.id} className="app-icon" title={app.name}>
              <span>{app.icon}</span>
            </button>
          ))}
        </div>

        <div className="running-apps">
          {windows.map(window => (
            <button
              key={window.id}
              className={`app-icon running ${activeWindow === window.id ? 'active' : ''}`}
              onClick={() => onWindowClick(window.id)}
              title={window.title}
            >
              <span>{window.icon}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="taskbar-right">
        <button className="tray-button" onClick={() => setShowTray(!showTray)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>

        <div className="system-icons">
          <button className="system-icon" title="Network" onClick={() => setShowQuickSettings(!showQuickSettings)}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
          </button>
          <button className="system-icon" title="Volume" onClick={() => setShowQuickSettings(!showQuickSettings)}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <button className="system-icon" title="Battery" onClick={() => setShowQuickSettings(!showQuickSettings)}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
          </button>
        </div>

        <button className="datetime" title="Notifications">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </button>

        <button className="notification-button" title="Notification Center">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
      </div>

      {showTaskbarMenu && (
        <div 
          className="taskbar-context-menu"
          style={{ 
            left: taskbarMenuPos.x + 'px', 
            bottom: '50px'
          }}
        >
          <button className="context-menu-item" onClick={handleTaskManagerClick}>
            <span className="menu-icon">📊</span>
            <span>Task Manager</span>
          </button>
          <div className="menu-separator"></div>
          <button className="context-menu-item" onClick={() => { setShowTaskbarMenu(false); onSettingsOpen && onSettingsOpen(); }}>
            <span className="menu-icon">⚙️</span>
            <span>Taskbar settings</span>
          </button>
        </div>
      )}

      {showQuickSettings && (
        <div className="quick-settings-panel">
          <div className="quick-settings-header">
            <h3>Quick Settings</h3>
            <button className="close-panel" onClick={() => setShowQuickSettings(false)}>✕</button>
          </div>
          
          <div className="quick-settings-grid">
            <button className="quick-tile" onClick={() => { setShowQuickSettings(false); onSettingsOpen && onSettingsOpen('wifi'); }}>
              <div className="tile-icon">📶</div>
              <div className="tile-label">Wi-Fi</div>
            </button>
            <button className="quick-tile" onClick={() => { setShowQuickSettings(false); onSettingsOpen && onSettingsOpen('bluetooth'); }}>
              <div className="tile-icon">📡</div>
              <div className="tile-label">Bluetooth</div>
            </button>
            <button className="quick-tile">
              <div className="tile-icon">🔊</div>
              <div className="tile-label">Volume</div>
            </button>
            <button className="quick-tile" onClick={() => { setShowQuickSettings(false); onSettingsOpen && onSettingsOpen('battery'); }}>
              <div className="tile-icon">🔋</div>
              <div className="tile-label">Battery</div>
            </button>
            <button className="quick-tile">
              <div className="tile-icon">☀️</div>
              <div className="tile-label">Brightness</div>
            </button>
            <button className="quick-tile">
              <div className="tile-icon">✈️</div>
              <div className="tile-label">Airplane</div>
            </button>
          </div>

          <button className="settings-link" onClick={() => { setShowQuickSettings(false); onSettingsOpen && onSettingsOpen(); }}>
            <span>⚙️ All Settings</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Taskbar
