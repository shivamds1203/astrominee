"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Moon, User, Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export default function Navbar() {
    const { user, signOut } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-500">
                <Moon className="w-6 h-6" />
                <Link href="/" className="text-xl font-bold tracking-tight text-white pr-4">
                    Astrominee
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
                <Link href="/form" className="hover:text-yellow-500 transition-colors">Generate Chart</Link>
                <Link href="/predictions" className="hover:text-yellow-500 transition-colors">AI Predictions</Link>
                <Link href="/nakshatras" className="hover:text-electric-blue transition-colors">Nakshatras</Link>
                <Link href="/about" className="hover:text-yellow-500 transition-colors">About</Link>
            </div>

            <div className="flex items-center gap-4 relative">
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="hidden md:flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30 transition-all font-medium text-sm text-indigo-100"
                        >
                            <User className="w-4 h-4" />
                            {user.displayName?.split(" ")[0] || "Profile"}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-12 w-48 bg-[#0c1222]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/5 transition-colors"
                                >
                                    <User className="w-4 h-4 text-gray-400" />
                                    My Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        signOut();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAuthOpen(true)}
                        className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all font-medium text-sm text-gray-200"
                    >
                        <User className="w-4 h-4" />
                        Sign In
                    </button>
                )}

                <button className="md:hidden text-gray-300 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </nav>
    );
}
