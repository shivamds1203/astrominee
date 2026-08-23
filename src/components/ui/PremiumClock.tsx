"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock, Sun, Moon } from "lucide-react";

interface PremiumClockProps {
    value: string; // HH:mm (24h)
    onChange: (time: string) => void;
}

// ─── Smooth Drum Roll Picker ──────────────────────────────────────────────────
const DrumRoll: React.FC<{
    items: string[];
    selected: string;
    onSelect: (v: string) => void;
    label: string;
    accentColor: string;
}> = ({ items, selected, onSelect, label, accentColor }) => {
    const ITEM_H = 46;
    const VISIBLE = 5;
    const containerRef = useRef<HTMLDivElement>(null);
    const isUserScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToIndex = useCallback((idx: number, smooth = true) => {
        const container = containerRef.current;
        if (!container) return;
        container.scrollTo({
            top: idx * ITEM_H,
            behavior: smooth ? "smooth" : "auto",
        });
    }, []);

    // Sync only when not actively scrolling by user
    useEffect(() => {
        if (!isUserScrollingRef.current) {
            const idx = items.indexOf(selected);
            if (idx !== -1) {
                scrollToIndex(idx, true);
            }
        }
    }, [selected, items, scrollToIndex]);

    const handleScroll = () => {
        isUserScrollingRef.current = true;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        scrollTimeoutRef.current = setTimeout(() => {
            isUserScrollingRef.current = false;
            const container = containerRef.current;
            if (!container) return;
            const idx = Math.round(container.scrollTop / ITEM_H);
            const clamped = Math.max(0, Math.min(idx, items.length - 1));
            onSelect(items[clamped]);
            scrollToIndex(clamped, true);
        }, 120);
    };

    const handleItemClick = (item: string, idx: number) => {
        onSelect(item);
        scrollToIndex(idx, true);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500 dark:text-gray-400">
                {label}
            </span>
            <div
                className="relative rounded-2xl overflow-hidden bg-slate-100/90 dark:bg-[#080c18]/90 border border-slate-300/80 dark:border-white/10 shadow-inner select-none"
                style={{
                    width: 78,
                    height: ITEM_H * VISIBLE,
                }}
            >
                {/* Fade top */}
                <div
                    className="absolute top-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-b from-slate-100 dark:from-[#080c18] to-transparent"
                    style={{ height: ITEM_H * 1.8 }}
                />

                {/* Selection highlight frame */}
                <div
                    className="absolute z-10 left-1 right-1 pointer-events-none rounded-xl"
                    style={{
                        top: ITEM_H * 2,
                        height: ITEM_H,
                        background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`,
                        border: `1.5px solid ${accentColor}60`,
                        boxShadow: `0 0 20px ${accentColor}25`,
                    }}
                />

                {/* Fade bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-t from-slate-100 dark:from-[#080c18] to-transparent"
                    style={{ height: ITEM_H * 1.8 }}
                />

                {/* Scrollable list */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-auto no-scrollbar touch-pan-y"
                    style={{ scrollSnapType: "y mandatory" }}
                >
                    {/* Top padding spacer */}
                    <div style={{ height: ITEM_H * 2 }} />

                    {items.map((item, idx) => {
                        const isActive = item === selected;
                        return (
                            <div
                                key={item}
                                onClick={() => handleItemClick(item, idx)}
                                style={{ height: ITEM_H, scrollSnapAlign: "center" }}
                                className="flex items-center justify-center cursor-pointer transition-transform"
                            >
                                <span
                                    className={`font-mono transition-all duration-150 ${
                                        isActive
                                            ? "text-2xl font-black text-slate-900 dark:text-white scale-110"
                                            : "text-sm text-slate-400 dark:text-gray-500 font-medium hover:text-slate-700 dark:hover:text-gray-300"
                                    }`}
                                >
                                    {item}
                                </span>
                            </div>
                        );
                    })}

                    {/* Bottom padding spacer */}
                    <div style={{ height: ITEM_H * 2 }} />
                </div>
            </div>
        </div>
    );
};

// ─── Analog Clock Display ─────────────────────────────────────────────────────
const AnalogClock: React.FC<{ hour: number; minute: number }> = ({ hour, minute }) => {
    const minuteDeg = (minute / 60) * 360;
    const hourDeg = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

    return (
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full mx-auto p-2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-white/5 dark:to-white/[0.02] border border-slate-300/80 dark:border-white/10 shadow-lg flex items-center justify-center">
            {/* Clock Face Inner */}
            <div className="relative w-full h-full rounded-full bg-white dark:bg-[#060a16] shadow-inner flex items-center justify-center border border-slate-200 dark:border-white/5">
                {/* 12-Hour Tick Marks */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <div
                        key={deg}
                        className="absolute w-full h-full flex justify-center pointer-events-none"
                        style={{ transform: `rotate(${deg}deg)` }}
                    >
                        <div
                            className={`rounded-full ${
                                deg % 90 === 0
                                    ? "w-1 h-3 bg-indigo-500 dark:bg-indigo-400 mt-1"
                                    : "w-0.5 h-1.5 bg-slate-300 dark:bg-gray-700 mt-1.5"
                            }`}
                        />
                    </div>
                ))}

                {/* Hour Hand */}
                <div
                    className="absolute w-1.5 h-10 bg-slate-800 dark:bg-white rounded-full origin-bottom shadow-sm z-10 transition-transform duration-300"
                    style={{
                        transform: `translateY(-50%) rotate(${hourDeg}deg)`,
                        bottom: "50%",
                    }}
                />

                {/* Minute Hand */}
                <div
                    className="absolute w-1 h-14 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-full origin-bottom shadow-md z-20 transition-transform duration-300"
                    style={{
                        transform: `translateY(-50%) rotate(${minuteDeg}deg)`,
                        bottom: "50%",
                    }}
                />

                {/* Center Pivot */}
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white dark:border-black shadow-md z-30" />
            </div>
        </div>
    );
};

// ─── Main Premium Clock Component ─────────────────────────────────────────────
const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const QUICK_PRESETS = [
    { label: "Dawn", time: "06:00" },
    { label: "Morning", time: "09:30" },
    { label: "Noon", time: "12:00" },
    { label: "Afternoon", time: "15:30" },
    { label: "Sunset", time: "18:00" },
    { label: "Night", time: "21:30" },
];

export const PremiumClock: React.FC<PremiumClockProps> = ({ value, onChange }) => {
    // Parse HH:mm
    const [h24Str, mStr] = (value || "09:30").split(":");
    const rawH24 = parseInt(h24Str || "9", 10);
    const minuteVal = parseInt(mStr || "30", 10);

    const isPM = rawH24 >= 12;
    const h12 = rawH24 % 12 === 0 ? 12 : rawH24 % 12;
    const hourStr12 = String(h12).padStart(2, "0");
    const minuteStr = String(minuteVal).padStart(2, "0");

    const updateTime = (newH12: number, newMin: number, newIsPM: boolean) => {
        let finalH24 = newH12 % 12;
        if (newIsPM) finalH24 += 12;
        const timeStr = `${String(finalH24).padStart(2, "0")}:${String(newMin).padStart(2, "0")}`;
        onChange(timeStr);
    };

    return (
        <div className="flex flex-col gap-5 select-none">
            {/* Analog Clock Face */}
            <AnalogClock hour={rawH24} minute={minuteVal} />

            {/* Time Controls Row */}
            <div className="flex items-center justify-center gap-4">
                {/* Hours Drum */}
                <DrumRoll
                    items={HOURS_12}
                    selected={hourStr12}
                    onSelect={(h) => updateTime(parseInt(h, 10), minuteVal, isPM)}
                    label="Hour"
                    accentColor="#6366f1"
                />

                <span className="text-2xl font-bold text-slate-400 dark:text-gray-600 mt-5">:</span>

                {/* Minutes Drum */}
                <DrumRoll
                    items={MINUTES}
                    selected={minuteStr}
                    onSelect={(m) => updateTime(h12, parseInt(m, 10), isPM)}
                    label="Minute"
                    accentColor="#8b5cf6"
                />

                {/* AM / PM Toggle Column */}
                <div className="flex flex-col items-center gap-2 mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500 dark:text-gray-400">
                        Period
                    </span>
                    <div className="flex flex-col gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#080c18] border border-slate-300/80 dark:border-white/10">
                        <button
                            type="button"
                            onClick={() => updateTime(h12, minuteVal, false)}
                            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                !isPM
                                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <Sun className="w-3.5 h-3.5" /> AM
                        </button>
                        <button
                            type="button"
                            onClick={() => updateTime(h12, minuteVal, true)}
                            className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                isPM
                                    ? "bg-indigo-600 text-white shadow-md font-extrabold"
                                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <Moon className="w-3.5 h-3.5" /> PM
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Presets Chips */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-white/5">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {QUICK_PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => onChange(preset.time)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                value === preset.time
                                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
