import './StartMenu.css'

const StartMenu = ({ onClose, onAppClick }) => {
  const pinnedApps = [
    { id: 1, name: 'Microsoft Edge', icon: '🌐', color: '#0078d4' },
    { id: 2, name: 'File Explorer', icon: '📁', color: '#ffb900' },
    { id: 3, name: 'Settings', icon: '⚙️', color: '#737373' },
    { id: 4, name: 'Task Manager', icon: '📊', color: '#0078d4' },
    { id: 5, name: 'Microsoft Store', icon: '🛒', color: '#0078d4' },
    { id: 6, name: 'Photos', icon: '🖼️', color: '#00bcf2' },
    { id: 7, name: 'Mail', icon: '✉️', color: '#0078d4' },
    { id: 8, name: 'Calendar', icon: '📅', color: '#0078d4' },
    { id: 9, name: 'Calculator', icon: '🔢', color: '#00bcf2' },
    { id: 10, name: 'Paint', icon: '🎨', color: '#886ce4' },
    { id: 11, name: 'Notepad', icon: '📝', color: '#0078d4' },
    { id: 12, name: 'Terminal', icon: '⌨️', color: '#0c7d9d' },
  ]

  const recommendedItems = [
    { id: 1, name: 'Document.docx', icon: '📄', time: '2 hours ago' },
    { id: 2, name: 'Presentation.pptx', icon: '📊', time: 'Yesterday' },
    { id: 3, name: 'Project Folder', icon: '📁', time: '3 days ago' },
    { id: 4, name: 'Image.png', icon: '🖼️', time: 'Last week' },
  ]

  return (
    <div className="start-menu">
      <div className="start-header">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" placeholder="Search for apps, settings, and documents" />
        </div>
      </div>

      <div className="start-content">
        <div className="pinned-section">
          <div className="section-header">
            <span>Pinned</span>
            <button className="all-apps-btn">
              All apps
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
          <div className="pinned-grid">
            {pinnedApps.map(app => (
              <button 
                key={app.id} 
                className="app-tile"
                onClick={() => onAppClick(app)}
              >
                <div className="app-icon" style={{ background: app.color }}>
                  <span>{app.icon}</span>
                </div>
                <div className="app-name">{app.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="recommended-section">
          <div className="section-header">
            <span>Recommended</span>
            <button className="more-btn">More</button>
          </div>
          <div className="recommended-list">
            {recommendedItems.map(item => (
              <button key={item.id} className="recommended-item">
                <div className="item-icon">{item.icon}</div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-time">{item.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="start-footer">
        <button className="user-profile">
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <span>User</span>
        </button>
        <button className="power-button" title="Power">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default StartMenu
