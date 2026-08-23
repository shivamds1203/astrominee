"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

interface PremiumCalendarProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
}

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── Custom Year Picker Overlay ────────────────────────────────────────────────
const YearPicker: React.FC<{
    year: number;
    onSelect: (y: number) => void;
    onClose: () => void;
}> = ({ year, onSelect, onClose }) => {
    const NOW_YEAR = new Date().getFullYear();
    const START = NOW_YEAR - 100;
    const END = NOW_YEAR + 5;
    const [decade, setDecade] = useState(Math.floor(year / 10) * 10);
    const years = Array.from({ length: 12 }, (_, i) => decade + i);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute top-0 left-0 right-0 z-50 rounded-2xl overflow-hidden bg-white/98 dark:bg-[#0c1224]/98 backdrop-blur-3xl border border-slate-200 dark:border-purple-500/30 shadow-2xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setDecade(d => Math.max(d - 10, START))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-colors cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wider">
                    {decade} — {decade + 11}
                </span>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setDecade(d => Math.min(d + 10, END))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-colors cursor-pointer"
                >
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Year grid */}
            <div className="grid grid-cols-4 gap-2 p-3">
                {years.map((y) => {
                    const isSelected = y === year;
                    const isNow = y === NOW_YEAR;
                    const disabled = y < START || y > END;
                    return (
                        <motion.button
                            key={y}
                            type="button"
                            disabled={disabled}
                            whileHover={!disabled ? { scale: 1.08 } : {}}
                            whileTap={!disabled ? { scale: 0.95 } : {}}
                            onClick={() => { onSelect(y); onClose(); }}
                            className={`py-2 rounded-xl text-sm font-semibold transition-all focus:outline-none relative overflow-hidden cursor-pointer
                                ${disabled ? "opacity-25 cursor-not-allowed text-slate-400 dark:text-gray-600" :
                                    isSelected ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md" :
                                        isNow ? "text-indigo-600 dark:text-indigo-300 border border-indigo-500/40" :
                                            "text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"}`}
                        >
                            {isSelected && (
                                <span className="absolute inset-0 rounded-xl opacity-30"
                                    style={{ background: "radial-gradient(ellipse at top, rgba(255,255,255,0.4), transparent)" }} />
                            )}
                            {y}
                        </motion.button>
                    );
                })}
            </div>

            {/* Quick jump to today's year */}
            <div className="px-3 pb-3">
                <button
                    type="button"
                    onClick={() => { onSelect(NOW_YEAR); onClose(); }}
                    className="w-full py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl transition-all hover:bg-indigo-500/10 cursor-pointer"
                >
                    Jump to {NOW_YEAR}
                </button>
            </div>
        </motion.div>
    );
};

