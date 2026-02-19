import { useState } from 'react'
import LockScreen from './components/LockScreen'
import Desktop from './components/Desktop'
import './App.css'

function App() {
  const [isLocked, setIsLocked] = useState(true)
  const lockWallpaper = localStorage.getItem('wallpaper') || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=1080&fit=crop'

  const handleUnlock = (password) => {
    // Password is 1234
    if (password === '1234') {
      setIsLocked(false)
      return true
    }
    return false
  }

  return (
    <div className="windows11-os">
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} wallpaper={lockWallpaper} />
      ) : (
        <Desktop />
      )}
    </div>
  )
}

export default App
