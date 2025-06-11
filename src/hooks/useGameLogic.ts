import { useCallback, useRef, useState, useEffect } from "react";
import useGameStore from "../store/game.ts";
import { shuffleArray, formatTime } from "../utils";
import type { Levels } from "../types";
import { useItemManager } from "./useItemManager.ts";
import { useGameHints } from "./useGameHints.ts";
import { useReplayLevel } from "./useReplayLevel.ts";
import { useResetGame } from "./useResetGame.ts";
import { useStartLevel } from "./useStartLevel.ts";
import {resetSound} from "../utils/soundUtils.ts";

export const useGameLogic = (songs: any) => {
  const store = useGameStore();
  const timers = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});
  const secondElementRef = useRef<HTMLDivElement | null>(null);
  const timeLeft = useRef(15);
  const initTime = 15;
  const [blocked, setBlocked] = useState(false);
  const [levels, setLevels] = useState<Levels[]>(store.levelData);

  const { items, setItems, selected, resetSelected, showItems } = useItemManager(store.gameLevels[store.currentLevel]);

  const handleShowHint  = useGameHints(items, setItems, levels, setLevels, store);
  const handlePlayLvlAgain = useReplayLevel({items, levels, setItems, timers, timeLeft, initTime});
  const resetGame = useResetGame({songs, timeLeft, initTime, setLevels});
  const startLevel = useStartLevel({timers, store, timeLeft, initTime, secondElementRef});

  const handleItemClick = useCallback(
    async (index: number) => {
      if (blocked || !items[index].clickable) return;

      console.log(levels, " levels");

      //before open play
      // resetSound(songs.close);
      // resetSound(songs.match);
      //before open play
      // await songs.open.play();
      const newItems = [...items];
      newItems[index].active = true;
      newItems[index].clickable = false;
      setItems(newItems);

      selected.current.push({ index, value: newItems[index].value });

      if (selected.current.length === 2) { // clicked and selected 2 cube
        const [first, second] = selected.current;
        const newLevels = [...levels];
        newLevels[store.currentLevel].tries += 1;
        setLevels(newLevels);

        if (first.value === second.value) {
          const finishedLevel =
            newItems.filter((item) => !item.clickable).length ===
            newItems.length;
          const isFinishedGame = store.currentLevel + 1 === store.maxLevels;

          if (finishedLevel) { // finished lvl
            if (isFinishedGame) {
              clearInterval(timers.current.timerInterval);
              store.setIsFinishedLvl(true);
              const newLevels = [...levels];
              newLevels[store.currentLevel].isFinished = true;
              setLevels(newLevels);
              store.setWinGame(true);
              resetSound(songs.bgMusic);
              await songs.winGame.play();
              songs.winGame.loop = true;
            } else {
              // not finished game
              const newLevels = [...levels];
              newLevels[store.currentLevel].isFinished = true;
              setLevels(newLevels);
              clearInterval(timers.current.timerInterval);

              setTimeout(() => {
                store.setIsFinishedLvl(true);
                store.setShowNextLevel(true);

                //before congrats play
                resetSound(songs.match);
                resetSound(songs.open);
                resetSound(songs.close);
                //before congrats play
                songs.congrats.play();
                const currentLevel = store.updateCurrentLevel();
                secondElementRef.current!.textContent = String(
                  formatTime(initTime + currentLevel * 15),
                );
              }, 700);
            }
          } else {
            // not finished lvl
            resetSound(songs.match);
            resetSound(songs.open);
            resetSound(songs.close);
            // not finished lvl
            songs.match.play().catch(console.warn);
          }

          resetSelected();
        } else { // not finished lvl and not match
          setBlocked(true);
          //songs
          resetSound(songs.close);
          resetSound(songs.match);
          await songs.open.play();
          //songs
          clearTimeout(timers.current.timeoutNotMatch);
          timers.current.timeoutNotMatch = setTimeout(() => {
            const updatedItems = [...newItems];
            updatedItems[first.index] = {
              ...updatedItems[first.index],
              active: false,
              clickable: true,
            };
            updatedItems[second.index] = {
              ...updatedItems[second.index],
              active: false,
              clickable: true,
            };
            setItems(updatedItems);
            resetSelected();
            songs.close.play();
            setBlocked(false);
          }, 500);
        }
      } else { // clicked and selected 1 cube
        resetSound(songs.close);
        resetSound(songs.match);
        await songs.open.play();
      }
    },
    [blocked, items, levels, store, songs],
  );

  useEffect(() => {
    resetSelected();
    clearTimeout(timers.current.timeout);
    const newItems = shuffleArray(store.gameLevels[store.currentLevel]);
    showItems(newItems);
  }, [store.currentLevel, store.selectedContentType]);

  return {
    items,
    setItems,
    startLevel,
    resetGame,
    handleShowHint,
    handlePlayLvlAgain,
    levels,
    handleItemClick,
    timers,
    timeLeft,
    secondElementRef,
  };
};
