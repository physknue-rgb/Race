export const MOCK_USER = {
    codename: 'GHOST_RIDER',
    level: 42,
    gp: 12450,
    dominance: 14.2,
    territories: [
        { id: 't1', name: "APEX ZONE 01", status: "SECURE", type: 'cyan', decay: 0, owner: 'Me' },
        { id: 't2', name: "SECTOR 7", status: "UNDER ATTACK", type: 'rose', decay: 85, owner: 'Rival_99' },
        { id: 't3', name: "NIKE SPEED LAB", status: "EVENT", type: 'gold', decay: 0, owner: 'Nike' }
    ]
};

export const MOCK_FRIENDS = [
    { id: 'f1', name: 'NEON_KAT', level: 38, status: 'RUNNING_NOW', lastSeen: 'Just now' },
    { id: 'f2', name: 'CYPHER_X', level: 55, status: 'OFFLINE', lastSeen: '2h ago' },
    { id: 'f3', name: 'JINX', level: 12, status: 'OFFLINE', lastSeen: '5h ago' }
];

export const MOCK_LEADERBOARD = [
    { rank: 1, name: 'SPEED_DEMON', score: 9980, tier: 'DIAMOND' },
    { rank: 2, name: 'FLASH_K', score: 9450, tier: 'PLATINUM' },
    { rank: 3, name: 'GHOST_RIDER', score: 8720, tier: 'GOLD' }, // You
    { rank: 4, name: 'VIPER', score: 8600, tier: 'GOLD' },
    { rank: 5, name: 'BLITZ', score: 8100, tier: 'SILVER' }
];

export const MOCK_INVENTORY = {
    currencies: [
        { id: 'c1', name: 'Gold Points', amount: 12450, icon: 'Crown' },
        { id: 'c2', name: 'Neon Shards', amount: 45, icon: 'Zap' }
    ],
    items: [
        { id: 'i1', name: 'Cyber Mask (Blue)', rarity: 'EPIC' },
        { id: 'i2', name: 'Voice Pack: Glitch', rarity: 'RARE' }
    ],
    coupons: [
        { id: 'cp1', name: 'NIKE 20% OFF', Brand: 'Nike', expires: '24h' },
        { id: 'cp2', name: 'GATORADE FREE', Brand: 'Gatorade', expires: '7d' }
    ]
};

export const MOCK_RIVALS = [
    { id: 1, lat: 37.5665, lng: 126.9780 },
    { id: 2, lat: 37.5675, lng: 126.9790 },
    { id: 3, lat: 37.5658, lng: 126.9760 },
    { id: 4, lat: 37.5682, lng: 126.9775 },
    { id: 5, lat: 37.5660, lng: 126.9810 },
];

export const SPONSOR_DATA = {
    title: "NIKE SPEED LAB",
    description: "Dominance challenge in Gangnam Station Zone.",
    bonus: "2X GP",
    details: "Compete against pro runners in the Nike sponsored zone. Top 10% receive exclusive digital gear."
};
