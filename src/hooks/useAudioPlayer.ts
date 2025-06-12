// hooks/useAudioPlayer.ts
import { useRef } from "react";

export const useAudioPlayer = () => {
    const switchRef = useRef<HTMLAudioElement>(new Audio("../public/assets/music/switch.wav"));

    const preloadSwitchSound = () => {
        switchRef.current.volume = 0.4;
        switchRef.current.load();
    };

    const playSwitchSound = () => {
        try {
            switchRef.current.currentTime = 0;
            switchRef.current.play().catch((err) =>
                console.warn("Playback failed:", err),
            );
        } catch (err) {
            console.warn("Sound error:", err);
        }
    };

    return {
        preloadSwitchSound,
        playSwitchSound,
    };
};
