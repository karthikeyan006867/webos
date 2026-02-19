import { useState, useEffect } from 'react'
import Taskbar from './Taskbar'
import StartMenu from './StartMenu'
import Window from './Window'
import ContextMenu from './ContextMenu'
import Widgets from './Widgets'
import Settings from './Settings'
import TaskManager from './TaskManager'
import Terminal from './Terminal'
import './Desktop.css'

const Desktop = () => {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showWidgets, setShowWidgets] = useState(false)
  const [windows, setWindows] = useState([])
  const [contextMenu, setContextMenu] = useState(null)
  const [activeWindow, setActiveWindow] = useState(null)
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem('wallpaper') || 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=1920&h=1080&fit=crop'
  })
  const [wallpaperColor, setWallpaperColor] = useState(() => {
    return localStorage.getItem('wallpaperColor') || '#1e3c72'
  })

  useEffect(() => {
    localStorage.setItem('wallpaper', wallpaper)
    localStorage.setItem('wallpaperColor', wallpaperColor)
  }, [wallpaper, wallpaperColor])

  const handleWallpaperChange = (url, color) => {
    setWallpaper(url)
    setWallpaperColor(color)
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    })
    setShowStartMenu(false)
    setShowWidgets(false)
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleDesktopClick = () => {
    closeContextMenu()
    setShowStartMenu(false)
    setShowWidgets(false)
  }

  const openApp = (app) => {
    // Check if app is already open
    const existingWindow = windows.find(w => w.title === app.name)
    if (existingWindow) {
      setActiveWindow(existingWindow.id)
      if (existingWindow.isMinimized) {
        minimizeWindow(existingWindow.id)
      }
      setShowStartMenu(false)
      return
    }

    // Determine window size based on app type
    let width = 800
    let height = 600
    
    if (app.name === 'Settings') {
      width = 1000
      height = 700
    } else if (app.name === 'Terminal') {
      width = 900
      height = 550
    } else if (app.name === 'Task Manager') {
      width = 700
      height = 600
    }

    const newWindow = {
      id: Date.now(),
      title: app.name,
      icon: app.icon,
      component: app.component,
      section: app.section, // Store section for Settings
      width: width,
      height: height,
      x: 100 + windows.length * 30,
      y: 50 + windows.length * 30,
      isMaximized: false,
      isMinimized: false
    }
    setWindows([...windows, newWindow])
    setActiveWindow(newWindow.id)
    setShowStartMenu(false)
  }

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id))
    if (activeWindow === id) {
      const remaining = windows.filter(w => w.id !== id)
      setActiveWindow(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
    }
  }

  const minimizeWindow = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ))
  }

  const maximizeWindow = (id) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }

  const focusWindow = (id) => {
    setActiveWindow(id)
    // Restore window if minimized when clicked from taskbar
    const window = windows.find(w => w.id === id)
    if (window && window.isMinimized) {
      minimizeWindow(id)
    }
  }

  return (
    <div className="desktop" onContextMenu={handleContextMenu}>
      <div 
        className="desktop-wallpaper" 
        style={{ 
          backgroundImage: `linear-gradient(135deg, ${wallpaperColor}22 0%, ${wallpaperColor}44 100%), url(${wallpaper})`
        }}
        onClick={handleDesktopClick}
      />
      
      <div className="desktop-icons">
        <div className="desktop-icon" onDoubleClick={(e) => { e.stopPropagation(); openApp({ name: 'This PC', icon: '💻' }); }}>
          <div className="icon-image">💻</div>
          <div className="icon-label">This PC</div>
        </div>
        <div className="desktop-icon" onDoubleClick={(e) => { e.stopPropagation(); openApp({ name: 'Recycle Bin', icon: '🗑️' }); }}>
          <div className="icon-image">🗑️</div>
          <div className="icon-label">Recycle Bin</div>
        </div>
        <div className="desktop-icon" onDoubleClick={(e) => { e.stopPropagation(); openApp({ name: 'Microsoft Edge', icon: '🌐' }); }}>
          <div className="icon-image">🌐</div>
          <div className="icon-label">Microsoft Edge</div>
        </div>
        <div className="desktop-icon" onDoubleClick={(e) => { e.stopPropagation(); openApp({ name: 'Settings', icon: '⚙️' }); }}>
          <div className="icon-image">⚙️</div>
          <div className="icon-label">Settings</div>
        </div>
      </div>

      {windows.map(window => (
        !window.isMinimized && (
          <Window
            key={window.id}
            window={window}
            isActive={activeWindow === window.id}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
          >
            {window.title === 'Settings' && (
              <Settings 
                onWallpaperChange={handleWallpaperChange}
                currentWallpaper={wallpaper}
                initialSection={window.section}
              />
            )}
            {window.title === 'Task Manager' && (
              <TaskManager 
                windows={windows}
                onCloseWindow={closeWindow}
              />
            )}
            {window.title === 'Terminal' && (
              <Terminal />
            )}
          </Window>
        )
      ))}

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={closeContextMenu}
          onOpenSettings={() => openApp({ name: 'Settings', icon: '⚙️' })}
        />
      )}

      {showWidgets && <Widgets onClose={() => setShowWidgets(false)} />}

      <Taskbar 
        onStartClick={() => setShowStartMenu(!showStartMenu)}
        onWidgetsClick={() => setShowWidgets(!showWidgets)}
        onTaskManagerOpen={() => openApp({ name: 'Task Manager', icon: '📊' })}
        onSettingsOpen={(section) => {
          const settingsWindow = windows.find(w => w.title === 'Settings')
          if (settingsWindow) {
            setActiveWindow(settingsWindow.id)
            if (settingsWindow.isMinimized) {
              minimizeWindow(settingsWindow.id)
            }
          } else {
            openApp({ name: 'Settings', icon: '⚙️', section })
          }
        }}
        showStartMenu={showStartMenu}
        windows={windows}
        activeWindow={activeWindow}
        onWindowClick={focusWindow}
      />

      {showStartMenu && (
        <StartMenu 
          onClose={() => setShowStartMenu(false)}
          onAppClick={openApp}
        />
      )}
    </div>
  )
}

export default Desktop
