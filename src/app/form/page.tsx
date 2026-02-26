import BirthDetailsForm from "@/components/forms/BirthDetailsForm";
import React from "react";

export default function FormPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative pt-24 pb-12">
            <div className="w-full z-10">
                <BirthDetailsForm />
            </div>
        </main>
    );
}
