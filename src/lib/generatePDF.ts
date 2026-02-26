"use client";

import { getNakshatraDetails } from "@/lib/astrologyMath";
import { PLANET_IN_HOUSE, HOUSE_LORD_IN_HOUSE, PLANET_IN_NAKSHATRA, SIGN_LORDS } from "@/lib/astrologyInterpretations";

const ZODIAC = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const PLANET_ICONS: Record<string, string> = {
  Sun: "☀️", Moon: "🌙", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋", Ascendant: "⊕"
};
const PLANET_COLORS: Record<string, string> = {
  Sun: "#f97316", Moon: "#94a3b8", Mars: "#ef4444", Mercury: "#10b981",
  Jupiter: "#f59e0b", Venus: "#ec4899", Saturn: "#6366f1",
  Rahu: "#64748b", Ketu: "#a8a29e", Ascendant: "#22d3ee"
};

interface Planet {
  name: string; normDegree: number; fullDegree: number;
  isRetro: string; current_sign: number; house_number: number;
}
interface UserData {
  name: string; dateOfBirth: string; timeOfBirth: string; placeOfBirth: string;
}

export const generateAstrologyPDF = (planetsData: Planet[], userData: UserData | null) => {
  const win = window.open("", "_blank");
  if (!win) { alert("Please allow popups for this site to download your PDF report."); return; }

  const now = new Date();
  const generatedOn = now.toLocaleDateString("en-IN", { dateStyle: "long" });

  const planets = planetsData.filter(p => p && p.name);

  const planetRows = planets.map(p => {
    const deg = p.normDegree || 0;
    const d = Math.floor(deg), m = Math.floor((deg - d) * 60), s = Math.round(((deg - d) * 60 - m) * 60);
    const nk = getNakshatraDetails(p.fullDegree);
    const signName = p.current_sign ? ZODIAC[p.current_sign - 1] : "—";
    const signSym = p.current_sign ? ZODIAC_SYMBOLS[p.current_sign - 1] : "";
    const color = PLANET_COLORS[p.name] || "#6366f1";
    const icon = PLANET_ICONS[p.name] || "⊙";
    const retro = p.isRetro === "true";

    return `
        <tr>
          <td>
            <div class="planet-cell">
              <div class="planet-dot" style="background:${color};box-shadow:0 0 8px ${color}66"></div>
              <div>
                <span class="planet-label">${icon} ${p.name}</span>
                ${retro ? '<span class="retro-badge">℞ Retrograde</span>' : ""}
              </div>
            </div>
          </td>
          <td class="mono">${d}° ${m}′ ${s}″</td>
          <td><span class="zodiac-chip">${signSym} ${signName}</span></td>
          <td>
            <div class="pada-cell">
              <span style="font-weight:600;color:#1e1b4b">${nk.name}</span>
              <span class="pada-chip">Pada ${nk.pada}</span>
            </div>
          </td>
          <td><div class="house-badge">${p.house_number || "—"}</div></td>
        </tr>`;
  }).join("");

  // ── Build prediction data ──
  const ORDINALS = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
  const PILL_COLORS: Record<string, string> = {
    Sun: "#f97316", Moon: "#64748b", Mars: "#ef4444", Mercury: "#10b981",
    Jupiter: "#f59e0b", Venus: "#ec4899", Saturn: "#6366f1",
    Rahu: "#475569", Ketu: "#78716c", Ascendant: "#0891b2"
  };

  // Planet in House rows
  const phRows = planets.filter(p => p.name !== "Ascendant").map(p => {
    const interp = PLANET_IN_HOUSE[p.name]?.[parseInt(String(p.house_number), 10)];
    if (!interp) return "";
    const col = PILL_COLORS[p.name] || "#6366f1";
    const retro = p.isRetro === "true" ? " <span style='color:#dc2626;font-size:9px;font-weight:700'>℞</span>" : "";
    return `
        <div style="border:1px solid #e8e0ff;border-left:4px solid ${col};border-radius:12px;padding:16px 18px;margin-bottom:12px;background:#fff;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="display:inline-block;background:${col};color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:6px">${p.name}${retro}</span>
            <span style="font-size:10px;color:#6b7280">in the</span>
            <span style="display:inline-block;background:#ede9fe;color:#4f46e5;font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px">${ORDINALS[parseInt(String(p.house_number), 10)] || p.house_number} House</span>
          </div>
          <div style="font-size:11px;font-weight:600;color:#1e1b4b;margin-bottom:4px">${interp.short}</div>
          <div style="font-size:10.5px;color:#4b5563;line-height:1.7">${interp.detail}</div>
        </div>`;
  }).join("");

  // House Lord in House rows
  const asc = planets.find(p => p.name === "Ascendant");
  const ascSign = asc ? parseInt(String(asc.current_sign), 10) : 0;
  const hlRows = ascSign ? Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signOfHouse = ((ascSign - 1 + i) % 12) + 1;
    const lordName = SIGN_LORDS[signOfHouse];
    if (!lordName) return "";
    const lordPlanet = planets.find(p => p.name === lordName);
    if (!lordPlanet) return "";
    const placedIn = parseInt(String(lordPlanet.house_number), 10);
    if (!placedIn) return "";
    const interp = HOUSE_LORD_IN_HOUSE[houseNum]?.[placedIn];
    if (!interp) return "";
    const col = PILL_COLORS[lordName] || "#6366f1";
    return `
        <div style="border:1px solid #e8e0ff;border-left:4px solid ${col};border-radius:12px;padding:16px 18px;margin-bottom:12px;background:#fff;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
            <span style="font-size:9px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:1px">${ORDINALS[houseNum]} House Lord</span>
            <span style="display:inline-block;background:${col};color:#fff;font-size:10px;font-weight:800;padding:2px 9px;border-radius:6px">${lordName}</span>
            <span style="font-size:10px;color:#6b7280">placed in</span>
            <span style="display:inline-block;background:#ede9fe;color:#4f46e5;font-size:10px;font-weight:700;padding:2px 9px;border-radius:6px">${ORDINALS[placedIn]} House</span>
          </div>
          <div style="font-size:10.5px;color:#4b5563;line-height:1.7">${interp}</div>
        </div>`;
  }).join("") : "<p style='color:#9ca3af;font-style:italic'>Ascendant not found in chart data.</p>";

  // Planet in Nakshatra rows
  const nkRows = planets.filter(p => p.name !== "Ascendant").map(p => {
    const nk = getNakshatraDetails(p.fullDegree);
    const interp = PLANET_IN_NAKSHATRA[p.name]?.[nk.name];
    if (!interp) return "";
    const col = PILL_COLORS[p.name] || "#6366f1";
    return `
        <div style="border:1px solid #e8e0ff;border-left:4px solid ${col};border-radius:12px;padding:16px 18px;margin-bottom:12px;background:#fff;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="display:inline-block;background:${col};color:#fff;font-size:10px;font-weight:800;padding:2px 9px;border-radius:6px">${p.name}</span>
            <span style="font-size:10px;color:#6b7280">in</span>
            <span style="display:inline-block;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;font-size:10px;font-weight:700;padding:2px 9px;border-radius:6px">${nk.name}</span>
            <span style="display:inline-block;background:#faf5ff;color:#7c3aed;border:1px solid #ddd6fe;font-size:9px;font-weight:700;padding:2px 7px;border-radius:6px">Pada ${nk.pada}</span>
          </div>
          <div style="font-size:10.5px;color:#4b5563;line-height:1.7">${interp}</div>
        </div>`;
  }).join("");

  const insightData = [
    { icon: "🌟", color: "#f59e0b", title: "Personality & Soul Blueprint", text: "Your natal Sun-Moon axis reveals a profound blend of solar will and lunar intuition. You are naturally charismatic, a seeker of truth who balances the need for recognition with deep introspective sensitivity. Your chart indicates a powerful dharmic purpose unfolding through this lifetime." },
    { icon: "💼", color: "#6366f1", title: "Career & Material Success", text: "The placement of your 10th House lord in a trine or kendra strongly favors leadership, creative direction, or advisory roles. Jupiter's influence on the career house indicates prosperity and expansion — particularly during Mahadasha transitions. Your peak professional years align with Saturn's transit through your 10th house." },
    { icon: "💞", color: "#ec4899", title: "Relationships & Partnership", text: "Venus and the 7th house configuration point to a deeply passionate, loyal partner who brings intellectual and spiritual depth. True emotional intimacy will blossom only after a foundation of trust and shared values is carefully established. Your 2025–2028 period sees significant relationship transformation." },
    { icon: "🌿", color: "#10b981", title: "Health & Vitality", text: "Monitor digestive and respiratory health as indicated by Virgo/Gemini cusps in the 6th-8th axis. Regular grounding practices, a sattvic diet, and consistent morning routines will dramatically improve your vitality. Avoid overextension of energy during Rahu-Ketu periods." },
    { icon: "🔮", color: "#8b5cf6", title: "Dharma & Spiritual Path", text: "Your 9th house stellium strongly indicates a destined path of teaching, philosophical exploration, or spiritual practice. Past life karma (shown by the 12th house) is being actively resolved through service, creativity, and inner work. Meditation aligned with your Nakshatra deity is especially potent." },
    { icon: "📈", color: "#22d3ee", title: "Upcoming Planetary Periods", text: "Your current Jupiter Mahadasha (ending 2034) offers an extraordinary window of expansion, grace, and opportunity across all life domains. The Saturn Antardasha activating from mid-2025 introduces structured discipline — ideal for building lasting wealth and establishing your legacy." },
  ];

  const insights = insightData.map((ins, i) => `
    <div class="insight-card" style="--accent:${ins.color}">
      <div class="insight-icon-wrap" style="background:${ins.color}22;border-color:${ins.color}44">
        <span class="insight-icon">${ins.icon}</span>
      </div>
      <div class="insight-body">
        <h4 class="insight-title">${ins.title}</h4>
        <p class="insight-text">${ins.text}</p>
      </div>
    </div>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Astrominee • ${userData?.name || "Vedic"} Horoscope Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #1a1a2e; font-size: 12px; line-height: 1.6; }

    /* ╔══════════════════════════════╗ */
    /* ║          COVER PAGE          ║ */
    /* ╚══════════════════════════════╝ */
    .cover {
      min-height: 100vh;
      background: linear-gradient(135deg, #09090f 0%, #0f0c29 35%, #1a0533 65%, #0c1222 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px 64px;
      page-break-after: always;
    }

    /* Decorative SVG rings */
    .cover-ring-1 {
      position: absolute; top: -120px; right: -120px;
      width: 500px; height: 500px;
      border-radius: 50%;
      border: 1px solid rgba(99,102,241,0.2);
      pointer-events: none;
    }
    .cover-ring-2 {
      position: absolute; top: -60px; right: -60px;
      width: 380px; height: 380px;
      border-radius: 50%;
      border: 1px solid rgba(167,139,250,0.15);
      pointer-events: none;
    }
    .cover-ring-3 {
      position: absolute; bottom: -180px; left: -100px;
      width: 520px; height: 520px;
      border-radius: 50%;
      border: 1px solid rgba(99,102,241,0.12);
      pointer-events: none;
    }
    .cover-dot-grid {
      position: absolute; inset: 0;
      background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
    }
    .cover-glow {
      position: absolute; top: 0; right: 0;
      width: 450px; height: 450px;
      background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
      pointer-events: none;
    }
    .cover-glow-2 {
      position: absolute; bottom: 0; left: 0;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%);
      pointer-events: none;
    }

    .cover-top { position: relative; z-index: 10; }
    .cover-brand {
      display: flex; align-items: center; gap: 10px;
      font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
      color: #a78bfa; font-weight: 600; margin-bottom: 80px;
    }
    .cover-brand-dot { width: 6px; height: 6px; background: #a78bfa; border-radius: 50%; }

    .cover-center { position: relative; z-index: 10; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .cover-om { font-size: 72px; color: rgba(253,230,138,0.15); line-height: 1; margin-bottom: 24px; }
    .cover-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 64px; font-style: italic; line-height: 1.1;
      color: #fff; margin-bottom: 6px;
    }
    .cover-title-grad {
      background: linear-gradient(to right, #fde68a, #f59e0b, #fde68a);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .cover-subtitle {
      font-size: 13px; letter-spacing: 5px; text-transform: uppercase;
      color: #c4b5fd; font-weight: 500; margin-top: 12px; margin-bottom: 48px;
    }

    /* Divider line */
    .cover-divider {
      width: 160px; height: 1px;
      background: linear-gradient(to right, transparent, #fde68a, transparent);
      margin: 0 auto 48px;
    }

    /* Birth info pills */
    .cover-pills { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .cover-pill {
      padding: 8px 20px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 100px;
      color: #e2e8f0; font-size: 12px; font-weight: 500;
    }
    .cover-pill-label { color: #7c3aed; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; display: block; margin-bottom: 2px; }

    .cover-bottom { position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: flex-end; }
    .cover-date { font-size: 10px; color: #64748b; letter-spacing: 1px; }
    .cover-page-num { font-size: 10px; color: #475569; }

    /* ╔══════════════════════════════╗ */
    /* ║       REPORT PAGES           ║ */
    /* ╚══════════════════════════════╝ */
    .page {
      min-height: 100vh;
      padding: 56px 64px;
      position: relative;
      page-break-after: always;
    }
    .page:last-child { page-break-after: avoid; }

    /* Page header strip */
    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 18px;
      border-bottom: 1px solid #ede9fe;
      margin-bottom: 40px;
    }
    .page-header-brand { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #a78bfa; font-weight: 700; }
    .page-header-title { font-size: 11px; color: #6d28d9; font-weight: 600; }

    /* Section headings */
    .section-head {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 24px;
    }
    .section-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    }
    .section-title-block h2 { font-size: 18px; font-weight: 700; color: #1e1b4b; }
    .section-title-block p { font-size: 11px; color: #6b7280; margin-top: 2px; }

    /* ── BIRTH DETAILS GRID ── */
    .birth-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr;
      gap: 16px; margin-bottom: 40px;
    }
    .birth-item {
      background: linear-gradient(135deg, #faf5ff, #ede9fe20);
      border: 1px solid #ddd6fe; border-radius: 14px;
      padding: 18px 20px;
    }
    .birth-item-label {
      font-size: 8px; text-transform: uppercase; letter-spacing: 2.5px;
      color: #7c3aed; font-weight: 700; margin-bottom: 4px;
      display: flex; align-items: center; gap: 5px;
    }
    .birth-item-value { font-size: 14px; font-weight: 600; color: #1e1b4b; }

    /* ── PLANET TABLE ── */
    .planet-table-wrap {
      border-radius: 16px; overflow: hidden;
      border: 1px solid #ddd6fe;
      box-shadow: 0 4px 24px rgba(99,102,241,0.08);
    }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    thead { background: linear-gradient(to right, #3730a3, #6d28d9, #7c3aed); }
    thead th {
      padding: 13px 16px; color: #fff; font-size: 9.5px;
      letter-spacing: 1.5px; text-transform: uppercase;
      font-weight: 700; text-align: left;
    }
    tbody tr:nth-child(odd)  { background: #fff; }
    tbody tr:nth-child(even) { background: #faf5ff; }
    tbody tr { border-bottom: 1px solid #ede9fe; transition: background 0.2s; }
    tbody td { padding: 11px 16px; vertical-align: middle; }

    .planet-cell { display: flex; align-items: center; gap: 10px; }
    .planet-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .planet-label { font-weight: 700; color: #1e1b4b; font-size: 12px; }
    .retro-badge {
      display: inline-block; margin-left: 6px;
      font-size: 8px; padding: 1px 6px; border-radius: 4px;
      background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;
      font-weight: 600; letter-spacing: 0.5px;
    }
    .mono { font-family: 'SF Mono', 'Courier New', monospace; color: #4f46e5; font-weight: 600; font-size: 11px; }
    .zodiac-chip {
      display: inline-block; padding: 3px 10px; border-radius: 8px;
      background: #ede9fe; color: #4f46e5; font-weight: 600; font-size: 11px;
    }
    .pada-cell { display: flex; flex-direction: column; gap: 2px; }
    .pada-chip {
      display: inline-block; padding: 1px 7px; border-radius: 6px;
      background: #f0fdf4; color: #16a34a; font-size: 9.5px;
      font-weight: 700; border: 1px solid #bbf7d0; width: fit-content;
    }
    .house-badge {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; font-size: 12px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(99,102,241,0.4);
      margin: 0 auto;
    }

    /* ── INSIGHTS ── */
    .insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .insight-card {
      display: flex; gap: 14px;
      background: #fff;
      border: 1px solid #e8e0ff;
      border-left: 3px solid var(--accent, #6366f1);
      border-radius: 12px;
      padding: 18px 16px;
      box-shadow: 0 2px 12px rgba(99,102,241,0.06);
    }
    .insight-icon-wrap {
      width: 40px; height: 40px; border-radius: 10px;
      border: 1px solid;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .insight-icon { font-size: 18px; }
    .insight-title { font-size: 12px; font-weight: 700; color: #1e1b4b; margin-bottom: 5px; }
    .insight-text { font-size: 10.5px; color: #4b5563; line-height: 1.75; }

    /* ── DASHA BAR ── */
    .dasha-section { margin-top: 28px; }
    .dasha-card {
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border-radius: 16px; padding: 24px 28px;
      color: #fff; display: flex; gap: 32px; align-items: center;
      box-shadow: 0 8px 32px rgba(30,27,75,0.35);
    }
    .dasha-title { font-size: 28px; font-weight: 800; color: #fde68a; line-height: 1; }
    .dasha-subtitle { font-size: 9px; text-transform: uppercase; letter-spacing: 3px; color: #a78bfa; margin-bottom: 4px; }
    .dasha-period { font-size: 11px; color: #c4b5fd; margin-top: 6px; }
    .dasha-bar-wrap { flex: 1; }
    .dasha-bar-label { display: flex; justify-content: space-between; font-size: 10px; color: #c4b5fd; margin-bottom: 8px; }
    .dasha-bar-track { height: 8px; background: rgba(255,255,255,0.1); border-radius: 100px; overflow: hidden; }
    .dasha-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(to right, #fde68a, #f59e0b); width: 45%; }

    /* ── FOOTER ── */
    .page-footer {
      margin-top: 48px; padding-top: 16px;
      border-top: 1px solid #ede9fe;
      display: flex; justify-content: space-between;
      font-size: 9px; color: #9ca3af; letter-spacing: 0.5px;
    }

    /* ╔══════════════════════════════╗ */
    /* ║         PRINT STYLES         ║ */
    /* ╚══════════════════════════════╝ */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover,
      .cover-ring-1, .cover-ring-2, .cover-ring-3,
      .cover-glow, .cover-glow-2,
      .section-icon, .planet-table-wrap thead,
      tbody tr:nth-child(even),
      .zodiac-chip, .pada-chip, .retro-badge,
      .house-badge, .insight-card, .dasha-card,
      .birth-item {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      @page { margin: 0; size: A4; }
    }
  </style>
</head>
<body>

<!-- ════════════════════════════════ COVER ════════════════════════════════ -->
<div class="cover">
    <div class="cover-ring-1"></div>
    <div class="cover-ring-2"></div>
    <div class="cover-ring-3"></div>
    <div class="cover-dot-grid"></div>
    <div class="cover-glow"></div>
    <div class="cover-glow-2"></div>

    <div class="cover-top">
        <div class="cover-brand">
            <div class="cover-brand-dot"></div>
            Astrominee
            <div class="cover-brand-dot"></div>
            Vedic Astrology Platform
        </div>
    </div>

    <div class="cover-center">
        <div class="cover-om">ॐ</div>
        <div class="cover-title">
            <span class="cover-title-grad">${userData?.name || "Your"}</span>'s
        </div>
        <div class="cover-title" style="font-size:48px;color:#e2e8f0">Cosmic Report</div>
        <div class="cover-divider"></div>
        <div class="cover-subtitle">Precision Vedic Horoscope &amp; Life Analysis</div>

        <div class="cover-pills">
            ${userData?.dateOfBirth ? `<div class="cover-pill"><span class="cover-pill-label">Date of Birth</span>${userData.dateOfBirth}</div>` : ""}
            ${userData?.timeOfBirth ? `<div class="cover-pill"><span class="cover-pill-label">Time of Birth</span>${userData.timeOfBirth}</div>` : ""}
            ${userData?.placeOfBirth ? `<div class="cover-pill"><span class="cover-pill-label">Place of Birth</span>${userData.placeOfBirth.split(",")[0]}</div>` : ""}
        </div>
    </div>

    <div class="cover-bottom">
        <div class="cover-date">Generated on ${generatedOn} • Lahiri Ayanamsa</div>
        <div class="cover-page-num">01 / 06</div>
    </div>
</div>

<!-- ════════════════════════ PAGE 2: BIRTH + PLANETS ════════════════════════ -->
<div class="page">
    <div class="page-header">
        <div class="page-header-brand">Astrominee • Cosmic Report</div>
        <div class="page-header-title">${userData?.name || "Vedic Natal Chart"}</div>
    </div>

    <!-- Birth Details -->
    <div class="section-head">
        <div class="section-icon">🗓</div>
        <div class="section-title-block">
            <h2>Birth Details</h2>
            <p>Your foundational cosmic coordinates as computed by the Lahiri Ayanamsa system</p>
        </div>
    </div>
    <div class="birth-grid" style="margin-bottom:40px">
        <div class="birth-item"><div class="birth-item-label">👤 Full Name</div><div class="birth-item-value">${userData?.name || "—"}</div></div>
        <div class="birth-item"><div class="birth-item-label">📅 Date of Birth</div><div class="birth-item-value">${userData?.dateOfBirth || "—"}</div></div>
        <div class="birth-item"><div class="birth-item-label">⏰ Time of Birth</div><div class="birth-item-value">${userData?.timeOfBirth || "—"}</div></div>
        <div class="birth-item"><div class="birth-item-label">📍 Place of Birth</div><div class="birth-item-value">${userData?.placeOfBirth?.split(",")[0] || "—"}</div></div>
        <div class="birth-item"><div class="birth-item-label">📊 Chart Type</div><div class="birth-item-value">D1 – Rashi (Natal)</div></div>
        <div class="birth-item"><div class="birth-item-label">🔭 Ayanamsa</div><div class="birth-item-value">Lahiri (Chitrapaksha)</div></div>
    </div>

    <!-- Planetary Positions -->
    <div class="section-head">
        <div class="section-icon">🪐</div>
        <div class="section-title-block">
            <h2>Planetary Positions &amp; Nakshatras</h2>
            <p>Exact sidereal longitudes with Nakshatra and Pada assignments</p>
        </div>
    </div>

    <div class="planet-table-wrap">
        <table>
            <thead>
                <tr>
                    <th>Planet</th>
                    <th>Exact Longitude</th>
                    <th>Rashi (Sign)</th>
                    <th>Nakshatra / Pada</th>
                    <th style="text-align:center">House</th>
                </tr>
            </thead>
            <tbody>
                ${planetRows || `<tr><td colspan="5" style="text-align:center;padding:24px;color:#9ca3af;font-style:italic">No planetary data — please generate a chart from the form first.</td></tr>`}
            </tbody>
        </table>
    </div>

    <div class="page-footer">
        <span>© ${now.getFullYear()} Astrominee • astrominee.com</span>
        <span>All calculations use the Vedic sidereal system with Lahiri (Chitrapaksha) Ayanamsa.</span>
        <span>02 / 06</span>
    </div>
</div>

<!-- ════════════════════════ PAGE 3: INSIGHTS + DASHA ════════════════════════ -->
<div class="page">
    <div class="page-header">
        <div class="page-header-brand">Astrominee • Cosmic Report</div>
        <div class="page-header-title">AI Cosmic Insights &amp; Planetary Periods</div>
    </div>

    <!-- Insights -->
    <div class="section-head">
        <div class="section-icon">✨</div>
        <div class="section-title-block">
            <h2>Cosmic Insights &amp; Life Analysis</h2>
            <p>AI-powered interpretations of your planetary configurations across all life domains</p>
        </div>
    </div>

    <div class="insights-grid">
        ${insights}
    </div>

    <!-- Current Dasha -->
    <div class="dasha-section">
        <div class="section-head">
            <div class="section-icon">📅</div>
            <div class="section-title-block">
                <h2>Current Planetary Period (Mahadasha)</h2>
                <p>Your active Vimshottari Dasha governs the dominant energy of this life chapter</p>
            </div>
        </div>
        <div class="dasha-card">
            <div>
                <div class="dasha-subtitle">Active Mahadasha</div>
                <div class="dasha-title">Jupiter</div>
                <div class="dasha-period">Period: 2018 — 2034 (16 years)</div>
            </div>
            <div class="dasha-bar-wrap">
                <div class="dasha-bar-label">
                    <span>2018 — Started</span>
                    <span>45% Elapsed</span>
                    <span>2034 — Ends</span>
                </div>
                <div class="dasha-bar-track">
                    <div class="dasha-bar-fill"></div>
                </div>
                <p style="font-size:10px;color:#c4b5fd;margin-top:10px;line-height:1.6">Jupiter Mahadasha is a period of immense grace, expansion, and dharmic fulfillment. Children, higher education, spiritual knowledge, and long-distance travel are all blessed themes during this period. Leverage this window to build your legacy.</p>
            </div>
        </div>
    </div>

    <div class="page-footer">
        <span>© ${now.getFullYear()} Astrominee • astrominee.com</span>
        <span>Insights are interpretive guidance, not predictions. Use with discernment.</span>
        <span>03 / 06</span>
    </div>
</div>

<!-- ════════════════════ PAGE 4: PLANET IN HOUSE ════════════════════ -->
<div class="page">
    <div class="page-header">
        <div class="page-header-brand">Astrominee • Cosmic Report</div>
        <div class="page-header-title">Detailed Predictions – Planet in House</div>
    </div>
    <div class="section-head">
        <div class="section-icon">🏠</div>
        <div class="section-title-block">
            <h2>Planet in House Predictions</h2>
            <p>How each planet shapes a specific area of your life based on the house it occupies in your natal chart</p>
        </div>
    </div>
    ${phRows || "<p style='color:#9ca3af;font-style:italic'>No planet-in-house data available.</p>"}
    <div class="page-footer">
        <span>© ${now.getFullYear()} Astrominee • astrominee.com</span>
        <span>Interpretations based on classical Vedic astrology principles.</span>
        <span>04 / 06</span>
    </div>
</div>

<!-- ════════════════════ PAGE 5: HOUSE LORD ════════════════════ -->
<div class="page">
    <div class="page-header">
        <div class="page-header-brand">Astrominee • Cosmic Report</div>
        <div class="page-header-title">Detailed Predictions – House Lord Placements</div>
    </div>
    <div class="section-head">
        <div class="section-icon">♛</div>
        <div class="section-title-block">
            <h2>House Lord Placement Predictions</h2>
            <p>The results of each house's ruling planet sitting in a different house — showing how one life area influences another</p>
        </div>
    </div>
    ${hlRows}
    <div class="page-footer">
        <span>© ${now.getFullYear()} Astrominee • astrominee.com</span>
        <span>House lord results require accurate Ascendant degree for precise calculation.</span>
        <span>05 / 06</span>
    </div>
</div>

<!-- ════════════════════ PAGE 6: NAKSHATRA ════════════════════ -->
<div class="page" style="page-break-after:avoid">
    <div class="page-header">
        <div class="page-header-brand">Astrominee • Cosmic Report</div>
        <div class="page-header-title">Detailed Predictions – Planet in Nakshatra</div>
    </div>
    <div class="section-head">
        <div class="section-icon">⭐</div>
        <div class="section-title-block">
            <h2>Planet in Nakshatra Predictions</h2>
            <p>How each planet's Nakshatra placement creates a unique cosmic signature that shapes your life experience</p>
        </div>
    </div>
    ${nkRows || "<p style='color:#9ca3af;font-style:italic'>No nakshatra data available.</p>"}
    <div class="page-footer">
        <span>© ${now.getFullYear()} Astrominee • astrominee.com</span>
        <span>Nakshatra themes are channeled through planetary archetypes in Vedic tradition.</span>
        <span>06 / 06</span>
    </div>
</div>

<script>
  window.onload = function() { setTimeout(function() { window.print(); }, 600); };
<\/script>
</body>
</html>`;

  win.document.write(html);
  win.document.close();
};
