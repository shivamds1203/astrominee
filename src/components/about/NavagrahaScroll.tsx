"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";

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

// ─── Star Field ──────────────────────────────────────────────────────────────────
const StarField: React.FC<{ active: number }> = ({ active }) => {
    const planet = PLANETS[active];
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Deep space */}
            <div className="absolute inset-0 bg-[#020408]" />
            {/* Nebula glow matching current planet */}
            <motion.div
                className="absolute inset-0"
                animate={{ opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${planet.aura} 0%, transparent 70%)`,
                    transform: "translateZ(0)",
                }}
            />
            {/* Static stars - Reduced count for mobile performance */}
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                        width: Math.random() > 0.9 ? 2 : 1,
                        height: Math.random() > 0.9 ? 2 : 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.8 + 0.1,
                        animation: `twinkle ${3 + Math.random() * 5}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`,
                    }}
                />
            ))}
        </div>
    );
};

// ─── Planet Orb ──────────────────────────────────────────────────────────────────
const PlanetOrb: React.FC<{ planet: typeof PLANETS[0]; isActive: boolean }> = ({ planet, isActive }) => {
    const rotateAnim = {
        radiate: { rotate: 360, scale: [1, 1.04, 1] },
        breathe: { rotate: 360, y: [0, -12, 0] },
        pulse: { rotate: 360, scale: [1, 1.06, 1] },
        orbit: { rotate: 360 },
        expand: { rotate: 360, scale: [1, 1.03, 1] },
        sparkle: { rotate: 360, scale: [1, 1.02, 1] },
        ring: { rotate: 360 },
        smoke: { rotate: [0, 5, -5, 0], scale: [1, 1.05, 0.98, 1] },
        dissolve: { rotate: 360, opacity: [1, 0.85, 1] },
    }[planet.animType] ?? { rotate: 360 };

    const rotDuration = {
        radiate: 12, breathe: 18, pulse: 8, orbit: 6,
        expand: 20, sparkle: 15, ring: 30, smoke: 10, dissolve: 25,
    }[planet.animType] ?? 15;

    return (
        <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
            {/* Outer aura rings */}
            {[1, 2].map((r) => (
                <motion.div
                    key={r}
                    className="absolute rounded-full border border-white/5"
                    animate={isActive ? { scale: [1, 1.1 + r * 0.05, 1], opacity: [0.3 - r * 0.1, 0.05, 0.3 - r * 0.1] } : {}}
                    transition={{ duration: 3 + r, repeat: Infinity, ease: "easeInOut", delay: r * 0.5 }}
                    style={{
                        width: 260 + r * 44,
                        height: 260 + r * 44,
                        borderColor: planet.glow,
                    }}
                />
            ))}

            {/* Saturn rings */}
            {planet.hasRings && (
                <>
                    <motion.div
                        className="absolute"
                        animate={isActive ? { rotateX: 75, rotateZ: [0, 360] } : { rotateX: 75 }}
                        transition={{ rotateZ: { duration: 20, repeat: Infinity, ease: "linear" } }}
                        style={{
                            width: 340,
                            height: 340,
                            borderRadius: "50%",
                            border: `6px solid ${planet.color}60`,
                            boxShadow: `0 0 20px ${planet.color}40`,
                        }}
                    />
                    <motion.div
                        className="absolute"
                        animate={isActive ? { rotateX: 75, rotateZ: [360, 0] } : { rotateX: 75 }}
                        transition={{ rotateZ: { duration: 30, repeat: Infinity, ease: "linear" } }}
                        style={{
                            width: 300,
                            height: 300,
                            borderRadius: "50%",
                            border: `3px solid ${planet.secondGlow}40`,
                        }}
                    />
                </>
            )}

            {/* Mercury orbiting particles */}
            {planet.id === "mercury" && isActive && [0, 60, 120, 180, 240, 300].map((angle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                        background: planet.glow,
                        boxShadow: `0 0 6px ${planet.glow}`,
                    }}
                    animate={{
                        rotate: [angle, angle + 360],
                        x: Math.cos((angle * Math.PI) / 180) * 150,
                        y: Math.sin((angle * Math.PI) / 180) * 150,
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            ))}

            {/* Mars energy particles */}
            {planet.id === "mars" && isActive && [...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-red-400"
                    animate={{
                        x: [0, (Math.random() - 0.5) * 150],
                        y: [0, (Math.random() - 0.5) * 150],
                        opacity: [1, 0],
                        scale: [1, 0],
                    }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
                />
            ))}

            {/* Venus sparkles */}
            {planet.id === "venus" && isActive && [...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-pink-300 text-xs font-bold"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
                >
                    ✦
                </motion.div>
            ))}

            {/* Rahu smoke */}
            {planet.id === "rahu" && isActive && [...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{ background: `${planet.glow}20`, width: 80, height: 80 }}
                    animate={{ x: (Math.random() - 0.5) * 200, y: -150, opacity: [0.3, 0], scale: [0.5, 1.5] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                />
            ))}

            {/* Main planet sphere */}
            <motion.div
                animate={isActive ? { ...rotateAnim } : { rotate: 0 }}
                transition={{
                    rotate: { duration: rotDuration, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
                className="relative rounded-full overflow-hidden border border-white/10"
                style={{
                    width: 220,
                    height: 220,
                    background: planet.bgGradient,
                    boxShadow: `
                        0 0 20px ${planet.glow}60,
                        inset -10px -10px 20px rgba(0,0,0,0.5),
                        inset 4px 4px 10px rgba(255,255,255,0.1)
                    `,
                }}
            >
                {/* Surface texture lines */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(255,255,255,0.08) 12px, rgba(255,255,255,0.08) 13px)`,
                }} />
                {/* Highlight */}
                <div className="absolute top-4 left-6 w-16 h-10 rounded-full bg-white/10" style={{ boxShadow: '0 0 10px rgba(255,255,255,0.2)' }} />
                {/* Planet symbol overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/10 font-bold" style={{ fontSize: 80 }}>{planet.symbol}</span>
                </div>
            </motion.div>

            {/* Floating zodiac symbol behind planet */}
            <motion.div
                className="absolute text-white/5 font-bold pointer-events-none"
                style={{ fontSize: 320, lineHeight: 1, zIndex: -1 }}
                animate={isActive ? { rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                {planet.zodiac}
            </motion.div>
        </div>
    );
};

