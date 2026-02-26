"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { PremiumCalendar } from "@/components/ui/PremiumCalendar";
import { PremiumClock } from "@/components/ui/PremiumClock";

export default function BirthDetailsForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        timeOfBirth: "",
        placeOfBirth: "",
        lat: "",
        lon: "",
        gender: "male",
    });

    const [locationResults, setLocationResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showClock, setShowClock] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const clockRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
            if (clockRef.current && !clockRef.current.contains(event.target as Node)) {
                setShowClock(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search for location
    useEffect(() => {
        if (formData.placeOfBirth.length < 3 ||
            locationResults.some(r => r.display_name === formData.placeOfBirth)) {
            if (formData.placeOfBirth.length < 3) {
                setLocationResults([]);
                setShowDropdown(false);
            }
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.placeOfBirth)}&format=json&limit=5`);
                const data = await res.json();
                setLocationResults(data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Failed to fetch locations", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.placeOfBirth]);

    const handleSelectLocation = (loc: any) => {
        setFormData({
            ...formData,
            placeOfBirth: loc.display_name,
            lat: loc.lat,
            lon: loc.lon
        });
        setShowDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.lat || !formData.lon) {
            setErrorMsg("Please select a valid location from the dropdown.");
            return;
        }
        setErrorMsg("");
        setLoading(true);

        try {
            // Parse the dates
            const [year, month, date] = formData.dateOfBirth.split("-").map(Number);
            const [hours, minutes] = formData.timeOfBirth.split(":").map(Number);

            const res = await fetch("/api/astrology", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    year,
                    month,
                    date,
                    hours,
                    minutes,
                    seconds: 0,
                    latitude: parseFloat(formData.lat),
                    longitude: parseFloat(formData.lon),
                    timezone: 5.5, // Default IST for MVP, can be calculated via tz-lookup based on lat/lon
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            // Storing response in session storage
            sessionStorage.setItem("chartData", JSON.stringify(data.data));
            sessionStorage.setItem("userData", JSON.stringify(formData));

            router.push("/dashboard");

        } catch (err: any) {
            setErrorMsg(err.message || "Something went wrong fetching chart data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-2xl overflow-hidden"
                    >
                        {/* Cinematic Particle Gathering Effect */}
                        <div className="absolute inset-0 flex items-center justify-center mix-blend-screen">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={`particle-${i}`}
                                    initial={{ x: (Math.random() - 0.5) * 1000, y: (Math.random() - 0.5) * 1000, scale: 0, opacity: 0 }}
                                    animate={{ x: 0, y: 0, scale: [0, Math.random() + 0.5, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
                                    className="absolute w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_15px_#00f0ff]"
                                />
                            ))}
                        </div>

                        {/* Spinning 3D Core */}
                        <motion.div
                            animate={{ rotateZ: 360, rotateX: [40, 60, 40] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-40 h-40 rounded-full border border-violet-glow/50 border-dashed shadow-[0_0_50px_rgba(139,92,246,0.3)] flex items-center justify-center preserve-3d"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <motion.div
                                animate={{ rotateZ: -360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 rounded-full border-[2px] border-electric-blue shadow-[0_0_30px_#00f0ff] flex items-center justify-center"
                            >
                                <span className="text-4xl text-white font-serif font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">ॐ</span>
                            </motion.div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="mt-12 text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-violet-glow uppercase"
                        >
                            Aligning Cosmic Coordinates...
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-4 text-indigo-200/60 text-sm font-mono"
                        >
                            Calculating precise planetary degrees for {formData.name || "native"}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
                className="glass-panel p-8 md:p-10 rounded-2xl w-full max-w-lg mx-auto relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />

                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-200">
                        Cosmic Coordinates
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">Enter your precise birth details to calculate your astrological chart.</p>
                    {errorMsg && <p className="text-red-500 text-sm mt-3 bg-red-500/10 py-2 rounded border border-red-500/20">{errorMsg}</p>}
                </div>

                <div className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-3 top-9 w-5 h-5 text-gray-500 z-10" />
                        <Input
                            label="Full Name"
                            placeholder="e.g. John Doe"
                            className="pl-10"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Custom Calendar Popover */}
                        <div className="relative group" ref={calendarRef}>
                            <Calendar className="absolute left-3 top-[34px] w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors z-10 pointer-events-none" />
                            <div onClick={() => { setShowCalendar(true); setShowClock(false); }}>
                                <Input
                                    type="text"
                                    label="Date of Birth"
                                    className="pl-10 cursor-pointer"
                                    value={formData.dateOfBirth}
                                    placeholder="Select Date"
                                    readOnly
                                    required
                                />
                            </div>
                            {showCalendar && (
                                <div className="absolute top-[80px] left-0 md:left-auto md:w-[350px] z-50">
                                    <PremiumCalendar
                                        value={formData.dateOfBirth}
                                        onChange={(dt) => { setFormData({ ...formData, dateOfBirth: dt }); setShowCalendar(false); }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Custom Clock Popover */}
                        <div className="relative group" ref={clockRef}>
                            <Clock className="absolute left-3 top-[34px] w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors z-10 pointer-events-none" />
                            <div onClick={() => { setShowClock(true); setShowCalendar(false); }}>
                                <Input
                                    type="text"
                                    label="Time of Birth (24hr)"
                                    className="pl-10 cursor-pointer"
                                    value={formData.timeOfBirth}
                                    placeholder="Select Time"
                                    readOnly
                                    required
                                />
                            </div>
                            {showClock && (
                                <div className="absolute bottom-[80px] left-0 md:left-1/2 md:-translate-x-1/2 z-50 p-6 rounded-3xl bg-[#0c1222]/95 backdrop-blur-2xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-5 min-w-[280px] max-h-[80vh] overflow-y-auto">
                                    <PremiumClock
                                        value={formData.timeOfBirth}
                                        onChange={(ti) => setFormData({ ...formData, timeOfBirth: ti })}
                                    />
                                    {/* Confirm button — always visible */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setShowClock(false); }}
                                        className="w-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] sticky bottom-0"
                                    >
                                        Confirm Selection
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <MapPin className="absolute left-3 top-9 w-5 h-5 text-gray-500 z-10" />
                        <Input
                            label="Place of Birth"
                            placeholder="City, State, Country"
                            className="pl-10 relative"
                            value={formData.placeOfBirth}
                            onChange={(e) => {
                                setFormData({ ...formData, placeOfBirth: e.target.value });
                                setShowDropdown(true);
                            }}
                            onFocus={() => {
                                if (locationResults.length > 0) setShowDropdown(true);
                            }}
                            required
                            autoComplete="off"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-9 w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                        )}

                        {/* Autocomplete Dropdown */}
                        {showDropdown && locationResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-20 left-0 w-full bg-[#0c1222]/95 backdrop-blur-2xl border border-white/20 rounded-xl overflow-hidden z-20 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                            >
                                <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {locationResults.map((loc, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => handleSelectLocation(loc)}
                                            className="px-4 py-3.5 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-white cursor-pointer transition-colors border-b border-white/10 last:border-0 flex items-start gap-3 group"
                                        >
                                            <MapPin className="w-4 h-4 mt-0.5 text-gray-500 group-hover:text-electric-blue shrink-0 transition-colors" />
                                            <span className="leading-snug">{loc.display_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        <div className="flex justify-between items-center mt-1 pl-1">
                            <p className="text-xs text-yellow-600">Uses OpenStreetMap for lat/lon lookup.</p>
                            {(formData.lat && formData.lon) && (
                                <p className="text-xs text-green-500 text-right">Coordinates mapped ✓</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                        <div className="flex gap-4">
                            {["male", "female", "other"].map((g) => (
                                <label key={g} className="flex flex-1 items-center justify-center p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors has-[:checked]:bg-yellow-500/10 has-[:checked]:border-yellow-500/50 has-[:checked]:text-yellow-500">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={formData.gender === g}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="hidden"
                                    />
                                    <span className="capitalize font-medium text-sm">{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full group py-6 text-lg" disabled={loading}>
                            {loading ? "Calculating Coordinates..." : "Generate Charts"}
                            {!loading && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </div>
                </div>
            </motion.form>
        </>
    );
}
