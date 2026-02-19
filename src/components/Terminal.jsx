import { useState, useEffect, useRef } from 'react'
import './Terminal.css'
import { executeTerminalCommand, getSystemInfo } from '../utils/deviceAPI'

const Terminal = () => {
  const [commandHistory, setCommandHistory] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPath, setCurrentPath] = useState('C:\\Users\\User')
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // Initialize with welcome message
    const initTerminal = async () => {
      const sysInfo = await getSystemInfo()
      const userName = sysInfo.userInfo || 'User'
      const homeDir = sysInfo.platform.includes('Win') ? `C:\\Users\\${userName}` : '/home'
      setCurrentPath(homeDir)
      
      const welcomeMessage = {
        type: 'system',
        content: `Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

AuroraOS Browser Terminal v1.0
Platform: ${sysInfo.platform}
CPU Cores: ${sysInfo.hardwareConcurrency}
Memory: ${sysInfo.deviceMemory}GB

Type 'help' for available commands.
`
      }
      setCommandHistory([welcomeMessage])
    }
    
    initTerminal()
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleCommand = async (cmd) => {
    if (!cmd.trim()) return

    const commandEntry = {
      type: 'command',
      path: currentPath,
      content: cmd
    }

    setCommandHistory(prev => [...prev, commandEntry])

    // Execute command in browser
    const result = await executeTerminalCommand(cmd, currentPath)
    
    // Handle clear command
    if (result.clear) {
      setCommandHistory([])
      return
    }
    
    const outputEntry = {
      type: 'output',
      content: result.output,
      error: result.error
    }

    setCommandHistory(prev => [...prev, outputEntry])

    // Update path if cd command
    if (result.newPath) {
      setCurrentPath(result.newPath)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentCommand.trim()) {
      handleCommand(currentCommand)
      setCurrentCommand('')
      setHistoryIndex(-1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const commands = commandHistory.filter(entry => entry.type === 'command')
      if (commands.length > 0) {
        const newIndex = historyIndex < commands.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setCurrentCommand(commands[commands.length - 1 - newIndex]?.content || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const commands = commandHistory.filter(entry => entry.type === 'command')
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commands[commands.length - 1 - newIndex]?.content || '')
      } else {
        setHistoryIndex(-1)
        setCurrentCommand('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Basic tab completion (can be extended)
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setCommandHistory(prev => [...prev, { type: 'output', content: '^C' }])
      setCurrentCommand('')
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setCommandHistory([])
    }
  }

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="terminal-container" onClick={handleTerminalClick}>
      <div className="terminal-output" ref={terminalRef}>
        {commandHistory.map((entry, index) => (
          <div key={index} className={`terminal-entry ${entry.type}`}>
            {entry.type === 'command' && (
              <div className="command-line">
                <span className="prompt">PS {entry.path}&gt;</span>
                <span className="command-text">{entry.content}</span>
              </div>
            )}
            {entry.type === 'output' && (
              <pre className={entry.error ? 'error' : ''}>
                {entry.content}
              </pre>
            )}
            {entry.type === 'system' && (
              <pre className="system-message">
                {entry.content}
              </pre>
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="prompt">PS {currentPath}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  )
}

export default Terminal
