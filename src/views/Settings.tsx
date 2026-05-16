"use client";
import {
    Settings as SettingsIcon,
    Zap,
    Key,
    Cloud,
    ChevronRight,
    Sparkles,
    LogOut,
    User as UserIcon,
    Bell,
    Shield
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export function Settings() {
    const { user, updateUserName } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return toast.error("Name cannot be empty");
        setIsSaving(true);
        try {
            await api.updateUser({ name });
            updateUserName(name);
            toast.success("Profile updated successfully");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-zinc-950">
            <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-16">
                <header className="space-y-6">
                    <div className="flex items-center gap-4 text-primary">
                        <SettingsIcon size={20} className="stroke-[2.5px]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] font-display">Account Control</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] font-display text-zinc-100">SETTINGS</h1>
                        <p className="text-[10px] text-zinc-600 font-black tracking-[0.2em] uppercase max-w-xl font-display">Manage your workspace preferences and security.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800 p-8 rounded-[2rem] space-y-8 shadow-2xl">
                            <h3 className="text-xl font-black uppercase tracking-tight font-display flex items-center gap-3 text-zinc-100">
                                <UserIcon size={20} className="text-primary" /> Profile Information
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1 font-display">Full Name</label>
                                    <Input 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-zinc-950/50 border border-zinc-800 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-100 focus-visible:ring-primary/20 focus-visible:border-primary/50 font-display transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1 font-display">Email Address</label>
                                    <Input readOnly defaultValue={user?.email || "user@noxly.ai"} className="bg-zinc-950/20 border border-zinc-800/50 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-500 font-display cursor-not-allowed opacity-50" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    onClick={handleSave} 
                                    disabled={isSaving || name === user?.name}
                                    className="brutal-btn-primary h-12 px-8 text-[10px] font-black uppercase font-display"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Status Card */}
                        <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2rem] relative overflow-hidden group shadow-xl h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6 font-display">
                                    <Sparkles size={14} fill="currentColor" /> Pro Status
                                </div>
                                <p className="text-[11px] font-bold text-zinc-400 leading-relaxed font-display uppercase">
                                    Premium features are fully active for your account. Enjoy unlimited AI interactions and cloud storage.
                                </p>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-primary/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-black text-xs font-display">
                                        {user?.name?.slice(0, 2).toUpperCase() || "JD"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-100 font-display">{user?.name || "Guest"}</span>
                                        <span className="text-[8px] font-black uppercase text-primary tracking-widest font-display">Verified User</span>
                                    </div>
                                </div>
                                <Button 
                                    variant="destructive" 
                                    onClick={() => {
                                        useAuthStore.getState().clearAuth();
                                        window.location.href = "/auth";
                                    }}
                                    className="w-full h-11 rounded-xl text-[10px] font-black uppercase font-display flex items-center gap-2"
                                >
                                    <LogOut size={14} /> Terminate Session
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
