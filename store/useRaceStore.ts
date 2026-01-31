import { create } from 'zustand';
import { locationService } from '@/services/LocationService';
import { firebaseService, RemoteRunner } from '@/services/FirebaseService';

interface Coordinate {
    lat: number;
    lng: number;
}

interface RaceState {
    isPlaying: boolean;
    isRealMode: boolean;

    // Positions
    userPos: Coordinate;
    ghostPos: Coordinate;
    activeRunners: RemoteRunner[];

    // Physics
    userSpeed: number; // m/s
    ghostSpeed: number; // m/s
    distance: number; // Total distance ran (m)
    rivalGap: number; // meters (Positive = User ahead, Negative = Ghost ahead)

    // Navigation
    pathHistory: Coordinate[];
    inZone: boolean;
    justBreached: boolean;

    // Status
    isUnderAttack: boolean; // Ghost is very close (< 10m)
    lastAudioEvent: number; // Timestamp

    // Actions
    startGame: () => void;
    stopGame: () => void;
    moveTo: (target: Coordinate) => void;
    tick: (dt: number) => void; // Main Loop

    // Real GPS Actions
    enableRealGPS: () => void;
    updateRealPosition: (lat: number, lng: number, speed: number | null) => void;
    syncRemoteRunners: (runners: RemoteRunner[]) => void;

    // Conquest State
    hackingProgress: number;
    isHacking: boolean;
    zoneLevel: 1 | 2 | 3;
}

