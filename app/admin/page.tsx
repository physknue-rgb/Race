'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Clock, DollarSign, Activity, Map } from 'lucide-react';

const DATA = [
    { name: '10:00', users: 400, exposure: 240 },
    { name: '11:00', users: 300, exposure: 139 },
    { name: '12:00', users: 200, exposure: 980 },
    { name: '13:00', users: 278, exposure: 390 },
    { name: '14:00', users: 189, exposure: 480 },
    { name: '15:00', users: 2390, exposure: 3800 },
    { name: '16:00', users: 3490, exposure: 4300 },
];

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-mono select-none">
            <header className="mb-12 border-b border-gray-700 pb-6 flex justify-between items-end">
                <div>
                    <div className="text-xs text-neon-cyan font-bold tracking-[0.3em] mb-2">LIVE RACE • INTERNAL</div>
                    <h1 className="text-4xl font-black text-white">INVESTOR DASHBOARD</h1>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">SESSION ID</div>
                    <div className="text-xl font-bold">XJ-9292-ALPHA</div>
                </div>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'ACTIVE RUNNERS', value: '3,492', icon: Users, color: 'text-neon-cyan' },
                    { label: 'AVG. DWELL TIME', value: '42m 10s', icon: Clock, color: 'text-gray-400' },
                    { label: 'BRAND EXPOSURE', value: '890h', icon: Activity, color: 'text-neon-pink' },
                    { label: 'EST. REVENUE', value: '$12.4k', icon: DollarSign, color: 'text-green-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <stat.icon className={stat.color} size={24} />
                            <span className="text-[10px] font-bold text-gray-500 bg-black/30 px-2 py-1 rounded">+12%</span>
                        </div>
                        <div className="text-3xl font-black mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-gray-500 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-3 gap-6 h-96">
                <div className="col-span-2 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2">
                        <Activity size={16} /> REAL-TIME TRAFFIC & EXPOSURE
                    </h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={DATA}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF00FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#FF00FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="users" stroke="#00FFFF" fillOpacity={1} fill="url(#colorUsers)" />
                            <Area type="monotone" dataKey="exposure" stroke="#FF00FF" fillOpacity={1} fill="url(#colorExp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* HEATMAP MOCK */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 relative overflow-hidden group">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                        <Map size={16} /> GANGNAM HOTZONE
                    </h3>
                    <div className="absolute inset-0 top-16 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Seoul_City_Wall.png/600px-Seoul_City_Wall.png')] bg-cover mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                    {/* Heat Points */}
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-neon-pink/40 blur-[50px] rounded-full animate-pulse" />
                    <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-neon-cyan/30 blur-[40px] rounded-full" />

                    <div className="absolute bottom-6 left-6">
                        <div className="text-2xl font-black text-white">HIGHEST DENSITY</div>
                        <div className="text-xs text-neon-pink font-bold">SECTOR 7 (NIKE LAB)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
