"use client";
import {
    Settings as SettingsIcon,
    Zap,
    Key,
    Cloud,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/component/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export function Settings() {
    const user =
        useAuthStore(
            (s) => s.user
        );

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-zinc-950">
            <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-16">
                <header className="space-y-6">
                    <div className="flex items-center gap-4 text-ai">
                        <SettingsIcon size={20} className="stroke-[2.5px]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-70">Configuration</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] font-display">SETTINGS</h1>
                        <p className="text-sm text-zinc-500 font-bold tracking-tight uppercase max-w-xl">Optimize the core intelligence of your creative ecosystem.</p>
                    </div>
                </header>

                <div className="bg-zinc-900/50 backdrop-blur-3xl border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] space-y-10 shadow-2xl">
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 font-display flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap size={24} className="text-primary" /> User Profile
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-800 p-2 pr-4 rounded-2xl">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black text-xs brutal-shadow-sm">
                                {user?.name?.slice(0, 2).toUpperCase() || "JD"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-50">{user?.name || "GUEST"}</span>
                                <span className="text-[8px] font-black uppercase italic text-zinc-600 tracking-widest">Active Node</span>
                            </div>
                        </div>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Full Name</label>
                            <Input readOnly defaultValue={user?.name || "JOHN DOE"} className="bg-zinc-950/50 border border-zinc-800 h-14 rounded-2xl font-black uppercase tracking-widest text-xs focus-visible:ring-primary/20 focus-visible:border-primary/50 text-zinc-400" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Email Address</label>
                            <Input readOnly defaultValue={user?.email || "USER@PEBLO.CLOUD"} className="bg-zinc-950/50 border border-zinc-800 h-14 rounded-2xl font-black uppercase tracking-widest text-xs focus-visible:ring-primary/20 focus-visible:border-primary/50 text-zinc-400" />
                        </div>
                    </div>

                    <div className="bg-ai/5 border border-ai/20 p-8 rounded-2xl relative overflow-hidden group shadow-xl">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-ai/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 text-ai font-black uppercase italic tracking-[0.2em] text-[10px] mb-4">
                            <Sparkles size={14} fill="currentColor" /> Pro Workspace
                        </div>
                        <p className="text-xs font-bold text-zinc-400 leading-relaxed mb-0">
                            FULL INTELLIGENCE PROTOCOL ENABLED. UNLIMITED CONTEXT WINDOW.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
