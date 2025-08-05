const wordFallGame = {
    gameLoopTimeoutId: null,
    synth: null,
    isProcessing: false,
    gameOver: false,

    setup: function() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.add('word-fall-active');

        const gameBoardWrapper = document.getElementById('game-board-wrapper');
        gameBoardWrapper.innerHTML = `
            <div class="game-wrapper">
                <div id="game-container-wordfall" class="game-container p-4 md:p-6 flex flex-col">
                    <!-- Header -->
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-baseline space-x-4">
                             <h1 class="font-bold text-xl md:text-2xl tracking-widest text-white">DYSLEXIA</h1>
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
                    
                    <!-- Word Display -->
                    <div id="word-display-container" class="word-display-container mb-4">
                        <div id="word-display" class="word-display"></div>
                    </div>

                    <!-- Preview Row -->
                    <div class="preview-container">
                        <p class="text-center text-sm text-gray-400 mb-2">NEXT</p>
                        <div id="preview-row" class="preview-row"></div>
                    </div>

                    <!-- Game Grid -->
                    <div id="grid-wrapper" class="grid-wrapper">
                         <div id="grid" class="grid"></div>
                    </div>
                    
                    <!-- Dynamic Controls Area -->
                    <div id="controls-area" class="mt-4">
                        <button id="drop-button" class="w-full py-3 rounded-lg text-xl font-bold tracking-wider drop-button hidden">
                            DROP ROW
                        </button>
                         <div id="timer-display-container" class="text-center text-sm text-gray-400 hidden">
                            <p>Next row in: <span id="interval-display" class="font-bold text-cyan-300"></span>s</p>
                        </div>
                        
                        <button id="pause-button" class="w-full py-3 mt-2 rounded-lg text-xl font-bold tracking-wider bg-gray-600 hover:bg-gray-500 text-white transition-transform transform hover:scale-105">
                            PAUSE
                        </button>
                    </div>
                </div>
            </div>

            
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
                    <h2 class="text-4xl md:text-5xl font-bold text-blue-400 mb-4 tracking-widest">DYSLEXIA</h2>
                    <p class="text-lg mb-6 text-gray-300">Choose your game mode. Find words of 3+ letters to score points. Don't let the grid fill up!</p>
                    
                    <div class="flex justify-center gap-4 mb-6">
                        <div id="select-leveling-mode" class="mode-selector active p-4 rounded-lg cursor-pointer w-40">
                            <h3 class="font-bold text-xl">Leveling</h3>
                            <p class="text-sm text-gray-300">Timed Drops</p>
                        </div>
                        <div id="select-manual-mode" class="mode-selector p-4 rounded-lg cursor-pointer w-40">
                            <h3 class="font-bold text-xl">Manual</h3>
                            <p class="text-sm text-gray-300">You Drop</p>
                        </div>
                    </div>

                    <div id="level-select-container" class="mb-8">
                        <label for="level-select" class="text-gray-400 mr-2 text-lg">STARTING LEVEL:</label>
                        <select id="level-select" class="bg-gray-700 text-white p-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                            <option value="6">6</option><option value="7">7</option><option value="8">8</option>
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
        const INITIAL_INTERVAL_MS = 1000;
        const LEVEL_INTERVAL_DECREMENT_MS = 75;
        const MIN_INTERVAL_MS = 150;
        const BOARD_CLEAR_BONUS = 5000;
        const LEVEL_THRESHOLDS = [1500, 4000, 7500, 12000, 20000, 30000, 45000, 60000, 80000, 100000];
        
        // --- Scrabble Configuration ---
        const SCRABBLE_TILE_VALUES = {
            'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1, 
            'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1, 
            'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
        };
        const SCRABBLE_TILE_DISTRIBUTION = "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ".split('');

        // --- Word List (from dyslexiaWords.js) ---
        const wordList = new Set(dyslexiaWords);

        // --- DOM Elements ---
        const gridElement = document.getElementById('grid');
        const previewRowElement = document.getElementById('preview-row');
        const scoreElement = document.getElementById('score');
        const levelElement = document.getElementById('level');
        const gameOverModal = document.getElementById('game-over-modal');
        const finalScoreElement = document.getElementById('final-score');
        const finalLevelElement = document.getElementById('final-level');
        const restartButton = document.getElementById('restart-button');
        const startModal = document.getElementById('start-modal');
        const startButton = document.getElementById('start-button');
        const wordDisplay = document.getElementById('word-display');
        const dropButton = document.getElementById('drop-button');
        const timerDisplayContainer = document.getElementById('timer-display-container');
        const intervalDisplayElement = document.getElementById('interval-display');
        const selectLevelingModeBtn = document.getElementById('select-leveling-mode');
        const selectManualModeBtn = document.getElementById('select-manual-mode');
        const levelSelectContainer = document.getElementById('level-select-container');
        const levelSelectElement = document.getElementById('level-select');
        const pauseButton = document.getElementById('pause-button');

        // --- Game State ---
        let grid = [], previewRow = [], score = 0, level = 1, selectedCell = null;
        let gameMode = 'leveling'; // 'leveling' or 'manual'
        let currentInterval = INITIAL_INTERVAL_MS;
        let isPaused = false; // New state variable for pause functionality

        // --- Audio & Haptics ---
        const audio = {
            start: () => { try { if (Tone.context.state !== 'running') { Tone.start(); } self.synth = new Tone.PolySynth(Tone.Synth).toDestination(); } catch (e) { console.error('Audio context failed to start.'); } },
            select: () => self.synth?.triggerAttackRelease('C5', '8n'),
            swap: () => self.synth?.triggerAttackRelease('G4', '8n'),
            levelUp: () => self.synth?.triggerAttackRelease(['C5', 'G5', 'C6'], '4n'),
            clear: (count) => { const notes = ['C4', 'E4', 'G4', 'A4', 'C5']; const now = Tone.now(); for (let i = 0; i < Math.min(count, notes.length); i++) { self.synth?.triggerAttackRelease(notes[i], '16n', now + i * 0.07); } },
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
        function init(mode, startingLevel = 1) {
            gameMode = mode;
            level = startingLevel;
            score = level > 1 ? LEVEL_THRESHOLDS[level - 2] : 0;
            self.gameOver = false;
            selectedCell = null;
            self.isProcessing = false;
            
            updateLevelDisplay();
            updateScoreDisplay();
            
            gameOverModal.classList.add('hidden');
            wordDisplay.textContent = '';

            grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null));
            previewRow = Array(GRID_WIDTH).fill(null);
            
            const rowsToFill = gameMode === 'manual' ? GRID_HEIGHT : STARTING_ROWS;
            for (let y = GRID_HEIGHT - rowsToFill; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    grid[y][x] = SCRABBLE_TILE_DISTRIBUTION[Math.floor(Math.random() * SCRABBLE_TILE_DISTRIBUTION.length)];
                }
            }
            
            createGridDOM();
            createPreviewDOM();

            if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
            self.isPaused = false;
            pauseButton.textContent = 'PAUSE';
            gridElement.classList.remove('paused');
            
            if (gameMode === 'leveling') {
                dropButton.classList.add('hidden');
                timerDisplayContainer.classList.remove('hidden');
                updateIntervalForLevel();
                self.gameLoopTimeoutId = setTimeout(gameLoop, currentInterval);
            } else { // Manual Mode
                dropButton.classList.remove('hidden');
                timerDisplayContainer.classList.add('hidden');
                populatePreview();
            }
        }

        function togglePause() {
            if (self.gameOver) return;

            self.isPaused = !self.isPaused;

            if (self.isPaused) {
                if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
                self.gameLoopTimeoutId = null;
                gridElement.classList.add('paused');
                dropButton.disabled = true;
                addWordButton.disabled = true;
                pauseButton.textContent = 'RESUME';
            } else {
                gridElement.classList.remove('paused');
                dropButton.disabled = false;
                addWordButton.disabled = false;
                pauseButton.textContent = 'PAUSE';
                if (gameMode === 'leveling') {
                    self.gameLoopTimeoutId = setTimeout(gameLoop, currentInterval);
                }
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

        // --- Game Loop (for Leveling Mode) ---
        async function gameLoop() {
            if (self.gameOver) return;
            addBlockToPreview();
            if (previewRow.every(cell => cell !== null)) {
                self.isProcessing = true;
                await dropNewRow(false);
                self.isProcessing = false;
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
                    if ((selX === x && selY === y) || grid[y][x] === null) {
                        selectedCell = null;
                    } else {
                        haptics.swap();
                        audio.swap();
                        [grid[selY][selX], grid[y][x]] = [grid[y][x], grid[selY][selX]];
                        selectedCell = null;
                        renderCell(selX, selY);
                        renderCell(x, y);
                        await new Promise(resolve => setTimeout(resolve, 150));
                        // Pass the swapped cells to the check loop
                        await checkClearAndDropLoop([{ x: selX, y: selY }, { x, y }]);
                    }
                } else {
                    if (grid[y][x] !== null) {
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
        
        async function handleDropClick() {
            if (self.gameOver || self.isProcessing || self.isPaused) return;
            if (!previewRow.every(cell => cell !== null)) return;
            self.isProcessing = true;
            await dropNewRow(true);
            self.isProcessing = false;
        }

        async function dropNewRow(repopulate) {
            haptics.drop();
            audio.drop();
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (previewRow[x] !== null && grid[0][x] !== null) {
                    triggerGameOver();
                    return;
                }
            }
            for (let x = 0; x < GRID_WIDTH; x++) {
                const letter = previewRow[x];
                if (letter === null) continue;
                for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                    if (grid[y][x] === null) {
                        grid[y][x] = letter;
                        renderCell(x, y, true);
                        break;
                    }
                }
            }
            previewRow.fill(null);
            for (let x = 0; x < GRID_WIDTH; x++) renderPreviewCell(x);
            if (gameMode === 'manual') dropButton.disabled = true;
            await new Promise(resolve => setTimeout(resolve, 350));
            await checkClearAndDropLoop();
            if (repopulate) populatePreview();
        }

        // --- Game Flow & Sub-routines ---
        function populatePreview() {
            if (self.gameOver) return;
            for (let i = 0; i < GRID_WIDTH; i++) {
                previewRow[i] = SCRABBLE_TILE_DISTRIBUTION[Math.floor(Math.random() * SCRABBLE_TILE_DISTRIBUTION.length)];
                renderPreviewCell(i);
            }
            dropButton.disabled = false;
        }

        function addBlockToPreview() {
            if (self.gameOver) return;
            const emptyIndex = previewRow.indexOf(null);
            if (emptyIndex !== -1) {
                previewRow[emptyIndex] = SCRABBLE_TILE_DISTRIBUTION[Math.floor(Math.random() * SCRABBLE_TILE_DISTRIBUTION.length)];
                renderPreviewCell(emptyIndex);
            }
        }

        async function checkClearAndDropLoop(swappedCells = null) {
            let matchesFound;
            let chain = 0;
            let allWordsThisTurn = [];
            let firstCheck = true;
            do {
                if (self.gameOver) return;
                
                const { coords, words } = findMatches(firstCheck ? swappedCells : null);
                firstCheck = false;

                matchesFound = coords.size > 0;
                if (matchesFound) {
                    chain++;
                    allWordsThisTurn.push(...words);
                    haptics.clear();
                    audio.clear(coords.size);
                    updateScore(words, chain);
                    displayFoundWords(allWordsThisTurn);
                    await clearMatches(coords);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await applyGravity();
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
            } while (matchesFound);
            if (allWordsThisTurn.length === 0) wordDisplay.textContent = '';
            await checkForBoardClear();
        }

        function findMatches(cellsToFocusOn = null) {
            const allFoundWordCandidates = []; // Store { word: string, coords: Array<{x,y}>, score: number }

            // Helper to process a single line (row or column)
            function processLine(lineString, lineCoords) {
                const lineCandidates = [];
                for (let i = 0; i < lineString.length; i++) {
                    for (let j = i + 3; j <= lineString.length; j++) {
                        const sub = lineString.substring(i, j).toLowerCase();
                        if (wordList.has(sub)) {
                            const wordCoords = lineCoords.slice(i, j);
                            let wordScore = 0;
                            for (const charCoord of wordCoords) {
                                wordScore += SCRABBLE_TILE_VALUES[grid[charCoord.y][charCoord.x].toUpperCase()] || 0;
                            }
                            lineCandidates.push({ word: sub, coords: wordCoords, score: wordScore });
                        }
                    }
                }

                // Sort by length (descending) then by score (descending)
                lineCandidates.sort((a, b) => {
                    if (b.word.length !== a.word.length) {
                        return b.word.length - a.word.length;
                    }
                    return b.score - a.score;
                });

                const acceptedCoordsInLine = new Set();
                const acceptedWordsInLine = [];

                for (const candidate of lineCandidates) {
                    let overlaps = false;
                    for (const coord of candidate.coords) {
                        if (acceptedCoordsInLine.has(`${coord.x},${coord.y}`)) {
                            overlaps = true;
                            break;
                        }
                    }
                    if (!overlaps) {
                        acceptedWordsInLine.push(candidate);
                        for (const coord of candidate.coords) {
                            acceptedCoordsInLine.add(`${coord.x},${coord.y}`);
                        }
                    }
                }
                return acceptedWordsInLine;
            }

            if (cellsToFocusOn) {
                const affectedRows = new Set();
                const affectedCols = new Set();
                cellsToFocusOn.forEach(cell => {
                    affectedRows.add(cell.y);
                    affectedCols.add(cell.x);
                });

                affectedRows.forEach(y => {
                    let rowString = "";
                    let rowCoords = [];
                    for (let x = 0; x < GRID_WIDTH; x++) {
                        rowString += grid[y][x] || ' ';
                        rowCoords.push({ x, y });
                    }
                    allFoundWordCandidates.push(...processLine(rowString, rowCoords));
                });

                affectedCols.forEach(x => {
                    let colString = "";
                    let colCoords = [];
                    for (let y = 0; y < GRID_HEIGHT; y++) {
                        colString += grid[y][x] || ' ';
                        colCoords.push({ x, y });
                    }
                    allFoundWordCandidates.push(...processLine(colString, colCoords));
                });

            } else {
                // Full grid scan (initial check or after gravity)
                // Horizontal check
                for (let y = 0; y < GRID_HEIGHT; y++) {
                    let rowString = "";
                    let rowCoords = [];
                    for (let x = 0; x < GRID_WIDTH; x++) {
                        rowString += grid[y][x] || ' ';
                        rowCoords.push({ x, y });
                    }
                    allFoundWordCandidates.push(...processLine(rowString, rowCoords));
                }
                // Vertical check
                for (let x = 0; x < GRID_WIDTH; x++) {
                    let colString = "";
                    let colCoords = [];
                    for (let y = 0; y < GRID_HEIGHT; y++) {
                        colString += grid[y][x] || ' ';
                        colCoords.push({ x, y });
                    }
                    allFoundWordCandidates.push(...processLine(colString, colCoords));
                }
            }

            const finalMatchCoords = new Set();
            const finalWords = new Set(); // Use a Set to avoid duplicate word strings

            // Sort all found words (from all lines) by length (descending) then by score (descending)
            allFoundWordCandidates.sort((a, b) => {
                if (b.word.length !== a.word.length) {
                    return b.word.length - a.word.length;
                }
                return b.score - a.score;
            });

            const usedGlobalCoords = new Set(); // Keep track of all coordinates used by accepted words

            for (const candidate of allFoundWordCandidates) {
                let overlaps = false;
                for (const coord of candidate.coords) {
                    if (usedGlobalCoords.has(`${coord.x},${coord.y}`)) {
                        overlaps = true;
                        break;
                    }
                }
                if (!overlaps) {
                    finalWords.add(candidate.word.toUpperCase());
                    for (const coord of candidate.coords) {
                        finalMatchCoords.add(`${coord.x},${coord.y}`);
                        usedGlobalCoords.add(`${coord.x},${coord.y}`);
                    }
                }
            }
            return { coords: finalMatchCoords, words: Array.from(finalWords) };
        }

        async function clearMatches(matches) {
             matches.forEach(coord => {
                if (self.gameOver) return;
                const [x, y] = coord.split(',').map(Number);
                grid[y][x] = null;
                const index = y * GRID_WIDTH + x;
                const cell = gridElement.children[index];
                const light = cell.querySelector('.light');
                if (light) light.classList.add('clearing');
             });
        }

        async function applyGravity() {
            if (self.gameOver) return;
            for (let x = 0; x < GRID_WIDTH; x++) {
                let emptyRow = -1;
                for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                    if (grid[y][x] === null && emptyRow === -1) {
                        emptyRow = y;
                    } else if (grid[y][x] !== null && emptyRow !== -1) {
                        grid[emptyRow][x] = grid[y][x];
                        grid[y][x] = null;
                        renderCell(x, emptyRow, true);
                        renderCell(x, y);
                        emptyRow--;
                    }
                }
            }
        }

        async function checkForBoardClear() {
            if (self.gameOver) return;
            const isClear = grid.every(row => row.every(cell => cell === null));
            if (isClear) {
                audio.boardClear();
                score += BOARD_CLEAR_BONUS;
                updateScoreDisplay();
                displayFoundWords(["BOARD CLEAR!"]);
            }
        }

        function triggerGameOver() {
            if (self.gameOver) return;
            self.gameOver = true;
            if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
            self.isProcessing = true;
            dropButton.disabled = true;
            haptics.gameOver();
            audio.gameOver();
            finalLevelElement.textContent = level;
            finalScoreElement.textContent = Math.round(score);
            gameOverModal.classList.remove('hidden');
            gameOverModal.classList.add('flex');
        }

        // --- UI & Utility Functions ---
        function renderCell(x, y, useDropAnimation = false) {
            const index = y * GRID_WIDTH + x;
            const cell = gridElement.children[index];
            if (!cell) return;
            const letter = grid[y][x];
            let light = cell.querySelector('.light');
            if (letter) {
                if (!light) {
                    light = document.createElement('div');
                    light.classList.add('light');
                    cell.appendChild(light);
                }
                light.textContent = letter;
                light.classList.remove('dropping');
                requestAnimationFrame(() => {
                    light.className = 'light show';
                     if (useDropAnimation) {
                         light.classList.add('dropping');
                         light.addEventListener('animationend', () => light.classList.remove('dropping'), { once: true });
                    }
                });
            } else if (light) {
                cell.removeChild(light);
            }
        }

        function renderPreviewCell(x) {
            const cell = previewRowElement.children[x];
            if (!cell) return;
            const letter = previewRow[x];
            let light = cell.querySelector('.light');
            if (letter) {
                if (!light) {
                    light = document.createElement('div');
                    light.classList.add('light');
                    cell.appendChild(light);
                }
                light.textContent = letter;
                light.className = 'light show';
            } else if (light) {
                cell.removeChild(light);
            }
        }
        
        function updateIntervalForLevel() {
            const newInterval = INITIAL_INTERVAL_MS - ((level - 1) * LEVEL_INTERVAL_DECREMENT_MS);
            currentInterval = Math.max(MIN_INTERVAL_MS, newInterval);
            intervalDisplayElement.textContent = (currentInterval / 1000).toFixed(2);
        }

        function updateScore(words, chain) {
            let turnScore = 0;
            words.forEach(word => {
                let wordScore = 0;
                for (const letter of word) {
                    wordScore += SCRABBLE_TILE_VALUES[letter.toUpperCase()] || 0;
                }
                if (word.length >= 7) {
                    wordScore += 50; // 7-letter word bonus
                }
                turnScore += wordScore;
            });
            let chainBonus = (chain > 1) ? turnScore * (chain - 1) * 0.5 : 0;
            score += turnScore + chainBonus;
            if (gameMode === 'leveling' && level - 1 < LEVEL_THRESHOLDS.length && score >= LEVEL_THRESHOLDS[level - 1]) {
                level++;
                haptics.levelUp();
                audio.levelUp();
                updateLevelDisplay();
                updateIntervalForLevel();
            }
            updateScoreDisplay();
        }
        
        function displayFoundWords(words) {
            wordDisplay.textContent = words.join(', ');
        }

        function updateScoreDisplay() {
            const currentScoreText = Math.round(score);
            let nextLevelScoreText = (level - 1 < LEVEL_THRESHOLDS.length) ? LEVEL_THRESHOLDS[level - 1] : "MAX";
            scoreElement.textContent = `${currentScoreText} / ${nextLevelScoreText}`;
        }

        function updateLevelDisplay() { 
            levelElement.textContent = level;
            levelElement.classList.add('level-up');
            levelElement.addEventListener('animationend', () => levelElement.classList.remove('level-up'), {once: true});
        }

        // --- Event Listeners ---
        gridElement.addEventListener('click', handleCellClick);
        dropButton.addEventListener('click', handleDropClick);
        restartButton.addEventListener('click', () => {
            startModal.classList.remove('hidden');
            startModal.classList.add('flex');
            gameOverModal.classList.add('hidden');
        });
        startButton.addEventListener('click', () => {
            audio.start();
            startModal.classList.add('hidden');
            const startingLevel = parseInt(levelSelectElement.value, 10);
            init(gameMode, startingLevel);
        });
        selectLevelingModeBtn.addEventListener('click', () => {
            gameMode = 'leveling';
            selectLevelingModeBtn.classList.add('active');
            selectManualModeBtn.classList.remove('active');
            levelSelectContainer.style.display = 'block';
        });
        selectManualModeBtn.addEventListener('click', () => {
            gameMode = 'manual';
            selectManualModeBtn.classList.add('active');
            selectLevelingModeBtn.classList.remove('active');
            levelSelectContainer.style.display = 'none';
        });

        pauseButton.addEventListener('click', togglePause);

        // Initial setup call
        init(gameMode, 1);
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
        this.gameOver = true;
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.remove('word-fall-active');
        document.getElementById('game-board-wrapper').innerHTML = '';
    }
};
