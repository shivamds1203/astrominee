"use client";

import React from "react";
import ZodiacWheel from "@/components/ui/ZodiacWheel";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollSection3D } from "@/components/ui/ScrollSection3D";
import { Sparkles, Compass, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 text-center relative pt-28 overflow-x-hidden">
            {/* ── Hero 3D Section ── */}
            <ScrollSection3D intensity="subtle" depth={40} className="w-full max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12">
                    <div className="flex-1 text-left z-10">
                        <ScrollReveal duration={0.8} yOffset={30}>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
                                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Vedic Astrology
                            </div>

                            <h1 className="text-5xl md:text-[5.2rem] font-black mb-6 tracking-tighter text-slate-900 dark:text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] leading-[1.08]">
                                Cosmic Intelligence, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-electric-blue dark:via-indigo-300 dark:to-violet-glow">
                                    Beautifully Mapped.
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 dark:text-indigo-100/80 mb-10 max-w-lg leading-relaxed font-light">
                                Generate precise Vedic Astrology charts (D1-D60), deep dive into planetary degrees with genuine NASA captures, and explore AI-powered cosmic insights.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}>
                                    <Link href="/form" className="relative group inline-flex items-center justify-center bg-transparent w-full sm:w-auto">
                                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-electric-blue to-violet-glow rounded-full blur-[10px] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                                        <span className="relative z-10 bg-slate-900 dark:bg-black/60 backdrop-blur-md border border-white/20 text-white font-semibold py-4 px-9 rounded-full transition-all group-hover:bg-slate-800 dark:group-hover:bg-white/10 w-full text-center text-base shadow-[inset_0_1px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                                            Generate Free Chart <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}>
                                    <Link href="/about" className="glass-panel text-slate-800 dark:text-white font-medium py-4 px-9 rounded-full transition-all hover:bg-slate-200/50 dark:hover:bg-white/5 text-center text-base flex items-center justify-center w-full sm:w-auto border border-slate-300/80 dark:border-white/10">
                                        How it works
                                    </Link>
                                </motion.div>
                            </div>

                            <div className="mt-12 flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-500 dark:text-indigo-200/60 font-medium tracking-wide">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-electric-blue shadow-[0_0_10px_#00f0ff]" /> Arc-Minute Precision</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-violet-glow shadow-[0_0_10px_#8b5cf6]" /> Navagraha AI</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-gold shadow-[0_0_10px_#d4af37]" /> D1-D60 Divisional Vargas</div>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="flex-1 flex justify-center items-center w-full">
                        <ScrollReveal delay={0.2} duration={1}>
                            <ZodiacWheel />
                        </ScrollReveal>
                    </div>
                </div>
            </ScrollSection3D>

            {/* ── Feature Highlights 3D Section ── */}
            <ScrollSection3D intensity="medium" depth={50} className="w-full max-w-6xl mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-yellow-400 mb-6">
                            <Compass className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">9 Graha NASA Imagery</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-light">
                            Photographic space agency planet discs placed directly on your Kundli chart positions with real-time degrees.
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Comprehensive Vargas</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-light">
                            Instant calculation of Rashi (D1), Navamsa (D9), Dashamsha (D10) up to Shashtiamsa (D60) with accurate Nakshatra padas.
                        </p>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure AI Consultation</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-light">
                            Server-side encrypted calculations and Parashari-principled AI synthesis for personality, career, and karma remedies.
                        </p>
                    </div>
                </div>
            </ScrollSection3D>

            {/* ── Creator / Contact 3D Section ── */}
            <ScrollSection3D intensity="subtle" depth={30} className="w-full max-w-6xl mt-24 mb-12">
                {/* Decorative divider */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                    <span className="text-xs font-bold tracking-[4px] uppercase text-indigo-500 dark:text-indigo-400/70">Built by</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#080d1a]/80 backdrop-blur-2xl p-8 md:p-10 shadow-[0_0_60px_rgba(79,70,229,0.1)]">
                    {/* Background ambient glows */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12)_0%,transparent_70%)]" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                        {/* Left — identity */}
                        <div className="flex items-center gap-5 text-left">
                            <motion.div
                                className="relative flex-shrink-0"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.5)]">
                                    <span className="text-2xl text-white select-none">✦</span>
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#080d1a] shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                            </motion.div>
                            <div>
                                <p className="text-[11px] font-bold tracking-[3px] uppercase text-indigo-600 dark:text-indigo-400/70 mb-1">Creator &amp; Developer</p>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Shivam Suryawanshi</h2>
                                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Vedic Astrology · Full Stack · AI</p>
                            </div>
                        </div>

                        {/* Right — contact buttons */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-end items-center">
                            <motion.a
                                href="tel:+919049547814"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-slate-800 dark:text-white font-semibold text-sm shadow-sm"
                            >
                                <span className="text-base">📞</span>
                                <span>Call Me</span>
                            </motion.a>

                            <motion.a
                                href="mailto:shivamsuryawanshi7682@gmail.com"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-slate-800 dark:text-white font-semibold text-sm shadow-sm"
                            >
                                <span className="text-base">✉️</span>
                                <span>Email Me</span>
                            </motion.a>

                            <motion.a
                                href="https://www.instagram.com/_._.shivam.__/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative group flex items-center gap-2.5 px-5 py-3 rounded-xl text-white font-semibold text-sm overflow-hidden shadow-sm"
                                style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", border: "1px solid rgba(255,255,255,0.15)" }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: "linear-gradient(135deg,#9b4ecf,#ff3333,#ffd060)" }} />
                                <svg className="relative z-10 w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <span className="relative z-10">Instagram</span>
                            </motion.a>
                        </div>
                    </div>
                </div>
            </ScrollSection3D>
        </main>
    );
}


