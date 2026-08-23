"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat, Message } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, AlertCircle, Copy, Check, RotateCcw, Compass } from "lucide-react";

interface Props {
    chartData?: any;
}

const QUICK_PROMPTS = [
    "✨ What does my Lagna (Ascendant) reveal about my personality?",
    "💼 When is an auspicious period for career growth & wealth?",
    "❤️ How are my love, relationship, and 7th house aspects?",
    "🪐 Explain my active Mahadasha & Antardasha effects",
    "💎 Which Vedic remedies & gemstones align with my chart?",
    "🧘 How can I reduce stress based on my Moon Nakshatra?"
];

export const AIChatBox: React.FC<Props> = ({ chartData }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
        api: "/api/chat",
        body: { chartData },
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: `Namaste! 🙏✨ I am **Astrominee AI**, your personal Vedic Astrologer and cosmic companion.

I have analyzed your planetary alignments and Kundli charts. How may I guide your journey today? You can ask me anything about your **career, relationships, doshas, active Dasha periods, or personal remedies**!`
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
        // Clean markdown formatter
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
        <div className="w-full max-w-4xl mx-auto h-[640px] flex flex-col relative rounded-3xl overflow-hidden bg-white/90 dark:bg-[#080d1e]/90 backdrop-blur-2xl border border-amber-200/90 dark:border-white/10 shadow-2xl transition-colors duration-300">
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
                        <p className="text-xs text-slate-500 dark:text-gray-400">Vedic Astrology &amp; Horoscopic Companion</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleClearChat}
                        title="Reset conversation"
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">New Chat</span>
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 relative">
                <AnimatePresence>
                    {messages.map((m: Message) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border shadow-xs
                                    ${m.role === 'user'
                                        ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-300'
                                        : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-yellow-400'}`}
                                >
                                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`group relative p-4 rounded-2xl text-sm leading-relaxed
                                    ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md rounded-tr-xs'
                                        : 'bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-gray-200 rounded-tl-xs shadow-xs'}`}
                                >
                                    {m.role === 'user' ? (
                                        <p className="whitespace-pre-wrap">{m.content}</p>
                                    ) : (
                                        <>
                                            <div
                                                className="ai-message text-slate-800 dark:text-gray-200"
                                                dangerouslySetInnerHTML={formatMessageContent(m.content)}
                                            />
                                            {/* Copy Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(m.content, m.id)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/80 dark:bg-black/60 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white cursor-pointer shadow-xs"
                                                title="Copy message"
                                            >
                                                {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-yellow-400 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-2xl rounded-tl-xs p-3.5 text-slate-600 dark:text-gray-400 text-sm flex gap-2 items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-75" />
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150" />
                            <span className="ml-1 text-xs">Consulting the planetary positions...</span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="flex justify-center my-4">
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 py-3 px-6 rounded-2xl flex items-center gap-3 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>Unable to generate response. Please check connection and try again.</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (if few messages) */}
            {messages.length <= 2 && (
                <div className="px-4 py-2 border-t border-slate-200/60 dark:border-white/5 bg-slate-50/60 dark:bg-black/30 overflow-x-auto flex items-center gap-2 no-scrollbar">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" /> Suggestions:
                    </span>
                    {QUICK_PROMPTS.map((prompt, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleQuickPrompt(prompt)}
                            className="text-xs px-3 py-1.5 rounded-full bg-white/90 dark:bg-white/5 hover:bg-amber-500/15 dark:hover:bg-amber-500/20 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-yellow-400 transition-all whitespace-nowrap cursor-pointer shadow-xs"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Form */}
            <div className="p-4 bg-slate-50/80 dark:bg-black/60 border-t border-amber-100 dark:border-white/10 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        className="w-full bg-white dark:bg-[#10172a] text-slate-900 dark:text-white rounded-full py-3.5 pl-5 pr-14 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400 dark:placeholder:text-gray-500 transition-all shadow-inner text-sm"
                        value={input}
                        placeholder="Ask about your career, marriage, active dasha, or remedies..."
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 flex items-center justify-center text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </form>
                <div className="text-center mt-2.5">
                    <p className="text-[10px] text-slate-400 dark:text-gray-500">Astrominee AI specializes in Vedic astrology &amp; cosmic reflections. For spiritual guidance only.</p>
                </div>
            </div>
        </div>
    );
};
