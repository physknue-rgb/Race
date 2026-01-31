'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, AlertTriangle, MapPin } from 'lucide-react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { MOCK_USER } from '@/data/mockData';

export default function ZonePage() {
    return (
        <div className="min-h-screen bg-[#0F172A] text-white pb-24 font-sans select-none">
            <header className="px-6 py-6 sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
                <h1 className="text-2xl font-black italic tracking-tighter">TERRITORY <span className="text-neon-cyan">COMMAND</span></h1>
                <div className="bg-neon-cyan/10 px-3 py-1 rounded border border-neon-cyan/30 text-neon-cyan text-xs font-bold">
                    {MOCK_USER.territories.length} ZONES
                </div>
            </header>

            <main className="px-6 py-6 space-y-4">
                {MOCK_USER.territories.map((zone, i) => {
                    const isUrgent = zone.decay > 50;
                    const isGold = zone.type === 'gold';

                    return (
                        <motion.div
                            key={zone.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-5 rounded-xl border-2 transition-all group overflow-hidden
                                ${isGold ? 'border-yellow-400 bg-yellow-400/5' :
                                    isUrgent ? 'border-neon-pink bg-neon-pink/5' : 'border-neon-cyan/30 bg-white/5'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className={`text-[10px] font-bold tracking-widest mb-1 flex items-center gap-1
                                        ${isGold ? 'text-yellow-400' : isUrgent ? 'text-neon-pink animate-pulse' : 'text-gray-400'}
                                    `}>
                                        {isUrgent ? <AlertTriangle size={12} /> : <Shield size={12} />}
                                        {zone.status}
                                    </div>
                                    <h3 className="text-xl font-black italic">{zone.name}</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 font-bold mb-1">DECAY</div>
                                    <div className={`text-2xl font-black ${isUrgent ? 'text-neon-pink' : 'text-white'}`}>
                                        {zone.decay}%
                                    </div>
                                </div>
                            </div>

                            {/* Threat Bar */}
                            {zone.decay > 0 && (
                                <div className="w-full h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
                                    <div
                                        className={`h-full ${isUrgent ? 'bg-neon-pink' : 'bg-neon-cyan'}`}
                                        style={{ width: `${zone.decay}%` }}
                                    />
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Link href="/race" className="flex-1">
                                    <button className={`w-full py-3 font-black text-sm italic rounded flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all
                                        ${isUrgent
                                            ? 'bg-neon-pink text-white shadow-[0_0_15px_#FF00FF]'
                                            : 'bg-white/10 hover:bg-white/20 text-white'}
                                    `}>
                                        <Zap size={16} fill="currentColor" />
                                        {isUrgent ? 'DEFEND NOW' : 'PATROL'}
                                    </button>
                                </Link>
                                <button className="p-3 bg-black/30 rounded border border-white/10 text-gray-400 hover:text-white">
                                    <MapPin size={18} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </main>

            <BottomNav />
        </div>
    );
}
