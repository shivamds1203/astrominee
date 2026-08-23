"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from "lucide-react";

interface PremiumCalendarProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DECADES = [
    { label: "2020s", start: 2020 },
    { label: "2010s", start: 2010 },
    { label: "2000s", start: 2000 },
    { label: "1990s", start: 1990 },
    { label: "1980s", start: 1980 },
    { label: "1970s", start: 1970 },
    { label: "1960s", start: 1960 },
    { label: "1950s", start: 1950 },
];

// ─── Fast Smooth Year Picker Overlay ──────────────────────────────────────────
const YearPicker: React.FC<{
    year: number;
    onSelect: (y: number) => void;
    onClose: () => void;
}> = ({ year, onSelect, onClose }) => {
    const NOW_YEAR = new Date().getFullYear();
    const [decade, setDecade] = useState(Math.floor(year / 10) * 10);
    const years = Array.from({ length: 10 }, (_, i) => decade + i);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 z-50 rounded-3xl overflow-hidden bg-white/98 dark:bg-[#0c1224]/98 backdrop-blur-3xl border border-slate-200 dark:border-purple-500/30 shadow-2xl p-4 flex flex-col justify-between"
        >
            {/* Header / Decade Navigator */}
            <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                    <button
                        type="button"
                        onClick={() => setDecade((d) => Math.max(d - 10, 1940))}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-indigo-600 dark:text-purple-300 hover:bg-indigo-50 dark:hover:bg-purple-500/20 transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-base font-bold text-slate-900 dark:text-white tracking-wider">
                        {decade} — {decade + 9}
                    </span>
                    <button
                        type="button"
                        onClick={() => setDecade((d) => Math.min(d + 10, NOW_YEAR + 10))}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-indigo-600 dark:text-purple-300 hover:bg-indigo-50 dark:hover:bg-purple-500/20 transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Decade Quick Jump Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
                    {DECADES.map((d) => (
                        <button
                            key={d.label}
                            type="button"
                            onClick={() => setDecade(d.start)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                decade === d.start
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
                            }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>

                {/* 10-Year Grid */}
                <div className="grid grid-cols-5 gap-2 pt-2">
                    {years.map((y) => {
                        const isSelected = y === year;
                        const isNow = y === NOW_YEAR;
                        return (
                            <button
                                key={y}
                                type="button"
                                onClick={() => {
                                    onSelect(y);
                                    onClose();
                                }}
                                className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                                        : isNow
                                        ? "border border-indigo-500/50 text-indigo-600 dark:text-indigo-300 font-bold bg-indigo-50/50 dark:bg-indigo-500/10"
                                        : "bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/10"
                                }`}
                            >
                                {y}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Jump to Today button */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={() => {
                        onSelect(NOW_YEAR);
                        onClose();
                    }}
                    className="w-full py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl transition-all hover:bg-indigo-500/10 cursor-pointer"
                >
                    Jump to Current Year ({NOW_YEAR})
                </button>
            </div>
        </motion.div>
    );
};

// ─── Fast Smooth Month Picker Overlay ─────────────────────────────────────────
const MonthPicker: React.FC<{
    month: number;
    onSelect: (m: number) => void;
    onClose: () => void;
}> = ({ month, onSelect, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute inset-0 z-50 rounded-3xl overflow-hidden bg-white/98 dark:bg-[#0c1224]/98 backdrop-blur-3xl border border-slate-200 dark:border-indigo-500/30 shadow-2xl p-4 flex flex-col justify-between"
    >
        <p className="text-center text-xs font-bold tracking-[3px] uppercase text-indigo-600 dark:text-indigo-400/70 pt-2">
            Select Birth Month
        </p>
        <div className="grid grid-cols-3 gap-2 p-2">
            {MONTHS_SHORT.map((m, i) => {
                const isSelected = i === month;
                return (
                    <button
                        key={m}
                        type="button"
                        onClick={() => {
                            onSelect(i);
                            onClose();
                        }}
                        className={`py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                            isSelected
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                                : "bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10"
                        }`}
                    >
                        {m}
                    </button>
                );
            })}
        </div>
        <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
        >
            Cancel
        </button>
    </motion.div>
);

// ─── Main Calendar Component ──────────────────────────────────────────────────
export const PremiumCalendar: React.FC<PremiumCalendarProps> = ({ value, onChange }) => {
    const today = new Date();
    const initialDate = value ? new Date(value) : new Date(2000, 0, 1);

    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear() || 2000);
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth() || 0);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    // Selected date components
    const [selectedYear, selectedMonth, selectedDay] = (value || "2000-01-01")
        .split("-")
        .map((n) => parseInt(n, 10));

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    };

    const handleDateClick = (day: number) => {
        const yStr = String(currentYear);
        const mStr = String(currentMonth + 1).padStart(2, "0");
        const dStr = String(day).padStart(2, "0");
        onChange(`${yStr}-${mStr}-${dStr}`);
    };

    return (
        <div className="relative p-4 md:p-5 rounded-3xl bg-white/95 dark:bg-[#070b18]/95 border border-slate-200/90 dark:border-white/10 shadow-xl select-none min-h-[360px] flex flex-col justify-between">
            {/* Year Picker Overlay */}
            <AnimatePresence>
                {showYearPicker && (
                    <YearPicker
                        year={currentYear}
                        onSelect={(y) => setCurrentYear(y)}
                        onClose={() => setShowYearPicker(false)}
                    />
                )}
            </AnimatePresence>

            {/* Month Picker Overlay */}
            <AnimatePresence>
                {showMonthPicker && (
                    <MonthPicker
                        month={currentMonth}
                        onSelect={(m) => setCurrentMonth(m)}
                        onClose={() => setShowMonthPicker(false)}
                    />
                )}
            </AnimatePresence>

            {/* Top Navigation Bar */}
            <div>
                <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100 dark:border-white/5">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Month & Year Selectors */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowMonthPicker(true);
                                setShowYearPicker(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-800 dark:text-white font-bold text-sm transition-all border border-slate-200 dark:border-white/10 cursor-pointer flex items-center gap-1.5"
                        >
                            {MONTHS[currentMonth]}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowYearPicker(true);
                                setShowMonthPicker(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-500/20 text-slate-800 dark:text-white font-bold text-sm transition-all border border-slate-200 dark:border-white/10 cursor-pointer flex items-center gap-1.5"
                        >
                            {currentYear}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
                        <div
                            key={d}
                            className={`text-[11px] font-bold py-1 ${
                                i === 0 ? "text-rose-500" : "text-slate-400 dark:text-gray-500"
                            }`}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Empty Slots */}
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-9" />
                    ))}

                    {/* Active Month Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const isSelected =
                            selectedYear === currentYear &&
                            selectedMonth === currentMonth + 1 &&
                            selectedDay === dayNum;

                        const isToday =
                            today.getFullYear() === currentYear &&
                            today.getMonth() === currentMonth &&
                            today.getDate() === dayNum;

                        return (
                            <button
                                key={dayNum}
                                type="button"
                                onClick={() => handleDateClick(dayNum)}
                                className={`h-9 rounded-xl text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${
                                    isSelected
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md scale-105"
                                        : isToday
                                        ? "border border-indigo-500/50 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 font-bold"
                                        : "text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/10"
                                }`}
                            >
                                {dayNum}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected date quick confirmation strip */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                <span>Selected:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {value ? new Date(value + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "None"}
                </span>
            </div>
        </div>
    );
};
