"use client";

import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function ZodiacWheel() {
    const [mounted, setMounted] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    // 3D tilt effect on hover based on mouse position
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const rotateX = useTransform(springY, [0, 1], [15, -15]);
    const rotateY = useTransform(springX, [0, 1], [-15, 15]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    if (!mounted) return null;

    return (
        <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: shouldReduceMotion ? 0 : rotateX,
                rotateY: shouldReduceMotion ? 0 : rotateY,
                transformStyle: "preserve-3d"
            }}
            className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] flex items-center justify-center -z-10 mt-6 md:mt-10 perspective-[1000px] select-none"
        >
            {/* Deep Cosmic Core Ambient Glow */}
            <div className="absolute inset-0 rounded-full bg-amber-500/10 dark:bg-indigo-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-yellow-500/15 dark:bg-purple-500/15 blur-[60px] pointer-events-none" />

            {/* 3D Rotating Outer Ring (Zodiac Signs) */}
            <div
                className="absolute inset-0 rounded-full border border-amber-300/50 dark:border-white/10 shadow-[0_0_50px_rgba(245,158,11,0.15)] preserve-3d"
                style={{
                    transform: 'rotateX(60deg)',
                    animation: shouldReduceMotion ? 'none' : 'orbit-slow 150s linear infinite'
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
                                className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-3 py-1 bg-white/95 dark:bg-[#0c1224]/90 border border-amber-400/50 dark:border-amber-500/30 rounded-full backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_0_15px_rgba(245,158,11,0.15)] text-[10px] md:text-xs text-slate-800 dark:text-amber-200 font-bold uppercase tracking-[0.18em] pointer-events-none"
                                style={{ transform: `rotateX(-60deg)` }}
                            >
                                {sign}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Orbital Ring 1 (Gold Planet) */}
            <div
                className="absolute inset-[15%] rounded-full border border-amber-500/30 dark:border-amber-400/20 border-dashed preserve-3d"
                style={{
                    transform: 'rotateX(60deg)',
                    animation: shouldReduceMotion ? 'none' : 'orbit-slow-reverse 60s linear infinite'
                }}
            >
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.9)]"
                    style={{ transform: 'rotateX(-60deg)' }}
                />
            </div>

            {/* Orbital Ring 2 (Sapphire Planet) */}
            <div
                className="absolute inset-[30%] rounded-full border border-indigo-500/30 dark:border-indigo-400/30 preserve-3d"
                style={{
                    transform: 'rotateX(60deg)',
                    animation: shouldReduceMotion ? 'none' : 'orbit-slow 40s linear infinite'
                }}
            >
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.8)]"
                    style={{ transform: 'rotateX(-60deg)' }}
                />
            </div>

            {/* Orbital Ring 3 (Ruby Planet) */}
            <div
                className="absolute inset-[45%] rounded-full border border-rose-400/30 dark:border-white/10 border-dotted preserve-3d"
                style={{
                    transform: 'rotateX(60deg)',
                    animation: shouldReduceMotion ? 'none' : 'orbit-slow-reverse 20s linear infinite'
                }}
            >
                <div
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]"
                    style={{ transform: 'rotateX(-60deg)' }}
                />
            </div>

            {/* Center Core Glowing OM Symbol - Adaptive for Light & Dark Mode */}
            <div
                className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-500/40 dark:border-yellow-500/30 flex items-center justify-center bg-gradient-to-br from-amber-50/90 via-white/95 to-amber-100/90 dark:from-[#130f26] dark:via-[#090717] dark:to-[#170a24] backdrop-blur-2xl z-10 shadow-[0_4px_30px_rgba(245,158,11,0.25)] dark:shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-colors duration-300"
                style={{
                    animation: shouldReduceMotion ? 'none' : 'pulse-glow 4s ease-in-out infinite'
                }}
            >
                <span className="text-3xl sm:text-4xl text-amber-600 dark:text-yellow-400 font-serif font-black drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] select-none">
                    ॐ
                </span>
            </div>
        </motion.div>
    );
}
