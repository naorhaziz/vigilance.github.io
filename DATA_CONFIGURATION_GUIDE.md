# Vigilance Data Configuration Guide

## Overview
All data displayed in Vigilance is configured through the JSON file located at:
```
/public/data/database.json
```

**No coding required!** Simply edit this JSON file to:
- Add/remove tenants
- Add/remove threats/incidents
- Update analytics
- Change map markers
- Modify all displayed data

---

## File Structure

```json
{
  "tenants": { ... },    // Organizations/clients using the system
  "threats": { ... }     // Threats organized by tenant
}
```

---

## 1. Adding/Editing Tenants

### Structure
```json
"tenants": {
  "tenant_id": {
    "id": "tenant_id",
    "name": "Display Name",
    "subtitle": "Organization Type",
    "type": "government|corporate",
    "logo": "🇮🇱",              // Emoji or single letter
    "primaryColor": "#0038b8",
    "secondaryColor": "#ffffff"
  }
}
```

### Example: Adding a New Tenant
```json
"coca_cola": {
  "id": "coca_cola",
  "name": "Coca-Cola",
  "subtitle": "Global Brand Protection",
  "type": "corporate",
  "logo": "C",
  "primaryColor": "#F40009",
  "secondaryColor": "#FFFFFF"
}
```

### What This Controls:
- Header dropdown (tenant switcher)
- Primary/secondary colors for the tenant's dashboard
- Logo displayed in the header
- Tenant name and subtitle

---

## 2. Adding/Editing Threats (Incidents)

### Structure
```json
"threats": {
  "tenant_id": [
    {
      "id": "unique_threat_id",
      "tenantId": "tenant_id",
      "title": "Brief threat title",
      "description": "Detailed description",
      "narrative": "False narrative being spread",
      "counterNarrative": "Correct information",
      "detectedAt": "2024-01-15T06:22:00Z",
      "status": "pre_viral|viral|contained",
      "severity": "critical|high|medium|low",
      "viralityProgress": 34,           // 0-100 percentage
      "viralityThreshold": 70,          // When it becomes viral
      "currentReach": 847000,
      "projectedReach": 12400000,
      "velocityPerHour": 8.5,           // Spread rate
      "timeToViralHours": 3.8,
      "responseWindowHours": 3.8,       // Time left to respond
      "effectivenessDecayPerHour": 23,  // How fast response effectiveness drops
      
      "channels": [...],                // See Channels section
      "geography": {...},               // See Geography section
      "languages": {...},               // See Languages section
      "keyInfluencers": [...],          // See Influencers section
      "sourceAnalysis": {...},          // See Source Analysis section
      "aiArsenal": {...}                // See AI Arsenal section
    }
  ]
}
```

### What This Controls:
- **Dashboard KPIs**: Critical threats count, avg virality, shortest window
- **Threat cards**: All threat information displayed
- **Map pins**: Locations shown on the world map
- **Analytics**: All charts and statistics
- **Time decay counter**: Countdown timers
- **Threat modal**: Detailed threat view

---

## 3. Channels Configuration

Shows which social media platforms the threat is spreading on.

```json
"channels": [
  {
    "name": "Twitter/X",
    "reach": 342000,        // Current reach on this platform
    "velocity": 12.3,       // Spread speed
    "sentiment": -78        // -100 to 100 (negative = hostile)
  },
  {
    "name": "TikTok",
    "reach": 289000,
    "velocity": 15.7,
    "sentiment": -82
  }
]
```

**Controls**: Channel breakdown in threat details, velocity indicators

---

## 4. Geography Configuration

Defines where the threat is spreading geographically.

```json
"geography": {
  "primary": "United States",         // Main country (creates map pin)
  "secondary": ["UK", "France"],      // Secondary locations (map pins)
  "tertiary": ["Canada", "Australia"] // Tertiary locations (map pins)
}
```

**Controls**: 
- **Map pins**: Each location creates a pin on the world map
- **Pin color**: 
  - Red = Critical severity
  - Orange = High severity
  - Yellow = Medium severity
  - Blue = Low severity
- **Pin size**: Based on reach (larger reach = larger pin)

### Supported Countries (for map pins):
United States, Canada, UK, United Kingdom, France, Germany, Israel, Middle East, China, India, Asia, Europe, Palestine, Gaza, West Bank, Russia, Ukraine, Japan, South Korea, Australia, Brazil, Mexico, Egypt, Saudi Arabia, UAE, Turkey, Iran, Pakistan, Afghanistan, Iraq, Syria, Lebanon, Jordan

*To add new countries, edit the `countryCoordinates` object in `/src/components/WorldMap.jsx`*

---

## 5. Languages Configuration

Shows which languages the threat is spreading in.

```json
"languages": {
  "primary": {"code": "en", "percentage": 65},
  "secondary": {"code": "ar", "percentage": 22},
  "tertiary": {"code": "fr", "percentage": 13}
}
```

**Language codes**: en (English), ar (Arabic), fr (French), es (Spanish), de (German), etc.

---

## 6. Key Influencers

Identifies influential accounts spreading the narrative.

