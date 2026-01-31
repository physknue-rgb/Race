'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Shield, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-neon-navy text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-cyan/20 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-pink/20 blur-[120px] rounded-full mix-blend-screen" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 glass-panel border-b-0 border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neon-cyan rounded-sm shadow-[0_0_10px_#00FFFF]" />
          <span className="text-2xl font-black tracking-tighter italic">LIVE RACE</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-bold tracking-widest text-gray-400">
          <span className="hover:text-neon-cyan cursor-pointer transition-colors">LEADERBOARD</span>
          <span className="hover:text-neon-pink cursor-pointer transition-colors">SPONSORS</span>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <Globe size={14} />
            <span className="text-white">EN / KR</span>
          </div>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-neon-pink text-black font-black italic -skew-x-6 hover:scale-105 transition-transform">
              LOGIN
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan text-xs font-bold tracking-[0.2em] rounded">BETA ACCESS</span>
            <span className="text-gray-400 text-xs tracking-widest flex items-center gap-1"><Shield size={12} /> SECURE LOCATION CORE</span>
          </div>

          <h1 className="text-8xl font-black tracking-tighter leading-[0.9] mb-8 italic">
            OWN YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white neon-text-cyan">STREETS.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-xl mb-12 leading-relaxed">
            The world is your track. Compete in real-time territory battles, unlock sponsored gear, and become a legend in your neighborhood.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="group relative px-8 py-4 bg-neon-cyan text-black font-black text-lg italic tracking-wider -skew-x-6 hover:bg-white transition-colors overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  START RUNNING <Play fill="black" size={16} />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </Link>

            <div className="flex items-center gap-2 px-6 py-4 glass-panel rounded -skew-x-6 cursor-pointer hover:border-neon-pink/50 transition-colors">
              <Lock size={18} className="text-neon-pink" />
              <span className="font-bold text-sm tracking-widest">VAULT: 0 GP</span>
            </div>
          </div>
        </motion.div>

        {/* HUD Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute top-20 right-0 w-[500px] aspect-[9/16] glass-panel border-neon-cyan/30 rounded-3xl p-4 overflow-hidden hidden xl:block"
        >
          <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
            {/* Fake Map */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-neon-cyan rounded-full animate-ping" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_#00FFFF]" />
            </div>
            {/* HUD Elements */}
            <div className="absolute top-8 left-0 right-0 flex justify-center">
              <div className="px-4 py-2 bg-black/80 border border-neon-pink/50 rounded-full flex items-center gap-3">
                <span className="text-neon-pink font-bold text-xs">RIVAL NEARBY</span>
                <span className="text-white font-mono font-bold">120m</span>
              </div>
            </div>
            <div className="absolute bottom-8 left-6">
              <div className="text-4xl font-black italic text-white flex items-baseline gap-1">
                4<span className="text-lg text-gray-400">’</span>28<span className="text-lg text-gray-400">”</span>
              </div>
              <div className="text-xs text-neon-cyan font-bold tracking-widest">CURRENT PACE</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer / Ticker */}
      <footer className="fixed bottom-0 left-0 w-full glass-panel border-t border-white/5 py-3">
        <div className="flex gap-12 whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-2 text-xs font-mono text-neon-cyan/50">
              <TrendingUp size={12} />
              <span>USER_882 JUST CAPTURED [APEX_ZONE_0{i}]</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
