// src/components/Board.jsx
import React from 'react';
import Square from './Square';

export default function Board({ board, onPlay, winningLine, focusIndex }) {
  return (
    <div className="w-full flex justify-center">
      <div className="board" role="grid" aria-label="Tic Tac Toe board">
        {board.map((val, i) => (
          <Square
            key={i}
            index={i}
            value={val}
            onClick={() => onPlay(i)}
            isHighlighted={winningLine?.includes(i)}
            isFocused={focusIndex === i}
          />
        ))}
      </div>
    </div>
  );
}
