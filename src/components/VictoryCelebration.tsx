import { useEffect } from "react";
import confetti from "canvas-confetti";

const VictoryCelebration = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 100,
        origin: { x: Math.random() * 0.4 }, // слева
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 100,
        origin: { x: 0.6 + Math.random() * 0.4 }, // справа
      });
    }, 400);

    return () => clearInterval(interval); // очистка по размонтированию
  }, []);

  return null;
};

export default VictoryCelebration;
