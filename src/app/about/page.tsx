import React from 'react';
import { Sparkles, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-28 pb-12 px-6 max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                About Astrominee
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-16">
                We bridge ancient Vedic wisdom with cutting-edge technology to give you accurate, personalized, and visually stunning astrological insights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <Sparkles className="w-10 h-10 text-yellow-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">High Precision</h3>
                    <p className="text-gray-400 text-sm">Our ephemeris calculations are powered by advanced algorithms ensuring exact planetary degrees and Dasha timings.</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <Globe className="w-10 h-10 text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Modern Interface</h3>
                    <p className="text-gray-400 text-sm">Experience your cosmic blueprint through dynamic, responsive, and beautifully crafted visualizations.</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl border border-white/5">
                    <Shield className="w-10 h-10 text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Private & Secure</h3>
                    <p className="text-gray-400 text-sm">Your birth details are sensitive. We securely process data without storing it unencrypted, backed by Firebase.</p>
                </div>
            </div>
        </main>
    );
}
