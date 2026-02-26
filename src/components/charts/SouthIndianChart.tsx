"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChartProps {
    planetsData: any[];
    userData?: any;
}

// Real NASA / Wikimedia planet images
const PLANET_IMAGES: Record<string, string> = {
    Sun: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/240px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
    Moon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/240px-FullMoon2010.jpg",
    Mars: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg",
    Mercury: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/240px-Mercury_in_true_color.jpg",
    Jupiter: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Jupiter.jpg/240px-Jupiter.jpg",
    Venus: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/240px-Venus-real_color.jpg",
    Saturn: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/240px-Saturn_during_Equinox.jpg",
    Rahu: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Lunar_eclipse_April_15_2014_California_short.jpg/320px-Lunar_eclipse_April_15_2014_California_short.jpg",
    Ketu: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Comet_Holmes_2007-11-04.jpg/320px-Comet_Holmes_2007-11-04.jpg",
    Ascendant: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/240px-The_Earth_seen_from_Apollo_17.jpg",
};

const PLANET_GLOW: Record<string, string> = {
    Sun: "shadow-[0_0_10px_#f97316,0_0_4px_#f59e0b]",
    Moon: "shadow-[0_0_10px_#e2e8f0,0_0_4px_#f1f5f9]",
    Mars: "shadow-[0_0_10px_#ef4444,0_0_4px_#dc2626]",
    Mercury: "shadow-[0_0_10px_#10b981,0_0_4px_#34d399]",
    Jupiter: "shadow-[0_0_10px_#f59e0b,0_0_4px_#fbbf24]",
    Venus: "shadow-[0_0_10px_#ec4899,0_0_4px_#f472b6]",
    Saturn: "shadow-[0_0_10px_#6366f1,0_0_4px_#818cf8]",
    Rahu: "shadow-[0_0_10px_#94a3b8,0_0_4px_#64748b]",
    Ketu: "shadow-[0_0_10px_#d6d3d1,0_0_4px_#a8a29e]",
    Ascendant: "shadow-[0_0_12px_#22d3ee,0_0_4px_#06b6d4]",
};

