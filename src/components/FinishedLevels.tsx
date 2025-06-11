const FinishedLevels = ({levels}) => {
    return (
        <>
            <h2 className="text-white">Finished levels:</h2>
            <ul className="text-white">
                {levels
                    .filter((item) => item.isFinished)
                    .map((item, index) => (
                        <li key={index}>
                            <span>Level: {item.boardLevel + 1}</span>
                            <span> Tries: {item.tries}</span>
                        </li>
                    ))}
            </ul>
        </>
    );
};

export default FinishedLevels;