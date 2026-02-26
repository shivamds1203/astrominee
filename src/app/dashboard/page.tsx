"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Share2, ChevronDown, ChevronRight, Sparkles, BookmarkPlus, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NorthIndianChart } from "@/components/charts/NorthIndianChart";
import { SouthIndianChart } from "@/components/charts/SouthIndianChart";
import { generateDivisionalChart, getNakshatraDetails } from "@/lib/astrologyMath";
import { generateAstrologyPDF } from "@/lib/generatePDF";
import { PredictionsSection } from "@/components/dashboard/PredictionsSection";

const VARGAS = [
    { num: 1, name: "D1 - Rashi (Birth)" },
    { num: 2, name: "D2 - Hora (Wealth)" },
    { num: 3, name: "D3 - Drekkana (Siblings)" },
    { num: 4, name: "D4 - Chaturthamsa (Properties)" },
    { num: 7, name: "D7 - Saptamsa (Children)" },
    { num: 9, name: "D9 - Navamsa (Marriage/Dharma)" },
    { num: 10, name: "D10 - Dashamsa (Career)" },
    { num: 12, name: "D12 - Dwadashamsa (Parents)" },
    { num: 16, name: "D16 - Shodashamsa (Vehicles)" },
    { num: 20, name: "D20 - Vimshamsa (Spiritual)" },
    { num: 24, name: "D24 - Chaturvimshamsa (Education)" },
    { num: 27, name: "D27 - Saptavimshamsa (Strengths)" },
    { num: 30, name: "D30 - Trimshamsha (Misfortunes)" },
    { num: 40, name: "D40 - Khavedamsha (Auspiciousness)" },
    { num: 45, name: "D45 - Akshavedamsha (General)" },
    { num: 60, name: "D60 - Shashtiamsa (All areas)" }
];

