import { create } from 'zustand';
import { auth, googleProvider, appleProvider, signInWithPopup, firebaseSignOut, db } from '@/services/FirebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    nickname?: string;
    team?: 'NEON' | 'ROSE';
    playerClass?: 'HACKER' | 'GUARDIAN' | 'GHOST' | 'SCOUTER';
    // Social & Privacy
    crewId?: string;
    crewName?: string;
    privacySettings: {
        ghostMode: boolean; // Hide from public
        allowSearch: boolean; // Allow ID search
        safeZoneRadius: number; // 0, 100m, 500m (Hide at Home/Office)
    };
    onboardingComplete: boolean;
}

const DEFAULT_PRIVACY = {
    ghostMode: false,
    allowSearch: true,
    safeZoneRadius: 0
};

interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loginWithGoogle: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    handleLoginSuccess: (user: any) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => void;
    updateProfile: (nickname: string, team: 'NEON' | 'ROSE') => Promise<void>;

    // New Actions
    toggleGhostMode: () => Promise<void>;
    createCrew: (crewName: string) => Promise<string>; // Returns Code
    joinCrew: (crewCode: string) => Promise<void>;
    selectClass: (role: 'HACKER' | 'GUARDIAN' | 'GHOST' | 'SCOUTER') => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    error: null,

    checkSession: () => {
        set({ isLoading: true });
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch extra profile data from Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                let profileData: Partial<UserProfile> = { onboardingComplete: false };

                if (userDoc.exists()) {
                    profileData = userDoc.data() as Partial<UserProfile>;
                }

                set({
                    user: {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        nickname: profileData.nickname,
                        team: profileData.team,
                        crewId: profileData.crewId,
                        crewName: profileData.crewName,
                        privacySettings: profileData.privacySettings || DEFAULT_PRIVACY,
                        onboardingComplete: !!profileData.onboardingComplete
                    },
                    isLoading: false
                });
            } else {
                set({ user: null, isLoading: false });
            }
        });
    },

    loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await get().handleLoginSuccess(result.user);
        } catch (error: any) {
            console.error("Google Login Failed", error);
            set({ error: error.message, isLoading: false });
        }
    },

    loginWithApple: async () => {
        set({ isLoading: true, error: null });
        try {
            const result = await signInWithPopup(auth, appleProvider);
            await get().handleLoginSuccess(result.user);
        } catch (error: any) {
            console.error("Apple Login Failed", error);
            set({ error: error.message, isLoading: false });
        }
    },

    handleLoginSuccess: async (user: User) => {
        // Check if user exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // First time user
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                onboardingComplete: false,
                createdAt: Date.now()
            });
        }
        set({ isLoading: false });
    },

    logout: async () => {
        await firebaseSignOut(auth);
        set({ user: null });
    },

    updateProfile: async (nickname, team) => {
        const { user } = get();
        if (!user) return;

        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                nickname,
                team,
                onboardingComplete: true
            }, { merge: true });

            set({
                user: { ...user, nickname, team, onboardingComplete: true }
            });
        } catch (error: any) {
            console.error("Update Profile Failed", error);
            set({ error: error.message });
        }
        set({
            user: { ...user, nickname, team, onboardingComplete: true }
        });
    } catch(error: any) {
        console.error("Update Profile Failed", error);
        set({ error: error.message });
    }
},

    toggleGhostMode: async () => {
        const { user } = get();
        if (!user) return;

        const newMode = !user.privacySettings?.ghostMode;

        // Optimistic Update
        const updatedUser = {
            ...user,
            privacySettings: {
                ...user.privacySettings || DEFAULT_PRIVACY,
                ghostMode: newMode
            }
        };

        set({ user: updatedUser });

        // Sync
        try {
            await setDoc(doc(db, 'users', user.uid), {
                privacySettings: { ghostMode: newMode }
            }, { merge: true });
        } catch (e) {
            console.error("Privacy Sync Failed", e);
        }
    },

    createCrew: async (crewName: string) => {
        // Mock Implementation for Prototype
        const { user } = get();
        if (!user) return "ERROR";

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        set({
            user: { ...user, crewId: code, crewName: crewName }
        });

        await setDoc(doc(db, 'users', user.uid), {
            crewId: code,
            crewName: crewName
        }, { merge: true });

        return code;
    },

    joinCrew: async (code: string) => {
        const { user } = get();
        if (!user) return;

        // In real app, check if crew exists. Mock: Just join.
        const mockName = "Crew " + code;

        set({
            user: { ...user, crewId: code, crewName: mockName }
        });

        await setDoc(doc(db, 'users', user.uid), {
            crewId: code,
            crewName: mockName
        }, { merge: true });
    }
}));
