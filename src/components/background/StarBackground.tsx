"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function StarBackground() {
    const shouldReduceMotion = useReducedMotion();
    const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Reduced from 150 to 80 for better performance, using CSS animations instead of JS
        const generatedStars = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-slate-50 dark:bg-[#000005] transition-colors duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/40 via-slate-100 to-slate-50 dark:from-indigo-900/20 dark:via-[#050510] dark:to-[#000005]" />

            {/* Stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-indigo-500/40 dark:bg-white gpu-layer"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        opacity: 0.15,
                        animation: shouldReduceMotion
                            ? "none"
                            : `star-twinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
                    }}
                />
            ))}

            {/* Floating Glowing Planets / Orbs */}
            <div
                className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] gpu-layer"
                style={{
                    animation: shouldReduceMotion ? "none" : "float-gentle 20s ease-in-out infinite"
                }}
            />
            <div
                className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-amber-500/10 dark:bg-yellow-600/10 blur-[120px] gpu-layer"
                style={{
                    animation: shouldReduceMotion ? "none" : "float-gentle 25s ease-in-out infinite reverse"
                }}
            />
        </div>
    );
}
