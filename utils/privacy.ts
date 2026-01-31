/**
 * PRIVACY ZONE ALGORITHM (GDPR/CCPA Compliant)
 * 
 * Masks precise start/end locations by applying a random "Fuzzing" offset
 * within a 150m radius safe zone.
 */

const EARTH_RADIUS_KM = 6371;

export const fuzzLocation = (lat: number, lon: number, radiusMeters: number = 150) => {
    // Generate random angle and distance
    const r = (radiusMeters / 1000) * Math.sqrt(Math.random()); // Convert to km
    const theta = Math.random() * 2 * Math.PI;

    const latRad = lat * (Math.PI / 180);
    const lonRad = lon * (Math.PI / 180);

    // Calculate new point
    const newLatRad = Math.asin(Math.sin(latRad) * Math.cos(r / EARTH_RADIUS_KM) +
        Math.cos(latRad) * Math.sin(r / EARTH_RADIUS_KM) * Math.cos(theta));

    const newLonRad = lonRad + Math.atan2(Math.sin(theta) * Math.sin(r / EARTH_RADIUS_KM) * Math.cos(latRad),
        Math.cos(r / EARTH_RADIUS_KM) - Math.sin(latRad) * Math.sin(newLatRad));

    return {
        lat: newLatRad * (180 / Math.PI),
        lon: newLonRad * (180 / Math.PI),
        isFuzzed: true
    };
};

export const isWithinPrivacyZone = (userLat: number, userLon: number, homeLat: number, homeLon: number) => {
    const dLat = (homeLat - userLat) * (Math.PI / 180);
    const dLon = (homeLon - userLon) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * (Math.PI / 180)) * Math.cos(homeLat * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = EARTH_RADIUS_KM * c;

    return distanceKm <= 0.150; // 150m
};
