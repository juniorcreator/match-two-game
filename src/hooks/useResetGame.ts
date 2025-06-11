import React, {type RefObject, useCallback} from "react";
import useGameStore from "../store/game";
import type { Levels } from "../types";

export const useResetGame = ({
  songs,
  timeLeft,
  initTime,
  setLevels,
}: {
  songs: any;
  timeLeft: RefObject<number>;
  initTime: number;
  setLevels: React.Dispatch<React.SetStateAction<Levels[]>>;
}) => {
  const store = useGameStore();

  return useCallback(() => {
    songs.winGame.pause();
    songs.winGame.currentTime = 0;

    store.setIsTimeIsUp(false);
    store.setStartGame(false);
    store.resetCurrentLevel();
    store.setWinGame(false);

    timeLeft.current = initTime;

    store.setItemContent(store.selectedContentType);
    store.setHealth(3);
    store.resetLvlData();
    setLevels(store.levelData);
  }, [songs, timeLeft, initTime, setLevels, store]);
};
