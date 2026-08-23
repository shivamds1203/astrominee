import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import StarBackground from "@/components/background/StarBackground";
import ClientAuthProvider from "@/components/auth/ClientAuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
    title: "Astrominee | Premium Vedic Astrology Platform",
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
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('astrominee-theme');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) || !saved) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
                    }}
                />
            </head>
            <body className="antialiased min-h-screen">
                <ThemeProvider>
                    <ClientAuthProvider>
                        <StarBackground />
                        <Navbar />
                        {children}
                    </ClientAuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

