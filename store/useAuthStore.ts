import { create } from 'zustand';
import { auth, googleProvider, signInWithPopup, firebaseSignOut, db } from '@/services/FirebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    nickname?: string;
    team?: 'NEON' | 'ROSE';
    onboardingComplete: boolean;
}

interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => void;
    updateProfile: (nickname: string, team: 'NEON' | 'ROSE') => Promise<void>;
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
            const user = result.user;

            // Check if user exists in Firestore
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // First time user, save basic info but mark onboarding incomplete
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    onboardingComplete: false,
                    createdAt: Date.now()
                });
            } else {
                const data = userSnap.data();
                // Check if already completed onboarding
                if (data.onboardingComplete) {
                    // Will be updated by onAuthStateChanged listener usually, but we can optimistically set?
                    // Relying on listener for now.
                }
            }

        } catch (error: any) {
            console.error("Login Failed", error);
            set({ error: error.message, isLoading: false });
        }
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
    }
}));
