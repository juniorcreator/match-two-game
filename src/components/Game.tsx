import { useRef, useState, useEffect, useCallback } from "react";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import useGameStore from "../store/game.ts";
import "./Game.scss";
import { shuffleArray, playMusic, formatTime } from "../utils";
import type { Item, Levels } from "../types";
import ChooseGameBlock from "./ChooseGameBlock.tsx";
import Health from "./Health/Health.tsx";
import GameStatus from "./GameStatus/GameStatus.tsx";
import FinishedLevels from "./FinishedLevels.tsx";
import { canvas } from "../utils/canvas.ts";

const songs = playMusic();
songs.bgMusic.loop = true;
songs.bgMusic.volume = 1;
songs.open.volume = 0.5;
songs.close.volume = 0.5;
songs.match.volume = 0.5;
songs.winGame.volume = 1;

const Game = () => {
  const store = useGameStore();

  const timers = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});
  const secondElementRef = useRef<HTMLDivElement | null>(null);
  const timeLeft = useRef(10); // стартовое время
  const initTime = 15;

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(true);
  const [items, setItems] = useState<Item[]>(
    shuffleArray(store.gameLevels[store.currentLevel]),
  );
  const selected = useRef<{ index: number; value: string }[]>([]);
  const [blocked, setBlocked] = useState(false); // блокирует клики во время задержки
  const [levels, setLevels] = useState<Levels[]>(store.levelData);

  const resetSelected = () => {
    selected.current = [];
  };
  const handleItemClick = useCallback(
    async (index: number) => {
      if (blocked || !items[index].clickable) return;

      await songs.open.play();
      console.log(items, " items");
      console.log(levels, " levels");

      const newItems = [...items];
      newItems[index].active = true;
      newItems[index].clickable = false;
      setItems(newItems);

      selected.current.push({ index, value: newItems[index].value });

      if (selected.current.length === 2) {
        const [first, second] = selected.current;
        const newLevels = [...levels];
        console.log(
          newLevels[store.currentLevel].tries,
          " newLevels[index].tries",
        );
        newLevels[store.currentLevel].tries += 1;
        setLevels(newLevels);

        if (first.value === second.value) {
          // if items the same
          const finishedLevel =
            newItems.filter((item) => !item.clickable).length ===
            newItems.length;
          const isFinishedGame = store.currentLevel + 1 === store.maxLevels;

          console.log(finishedLevel, " finishedLevel");
          console.log(isFinishedGame, " isFinishedGame");

          if (finishedLevel) {
            if (isFinishedGame) {
              // finished game
              clearInterval(timers.current.timerInterval);
              store.setIsFinishedLvl(true);
              store.setWinGame(true);
              songs.bgMusic.pause();
              songs.bgMusic.currentTime = 0;
              await songs.winGame.play();
              songs.winGame.loop = true;
              console.log("game is finished");
            } else {
              console.log("finished lvl");
              // lvl completed
              const newLevels = [...levels];
              newLevels[store.currentLevel].isFinished = true;
              setLevels(newLevels);
              clearInterval(timers.current.timerInterval);

              setTimeout(() => {
                store.setIsFinishedLvl(true);
                store.setShowNextLevel(true);
                songs.match.pause();
                songs.match.currentTime = 0;
                songs.congrats.play();
                const currentLevel = store.updateCurrentLevel();
                secondElementRef.current.textContent = String(
                  formatTime(initTime + currentLevel * 15),
                );
                // console.log(currentLevel, " store.currentLevel in finished");
              }, 700);
            }
          } else {
            // lvl not yet completed
            songs.match.pause();
            songs.match.currentTime = 0;
            songs.match.play().catch((e) => {
              console.warn("Cannot play match sound:", e);
            });
          }
          // Совпадают — оставить активными
          resetSelected();
        } else {
          // Не совпадают — через 0.5 сек сбросить
          setBlocked(true);

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
      }
    },
    [blocked, items, levels, store],
  );
  console.log("rendered");
  // console.log(levels, " levels");

  function resetGame() {
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
  }
  function handleLevelFailed() {
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
  }

  function startLevel() {
    console.log(store.currentLevel, " store.currentLevel ");
    timeLeft.current = initTime + store.currentLevel * 10; // Увеличиваем время на каждом уровне

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
  }

  const handlePlay = () => {
    if (songs.bgMusic.paused) {
      songs.bgMusic
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.error("Play error:", e);
        });
    }
  };
  const handlePause = () => {
    if (!songs.bgMusic.paused) {
      songs.bgMusic.pause();
      setIsPlaying(false);
    }
  };
  const setMusicVolume = (value: number) => {
    songs.bgMusic.volume = value;
    songs.open.volume = value / 2;
    songs.close.volume = value / 2;
    songs.match.volume = value / 2;
    songs.congrats.volume = value / 2;
    songs.switch.volume = value / 3;
    songs.winGame.volume = value;
  };
  const handleVolumeOff = () => {
    songs.bgMusic.pause();
    setMusicVolume(0);
    setIsPlaying(false);
    setVolume(false);
  };
  const handleVolumeOn = () => {
    setMusicVolume(1);
    setVolume(true);
  };
  const handlePlayLvlAgain = useCallback(() => {
    resetSelected();
    const newItems = [...items].map((item) => {
      return { ...item, active: true, clickable: false };
    });
    const newLevels = [
      ...levels.map((lvl, index) => {
        if (index === store.currentLevel) {
          return { ...lvl, tries: 0 };
        }
        return lvl;
      }),
    ];

    clearTimeout(timers.current.timeoutPlayAgain);
    setItems(newItems);
    setLevels(newLevels);

    timers.current.timeoutPlayAgain = setTimeout(() => {
      setItems(
        newItems.map((item) => {
          return { ...item, active: false, clickable: true };
        }),
      );
    }, 1500);
  }, [items, levels, store.currentLevel]);
  const handleShowHint = () => {
    console.log("clicked hint");

    const newItems = [...items];
    const newLevels = [...levels];
    newLevels[store.currentLevel].hintCount =
      newLevels[store.currentLevel].hintCount - 1;
    const uniqAvailableNumbers = [
      ...new Set(
        newItems.filter((item) => !item.active).map((item) => item.value),
      ),
    ];
    const randomElement =
      uniqAvailableNumbers[
        Math.floor(Math.random() * uniqAvailableNumbers.length)
      ];

    const hintItems = newItems.map((item) => {
      if (item.value === randomElement) {
        return { ...item, active: true, clickable: false };
      }
      return item;
    });
    setItems(hintItems);

    setTimeout(() => {
      setItems(newItems);
    }, 1500);

    console.log(items, "  items");
    console.log(uniqAvailableNumbers, "  uniqAvailableNumbers");
    console.log(randomElement, "  randomElement");
  };

  useEffect(() => {
    resetSelected();
    clearTimeout(timers.current.timeout);

    const newItems = shuffleArray(store.gameLevels[store.currentLevel]).map(
      (item) => {
        return { ...item, active: true, clickable: false };
      },
    );
    const newItemsHidden = newItems.map((item) => ({
      ...item,
      active: false,
      clickable: true,
    }));

    setItems(newItems);
    timers.current.timeout = setTimeout(() => {
      setItems(newItemsHidden);
    }, 1000);
  }, [store.currentLevel, store.selectedContentType, store.gameLevels]);
  useEffect(() => {
    canvas();
  }, []);

  return (
    <>
      <canvas id="particles"></canvas>
      {!store.isWinGame && (
        <div className="text-white">
          Timer{" "}
          <span id="timer" ref={secondElementRef}>
            {formatTime(timeLeft.current)}
          </span>
        </div>
      )}
      <GameStatus
        onWinLvl={() => {
          store.setIsFinishedLvl(false);
          startLevel();
        }}
        onStartGame={() => {
          store.setShowNextLevel(false);
          startLevel();
        }}
        onTimeIsUp={() => {
          startLevel();
          store.setIsTimeIsUp(false);
        }}
        onResetGame={resetGame}
      />
      {!store.isWinGame && <Health />}
      {!store.isGameStarted && <ChooseGameBlock />}
      <div className="game">
        {!store.isWinGame && (
          <div className="relative z-10">
            {isPlaying ? (
              <PauseCircleIcon
                onClick={handlePause}
                sx={{ fontSize: 30 }}
                className="cursor-pointer text-white"
              />
            ) : (
              <NotStartedIcon
                onClick={handlePlay}
                sx={{ fontSize: 30 }}
                className="cursor-pointer text-white"
              />
            )}
          </div>
        )}

        <div className="absolute z-10 right-3 top-3">
          {volume ? (
            <VolumeOffIcon
              onClick={handleVolumeOff}
              sx={{ fontSize: 30 }}
              className="cursor-pointer text-white"
            />
          ) : (
            <VolumeMuteIcon
              onClick={handleVolumeOn}
              sx={{ fontSize: 30 }}
              className="cursor-pointer text-white"
            />
          )}
        </div>
        <h2 className="text-xl text-white mb-1">
          level: {store.currentLevel + 1}
        </h2>
        {!store.isWinGame && (
          <ul
            className={`list ${levels[store.currentLevel].cls} ${store.selectedContentType}`}
          >
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => handleItemClick(index)}
                className={`list-item flip-card ${item.active ? "active" : ""} ${
                  !item.clickable ? "notClickable" : ""
                }`}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front"></div>
                  <div
                    className={`flip-card-back flex items-center justify-center ${item.bgColor}`}
                  >
                    <h1>{item.content}</h1>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!store.isWinGame && (
          <div className="mt-2">
            {levels[store.currentLevel].hintCount > 0 && (
              <button
                onClick={handleShowHint}
                className="border-1 mr-2 rounded-sm text-white px-2 p-1 text-xs cursor-pointer hover:scale-105 transition duration-300 backdrop-blur"
              >
                Hint available {levels[store.currentLevel].hintCount}
              </button>
            )}
            <button
              onClick={handlePlayLvlAgain}
              className="border-1 rounded-sm text-white px-2 p-1 text-xs cursor-pointer hover:scale-105 transition duration-300 backdrop-blur"
            >
              Play {store.currentLevel + 1} lvl again
            </button>
          </div>
        )}

        {!store.isWinGame && (
          <h3 className="text-xl text-white mt-4 gap-2">
            <button
              className="cursor-pointer px-6 py-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/40
               text-white font-semibold shadow-lg hover:scale-105
               hover:shadow-xl transition duration-300 backdrop-blur
               border border-white/20"
              onClick={store.updateCurrentLevel}
            >
              Next level lvl
            </button>
          </h3>
        )}

        {store.isWinGame && <FinishedLevels levels={levels} />}
      </div>
    </>
  );
};

export default Game;
