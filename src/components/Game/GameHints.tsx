const GameHints = ({levels, currentLevel, handleShowHint, handlePlayLvlAgain}) => {
    return (
        <div className="mt-2">
            {levels[currentLevel].hintCount > 0 && (
                <button
                    onPointerDown={handleShowHint}
                    className="border-1 mr-2 rounded-sm text-white px-2 p-1 text-xs cursor-pointer hover:scale-105 transition duration-300 backdrop-blur"
                >
                    Hint available {levels[currentLevel].hintCount}
                </button>
            )}
            <button
                onPointerDown={handlePlayLvlAgain}
                className="border-1 rounded-sm text-white px-2 p-1 text-xs cursor-pointer hover:scale-105 transition duration-300 backdrop-blur"
            >
                Play {currentLevel + 1} lvl again
            </button>
        </div>
    );
};

export default GameHints;