"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChartProps {
    planetsData: any[];
    userData?: any;
}

// Local high-definition NASA photographic planet assets
const PLANET_IMAGES: Record<string, string> = {
    Sun: "/assets/planets/sun.png",
    Moon: "/assets/planets/moon.png",
    Mars: "/assets/planets/mars.png",
    Mercury: "/assets/planets/mercury.png",
    Jupiter: "/assets/planets/jupiter.png",
    Venus: "/assets/planets/venus.png",
    Saturn: "/assets/planets/saturn.png",
    Rahu: "/assets/planets/rahu.png",
    Ketu: "/assets/planets/ketu.png",
    Ascendant: "/assets/planets/ascendant.png",
};

const PLANET_GLOW: Record<string, string> = {
    Sun: "shadow-[0_0_8px_#f97316,0_0_3px_#f59e0b]",
    Moon: "shadow-[0_0_8px_#94a3b8,0_0_3px_#cbd5e1] dark:shadow-[0_0_8px_#e2e8f0,0_0_3px_#f1f5f9]",
    Mars: "shadow-[0_0_8px_#ef4444,0_0_3px_#dc2626]",
    Mercury: "shadow-[0_0_8px_#10b981,0_0_3px_#34d399]",
    Jupiter: "shadow-[0_0_8px_#f59e0b,0_0_3px_#fbbf24]",
    Venus: "shadow-[0_0_8px_#ec4899,0_0_3px_#f472b6]",
    Saturn: "shadow-[0_0_8px_#6366f1,0_0_3px_#818cf8]",
    Rahu: "shadow-[0_0_8px_#64748b,0_0_3px_#475569] dark:shadow-[0_0_8px_#94a3b8,0_0_3px_#64748b]",
    Ketu: "shadow-[0_0_8px_#78716c,0_0_3px_#57534e] dark:shadow-[0_0_8px_#d6d3d1,0_0_3px_#a8a29e]",
    Ascendant: "shadow-[0_0_10px_#06b6d4,0_0_3px_#0891b2] dark:shadow-[0_0_10px_#22d3ee,0_0_3px_#06b6d4]",
};

const SIGN_ABBR = ["", "Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sa", "Cp", "Aq", "Pi"];

