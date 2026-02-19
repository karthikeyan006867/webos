import { useState, useEffect } from 'react'
import './WiFiPanel.css'
import { getWiFiInfo, getNetworkInfo } from '../utils/deviceAPI'

const WiFiPanel = ({ onClose, onSettingsOpen }) => {
  const [wifiInfo, setWifiInfo] = useState({})
  const [networkInfo, setNetworkInfo] = useState({})
  const [wifiEnabled, setWifiEnabled] = useState(true)

  useEffect(() => {
    const loadNetworkInfo = () => {
      const wifi = getWiFiInfo()
      const network = getNetworkInfo()
      setWifiInfo(wifi)
      setNetworkInfo(network)
    }

    loadNetworkInfo()

    // Update network info every 2 seconds
    const interval = setInterval(loadNetworkInfo, 2000)
    return () => clearInterval(interval)
  }, [])

  // Simulated WiFi networks (in reality, browsers can't scan WiFi networks)
  const availableNetworks = [
    { name: 'Home Network', signal: 4, secured: true, connected: wifiInfo.connected && wifiInfo.type === 'wifi' },
    { name: 'Office WiFi', signal: 3, secured: true, connected: false },
    { name: 'Guest Network', signal: 2, secured: false, connected: false },
    { name: 'Neighbor WiFi', signal: 1, secured: true, connected: false },
  ]

  const getSignalIcon = (strength) => {
    const icons = ['📶', '📶', '📶', '📶', '📶']
    return icons[strength] || '📶'
  }

  const getSignalBars = (strength) => {
    return (
      <div className="signal-bars">
        <div className={`signal-bar ${strength >= 1 ? 'active' : ''}`}></div>
        <div className={`signal-bar ${strength >= 2 ? 'active' : ''}`}></div>
        <div className={`signal-bar ${strength >= 3 ? 'active' : ''}`}></div>
        <div className={`signal-bar ${strength >= 4 ? 'active' : ''}`}></div>
      </div>
    )
  }

  const handleNetworkClick = (network) => {
    if (network.connected) {
      // Already connected
      return
    }
    // In a real app, this would initiate connection
    alert(`Would connect to: ${network.name}\n\nNote: Web browsers cannot control WiFi connections.`)
  }

  return (
    <div className="wifi-panel" onClick={(e) => e.stopPropagation()}>
      <div className="wifi-header">
        <div className="wifi-title">
          <span className="wifi-icon-header">📶</span>
          <span>Wi-Fi</span>
        </div>
        <button className="close-btn" onClick={onClose} title="Close">✕</button>
      </div>

      <div className="wifi-toggle-section">
        <div className="wifi-status">
          <div className="status-icon">{wifiInfo.connected ? '📶' : '📵'}</div>
          <div className="status-text">
            <div className="status-title">{wifiInfo.connected ? 'Connected' : 'Not connected'}</div>
            {wifiInfo.connected && (
              <div className="status-subtitle">
                {networkInfo.effectiveType ? `${networkInfo.effectiveType.toUpperCase()}` : 'Internet'}
              </div>
            )}
          </div>
        </div>
        <label className="wifi-toggle">
          <input 
            type="checkbox" 
            checked={wifiEnabled && wifiInfo.connected} 
            onChange={() => {
              alert('WiFi control is managed by your operating system.\n\nWeb browsers cannot turn WiFi on/off for security reasons.')
            }}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {wifiEnabled && (
        <>
          <div className="network-list-header">
            <span>Available networks</span>
            <button className="refresh-btn" title="Refresh">🔄</button>
          </div>

          <div className="network-list">
            {availableNetworks.map((network, index) => (
              <div 
                key={index}
                className={`network-item ${network.connected ? 'connected' : ''}`}
                onClick={() => handleNetworkClick(network)}
              >
                <div className="network-signal">
                  {getSignalBars(network.signal)}
                </div>
                <div className="network-info">
                  <div className="network-name">{network.name}</div>
                  <div className="network-details">
                    {network.connected && <span className="connected-badge">Connected</span>}
                    {network.secured && <span className="secured-badge">🔒 Secured</span>}
                  </div>
                </div>
                {network.connected && <div className="checkmark">✓</div>}
              </div>
            ))}
          </div>

          <div className="wifi-footer">
            <button className="wifi-footer-btn" onClick={() => { onClose(); onSettingsOpen && onSettingsOpen('wifi'); }}>
              <span>⚙️</span>
              <span>Network settings</span>
              <span className="arrow">›</span>
            </button>
          </div>

          <div className="wifi-info-note">
            <div className="info-icon">ℹ️</div>
            <div className="info-text">
              Browser shows actual connection status. 
              {!wifiInfo.connected && ' Connect via your OS settings.'}
            </div>
          </div>
        </>
      )}

      {!wifiEnabled && (
        <div className="wifi-disabled-message">
          <div className="disabled-icon">📵</div>
          <div className="disabled-text">Wi-Fi is turned off</div>
          <div className="disabled-hint">Turn on Wi-Fi to see available networks</div>
        </div>
      )}
    </div>
  )
}

export default WiFiPanel
