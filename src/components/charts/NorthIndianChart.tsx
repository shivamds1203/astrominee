"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChartProps {
    planetsData: any[];
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

// Per-planet glow color for the ring effect
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

const PLANET_SHORT: Record<string, string> = {
    Sun: "Su",
    Moon: "Mo",
    Mars: "Ma",
    Mercury: "Me",
    Jupiter: "Ju",
    Venus: "Ve",
    Saturn: "Sa",
    Rahu: "Ra",
    Ketu: "Ke",
    Ascendant: "Asc",
};

export const NorthIndianChart = ({ planetsData }: ChartProps) => {
    const houses: { [key: number]: Array<{ name: string; degree: string; isRetro: boolean }> } = {};
    for (let i = 1; i <= 12; i++) houses[i] = [];

    const validPlanets = planetsData?.filter(p => p && p.name && (p.house_number !== undefined || p.house !== undefined || p.current_sign !== undefined)) || [];

    validPlanets.forEach(planet => {
        const hNum = parseInt(planet.house_number || planet.house || planet.current_sign || 1, 10);
        const deg = planet.normDegree !== undefined ? planet.normDegree : ((planet.fullDegree || 0) % 30);
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);
        if (houses[hNum]) {
            houses[hNum].push({
                name: planet.name,
                degree: `${d}°${m}'`,
                isRetro: planet.isRetro === "true" || planet.isRetro === true,
            });
        }
    });

    // Ascendant sign for this chart (determines Rashi in House 1)
    const ascPlanet = validPlanets.find(p => p.name === "Ascendant");
    const ascendantSign = ascPlanet?.current_sign ? parseInt(ascPlanet.current_sign, 10) : 1;

    // In Vedic North Indian chart, houses go counter-clockwise 1 to 12.
    const getSignNumForHouse = (houseNumber: number) => {
        return (((ascendantSign - 1) + (houseNumber - 1)) % 12) + 1;
    };

    // Refined non-overlapping coordinates for North Indian layout
    const positions: Record<number, { cx: string; cy: string; signX: string; signY: string }> = {
        1: { cx: "50%", cy: "27%", signX: "50%", signY: "7%" },   // Top center diamond (Lagna) - sign at apex, planets below
        2: { cx: "22%", cy: "15%", signX: "40%", signY: "8%" },   // Top-left triangle - sign at inner corner, planets left
        3: { cx: "15%", cy: "22%", signX: "8%", signY: "40%" },   // Left-top triangle - sign at inner corner, planets top
        4: { cx: "27%", cy: "50%", signX: "9%", signY: "50%" },   // Left center diamond - sign at outer apex, planets inner
        5: { cx: "15%", cy: "78%", signX: "8%", signY: "60%" },   // Left-bottom triangle
        6: { cx: "22%", cy: "85%", signX: "40%", signY: "92%" },  // Bottom-left triangle
        7: { cx: "50%", cy: "73%", signX: "50%", signY: "93%" },  // Bottom center diamond - sign at bottom apex, planets above
        8: { cx: "78%", cy: "85%", signX: "60%", signY: "92%" },  // Bottom-right triangle
        9: { cx: "85%", cy: "78%", signX: "92%", signY: "60%" },  // Right-bottom triangle
        10: { cx: "73%", cy: "50%", signX: "91%", signY: "50%" }, // Right center diamond - sign at right apex, planets inner
        11: { cx: "85%", cy: "22%", signX: "92%", signY: "40%" }, // Right-top triangle
        12: { cx: "78%", cy: "15%", signX: "60%", signY: "8%" },  // Top-right triangle
    };

    const renderHouseContent = (houseNum: number) => {
        const pos = positions[houseNum];
        const isAscendant = houseNum === 1;
        const housePlanets = houses[houseNum] || [];

        return (
            <React.Fragment key={houseNum}>
                {/* Rashi / Sign Number (positioned away from planet clusters) */}
                <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                    style={{ left: pos.signX, top: pos.signY }}
                >
                    <span className="text-amber-700 dark:text-yellow-400 font-black text-xs md:text-sm font-mono drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_0_3px_rgba(0,0,0,0.9)]">
                        {getSignNumForHouse(houseNum)}
                    </span>
                </div>

                {/* Planet Orbs */}
                <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-auto"
                    style={{
                        left: pos.cx,
                        top: pos.cy,
                        width: (houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10) ? "32%" : "22%",
                        height: (houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10) ? "32%" : "22%",
                    }}
                >
                    {isAscendant && (
                        <span className="text-[7.5px] md:text-[8.5px] font-black tracking-widest uppercase text-amber-700 dark:text-yellow-300 drop-shadow-sm dark:drop-shadow-[0_0_6px_rgba(234,179,8,0.8)] mb-0.5 leading-none">
                            LAGNA
                        </span>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
                        {housePlanets.map((p, i) => {
                            const img = PLANET_IMAGES[p.name] ?? PLANET_IMAGES.Moon;
                            const glow = PLANET_GLOW[p.name] ?? "";
                            const short = PLANET_SHORT[p.name] ?? p.name.substring(0, 2);

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 16,
                                        delay: houseNum * 0.02 + i * 0.05,
                                    }}
                                    className="relative group cursor-pointer flex flex-col items-center"
                                >
                                    {/* Planet Sphere Orb */}
                                    <div
                                        className={`w-5 h-5 md:w-5.5 md:h-5.5 rounded-full overflow-hidden relative border border-amber-300/80 dark:border-white/25 ${glow} group-hover:scale-125 transition-transform duration-200 bg-slate-900 flex-shrink-0 shadow-md`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${p.name}`}
                                            className="w-full h-full object-cover rounded-full"
                                            loading="eager"
                                        />
                                        {/* 3D Sheen overlay */}
                                        <div className="absolute inset-0 rounded-full shadow-[inset_-1.5px_-1.5px_4px_rgba(0,0,0,0.7),inset_1px_1px_3px_rgba(255,255,255,0.6)] pointer-events-none" />
                                    </div>

                                    {/* Text Tag (Abbreviation) */}
                                    <span className="text-[7px] md:text-[8px] font-bold text-slate-800 dark:text-white leading-none mt-0.5 px-0.5 py-0.2 rounded bg-white/90 dark:bg-black/70 border border-slate-200/80 dark:border-white/10 shadow-xs">
                                        {short}
                                    </span>

                                    {/* Retrograde badge */}
                                    {p.isRetro && (
                                        <span className="absolute -top-1 -right-1 z-30 text-[6px] font-black text-white bg-rose-600 dark:bg-rose-700 rounded-full w-2.5 h-2.5 flex items-center justify-center border border-rose-300 dark:border-rose-400 shadow-xs">
                                            R
                                        </span>
                                    )}

                                    {/* Hover Tooltip */}
                                    <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900/98 dark:bg-[#070c18]/98 text-white border border-white/20 rounded-xl px-2.5 py-1.5 flex flex-col items-center shadow-2xl z-50 min-w-max">
                                        <span className="text-[11px] font-bold">{p.name}</span>
                                        {p.degree && (
                                            <span className="text-[10px] text-yellow-400 font-mono font-medium">{p.degree}</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative w-full max-w-[460px] aspect-square mx-auto bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-amber-100/90 dark:from-[#060a16]/95 dark:via-[#080d1e]/95 dark:to-[#060a16]/95 backdrop-blur-2xl border border-amber-300/90 dark:border-yellow-500/30 rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(234,179,8,0.12)] select-none transition-colors duration-300"
        >
            {/* Ambient radiance */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Glowing gold North Indian Diamond SVG grid */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    {/* Light theme gold lines */}
                    <linearGradient id="kundli-light" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#b45309" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#d97706" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Dark theme neon gold lines */}
                    <linearGradient id="kundli-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#fef08a" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.95" />
                    </linearGradient>

                    <filter id="kundli-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="0.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer frame */}
                <rect
                    x="1" y="1" width="98" height="98"
                    fill="none"
                    className="stroke-[url(#kundli-light)] dark:stroke-[url(#kundli-dark)]"
                    strokeWidth="0.85"
                    filter="url(#kundli-glow)"
                />

                {/* Main diagonals */}
                <line
                    x1="1" y1="1" x2="99" y2="99"
                    className="stroke-[url(#kundli-light)] dark:stroke-[url(#kundli-dark)]"
                    strokeWidth="0.65"
                    filter="url(#kundli-glow)"
                />
                <line
                    x1="99" y1="1" x2="1" y2="99"
                    className="stroke-[url(#kundli-light)] dark:stroke-[url(#kundli-dark)]"
                    strokeWidth="0.65"
                    filter="url(#kundli-glow)"
                />

                {/* Inner Diamond */}
                <polygon
                    points="50,1 99,50 50,99 1,50"
                    fill="none"
                    className="stroke-[url(#kundli-light)] dark:stroke-[url(#kundli-dark)]"
                    strokeWidth="0.85"
                    filter="url(#kundli-glow)"
                />
            </svg>

            {/* Render all 12 houses */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => renderHouseContent(num))}
        </motion.div>
    );
};
