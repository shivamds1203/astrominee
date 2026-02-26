"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Brain, AlertCircle } from 'lucide-react';
import { AIChatBox } from '@/components/predictions/AIChatBox';

export default function PredictionsPage() {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState("");

    // Use dummy or test birth details to fetch the chart
    // In a real flow, this would come from a context or the user's saved profile
    const loadChartData = async () => {
        setLoading(true);
        setError("");
        try {
            // Using placeholder standard birth details to seed the chat
            const response = await fetch("/api/astrology", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    year: 1995,
                    month: 8,
                    date: 15,
                    hours: 14,
                    minutes: 30,
                    seconds: 0,
                    latitude: 28.6139,
                    longitude: 77.2090,
                    timezone: 5.5
                })
            });

            if (!response.ok) throw new Error("Failed to calculate chart data");

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
        <main className="min-h-screen pt-28 pb-12 px-6 max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 glass-panel rounded-full mb-4 border border-yellow-500/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <Bot className="w-8 h-8 text-yellow-500" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-white">AI Astrologer</h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    Get personalized insights based on your unique planetary configuration using our advanced AI model.
                </p>
            </div>

            {!chartData ? (
                <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
                    {!loading ? (
                        <div className="space-y-6">
                            <Brain className="w-16 h-16 text-gray-600 mx-auto" />
                            <p className="text-gray-400 max-w-sm mx-auto">
                                To consult with the Navagraha AI, we first need to cast your Vedic birth chart.
                            </p>

                            {error && (
                                <div className="text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm mt-4">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <button
                                onClick={loadChartData}
                                className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold py-3 px-8 rounded-full transition-all flex items-center gap-2 mx-auto shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95"
                            >
                                <Sparkles className="w-4 h-4" /> Cast Chart & Start Reading
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
                            <p className="text-yellow-500 text-sm animate-pulse">Aligning the Nakshatras...</p>
                        </div>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <AIChatBox chartData={chartData} />

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setChartData(null)}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Start Over
                        </button>
                    </div>
                </motion.div>
            )}
        </main>
    );
}
