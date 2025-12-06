# Vigilance AI - Early Warning System

✅ **Clean, modern React application built from scratch**

Running at: **http://localhost:5173**

## 🎯 What This Is

A brand-new, clean implementation of the Early Warning System with:
- Modern React with proper component structure
- Tailwind CSS v4 for styling
- All data from JSON (no hardcoded values)
- Smooth, responsive UI
- Addresses all partner feedback requirements

## 📁 Structure

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
