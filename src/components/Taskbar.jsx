import { useState, useEffect } from 'react'
import './Taskbar.css'
import VolumePanel from './VolumePanel'
import WiFiPanel from './WiFiPanel'
import { getBatteryInfo, getWiFiInfo } from '../utils/deviceAPI'

const Taskbar = ({ onStartClick, onWidgetsClick, showStartMenu, windows, activeWindow, onWindowClick, onTaskManagerOpen, onSettingsOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showTray, setShowTray] = useState(false)
  const [showTaskbarMenu, setShowTaskbarMenu] = useState(false)
  const [taskbarMenuPos, setTaskbarMenuPos] = useState({ x: 0, y: 0 })
  const [showQuickSettings, setShowQuickSettings] = useState(false)
  const [showVolumePanel, setShowVolumePanel] = useState(false)
  const [showWiFiPanel, setShowWiFiPanel] = useState(false)
  const [brightness, setBrightness] = useState(70)
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem('systemVolume') || '50'))
  const [batteryInfo, setBatteryInfo] = useState({ level: 100, charging: false })
  const [wifiInfo, setWifiInfo] = useState({ connected: false })
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false)
  const [nightLight, setNightLight] = useState(false)
  const [batterySaver, setBatterySaver] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // Load device info
    const loadDeviceInfo = async () => {
      const battery = await getBatteryInfo()
      const wifi = getWiFiInfo()
      setBatteryInfo(battery)
      setWifiInfo(wifi)
    }
    
    loadDeviceInfo()
    const infoInterval = setInterval(loadDeviceInfo, 5000)
    
    return () => {
      clearInterval(timer)
      clearInterval(infoInterval)
    }
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
          <button className="system-icon" title="Network" onClick={() => {
            setShowWiFiPanel(!showWiFiPanel)
            setShowVolumePanel(false)
            setShowQuickSettings(false)
          }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
          </button>
          <button className="system-icon" title="Volume" onClick={() => {
            setShowVolumePanel(!showVolumePanel)
            setShowWiFiPanel(false)
            setShowQuickSettings(false)
          }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <button className="system-icon" title="Battery" onClick={() => {
            setShowQuickSettings(!showQuickSettings)
            setShowVolumePanel(false)
            setShowWiFiPanel(false)
          }}>
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
        <div className="quick-settings-panel-modern">
          <div className="quick-tiles-grid">
            <button 
              className={`modern-quick-tile ${wifiInfo.connected ? 'active' : ''}`}
              onClick={() => { setShowQuickSettings(false); setShowWiFiPanel(true); }}
            >
              <div className="tile-content">
                <span className="tile-icon-modern">📶</span>
                <span className="tile-arrow">›</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Wi-Fi</div>
                <div className="tile-status">{wifiInfo.connected ? 'Connected' : 'Not connected'}</div>
              </div>
            </button>

            <button 
              className={`modern-quick-tile ${bluetoothEnabled ? 'active' : ''}`}
              onClick={() => { setBluetoothEnabled(!bluetoothEnabled); }}
            >
              <div className="tile-content">
                <span className="tile-icon-modern">📡</span>
                <span className="tile-arrow">›</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Bluetooth</div>
                <div className="tile-status">{bluetoothEnabled ? 'On' : 'Off'}</div>
              </div>
            </button>

            <button className="modern-quick-tile">
              <div className="tile-content">
                <span className="tile-icon-modern">✈️</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Airplane mode</div>
              </div>
            </button>

            <button 
              className={`modern-quick-tile ${batterySaver ? 'active' : ''}`}
              onClick={() => setBatterySaver(!batterySaver)}
            >
              <div className="tile-content">
                <span className="tile-icon-modern">🔋</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Battery saver</div>
              </div>
            </button>

            <button 
              className={`modern-quick-tile ${nightLight ? 'active' : ''}`}
              onClick={() => setNightLight(!nightLight)}
            >
              <div className="tile-content">
                <span className="tile-icon-modern">☀️</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Night light</div>
              </div>
            </button>

            <button className="modern-quick-tile">
              <div className="tile-content">
                <span className="tile-icon-modern">♿</span>
                <span className="tile-arrow">›</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Accessibility</div>
              </div>
            </button>

            <button className="modern-quick-tile">
              <div className="tile-content">
                <span className="tile-icon-modern">📡</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Mobile hotspot</div>
              </div>
            </button>

            <button className="modern-quick-tile">
              <div className="tile-content">
                <span className="tile-icon-modern">📺</span>
                <span className="tile-arrow">›</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Cast</div>
              </div>
            </button>

            <button className="modern-quick-tile">
              <div className="tile-content">
                <span className="tile-icon-modern">🖥️</span>
                <span className="tile-arrow">›</span>
              </div>
              <div className="tile-info">
                <div className="tile-name">Project</div>
              </div>
            </button>
          </div>

          <div className="sliders-section">
            <div className="slider-row">
              <span className="slider-icon">☀️</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="modern-slider brightness-slider"
                style={{
                  background: `linear-gradient(to right, #ff6b6b 0%, #ff6b6b ${brightness}%, #5a5a5a ${brightness}%, #5a5a5a 100%)`
                }}
              />
            </div>

            <div className="slider-row">
              <span className="slider-icon">🔊</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => {
                  const newVol = parseInt(e.target.value)
                  setVolume(newVol)
                  localStorage.setItem('systemVolume', newVol.toString())
                }}
                className="modern-slider volume-slider"
                style={{
                  background: `linear-gradient(to right, #ff6b6b 0%, #ff6b6b ${volume}%, #5a5a5a ${volume}%, #5a5a5a 100%)`
                }}
              />
              <button 
                className="volume-expand-btn"
                onClick={() => { setShowQuickSettings(false); setShowVolumePanel(true); }}
              >
                <span className="expand-icon">🔊</span>
                <span className="tile-arrow">›</span>
              </button>
            </div>
          </div>

          <div className="quick-settings-footer">
            <button className="footer-item">
              <span className="footer-icon">🔋</span>
              <span>{Math.round(batteryInfo.level * 100)}%</span>
            </button>
            <button className="footer-item" onClick={() => { setShowQuickSettings(false); onSettingsOpen && onSettingsOpen(); }}>
              <span className="footer-icon">⚙️</span>
            </button>
            <button className="footer-item">
              <span className="footer-icon">🔌</span>
            </button>
          </div>
        </div>
      )}

      {showVolumePanel && (
        <VolumePanel onClose={() => setShowVolumePanel(false)} />
      )}

      {showWiFiPanel && (
        <WiFiPanel 
          onClose={() => setShowWiFiPanel(false)} 
          onSettingsOpen={onSettingsOpen}
        />
      )}
    </div>
  )
}

export default Taskbar
