"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Send, Bot, Sparkles, AlertCircle, Copy, Check, RotateCcw } from "lucide-react";

interface Props {
    chartData?: any;
}

const QUICK_PROMPTS = [
    "💼 When is an auspicious period for my career growth & wealth?",
    "✨ What does my Lagna (Ascendant) reveal about my life purpose?",
    "❤️ How are my love, relationship, and 7th house aspects?",
    "🪐 Explain my active Mahadasha & Antardasha effects",
    "💎 Which Vedic remedies & gemstones align with my chart?",
    "🧘 How can I reduce stress based on my Moon Nakshatra?"
];

export const AIChatBox: React.FC<Props> = ({ chartData }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [resolvedChartData, setResolvedChartData] = useState<any>(chartData);

    useEffect(() => {
        if (chartData && Array.isArray(chartData) && chartData.length > 0) {
            setResolvedChartData(chartData);
        } else {
            try {
                const stored = sessionStorage.getItem("chartData") || sessionStorage.getItem("astrologyChartData");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const arrayData = Array.isArray(parsed) ? parsed : (parsed.data || parsed.output || []);
                    if (arrayData.length > 0) {
                        setResolvedChartData(arrayData);
                    }
                }
            } catch (e) {
                console.error("Error reading chart from session:", e);
            }
        }
    }, [chartData]);

    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
        api: "/api/chat",
        body: { chartData: resolvedChartData },
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: `Namaste! 🙏✨ I am **Astrominee AI**, your dedicated Vedic Astrologer.

I have synchronized with your planetary alignments and active birth chart. Ask me anything about your **career trajectory, financial timing, relationships, current Dasha phase, or Vedic remedies**!`
            }
        ]
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: "welcome-reset",
                role: "assistant",
                content: `Namaste! 🙏✨ What would you like to explore in your astrological chart next?`
            }
        ]);
    };

    const formatMessageContent = (text: string) => {
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-700 dark:text-yellow-400 font-bold">$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 dark:text-slate-300">$1</em>');
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 font-mono text-xs text-indigo-600 dark:text-indigo-300">$1</code>');
        formatted = formatted.replace(/^- (.*?)(?:\n|$)/gm, '<li class="ml-4 list-disc marker:text-amber-500 my-1">$1</li>');

        const paragraphs = formatted.split("\n\n").map((p) => {
            if (p.includes("<li")) {
                return `<ul class="my-2 space-y-1">${p}</ul>`;
            }
            return `<p class="mb-2.5 last:mb-0 leading-relaxed">${p}</p>`;
        });

        return { __html: paragraphs.join('') };
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[640px] flex flex-col relative rounded-3xl overflow-hidden bg-white/95 dark:bg-[#080d1e]/95 backdrop-blur-2xl border border-amber-200/90 dark:border-white/10 shadow-2xl transition-colors duration-300">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-amber-100 dark:border-white/10 bg-amber-50/50 dark:bg-black/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 dark:from-yellow-500/20 dark:to-amber-500/20 flex items-center justify-center border border-amber-500/40 shadow-sm">
                        <Bot className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg flex items-center gap-2">
                            Astrominee AI <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                            {resolvedChartData && resolvedChartData.length > 0 ? "⚡ Kundli Linked & Active" : "Vedic Astrology Companion"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleClearChat}
                        className="p-2 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        title="Clear conversation"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quick Prompt Chips Bar */}
            <div className="px-4 py-2 bg-slate-100/70 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickPrompt(prompt)}
                        className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-white dark:bg-white/5 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-yellow-400 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 transition-all cursor-pointer shadow-xs"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                {messages.map((m) => {
                    const isAi = m.role === "assistant";
                    return (
                        <div
                            key={m.id}
                            className={`flex gap-3 md:gap-4 ${isAi ? "items-start" : "items-start flex-row-reverse"}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-sm ${
                                    isAi
                                        ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-bold"
                                        : "bg-indigo-600 text-white font-bold"
                                }`}
                            >
                                {isAi ? "ॐ" : "You"}
                            </div>

                            {/* Message Bubble */}
                            <div className="relative group max-w-[85%] md:max-w-[75%]">
                                <div
                                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                                        isAi
                                            ? "bg-slate-50 dark:bg-[#0d1428] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-100 shadow-sm"
                                            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-medium"
                                    }`}
                                >
                                    {isAi ? (
                                        <div
                                            dangerouslySetInnerHTML={formatMessageContent(m.content)}
                                            className="space-y-2 prose-sm dark:prose-invert"
                                        />
                                    ) : (
                                        <p>{m.content}</p>
                                    )}
                                </div>

                                {/* Copy Button on Hover */}
                                {isAi && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(m.content, m.id)}
                                        className="absolute right-2 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white shadow-xs cursor-pointer"
                                        title="Copy reading"
                                    >
                                        {copiedId === m.id ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            ॐ
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1428] border border-slate-200 dark:border-white/10 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                            <span className="text-xs text-slate-500 dark:text-gray-400 ml-1">Consulting the Navagrahas...</span>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error.message || "Failed to reach AI Astrologer. Please check your connection."}</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about career, love, Mahadasha, wealth timing..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-[#060a16] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-bold text-sm transition-all shadow-[0_4px_14px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>Ask</span>
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};
