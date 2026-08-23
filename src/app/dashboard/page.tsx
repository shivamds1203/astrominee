"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, ChevronDown, Sparkles, BookmarkPlus, Check, Briefcase, Heart, Activity, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NorthIndianChart } from "@/components/charts/NorthIndianChart";
import { SouthIndianChart } from "@/components/charts/SouthIndianChart";
import { generateDivisionalChart, getNakshatraDetails, calculateVimshottariDashas } from "@/lib/astrologyMath";
import { generateAstrologyPDF } from "@/lib/generatePDF";
import { PredictionsSection } from "@/components/dashboard/PredictionsSection";
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

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
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
    const [expandedInsight, setExpandedInsight] = useState<string | null>("career");
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveChart = () => {
        if (!user) {
            alert("Please sign in from the top navigation to save your chart!");
            return;
        }
        setIsSaved(true);
    };

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedChart = sessionStorage.getItem("chartData") || sessionStorage.getItem("astrologyChartData");
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
    const activeChartPlanets = useMemo(() => {
        return generateDivisionalChart(planetsData || [], selectedVarga);
    }, [planetsData, selectedVarga]);

    // Dynamic Astrological Insights calculated directly from the user's birth chart
    const dynamicInsights = useMemo(() => {
        const asc = planetsData?.find(p => p.name === "Ascendant");
        const sun = planetsData?.find(p => p.name === "Sun");
        const moon = planetsData?.find(p => p.name === "Moon");
        const jupiter = planetsData?.find(p => p.name === "Jupiter");
        const saturn = planetsData?.find(p => p.name === "Saturn");
        const venus = planetsData?.find(p => p.name === "Venus");

        const ascSign = ZODIAC_SIGNS[(asc?.current_sign || 1) - 1] || "Aries";
        const sunSign = ZODIAC_SIGNS[(sun?.current_sign || 9) - 1] || "Sagittarius";
        const moonSign = ZODIAC_SIGNS[(moon?.current_sign || 12) - 1] || "Pisces";

        const h10Planets = planetsData?.filter(p => p.name !== "Ascendant" && Number(p.house_number || p.house) === 10);
        const h2Planets = planetsData?.filter(p => p.name !== "Ascendant" && Number(p.house_number || p.house) === 2);
        const h11Planets = planetsData?.filter(p => p.name !== "Ascendant" && Number(p.house_number || p.house) === 11);
        const h7Planets = planetsData?.filter(p => p.name !== "Ascendant" && Number(p.house_number || p.house) === 7);

        return [
            {
                id: "career",
                title: "Career & Professional Trajectory (10th Bhava)",
                icon: Briefcase,
                tag: "Karma Bhava",
                color: "text-amber-600 dark:text-yellow-400 bg-amber-500/10",
                content: h10Planets.length > 0
                    ? `With ${h10Planets.map(p => p.name).join(" and ")} activating your 10th House of Career (Karma Sthana), your professional path is characterized by authority, strategic thinking, and leadership. Your career flourishes when you take initiative rather than passive roles. D10 Dashamsa alignments suggest strong breakthroughs during major planetary sub-periods.`
                    : `Your 10th House of Career operates under the governance of ${saturn ? 'Saturnian discipline' : 'structured planetary energy'}. You achieve steady elevation through perseverance, domain mastery, and principled management. Favorable career shifts occur during auspicious planetary transits across your Kendra houses.`
            },
            {
                id: "finance",
                title: "Wealth, Assets & Financial Growth (2nd & 11th Bhava)",
                icon: Sparkles,
                tag: "Dhana & Labha",
                color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                content: `Your wealth architecture is governed by the 2nd House (Dhana - accumulated reserves) and 11th House (Labha - recurring income & high-value gains). ${h2Planets.length > 0 ? `${h2Planets.map(p => p.name).join(", ")} directly energizes your wealth generation.` : ''} ${h11Planets.length > 0 ? `${h11Planets.map(p => p.name).join(", ")} provides expansive inflow through professional networks.` : ''} Long-term investments in tangible assets and strategic diversification yield strong prosperity.`
            },
            {
                id: "personality",
                title: "Personality & Core Alignment (Lagna & Moon)",
                icon: UserIcon,
                tag: "Tanu Bhava",
                color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
                content: `With ${ascSign} Ascendant (Lagna) and Moon in ${moonSign}, you embody a harmonious synthesis of purpose and intuitive depth. Sun in ${sunSign} illuminates your core vitality with optimism and visionary drive, while your Moon placement gives you exceptional emotional intelligence and resilience under pressure.`
            },
            {
                id: "relationships",
                title: "Love, Partnerships & Harmony (7th Bhava)",
                icon: Heart,
                tag: "Kalatra Bhava",
                color: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
                content: `Your 7th House of Partnerships (Kalatra Bhava) and Venusian placement signify relationships rooted in mutual respect, intellectual rapport, and shared growth. ${h7Planets.length > 0 ? `${h7Planets.map(p => p.name).join(" and ")} occupies your 7th house, emphasizing devotion and balanced partnership dynamics.` : 'Your partnership thrive through clear communication and honoring emotional boundaries.'}`
            },
            {
                id: "health",
                title: "Health, Vitality & Wellness (6th Bhava & Lagna)",
                icon: Activity,
                tag: "Ayur Bhava",
                color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
                content: `Your vital constitution benefits from regular daily routines that align with your elemental balance. Grounding practices, mindful nutrition, and consistent physical movement protect your immune resilience and maintain high cellular energy across changing planetary seasons.`
            }
        ];
    }, [planetsData]);

    if (!isMounted) return null;

    return (
        <main className="min-h-screen pt-28 pb-16 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            {/* ── Dashboard Header ── */}
            <section className="mb-8">
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
            </section>

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

            {/* ── Main Chart & Analysis Section ── */}
            <section className="mb-12">
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
                                            const signName = planet.current_sign ? ZODIAC_SIGNS[planet.current_sign - 1] : "Unknown";
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
            </section>

            {/* ── Vimshottari Dasha Hierarchy (120-Year Mahadasha, Antardasha, Pratyantar) ── */}
            <section className="mt-12">
                {planetsData && planetsData.length > 0 && (() => {
                    const moonPlanet = planetsData.find(p => p.name === "Moon");
                    const moonFullDegree = moonPlanet?.fullDegree ?? 306.68;
                    const dob = userData?.dateOfBirth || "1995-08-15";
                    const dashas = calculateVimshottariDashas(moonFullDegree, dob);
                    return <VimshottariDashaTree dashas={dashas} />;
                })()}
            </section>

            {/* ── Deep Astrological Insights Section (Dynamic Vedic Interpretations) ── */}
            <section className="mt-12">
                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cosmic Synthesis &amp; Life Guidance</h2>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Personalized Vedic readings calculated from your active planetary geometry.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dynamicInsights.map((insight) => {
                            const isOpen = expandedInsight === insight.id;
                            const IconComponent = insight.icon;
                            return (
                                <div
                                    key={insight.id}
                                    className={`p-6 rounded-2xl border transition-all cursor-pointer select-none ${isOpen
                                        ? "bg-white/95 dark:bg-white/[0.04] border-indigo-500/50 shadow-md"
                                        : "bg-slate-50/80 dark:bg-white/[0.01] border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 shadow-xs"
                                        }`}
                                    onClick={() => setExpandedInsight(isOpen ? null : insight.id)}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${insight.color}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-gray-400 block">{insight.tag}</span>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base">{insight.title}</h3>
                                            </div>
                                        </div>
                                        <div className="text-slate-400 dark:text-gray-400 mt-1">
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.p
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="text-sm text-slate-700 dark:text-gray-200 mt-4 leading-relaxed font-light border-t border-slate-200/60 dark:border-white/5 pt-3"
                                            >
                                                {insight.content}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Planetary Interpretations & AI Chat Section ── */}
            <section className="mt-12">
                <PredictionsSection planetsData={planetsData || []} />
            </section>
        </main>
    );
}
