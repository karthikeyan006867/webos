import { useState, useEffect } from 'react'
import './Settings.css'
import { 
  getBatteryInfo, 
  getNetworkInfo, 
  getBluetoothDevices, 
  getDisplayInfo,
  getStorageInfo,
  formatBytes,
  getDeviceInfo,
  getWiFiInfo,
  requestBluetoothDevice,
  monitorBatteryStatus,
  monitorNetworkStatus
} from '../utils/deviceAPI'

const Settings = ({ onWallpaperChange, currentWallpaper, initialSection }) => {
  const getInitialSection = () => {
    if (!initialSection) return 'system'
    if (initialSection.includes('wifi') || initialSection.includes('network')) return 'network'
    if (initialSection.includes('bluetooth')) return 'bluetooth'
    if (initialSection.includes('battery')) return 'system'
    return 'system'
  }

  const getInitialSubSection = () => {
    if (!initialSection) return 'display'
    if (initialSection.includes('wifi')) return 'wi-fi'
    if (initialSection.includes('bluetooth')) return 'bluetooth'
    if (initialSection.includes('battery')) return 'power'
    return 'display'
  }

  const [activeSection, setActiveSection] = useState(getInitialSection())
  const [activeSubSection, setActiveSubSection] = useState(getInitialSubSection())
  const [batteryInfo, setBatteryInfo] = useState({ level: 0, charging: false })
  const [networkInfo, setNetworkInfo] = useState({})
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false)
  const [displayInfo, setDisplayInfo] = useState({})
  const [storageInfo, setStorageInfo] = useState({})
  const [deviceInfo, setDeviceInfo] = useState({})
  const [wifiInfo, setWifiInfo] = useState({})
  const [accentColor, setAccentColor] = useState('#0078d4')
  const [darkMode, setDarkMode] = useState(false)
  const [transparencyEffects, setTransparencyEffects] = useState(true)

  useEffect(() => {
    // Update active section when initialSection changes
    if (initialSection) {
      if (initialSection.includes('wifi') || initialSection.includes('network')) {
        setActiveSection('network')
        setActiveSubSection('wi-fi')
      } else if (initialSection.includes('bluetooth')) {
        setActiveSection('bluetooth')
        setActiveSubSection('bluetooth')
      } else if (initialSection.includes('battery')) {
        setActiveSection('system')
        setActiveSubSection('power')
      }
    }
  }, [initialSection])

  useEffect(() => {
    // Load device information
    const loadDeviceInfo = async () => {
      const battery = await getBatteryInfo()
      const network = getNetworkInfo()
      const bluetooth = await getBluetoothDevices()
      const display = getDisplayInfo()
      const storage = await getStorageInfo()
      const device = await getDeviceInfo()
      const wifi = getWiFiInfo()
      
      setBatteryInfo(battery)
      setNetworkInfo(network)
      setBluetoothAvailable(bluetooth.supported)
      setDisplayInfo(display)
      setStorageInfo(storage)
      setDeviceInfo(device)
      setWifiInfo(wifi)
    }
    
    loadDeviceInfo()
    
    // Monitor battery and network status
    let cleanupBattery = null
    let cleanupNetwork = null
    
    const setupMonitoring = async () => {
      try {
        cleanupBattery = await monitorBatteryStatus(setBatteryInfo)
        cleanupNetwork = monitorNetworkStatus((status) => {
          setWifiInfo(getWiFiInfo())
          setNetworkInfo(getNetworkInfo())
        })
      } catch (error) {
        // Monitoring setup error - APIs may not be supported
      }
    }
    
    setupMonitoring()
    
    return () => {
      if (cleanupBattery && typeof cleanupBattery === 'function') cleanupBattery()
      if (cleanupNetwork && typeof cleanupNetwork === 'function') cleanupNetwork()
    }
  }, [])

  const wallpapers = [
    { id: 'default', name: 'Windows 11 Default', url: 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=1920&h=1080&fit=crop', color: '#1e3c72' },
    { id: 'bloom', name: 'Windows 11 Bloom', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=1080&fit=crop', color: '#667eea' },
    { id: 'mountain', name: 'Mountain Vista', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop', color: '#2c3e50' },
    { id: 'ocean', name: 'Ocean Blue', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop', color: '#0652DD' },
    { id: 'forest', name: 'Forest Green', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop', color: '#27ae60' },
    { id: 'sunset', name: 'Golden Sunset', url: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=1920&h=1080&fit=crop', color: '#e67e22' },
    { id: 'city', name: 'City Lights', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop', color: '#34495e' },
    { id: 'desert', name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&h=1080&fit=crop', color: '#d35400' },
    { id: 'space', name: 'Space Galaxy', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop', color: '#2c3e50' },
    { id: 'abstract1', name: 'Abstract Blue', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&h=1080&fit=crop', color: '#3498db' },
    { id: 'abstract2', name: 'Abstract Purple', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&h=1080&fit=crop', color: '#9b59b6' },
    { id: 'gradient', name: 'Color Gradient', url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&h=1080&fit=crop', color: '#e74c3c' },
  ]

  const settingsSections = [
    {
      id: 'system',
      icon: '💻',
      name: 'System',
      subsections: ['Display', 'Sound', 'Notifications', 'Power', 'Storage', 'About']
    },
    {
      id: 'bluetooth',
      icon: '📡',
      name: 'Bluetooth & devices',
      subsections: ['Bluetooth', 'Devices', 'Printers', 'Mouse', 'Keyboard']
    },
    {
      id: 'network',
      icon: '🌐',
      name: 'Network & internet',
      subsections: ['Wi-Fi', 'Ethernet', 'VPN', 'Proxy', 'Dial-up']
    },
    {
      id: 'personalization',
      icon: '🎨',
      name: 'Personalization',
      subsections: ['Background', 'Colors', 'Themes', 'Lock screen', 'Start', 'Taskbar']
    },
    {
      id: 'apps',
      icon: '📱',
      name: 'Apps',
      subsections: ['Apps & features', 'Default apps', 'Startup', 'Optional features']
    },
    {
      id: 'accounts',
      icon: '👤',
      name: 'Accounts',
      subsections: ['Your info', 'Email & accounts', 'Sign-in options', 'Family', 'Sync']
    },
    {
      id: 'time',
      icon: '🕐',
      name: 'Time & language',
      subsections: ['Date & time', 'Language', 'Region', 'Typing']
    },
    {
      id: 'gaming',
      icon: '🎮',
      name: 'Gaming',
      subsections: ['Xbox Game Bar', 'Captures', 'Game Mode', 'Xbox networking']
    },
    {
      id: 'accessibility',
      icon: '♿',
      name: 'Accessibility',
      subsections: ['Vision', 'Hearing', 'Interaction', 'Keyboard', 'Mouse']
    },
    {
      id: 'privacy',
      icon: '🔒',
      name: 'Privacy & security',
      subsections: ['Windows Security', 'Permissions', 'Diagnostics', 'Activity history']
    },
    {
      id: 'update',
      icon: '🔄',
      name: 'Windows Update',
      subsections: ['Update history', 'Advanced options', 'Delivery Optimization']
    }
  ]

  const renderContent = () => {
    if (activeSection === 'personalization' && activeSubSection === 'background') {
      return (
        <div className="settings-content-area">
          <h1>Background</h1>
          <p className="section-description">Choose a background for your desktop</p>
          
          <div className="setting-group">
            <label>Personalize your background</label>
            <select className="setting-select">
              <option>Picture</option>
              <option>Solid color</option>
              <option>Slideshow</option>
            </select>
          </div>

          <div className="wallpaper-grid">
            {wallpapers.map(wallpaper => (
              <div
                key={wallpaper.id}
                className={`wallpaper-option ${currentWallpaper === wallpaper.url ? 'active' : ''}`}
                onClick={() => onWallpaperChange(wallpaper.url, wallpaper.color)}
              >
                <div className="wallpaper-preview" style={{ backgroundImage: `url(${wallpaper.url})` }}>
                  {currentWallpaper === wallpaper.url && (
                    <div className="selected-check">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="wallpaper-name">{wallpaper.name}</div>
              </div>
            ))}
          </div>

          <div className="setting-group">
            <label>Choose a fit for your desktop image</label>
            <select className="setting-select">
              <option>Fill</option>
              <option>Fit</option>
              <option>Stretch</option>
              <option>Tile</option>
              <option>Center</option>
              <option>Span</option>
            </select>
          </div>
        </div>
      )
    }

    if (activeSection === 'personalization' && activeSubSection === 'colors') {
      return (
        <div className="settings-content-area">
          <h1>Colors</h1>
          <p className="section-description">Choose your accent color and theme</p>
          
          <div className="setting-group">
            <label>Choose your mode</label>
            <div className="mode-selector">
              <button className="mode-option active">
                <div className="mode-preview light-mode">
                  <div className="mode-bar"></div>
                  <div className="mode-content"></div>
                </div>
                <span>Light</span>
              </button>
              <button className="mode-option">
                <div className="mode-preview dark-mode">
                  <div className="mode-bar"></div>
                  <div className="mode-content"></div>
                </div>
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label>Accent color</label>
            <div className="color-grid">
              {['#0078d4', '#0063b1', '#8764b8', '#744da9', '#e74856', '#ea005e', '#c30052', '#e81123', '#ff8c00', '#ff7eb4', '#00cc6a', '#10893e', '#7a7574', '#5d5a58'].map(color => (
                <button key={color} className="color-option" style={{ background: color }}>
                  <div className="color-check">
                    <svg viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="setting-toggle">
            <div className="toggle-info">
              <label>Transparency effects</label>
              <p>Makes Start, taskbar, and action center transparent</p>
            </div>
            <input type="checkbox" className="toggle-switch" defaultChecked />
          </div>

          <div className="setting-toggle">
            <div className="toggle-info">
              <label>Show accent color on Start and taskbar</label>
            </div>
            <input type="checkbox" className="toggle-switch" />
          </div>
        </div>
      )
    }

    if (activeSection === 'system' && activeSubSection === 'display') {
      return (
        <div className="settings-content-area">
          <h1>Display</h1>
          <p className="section-description">Adjust the appearance of your displays</p>
          
          <div className="display-preview">
            <div className="monitor-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
              </svg>
              <span>1</span>
            </div>
          </div>

          <div className="setting-group">
            <label>Scale</label>
            <select className="setting-select">
              <option>100% (Recommended)</option>
              <option>125%</option>
              <option>150%</option>
              <option>175%</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Display resolution</label>
            <select className="setting-select">
              <option>1920 x 1080 (Recommended)</option>
              <option>1680 x 1050</option>
              <option>1440 x 900</option>
              <option>1280 x 720</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Display orientation</label>
            <select className="setting-select">
              <option>Landscape</option>
              <option>Portrait</option>
              <option>Landscape (flipped)</option>
              <option>Portrait (flipped)</option>
            </select>
          </div>

          <div className="setting-toggle">
            <div className="toggle-info">
              <label>Night light</label>
              <p>Reduce blue light at night to help you sleep</p>
            </div>
            <input type="checkbox" className="toggle-switch" />
          </div>
        </div>
      )
    }

    if (activeSection === 'system' && activeSubSection === 'about') {
      return (
        <div className="settings-content-area">
          <h1>About</h1>
          <p className="section-description">Device specifications and Windows information</p>
          
          <div className="about-section">
            <h3>Device specifications</h3>
            <div className="info-row">
              <span className="info-label">Device name</span>
              <span className="info-value">AURORA-PC</span>
            </div>
            <div className="info-row">
              <span className="info-label">Processor</span>
              <span className="info-value">{deviceInfo.hardwareConcurrency || 4} cores @ 3.60GHz</span>
            </div>
            <div className="info-row">
              <span className="info-label">Installed RAM</span>
              <span className="info-value">{deviceInfo.deviceMemory || 8}.0 GB</span>
            </div>
            <div className="info-row">
              <span className="info-label">System type</span>
              <span className="info-value">64-bit operating system, x64-based processor</span>
            </div>
            <div className="info-row">
              <span className="info-label">Platform</span>
              <span className="info-value">{deviceInfo.platform || 'Windows NT'}</span>
            </div>
          </div>

          <div className="about-section">
            <h3>Windows specifications</h3>
            <div className="info-row">
              <span className="info-label">Edition</span>
              <span className="info-value">AuroraOS v1.0</span>
            </div>
            <div className="info-row">
              <span className="info-label">Version</span>
              <span className="info-value">23H2</span>
            </div>
            <div className="info-row">
              <span className="info-label">OS build</span>
              <span className="info-value">22631.3155</span>
            </div>
            <div className="info-row">
              <span className="info-label">Language</span>
              <span className="info-value">{deviceInfo.language || 'en-US'}</span>
            </div>
          </div>

          <button className="action-button">Copy</button>
          <button className="action-button">Rename this PC</button>
        </div>
      )
    }

    if (activeSection === 'system' && activeSubSection === 'power') {
      return (
        <div className="settings-content-area">
          <h1>Power & battery</h1>
          <p className="section-description">Manage your device's power settings</p>
          
          <div className="battery-status">
            <div className="battery-icon-large">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
              </svg>
              {batteryInfo.charging && <span className="charging-bolt">⚡</span>}
            </div>
            <div className="battery-details">
              <h2>{batteryInfo.level}%</h2>
              <p><strong>Status:</strong> {batteryInfo.charging ? '⚡ Charging' : '🔋 On battery power'}</p>
              {batteryInfo.chargingTime !== Infinity && batteryInfo.charging && (
                <p><strong>Time to full charge:</strong> {Math.round(batteryInfo.chargingTime / 60)} minutes</p>
              )}
              {batteryInfo.dischargingTime !== Infinity && !batteryInfo.charging && (
                <p><strong>Time remaining:</strong> {Math.round(batteryInfo.dischargingTime / 60)} minutes</p>
              )}
              {!batteryInfo.supported && (
                <p className="api-note" style={{ marginTop: '12px' }}>
                  ⚠️ Battery API not supported in this browser or device.
                  Showing fallback values. Use Chrome/Edge on a laptop for real battery data.
                </p>
              )}
              {batteryInfo.supported && (
                <p className="info-note" style={{ marginTop: '12px' }}>
                  ✅ Real-time battery data from your device
                </p>
              )}
            </div>
          </div>

          <div className="setting-group">
            <label>Power mode</label>
            <select className="setting-select" title="Power mode settings are managed by your OS">
              <option>Best power efficiency</option>
              <option selected>Balanced (Current)</option>
              <option>Best performance</option>
            </select>
            <p className="info-note" style={{ marginTop: '8px', fontSize: '13px' }}>
              ⚠️ Browser cannot modify system power settings. Use Windows Power Options for actual control.
            </p>
          </div>

          <div className="setting-toggle">
            <div className="toggle-info">
              <label>Battery saver</label>
              <p>Turn on automatically at 20%</p>
              <p className="info-note">This setting is controlled by your operating system</p>
            </div>
            <input 
              type="checkbox" 
              className="toggle-switch" 
              disabled
              title="Battery saver is managed by your operating system"
            />
          </div>

          <div className="info-box" style={{ marginTop: '20px' }}>
            <p><strong>💡 Power Management:</strong></p>
            <ul>
              <li>✓ Battery level is read in real-time from your device</li>
              <li>✓ Charging status updates automatically</li>
              <li>✗ Cannot modify system power plans from browser</li>
              <li>✗ Cannot enable/disable battery saver mode</li>
            </ul>
            <p style={{ marginTop: '8px' }}>
              For full power management, press Win+X and select "Power Options"
            </p>
          </div>
        </div>
      )
    }

    if (activeSection === 'system' && activeSubSection === 'storage') {
      return (
        <div className="settings-content-area">
          <h1>Storage</h1>
          <p className="section-description">Manage your storage space</p>
          
          <div className="storage-overview">
            <div className="storage-bar">
              <div className="storage-used" style={{ width: `${storageInfo.percentage}%` }}></div>
            </div>
            <div className="storage-stats">
              <span>{formatBytes(storageInfo.usage)} used of {formatBytes(storageInfo.quota)}</span>
              <span>{storageInfo.percentage}% full</span>
            </div>
            {!storageInfo.supported && <p className="api-note">⚠️ Storage API not supported - showing estimated values</p>}
          </div>

          <div className="storage-breakdown">
            <div className="storage-item">
              <span className="item-icon">📁</span>
              <span className="item-name">System files</span>
              <span className="item-size">{formatBytes(storageInfo.usage * 0.4)}</span>
            </div>
            <div className="storage-item">
              <span className="item-icon">🖼️</span>
              <span className="item-name">Apps & features</span>
              <span className="item-size">{formatBytes(storageInfo.usage * 0.3)}</span>
            </div>
            <div className="storage-item">
              <span className="item-icon">📄</span>
              <span className="item-name">Documents</span>
              <span className="item-size">{formatBytes(storageInfo.usage * 0.2)}</span>
            </div>
            <div className="storage-item">
              <span className="item-icon">🗑️</span>
              <span className="item-name">Temporary files</span>
              <span className="item-size">{formatBytes(storageInfo.usage * 0.1)}</span>
            </div>
          </div>

          <button className="action-button">Clean up storage</button>
        </div>
      )
    }

    if (activeSection === 'bluetooth' && activeSubSection === 'bluetooth') {
      return (
        <div className="settings-content-area">
          <h1>Bluetooth</h1>
          <p className="section-description">Manage Bluetooth settings and devices</p>
          
          <div className="setting-toggle">
            <div className="toggle-info">
              <label>Bluetooth</label>
              <p>{bluetoothAvailable ? '✅ Bluetooth API is available in your browser' : '⚠️ Bluetooth API requires HTTPS and user interaction'}</p>
              {!bluetoothAvailable && <p className="info-note">Your browser supports limited Bluetooth access. Use a Chromium-based browser on HTTPS for full support.</p>}
            </div>
            <input 
              type="checkbox" 
              className="toggle-switch" 
              checked={bluetoothAvailable} 
              disabled
              title="Bluetooth status is read-only in browser"
            />
          </div>

          {bluetoothAvailable && (
            <>
              <button 
                className="action-button" 
                onClick={async () => {
                  try {
                    const device = await requestBluetoothDevice()
                    if (device) {
                      alert(`Connected to: ${device.name || 'Unknown Device'}`)
                    }
                  } catch (error) {
                    alert('Bluetooth pairing cancelled or failed.')
                  }
                }}
              >
                🔍 Add Bluetooth device
              </button>
              <p className="info-note" style={{ marginTop: '8px', fontSize: '13px' }}>
                Click to scan for nearby Bluetooth devices
              </p>
            </>
          )}

          {!bluetoothAvailable && (
            <div className="info-box">
              <p>💡 To use Bluetooth features:</p>
              <ul>
                <li>✓ Ensure you're using HTTPS (required by browser security)</li>
                <li>✓ Use a compatible browser (Chrome, Edge, or other Chromium-based browsers)</li>
                <li>✓ Grant Bluetooth permissions when prompted</li>
                <li>✓ Your device must have Bluetooth hardware</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                <strong>Note:</strong> Web browsers cannot turn Bluetooth on/off at the system level.
                Use your OS settings to enable Bluetooth first.
              </p>
            </div>
          )}

          <div className="devices-list">
            <h3>Paired devices</h3>
            <p className="empty-state">No devices paired through web interface</p>
            <p className="info-note" style={{ fontSize: '13px', marginTop: '8px' }}>
              System-paired Bluetooth devices are managed by your operating system
            </p>
          </div>
        </div>
      )
    }

    if (activeSection === 'network' && activeSubSection === 'wi-fi') {
      return (
        <div className="settings-content-area">
          <h1>Wi-Fi</h1>
          <p className="section-description">Manage Wi-Fi connections</p>
          
          <div className="network-status">
            <div className="network-icon-large">
              {wifiInfo.connected ? '📶' : '📵'}
            </div>
            <div className="network-details">
              <h2>{wifiInfo.connected ? '✅ Connected' : '❌ Disconnected'}</h2>
              <p><strong>Connection Type:</strong> {wifiInfo.type === 'wifi' ? 'Wi-Fi network' : wifiInfo.type}</p>
              {networkInfo.supported ? (
                <>
                  <p><strong>Network Speed:</strong> {networkInfo.effectiveType?.toUpperCase()} ({networkInfo.downlink} Mbps)</p>
                  <p><strong>Latency:</strong> {networkInfo.rtt} ms</p>
                  <p><strong>Data Saver:</strong> {networkInfo.saveData ? 'Enabled' : 'Disabled'}</p>
                </>
              ) : (
                <p className="info-note">⚠️ Network Information API not fully supported</p>
              )}
              <p className="info-note" style={{ marginTop: '12px' }}>
                📡 Real-time connection status from your system
              </p>
            </div>
          </div>

          <div className="setting-toggle">
            <div className="toggle-info">
              <label>Wi-Fi Status</label>
              <p>{wifiInfo.connected ? 'Currently connected to network' : 'No network connection detected'}</p>
              <p className="info-note">
                <strong>Note:</strong> Web browsers cannot control WiFi on/off. 
                This shows your actual connection status.
              </p>
            </div>
            <input 
              type="checkbox" 
              className="toggle-switch" 
              checked={wifiInfo.connected} 
              disabled
              title="WiFi control is managed by your operating system"
            />
          </div>

          <div className="setting-toggle">
            <div className="toggle-info">
              <label>Metered connection</label>
              <p>Limit data usage on this network</p>
              <p className="info-note">Browser's data saver status: {networkInfo.saveData ? 'Active' : 'Inactive'}</p>
            </div>
            <input 
              type="checkbox" 
              className="toggle-switch" 
              checked={networkInfo.saveData} 
              disabled
              title="Data saver is controlled by browser settings"
            />
          </div>

          <div className="available-networks">
            <h3>Network Information</h3>
            <div className="network-item active">
              <span className="network-icon">📶</span>
              <div className="network-info">
                <span className="network-name">
                  {wifiInfo.connected ? 'Active Network Connection' : 'No Connection'}
                </span>
                <span className="network-security">
                  Status: {navigator.onLine ? 'Online' : 'Offline'}
                </span>
              </div>
              <span className="network-signal">
                {wifiInfo.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="info-note" style={{ marginTop: '12px' }}>
              💡 For full network management, use your operating system's network settings.
              Web browsers can only read connection status, not modify network settings.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '20px' }}>
            <p><strong>📘 Browser Limitations:</strong></p>
            <ul>
              <li>Cannot scan for available WiFi networks</li>
              <li>Cannot connect/disconnect from networks</li>
              <li>Cannot modify WiFi passwords or settings</li>
              <li>Can only read current connection status</li>
            </ul>
            <p style={{ marginTop: '8px' }}>
              Use Windows Settings (Win+I) or your OS network manager for full control.
            </p>
          </div>
        </div>
      )
    }

    // Default content for other sections
    return (
      <div className="settings-content-area">
        <h1>{activeSubSection}</h1>
        <p className="section-description">Settings for {activeSubSection.toLowerCase()}</p>
        <div className="placeholder-settings">
          <p>🚧 This section is under construction</p>
          <p>Additional settings will be available in future updates</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-app">
      <div className="settings-sidebar">
        <div className="settings-search">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" placeholder="Find a setting" />
        </div>

        <div className="settings-nav">
          {settingsSections.map(section => (
            <div key={section.id} className="nav-section">
              <button
                className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(section.id)
                  setActiveSubSection(section.subsections[0].toLowerCase())
                }}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.name}</span>
              </button>
              {activeSection === section.id && (
                <div className="nav-subsections">
                  {section.subsections.map(sub => (
                    <button
                      key={sub}
                      className={`nav-sub-button ${activeSubSection === sub.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setActiveSubSection(sub.toLowerCase())}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="settings-main">
        {renderContent()}
      </div>
    </div>
  )
}

export default Settings
