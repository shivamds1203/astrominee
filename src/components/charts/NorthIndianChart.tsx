"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChartProps {
    planetsData: any[];
}

// Real NASA / Wikimedia planet image URLs
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

// Per-planet glow color for the ring effect
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

export const NorthIndianChart = ({ planetsData }: ChartProps) => {
    const houses: { [key: number]: Array<{ name: string; degree: string; isRetro: boolean }> } = {};
    for (let i = 1; i <= 12; i++) houses[i] = [];

    const validPlanets = planetsData?.filter(p => p && p.name && p.house_number);

    validPlanets?.forEach(planet => {
        const hNum = parseInt(planet.house_number, 10);
        const deg = planet.normDegree || 0;
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);
        if (houses[hNum]) {
            houses[hNum].push({
                name: planet.name,
                degree: `${d}°${m}'`,
                isRetro: planet.isRetro === "true",
            });
        }
    });

    const ascendantSign = validPlanets?.find(p => p.name === "Ascendant")?.current_sign || 1;
    const getSignNumForHouse = (houseNumber: number) => {
        let sign = ascendantSign + (houseNumber - 1);
        if (sign > 12) sign -= 12;
        return sign;
    };

    // Precise centers & sign label positions for all 12 houses in the North Indian layout
    const positions: Record<number, { cx: string; cy: string; signX: string; signY: string }> = {
        1: { cx: "50%", cy: "22%", signX: "50%", signY: "40%" }, // Top center diamond
        2: { cx: "25%", cy: "12%", signX: "37%", signY: "24%" }, // Top-left triangle
        3: { cx: "12%", cy: "25%", signX: "24%", signY: "37%" }, // Left-top triangle
        4: { cx: "25%", cy: "50%", signX: "44%", signY: "50%" }, // Left diamond
        5: { cx: "12%", cy: "75%", signX: "24%", signY: "63%" }, // Left-bottom triangle
        6: { cx: "25%", cy: "88%", signX: "37%", signY: "76%" }, // Bottom-left triangle
        7: { cx: "50%", cy: "78%", signX: "50%", signY: "60%" }, // Bottom diamond
        8: { cx: "75%", cy: "88%", signX: "63%", signY: "76%" }, // Bottom-right triangle
        9: { cx: "88%", cy: "75%", signX: "76%", signY: "63%" }, // Right-bottom triangle
        10: { cx: "75%", cy: "50%", signX: "56%", signY: "50%" }, // Right diamond
        11: { cx: "88%", cy: "25%", signX: "76%", signY: "37%" }, // Right-top triangle
        12: { cx: "75%", cy: "12%", signX: "63%", signY: "24%" }, // Top-right triangle
    };

    const renderHouseContent = (houseNum: number) => {
        const pos = positions[houseNum];
        const isAscendant = houseNum === 1;
        const housePlanets = houses[houseNum] || [];

        return (
            <React.Fragment key={houseNum}>
                {/* Sign Number Label */}
                <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                    style={{ left: pos.signX, top: pos.signY }}
                >
                    <span className="text-yellow-400/70 text-[10px] md:text-[11px] font-bold font-mono leading-none">
                        {getSignNumForHouse(houseNum)}
                    </span>
                </div>

                {/* Planet Orbs Area */}
                <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center"
                    style={{ left: pos.cx, top: pos.cy, width: "44%", height: "44%" }}
                >
                    {isAscendant && (
                        <span className="text-[9px] font-extrabold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-[0_0_4px_rgba(212,175,55,0.8)] mb-1 leading-none">
                            LAGNA
                        </span>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {housePlanets.map((p, i) => {
                            const img = PLANET_IMAGES[p.name] ?? PLANET_IMAGES.Moon;
                            const glow = PLANET_GLOW[p.name] ?? "";
                            const short = p.name.substring(0, 2);
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 220,
                                        damping: 14,
                                        delay: houseNum * 0.04 + i * 0.1,
                                    }}
                                    className="relative group cursor-pointer"
                                >
                                    {/* Planet orb */}
                                    <div
                                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden relative border border-white/20 ${glow} group-hover:scale-[1.5] transition-transform duration-300 bg-black`}
                                    >
                                        <img
                                            src={img}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {/* Sphere sheen */}
                                        <div className="absolute inset-0 rounded-full shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.7),inset_1px_1px_4px_rgba(255,255,255,0.45)]" />
                                        {/* Tiny planet label */}
                                        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
                                            {short}
                                        </span>
                                    </div>

                                    {/* Retrograde badge */}
                                    {p.isRetro && (
                                        <span className="absolute -bottom-1 -right-1 z-30 text-[7px] font-bold text-rose-400 bg-black/80 rounded-full w-3 h-3 flex items-center justify-center border border-rose-500/60">
                                            R
                                        </span>
                                    )}

                                    {/* Hover tooltip */}
                                    <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#0a0f1c]/95 border border-white/10 rounded-lg px-2.5 py-1.5 flex flex-col items-center shadow-2xl z-50 min-w-max">
                                        <span className="text-[11px] text-white font-bold">{p.name}</span>
                                        {p.name !== "Ascendant" && (
                                            <span className="text-[10px] text-yellow-400 font-mono">{p.degree}</span>
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative w-full max-w-[460px] aspect-square mx-auto bg-[#060b18]/90 backdrop-blur-2xl border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(79,70,229,0.18)]"
        >
            {/* Cosmic ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Glowing gold SVG grid */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="gold-line" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#fde68a" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="line-glow">
                        <feGaussianBlur stdDeviation="0.8" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Outer square */}
                <rect x="1.5" y="1.5" width="97" height="97" fill="none"
                    stroke="url(#gold-line)" strokeWidth="0.6" filter="url(#line-glow)" />

                {/* Diagonals */}
                <line x1="1.5" y1="1.5" x2="98.5" y2="98.5"
                    stroke="url(#gold-line)" strokeWidth="0.5" filter="url(#line-glow)" />
                <line x1="98.5" y1="1.5" x2="1.5" y2="98.5"
                    stroke="url(#gold-line)" strokeWidth="0.5" filter="url(#line-glow)" />

                {/* Inner diamond */}
                <polygon points="50,1.5 98.5,50 50,98.5 1.5,50" fill="none"
                    stroke="url(#gold-line)" strokeWidth="0.6" filter="url(#line-glow)" />
            </svg>

            {/* Render all 12 houses */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => renderHouseContent(num))}
        </motion.div>
    );
};
