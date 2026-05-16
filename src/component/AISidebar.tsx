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
    content: "Hi! I'm your Noxly AI assistant. I can help you summarize notes, extract tasks, or brainstorm ideas. What's on your mind?",
};

const GLOBAL_WELCOME: Message = {
    type: "ai",
    content: "Welcome to your AI workspace! I'm Noxly, and I'm here to help you stay organized. Feel free to chat with me here, or select a note to start summarizing and extracting tasks!",
};

export function AISidebar({
    note,
}: {
    note: Note | null;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isTyping]);

    useEffect(() => {
        setMessages([note ? WELCOME_MESSAGE : GLOBAL_WELCOME]);
    }, [note?.id]);

    const pushAI = (content: string) => {
        setMessages((prev) => [
            ...prev,
            { type: "ai", content },
        ]);
    };

    const pushUser = (content: string) => {
        setMessages((prev) => [
            ...prev,
            { type: "user", content },
        ]);
    };

    const handleShortcut = async (type: "summary" | "actions") => {
        if (!note || isTyping) return;
        setIsTyping(true);
        pushUser(type === "summary" ? "Summarize this note" : "Extract action items");

        try {
            const res = await api.generateSummary(note.id);
            const result = res.data;

            if (type === "summary") {
                pushAI(`**Summary:**\n\n${result.summary}`);
            } else {
                const items = result.action_items
                    .map((item) => `- ${item}`)
                    .join("\n");
                pushAI(`**Action Items:**\n\n${items}`);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to generate AI response");
            pushAI("Something went wrong while processing your request.");
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const userMsg = input.trim();
        setInput("");
        pushUser(userMsg);
        setIsTyping(true);

        try {
            if (note) {
                const res = await api.generateSummary(note.id);
                pushAI(`Thinking about "${userMsg}" in the context of this note...\n\n${res.data.summary}`);
            } else {
                // Helpful general responses for common greetings and questions
                const lowMsg = userMsg.toLowerCase();
                if (lowMsg.includes("hi") || lowMsg.includes("hello") || lowMsg.includes("hey")) {
                    pushAI("Hello! I'm Noxly AI. I'm here to help you manage your workspace. You can ask me to summarize notes, extract tasks, or just brainstorm ideas!");
                } else if (lowMsg.includes("how are you")) {
                    pushAI("I'm functioning at 100% capacity and ready to assist you! How's your work going today?");
                } else if (lowMsg.includes("what is ai") || lowMsg.includes("explain ai")) {
                    pushAI("Artificial Intelligence (AI) is the simulation of human intelligence by machines, especially computer systems. In Noxly, I use AI to help you organize thoughts, summarize content, and turn messy notes into actionable tasks!");
                } else if (lowMsg.includes("help") || lowMsg.includes("can you help")) {
                    pushAI("I definitely can! Since you haven't selected a note, I can help you with brainstorming or general productivity tips. For example, do you want to know how to organize your workspace better?");
                } else if (lowMsg.includes("organize") || lowMsg.includes("workspace")) {
                    pushAI("Great question! A good workspace starts with categories. You can group your notes into 'Work', 'Personal', or 'Ideas' to keep things clean. Would you like me to help you create some tags?");
                } else {
                    pushAI(`I'm listening! I can help you brainstorm or provide general productivity advice. To get deep analysis on your specific projects, just click any note in the sidebar!`);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "AI failed to respond");
            pushAI("AI failed to respond. Please try again.");
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex h-full flex-col bg-zinc-950">
            {/* HEADER */}
            <div className="border-b border-zinc-900 bg-zinc-950/20 p-6 md:p-8">
                <div className="mb-2 flex items-center space-x-2 text-primary">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest font-display">
                        AI Assistant Active
                    </span>
                </div>
                <h2 className="font-display flex items-center gap-3 text-3xl font-black uppercase tracking-tighter text-zinc-100">
                    AI Assistant
                    <Sparkles className="h-6 w-6 text-primary" fill="currentColor" />
                </h2>
            </div>

            {/* CHAT AREA */}
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                    {!note && (
                        <div className="space-y-4">
                            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl relative overflow-hidden group shadow-xl">
                                <h4 className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary font-display">
                                    <Zap size={12} fill="currentColor" /> Pro Tip
                                </h4>
                                <p className="text-xs font-bold leading-tight text-zinc-400 font-display">
                                    Select a note from the sidebar to enable context-aware assistance, summaries, and task extraction.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    "Brainstorm new project ideas",
                                    "How to organize my workspace?",
                                    "Give me some productivity tips"
                                ].map((prompt) => (
                                    <Button 
                                        key={prompt}
                                        variant="outline" 
                                        onClick={() => {
                                            setInput(prompt);
                                            // Optional: auto-send
                                        }}
                                        className="h-10 justify-start px-4 text-[9px] font-black uppercase border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:text-zinc-100 hover:border-zinc-700 font-display"
                                    >
                                        {prompt}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex gap-4",
                                    msg.type === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xl transition-all",
                                    msg.type === "ai" ? "border-primary/30 bg-zinc-900 text-primary" : "border-zinc-800 bg-zinc-900 text-zinc-500"
                                )}>
                                    {msg.type === "ai" ? <Bot size={18} strokeWidth={2.5} /> : <User size={18} strokeWidth={2.5} />}
                                </div>

                                <div className={cn(
                                    "relative max-w-[85%] rounded-2xl border p-4 md:p-5 text-sm font-display transition-all",
                                    msg.type === "ai" ? "border-zinc-800 bg-zinc-900/50 text-zinc-200" : "border-primary/20 bg-primary/5 text-zinc-400"
                                )}>
                                    <div className="prose prose-invert prose-p:my-0 prose-p:text-xs prose-p:font-bold prose-p:leading-relaxed prose-li:my-1 prose-li:text-xs prose-strong:text-primary">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                    {msg.type === "ai" && (
                                        <div className="absolute -left-1.5 top-4 h-3 w-3 rotate-45 border-b border-l border-zinc-800 bg-zinc-900" />
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-zinc-900 text-primary shadow-xl">
                                    <Bot size={18} strokeWidth={2.5} />
                                </div>
                                <div className="flex items-center gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* INPUT FOOTER */}
            <div className="space-y-6 border-t border-zinc-900 bg-zinc-950/50 p-6 md:p-8 backdrop-blur-3xl">
                {note && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            disabled={isTyping}
                            onClick={() => handleShortcut("summary")}
                            className="h-11 flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest transition-all hover:border-primary/50 font-display"
                        >
                            <FileSearch size={14} className="text-primary mr-2" />
                            Summarize
                        </Button>
                        <Button
                            variant="outline"
                            disabled={isTyping}
                            onClick={() => handleShortcut("actions")}
                            className="h-11 flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest transition-all hover:border-secondary/50 font-display"
                        >
                            <ListTodo size={14} className="text-secondary mr-2" />
                            Tasks
                        </Button>
                    </div>
                )}

                <div className="group relative">
                    <textarea
                        placeholder={note ? "ASK ABOUT THIS NOTE..." : "HOW CAN I HELP?"}
                        className="w-full min-h-[80px] max-h-[160px] rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 pr-14 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none scrollbar-hide text-zinc-100 font-display"
                        value={input}
                        disabled={isTyping}
                        onChange={(e) => setInput(e.target.value)}
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
                        disabled={!input.trim() || isTyping}
                        className="brutal-btn-primary absolute right-3 bottom-3 h-10 w-10 rounded-xl p-0 shadow-none active:translate-x-0 active:translate-y-0"
                    >
                        <Send size={18} className="stroke-[3px]" />
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 font-display">
                    <Sparkles size={10} className="text-primary" />
                    NOXLY AI ASSISTANT
                </div>
            </div>
        </div>
    );
}