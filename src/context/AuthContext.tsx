"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our user
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
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Mocking an initial auth check
        const storedUser = localStorage.getItem("mock_auth_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signInWithGoogle = async () => {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockUser: User = {
            uid: "mock-uid-12345",
            email: "demo@astrominee.com",
            displayName: "Cosmic Voyager",
            photoURL: null,
        };

        setUser(mockUser);
        localStorage.setItem("mock_auth_user", JSON.stringify(mockUser));
        setLoading(false);
    };

    const signOut = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(null);
        localStorage.removeItem("mock_auth_user");
        setLoading(false);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
