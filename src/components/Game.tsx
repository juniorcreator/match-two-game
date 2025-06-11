import { useEffect } from "react";
import useGameStore from "../store/game.ts";
import "./Game.scss";
import { playMusic } from "../utils";
import GameBoard from "./Game/GameBoard.tsx";
import ChooseGameBlock from "./Game/ChooseGameBlock.tsx";
import Health from "./Game/Health/Health.tsx";
import GameStatus from "./Game/GameStatus/GameStatus.tsx";
import FinishedLevels from "./Game/FinishedLevels.tsx";
import { canvas } from "../utils/canvas.ts";
import Timer from "./Game/Timer.tsx";
import { useGameLogic } from "../hooks/useGameLogic.ts";
import { useAudioControl } from "../hooks/useAudioControl.ts";
import BtnNextLvl from "./Game/BtnNextLvl.tsx";
import PlayPauseIcon from "./Game/PlayPauseIcon.tsx";
import VolumeOnOfIcon from "./Game/VolumeOnOfIcon.tsx";
import GameHints from "./Game/GameHints.tsx";
const songs = playMusic();

const Game = () => {
  const store = useGameStore();
  const {isPlaying, volume, handlePlay, handlePause, handleVolumeOff, handleVolumeOn} = useAudioControl(songs);
  const {items, handleShowHint, resetGame, handlePlayLvlAgain, levels, startLevel, handleItemClick, timeLeft,
    secondElementRef,
  } = useGameLogic(songs);

  useEffect(canvas, []);
  console.log("rendered");
  return (
    <>
      <canvas id="particles"></canvas>
      {!store.isWinGame && <Timer timeLeft={timeLeft} ref={secondElementRef} />}
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
          <PlayPauseIcon isPlaying={isPlaying} handlePause={handlePause} handlePlay={handlePlay}/>
        )}
        <VolumeOnOfIcon volume={volume} handleVolumeOff={handleVolumeOff} handleVolumeOn={handleVolumeOn}/>
        <h2 className="text-xl text-white mb-1">
          level: {store.currentLevel + 1}
        </h2>
        {!store.isWinGame && (
          <GameBoard items={items} onItemClick={handleItemClick} contentType={store.selectedContentType}
            levelClass={levels[store.currentLevel].cls}
          />
        )}
        {!store.isWinGame && (
          <GameHints
            levels={levels}
            currentLevel={store.currentLevel}
            handlePlayLvlAgain={handlePlayLvlAgain}
            handleShowHint={handleShowHint}
          />
        )}
        <BtnNextLvl />
        {store.isWinGame && <FinishedLevels levels={levels} />}
      </div>
    </>
  );
};

export default Game;