// ─── Info Card ───────────────────────────────────────────────────────────────────
const InfoCard: React.FC<{ planet: typeof PLANETS[0] }> = ({ planet }) => (
    <motion.div
        key={planet.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative rounded-3xl p-8 max-w-[380px] w-full overflow-hidden"
        style={{
            background: "rgba(8,13,26,0.85)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${planet.color}40`,
            boxShadow: `0 0 20px ${planet.aura}`,
        }}
    >
        {/* Gradient corner glow */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top right, ${planet.aura} 0%, transparent 70%)` }} />

        {/* Planet name header */}
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{planet.symbol}</span>
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{planet.name}</h2>
                    <p className="text-sm font-medium" style={{ color: planet.color }}>{planet.sanskrit}</p>
                </div>
            </div>
            {/* Energy pill */}
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase"
                style={{ borderColor: `${planet.color}50`, color: planet.color, background: `${planet.color}15` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: planet.color }} />
                {planet.energy}
            </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6 w-full" style={{ background: `linear-gradient(to right, ${planet.color}60, transparent)` }} />

        {/* Description lines */}
        <div className="space-y-3">
            {planet.description.map((line, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 200 }}
                    className="flex items-start gap-3"
                >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: planet.color, boxShadow: `0 0 6px ${planet.color}` }} />
                    <p className="text-sm text-gray-300 leading-relaxed">{line}</p>
                </motion.div>
            ))}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 rounded-b-3xl pointer-events-none"
            style={{ background: `linear-gradient(to top, ${planet.color}10, transparent)` }} />
    </motion.div>
);

// ─── Progress Dots ────────────────────────────────────────────────────────────────
const ProgressDots: React.FC<{ active: number; total: number; onDotClick: (i: number) => void }> = ({ active, total, onDotClick }) => (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {[...Array(total)].map((_, i) => {
            const p = PLANETS[i];
            return (
                <button
                    key={i}
                    onClick={() => onDotClick(i)}
                    className="relative w-2 h-2 rounded-full transition-all duration-300 focus:outline-none group"
                    style={{
                        background: i === active ? p.color : "rgba(255,255,255,0.2)",
                        boxShadow: i === active ? `0 0 10px ${p.color}` : "none",
                        transform: i === active ? "scale(1.6)" : "scale(1)",
                    }}
                >
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white whitespace-nowrap bg-black/60 px-2 py-0.5 rounded-full pointer-events-none">
                        {PLANETS[i].name}
                    </span>
                </button>
            );
        })}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────────
export const NavagrahaScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
    const [activePlanet, setActivePlanet] = useState(0);

    // Derive active planet from scroll
    useEffect(() => {
        const unsub = smoothProgress.on("change", (v) => {
            const idx = Math.min(Math.floor(v * PLANETS.length), PLANETS.length - 1);
            setActivePlanet(idx);
        });
        return unsub;
    }, [smoothProgress]);

    const scrollToPlanet = (i: number) => {
        const container = containerRef.current;
        if (!container) return;
        const sectionHeight = container.scrollHeight;
        const target = (i / PLANETS.length) * sectionHeight + container.offsetTop;
        window.scrollTo({ top: target, behavior: "smooth" });
    };

    const planet = PLANETS[activePlanet];

    // Planet scale/opacity when not active
    const otherPositions = [
        { x: -340, y: -120, rotate: -25 },
        { x: -300, y: 120, rotate: 15 },
        { x: 340, y: -120, rotate: 25 },
        { x: 300, y: 120, rotate: -15 },
    ];

    return (
        <>
            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.3); }
                }
            `}</style>

            {/* Tall scroll container */}
            <div ref={containerRef} style={{ height: `${PLANETS.length * 110}vh` }} className="relative">

                {/* Sticky viewport */}
                <div className="sticky top-0 h-screen overflow-hidden">
                    {/* Background */}
                    <StarField active={activePlanet} />

                    {/* Progress indicator */}
                    <ProgressDots active={activePlanet} total={PLANETS.length} onDotClick={scrollToPlanet} />

                    {/* Scroll progress bar (top) */}
                    <motion.div
                        className="fixed top-0 left-0 h-0.5 z-50 origin-left"
                        style={{
                            scaleX: smoothProgress,
                            background: `linear-gradient(to right, ${planet.color}, ${planet.secondGlow})`,
                            boxShadow: `0 0 8px ${planet.color}`,
                        }}
                    />

                    {/* Planet number indicator */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-xs font-bold tracking-[4px] uppercase"
                        style={{ color: `${planet.color}80` }}>
                        {String(activePlanet + 1).padStart(2, "0")} / {String(PLANETS.length).padStart(2, "0")} — Navagraha
                    </div>

                    {/* Background ghost planets orbiting */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {otherPositions.map((pos, i) => {
                            const idx = (activePlanet + i + 1) % PLANETS.length;
                            const p = PLANETS[idx];
                            return (
                                <motion.div
                                    key={idx}
                                    className="absolute rounded-full opacity-[0.08]"
                                    animate={{ x: pos.x, y: pos.y, rotate: pos.rotate }}
                                    transition={{ type: "spring", stiffness: 40, damping: 25 }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        background: p.bgGradient,
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Main content: planet + info side by side */}
                    <div className="relative z-10 h-full flex items-center justify-center px-6">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full max-w-6xl">

                            {/* Planet Orb */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={planet.id + "-orb"}
                                    initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                    exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 22, duration: 0.7 }}
                                    style={{ perspective: 1000 }}
                                >
                                    <PlanetOrb planet={planet} isActive={true} />
                                </motion.div>
                            </AnimatePresence>

                            {/* Info Card */}
                            <AnimatePresence mode="wait">
                                <InfoCard key={planet.id + "-info"} planet={planet} />
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Scroll hint */}
                    {activePlanet === 0 && (
                        <motion.div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-white/40 uppercase tracking-widest"
                            animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span>Scroll to explore</span>
                            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                                <rect x="5" y="0" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="8" cy="5" r="2" fill="currentColor">
                                    <animateTransform attributeName="transform" type="translate" values="0,0;0,5;0,0" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                                <path d="M4 18l4 5 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};
