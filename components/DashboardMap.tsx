'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MOCK_RIVALS } from '@/data/mockData';

export default function DashboardMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Initialize Map (Static View)
        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false
        }).setView([37.5665, 126.9780], 14);

        mapInstance.current = map;

        // Dark Nitrogen Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20
        }).addTo(map);

        // Add Rival Markers
        MOCK_RIVALS.forEach(rival => {
            const rivalIcon = L.divIcon({
                className: 'custom-icon',
                html: `<div class="w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_8px_#FF00FF] animate-pulse"></div>`,
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            });
            L.marker([rival.lat, rival.lng], { icon: rivalIcon }).addTo(map);
        });

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    return <div ref={mapRef} className="w-full h-full bg-gray-900" />;
}
