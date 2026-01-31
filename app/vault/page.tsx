'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Gift, Wallet, Package } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { MOCK_INVENTORY } from '@/data/mockData';

export default function VaultPage() {
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#0F172A] text-white pb-24 font-sans select-none relative">

            {/* QR POPUP */}
            <AnimatePresence>
                {selectedCoupon && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedCoupon(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white text-black w-full max-w-sm rounded-3xl overflow-hidden p-8 text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-black italic mb-2 tracking-tighter">{selectedCoupon.Brand}</h2>
                            <p className="text-gray-500 text-sm font-bold mb-8">{selectedCoupon.name}</p>

                            <div className="w-48 h-48 bg-black mx-auto mb-8 rounded-xl flex items-center justify-center">
                                <QrCode size={120} className="text-white" />
                            </div>

                            <div className="text-xs text-gray-400 font-mono mb-6">SCAN AT COUNTER • EXPIRES {selectedCoupon.expires}</div>

                            <button
                                onClick={() => setSelectedCoupon(null)}
                                className="w-full py-4 bg-black text-white font-black italic rounded-xl hover:bg-gray-800"
                            >
                                CLOSE WALLET
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="px-6 py-6 sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5">
                <h1 className="text-2xl font-black italic tracking-tighter">DIGITAL <span className="text-neon-pink">VAULT</span></h1>
            </header>

            <main className="px-6 py-6 space-y-8">
                {/* 1. Currencies */}
                <section>
                    <h2 className="text-xs font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                        <Wallet size={14} /> ASSETS
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {MOCK_INVENTORY.currencies.map((curr, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl">
                                <div className="text-2xl font-black mb-1 font-mono">{curr.amount.toLocaleString()}</div>
                                <div className="text-[10px] font-bold text-gray-400">{curr.name.toUpperCase()}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Coupons */}
                <section>
                    <h2 className="text-xs font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                        <Gift size={14} /> ACTIVE COUPONS
                    </h2>
                    <div className="space-y-3">
                        {MOCK_INVENTORY.coupons.map((coupon, i) => (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCoupon(coupon)}
                                className="w-full bg-gradient-to-r from-neon-pink/10 to-transparent border border-neon-pink/30 p-4 rounded-xl flex justify-between items-center group hover:bg-neon-pink/20 transition-colors"
                            >
                                <div className="text-left">
                                    <div className="font-black italic text-lg">{coupon.name}</div>
                                    <div className="text-[10px] font-bold text-neon-pink flex items-center gap-1">
                                        TAP TO REDEEM <QrCode size={10} />
                                    </div>
                                </div>
                                <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                    <QrCode size={24} className="text-neon-pink" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* 3. Items */}
                <section>
                    <h2 className="text-xs font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                        <Package size={14} /> GEAR & SKINS
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {MOCK_INVENTORY.items.map((item, i) => (
                            <div key={i} className="aspect-square bg-white/5 border border-white/5 rounded-xl flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
                                <div className={`absolute inset-0 opacity-10 ${item.rarity === 'EPIC' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                                <div className="relative z-10">
                                    <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${item.rarity === 'EPIC' ? 'bg-purple-500 shadow-[0_0_10px_#A855F7]' : 'bg-blue-500'}`} />
                                    <div className="text-[10px] font-bold leading-tight">{item.name}</div>
                                </div>
                            </div>
                        ))}
                        {/* Empty Slots */}
                        {[1, 2, 3].map(i => (
                            <div key={`e_${i}`} className="aspect-square bg-black/20 border border-white/5 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white/5">+</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
}
