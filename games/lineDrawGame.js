// Flow-style line draw puzzle where you connect colored pairs and fill the whole grid
// Integrates with the hosting shell (main.js): uses globals like gameBoard, buttonContainer,
// updateStats, createControlButton, showWinModal, audioManager, notes, currentMode, etc.

export const lineDrawGame = {
  setup: () => {
    const size = (currentMode && (currentMode.gridSize || currentMode.gridRows)) || 6;

    // Build a guaranteed-covering puzzle by creating a Hamiltonian path (serpentine)
    // and slicing it into multiple colored segments. Endpoints of each segment are the nodes.
    const puzzle = generateSerpentinePuzzle(size);

    // Game state lives on the global gameState (kept for compatibility with the shell)
    gameState = {
      size,
      board: Array(size * size).fill(0), // 0 = empty, >0 = color id occupying this cell
      pairs: puzzle.pairs,               // [{ c, s, e }]
      solution: puzzle.solution,         // Map color -> array of indices in order
      paths: {},                         // Map color -> current drawn path (array of indices)
      isDrawing: false,
      currentColor: 0,
      startNode: -1,
      gameOver: false,
      completedPaths: new Set(),
    };

    // Pre-create keys for paths
    gameState.pairs.forEach((p) => (gameState.paths[p.c] = []));

    // Draw grid tiles
    buildGrid(size);
    updateBoard();
    updateHUD();

    // Controls
    buttonContainer.innerHTML = '';
    buttonContainer.appendChild(
      createControlButton('Reset', 'btn-yellow', () => {
        resetBoard(false);
      }, 'restart_alt')
    );
    buttonContainer.appendChild(
      createControlButton('New', 'btn-blue', () => {
        lineDrawGame.cleanup();
        lineDrawGame.setup();
      }, 'auto_awesome')
    );

    // Pointer events (mouse + touch)
    gameBoard.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    gameBoard.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp, { passive: false });
  },

  cleanup: () => {
    gameBoard.removeEventListener('mousedown', onPointerDown);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
    gameBoard.removeEventListener('touchstart', onPointerDown);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('touchend', onPointerUp);
  },
};

// ---------------------- Helpers ---------------------- //

function buildGrid(size) {
  gameBoard.innerHTML = '';
  gameBoard.className = 'game-grid';
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement('div');
    tile.className = 'light is-empty';
    tile.dataset.index = i;
    gameBoard.appendChild(tile);
  }
}

function indexToRC(index, size) {
  return { r: Math.floor(index / size), c: index % size };
}

function neighbors4(index, size) {
  const { r, c } = indexToRC(index, size);
  const out = [];
  if (r > 0) out.push(index - size);
  if (r < size - 1) out.push(index + size);
  if (c > 0) out.push(index - 1);
  if (c < size - 1) out.push(index + 1);
  return out;
}

// Build a serpentine Hamiltonian path that fills the grid, then slice into segments
function generateSerpentinePuzzle(size) {
  const path = [];
  for (let r = 0; r < size; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < size; c++) path.push(r * size + c);
    } else {
      for (let c = size - 1; c >= 0; c--) path.push(r * size + c);
    }
  }

  // Choose segment count based on size to keep puzzles readable
  const minSeg = Math.max(3, Math.floor(size / 2));
  const maxSeg = Math.max(minSeg + 1, Math.floor(size * 1.25));
  const targetSegments = clamp(randInt(minSeg, maxSeg), 3, 10);

  // Partition the path into segments with min length 2
  const segments = chopPath(path, targetSegments, 2);

  const pairs = [];
  const solution = {};
  let color = 1;
  for (const seg of segments) {
    const s = seg[0];
    const e = seg[seg.length - 1];
    pairs.push({ c: color, s, e });
    solution[color] = seg.slice();
    color++;
  }

  // Shuffle colors to vary visuals
  shuffleColors(pairs, solution);

  return { pairs, solution };
}

