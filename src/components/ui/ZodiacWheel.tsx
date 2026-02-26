"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function ZodiacWheel() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] flex items-center justify-center -z-10 mt-10 perspective-[1000px]">
            {/* Deep Cosmic Core Glow */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-electric-blue/10 blur-[60px]" />

            {/* 3D Rotating Outer Ring (Zodiac Signs) */}
            <motion.div
                className="absolute inset-0 rounded-full border-[2px] border-white/5 shadow-[0_0_60px_rgba(139,92,246,0.15)] preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateZ: 360, rotateX: [60, 65, 60] }}
                initial={{ rotateX: 60 }}
                transition={{
                    rotateZ: { duration: 150, repeat: Infinity, ease: "linear" },
                    rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
                }}
            >
                {ZODIAC_SIGNS.map((sign, index) => {
                    const rotation = (index * 360) / 12;
                    return (
                        <div
                            key={sign}
                            className="absolute w-full h-full"
                            style={{ transform: `rotateZ(${rotation}deg)` }}
                        >
                            <div
                                className="absolute top-[-10px] left-1/2 -translate-x-1/2 px-3 py-1 bg-midnight/80 border border-white/10 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] text-[10px] md:text-xs text-indigo-200 font-medium uppercase tracking-[0.2em] pointer-events-none"
                                style={{ transform: `rotateX(-60deg)` }} // Counter-rotate text to stay upright
                            >
                                {sign}
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Orbital Rings with Planets */}
            {/* Orbit 1 */}
            <motion.div
                className="absolute inset-[15%] rounded-full border border-electric-blue/20 border-dashed preserve-3d"
                style={{ transformStyle: 'preserve-3d', rotateX: 60 }}
                animate={{ rotateZ: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]" style={{ transform: 'rotateX(-60deg)' }} />
            </motion.div>

            {/* Orbit 2 */}
            <motion.div
                className="absolute inset-[30%] rounded-full border border-violet-glow/30 preserve-3d"
                style={{ transformStyle: 'preserve-3d', rotateX: 60 }}
                animate={{ rotateZ: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" style={{ transform: 'rotateX(-60deg)' }} />
            </motion.div>

            {/* Orbit 3 (Inner Fast) */}
            <motion.div
                className="absolute inset-[45%] rounded-full border border-white/10 border-dotted preserve-3d"
                style={{ transformStyle: 'preserve-3d', rotateX: 60 }}
                animate={{ rotateZ: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]" style={{ transform: 'rotateX(-60deg)' }} />
            </motion.div>

            {/* Center Core Glowing Symbol */}
            <motion.div
                className="absolute w-28 h-28 rounded-full border border-gold/30 flex items-center justify-center bg-black/60 backdrop-blur-xl z-10 shadow-[0_0_50px_rgba(212,175,55,0.25)]"
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 40px rgba(212,175,55,0.2)", "0 0 60px rgba(212,175,55,0.4)", "0 0 40px rgba(212,175,55,0.2)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="text-4xl text-gold font-serif font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">ॐ</span>
            </motion.div>
        </div>
    );
}
