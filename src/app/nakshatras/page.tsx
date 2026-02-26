"use client";

import React from "react";
import { motion } from "framer-motion";

const NAKSHATRAS = [
    { num: 1, name: "Ashwini", ruler: "Ketu", deity: "Ashwini Kumaras", element: "Earth", animal: "Male Horse", traits: "Pioneering, adventurous, swift, healing" },
    { num: 2, name: "Bharani", ruler: "Venus", deity: "Yama", element: "Earth", animal: "Male Elephant", traits: "Creative, passionate, transforming, dutiful" },
    { num: 3, name: "Krittika", ruler: "Sun", deity: "Agni", element: "Earth", animal: "Female Sheep", traits: "Sharp, illuminating, purifying, critical" },
    { num: 4, name: "Rohini", ruler: "Moon", deity: "Brahma", element: "Earth", animal: "Male Serpent", traits: "Fertile, materialistic, beautiful, artistic" },
    { num: 5, name: "Mrigashira", ruler: "Mars", deity: "Soma", element: "Earth", animal: "Female Serpent", traits: "Searching, wandering, curious, sensual" },
    { num: 6, name: "Ardra", ruler: "Rahu", deity: "Rudra", element: "Water", animal: "Female Dog", traits: "Stormy, destructive/transformative, analytical, emotional" },
    { num: 7, name: "Punarvasu", ruler: "Jupiter", deity: "Aditi", element: "Water", animal: "Female Cat", traits: "Nurturing, restoring, optimistic, returning" },
    { num: 8, name: "Pushya", ruler: "Saturn", deity: "Brihaspati", element: "Water", animal: "Male Goat", traits: "Nourishing, auspicious, caring, traditional" },
    { num: 9, name: "Ashlesha", ruler: "Mercury", deity: "Nagas", element: "Water", animal: "Male Cat", traits: "Mystical, clinging, deceptive, insightful" },
    { num: 10, name: "Magha", ruler: "Ketu", deity: "Pitris", element: "Water", animal: "Male Rat", traits: "Royal, ancestral, authoritative, proud" },
    { num: 11, name: "Purva Phalguni", ruler: "Venus", deity: "Bhaga", element: "Water", animal: "Female Rat", traits: "Relaxed, luxurious, romantic, charismatic" },
    { num: 12, name: "Uttara Phalguni", ruler: "Sun", deity: "Aryaman", element: "Fire", animal: "Male Cow", traits: "Responsible, friendly, reliable, patronizing" },
    { num: 13, name: "Hasta", ruler: "Moon", deity: "Savitar", element: "Fire", animal: "Female Buffalo", traits: "Skilled, grasping, detailed, healing" },
    { num: 14, name: "Chitra", ruler: "Mars", deity: "Tvastar", element: "Fire", animal: "Female Tiger", traits: "Architectural, magical, beautiful, structural" },
    { num: 15, name: "Swati", ruler: "Rahu", deity: "Vayu", element: "Fire", animal: "Male Buffalo", traits: "Independent, scattering, diplomatic, adaptable" },
    { num: 16, name: "Vishakha", ruler: "Jupiter", deity: "Indra/Agni", element: "Fire", animal: "Male Tiger", traits: "Purposeful, focused, triumphant, obsessed" },
    { num: 17, name: "Anuradha", ruler: "Saturn", deity: "Mitra", element: "Fire", animal: "Female Deer", traits: "Devoted, friendly, seeking, mystical" },
    { num: 18, name: "Jyeshtha", ruler: "Mercury", deity: "Indra", element: "Water", animal: "Male Deer", traits: "Elder, protective, authoritative, complex" },
    { num: 19, name: "Mula", ruler: "Ketu", deity: "Nirriti", element: "Water", animal: "Male Dog", traits: "Rooted, destructive, profound, investigating" },
    { num: 20, name: "Purva Ashadha", ruler: "Venus", deity: "Ap", element: "Water", animal: "Male Monkey", traits: "Invincible, watery, emotional, convincing" },
    { num: 21, name: "Uttara Ashadha", ruler: "Sun", deity: "Vishvedevas", element: "Water", animal: "Male Mongoose", traits: "Universal, enduring, victorious, unquestioned" },
    { num: 22, name: "Shravana", ruler: "Moon", deity: "Vishnu", element: "Space", animal: "Female Monkey", traits: "Listening, learning, receptive, silent" },
    { num: 23, name: "Dhanishta", ruler: "Mars", deity: "Vasus", element: "Space", animal: "Female Lion", traits: "Wealthy, rhythmic, famous, musical" },
    { num: 24, name: "Shatabhisha", ruler: "Rahu", deity: "Varuna", element: "Space", animal: "Male Horse", traits: "Healing, secretive, hundred-fold, scientific" },
    { num: 25, name: "Purva Bhadrapada", ruler: "Jupiter", deity: "Aja Ekapada", element: "Space", animal: "Male Lion", traits: "Fiery, intense, transformative, mystical" },
    { num: 26, name: "Uttara Bhadrapada", ruler: "Saturn", deity: "Ahir Budhyana", element: "Space", animal: "Female Cow", traits: "Deep, stabilizing, wise, compassionate" },
    { num: 27, name: "Revati", ruler: "Mercury", deity: "Pushan", element: "Space", animal: "Female Elephant", traits: "Wealthy, protective, concluding, empathic" }
];

export default function NakshatrasPage() {
    return (
        <main className="min-h-screen pt-28 pb-12 px-6 max-w-7xl mx-auto relative">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue via-indigo-300 to-violet-glow drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] mb-4">
                    The 27 Nakshatras
                </h1>
                <p className="text-lg text-indigo-200/70 max-w-2xl mx-auto font-light">
                    Explore the ancient lunar mansions. These 27 cosmic sectors profoundly shape human consciousness, personality traits, and deep psychological drivers.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {NAKSHATRAS.map((nak, idx) => (
                    <motion.div
                        key={nak.num}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.5, ease: "easeOut" }}
                        whileHover={{
                            y: -10,
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                            borderColor: "rgba(139,92,246,0.5)"
                        }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer transition-all duration-300"
                    >
                        {/* Hover Overlay Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/0 to-violet-glow/0 group-hover:from-electric-blue/10 group-hover:to-violet-glow/10 transition-colors duration-500" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-5xl font-serif text-white/5 font-bold absolute -top-4 -right-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    {nak.num.toString().padStart(2, '0')}
                                </span>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-100 group-hover:text-electric-blue transition-colors">
                                        {nak.name}
                                    </h3>
                                    <span className="text-xs font-mono text-gold uppercase tracking-widest">{nak.deity}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-indigo-200/50">Ruler</span>
                                    <span className="text-indigo-100 font-medium">{nak.ruler}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-indigo-200/50">Element</span>
                                    <span className="text-indigo-100 font-medium">{nak.element}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-indigo-200/50">Symbol</span>
                                    <span className="text-indigo-100 font-medium">{nak.animal}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-sm text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-2">
                                    {nak.traits}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </main>
    )
}