export default function DashboardPage() {
    const [chartStyle, setChartStyle] = useState<"north" | "south">("north");
    const [planetsData, setPlanetsData] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedVarga, setSelectedVarga] = useState<number>(1);
    const [isVargaDropdownOpen, setIsVargaDropdownOpen] = useState(false);
    const [expandedInsight, setExpandedInsight] = useState<string | null>("personality");
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveChart = () => {
        if (!user) {
            alert("Please sign in from the top navigation to save your chart!");
            return;
        }
        setIsSaved(true);
        // In real app: save to Firestore here
    };

    const insights = [
        { id: "personality", title: "Personality Overview", content: "Based on your Sun in Sagittarius and Moon in Pisces, you possess a unique blend of fiery optimism and deep emotional sensitivity. You are a philosopher at heart, constantly seeking meaning, yet profoundly connected to the unspoken feelings of others." },
        { id: "career", title: "Career & Finance", content: "With your 10th House lord well-placed, leadership roles in creative or healing professions are highly favored. Expect a significant upward shift in career trajectory during your upcoming Jupiter planetary period." },
        { id: "relationships", title: "Marriage & Relationships", content: "Your 7th house dynamics suggest a partner who brings grounding structure to your life. The placement of Venus indicates that intellectual connection must precede emotional intimacy for long-term harmony." },
        { id: "health", title: "Health Insights", content: "Pay attention to your lower back and digestive system, as indicated by the 6th house placements. Regular grounding exercises and a structured routine will beautifully counter your naturally airy constitution." }
    ];

    useEffect(() => {
        setIsMounted(true);
        // Read the passed data from session storage (populated by the Form)
        const storedChart = sessionStorage.getItem("chartData");
        const storedUser = sessionStorage.getItem("userData");

        if (storedChart) {
            const rawData = JSON.parse(storedChart);
            // The API returns { output: [ { "0": {name: "Ascendant"...}, "1": {...} }, ... ] }
            const outputArray = rawData.output || [];
            const planetObjectMap = outputArray[0] || {};

            const planetsArray = Object.keys(planetObjectMap)
                .filter(k => k !== 'debug' && k !== 'ayanamsa') // Ignore metadata
                .map(k => planetObjectMap[k]);

            setPlanetsData(planetsArray);
        }
        if (storedUser) setUserData(JSON.parse(storedUser));
    }, []);

    if (!isMounted) return null;

    return (
        <main className="min-h-screen pt-28 pb-12 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-200">
                        {userData ? `${userData.name}'s Horoscope` : "Your Horoscope"}
                    </h1>
                    {userData && (
                        <p className="text-gray-400 mt-1">Born: {userData.dateOfBirth} at {userData.timeOfBirth} in {userData.placeOfBirth.split(',')[0]}</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveChart}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border ${isSaved
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border-indigo-500/30"
                            }`}
                    >
                        {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                        {isSaved ? "Saved" : "Save to Profile"}
                    </button>
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="glass-panel text-white hover:bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors border border-white/10"
                    >
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button
                        onClick={() => generateAstrologyPDF(planetsData || [], userData)}
                        className="glass-panel text-white hover:bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors border border-white/10"
                    >
                        <Download className="w-4 h-4" /> PDF Report
                    </button>
                </div>
            </motion.div>

            {/* Control Bar */}
            <div className="glass-panel p-2 rounded-xl border border-white/10 mb-8 inline-flex">
                <button
                    onClick={() => setChartStyle("north")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${chartStyle === "north" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "text-gray-400 hover:text-white"}`}
                >
                    North Indian
                </button>
                <button
                    onClick={() => setChartStyle("south")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${chartStyle === "south" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "text-gray-400 hover:text-white"}`}
                >
                    South Indian
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Main Rashi Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-2xl border border-yellow-500/20 shadow-[0_0_30px_rgba(212,175,55,0.1)] col-span-1 xl:col-span-2 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <span className="text-8xl font-serif">ॐ</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                            {VARGAS.find(v => v.num === selectedVarga)?.name}
                        </h2>

                        <div className="relative">
                            <button
                                onClick={() => setIsVargaDropdownOpen(!isVargaDropdownOpen)}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 transition-colors"
                            >
                                Change Chart <ChevronDown className="w-4 h-4" />
                            </button>

                            {isVargaDropdownOpen && (
                                <div className="absolute right-0 top-12 w-64 glass-panel border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 max-h-80 overflow-y-auto custom-scrollbar">
                                    {VARGAS.map(varga => (
                                        <button
                                            key={varga.num}
                                            onClick={() => { setSelectedVarga(varga.num); setIsVargaDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0 ${selectedVarga === varga.num ? 'bg-yellow-500/20 text-yellow-500' : 'text-gray-300 hover:bg-white/10'}`}
                                        >
                                            {varga.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="aspect-square max-w-lg mx-auto bg-black/50 rounded-xl border border-white/10 flex items-center justify-center relative backdrop-blur-md overflow-hidden p-4">
                        {chartStyle === "north" ? (
                            <NorthIndianChart planetsData={generateDivisionalChart(planetsData || [], selectedVarga)} />
                        ) : (
                            <SouthIndianChart
                                planetsData={generateDivisionalChart(planetsData || [], selectedVarga)}
                                userData={userData}
                            />
                        )}
                    </div>
                </motion.div>

                {/* Details & Dashas Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-6"
                >
                    <div className="flex-1 min-h-[400px]">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-violet-glow mb-4 flex items-center gap-2">
                            Analytical Data <span className="text-xs text-indigo-400 font-normal px-2 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">Precision</span>
                        </h3>
                        <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-black/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-indigo-200/70 text-xs uppercase tracking-widest font-semibold">
                                        <th className="py-4 px-4 font-medium">Planet</th>
                                        <th className="py-4 px-4 font-medium">Longitude (Exact)</th>
                                        <th className="py-4 px-4 font-medium">Sign (Rashi)</th>
                                        <th className="py-4 px-4 font-medium">Nakshatra</th>
                                        <th className="py-4 px-4 font-medium text-right">House</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planetsData && planetsData.length > 0 ? generateDivisionalChart(planetsData, selectedVarga).map((planet: any, idx: number) => {
                                        // Fix the sign fetching to use the dynamically calculated varga sign!
                                        const ZODIAC = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                                        const signName = planet.current_sign ? ZODIAC[planet.current_sign - 1] : "Unknown";

                                        // Formatting degree to 00° 00'
                                        const deg = planet.normDegree || 0;
                                        const d = Math.floor(deg);
                                        const m = Math.floor((deg - d) * 60);

                                        // Get Nakshatra using our AI algorithm
                                        const nakshatra = getNakshatraDetails(planet.fullDegree);

                                        return (
                                            <tr key={planet.name} className="border-b border-white/5 hover:bg-white-[0.03] transition-colors group relative">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2 relative z-10">
                                                        <span className={`w-2 h-2 rounded-full ${planet.name === 'Ascendant' ? 'bg-electric-blue shadow-[0_0_8px_#00f0ff]' : 'bg-gold shadow-[0_0_8px_#d4af37]'}`} />
                                                        <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
                                                            {planet.name} {planet.isRetro === "true" && <span className="text-rose-400 text-xs ml-1">(R)</span>}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-gray-400 font-mono text-sm group-hover:text-electric-blue transition-colors relative z-10">
                                                        {d}° {m}'
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 relative z-10">
                                                    <span className="text-indigo-200/80 text-sm group-hover:text-indigo-200 transition-colors">
                                                        {signName}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 relative z-10">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-200 text-sm group-hover:text-white transition-colors">{nakshatra.name}</span>
                                                        <span className="text-gray-500 text-xs uppercase tracking-wider">Pada {nakshatra.pada}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-right relative z-10">
                                                    <span className="text-yellow-500/80 font-medium group-hover:text-yellow-400 transition-colors">
                                                        {planet.house_number || 1}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-gray-500 text-sm italic">
                                                Complete the birth details form to see precise planetary data.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <h3 className="text-lg font-semibold text-white mb-4">Current Dasha</h3>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xl font-bold text-indigo-300">Jupiter</span>
                                <span className="text-sm text-gray-400">Mahadasha</span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-1.5 mb-2">
                                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <p className="text-xs text-gray-400 text-right">Ends in 2034</p>
                        </div>
                    </div>
                </motion.div>

                {/* Expandable AI Insights Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-1 lg:col-span-2 xl:col-span-3 mt-4"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">AI Cosmic Insights</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight) => (
                            <div
                                key={insight.id}
                                className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${expandedInsight === insight.id ? 'border-electric-blue/40 shadow-[0_0_30px_rgba(0,240,255,0.1)]' : 'border-white/5 hover:border-white/20 cursor-pointer'}`}
                            >
                                <button
                                    onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                                    className="w-full text-left p-5 flex items-center justify-between"
                                >
                                    <h3 className={`font-semibold text-lg transition-colors ${expandedInsight === insight.id ? 'text-electric-blue' : 'text-gray-200'}`}>
                                        {insight.title}
                                    </h3>
                                    <motion.div animate={{ rotate: expandedInsight === insight.id ? 90 : 0 }}>
                                        <ChevronRight className={`w-5 h-5 ${expandedInsight === insight.id ? 'text-electric-blue' : 'text-gray-500'}`} />
                                    </motion.div>
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedInsight === insight.id ? "auto" : 0, opacity: expandedInsight === insight.id ? 1 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-5 pt-0 text-indigo-100/80 font-light leading-relaxed border-t border-white/5 bg-white/[0.02]">
                                        <p>{insight.content}</p>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Detailed Predictions Section ── */}
            {planetsData && planetsData.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-8"
                >
                    <PredictionsSection planetsData={planetsData} />
                </motion.div>
            )}
        </main>
    );
}
