"use client";

import React from "react";
import { NavagrahaScroll } from "@/components/about/NavagrahaScroll";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Globe, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function AboutPage() {
    const shouldReduceMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 200, damping: 20 }
        }
    };

    return (
        <main className="min-h-screen relative overflow-x-hidden">
            {/* ── Hero Header ── */}
            <section className="text-center pt-32 pb-20 px-6 relative z-10">
                <ScrollReveal duration={0.8}>
                    <p className="text-xs font-bold tracking-[5px] uppercase text-indigo-400/60 mb-4">About Astrominee</p>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter leading-tight">
                        Ancient Wisdom,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-300 to-amber-500">
                            Modern Vision
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We bridge the sacred science of Jyotish with cutting-edge technology — delivering precise,
                        personalized, and visually stunning Vedic astrological insights.
                    </p>
                </ScrollReveal>

                {/* Feature cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16 text-left"
                >
                    {[
                        { icon: Sparkles, color: "text-yellow-500", title: "High Precision", text: "Advanced ephemeris calculations ensuring exact planetary degrees and Dasha timings to the minute." },
                        { icon: Globe, color: "text-blue-400", title: "Modern Interface", text: "Experience your cosmic blueprint through cinematic 3D visualizations and Framer-style animations." },
                        { icon: Shield, color: "text-emerald-400", title: "Private & Secure", text: "Your birth details are sensitive. We process data securely without storing it unencrypted." },
                    ].map(({ icon: Icon, color, title, text }) => (
                        <motion.div
                            key={title}
                            variants={itemVariants}
                            whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative rounded-2xl p-7 overflow-hidden glass hover:border-white/20 transition-all gpu-layer user-select-none"
                            style={{ background: "rgba(8,13,26,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                                style={{ background: "radial-gradient(ellipse at top right, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
                            <Icon className={`w-9 h-9 ${color} mb-4`} />
                            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── Cinematic Navagraha Section ── */}
            <section>
                <div className="text-center py-16 px-6 relative z-10">
                    <ScrollReveal>
                        <p className="text-xs font-bold tracking-[5px] uppercase text-purple-400/60 mb-3">Scroll to Explore</p>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                            The{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                                9 Navagraha
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto text-base">
                            Nine celestial bodies. Nine forces shaping your destiny. Scroll through each planet and discover how they influence every dimension of your life.
                        </p>
                    </ScrollReveal>
                </div>
                <NavagrahaScroll />
            </section>

            {/* ── Bottom CTA ── */}
            <section className="text-center py-24 px-6 relative z-10">
                <ScrollReveal yOffset={40}>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Ready to read your cosmic map?
                    </h3>
                    <p className="text-gray-400 mb-8">Generate your free Vedic birth chart in seconds.</p>
                    <motion.a
                        href="/form"
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white text-lg transition-shadow"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
                    >
                        🪐 Generate Free Chart
                    </motion.a>
                </ScrollReveal>
            </section>
        </main>
    );
}
