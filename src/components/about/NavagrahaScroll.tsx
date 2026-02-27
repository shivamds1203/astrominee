"use client";

import React, { useRef, useMemo } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    AnimatePresence
} from "framer-motion";

// --- Constants & Data ---
const PLANETS = [
    {
        id: "sun",
        name: "Sun",
        sanskrit: "Surya ☀",
        symbol: "☉",
        zodiac: "♌",
        color: "#f97316",
        glow: "#fb923c",
        secondGlow: "#fde68a",
        bgGradient: "radial-gradient(circle at 35% 30%, #fde68a 0%, #f97316 40%, #c2410c 80%, #7c2d12 100%)",
        aura: "rgba(251,146,60,0.35)",
        energy: "Authority · Soul · Confidence",
        description: [
            "Represents self-identity, leadership, ego, vitality and father.",
            "Governs career power and life purpose.",
            "Strong Sun gives confidence and authority.",
            "Weak Sun may cause low self-esteem or direction issues.",
        ],
    },
    {
        id: "moon",
        name: "Moon",
        sanskrit: "Chandra 🌙",
        symbol: "☽",
        zodiac: "♋",
        color: "#e2e8f0",
        glow: "#cbd5e1",
        secondGlow: "#f8fafc",
        bgGradient: "radial-gradient(circle at 35% 30%, #f8fafc 0%, #cbd5e1 35%, #94a3b8 70%, #475569 100%)",
        aura: "rgba(203,213,225,0.3)",
        energy: "Emotions · Mind · Intuition",
        description: [
            "Represents emotions, mental stability, mother, imagination.",
            "Controls mood and subconscious patterns.",
            "Strong Moon gives calm mind and emotional intelligence.",
            "Weak Moon may create anxiety or mood swings.",
        ],
    },
    {
        id: "mars",
        name: "Mars",
        sanskrit: "Mangal ♂",
        symbol: "♂",
        zodiac: "♈",
        color: "#ef4444",
        glow: "#dc2626",
        secondGlow: "#fca5a5",
        bgGradient: "radial-gradient(circle at 35% 30%, #fca5a5 0%, #ef4444 40%, #b91c1c 75%, #7f1d1d 100%)",
        aura: "rgba(239,68,68,0.4)",
        energy: "Action · Courage · Aggression",
        description: [
            "Governs energy, strength, ambition, siblings and courage.",
            "Controls competitive spirit and determination.",
            "Strong Mars gives leadership and bravery.",
            "Weak Mars may create anger or lack of motivation.",
        ],
    },
    {
        id: "mercury",
        name: "Mercury",
        sanskrit: "Budh ☿",
        symbol: "☿",
        zodiac: "♊",
        color: "#10b981",
        glow: "#059669",
        secondGlow: "#6ee7b7",
        bgGradient: "radial-gradient(circle at 35% 30%, #6ee7b7 0%, #10b981 40%, #047857 75%, #064e3b 100%)",
        aura: "rgba(16,185,129,0.35)",
        energy: "Communication · Intelligence · Logic",
        description: [
            "Governs speech, logic, business, analysis and networking.",
            "Controls communication skills and trading ability.",
            "Strong Mercury gives sharp mind and business success.",
            "Weak Mercury may cause confusion or speech issues.",
        ],
    },
    {
        id: "jupiter",
        name: "Jupiter",
        sanskrit: "Guru ♃",
        symbol: "♃",
        zodiac: "♐",
        color: "#f59e0b",
        glow: "#d97706",
        secondGlow: "#fde68a",
        bgGradient: "radial-gradient(circle at 35% 30%, #fef3c7 0%, #f59e0b 35%, #b45309 70%, #78350f 100%)",
        aura: "rgba(245,158,11,0.4)",
        energy: "Wisdom · Expansion · Fortune",
        description: [
            "Represents knowledge, spirituality, luck, teachers and wealth.",
            "Governs expansion and divine blessings.",
            "Strong Jupiter gives prosperity and wisdom.",
            "Weak Jupiter may reduce guidance or growth.",
        ],
    },
    {
        id: "venus",
        name: "Venus",
        sanskrit: "Shukra ♀",
        symbol: "♀",
        zodiac: "♉",
        color: "#ec4899",
        glow: "#db2777",
        secondGlow: "#fbcfe8",
        bgGradient: "radial-gradient(circle at 35% 30%, #fbcfe8 0%, #ec4899 35%, #9d174d 70%, #831843 100%)",
        aura: "rgba(236,72,153,0.35)",
        energy: "Love · Beauty · Luxury",
        description: [
            "Governs relationships, marriage, luxury, art and pleasure.",
            "Controls attraction and comfort.",
            "Strong Venus gives charm and wealth.",
            "Weak Venus may create relationship imbalance.",
        ],
    },
    {
        id: "saturn",
        name: "Saturn",
        sanskrit: "Shani ♄",
        symbol: "♄",
        zodiac: "♑",
        color: "#6366f1",
        glow: "#4f46e5",
        secondGlow: "#c7d2fe",
        bgGradient: "radial-gradient(circle at 35% 30%, #c7d2fe 0%, #6366f1 35%, #3730a3 70%, #1e1b4b 100%)",
        aura: "rgba(99,102,241,0.35)",
        energy: "Karma · Discipline · Delay",
        description: [
            "Represents karma, hard work, discipline and life lessons.",
            "Governs long-term growth and responsibility.",
            "Strong Saturn gives stability and success after effort.",
            "Weak Saturn may cause delays or struggles.",
        ],
        hasRings: true,
    },
    {
        id: "rahu",
        name: "Rahu",
        sanskrit: "Rahu ☊",
        symbol: "☊",
        zodiac: "♏",
        color: "#7c3aed",
        glow: "#6d28d9",
        secondGlow: "#ddd6fe",
        bgGradient: "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #7c3aed 30%, #4c1d95 65%, #2e1065 100%)",
        aura: "rgba(124,58,237,0.4)",
        energy: "Obsession · Illusion · Desire",
        description: [
            "Represents illusion, foreign connections, ambition and innovation.",
            "Creates unconventional growth and sudden rise.",
            "Strong Rahu gives global success.",
            "Weak Rahu causes confusion or instability.",
        ],
    },
    {
        id: "ketu",
        name: "Ketu",
        sanskrit: "Ketu ☋",
        symbol: "☋",
        zodiac: "♓",
        color: "#14b8a6",
        glow: "#0d9488",
        secondGlow: "#99f6e4",
        bgGradient: "radial-gradient(circle at 35% 30%, #99f6e4 0%, #14b8a6 35%, #0f766e 70%, #134e4a 100%)",
        aura: "rgba(20,184,166,0.3)",
        energy: "Spirituality · Detachment · Karma",
        description: [
            "Represents spirituality, detachment, past-life karma.",
            "Brings enlightenment through separation.",
            "Strong Ketu gives intuition and moksha tendencies.",
            "Weak Ketu may create confusion or isolation.",
        ],
    },
];

