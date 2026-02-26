"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "./GoogleButton";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<"signIn" | "signUp">("signIn");
    const { signInWithGoogle, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleGoogleSignIn = async () => {
        await signInWithGoogle();
        onClose(); // Close modal on success
    };

    const handleEmailAuth = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we are currently mocking auth, just act like they signed in
        handleGoogleSignIn();
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
                        <div className="absolute inset-0 bg-[#0c1222]/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]" />

                        <div className="relative z-10">
                            <button
                                onClick={onClose}
                                className="absolute right-0 top-0 p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8 pt-2">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {view === "signIn" ? "Welcome Back" : "Join Astrominee"}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {view === "signIn"
                                        ? "Sign in to access your saved charts and insights."
                                        : "Create an account to save your cosmic journey."}
                                </p>
                            </div>

                            <GoogleButton onClick={handleGoogleSignIn} isLoading={loading} />

                            <div className="my-6 flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-white/10" />
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">or continue with</span>
                                <div className="h-[1px] flex-1 bg-white/10" />
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                {view === "signUp" && (
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 z-10" />
                                        <Input
                                            type="text"
                                            placeholder="Full Name"
                                            className="pl-10 h-12"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={view === "signUp"}
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 z-10" />
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        className="pl-10 h-12"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 z-10" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10 h-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full py-6 mt-2 text-base font-semibold" disabled={loading}>
                                    {loading ? "Authenticating..." : view === "signIn" ? "Sign In" : "Create Account"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-gray-400">
                                {view === "signIn" ? (
                                    <p>Don't have an account? <button onClick={() => setView("signUp")} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Sign Up</button></p>
                                ) : (
                                    <p>Already have an account? <button onClick={() => setView("signIn")} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Sign In</button></p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
