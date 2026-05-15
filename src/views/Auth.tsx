"use client";

import { useState } from "react";

import { Button } from "@/component/ui/button";

import { Input } from "@/component/ui/input";

import {
    Zap,
    Code2,
    Mail,
    ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { api } from "@/lib/api";

import { useAuthStore } from "@/store/authStore";

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const setAuth =
        useAuthStore(
            (s) => s.setAuth
        );

    const handleAuth = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = isLogin
                ? await api.login({
                    email,
                    password,
                })
                : await api.signup({
                    name,
                    email,
                    password,
                });

            const { token, user } =
                res.data;

            setAuth(token, user);

            toast.success(
                isLogin
                    ? "Welcome back!"
                    : "Account created successfully!"
            );

            router.push("/");
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Authentication failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Graphic Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ai/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)] opacity-[0.03] pointer-events-none" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-zinc-900/50 backdrop-blur-3xl border border-zinc-800 p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                    <div className="flex justify-center mb-12">
                        <motion.div
                            whileHover={{ rotate: -5, scale: 1.1 }}
                            className="w-20 h-20 bg-zinc-950 border border-zinc-800 flex items-center justify-center rounded-3xl shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 hover:opacity-100 transition-opacity" />
                            <Zap className="text-primary fill-primary w-10 h-10 relative z-10" strokeWidth={2.5} />
                        </motion.div>
                    </div>

                    <div className="text-center mb-12 space-y-2">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase font-display leading-[0.85]">
                            {isLogin ? "INITIATE" : "JOIN"} <span className="text-zinc-600 block text-4xl">PROTOCOL</span>
                        </h1>
                        <p className="font-black text-zinc-500 uppercase tracking-[0.3em] text-[8px] italic opacity-50">Unified Neural Intelligence v4.0</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Credential: Email</label>
                            <Input
                                type="email"
                                required
                                placeholder="USER@PEBLO.CLOUD"
                                className="h-14 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-xs font-black tracking-widest uppercase focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-zinc-900"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        </div>
                        {!isLogin && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Entity: Alias</label>
                                <Input
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setName(e.target.value)
                                    }
                                    className="h-14 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-xs font-black tracking-widest uppercase focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-zinc-900"
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Credential: Key</label>
                            <Input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="h-14 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-xs font-black tracking-widest uppercase focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-zinc-900"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 brutal-btn-primary text-sm font-black uppercase tracking-widest gap-4 group"
                        >
                            <span className="font-display text-xl">{loading ? "PROCESSING..." : (isLogin ? "ENGAGE" : "INITIALIZE")}</span>
                            <ArrowRight size={20} className="stroke-[3px] group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <div className="mt-12 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.4em]">
                            <span className="bg-zinc-900 px-6 text-zinc-600">Cross-Sync Protocol</span>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-12 border border-zinc-800 bg-zinc-950/50 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 hover:bg-zinc-800 hover:text-white transition-all shadow-xl">
                            <Mail size={16} /> Neural
                        </Button>
                        <Button variant="outline" className="h-12 border border-zinc-800 bg-zinc-950/50 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 hover:bg-zinc-800 hover:text-white transition-all shadow-xl">
                            <Code2 size={16} /> Github
                        </Button>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[10px] font-black text-zinc-600 hover:text-primary transition-all cursor-pointer uppercase tracking-widest italic"
                        >
                            {isLogin ? "No access key? Acquire one here" : "Return to entry protocol"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
