"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface PremiumClockProps {
    value: string; // HH:mm
    onChange: (time: string) => void;
}

// ─── Drum Roll Picker ──────────────────────────────────────────────────────────
const DrumRoll: React.FC<{
    items: string[];
    selected: string;
    onSelect: (v: string) => void;
    label: string;
    accentColor: string;
}> = ({ items, selected, onSelect, label, accentColor }) => {
    const selectedIdx = items.indexOf(selected);
    const ITEM_H = 44;
    const VISIBLE = 5;
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToIndex = useCallback((idx: number) => {
        const container = containerRef.current;
        if (!container) return;
        container.scrollTop = idx * ITEM_H;
    }, []);

    useEffect(() => {
        scrollToIndex(selectedIdx);
    }, [selectedIdx, scrollToIndex]);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        const idx = Math.round(container.scrollTop / ITEM_H);
        const clamped = Math.max(0, Math.min(idx, items.length - 1));
        onSelect(items[clamped]);
    };

    return (
        <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[2.5px] text-gray-500">{label}</span>
            <div className="relative rounded-2xl overflow-hidden"
                style={{
                    width: 72,
                    height: ITEM_H * VISIBLE,
                    background: "rgba(8,12,24,0.9)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "inset 0 8px 20px rgba(0,0,0,0.3), inset 0 -8px 20px rgba(0,0,0,0.3)",
                }}>

                {/* Fade top */}
                <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
                    style={{ height: ITEM_H * 2, background: "linear-gradient(to bottom, rgba(8,12,24,0.95) 0%, transparent 100%)" }} />

                {/* Selection highlight */}
                <div className="absolute z-10 left-0 right-0 pointer-events-none"
                    style={{
                        top: ITEM_H * 2,
                        height: ITEM_H,
                        background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}12)`,
                        borderTop: `1px solid ${accentColor}40`,
                        borderBottom: `1px solid ${accentColor}40`,
                        boxShadow: `0 0 16px ${accentColor}20`,
                    }} />

                {/* Fade bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
                    style={{ height: ITEM_H * 2, background: "linear-gradient(to top, rgba(8,12,24,0.95) 0%, transparent 100%)" }} />

                {/* Scrollable list */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="h-full overflow-y-scroll no-scrollbar"
                    style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth" }}
                >
                    {/* Padding top: 2 empty rows */}
                    <div style={{ height: ITEM_H * 2 }} />
                    {items.map((item) => {
                        const isActive = item === selected;
                        return (
                            <div
                                key={item}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    onSelect(item);
                                    scrollToIndex(items.indexOf(item));
                                }}
                                style={{ height: ITEM_H, scrollSnapAlign: "center" }}
                                className="flex items-center justify-center cursor-pointer"
                            >
                                <motion.span
                                    animate={{
                                        scale: isActive ? 1 : 0.7,
                                        opacity: isActive ? 1 : 0.3,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="font-mono font-bold select-none"
                                    style={{
                                        fontSize: isActive ? 26 : 18,
                                        color: isActive ? "#fff" : "#6b7280",
                                        textShadow: isActive ? `0 0 16px ${accentColor}` : "none",
                                    }}
                                >
                                    {item}
                                </motion.span>
                            </div>
                        );
                    })}
                    {/* Padding bottom: 2 empty rows */}
                    <div style={{ height: ITEM_H * 2 }} />
                </div>
            </div>
        </div>
    );
};

// ─── Premium Clock ─────────────────────────────────────────────────────────────
export const PremiumClock: React.FC<PremiumClockProps> = ({ value, onChange }) => {
    const [currentTime, setCurrentTime] = useState<Date>(() => {
        if (value) {
            const [h, m] = value.split(":").map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        }
        return new Date();
    });

    const [secondsDeg, setSecondsDeg] = useState(currentTime.getSeconds() * 6);

    useEffect(() => {
        const interval = setInterval(() => setSecondsDeg(prev => prev + 6), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(":").map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            setCurrentTime(d);
        }
    }, [value]);

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const hoursDeg = (hours % 12) * 30 + (minutes / 2);
    const minutesDeg = minutes * 6;

    const hourItems = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

    const handleHourChange = (h: string) => onChange(`${h}:${minutes.toString().padStart(2, "0")}`);
    const handleMinuteChange = (m: string) => onChange(`${hours.toString().padStart(2, "0")}:${m}`);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
        >
            {/* Analog clock face */}
            <motion.div
                animate={{ scale: [1, 1.018, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-44 h-44 rounded-full flex items-center justify-center"
                style={{
                    background: "radial-gradient(circle at 35% 30%, rgba(30,20,60,0.9) 0%, rgba(8,10,24,0.95) 100%)",
                    border: "1.5px solid rgba(99,102,241,0.3)",
                    boxShadow: "0 0 40px rgba(99,102,241,0.15), 0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
            >
                {/* Gradient ring glow */}
                <div className="absolute inset-0 rounded-full"
                    style={{
                        background: "conic-gradient(from 0deg, transparent 0%, rgba(99,102,241,0.15) 30%, rgba(139,92,246,0.2) 60%, transparent 100%)",
                    }} />

                {/* Tick marks */}
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-full h-full p-2.5" style={{ transform: `rotate(${i * 30}deg)` }}>
                        <div className={`mx-auto rounded-full ${i % 3 === 0 ? "w-1 h-3 bg-indigo-400/70" : "w-0.5 h-2 bg-white/20"}`} />
                    </div>
                ))}

                {/* Hour hand */}
                <motion.div
                    className="absolute rounded-full origin-bottom bg-white"
                    style={{ width: 3, height: 42, bottom: "50%", left: "50%", x: "-50%", borderRadius: 4 }}
                    animate={{ rotate: hoursDeg }}
                    transition={{ type: "spring", stiffness: 60, damping: 12 }}
                />

                {/* Minute hand */}
                <motion.div
                    className="absolute origin-bottom bg-indigo-300 rounded-full"
                    style={{ width: 2, height: 56, bottom: "50%", left: "50%", x: "-50%" }}
                    animate={{ rotate: minutesDeg }}
                    transition={{ type: "spring", stiffness: 60, damping: 12 }}
                />

                {/* Second hand */}
                <motion.div
                    className="absolute origin-bottom rounded-full"
                    style={{
                        width: 1.5, height: 62, bottom: "50%", left: "50%", x: "-50%",
                        background: "#22d3ee",
                        boxShadow: "0 0 8px rgba(34,211,238,0.9)",
                    }}
                    animate={{ rotate: secondsDeg }}
                    transition={{ ease: "linear", duration: 1 }}
                />

                {/* Center dot */}
                <div className="absolute w-3.5 h-3.5 rounded-full z-10" style={{ background: "radial-gradient(circle, #fff 0%, #6366f1 100%)", boxShadow: "0 0 12px rgba(99,102,241,0.8)" }} />
            </motion.div>

            {/* Drum roll time pickers */}
            <div className="flex items-center gap-3">
                <DrumRoll
                    items={hourItems}
                    selected={hours.toString().padStart(2, "0")}
                    onSelect={handleHourChange}
                    label="Hour"
                    accentColor="#6366f1"
                />

                {/* Colon separator */}
                <div className="flex flex-col gap-2 pb-1">
                    {[0, 1].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.5 }}
                        />
                    ))}
                </div>

                <DrumRoll
                    items={minuteItems}
                    selected={minutes.toString().padStart(2, "0")}
                    onSelect={handleMinuteChange}
                    label="Minute"
                    accentColor="#8b5cf6"
                />
            </div>

            {/* Current time display */}
            <motion.div
                key={`${hours}:${minutes}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-mono text-indigo-400/60 tracking-widest"
            >
                {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")} {hours < 12 ? "AM" : "PM"}
            </motion.div>
        </motion.div>
    );
};
