"use client";

import BirthDetailsForm from "@/components/forms/BirthDetailsForm";
import React from "react";
import { motion } from "framer-motion";

export default function FormPage() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-h-screen flex items-center justify-center p-6 relative pt-24 pb-12"
        >
            <div className="w-full z-10">
                <BirthDetailsForm />
            </div>
        </motion.main>
    );
}
