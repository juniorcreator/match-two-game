import "./ChooseGameBlock.scss";
import { useEffect, useState } from "react";
import useGameStore from "../../store/game.ts";
// import { resetSound } from "../../utils/soundUtils.ts";
import { useAudioPlayer } from "../../hooks/useAudioPlayer.ts";

const ChooseGameBlock = () => {
  const [elements] = useState([
    {
      name: "emoji",
      example: "🐶🐱🐭🐹",
    },
    {
      name: "numbers",
      example: "1234",
    },
    {
      name: "food",
      example: "🍎🍌🍓🍇",
    },
  ]);
  const store = useGameStore();
  const { playSwitchSound, preloadSwitchSound } = useAudioPlayer();

  useEffect(() => {
    preloadSwitchSound();
  }, []);

  return (
      <div>
        <div className="elements flex flex-col items-center m-2 relative z-10">
          <ul className="p-1 w-32 flex justify-center items-center gap-2">
            {elements.map((item) => (
                <li
                    onClick={() => {
                      store.setItemContent(item.name);
                      playSwitchSound();
                    }}
                    className={`elements-list text-white p-2 flex flex-col items-center min-w-[100px] border-1 mb-1 rounded-sm text-white px-2 p-1 text-sm cursor-pointer hover:scale-105 transition duration-300 backdrop-blur ${
                        item.name === store.selectedContentType && "active"
                    }`}
                    key={item.name}
                >
                  <div>{item.example}</div>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default ChooseGameBlock;