// South Indian fixed sign layout (clockwise from Pisces top-left)
// Row 1: 12, 1, 2, 3
// Row 2: 11, [center], [center], 4
// Row 3: 10, [center], [center], 5
// Row 4: 9, 8, 7, 6
const SIGN_NAMES = ["", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_ABBR = ["", "Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sa", "Cp", "Aq", "Pi"];

export const SouthIndianChart = ({ planetsData, userData }: ChartProps) => {
    // Map planets to their sign
    const signMap: { [key: number]: Array<{ name: string; fullName: string; degree: string; isRetro: boolean }> } = {};
    for (let i = 1; i <= 12; i++) signMap[i] = [];

    const validPlanets = planetsData?.filter(p => p && p.name && p.current_sign);
    let ascendantSign = 1;

    validPlanets?.forEach(planet => {
        if (planet.name === "Ascendant") {
            ascendantSign = parseInt(planet.current_sign, 10);
        }
        const sNum = parseInt(planet.current_sign, 10);
        const deg = planet.normDegree || 0;
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);

        if (signMap[sNum]) {
            signMap[sNum].push({
                name: planet.name.substring(0, 2),
                fullName: planet.name,
                degree: planet.name !== "Ascendant" ? `${d}°${m}′` : "",
                isRetro: planet.isRetro === "true",
            });
        }
    });

    const renderPlanetOrb = (p: { name: string; fullName: string; degree: string; isRetro: boolean }, idx: number, signDelay: number) => {
        const img = PLANET_IMAGES[p.fullName] ?? PLANET_IMAGES.Moon;
        const glow = PLANET_GLOW[p.fullName] ?? "";

        return (
            <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: signDelay + idx * 0.08 }}
                className="relative group cursor-pointer"
            >
                {/* Orb */}
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden relative border border-white/20 ${glow} group-hover:scale-[1.5] transition-transform duration-300 bg-black`}>
                    <img src={img} alt={p.fullName} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 rounded-full shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.7),inset_1px_1px_4px_rgba(255,255,255,0.45)]" />
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white drop-shadow-[0_0_2px_rgba(0,0,0,1)]">{p.name}</span>
                </div>

                {/* Retrograde badge */}
                {p.isRetro && (
                    <span className="absolute -bottom-1 -right-1 z-30 text-[7px] font-bold text-rose-400 bg-black/80 rounded-full w-3 h-3 flex items-center justify-center border border-rose-500/60">R</span>
                )}

                {/* Hover tooltip */}
                <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#0a0f1c]/95 border border-white/10 rounded-lg px-2.5 py-1.5 flex flex-col items-center shadow-2xl z-50 min-w-max">
                    <span className="text-[11px] text-white font-bold">{p.fullName}</span>
                    {p.degree && <span className="text-[10px] text-yellow-400 font-mono">{p.degree}</span>}
                </div>
            </motion.div>
        );
    };

    const renderCell = (signNum: number, delay: number) => {
        const isAsc = ascendantSign === signNum;
        const planetsInSign = signMap[signNum] || [];

        return (
            <div
                key={signNum}
                className={`relative min-h-[80px] md:min-h-[96px] flex flex-col items-center justify-between p-1.5 overflow-hidden transition-all ${isAsc ? "ring-1 ring-yellow-400/30" : ""}`}
            >
                {/* Cell ambient glow when ascendant */}
                {isAsc && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
                )}

                {/* Sign label */}
                <div className="w-full flex items-center justify-between z-10">
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isAsc ? "text-yellow-400" : "text-indigo-300/60"}`}>
                        {SIGN_ABBR[signNum]}
                    </span>
                    {isAsc && (
                        <span className="text-[8px] font-extrabold text-yellow-400/80 tracking-widest uppercase">Lag</span>
                    )}
                </div>

                {/* Planets */}
                <div className="flex flex-wrap items-center justify-center gap-1 z-10 my-1">
                    {planetsInSign.map((p, i) => renderPlanetOrb(p, i, delay))}
                </div>

                {/* Sign number (bottom-right accent) */}
                <div className="w-full flex justify-end z-10">
                    <span className="text-[8px] text-white/15 font-mono">{signNum}</span>
                </div>
            </div>
        );
    };

    // Grid cell SVG dividers (the golden lines)
    const GoldGrid = () => (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 400 400">
            <defs>
                <linearGradient id="si-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#fde68a" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0.9" />
                </linearGradient>
                <filter id="si-glow">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Outer border */}
            <rect x="1" y="1" width="398" height="398" fill="none" stroke="url(#si-gold)" strokeWidth="1" filter="url(#si-glow)" />

            {/* Vertical dividers at 25%, 50%, 75% */}
            <line x1="100" y1="1" x2="100" y2="399" stroke="url(#si-gold)" strokeWidth="0.6" filter="url(#si-glow)" />
            <line x1="200" y1="1" x2="200" y2="399" stroke="url(#si-gold)" strokeWidth="0.6" filter="url(#si-glow)" />
            <line x1="300" y1="1" x2="300" y2="399" stroke="url(#si-gold)" strokeWidth="0.6" filter="url(#si-glow)" />

            {/* Horizontal dividers at 25%, 50%, 75% */}
            <line x1="1" y1="100" x2="399" y2="100" stroke="url(#si-gold)" strokeWidth="0.6" filter="url(#si-glow)" />
            <line x1="1" y1="200" x2="399" y2="200" stroke="url(#si-gold)" strokeWidth="0.6" filter="url(#si-glow)" />
            <line x1="1" y1="300" x2="399" y2="300" stroke="url(#si-gold)" strokeWidth="0.6" filter="url(#si-glow)" />
        </svg>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative w-full max-w-[460px] aspect-square mx-auto bg-[#060b18]/90 backdrop-blur-2xl border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(79,70,229,0.18)]"
        >
            {/* Deep space ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Glowing gold grid SVG overlay */}
            <GoldGrid />

            {/* 4×4 Sign Grid */}
            <div className="relative z-10 grid grid-cols-4 w-full h-full">

                {/* Row 1: signs 12, 1, 2, 3 */}
                {renderCell(12, 0.05)}
                {renderCell(1, 0.10)}
                {renderCell(2, 0.15)}
                {renderCell(3, 0.20)}

                {/* Row 2: sign 11, center×2, sign 4 */}
                {renderCell(11, 0.25)}

                {/* Center block (2×2) */}
                <div className="col-span-2 row-span-2 flex flex-col items-center justify-center text-center p-3 z-10">
                    {/* Inner decorative ring */}
                    <div className="absolute w-[48%] h-[48%] rounded-lg border border-indigo-500/10 pointer-events-none" style={{ top: "26%", left: "26%" }} />
                    <div className="absolute w-[38%] h-[38%] rounded-lg border border-purple-500/10 pointer-events-none" style={{ top: "31%", left: "31%" }} />

                    <p className="text-[10px] font-extrabold tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 uppercase mb-1">
                        {userData?.name || "—"}
                    </p>
                    <p className="text-[9px] text-indigo-300/60 font-medium leading-relaxed">
                        {userData?.dateOfBirth || ""}<br />
                        {userData?.timeOfBirth || ""}
                    </p>
                    {userData?.placeOfBirth && (
                        <p className="text-[8px] text-gray-500 mt-1 leading-snug">
                            {userData.placeOfBirth.split(",")[0]}
                        </p>
                    )}
                    <div className="mt-2 text-lg text-yellow-400/10 font-serif">ॐ</div>
                </div>

                {renderCell(4, 0.30)}

                {/* Row 3: sign 10, (center continues), sign 5 */}
                {renderCell(10, 0.35)}
                {renderCell(5, 0.40)}

                {/* Row 4: signs 9, 8, 7, 6 */}
                {renderCell(9, 0.45)}
                {renderCell(8, 0.50)}
                {renderCell(7, 0.55)}
                {renderCell(6, 0.60)}
            </div>
        </motion.div>
    );
};
