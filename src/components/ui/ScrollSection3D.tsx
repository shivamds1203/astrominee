"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface ScrollSection3DProps {
    children: React.ReactNode;
    className?: string;
    intensity?: "subtle" | "medium" | "dramatic";
    depth?: number;
    rotateFactor?: number;
    perspective?: number;
    enableParallax?: boolean;
    parallaxSpeed?: number;
    id?: string;
}

export const ScrollSection3D: React.FC<ScrollSection3DProps> = ({
    children,
    className = "",
    intensity = "medium",
    enableParallax = false,
    parallaxSpeed = 15,
    id,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 26,
        restDelta: 0.001,
    });

    // Clean, GPU-accelerated 2D transforms that NEVER break pointer-events or hit testing
    const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.85, 1, 1, 0.85]);
    const yParallax = useTransform(smoothProgress, [0, 1], [enableParallax ? parallaxSpeed : 0, enableParallax ? -parallaxSpeed : 0]);

    if (shouldReduceMotion) {
        return (
            <section id={id} ref={containerRef} className={`relative ${className}`}>
                {children}
            </section>
        );
    }

    return (
        <section
            id={id}
            ref={containerRef}
            className={`relative ${className}`}
        >
            <motion.div
                style={{
                    opacity,
                    y: yParallax,
                }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </section>
    );
};
