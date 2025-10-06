// src/components/Scoreboard.jsx
import React from 'react';

export default function Scoreboard({ scores }) {
  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="flex gap-3">
        <div className="score-card">
          <div className="text-sm text-gray-500">X</div>
          <div className="text-2xl font-extrabold" style={{ color: 'linear-gradient(90deg,#ff6b81,#7c3aed)' }}>
            {scores.X}
          </div>
        </div>

        <div className="score-card">
          <div className="text-sm text-gray-500">Ties</div>
          <div className="text-2xl font-extrabold">{scores.tie}</div>
        </div>

        <div className="score-card">
          <div className="text-sm text-gray-500">O</div>
          <div className="text-2xl font-extrabold">{scores.O}</div>
        </div>
      </div>

      <div className="text-sm text-gray-500 micro text-center px-2">
        Play locally with a friend or challenge the AI <br />
  on <strong>Hard</strong> mode.
      </div>
    </div>
  );
}
