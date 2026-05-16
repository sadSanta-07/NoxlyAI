"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Wand2, Scissors, Type, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface NoteContentProps {
    content: string;
    setContent: (content: string) => void;
    mode: "edit" | "preview";
    noteId: string;
}

export function NoteContent({ content, setContent, mode, noteId }: NoteContentProps) {
    const [selection, setSelection] = useState<{ text: string; start: number; end: number } | null>(null);
    const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
    const [isAILoading, setIsAILoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSelection = () => {
        if (mode !== "edit" || !textareaRef.current) return;
        
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = textareaRef.current.value.substring(start, end);

        if (text && text.trim().length > 2) {
            const rect = textareaRef.current.getBoundingClientRect();
            // This is a simplified position calculation
            setToolbarPos({ x: 20, y: -50 }); // Floating relative to selection
            setSelection({ text, start, end });
        } else {
            setSelection(null);
        }
    };

    const handleAIAction = async (action: string) => {
        if (!selection || isAILoading) return;
        setIsAILoading(true);

        try {
            const res = await api.generateSummary(noteId, action, selection.text, content);
            if (res.data.result) {
                const newContent = 
                    content.substring(0, selection.start) + 
                    res.data.result + 
                    content.substring(selection.end);
                setContent(newContent);
                toast.success(`AI ${action} successful!`);
            }
        } catch (error: any) {
            toast.error(error.message || "AI action failed");
        } finally {
            setIsAILoading(false);
            setSelection(null);
        }
    };

    return (
        <div className="flex-1 px-4 md:px-12 py-12 relative">
            <div className="max-w-4xl mx-auto h-full relative">
                <AnimatePresence>
                    {selection && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute z-50 bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 backdrop-blur-3xl"
                            style={{ 
                                top: "0px", // Fixed to top of editor for simplicity in this version
                                left: "50%",
                                transform: "translateX(-50%)"
                            }}
                        >
                            <div className="px-3 py-1 border-r border-zinc-800 flex items-center gap-2">
                                <Sparkles size={12} className="text-primary" />
                                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Magic Tool</span>
                            </div>
                            
                            <AIButton 
                                icon={<Wand2 size={12} />} 
                                label="Rewrite" 
                                onClick={() => handleAIAction("rewrite")} 
                                loading={isAILoading}
                            />
                            <AIButton 
                                icon={<Scissors size={12} />} 
                                label="Simplify" 
                                onClick={() => handleAIAction("simplify")} 
                                loading={isAILoading}
                            />
                            <AIButton 
                                icon={<Type size={12} />} 
                                label="Expand" 
                                onClick={() => handleAIAction("expand")} 
                                loading={isAILoading}
                            />
                            
                            <button 
                                onClick={() => setSelection(null)}
                                className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {mode === "edit" ? (
                    <textarea
                        ref={textareaRef}
                        className="w-full min-h-[500px] bg-transparent text-xl leading-relaxed text-zinc-300 font-medium focus:outline-none resize-none placeholder:text-zinc-900 selection:bg-primary/20 selection:text-primary font-sans"
                        placeholder="Start writing your thoughts..."
                        value={content}
                        onSelect={handleSelection}
                        onChange={(e) => setContent(e.target.value)}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto";
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                ) : (
                    <div className="prose prose-invert prose-p:text-zinc-400 prose-headings:text-zinc-100 prose-headings:font-black prose-headings:italic prose-p:font-medium prose-p:text-lg max-w-none prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-3xl prose-hr:border-zinc-900 prose-a:text-primary prose-strong:text-white font-sans">
                        <ReactMarkdown>{content || "*The canvas is empty. Start typing to begin.*"}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}

function AIButton({ icon, label, onClick, loading }: { icon: any; label: string; onClick: () => void; loading?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-all disabled:opacity-50"
        >
            {loading ? <Loader2 size={12} className="animate-spin" /> : icon}
            {label}
        </button>
    );
}
