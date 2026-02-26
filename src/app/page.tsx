"use client";

import React from "react";
import ZodiacWheel from "@/components/ui/ZodiacWheel";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 text-center relative pt-24">
            {/* ── Hero ── */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12">
                <div className="flex-1 text-left z-10">
                    <ScrollReveal duration={0.8} yOffset={40}>
                        <h1 className="text-5xl md:text-[5.5rem] font-bold mb-6 tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] leading-[1.1]">
                            Cosmic Intelligence, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-indigo-300 to-violet-glow">
                                Beautifully Mapped.
                            </span>
                        </h1>
                        <p className="text-xl text-indigo-100/80 mb-10 max-w-lg leading-relaxed font-light">
                            Generate precise Vedic Astrology charts (D1-D60), deep dive into planetary degrees, and explore premium AI-powered cosmic insights.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}>
                                <Link href="/form" className="relative group inline-flex items-center justify-center bg-transparent w-full sm:w-auto">
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-electric-blue to-violet-glow rounded-full blur-[10px] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="relative z-10 bg-black/50 backdrop-blur-md border border-white/20 text-white font-medium py-4 px-10 rounded-full transition-all group-hover:bg-white/10 w-full text-center text-lg shadow-[inset_0_1px_rgba(255,255,255,0.2)]">
                                        Generate Free Chart
                                    </span>
                                </Link>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}>
                                <Link href="/about" className="glass-panel text-white font-medium py-4 px-10 rounded-full transition-all hover:bg-white/5 hover:border-white/20 text-center text-lg flex items-center justify-center w-full sm:w-auto">
                                    How it works
                                </Link>
                            </motion.div>
                        </div>

                        <div className="mt-14 flex flex-wrap items-center gap-6 text-sm text-indigo-200/60 font-medium tracking-wide">
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_10px_#00f0ff]" /> Degree Precision</div>
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-glow shadow-[0_0_10px_#8b5cf6]" /> AI Predictions</div>
                            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_#d4af37]" /> D1-D60 Vargas</div>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="flex-1 flex justify-center items-center w-full">
                    <ScrollReveal delay={0.2} duration={1}>
                        <ZodiacWheel />
                    </ScrollReveal>
                </div>
            </div>

            {/* ── Creator / Contact Section ── */}
            <ScrollReveal delay={0.1} yOffset={60} className="w-full max-w-6xl mt-20">
                {/* Decorative divider */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                    <span className="text-xs font-bold tracking-[4px] uppercase text-indigo-400/60">Built by</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#080d1a]/80 backdrop-blur-2xl p-8 md:p-10 shadow-[0_0_60px_rgba(79,70,229,0.1)]">
                    {/* Background glows */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12)_0%,transparent_70%)]" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-indigo-500/10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-purple-500/10" />
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
                                <p className="text-[11px] font-bold tracking-[3px] uppercase text-indigo-400/70 mb-1">Creator &amp; Developer</p>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Shivam Suryawanshi</h2>
                                <p className="text-sm text-gray-400 mt-1">Vedic Astrology · Full Stack · AI</p>
                            </div>
                        </div>

                        {/* Right — contact buttons */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-end items-center">
                            <motion.a
                                href="tel:+919049547814"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all text-white font-semibold text-sm"
                            >
                                <span className="text-base">📞</span>
                                <span>Call Me</span>
                            </motion.a>

                            <motion.a
                                href="mailto:shivamsuryawanshi7682@gmail.com"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all text-white font-semibold text-sm"
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
                                className="relative group flex items-center gap-2.5 px-5 py-3 rounded-xl text-white font-semibold text-sm overflow-hidden"
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
            </ScrollReveal>
        </main>
    );
}