export const SouthIndianChart = ({ planetsData, userData }: ChartProps) => {
    const signMap: { [key: number]: Array<{ name: string; fullName: string; degree: string; isRetro: boolean }> } = {};
    for (let i = 1; i <= 12; i++) signMap[i] = [];

    const validPlanets = planetsData?.filter(p => p && p.name && (p.current_sign !== undefined || p.house_number !== undefined)) || [];
    let ascendantSign = 1;

    validPlanets.forEach(planet => {
        if (planet.name === "Ascendant") {
            ascendantSign = parseInt(planet.current_sign || 1, 10);
        }
        const sNum = parseInt(planet.current_sign || planet.house_number || 1, 10);
        const deg = planet.normDegree !== undefined ? planet.normDegree : ((planet.fullDegree || 0) % 30);
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);

        if (signMap[sNum]) {
            signMap[sNum].push({
                name: planet.name.substring(0, 2),
                fullName: planet.name,
                degree: planet.name !== "Ascendant" ? `${d}°${m}′` : "",
                isRetro: planet.isRetro === "true" || planet.isRetro === true,
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
                className="relative group cursor-pointer flex flex-col items-center"
            >
                {/* Orb */}
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden relative border border-amber-300/80 dark:border-white/20 ${glow} group-hover:scale-125 transition-transform duration-200 bg-slate-900 shadow-md`}>
                    <img src={img} alt={`${p.fullName}`} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 rounded-full shadow-[inset_-1.5px_-1.5px_4px_rgba(0,0,0,0.7),inset_1px_1px_3px_rgba(255,255,255,0.6)]" />
                </div>

                <span className="text-[7.5px] md:text-[8px] font-bold text-slate-800 dark:text-white leading-none mt-0.5 px-0.5 rounded bg-white/90 dark:bg-black/70 border border-slate-200/80 dark:border-white/10 shadow-xs">
                    {p.name}
                </span>

                {/* Retrograde badge */}
                {p.isRetro && (
                    <span className="absolute -top-1 -right-1 z-30 text-[6.5px] font-black text-white bg-rose-600 dark:bg-rose-700 rounded-full w-3 h-3 flex items-center justify-center border border-rose-300 shadow-xs">R</span>
                )}

                {/* Hover tooltip */}
                <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900/98 dark:bg-[#0a0f1c]/98 text-white border border-white/20 rounded-xl px-2.5 py-1.5 flex flex-col items-center shadow-2xl z-50 min-w-max">
                    <span className="text-[11px] font-bold">{p.fullName}</span>
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
                className={`relative min-h-[80px] md:min-h-[96px] flex flex-col items-center justify-between p-1.5 overflow-hidden transition-all ${isAsc ? "ring-1 ring-amber-500/50 dark:ring-yellow-400/40 bg-amber-500/10 dark:bg-yellow-500/5" : ""}`}
            >
                {/* Sign label */}
                <div className="w-full flex items-center justify-between z-10">
                    <span className={`text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest ${isAsc ? "text-amber-700 dark:text-yellow-400" : "text-slate-600 dark:text-indigo-300/70"}`}>
                        {SIGN_ABBR[signNum]}
                    </span>
                    {isAsc && (
                        <span className="text-[8px] font-black text-amber-700 dark:text-yellow-400/90 tracking-widest uppercase bg-amber-200/60 dark:bg-yellow-500/20 px-1 rounded">Lag</span>
                    )}
                </div>

                {/* Planets */}
                <div className="flex flex-wrap items-center justify-center gap-1 z-10 my-1 max-w-full">
                    {planetsInSign.map((p, i) => renderPlanetOrb(p, i, delay))}
                </div>

                {/* Sign number */}
                <div className="w-full flex justify-end z-10">
                    <span className="text-[8px] text-slate-400 dark:text-white/20 font-mono font-bold">{signNum}</span>
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative w-full max-w-[460px] aspect-square mx-auto bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-amber-100/90 dark:from-[#060b18]/90 dark:to-[#080f24]/90 backdrop-blur-2xl border border-amber-300/90 dark:border-indigo-500/30 rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_0_60px_rgba(79,70,229,0.18)] select-none transition-colors duration-300"
        >
            {/* SVG Golden Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 400 400">
                <defs>
                    <linearGradient id="si-light" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#b45309" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#d97706" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="si-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#fde68a" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.95" />
                    </linearGradient>
                </defs>

                {/* Outer border */}
                <rect x="1" y="1" width="398" height="398" fill="none" className="stroke-[url(#si-light)] dark:stroke-[url(#si-dark)]" strokeWidth="1.2" />

                {/* Dividers */}
                <line x1="100" y1="1" x2="100" y2="399" className="stroke-[url(#si-light)] dark:stroke-[url(#si-dark)]" strokeWidth="0.8" />
                <line x1="200" y1="1" x2="200" y2="399" className="stroke-[url(#si-light)] dark:stroke-[url(#si-dark)]" strokeWidth="0.8" />
                <line x1="300" y1="1" x2="300" y2="399" className="stroke-[url(#si-light)] dark:stroke-[url(#si-dark)]" strokeWidth="0.8" />

                <line x1="1" y1="100" x2="399" y2="100" className="stroke-[url(#si-light)] dark:stroke-[url(#si-dark)]" strokeWidth="0.8" />
                <line x1="1" y1="200" x2="399" y2="200" className="stroke-[url(#si-light)] dark:stroke-[url(#si-dark)]" strokeWidth="0.8" />
                <line x1="1" y1="300" x2="399" y2="300" className="stroke-[url(#si-light)] dark:stroke-[url(#si-dark)]" strokeWidth="0.8" />
            </svg>

            {/* 4×4 Sign Grid */}
            <div className="relative z-10 grid grid-cols-4 w-full h-full">
                {/* Row 1 */}
                {renderCell(12, 0.05)}
                {renderCell(1, 0.10)}
                {renderCell(2, 0.15)}
                {renderCell(3, 0.20)}

                {/* Row 2 */}
                {renderCell(11, 0.25)}
                {/* Center 2x2 */}
                <div className="col-span-2 row-span-2 flex flex-col items-center justify-center text-center p-3 z-10 bg-amber-100/40 dark:bg-black/40 border border-amber-200/40 dark:border-white/5 rounded-xl m-1">
                    <p className="text-[11px] font-extrabold tracking-[2px] text-amber-700 dark:text-yellow-400 uppercase mb-1">
                        {userData?.name || "South Indian"}
                    </p>
                    <p className="text-[9.5px] text-slate-600 dark:text-indigo-300/70 font-medium leading-relaxed">
                        {userData?.dateOfBirth || ""}<br />
                        {userData?.timeOfBirth || ""}
                    </p>
                    <div className="mt-1 text-xl text-amber-600/30 dark:text-yellow-400/20 font-serif">ॐ</div>
                </div>
                {renderCell(4, 0.30)}

                {/* Row 3 */}
                {renderCell(10, 0.35)}
                {renderCell(5, 0.40)}

                {/* Row 4 */}
                {renderCell(9, 0.45)}
                {renderCell(8, 0.50)}
                {renderCell(7, 0.55)}
                {renderCell(6, 0.60)}
            </div>
        </motion.div>
    );
};
