"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StarBackground() {
    const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: number }[]>([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5,
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510]" />

            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
            {/* Floating Glowing Planets / Orbs */}
            <motion.div
                className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-indigo-600/10 blur-[100px]"
                animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-yellow-600/10 blur-[120px]"
                animate={{ x: [0, -70, 0], y: [0, 60, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
