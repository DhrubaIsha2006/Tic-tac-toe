// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

import Board from './components/Board';
import Controls from './components/Controls';
import Scoreboard from './components/Scoreboard';

import { calculateWinner } from './utils/gameLogic';
import { pickBestMove } from './utils/minimax';

/**
 * Tic-Tac-Toe App.jsx
 * - AI plays 'O' using pickBestMove (minimax)
 * - Keyboard navigation (arrow keys + Enter/Space)
 * - Confetti on win
 * - localStorage for board + scores
 */

const EMPTY = Array(9).fill(null);
const AI_PLAYER = 'O';
const HUMAN_PLAYER = 'X';

export default function App() {
  // core game state
  const [board, setBoard] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ttt_board')) || [...EMPTY]; }
    catch { return [...EMPTY]; }
  });
  const [history, setHistory] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [mode, setMode] = useState('local'); // 'local' or 'ai'
  const [difficulty, setDifficulty] = useState('hard'); // easy | medium | hard
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ttt_scores')) || { X:0, O:0, tie:0 }; }
    catch { return { X:0, O:0, tie:0 }; }
  });
  const [winningLine, setWinningLine] = useState(null);

  // keyboard focus index for navigation
  const [focusIndex, setFocusIndex] = useState(0);

  // block interactions briefly while processing (e.g., confetti/AI)
  const processingRef = useRef(false);

  // persist board & scores
  useEffect(() => {
    try { localStorage.setItem('ttt_board', JSON.stringify(board)); } catch {}
  }, [board]);
  useEffect(() => {
    try { localStorage.setItem('ttt_scores', JSON.stringify(scores)); } catch {}
  }, [scores]);

  // evaluate board for winner or tie
  useEffect(() => {
    const { winner, line } = calculateWinner(board);
    if (winner) {
      // set winning line highlight
      setWinningLine(line);
      // update scores
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      // brief processing block to avoid double moves
      processingRef.current = true;
      // confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.5 },
          ticks: 200
        });
      } catch (e) {
        // confetti failing shouldn't crash app
        console.warn('confetti issue', e);
      }
      setTimeout(() => {
        processingRef.current = false;
      }, 900);
    } else if (board.every(Boolean)) {
      // tie
      setScores(prev => ({ ...prev, tie: prev.tie + 1 }));
      // small block
      processingRef.current = true;
      setTimeout(() => processingRef.current = false, 600);
    } else {
      setWinningLine(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  // handle AI turn when mode === 'ai' and it's AI's turn (AI plays 'O')
  useEffect(() => {
    let timer = null;
    const { winner } = calculateWinner(board);
    if (mode === 'ai' && currentPlayer === AI_PLAYER && !winner && !board.every(Boolean)) {
      // small delay to feel natural
      timer = setTimeout(() => {
        // set randomness by difficulty
        const randomness = difficulty === 'easy' ? 0.6 : difficulty === 'medium' ? 0.2 : 0;
        const idx = pickBestMove([...board], AI_PLAYER, HUMAN_PLAYER, randomness);
        if (idx !== undefined && idx !== null) {
          playAt(idx);
        }
      }, 420 + Math.floor(Math.random() * 220));
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, currentPlayer, mode, difficulty]);

  // core play logic
  function playAt(index) {
    if (processingRef.current) return;
    if (board[index]) return; // already filled
    if (calculateWinner(board).winner) return; // game over

    setHistory(h => [...h, board.slice()]);
    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);
    setCurrentPlayer(prev => (prev === 'X' ? 'O' : 'X'));
    setFocusIndex(index); // stay focused on played cell
  }

  // UI wrapper that prevents clicking while AI is 'thinking'
  function onPlay(i) {
    if (mode === 'ai' && currentPlayer === AI_PLAYER) return; // block user clicks during AI turn
    playAt(i);
  }

  function resetGame() {
    if (processingRef.current) return;
    setBoard([...EMPTY]);
    setHistory([]);
    setCurrentPlayer('X');
    setWinningLine(null);
    setFocusIndex(0);
  }

  function undo() {
    if (processingRef.current) return;
    if (!history.length) return;
    const prev = history[history.length - 1];
    setBoard(prev);
    setHistory(h => h.slice(0, -1));
    setCurrentPlayer(prevCur => (prevCur === 'X' ? 'O' : 'X'));
    setWinningLine(null);
  }

  // keyboard navigation handler: arrow keys + Enter/Space
  function handleKeyDown(e) {
    const rows = 3;
    if (['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Enter',' '].indexOf(e.key) === -1) return;

    e.preventDefault();
    if (e.key === 'ArrowRight') setFocusIndex(i => (i + 1) % 9);
    else if (e.key === 'ArrowLeft') setFocusIndex(i => (i + 8) % 9);
    else if (e.key === 'ArrowDown') setFocusIndex(i => (i + rows) % 9);
    else if (e.key === 'ArrowUp') setFocusIndex(i => (i + 9 - rows) % 9);
    else if (e.key === 'Enter' || e.key === ' ') onPlay(focusIndex);
  }

  // ensure focusIndex stays valid if board shrinks/changes
  useEffect(() => {
    if (focusIndex < 0) setFocusIndex(0);
    if (focusIndex > 8) setFocusIndex(8);
  }, [focusIndex]);

  // tiny UX: focus container to accept key events
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // focus so keydown works without clicking
    el.setAttribute('tabindex', '0');
    el.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-6"
      onKeyDown={handleKeyDown}
    >
      <div className="app-wrap panel w-full max-w-5xl">
        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center mb-6"
          style={{
            background: 'linear-gradient(90deg,#ff6b81,#7c3aed)',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Tic-Tac-Toe ✨
        </h1>

        {/* Main layout: Board + Controls + Score */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left: Board + Controls */}
          <div className="flex-1 flex flex-col items-center">
            <Board board={board} onPlay={onPlay} winningLine={winningLine} focusIndex={focusIndex} />
            <div className="w-full mt-4">
              <Controls
                mode={mode}
                setMode={setMode}
                resetGame={resetGame}
                undo={undo}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                currentPlayer={currentPlayer}
              />
            </div>
          </div>

          {/* Right: Scoreboard + action */}
          <div className="w-64 side-column">
            <Scoreboard scores={scores} />
            <button
              className="btn btn-accent text-white w-full mt-2"
              onClick={() => resetGame()}
            >
               Reset Game
            </button>

            <div className="mt-3 text-xs text-gray-500 text-center">
                Pro tip: Use arrow keys + Enter to play without touching your mouse.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



