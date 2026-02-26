"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PremiumClockProps {
    value: string; // HH:mm
    onChange: (time: string) => void;
}

export const PremiumClock: React.FC<PremiumClockProps> = ({ value, onChange }) => {
    // We will use the selected time for the clock hands and digital input
    const [currentTime, setCurrentTime] = useState<Date>(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            return d;
        }
        return new Date();
    });

    // Instead of a continuously ticking real-time clock, this represents the *selected* time in the form.
    // If we wanted a live animated clock, we'd use a setInterval. Given it's a form input picker, it mirrors the selection.

    // However, the user asked for "hour, minute, and second hands should move smoothly... gentle breathing animation".
    // If no value is provided, we can animate it as a live clock until they pick a time, OR just animate a dummy seconds hand.
    // Let's animate the seconds hand continuously for visual flair, while hour and minute represent the selected time.
    const [secondsDeg, setSecondsDeg] = useState(currentTime.getSeconds() * 6);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsDeg(prev => prev + 6);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            setCurrentTime(d);
        }
    }, [value]);



    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    const hoursDeg = (hours % 12) * 30 + (minutes / 2); // 360 / 12 = 30 deg per hour
    const minutesDeg = minutes * 6; // 360 / 60 = 6 deg per minute

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
        >
            <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-48 h-48 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-center p-2"
            >
                {/* Glowing gradient ring */}
                <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 [mask-image:linear-gradient(#fff_0_0)] [mask-composite:exclude] opacity-70 p-[1.5px]" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor' }} />

                {/* Inner glass face */}
                <div className="w-full h-full rounded-full bg-white/5 relative flex items-center justify-center shadow-inner">
                    {/* Tick marks */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full h-full p-2"
                            style={{ transform: `rotate(${i * 30}deg)` }}
                        >
                            <div className="w-1 h-2.5 bg-gray-400/50 rounded-full mx-auto" />
                        </div>
                    ))}

                    {/* Clock Hands */}
                    {/* Hour Hand */}
                    <motion.div
                        className="absolute w-[3px] h-12 bg-white rounded-full origin-bottom"
                        style={{ bottom: '50%', left: '50%', x: '-50%' }}
                        animate={{ rotate: hoursDeg }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />

                    {/* Minute Hand */}
                    <motion.div
                        className="absolute w-[2px] h-16 bg-indigo-300 rounded-full origin-bottom"
                        style={{ bottom: '50%', left: '50%', x: '-50%' }}
                        animate={{ rotate: minutesDeg }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />

                    {/* Second Hand (Smooth continuous fluid motion) */}
                    <motion.div
                        className="absolute w-[1px] h-20 bg-cyan-400 rounded-full origin-bottom shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        style={{ bottom: '50%', left: '50%', x: '-50%' }}
                        animate={{ rotate: secondsDeg }}
                        transition={{ ease: "linear", duration: 1 }}
                    />

                    {/* Center Point Glow */}
                    <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full m-auto mt-[3px]" />
                    </div>
                </div>
            </motion.div>

            {/* Digital Time Picker Selectors */}
            <div className="flex gap-2 items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <select
                    value={hours.toString().padStart(2, '0')}
                    onChange={(e) => onChange(`${e.target.value}:${minutes.toString().padStart(2, '0')}`)}
                    className="bg-transparent text-white font-mono text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded p-1 appearance-none text-center hover:bg-white/5 transition-colors border-none cursor-pointer"
                >
                    {Array.from({ length: 24 }).map((_, i) => {
                        const hStr = i.toString().padStart(2, '0');
                        return <option key={hStr} value={hStr} className="bg-[#0c1222] text-white text-base font-sans">{hStr}</option>;
                    })}
                </select>
                <span className="text-indigo-400 font-bold text-2xl mb-1">:</span>
                <select
                    value={minutes.toString().padStart(2, '0')}
                    onChange={(e) => onChange(`${hours.toString().padStart(2, '0')}:${e.target.value}`)}
                    className="bg-transparent text-white font-mono text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded p-1 appearance-none text-center hover:bg-white/5 transition-colors border-none cursor-pointer"
                >
                    {Array.from({ length: 60 }).map((_, i) => {
                        const mStr = i.toString().padStart(2, '0');
                        return <option key={mStr} value={mStr} className="bg-[#0c1222] text-white text-base font-sans">{mStr}</option>;
                    })}
                </select>
            </div>
        </motion.div>
    );
};