// ─── Custom Month Picker Overlay ───────────────────────────────────────────────
const MonthPicker: React.FC<{
    month: number;
    onSelect: (m: number) => void;
    onClose: () => void;
}> = ({ month, onSelect, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="absolute top-0 left-0 right-0 z-50 rounded-2xl overflow-hidden bg-white/98 dark:bg-[#0c1224]/98 backdrop-blur-3xl border border-slate-200 dark:border-indigo-500/30 shadow-2xl"
    >
        <p className="text-center text-xs font-bold tracking-[3px] uppercase text-indigo-600 dark:text-indigo-400/70 pt-4 pb-2">Select Month</p>
        <div className="grid grid-cols-3 gap-2 p-3">
            {MONTHS_SHORT.map((m, i) => {
                const isSelected = i === month;
                return (
                    <motion.button
                        key={m}
                        type="button"
                        whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}
                        onClick={() => { onSelect(i); onClose(); }}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none cursor-pointer
                            ${isSelected ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md" : "text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"}`}
                    >
                        {m}
                    </motion.button>
                );
            })}
        </div>
    </motion.div>
);


// ─── Main Calendar ─────────────────────────────────────────────────────────────
export const PremiumCalendar: React.FC<PremiumCalendarProps> = ({ value, onChange }) => {
    const [currentDate, setCurrentDate] = useState(() => {
        if (value) {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date();
    });

    const [direction, setDirection] = useState(0);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const selectedDate = value ? (() => {
        const [y, m, d] = value.split("-").map(Number);
        return new Date(y, m - 1, d);
    })() : null;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => { setDirection(-1); setCurrentDate(new Date(year, month - 1, 1)); };
    const handleNextMonth = () => { setDirection(1); setCurrentDate(new Date(year, month + 1, 1)); };

    const handleDateClick = (day: number) => {
        const y = year;
        const m = String(month + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        onChange(`${y}-${m}-${d}`);
    };

    const today = new Date();
    const isToday = (day: number) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    const isSelected = (day: number) => selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;

    // Close pickers when clicking outside
    useEffect(() => {
        const handleClick = (e: Event) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowYearPicker(false);
                setShowMonthPicker(false);
            }
        };
        document.addEventListener("pointerdown", handleClick);
        return () => document.removeEventListener("pointerdown", handleClick);
    }, []);

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 30 : -30, opacity: 0 }),
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-sm rounded-3xl relative overflow-visible glass-strong border border-slate-200 dark:border-indigo-500/20 shadow-2xl"
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 relative z-10">
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(128,128,128,0.15)" }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handlePrevMonth} type="button"
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </motion.button>

                    {/* Month + Year buttons */}
                    <div className="flex gap-1.5 items-center relative">
                        {/* Month button */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { setShowMonthPicker(v => !v); setShowYearPicker(false); }}
                            className="px-3 py-1.5 rounded-xl font-bold text-slate-900 dark:text-white text-base hover:bg-slate-200/60 dark:hover:bg-white/8 transition-all flex items-center gap-1.5 border border-transparent hover:border-slate-300 dark:hover:border-white/10 cursor-pointer"
                            style={showMonthPicker ? { background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.3)" } : {}}
                        >
                            {MONTHS[month]}
                            <ChevronDown className={`w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 transition-transform ${showMonthPicker ? "rotate-180" : ""}`} />
                        </motion.button>

                        {/* Year button */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { setShowYearPicker(v => !v); setShowMonthPicker(false); }}
                            className="px-3 py-1.5 rounded-xl font-medium text-indigo-600 dark:text-indigo-300 text-base hover:bg-slate-200/60 dark:hover:bg-white/8 transition-all flex items-center gap-1.5 border border-transparent hover:border-slate-300 dark:hover:border-white/10 cursor-pointer"
                            style={showYearPicker ? { background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.3)" } : {}}
                        >
                            {year}
                            <ChevronDown className={`w-3.5 h-3.5 text-purple-500 dark:text-purple-400 transition-transform ${showYearPicker ? "rotate-180" : ""}`} />
                        </motion.button>

                        {/* Year picker overlay */}
                        <AnimatePresence>
                            {showYearPicker && (
                                <div className="absolute top-12 left-0 right-0 z-50 min-w-[260px]">
                                    <YearPicker
                                        year={year}
                                        onSelect={(y) => setCurrentDate(new Date(y, month, 1))}
                                        onClose={() => setShowYearPicker(false)}
                                    />
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Month picker overlay */}
                        <AnimatePresence>
                            {showMonthPicker && (
                                <div className="absolute top-12 left-0 right-0 z-50 min-w-[240px]">
                                    <MonthPicker
                                        month={month}
                                        onSelect={(m) => setCurrentDate(new Date(year, m, 1))}
                                        onClose={() => setShowMonthPicker(false)}
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handleNextMonth} type="button"
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center relative z-10">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                        <div key={d} className="text-[10px] font-bold text-slate-500 dark:text-indigo-400/60 uppercase tracking-wider py-1">{d}</div>
                    ))}
                </div>

                {/* Date grid */}
                <div className="relative h-[200px] overflow-hidden">
                    <AnimatePresence custom={direction} mode="popLayout" initial={false}>
                        <motion.div
                            key={`${year}-${month}`}
                            custom={direction}
                            variants={variants}
                            initial="enter" animate="center" exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.15 } }}
                            className="grid grid-cols-7 gap-1 text-center absolute inset-0 z-10"
                        >
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`e-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const todayF = isToday(day);
                                const selF = isSelected(day);
                                return (
                                    <motion.button
                                        key={day} type="button"
                                        onClick={() => handleDateClick(day)}
                                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                        className={`h-8 w-full flex items-center justify-center rounded-xl text-sm font-medium transition-all focus:outline-none cursor-pointer
                                            ${selF ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md" :
                                                todayF ? "text-indigo-600 dark:text-indigo-400 border border-indigo-500/40" :
                                                    "text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8"}`}
                                    >
                                        {day}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};
