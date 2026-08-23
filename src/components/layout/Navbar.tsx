"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import {
    User, LogOut, ChevronDown, Home, Telescope, Sparkles,
    Star, Info, X, LayoutDashboard, Sun, Moon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
    { href: "/", label: "Home", icon: Home, color: "#f59e0b" },
    { href: "/form", label: "Generate Chart", icon: Telescope, color: "#6366f1" },
    { href: "/predictions", label: "AI Predictions", icon: Sparkles, color: "#ec4899" },
    { href: "/nakshatras", label: "Nakshatras", icon: Star, color: "#14b8a6" },
    { href: "/about", label: "About", icon: Info, color: "#f97316" },
];

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="relative p-2.5 rounded-full border border-slate-300/80 dark:border-white/10 bg-slate-100/90 dark:bg-white/5 text-slate-700 dark:text-yellow-400 hover:border-yellow-500/40 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.div
                        key="moon"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

// ── Magnetic Link ────────────────────────────────────────────────────────────
function MagneticLink({ children, href, className }: { children: React.ReactNode; href: string; className: string }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = (e.clientX - left) - width / 2;
        const middleY = (e.clientY - top) - height / 2;
        x.set(middleX * 0.2); // Magnetic pull strength
        y.set(middleY * 0.2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div style={{ x: mouseXSpring, y: mouseYSpring }}>
            <Link
                ref={ref}
                href={href}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={className}
            >
                {children}
            </Link>
        </motion.div>
    );
}

// ── Hamburger / X icon ──────────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
    return (
        <div className="relative w-5 h-5 flex flex-col justify-center items-center gap-[5px]">
            <motion.span
                animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="block h-[1.5px] w-5 bg-slate-800 dark:bg-white origin-center"
            />
            <motion.span
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
                className="block h-[1.5px] w-5 bg-slate-800 dark:bg-white"
            />
            <motion.span
                animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="block h-[1.5px] w-5 bg-slate-800 dark:bg-white origin-center"
            />
        </div>
    );
}

// ── Mobile nav link row ──────────────────────────────────────────────────────
function MobileNavLink({
    href, label, icon: Icon, color, index, onClick,
}: {
    href: string; label: string; icon: React.ElementType; color: string; index: number; onClick: () => void;
}) {
    return (
        <motion.div
            custom={index}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ delay: 0.05 + index * 0.06, type: "spring", stiffness: 220, damping: 26 }}
        >
            <Link
                href={href}
                onClick={onClick}
                className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.97] hover:bg-slate-100 dark:hover:bg-white/5"
                style={{ WebkitTapHighlightColor: "transparent" }}
            >
                {/* Icon pill */}
                <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                        width: 42,
                        height: 42,
                        background: `${color}18`,
                        border: `1px solid ${color}35`,
                        boxShadow: `0 0 12px ${color}20`,
                    }}
                >
                    <Icon size={18} style={{ color }} />
                </div>

                {/* Label */}
                <span className="text-[15px] font-semibold text-slate-800 dark:text-white/90 tracking-tight group-active:text-white">
                    {label}
                </span>

                {/* Arrow */}
                <span className="ml-auto text-slate-400 dark:text-white/20 group-hover:text-slate-600 dark:group-hover:text-white/50 transition-colors text-lg leading-none">›</span>
            </Link>
        </motion.div>
    );
}

