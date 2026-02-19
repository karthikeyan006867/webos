import './ContextMenu.css'

const ContextMenu = ({ x, y, onClose, onOpenSettings }) => {
  const handleRefresh = () => {
    window.location.reload()
  }

  const menuItems = [
    { 
      icon: '🔄', 
      label: 'Refresh', 
      action: handleRefresh 
    },
    { type: 'separator' },
    { 
      icon: '👁️', 
      label: 'View',
      submenu: true
    },
    { 
      icon: '📋', 
      label: 'Sort by',
      submenu: true
    },
    { type: 'separator' },
    { 
      icon: '📁', 
      label: 'New',
      submenu: true
    },
    { type: 'separator' },
    { 
      icon: '🎨', 
      label: 'Personalize', 
      action: () => {
        onOpenSettings?.()
        onClose()
      }
    },
    { 
      icon: '⚙️', 
      label: 'Display settings', 
      action: () => {
        onOpenSettings?.()
        onClose()
      }
    },
  ]

  // Adjust position to keep menu on screen
  const menuStyle = {
    left: Math.min(x, window.innerWidth - 250),
    top: Math.min(y, window.innerHeight - 400)
  }

  return (
    <div
      className="context-menu"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, index) => (
        item.type === 'separator' ? (
          <div key={index} className="menu-separator" />
        ) : (
          <button
            key={index}
            className="menu-item"
            onClick={() => {
              item.action?.()
              onClose()
            }}
          >
            {item.icon && <span className="menu-icon">{item.icon}</span>}
            <span className="menu-label">{item.label}</span>
            {item.submenu && (
              <svg className="submenu-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            )}
          </button>
        )
      ))}
    </div>
  )
}

export default ContextMenu
