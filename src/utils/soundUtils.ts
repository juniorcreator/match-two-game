export const resetSound = (sound: HTMLAudioElement) => {
    sound.pause();
    sound.currentTime = 0;
};