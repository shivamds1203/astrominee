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
import { ScrollSection3D } from "@/components/ui/ScrollSection3D";

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

const DEFAULT_SAMPLE_PLANETS = [
    { id: 0, name: "Sun", fullDegree: 327.51, normDegree: 27.51, current_sign: 11, house_number: 1, isRetro: "false", nakshatra: "Purva Bhadrapada" },
    { id: 1, name: "Moon", fullDegree: 306.68, normDegree: 6.68, current_sign: 11, house_number: 1, isRetro: "false", nakshatra: "Shatabhisha" },
    { id: 2, name: "Mars", fullDegree: 28.45, normDegree: 28.45, current_sign: 1, house_number: 3, isRetro: "false", nakshatra: "Krittika" },
    { id: 3, name: "Mercury", fullDegree: 310.22, normDegree: 10.22, current_sign: 11, house_number: 1, isRetro: "false", nakshatra: "Shatabhisha" },
    { id: 4, name: "Jupiter", fullDegree: 72.84, normDegree: 12.84, current_sign: 3, house_number: 5, isRetro: "false", nakshatra: "Ardra" },
    { id: 5, name: "Venus", fullDegree: 350.15, normDegree: 20.15, current_sign: 12, house_number: 2, isRetro: "false", nakshatra: "Revati" },
    { id: 6, name: "Saturn", fullDegree: 45.32, normDegree: 15.32, current_sign: 2, house_number: 4, isRetro: "false", nakshatra: "Rohini" },
    { id: 7, name: "Rahu", fullDegree: 76.24, normDegree: 16.24, current_sign: 3, house_number: 5, isRetro: "true", nakshatra: "Ardra" },
    { id: 8, name: "Ketu", fullDegree: 256.24, normDegree: 16.24, current_sign: 9, house_number: 11, isRetro: "true", nakshatra: "Mula" },
    { id: 9, name: "Ascendant", fullDegree: 327.51, normDegree: 27.51, current_sign: 11, house_number: 1, isRetro: "false", nakshatra: "Purva Bhadrapada" },
];