// --- Subcomponents ---

const PlanetSection = ({ planet, index, scrollYProgress, total }: any) => {
    // Each planet gets a range of 1/total of the final scroll
    const start = index / total;
    const end = (index + 1) / total;

    // Use a simpler mapping to avoid any "none" display bugs
    const opacity = useTransform(scrollYProgress,
        [start, start + 0.05, end - 0.05, end],
        [0, 1, 1, 0]
    );

    const scale = useTransform(scrollYProgress,
        [start, start + 0.1, end - 0.1, end],
        [0.8, 1, 1, 1.2]
    );

    const rotateY = useTransform(scrollYProgress, [start, end], [30, -30]);

    // Hide the element completely when not in its active range to prevent filter/composite lag
    const visibility = useTransform(scrollYProgress, (v: number) => {
        if (v >= start - 0.05 && v <= end + 0.05) {
            return "visible";
        }
        return "hidden";
    });

    return (
        <motion.div
            style={{ opacity, scale, visibility }}
            className="absolute inset-0 z-20 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 px-6 pointer-events-none will-change-transform"
        >
            {/* 3D Zodiac Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vh] font-black pointer-events-none z-0 opacity-[0.03] text-white">
                {planet.zodiac}
            </div>

            {/* Planet sphere */}
            <motion.div
                style={{ rotateY }}
                className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] flex-shrink-0 z-10"
            >
                <div
                    className="w-full h-full rounded-full relative overflow-hidden ring-1 ring-white/10"
                    style={{
                        background: planet.bgGradient,
                        boxShadow: `0 0 100px ${planet.glow}60, inset -20px -20px 60px rgba(0,0,0,0.7)`
                    }}
                >
                    {/* Surface shine */}
                    <div className="absolute top-[10%] left-[15%] w-[30%] h-[20%] bg-white/20 rounded-full blur-2xl" />

                    {/* Saturn Rings */}
                    {planet.hasRings && (
                        <div className="absolute inset-0 flex items-center justify-center scale-[1.35] rotate-[75deg] pointer-events-none">
                            <div
                                className="w-full h-[15px] rounded-full border-2 border-white/30"
                                style={{ background: `linear-gradient(to right, transparent, ${planet.color}40, transparent)` }}
                            />
                        </div>
                    )}

                    {/* Animated Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span className="text-[120px] md:text-[200px] font-bold">{planet.symbol}</span>
                    </div>
                </div>

                {/* Aura Floor */}
                <div
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[140%] h-[60px] rounded-[100%] blur-[100px] opacity-40"
                    style={{ background: planet.color }}
                />
            </motion.div>

            {/* Info Card */}
            <div
                className="w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 bg-[#080c18]/90 backdrop-blur-md shadow-2xl relative z-20 pointer-events-auto"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold border border-white/10"
                            style={{ background: `${planet.color}20`, color: planet.color }}
                        >
                            {planet.symbol}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-1">{planet.name}</h3>
                            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: planet.color }}>{planet.sanskrit}</p>
                        </div>
                    </div>

                    <div
                        className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10"
                        style={{ background: `${planet.color}10`, color: planet.color }}
                    >
                        {planet.energy}
                    </div>

                    <div className="space-y-4">
                        {planet.description.map((line: string, i: number) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: planet.color }} />
                                <p className="text-sm text-gray-300 leading-relaxed font-medium">{line}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Layout ---

