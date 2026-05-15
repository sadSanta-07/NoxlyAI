"use client";

import { useState, useRef, useEffect } from "react";
import { Note, api } from "@/lib/api";

import { ScrollArea } from "@/component/ui/scroll-area";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";

import {
    Sparkles,
    Send,
    ListTodo,
    FileSearch,
    Bot,
    User,
    Zap,
    Info,
} from "lucide-react";

import { motion } from "framer-motion";

import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

interface Message {
    type: "ai" | "user";
    content: string;
}

const WELCOME_MESSAGE: Message = {
    type: "ai",
    content: "Hey! I'm Peblo AI. How can I help with this note today?",
};

export function AISidebar({
    note,
}: {
    note: Note | null;
}) {
    const [messages, setMessages] = useState<Message[]>([
        WELCOME_MESSAGE,
    ]);

    const [input, setInput] = useState("");

    const [isTyping, setIsTyping] =
        useState(false);

    const bottomRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isTyping]);

    useEffect(() => {
        queueMicrotask(() => {
            setMessages([WELCOME_MESSAGE]);
        });
    }, [note?.id]);

    const pushAI = (content: string) => {
        setMessages((prev) => [
            ...prev,
            {
                type: "ai",
                content,
            },
        ]);
    };

    const pushUser = (content: string) => {
        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                content,
            },
        ]);
    };

    const handleShortcut = async (
        type: "summary" | "actions"
    ) => {
        if (!note || isTyping) return;

        setIsTyping(true);

        pushUser(
            type === "summary"
                ? "Generate summary"
                : "Extract action items"
        );

        try {
            const res =
                await api.generateSummary(note.id);

            const result = res.data;

            if (type === "summary") {
                pushAI(
                    `**Summary:**\n\n${result.summary}`
                );
            } else {
                const items =
                    result.action_items
                        .map((item) => `- ${item}`)
                        .join("\n");

                pushAI(
                    `**Action Items:**\n\n${items}`
                );
            }
        } catch (error: any) {
            toast.error(
                error.message || "Failed to generate AI response"
            );

            pushAI(
                error.message || "Something went wrong while processing your request."
            );
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async () => {
        if (
            !input.trim() ||
            isTyping ||
            !note
        )
            return;

        const userMsg = input.trim();

        setInput("");

        pushUser(userMsg);

        setIsTyping(true);

        try {
            const res =
                await api.generateSummary(note.id);

            pushAI(
                `Thinking about "${userMsg}" in the context of this note...\n\n**Synthesized Response:**\n\n${res.data.summary}`
            );
        } catch (error: any) {
            toast.error(error.message || "AI failed to respond");

            pushAI(
                error.message || "AI failed to respond. Please try again."
            );
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex h-full flex-col bg-zinc-950">
            {/* HEADER */}

            <div className="border-b border-zinc-900 bg-zinc-950/20 p-8">
                <div className="mb-2 flex items-center space-x-2 text-ai">
                    <div className="h-1.5 w-1.5 rounded-full bg-ai animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]" />

                    <span className="text-[10px] font-black uppercase tracking-widest italic">
                        Neural Engine Active
                    </span>
                </div>

                <h2 className="font-display flex items-center gap-3 text-3xl font-black uppercase tracking-tighter">
                    Neural Core

                    <Sparkles
                        className="h-6 w-6 animate-pulse text-primary"
                        fill="currentColor"
                    />
                </h2>
            </div>

            {/* CHAT */}

            <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                    {/* INSIGHT CARD */}

                    <div className="group relative overflow-hidden rounded-2xl border border-ai/30 bg-ai/10 p-5">
                        <div className="absolute right-0 top-0 p-2 opacity-20 transition-opacity group-hover:opacity-100">
                            <Info
                                size={14}
                                className="text-ai"
                            />
                        </div>

                        <h4 className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ai">
                            <Zap
                                size={12}
                                fill="currentColor"
                            />
                            Insight Extract
                        </h4>

                        <p className="text-sm font-bold italic leading-tight text-zinc-300">
                            Current manifest context
                            suggests 3 high-priority
                            architectural nodes. Sync
                            requested.
                        </p>
                    </div>

                    {/* MESSAGES */}

                    <div className="space-y-6">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className={cn(
                                    "flex gap-4",
                                    msg.type === "user"
                                        ? "flex-row-reverse"
                                        : "flex-row"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xl",
                                        msg.type === "ai"
                                            ? "border-ai/50 bg-zinc-900 text-ai"
                                            : "border-zinc-700 bg-zinc-900 text-zinc-400"
                                    )}
                                >
                                    {msg.type === "ai" ? (
                                        <Bot
                                            size={18}
                                            strokeWidth={2.5}
                                        />
                                    ) : (
                                        <User
                                            size={18}
                                            strokeWidth={2.5}
                                        />
                                    )}
                                </div>

                                <div
                                    className={cn(
                                        "relative max-w-[85%] rounded-2xl border p-5 text-sm",
                                        msg.type === "ai"
                                            ? "border-zinc-800 bg-zinc-900/50 text-zinc-200"
                                            : "border-primary/20 bg-primary/5 text-zinc-400"
                                    )}
                                >
                                    <div className="prose prose-invert prose-p:my-0 prose-p:text-xs prose-p:font-bold prose-p:leading-relaxed prose-li:my-1 prose-li:text-xs prose-strong:text-primary">
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>

                                    {msg.type === "ai" && (
                                        <div className="absolute -left-1.5 top-4 h-3 w-3 rotate-45 border-b border-l border-zinc-800 bg-zinc-900" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* TYPING */}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ai/50 bg-zinc-900 text-ai shadow-xl">
                                <Bot
                                    size={18}
                                    strokeWidth={2.5}
                                />
                            </div>

                            <div className="flex items-center gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ai [animation-delay:-0.3s]" />

                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ai [animation-delay:-0.15s]" />

                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ai" />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* INPUT */}

            <div className="space-y-6 border-t border-zinc-900 bg-zinc-950/50 p-8 backdrop-blur-3xl">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        disabled={!note || isTyping}
                        onClick={() =>
                            handleShortcut("summary")
                        }
                        className="h-11 flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest transition-all hover:border-primary/50"
                    >
                        <FileSearch size={14} />
                        Briefing
                    </Button>

                    <Button
                        variant="outline"
                        disabled={!note || isTyping}
                        onClick={() =>
                            handleShortcut("actions")
                        }
                        className="h-11 flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest transition-all hover:border-secondary/50"
                    >
                        <ListTodo size={14} />
                        Extraction
                    </Button>
                </div>

                <div className="group relative">
                    <textarea
                        placeholder="ENGAGE NEURAL CORE..."
                        className="w-full min-h-[60px] max-h-[120px] rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 pr-12 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none scrollbar-hide text-zinc-300"
                        value={input}
                        disabled={!note || isTyping}
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={
                            !input.trim() ||
                            isTyping ||
                            !note
                        }
                        className="brutal-btn-primary absolute right-2 bottom-2 h-10 w-10 rounded-xl p-0 shadow-none active:translate-x-0 active:translate-y-0"
                    >
                        <Send
                            size={18}
                            className="stroke-[3px]"
                        />
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[8px] font-black uppercase italic tracking-[0.3em] text-zinc-600">
                    <Sparkles
                        size={10}
                        className="animate-pulse text-ai"
                    />
                    Quantum Intelligence v5.0
                </div>
            </div>
        </div>
    );
}