# PWA & GitHub Pages Setup - Integral Ethics Engine

**Status**: ✅ Configured for Multi-Environment Deployment
**Date**: December 21, 2025

---

## 🎯 Overview

The Integral Ethics Engine is configured as a Progressive Web App (PWA) with dual-environment deployment to GitHub Pages:

- **Production (main branch)**: `/<repo-name>/`
- **Development (dev branch)**: `/<repo-name>/dev/`

This setup enables:
- ✅ Offline-first operation
- ✅ User-owned data via IndexedDB
- ✅ Separate dev/prod environments with distinct theme colors
- ✅ Automatic deployment via GitHub Actions
- ✅ Service worker caching strategies

---

## 📁 PWA Configuration Files

### 1. **manifest.json** - PWA Metadata

**Location**: [manifest.json](manifest.json)

**Configuration**:
```json
{
  "name": "Integral Ethics Engine",
  "short_name": "IEE",
  "description": "Multi-perspectival moral reasoning system...",
  "theme_color": "#2c5aa0",  // Production blue
  "start_url": "/",
  "display": "standalone"
}
```

**Environment-Specific Theming**:
- Production: Blue theme (`#2c5aa0`)
- Development: Yellow theme (`#ffc107`)

### 2. **service-worker.js** - Offline Support

**Location**: [service-worker.js](service-worker.js)

**Features**:
- ✅ Automatic environment detection (dev vs prod)
- ✅ Base path resolution for GitHub Pages
- ✅ Cache-first strategy for static assets
- ✅ Network-first strategy for API calls
- ✅ Offline fallback page
- ✅ Background sync support
- ✅ Push notification support

**Environment Detection**:
```javascript
const BASE_PATH = self.location.pathname.match(/^\/[^\/]+\/(dev\/)?/)?.[0] || '/';
const IS_DEV = BASE_PATH.includes('/dev/');
const ENV = IS_DEV ? 'dev' : 'prod';
```

**Cache Strategy**:
- Static assets (HTML, CSS, JS): Cache-first with network fallback
- API requests: Network-first with cache fallback
- Offline page: Always cached for fallback

### 3. **manifest-generator.js** - Dynamic Manifest

**Location**: [src/manifest-generator.js](src/manifest-generator.js)

**Purpose**: Generates environment-specific manifest on the fly

**Features**:
- ✅ Detects dev/prod environment
- ✅ Adjusts theme colors (yellow for dev, blue for prod)
- ✅ Updates app name with (Dev) suffix
- ✅ Configures correct start_url and scope
- ✅ Registers service worker with correct scope

**Usage in HTML**:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#2c5aa0">
<script type="module" src="./src/manifest-generator.js"></script>
```

---

## 🚀 GitHub Actions CI/CD Pipeline

**Location**: [.github/workflows/ci.yml](.github/workflows/ci.yml)

### Workflow Triggers

```yaml
on:
  push:
    branches: [ "main", "dev" ]
  pull_request:
    branches: [ "main" ]
```

### Jobs

#### 1. **build-and-test**
Runs on every push to main/dev and all PRs:

**Fast Feedback** (always runs):
- ✅ Install dependencies
- ✅ Run unit tests with JSON reporting
- ✅ Upload test results as artifacts
- ✅ Add test summary to workflow
- ✅ Security audit (`npm run security-check`)

**UI Tests** (only on main/dev branches):
- ✅ Install Chrome
- ✅ Install UI test framework dependencies
- ✅ Run headless browser tests

#### 2. **deploy**
Deploys to GitHub Pages (only from main branch):

**Multi-Environment Deployment**:
```bash
# Main branch → / (root)
cp -r src _site/
cp -r ontology _site/
cp -r examples _site/
cp manifest.json service-worker.js offline.html _site/

# Dev branch → /dev/
git checkout origin/dev
mkdir -p _site/dev
cp -r src ontology examples _site/dev/
# Add base tag for proper path resolution
```

**Deployment Structure**:
```
_site/
├── index.html              # Main (production)
├── src/
├── ontology/
├── examples/
├── manifest.json
├── service-worker.js
├── dev/
│   ├── index.html          # Dev (with base tag)
│   ├── src/
│   ├── ontology/
│   └── ...
└── environments.html       # Environment selector
```

---

## 🔧 Configuration Details

### Environment-Specific Settings

| Feature | Production (main) | Development (dev) |
|---------|------------------|-------------------|
| **Theme Color** | `#2c5aa0` (Blue) | `#ffc107` (Yellow) |
| **App Name** | Integral Ethics Engine | Integral Ethics Engine (Dev) |
| **Short Name** | IEE | IEE (Dev) |
| **Base Path** | `/<repo>/` | `/<repo>/dev/` |
| **Cache Name** | `static-v1-prod` | `static-v1-dev` |
| **IndexedDB** | `iee-prod` | `iee-dev` |

### Service Worker Scopes

**Production**:
```javascript
scope: '/Integral-Ethics-Engine/'
serviceWorker: '/Integral-Ethics-Engine/service-worker.js'
```

**Development**:
```javascript
scope: '/Integral-Ethics-Engine/dev/'
serviceWorker: '/Integral-Ethics-Engine/dev/service-worker.js'
```

