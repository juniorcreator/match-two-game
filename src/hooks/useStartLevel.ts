import { formatTime } from "../utils";
import { type RefObject } from "react";

export const useStartLevel = ({
  timers,
  timeLeft,
  initTime,
  secondElementRef,
  store
}: {
  timers: RefObject<any>;
  timeLeft: RefObject<number>;
  initTime: number;
  secondElementRef: RefObject<HTMLDivElement>;
  store: any
}) => {

    const handleLevelFailed = () => {
        store.setMinusHealth();
        if (store.health > 1) {
            clearInterval(timers.current.timerInterval);
            timeLeft.current = 0;
            secondElementRef.current.textContent = String(
                formatTime(timeLeft.current),
            );

            store.setIsTimeIsUp(true);
        } else {
            store.setGameOver();
        }
    };

  return () => {
    console.log(store.currentLevel, " store.currentLevel ");
    timeLeft.current = initTime + store.currentLevel * 15; // Увеличиваем время на каждом уровне

    timers.current.timerInterval = setInterval(() => {
      if (timeLeft.current <= 0) {
        handleLevelFailed();
      } else {
        timeLeft.current = timeLeft.current - 1;
        secondElementRef.current.textContent = String(
          formatTime(timeLeft.current),
        );
      }
    }, 1000);
  };
};
