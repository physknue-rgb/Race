'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Zap, ShieldCheck, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { user, loginWithGoogle, checkSession, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.onboardingComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/20 blur-[120px] rounded-full z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-pink/20 blur-[120px] rounded-full z-0"></div>

      <div className="z-10 flex flex-col items-center text-center p-6 w-full max-w-lg">

        {/* Logo & Headline */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <h2 className="text-neon-cyan text-sm font-bold tracking-[0.5em] mb-2 animate-pulse">SYSTEM ONLINE</h2>
          <h1 className="text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
            LIVE<br />RACE
          </h1>
        </motion.div>

        {/* Features (Mobile Cards) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 gap-4 w-full mb-12"
        >
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan">
              <Gamepad2 size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-sm">Real-world RPG</h3>
              <p className="text-gray-400 text-xs">Run your city, conquer territories.</p>
            </div>
          </div>
        </motion.div>

        {/* Login Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => loginWithGoogle()}
          disabled={isLoading}
          className="w-full bg-white text-black font-black text-lg py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />

          {isLoading ? (
            <span>SYSTEM SYNCING...</span>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              START WITH GOOGLE
            </>
          )}
        </motion.button>

        <p className="mt-6 text-xs text-gray-500 font-mono">
          SECURE CONNECTION ENCRYPTED <ShieldCheck size={12} className="inline ml-1" />
        </p>
      </div>
    </div>
  );
}