export const NavagrahaScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="relative z-0" style={{ height: "1000vh" }}>
            {/* Sticky Background & Base */}
            <div className="sticky top-0 h-screen w-full bg-[#05070a] overflow-hidden flex items-center justify-center z-50">

                {/* Dynamic Background Grid/Stars */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff20 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                {/* Global Progress Indicators */}
                <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
                    {PLANETS.map((p, i) => {
                        const isActive = useTransform(smoothProgress,
                            [i / PLANETS.length, (i + 1) / PLANETS.length],
                            [1, 0]
                        );
                        return (
                            <div key={p.id} className="relative flex items-center group cursor-pointer">
                                <motion.div
                                    className="w-1 h-8 rounded-full bg-white/10"
                                    style={{
                                        background: useTransform(smoothProgress,
                                            [(i - 0.5) / PLANETS.length, i / PLANETS.length, (i + 0.5) / PLANETS.length],
                                            ["rgba(255,255,255,0.1)", p.color, "rgba(255,255,255,0.1)"]
                                        )
                                    }}
                                />
                                <span className="absolute left-6 text-[10px] font-bold text-white/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    {p.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Planet Rendering Loop */}
                <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
                    {PLANETS.map((planet, index) => (
                        <PlanetSection
                            key={planet.id}
                            planet={planet}
                            index={index}
                            scrollYProgress={scrollYProgress}
                            total={PLANETS.length}
                        />
                    ))}
                </div>

                {/* Bottom Page Hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[10px] text-white/20 whitespace-nowrap"
                >
                    Explore Celestial Forces
                </motion.div>
            </div>
        </div>
    );
};
