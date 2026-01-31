'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRaceStore } from '@/store/useRaceStore';
import { useTerritoryStore } from '@/store/useTerritoryStore';

export default function TacticalMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersRef = useRef<{ user: L.Marker; ghost: L.Marker; path: L.Polyline; zone: L.Polygon } | null>(null);
    const runnersRef = useRef<{ [key: string]: L.Marker }>({});
    const [autoCenter, setAutoCenter] = useState(true);

    // Store Actions
    const { userPos, ghostPos, pathHistory, inZone, activeRunners, moveTo } = useRaceStore();
    const { ownerFaction, leadingFaction, zoneLevel, isOvertime } = useTerritoryStore(); // Connect Territory Store

    // Initialize Map
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Initialize Map
        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false,
            doubleClickZoom: false
        }).setView([userPos.lat, userPos.lng], 16);

        mapInstance.current = map;

        // Dark Nitrogen Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20
        }).addTo(map);

        // Click to Move
        map.on('click', (e) => {
            moveTo({ lat: e.latlng.lat, lng: e.latlng.lng });
        });

        // Use Markers
        const userIcon = L.divIcon({
            className: 'custom-icon',
            html: `<div class="w-4 h-4 bg-neon-cyan rounded-full border-2 border-white shadow-[0_0_15px_#00FFFF] animate-pulse"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const ghostIcon = L.divIcon({
            className: 'custom-icon',
            html: `<div class="w-4 h-4 bg-neon-pink rounded-full border-2 border-white shadow-[0_0_15px_#FF00FF]"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const userMarker = L.marker([userPos.lat, userPos.lng], { icon: userIcon }).addTo(map);
        const ghostMarker = L.marker([ghostPos.lat, ghostPos.lng], { icon: ghostIcon }).addTo(map);

        // Breadcrumbs (Path)
        const pathLine = L.polyline([], {
            color: '#00FFFF',
            weight: 5,
            opacity: 0.8,
            className: 'neon-path' // Add glow via CSS if needed
        }).addTo(map);

        // Target Zone
        const territoryCoords: L.LatLngExpression[] = [
            [37.5670, 126.9790], [37.5690, 126.9790],
            [37.5690, 126.9820], [37.5670, 126.9820]
        ];
        // Initial Style
        const zonePoly = L.polygon(territoryCoords, {
            color: '#333',
            fillColor: '#333',
            fillOpacity: 0.1,
            weight: 1
        }).addTo(map);

        markersRef.current = { user: userMarker, ghost: ghostMarker, path: pathLine, zone: zonePoly };

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // Reactive Updates
    useEffect(() => {
        if (!markersRef.current || !mapInstance.current) return;

        const { user, ghost, path, zone } = markersRef.current;

        // Update User & Ghost
        user.setLatLng([userPos.lat, userPos.lng]);
        ghost.setLatLng([ghostPos.lat, ghostPos.lng]);

        // Update Remote Runners (Firebase Sync)
        if (activeRunners) {
            activeRunners.forEach(runner => {
                if (!runnersRef.current[runner.id]) {
                    // Create new marker
                    const icon = L.divIcon({
                        className: 'custom-icon',
                        html: `<div class="w-3 h-3 bg-white rounded-full border border-gray-500"></div>`,
                        iconSize: [12, 12]
                    });
                    runnersRef.current[runner.id] = L.marker([runner.lat, runner.lng], { icon }).addTo(mapInstance.current!);
                } else {
                    // Update existing
                    runnersRef.current[runner.id].setLatLng([runner.lat, runner.lng]);
                }
            });
        }

        // Update Path
        const latLngs = pathHistory.map(p => [p.lat, p.lng] as [number, number]);
        path.setLatLngs(latLngs);

        // --- TERRITORY VISUALIZATION ---
        // 1. Determine Base Color based on Owner
        const baseColor = ownerFaction === 'NEON' ? '#00FFFF' : '#FF00FF'; // Cyan vs Pink
        const leaderColor = leadingFaction === 'NEON' ? '#00FFFF' : '#FF00FF';

        // 2. Dynamic Style
        // If "In Zone", we brighten it.
        // If "Overtime", we make it pulse aggressively (weight change).

        let weight = 1;
        let opacity = 0.1;
        let dashArray: string | undefined = undefined;

        if (isOvertime) {
            weight = 5;
            opacity = 0.3;
            dashArray = '5, 10'; // Dotted line for tension
        } else if (inZone) {
            weight = 3;
            opacity = 0.2;
        }

        zone.setStyle({
            color: baseColor,
            fillColor: leadingFaction ? leaderColor : baseColor, // Pulse with leader color if changing hands
            fillOpacity: opacity,
            weight: weight,
            dashArray: dashArray
        });

        // CSS Class for Glow (Requires access to the internal path element, difficult in pure Leaflet JS object)
        // workaround: We rely on the SVG renderer.
        // For "Breathing" effect, we can toggle opacity or weight via requestAnimationFrame in a real game loop,
        // but here we rely on React state triggers.

        // Auto Center
        if (autoCenter) {
            mapInstance.current.panTo([userPos.lat, userPos.lng], { animate: true, duration: 0.5 });
        }

    }, [userPos, ghostPos, pathHistory, inZone, autoCenter, ownerFaction, leadingFaction, isOvertime]);

    return (
        <div className="w-full h-full min-h-screen bg-black relative">
            <div id="map" ref={mapRef} style={{ height: '100vh', width: '100vw', background: '#0a0a12' }} />

            {/* Auto Center Toggle */}
            <div className="absolute bottom-32 right-6 z-[1000]">
                <button
                    onClick={(e) => { e.stopPropagation(); setAutoCenter(!autoCenter); }}
                    className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md transition-colors
                        ${autoCenter ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-[0_0_10px_#00FFFF]' : 'bg-black/50 text-gray-500'}
                    `}
                >
                    <div className="w-4 h-4 border-2 border-current rounded-full relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-current rounded-full" />
                    </div>
                </button>
            </div>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none text-white/50 text-xs font-mono tracking-widest bg-black/50 px-2 py-1 rounded">
                CLICK MAP TO NAVIGATE
            </div>
        </div>
    );
}
