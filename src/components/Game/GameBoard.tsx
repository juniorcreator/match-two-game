import React from "react";
import type { GameBoardProps } from "../../types";

const GameBoard: React.FC<GameBoardProps> = ({
  items,
  onItemClick,
  contentType,
  levelClass,
}) => {
  return (
    <ul className={`list ${levelClass} ${contentType}`}>
      {items.map((item, index) => (
        <li
          key={index}
          onClick={() => onItemClick(index)}
          className={`list-item flip-card ${item.active ? "active" : ""} ${
            !item.clickable ? "notClickable" : ""
          }`}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front"></div>
            <div
              className={`flip-card-back flex items-center justify-center ${item.bgColor}`}
            >
              <h1>{item.content}</h1>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GameBoard;
