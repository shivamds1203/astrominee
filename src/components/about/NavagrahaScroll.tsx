"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

// ─── Planet Data ────────────────────────────────────────────────────────────────
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
        animType: "radiate",
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
        animType: "breathe",
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
        animType: "pulse",
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
        animType: "orbit",
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
        animType: "expand",
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
        animType: "sparkle",
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
        animType: "ring",
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
        animType: "smoke",
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
        animType: "dissolve",
    },
];

// ─── Memoized star positions (never recalculate on re-render) ─────────────────
const STAR_DATA = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() > 0.9 ? 2 : 1,
    left: `${(Math.random() * 100).toFixed(2)}%`,
    top: `${(Math.random() * 100).toFixed(2)}%`,
    opacity: (Math.random() * 0.7 + 0.1).toFixed(2),
    duration: `${(3 + Math.random() * 5).toFixed(1)}s`,
    delay: `${(Math.random() * 3).toFixed(1)}s`,
}));

// ─── Star Field ──────────────────────────────────────────────────────────────────
const StarField = ({ planet }: { planet: typeof PLANETS[0] }) => {
    return (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <div className="absolute inset-0" style={{ background: "#020408" }} />
            <div
                className="absolute inset-0 nava-nebula"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${planet.aura} 0%, transparent 70%)`,
                    opacity: 0.3
                }}
            />
            {STAR_DATA.map((s) => (
                <div
                    key={s.id}
                    className="absolute rounded-full bg-white nava-twinkle"
                    style={{
                        width: s.size,
                        height: s.size,
                        left: s.left,
                        top: s.top,
                        opacity: 0.5,
                    }}
                />
            ))}
        </div>
    );
};

// ─── Planet Orb ──────────────────────────────────────────────────────────────────
const PlanetOrb = ({ planet, isActive }: { planet: typeof PLANETS[0]; isActive: boolean }) => {
    return (
        <div
            className="flex items-center justify-center relative w-[300px] h-[300px]"
            style={{ zIndex: 60 }}
        >
            <div
                className="rounded-full flex items-center justify-center"
                style={{
                    width: "220px",
                    height: "220px",
                    background: planet.bgGradient || planet.color,
                    boxShadow: `0 0 50px ${planet.glow}`,
                    border: "2px solid rgba(255,255,255,0.1)",
                    zIndex: 61
                }}
            >
                <span className="text-4xl font-bold text-white/20">{planet.symbol}</span>
            </div>
            <div
                className="absolute font-bold pointer-events-none text-white/5"
                style={{ fontSize: "200px", zIndex: 59 }}
            >
                {planet.zodiac}
            </div>
        </div>
    );
};

// ─── Info Card ────────────────────────────────────────────────────────────────────
const InfoCard = ({ planet }: { planet: typeof PLANETS[0] }) => (
    <div
        className="rounded-3xl p-8 w-full max-w-[400px] border border-white/10"
        style={{
            background: "rgba(10,12,25,0.98)",
            boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 20px ${planet.color}20`,
            zIndex: 60
        }}
    >
        <div className="mb-6">
            <h2 className="text-4xl font-black text-white mb-1">{planet.name}</h2>
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: planet.color }}>{planet.sanskrit}</p>
        </div>
        <div className="space-y-4">
            {planet.description.map((line, i) => (
                <div key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: planet.color }} />
                    <p>{line}</p>
                </div>
            ))}
        </div>
    </div>
);

// ─── Progress Dots ────────────────────────────────────────────────────────────────
const ProgressDots = ({ active, total, onDotClick }: { active: number; total: number; onDotClick: (i: number) => void }) => (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4">
        {Array.from({ length: total }, (_, i) => (
            <button
                key={i}
                onClick={() => onDotClick(i)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                    background: i === active ? PLANETS[i].color : "rgba(255,255,255,0.2)",
                    boxShadow: i === active ? `0 0 10px ${PLANETS[i].color}` : "none",
                    transform: i === active ? "scale(1.5)" : "scale(1)"
                }}
            />
        ))}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────────
export const NavagrahaScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activePlanet, setActivePlanet] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const idx = Math.min(Math.floor(v * PLANETS.length), PLANETS.length - 1);
        if (idx !== activePlanet) setActivePlanet(idx);
    });

    const scrollToPlanet = (i: number) => {
        const container = containerRef.current;
        if (!container) return;
        const target = (i / PLANETS.length) * container.scrollHeight + container.offsetTop;
        window.scrollTo({ top: target, behavior: "smooth" });
    };

    const planet = PLANETS[activePlanet];

    return (
        <div ref={containerRef} className="relative" style={{ height: "1200vh" }}>
            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full bg-black overflow-hidden" style={{ zIndex: 10 }}>

                {/* DEBUG BANNER - FORCING VISIBILITY */}
                <div className="absolute top-0 left-0 w-full bg-red-600 text-white p-4 font-bold text-center z-[200]">
                    PLANET VISIBILITY DEBUG: Rendering {planet?.name || "MISSING"}
                </div>

                <StarField planet={planet} />

                <ProgressDots active={activePlanet} total={PLANETS.length} onDotClick={scrollToPlanet} />

                {/* Content Layer */}
                <div className="relative z-50 h-full w-full flex flex-col lg:flex-row items-center justify-center gap-12 px-6">
                    <PlanetOrb planet={planet} isActive={true} />
                    <InfoCard planet={planet} />
                </div>

                {/* Scroll Hint */}
                {activePlanet === 0 && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest uppercase z-50">
                        Scroll to explore
                    </div>
                )}
            </div>
        </div>
    );
};
