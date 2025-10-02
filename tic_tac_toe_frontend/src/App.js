import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional themed Tic Tac Toe
 * - Two players on the same device
 * - Responsive centered board with controls above/below
 * - Modern, minimalist UI with blue and amber accents
 */

// Helpers
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
export default function App() {
  /** App state for a simple local two-player game */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [round, setRound] = useState(1);

  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const draw = !winnerInfo && isBoardFull(squares);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const nextPlayerColor = xIsNext ? 'var(--primary)' : 'var(--secondary)';

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    if (squares[index] || winnerInfo) return;
    const next = squares.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);

    const win = calculateWinner(next);
    if (win) {
      if (win.player === 'X') setXScore((s) => s + 1);
      if (win.player === 'O') setOScore((s) => s + 1);
    } else if (isBoardFull(next)) {
      // draw - nothing special here beyond status text
    } else {
      setXIsNext(!xIsNext);
    }
  }

  // PUBLIC_INTERFACE
  function resetBoard(nextFirst = null) {
    setSquares(Array(9).fill(null));
    setRound((r) => r + 1);
    if (nextFirst === 'X') setXIsNext(true);
    else if (nextFirst === 'O') setXIsNext(false);
    else setXIsNext((prev) => !prev); // alternate starter by default
  }

  // PUBLIC_INTERFACE
  function resetAll() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setXScore(0);
    setOScore(0);
    setRound(1);
  }

  const status = (() => {
    if (winnerInfo) {
      return `Winner: ${winnerInfo.player}`;
    }
    if (draw) {
      return 'Draw';
    }
    return `Turn: ${currentPlayer}`;
  })();

  const subStatus = winnerInfo
    ? 'Tap "Next round" to continue'
    : draw
    ? 'No more moves'
    : `Player ${currentPlayer} to play`;

  const winningCells = winnerInfo ? new Set(winnerInfo.line) : new Set();

  return (
    <div className="ocean-app">
      <div className="ocean-wrap">
        <header className="ocean-header">
          <div className="brand">
            <span className="brand-logo" aria-hidden>◯</span>
            <div className="brand-text">
              <h1 className="title">Tic Tac Toe</h1>
              <p className="subtitle">Ocean Professional</p>
            </div>
          </div>

          <div className="score-card">
            <div className="score x">
              <span className="label">X</span>
              <span className="value">{xScore}</span>
            </div>
            <div className="divider" />
            <div className="score o">
              <span className="label">O</span>
              <span className="value">{oScore}</span>
            </div>
            <div className="round">Round {round}</div>
          </div>
        </header>

        <section className="controls top-controls">
          <div className="status">
            <span
              className={`badge ${winnerInfo ? 'win' : draw ? 'draw' : 'turn'}`}
              style={!winnerInfo && !draw ? { borderColor: nextPlayerColor } : undefined}
            >
              {status}
            </span>
            <span className="hint">{subStatus}</span>
          </div>
          <div className="actions">
            <button
              className="btn outline"
              onClick={resetAll}
              aria-label="Reset scores and board"
            >
              Reset all
            </button>
            <button
              className="btn primary"
              onClick={() => resetBoard()}
              aria-label="Next round"
            >
              Next round
            </button>
          </div>
        </section>

        <main className="board-wrap">
          <div className="board" role="grid" aria-label="Tic Tac Toe board">
            {squares.map((val, idx) => {
              const isWinning = winningCells.has(idx);
              return (
                <button
                  key={idx}
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}${val ? `, ${val}` : ''}`}
                  className={`cell ${val ? 'filled' : ''} ${isWinning ? 'win' : ''}`}
                  onClick={() => handleSquareClick(idx)}
                  disabled={Boolean(val) || Boolean(winnerInfo)}
                >
                  <span className={`mark ${val === 'X' ? 'x' : val === 'O' ? 'o' : ''}`}>
                    {val}
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        <section className="controls bottom-controls">
          <div className="swap">
            <span className="hint">Who starts next?</span>
            <div className="swap-actions">
              <button className="chip" onClick={() => resetBoard('X')} aria-label="X starts">
                X starts
              </button>
              <button className="chip amber" onClick={() => resetBoard('O')} aria-label="O starts">
                O starts
              </button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span className="muted">Built for two players on the same device.</span>
        </footer>
      </div>
    </div>
  );
}
