"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLANET_IN_HOUSE, PLANET_IN_NAKSHATRA, SIGN_LORDS, HOUSE_LORD_IN_HOUSE } from "@/lib/astrologyInterpretations";
import { getNakshatraDetails } from "@/lib/astrologyMath";
import { AIChatBox } from "@/components/predictions/AIChatBox";

const PLANET_COLORS: Record<string, { from: string; to: string; glow: string; text: string; lightText: string }> = {
    Sun: { from: "#f97316", to: "#fbbf24", glow: "rgba(251,191,36,0.3)", text: "#fbbf24", lightText: "#c2410c" },
    Moon: { from: "#0284c7", to: "#38bdf8", glow: "rgba(56,189,248,0.3)", text: "#bae6fd", lightText: "#0369a1" },
    Mars: { from: "#dc2626", to: "#f87171", glow: "rgba(248,113,113,0.3)", text: "#fca5a5", lightText: "#b91c1c" },
    Mercury: { from: "#059669", to: "#34d399", glow: "rgba(52,211,153,0.3)", text: "#a7f3d0", lightText: "#047857" },
    Jupiter: { from: "#d97706", to: "#fde68a", glow: "rgba(253,230,138,0.3)", text: "#fde68a", lightText: "#b45309" },
    Venus: { from: "#db2777", to: "#f472b6", glow: "rgba(244,114,182,0.3)", text: "#fbcfe8", lightText: "#be185d" },
    Saturn: { from: "#4f46e5", to: "#818cf8", glow: "rgba(129,140,248,0.3)", text: "#c7d2fe", lightText: "#4338ca" },
    Rahu: { from: "#475569", to: "#94a3b8", glow: "rgba(148,163,184,0.3)", text: "#cbd5e1", lightText: "#334155" },
    Ketu: { from: "#78716c", to: "#a8a29e", glow: "rgba(168,162,158,0.3)", text: "#d6d3d1", lightText: "#57534e" },
    Ascendant: { from: "#0891b2", to: "#22d3ee", glow: "rgba(34,211,238,0.3)", text: "#a5f3fc", lightText: "#0e7490" },
};

const PLANET_SYMBOLS: Record<string, string> = {
    Sun: "☀️", Moon: "🌙", Mars: "♂️", Mercury: "☿", Jupiter: "♃",
    Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋", Ascendant: "⊕"
};

const TABS = [
    { id: "planet-house", label: "Planet in House", icon: "🏠", desc: "How each planet shapes your life based on the house it occupies" },
    { id: "house-lord", label: "House Lord Placement", icon: "♛", desc: "The effect of each house's ruling planet sitting in another house" },
    { id: "nakshatra", label: "Planet in Nakshatra", icon: "⭐", desc: "The unique cosmic signature of each planet's Nakshatra placement" },
    { id: "ai-chat", label: "Ask AI Astrologer", icon: "✨", desc: "Consult deeply with our Navagraha AI based on your unique charts" },
];

interface Planet {
    name: string; normDegree: number; fullDegree: number;
    isRetro: string; current_sign: number; house_number: number;
}
interface Props { planetsData: Planet[]; }

