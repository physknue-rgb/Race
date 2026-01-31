'use client';

import { MapPin, Zap, Shield, Trophy, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: MapPin, label: "HOME", href: "/dashboard" },
        { icon: Zap, label: "RACE", href: "/race" },
        { icon: Shield, label: "ZONE", href: "/zone" },
        { icon: Trophy, label: "RANK", href: "/rank" },
        { icon: ShoppingBag, label: "VAULT", href: "/vault" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-[#0F172A]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 flex justify-between items-center z-40">
            {navItems.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={i} href={item.href}>
                        <div className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-neon-cyan' : 'text-gray-600 hover:text-gray-300'}`}>
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[9px] font-bold tracking-widest">{item.label}</span>
                            {isActive && (
                                <div className="absolute bottom-1 w-1 h-1 bg-neon-cyan rounded-full shadow-[0_0_5px_#00FFFF]" />
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
