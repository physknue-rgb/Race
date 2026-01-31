'use client';

type PositionCallback = (pos: { lat: number; lng: number; speed: number | null }) => void;
type ErrorCallback = (error: GeolocationPositionError) => void;

class LocationService {
    watchId: number | null = null;

    startTracking(onUpdate: PositionCallback, onError: ErrorCallback) {
        if (!('geolocation' in navigator)) {
            onError({ code: 0, message: 'Geolocation not supported' } as GeolocationPositionError);
            return;
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, speed } = position.coords;
                onUpdate({
                    lat: latitude,
                    lng: longitude,
                    speed: speed
                });
            },
            (error) => onError(error),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}

export const locationService = new LocationService();
