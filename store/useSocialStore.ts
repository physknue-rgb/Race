import { create } from 'zustand';
import { MOCK_FRIENDS } from '@/data/mockData';

interface Friend {
    id: string;
    name: string;
    level: number;
    status: string;
    lastSeen: string;
}

interface SocialState {
    friends: Friend[];
    pendingRequests: string[];
    addFriend: (name: string) => void;
    removeFriend: (id: string) => void;
}

export const useSocialStore = create<SocialState>((set) => ({
    friends: MOCK_FRIENDS,
    pendingRequests: [],

    addFriend: (name) => set((state) => ({
        // Simulate adding a dummy friend instantly for feedback
        friends: [
            { id: `new_${Date.now()}`, name: name, level: 1, status: 'PENDING', lastSeen: 'Now' },
            ...state.friends
        ]
    })),

    removeFriend: (id) => set((state) => ({
        friends: state.friends.filter(f => f.id !== id)
    }))
}));
