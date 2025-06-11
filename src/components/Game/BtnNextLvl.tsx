import useGameStore from "../../store/game.ts";
const BtnNextLvl = () => {
    const store = useGameStore();

    return (
        <>
            {!store.isWinGame && (
                <h3 className="text-xl text-white mt-4 gap-2">
                    <button
                        className="cursor-pointer px-6 py-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-400/40
               text-white font-semibold shadow-lg hover:scale-105
               hover:shadow-xl transition duration-300 backdrop-blur
               border border-white/20"
                        onPointerDown={store.updateCurrentLevel}
                    >
                        Next level lvl
                    </button>
                </h3>
            )}
        </>
    );
};

export default BtnNextLvl;