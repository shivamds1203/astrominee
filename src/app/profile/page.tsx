"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Scroll, ArrowRight, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Mock saved charts data
    const savedCharts = [
        { id: 1, name: "John Doe", date: "15 Oct 1990", type: "Natal Chart" },
        { id: 2, name: "Jane Smith", date: "22 Mar 1995", type: "Compatibility" },
    ];

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="bg-[#0c1222]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] mb-6">
                            <div className="w-full h-full rounded-full bg-[#0c1222] flex items-center justify-center overflow-hidden">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-indigo-300" />
                                )}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">{user.displayName || "Cosmic Voyager"}</h2>
                        <p className="text-sm text-gray-400 mb-6">{user.email}</p>

                        <div className="space-y-3">
                            <Button variant="secondary" className="w-full justify-start gap-3 border-white/5 bg-white/[0.02]">
                                <Settings className="w-4 h-4 text-gray-400" />
                                Settings
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-red-500/10 hover:text-red-400 text-gray-400" onClick={signOut}>
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-3 space-y-8"
                >
                    <div className="bg-[#0c1222]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <Scroll className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-wide">Saved Charts</h2>
                        </div>

                        {savedCharts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {savedCharts.map((chart, i) => (
                                    <motion.div
                                        key={chart.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="group bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">{chart.name}</h3>
                                                <p className="text-sm text-gray-400">{chart.date}</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/20">
                                                {chart.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mt-6 pt-4 border-t border-white/5">
                                            <span>View Full Details</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <Scroll className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-300 mb-2">No Saved Charts Yet</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">Generate a new chart and save it to your profile to access it from anywhere.</p>
                                <Button onClick={() => router.push("/form")}>
                                    Generate Your First Chart
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
