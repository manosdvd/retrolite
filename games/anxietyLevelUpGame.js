const anxietyLevelUpGame = {
    gameLoopTimeoutId: null,
    synth: null,
    isProcessing: false,
    gameOver: false,

    setup: function() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.add('anxiety-level-up-active');

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
                            <div id="score" class="font-bold text-yellow-300 text-lg">0 / 1500</div>
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
                    <p class="text-lg mb-6 text-gray-300">Score points to level up and increase the speed. Don't let the grid fill up!</p>
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
        const LEVEL_INTERVAL_DECREMENT_MS = 75; // Speed increase per level
        const MIN_INTERVAL_MS = 150;
        const BOARD_CLEAR_BONUS = 10000;
        const LEVEL_THRESHOLDS = [1500, 4000, 7500, 12000, 20000, 30000, 45000, 60000, 80000, 100000];

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
        let grid = [], previewRow = [], score = 0, level = 1, selectedCell = null;
        let isPaused = false;
        
        // --- Audio & Haptics ---
        const audio = {
            start: () => {
                try {
                    if (Tone.context.state !== 'running') {
                        Tone.start();
                    }
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
            selectedCell = null;
            self.isProcessing = false;
            
            updateLevelDisplay();
            updateScoreDisplay();
            updateIntervalForLevel();
            
            gameOverModal.classList.add('hidden');

            grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
            previewRow = Array(GRID_WIDTH).fill(0);
            for (let y = GRID_HEIGHT - STARTING_ROWS; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    grid[y][x] = COLORS[Math.floor(Math.random() * COLORS.length)];
                }
            }
            
            createGridDOM();
            createPreviewDOM();
            
            if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
            self.isPaused = false;
            pauseButton.textContent = 'PAUSE';
            gridElement.classList.remove('paused');
            self.gameLoopTimeoutId = setTimeout(gameLoop, currentInterval);
        }

        function togglePause() {
            if (self.gameOver) return;

            self.isPaused = !self.isPaused;

            if (self.isPaused) {
                if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
                self.gameLoopTimeoutId = null;
                gridElement.classList.add('paused');
                pauseButton.textContent = 'RESUME';
            } else {
                gridElement.classList.remove('paused');
                pauseButton.textContent = 'PAUSE';
                self.gameLoopTimeoutId = setTimeout(gameLoop, currentInterval);
            }
        }

        function createGridDOM() {
            gridElement.innerHTML = '';
            for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.index = i;
                gridElement.appendChild(cell);
            }
            for(let y = 0; y < GRID_HEIGHT; y++) {
                for(let x = 0; x < GRID_WIDTH; x++) {
                    renderCell(x, y);
                }
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

        // --- Game Loop ---
        async function gameLoop() {
            if (self.gameOver) return;
            addBlockToPreview();
            if (previewRow.indexOf(0) === -1) {
                self.isProcessing = true;
                try {
                    await dropNewRow();
                } finally {
                    self.isProcessing = false;
                }
            }
            if (!self.gameOver) {
                self.gameLoopTimeoutId = setTimeout(gameLoop, currentInterval);
            }
        }

        // --- Action Handlers ---
        async function handleCellClick(event) {
            if (self.gameOver || self.isProcessing || self.isPaused) return;
            
            const cellElement = event.target.closest('.cell');
            if (!cellElement || !cellElement.dataset.index) return;
            
            const index = parseInt(cellElement.dataset.index, 10);
            const x = index % GRID_WIDTH;
            const y = Math.floor(index / GRID_WIDTH);

            self.isProcessing = true;
            try {
                if (selectedCell) {
                    const { x: selX, y: selY } = selectedCell;
                    const selElem = gridElement.children[selY * GRID_WIDTH + selX];
                    selElem.classList.remove('selected');

                    if ((selX === x && selY === y) || grid[y][x] === 0) {
                        selectedCell = null;
                    } else {
                        haptics.swap();
                        audio.swap();

                        const temp = grid[selY][selX];
                        grid[selY][selX] = grid[y][x];
                        grid[y][x] = temp;
                        
                        selectedCell = null;

                        renderCell(selX, selY);
                        renderCell(x, y);
                        await new Promise(resolve => setTimeout(resolve, 150));
                        await checkClearAndDropLoop();
                    }
                } else {
                    if (grid[y][x] > 0) {
                        haptics.select();
                        audio.select();
                        selectedCell = { x, y };
                        cellElement.classList.add('selected');
                    }
                }
            } finally {
                self.isProcessing = false;
            }
        }

        async function dropNewRow() {
            haptics.drop();
            audio.drop();

            if (grid[0].some(cell => cell > 0)) {
                triggerGameOver();
                return;
            }
            
            for (let x = 0; x < GRID_WIDTH; x++) {
                grid[0][x] = previewRow[x];
            }
            
            await applyGravity();
            
            previewRow = Array(GRID_WIDTH).fill(0);
            for (let x = 0; x < GRID_WIDTH; x++) {
                renderPreviewCell(x);
            }

            await checkClearAndDropLoop();
        }

        // --- Game Flow & Sub-routines ---
        function addBlockToPreview() {
            if (self.gameOver) return;
            const emptyIndex = previewRow.indexOf(0);
            if (emptyIndex !== -1) {
                previewRow[emptyIndex] = COLORS[Math.floor(Math.random() * COLORS.length)];
                renderPreviewCell(emptyIndex);
            }
        }

        async function checkClearAndDropLoop() {
            let matchesFound;
            let chain = 0;
            do {
                if (self.gameOver) return;
                const matches = findMatches();
                matchesFound = matches.size > 0;
                if (matchesFound) {
                    chain++;
                    haptics.clear();
                    audio.clear(matches.size);
                    updateScore(matches.size, chain);
                    await clearMatches(matches);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await applyGravity();
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
            } while (matchesFound);
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

        async function clearMatches(matches) {
             matches.forEach(coord => {
                if (self.gameOver) return;
                const [x, y] = coord.split(',').map(Number);
                const index = y * GRID_WIDTH + x;
                const cell = gridElement.children[index];
                const light = cell.querySelector('.light');
                if (light) {
                    light.classList.add('clearing');
                }
                grid[y][x] = 0;
             });
        }

        async function applyGravity() {
            if (self.gameOver) return;
            for (let x = 0; x < GRID_WIDTH; x++) {
                let emptyRow = -1;
                for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                    if (grid[y][x] === 0 && emptyRow === -1) {
                        emptyRow = y;
                    } else if (grid[y][x] > 0 && emptyRow !== -1) {
                        grid[emptyRow][x] = grid[y][x];
                        grid[y][x] = 0;
                        renderCell(x, emptyRow);
                        renderCell(x, y);
                        emptyRow--;
                    }
                }
            }
        }

        async function checkForBoardClear() {
            if (self.gameOver) return;
            const isClear = grid.every(row => row.every(cell => cell === 0));
            if (isClear) {
                audio.boardClear();
                score += BOARD_CLEAR_BONUS;
                updateScoreDisplay();
            }
        }

        function triggerGameOver() {
            if (self.gameOver) return;
            self.gameOver = true;
            if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
            self.isProcessing = true;
            haptics.gameOver();
            audio.gameOver();

            finalLevelElement.textContent = level;
            finalScoreElement.textContent = Math.round(score);

            gameOverModal.classList.remove('hidden');
            gameOverModal.classList.add('flex');
        }

        // --- UI & Utility Functions ---
        function renderCell(x, y, isInitialSetup = false) {
            const index = y * GRID_WIDTH + x;
            const cell = gridElement.children[index];
            if (!cell) return;

            const colorValue = grid[y][x];
            let light = cell.querySelector('.light');

            if (colorValue > 0) {
                if (!light) {
                    light = document.createElement('div');
                    light.classList.add('light');
                    cell.appendChild(light);
                    light.classList.add('dropping');
                    light.addEventListener('animationend', () => {
                        light.classList.remove('dropping');
                    }, { once: true });
                }
                light.className = `light color-${colorValue} dropping`;
                requestAnimationFrame(() => {
                    light.classList.add('show');
                    light.classList.remove('dropping');
                });

            } else if (light) {
                cell.removeChild(light);
            }
        }

        function renderPreviewCell(x) {
            const cell = previewRowElement.children[x];
            if (!cell) return;
            
            const colorValue = previewRow[x];
            let light = cell.querySelector('.light');

            if (colorValue > 0) {
                if (!light) {
                    light = document.createElement('div');
                    light.classList.add('light');
                    cell.appendChild(light);
                }
                light.className = `light color-${colorValue}`;
                requestAnimationFrame(() => {
                    light.classList.add('show');
                });
            } else if (light) {
                cell.removeChild(light);
            }
        }

        function updateIntervalForLevel() {
            const newInterval = INITIAL_INTERVAL_MS - ((level - 1) * LEVEL_INTERVAL_DECREMENT_MS);
            currentInterval = Math.max(MIN_INTERVAL_MS, newInterval);
            intervalDisplayElement.textContent = (currentInterval / 1000).toFixed(2);
        }

        function updateScore(matchedBlocks, chain) {
            let basePoints = matchedBlocks * 10;
            let bonusPoints = Math.max(0, matchedBlocks - 3) * 15;
            let chainBonus = (chain > 1) ? (basePoints + bonusPoints) * (chain - 1) * 0.5 : 0;
            score += basePoints + bonusPoints + chainBonus;
            
            if (level - 1 < LEVEL_THRESHOLDS.length && score >= LEVEL_THRESHOLDS[level - 1]) {
                level++;
                haptics.levelUp();
                audio.levelUp();
                updateLevelDisplay();
                updateIntervalForLevel();
            }
            
            updateScoreDisplay();
        }

        function updateScoreDisplay() {
            const currentScoreText = Math.round(score);
            let nextLevelScoreText = (level - 1 < LEVEL_THRESHOLDS.length) ? LEVEL_THRESHOLDS[level - 1] : "MAX";
            scoreElement.textContent = `${currentScoreText} / ${nextLevelScoreText}`;
        }

        function updateLevelDisplay() { 
            levelElement.textContent = level;
            levelElement.classList.add('level-up');
            levelElement.addEventListener('animationend', () => {
                levelElement.classList.remove('level-up');
            }, {once: true});
        }

        // --- Event Listeners ---
        gridElement.addEventListener('click', handleCellClick);
        pauseButton.addEventListener('click', togglePause);

        restartButton.addEventListener('click', () => {
            startModal.classList.remove('hidden');
            startModal.classList.add('flex');
            gameOverModal.classList.add('hidden');
        });

        startButton.addEventListener('click', () => {
            audio.start();
            startModal.classList.add('hidden');
            const startingLevel = parseInt(levelSelectElement.value, 10);
            init(startingLevel);
        });
    },

    cleanup: function() {
        if (this.gameLoopTimeoutId) {
            clearTimeout(this.gameLoopTimeoutId);
            this.gameLoopTimeoutId = null;
        }
        if (this.synth) {
            this.synth.dispose();
            this.synth = null;
        }
        this.isProcessing = false;
        this.gameOver = true; // Ensure any lingering async operations stop
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.remove('anxiety-level-up-active');
        document.getElementById('game-board-wrapper').innerHTML = '';
    }
};
