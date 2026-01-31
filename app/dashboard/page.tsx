'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, MapPin, Zap, Trophy, User,
    TrendingUp, Shield, Crown, Play,
    ShoppingBag, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MOCK_USER, SPONSOR_DATA } from '@/data/mockData';
import BottomNav from '@/components/BottomNav';

// Lazy Load Map
const DashboardMap = dynamic(() => import('@/components/DashboardMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-900 animate-pulse" />
});

export default function DashboardPage() {
    const [gp, setGp] = useState(0); // Animated Counter
    const [showSponsor, setShowSponsor] = useState(false);

    // GP Count-up Animation
    useEffect(() => {
        let start = 0;
        const end = MOCK_USER.gp;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setGp(end);
                clearInterval(timer);
            } else {
                setGp(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0F172A] text-white pb-24 overflow-x-hidden font-sans select-none relative">

            {/* SPONSOR POPUP */}
            <AnimatePresence>
                {showSponsor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowSponsor(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0F172A] border border-neon-pink w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.3)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="h-32 bg-gradient-to-br from-neon-pink to-purple-900 relative">
                                <button
                                    onClick={() => setShowSponsor(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/80 text-white"
                                >
                                    <X size={20} />
                                </button>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-white text-neon-pink font-black text-xs rounded shadow-lg animate-pulse">
                                        LIMITED TIME
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-black italic mb-2">{SPONSOR_DATA.title}</h2>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                    {SPONSOR_DATA.details}
                                </p>
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                    <span className="text-xs font-bold text-gray-500">REWARD</span>
                                    <span className="text-neon-cyan font-black text-lg flex items-center gap-1">
                                        <Zap size={16} fill="currentColor" /> {SPONSOR_DATA.bonus}
                                    </span>
                                </div>
                                <button className="w-full mt-6 py-3 bg-neon-pink text-white font-black italic rounded-lg hover:bg-pink-500 transition-colors">
                                    ACCEPT CHALLENGE
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. TOP HEADER */}
            <header className="flex justify-between items-center px-6 py-6 sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center overflow-hidden">
                                <User className="text-gray-400" size={24} />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-neon-cyan text-black text-[10px] font-black px-1.5 py-0.5 rounded border border-[#0F172A]">
                            LV. {MOCK_USER.level}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-neon-cyan font-bold tracking-widest mb-0.5">AGENT</div>
                        <div className="font-black text-lg leading-none">{MOCK_USER.codename}</div>
                    </div>
                </div>
                <button className="relative p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                    <Bell size={20} className="text-gray-400" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
                </button>
            </header>

            <main className="px-6 py-6 space-y-8">
                {/* 2. STATS GRID (The Economy) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* GP Vault */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-4 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ShoppingBag size={48} className="text-neon-cyan" />
                        </div>
                        <div className="text-xs text-gray-400 font-bold tracking-widest mb-1 flex items-center gap-1">
                            <Crown size={12} className="text-yellow-400" /> GP VAULT
                        </div>
                        <div className="text-2xl font-black text-white group-hover:text-neon-cyan transition-colors font-mono">
                            {gp.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-neon-cyan mt-2 flex items-center gap-1">
                            +150 Today <TrendingUp size={10} />
                        </div>
                    </motion.div>

                    {/* Dominance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-4 rounded-2xl border-neon-pink/20"
                    >
                        <div className="text-xs text-gray-400 font-bold tracking-widest mb-1 flex items-center gap-1">
                            <Shield size={12} className="text-neon-pink" /> DOMINANCE
                        </div>
                        <div className="text-2xl font-black text-white">
                            {MOCK_USER.dominance}%
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-neon-pink shadow-[0_0_10px_#FF00FF]"
                                style={{ width: `${MOCK_USER.dominance}%` }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* 3. MAIN ACTION (Race Card) */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] group"
                >
                    {/* Live Mini Map */}
                    <div className="absolute inset-0 bg-gray-900">
                        <DashboardMap />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-red-500/90 text-white text-[10px] font-black rounded tracking-widest animate-pulse">
                            ● LIVE
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                        <div className="flex items-center gap-2 mb-2 text-neon-cyan">
                            <Zap size={16} fill="currentColor" />
                            <span className="text-xs font-bold tracking-widest">5 RIVALS NEARBY</span>
                        </div>
                        <h2 className="text-3xl font-black italic text-white leading-none mb-6">
                            ENTER THE <br />
                            <span className="text-neon-cyan">NEON GRID</span>
                        </h2>

                        <Link href="/race">
                            <button className="w-full py-4 bg-neon-cyan text-black font-black text-lg italic rounded-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_#00FFFF]">
                                START RUNNING
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* 4. SPONSORSHIP (B2B) */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-5 rounded-xl border-l-4 border-l-neon-pink relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
                    onClick={() => setShowSponsor(true)}
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-pink/10 rounded-full blur-xl" />
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">SPONSORED EVENT</span>
                        <span className="px-2 py-0.5 bg-neon-pink/20 text-neon-pink text-[10px] font-bold rounded animate-pulse">{SPONSOR_DATA.bonus}</span>
                    </div>
                    <h3 className="text-xl font-black italic mb-1">{SPONSOR_DATA.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{SPONSOR_DATA.description}</p>
                    <div className="flex items-center gap-1 text-neon-pink text-xs font-bold hover:underline">
                        View Details <ChevronRight size={14} />
                    </div>
                </motion.div>

                {/* 5. TERRITORY LIST */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-300 tracking-widest">MY TERRITORIES</h3>
                        <span className="text-xs text-gray-500">View All</span>
                    </div>
                    {MOCK_USER.territories.map((zone, i) => (
                        <motion.div
                            key={zone.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className={`bg-white/5 border p-4 rounded-lg flex justify-between items-center transition-colors
                                ${zone.status === 'SECURE' ? 'border-white/5' : 'border-neon-pink/50 shadow-[0_0_10px_rgba(255,0,255,0.1)]'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-8 rounded-full ${zone.status === 'SECURE' ? 'bg-neon-cyan' : 'bg-neon-pink'}`} />
                                <div>
                                    <div className="font-bold text-sm">{zone.name}</div>
                                    <div className={`text-[10px] font-bold ${zone.status === 'SECURE' ? 'text-gray-500' : 'text-neon-pink animate-pulse'}`}>
                                        {zone.status}
                                    </div>
                                </div>
                            </div>
                            <MapPin size={16} className={zone.status === 'SECURE' ? 'text-gray-600' : 'text-neon-pink'} />
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* 6. BOTTOM NAVIGATION */}
            <BottomNav />
        </div>
    );
}
