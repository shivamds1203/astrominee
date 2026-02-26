import React, { InputHTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md px-4 py-2.5 text-sm text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:bg-white/[0.05] hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all placeholder:text-gray-500/80",
                        error && "border-red-500 focus:ring-red-500/50",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";
