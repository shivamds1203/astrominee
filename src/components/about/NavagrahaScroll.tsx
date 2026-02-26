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
// memo prevents re-render when parent re-renders due to scroll
const StarField = memo(({ planet }: { planet: typeof PLANETS[0] }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Deep space */}
            <div className="absolute inset-0" style={{ background: "#020408" }} />
            {/* Nebula glow – CSS animation, no JS */}
            <div
                className="absolute inset-0 nava-nebula"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${planet.aura} 0%, transparent 70%)`,
                }}
            />
            {/* Static stars – positions pre-calculated, CSS animation only */}
            {STAR_DATA.map((s) => (
                <div
                    key={s.id}
                    className="absolute rounded-full bg-white nava-twinkle"
                    style={{
                        width: s.size,
                        height: s.size,
                        left: s.left,
                        top: s.top,
                        opacity: Number(s.opacity),
                        animationDuration: s.duration,
                        animationDelay: s.delay,
                    }}
                />
            ))}
        </div>
    );
});
StarField.displayName = "StarField";

// ─── Planet Orb ──────────────────────────────────────────────────────────────────
// Heavy animations removed on mobile via CSS. rotateY removed (breaks iOS overflow:hidden).
const PlanetOrb = memo(({ planet, isActive }: { planet: typeof PLANETS[0]; isActive: boolean }) => {
    const rotDuration: Record<string, number> = {
        radiate: 12, breathe: 18, pulse: 8, orbit: 6,
        expand: 20, sparkle: 15, ring: 30, smoke: 10, dissolve: 25,
    };
    const duration = rotDuration[planet.animType] ?? 15;

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: 260, height: 260 }}
        >
            {/* Outer aura ring 1 */}
            {isActive && (
                <>
                    <div
                        className="absolute rounded-full nava-ring-pulse-1"
                        style={{
                            width: 304,
                            height: 304,
                            border: `1px solid ${planet.glow}30`,
                        }}
                    />
                    <div
                        className="absolute rounded-full nava-ring-pulse-2"
                        style={{
                            width: 348,
                            height: 348,
                            border: `1px solid ${planet.glow}18`,
                        }}
                    />
                </>
            )}

            {/* Saturn rings – CSS only, no framer-motion rotation */}
            {planet.hasRings && (
                <>
                    <div
                        className="absolute nava-saturn-ring-1"
                        style={{
                            width: 340,
                            height: 340,
                            borderRadius: "50%",
                            border: `6px solid ${planet.color}60`,
                            boxShadow: `0 0 20px ${planet.color}40`,
                        }}
                    />
                    <div
                        className="absolute nava-saturn-ring-2"
                        style={{
                            width: 300,
                            height: 300,
                            borderRadius: "50%",
                            border: `3px solid ${planet.secondGlow}40`,
                        }}
                    />
                </>
            )}

            {/* Main planet sphere – only scale/opacity animation, NO rotateY, translateZ for GPU */}
            <motion.div
                animate={isActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-full nava-planet-sphere"
                style={{
                    width: 220,
                    height: 220,
                    // Use CSS background, not gradient on motion - more iOS compatible
                    background: planet.bgGradient,
                    boxShadow: `0 0 30px ${planet.glow}50, inset -10px -10px 20px rgba(0,0,0,0.4), inset 4px 4px 10px rgba(255,255,255,0.1)`,
                    // GPU compositing hint
                    transform: "translateZ(0)",
                    willChange: "transform",
                    // Explicit border-radius ensures clipping works on iOS
                    WebkitBorderRadius: "50%",
                    overflow: "hidden",
                }}
            >
                {/* Surface texture */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(255,255,255,0.08) 12px, rgba(255,255,255,0.08) 13px)`,
                    }}
                />
                {/* Highlight */}
                <div
                    className="absolute top-4 left-6 rounded-full"
                    style={{ width: 64, height: 40, background: "rgba(255,255,255,0.08)" }}
                />
                {/* Slow CSS rotation for the symbol overlay – no framer */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ animationDuration: `${duration}s` }}
                >
                    <span
                        className="font-bold nava-symbol-spin"
                        style={{
                            fontSize: 80,
                            color: "rgba(255,255,255,0.10)",
                            animationDuration: `${duration}s`,
                        }}
                    >
                        {planet.symbol}
                    </span>
                </div>
            </motion.div>

            {/* Zodiac bg symbol – CSS animation only */}
            <div
                className="absolute font-bold pointer-events-none nava-zodiac-float"
                style={{ fontSize: 280, lineHeight: 1, zIndex: -1, color: "rgba(255,255,255,0.04)" }}
            >
                {planet.zodiac}
            </div>
        </div>
    );
});
PlanetOrb.displayName = "PlanetOrb";

