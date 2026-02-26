"use client";

import React, { useEffect, useRef } from "react";
import { useChat, Message } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";

interface Props {
    chartData: any; // Planets and details pulled from /api/astrology
}

export const AIChatBox: React.FC<Props> = ({ chartData }) => {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: "/api/chat",
        body: { chartData }, // Send chartData alongside the chat payload on every req
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: "Namaste! I have analyzed your planetary alignments. How may I assist you with your cosmic journey today? I can provide insights into career, relationships, karmic blocks, or prescribe specific Vedic remedies."
            }
        ]
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatMessageContent = (text: string) => {
        // Simple markdown parsing to make paragraphs, bolding, and lists look nice in a chat box without pulling in heavily loaded markdown libraries
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Handle basic lists
        formatted = formatted.replace(/- (.*?)(?:\n|$)/g, '<li class="ml-4 mt-1">$1</li>');

        // Split paragraphs preserving lists
        const paragraphs = formatted.split("\n\n").map((p, i) => {
            if (p.includes("<li")) {
                return `<ul class="my-2 list-disc list-inside text-gray-300">${p.replace(/\n/g, "")}</ul>`;
            }
            return `<p class="mb-3 last:mb-0 leading-relaxed">${p}</p>`;
        });

        return { __html: paragraphs.join('') };
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col relative rounded-3xl overflow-hidden bg-[#0c1222]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(212,175,55,0.05)]">

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center border border-yellow-500/30">
                        <Bot className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            Navagraha AI <Sparkles className="w-4 h-4 text-yellow-500" />
                        </h3>
                        <p className="text-xs text-gray-400">Expert Jyotish Consultation</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar relative">
                <AnimatePresence>
                    {messages.map((m: Message) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border
                                    ${m.role === 'user'
                                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                                        : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}
                                >
                                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>

                                {/* Bubble */}
                                <div className={`p-4 rounded-2xl text-[15px]
                                    ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md rounded-tr-sm'
                                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm shadow-sm'}`}
                                >
                                    {m.role === 'user' ? (
                                        <p className="whitespace-pre-wrap">{m.content}</p>
                                    ) : (
                                        <div
                                            className="ai-message text-gray-300"
                                            dangerouslySetInnerHTML={formatMessageContent(m.content)}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 animate-spin-slow" />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-gray-400 text-sm flex gap-2 items-center">
                            <span className="w-2 h-2 rounded-full bg-yellow-500/50 animate-pulse" />
                            <span className="w-2 h-2 rounded-full bg-yellow-500/50 animate-pulse delay-75" />
                            <span className="w-2 h-2 rounded-full bg-yellow-500/50 animate-pulse delay-150" />
                            <span className="ml-2">Consulting the chart...</span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="flex justify-center my-4">
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 py-3 px-6 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>Failed to connect to the divine source. Please try again later.</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        className="w-full bg-[#111827]/80 text-white rounded-full py-4 pl-6 pr-14 border border-white/10 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 placeholder:text-gray-500 transition-all shadow-inner"
                        value={input}
                        placeholder="Ask about your career, marriage, doshas, or remedies..."
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:shadow-none"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p className="text-[10px] text-gray-500">AI can make mistakes. Astrological readings are for guidance and spiritual reflection only.</p>
                </div>
            </div>

        </div>
    );
};
