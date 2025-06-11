import type { Item } from "../types";

export const bgColorPalette = [
  "bg-sky-500",
  "bg-sky-300",
  "bg-teal-500",
  "bg-teal-300",
  "bg-cyan-500",
  "bg-cyan-300",
  "bg-cyan-700",
  "bg-amber-500",
  "bg-amber-800",
  "bg-purple-500",
  "bg-orange-300",
  "bg-fuchsia-300",
  "bg-lime-500",
  "bg-lime-700",
  "bg-blue-500",
  "bg-orange-500",
  "bg-emerald-500",
  "bg-orange-200",
  "bg-rose-300",
  "bg-red-300",
  "bg-yellow-300",
  "bg-green-400",
];
const contentType = {
  emoji: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🦆",
    "🦅",
    "🦉",
    "🐺",
    "🦓",
    "🦒",
    "🐘",
    "🦛",
    "🦏",
    "🐊",
    "🐬",
    "🐳",
  ],
  food: [
    "🍎",
    "🍌",
    "🍓",
    "🍇",
    "🍉",
    "🍍",
    "🍒",
    "🥝",
    "🥥",
    "🥑",
    "🥕",
    "🌽",
    "🥦",
    "🧄",
    "🧅",
    "🥔",
    "🍞",
    "🥐",
    "🥖",
    "🥯",
    "🧀",
    "🍗",
    "🍖",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🥪",
    "🌮",
    "🌯",
    "🍣",
    "🍤",
  ],
};

export function generateLevel(
  pairsCount: number,
  colors: string[],
  type: string,
): Array<Item> {
  const level = [];
  const typeOfItem = contentType[type];
  for (let i = 1; i <= pairsCount; i++) {
    const bgColor = colors[(i - 1) % colors.length];
    const card = {
      value: String(i),
      active: false,
      clickable: true,
      bgColor,
      content: type !== "numbers" ? typeOfItem[i] : String(i),
    };
    level.push({ ...card }, { ...card }); // пара
  }
  return level;
}
export function generateGameLevels(
  levelsCount: number,
  type: string,
): Item[][] {
  const levels = [];
  for (let i = 1; i <= levelsCount; i++) {
    levels.push(generateLevel(i + 1, bgColorPalette, type)); // например: 2 пары на 1 уровне, 3 на втором и т.д.
  }
  return levels;
}

export const LevelData = Array.from({ length: 30 }, (_, i) => ({
  tries: 0,
  boardLevel: i,
  isFinished: false,
  cls: i === 0 ? "" : `lvl${i}`,
  hintCount: i > 3 ? 3 : 1,
}));

export function shuffleArray(array: Item[]): Item[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const playMusic = () => {
  return {
    open: new Audio("/assets/music/open.wav"),
    close: new Audio("/assets/music/close.mp3"),
    match: new Audio("/assets/music/match.wav"),
    congrats: new Audio("/assets/music/congrats.wav"),
    bgMusic: new Audio("/assets/music/bg-music.mp3"),
    switch: new Audio("/assets/music/switch.wav"),
    winGame: new Audio("/assets/music/winGame.mp3"),
  };
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${minutes}m : ${paddedSeconds}s`;
};
