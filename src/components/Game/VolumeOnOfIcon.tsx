import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";

const VolumeOnOfIcon = ({volume, handleVolumeOff, handleVolumeOn}) => {
    return (
        <div className="absolute z-10 right-3 top-3">
            {volume ? (
                <VolumeOffIcon
                    onClick={handleVolumeOff}
                    sx={{fontSize: 30}}
                    className="cursor-pointer text-white"
                />
            ) : (
                <VolumeMuteIcon
                    onClick={handleVolumeOn}
                    sx={{fontSize: 30}}
                    className="cursor-pointer text-white"
                />
            )}
        </div>
    );
};

export default VolumeOnOfIcon;