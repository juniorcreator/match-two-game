import "./GameStatus.scss";
import { createPortal } from "react-dom";
import useGameStore from "../../../store/game.ts";
import VictoryCelebration from "../VictoryCelebration.tsx";

const GameStatus = ({ onStartGame, onTimeIsUp, onWinLvl, onResetGame }) => {
  const store = useGameStore();

  const startGame = (
    <div className="game-status absolute left-0 top-0 w-full h-full">
      <div className="h-full flex justify-center items-center">
        <div
            onPointerDown={() => {
            store.setStartGame(true);
            onStartGame();
          }}
          className="game-status-btn bg-blue-400/50 cursor-pointer p-3 text-white hover:scale-105 transition duration-300 backdrop-blur"
        >
          Start Game
        </div>
      </div>
    </div>
  );
  const timeIsUp = (
    <div className="game-status absolute left-0 top-0 w-full h-full">
      <div className="h-full flex justify-center items-center">
        <div
            onPointerDown={onTimeIsUp}
          className="game-status-btn cursor-pointer bg-blue-400/50 p-3 text-white hover:scale-105 transition duration-300 backdrop-blur"
        >
          Time is up, restart?
        </div>
      </div>
    </div>
  );
  const winLvl = (
    <div className="game-status absolute left-0 top-0 w-full h-full">
      <div className="h-full flex flex-col justify-center items-center">
        <div
            onPointerDown={() => {
            onWinLvl();
          }}
          className="game-status-btn cursor-pointer bg-blue-400/50 p-3 text-white hover:scale-105 transition duration-300 backdrop-blur"
        >
          Start This Lvl {store.currentLevel + 1}
        </div>
      </div>
    </div>
  );
  const winGame = (
    <div className="game-status absolute left-0 top-0 w-full h-full">
      <div className="h-full flex justify-center items-center">
        <VictoryCelebration />
        <div
            onPointerDown={() => {
            onResetGame();
          }}
          className="game-status-btn cursor-pointer bg-blue-400/50 p-3 text-white hover:scale-105 transition duration-300 backdrop-blur"
        >
          Start game again?
        </div>
      </div>
    </div>
  );
  const gameOver = (
    <div className="game-status absolute left-0 top-0 w-full h-full">
      <div className="h-full flex justify-center items-center">
        <div
            onPointerDown={() => {
            // store.setStartGame(false);
          }}
          className="game-status-btn cursor-pointer bg-blue-400/50 p-3 text-white hover:scale-105 transition duration-300 backdrop-blur"
        >
          Game is over :(
        </div>
      </div>
    </div>
  );
  if (!store.isGameStarted) {
    return <>{createPortal(startGame, document.body)}</>;
  }
  if (store.isTimeIsUp && !store.isGameOver) {
    console.log(store.isTimeIsUp, " store.isTimeIsUp");
    return <>{createPortal(timeIsUp, document.body)}</>;
  }
  if (store.isGameOver) {
    console.log(store.isTimeIsUp, " store.isTimeIsUp");
    return <>{createPortal(gameOver, document.body)}</>;
  }
  if (store.isFinishedLvl && !store.isWinGame && store.showNextLevel) {
    console.log(store.isTimeIsUp, " store.isTimeIsUp");
    return <>{createPortal(winLvl, document.body)}</>;
  }
  if (store.isWinGame) {
    console.log(store.isTimeIsUp, " store.isTimeIsUp");
    return <>{createPortal(winGame, document.body)}</>;
  }
};

export default GameStatus;
