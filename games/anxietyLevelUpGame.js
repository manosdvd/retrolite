<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anxiety Level Up 2</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #111827; /* bg-gray-900 */
        }
        .modal {
            background-color: rgba(17, 24, 39, 0.8);
            backdrop-filter: blur(8px);
        }
        .game-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        .game-container {
            background: linear-gradient(145deg, #1f2937, #374151);
            border-radius: 1.5rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
            border: 1px solid #4b5563;
            max-width: 500px;
            width: 100%;
        }
        .grid-wrapper {
            background-color: rgba(17, 24, 39, 0.7);
            border-radius: 1rem;
            padding: 0.75rem;
            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.5);
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 5px;
            aspect-ratio: 8 / 10;
            position: relative;
        }
        .preview-container {
            background-color: rgba(17, 24, 39, 0.5);
            padding: 0.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
        }
        .preview-row {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 5px;
            height: 35px;
        }
        .cell {
            background-color: rgba(55, 65, 81, 0.5);
            border-radius: 6px;
            position: relative;
            aspect-ratio: 1 / 1;
            transition: background-color 0.2s;
        }
        .cell.selected-outline {
            background-color: transparent;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.8); /* blue-500 */
            z-index: 10;
        }
        .light {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 6px;
            box-shadow: inset 0 2px 2px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0,0,0,0.3);
            will-change: opacity, box-shadow;
        }
        .light.dropping {
            animation: digital-drop 0.3s steps(3, end) forwards;
        }
        .light.clearing {
            animation: digital-clear 0.2s ease-out forwards;
        }
        /* UPDATED: Longer animation duration for a slower fade */
        .light.settling {
            animation: settle-glow 0.8s ease-out forwards;
        }
        @keyframes digital-drop {
            0% { opacity: 0; }
            33% { opacity: 1; }
            66% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        @keyframes digital-clear {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        /* UPDATED: Keyframes for a slow fade-out effect */
        @keyframes settle-glow {
            from {
                box-shadow: 0 0 18px 4px rgba(255, 255, 255, 0.7);
            }
            to {
                box-shadow: inset 0 2px 2px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0,0,0,0.3);
            }
        }
        .color-1 { background: radial-gradient(circle, #ef4444, #b91c1c); } /* red */
        .color-2 { background: radial-gradient(circle, #3b82f6, #1d4ed8); } /* blue */
        .color-3 { background: radial-gradient(circle, #22c55e, #15803d); } /* green */
        .color-4 { background: radial-gradient(circle, #eab308, #a16207); } /* yellow */
        .color-5 { background: radial-gradient(circle, #a855f7, #7e22ce); } /* purple */
        .grid.paused::after {
            content: 'PAUSED';
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.6);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            letter-spacing: 0.2em;
            border-radius: 1rem;
            z-index: 20;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-200 flex items-center justify-center min-h-screen p-4">

    <div id="game-board-wrapper" class="relative w-full max-w-lg">
        <!-- Game content will be injected here -->
    </div>

    <script>
        const anxietyLevelUpGame = {
            gameLoopTimeoutId: null,
            synth: null,
            isProcessing: false,
            isPaused: false,
            gameOver: false,
            currentInterval: 1000,

            setup: function() {
                const gameBoardWrapper = document.getElementById('game-board-wrapper');
                gameBoardWrapper.innerHTML = `
                    <div class="game-wrapper">
                        <div id="game-container-anxiety" class="game-container p-4 md:p-6 flex flex-col">
                            <div class="flex justify-between items-center mb-4">
                                <div class="flex items-baseline space-x-4">
                                    <h1 class="font-bold text-2xl md:text-3xl tracking-widest text-white">ANXIETY 2</h1>
                                    <div>
                                        <span class="font-semibold text-lg">LVL:</span>
                                        <span id="level" class="font-bold text-blue-300 text-lg">1</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="font-semibold text-lg">SCORE</div>
                                    <div id="score" class="font-bold text-yellow-300 text-lg">0 / 700</div>
                                </div>
                            </div>
                            <div class="preview-container">
                                <p class="text-center text-sm text-gray-400 mb-2">NEXT</p>
                                <div id="preview-row" class="preview-row"></div>
                            </div>
                            <div id="grid-wrapper" class="grid-wrapper">
                                <div id="grid" class="grid"></div>
                            </div>
                            <div id="controls-area" class="mt-4">
                                <div class="text-center text-sm text-gray-400 mb-2">
                                    <p>Next row in: <span id="interval-display" class="font-bold text-cyan-300">1.00</span>s</p>
                                </div>
                                <button id="pause-button" class="w-full py-3 mt-2 rounded-lg text-xl font-bold tracking-wider bg-gray-600 hover:bg-gray-500 text-white transition-transform transform hover:scale-105">
                                    PAUSE
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="game-over-modal" class="absolute inset-0 z-20 flex-col items-center justify-center text-center p-4 modal hidden">
                        <div class="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-red-500">
                            <h2 class="text-5xl font-bold text-red-500 mb-4 tracking-widest">GAME OVER</h2>
                            <div class="text-xl space-y-2 mb-6">
                                <p>Final Level: <span id="final-level" class="font-bold text-white">1</span></p>
                                <p>Final Score: <span id="final-score" class="font-bold text-yellow-300">0</span></p>
                            </div>
                            <button id="restart-button" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105">
                                RESTART
                            </button>
                        </div>
                    </div>
                    <div id="start-modal" class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4 modal">
                        <div class="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-blue-500 max-w-lg">
                            <h2 class="text-4xl md:text-5xl font-bold text-blue-400 mb-4 tracking-widest">LEVELING MODE</h2>
                            <p class="text-lg mb-6 text-gray-300">Match 3+ blocks to score points. Don't let the grid fill up!</p>
                            <div class="mb-8">
                                <label for="level-select" class="text-gray-400 mr-2 text-lg">STARTING LEVEL:</label>
                                <select id="level-select" class="bg-gray-700 text-white p-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                                    <option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option>
                                </select>
                            </div>
                            <button id="start-button" class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-2xl transition-transform transform hover:scale-105">
                                START GAME
                            </button>
                        </div>
                    </div>
                `;

                const self = this;

                // --- Game Configuration ---
                const GRID_WIDTH = 8;
                const GRID_HEIGHT = 10;
                const STARTING_ROWS = 5;
                const COLORS = [1, 2, 3, 4, 5];
                const INITIAL_INTERVAL_MS = 1000;
                const LEVEL_INTERVAL_DECREMENT_MS = 75;
                const MIN_INTERVAL_MS = 150;
                const BOARD_CLEAR_BONUS = 10000;
                const LEVEL_THRESHOLDS = [700, 2000, 4500, 6000, 10000, 15000, 25000, 30000, 40000, 50000];
                const ANIMATION_DELAY = 250; 

                // --- DOM Elements ---
                const gridElement = document.getElementById('grid');
                const previewRowElement = document.getElementById('preview-row');
                const scoreElement = document.getElementById('score');
                const levelElement = document.getElementById('level');
                const intervalDisplayElement = document.getElementById('interval-display');
                const gameOverModal = document.getElementById('game-over-modal');
                const finalScoreElement = document.getElementById('final-score');
                const finalLevelElement = document.getElementById('final-level');
                const restartButton = document.getElementById('restart-button');
                const startModal = document.getElementById('start-modal');
                const startButton = document.getElementById('start-button');
                const levelSelectElement = document.getElementById('level-select');
                const pauseButton = document.getElementById('pause-button');

                // --- Game State ---
                let grid = [];
                let previewRow = [];
                let score = 0;
                let level = 1;
                let selectedCell = null;

                // --- Audio & Haptics (unchanged) ---
                const audio = {
                    start: () => {
                        try {
                            if (Tone.context.state !== 'running') { Tone.start(); }
                            self.synth = new Tone.PolySynth(Tone.Synth).toDestination();
                        } catch (e) { console.error('Audio context failed to start.'); }
                    },
                    select: () => self.synth?.triggerAttackRelease('C5', '8n'),
                    swap: () => self.synth?.triggerAttackRelease('G4', '8n'),
                    levelUp: () => self.synth?.triggerAttackRelease(['C5', 'G5', 'C6'], '4n'),
                    clear: (count) => {
                        const notes = ['C4', 'E4', 'G4', 'A4', 'C5'];
                        const now = Tone.now();
                        for (let i = 0; i < Math.min(count, notes.length); i++) {
                            self.synth?.triggerAttackRelease(notes[i], '16n', now + i * 0.07);
                        }
                    },
                    drop: () => self.synth?.triggerAttackRelease('C3', '8n'),
                    gameOver: () => self.synth?.triggerAttackRelease(['C4', 'F#3', 'C3'], '1n'),
                    boardClear: () => self.synth?.triggerAttackRelease(['C5', 'E5', 'G5', 'C6'], '0.5n'),
                };
                const haptics = {
                    vibrate: (pattern) => { if (navigator.vibrate) navigator.vibrate(pattern); },
                    select: () => haptics.vibrate(20),
                    swap: () => haptics.vibrate(30),
                    levelUp: () => haptics.vibrate([100, 50, 100]),
                    clear: () => haptics.vibrate([50, 30, 50]),
                    drop: () => haptics.vibrate(75),
                    gameOver: () => haptics.vibrate([100, 50, 100, 50, 200]),
                };

                // --- Core Game Logic ---
                function init(startingLevel = 1) {
                    level = startingLevel;
                    score = level > 1 ? LEVEL_THRESHOLDS[level - 2] : 0;
                    self.gameOver = false;
                    self.isPaused = false;
                    self.isProcessing = false;
                    selectedCell = null;

                    updateLevelDisplay();
                    updateScoreDisplay();
                    updateIntervalForLevel();

                    gameOverModal.classList.add('hidden');
                    pauseButton.textContent = 'PAUSE';
                    gridElement.classList.remove('paused');

                    grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
                    previewRow = Array(GRID_WIDTH).fill(0);

                    for (let y = GRID_HEIGHT - STARTING_ROWS; y < GRID_HEIGHT; y++) {
                        for (let x = 0; x < GRID_WIDTH; x++) {
                            grid[y][x] = COLORS[Math.floor(Math.random() * COLORS.length)];
                        }
                    }

                    createGridDOM();
                    createPreviewDOM();
                    renderGrid();

                    if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
                    self.gameLoopTimeoutId = setTimeout(gameLoop, self.currentInterval);
                }

                // --- Action Handlers ---
                function handleCellClick(event) {
                    if (self.gameOver || self.isProcessing || self.isPaused) return;

                    const cellElement = event.target.closest('.cell');
                    if (!cellElement || !cellElement.dataset.index) return;

                    const index = parseInt(cellElement.dataset.index, 10);
                    const x = index % GRID_WIDTH;
                    const y = Math.floor(index / GRID_WIDTH);

                    if (selectedCell) {
                        const { x: selX, y: selY } = selectedCell;
                        
                        const prevSelIndex = selY * GRID_WIDTH + selX;
                        gridElement.children[prevSelIndex]?.classList.remove('selected-outline');

                        if ((selX === x && selY === y) || grid[y][x] === 0) {
                            selectedCell = null;
                        } else {
                            haptics.swap();
                            audio.swap();
                            
                            [grid[selY][selX], grid[y][x]] = [grid[y][x], grid[selY][selX]];
                            
                            renderGrid();

                            selectedCell = null;

                            self.isProcessing = true;
                            setTimeout(processGameTurn, 50);
                        }
                    } else {
                        if (grid[y][x] > 0) {
                            haptics.select();
                            audio.select();
                            selectedCell = { x, y };
                            cellElement.classList.add('selected-outline');
                        }
                    }
                }

                async function processGameTurn() {
                    await checkClearAndDropLoop();
                    if (!self.gameOver) {
                        self.isProcessing = false;
                    }
                }

                // --- Game Loop ---
                function gameLoop() {
                    if (self.gameOver || self.isPaused) return;

                    addBlockToPreview();

                    if (previewRow.indexOf(0) === -1) {
                        self.isProcessing = true;
                        
                        if (grid[0].some((cell, index) => cell !== 0 && previewRow[index] !== 0)) {
                            triggerGameOver();
                            return;
                        }

                        audio.drop();
                        haptics.drop();

                        for (let x = 0; x < GRID_WIDTH; x++) {
                            if (grid[0][x] === 0) {
                                grid[0][x] = previewRow[x];
                            }
                        }

                        previewRow = Array(GRID_WIDTH).fill(0);
                        renderPreview();
                        
                        const settledBlocks = applyGravity();
                        
                        renderGrid({ animateTopRow: true, settlingIndices: settledBlocks });

                        setTimeout(processGameTurn, ANIMATION_DELAY);
                    }

                    if (!self.gameOver && !self.isPaused) {
                        self.gameLoopTimeoutId = setTimeout(gameLoop, self.currentInterval);
                    }
                }
                
                // --- Game Flow & Sub-routines ---
                async function checkClearAndDropLoop() {
                    let chain = 0;
                    while (!self.gameOver) {
                        const matches = findMatches();
                        if (matches.size === 0) break;

                        chain++;
                        haptics.clear();
                        audio.clear(matches.size);
                        updateScore(matches.size, chain);

                        await clearMatches(matches);
                        await new Promise(r => setTimeout(r, ANIMATION_DELAY));

                        const settledBlocks = applyGravity();
                        renderGrid({ settlingIndices: settledBlocks }); 
                        await new Promise(r => setTimeout(r, ANIMATION_DELAY));
                    }
                    await checkForBoardClear();
                }

                function findMatches() {
                    const matches = new Set();
                    // Horizontal
                    for (let y = 0; y < GRID_HEIGHT; y++) {
                        for (let x = 0; x < GRID_WIDTH - 2; x++) {
                            const color = grid[y][x];
                            if (color > 0 && color === grid[y][x + 1] && color === grid[y][x + 2]) {
                                let length = 3;
                                while (x + length < GRID_WIDTH && grid[y][x + length] === color) length++;
                                for (let i = 0; i < length; i++) matches.add(`${x + i},${y}`);
                                x += length - 1;
                            }
                        }
                    }
                    // Vertical
                    for (let x = 0; x < GRID_WIDTH; x++) {
                        for (let y = 0; y < GRID_HEIGHT - 2; y++) {
                            const color = grid[y][x];
                            if (color > 0 && color === grid[y + 1][x] && color === grid[y + 2][x]) {
                                let length = 3;
                                while (y + length < GRID_HEIGHT && grid[y + length][x] === color) length++;
                                for (let i = 0; i < length; i++) matches.add(`${x},${y + i}`);
                                y += length - 1;
                            }
                        }
                    }
                    return matches;
                }

                function clearMatches(matches) {
                    const clearingCells = [];
                    matches.forEach(coord => {
                        const [x, y] = coord.split(',').map(Number);
                        const index = y * GRID_WIDTH + x;
                        clearingCells.push(index);
                        grid[y][x] = 0;
                    });
                    renderGrid({ clearingIndices: clearingCells });
                }

                function applyGravity() {
                    const settledBlocks = [];
                    for (let x = 0; x < GRID_WIDTH; x++) {
                        const blocksInColumn = [];
                        for (let y = 0; y < GRID_HEIGHT; y++) {
                            if (grid[y][x] !== 0) {
                                blocksInColumn.push(grid[y][x]);
                            }
                        }
                        const newColumn = Array(GRID_HEIGHT).fill(0);
                        const firstBlockIndex = GRID_HEIGHT - blocksInColumn.length;
                        for (let i = 0; i < blocksInColumn.length; i++) {
                            const newY = firstBlockIndex + i;
                            newColumn[newY] = blocksInColumn[i];
                            if (grid[newY][x] !== blocksInColumn[i]) {
                                settledBlocks.push(newY * GRID_WIDTH + x);
                            }
                        }
                        for (let y = 0; y < GRID_HEIGHT; y++) {
                            grid[y][x] = newColumn[y];
                        }
                    }
                    return settledBlocks;
                }


                async function checkForBoardClear() {
                    const isClear = grid.every(row => row.every(cell => cell === 0));
                    if (isClear) {
                        audio.boardClear();
                        score += BOARD_CLEAR_BONUS;
                        updateScoreDisplay();
                    }
                }

                // --- UI & Utility Functions ---
                function createGridDOM() {
                    gridElement.innerHTML = '';
                    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
                        const cell = document.createElement('div');
                        cell.classList.add('cell');
                        cell.dataset.index = i;
                        gridElement.appendChild(cell);
                    }
                }

                function createPreviewDOM() {
                    previewRowElement.innerHTML = '';
                    for (let i = 0; i < GRID_WIDTH; i++) {
                        const cell = document.createElement('div');
                        cell.classList.add('cell');
                        previewRowElement.appendChild(cell);
                    }
                }
                
                function renderGrid(options = {}) {
                    const { animateTopRow = false, clearingIndices = [], settlingIndices = [] } = options;

                    for (let y = 0; y < GRID_HEIGHT; y++) {
                        for (let x = 0; x < GRID_WIDTH; x++) {
                            const index = y * GRID_WIDTH + x;
                            const cell = gridElement.children[index];
                            if (!cell) continue;

                            cell.innerHTML = '';

                            const colorValue = grid[y][x];
                            if (colorValue > 0) {
                                const light = document.createElement('div');
                                light.className = `light color-${colorValue}`;
                                
                                if (animateTopRow && y === 0) {
                                    light.classList.add('dropping');
                                }
                                if (settlingIndices.includes(index)) {
                                    light.classList.add('settling');
                                }
                                
                                cell.appendChild(light);
                            }

                            if (clearingIndices.includes(index)) {
                                const tempLight = document.createElement('div');
                                tempLight.className = `light color-${Math.floor(Math.random() * 5) + 1} clearing`;
                                cell.appendChild(tempLight);
                            }
                        }
                    }
                }
                
                function addBlockToPreview() {
                    if (self.gameOver) return;
                    const emptyIndex = previewRow.indexOf(0);
                    if (emptyIndex !== -1) {
                        previewRow[emptyIndex] = COLORS[Math.floor(Math.random() * COLORS.length)];
                        renderPreview();
                    }
                }

                function renderPreview() {
                    for (let x = 0; x < GRID_WIDTH; x++) {
                        const cell = previewRowElement.children[x];
                        if (!cell) continue;
                        const colorValue = previewRow[x];
                        let light = cell.querySelector('.light');
                        if (colorValue > 0) {
                            if (!light) {
                                light = document.createElement('div');
                                light.classList.add('light');
                                cell.appendChild(light);
                            }
                            light.className = `light color-${colorValue}`;
                        } else if (light) {
                            cell.removeChild(light);
                        }
                    }
                }

                function updateScore(clearedCount, chain) {
                    const baseScore = clearedCount * 10;
                    const chainBonus = Math.pow(2, chain) * 10;
                    score += baseScore + chainBonus;
                    updateScoreDisplay();
                    checkLevelUp();
                }

                function checkLevelUp() {
                    if (level - 1 < LEVEL_THRESHOLDS.length && score >= LEVEL_THRESHOLDS[level - 1]) {
                        level++;
                        audio.levelUp();
                        haptics.levelUp();
                        updateLevelDisplay();
                        updateIntervalForLevel();
                    }
                }

                function updateScoreDisplay() {
                    const nextThreshold = LEVEL_THRESHOLDS[level - 1] || 'MAX';
                    scoreElement.textContent = `${Math.round(score)} / ${nextThreshold}`;
                }

                function updateLevelDisplay() {
                    levelElement.textContent = level;
                }

                function updateIntervalForLevel() {
                    self.currentInterval = Math.max(MIN_INTERVAL_MS, INITIAL_INTERVAL_MS - (level - 1) * LEVEL_INTERVAL_DECREMENT_MS);
                    intervalDisplayElement.textContent = (self.currentInterval / 1000).toFixed(2);
                }

                function triggerGameOver() {
                    if (self.gameOver) return;
                    self.gameOver = true;
                    self.isProcessing = true;
                    if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
                    
                    audio.gameOver();
                    haptics.gameOver();

                    finalLevelElement.textContent = level;
                    finalScoreElement.textContent = Math.round(score);

                    gameOverModal.classList.remove('hidden');
                    gameOverModal.classList.add('flex');
                }

                function togglePause() {
                    if (self.gameOver) return;
                    self.isPaused = !self.isPaused;
                    if (self.isPaused) {
                        clearTimeout(self.gameLoopTimeoutId);
                        pauseButton.textContent = 'RESUME';
                        gridElement.classList.add('paused');
                    } else {
                        pauseButton.textContent = 'PAUSE';
                        gridElement.classList.remove('paused');
                        self.gameLoopTimeoutId = setTimeout(gameLoop, self.currentInterval);
                    }
                }

                // --- Event Listeners ---
                startButton.addEventListener('click', () => {
                    audio.start();
                    startModal.classList.add('hidden');
                    const startingLevel = parseInt(levelSelectElement.value, 10);
                    init(startingLevel);
                });

                restartButton.addEventListener('click', () => {
                    init();
                });

                pauseButton.addEventListener('click', togglePause);
                gridElement.addEventListener('click', handleCellClick);
            }
        };

        // Initialize the game setup
        anxietyLevelUpGame.setup();
    </script>
</body>
</html>

