import React, { ButtonHTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "glass";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    {
                        "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] border border-indigo-400/20": variant === "primary",
                        "bg-transparent border border-white/20 text-white hover:bg-white/10": variant === "secondary",
                        "hover:bg-white/10 text-gray-300 hover:text-white": variant === "ghost",
                        "glass-panel text-white hover:bg-white/10": variant === "glass",
                    },
                    "h-10 px-4 py-2",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
