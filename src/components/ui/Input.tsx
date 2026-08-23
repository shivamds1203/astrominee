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
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full rounded-2xl border border-slate-300/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] backdrop-blur-md px-4 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-indigo-500/50 focus:border-amber-500/50 dark:focus:border-indigo-500/50 hover:bg-slate-100/80 dark:hover:bg-white/[0.05] hover:border-slate-400/80 dark:hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500/80",
                        error && "border-rose-500 focus:ring-rose-500/50",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

