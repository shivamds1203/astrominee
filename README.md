# 🌌 Astrominee — Vedic Astrology Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Framer_Motion-10-ff0055?style=for-the-badge&logo=framer" />
  <img src="https://img.shields.io/badge/Firebase-9-orange?style=for-the-badge&logo=firebase" />
</div>

<br />

> **A premium, full-stack Vedic Astrology web application** — generating precise sidereal birth charts, detailed planetary predictions, and AI-powered cosmic insights. Built with a stunning cosmic UI, smooth animations, and a comprehensive interpretation engine.

---

## ✨ Features

### 🪐 Chart Generation
- **North Indian Chart** — Premium dark cosmic design with glowing gold SVG grid lines and realistic 3D planet orbs
- **South Indian Chart** — Matching premium aesthetic with 4×4 sign grid, Lagna highlight, and hover tooltips
- Supports **D1 to D60 Divisional Charts** (Varga Charts)
- Lahiri (Chitrapaksha) Ayanamsa precision

### 🔮 Detailed Predictions Engine
- **Planet in House** — How each planet shapes a specific life area (108 combinations)
- **House Lord Placements** — Effect of each house's ruling planet placed in another house (144 combinations)
- **Planet in Nakshatra** — Nakshatra-level interpretations for all 9 planets across 27 Nakshatras (486 interpretations)

### 📊 Planetary Data Table
- Exact sidereal longitude (degrees, minutes, seconds)
- Rashi (Sign) with symbol
- Nakshatra and Pada
- House number
- Retrograde indicator

### 📄 PDF Report Generation
- 6-page beautifully designed PDF report (A4)
- Page 1: Cosmic Cover with birth details
- Page 2: Planetary Positions & Nakshatras table
- Page 3: AI Cosmic Insights + Vimshottari Dasha bar
- Page 4: Planet in House Predictions
- Page 5: House Lord Placement Predictions
- Page 6: Planet in Nakshatra Predictions

### 🌟 AI Cosmic Insights
- Personality & Soul Blueprint
- Career & Material Success
- Relationships & Partnership
- Health & Vitality
- Dharma & Spiritual Path
- Upcoming Planetary Periods

### 🎨 UI/UX
- Dark cosmic aesthetic with glassmorphism
- Smooth Framer Motion entrance animations
- Premium interactive Calendar & Clock time pickers
- Real NASA/Wikimedia planet photo orbs with glow rings
- Fully responsive design (mobile + desktop)
- Animated ZodiacWheel on the home page

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Auth & DB | Firebase (Auth + Firestore) |
| Geocoding | OpenStreetMap Nominatim API |
| Astrology Engine | Custom Vedic math (Lahiri Ayanamsa) |
| PDF Generation | Browser-native Print API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (for auth & profile saving)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/astrominee.git
cd astrominee

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Firebase credentials in .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit `.env.local` to GitHub.** It is already added to `.gitignore`.

---

## 📁 Project Structure

```
astrominee/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── form/               # Birth details form
│   │   ├── dashboard/          # Main chart & predictions dashboard
│   │   ├── nakshatras/         # Nakshatra explorer
│   │   ├── predictions/        # AI Predictions page
│   │   └── about/              # About page
│   ├── components/
│   │   ├── charts/             # NorthIndianChart, SouthIndianChart
│   │   ├── dashboard/          # PredictionsSection, DashboardHeader
│   │   ├── forms/              # BirthDetailsForm
│   │   └── ui/                 # PremiumCalendar, PremiumClock, ZodiacWheel
│   ├── lib/
│   │   ├── astrologyMath.ts    # Vedic calculations (Nakshatra, degrees)
│   │   ├── astrologyInterpretations.ts  # 738+ interpretations database
│   │   ├── generatePDF.ts      # 6-page PDF generator
│   │   └── firebase.ts         # Firebase configuration
│   └── context/
│       └── AuthContext.tsx     # Firebase Auth context
├── public/                     # Static assets
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🌐 Pages

| Route | Description |
|---|---|
| `/` | Home — Hero + ZodiacWheel + Creator card |
| `/form` | Birth details input form |
| `/dashboard` | Full chart dashboard with predictions |
| `/nakshatras` | Nakshatra information explorer |
| `/predictions` | AI Predictions overview |
| `/about` | About the platform |

---

## 👨‍💻 Author

**Shivam Suryawanshi**

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_._.shivam.__/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shivamsuryawanshi7682@gmail.com)

---

## 📜 License

This project is personal and proprietary. All rights reserved © 2025 Shivam Suryawanshi.

---

<div align="center">
  <p>Built with ❤️ and cosmic precision by <strong>Shivam Suryawanshi</strong></p>
  <p>ॐ</p>
</div>
