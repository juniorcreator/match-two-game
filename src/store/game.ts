import { create } from "zustand";
import type { Item, Levels } from "../types";
import { generateGameLevels } from "../utils";

const maxLevels = 12;

type State = {
  currentLevel: number;
  isFinishedLvl: boolean;
  selectedContentType: string;
  gameLevels: Item[][];
  levelData: Levels[];
  health: number;
  isGameStarted: boolean;
  isGameOver: boolean;
  timerInterval: null | number;
  isTimeIsUp: boolean;
  isWinGame: boolean;
  maxLevels: number;
  showNextLevel: boolean;
};

type Action = {
  updateCurrentLevel: () => number;
  setIsFinishedLvl: (value: boolean) => void;
  setItemContent: (content: string) => void;
  setStartGame: (value: boolean) => void;
  setMinusHealth: () => void;
  setPlusHealth: () => void;
  setHealth: (value: number) => void;
  setIsTimeIsUp: (value: boolean) => void;
  setGameOver: () => void;
  setWinGame: (value: boolean) => void;
  setShowNextLevel: (value: boolean) => void;
  resetCurrentLevel: () => void;
  resetLvlData: () => void;
};

const useGameStore = create<State & Action>((set, get) => ({
  currentLevel: 0,
  maxLevels: maxLevels,
  isFinishedLvl: false,
  selectedContentType: "numbers",
  isGameStarted: false,
  isGameOver: false,
  isTimeIsUp: false,
  isWinGame: false,
  timerInterval: null,
  showNextLevel: false,
  health: 3,
  gameLevels: generateGameLevels(maxLevels, "numbers"),
  levelData: Array.from({ length: maxLevels }, (_, i) => ({
    tries: 0,
    boardLevel: i,
    isFinished: false,
    cls: i === 0 ? "" : `lvl${i}`,
    hintCount: i > 3 ? 3 : 1,
  })),

  updateCurrentLevel: () => {
    const level = get().currentLevel;
    set({ currentLevel: Math.min(level + 1, get().gameLevels.length - 1) });
    // set({ isFinishedLvl: false });
    // console.log(get().gameLevels, " gameLevels");
    // console.log(get().currentLevel, " currentLevel");
    return get().currentLevel;
  },
  resetCurrentLevel: () => {
    set({ currentLevel: 0 });
  },
  setIsFinishedLvl: (isFinishedLvl) => set({ isFinishedLvl }),
  setItemContent: (selectedContentType) => {
    set({ selectedContentType });
    set({ gameLevels: generateGameLevels(maxLevels, selectedContentType) });

    console.log(get().gameLevels, " get().gameLevels");
  },
  setStartGame: (value: boolean) => {
    set({ isGameStarted: value });
  },
  setMinusHealth: () => {
    set({ health: get().health - 1 });
  },
  setPlusHealth: () => {
    set({ health: get().health + 1 });
  },
  setHealth: (health: number) => {
    set({ health: health });
  },
  setIsTimeIsUp: (value) => {
    set({ isTimeIsUp: value });
  },
  setGameOver: () => {
    set({ isGameOver: true });
  },
  setWinGame: (value: boolean) => {
    set({ isWinGame: value });
  },
  setShowNextLevel: (value: boolean) => {
    set({ showNextLevel: value });
  },
  resetLvlData: () => {
    set({
      levelData: Array.from({ length: maxLevels }, (_, i) => ({
        tries: 0,
        boardLevel: i,
        isFinished: false,
        cls: i === 0 ? "" : `lvl${i}`,
        hintCount: i > 3 ? 3 : 1,
      })),
    });
  },
}));

export default useGameStore;
