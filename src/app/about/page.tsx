"use client";

import React from "react";
import { NavagrahaScroll } from "@/components/about/NavagrahaScroll";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Globe, Shield, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollSection3D } from "@/components/ui/ScrollSection3D";
import Link from "next/link";

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
        <main className="min-h-screen relative z-0">
            {/* ── Hero Header 3D Section ── */}
            <ScrollSection3D intensity="subtle" depth={35} className="text-center pt-32 pb-16 px-6 relative z-10">
                <ScrollReveal duration={0.8}>
                    <p className="text-xs font-bold tracking-[5px] uppercase text-indigo-600 dark:text-indigo-400/70 mb-4">About Astrominee</p>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 dark:text-white tracking-tighter leading-tight">
                        Ancient Wisdom,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 dark:from-yellow-400 dark:via-orange-300 dark:to-amber-500">
                            Modern Vision
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
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
                        { icon: Sparkles, color: "text-amber-500", title: "High Precision", text: "Advanced ephemeris calculations ensuring exact planetary degrees and Dasha timings to the minute." },
                        { icon: Globe, color: "text-blue-500 dark:text-blue-400", title: "Modern Interface", text: "Experience your cosmic blueprint through cinematic 3D visualizations and Framer-style animations." },
                        { icon: Shield, color: "text-emerald-500 dark:text-emerald-400", title: "Private & Secure", text: "Your birth details are sensitive. We process data securely without storing it unencrypted." },
                    ].map(({ icon: Icon, color, title, text }) => (
                        <motion.div
                            key={title}
                            variants={itemVariants}
                            whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative rounded-3xl p-8 overflow-hidden glass-panel border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40 transition-all gpu-layer user-select-none shadow-xl"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                                style={{ background: "radial-gradient(ellipse at top right, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
                            <Icon className={`w-9 h-9 ${color} mb-4`} />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed font-light">{text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </ScrollSection3D>

            {/* ── Cinematic Navagraha Section Header ── */}
            <ScrollSection3D intensity="subtle" depth={25} className="text-center py-16 px-6 relative z-10">
                <ScrollReveal>
                    <p className="text-xs font-bold tracking-[5px] uppercase text-purple-600 dark:text-purple-400/70 mb-3">Scroll to Explore</p>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        The{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 dark:from-purple-400 dark:via-indigo-300 dark:to-cyan-400">
                            9 Navagraha
                        </span>
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto text-base font-light">
                        Nine celestial bodies. Nine forces shaping your destiny. Scroll through each planet with genuine NASA captures and discover their astrological power.
                    </p>
                </ScrollReveal>
            </ScrollSection3D>

            {/* ── Navagraha 3D Scroll Journey ── */}
            <NavagrahaScroll />

            {/* ── Astrologer & Readings Section ── */}
            <ScrollSection3D intensity="subtle" depth={35} className="max-w-4xl mx-auto py-16 px-6 relative z-10">
                <div className="glass-panel rounded-3xl p-8 md:p-12 border border-amber-300/80 dark:border-white/10 shadow-2xl bg-white/80 dark:bg-[#080d1a]/80 backdrop-blur-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-700 flex items-center justify-center text-4xl text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] flex-shrink-0">
                            🕉️
                        </div>
                        <div className="text-center md:text-left">
                            <span className="text-xs font-bold uppercase tracking-[3px] text-amber-600 dark:text-yellow-400 block mb-1">
                                Astrologer &amp; Founder
                            </span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                                Shivam Suryawanshi
                            </h2>
                            <p className="text-slate-600 dark:text-gray-300 text-sm md:text-base leading-relaxed font-light mb-6">
                                Dedicated to reviving authentic Vedic Jyotish with mathematical precision and compassionate personal consultation. Every reading explores your Lagna, Moon sign, planetary dignity, divisional charts (D1 to D60), and Vimshottari Mahadashas to illuminate your soul&apos;s karmic path and practical remedies.
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <Link
                                    href="/form"
                                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold text-sm hover:scale-105 transition-all shadow-md"
                                >
                                    Get Personal Reading
                                </Link>
                                <a
                                    href="tel:+919049547814"
                                    className="px-6 py-3 rounded-full border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-medium text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                >
                                    📞 Consult Directly
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollSection3D>

            {/* ── Bottom CTA 3D Section ── */}
            <ScrollSection3D intensity="medium" depth={40} className="text-center py-20 px-6 relative z-10">
                <ScrollReveal yOffset={30}>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                        Ready to explore your cosmic map?
                    </h3>
                    <p className="text-slate-600 dark:text-gray-400 mb-8 font-light">Generate your Vedic birth chart and personal reading now.</p>
                    <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Link
                            href="/form"
                            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white text-lg transition-shadow shadow-xl"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
                        >
                            🪐 Get Free Reading <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </ScrollReveal>
            </ScrollSection3D>

        </main>
    );
}

