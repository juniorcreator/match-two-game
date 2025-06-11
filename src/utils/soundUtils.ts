export const resetSound = (sound: HTMLAudioElement) => {
    sound.pause();
    sound.currentTime = 0;
};

export const playSound = async (sound: HTMLAudioElement) => {
    try {
        await sound.play();
    } catch (e) {
        console.warn("Sound play error:", e);
    }
};