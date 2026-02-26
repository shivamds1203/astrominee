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
        // Calculate normalized mouse position from 0 to 1
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
            className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] flex items-center justify-center -z-10 mt-10 perspective-[1000px] gpu-layer"
        >
            {/* Deep Cosmic Core Glow */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-electric-blue/10 blur-[60px]" />

            {/* 3D Rotating Outer Ring (Zodiac Signs) - Using CSS animations instead of Framer Motion for infinite loops */}
            <div
                className="absolute inset-0 rounded-full border-[2px] border-white/5 shadow-[0_0_60px_rgba(139,92,246,0.15)] preserve-3d"
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
                                className="absolute top-[-10px] left-1/2 -translate-x-1/2 px-3 py-1 bg-midnight/80 border border-white/10 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] text-[10px] md:text-xs text-indigo-200 font-medium uppercase tracking-[0.2em] pointer-events-none"
                                style={{ transform: `rotateX(-60deg)` }} // Counter-rotate text to stay upright
                            >
                                {sign}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Orbital Rings with Planets */}
            {/* Orbit 1 */}
            <div
                className="absolute inset-[15%] rounded-full border border-electric-blue/20 border-dashed preserve-3d"
                style={{
                    transform: 'rotateX(60deg)',
                    animation: shouldReduceMotion ? 'none' : 'orbit-slow-reverse 60s linear infinite'
                }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]" style={{ transform: 'rotateX(-60deg)' }} />
            </div>

            {/* Orbit 2 */}
            <div
                className="absolute inset-[30%] rounded-full border border-violet-glow/30 preserve-3d"
                style={{
                    transform: 'rotateX(60deg)',
                    animation: shouldReduceMotion ? 'none' : 'orbit-slow 40s linear infinite'
                }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" style={{ transform: 'rotateX(-60deg)' }} />
            </div>

            {/* Orbit 3 (Inner Fast) */}
            <div
                className="absolute inset-[45%] rounded-full border border-white/10 border-dotted preserve-3d"
                style={{
                    transform: 'rotateX(60deg)',
                    animation: shouldReduceMotion ? 'none' : 'orbit-slow-reverse 20s linear infinite'
                }}
            >
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]" style={{ transform: 'rotateX(-60deg)' }} />
            </div>

            {/* Center Core Glowing Symbol */}
            <div
                className="absolute w-28 h-28 rounded-full border border-gold/30 flex items-center justify-center bg-black/60 backdrop-blur-xl z-10 shadow-[0_0_50px_rgba(212,175,55,0.25)]"
                style={{
                    animation: shouldReduceMotion ? 'none' : 'pulse-glow 4s ease-in-out infinite'
                }}
            >
                <span className="text-4xl text-gold font-serif font-bold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">ॐ</span>
            </div>
        </motion.div>
    );
}
