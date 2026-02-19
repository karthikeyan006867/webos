import { useState, useRef, useEffect, useCallback } from 'react'
import './Window.css'

const Window = ({ window, isActive, onClose, onMinimize, onMaximize, onFocus, children }) => {
  const [position, setPosition] = useState({ x: window.x, y: window.y })
  const [size, setSize] = useState({ width: window.width, height: window.height })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls') || window.isMaximized) return
    onFocus()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isDragging && !window.isMaximized) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: Math.max(0, e.clientY - dragStart.y)
      })
    }
  }, [isDragging, window.isMaximized, dragStart])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const windowStyle = window.isMaximized
    ? { top: 0, left: 0, right: 0, bottom: 48, width: '100%', height: 'calc(100% - 48px)' }
    : { 
        left: position.x, 
        top: position.y, 
        width: size.width, 
        height: size.height 
      }

  return (
    <div
      ref={windowRef}
      className={`window ${isActive ? 'active' : ''} ${window.isMaximized ? 'maximized' : ''}`}
      style={windowStyle}
      onClick={onFocus}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-title">
          <span className="window-icon">{window.icon}</span>
          <span>{window.title}</span>
        </div>
        <div className="window-controls">
          <button className="control-btn minimize" onClick={onMinimize} title="Minimize">
            <svg viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="5.5" width="8" height="1"/>
            </svg>
          </button>
          <button className="control-btn maximize" onClick={onMaximize} title={window.isMaximized ? "Restore" : "Maximize"}>
            {window.isMaximized ? (
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M2.5 3.5v5h5v-5h-5zM2 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" fill="currentColor">
                <rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
            )}
          </button>
          <button className="control-btn close" onClick={onClose} title="Close">
            <svg viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 4.82L2.76 1.59 1.59 2.76 4.82 6 1.59 9.24l1.17 1.17L6 7.18l3.24 3.23 1.17-1.17L7.18 6l3.23-3.24-1.17-1.17L6 4.82z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="window-content">
        <div className="window-body">
          {children || (
            <div className="placeholder-content">
              <div className="placeholder-icon">{window.icon}</div>
              <h2>{window.title}</h2>
              <p>This is a placeholder window. In a full implementation, this would contain the actual application.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Window
