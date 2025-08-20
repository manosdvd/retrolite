export const wordFallGame = {
    // --- Game State Variables ---
    gameLoopTimeoutId: null,
    previewTimeoutId: null,
    synth: null,
    isProcessing: false, // Prevents user input during automated sequences
    isPaused: false,
    gameOver: false,
    currentInterval: 8000, // Time for the full preview bar to generate
    score: 0,
    level: 1,
    wordsFoundCount: 0,
    
    // --- Game Data ---
    grid: [],
    rows: 12, 
    cols: 8,
    previewRow: [],
    selectedLetters: [], // Array of { index: number }
    currentWord: '',
    foundWords: new Set(),
    dyslexiaWordSet: null,
    letterDistribution: [],
    
    // --- Scrabble Tile Data ---
    scrabbleTiles: {
        'A': { score: 1, count: 9 }, 'B': { score: 3, count: 2 }, 'C': { score: 3, count: 2 },
        'D': { score: 2, count: 4 }, 'E': { score: 1, count: 12 }, 'F': { score: 4, count: 2 },
        'G': { score: 2, count: 3 }, 'H': { score: 4, count: 2 }, 'I': { score: 1, count: 9 },
        'J': { score: 8, count: 1 }, 'K': { score: 5, count: 1 }, 'L': { score: 1, count: 4 },
        'M': { score: 3, count: 2 }, 'N': { score: 1, count: 6 }, 'O': { score: 1, count: 8 },
        'P': { score: 3, count: 2 }, 'Q': { score: 10, count: 1 }, 'R': { score: 1, count: 6 },
        'S': { score: 1, count: 4 }, 'T': { score: 1, count: 6 }, 'U': { score: 1, count: 4 },
        'V': { score: 4, count: 2 }, 'W': { score: 4, count: 2 }, 'X': { score: 8, count: 1 },
        'Y': { score: 4, count: 2 }, 'Z': { score: 10, count: 1 }
    },

    // --- DOM Elements ---
    styleElement: null,
    fontLink1: null,
    fontLink2: null,
    fontLink3: null,
    
    // --- Game Setup ---
    async setup() {
        this.injectFontsAndStyles();
        this.renderGameLayout();
        await this.initializeData();
        this.addEventListeners();
    },

    injectFontsAndStyles: function() {
        this.fontLink1 = document.createElement('link');
        this.fontLink1.rel = 'preconnect';
        this.fontLink1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(this.fontLink1);

        this.fontLink2 = document.createElement('link');
        this.fontLink2.rel = 'preconnect';
        this.fontLink2.href = 'https://fonts.gstatic.com';
        this.fontLink2.crossOrigin = 'anonymous';
        document.head.appendChild(this.fontLink2);
        
        this.fontLink3 = document.createElement('link');
        this.fontLink3.rel = 'stylesheet';
        this.fontLink3.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap';
        document.head.appendChild(this.fontLink3);

        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            .wordfall-game-active { font-family: 'Inter', sans-serif; overflow: hidden; }
            #game-board-wrapper .game-layout-wordfall { background: linear-gradient(145deg, #1f2937, #374151); border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); width: 100%; height: 100%; }
            #grid-wordfall { display: grid; grid-template-columns: repeat(${this.cols}, 1fr); grid-template-rows: repeat(${this.rows}, 1fr); gap: 4px; background-color: #111827; border-radius: 0.5rem; padding: 4px; }
            .cell { display: flex; justify-content: center; align-items: center; background-color: #4b5563; border-radius: 4px; color: white; font-weight: 900; font-size: clamp(14px, 4vmin, 28px); text-transform: uppercase; transition: all 0.2s ease-in-out; user-select: none; -webkit-user-select: none; cursor: pointer; }
            .cell.empty { background-color: #374151; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); cursor: default; }
            .cell.selected { background-color: #f59e0b; transform: scale(1.1); box-shadow: 0 0 15px #f59e0b; }
            .cell.clearing { animation: pulse-green 0.4s ease-in-out; }
            @keyframes pulse-green { 0%, 100% { background-color: #4ade80; transform: scale(1.05); } 50% { background-color: #86efac; transform: scale(1.15); } }
            .cell.falling { animation: drop-glow 0.8s ease-out; }
            @keyframes drop-glow { 0% { box-shadow: 0 0 15px #a7f3d0; } 100% { box-shadow: none; } }
            #preview-bar-container { display: flex; gap: 4px; margin-bottom: 8px; padding: 4px; background-color: #111827; border-radius: 0.5rem; height: 2rem; }
            .preview-cell { flex: 1; height: 1.5rem; background-color: #374151; border-radius: 4px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size: 1rem; transition: background-color 0.2s; }
            .preview-cell.filled { background-color: #4b5563; }
            #current-word-display { background-color: #111827; color: white; text-align: center; padding: 8px; font-size: 1.25rem; font-weight: bold; border-radius: 0.5rem; margin-bottom: 8px; min-height: 40px; display: flex; align-items: center; justify-content: center; }
            .action-buttons { display: flex; gap: 8px; margin-top: 8px; }
            .action-buttons button { flex: 1; padding: 10px; font-weight: bold; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.2s; border: none; color: white; }
            #submit-word-btn { background-color: #10b981; }
            #submit-word-btn:disabled { background-color: #4b5563; cursor: not-allowed; }
            #clear-selection-btn { background-color: #ef4444; }
            #clear-selection-btn:disabled { background-color: #4b5563; cursor: not-allowed; }
            .modal { background-color: rgba(17, 24, 39, 0.8); backdrop-filter: blur(5px); }
            .word-list-modal-content { background-color: #1f2937; padding: 1.5rem; border-radius: 1rem; border: 2px solid #3b82f6; width: 90vw; max-width: 600px; height: 80vh; display: flex; flex-direction: column; }
            .word-list-modal-content h2 { color: #93c5fd; }
            .word-list-modal-content dl { color: #d1d5db; overflow-y: auto; }
            .word-list-modal-content dt { font-weight: 700; color: #ffffff; margin-top: 0.75rem; }
            .word-list-modal-content dd { font-size: 0.875rem; color: #9ca3af; margin-left: 1rem; }
        `;
        document.head.appendChild(this.styleElement);
        document.body.classList.add('wordfall-game-active');
    },

    renderGameLayout: function() {
        const gameBoardWrapper = document.getElementById('game-board-wrapper');
        gameBoardWrapper.innerHTML = `
            <div class="game-layout-wordfall flex flex-col p-2 md:p-4">
                <!-- Stats Container -->
                <div class="flex justify-between items-center mb-2 text-white">
                    <div class="text-left">
                        <div class="font-semibold text-sm">LVL</div>
                        <div id="level" class="font-bold text-lg text-blue-300">1</div>
                    </div>
                    <div class="text-center">
                        <div class="font-semibold text-sm">WORDS</div>
                        <div id="words-found" class="font-bold text-lg text-green-300">0</div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold text-sm">SCORE</div>
                        <div id="score" class="font-bold text-lg text-yellow-300">0</div>
                    </div>
                </div>

                <!-- Preview Bar -->
                <div id="preview-bar-container"></div>

                <!-- Current Word Display -->
                <div id="current-word-display"></div>

                <!-- Grid -->
                <div id="grid-wordfall" class="flex-grow"></div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <button id="submit-word-btn">SUBMIT</button>
                    <button id="clear-selection-btn">CLEAR</button>
                </div>

                <!-- Pause Button -->
                <button id="pause-btn" class="w-full mt-2 py-2 px-4 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors">PAUSE</button>
            </div>
        `;
        
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div id="start-modal" class="modal fixed inset-0 flex items-center justify-center">
                <div class="bg-gray-800 p-8 rounded-lg shadow-2xl text-center text-white">
                    <h2 class="text-3xl font-black mb-4">WORD FALL</h2>
                    <p class="mb-6">Tap letters to form words and submit them. Don't let the grid fill up!</p>
                    <button id="start-btn" class="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-bold transition-colors">START</button>
                </div>
            </div>
            <div id="game-over-modal" class="modal fixed inset-0 hidden items-center justify-center">
                <div class="bg-gray-800 p-8 rounded-lg shadow-2xl text-center text-white">
                    <h2 class="text-4xl font-black text-red-500 mb-4">GAME OVER</h2>
                    <p class="mb-2 text-xl">Final Score: <span id="final-score" class="font-bold"></span></p>
                    <p class="mb-6 text-xl">Words Found: <span id="final-words-found" class="font-bold"></span></p>
                    <div class="flex flex-col space-y-2">
                        <button id="view-words-btn" class="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-lg font-bold transition-colors">View Words</button>
                        <button id="restart-btn" class="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors">RESTART</button>
                    </div>
                </div>
            </div>
        `;
    },

    initializeData: async function() {
        try {
            const response = await fetch('dyslexiaWords.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const words = await response.json();
            this.dyslexiaWordSet = new Set(words.map(word => word.toUpperCase()));
            console.log(`Loaded ${this.dyslexiaWordSet.size} words.`);
        } catch (e) {
            console.error("Failed to load dyslexia word list. Game will not be playable.", e);
            this.dyslexiaWordSet = new Set(); // Prevent crashing
            const display = document.getElementById('current-word-display');
            if(display) display.textContent = "Error: Could not load word list.";
        }

        this.letterDistribution = [];
        for (const letter in this.scrabbleTiles) {
            for (let i = 0; i < this.scrabbleTiles[letter].count; i++) {
                this.letterDistribution.push(letter);
            }
        }
    },

    addEventListeners: function() {
        document.getElementById('start-btn').addEventListener('click', () => this.init());
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('hidden');
            document.getElementById('start-modal').classList.remove('hidden');
        });
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('grid-wordfall').addEventListener('click', (e) => this.handleCellClick(e));
        document.getElementById('view-words-btn').addEventListener('click', () => this.showFoundWordsModal());
        document.getElementById('submit-word-btn').addEventListener('click', () => this.submitWord());
        document.getElementById('clear-selection-btn').addEventListener('click', () => this.clearSelection());
    },

    init: function() {
        document.getElementById('start-modal').classList.add('hidden');
        this.score = 0;
        this.level = 1;
        this.wordsFoundCount = 0;
        this.currentInterval = 8000;
        this.isPaused = false;
        this.gameOver = false;
        this.foundWords.clear();
        this.clearSelection();
        this.updateStats();

        this.grid = Array(this.rows * this.cols).fill(null);
        for (let r = this.rows - 5; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.grid[r * this.cols + c] = this.getRandomLetter();
            }
        }
        
        this.drawGrid();
        this.drawPreviewBar(true); // Initial empty bar

        if (this.gameLoopTimeoutId) clearTimeout(this.gameLoopTimeoutId);
        this.gameLoop();
    },
    
    gameLoop: function() {
        if (this.isPaused || this.gameOver || this.isProcessing) {
            this.gameLoopTimeoutId = setTimeout(() => this.gameLoop(), 100);
            return;
        }
        this.animatePreviewBar();
    },
    
    animatePreviewBar: function(previewIndex = 0) {
        if (this.isPaused || this.gameOver) return;

        if (previewIndex === 0) {
            this.previewRow = [];
            this.drawPreviewBar(true);
        }

        if (previewIndex < this.cols) {
            const newLetter = this.getRandomLetter();
            this.previewRow.push(newLetter);
            this.drawPreviewBar();

            const delay = this.currentInterval / this.cols;
            this.previewTimeoutId = setTimeout(() => this.animatePreviewBar(previewIndex + 1), delay);
        } else {
            this.dropRow();
        }
    },

    dropRow: async function() {
        this.isProcessing = true;
        
        for(let c = 0; c < this.cols; c++) {
            if (this.grid[c] !== null) {
                this.gameOver = true;
                this.handleGameOver();
                return;
            }
        }

        for (let i = this.grid.length - 1; i >= this.cols; i--) {
            this.grid[i] = this.grid[i - this.cols];
        }

        for (let c = 0; c < this.cols; c++) {
            this.grid[c] = this.previewRow[c];
        }
        
        this.playSound('C4', '16n');
        this.drawGrid(true);
        
        await this.applyGravity();
        
        this.isProcessing = false;
        this.gameLoopTimeoutId = setTimeout(() => this.gameLoop(), 500);
    },

    drawGrid: function(wasDrop = false) {
        const gridElement = document.getElementById('grid-wordfall');
        if (!gridElement) return;
        gridElement.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.grid.length; i++) {
            const cell = document.createElement('div');
            cell.dataset.index = i;
            cell.classList.add('cell');
            if (this.grid[i]) {
                cell.textContent = this.grid[i];
                if (wasDrop && i < this.cols) {
                    cell.classList.add('falling');
                }
            } else {
                cell.classList.add('empty');
            }
            fragment.appendChild(cell);
        }
        gridElement.appendChild(fragment);
        // Re-apply selection styles
        this.selectedLetters.forEach(({index}) => {
            const cell = gridElement.querySelector(`[data-index='${index}']`);
            if(cell) cell.classList.add('selected');
        });
    },
    
    drawPreviewBar: function(isEmpty = false) {
        const previewBar = document.getElementById('preview-bar-container');
        if (!previewBar) return;
        previewBar.innerHTML = '';
        for (let i = 0; i < this.cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('preview-cell');
            if (!isEmpty && this.previewRow[i]) {
                cell.textContent = this.previewRow[i];
                cell.classList.add('filled');
            }
            previewBar.appendChild(cell);
        }
    },

    updateStats: function() {
        const scoreEl = document.getElementById('score');
        const levelEl = document.getElementById('level');
        const wordsEl = document.getElementById('words-found');
        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
        if (wordsEl) wordsEl.textContent = this.wordsFoundCount;
    },

    updateCurrentWordDisplay: function() {
        const display = document.getElementById('current-word-display');
        if (display) {
            display.textContent = this.currentWord || 'Select letters...';
        }
    },

    updateActionButtons: function() {
        const submitBtn = document.getElementById('submit-word-btn');
        const clearBtn = document.getElementById('clear-selection-btn');
        if (submitBtn) submitBtn.disabled = this.currentWord.length < 3;
        if (clearBtn) clearBtn.disabled = this.currentWord.length === 0;
    },

    handleCellClick: function(e) {
        if (this.isProcessing || this.isPaused || this.gameOver) return;
        const target = e.target.closest('.cell');
        if (!target || target.classList.contains('empty')) return;

        const index = parseInt(target.dataset.index);
        const selectionIndex = this.selectedLetters.findIndex(l => l.index === index);

        if (selectionIndex > -1) {
            // Deselect
            this.selectedLetters.splice(selectionIndex, 1);
            target.classList.remove('selected');
        } else {
            // Select
            this.selectedLetters.push({ index });
            target.classList.add('selected');
        }
        
        this.currentWord = this.selectedLetters.map(l => this.grid[l.index]).join('');
        
        this.updateCurrentWordDisplay();
        this.updateActionButtons();
        this.playSound('E5', '16n');
    },

    submitWord: async function() {
        if (this.currentWord.length < 3 || this.isProcessing) return;

        const word = this.currentWord.toUpperCase();
        if (this.dyslexiaWordSet.has(word) && !this.foundWords.has(word)) {
            this.isProcessing = true;
            this.playSound('G5', '8n');
            
            let wordScore = 0;
            for(const letter of word) {
                wordScore += this.scrabbleTiles[letter].score;
            }
            this.score += wordScore * word.length;
            
            this.foundWords.add(word);
            this.wordsFoundCount++;
            this.updateStats();
            this.checkLevelUp();

            const indicesToClear = new Set(this.selectedLetters.map(l => l.index));
            await this.clearCells(indicesToClear);
            await this.applyGravity();
            
            this.clearSelection();
            this.isProcessing = false;
        } else {
            this.playSound('A3', '8n');
            this.clearSelection();
        }
    },

    clearSelection: function() {
        const gridElement = document.getElementById('grid-wordfall');
        if (gridElement) {
            this.selectedLetters.forEach(({ index }) => {
                const cell = gridElement.querySelector(`[data-index='${index}']`);
                if (cell) cell.classList.remove('selected');
            });
        }
        this.selectedLetters = [];
        this.currentWord = '';
        this.updateCurrentWordDisplay();
        this.updateActionButtons();
    },
    
    clearCells: async function(cellsToClear) {
        const gridElement = document.getElementById('grid-wordfall');
        if (!gridElement) return;
        cellsToClear.forEach(index => {
            const cellElement = gridElement.querySelector(`[data-index='${index}']`);
            if (cellElement) cellElement.classList.add('clearing');
        });
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        cellsToClear.forEach(index => { this.grid[index] = null; });
    },

    applyGravity: async function() {
        let fell = false;
        for (let c = 0; c < this.cols; c++) {
            for (let r = this.rows - 2; r >= 0; r--) {
                let fallToRow = r;
                while (fallToRow + 1 < this.rows && this.grid[(fallToRow + 1) * this.cols + c] === null) {
                    fallToRow++;
                }
                if (fallToRow !== r) {
                    const fallingIndex = r * this.cols + c;
                    const landingIndex = fallToRow * this.cols + c;
                    this.grid[landingIndex] = this.grid[fallingIndex];
                    this.grid[fallingIndex] = null;
                    fell = true;
                }
            }
        }
        if (fell) {
            this.drawGrid();
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },
    
    checkLevelUp: function() {
        const newLevel = Math.floor(this.score / 1500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.currentInterval = Math.max(2000, this.currentInterval * 0.9);
            this.updateStats();
            this.playSound('C6', '8n');
        }
    },

    togglePause: function() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) pauseBtn.textContent = this.isPaused ? 'RESUME' : 'PAUSE';
        
        if (!this.isPaused) {
            this.gameLoop();
        } else {
            clearTimeout(this.gameLoopTimeoutId);
            clearTimeout(this.previewTimeoutId);
        }
    },
    
    handleGameOver: function() {
        if (this.gameOver) return;
        this.gameOver = true;
        clearTimeout(this.gameLoopTimeoutId);
        clearTimeout(this.previewTimeoutId);
        const finalScoreEl = document.getElementById('final-score');
        const finalWordsEl = document.getElementById('final-words-found');
        const gameOverModal = document.getElementById('game-over-modal');

        if(finalScoreEl) finalScoreEl.textContent = this.score;
        if(finalWordsEl) finalWordsEl.textContent = this.wordsFoundCount;
        if(gameOverModal) {
            gameOverModal.classList.remove('hidden');
            gameOverModal.classList.add('flex');
        }
        this.playSound('C3', '2n');
    },
    
    showFoundWordsModal: function() {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;
        
        const tempDiv = document.createElement('div');
        
        let wordListHTML = '<dl>';
        const sortedWords = Array.from(this.foundWords).sort();
        
        sortedWords.forEach(word => {
            wordListHTML += `<dt>${word}</dt>`;
        });
        wordListHTML += '</dl>';

        tempDiv.innerHTML = `
            <div id="word-list-modal" class="modal fixed inset-0 flex items-center justify-center">
                <div class="word-list-modal-content">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold">Words Found</h2>
                        <button id="close-word-list" class="text-2xl font-bold">&times;</button>
                    </div>
                    ${wordListHTML}
                </div>
            </div>
        `;
        
        const modalElement = tempDiv.firstElementChild;
        modalContainer.appendChild(modalElement);
        
        modalElement.querySelector('#close-word-list').addEventListener('click', () => {
            modalElement.remove();
        });
    },

    getRandomLetter: function() {
        return this.letterDistribution[Math.floor(Math.random() * this.letterDistribution.length)];
    },
    
    playSound: function(note, duration) {
        if (!window.Tone) return;
        if (!this.synth) {
            try {
                this.synth = new Tone.Synth().toDestination();
            } catch (e) {
                console.error("Tone.js synth could not be created.", e);
                return;
            }
        }
        this.synth.triggerAttackRelease(note, duration);
    },

    cleanup: function() {
        clearTimeout(this.gameLoopTimeoutId);
        clearTimeout(this.previewTimeoutId);
        this.gameOver = true;
        if (this.styleElement) this.styleElement.remove();
        if (this.fontLink1) this.fontLink1.remove();
        if (this.fontLink2) this.fontLink2.remove();
        if (this.fontLink3) this.fontLink3.remove();
        this.styleElement = this.fontLink1 = this.fontLink2 = this.fontLink3 = null;
        document.body.classList.remove('wordfall-game-active');
        const gameBoardWrapper = document.getElementById('game-board-wrapper');
        if (gameBoardWrapper) gameBoardWrapper.innerHTML = '';
        const modalContainer = document.getElementById('modal-container');
        if(modalContainer) modalContainer.innerHTML = '';
    }
};