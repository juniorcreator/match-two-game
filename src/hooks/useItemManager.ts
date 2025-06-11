import { useState, useRef } from "react";
import { shuffleArray } from "../utils";
import type { Item } from "../types";

export const useItemManager = (initialItems: Item[]) => {
  const [items, setItems] = useState<Item[]>(shuffleArray(initialItems));
  const selected = useRef<{ index: number; value: string }[]>([]);

  const resetSelected = () => {
    selected.current = [];
  };

  const showItems = (items: Item[], delay = 1000) => {
    const visible = items.map((i) => ({
      ...i,
      active: true,
      clickable: false,
    }));
    const hidden = items.map((i) => ({ ...i, active: false, clickable: true }));
    setItems(visible);
    setTimeout(() => setItems(hidden), delay);
  };

  return {
    items,
    setItems,
    selected,
    resetSelected,
    showItems,
  };
};
