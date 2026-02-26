"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PremiumCalendarProps {
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
}

export const PremiumCalendar: React.FC<PremiumCalendarProps> = ({ value, onChange }) => {
    const [currentDate, setCurrentDate] = useState(() => {
        if (value) {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date();
    });

    const [direction, setDirection] = useState(0);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const selectedDate = value ? new Date(value.split("-")[0] + "-" + value.split("-")[1] + "-" + value.split("-")[2]) : null;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        setDirection(-1);
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setDirection(1);
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(year, month, day);
        // Format YYYY-MM-DD correctly avoiding timezone shifts locally
        const y = newDate.getFullYear();
        const m = String(newDate.getMonth() + 1).padStart(2, '0');
        const d = String(newDate.getDate()).padStart(2, '0');
        onChange(`${y}-${m}-${d}`);
    };

    const today = new Date();
    const isToday = (day: number) => {
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 30 : -30,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 30 : -30,
            opacity: 0,
        }),
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-sm p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevMonth}
                    type="button"
                    className="p-2 rounded-full text-gray-300 transition-colors hover:text-white hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex gap-2 relative z-20">
                    <select
                        value={month}
                        onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                        className="bg-transparent text-white font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1 appearance-none text-lg tracking-wide [text-align-last:center] hover:bg-white/5 transition-colors border-none"
                    >
                        {monthNames.map((m, i) => <option key={m} value={i} className="bg-[#0c1222] text-white overflow-hidden">{m}</option>)}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                        className="bg-transparent text-indigo-300 font-light cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1 appearance-none text-lg hover:bg-white/5 transition-colors border-none"
                    >
                        {Array.from({ length: 150 }).map((_, i) => {
                            const y = new Date().getFullYear() - 100 + i;
                            return <option key={y} value={y} className="bg-[#0c1222] text-white">{y}</option>;
                        })}
                    </select>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextMonth}
                    type="button"
                    className="p-2 rounded-full text-gray-300 transition-colors hover:text-white hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center relative z-10">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{d}</div>
                ))}
            </div>

            {/* Dates Grid with Slide Animation */}
            <div className="relative h-56 overflow-hidden">
                <AnimatePresence custom={direction} mode="popLayout" initial={false}>
                    <motion.div
                        key={`${year}-${month}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="grid grid-cols-7 gap-x-2 gap-y-2 text-center absolute inset-0 z-10"
                    >
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-8 h-8" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const todayFlag = isToday(day);
                            const selectedFlag = isSelected(day);

                            return (
                                <motion.button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDateClick(day)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all focus:outline-none 
                                    ${todayFlag && !selectedFlag ? 'text-indigo-400 font-bold border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'text-gray-300'}
                                    ${selectedFlag ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.6)] font-bold' : 'hover:bg-white/10'}`}
                                >
                                    {day}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
