import { create } from 'zustand';
import { db } from '@/services/FirebaseService';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface TerritoryState {
    // Zone Data
    zoneId: string;
    ownerFaction: 'NEON' | 'ROSE' | null; // Yesterday's Winner (Base Color)
    leadingFaction: 'NEON' | 'ROSE' | null; // Today's Leader
    zoneLevel: 1 | 2 | 3;
    dominanceScore: {
        NEON: number;
        ROSE: number;
    };

    // Cycle Status
    cycleEndTime: number; // Next Midnight Timestamp
    isOvertime: boolean; // 23:00 - 24:00

    // User Status
    dailyReport: {
        show: boolean;
        result: 'WIN' | 'LOSS' | 'DRAW';
        taxCollected?: number;
    } | null;

    // Actions
    addScore: (faction: 'NEON' | 'ROSE', amount: number) => void;
    checkTime: () => void;
    closeReport: () => void;
    simulateMidnightReset: () => void; // Debug
}

export const useTerritoryStore = create<TerritoryState>((set, get) => ({
    zoneId: 'ZONE_01_SEOUL_HALL',
    ownerFaction: 'ROSE', // Example: Rose won yesterday
    leadingFaction: 'NEON', // Example: Neon is winning today
    zoneLevel: 1,
    dominanceScore: {
        NEON: 4500,
        ROSE: 3200
    },

    cycleEndTime: new Date().setHours(24, 0, 0, 0), // Next midnight
    isOvertime: false,

    dailyReport: {
        show: true, // Show on app start (Mock)
        result: 'WIN',
        taxCollected: 1540
    },

    addScore: (faction, amount) => {
        const s = get();
        const newScore = {
            ...s.dominanceScore,
            [faction]: s.dominanceScore[faction] + amount
        };

        // Determine Leader
        let leader: 'NEON' | 'ROSE' | null = null;
        if (newScore.NEON > newScore.ROSE) leader = 'NEON';
        else if (newScore.ROSE > newScore.NEON) leader = 'ROSE';

        set({
            dominanceScore: newScore,
            leadingFaction: leader
        });
    },

    checkTime: () => {
        const now = new Date();
        const hour = now.getHours();
        const isOvertime = hour === 23;

        // Update Overtime Status
        if (get().isOvertime !== isOvertime) {
            set({ isOvertime });
        }
    },

    closeReport: () => set({ dailyReport: null }),

    simulateMidnightReset: () => {
        const s = get();
        // Determine Winner
        const winner = s.dominanceScore.NEON > s.dominanceScore.ROSE ? 'NEON' : 'ROSE';

        // Reset
        set({
            ownerFaction: winner,
            leadingFaction: null,
            dominanceScore: { NEON: 0, ROSE: 0 },
            cycleEndTime: new Date().setHours(24, 0, 0, 0) + 86400000, // +24h
            dailyReport: {
                show: true,
                result: winner === 'NEON' ? 'WIN' : 'LOSS', // Assuming user is NEON for demo
                taxCollected: winner === 'NEON' ? Math.floor(Math.random() * 2000) : 0
            }
        });
    }
}));