export const PredictionsSection: React.FC<Props> = ({ planetsData }) => {
    const [activeTab, setActiveTab] = useState("planet-house");
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [planetFilter, setPlanetFilter] = useState<string>("All");

    // All planets including Ascendant
    const allPlanets = useMemo(() =>
        planetsData?.filter(p => p && p.name && p.current_sign) || [], [planetsData]);

    // Planets with a valid house position
    const validPlanets = useMemo(() =>
        allPlanets.filter(p => parseInt(String(p.house_number), 10) > 0), [allPlanets]);

    const planets = useMemo(() =>
        validPlanets.map(p => ({
            ...p,
            nakshatra: getNakshatraDetails(p.fullDegree),
        })), [validPlanets]);

    const filteredPlanets = planetFilter === "All"
        ? planets
        : planets.filter(p => p.name === planetFilter);

    // Planet in House predictions
    const planetHousePredictions = useMemo(() =>
        filteredPlanets.map(p => {
            const interp = PLANET_IN_HOUSE[p.name]?.[p.house_number];
            if (!interp) return null;
            return { planet: p, interp };
        }).filter(Boolean), [filteredPlanets]);

    // House Lord predictions
    const houseLordPredictions = useMemo(() => {
        const asc = allPlanets.find(p => p.name === "Ascendant");
        if (!asc) return [];
        const ascSign = parseInt(String(asc.current_sign), 10) || 1;

        return Array.from({ length: 12 }, (_, i) => {
            const houseNum = i + 1;
            const signOfHouse = ((ascSign - 1 + i) % 12) + 1;
            const lordName = SIGN_LORDS[signOfHouse];
            if (!lordName) return null;
            const lordPlanet = allPlanets.find(p => p.name === lordName);
            if (!lordPlanet) return null;
            const placedIn = parseInt(String(lordPlanet.house_number), 10);
            if (!placedIn) return null;
            const interp = HOUSE_LORD_IN_HOUSE[houseNum]?.[placedIn];
            return { houseNum, signOfHouse, lordName, placedIn, interp };
        }).filter(Boolean);
    }, [allPlanets]);

    // Nakshatra predictions
    const nakshatraPredictions = useMemo(() =>
        filteredPlanets.map(p => {
            const nk = p.nakshatra;
            const interp = PLANET_IN_NAKSHATRA[p.name]?.[nk.name];
            if (!interp) return null;
            return { planet: p, nk, interp };
        }).filter(Boolean), [filteredPlanets]);

    const PLANET_NAMES = ["All", ...Array.from(new Set(validPlanets.map(p => p.name)))];

    if (validPlanets.length === 0) {
        return (
            <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-white/10 p-12 text-center shadow-xl">
                <div className="text-5xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-300 mb-2">No Chart Data Found</h3>
                <p className="text-slate-500 dark:text-gray-400">Generate your horoscope first to see detailed planetary predictions.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white/90 dark:from-[#0c1222]/90 dark:via-[#0e1628]/90 dark:to-[#170e28]/90 backdrop-blur-2xl p-6 md:p-8 shadow-xl dark:shadow-[0_0_50px_rgba(79,70,229,0.12)] transition-colors duration-300"
            >
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.08)_0%,transparent_70%)]" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.3)] text-white">
                                <span className="text-lg">🔮</span>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent max-w-[60px]" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Detailed Planetary Predictions</h2>
                        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 max-w-lg">Plain language insights into your astrological blueprint — understand how every Graha influences your life path.</p>
                    </div>

                    {/* Planet Filter */}
                    <div className="flex flex-wrap gap-2">
                        {PLANET_NAMES.slice(0, 8).map(name => {
                            const col = PLANET_COLORS[name] || PLANET_COLORS.Sun;
                            const isActive = planetFilter === name;
                            return (
                                <motion.button
                                    key={name}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setPlanetFilter(name)}
                                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border cursor-pointer ${isActive
                                        ? "text-white border-transparent shadow-sm"
                                        : "text-slate-700 dark:text-gray-400 border-slate-300/80 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 bg-white/80 dark:bg-white/[0.02] hover:text-slate-900 dark:hover:text-white shadow-xs"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="filter-active-bg"
                                            className="absolute inset-0 rounded-full z-0"
                                            style={{
                                                background: `linear-gradient(135deg, ${col.from}, ${col.to})`,
                                                boxShadow: `0 4px 14px ${col.glow}`,
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                    <span className="relative z-10">
                                        {name !== "All" && PLANET_SYMBOLS[name] ? `${PLANET_SYMBOLS[name]} ` : ""}{name}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* Tab Bar */}
            <div className="flex gap-1 p-1.5 bg-slate-200/70 dark:bg-white/[0.03] border border-slate-300/80 dark:border-white/10 rounded-2xl backdrop-blur-md">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.id
                            ? "text-white"
                            : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                            }`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="tab-bg"
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_4px_14px_rgba(99,102,241,0.3)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10">{tab.icon}</span>
                        <span className="relative z-10 hidden md:block">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Description */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={activeTab}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="text-sm text-slate-600 dark:text-gray-400 px-1 font-medium"
                >
                    {TABS.find(t => t.id === activeTab)?.desc}
                </motion.p>
            </AnimatePresence>

            {/* Tab Content */}
            <AnimatePresence mode="wait">

                {/* ─── PLANET IN HOUSE ─── */}
                {activeTab === "planet-house" && (
                    <motion.div
                        key="planet-house"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {planetHousePredictions.length === 0 && (
                            <p className="text-slate-500 dark:text-gray-500 text-sm col-span-2 text-center py-8">No predictions available for this filter.</p>
                        )}
                        {planetHousePredictions.map((item: any, i) => {
                            const col = PLANET_COLORS[item.planet.name] || PLANET_COLORS.Sun;
                            const cardId = `ph-${item.planet.name}`;
                            const isOpen = expandedCard === cardId;

                            return (
                                <motion.div
                                    key={cardId}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    onClick={() => setExpandedCard(isOpen ? null : cardId)}
                                    className="group cursor-pointer relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0c1222]/80 backdrop-blur-xl hover:border-indigo-400/50 dark:hover:border-white/20 transition-all shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                                    style={{ boxShadow: isOpen ? `0 0 0 1.5px ${col.from}80, 0 8px 30px rgba(0,0,0,0.12)` : "" }}
                                >
                                    {/* Accent bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: `linear-gradient(to bottom, ${col.from}, ${col.to})` }} />

                                    <div className="relative z-10 p-5 pl-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                {/* Planet Orb */}
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-md text-white font-bold"
                                                    style={{ background: `linear-gradient(135deg, ${col.from}, ${col.to})`, boxShadow: `0 4px 14px ${col.glow}` }}
                                                >
                                                    {PLANET_SYMBOLS[item.planet.name] || "★"}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white text-base">{item.planet.name}</span>
                                                        {item.planet.isRetro === "true" && (
                                                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md">℞</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-xs text-slate-500 dark:text-gray-400">in the</span>
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-md border" style={{ background: `${col.from}15`, color: col.lightText, borderColor: `${col.from}30` }}>
                                                            {item.planet.house_number}{item.planet.house_number === 1 ? "st" : item.planet.house_number === 2 ? "nd" : item.planet.house_number === 3 ? "rd" : "th"} House
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                className="text-slate-400 dark:text-gray-500 mt-1 flex-shrink-0"
                                            >
                                                ▾
                                            </motion.div>
                                        </div>

                                        {/* Short preview */}
                                        <p className="text-sm text-slate-600 dark:text-gray-300 mt-3 font-medium">
                                            {item.interp.short}
                                        </p>

                                        {/* Expanded detail */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
                                                        <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed font-light">{item.interp.detail}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ─── HOUSE LORD IN HOUSE ─── */}
                {activeTab === "house-lord" && (
                    <motion.div
                        key="house-lord"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {houseLordPredictions.length === 0 && (
                            <p className="text-slate-500 dark:text-gray-500 text-sm col-span-2 text-center py-8">House lord data requires Ascendant in the chart.</p>
                        )}
                        {houseLordPredictions.map((item: any, i) => {
                            const col = PLANET_COLORS[item.lordName] || PLANET_COLORS.Sun;
                            const cardId = `hl-${item.houseNum}`;
                            const isOpen = expandedCard === cardId;
                            const ORDINALS = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

                            return (
                                <motion.div
                                    key={cardId}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    onClick={() => setExpandedCard(isOpen ? null : cardId)}
                                    className="group cursor-pointer relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0c1222]/80 backdrop-blur-xl hover:border-indigo-400/50 dark:hover:border-white/20 transition-all shadow-md"
                                >
                                    {/* Top stripe */}
                                    <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${col.from}, ${col.to})` }} />

                                    <div className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border shadow-xs"
                                                    style={{ background: `${col.from}15`, color: col.lightText, borderColor: `${col.from}35` }}>
                                                    {item.houseNum}
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider font-semibold">{ORDINALS[item.houseNum]} House Lord</div>
                                                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                                                        {PLANET_SYMBOLS[item.lordName]} {item.lordName}
                                                        <span className="text-slate-500 dark:text-gray-400 font-normal"> placed in </span>
                                                        <span className="font-bold" style={{ color: col.lightText }}>{ORDINALS[item.placedIn]} House</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-400 dark:text-gray-500">▾</motion.div>
                                        </div>

                                        {item.interp ? (
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="text-sm text-slate-700 dark:text-gray-200 mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 leading-relaxed font-light">{item.interp}</p>
                                                    </motion.div>
                                                )}
                                                {!isOpen && <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-3 font-medium">Tap to read interpretation →</p>}
                                            </AnimatePresence>
                                        ) : (
                                            <p className="text-xs text-slate-400 dark:text-gray-500 mt-3 italic">Detailed interpretation for this combination will be added soon.</p>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ─── PLANET IN NAKSHATRA ─── */}
                {activeTab === "nakshatra" && (
                    <motion.div
                        key="nakshatra"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {nakshatraPredictions.length === 0 && (
                            <p className="text-slate-500 dark:text-gray-500 text-sm col-span-2 text-center py-8">No nakshatra predictions available for this filter.</p>
                        )}
                        {nakshatraPredictions.map((item: any, i) => {
                            const col = PLANET_COLORS[item.planet.name] || PLANET_COLORS.Sun;
                            const cardId = `nk-${item.planet.name}`;
                            const isOpen = expandedCard === cardId;

                            return (
                                <motion.div
                                    key={cardId}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    onClick={() => setExpandedCard(isOpen ? null : cardId)}
                                    className="group cursor-pointer relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0c1222]/80 backdrop-blur-xl hover:border-indigo-400/50 dark:hover:border-white/20 transition-all shadow-md hover:shadow-lg"
                                >
                                    <div className="relative z-10 p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-2xl">{PLANET_SYMBOLS[item.planet.name]}</span>
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white text-base">{item.planet.name}</span>
                                                    <span className="text-slate-500 dark:text-gray-400 text-sm"> in </span>
                                                    <span className="font-bold" style={{ color: col.lightText }}>{item.nk.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-md border"
                                                    style={{ color: col.lightText, borderColor: `${col.from}40`, background: `${col.from}15` }}>
                                                    Pada {item.nk.pada}
                                                </span>
                                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-400 dark:text-gray-500">▾</motion.div>
                                            </div>
                                        </div>

                                        {/* Pada progress bar */}
                                        <div className="flex items-center gap-1.5 mb-3">
                                            {[1, 2, 3, 4].map(n => (
                                                <div
                                                    key={n}
                                                    className="h-1.5 flex-1 rounded-full transition-colors"
                                                    style={{
                                                        background: n <= item.nk.pada ? col.from : undefined,
                                                    }}
                                                >
                                                    {n > item.nk.pada && (
                                                        <div className="w-full h-full rounded-full bg-slate-200 dark:bg-white/10" />
                                                    )}
                                                </div>
                                            ))}
                                            <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 ml-1">Pada {item.nk.pada}/4</span>
                                        </div>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed pt-3 border-t border-slate-200/80 dark:border-white/10 font-light">{item.interp}</p>
                                                </motion.div>
                                            )}
                                            {!isOpen && (
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Tap to read the full Nakshatra effect →</p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ─── AI CHAT ─── */}
                {activeTab === "ai-chat" && (
                    <motion.div
                        key="ai-chat"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AIChatBox chartData={allPlanets} />
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};
