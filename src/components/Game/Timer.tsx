import { formatTime } from "../../utils";

const Timer = ({ timeLeft, ref }) => {
  return (
    <div className="text-white">
      Timer{" "}
      <span id="timer" ref={ref}>
        {formatTime(timeLeft.current)}
      </span>
    </div>
  );
};

export default Timer;
