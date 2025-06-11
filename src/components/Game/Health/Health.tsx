import './Health.scss';
import useGameStore from "../../../store/game.ts";

const Health = () => {
    const store = useGameStore();
    return (
        <div className="text-white m-5">
            <h1>Health</h1>
            {store.health > 0 ? (<ul className='flex items-center'>
                {Array(store.health).fill('❤️').map((item, i) => (
                    <li className='p-1 text-xl' key={i}>{item}</li>
                ))}
            </ul>) : 0}
        </div>
    );
};

export default Health;