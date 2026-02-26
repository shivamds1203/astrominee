"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Brain } from 'lucide-react';

export default function PredictionsPage() {
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState("");

    const handleGenerate = () => {
        setLoading(true);
        setTimeout(() => {
            setPrediction("Based on your planetary placements (Sun in Capricorn, Moon in Aries), you are entering a period of significant career growth. Jupiter's aspect on your 10th house suggests new leadership opportunities in the next 6 months. However, Mars in Scorpio advises caution with impulsive financial investments. Focus on long-term stability.");
            setLoading(false);
        }, 2000);
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

            <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center text-center">
                {!prediction && !loading ? (
                    <div className="space-y-6">
                        <Brain className="w-16 h-16 text-gray-600 mx-auto" />
                        <p className="text-gray-400">Click below to synthesize your chart data into actionable insights.</p>
                        <button
                            onClick={handleGenerate}
                            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold py-3 px-8 rounded-full transition-all flex items-center gap-2 mx-auto"
                        >
                            <Sparkles className="w-4 h-4" /> Synthesize Insights
                        </button>
                    </div>
                ) : loading ? (
                    <div className="space-y-4">
                        <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
                        <p className="text-yellow-500 text-sm animate-pulse">Analyzing cosmic configurations...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-left w-full"
                    >
                        <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> Your Cosmic Reading
                        </h3>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-gray-300 leading-relaxed text-lg">{prediction}</p>
                        </div>
                        <button
                            onClick={() => setPrediction("")}
                            className="mt-6 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Reset
                        </button>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
