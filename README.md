# Vigilance - Early Warning Detection System

An AI-powered threat monitoring and analytics platform for detecting and responding to disinformation campaigns before they go viral.

✅ **Modern React application - All data JSON-configurable**

Running at: **http://localhost:5173**

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📝 **Managing Data - NO CODING REQUIRED!**

### ⭐ Main Configuration File
```
/public/data/database.json
```

**This single JSON file controls EVERYTHING:**
- ✅ All tenants (organizations/clients)
- ✅ All threats and incidents  
- ✅ Map pins and geographic locations
- ✅ Analytics and KPIs
- ✅ AI-generated content
- ✅ Channel statistics
- ✅ Influencer data
- ✅ Everything shown on screen!

### How to Add/Edit Data

1. **Open** `/public/data/database.json`
2. **Edit** the JSON structure (add tenants, threats, etc.)
3. **Save** the file
4. **Refresh** browser - changes appear instantly!

### 📖 Complete Guide
See **[DATA_CONFIGURATION_GUIDE.md](./DATA_CONFIGURATION_GUIDE.md)** for detailed instructions on:
- Adding new tenants
- Creating threats/incidents
- Configuring map locations
- Setting up analytics
- Managing AI-generated content
- Complete field reference

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top nav with tenant switcher
│   ├── Dashboard.jsx       # Main dashboard with KPIs
│   ├── ThreatCard.jsx      # Individual threat cards
│   ├── TimeCounter.jsx     # Live countdown timer
│   └── ThreatModal.jsx     # Full threat details
├── store/
│   └── useStore.js         # State management
├── lib/
│   └── utils.js            # Helper functions
└── App.jsx                 # Main app
```

## 🚀 Features

**Dashboard:**
- 4 KPI cards (Critical Threats, Time Windows, Virality, AI Responses)
- Real-time threat cards
- Live countdown timers
- Virality progress bars

**Threat Cards:**
- Severity indicators
- Pre-viral status
- Response window countdown
- Velocity metrics
- AI arsenal ready count
- Red Team warnings

**Threat Modal (click any threat):**
- Videos Tab: AI-generated response videos
- Statements Tab: Platform-specific statements
- Red Team Tab: Risk analysis (respond vs. silence)
- Deployment Tab: Approval workflow

## 💾 Data

Everything in `/public/data/database.json`:
- Tenants (Israel, Netflix)
- Threats with full details
- AI Arsenal content
- Red Team assessments
- Distribution channels

## ✅ Partner Requirements Met

- Early detection (30-40% virality)
- Time emphasis (live countdowns)
- AI-generated arsenal
- Red Team backfire analysis
- Human approval workflow
- Clean, professional UI

## 🔧 Tech

- React + Vite
- Tailwind CSS v4
- Zustand (state)
- Lucide React (icons)
- Framer Motion ready

Built clean from scratch in `/vigilance-v2` directory.
