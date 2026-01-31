'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTerritoryStore } from '@/store/useTerritoryStore';
import { ShieldCheck, XCircle, Coins } from 'lucide-react';

export default function MorningBriefing() {
    const { dailyReport, closeReport } = useTerritoryStore();

    if (!dailyReport?.show) return null;

    const isWin = dailyReport.result === 'WIN';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`w-full max-w-sm rounded-xl border-2 p-6 relative overflow-hidden
                        ${isWin ? 'bg-neon-cyan/10 border-neon-cyan' : 'bg-red-500/10 border-red-500'}
                    `}
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className={`text-xs font-bold tracking-[0.3em] mb-2 ${isWin ? 'text-neon-cyan' : 'text-red-500'}`}>
                            OPERATION REPORT
                        </div>
                        <h2 className="text-4xl font-black italic text-white">
                            {isWin ? 'SECTOR SECURED' : 'SECTOR LOST'}
                        </h2>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        {isWin ? (
                            <div className="relative">
                                <ShieldCheck size={80} className="text-neon-cyan" />
                                <div className="absolute inset-0 bg-neon-cyan blur-2xl opacity-50" />
                            </div>
                        ) : (
                            <div className="relative">
                                <XCircle size={80} className="text-red-500" />
                                <div className="absolute inset-0 bg-red-500 blur-2xl opacity-50" />
                            </div>
                        )}
                    </div>

                    {/* Rewards */}
                    {isWin && (
                        <div className="bg-black/50 rounded-lg p-4 mb-6 flex items-center justify-between border border-white/10">
                            <span className="text-xs text-gray-400 font-bold">TAX COLLECTED</span>
                            <div className="flex items-center gap-2 text-yellow-400 font-black text-xl">
                                <Coins size={20} />
                                {dailyReport.taxCollected} GP
                            </div>
                        </div>
                    )}

                    {!isWin && (
                        <p className="text-center text-gray-400 text-xs mb-6 px-4">
                            Enemy forces have established a foothold.
                            <br />Reclaim the zone before 00:00.
                        </p>
                    )}

                    {/* Action */}
                    <button
                        onClick={closeReport}
                        className={`w-full py-4 rounded-full font-black text-black transition-all hover:scale-105 active:scale-95
                            ${isWin ? 'bg-neon-cyan shadow-[0_0_20px_#00FFFF]' : 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]'}
                        `}
                    >
                        ACKNOWLEDGE
                    </button>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
