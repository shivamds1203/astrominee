"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Clock, Sparkles, Calendar, Layers } from "lucide-react";
import { DashaPeriod } from "@/lib/astrologyMath";

interface VimshottariDashaProps {
    dashas: DashaPeriod[];
}

const PLANET_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    Sun: { bg: "bg-amber-500/15 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30", glow: "shadow-[0_0_12px_rgba(245,158,11,0.2)]" },
    Moon: { bg: "bg-blue-400/15 dark:bg-slate-300/20", text: "text-blue-600 dark:text-slate-200", border: "border-blue-400/30", glow: "shadow-[0_0_12px_rgba(147,197,253,0.2)]" },
    Mars: { bg: "bg-rose-500/15 dark:bg-rose-500/20", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30", glow: "shadow-[0_0_12px_rgba(244,63,94,0.2)]" },
    Mercury: { bg: "bg-emerald-500/15 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30", glow: "shadow-[0_0_12px_rgba(16,185,129,0.2)]" },
    Jupiter: { bg: "bg-yellow-500/15 dark:bg-yellow-500/20", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-500/30", glow: "shadow-[0_0_12px_rgba(234,179,8,0.2)]" },
    Venus: { bg: "bg-pink-500/15 dark:bg-pink-500/20", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/30", glow: "shadow-[0_0_12px_rgba(236,72,153,0.2)]" },
    Saturn: { bg: "bg-indigo-500/15 dark:bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30", glow: "shadow-[0_0_12px_rgba(99,102,241,0.2)]" },
    Rahu: { bg: "bg-purple-500/15 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30", glow: "shadow-[0_0_12px_rgba(168,85,247,0.2)]" },
    Ketu: { bg: "bg-stone-500/15 dark:bg-stone-500/20", text: "text-stone-600 dark:text-stone-300", border: "border-stone-500/30", glow: "shadow-[0_0_12px_rgba(120,113,108,0.2)]" },
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
    // Find active Mahadasha
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

    // Find active Antardasha and Pratyantar for summary card
    const activeAntar = activeMD?.antardashas?.find(a => a.isActive);
    const activePrat = activeAntar?.pratyantardashas?.find(p => p.isActive);

    return (
        <div className="flex flex-col gap-5">
            {/* ── Active Dasha Summary Header ── */}
            {activeMD && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-purple-500/10 dark:from-[#13112c] dark:via-[#0e1628] dark:to-[#170e28] border border-amber-500/30 dark:border-indigo-500/30 shadow-lg relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 shadow-md bg-black relative flex-shrink-0">
                                <img src={PLANET_IMAGES[activeMD.planet]} alt={activeMD.planet} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-yellow-400 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Vimshottari Dasha
                                </span>
                                <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                    {activeMD.planet} ({activeMD.sanskritName}) <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Mahadasha</span>
                                </h4>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-xs font-mono font-bold text-slate-700 dark:text-gray-300">
                                {activeMD.startFormatted} — {activeMD.endFormatted}
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-gray-400">{activeMD.durationYears.toFixed(1)} Years Total</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-black/60 rounded-full h-2.5 mb-3 overflow-hidden p-0.5 border border-slate-300/60 dark:border-white/10">
                        <div
                            className="bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, activeMD.progressPercent)}%` }}
                        />
                    </div>

                    {/* Hierarchy Pill breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-white/5">
                        <div className="p-2 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-gray-400 block">Mahadasha (Major)</span>
                            <span className="text-xs font-bold text-amber-700 dark:text-yellow-400">{activeMD.planet}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-gray-400 block">Antardasha (Sub)</span>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">{activeAntar?.planet || "Calculating"}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-gray-400 block">Pratyantardasha (Sub-Sub)</span>
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-300">{activePrat?.planet || "Calculating"}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── All 9 Mahadashas Expandable Tree ── */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> Full 120-Year Vimshottari Timeline
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Click to expand Antardasha & Pratyantar</span>
                </div>

                {dashas.map((md) => {
                    const isExpanded = expandedMD === md.planet;
                    const colors = PLANET_COLORS[md.planet] || PLANET_COLORS.Jupiter;

                    return (
                        <div
                            key={md.planet}
                            className={`rounded-2xl border transition-all overflow-hidden ${
                                md.isActive
                                    ? "border-amber-400/80 dark:border-yellow-500/50 bg-amber-50/40 dark:bg-amber-500/5 shadow-md"
                                    : isExpanded
                                    ? "border-indigo-300 dark:border-white/20 bg-slate-50/60 dark:bg-white/[0.03]"
                                    : "border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.01] hover:border-slate-300 dark:hover:border-white/20"
                            }`}
                        >
                            {/* Mahadasha Header Row */}
                            <button
                                type="button"
                                onClick={() => toggleMD(md.planet)}
                                className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-3 text-left cursor-pointer select-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-black flex-shrink-0 shadow-sm">
                                        <img src={PLANET_IMAGES[md.planet]} alt={md.planet} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                                {md.planet} ({md.sanskritName})
                                            </span>
                                            {md.isActive && (
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-gray-400">
                                            {md.durationYears.toFixed(1)} yrs • {md.startFormatted} — {md.endFormatted}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-semibold text-slate-600 dark:text-gray-300 hidden sm:inline">
                                        {md.progressPercent.toFixed(0)}%
                                    </span>
                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-gray-400" />
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
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="border-t border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-black/40 p-3 sm:p-4 space-y-2"
                                    >
                                        <div className="flex items-center justify-between pb-1">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                                                9 Antardashas under {md.planet} Mahadasha
                                            </p>
                                            <span className="text-[10px] text-slate-500 dark:text-gray-400">Sub-periods</span>
                                        </div>

                                        {md.antardashas.map((ad) => {
                                            const adKey = `${md.planet}-${ad.planet}`;
                                            const isAdExpanded = expandedAD === adKey;

                                            return (
                                                <div
                                                    key={ad.planet}
                                                    className={`rounded-xl border transition-all overflow-hidden ${
                                                        ad.isActive
                                                            ? "border-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 shadow-sm"
                                                            : "border-slate-200 dark:border-white/5 bg-white/80 dark:bg-white/[0.02]"
                                                    }`}
                                                >
                                                    {/* Antardasha Row */}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleAD(md.planet, ad.planet)}
                                                        className="w-full p-2.5 sm:p-3 flex items-center justify-between gap-2 text-left cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-6 h-6 rounded-full overflow-hidden bg-black flex-shrink-0 border border-white/20">
                                                                <img src={PLANET_IMAGES[ad.planet]} alt={ad.planet} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
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
                                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                                            </motion.div>
                                                        </div>
                                                    </button>

                                                    {/* Pratyantardasha (Sub-Sub Period) Expansion */}
                                                    <AnimatePresence initial={false}>
                                                        {isAdExpanded && ad.pratyantardashas && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                                                className="border-t border-slate-200 dark:border-white/5 bg-slate-200/40 dark:bg-black/60 p-2.5 space-y-1.5"
                                                            >
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 px-1">
                                                                    Pratyantardasha (Sub-Sub Periods)
                                                                </p>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                                                                    {ad.pratyantardashas.map((pd) => (
                                                                        <div
                                                                            key={pd.planet}
                                                                            className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-1.5 ${
                                                                                pd.isActive
                                                                                    ? "bg-purple-500/20 border-purple-500/50 text-purple-900 dark:text-purple-200 font-bold"
                                                                                    : "bg-white/60 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-gray-300"
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                                <div className="w-4 h-4 rounded-full overflow-hidden bg-black flex-shrink-0 border border-white/20">
                                                                                    <img src={PLANET_IMAGES[pd.planet]} alt={pd.planet} className="w-full h-full object-cover" />
                                                                                </div>
                                                                                <span className="truncate">{pd.planet}</span>
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
        </div>
    );
};
