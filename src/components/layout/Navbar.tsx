"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export default function Navbar() {
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/form", label: "Generate Chart" },
        { href: "/predictions", label: "AI Predictions" },
        { href: "/nakshatras", label: "Nakshatras" },
        { href: "/about", label: "About" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🪐</span>
                    <Link href="/" className="text-xl font-bold tracking-tight text-white pr-4">
                        Astrominee
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-yellow-500 transition-colors">
                            {link.label}
                        </Link>
                    ))}
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

                    <button
                        className="md:hidden text-gray-300 hover:text-white p-2 transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        <Menu className={`w-6 h-6 transition-transform ${isMenuOpen ? "rotate-90" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`
                md:hidden overflow-hidden transition-all duration-300 ease-in-out
                ${isMenuOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}
            `}>
                <div className="flex flex-col gap-4 py-4 border-t border-white/10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className="text-gray-300 hover:text-yellow-500 transition-colors text-lg px-2"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={closeMenu}
                                    className="flex items-center gap-3 px-2 py-2 text-gray-200 hover:text-indigo-400 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    My Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        closeMenu();
                                        signOut();
                                    }}
                                    className="flex items-center gap-3 px-2 py-2 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    closeMenu();
                                    setIsAuthOpen(true);
                                }}
                                className="flex items-center gap-3 px-2 py-2 text-gray-200 hover:text-yellow-500 transition-colors"
                            >
                                <User className="w-5 h-5" />
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </nav>
    );
}