// ─── Info Card ────────────────────────────────────────────────────────────────────
// backdropFilter removed – too expensive on mobile/iOS
const InfoCard = memo(({ planet }: { planet: typeof PLANETS[0] }) => (
    <motion.div
        key={planet.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="relative rounded-3xl p-6 w-full overflow-hidden"
        style={{
            maxWidth: 380,
            // Solid dark bg instead of backdropFilter blur (huge mobile perf win)
            background: "rgba(6,10,22,0.95)",
            border: `1px solid ${planet.color}40`,
            boxShadow: `0 0 24px ${planet.aura}`,
            // GPU layer
            transform: "translateZ(0)",
            willChange: "opacity, transform",
        }}
    >
        {/* Corner glow */}
        <div
            className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top right, ${planet.aura} 0%, transparent 70%)` }}
        />

        {/* Header */}
        <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl" aria-hidden="true">{planet.symbol}</span>
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{planet.name}</h2>
                    <p className="text-sm font-medium" style={{ color: planet.color }}>{planet.sanskrit}</p>
                </div>
            </div>
            {/* Energy pill */}
            <div
                className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase"
                style={{ borderColor: `${planet.color}50`, color: planet.color, background: `${planet.color}15` }}
            >
                <span className="w-1.5 h-1.5 rounded-full nava-dot-pulse" style={{ background: planet.color }} />
                {planet.energy}
            </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-5 w-full" style={{ background: `linear-gradient(to right, ${planet.color}60, transparent)` }} />

        {/* Description */}
        <div className="space-y-3">
            {planet.description.map((line, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 220 }}
                    className="flex items-start gap-3"
                >
                    <span
                        className="mt-1.5 flex-shrink-0 rounded-full"
                        style={{ width: 6, height: 6, background: planet.color, boxShadow: `0 0 6px ${planet.color}` }}
                    />
                    <p className="text-sm text-gray-300 leading-relaxed">{line}</p>
                </motion.div>
            ))}
        </div>

        {/* Bottom fade */}
        <div
            className="absolute bottom-0 left-0 right-0 h-8 rounded-b-3xl pointer-events-none"
            style={{ background: `linear-gradient(to top, ${planet.color}10, transparent)` }}
        />
    </motion.div>
));
InfoCard.displayName = "InfoCard";

// ─── Progress Dots ────────────────────────────────────────────────────────────────
const ProgressDots = memo(({ active, total, onDotClick }: { active: number; total: number; onDotClick: (i: number) => void }) => (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3" role="navigation" aria-label="Planet navigation">
        {Array.from({ length: total }, (_, i) => {
            const p = PLANETS[i];
            const isActive = i === active;
            return (
                <button
                    key={i}
                    onClick={() => onDotClick(i)}
                    aria-label={p.name}
                    aria-current={isActive ? "true" : undefined}
                    className="relative rounded-full focus:outline-none group"
                    style={{
                        width: 8,
                        height: 8,
                        background: isActive ? p.color : "rgba(255,255,255,0.2)",
                        boxShadow: isActive ? `0 0 10px ${p.color}` : "none",
                        transform: isActive ? "scale(1.6)" : "scale(1)",
                        transition: "transform 0.25s, background 0.25s, box-shadow 0.25s",
                    }}
                >
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white whitespace-nowrap bg-black/60 px-2 py-0.5 rounded-full pointer-events-none">
                        {p.name}
                    </span>
                </button>
            );
        })}
    </div>
));
ProgressDots.displayName = "ProgressDots";

// ─── Main Component ───────────────────────────────────────────────────────────────
export const NavagrahaScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activePlanet, setActivePlanet] = useState(0);

    // Use useScroll + useMotionValueEvent instead of useSpring to avoid re-renders
    // on every frame during scroll (spring was the main FPS killer)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", useCallback((v: number) => {
        const idx = Math.min(Math.floor(v * PLANETS.length), PLANETS.length - 1);
        setActivePlanet((prev) => (prev === idx ? prev : idx));
    }, []));

    const scrollToPlanet = useCallback((i: number) => {
        const container = containerRef.current;
        if (!container) return;
        const target = (i / PLANETS.length) * container.scrollHeight + container.offsetTop;
        window.scrollTo({ top: target, behavior: "smooth" });
    }, []);

    const planet = PLANETS[activePlanet];

    // Background ghost planets – computed but not animated per-frame
    const ghostPositions = useMemo(() => [
        { x: -300, y: -110, rotate: -25 },
        { x: -260, y: 110, rotate: 15 },
        { x: 300, y: -110, rotate: 25 },
        { x: 260, y: 110, rotate: -15 },
    ], []);

    return (
        <>
            <style>{`
                @keyframes nava-twinkle {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(1.2); }
                }
                @keyframes nava-nebula-pulse {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.3; }
                }
                @keyframes nava-ring-pulse-1 {
                    0%, 100% { transform: scale(1) translateZ(0); opacity: 0.3; }
                    50% { transform: scale(1.1) translateZ(0); opacity: 0.08; }
                }
                @keyframes nava-ring-pulse-2 {
                    0%, 100% { transform: scale(1) translateZ(0); opacity: 0.15; }
                    50% { transform: scale(1.15) translateZ(0); opacity: 0.04; }
                }
                @keyframes nava-saturn-ring-1 {
                    from { transform: rotateX(75deg) rotateZ(0deg); }
                    to { transform: rotateX(75deg) rotateZ(360deg); }
                }
                @keyframes nava-saturn-ring-2 {
                    from { transform: rotateX(75deg) rotateZ(360deg); }
                    to { transform: rotateX(75deg) rotateZ(0deg); }
                }
                @keyframes nava-symbol-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes nava-zodiac-float {
                    0%, 100% { transform: rotate(-3deg) scale(1); }
                    50% { transform: rotate(3deg) scale(1.04); }
                }
                @keyframes nava-dot-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                .nava-twinkle {
                    animation-name: nava-twinkle;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }
                .nava-nebula {
                    animation: nava-nebula-pulse 6s ease-in-out infinite;
                }
                .nava-ring-pulse-1 {
                    animation: nava-ring-pulse-1 3s ease-in-out infinite;
                }
                .nava-ring-pulse-2 {
                    animation: nava-ring-pulse-2 4s ease-in-out infinite 0.5s;
                }
                .nava-saturn-ring-1 {
                    animation: nava-saturn-ring-1 20s linear infinite;
                }
                .nava-saturn-ring-2 {
                    animation: nava-saturn-ring-2 30s linear infinite;
                }
                .nava-symbol-spin {
                    display: inline-block;
                    animation-name: nava-symbol-spin;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                .nava-zodiac-float {
                    animation: nava-zodiac-float 8s ease-in-out infinite;
                }
                .nava-dot-pulse {
                    display: inline-block;
                    animation: nava-dot-pulse 2s ease-in-out infinite;
                }
                .nava-planet-sphere {
                    /* Isolate stacking context on iOS so overflow:hidden clips correctly */
                    -webkit-mask-image: -webkit-radial-gradient(white, black);
                    isolation: isolate;
                }

                /* On mobile: reduce twinkle and nebula to ease GPU */
                @media (max-width: 768px) {
                    .nava-twinkle { animation-duration: 6s !important; }
                    .nava-nebula { animation: none !important; opacity: 0.2 !important; }
                }
            `}</style>

            {/* Tall scroll container */}
            <div ref={containerRef} style={{ height: `${PLANETS.length * 150}vh` }} className="relative overflow-visible">

                {/* Sticky viewport */}
                <div className="sticky top-0 h-screen overflow-hidden">

                    {/* Background star field */}
                    <StarField planet={planet} />

                    {/* Scroll progress bar */}
                    <motion.div
                        className="fixed top-0 left-0 h-0.5 z-50 origin-left"
                        style={{
                            scaleX: scrollYProgress,
                            background: `linear-gradient(to right, ${planet.color}, ${planet.secondGlow})`,
                            boxShadow: `0 0 8px ${planet.color}`,
                        }}
                    />

                    {/* Nav dots */}
                    <ProgressDots active={activePlanet} total={PLANETS.length} onDotClick={scrollToPlanet} />

                    {/* Planet counter */}
                    <div
                        className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-xs font-bold tracking-[4px] uppercase"
                        style={{ color: `${planet.color}90` }}
                    >
                        {String(activePlanet + 1).padStart(2, "0")} / {String(PLANETS.length).padStart(2, "0")} — Navagraha
                    </div>

                    {/* Ghost background planets – static positions, spring transition only on change */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                        {ghostPositions.map((pos, i) => {
                            const idx = (activePlanet + i + 1) % PLANETS.length;
                            const p = PLANETS[idx];
                            return (
                                <motion.div
                                    key={idx}
                                    className="absolute rounded-full"
                                    animate={{ x: pos.x, y: pos.y, rotate: pos.rotate }}
                                    transition={{ type: "spring", stiffness: 40, damping: 28 }}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        background: p.bgGradient,
                                        opacity: 0.07,
                                        // GPU layer
                                        transform: "translateZ(0)",
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Main content: planet + info */}
                    <div className="relative z-10 h-full flex items-center justify-center px-4">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 w-full max-w-6xl">

                            {/* Planet Orb – removed rotateY from enter/exit (iOS overflow:hidden fix) */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={planet.id + "-orb"}
                                    initial={{ scale: 0.85, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.85, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 120, damping: 22, duration: 0.5 }}
                                // NO rotateY, NO perspective – both break iOS overflow:hidden on rounded elements
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

                    {/* Scroll hint (first planet only) */}
                    {activePlanet === 0 && (
                        <motion.div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-white/40 uppercase tracking-widest"
                            animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span>Scroll to explore</span>
                            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
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
