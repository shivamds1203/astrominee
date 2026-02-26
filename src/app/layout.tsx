import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import StarBackground from "@/components/background/StarBackground";
import ClientAuthProvider from "@/components/auth/ClientAuthProvider";

export const metadata: Metadata = {
    title: "🪐 Astrominee | Premium Vedic Astrology Platform",
    description: "Advanced Vedic Astrology Charts, Dashas, and AI Predictions",
    icons: {
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪐</text></svg>",
    },
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
