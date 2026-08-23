"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Layers, Clock, Calendar } from "lucide-react";
import { DashaPeriod } from "@/lib/astrologyMath";

interface VimshottariDashaProps {
    dashas: DashaPeriod[];
}

const PLANET_COLORS: Record<string, { bg: string; text: string; border: string; glow: string; from: string; to: string }> = {
    Sun: { bg: "bg-amber-500/15 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/30", glow: "shadow-[0_0_12px_rgba(245,158,11,0.2)]", from: "#f97316", to: "#fbbf24" },
    Moon: { bg: "bg-sky-400/15 dark:bg-slate-300/20", text: "text-sky-700 dark:text-slate-200", border: "border-sky-400/30", glow: "shadow-[0_0_12px_rgba(147,197,253,0.2)]", from: "#0284c7", to: "#38bdf8" },
    Mars: { bg: "bg-rose-500/15 dark:bg-rose-500/20", text: "text-rose-700 dark:text-rose-400", border: "border-rose-500/30", glow: "shadow-[0_0_12px_rgba(244,63,94,0.2)]", from: "#dc2626", to: "#f87171" },
    Mercury: { bg: "bg-emerald-500/15 dark:bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-500/30", glow: "shadow-[0_0_12px_rgba(16,185,129,0.2)]", from: "#059669", to: "#34d399" },
    Jupiter: { bg: "bg-yellow-500/15 dark:bg-yellow-500/20", text: "text-yellow-800 dark:text-yellow-400", border: "border-yellow-500/30", glow: "shadow-[0_0_12px_rgba(234,179,8,0.2)]", from: "#d97706", to: "#fde68a" },
    Venus: { bg: "bg-pink-500/15 dark:bg-pink-500/20", text: "text-pink-700 dark:text-pink-400", border: "border-pink-500/30", glow: "shadow-[0_0_12px_rgba(236,72,153,0.2)]", from: "#db2777", to: "#f472b6" },
    Saturn: { bg: "bg-indigo-500/15 dark:bg-indigo-500/20", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-500/30", glow: "shadow-[0_0_12px_rgba(99,102,241,0.2)]", from: "#4f46e5", to: "#818cf8" },
    Rahu: { bg: "bg-purple-500/15 dark:bg-purple-500/20", text: "text-purple-700 dark:text-purple-400", border: "border-purple-500/30", glow: "shadow-[0_0_12px_rgba(168,85,247,0.2)]", from: "#475569", to: "#94a3b8" },
    Ketu: { bg: "bg-stone-500/15 dark:bg-stone-500/20", text: "text-stone-700 dark:text-stone-300", border: "border-stone-500/30", glow: "shadow-[0_0_12px_rgba(120,113,108,0.2)]", from: "#78716c", to: "#a8a29e" },
};

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
};

