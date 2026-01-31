'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Users, Trophy, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useSocialStore } from '@/store/useSocialStore';
import { MOCK_LEADERBOARD } from '@/data/mockData';

export default function RankPage() {
    const { friends, addFriend } = useSocialStore();
    const [activeTab, setActiveTab] = useState<'GLOBAL' | 'FRIENDS'>('GLOBAL');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addFriend(searchQuery);
            setSearchQuery('');
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white pb-24 font-sans select-none">
            <header className="px-6 py-6 sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5">
                <h1 className="text-2xl font-black italic tracking-tighter mb-4">LEADERBOARD</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-6">
                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH AGENT CODENAME..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm font-bold tracking-wider focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    />
                    <button type="submit" className="absolute right-2 top-2 bg-neon-cyan/10 p-1 rounded text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors">
                        <UserPlus size={18} />
                    </button>
                </form>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    {['GLOBAL', 'FRIENDS'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 pb-3 text-sm font-black tracking-widest relative ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan shadow-[0_0_10px_#00FFFF]" />}
                        </button>
                    ))}
                </div>
            </header>

            <main className="px-6 py-4 space-y-2">
                <AnimatePresence mode="wait">
                    {activeTab === 'GLOBAL' ? (
                        <motion.div
                            key="global"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {MOCK_LEADERBOARD.map((user, i) => (
                                <div key={i} className={`flex items-center p-4 rounded-lg border ${user.tier === 'DIAMOND' ? 'bg-cyan-900/10 border-cyan-500/30' : 'bg-white/5 border-white/5'}`}>
                                    <div className="w-8 font-black text-gray-500 italic">#{user.rank}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-white">{user.name}</div>
                                        <div className="text-[10px] font-bold text-gray-400">{user.tier} CLASS</div>
                                    </div>
                                    <div className="text-neon-cyan font-mono font-bold">{user.score.toLocaleString()}</div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-3"
                        >
                            {friends.map((friend) => (
                                <div key={friend.id} className="flex items-center p-4 rounded-lg bg-white/5 border border-white/5">
                                    <div className="relative mr-4">
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-400">
                                            {friend.name[0]}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0F172A] ${friend.status === 'RUNNING_NOW' ? 'bg-neon-cyan animate-pulse' : 'bg-gray-500'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-white">{friend.name}</div>
                                        <div className={`text-[10px] font-bold ${friend.status === 'RUNNING_NOW' ? 'text-neon-cyan' : 'text-gray-500'}`}>
                                            {friend.status === 'RUNNING_NOW' ? 'LIVE NOW' : `Last seen ${friend.lastSeen}`}
                                        </div>
                                    </div>
                                    <Link href="/race">
                                        <button
                                            onClick={() => alert(`Ghost Data for ${friend.name} loaded! Starting Simulation...`)}
                                            className="px-3 py-1 bg-neon-pink/10 border border-neon-pink text-neon-pink text-[10px] font-bold rounded hover:bg-neon-pink hover:text-white transition-colors"
                                        >
                                            RACE GHOST
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <BottomNav />
        </div>
    );
}
