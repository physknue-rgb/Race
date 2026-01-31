'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
    const { user, updateProfile } = useAuthStore();
    const router = useRouter();

    const [nickname, setNickname] = useState('');
    const [team, setTeam] = useState<'NEON' | 'ROSE' | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Route Guard
    useEffect(() => {
        if (!user && !submitting) {
            // In real app, might want to wait for "isLoading" to finish before redirecting
        }
    }, [user, submitting]);

    const handleSubmit = async () => {
        if (!nickname || !team) return;
        setSubmitting(true);
        await updateProfile(nickname, team);
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white mb-2">
                    IDENTITY UPLOAD
                </h1>
                <p className="text-gray-400 text-sm mb-8">Establish your runner signature.</p>

                {/* Nickname Input */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-neon-cyan tracking-widest mb-2 block">AGENT CODENAME</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value.toUpperCase())}
                        placeholder="ENTER NICKNAME"
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white font-bold tracking-wider focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                    />
                </div>

                {/* Team Selection */}
                <div className="mb-10">
                    <label className="text-xs font-bold text-neon-pink tracking-widest mb-4 block">SELECT FACTION</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTeam('NEON')}
                            className={`p-6 rounded-xl border-2 transition-all relative overflow-hidden group
                                ${team === 'NEON' ? 'border-neon-cyan bg-neon-cyan/20 shadow-[0_0_20px_#00FFFF]' : 'border-white/10 bg-white/5 hover:border-white/30'}
                            `}
                        >
                            <div className="text-neon-cyan font-black italic text-xl">NEON</div>
                            <div className="text-[10px] text-gray-400 mt-1">Cyber-Speed Specialists</div>
                        </button>

                        <button
                            onClick={() => setTeam('ROSE')}
                            className={`p-6 rounded-xl border-2 transition-all relative overflow-hidden group
                                ${team === 'ROSE' ? 'border-neon-pink bg-neon-pink/20 shadow-[0_0_20px_#FF00FF]' : 'border-white/10 bg-white/5 hover:border-white/30'}
                            `}
                        >
                            <div className="text-neon-pink font-black italic text-xl">ROSE</div>
                            <div className="text-[10px] text-gray-400 mt-1">Underground Rebels</div>
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!nickname || !team || submitting}
                    className={`w-full py-4 rounded-full font-black text-lg transition-all
                        ${(!nickname || !team) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-neon-cyan hover:text-white'}
                    `}
                >
                    {submitting ? "INITIALIZING..." : "ENTER THE GRID"}
                </button>
            </div>
        </div>
    );
}
