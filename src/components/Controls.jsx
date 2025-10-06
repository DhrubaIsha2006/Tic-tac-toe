// src/components/Controls.jsx
import React from 'react';

export default function Controls({
  mode, setMode, resetGame, undo, difficulty, setDifficulty, currentPlayer
}) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button className="btn btn-soft text-sm" onClick={resetGame}>Restart</button>
        <button className="btn btn-soft text-sm" onClick={undo}>Undo</button>

        <div className="rounded-md bg-white/70 px-3 py-1">
          <label className="text-xs mr-2">Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)} className="text-sm">
            <option value="local">Local</option>
            <option value="ai">Vs AI</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm">Turn</div>
        <div className="turn-pill px-3 py-1">
          <span className="font-semibold">{currentPlayer}</span>
        </div>

        {mode === 'ai' && (
          <div className="rounded-md bg-white/70 px-3 py-1 flex items-center gap-2">
            <label className="text-xs">AI</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="text-sm">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
