import { useState, useEffect } from 'react'
import './VolumePanel.css'

const VolumePanel = ({ onClose }) => {
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(50)

  useEffect(() => {
    // Load saved volume from localStorage
    const savedVolume = localStorage.getItem('systemVolume')
    if (savedVolume) {
      setVolume(parseInt(savedVolume))
    }
  }, [])

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    localStorage.setItem('systemVolume', newVolume.toString())
    
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
    
    // Update slider gradient
    updateSliderGradient(newVolume)
  }

  const updateSliderGradient = (vol) => {
    const slider = document.querySelector('.volume-slider')
    if (slider) {
      const percentage = vol
      slider.style.background = `linear-gradient(to right, #0078d4 0%, #0078d4 ${percentage}%, #d0d0d0 ${percentage}%, #d0d0d0 100%)`
    }
  }

  useEffect(() => {
    updateSliderGradient(volume)
  }, [volume])

  const toggleMute = () => {
    if (!isMuted) {
      setPreviousVolume(volume)
      setVolume(0)
      setIsMuted(true)
    } else {
      setVolume(previousVolume || 50)
      setIsMuted(false)
    }
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇'
    if (volume < 33) return '🔈'
    if (volume < 66) return '🔉'
    return '🔊'
  }

  const getVolumeLevel = () => {
    if (isMuted || volume === 0) return 'Muted'
    return `${volume}%`
  }

  return (
    <div className="volume-panel" onClick={(e) => e.stopPropagation()}>
      <div className="volume-header">
        <button className="close-btn" onClick={onClose} title="Close">✕</button>
      </div>

      <div className="volume-main">
        <div className="volume-icon-display">
          <span className="volume-icon-large">{getVolumeIcon()}</span>
        </div>

        <div className="volume-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <div className="volume-percentage">{getVolumeLevel()}</div>
        </div>
      </div>

      <div className="volume-controls">
        <button 
          className={`volume-control-btn ${isMuted ? 'active' : ''}`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="control-icon">{isMuted ? '🔇' : '🔊'}</span>
          <span className="control-label">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button className="volume-control-btn" title="Sound settings">
          <span className="control-icon">⚙️</span>
          <span className="control-label">Settings</span>
        </button>

        <button className="volume-control-btn" title="Spatial sound">
          <span className="control-icon">🎧</span>
          <span className="control-label">Spatial</span>
        </button>
      </div>

      <div className="volume-devices">
        <div className="device-header">
          <span>Output device</span>
        </div>
        <div className="device-list">
          <div className="device-item active">
            <div className="device-icon">🔊</div>
            <div className="device-info">
              <div className="device-name">Speakers (Default)</div>
              <div className="device-status">Ready</div>
            </div>
            <div className="device-checkmark">✓</div>
          </div>
          
          <div className="device-item">
            <div className="device-icon">🎧</div>
            <div className="device-info">
              <div className="device-name">Headphones</div>
              <div className="device-status">Not connected</div>
            </div>
          </div>
        </div>
      </div>

      <div className="volume-mixer-link">
        <button className="mixer-btn">
          <span>🎚️</span>
          <span>Volume mixer</span>
          <span className="arrow">›</span>
        </button>
      </div>
    </div>
  )
}

export default VolumePanel
