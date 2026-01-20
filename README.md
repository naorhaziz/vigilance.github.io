# Vigilance

Narrative Security Platform - Landing Page

## Overview

Vigilance treats misinformation as a cybersecurity threat. This is the "Book a Demo" landing page showcasing our Narrative Security Platform with real-time visualizations and legal case studies.

## Features

- **3D Hero Section**: Interactive tilt card with parallax depth layers
- **Force-Directed Graph**: Real-time narrative flow visualization
- **Interactive Demos**: Legal scenarios (Hood v. OpenAI, Moffatt v. Air Canada)
- **Scroll-Based Timeline**: Animated breach sequence
- **Smart Booking Form**: Corporate email validation with multi-step feedback

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: Framer Motion (physics-based interactions)
- **Icons**: Lucide React
- **Visualization**: react-force-graph-2d

## Design System

### Color Palette

- **Base**: `#1F2A38` (Ebony Clay) - Global background
- **Surface**: `#2D364C` (Light Clay) - Cards/Modals
- **Primary**: `#00D891` (Caribbean Green) - Success/Safe states
- **Secondary**: `#97F7E2` (Ice Cold) - Accents/Links
- **Danger**: `#FF4D4D` (Cherry Fizz) - Threats/Hallucinations

### Typography

- **UI Text**: Inter
- **Data/Metrics**: Geist Mono

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Font Setup (Optional)

Download Geist Mono from https://vercel.com/font and place `GeistMonoVF.woff` in `app/fonts/`

## Project Structure

```
vigilance/
├── app/
│   ├── fonts/          # Custom fonts
│   ├── globals.css     # Tailwind + custom utilities
│   ├── layout.tsx      # Root layout with metadata
│   └── page.tsx        # Main landing page
├── components/
│   ├── Hero.tsx        # 3D tilt card hero section
│   ├── NarrativeGraph.tsx  # Force-directed graph
│   ├── Timeline.tsx    # Scroll-animated timeline
│   ├── DemoTabs.tsx    # Legal scenario demos
│   └── BookingForm.tsx # Demo booking form
└── tailwind.config.ts  # Design system tokens
```

## Key Components

### Hero (`components/Hero.tsx`)
- Mouse-responsive 3D tilt effect using Framer Motion
- Parallax depth layers (base, content, particles)
- Spring physics (stiffness: 150, damping: 15)

### Narrative Graph (`components/NarrativeGraph.tsx`)
- 50-node force-directed graph
- Interactive threat/protection states
- Canvas-based rendering for performance
- Particle speed increases to 400% during breach simulation

### Demo Tabs (`components/DemoTabs.tsx`)
- Hood v. OpenAI: Defamation scenario with source verification
- Moffatt v. Air Canada: Policy guardrail demonstration
- Animated scanning overlay with progress bars
- Morphing tab indicators using `layoutId`

### Timeline (`components/Timeline.tsx`)
- SVG path animation driven by scroll position
- Color gradient from danger (red) to safe (green)
- Responsive opacity based on scroll progress

### Booking Form (`components/BookingForm.tsx`)
- Corporate email validation (rejects generic domains)
- Shake animation on validation error
- Multi-step submission: Verifying → Allocating → Success
- Graph reaction on URL field focus

## Performance Optimizations

- Server-side rendering for static content
- Client components isolated with `"use client"`
- Dynamic import for graph visualization (`ssr: false`)
- Motion values to prevent React re-renders
- Canvas rendering for graph (60 FPS target)

## Aesthetic Philosophy

"Soft Tech" design inspired by data observability platforms:
- Deep glass effects with backdrop blur
- Subtle gradient borders
- Physics-based organic motion
- Calm, trusted color palette (no aggressive hacker aesthetic)

## Legal Context

The demos reference real legal cases:
- **Hood v. OpenAI (2023)**: ChatGPT hallucination about Brian Hood
- **Moffatt v. Air Canada (2024)**: Chatbot liability ruling

All factual claims are documented and accurate.

## License

Proprietary - All rights reserved

## Contact

For demo requests or inquiries: [contact information]

---

Built with precision for the AI Era 🛡️
