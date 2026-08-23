"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, ChevronDown, Sparkles, BookmarkPlus, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NorthIndianChart } from "@/components/charts/NorthIndianChart";
import { SouthIndianChart } from "@/components/charts/SouthIndianChart";
import { generateDivisionalChart, getNakshatraDetails, calculateVimshottariDashas } from "@/lib/astrologyMath";
import { generateAstrologyPDF } from "@/lib/generatePDF";
import { PredictionsSection } from "@/components/dashboard/PredictionsSection";
import { ScrollSection3D } from "@/components/ui/ScrollSection3D";
import { VimshottariDashaTree } from "@/components/dashboard/VimshottariDashaTree";

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

    // Dynamically calculate divisional chart data whenever selectedVarga or planetsData changes
    const activeChartPlanets = React.useMemo(() => {
        return generateDivisionalChart(planetsData || [], selectedVarga);
    }, [planetsData, selectedVarga]);

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
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                    isSelected
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md scale-102"
                                        : "bg-white/80 dark:bg-white/5 text-slate-700 dark:text-gray-300 border-slate-300/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white"
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
                    {/* Main Rashi Chart Card */}
                    <div
                        className="glass-panel p-6 md:p-8 rounded-3xl border border-amber-500/20 dark:border-yellow-500/20 shadow-[0_0_30px_rgba(212,175,55,0.08)] col-span-1 xl:col-span-2 relative"
                    >
                        {/* Subtle background motif */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-slate-800 dark:text-white overflow-hidden rounded-3xl">
                            <span className="text-8xl font-serif select-none">ॐ</span>
                        </div>

                        {/* Chart Header Bar with Dropdown */}
                        <div className="flex justify-between items-center mb-6 relative z-30">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-yellow-500/80 font-bold block mb-0.5">Active Kundli</span>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    {VARGAS.find(v => v.num === selectedVarga)?.name}
                                </h2>
                            </div>

                            {/* Change Chart Dropdown Menu */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsVargaDropdownOpen(prev => !prev)}
                                    className="flex items-center gap-2 bg-white/90 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-300 dark:border-white/20 px-4 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-white transition-colors cursor-pointer shadow-sm"
                                >
                                    Change Chart <ChevronDown className={`w-4 h-4 transition-transform ${isVargaDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                <AnimatePresence>
                                    {isVargaDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsVargaDropdownOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-12 w-64 bg-white/98 dark:bg-[#0c1224]/98 backdrop-blur-3xl border border-slate-200 dark:border-white/15 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar"
                                            >
                                                <div className="p-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-gray-400 px-2">Select Divisional Chart</span>
                                                </div>
                                                {VARGAS.map(varga => (
                                                    <button
                                                        key={varga.num}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedVarga(varga.num);
                                                            setIsVargaDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 flex items-center justify-between cursor-pointer ${
                                                            selectedVarga === varga.num
                                                                ? 'bg-amber-500/20 dark:bg-yellow-500/20 text-amber-800 dark:text-yellow-400 font-bold'
                                                                : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <span>{varga.name}</span>
                                                        {selectedVarga === varga.num && <Check className="w-4 h-4 text-amber-600 dark:text-yellow-400" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Chart Render Canvas */}
                        <div className="aspect-square max-w-lg mx-auto bg-amber-50/50 dark:bg-black/60 rounded-3xl border border-amber-200/80 dark:border-white/10 flex items-center justify-center relative backdrop-blur-md overflow-hidden p-3 md:p-4 shadow-xl dark:shadow-2xl transition-colors duration-300">
                            {chartStyle === "north" ? (
                                <NorthIndianChart
                                    key={`north-${selectedVarga}-${planetsData?.length}`}
                                    planetsData={activeChartPlanets}
                                />
                            ) : (
                                <SouthIndianChart
                                    key={`south-${selectedVarga}-${planetsData?.length}`}
                                    planetsData={activeChartPlanets}
                                    userData={userData}
                                />
                            )}
                        </div>
                    </div>

                    {/* Details & Dashas Panel */}
                    <div
                        className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 flex flex-col gap-6"
                    >
                        <div className="flex-1 min-h-[360px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-electric-blue dark:to-violet-glow flex items-center gap-2">
                                    Analytical Data
                                </h3>
                                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                    {VARGAS.find(v => v.num === selectedVarga)?.name.split('-')[0].trim()}
                                </span>
                            </div>

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
                                        {activeChartPlanets && activeChartPlanets.length > 0 ? activeChartPlanets.map((planet: any, idx: number) => {
                                            const ZODIAC = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                                            const signName = planet.current_sign ? ZODIAC[planet.current_sign - 1] : "Unknown";

                                            const deg = planet.normDegree || 0;
                                            const d = Math.floor(deg);
                                            const m = Math.floor((deg - d) * 60);
                                            const nk = planet.nakshatra ? (typeof planet.nakshatra === 'object' ? planet.nakshatra.name : planet.nakshatra) : getNakshatraDetails(planet.fullDegree).name;

                                            return (
                                                <tr
                                                    key={idx}
                                                    className="border-b border-slate-200/60 dark:border-white/5 last:border-0 hover:bg-slate-200/40 dark:hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                        <span>{planet.name}</span>
                                                        {planet.isRetro === "true" && (
                                                            <span className="text-[10px] text-rose-500 font-bold px-1.5 py-0.5 bg-rose-500/10 rounded">℞</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-gray-400 text-sm">{`${d}° ${m}'`}</td>
                                                    <td className="py-3 px-4 text-amber-700 dark:text-yellow-400 font-medium text-sm">{signName}</td>
                                                    <td className="py-3 px-4 text-slate-600 dark:text-gray-400 text-sm">{nk}</td>
                                                    <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-cyan-400 text-sm">{planet.house_number || 1}</td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-6 text-slate-500 dark:text-gray-500 text-sm">
                                                    No planetary data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollSection3D>

            {/* ── Vimshottari Dasha Hierarchy (120-Year Mahadasha, Antardasha, Pratyantar) ── */}
            <ScrollSection3D intensity="subtle" depth={25} className="mt-12">
                {planetsData && planetsData.length > 0 && (() => {
                    const moonPlanet = planetsData.find(p => p.name === "Moon");
                    const moonFullDegree = moonPlanet?.fullDegree ?? 306.68;
                    const dob = userData?.dateOfBirth || "1995-08-15";
                    const dashas = calculateVimshottariDashas(moonFullDegree, dob);
                    return <VimshottariDashaTree dashas={dashas} />;
                })()}
            </ScrollSection3D>

            {/* ── Deep Astrological Insights Section ── */}
            <ScrollSection3D intensity="subtle" depth={25} className="mt-12">
                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cosmic Synthesis & Planetary Guidance</h2>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Core life dimensions calculated from your planetary geometry.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight) => {
                            const isOpen = expandedInsight === insight.id;
                            return (
                                <motion.div
                                    key={insight.id}
                                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${isOpen
                                        ? "bg-slate-100/90 dark:bg-white/[0.04] border-indigo-500/40 shadow-md"
                                        : "bg-slate-50 dark:bg-white/[0.01] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                                        }`}
                                    onClick={() => setExpandedInsight(isOpen ? null : insight.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-base">{insight.title}</h3>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                    </div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.p
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-sm text-slate-600 dark:text-gray-300 mt-4 leading-relaxed font-light"
                                            >
                                                {insight.content}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </ScrollSection3D>

            {/* ── Planetary Interpretations & AI Chat Section ── */}
            <ScrollSection3D intensity="subtle" depth={20} className="mt-12">
                <PredictionsSection planetsData={planetsData || []} />
            </ScrollSection3D>
        </main>
    );
}
