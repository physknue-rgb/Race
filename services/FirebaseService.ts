import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

// Types
export interface RemoteRunner {
    id: string;
    lat: number;
    lng: number;
    lastUpdated: number;
    name: string;
}

// 1. Config using Env Vars
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// 2. Initialize (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { db, auth, googleProvider, appleProvider, signInWithPopup, firebaseSignOut };

class FirebaseService {
    isConfigured() {
        return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    }

    // Real: Subscribe to 'active_runners' collection
    subscribeToRunners(callback: (runners: RemoteRunner[]) => void) {
        if (!this.isConfigured()) {
            console.warn("[FIREBASE] Missing Env Vars. Falling back to Mock.");
            return this.mockSubscribe(callback);
        }

        console.log("[FIREBASE] Subscribing to Cloud Firestore...");

        // Query active runners
        const q = query(collection(db, "active_runners"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const runners: RemoteRunner[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Basic validation
                if (data.lat && data.lng) {
                    runners.push({
                        id: doc.id,
                        lat: data.lat,
                        lng: data.lng,
                        // Timestamp handling compatibility
                        lastUpdated: data.lastUpdated?.toMillis ? data.lastUpdated.toMillis() : Date.now(),
                        name: data.name || 'Unknown Agent'
                    });
                }
            });
            callback(runners);
        }, (error) => {
            console.error("[FIREBASE] Subscribe Error:", error);
        });

        return unsubscribe;
    }

    // Real: Write to Firestore
    async updateMyPosition(userId: string, lat: number, lng: number) {
        if (!this.isConfigured()) return;

        try {
            // Use specific ID if provided, or 'user_local' for MVP demo
            // In a real app with Auth, this would be user.uid
            const finalId = userId === 'CURRENT_USER' ? 'user_' + Math.floor(Math.random() * 1000) : userId;

            const userRef = doc(db, "active_runners", finalId);
            await setDoc(userRef, {
                id: finalId,
                lat,
                lng,
                lastUpdated: Timestamp.now(),
                name: 'Agent ' + finalId.slice(-4)
            }, { merge: true });
        } catch (e) {
            console.error("[FIREBASE] Sync Error:", e);
        }
    }

    // --- FALLBACK MOCK (If env vars missing) ---
    private mockSubscribe(callback: (runners: RemoteRunner[]) => void) {
        const interval = setInterval(() => {
            const now = Date.now();
            callback([
                { id: 'mock_1', name: 'Ghost Alpha [MOCK]', lat: 37.5665 + Math.sin(now / 1000) * 0.001, lng: 126.9780 + Math.cos(now / 1000) * 0.001, lastUpdated: now },
                { id: 'mock_2', name: 'Speed Demon [MOCK]', lat: 37.5670, lng: 126.9785, lastUpdated: now }
            ]);
        }, 1000);
        return () => clearInterval(interval);
    }
}

export const firebaseService = new FirebaseService();
