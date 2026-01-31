'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Zap, ShieldAlert, Award } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';
import Link from 'next/link';

// Lazy Load Map (SSR Disable)
const TacticalMap = dynamic(() => import('@/components/TacticalMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-neon-navy animate-pulse" />
});

import { useRaceStore } from '@/store/useRaceStore';

export default function RacePage() {
    // Store Connection
    const {
        isPlaying, rivalGap, userSpeed, distance, isUnderAttack,
        startGame, stopGame, tick, enableRealGPS
    } = useRaceStore();

    const { playEvent, setLanguage } = useAudioStore();

    useEffect(() => {
        let interval: NodeJS.Timeout | number | undefined;

        // Init Game & Ask for GPS
        if (confirm("ENABLE GPS TRACKING? Click OK for Real Mode, Cancel for Simulation.")) {
            enableRealGPS();
            startGame();
            playEvent('RACE_START', { rival: 'LIVE OPPONENTS' });
        } else {
            startGame();
            playEvent('RACE_START', { rival: 'GHOST_ALPHA' });
            // Fallback to Simulation Loop
            interval = setInterval(() => {
                tick(0.1); // 100ms delta
            }, 100);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            stopGame();
        };
    }, []);


    // Reactive Audio Triggers
    useEffect(() => {
        if (isUnderAttack) {
            playEvent('OVERTAKE_WARNING');
        }
        if (useRaceStore.getState().justBreached) {
            playEvent('ZONE_BREACHED');
        }
    }, [isUnderAttack, playEvent, useRaceStore.getState().justBreached]); // Added playEvent to dependency array for completeness

    // Format Distance
    const distKm = (distance / 1000).toFixed(2);

    return (
        <div className="relative w-full h-[100dvh] bg-black overflow-hidden select-none flex flex-col">
            {/* 1. Underlying Map (Flex Grow) */}
            <div className="flex-1 relative z-0">
                <TacticalMap />
            </div>

            {/* 2. Commercial HUD Overlay (Safe Area Layers) */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">

                {/* Top HUD (Safe Area Top) */}
                <div className="pt-[calc(1rem+env(safe-area-inset-top))] px-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
                    <div className="flex justify-between items-start">
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="glass-panel px-4 py-2 rounded-full border-neon-cyan/50 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold tracking-widest text-white">LIVE FEED</span>
                            </div>
                            <div className="glass-panel px-4 py-2 rounded-full border-white/10 flex items-center gap-2">
                                <Award size={14} className="text-yellow-400" />
                                <span className="text-xs font-mono font-bold">TOP 5%</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/10 backdrop-blur-md px-6 py-2 rounded skew-x-[-12deg] border-b-2 border-neon-pink"
                        >
                            <span className="text-xs text-gray-400 block skew-x-[12deg] text-center tracking-widest font-bold">SPONSORED ZONE</span>
                            <div className="text-xl font-black italic skew-x-[12deg] text-white tracking-tighter">NIKE <span className="text-neon-pink">SPEED LAB</span></div>
                        </motion.div>
                    </div>
                </div>

                {/* Center: Dynamic Alerts */}
                <div className="absolute top-1/4 left-0 right-0 flex justify-center pointer-events-none">
                    <AnimatePresence>
                        {isUnderAttack && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-red-500/80 backdrop-blur text-white px-8 py-4 rounded-lg transform skew-x-[-6deg] border border-red-400 shadow-[0_0_30px_rgba(255,0,0,0.5)]"
                                key="alert"
                            >
                                <div className="flex items-center gap-3 skew-x-[6deg]">
                                    <ShieldAlert size={32} className="animate-bounce" />
                                    <div>
                                        <div className="text-xs font-bold tracking-widest text-red-100">CAUTION</div>
                                        <div className="text-2xl font-black italic">RIVAL OVERTAKING</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom HUD (Above BottomNav + Safe Area) */}
                <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] px-6 pointer-events-auto flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex flex-col gap-2">
                        <div className="text-6xl font-black italic text-white leading-none flex items-baseline gap-2">
                            {distKm}
                            <span className="text-lg text-neon-cyan font-bold not-italic">KM</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Zap size={16} className="text-yellow-400" />
                            <span className="text-sm font-mono tracking-widest">PACE: 4'28" / KM</span>
                        </div>
                        <div className="text-xs font-bold text-gray-500 mt-1">
                            GHOST GAP: <span className={rivalGap < 0 ? "text-neon-pink" : "text-neon-cyan"}>{rivalGap.toFixed(1)}m</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        {/* Navigation Guide */}
                        <div className="bg-black/80 border border-white/10 p-3 rounded-lg text-right backdrop-blur shadow-lg">
                            <div className="text-[9px] text-gray-400 font-bold tracking-widest mb-1">NEXT GOAL</div>
                            <div className="flex items-center justify-end gap-2 text-neon-cyan">
                                <span className="text-lg font-black italic">
                                    {Math.round(Math.sqrt(Math.pow((37.5680 - useRaceStore.getState().userPos.lat) * 111000, 2) + Math.pow((126.9805 - useRaceStore.getState().userPos.lng) * 88000, 2)))}m
                                </span>
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-b-[10px] border-b-neon-cyan border-r-[6px] border-r-transparent transform rotate-45" />
                            </div>
                            <div className="text-[10px] font-bold text-white">NIKE SPEED LAB</div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 items-center">
                            <Link href="/dashboard">
                                <button className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400 hover:bg-red-500 hover:text-black font-bold mr-2">STOP</button>
                            </Link>
                            <button onClick={() => setLanguage('EN')} className="px-3 py-1 bg-black/50 border border-white/20 rounded text-xs text-gray-400 hover:text-white hover:border-neon-cyan">EN</button>
                            <button onClick={() => setLanguage('KR')} className="px-3 py-1 bg-black/50 border border-white/20 rounded text-xs text-gray-400 hover:text-white hover:border-neon-pink">KR</button>
                        </div>

                        {/* Play Button */}
                        <button
                            className="w-20 h-20 rounded-full bg-neon-cyan text-black flex items-center justify-center shadow-[0_0_30px_#00FFFF] hover:scale-105 active:scale-95 transition-transform"
                            onClick={() => isPlaying ? stopGame() : startGame()}
                        >
                            {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" />}
                        </button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
