// Device Integration APIs - connects AuroraOS to real device features
// Browser-only mode - supreme efficiency, no backend required

export const getDeviceInfo = async () => {
  const info = {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    onLine: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    deviceMemory: navigator.deviceMemory || 8,
  }
  
  return info
}

export const getBatteryInfo = async () => {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery()
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        supported: true,
      }
    }
  } catch (error) {
    // Battery API not supported
  }
  
  return {
    level: 85, // Fallback
    charging: false,
    supported: false,
  }
}

export const getNetworkInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType || '4g',
      downlink: connection.downlink || 10,
      rtt: connection.rtt || 50,
      saveData: connection.saveData || false,
      type: connection.type || 'wifi',
      supported: true,
    }
  }
  
  return {
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    type: 'wifi',
    supported: false,
  }
}

export const getBluetoothDevices = async () => {
  try {
    if ('bluetooth' in navigator) {
      // Note: This requires user interaction and HTTPS
      return {
        available: true,
        supported: true,
      }
    }
  } catch (error) {
    // Bluetooth API not supported
  }
  
  return {
    available: false,
    supported: false,
  }
}

export const requestBluetoothDevice = async () => {
  try {
    if ('bluetooth' in navigator) {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      })
      return device
    }
  } catch (error) {
    // Bluetooth request failed or cancelled
    return null
  }
}

export const getWiFiInfo = () => {
  // WiFi specific info via Network Information API
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const online = navigator.onLine
  
  return {
    connected: online,
    type: connection?.type || (online ? 'wifi' : 'none'),
    quality: connection?.downlink ? Math.min(100, (connection.downlink / 10) * 100) : 80,
  }
}

export const getGeolocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            supported: true,
          })
        },
        (error) => {
          reject({
            error: error.message,
            supported: true,
          })
        }
      )
    } else {
      reject({
        error: 'Geolocation not supported',
        supported: false,
      })
    }
  })
}

export const getDisplayInfo = () => {
  return {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
    orientation: window.screen.orientation?.type || 'landscape-primary',
    devicePixelRatio: window.devicePixelRatio || 1,
  }
}

export const getMediaDevices = async () => {
  try {
    if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return {
        audioInputs: devices.filter(d => d.kind === 'audioinput'),
        audioOutputs: devices.filter(d => d.kind === 'audiooutput'),
        videoInputs: devices.filter(d => d.kind === 'videoinput'),
        supported: true,
      }
    }
  } catch (error) {
    // Media devices API not supported
  }
  
  return {
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
    supported: false,
  }
}

export const getStorageInfo = async () => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        percentage: Math.round((estimate.usage / estimate.quota) * 100),
        supported: true,
      }
    }
  } catch (error) {
    // Storage API not supported
  }
  
  return {
    quota: 1073741824, // 1GB fallback
    usage: 268435456, // 256MB fallback
    percentage: 25,
    supported: false,
  }
}

// Utility to format bytes
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Monitor network status changes
export const monitorNetworkStatus = (callback) => {
  try {
    const updateOnlineStatus = () => {
      callback({
        online: navigator.onLine,
        timestamp: new Date(),
      })
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  } catch (error) {
    // Network monitoring error
    return () => {}
  }
}

// Monitor battery status changes
export const monitorBatteryStatus = async (callback) => {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery()
      
      const updateBattery = () => {
        try {
          callback({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          })
        } catch (error) {
          // Battery update error - ignore
        }
      }
      
      battery.addEventListener('levelchange', updateBattery)
      battery.addEventListener('chargingchange', updateBattery)
      
      return () => {
        try {
          battery.removeEventListener('levelchange', updateBattery)
          battery.removeEventListener('chargingchange', updateBattery)
        } catch (error) {
          // Battery cleanup error - ignore
        }
      }
    }
  } catch (error) {
    // Battery monitoring not supported
  }
  
  return () => {}
}

