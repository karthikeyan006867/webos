import { useState, useEffect } from 'react'
import './TaskManager.css'

const TaskManager = ({ windows, onCloseWindow }) => {
  const [activeTab, setActiveTab] = useState('processes')
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [diskUsage, setDiskUsage] = useState(0)
  const [networkUsage, setNetworkUsage] = useState(0)

  useEffect(() => {
    // Simulate system stats
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 10)
      setMemoryUsage(Math.floor(Math.random() * 20) + 40)
      setDiskUsage(Math.floor(Math.random() * 10) + 5)
      setNetworkUsage(Math.floor(Math.random() * 50) + 10)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const systemProcesses = [
    { name: 'System', cpu: 0.1, memory: 124.5, status: 'Running' },
    { name: 'Windows Explorer', cpu: 0.2, memory: 89.3, status: 'Running' },
    { name: 'Runtime Broker', cpu: 0.1, memory: 45.2, status: 'Running' },
    { name: 'dwm.exe', cpu: 0.3, memory: 67.8, status: 'Running' },
    { name: 'Service Host', cpu: 0.2, memory: 234.6, status: 'Running' },
    { name: 'Antimalware Service', cpu: 0.1, memory: 178.4, status: 'Running' },
    { name: 'Microsoft Edge', cpu: 1.2, memory: 456.7, status: 'Running' },
  ]

  const appProcesses = windows.map(win => ({
    name: win.title,
    cpu: Math.random() * 2,
    memory: Math.random() * 100 + 50,
    status: 'Running',
    id: win.id
  }))

  const allProcesses = [...systemProcesses, ...appProcesses]

  const renderProcesses = () => (
    <div className="processes-view">
      <table className="process-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>CPU</th>
            <th>Memory</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allProcesses.map((process, index) => (
            <tr key={index}>
              <td className="process-name">
                <div className="process-icon">📄</div>
                {process.name}
              </td>
              <td>{process.cpu.toFixed(1)}%</td>
              <td>{process.memory.toFixed(1)} MB</td>
              <td>
                <span className="status-badge">{process.status}</span>
              </td>
              <td>
                {process.id && (
                  <button 
                    className="end-task-btn"
                    onClick={() => onCloseWindow(process.id)}
                  >
                    End task
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderPerformance = () => (
    <div className="performance-view">
      <div className="perf-grid">
        <div className="perf-card">
          <div className="perf-header">
            <span className="perf-label">CPU</span>
            <span className="perf-value">{cpuUsage}%</span>
          </div>
          <div className="perf-chart">
            <div className="chart-bar" style={{ height: `${cpuUsage}%` }}></div>
          </div>
          <div className="perf-details">
            <div className="detail-row">
              <span>Utilization</span>
              <span>{cpuUsage}%</span>
            </div>
            <div className="detail-row">
              <span>Speed</span>
              <span>3.60 GHz</span>
            </div>
            <div className="detail-row">
              <span>Processes</span>
              <span>{allProcesses.length}</span>
            </div>
          </div>
        </div>

        <div className="perf-card">
          <div className="perf-header">
            <span className="perf-label">Memory</span>
            <span className="perf-value">{memoryUsage}%</span>
          </div>
          <div className="perf-chart">
            <div className="chart-bar" style={{ height: `${memoryUsage}%` }}></div>
          </div>
          <div className="perf-details">
            <div className="detail-row">
              <span>In use</span>
              <span>{(memoryUsage * 0.16).toFixed(1)} GB</span>
            </div>
            <div className="detail-row">
              <span>Available</span>
              <span>{(16 - memoryUsage * 0.16).toFixed(1)} GB</span>
            </div>
            <div className="detail-row">
              <span>Committed</span>
              <span>{(memoryUsage * 0.2).toFixed(1)} GB</span>
            </div>
          </div>
        </div>

        <div className="perf-card">
          <div className="perf-header">
            <span className="perf-label">Disk</span>
            <span className="perf-value">{diskUsage}%</span>
          </div>
          <div className="perf-chart">
            <div className="chart-bar" style={{ height: `${diskUsage}%` }}></div>
          </div>
          <div className="perf-details">
            <div className="detail-row">
              <span>Active time</span>
              <span>{diskUsage}%</span>
            </div>
            <div className="detail-row">
              <span>Read speed</span>
              <span>{(Math.random() * 50).toFixed(1)} MB/s</span>
            </div>
            <div className="detail-row">
              <span>Write speed</span>
              <span>{(Math.random() * 30).toFixed(1)} MB/s</span>
            </div>
          </div>
        </div>

        <div className="perf-card">
          <div className="perf-header">
            <span className="perf-label">Network</span>
            <span className="perf-value">{networkUsage}%</span>
          </div>
          <div className="perf-chart">
            <div className="chart-bar" style={{ height: `${networkUsage}%` }}></div>
          </div>
          <div className="perf-details">
            <div className="detail-row">
              <span>Send</span>
              <span>{(Math.random() * 10).toFixed(1)} Mbps</span>
            </div>
            <div className="detail-row">
              <span>Receive</span>
              <span>{(Math.random() * 50).toFixed(1)} Mbps</span>
            </div>
            <div className="detail-row">
              <span>Connection</span>
              <span>Wi-Fi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="task-manager">
      <div className="task-manager-header">
        <div className="tab-bar">
          <button 
            className={`tab ${activeTab === 'processes' ? 'active' : ''}`}
            onClick={() => setActiveTab('processes')}
          >
            Processes
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
        </div>
      </div>

      <div className="task-manager-content">
        {activeTab === 'processes' && renderProcesses()}
        {activeTab === 'performance' && renderPerformance()}
      </div>
    </div>
  )
}

export default TaskManager
