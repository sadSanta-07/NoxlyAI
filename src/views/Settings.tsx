"use client";
import {
    Settings as SettingsIcon,
    Sparkles,
    LogOut,
    User as UserIcon,
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export function Settings() {
    const { user, updateUser } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return toast.error("Name cannot be empty");
        if (!email.trim() || !email.includes("@")) return toast.error("Please enter a valid email");
        
        setIsSaving(true);
        try {
            await api.updateUser({ name, email });
            updateUser({ name, email });
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = name !== user?.name || email !== user?.email;

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-zinc-950">
            <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto space-y-12">
                <header className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 text-primary/80">
                        <SettingsIcon size={18} className="stroke-[2.5px]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] font-display">System Configuration</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] font-display text-zinc-100">
                            Settings
                        </h1>
                        <p className="text-[11px] text-zinc-500 font-medium tracking-widest uppercase max-w-xl font-display">
                            Manage your personal identity and workspace parameters.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Profile Section */}
                        <div className="bg-zinc-900/30 backdrop-blur-3xl border border-zinc-800/50 p-6 md:p-10 rounded-[2.5rem] space-y-10 shadow-2xl transition-all hover:border-zinc-700/50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black uppercase tracking-tight font-display flex items-center gap-3 text-zinc-100">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <UserIcon size={20} className="text-primary" />
                                    </div>
                                    Identity Profile
                                </h3>
                                <div className="hidden md:block px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50 text-[8px] font-black uppercase tracking-widest text-zinc-500 font-display">
                                    Member since {new Date().getFullYear()}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1 font-display">Full Identity</label>
                                    <Input 
                                        placeholder="Enter your name"
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-zinc-950/50 border-zinc-800 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] text-zinc-100 focus-visible:ring-primary/10 focus-visible:border-primary/40 font-display transition-all placeholder:text-zinc-800" 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1 font-display">Neural Interface (Email)</label>
                                    <Input 
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-zinc-950/50 border-zinc-800 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] text-zinc-100 focus-visible:ring-primary/10 focus-visible:border-primary/40 font-display transition-all placeholder:text-zinc-800" 
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                                <Button 
                                    onClick={handleSave} 
                                    disabled={isSaving || !hasChanges}
                                    className={cn(
                                        "w-full sm:w-auto h-14 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] font-display transition-all duration-300",
                                        hasChanges ? "bg-primary text-zinc-950 hover:scale-105 active:scale-95" : "bg-zinc-800 text-zinc-500"
                                    )}
                                >
                                    {isSaving ? "Syncing..." : "Update Credentials"}
                                </Button>
                                {hasChanges && (
                                    <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest animate-pulse font-display">
                                        Unsaved modifications detected
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Status Card */}
                        <div className="bg-gradient-to-br from-zinc-900/40 to-zinc-900/20 border border-zinc-800/80 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-8 font-display">
                                    <Sparkles size={14} className="animate-pulse" /> PRO ACCESS
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-primary font-black text-lg font-display shadow-inner">
                                            {name?.slice(0, 2).toUpperCase() || "??"}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-tight text-zinc-100 font-display truncate max-w-[150px]">
                                                {name || "Anonymous"}
                                            </span>
                                            <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest font-display">
                                                Active Session
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[11px] font-medium text-zinc-500 leading-relaxed font-display uppercase tracking-wider">
                                        Your account is optimized with advanced neural models. All subsystems are operational.
                                    </p>
                                </div>

                                <div className="mt-10 pt-8 border-t border-zinc-800/50">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            useAuthStore.getState().clearAuth();
                                            window.location.href = "/auth";
                                        }}
                                        className="w-full h-12 rounded-xl border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-red-400 hover:border-red-900/30 text-[10px] font-black uppercase font-display flex items-center justify-center gap-2 transition-all"
                                    >
                                        <LogOut size={14} /> Terminate
                                    </Button>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-[80px] rounded-full" />
                        </div>
                    </div>
                </div>

                <footer className="pt-24 pb-8 text-center border-t border-zinc-900/30">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] font-display text-zinc-700 transition-all hover:text-zinc-500">
                        Made with <span className="text-primary/40 animate-pulse">♥</span> by Sahil Singh
                    </p>
                </footer>
            </div>
        </div>
    );
}
