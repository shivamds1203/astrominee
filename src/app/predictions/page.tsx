"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Brain, AlertCircle, RefreshCw } from 'lucide-react';
import { AIChatBox } from '@/components/predictions/AIChatBox';

export default function PredictionsPage() {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState("");

    // Automatically hydrate chartData from sessionStorage if user already submitted birth details
    useEffect(() => {
        try {
            const savedChart = sessionStorage.getItem("chartData") || sessionStorage.getItem("astrologyChartData");
            if (savedChart) {
                const parsed = JSON.parse(savedChart);
                const arrayData = Array.isArray(parsed) ? parsed : (parsed.data || parsed.output || []);
                if (arrayData.length > 0) {
                    setChartData(arrayData);
                }
            }
        } catch (e) {
            console.error("Failed to load saved birth chart from session:", e);
        }
    }, []);

    const loadSampleChartData = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/astrology", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    year: 2002,
                    month: 3,
                    date: 12,
                    hours: 9,
                    minutes: 35,
                    seconds: 0,
                    latitude: 28.6139,
                    longitude: 77.2090,
                    timezone: 5.5
                })
            });

            if (!response.ok) throw new Error("Failed to calculate astrological chart");

            const data = await response.json();
            if (data.success && data.data) {
                setChartData(data.data);
            } else {
                throw new Error("Invalid chart data received");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-28 pb-16 px-4 md:px-6 max-w-5xl mx-auto relative z-10">
            {/* ── Header Section ── */}
            <section className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3.5 glass-panel rounded-full mb-4 border border-amber-500/30 dark:border-yellow-500/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <Bot className="w-8 h-8 text-amber-600 dark:text-yellow-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">
                    Astrominee AI Astrologer
                </h1>
                <p className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto font-light leading-relaxed text-sm md:text-base">
                    Your friendly ChatGPT-style cosmic guide. Ask anything about your Vedic Kundli, planetary transits, love compatibility, career timing, and personalized remedies.
                </p>
            </section>

            {/* ── Chatbot Container ── */}
            <section>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <AIChatBox chartData={chartData} />

                    {/* Chart Context Status Bar */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-2xl bg-amber-50/60 dark:bg-white/[0.02] border border-amber-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${chartData ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                            <span>
                                {chartData
                                    ? "Kundli Chart Data Linked (Personalized Sidereal Reading Active)"
                                    : "General Astrological Mode Active"}
                            </span>
                        </div>

                        {!chartData ? (
                            <button
                                type="button"
                                onClick={loadSampleChartData}
                                disabled={loading}
                                className="text-amber-700 dark:text-yellow-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                {loading ? "Aligning planetary chart..." : "Attach Sample Birth Chart"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setChartData(null)}
                                className="text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                                <RefreshCw className="w-3 h-3" /> Detach Chart
                            </button>
                        )}
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
