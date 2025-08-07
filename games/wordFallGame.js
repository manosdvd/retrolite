const wordFallGame = {
    gameLoopTimeoutId: null,
    synth: null,
    isProcessing: false,
    isPaused: false,
    gameOver: false,
    currentInterval: 1000,
    styleElement: null,

    setup: function() {
        // Add styles for the game
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            .word-fall-tile {
                background: radial-gradient(circle, #4a5568, #2d3748); /* A nice gray gradient */
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.1rem; /* Make font slightly larger */
                text-transform: uppercase;
            }
            .word-fall-active .game-container {
                background: linear-gradient(145deg, #1e3a8a, #3b82f6);
            }
        `;
        document.head.appendChild(this.styleElement);
        document.body.classList.add('word-fall-active');

        const gameBoardWrapper = document.getElementById('game-board-wrapper');
        // Use a structure similar to anxietyLevelUpGame for the UI
        gameBoardWrapper.innerHTML = `
            <div class="game-wrapper">
                <div id="game-container-wordfall" class="game-container p-4 md:p-6 flex flex-col">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-baseline space-x-4">
                            <h1 class="font-bold text-2xl md:text-3xl tracking-widest text-white">DYSLEXIA</h1>
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
                    <div id="word-display-container" class="word-display-container mb-4">
                        <div id="word-display" class="word-display text-center text-lg text-yellow-200 h-8"></div>
                    </div>
                    <div class="preview-container">
                        <p class="text-center text-sm text-gray-400 mb-2">NEXT</p>
                        <div id="preview-row" class="preview-row"></div>
                    </div>
                    <div id="grid-wrapper" class="grid-wrapper">
                        <div id="grid" class="grid"></div>
                    </div>
                    <div id="controls-area" class="mt-4">
                         <div id="timer-display-container" class="text-center text-sm text-gray-400 mb-2">
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
                     <button id="view-words-button" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 mb-4">
                        VIEW FOUND WORDS
                    </button>
                    <button id="restart-button" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105">
                        RESTART
                    </button>
                </div>
            </div>
            <div id="start-modal" class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4 modal">
                <div class="bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-blue-500 max-w-lg">
                    <h2 class="text-4xl md:text-5xl font-bold text-blue-400 mb-4 tracking-widest">DYSLEXIA</h2>
                    <p class="text-lg mb-6 text-gray-300">Find words of 3+ letters to score points. Don't let the grid fill up!</p>
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
        const INITIAL_INTERVAL_MS = 1500; // Slower start
        const LEVEL_INTERVAL_DECREMENT_MS = 100;
        const MIN_INTERVAL_MS = 400;
        const BOARD_CLEAR_BONUS = 5000;
        const LEVEL_THRESHOLDS = [1500, 4000, 7500, 12000, 20000, 30000, 45000, 60000];
        const SCRABBLE_TILE_DISTRIBUTION = "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ".split('');
        const SCRABBLE_TILE_VALUES = { 'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10 };
        const wordList = new Set(dyslexiaWords);
        let foundWordsDuringGameplay = new Set();


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
        const viewWordsButton = document.getElementById('view-words-button');
        const startModal = document.getElementById('start-modal');
        const startButton = document.getElementById('start-button');
        const wordDisplay = document.getElementById('word-display');
        const levelSelectElement = document.getElementById('level-select');
        const pauseButton = document.getElementById('pause-button');


        // --- Game State ---
        let grid = [], previewRow = [], score = 0, level = 1, selectedCell = null;

        // --- Audio & Haptics (borrowed from Anxiety 2) ---
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
        function init(startingLevel = 1) {
            level = startingLevel;
            score = level > 1 ? LEVEL_THRESHOLDS[level - 2] : 0;
            self.gameOver = false;
            self.isPaused = false;
            self.isProcessing = false;
            selectedCell = null;
            foundWordsDuringGameplay.clear();


            updateLevelDisplay();
            updateScoreDisplay();
            updateIntervalForLevel();


            gameOverModal.classList.add('hidden');
            pauseButton.textContent = 'PAUSE';
            gridElement.classList.remove('paused');
            wordDisplay.textContent = '';


            grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null));
            previewRow = Array(GRID_WIDTH).fill(null);


            for (let y = GRID_HEIGHT - STARTING_ROWS; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    grid[y][x] = SCRABBLE_TILE_DISTRIBUTION[Math.floor(Math.random() * SCRABBLE_TILE_DISTRIBUTION.length)];
                }
            }


            createGridDOM();
            createPreviewDOM();
            renderGrid();


            if (self.gameLoopTimeoutId) clearTimeout(self.gameLoopTimeoutId);
            self.gameLoopTimeoutId = setTimeout(gameLoop, self.currentInterval);
        }


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


                if ((selX === x && selY === y) || grid[y][x] === null) {
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
                if (grid[y][x] !== null) {
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


        function gameLoop() {
            if (self.gameOver || self.isPaused) return;


            addBlockToPreview();


            if (previewRow.indexOf(null) === -1) { // When preview row is full
                self.isProcessing = true;


                if (grid[0].some((cell, index) => cell !== null && previewRow[index] !== null)) {
                    triggerGameOver();
                    return;
                }


                audio.drop();
                haptics.drop();


                // Shift everything down
                for (let y = GRID_HEIGHT - 1; y > 0; y--) {
                    grid[y] = [...grid[y-1]];
                }
                grid[0] = [...previewRow];


                previewRow = Array(GRID_WIDTH).fill(null);
                renderPreview();


                renderGrid({ animateTopRow: true });


                setTimeout(processGameTurn, 250);
            }


            if (!self.gameOver && !self.isPaused) {
                self.gameLoopTimeoutId = setTimeout(gameLoop, self.currentInterval);
            }
        }


        async function checkClearAndDropLoop() {
            let chain = 0;
            let allWordsThisTurn = new Set();
            while (!self.gameOver) {
                const { coords, words } = findMatches();
                if (coords.size === 0) break;


                chain++;
                words.forEach(word => allWordsThisTurn.add(word));
                haptics.clear();
                audio.clear(coords.size);
                updateScore(words, chain);
                displayFoundWords(Array.from(allWordsThisTurn));


                await clearMatches(coords);
                await new Promise(r => setTimeout(r, 250));


                await applyGravity();
                await new Promise(r => setTimeout(r, 250));
            }
             if (allWordsThisTurn.size === 0) {
                 wordDisplay.textContent = '';
             }
            await checkForBoardClear();
        }


        function findMatches() {
            const coords = new Set();
            const words = new Set();


            // Horizontal check
            for (let y = 0; y < GRID_HEIGHT; y++) {
                let rowStr = '';
                for (let x = 0; x < GRID_WIDTH; x++) {
                    rowStr += grid[y][x] || ' ';
                }
                for (const word of wordList) {
                    if (word.length < 3) continue;
                    let i = -1;
                    while ((i = rowStr.indexOf(word, i + 1)) !== -1) {
                        words.add(word);
                        foundWordsDuringGameplay.add(word);
                        for (let j = 0; j < word.length; j++) {
                            coords.add(`${i + j},${y}`);
                        }
                    }
                }
            }


            // Vertical check
            for (let x = 0; x < GRID_WIDTH; x++) {
                let colStr = '';
                for (let y = 0; y < GRID_HEIGHT; y++) {
                    colStr += grid[y][x] || ' ';
                }
                 for (const word of wordList) {
                    if (word.length < 3) continue;
                    let i = -1;
                    while ((i = colStr.indexOf(word, i + 1)) !== -1) {
                        words.add(word);
                        foundWordsDuringGameplay.add(word);
                        for (let j = 0; j < word.length; j++) {
                            coords.add(`${x},${i + j}`);
                        }
                    }
                }
            }


            return { coords, words: Array.from(words) };
        }


         function clearMatches(matches) {
            matches.forEach(coord => {
                const [x, y] = coord.split(',').map(Number);
                grid[y][x] = null;
            });
            renderGrid({ clearingCoords: matches });
        }


        function applyGravity() {
            for (let x = 0; x < GRID_WIDTH; x++) {
                let emptyRow = GRID_HEIGHT - 1;
                for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                    if (grid[y][x]) {
                        [grid[emptyRow][x], grid[y][x]] = [grid[y][x], grid[emptyRow][x]];
                        emptyRow--;
                    }
                }
            }
            renderGrid();
        }




        async function checkForBoardClear() {
            const isClear = grid.every(row => row.every(cell => cell === null));
            if (isClear) {
                audio.boardClear();
                score += BOARD_CLEAR_BONUS;
                updateScoreDisplay();
                displayFoundWords(["BOARD CLEAR!"]);
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
            const { animateTopRow = false, clearingCoords = new Set() } = options;


            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    const index = y * GRID_WIDTH + x;
                    const cell = gridElement.children[index];
                    if (!cell) continue;
                    cell.innerHTML = '';
                    const letter = grid[y][x];


                    if (clearingCoords.has(`${x},${y}`)) {
                        const tempLight = document.createElement('div');
                        tempLight.className = `light clearing word-fall-tile`;
                        tempLight.textContent = letter;
                        cell.appendChild(tempLight);
                    } else if (letter) {
                        const light = document.createElement('div');
                        light.className = 'light word-fall-tile'; // <-- THE FIX IS HERE!
                        light.textContent = letter;
                        if (animateTopRow && y === 0) {
                            light.classList.add('dropping');
                        }
                        cell.appendChild(light);
                    }
                }
            }
        }




        function addBlockToPreview() {
            if (self.gameOver) return;
            const emptyIndex = previewRow.indexOf(null);
            if (emptyIndex !== -1) {
                previewRow[emptyIndex] = SCRABBLE_TILE_DISTRIBUTION[Math.floor(Math.random() * SCRABBLE_TILE_DISTRIBUTION.length)];
                renderPreview();
            }
        }


        function renderPreview() {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const cell = previewRowElement.children[x];
                if (!cell) continue;
                const letter = previewRow[x];
                let light = cell.querySelector('.light');
                if (letter) {
                    if (!light) {
                        light = document.createElement('div');
                        light.classList.add('light');
                        cell.appendChild(light);
                    }
                    light.className = 'light word-fall-tile';
                    light.textContent = letter;
                } else if (light) {
                    cell.removeChild(light);
                }
            }
        }


        function updateScore(words, chain) {
            let turnScore = 0;
            words.forEach(word => {
                let wordScore = 0;
                for (const letter of word) {
                    wordScore += SCRABBLE_TILE_VALUES[letter.toUpperCase()] || 0;
                }
                if (word.length >= 7) wordScore += 50;
                turnScore += wordScore;
            });
            const chainBonus = (chain > 1) ? turnScore * (chain - 1) * 0.5 : 0;
            score += turnScore + chainBonus;
            updateScoreDisplay();
            checkLevelUp();
        }
        
        function displayFoundWords(words) {
            wordDisplay.textContent = words.join(', ');
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
        
        function showFoundWordsModal() {
            // This is a simplified example; you can build a more complex modal.
            const words = Array.from(foundWordsDuringGameplay).sort().join(', ');
            alert(`Words Found: ${words || 'None'}`);
        }


        // --- Event Listeners ---
        startButton.addEventListener('click', () => {
            audio.start();
            startModal.classList.add('hidden');
            const startingLevel = parseInt(levelSelectElement.value, 10);
            init(startingLevel);
        });


        restartButton.addEventListener('click', () => {
            gameOverModal.classList.add('hidden');
            startModal.classList.remove('hidden');
            startModal.classList.add('flex');
        });
        
        viewWordsButton.addEventListener('click', showFoundWordsModal);


        pauseButton.addEventListener('click', togglePause);
        gridElement.addEventListener('click', handleCellClick);
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
        this.gameOver = true;
        if (this.styleElement) {
            document.head.removeChild(this.styleElement);
            this.styleElement = null;
        }
        document.body.classList.remove('word-fall-active');


        const gameBoardWrapper = document.getElementById('game-board-wrapper');
        if (gameBoardWrapper) {
            gameBoardWrapper.innerHTML = '';
        }
    }
};