// Get comprehensive system info
export const getSystemInfo = async () => {
  const battery = await getBatteryInfo()
  const network = getNetworkInfo()
  const display = getDisplayInfo()
  
  return {
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    onLine: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    deviceMemory: navigator.deviceMemory || 8,
    vendor: navigator.vendor,
    appVersion: navigator.appVersion,
    battery: battery,
    network: network,
    display: display,
    userInfo: 'User'
  }
}

// Execute terminal commands - Browser-only mode with supreme efficiency
export const executeTerminalCommand = async (command, currentPath) => {
  const cmd = command.trim()
  const parts = cmd.split(' ')
  const baseCmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  try {
    // Help command
    if (baseCmd === 'help') {
      return {
        output: `Available commands:
  help                - Show this help message
  clear, cls          - Clear the terminal screen
  echo <text>         - Display text
  date                - Display current date and time
  whoami              - Display current user info
  hostname            - Display computer name
  ver                 - Display OS version
  systeminfo          - Display detailed system information
  ipconfig            - Display network configuration
  dir, ls             - List directory contents (simulated)
  cd <path>           - Change directory (simulated)
  pwd                 - Print working directory
  battery             - Display battery status
  network             - Display network information
  storage             - Display storage information
  
Note: This is a web-based terminal. Some commands are simulated.
Many Windows commands are not available in browser environment.
`,
        error: false
      }
    }

    // Clear command
    if (baseCmd === 'clear' || baseCmd === 'cls') {
      return {
        output: '',
        error: false,
        clear: true
      }
    }

    // Echo command
    if (baseCmd === 'echo') {
      return {
        output: args.join(' '),
        error: false
      }
    }

    // Date command
    if (baseCmd === 'date') {
      const now = new Date()
      return {
        output: `The current date is: ${now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}\nThe current time is: ${now.toLocaleTimeString('en-US')}`,
        error: false
      }
    }

    // Whoami command
    if (baseCmd === 'whoami') {
      return {
        output: 'AURORA\\User',
        error: false
      }
    }

    // Hostname command
    if (baseCmd === 'hostname') {
      return {
        output: 'AURORA-PC',
        error: false
      }
    }

    // Version command
    if (baseCmd === 'ver') {
      return {
        output: 'AuroraOS [Version 1.0.0]\nBrowser: ' + navigator.userAgent,
        error: false
      }
    }

    // System info command
    if (baseCmd === 'systeminfo') {
      const sysInfo = await getSystemInfo()
      const battery = await getBatteryInfo()
      const network = getNetworkInfo()
      const storage = await getStorageInfo()
      const display = getDisplayInfo()

      return {
        output: `Host Name:                 AURORA-PC
OS Name:                   AuroraOS
OS Version:                1.0.0
System Manufacturer:       ${sysInfo.vendor || 'Web Browser'}
System Type:               x64-based PC
Processor(s):              ${sysInfo.hardwareConcurrency} processor(s) installed
Total Physical Memory:     ${sysInfo.deviceMemory || 8} GB
Available Physical Memory: ${Math.round((sysInfo.deviceMemory || 8) * 0.6)} GB
Virtual Memory:            ${(sysInfo.deviceMemory || 8) * 2} GB
Platform:                  ${sysInfo.platform}
Language:                  ${sysInfo.language}
Time Zone:                 ${Intl.DateTimeFormat().resolvedOptions().timeZone}
Battery Status:            ${battery.charging ? 'Charging' : 'On Battery'} (${battery.level}%)
Network Status:            ${network.type} (${network.effectiveType})
Display Resolution:        ${display.width} x ${display.height}
Storage Used:              ${formatBytes(storage.usage)} / ${formatBytes(storage.quota)}
`,
        error: false
      }
    }

    // IP Config command
    if (baseCmd === 'ipconfig') {
      const network = getNetworkInfo()
      const wifi = getWiFiInfo()
      
      return {
        output: `Windows IP Configuration

Ethernet adapter Ethernet:
   Connection-specific DNS Suffix  . : 
   Link-local IPv6 Address . . . . . : fe80::xxxx:xxxx:xxxx:xxxx%12
   IPv4 Address. . . . . . . . . . . : 192.168.1.100 (simulated)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Connection Status:
   Network Type: ${network.type}
   Effective Type: ${network.effectiveType}
   Connected: ${wifi.connected ? 'Yes' : 'No'}
   Downlink Speed: ${network.downlink} Mbps
   RTT: ${network.rtt} ms
`,
        error: false
      }
    }

    // Battery command
    if (baseCmd === 'battery') {
      const battery = await getBatteryInfo()
      
      let status = `Battery Status:
  Level: ${battery.level}%
  Status: ${battery.charging ? 'Charging' : 'Discharging'}
`
      
      if (battery.chargingTime !== Infinity && battery.charging) {
        status += `  Charging Time: ${Math.round(battery.chargingTime / 60)} minutes\n`
      }
      
      if (battery.dischargingTime !== Infinity && !battery.charging) {
        status += `  Remaining Time: ${Math.round(battery.dischargingTime / 60)} minutes\n`
      }
      
      if (!battery.supported) {
        status += '\nNote: Battery API not supported in this browser.\n'
      }

      return {
        output: status,
        error: false
      }
    }

    // Network command
    if (baseCmd === 'network') {
      const network = getNetworkInfo()
      const wifi = getWiFiInfo()
      
      return {
        output: `Network Information:
  Connection Type: ${network.type}
  Effective Type: ${network.effectiveType}
  Online: ${wifi.connected ? 'Yes' : 'No'}
  Downlink: ${network.downlink} Mbps
  Round Trip Time: ${network.rtt} ms
  Save Data Mode: ${network.saveData ? 'Enabled' : 'Disabled'}
`,
        error: false
      }
    }

    // Storage command
    if (baseCmd === 'storage') {
      const storage = await getStorageInfo()
      
      return {
        output: `Storage Information:
  Total Space: ${formatBytes(storage.quota)}
  Used Space: ${formatBytes(storage.usage)}
  Available: ${formatBytes(storage.quota - storage.usage)}
  Usage: ${storage.percentage}%
  
${!storage.supported ? 'Note: Storage API not supported - showing estimates.\n' : ''}`,
        error: false
      }
    }

    // Directory listing (simulated)
    if (baseCmd === 'dir' || baseCmd === 'ls') {
      return {
        output: `Directory of ${currentPath}

02/19/2026  10:30 AM    <DIR>          .
02/19/2026  10:30 AM    <DIR>          ..
02/15/2026  03:45 PM    <DIR>          Documents
02/15/2026  03:45 PM    <DIR>          Downloads
02/15/2026  03:45 PM    <DIR>          Pictures
02/15/2026  03:45 PM    <DIR>          Desktop
01/20/2026  09:15 AM             1,024 example.txt
               1 File(s)          1,024 bytes
               6 Dir(s)  (simulated directory listing)
`,
        error: false
      }
    }

    // Change directory (simulated)
    if (baseCmd === 'cd') {
      if (args.length === 0) {
        return {
          output: currentPath,
          error: false
        }
      }
      
      let newPath = currentPath
      const target = args.join(' ')
      
      if (target === '..') {
        const parts = currentPath.split('\\')
        parts.pop()
        newPath = parts.length > 1 ? parts.join('\\') : parts[0] + '\\'
      } else if (target.match(/^[A-Z]:\\/i)) {
        newPath = target
      } else {
        newPath = currentPath.endsWith('\\') ? currentPath + target : currentPath + '\\' + target
      }
      
      return {
        output: '',
        error: false,
        newPath: newPath
      }
    }

    // Print working directory
    if (baseCmd === 'pwd') {
      return {
        output: currentPath,
        error: false
      }
    }

    // Unknown command
    return {
      output: `'${baseCmd}' is not recognized as an internal or external command,
operable program or batch file.

Type 'help' for available commands.`,
      error: true
    }

  } catch (error) {
    return {
      output: `Error executing command: ${error.message}`,
      error: true
    }
  }
}