export default function DashboardPage() {
    const [chartStyle, setChartStyle] = useState<"north" | "south">("north");
    const [planetsData, setPlanetsData] = useState<any[]>(DEFAULT_SAMPLE_PLANETS);
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
    };

    const insights = [
        { id: "personality", title: "Personality Overview", content: "Based on your Sun in Sagittarius and Moon in Pisces, you possess a unique blend of fiery optimism and deep emotional sensitivity. You are a philosopher at heart, constantly seeking meaning, yet profoundly connected to the unspoken feelings of others." },
        { id: "career", title: "Career & Finance", content: "With your 10th House lord well-placed, leadership roles in creative or healing professions are highly favored. Expect a significant upward shift in career trajectory during your upcoming Jupiter planetary period." },
        { id: "relationships", title: "Marriage & Relationships", content: "Your 7th house dynamics suggest a partner who brings grounding structure to your life. The placement of Venus indicates that intellectual connection must precede emotional intimacy for long-term harmony." },
        { id: "health", title: "Health Insights", content: "Pay attention to your lower back and digestive system, as indicated by the 6th house placements. Regular grounding exercises and a structured routine will beautifully counter your naturally airy constitution." }
    ];

    useEffect(() => {
        setIsMounted(true);
        // Read data from sessionStorage (saved by BirthDetailsForm)
        try {
            const storedChart = sessionStorage.getItem("chartData");
            const storedUser = sessionStorage.getItem("userData");

            if (storedChart) {
                const rawData = JSON.parse(storedChart);
                let planetsArray: any[] = [];

                if (Array.isArray(rawData) && rawData.length > 0) {
                    planetsArray = rawData;
                } else if (rawData.data && Array.isArray(rawData.data) && rawData.data.length > 0) {
                    planetsArray = rawData.data;
                } else if (rawData.output && Array.isArray(rawData.output) && rawData.output.length > 0) {
                    const planetObjectMap = rawData.output[0] || {};
                    planetsArray = Object.keys(planetObjectMap)
                        .filter(k => k !== 'debug' && k !== 'ayanamsa')
                        .map(k => planetObjectMap[k]);
                } else if (typeof rawData === 'object' && rawData !== null) {
                    planetsArray = Object.keys(rawData)
                        .filter(k => k !== 'debug' && k !== 'ayanamsa')
                        .map(k => rawData[k]);
                }

                if (planetsArray.length > 0) {
                    setPlanetsData(planetsArray);
                }
            }
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Error reading chart data:", e);
        }
    }, []);

    if (!isMounted) return null;

    return (
        <main className="min-h-screen pt-28 pb-16 px-6 max-w-7xl mx-auto">
            {/* ── Dashboard Header ── */}
            <ScrollSection3D intensity="subtle" depth={20} className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-yellow-500 dark:to-yellow-200">
                            {userData ? `${userData.name}'s Horoscope` : "Vedic Birth Chart"}
                        </h1>
                        {userData ? (
                            <p className="text-slate-600 dark:text-gray-400 mt-1 text-sm font-light">Born: {userData.dateOfBirth} at {userData.timeOfBirth} in {userData.placeOfBirth?.split(',')[0]}</p>
                        ) : (
                            <p className="text-slate-600 dark:text-gray-400 mt-1 text-sm font-light">Interactive Planetary Map & Divisional Charts (D1 - D60)</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveChart}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors border font-medium ${isSaved
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 border-indigo-500/30"
                                }`}
                        >
                            {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                            {isSaved ? "Saved" : "Save to Profile"}
                        </button>
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="glass-panel text-slate-800 dark:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors border border-slate-300/80 dark:border-white/10 shadow-sm cursor-pointer"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button
                            onClick={() => generateAstrologyPDF(planetsData || [], userData)}
                            className="glass-panel text-slate-800 dark:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors border border-slate-300/80 dark:border-white/10 shadow-sm cursor-pointer"
                        >
                            <Download className="w-4 h-4" /> PDF Report
                        </button>
                    </div>
                </div>
            </ScrollSection3D>

            {/* Control Bar: Chart Style + Quick Varga Switchers */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                {/* Style Selector */}
                <div className="glass-panel p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 inline-flex shadow-sm">
                    <button
                        onClick={() => setChartStyle("north")}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${chartStyle === "north" ? "bg-amber-500/20 dark:bg-yellow-500/20 text-amber-700 dark:text-yellow-400 border border-amber-500/40 dark:border-yellow-500/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                        North Indian Style
                    </button>
                    <button
                        onClick={() => setChartStyle("south")}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${chartStyle === "south" ? "bg-amber-500/20 dark:bg-yellow-500/20 text-amber-700 dark:text-yellow-400 border border-amber-500/40 dark:border-yellow-500/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                        South Indian Style
                    </button>
                </div>

                {/* Quick Varga Chips */}
                <div className="flex items-center gap-2">
                    {[1, 9, 10].map(num => {
                        const v = VARGAS.find(item => item.num === num);
                        if (!v) return null;
                        const isSelected = selectedVarga === num;
                        return (
                            <button
                                key={num}
                                onClick={() => setSelectedVarga(num)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                                    isSelected
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                {num === 1 ? "D1 Rashi" : num === 9 ? "D9 Navamsa" : "D10 Dashamsa"}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Main Chart & Analysis 3D Section ── */}
            <ScrollSection3D intensity="subtle" depth={30}>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Main Rashi Chart */}
                    <div
                        className="glass-panel p-6 md:p-8 rounded-3xl border border-amber-500/20 dark:border-yellow-500/20 shadow-[0_0_30px_rgba(212,175,55,0.08)] col-span-1 xl:col-span-2 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-slate-800 dark:text-white">
                            <span className="text-8xl font-serif">ॐ</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-amber-600 dark:text-yellow-500 flex items-center gap-2">
                                {VARGAS.find(v => v.num === selectedVarga)?.name}
                            </h2>

                            <div className="relative">
                                <button
                                    onClick={() => setIsVargaDropdownOpen(!isVargaDropdownOpen)}
                                    className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300/80 dark:border-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-gray-300 transition-colors cursor-pointer"
                                >
                                    Change Chart <ChevronDown className={`w-4 h-4 transition-transform ${isVargaDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isVargaDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsVargaDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 top-12 w-64 glass-strong border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
                                            {VARGAS.map(varga => (
                                                <button
                                                    key={varga.num}
                                                    onClick={() => { setSelectedVarga(varga.num); setIsVargaDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 flex items-center justify-between cursor-pointer ${selectedVarga === varga.num ? 'bg-amber-500/20 dark:bg-yellow-500/20 text-amber-700 dark:text-yellow-400 font-semibold' : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                                                >
                                                    <span>{varga.name}</span>
                                                    {selectedVarga === varga.num && <Check className="w-4 h-4 text-amber-600 dark:text-yellow-400" />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="aspect-square max-w-lg mx-auto bg-slate-950/90 dark:bg-black/60 rounded-2xl border border-slate-300/60 dark:border-white/10 flex items-center justify-center relative backdrop-blur-md overflow-hidden p-4 shadow-2xl">

                            {chartStyle === "north" ? (
                                <NorthIndianChart planetsData={generateDivisionalChart(planetsData || [], selectedVarga)} />
                            ) : (
                                <SouthIndianChart
                                    planetsData={generateDivisionalChart(planetsData || [], selectedVarga)}
                                    userData={userData}
                                />
                            )}
                        </div>
                    </div>

                    {/* Details & Dashas Panel */}
                    <div
                        className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col gap-6"
                    >
                        <div className="flex-1 min-h-[400px]">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-electric-blue dark:to-violet-glow mb-4 flex items-center gap-2">
                                Analytical Data <span className="text-xs text-indigo-600 dark:text-indigo-400 font-normal px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">Precision</span>
                            </h3>
                            <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-black/40 shadow-inner">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-200/60 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-indigo-200/70 text-xs uppercase tracking-widest font-semibold">
                                            <th className="py-4 px-4 font-medium">Planet</th>
                                            <th className="py-4 px-4 font-medium">Longitude</th>
                                            <th className="py-4 px-4 font-medium">Sign</th>
                                            <th className="py-4 px-4 font-medium">Nakshatra</th>
                                            <th className="py-4 px-4 font-medium text-right">House</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {planetsData && planetsData.length > 0 ? generateDivisionalChart(planetsData, selectedVarga).map((planet: any, idx: number) => {
                                            const ZODIAC = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                                            const signName = planet.current_sign ? ZODIAC[planet.current_sign - 1] : "Unknown";

                                            const deg = planet.normDegree || 0;
                                            const d = Math.floor(deg);
                                            const m = Math.floor((deg - d) * 60);
                                            const nakshatra = getNakshatraDetails(planet.fullDegree);

                                            return (
                                                <tr key={planet.name} className="border-b border-slate-200/60 dark:border-white/5 hover:bg-slate-200/40 dark:hover:bg-white/[0.03] transition-colors group relative">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2 relative z-10">
                                                            <span className={`w-2 h-2 rounded-full ${planet.name === 'Ascendant' ? 'bg-cyan-500 dark:bg-electric-blue shadow-[0_0_8px_#00f0ff]' : 'bg-amber-500 dark:bg-gold shadow-[0_0_8px_#d4af37]'}`} />
                                                            <span className="text-slate-900 dark:text-gray-200 font-medium group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                                                                {planet.name} {planet.isRetro === "true" && <span className="text-rose-500 dark:text-rose-400 text-xs ml-1 font-bold">(R)</span>}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-slate-600 dark:text-gray-400 font-mono text-sm group-hover:text-cyan-600 dark:group-hover:text-electric-blue transition-colors relative z-10 font-semibold">
                                                            {d}° {m}'
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 relative z-10">
                                                        <span className="text-slate-700 dark:text-indigo-200/80 text-sm">
                                                            {signName}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 relative z-10">
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-800 dark:text-gray-200 text-sm font-medium">{nakshatra.name}</span>
                                                            <span className="text-slate-500 dark:text-gray-500 text-xs uppercase tracking-wider">Pada {nakshatra.pada}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-right relative z-10">
                                                        <span className="text-amber-600 dark:text-yellow-500/80 font-bold">
                                                            {planet.house_number || 1}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-10 text-slate-500 dark:text-gray-500 text-sm italic">
                                                    Complete the birth details form to see precise planetary data.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Current Dasha Period</h3>
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-500/30">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Jupiter (Guru)</span>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">Mahadasha</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-black/50 rounded-full h-2 mb-2 overflow-hidden">
                                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-gray-400 text-right">Active through 2034</p>
                            </div>
                        </div>
                    </div>

                    {/* Expandable AI Insights Panel */}
                    <div
                        className="col-span-1 lg:col-span-2 xl:col-span-3 mt-4"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Cosmic Insights</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {insights.map((insight) => (
                                <div
                                    key={insight.id}
                                    className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${expandedInsight === insight.id ? 'border-cyan-500/40 dark:border-electric-blue/40 shadow-xl' : 'border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer'}`}
                                >
                                    <button
                                        onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                                        className="w-full text-left p-5 flex items-center justify-between cursor-pointer"
                                    >
                                        <h3 className={`font-semibold text-lg transition-colors ${expandedInsight === insight.id ? 'text-cyan-600 dark:text-electric-blue' : 'text-slate-800 dark:text-gray-200'}`}>
                                            {insight.title}
                                        </h3>
                                        <motion.div animate={{ rotate: expandedInsight === insight.id ? 90 : 0 }}>
                                            <ChevronRight className={`w-5 h-5 ${expandedInsight === insight.id ? 'text-cyan-600 dark:text-electric-blue' : 'text-slate-400 dark:text-gray-500'}`} />
                                        </motion.div>
                                    </button>

                                    <motion.div
                                        initial={false}
                                        animate={{ height: expandedInsight === insight.id ? "auto" : 0, opacity: expandedInsight === insight.id ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 pt-0 text-slate-600 dark:text-indigo-100/80 font-light leading-relaxed border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                                            <p>{insight.content}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollSection3D>

            {/* ── Detailed Predictions Section ── */}
            {planetsData && planetsData.length > 0 && (
                <ScrollSection3D intensity="subtle" depth={20} className="mt-12">
                    <PredictionsSection planetsData={planetsData} />
                </ScrollSection3D>
            )}
        </main>
    );
}

