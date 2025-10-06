// src/components/Square.jsx
import React from 'react';

export default function Square({ value, onClick, isHighlighted, isFocused, index }) {
  return (
    <button
      aria-label={`Square ${index}`}
      onClick={onClick}
      className={`square ${isHighlighted ? 'square--win pulse' : ''} ${isFocused ? 'ring-4 ring-indigo-300 scale-105' : ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      <div className="token" aria-hidden>
        {value === 'X' && (
          <svg viewBox="0 0 100 100" className="x-anim" width="100%" height="100%">
            <defs>
              <linearGradient id={`xgrad-${index}`} x1="0" x2="1">
                <stop offset="0%" stopColor="#ff6b81" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <g stroke={`url(#xgrad-${index})`} strokeWidth="10" strokeLinecap="round">
              <line x1="20" y1="20" x2="80" y2="80" />
              <line x1="80" y1="20" x2="20" y2="80" />
            </g>
          </svg>
        )}

        {value === 'O' && (
          <svg viewBox="0 0 100 100" className="o-anim" width="100%" height="100%">
            <defs>
              <linearGradient id={`ograd-${index}`} x1="0" x2="1">
                <stop offset="0%" stopColor="#08aeea" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="30" fill="none" stroke={`url(#ograd-${index})`} strokeWidth="8" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </button>
  );
}
