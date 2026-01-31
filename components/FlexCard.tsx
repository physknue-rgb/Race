'use client';

import { motion } from 'framer-motion';
import { Share2, Download, Crown, Zap } from 'lucide-react';

interface FlexCardProps {
    stats: {
        distance: string;
        pace: string;
        overtakes: number;
        zoneName: string;
    };
    onClose: () => void;
}

export default function FlexCard({ stats, onClose }: FlexCardProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, rotate: -2, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                className="w-full max-w-sm aspect-[9/16] bg-gradient-to-br from-[#0F172A] to-[#0a0a12] border-2 border-neon-cyan/50 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,255,255,0.2)] flex flex-col"
            >
                {/* Background FX */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-neon-cyan/10 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex-1 p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-neon-cyan shadow-[0_0_20px_#00FFFF] flex items-center justify-center mb-6">
                        <Crown size={40} className="text-white" />
                    </div>

                    <h2 className="text-neon-cyan text-xs font-black tracking-[0.3em] mb-2">MISSION COMPLETE</h2>
                    <h1 className="text-4xl font-black italic text-white leading-none mb-1">LORD OF</h1>
                    <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white mb-8">
                        {stats.zoneName}
                    </h1>

                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <div className="text-[10px] text-gray-400 font-bold mb-1">DISTANCE</div>
                            <div className="text-2xl font-black text-white font-mono">{stats.distance}</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <div className="text-[10px] text-gray-400 font-bold mb-1">RIVALS CRUSHED</div>
                            <div className="text-2xl font-black text-neon-pink font-mono">{stats.overtakes}</div>
                        </div>
                    </div>

                    <div className="mt-auto w-full">
                        <div className="flex gap-2">
                            <button className="flex-1 py-3 bg-neon-cyan text-black font-black italic rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors">
                                <Share2 size={18} /> STORY
                            </button>
                            <button onClick={onClose} className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Brand */}
                <div className="p-4 border-t border-white/5 flex justify-center">
                    <span className="text-[10px] font-black tracking-[0.5em] text-gray-600">LIVE RACE // AGENT REPORT</span>
                </div>
            </motion.div>
        </div>
    );
}