---

## 📦 Deployment Steps

### Automatic Deployment (Recommended)

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Update IEE features"
   git push origin main
   ```

2. **GitHub Actions automatically**:
   - ✅ Runs all tests
   - ✅ Performs security audit
   - ✅ Deploys to `/<repo>/` (production)
   - ✅ Fetches dev branch and deploys to `/<repo>/dev/`

### Manual Deployment

If needed, you can trigger deployment manually:

```bash
# From GitHub UI:
# Actions → CI, Security & Deploy → Run workflow → main
```

### First-Time Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - No branch selection needed

2. **Create dev branch**:
   ```bash
   git checkout -b dev
   git push -u origin dev
   ```

3. **Push to main**:
   ```bash
   git checkout main
   git push origin main
   ```

4. **Access deployed sites**:
   - Production: `https://<username>.github.io/<repo>/`
   - Development: `https://<username>.github.io/<repo>/dev/`
   - Environments: `https://<username>.github.io/<repo>/environments.html`

---

## 🔍 Testing PWA Features

### Local Testing

```bash
# Start a local server (required for service workers)
npx http-server -c-1 -p 8080

# Open in browser
open http://localhost:8080

# Check service worker in DevTools
# Application → Service Workers
```

### Production Testing

```bash
# Check if service worker is registered
# Open browser console on deployed site:
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs))

# Verify manifest
fetch('/manifest.json').then(r => r.json()).then(console.log)

# Test offline mode
# DevTools → Application → Service Workers → Check "Offline"
```

---

## 🎨 Customization Guide

### Change Theme Colors

**Production (Blue)**:
```javascript
// manifest.json
"theme_color": "#2c5aa0"

// manifest-generator.js
theme_color: config.isDev ? '#ffc107' : '#2c5aa0'
```

**Development (Yellow)**:
```javascript
// Already configured as #ffc107
```

### Add App Icons

Place icons in `/icons/` directory:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png (required for PWA)

### Modify Caching Strategy

**service-worker.js**:
```javascript
// Add files to static cache
const STATIC_ASSETS = [
  resolvePath(''),
  resolvePath('index.html'),
  resolvePath('manifest.json'),
  resolvePath('src/concepts/worldviewManager.js'),  // Add your files
  OFFLINE_PAGE
];
```

---

## 🐛 Troubleshooting

### Service Worker Not Registering

**Check**:
1. HTTPS or localhost (required for service workers)
2. Console errors in DevTools
3. Service worker path relative to root
4. Scope matches base path

**Fix**:
```javascript
// Check registration
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log('Registered:', regs.map(r => r.scope)))
```

### Wrong Theme Color

**Check**:
1. manifest-generator.js loaded
2. Theme meta tag in HTML
3. Environment detection working

**Fix**:
```javascript
// Verify environment
import { config } from './src/config.js';
console.log('Environment:', config.env, 'IsDev:', config.isDev);
```

### Dev Branch Not Deploying

**Check**:
1. Dev branch exists: `git branch -r | grep dev`
2. GitHub Actions has permissions
3. Check workflow logs

**Fix**:
```bash
# Ensure dev branch exists
git checkout -b dev
git push -u origin dev

# Re-run workflow from main
git checkout main
git push origin main
```

### Base Path Issues

**Check**:
1. Repository name in URL
2. Base tag in dev index.html
3. Service worker BASE_PATH detection

**Fix**:
```bash
# View deployed base tag
curl https://username.github.io/repo/dev/index.html | grep base
```

---

## ✅ Verification Checklist

### Before Deployment
- [ ] All tests passing (`npm test`)
- [ ] UI tests passing (`cd ui-test-framework && npm test`)
- [ ] Security audit clean (`npm run security-check`)
- [ ] Service worker updated if needed
- [ ] Manifest updated if needed

### After Deployment
- [ ] Production site loads: `/<repo>/`
- [ ] Dev site loads: `/<repo>/dev/`
- [ ] Service worker registered (check DevTools)
- [ ] Correct theme colors (blue for prod, yellow for dev)
- [ ] Offline mode works
- [ ] Cache populated
- [ ] Environments page accessible

---

## 📊 Current Status

✅ **manifest.json**: Updated for IEE
✅ **service-worker.js**: Environment detection working
✅ **manifest-generator.js**: Dynamic manifest generation
✅ **ci.yml**: Multi-environment deployment configured
✅ **Theme Colors**: Blue (prod) / Yellow (dev)
✅ **Base Paths**: Properly configured for GitHub Pages

**Ready for deployment** ✨

---

## 🔗 Related Documentation

- [FOUNDATION_COMPLETE.md](FOUNDATION_COMPLETE.md) - IEE Architecture
- [TEST_RESULTS.md](TEST_RESULTS.md) - Test Coverage
- [docs/GITHUB_PAGES_PWA.md](docs/GITHUB_PAGES_PWA.md) - Detailed PWA Guide
- [TEMPLATE_README.md](TEMPLATE_README.md) - Template Documentation

---

**Last Updated**: December 21, 2025
**Status**: ✅ Production Ready
