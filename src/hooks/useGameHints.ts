import type { Item, Levels } from "../types";

export const useGameHints = (
  items: Item[],
  setItems: Function,
  levels: Levels[],
  setLevels: Function,
  store: any,
) => {
    return () => {
    const newItems = [...items];
    const newLevels = [...levels];
    newLevels[store.currentLevel].hintCount -= 1;

    const uniqValues = [
      ...new Set(newItems.filter((i) => !i.active).map((i) => i.value)),
    ];
    const hintValue = uniqValues[Math.floor(Math.random() * uniqValues.length)];

    const hintItems = newItems.map((i) =>
      i.value === hintValue ? { ...i, active: true, clickable: false } : i,
    );
    setItems(hintItems);
    setLevels(newLevels);

    console.log(items, "  items");
    console.log(uniqValues, "  uniqValues");
    console.log(hintItems, "  hintItems");

    setTimeout(() => {
      setItems(newItems);
    }, 1500);
  };
};
