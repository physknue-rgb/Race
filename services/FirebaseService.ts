// This is a Service Stub for Firebase Integration
// In a real scenario, you would initialize Firebase App here.

export interface RemoteRunner {
    id: string;
    lat: number;
    lng: number;
    lastUpdated: number;
    name: string;
}

class FirebaseService {
    // Mock "Subscribe to Friends"
    subscribeToRunners(callback: (runners: RemoteRunner[]) => void) {
        console.log("[FIREBASE] Subscribed to active_runners");

        // Mock Data Stream
        const interval = setInterval(() => {
            // Mock other users moving nearby
            const now = Date.now();
            callback([
                { id: 'user_1', name: 'Ghost Alpha', lat: 37.5665 + Math.sin(now / 1000) * 0.001, lng: 126.9780 + Math.cos(now / 1000) * 0.001, lastUpdated: now },
                { id: 'user_2', name: 'Speed Demon', lat: 37.5670, lng: 126.9790, lastUpdated: now }
            ]);
        }, 1000);

        return () => clearInterval(interval);
    }

    // Mock "Update My Position"
    updateMyPosition(userId: string, lat: number, lng: number) {
        // console.log(`[FIREBASE] Syncing: ${userId} -> [${lat}, ${lng}]`);
        // firestore.collection('active_runners').doc(userId).set({ lat, lng, lastUpdated: Date.now() });
    }
}

export const firebaseService = new FirebaseService();
