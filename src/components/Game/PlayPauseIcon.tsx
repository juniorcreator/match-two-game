import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import NotStartedIcon from "@mui/icons-material/NotStarted";

const PlayPauseIcon = ({isPlaying, handlePause, handlePlay}) => {
    return (
        <div className="relative z-10">
            {isPlaying ? (
                <PauseCircleIcon
                    onClick={handlePause}
                    sx={{fontSize: 30}}
                    className="cursor-pointer text-white"
                />
            ) : (
                <NotStartedIcon
                    onClick={handlePlay}
                    sx={{fontSize: 30}}
                    className="cursor-pointer text-white"
                />
            )}
        </div>
    );
};

export default PlayPauseIcon;