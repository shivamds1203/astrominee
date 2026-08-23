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
    depth = 60,
    rotateFactor = 8,
    perspective = 1000,
    enableParallax = true,
    parallaxSpeed = 30,
    id,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 24,
        restDelta: 0.001,
    });

    // Multipliers based on intensity
    const intensityMultiplier = intensity === "subtle" ? 0.5 : intensity === "dramatic" ? 1.5 : 1;
    const maxRotate = rotateFactor * intensityMultiplier;
    const maxDepth = depth * intensityMultiplier;

    // 3D scroll transforms
    const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [maxRotate, 0, -maxRotate]);
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 1, 0.96]);
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
    const translateZ = useTransform(smoothProgress, [0, 0.5, 1], [-maxDepth, 0, -maxDepth]);
    const yParallax = useTransform(smoothProgress, [0, 1], [parallaxSpeed, -parallaxSpeed]);

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
            style={{ perspective: `${perspective}px` }}
            className={`relative preserve-3d will-change-transform ${className}`}
        >
            <motion.div
                style={{
                    rotateX,
                    scale,
                    opacity,
                    z: translateZ,
                    y: enableParallax ? yParallax : 0,
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full will-change-transform"
            >
                {children}
            </motion.div>
        </section>
    );
};
