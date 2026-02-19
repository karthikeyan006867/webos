# WebOS - Browser-Only Mode 🚀

**Supreme efficiency** - No backend server required! Everything runs in your browser.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 and enjoy WebOS!

## Features

### ✅ Fully Browser-Based
- **No backend server needed** - everything runs client-side
- **Instant startup** - just `npm run dev`
- **Real device data** - battery, network, storage from browser APIs
- **Terminal** - browser-based command execution
- **Settings** - WiFi, Bluetooth, Battery monitoring

### 🔋 Real System Integration
All using native browser APIs:
- **Battery API** - Real battery level and charging status
- **Network Information API** - Connection type, speed, latency
- **Storage API** - Browser storage usage
- **Bluetooth API** - Device pairing (HTTPS required)
- **Display** - Screen resolution and orientation

### ⌨️ Terminal Commands
```powershell
help          # List available commands
systeminfo    # Detailed system info
battery       # Battery status
network       # Network information
storage       # Storage usage
ipconfig      # Network configuration
dir / ls      # List directory
cd <path>     # Change directory
date          # Current date/time
whoami        # Current user
hostname      # Computer name
clear / cls   # Clear screen
```

## Browser Compatibility

Best experience with:
- ✅ Chrome/Edge (all features)
- ✅ Firefox (most features)
- ⚠️ Safari (limited battery/network APIs)

For Bluetooth features, use HTTPS in production.

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## No Dependencies!

Only requires:
- React
- Vite

That's it! No Express, CORS, or Node.js complexity.

## Limitations

Browser security means:
- Cannot execute actual system commands
- Cannot modify OS settings (WiFi on/off, etc.)
- Terminal is simulated but provides real device info
- Some APIs require HTTPS in production

## Performance

⚡ **Supreme efficiency:**
- Instant load times
- No API latency
- Direct browser API access
- Minimal bundle size
- Zero backend overhead

---

**Made with ❤️ for the web**