export const VimshottariDashaTree: React.FC<VimshottariDashaProps> = ({ dashas }) => {
    const [viewTab, setViewTab] = useState<"active" | "all" | "timeline">("all");

    // Active Mahadasha
    const activeMD = dashas.find(d => d.isActive) || dashas[0];
    const [expandedMD, setExpandedMD] = useState<string | null>(activeMD ? activeMD.planet : null);
    const [expandedAD, setExpandedAD] = useState<string | null>(() => {
        const activeAD = activeMD?.antardashas?.find(a => a.isActive);
        return activeAD ? `${activeMD?.planet}-${activeAD.planet}` : null;
    });

    const toggleMD = (planet: string) => {
        setExpandedMD(prev => (prev === planet ? null : planet));
    };

    const toggleAD = (mdPlanet: string, adPlanet: string) => {
        const key = `${mdPlanet}-${adPlanet}`;
        setExpandedAD(prev => (prev === key ? null : key));
    };

    const activeAntar = activeMD?.antardashas?.find(a => a.isActive);
    const activePrat = activeAntar?.pratyantardashas?.find(p => p.isActive);

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-yellow-500/10 flex items-center justify-center border border-amber-500/30">
                            <Clock className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Vimshottari Dasha Hierarchy</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                        120-Year Vedic planetary cycles calculated from your Moon Nakshatra.
                    </p>
                </div>

                {/* View Tabs */}
                <div className="flex p-1 bg-slate-200/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 rounded-2xl">
                    {[
                        { id: "all", label: "🪐 9 Mahadashas" },
                        { id: "active", label: "⭐ Active Phase" },
                        { id: "timeline", label: "📅 Timeline" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setViewTab(tab.id as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                viewTab === tab.id
                                    ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm font-extrabold"
                                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Active Dasha Summary Card ── */}
            {activeMD && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-purple-500/10 dark:from-[#13112c] dark:via-[#0e1628] dark:to-[#170e28] border border-amber-500/30 dark:border-indigo-500/30 shadow-xl relative overflow-hidden"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-black relative flex-shrink-0">
                                <img src={PLANET_IMAGES[activeMD.planet]} alt={activeMD.planet} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-yellow-400 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Currently Active Mahadasha
                                </span>
                                <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                                    {activeMD.planet} ({activeMD.sanskritName})
                                </h4>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-sm font-mono font-bold text-slate-900 dark:text-white block">
                                {activeMD.startFormatted} — {activeMD.endFormatted}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">{activeMD.durationYears.toFixed(1)} Years Total Duration</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200/90 dark:bg-black/60 rounded-full h-3 mb-4 overflow-hidden p-0.5 border border-slate-300/60 dark:border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(5, activeMD.progressPercent)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 h-full rounded-full shadow-md"
                        />
                    </div>

                    {/* 3-Tier Hierarchy Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/70 dark:border-white/10">
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 block mb-0.5">1. Mahadasha (Major)</span>
                            <span className="text-sm font-extrabold text-amber-700 dark:text-yellow-400">{activeMD.planet}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 block mb-0.5">2. Antardasha (Sub)</span>
                            <span className="text-sm font-extrabold text-indigo-700 dark:text-indigo-400">
                                {activeAntar ? `${activeMD.planet} - ${activeAntar.planet}` : "Calculating..."}
                            </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs">
                            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 block mb-0.5">3. Pratyantar (Sub-Sub)</span>
                            <span className="text-sm font-extrabold text-purple-700 dark:text-purple-400">
                                {activePrat ? `${activeAntar?.planet} - ${activePrat.planet}` : "Calculating..."}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── All 9 Mahadashas Expandable Tree ── */}
            {(viewTab === "all" || viewTab === "active") && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" /> 120-Year Vimshottari Tree (Click row to expand)
                        </span>
                    </div>

                    {dashas.map((md) => {
                        const isExpanded = expandedMD === md.planet;
                        const colors = PLANET_COLORS[md.planet] || PLANET_COLORS.Jupiter;

                        return (
                            <div
                                key={md.planet}
                                className={`rounded-2xl border transition-all overflow-hidden ${
                                    md.isActive
                                        ? "border-amber-400 dark:border-yellow-500/50 bg-amber-50/70 dark:bg-amber-500/5 shadow-md"
                                        : isExpanded
                                        ? "border-indigo-300 dark:border-white/20 bg-slate-50/80 dark:bg-white/[0.03] shadow-sm"
                                        : "border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-[#0c1222]/80 hover:border-slate-300 dark:hover:border-white/20"
                                }`}
                            >
                                {/* Mahadasha Header Row */}
                                <button
                                    type="button"
                                    onClick={() => toggleMD(md.planet)}
                                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-white/20 bg-black flex-shrink-0 shadow-sm">
                                            <img src={PLANET_IMAGES[md.planet]} alt={md.planet} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-base text-slate-900 dark:text-white">
                                                    {md.planet} ({md.sanskritName})
                                                </span>
                                                {md.isActive && (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                                                        Active Now
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                                                {md.durationYears.toFixed(1)} Years • {md.startFormatted} to {md.endFormatted}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-gray-300 hidden sm:inline">
                                            {md.progressPercent.toFixed(0)}%
                                        </span>
                                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronDown className="w-5 h-5 text-slate-400 dark:text-gray-400" />
                                        </motion.div>
                                    </div>
                                </button>

                                {/* Antardasha Expansion */}
                                <AnimatePresence initial={false}>
                                    {isExpanded && md.antardashas && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="border-t border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-black/40 p-3 sm:p-4 space-y-2.5"
                                        >
                                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 px-1">
                                                9 Antardashas under {md.planet} Mahadasha
                                            </p>

                                            {md.antardashas.map((ad) => {
                                                const adKey = `${md.planet}-${ad.planet}`;
                                                const isAdExpanded = expandedAD === adKey;

                                                return (
                                                    <div
                                                        key={ad.planet}
                                                        className={`rounded-xl border transition-all overflow-hidden ${
                                                            ad.isActive
                                                                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 shadow-xs"
                                                                : "border-slate-200 dark:border-white/5 bg-white/90 dark:bg-white/[0.02]"
                                                        }`}
                                                    >
                                                        {/* Antardasha Row */}
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleAD(md.planet, ad.planet)}
                                                            className="w-full p-3 flex items-center justify-between gap-2 text-left cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-6 h-6 rounded-full overflow-hidden bg-black flex-shrink-0 border border-white/20">
                                                                    <img src={PLANET_IMAGES[ad.planet]} alt={ad.planet} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                                                                            {md.planet} — {ad.planet}
                                                                        </span>
                                                                        {ad.isActive && (
                                                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-600 text-white">
                                                                                Active
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-[11px] text-slate-500 dark:text-gray-400">
                                                                        {ad.startFormatted} to {ad.endFormatted} ({(ad.durationYears * 12).toFixed(1)} mos)
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 hidden sm:inline">
                                                                    {ad.progressPercent.toFixed(0)}%
                                                                </span>
                                                                <motion.div animate={{ rotate: isAdExpanded ? 180 : 0 }}>
                                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                                </motion.div>
                                                            </div>
                                                        </button>

                                                        {/* Pratyantar Expansion */}
                                                        <AnimatePresence initial={false}>
                                                            {isAdExpanded && ad.pratyantardashas && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="border-t border-slate-200 dark:border-white/5 bg-slate-200/50 dark:bg-black/60 p-3 space-y-2"
                                                                >
                                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                                                        Pratyantardasha (Sub-Sub Periods)
                                                                    </p>

                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                                        {ad.pratyantardashas.map((pd) => (
                                                                            <div
                                                                                key={pd.planet}
                                                                                className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                                                                    pd.isActive
                                                                                        ? "bg-purple-500/20 border-purple-500/50 text-purple-900 dark:text-purple-200 font-bold"
                                                                                        : "bg-white/80 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-gray-300"
                                                                                }`}
                                                                            >
                                                                                <div className="flex items-center gap-1.5 min-w-0">
                                                                                    <div className="w-4 h-4 rounded-full overflow-hidden bg-black flex-shrink-0 border border-white/20">
                                                                                        <img src={PLANET_IMAGES[pd.planet]} alt={pd.planet} className="w-full h-full object-cover" />
                                                                                    </div>
                                                                                    <span className="truncate font-semibold">{pd.planet}</span>
                                                                                </div>
                                                                                <span className="text-[10px] text-slate-500 dark:text-gray-400 shrink-0 font-mono">
                                                                                    {pd.startFormatted.split(",")[0]}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Timeline View ── */}
            {viewTab === "timeline" && (
                <div className="space-y-4 p-5 rounded-3xl bg-white/80 dark:bg-[#0c1222]/80 border border-slate-200 dark:border-white/10 shadow-md">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">120-Year Sequential Timeline</h4>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/30">
                        {dashas.map((md, idx) => (
                            <div key={idx} className="relative flex items-start gap-3">
                                <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${md.isActive ? "bg-emerald-500 border-emerald-300 animate-ping" : "bg-indigo-500 border-white dark:border-black"}`} />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-slate-900 dark:text-white">{md.planet} Mahadasha</span>
                                        {md.isActive && <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">Active</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-gray-400">{md.startFormatted} to {md.endFormatted} ({md.durationYears} Years)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
