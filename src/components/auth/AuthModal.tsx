"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "./GoogleButton";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "signIn" | "signUp";
}

export const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    initialView = "signIn",
}) => {
    const [view, setView] = useState<"signIn" | "signUp">(initialView);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            setError(null);
            setLoading(true);
            await signInWithGoogle();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (view === "signIn") {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password, name);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-3xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)]" />

                        <div className="relative z-10">
                            <button
                                onClick={onClose}
                                className="absolute right-0 top-0 p-2 text-slate-400 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8 pt-2">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {view === "signIn" ? "Welcome Back" : "Join Astrominee"}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-gray-400">
                                    {view === "signIn"
                                        ? "Sign in to access your saved charts and insights."
                                        : "Create an account to save your cosmic journey."}
                                </p>
                            </div>

                            <GoogleButton onClick={handleGoogleSignIn} isLoading={loading} />

                            <div className="my-6 flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
                                <span className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-widest font-medium">or continue with</span>
                                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                {view === "signUp" && (
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-gray-500 z-10" />
                                        <Input
                                            type="text"
                                            placeholder="Full Name"
                                            className="pl-10 h-12 bg-slate-50 dark:bg-black/30 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={view === "signUp"}
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-gray-500 z-10" />
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        className="pl-10 h-12 bg-slate-50 dark:bg-black/30 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-gray-500 z-10" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10 h-12 bg-slate-50 dark:bg-black/30 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button type="submit" className="w-full py-6 mt-2 text-base font-semibold" disabled={loading}>
                                    {loading ? "Authenticating..." : view === "signIn" ? "Sign In" : "Create Account"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
                                {view === "signIn" ? (
                                    <p>Don&apos;t have an account? <button onClick={() => setView("signUp")} className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors font-medium">Sign Up</button></p>
                                ) : (
                                    <p>Already have an account? <button onClick={() => setView("signIn")} className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors font-medium">Sign In</button></p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