```json
"keyInfluencers": [
  {
    "handle": "@MiddleEastWatch",
    "platform": "Twitter/X",
    "followers": 3200000,
    "stance": "hostile|critical|neutral|supportive",
    "impact": 96,              // 0-100 influence score
    "recentPosts": 7
  }
]
```

**Controls**: Influencers section in threat modal

---

## 7. Source Analysis

Breaks down the origin of the spread.

```json
"sourceAnalysis": {
  "organic": 42,      // Real people (percentage)
  "coordinated": 38,  // Organized campaign (percentage)
  "automated": 20     // Bots (percentage)
}
```

**Controls**: Source analysis pie chart in threat details

---

## 8. AI Arsenal

AI-generated counter-content and responses.

```json
"aiArsenal": {
  "videos": [
    {
      "id": "video_1",
      "title": "Video title",
      "description": "What the video shows",
      "platform": "YouTube",
      "duration": "0:45",
      "views": 0,
      "status": "ready|processing|deployed",
      "effectiveness": 89,     // 0-100 predicted effectiveness
      "targetAudience": "General Public",
      "keyMessages": [
        "First key point",
        "Second key point"
      ],
      "thumbnail": "/path/to/thumbnail.jpg"
    }
  ],
  "socialPosts": [
    {
      "id": "post_1",
      "platform": "Twitter/X",
      "content": "Post text...",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "targetInfluencers": ["@handle1", "@handle2"],
      "scheduledFor": "2024-01-15T10:00:00Z",
      "status": "scheduled|posted|performing"
    }
  ],
  "infographics": [
    {
      "id": "info_1",
      "title": "Infographic title",
      "description": "What it shows",
      "format": "vertical|horizontal|square",
      "status": "ready|processing",
      "languages": ["en", "ar"]
    }
  ]
}
```

**Controls**: AI Arsenal panel showing generated content

---

## Quick Examples

### Adding a New Threat

1. Open `/public/data/database.json`
2. Find the tenant's threat array (e.g., `"threats": { "israel": [...]`)
3. Add a new threat object:

```json
{
  "id": "threat_new_001",
  "tenantId": "israel",
  "title": "New Disinformation Campaign",
  "description": "Details about the threat",
  "narrative": "False claim being spread",
  "counterNarrative": "The truth",
  "detectedAt": "2024-01-20T10:00:00Z",
  "status": "pre_viral",
  "severity": "high",
  "viralityProgress": 25,
  "viralityThreshold": 70,
  "currentReach": 120000,
  "projectedReach": 5000000,
  "velocityPerHour": 6.2,
  "timeToViralHours": 5.5,
  "responseWindowHours": 5.5,
  "effectivenessDecayPerHour": 18,
  "channels": [
    {
      "name": "Twitter/X",
      "reach": 80000,
      "velocity": 8.5,
      "sentiment": -65
    }
  ],
  "geography": {
    "primary": "United States",
    "secondary": ["UK"],
    "tertiary": ["Canada"]
  },
  "languages": {
    "primary": {"code": "en", "percentage": 100}
  },
  "keyInfluencers": [],
  "sourceAnalysis": {
    "organic": 50,
    "coordinated": 30,
    "automated": 20
  },
  "aiArsenal": {
    "videos": [],
    "socialPosts": [],
    "infographics": []
  }
}
```

4. Save the file
5. Refresh the browser - the new threat appears automatically!

---

## Field Reference

### Status Values
- `pre_viral`: Detected early, not viral yet
- `viral`: Has exceeded viral threshold
- `contained`: Successfully mitigated

### Severity Values
- `critical`: Red indicators, highest priority
- `high`: Orange indicators
- `medium`: Yellow indicators
- `low`: Blue indicators

### Date Format
Always use ISO 8601: `"2024-01-15T06:22:00Z"`

### Numbers
- Reach: Use actual numbers (e.g., 847000)
- Percentages: 0-100 (e.g., 34 for 34%)
- Velocity: Decimal number (e.g., 8.5)
- Hours: Decimal number (e.g., 3.8)

---

## Tips

1. **IDs must be unique**: Each threat needs a unique `id`
2. **Match tenantId**: Threat's `tenantId` must match a tenant's `id`
3. **Geography names**: Must match countries in the coordinates list for map pins
4. **JSON validation**: Use a JSON validator to check syntax before saving
5. **Live reload**: Changes appear immediately when you refresh the browser

---

## Common Tasks

### Change Dashboard Numbers
Edit threat fields:
- `viralityProgress` → Changes avg virality
- `responseWindowHours` → Changes shortest window
- `severity: "critical"` → Affects critical threats count

### Change Map Pins
Edit `geography` fields in any threat:
- `primary`, `secondary`, `tertiary` → Create pins on map
- `severity` → Changes pin color
- `currentReach` → Changes pin size

### Add New Tenant
1. Add entry to `"tenants"` object
2. Add matching key in `"threats"` object with empty array
3. Refresh browser

### Remove Threat
1. Find threat by `id` in the array
2. Delete the entire threat object
3. Remove trailing comma if it was the last item
4. Save and refresh

---

## Support

For questions about the JSON structure, refer to the existing threats in `database.json` as examples.

All dashboard elements, analytics, maps, and threat cards automatically update when you change the JSON file!
