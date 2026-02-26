import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import StarBackground from "@/components/background/StarBackground";
import ClientAuthProvider from "@/components/auth/ClientAuthProvider";

export const metadata: Metadata = {
    title: "Astrominee | Premium Vedic Astrology Platform",
    description: "Advanced Vedic Astrology Charts, Dashas, and AI Predictions",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen">
                <ClientAuthProvider>
                    <StarBackground />
                    <Navbar />
                    {children}
                </ClientAuthProvider>
            </body>
        </html>
    );
}