// Helper: Calculate distance between coords (Haversine approx for short dist)
const getDistMeters = (c1: Coordinate, c2: Coordinate) => {
    const R = 6371e3; // Earth radius
    const φ1 = c1.lat * Math.PI / 180;
    const φ2 = c2.lat * Math.PI / 180;
    const Δφ = (c2.lat - c1.lat) * Math.PI / 180;
    const Δλ = (c2.lng - c1.lng) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Interpolate
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

export const useRaceStore = create<RaceState>((set, get) => ({
    isPlaying: false,
    userPos: { lat: 37.5665, lng: 126.9780 }, // Start: Seoul City Hall
    ghostPos: { lat: 37.5655, lng: 126.9770 }, // Start: Slightly behind

    userSpeed: 0,
    ghostSpeed: 4.5, // Base speed (~16km/h)
    distance: 0,
    rivalGap: 150,

    pathHistory: [],
    inZone: false,
    justBreached: false,

    isUnderAttack: false,
    lastAudioEvent: 0,

    // Real Mode Params
    isRealMode: false,
    activeRunners: [],

    // Conquest Init
    hackingProgress: 0,
    isHacking: false,
    zoneLevel: 1,

    startGame: () => set({ isPlaying: true }),
    stopGame: () => {
        set({ isPlaying: false, userSpeed: 0, isHacking: false, hackingProgress: 0 });
        locationService.stopTracking();
    },

    // Real GPS Actions
    enableRealGPS: () => {
        set({ isRealMode: true });
        locationService.startTracking(
            (pos) => get().updateRealPosition(pos.lat, pos.lng, pos.speed),
            (err) => console.error("GPS Error:", err)
        );

        // Start Firebase Sync
        firebaseService.subscribeToRunners((runners) => {
            get().syncRemoteRunners(runners);
        });
    },

    updateRealPosition: (lat, lng, speed) => {
        const s = get();
        const newPos = { lat, lng };
        const newPath = [...s.pathHistory, newPos];

        // 4. Sync to Cloud
        firebaseService.updateMyPosition('CURRENT_USER', lat, lng);

        set({
            userPos: newPos,
            // If GPS speed is null (often on web), simulate or keep previous
            userSpeed: speed !== null ? speed : s.userSpeed,
            pathHistory: newPath
        });
    },

    syncRemoteRunners: (runners) => {
        set({ activeRunners: runners });
    },

    moveTo: (target) => {
        // "Click to Move" simulation: User starts moving towards target
        // For prototype simplicity, we just TELEPORT smoothly or set velocity vector
        // Let's implement a simple "Move user towards target" in tick, 
        // but for now, we'll just update position instantly for "Jump" effect or set a "targetPos"
        // actually, let's just slide the user for 1 second.

        // Simulating: "User is running to this point"
        // We will just snap for MVP instant gratification or interpolate in tick?
        // Let's sets State to move in tick. 
        // For MVP: Update Position immediately but smoother in Tick is better.
        // Let's just update Position for now to test Map Reactivity.
        set({ userPos: target, userSpeed: 5.0 }); // User sprints!
    },

    tick: (dt) => {
        const s = get();
        if (!s.isPlaying) return;

        // SKIP tick logic if using Real GPS (let GPS drive updates), 
        // OR mix them? For now, if Real Mode, we ONLY update Ghost logic here.
        // User movement is handled by updateRealPosition.

        // 1. DDA Logic: Ghost matches User Speed ± variance
        // V_ghost = V_user * (1 ± 0.05)
        // If user stops, ghost shouldn't stop completely, but slow down or catch up?
        // "Always keep tension": If Gap > 50m, Ghost speeds up. If Gap < -20m, Ghost slows down.

        // Base DDA
        let targetGhostSpeed = Math.max(3, s.userSpeed * 1.05); // Ghost tries to be 5% faster

        // Rubber banding
        if (s.rivalGap > 50) targetGhostSpeed *= 1.2; // Catch up fast
        if (s.rivalGap < -10) targetGhostSpeed *= 0.8; // Wait for user

        // Smooth speed transition
        const newGhostSpeed = lerp(s.ghostSpeed, targetGhostSpeed, 0.1);

        // 2. Update Ghost Position
        // Move ghost towards user (Simple seeking behavior)
        const dLat = s.userPos.lat - s.ghostPos.lat;
        const dLng = s.userPos.lng - s.ghostPos.lng;
        const dist = getDistMeters(s.userPos, s.ghostPos);

        let newGhostPos = s.ghostPos;
        if (dist > 1) { // Don't jitter if on top
            const moveDist = newGhostSpeed * dt; // Distance to move this tick
            const ratio = moveDist / dist;
            newGhostPos = {
                lat: s.ghostPos.lat + dLat * ratio,
                lng: s.ghostPos.lng + dLng * ratio
            };
        }

        // 3. User Speed Decay (Simulate stamina if not clicking)
        // Only decay in Simulation Mode
        const newUserSpeed = s.isRealMode ? s.userSpeed : Math.max(0, s.userSpeed * 0.98);

        // --- THE GUARDRAILS: ANTI-CHEAT ---
        // 25km/h ~= 6.94 m/s. We allow bursts up to 8m/s but sustain flags it.
        // For simulation, we just check absolute speed.
        if (newUserSpeed > 8.0) {
            console.warn("SPEED WARNING: VEHICLE DETECTED");
        }

        // 5. Update Path History (Breadcrumbs)
        // Only add if moved significantly to save memory/render
        // In Real Mode, this is handled by updateRealPosition
        let newPath = s.pathHistory;
        if (!s.isRealMode && dist > 0.5) {
            newPath = [...s.pathHistory, s.userPos];
        }

        // 6. Zone Breach Check (Mock Poly: Lat 37.567-37.569, Lng 126.979-126.982)
        const inZone = (
            s.userPos.lat >= 37.5670 && s.userPos.lat <= 37.5690 &&
            s.userPos.lng >= 126.9790 && s.userPos.lng <= 126.9820
        );

        // Trigger Store Event if just entered
        const justBreached = inZone && !s.inZone;

        set({
            ghostPos: newGhostPos,
            ghostSpeed: newGhostSpeed,
            userSpeed: newUserSpeed,
            rivalGap: dist * (s.ghostSpeed > s.userSpeed ? -1 : 1),
            isUnderAttack: dist < 20,
            pathHistory: newPath,
            inZone: inZone,
            justBreached: justBreached
        });
    }
}));
