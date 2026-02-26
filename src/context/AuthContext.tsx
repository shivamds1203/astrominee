"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toUser = (u: FirebaseUser): User => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Listen to Firebase auth state
    useEffect(() => {
        if (!auth) {
            // Firebase not configured — no credentials in .env.local
            setLoading(false);
            return;
        }
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ? toUser(firebaseUser) : null);
            setLoading(false);
        });
        return unsub;
    }, []);

    const signInWithGoogle = async () => {
        if (!auth) throw new Error("Firebase is not configured. Please add your Firebase credentials to .env.local");
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUser(toUser(result.user));
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        if (!auth) throw new Error("Firebase is not configured. Please add your Firebase credentials to .env.local");
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser(toUser(result.user));
        } finally {
            setLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        if (!auth) throw new Error("Firebase is not configured. Please add your Firebase credentials to .env.local");
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
                await updateProfile(result.user, { displayName: name });
            }
            setUser(toUser({ ...result.user, displayName: name || result.user.displayName }));
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