export default function Navbar() {
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Scroll progress for navbar background
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.85]);
    const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.1]);
    const backdropBlur = useTransform(scrollY, [0, 80], [0, 24]);

    const blurObj = useMotionTemplate`blur(${backdropBlur}px)`;

    const toggleMenu = () => setIsMenuOpen((v) => !v);
    const closeMenu = () => setIsMenuOpen(false);

    // Lock body scroll while menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    return (
        <>
            {/* ── Navbar bar ─────────────────────────────────────────────── */}
            <motion.nav
                className="fixed top-0 w-full z-50 px-5 py-4 border-b border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-[#080a1a]/80 backdrop-blur-xl transition-colors duration-300 gpu-layer"
                style={{
                    backdropFilter: blurObj,
                    WebkitBackdropFilter: blurObj,
                }}
            >
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                        <motion.span whileHover={{ scale: 1.1, rotate: 10 }} className="text-2xl origin-center inline-block">🪐</motion.span>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Astrominee</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-300">
                        {NAV_LINKS.map((link) => (
                            <MagneticLink
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 rounded-lg hover:text-amber-600 dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                {link.label}
                            </MagneticLink>
                        ))}
                    </div>

                    {/* Desktop auth & Theme switch */}
                    <div className="hidden md:flex items-center gap-3 relative">
                        <ThemeToggle />

                        {user ? (
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30 transition-all font-medium text-sm text-indigo-900 dark:text-indigo-100"
                                >
                                    <User className="w-4 h-4" />
                                    {user.displayName?.split(" ")[0] || "Profile"}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                                </motion.button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className="absolute right-0 top-12 w-48 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                                        >
                                            <Link href="/profile" onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                                <User className="w-4 h-4 text-slate-400 dark:text-gray-400" /> My Dashboard
                                            </Link>
                                            <button onClick={() => { setIsDropdownOpen(false); signOut(); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-100 dark:border-white/5 mt-1">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setIsAuthOpen(true)}
                                className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-4 py-2 rounded-full border border-slate-300/80 dark:border-white/10 transition-all font-medium text-sm text-slate-800 dark:text-gray-200"
                            >
                                <User className="w-4 h-4" /> Sign In
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile menu trigger & theme switch */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="p-2 z-[60] relative"
                            onClick={toggleMenu}
                            aria-label="Toggle Menu"
                            aria-expanded={isMenuOpen}
                            style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                            <HamburgerIcon open={isMenuOpen} />
                        </button>
                    </div>
                </div>
            </motion.nav>


            {/* ── Mobile overlay ──────────────────────────────────────────── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={closeMenu}
                            className="fixed inset-0 z-40 md:hidden"
                            style={{ background: "rgba(0,0,3,0.75)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
                        />

                        {/* Bottom sheet panel */}
                        <motion.div
                            key="sheet"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 320, damping: 34 }}
                            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                            style={{
                                background: "rgba(7,9,22,0.97)",
                                backdropFilter: "blur(32px)",
                                WebkitBackdropFilter: "blur(32px)",
                                borderTop: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "28px 28px 0 0",
                                paddingBottom: "env(safe-area-inset-bottom, 24px)",
                            }}
                        >
                            {/* Drag pill */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-9 h-1 rounded-full bg-white/15" />
                            </div>

                            {/* Header row */}
                            <div className="flex items-center justify-between px-5 pt-3 pb-4">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/35">Navigation</p>
                                    <p className="text-lg font-bold text-white mt-0.5">Astrominee</p>
                                </div>
                                <button
                                    onClick={closeMenu}
                                    className="w-9 h-9 flex items-center justify-center rounded-full"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}
                                    aria-label="Close menu"
                                >
                                    <X size={16} className="text-white/70" />
                                </button>
                            </div>

                            {/* Separator */}
                            <div className="mx-5 h-px bg-white/[0.06] mb-2" />

                            {/* Nav links */}
                            <div className="px-3 pb-2">
                                {NAV_LINKS.map((link, i) => (
                                    <MobileNavLink
                                        key={link.href}
                                        href={link.href}
                                        label={link.label}
                                        icon={link.icon}
                                        color={link.color}
                                        index={i}
                                        onClick={closeMenu}
                                    />
                                ))}
                            </div>

                            {/* Separator */}
                            <div className="mx-5 h-px bg-white/[0.06] mt-1 mb-3" />

                            {/* Auth section */}
                            <div className="px-3 pb-5">
                                {user ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.38, type: "spring", stiffness: 220, damping: 26 }}
                                        className="flex flex-col gap-2"
                                    >
                                        <Link href="/profile" onClick={closeMenu}
                                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl active:scale-[0.97] transition-all"
                                            style={{ WebkitTapHighlightColor: "transparent" }}>
                                            <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                                                style={{ width: 42, height: 42, background: "#6366f118", border: "1px solid #6366f135", boxShadow: "0 0 12px #6366f120" }}>
                                                <LayoutDashboard size={18} style={{ color: "#6366f1" }} />
                                            </div>
                                            <span className="text-[15px] font-semibold text-white/90">My Dashboard</span>
                                            <span className="ml-auto text-white/20 text-lg leading-none">›</span>
                                        </Link>
                                        <button onClick={() => { closeMenu(); signOut(); }}
                                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl w-full active:scale-[0.97] transition-all"
                                            style={{ WebkitTapHighlightColor: "transparent" }}>
                                            <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                                                style={{ width: 42, height: 42, background: "#ef444418", border: "1px solid #ef444435", boxShadow: "0 0 12px #ef444420" }}>
                                                <LogOut size={18} style={{ color: "#ef4444" }} />
                                            </div>
                                            <span className="text-[15px] font-semibold text-red-400">Sign Out</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.38, type: "spring", stiffness: 220, damping: 26 }}
                                    >
                                        <button
                                            onClick={() => { closeMenu(); setIsAuthOpen(true); }}
                                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl w-full active:scale-[0.97] transition-all"
                                            style={{ WebkitTapHighlightColor: "transparent" }}
                                        >
                                            <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                                                style={{ width: 42, height: 42, background: "#f59e0b18", border: "1px solid #f59e0b35", boxShadow: "0 0 12px #f59e0b20" }}>
                                                <User size={18} style={{ color: "#f59e0b" }} />
                                            </div>
                                            <span className="text-[15px] font-semibold text-white/90">Sign In</span>
                                            <span className="ml-auto text-white/20 text-lg leading-none">›</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