function chopPath(path, k, minLen) {
  // Ensure we can create k segments where each segment has length >= minLen
  const N = path.length;
  const minTotal = k * minLen;
  const segments = [];
  if (minTotal > N) {
    k = Math.max(1, Math.floor(N / minLen));
  }

  // Randomly choose cut points, keeping head/tail sized >= minLen
  const cuts = new Set();
  while (cuts.size < k - 1) {
    const pos = randInt(minLen, N - minLen); // avoid tiny edges
    cuts.add(pos);
  }
  const sorted = [0, ...Array.from(cuts).sort((a, b) => a - b), N];
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const seg = path.slice(a, b);
    if (seg.length >= minLen) segments.push(seg);
  }

  // If we ended up with too few segments (rare), just split sequentially
  while (segments.length < k) {
    const longestIdx = segments.reduce((m, s, i, arr) => (s.length > arr[m].length ? i : m), 0);
    const longest = segments[longestIdx];
    if (longest.length <= minLen * 2) break;
    const mid = Math.floor(longest.length / 2);
    segments.splice(longestIdx, 1, longest.slice(0, mid), longest.slice(mid));
  }

  return segments;
}

function shuffleColors(pairs, solution) {
  // Re-map colors to a random permutation so visual colors vary
  const n = pairs.length;
  const map = [...Array(n)].map((_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [map[i], map[j]] = [map[j], map[i]];
  }
  const oldToNew = new Map();
  pairs.forEach((p, i) => oldToNew.set(i + 1, map[i]));
  pairs.forEach((p) => (p.c = oldToNew.get(p.c)));
  const newSolution = {};
  Object.entries(solution).forEach(([c, seg]) => {
    newSolution[oldToNew.get(+c)] = seg;
  });
  Object.keys(solution).forEach((k) => delete solution[k]);
  Object.assign(solution, newSolution);
}

function resetBoard(keepPairs) {
  const { size } = gameState;
  gameState.board = Array(size * size).fill(0);
  gameState.paths = {};
  gameState.completedPaths.clear();
  gameState.isDrawing = false;
  gameState.currentColor = 0;
  gameState.startNode = -1;
  gameState.gameOver = false;
  gameState.pairs.forEach((p) => (gameState.paths[p.c] = []));
  if (!keepPairs) {
    // Re-shuffle colors for variety while keeping endpoints the same
    const pairs = gameState.pairs.map((p) => ({ ...p }));
    const solCopy = { ...gameState.solution };
    shuffleColors(pairs, solCopy);
    gameState.pairs = pairs;
    gameState.solution = solCopy;
  }
  updateBoard();
  updateHUD();
}

function updateHUD() {
  const totalCells = gameState.size * gameState.size;
  const lit = totalCells - gameState.board.filter((v) => v === 0).length;
  const pct = Math.round((lit / totalCells) * 100);
  const done = gameState.completedPaths.size;
  const totalPairs = gameState.pairs.length;
  updateStats(`**Filled:** ${pct}% | **Pairs:** ${done}/${totalPairs}`);
}

function updateBoard() {
  const tiles = gameBoard.querySelectorAll('.light');
  tiles.forEach((tile) => (tile.className = 'light is-empty'));

  // Paint endpoints and paths
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    // If cell is an endpoint, color the dot background
    const endpoint = gameState.pairs.find((p) => p.s === i || p.e === i);
    if (endpoint) {
      tile.classList.remove('is-empty');
      tile.classList.add(`color-${endpoint.c}`, 'line-dot');
    }

    // Path color occupying this cell
    const color = gameState.board[i];
    if (color > 0) {
      tile.classList.remove('is-empty');
      tile.classList.add(`path-${color}`);
      if (gameState.completedPaths.has(color)) tile.classList.add('is-highlight');
    }
  }
}

function canStep(nextIdx) {
  const color = gameState.currentColor;
  const path = gameState.paths[color];
  const last = path[path.length - 1];

  // Must be orthogonal neighbor
  if (!neighbors4(last, gameState.size).includes(nextIdx)) return false;

  // Empty cell is always ok
  if (gameState.board[nextIdx] === 0) return true;

  // Otherwise you can enter only if it's your own endpoint and you're finishing
  const isOwnEnd = gameState.pairs.some((p) => p.c === color && (p.s === nextIdx || p.e === nextIdx));
  return isOwnEnd;
}

