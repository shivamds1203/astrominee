"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Plus, Minus } from "lucide-react";

interface PremiumClockProps {
    value: string; // HH:mm (24h format, e.g. "09:33")
    onChange: (time: string) => void;
}

const QUICK_PRESETS = [
    { label: "Dawn", time: "06:00" },
    { label: "Morning", time: "09:30" },
    { label: "Noon", time: "12:00" },
    { label: "Evening", time: "18:00" },
    { label: "Night", time: "21:30" },
];

export const PremiumClock: React.FC<PremiumClockProps> = ({ value, onChange }) => {
    const [mode, setMode] = useState<"hours" | "minutes">("hours");

    // Parse value (HH:mm in 24hr format)
    const [h24Str, mStr] = (value || "09:30").split(":");
    const rawH24 = parseInt(h24Str || "9", 10);
    const currentMin = parseInt(mStr || "30", 10);

    const isPM = rawH24 >= 12;
    const currentH12 = rawH24 % 12 === 0 ? 12 : rawH24 % 12;

    const setTime = (newH12: number, newMin: number, newIsPM: boolean) => {
        let finalH24 = newH12 % 12;
        if (newIsPM) finalH24 += 12;
        const timeStr = `${String(finalH24).padStart(2, "0")}:${String(newMin).padStart(2, "0")}`;
        onChange(timeStr);
    };

    const handleHourSelect = (h: number) => {
        setTime(h, currentMin, isPM);
        // Automatically switch to minutes for a fluid flow
        setMode("minutes");
    };

    const handleMinuteSelect = (m: number) => {
        setTime(currentH12, m, isPM);
    };

    const stepHour = (delta: number) => {
        let nextH12 = ((currentH12 - 1 + delta + 12) % 12) + 1;
        setTime(nextH12, currentMin, isPM);
    };

    const stepMinute = (delta: number) => {
        let nextMin = (currentMin + delta + 60) % 60;
        setTime(currentH12, nextMin, isPM);
    };

    // Calculate hand angle in degrees
    const hourAngle = (currentH12 % 12) * 30; // 360 / 12 = 30 deg per hour
    const minuteAngle = currentMin * 6;       // 360 / 60 = 6 deg per minute
    const currentAngle = mode === "hours" ? hourAngle : minuteAngle;

    // SVG Dial positions
    const radius = 68;
    const center = 100;

    return (
        <div className="flex flex-col items-center gap-4 w-full select-none">
            {/* ─── Digital Time Display Header ─── */}
            <div className="flex items-center justify-center gap-2 w-full">
                <div className="flex items-center bg-slate-100 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-300/80 dark:border-white/10 shadow-inner">
                    {/* Hour Box */}
                    <button
                        type="button"
                        onClick={() => setMode("hours")}
                        className={`px-3.5 py-1.5 rounded-xl font-mono text-2xl md:text-3xl font-black transition-all cursor-pointer ${
                            mode === "hours"
                                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                                : "text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        {String(currentH12).padStart(2, "0")}
                    </button>

                    <span className="text-xl font-black text-slate-400 dark:text-gray-500 px-1 font-mono animate-pulse">
                        :
                    </span>

                    {/* Minute Box */}
                    <button
                        type="button"
                        onClick={() => setMode("minutes")}
                        className={`px-3.5 py-1.5 rounded-xl font-mono text-2xl md:text-3xl font-black transition-all cursor-pointer ${
                            mode === "minutes"
                                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                                : "text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        {String(currentMin).padStart(2, "0")}
                    </button>
                </div>

                {/* AM / PM Selector */}
                <div className="flex flex-col gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-300/80 dark:border-white/10">
                    <button
                        type="button"
                        onClick={() => setTime(currentH12, currentMin, false)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                            !isPM
                                ? "bg-amber-500 text-slate-950 font-extrabold shadow-sm scale-102"
                                : "text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                    >
                        <Sun className="w-3 h-3" /> AM
                    </button>
                    <button
                        type="button"
                        onClick={() => setTime(currentH12, currentMin, true)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                            isPM
                                ? "bg-indigo-600 text-white font-extrabold shadow-sm scale-102"
                                : "text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                    >
                        <Moon className="w-3 h-3" /> PM
                    </button>
                </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <button
                    type="button"
                    onClick={() => setMode("hours")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        mode === "hours"
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    Select Hour
                </button>
                <button
                    type="button"
                    onClick={() => setMode("minutes")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        mode === "minutes"
                            ? "bg-purple-600 text-white shadow-xs"
                            : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                    Select Minute
                </button>
            </div>

            {/* ─── Interactive Radial Clock Dial (SVG) ─── */}
            <div className="relative w-52 h-52 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-[#080d1e] dark:via-[#0c1228] dark:to-[#080d1e] border-2 border-indigo-500/20 dark:border-indigo-500/30 shadow-xl flex items-center justify-center p-2">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Dial Center Glow */}
                    <circle cx="100" cy="100" r="88" className="fill-slate-50/50 dark:fill-white/[0.02]" />

                    {/* Clock Hand Line */}
                    <line
                        x1="100"
                        y1="100"
                        x2={100 + radius * Math.sin((currentAngle * Math.PI) / 180)}
                        y2={100 - radius * Math.cos((currentAngle * Math.PI) / 180)}
                        className={mode === "hours" ? "stroke-indigo-600 dark:stroke-indigo-400" : "stroke-purple-600 dark:stroke-purple-400"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />

                    {/* Active Selection Endpoint Bead */}
                    <circle
                        cx={100 + radius * Math.sin((currentAngle * Math.PI) / 180)}
                        cy={100 - radius * Math.cos((currentAngle * Math.PI) / 180)}
                        r="14"
                        className={mode === "hours" ? "fill-indigo-600 dark:fill-indigo-500" : "fill-purple-600 dark:fill-purple-500"}
                        filter="drop-shadow(0 2px 6px rgba(99,102,241,0.5))"
                    />

                    {/* Center Pin */}
                    <circle cx="100" cy="100" r="4" className="fill-amber-500 stroke-white dark:stroke-slate-900" strokeWidth="1.5" />
                </svg>

                {/* Interactive Clickable Number Nodes */}
                <AnimatePresence mode="wait">
                    {mode === "hours" ? (
                        <motion.div
                            key="hours-dial"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
                                const angle = (h * 30 - 90) * (Math.PI / 180);
                                const x = 50 + 34 * Math.cos(angle);
                                const y = 50 + 34 * Math.sin(angle);
                                const isSelected = h === currentH12;

                                return (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => handleHourSelect(h)}
                                        style={{ left: `${x}%`, top: `${y}%` }}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold pointer-events-auto transition-all cursor-pointer ${
                                            isSelected
                                                ? "text-white font-black z-30"
                                                : "text-slate-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 hover:scale-120"
                                        }`}
                                    >
                                        {h}
                                    </button>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="minutes-dial"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => {
                                const angle = (m * 6 - 90) * (Math.PI / 180);
                                const x = 50 + 34 * Math.cos(angle);
                                const y = 50 + 34 * Math.sin(angle);
                                const isSelected = m === currentMin;

                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => handleMinuteSelect(m)}
                                        style={{ left: `${x}%`, top: `${y}%` }}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold pointer-events-auto transition-all cursor-pointer ${
                                            isSelected
                                                ? "text-white font-black z-30"
                                                : "text-slate-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300 hover:scale-120"
                                        }`}
                                    >
                                        {String(m).padStart(2, "0")}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Fine-Tuning Steppers */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-gray-400">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-xl border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] uppercase text-slate-400 mr-1">Hour</span>
                    <button
                        type="button"
                        onClick={() => stepHour(-1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center shadow-xs cursor-pointer"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <button
                        type="button"
                        onClick={() => stepHour(1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center shadow-xs cursor-pointer"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-xl border border-slate-200 dark:border-white/10">
                    <span className="text-[10px] uppercase text-slate-400 mr-1">Min</span>
                    <button
                        type="button"
                        onClick={() => stepMinute(-1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center shadow-xs cursor-pointer"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <button
                        type="button"
                        onClick={() => stepMinute(1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center shadow-xs cursor-pointer"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Quick Presets Strip */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/80 dark:border-white/5 w-full">
                {QUICK_PRESETS.map((preset) => (
                    <button
                        key={preset.label}
                        type="button"
                        onClick={() => onChange(preset.time)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            value === preset.time
                                ? "bg-indigo-600 text-white shadow-xs font-bold"
                                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
                        }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
