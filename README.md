<div align="center">

<img src="https://img.shields.io/badge/HappyCrops AI_AI-Digital_Crop_Expert-a6d700?style=for-the-badge&logo=leaf&logoColor=black" alt="HappyCrops AI" />

# 🌱 HappyCrops AI — Digital Crop Expert

**AI-powered crop disease diagnostics for smallholder farmers.**  
Snap a photo. Get an instant diagnosis. Protect your yield.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.1_Flash_Lite-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/rickytabe/happycropsAI/issues) · [Request Feature](https://github.com/rickytabe/happycropsAI/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Screens & Features](#-screens--features)
- [AI Integration](#-ai-integration)
- [Session & Data Management](#-session--data-management)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🌍 Overview

**HappyCrops AI** is a production-grade, offline-aware Progressive Web Application (PWA) built for smallholder farmers across Africa and beyond. It uses Google's Gemini Vision AI to analyze crop photos in real-time, identifying plant diseases, their causative agents, spread factors, and providing actionable treatment plans — all tailored to the farmer's specific country and region.

The platform is designed from the ground up to be:
- **Accessible** — works in low-connectivity environments with LocalStorage caching
- **Actionable** — provides region-specific treatment advice including locally available commercial products
- **Adaptive** — responsive across all devices including low-end Android phones
- **Backend-ready** — session and data management is purposely designed for easy backend/BaaS integration

> HappyCrops AI is currently in **frontend-only mode** with full LocalStorage persistence. Backend integration (Supabase/Firebase/custom API) is planned for the next phase.

---

## ✨ Key Features

### 🔬 AI-Powered Crop Diagnostics
- Real-time crop disease detection from photos via **Google Gemini Vision AI**
- Identifies the specific **plant type** (e.g., "your coffee plants", "your maize") — not generic "crops"
- Returns disease name, **causative agents** (fungi, bacteria, etc.), confidence score, and risk level
- Tailors treatment advice to the **farmer's country**, including locally available products (e.g., Ridomil Gold, Dithane M-45)

### 📊 Intelligence Dashboard
- Bento-grid diagnostic canvas with high-resolution image evidence view
- SVG confidence gauge ring with animated rendering
- Spread factor analysis with Material Icons
- Risk/impact cards with yield-loss projections

### 🗂 Diagnostic History
- Persistent scan log stored in LocalStorage (up to 20 latest scans)
- Full-featured list view with country flags, confidence scores, and status badges
- Delete individual records with confirmation prompt
- Export scan reports as formatted **Markdown files**

### 🗺 Country-Aware Context
- Dropdown selector for **250+ countries** with real flag images (via `flagcdn.com`)
- Country flags displayed consistently across all screens using a shared `<CountryFlag />` component — works perfectly on Windows where emoji flags are unsupported
- Treatment and preventive advice adapted to the selected region

### 🔊 Audio Guide
- Full text-to-speech audio walkthrough of any diagnostic result
- Section highlighting synced with speech playback
- One-tap toggle with visual feedback

### 💬 AI Agronomist Chat
- In-context chatbot powered by Gemini, seeded with the current diagnosis
- Answers farmer questions in simple, non-technical language
- Max 2–3 sentence responses to keep communication accessible

### 📱 Mobile-First Design
- Full-bleed hero image with multi-stop gradient fade on the diagnostic detail page
- Hamburger slide-in sidebar navigation (no bottom tab bar)
- Touch-optimized interaction targets and transitions
- Compact content layout for small screens

### 🔐 Session Persistence
- LocalStorage-based session management (no backend required for frontend testing)
- Session survives page reloads — no re-login required
- Designed as a clean swap-point for a real auth backend

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript 5.8 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 + custom design tokens |
| **Animation** | Motion (Framer Motion) |
| **Routing** | React Router DOM 7 |
| **AI** | Google Gemini `gemini-3.1-flash-lite-preview` (Vision + Chat) |
| **Icons** | Google Material Symbols |
| **Flags** | `flagcdn.com` image CDN |
| **Persistence** | LocalStorage (sessions, history, preferences) |
| **Deployment** | Vercel (SPA rewrites configured) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (SPA)                  │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Auth Layer  │  │   Dashboard  │  │  Public Pages │  │
│  │ (LocalStorage│  │   Layout +   │  │  (Landing)    │  │
│  │  session)   │  │   Routes     │  │               │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│  ┌──────────────────────┐  ┌───────────────────────┐   │
│  │   Services Layer     │  │   Component Library    │   │
│  │  ├ gemini.ts         │  │  ├ CountryFlag         │   │
│  │  │  ├ analyzeCrop()  │  │  ├ CountrySelector     │   │
│  │  │  └ chatAgro()     │  │  ├ DesktopDashboard    │   │
│  │  └ session.ts        │  │  ├ MobileDashboard     │   │
│  │    ├ saveSession()   │  │  ├ AgronomistChat      │   │
│  │    ├ getSession()    │  │  ├ ScanningLoader      │   │
│  │    └ clearSession()  │  │  └ CountrySelector     │   │
│  └──────────────────────┘  └───────────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │               LocalStorage                         │ │
│  │  HappyCrops AI_session | HappyCrops AI_history | preferences │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────┘
                               │ HTTPS
                    ┌──────────▼──────────┐
                    │  Google Gemini API  │
                    │  (Vision + Chat)    │
                    └─────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Google Gemini API key** ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rickytabe/happycropsAI.git
cd happycropsAI

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Then edit .env and add your GEMINI_API_KEY

# 4. Start the development server
npm run dev
```

The app will be available at:
- **Local:** `http://localhost:3000`
- **Network:** `http://<your-ip>:3000` (accessible from phones on the same WiFi)

### Available Scripts

```bash
npm run dev       # Start dev server (localhost:3000 + network)
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # TypeScript type checking
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> **Important:** The API key is used directly on the client via Vite's `define` config. For production, consider proxying requests through a backend to protect your key.

To get a Gemini API key:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create or select a Google Cloud project
3. **Link a billing account** to that project to avoid free-tier quota limits
4. Generate an API key and paste it into `.env`

---

## 📁 Project Structure

```
happycropsAI/
├── public/
├── src/
│   ├── components/
│   │   ├── AgronomistChat.tsx     # In-context Gemini chat UI
│   │   ├── CountryFlag.tsx        # Cross-platform flag images (flagcdn.com)
│   │   ├── CountrySelector.tsx    # Searchable country dropdown
│   │   ├── DesktopDashboard.tsx   # Full-width diagnostic result view
│   │   ├── History.tsx            # Scan history list component
│   │   ├── MobileDashboard.tsx    # Mobile-optimized diagnostic view
│   │   ├── MeshBackground.tsx     # Animated mesh gradient background
│   │   └── ScanningLoader.tsx     # Scan animation overlay
│   ├── layouts/
│   │   └── DashboardLayout.tsx    # App shell with sidebar + top bar
│   ├── lib/
│   │   ├── countries.ts           # 250+ countries with ISO codes & flags
│   │   └── utils.ts               # Tailwind utility helpers
│   ├── screens/
│   │   ├── ActivityScreen.tsx     # Timeline activity log
│   │   ├── AuthScreen.tsx         # Login/signup form
│   │   ├── DiagnosticsListScreen.tsx  # Full scan history list
│   │   ├── IntelligenceScreen.tsx     # Main scan + recent diagnostics
│   │   ├── PublicLanding.tsx          # Marketing landing page
│   │   ├── ResultsScreen.tsx          # Diagnostic detail view
│   │   └── SettingsScreen.tsx         # App settings
│   ├── services/
│   │   ├── gemini.ts              # Gemini AI (image analysis + chat)
│   │   └── session.ts             # LocalStorage auth session management
│   ├── App.tsx                    # Root app with routing
│   ├── main.tsx                   # React entry point
│   ├── types.ts                   # TypeScript type definitions
│   └── index.css                  # Global styles + design tokens
├── vercel.json                    # SPA rewrite rules for Vercel
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind design system
└── tsconfig.json
```

---

## 📱 Screens & Features

| Screen | Route | Description |
|---|---|---|
| **Landing** | `/` | Public marketing page |
| **Auth** | `/auth` | Login / Sign up (LocalStorage session) |
| **Intelligence** | `/dashboard` | Scan new crops + recent diagnostics |
| **Results** | `/dashboard/diagnostic/:id` | Full diagnostic detail (desktop + mobile view) |
| **Diagnostics Log** | `/dashboard/diagnostics` | Complete scan history |
| **Activity** | `/dashboard/activity` | Timeline log of all sessions |
| **Settings** | `/dashboard/settings` | App preferences |

---

## 🤖 AI Integration

### Image Analysis (`analyzeCropImage`)

Sends a base64 crop image to `gemini-3.1-flash-lite-preview` with a structured JSON schema response. The prompt enforces:

- **Security check** — rejects non-plant images (faces, animals, random objects)
- **Plant-specific language** — names the detected plant (e.g., "your coffee plants"), not just "your crops"
- **Causative agents** — briefly describes the pathogen (fungus, bacteria, etc.)
- **Country-aware treatment** — recommends locally available commercial products
- **Exactly 2 treatment steps** and **3 preventive measures** for digestible advice

### Chat (`chatWithAgronomist`)

Seeded with the current diagnosis context, the chat model:
- Responds in max 2–3 sentences
- Avoids scientific jargon
- Is empathetic to farmers in stressful situations

---

## 💾 Session & Data Management

All data is persisted in browser **LocalStorage** using structured keys:

| Key | Contents |
|---|---|
| `HappyCrops AI_session` | `{ id, name, email, createdAt, lastLoginAt }` |
| `HappyCrops AI_history` | Array of up to 20 `AnalysisResult` objects |
| `default_country` | User's preferred country selection |

### Backend Integration Path

The `src/services/session.ts` file is built specifically to be a **clean swap-point** for a real backend:

```typescript
// Current (LocalStorage)
export function saveSession(user) { localStorage.setItem(...) }

// Future (e.g., Supabase)
export async function saveSession(user) { await supabase.auth.signIn(...) }
```

No other files need to change when adding a backend.

---

## 🚢 Deployment

### Vercel (Recommended)

The project includes `vercel.json` with SPA routing configured:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Deploy steps:**

```bash
# Build
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and set the `GEMINI_API_KEY` environment variable in the Vercel project settings.

---

## 🗺 Roadmap

- [ ] **Backend Integration** — Supabase auth + PostgreSQL for real user accounts
- [ ] **Offline Mode** — Service Worker + IndexedDB for full offline support
- [ ] **Push Notifications** — Alert farmers when disease outbreak risk is high in their region
- [ ] **Multi-Image Batch Scan** — Analyze multiple leaf images in one session
- [ ] **Marketplace Integration** — Direct links to purchase recommended treatments locally
- [ ] **Farmer Community Feed** — Share anonymized scan data with nearby farmers
- [ ] **Native Mobile App** — React Native / Expo version for Android
- [ ] **Multi-language Support** — French, Swahili, Hausa, Amharic

---

## 🤝 Contributing

Contributions are welcome! To get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please follow conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`).

---

## 📄 License

This project is licensed under the **Apache 2.0 License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for African farmers.

**HappyCrops AI** — *Precision agriculture, simplified.*

</div>
