import { type RefObject, useCallback } from "react";
import type { Item, Levels } from "../types";
import useGameStore from "../store/game.ts";

export const useReplayLevel = ({
  items,
  levels,
  setItems,
  timers,
  timeLeft,
  initTime,
}: {
  items: Item[];
  levels: Levels[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  timers: RefObject<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>;
  timeLeft: RefObject<number>;
  initTime: number;
}) => {
  const store = useGameStore();

  return useCallback(() => {
    //handlePlayLvlAgain
    clearTimeout(timers.current.timeoutPlayAgain);
    timeLeft.current = initTime + store.currentLevel * 15;

    const activatedItems = items.map((item) => ({
      ...item,
      active: true,
      clickable: false,
    }));

    const updatedLevels = levels.map((lvl, index) =>
      index === store.currentLevel ? { ...lvl, tries: 0 } : lvl,
    );

    setItems(activatedItems);
    store.updateLvlData(updatedLevels);

    timers.current.timeoutPlayAgain = setTimeout(() => {
      const deactivatedItems = activatedItems.map((item) => ({
        ...item,
        active: false,
        clickable: true,
      }));
      setItems(deactivatedItems);
    }, 1500);
  }, [items, levels, setItems, store.currentLevel, timers, timeLeft, initTime]);
};
