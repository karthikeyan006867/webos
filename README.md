# AuroraOS 🌌

**Supreme efficiency** - No backend server required! Everything runs in your browser.

> **🚀 Deploy Now:** `npx vercel --prod` (one command deployment!)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 and enjoy AuroraOS!

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

## Deploy to Vercel

### 🚀 Quick Deploy (One Command)

```bash
npm run deploy
```
*Or without setup:* `npx vercel --prod`

### Option 1: CLI Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Preview**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Accept default settings
   - Get a preview URL instantly!

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/auroraos.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"

### Configuration

Vercel automatically detects Vite projects. The included `vercel.json` optimizes:
- ✅ SPA routing (all routes → index.html)
- ✅ Security headers (XSS protection, frame options)
- ✅ Browser API permissions (battery, bluetooth, geolocation)

**Build Settings** (auto-detected):
- **Framework Preset:** Vite
- **Build Command:** `vite build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment & HTTPS

✅ **Vercel provides HTTPS by default** - all browser APIs work perfectly:
- Battery API
- Network Information API
- Bluetooth API (requires HTTPS)
- Storage API
- Geolocation API

### Custom Domain (Optional)

Add your custom domain in Vercel dashboard:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `auroraos.com`)
3. Update DNS records as instructed
4. SSL certificate auto-provisioned

### Troubleshooting

**Build Fails?**
- Ensure `package.json` has all dependencies
- Run `npm install` locally first
- Check Node.js version (use 18.x or higher)

**Browser APIs not working?**
- Vercel provides HTTPS by default ✅
- Check browser console for permission prompts
- Some APIs require user interaction first

**Preview vs Production?**
- Preview: `vercel` (get a test URL)
- Production: `vercel --prod` (deploy to main domain)

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
