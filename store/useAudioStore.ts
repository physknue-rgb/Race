import { create } from 'zustand';

type AudioEvent = 'RACE_START' | 'OVERTAKE' | 'TERRITORY_ENTER' | 'DOMINANCE_FADE' | 'BOOST_ACTIVE' | 'OVERTAKE_WARNING' | 'ZONE_BREACHED';
type Language = 'EN' | 'KR';

interface AudioState {
    language: Language;
    isPlaying: boolean;
    setLanguage: (lang: Language) => void;
    playEvent: (event: AudioEvent, variables?: Record<string, string>) => void;
}

const SCRIPTS = {
    EN: {
        RACE_START: "Welcome to the grid. All systems go. Own your streets!",
        OVERTAKE: "Heads up! {user} just smoked you. Push it, now!",
        OVERTAKE_WARNING: 'Warning. Rival proximity critical. Overtake imminent.',
        ZONE_BREACHED: 'Target Zone Breached! Uploading virus... Hold your ground!',
        TERRITORY_ENTER: "Warning. Entering 'Apex' territory. Prepare for a raid.",
        DOMINANCE_FADE: "Your dominance is fading in {area}. Get out there and run!",
        BOOST_ACTIVE: "Limiters off! Double GP active. Burn some rubber!"
    },
    KR: {
        RACE_START: "레이스 스타트! 당신의 거리를 지배할 시간입니다.",
        OVERTAKE: "방금 {user}님이 당신을 추월했습니다! 페이스 올리세요!",
        OVERTAKE_WARNING: '경고. 라이벌 근접. 추월 임박.',
        ZONE_BREACHED: '목표 구역 침투 성공! 바이러스 업로드 중... 현재 위치를 사수하세요!',
        TERRITORY_ENTER: "경고. 지배자의 구역에 진입했습니다. 공격을 준비하세요.",
        DOMINANCE_FADE: "{area}의 지배력이 떨어지고 있습니다. 방어 레이스가 필요합니다.",
        BOOST_ACTIVE: "리미터 해제! 포인트 2배 구간입니다. 지금 질주하세요!"
    }
};

export const useAudioStore = create<AudioState>((set, get) => ({
    language: 'EN', // Default to Global
    isPlaying: false,
    setLanguage: (lang) => set({ language: lang }),
    playEvent: (event, variables) => {
        const { language } = get();
        let text = SCRIPTS[language][event];

        // Interpolate variables
        if (variables) {
            Object.keys(variables).forEach(key => {
                text = text.replace(`{${key}}`, variables[key]);
            });
        }

        console.log(`[AUDIO ENGINE] Playing (${language}): ${text}`);

        // Browser Speech Synthesis
        if ('speechSynthesis' in window) {
            // Cancel previous
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'KR' ? 'ko-KR' : 'en-US';
            utterance.rate = 1.1; // Sporty pace
            utterance.pitch = 1.0;

            // Try to find a good voice
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.includes(language === 'KR' ? 'ko' : 'en'));
            if (voice) utterance.voice = voice;

            window.speechSynthesis.speak(utterance);
        }
    }
}));