function onPointerDown(e) {
  if (gameState.gameOver) return;
  const target = (e.target && e.target.closest('.light')) || null;
  if (!target) return;
  e.preventDefault();
  const index = +target.dataset.index;

  // Can start only on any endpoint (either end of a pair)
  const pair = gameState.pairs.find((p) => p.s === index || p.e === index);
  if (!pair) return;

  // If this color had been completed, reopen it
  if (gameState.completedPaths.has(pair.c)) gameState.completedPaths.delete(pair.c);

  // Clear any existing path for this color (except endpoints from other colors)
  const old = gameState.paths[pair.c] || [];
  old.forEach((i) => {
    const isEndpointOfAny = gameState.pairs.some((p) => p.s === i || p.e === i);
    if (!isEndpointOfAny) gameState.board[i] = 0;
  });

  gameState.isDrawing = true;
  gameState.currentColor = pair.c;
  gameState.startNode = index;
  gameState.paths[pair.c] = [index];
  gameState.board[index] = pair.c;

  ping(pair.c, 0);
  updateBoard();
}

function onPointerMove(e) {
  if (gameState.gameOver || !gameState.isDrawing) return;
  const { x, y } = pickXY(e);
  const el = document.elementFromPoint(x, y);
  if (!el || !el.matches('.light')) return;
  const index = +el.dataset.index;

  const color = gameState.currentColor;
  const path = gameState.paths[color];
  const last = path[path.length - 1];

  if (index === last) return;

  // Backtrack one step if we moved onto the previous tile
  if (path.length > 1 && index === path[path.length - 2]) {
    gameState.board[last] = 0;
    path.pop();
    ping(color, -1); // lower octave for backtrack
    updateBoard();
    updateHUD();
    return;
  }

  if (!canStep(index)) return;

  // Can't draw over other colors
  if (gameState.board[index] !== 0) {
    // allow only if it is the correct endpoint (handled in canStep)
  }

  path.push(index);
  gameState.board[index] = color;
  ping(color, +1);
  updateBoard();
  updateHUD();
}

function onPointerUp() {
  if (!gameState.isDrawing) return;

  const color = gameState.currentColor;
  const path = gameState.paths[color];
  const pair = gameState.pairs.find((p) => p.c === color);

  const endNode = path[path.length - 1];
  const targetEnd = pair.s === gameState.startNode ? pair.e : pair.s;

  if (endNode !== targetEnd) {
    // Not finished: keep whatever was drawn (common Flow UX clears, but keeping is friendlier)
    // Optionally, uncomment to clear unfinished lines:
    // path.forEach((i) => {
    //   const isEndpoint = gameState.pairs.some((p) => p.s === i || p.e === i);
    //   if (!isEndpoint) gameState.board[i] = 0;
    // });
    // gameState.paths[color] = [];
    audioManager && audioManager.playSound && audioManager.playSound('ui', 'E3', '16n');
  } else {
    // Completed this color
    gameState.completedPaths.add(color);
    audioManager && audioManager.playSound && audioManager.playSound('positive', 'G4', '8n');
  }

  gameState.isDrawing = false;
  updateBoard();
  updateHUD();
  checkWin();
}

function checkWin() {
  if (gameState.gameOver) return;
  const allPaired = gameState.pairs.every((p) => {
    const path = gameState.paths[p.c];
    if (!path || path.length < 2) return false;
    const ends = [path[0], path[path.length - 1]].sort((a, b) => a - b);
    const req = [p.s, p.e].sort((a, b) => a - b);
    return ends[0] === req[0] && ends[1] === req[1];
  });
  const allFilled = !gameState.board.includes(0);

  if (allPaired && allFilled) {
    gameState.gameOver = true;
    updateBoard();
    setTimeout(() => showWinModal('You Win!', 'You connected all the pairs and filled the board!'), 50);
  }
}

function ping(color, dir = +1) {
  if (!audioManager || !audioManager.playSound) return;
  const base = notes[(color - 1) % notes.length];
  const name = base.slice(0, -1);
  const oct = parseInt(base.slice(-1), 10) + (dir > 0 ? 0 : -1);
  audioManager.playSound('game', `${name}${oct}`, '16n');
}

function pickXY(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// ---------------------- Debug / Dev Utilities ---------------------- //
// Press "H" to auto-solve by laying down the solution for any unfinished color
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() !== 'h' || gameState.gameOver) return;
  const nextPair = gameState.pairs.find((p) => (gameState.paths[p.c] || []).length < 2);
  if (!nextPair) return;
  const seg = gameState.solution[nextPair.c];
  for (const idx of seg) gameState.board[idx] = nextPair.c;
  gameState.paths[nextPair.c] = seg.slice();
  gameState.completedPaths.add(nextPair.c);
  updateBoard();
  updateHUD();
  checkWin();
});
