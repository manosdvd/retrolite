<<<<<<< HEAD
// --- Globally Scoped Variables, Constants, and Game Objects ---
let gameBoard, buttonContainer, statsContainer, gameStatus, keyboardContainer, modalContainer, gameTitle, gameRules, root, mainMenu, gameContainer;
let gameState = {};
let currentMode = null;
let synth;
let keyboard; // New global keyboard variable
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'];
const P1 = 1, P2 = -1, EMPTY = 0, AI = -1, HUMAN = 1;

const utils = {
    shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    getNeighbors: (i, rows, cols) => {
        const neighbors = [];
        const r = Math.floor(i / cols), c = i % cols;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) neighbors.push(nr * cols + nc);
        }
        return neighbors;
    },
    getSliderNeighbors: (index, size) => {
        const neighbors = [];
        const row = Math.floor(index / size), col = index % size;
        if (row > 0) neighbors.push(index - size);
        if (row < size - 1) neighbors.push(index + size);
        if (col > 0) neighbors.push(index - 1);
        if (col < size - 1) neighbors.push(index + 1);
        return neighbors;
    },
    isDraw: (board) => !board.includes(EMPTY),
    checkWin: (board, player, winLines) => {
        const line = winLines.find(line => line.every(index => board[index] === player));
        return line ? { line } : null;
    },
    checkConnectWin: (board, player) => {
        const W = 7, H = 6;
        // Check horizontal
        for (let r = 0; r < H; r++) {
            for (let c = 0; c <= W - 4; c++) {
                const line = [r*W+c, r*W+c+1, r*W+c+2, r*W+c+3];
                if (line.every(index => board[index] === player)) return line;
            }
        }
        // Check vertical
        for (let r = 0; r <= H - 4; r++) {
            for (let c = 0; c < W; c++) {
                const line = [r*W+c, (r+1)*W+c, (r+2)*W+c, (r+3)*W+c];
                if (line.every(index => board[index] === player)) return line;
            }
        }
        // Check diagonal (positive slope)
        for (let r = 0; r <= H - 4; r++) {
            for (let c = 0; c <= W - 4; c++) {
                const line = [r*W+c, (r+1)*W+c+1, (r+2)*W+c+2, (r+3)*W+c+3];
                if (line.every(index => board[index] === player)) return line;
            }
        }
        // Check diagonal (negative slope)
        for (let r = 3; r < H; r++) {
            for (let c = 0; c <= W - 4; c++) {
                const line = [r*W+c, (r-1)*W+c+1, (r-2)*W+c+2, (r-3)*W+c+3];
                if (line.every(index => board[index] === player)) return line;
            }
        }
        return null;
    }
};

const gameModes = {
    lightPuzzle: { name: 'lightPuzzle', title: 'DOPAMINE SWITCH', rules: 'Turn all the lights off.', gridSize: 5, setup: lightsOutGame.setup, handler: lightsOutGame.handler, color: '#ef4444', shadow: '#f87171', cleanup: lightsOutGame.cleanup },
    magicSquare: { name: 'magicSquare', title: 'HYPER FOCUS', rules: 'Make a square of lights around the edge.', gridSize: 3, setup: magicSquareGame.setup, handler: magicSquareGame.handler, color: '#8b5cf6', shadow: '#a78bfa', cleanup: magicSquareGame.cleanup },
    ticTacToe: { name: 'ticTacToe', title: 'PARALLEL PLAY', rules: 'Get three in a row.', gridSize: 3, setup: ticTacToeGame.setup, handler: ticTacToeGame.handler, color: '#3b82f6', shadow: '#60a5fa', cleanup: ticTacToeGame.cleanup },
    sequence: { name: 'sequence', title: 'WORKING MEMORY', rules: 'Repeat the sequence. Survive for 1 minute!', gridSize: 3, setup: echoGame.setup, handler: echoGame.handler, color: '#22c55e', shadow: '#4ade80', cleanup: echoGame.cleanup },
    wordGuess: {
        name: 'wordGuess',
        title: 'REJECTION SENSITIVITY',
        rules: 'Guess the 5-letter word.',
        gridRows: 6,
        gridCols: 5,
        setup: wordleGame.setup,
        handler: wordleGame.handler,
        color: '#f97316',
        shadow: '#fb923c',
        cleanup: wordleGame.cleanup,
        createCell: wordleGame.createCell
    },
    blackjack: { name: 'blackjack', title: 'DOPAMINE CHASE', rules: 'Get 21, or survive for 1 minute!', gridRows: 4, gridCols: 4, setup: blackjackGame.setup, handler: null, color: '#06b6d4', shadow: '#22d3ee', cleanup: blackjackGame.cleanup },
    lightMatch: { name: 'lightMatch', title: 'DOPAMINE HIT', rules: 'Match 3+ lights. Form special combos for bombs!', gridSize: 8, setup: lightMatchGame.setup, handler: null, color: '#f43f5e', shadow: '#fb7185', cleanup: lightMatchGame.cleanup },
    musicMachine: { name: 'musicMachine', title: 'AUDIO STIM', rules: 'Compose a tune.', gridSize: 3, setup: musicMachineGame.setup, handler: musicMachineGame.handler, color: '#d946ef', shadow: '#e879f9', cleanup: musicMachineGame.cleanup },
    sliderPuzzle: { name: 'sliderPuzzle', title: 'TASK SWITCH', rules: 'Order the tiles from 1 to 8.', gridSize: 3, setup: sliderPuzzleGame.setup, handler: sliderPuzzleGame.handler, color: '#ec4899', shadow: '#f472b6', cleanup: sliderPuzzleGame.cleanup },
    minefield: { name: 'minefield', title: 'OVER STIMULATION', rules: 'Clear the board without hitting a mine.', setup: minefieldGame.setup, handler: minefieldGame.handler, color: '#6b7280', shadow: '#9ca3af', cleanup: minefieldGame.cleanup },
    fourInARow: { name: 'fourInARow', title: 'BODY DOUBLE', rules: 'Get four in a row against the AI.', gridRows: 6, gridCols: 7, setup: connectGame.setup, handler: connectGame.handler, color: '#ec4899', shadow: '#f472b6', cleanup: connectGame.cleanup },
    colorConnect: { name: 'colorConnect', title: 'FLOW STATE', rules: 'Connect matching colors without crossing.', gridSize: 6, setup: lineDrawGame.setup, handler: null, color: '#14b8a6', shadow: '#2dd4bf', cleanup: lineDrawGame.cleanup },
    anxiety: {
    name: 'anxiety',
    title: 'ANXIETY',
    rules: 'Slide blocks to match 3 or more. Dont let the stack reach the top!',
    setup: function() {
        // Create a container for the game canvas and start button
        // This structure uses absolute positioning to ensure perfect centering
        gameBoard.innerHTML = `
            <div id="anxiety-container" style="position: relative; width: 100%; max-width: 500px; aspect-ratio: 500 / 600; margin: auto;">
                <canvas id="anxietyCanvas" width="500" height="600" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"></canvas>
                <div id="anxiety-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 2;">
                    <button id="anxiety-start-button" class="control-button btn-green">Start Game</button>
                </div>
            </div>
        `;

        const canvas = document.getElementById('anxietyCanvas');
        const ctx = canvas.getContext('2d');
        const startButton = document.getElementById('anxiety-start-button');
        const overlay = document.getElementById('anxiety-overlay');

        const audioManager = new AudioManager();
        const game = new AnxietyGame(ctx, canvas, audioManager);

        // 1. Initialize the game logic (creates blocks)
        game.init();
        
        // 2. Draw the initial state of the board so it appears behind the button
        game.draw();

        // 3. Set up the click event for the start button
        startButton.addEventListener('click', () => {
            // Initialize the audio on user interaction
            audioManager.init();

            // Start the game's animation and logic loop
            game.start();

            // Remove the overlay containing the button
            overlay.remove();

        }, { once: true }); // { once: true } is a safeguard to prevent multiple clicks

        // Store the game instance for later cleanup
        gameState.currentGameInstance = game;
    },
    // The cleanup function now correctly calls our new stop method
    cleanup: function() {
        if (gameState.currentGameInstance) {
            gameState.currentGameInstance.stop();
        }
    },
    color: '#FF4136',
    shadow: '#FF851B'
},
    spellingBee: { name: 'spellingBee', title: 'AUDITORY PROCESS', rules: 'Listen to the word and type it correctly.', setup: spellingBeeGame.setup, handler: null, cleanup: spellingBeeGame.cleanup, color: '#4f46e5', shadow: '#6366f1' },
    decryptGame: { name: 'decryptGame', title: 'UNMASK', setup: decryptGame.setup, handler: null, cleanup: decryptGame.cleanup, color: '#3d342a', shadow: '#5c5248' },
    numberCrunch: {
        name: 'numberCrunch',
        title: 'EXECUTIVE FUNCTION',
        rules: 'Use the numbers and operators to hit the target number.',
        gridSize: 4,
        setup: numberCrunchGame.setup,
        handler: numberCrunchGame.handler,
        color: '#9C27B0', /* Changed from yellow */
        shadow: '#c039d9', /* Changed from yellow */
        cleanup: numberCrunchGame.cleanup
    },
    fractionFlipper: {
        name: 'fractionFlipper',
        title: 'TASK INITIATION',
        rules: 'Add fractions to match the target value.',
        setup: fractionFlipperGame.setup,
        handler: null,
        color: '#10b981',
        shadow: '#34d399',
        cleanup: fractionFlipperGame.cleanup
    },
    
    gauntlet: { name: 'gauntlet', title: 'SURVIVAL MODE', rules: 'Survive as long as you can!', setup: () => gauntlet.start(), handler: null, color: '#facc15', shadow: '#fde047', cleanup: () => gauntlet.end() }
};

const gauntlet = {
    isActive: false,
    score: 0,
    timerInterval: null, 
    availableGames: [],

    startTimer: function(duration, onEnd) {
        let timeLeft = duration;
        const timerEl = document.getElementById('gauntlet-timer');

        const updateTimer = () => {
            if (timerEl) timerEl.textContent = `TIME: ${timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                onEnd();
            }
            timeLeft--;
        };
        updateTimer();
        this.timerInterval = setInterval(updateTimer, 1000);
    },

    clearTimer: function() {
        clearInterval(this.timerInterval);
    },

    start: function() {
        this.isActive = true;
        this.score = 0;
        this.availableGames = Object.keys(gameModes).filter(k => k !== 'musicMachine' && k !== 'gauntlet');
        utils.shuffleArray(this.availableGames);
        this.nextGame();
    },
    shuffleGames: function() {
        utils.shuffleArray(this.availableGames);
    },
    nextGame: function() {
        if (!this.isActive) return;
        if (this.availableGames.length === 0) this.shuffleGames();
        const nextGameKey = this.availableGames.pop();
        startGame(gameModes[nextGameKey]);
    },
    onGameComplete: function(isSuccess) {
        if (!this.isActive) return;
        this.clearTimer();
        if (isSuccess) {
            this.score++;
            playSound('G5', '8n');
            const successModal = createModal('success-modal', 'SUCCESS!', `<p class="text-2xl">Score: ${this.score}</p>`, 'Next Game', () => {
                successModal.remove();
                this.nextGame();
            });
            setTimeout(() => successModal.classList.add('is-visible'), 10);
        } else {
            playSound('C3', '2n');
            this.end();
        }
    },
    end: function() {
        const finalScore = this.score;
        this.isActive = false;
        this.score = 0;
        this.clearTimer();
        const endModal = createModal('gauntlet-over-modal', 'Gauntlet Over', `<p class="text-2xl">Your final score is ${finalScore}.</p>`, 'Main Menu', () => {
            endModal.remove();
            document.getElementById('game-container').classList.add('hidden');
            document.getElementById('main-menu').classList.remove('hidden');
            currentMode = null;
        });
        setTimeout(() => endModal.classList.add('is-visible'), 10);
    }
};

function updateStats(text) { if (statsContainer) statsContainer.textContent = text; }
function playSound(note, duration = '8n') {
    try {
        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }
        const localSynth = new Tone.Synth().toDestination();
        localSynth.triggerAttackRelease(note, duration);
    } catch (error) {
        console.error("Tone.js error:", error);
    }
}
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function createControlButton(text, colorClass, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('control-button', colorClass);
    button.addEventListener('click', onClick);
    return button;
}

function createModal(id, title, content, buttonText, onButtonClick) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="confetti-container"></div>
            <h2 class="text-4xl font-bold mb-4">${title}</h2>
            <div id="${id}-content" class="text-lg mb-6">${content}</div>
            <button id="${id}-button" class="control-button btn-red">${buttonText}</button>
        </div>
    `;
    modalContainer.appendChild(modal);
    document.getElementById(`${id}-button`).addEventListener('click', onButtonClick);
    return modal;
}
function showWinModal(title, message) {
    const winModal = createModal('win-modal', title, `<p>${message}</p>`, 'Play Again', () => {
        winModal.remove();
        if (currentMode) startGame(currentMode);
    });
    
    if(title.toLowerCase().includes('win')) {
        const confettiContainer = winModal.querySelector('.confetti-container');
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confettiContainer.appendChild(confetti);
        }
    } else {
        winModal.querySelector('.modal-content').classList.add('shake');
    }

    setTimeout(() => winModal.classList.add('is-visible'), 10);
}
function getValidColumns(board) {
    const W = 7;
    const validCols = [];
    for (let c = 0; c < W; c++) {
        if (board[c] === EMPTY) {
            validCols.push(c);
        }
    }
    return validCols;
}

function handleBoardClick(e) {
    if (e.target.matches('.light') && currentMode && currentMode.handler) {
        currentMode.handler(e, 'click');
    }
}
function handleBoardContextMenu(e) {
    e.preventDefault();
    if (e.target.matches('.light') && currentMode && currentMode.handler) {
        currentMode.handler(e, 'contextmenu');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mainMenu = document.getElementById('main-menu');
    gameContainer = document.getElementById('game-container');
    gameBoard = document.getElementById('game-board');
    gameTitle = document.getElementById('game-title');
    gameStatus = document.getElementById('game-status');
    gameRules = document.getElementById('game-rules');
    modalContainer = document.getElementById('modal-container');
    statsContainer = document.getElementById('stats-container');
    buttonContainer = document.getElementById('button-container');
    keyboardContainer = document.getElementById('keyboard-container');
    root = document.documentElement;

=======
document.addEventListener('DOMContentLoaded', () => {
    // --- Clock ---
>>>>>>> c183d2a (First commit)
    const clockElement = document.getElementById('digital-clock');
    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

<<<<<<< HEAD
    mainMenu.addEventListener('click', (e) => {
        if (e.target.matches('[data-mode]')) {
            playSound('C4', '16n');
            const modeKey = e.target.dataset.mode;
            if (gameModes[modeKey]) {
                mainMenu.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                if (modeKey === 'gauntlet') {
                    gauntlet.start();
                } else {
                    gauntlet.isActive = false;
                    startGame(gameModes[modeKey]);
                }
            }
        }
    });

    // Global keyboard event listener
    document.addEventListener('keydown', (e) => {
        if (currentMode && currentMode.handler) {
            currentMode.handler(e, 'keydown');
        }
    });
});

window.startGame = function(mode) {
    // --- THIS IS THE FIX ---
    // Perform a COMPLETE cleanup of the previous game state and UI first.
    if (currentMode && typeof currentMode.cleanup === 'function') {
        currentMode.cleanup();
    }

    // 1. Reset the main game board completely. This is the most critical step.
    gameBoard.innerHTML = '';
    gameBoard.className = ''; // Wipes all old classes like 'game-grid'
    gameBoard.style.cssText = ''; // Wipes any inline styles

    // 2. Clear all other shared containers.
    keyboardContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    statsContainer.innerHTML = '';
    modalContainer.innerHTML = '';
    gameStatus.textContent = '';
    
    // Now that everything is clean, set the new mode.
    currentMode = mode;
    // --- END OF FIX ---


    // Set up classes for keyboard-based games
    const keyboardGames = ['wordGuess', 'spellingBee', 'decryptGame'];
    gameContainer.classList.toggle('keyboard-active', keyboardGames.includes(mode.name));

    // Set title and theme colors
    gameTitle.textContent = mode.title;
    gameRules.textContent = mode.rules;
    root.style.setProperty('--theme-color', mode.color);
    root.style.setProperty('--theme-shadow-color', mode.shadow);
    gameTitle.style.color = mode.color;
    gameTitle.style.textShadow = `0 0 10px ${mode.shadow}`;

    // Add base class for grid games (but NOT for anxiety)
    if (mode.name !== 'anxiety') {
        gameBoard.classList.add('game-grid', 'mb-2');
    } // --- THIS IS THE FIX: Reset all classes first ---

    if (mode.gridSize || (mode.gridRows && mode.gridCols)) {
        const rows = mode.gridRows || mode.gridSize;
        const cols = mode.gridCols || mode.gridSize;
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < rows * cols; i++) {
            let cell;
            if (typeof mode.createCell === 'function') {
                cell = mode.createCell(i);
            } else {
                cell = document.createElement('div');
                cell.className = 'light';
            }
            cell.dataset.index = i;
            fragment.appendChild(cell);
        }
        gameBoard.appendChild(fragment);
    }
    
    const backButton = createControlButton('Menu', 'btn-red', () => {
        // Run the game's specific cleanup function
        if (currentMode && typeof currentMode.cleanup === 'function') {
            currentMode.cleanup();
        }
        
        // --- THIS IS THE FIX ---
        // Manually clear all shared containers before going back to the menu
        keyboardContainer.innerHTML = '';
        buttonContainer.innerHTML = '';
        statsContainer.innerHTML = '';
        gameStatus.textContent = '';
        gameBoard.innerHTML = ''; // Also clear the game board itself
        // --- END OF FIX ---

        gameContainer.classList.remove('keyboard-active'); // ADD THIS LINE TO RESET THE CONTAINER'S LAYOUT
        gameContainer.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        currentMode = null;
    });
    buttonContainer.appendChild(backButton);

    mode.setup();

    gameBoard.addEventListener('click', handleBoardClick);
    gameBoard.addEventListener('contextmenu', handleBoardContextMenu);
}
=======
    // --- DOM Elements ---
    const mainMenu = document.getElementById('main-menu');
    const gameContainer = document.getElementById('game-container');
    let gameBoard = document.getElementById('game-board');
    const gameTitle = document.getElementById('game-title');
    const gameStatus = document.getElementById('game-status');
    const gameRules = document.getElementById('game-rules');
    const modalContainer = document.getElementById('modal-container');
    const statsContainer = document.getElementById('stats-container');
    const buttonContainer = document.getElementById('button-container');
    const keyboardContainer = document.getElementById('keyboard-container');
    const root = document.documentElement;

    // --- Game State and Constants ---
    let gameState = {};
    let currentMode = null;
    const synth = new Tone.Synth().toDestination();
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'];
    const P1 = 1, P2 = -1, EMPTY = 0, AI = -1, HUMAN = 1;

    // --- Gauntlet Mode Object ---
    const gauntlet = {
        isActive: false,
        score: 0,
        gameTimer: null,
        availableGames: [],

        start: function() {
            this.isActive = true;
            this.score = 0;
            this.availableGames = Object.keys(gameModes).filter(k => k !== 'musicMachine' && k !== 'gauntlet');
            this.shuffleGames();
            this.nextGame();
        },

        shuffleGames: function() {
            for (let i = this.availableGames.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.availableGames[i], this.availableGames[j]] = [this.availableGames[j], this.availableGames[i]];
            }
        },

        nextGame: function() {
            if (!this.isActive) return;
            if (this.availableGames.length === 0) {
                this.shuffleGames();
            }
            const nextGameKey = this.availableGames.pop();
            const mode = gameModes[nextGameKey];
            startGame(mode);
        },

        onGameComplete: function(isSuccess) {
            if (!this.isActive) return;

            clearTimeout(this.gameTimer);
            this.gameTimer = null;

            if (isSuccess) {
                this.score++;
                playSound('G5', '8n');
                const successModal = createModal('success-modal', 'SUCCESS!', `<p class="text-2xl">Score: ${this.score}</p>`, 'Next Game', () => {
                    successModal.remove();
                    this.nextGame();
                });
                setTimeout(() => successModal.classList.add('is-visible'), 10);
            } else {
                playSound('C3', '2n');
                this.end();
            }
        },

        end: function() {
            const finalScore = this.score;
            this.isActive = false;
            this.score = 0;
            clearTimeout(this.gameTimer);
            this.gameTimer = null;

            const endModal = createModal('gauntlet-over-modal', 'Gauntlet Over',
                `<p class="text-2xl">Your final score is ${finalScore}.</p>`,
                'Main Menu',
                () => {
                    endModal.remove();
                    gameContainer.classList.add('hidden');
                    mainMenu.classList.remove('hidden');
                    currentMode = null;
                }
            );
            setTimeout(() => endModal.classList.add('is-visible'), 10);
        }
    };

    // --- Main Menu Logic ---
    mainMenu.addEventListener('click', (e) => {
        if (e.target.matches('[data-mode]')) {
            const modeKey = e.target.dataset.mode;
            if (gameModes[modeKey]) {
                mainMenu.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                if (modeKey === 'gauntlet') {
                    gauntlet.start();
                } else {
                    gauntlet.isActive = false;
                    startGame(gameModes[modeKey]);
                }
            }
        }
    });

    // --- Event Handlers for the Game Board ---
    function handleBoardClick(e) {
        if (e.target.matches('.light') && currentMode && currentMode.handler) {
            currentMode.handler(e, 'click');
        }
    }

    function handleBoardContextMenu(e) {
        e.preventDefault();
        if (e.target.matches('.light') && currentMode && currentMode.handler) {
            currentMode.handler(e, 'contextmenu');
        }
    }
    
    // --- General Game Functions ---
    function startGame(mode) {
        const newGameBoard = gameBoard.cloneNode(false);
        gameBoard.parentNode.replaceChild(newGameBoard, gameBoard);
        gameBoard = newGameBoard;
        
        gameBoard.addEventListener('click', handleBoardClick);
        gameBoard.addEventListener('contextmenu', handleBoardContextMenu);
        
        if (currentMode) {
            if (currentMode.name === 'wordGuess') {
                window.removeEventListener('keydown', wordleGame.handler);
            } else if (currentMode.name === 'colorConnect') {
                window.removeEventListener('mousemove', lineDrawGame.handleMouseMove);
                window.removeEventListener('mouseup', lineDrawGame.handleMouseUp);
                window.removeEventListener('touchmove', lineDrawGame.handleMouseMove);
                window.removeEventListener('touchend', lineDrawGame.handleMouseUp);
            }
        }

        currentMode = mode;
        gameTitle.textContent = mode.title;
        gameRules.textContent = mode.rules;
        root.style.setProperty('--theme-color', mode.color);
        root.style.setProperty('--theme-shadow-color', mode.shadow);
        gameTitle.style.color = mode.color;
        gameTitle.style.textShadow = `0 0 10px ${mode.shadow}`;
        
        gameContainer.classList.toggle('wordle-active', mode.name === 'wordGuess');

        gameBoard.innerHTML = '';
        gameBoard.className = 'game-grid mb-2';
        keyboardContainer.innerHTML = '';
        statsContainer.innerHTML = '';
        buttonContainer.innerHTML = '';
        modalContainer.innerHTML = '';
        
        if (gauntlet.isActive) {
            gameStatus.innerHTML = `GAUNTLET SCORE: ${gauntlet.score} <span id="gauntlet-timer" class="ml-4 text-cyan-400"></span>`;
        } else {
            gameStatus.textContent = '';
        }
        
        const cols = mode.gridCols || mode.gridSize;
        const rows = mode.gridRows || mode.gridSize;
        
        if (cols || rows) {
            gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            gameBoard.classList.toggle('large-grid', cols > 5 || rows > 5);
        
            if (mode.name !== 'minefield' && mode.name !== 'wordGuess' && mode.name !== 'lightMatch') {
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < rows * cols; i++) {
                    const light = document.createElement('div');
                    light.classList.add('light');
                    light.dataset.index = i;
                    fragment.appendChild(light);
                }
                gameBoard.appendChild(fragment);
            }
        }
        
        mode.setup();

        const backButtonText = gauntlet.isActive ? 'Quit Gauntlet' : 'Menu';
        const backButton = createControlButton(backButtonText, 'btn-red', () => {
            if (gauntlet.isActive) {
                gauntlet.end();
            } else {
                gameContainer.classList.add('hidden');
                mainMenu.classList.remove('hidden');
                if (currentMode && currentMode.name === 'wordGuess') {
                    window.removeEventListener('keydown', wordleGame.handler);
                }
                currentMode = null;
            }
        });
        buttonContainer.appendChild(backButton);

        const timedGames = ['blackjack', 'sequence', 'lightMatch'];
        if (gauntlet.isActive && timedGames.includes(mode.name)) {
            let timeLeft = mode.name === 'lightMatch' ? 120 : 60;
            const timerEl = document.getElementById('gauntlet-timer');
            const updateTimer = () => {
                if(timerEl) timerEl.textContent = `TIME: ${timeLeft}`;
                if (timeLeft <= 0) {
                    clearInterval(gauntlet.gameTimer);
                    const isWin = mode.name === 'lightMatch' ? (gameState.score >= 1000) : true;
                    gauntlet.onGameComplete(isWin);
                }
                timeLeft--;
            };
            updateTimer();
            gauntlet.gameTimer = setInterval(updateTimer, 1000);
        }
    }
    
    function createControlButton(text, colorClass, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('control-button', colorClass);
        button.addEventListener('click', onClick);
        return button;
    }
    
    function createModal(id, title, content, buttonText, onButtonClick) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="text-4xl font-bold mb-4">${title}</h2>
                <div id="${id}-content" class="text-lg mb-6">${content}</div>
                <button id="${id}-button" class="control-button btn-red">${buttonText}</button>
            </div>
        `;
        modalContainer.appendChild(modal);
        document.getElementById(`${id}-button`).addEventListener('click', onButtonClick);
        return modal;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function showWinModal(title, message) {
        const winModal = createModal('win-modal', title, `<p>${message}</p>`, 'Play Again', () => {
            winModal.remove();
            if (currentMode) startGame(currentMode);
        });
        setTimeout(() => winModal.classList.add('is-visible'), 10);
    }

    function playSound(note, duration = '8n') {
        try {
            synth.triggerAttackRelease(note, duration);
        } catch (error) {
            console.error("Tone.js error:", error);
        }
    }
    
    // --- Individual Game Logic ---

    const lightsOutGame = {
        setup: () => {
            gameState = { board: Array(25).fill(0), moves: 0 };
            for (let i = 0; i < 15; i++) {
                const randomIndex = Math.floor(Math.random() * 25);
                lightsOutGame.toggle(randomIndex, 5, gameState.board);
            }
            if (!gauntlet.isActive) {
                const solveButton = createControlButton('Solve', 'btn-yellow', lightsOutGame.solve);
                buttonContainer.prepend(solveButton);
            }
            lightsOutGame.updateBoard();
            updateStats(`Moves: 0`);
        },
        handler: (e) => {
            if (gameState.isSolving) return;
            const index = parseInt(e.target.dataset.index);
            playSound(notes[index % 9]);
            lightsOutGame.toggle(index, 5, gameState.board);
            gameState.moves++;
            lightsOutGame.updateBoard();
            updateStats(`Moves: ${gameState.moves}`);
            if (gameState.board.every(light => light === 0)) {
                if (gauntlet.isActive) { gauntlet.onGameComplete(true); }
                else { showWinModal('You Win!', `You solved it in ${gameState.moves} moves.`); }
            }
        },
        toggle: (index, size, board) => {
            const row = Math.floor(index / size);
            const col = index % size;
            const positions = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
            positions.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                    const i = newRow * size + newCol;
                    board[i] = 1 - board[i];
                }
            });
        },
        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('.light');
            lights.forEach((light, i) => {
                light.classList.toggle('is-on', gameState.board[i] === 1);
                light.classList.toggle('is-off', gameState.board[i] === 0);
            });
        },
        solve: async () => {
            if (gameState.isSolving) return;
            gameState.isSolving = true;
            document.querySelector('.btn-yellow').disabled = true;
            let matrix = [];
            for (let i = 0; i < 25; i++) {
                let row = Array(26).fill(0);
                row[i] = 1;
                let r = Math.floor(i / 5), c = i % 5;
                if (r > 0) row[i - 5] = 1; if (r < 4) row[i + 5] = 1;
                if (c > 0) row[i - 1] = 1; if (c < 4) row[i + 1] = 1;
                row[25] = gameState.board[i];
                matrix.push(row);
            }
            for (let i = 0; i < 25; i++) {
                let pivot = i;
                while (pivot < 25 && matrix[pivot][i] === 0) pivot++;
                if (pivot < 25) {
                    [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];
                    for (let j = i + 1; j < 25; j++) {
                        if (matrix[j][i] === 1) {
                            for (let k = i; k <= 25; k++) matrix[j][k] = (matrix[j][k] + matrix[i][k]) % 2;
                        }
                    }
                }
            }
            let solution = Array(25).fill(0);
            for (let i = 24; i >= 0; i--) {
                let sum = 0;
                for (let j = i + 1; j < 25; j++) sum = (sum + matrix[i][j] * solution[j]) % 2;
                solution[i] = (matrix[i][25] + sum) % 2;
            }
            const presses = solution.map((p, i) => p === 1 ? i : -1).filter(i => i !== -1);
            for (const pressIndex of presses) {
                const light = gameBoard.querySelector(`[data-index='${pressIndex}']`);
                light.classList.add('is-highlight');
                await delay(200);
                lightsOutGame.toggle(pressIndex, 5, gameState.board);
                lightsOutGame.updateBoard();
                playSound(notes[pressIndex % 9]);
                await delay(200);
                light.classList.remove('is-highlight');
            }
            gameState.isSolving = false;
            document.querySelector('.btn-yellow').disabled = false;
            gameStatus.textContent = "Solved!";
        }
    };

    const magicSquareGame = {
        setup: () => {
            const merlinToggles = [
                [0, 1, 3], [0, 1, 2, 4], [1, 2, 5], [0, 3, 4, 6], [1, 3, 4, 5, 7],
                [2, 4, 5, 8], [3, 6, 7], [4, 6, 7, 8], [5, 7, 8]
            ];
            gameState = { board: [1, 1, 1, 1, 0, 1, 1, 1, 1], moves: 0, toggles: merlinToggles };
            const scrambleMoves = Math.floor(Math.random() * 5) + 5;
            for (let i = 0; i < scrambleMoves; i++) {
                const randomIndex = Math.floor(Math.random() * 9);
                gameState.toggles[randomIndex].forEach(toggleIndex => {
                    gameState.board[toggleIndex] = 1 - gameState.board[toggleIndex];
                });
            }
            magicSquareGame.updateBoard();
            updateStats(`Moves: 0`);
        },
        handler: (e) => {
            const index = parseInt(e.target.dataset.index);
            playSound(notes[index % 9]);
            gameState.toggles[index].forEach(toggleIndex => {
                gameState.board[toggleIndex] = 1 - gameState.board[toggleIndex];
            });
            gameState.moves++;
            magicSquareGame.updateBoard();
            updateStats(`Moves: ${gameState.moves}`);
            magicSquareGame.checkWin();
        },
        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('.light');
            lights.forEach((light, i) => {
                light.classList.toggle('is-on', gameState.board[i] === 1);
                light.classList.toggle('is-off', gameState.board[i] === 0);
            });
        },
        checkWin: () => {
            const winState = [1, 1, 1, 1, 0, 1, 1, 1, 1];
            if (gameState.board.every((val, i) => val === winState[i])) {
                if (gauntlet.isActive) { gauntlet.onGameComplete(true); }
                else { showWinModal('You Win!', `You solved the puzzle in ${gameState.moves} moves!`); }
            }
        }
    };

    const ticTacToeGame = {
        setup: () => {
            gameState = { 
                board: Array(9).fill(EMPTY), currentPlayer: P1, gameOver: false,
                mode: gauntlet.isActive ? 'CPU' : (gameState.mode || 'CPU'),
                winLines: [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]
            };
            if (!gauntlet.isActive) {
                const modeButton = createControlButton(`Mode: ${gameState.mode}`, 'btn-blue', () => {
                    gameState.mode = gameState.mode === 'CPU' ? '2P' : 'CPU';
                    startGame(currentMode);
                });
                buttonContainer.prepend(modeButton);
            }
            ticTacToeGame.updateBoard();
            gameStatus.textContent = "Player 1's Turn";
        },
        handler: (e) => {
            if (gameState.gameOver) return;
            if (gameState.mode === 'CPU' && gameState.currentPlayer === AI) return;
            
            const index = parseInt(e.target.dataset.index);
            if (gameState.board[index] !== EMPTY) return;

            ticTacToeGame.makeMove(index, gameState.currentPlayer);
            
            if (!gameState.gameOver && gameState.mode === 'CPU') {
                gameStatus.textContent = "CPU's Turn...";
                setTimeout(ticTacToeGame.aiMove, 500);
            }
        },
        makeMove: (index, player) => {
            if (gameState.gameOver) return;
            gameState.board[index] = player;
            playSound(player === HUMAN ? 'C4' : 'G3');
            ticTacToeGame.updateBoard();
            const winInfo = checkWin(gameState.board, player, gameState.winLines);
            if (winInfo) {
                ticTacToeGame.end(player === P1 ? 'Player 1 Wins!' : 'CPU Wins!', winInfo.line);
            } else if (isDraw(gameState.board)) {
                ticTacToeGame.end("It's a Draw!");
            } else {
                gameState.currentPlayer *= -1;
                const turnText = gameState.mode === '2P' ? `Player ${gameState.currentPlayer === P1 ? 1 : 2}'s Turn` : "Your Turn";
                if(!gauntlet.isActive) gameStatus.textContent = turnText;
            }
        },
        aiMove: () => {
            if (gameState.gameOver) return;
            const bestMove = ticTacToeGame.findBestMove(gameState.board);
            ticTacToeGame.makeMove(bestMove, AI);
        },
        findBestMove: (board) => {
            let bestVal = -Infinity;
            let move = -1;
            for (let i = 0; i < 9; i++) {
                if (board[i] === EMPTY) {
                    board[i] = AI;
                    let moveVal = ticTacToeGame.minimax(board, 0, false);
                    board[i] = EMPTY;
                    if (moveVal > bestVal) {
                        move = i;
                        bestVal = moveVal;
                    }
                }
            }
            return move;
        },
        minimax: (board, depth, isMax) => {
            const score = ticTacToeGame.evaluate(board);
            if (score === 10) return score - depth;
            if (score === -10) return score + depth;
            if (isDraw(board)) return 0;

            if (isMax) {
                let best = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === EMPTY) {
                        board[i] = AI;
                        best = Math.max(best, ticTacToeGame.minimax(board, depth + 1, !isMax));
                        board[i] = EMPTY;
                    }
                }
                return best;
            } else {
                let best = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === EMPTY) {
                        board[i] = HUMAN;
                        best = Math.min(best, ticTacToeGame.minimax(board, depth + 1, !isMax));
                        board[i] = EMPTY;
                    }
                }
                return best;
            }
        },
        evaluate: (board) => {
            for (const line of gameState.winLines) {
                if (line.every(i => board[i] === AI)) return 10;
                if (line.every(i => board[i] === HUMAN)) return -10;
            }
            return 0;
        },
        end: (message, winLine = null) => {
            gameState.gameOver = true;
            if (gauntlet.isActive) {
                const isWin = message.includes('Player 1 Wins!');
                gauntlet.onGameComplete(isWin);
            } else {
                gameStatus.textContent = message;
                if (winLine) ticTacToeGame.drawWinLine(winLine);
                showWinModal(message, "A classic battle.");
            }
        },
        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('.light');
            lights.forEach((light, i) => {
                light.className = 'light';
                if (gameState.board[i] === P1) light.classList.add('is-player-1');
                else if (gameState.board[i] === P2) light.classList.add('is-player-2');
                else light.classList.add('is-empty');
            });
        },
        drawWinLine: (line) => {
            const startCell = gameBoard.children[line[0]];
            const endCell = gameBoard.children[line[2]];
            const boardRect = gameBoard.getBoundingClientRect();
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();

            const lineEl = document.createElement('div');
            lineEl.classList.add('win-line');
            
            const startX = startRect.left + startRect.width / 2 - boardRect.left;
            const startY = startRect.top + startRect.height / 2 - boardRect.top;
            const endX = endRect.left + endRect.width / 2 - boardRect.left;
            const endY = endRect.top + endRect.height / 2 - boardRect.top;

            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
            const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

            lineEl.style.width = `${length}px`;
            lineEl.style.top = `${startY}px`;
            lineEl.style.left = `${startX}px`;
            lineEl.style.transform = `rotate(${angle}deg)`;
            
            gameBoard.appendChild(lineEl);
        }
    };
    
    const echoGame = {
        setup: () => {
            gameState = { sequence: [], playerSequence: [], level: 1, state: 'WATCH' };
            gameBoard.querySelectorAll('.light').forEach(light => light.classList.add('is-off'));
            const startButton = createControlButton('Start', 'btn-green', () => {
                if (gameState.state === 'WATCH') {
                    startButton.remove();
                    echoGame.nextSequence();
                }
            });
            buttonContainer.prepend(startButton);
            updateStats(`Level: 1`);
            if(!gauntlet.isActive) gameStatus.textContent = "Press Start";
        },
        nextSequence: () => {
            gameState.state = 'WATCH';
            updateStats(`Level: ${gameState.level}`);
            const nextIndex = Math.floor(Math.random() * 9);
            gameState.sequence.push(nextIndex);
            echoGame.playSequence();
        },
        playSequence: async () => {
            gameState.state = 'WATCH';
            if(!gauntlet.isActive) gameStatus.textContent = "Watch carefully...";
            gameBoard.style.pointerEvents = 'none';
            for (const index of gameState.sequence) {
                const light = gameBoard.querySelector(`[data-index='${index}']`);
                light.classList.add(`echo-${index+1}`);
                light.classList.remove('is-off');
                playSound(notes[index]);
                await delay(400);
                light.classList.add('is-off');
                light.classList.remove(`echo-${index+1}`);
                await delay(200);
            }
            gameState.state = 'PLAY';
            if(!gauntlet.isActive) gameStatus.textContent = "Your turn!";
            gameState.playerSequence = [];
            gameBoard.style.pointerEvents = 'auto';
        },
        handler: (e) => {
            if (gameState.state !== 'PLAY') return;
            const index = parseInt(e.target.dataset.index);
            
            const light = e.target;
            light.classList.add(`echo-${index+1}`);
            light.classList.remove('is-off');
            playSound(notes[index]);
            setTimeout(() => {
                light.classList.add('is-off');
                light.classList.remove(`echo-${index+1}`);
            }, 300);
            
            gameState.playerSequence.push(index);
            const currentMoveIndex = gameState.playerSequence.length - 1;

            if (gameState.playerSequence[currentMoveIndex] !== gameState.sequence[currentMoveIndex]) {
                gameState.state = 'WATCH';
                if (gauntlet.isActive) {
                    gauntlet.onGameComplete(false);
                } else {
                    gameStatus.textContent = "Wrong! Game Over.";
                    playSound('C3', '4n');
                    showWinModal('Game Over', `You reached level ${gameState.level}.`);
                }
                return;
            }

            if (gameState.playerSequence.length === gameState.sequence.length) {
                gameState.level++;
                gameState.state = 'WATCH';
                setTimeout(echoGame.nextSequence, 1000);
            }
        }
    };

    const wordleGame = {
        setup: () => {
            const { gridRows, gridCols } = currentMode;
            gameState = {
                secretWord: wordList[Math.floor(Math.random() * wordList.length)],
                currentRow: 0,
                currentCol: 0,
                board: Array(gridRows).fill().map(() => Array(gridCols).fill('')),
                gameOver: false,
                keyColors: {}
            };

            gameBoard.classList.add('wordle-grid');
            const fragment = document.createDocumentFragment();
            for(let i=0; i < gridRows * gridCols; i++) {
                const cell = document.createElement('div');
                cell.className = 'light wordle-cell';
                cell.innerHTML = `<div class="wordle-cell-inner"><div class="wordle-cell-front"></div><div class="wordle-cell-back"></div></div>`;
                fragment.appendChild(cell);
            }
            gameBoard.appendChild(fragment);

            wordleGame.createKeyboard();
            window.addEventListener('keydown', wordleGame.handler);
            setTimeout(wordleGame.scrollActiveRowIntoView, 100);
        },
        createKeyboard: () => {
            const keys = [
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
            ];
            const keyboardFragment = document.createDocumentFragment();
            keys.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'keyboard-row';
                row.forEach(key => {
                    const keyDiv = document.createElement('div');
                    keyDiv.className = 'key';
                    keyDiv.textContent = key;
                    keyDiv.dataset.key = key;
                    if (key === 'Enter' || key === 'Backspace') {
                        keyDiv.classList.add('key-large');
                    }
                    keyDiv.addEventListener('click', () => wordleGame.handler({key}));
                    rowDiv.appendChild(keyDiv);
                });
                keyboardFragment.appendChild(rowDiv);
            });
            keyboardContainer.appendChild(keyboardFragment);
        },
        handler: (e) => {
            if (gameState.gameOver) return;
            const { key } = e;
            if (key === 'Enter') {
                wordleGame.submitGuess();
            } else if (key === 'Backspace' || key === 'del') {
                wordleGame.deleteLetter();
            } else if (key.match(/^[a-z]$/i) && gameState.currentCol < currentMode.gridCols) {
                wordleGame.typeLetter(key.toLowerCase());
            }
        },
        typeLetter: (letter) => {
            if (gameState.currentCol >= currentMode.gridCols) return;
            gameState.board[gameState.currentRow][gameState.currentCol] = letter;
            const cellIndex = gameState.currentRow * currentMode.gridCols + gameState.currentCol;
            const cell = gameBoard.children[cellIndex].querySelector('.wordle-cell-front');
            cell.textContent = letter;
            gameState.currentCol++;
        },
        deleteLetter: () => {
            if (gameState.currentCol > 0) {
                gameState.currentCol--;
                gameState.board[gameState.currentRow][gameState.currentCol] = '';
                const cellIndex = gameState.currentRow * currentMode.gridCols + gameState.currentCol;
                const cell = gameBoard.children[cellIndex].querySelector('.wordle-cell-front');
                cell.textContent = '';
            }
        },
        submitGuess: async () => {
            if (gameState.gameOver || gameState.currentCol < currentMode.gridCols) {
                if(!gauntlet.isActive) gameStatus.textContent = "Not enough letters";
                setTimeout(() => { if(!gauntlet.isActive) gameStatus.textContent = '' }, 2000);
                return;
            }
            const guess = gameState.board[gameState.currentRow].join('');
            if (!wordList.includes(guess)) {
                if(!gauntlet.isActive) gameStatus.textContent = "Not in word list";
                const rowCells = Array.from(gameBoard.children).slice(gameState.currentRow * 5, gameState.currentRow * 5 + 5);
                rowCells.forEach(cell => cell.classList.add('shake'));
                setTimeout(() => {
                    rowCells.forEach(cell => cell.classList.remove('shake'));
                    if(!gauntlet.isActive) gameStatus.textContent = '';
                }, 600);
                return;
            }
            
            const secret = gameState.secretWord;
            const feedback = Array(5).fill('');
            let secretCopy = secret.split('');
            for(let i=0; i<5; i++) {
                if(guess[i] === secret[i]) {
                    feedback[i] = 'correct';
                    secretCopy[i] = null;
                    gameState.keyColors[guess[i]] = 'wordle-correct';
                }
            }
            for(let i=0; i<5; i++) {
                if(feedback[i] === '' && secretCopy.includes(guess[i])) {
                    feedback[i] = 'present';
                    secretCopy[secretCopy.indexOf(guess[i])] = null;
                    if(gameState.keyColors[guess[i]] !== 'wordle-correct') gameState.keyColors[guess[i]] = 'wordle-present';
                }
            }
            for(let i=0; i<5; i++) {
                if(feedback[i] === '') {
                    feedback[i] = 'absent';
                    if(!gameState.keyColors[guess[i]]) gameState.keyColors[guess[i]] = 'wordle-absent';
                }
            }

            for(let i=0; i<5; i++) {
                const cellIndex = gameState.currentRow * 5 + i;
                const cell = gameBoard.children[cellIndex];
                const back = cell.querySelector('.wordle-cell-back');
                cell.querySelector('.wordle-cell-front').textContent = guess[i];
                back.textContent = guess[i];
                cell.classList.add('flip');
                back.classList.add(`wordle-${feedback[i]}`);
                await delay(250);
            }
            wordleGame.updateKeyboard();

            if (guess === secret) {
                gameState.gameOver = true;
                if (gauntlet.isActive) { gauntlet.onGameComplete(true); }
                else { showWinModal('You Win!', `You guessed it in ${gameState.currentRow + 1} tries!`); }
            } else if (gameState.currentRow === 5) {
                gameState.gameOver = true;
                if (gauntlet.isActive) { gauntlet.onGameComplete(false); }
                else { showWinModal('Game Over', `The word was: ${secret.toUpperCase()}`); }
            } else {
                gameState.currentRow++;
                gameState.currentCol = 0;
                wordleGame.scrollActiveRowIntoView();
            }
        },
        updateKeyboard: () => {
            document.querySelectorAll('.key').forEach(keyEl => {
                const key = keyEl.dataset.key;
                if (gameState.keyColors[key]) {
                    keyEl.classList.remove('wordle-correct', 'wordle-present', 'wordle-absent');
                    keyEl.classList.add(gameState.keyColors[key]);
                }
            });
        },
        scrollActiveRowIntoView: () => {
            if (!currentMode || currentMode.name !== 'wordGuess' || !gameBoard.children.length) return;
            const activeCell = gameBoard.children[gameState.currentRow * 5];
            if (activeCell) activeCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    const blackjackGame = {
        setup: () => {
            gameState = {
                deck: [], playerHand: [], cpuHand: [], gameOver: false, playerTurn: true,
            };
            for (let s = 0; s < 4; s++) {
                for (let i = 1; i <= 10; i++) gameState.deck.push(i);
                gameState.deck.push(10, 10, 10);
            }
            for (let i = gameState.deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
            }

            const hitButton = createControlButton('Hit', 'btn-blue', blackjackGame.hit);
            const standButton = createControlButton('Stand', 'btn-yellow', blackjackGame.stand);
            gameState.hitButton = hitButton;
            gameState.standButton = standButton;
            buttonContainer.prepend(standButton);
            buttonContainer.prepend(hitButton);
            hitButton.disabled = true; standButton.disabled = true;

            const deal = async () => {
                await blackjackGame.dealCard(HUMAN); await delay(400);
                await blackjackGame.dealCard(AI, true); await delay(400);
                await blackjackGame.dealCard(HUMAN); await delay(400);
                await blackjackGame.dealCard(AI);
                
                hitButton.disabled = false; standButton.disabled = false;
                if(!gauntlet.isActive) gameStatus.textContent = "Your turn. Hit or Stand?";

                if (blackjackGame.calculateHandValue(gameState.playerHand) === 21) {
                    if(!gauntlet.isActive) gameStatus.textContent = "Blackjack!";
                    setTimeout(blackjackGame.stand, 1000);
                }
            };
            deal();
            updateStats(`Your Score: 0`);
        },
        calculateHandValue: (hand) => {
            let score = hand.reduce((sum, card) => sum + card, 0);
            let aceCount = hand.filter(card => card === 1).length;
            while (score <= 11 && aceCount > 0) {
                score += 10;
                aceCount--;
            }
            return score;
        },
        dealCard: async (player, isHidden = false) => {
            if (gameState.deck.length === 0) return Promise.resolve();
            const card = gameState.deck.pop();
            
            if (player === HUMAN) gameState.playerHand.push(card);
            else gameState.cpuHand.push({ card, hidden: isHidden });
            
            playSound(notes[card] || 'C4');
            blackjackGame.updateBoardAndScores();
            return Promise.resolve();
        },
        updateBoardAndScores: () => {
            const playerScore = blackjackGame.calculateHandValue(gameState.playerHand);
            const cpuVisibleScore = blackjackGame.calculateHandValue(gameState.cpuHand.filter(c => !c.hidden).map(c => c.card));
            
            if (gameState.playerTurn) {
                updateStats(`Your Score: ${playerScore} | CPU Shows: ${cpuVisibleScore}`);
            } else {
                const finalCpuScore = blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card));
                updateStats(`Your Score: ${playerScore} | CPU: ${finalCpuScore}`);
            }

            const lights = gameBoard.querySelectorAll('.light');
            lights.forEach(light => { light.textContent = ''; light.className = 'light is-off'; });
            
            gameState.cpuHand.forEach((c, index) => {
                if (lights[index]) {
                    lights[index].textContent = c.hidden ? '?' : (c.card === 1 ? 'A' : c.card);
                    lights[index].classList.remove('is-off');
                    lights[index].classList.add('is-player-2');
                }
            });
            gameState.playerHand.forEach((card, index) => {
                const playerGridIndex = 8 + index;
                if (lights[playerGridIndex]) {
                    lights[playerGridIndex].textContent = card === 1 ? 'A' : card;
                    lights[playerGridIndex].classList.remove('is-off');
                    lights[playerGridIndex].classList.add('is-player-1');
                }
            });
        },
        hit: async () => {
            if (gameState.gameOver || !gameState.playerTurn) return;
            await blackjackGame.dealCard(HUMAN);
            const playerScore = blackjackGame.calculateHandValue(gameState.playerHand);
            if (playerScore > 21) {
                blackjackGame.end("Bust! CPU wins.");
            } else if (playerScore === 21) {
                blackjackGame.stand();
            }
        },
        stand: async () => {
            if (gameState.gameOver || !gameState.playerTurn) return;
            gameState.playerTurn = false;
            gameState.hitButton.disabled = true;
            gameState.standButton.disabled = true;
            if(!gauntlet.isActive) gameStatus.textContent = "CPU's Turn...";

            const hiddenCard = gameState.cpuHand.find(c => c.hidden);
            if (hiddenCard) {
                hiddenCard.hidden = false;
                playSound('E4', '4n');
            }
            
            blackjackGame.updateBoardAndScores();
            await delay(1000);

            while (blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card)) < 17 && gameState.deck.length > 0) {
                await delay(800);
                await blackjackGame.dealCard(AI);
            }

            const finalPlayerScore = blackjackGame.calculateHandValue(gameState.playerHand);
            const finalCpuScore = blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card));
            
            if (finalCpuScore > 21) { blackjackGame.end("CPU Busts! You Win!"); }
            else if (finalCpuScore > finalPlayerScore) { blackjackGame.end("CPU Wins!"); }
            else if (finalPlayerScore > finalCpuScore) { blackjackGame.end("You Win!"); }
            else { blackjackGame.end("It's a Push (Tie)!"); }
        },
        end: (message) => {
            if (gameState.gameOver) return;
            gameState.gameOver = true;
            if (gauntlet.isActive) {
                const isWin = message.includes("You Win");
                const isBust = message.includes("Bust");
                gauntlet.onGameComplete(isWin && !isBust);
            } else {
                gameState.playerTurn = false;
                gameState.cpuHand.forEach(c => c.hidden = false);
                blackjackGame.updateBoardAndScores();
                gameStatus.textContent = message;
                const finalPlayerScore = blackjackGame.calculateHandValue(gameState.playerHand);
                const finalCpuScore = blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card));
                showWinModal(message, `Final Scores - You: ${finalPlayerScore}, CPU: ${finalCpuScore}`);
            }
        }
    };

    const sliderPuzzleGame = {
        setup: () => {
            gameState = { board: [1, 2, 3, 4, 5, 6, 7, 8, EMPTY], emptyIndex: 8, moves: 0 };
            sliderPuzzleGame.shuffle();
            if (!gauntlet.isActive) {
                const shuffleButton = createControlButton('Shuffle', 'btn-yellow', () => {
                    sliderPuzzleGame.shuffle();
                    gameState.moves = 0;
                    updateStats(`Moves: 0`);
                });
                buttonContainer.prepend(shuffleButton);
            }
            updateStats(`Moves: 0`);
        },
        shuffle: () => {
            for (let i = 0; i < 300; i++) {
                const neighbors = getSliderNeighbors(gameState.emptyIndex, 3);
                const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                sliderPuzzleGame.swapTiles(randomNeighbor, gameState.emptyIndex, true);
            }
            sliderPuzzleGame.updateBoard();
        },
        handler: (e) => {
            const index = parseInt(e.target.dataset.index);
            const neighbors = getSliderNeighbors(gameState.emptyIndex, 3);
            if (neighbors.includes(index)) {
                playSound(notes[index % 9]);
                sliderPuzzleGame.swapTiles(index, gameState.emptyIndex);
                gameState.moves++;
                sliderPuzzleGame.updateBoard();
                updateStats(`Moves: ${gameState.moves}`);
                sliderPuzzleGame.checkWin();
            }
        },
        swapTiles: (index1, index2) => {
            [gameState.board[index1], gameState.board[index2]] = [gameState.board[index2], gameState.board[index1]];
            gameState.emptyIndex = (gameState.emptyIndex === index1) ? index2 : index1;
        },
        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('.light');
            lights.forEach((light, i) => {
                const value = gameState.board[i];
                light.textContent = value === EMPTY ? '' : value;
                light.classList.toggle('is-empty', value === EMPTY);
                light.classList.toggle('is-on', value !== EMPTY);
            });
        },
        checkWin: () => {
            const winState = [1, 2, 3, 4, 5, 6, 7, 8, EMPTY];
            if (gameState.board.every((val, i) => val === winState[i])) {
                if (gauntlet.isActive) { gauntlet.onGameComplete(true); }
                else { showWinModal('You Win!', `Solved in ${gameState.moves} moves!`); }
            }
        }
    };

    const minefieldGame = {
        setup: () => {
            if (!gauntlet.isActive) {
                const newGameButton = createControlButton('New Game', 'btn-green', () => {
                    startGame(currentMode);
                });
                buttonContainer.prepend(newGameButton);
            }
            minefieldGame.start(8, 8, 10);
        },
        start: (width, height, mines) => {
            if (mines >= width * height) { if(!gauntlet.isActive) gameStatus.textContent = "Too many mines!"; return; }
            
            gameState = { firstClick: true, width, height, mines, flagged: 0, gameOver: false };
            gameBoard.innerHTML = '';
            gameBoard.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
            gameBoard.classList.toggle('large-grid', width > 5 || height > 5);

            const fragment = document.createDocumentFragment();
            for(let i = 0; i < width * height; i++) {
                const light = document.createElement('div');
                light.className = 'light is-hidden';
                light.dataset.index = i;
                fragment.appendChild(light);
            }
            gameBoard.appendChild(fragment);

            statsContainer.innerHTML = `Mines: <span id="mine-count">${mines}</span>`;
            if(!gauntlet.isActive) gameStatus.textContent = "Click any cell to begin.";
        },
        finishSetup: (firstClickIndex) => {
             const { width, height, mines } = gameState;
            gameState.board = Array(width * height).fill(0);
            gameState.revealed = Array(width * height).fill(false);
            gameState.flagged = Array(width * height).fill(false);
            const safeZone = [firstClickIndex, ...getNeighbors(firstClickIndex, height, width)];
            let minesPlaced = 0;
            while (minesPlaced < mines) {
                const index = Math.floor(Math.random() * width * height);
                if (gameState.board[index] !== 'M' && !safeZone.includes(index)) {
                    gameState.board[index] = 'M';
                    minesPlaced++;
                }
            }
            for (let i = 0; i < width * height; i++) {
                if (gameState.board[i] !== 'M') {
                    gameState.board[i] = getNeighbors(i, height, width).filter(n => gameState.board[n] === 'M').length;
                }
            }
            gameState.firstClick = false;
        },
        handler: (e, eventType) => {
            const index = parseInt(e.target.dataset.index);
            if (gameState.gameOver || !e.target.matches('.light')) return;

            if (eventType === 'click') {
                if (gameState.firstClick) minefieldGame.finishSetup(index);
                if (gameState.flagged[index]) return;
                if (gameState.board[index] === 'M') {
                    gameState.gameOver = true;
                    if (gauntlet.isActive) {
                        gauntlet.onGameComplete(false);
                    } else {
                        minefieldGame.revealAllMines();
                        gameStatus.textContent = "Game Over!";
                        showWinModal('BOOM!', 'You hit a mine.');
                    }
                    return;
                }
                minefieldGame.revealCell(index);
            } else if (eventType === 'contextmenu') {
                if (gameState.revealed[index] && gameState.board[index] > 0) {
                    minefieldGame.chord(index);
                } else if (!gameState.revealed[index]) {
                    gameState.flagged[index] = !gameState.flagged[index];
                }
            }
            minefieldGame.updateBoard();
            minefieldGame.checkWin();
        },
        chord: (index) => {
            const neighbors = getNeighbors(index, gameState.height, gameState.width);
            const flaggedNeighbors = neighbors.filter(n => gameState.flagged[n]).length;
            if (flaggedNeighbors === gameState.board[index]) {
                neighbors.forEach(n => {
                    if (!gameState.flagged[n] && !gameState.revealed[n]) {
                        minefieldGame.revealCell(n);
                    }
                });
            }
        },
        revealCell: (index) => {
            const { height, width } = gameState;
            const stack = [index];
            while(stack.length > 0) {
                const current = stack.pop();
                if (current < 0 || current >= height * width || gameState.revealed[current] || gameState.flagged[current]) continue;
                gameState.revealed[current] = true;
                if (gameState.board[current] === 0) {
                    stack.push(...getNeighbors(current, height, width));
                }
            }
        },
        revealAllMines: () => {
            gameState.board.forEach((cell, i) => { if (cell === 'M') gameState.revealed[i] = true; });
            minefieldGame.updateBoard();
        },
        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('.light');
            const flaggedCount = gameState.flagged ? gameState.flagged.filter(Boolean).length : 0;
            document.getElementById('mine-count').textContent = gameState.mines - flaggedCount;
            lights.forEach((light, i) => {
                light.className = 'light'; light.textContent = ''; light.style.color = '';
                if (gameState.flagged[i]) {
                    light.classList.add('is-flagged');
                } else if (gameState.revealed[i]) {
                    light.classList.add('is-revealed');
                    const val = gameState.board[i];
                    if (val === 'M') light.classList.add('is-mine');
                    else if (val > 0) {
                        light.textContent = val;
                        const colors = ['#fff', '#3b82f6', '#22c55e', '#ef4444', '#4f46e5', '#7e22ce'];
                        light.style.color = colors[val];
                    }
                } else {
                    light.classList.add('is-hidden');
                }
            });
        },
        checkWin: () => {
            if (!gameState.board) return;
            const revealedCount = gameState.revealed ? gameState.revealed.filter(Boolean).length : 0;
            const totalNonMines = gameState.board.length - gameState.mines;
            if (revealedCount === totalNonMines) {
                gameState.gameOver = true;
                if (gauntlet.isActive) { gauntlet.onGameComplete(true); }
                else { showWinModal('You Win!', 'You cleared the minefield!'); }
            }
        }
    };

    const musicMachineGame = {
        setup: () => {
            gameState = { sequence: [] };
            musicMachineGame.updateBoard();
            const playButton = createControlButton('Play Song', 'btn-green', musicMachineGame.playSequence);
            const clearButton = createControlButton('Clear', 'btn-yellow', () => {
                gameState.sequence = [];
                musicMachineGame.updateBoard();
            });
            buttonContainer.prepend(clearButton);
            buttonContainer.prepend(playButton);
        },
        handler: async (e) => {
            const index = parseInt(e.target.dataset.index);
            gameState.sequence.push(index);
            playSound(notes[index]);
            const light = e.target;
            light.classList.add('is-highlight', `echo-${index+1}`);
            setTimeout(() => light.classList.remove('is-highlight', `echo-${index+1}`), 300);
        },
        playSequence: async () => {
            if (gameState.isPlaying) return;
            gameState.isPlaying = true;
            for (const noteIndex of gameState.sequence) {
                const light = gameBoard.querySelector(`[data-index='${noteIndex}']`);
                light.classList.add('is-highlight', `echo-${noteIndex+1}`);
                playSound(notes[noteIndex]);
                await delay(300);
                light.classList.remove('is-highlight', `echo-${noteIndex+1}`);
            }
            gameState.isPlaying = false;
        },
        updateBoard: () => {}
    };

    const connectGame = {
        setup: () => {
            gameState = { board: Array(42).fill(EMPTY), currentPlayer: HUMAN, gameOver: false, difficulty: 'Hard' };
            if(!gauntlet.isActive){
                const easyBtn = createControlButton('Easy', 'btn-green', () => { gameState.difficulty = 'Easy'; gameStatus.textContent = 'Difficulty: Easy'; });
                const hardBtn = createControlButton('Hard', 'btn-blue', () => { gameState.difficulty = 'Hard'; gameStatus.textContent = 'Difficulty: Hard'; });
                buttonContainer.prepend(hardBtn);
                buttonContainer.prepend(easyBtn);
            }
            connectGame.updateBoard();
            if(!gauntlet.isActive) gameStatus.textContent = "Your Turn";
        },
        handler: (e) => {
            if (gameState.gameOver || gameState.currentPlayer === AI) return;
            const index = parseInt(e.target.dataset.index);
            const col = index % 7;
            let landingIndex = -1;
            for (let row = 5; row >= 0; row--) {
                const i = row * 7 + col;
                if (gameState.board[i] === EMPTY) {
                    landingIndex = i;
                    break;
                }
            }
            if (landingIndex === -1) return;
            connectGame.makeMove(landingIndex, HUMAN);
            if (gameState.gameOver) return;
            gameState.currentPlayer = AI;
            if(!gauntlet.isActive) gameStatus.textContent = "AI is thinking...";
            setTimeout(connectGame.aiMove, 500);
        },
        aiMove: () => {
            if (gameState.gameOver) return;
            const bestMoveCol = connectGame.findBestMove(gameState.board);
            if (bestMoveCol === -1) return;
            let landingIndex = -1;
            for (let row = 5; row >= 0; row--) {
                const i = row * 7 + bestMoveCol;
                if (gameState.board[i] === EMPTY) { landingIndex = i; break; }
            }
            connectGame.makeMove(landingIndex, AI);
            if (!gameState.gameOver) {
                gameState.currentPlayer = HUMAN;
                if(!gauntlet.isActive) gameStatus.textContent = "Your Turn";
            }
        },
        makeMove: (index, player) => {
            gameState.board[index] = player;
            playSound(player === HUMAN ? 'C4' : 'G3');
            connectGame.updateBoard();
            if (checkConnectWin(gameState.board, player)) {
                gameState.gameOver = true;
                if (gauntlet.isActive) {
                    gauntlet.onGameComplete(player === HUMAN);
                } else {
                    const message = player === HUMAN ? "You Win!" : "AI Wins!";
                    gameStatus.textContent = message;
                    showWinModal(message, "Four in a row!");
                }
            } else if (isDraw(gameState.board)) {
                gameState.gameOver = true;
                if (gauntlet.isActive) { gauntlet.onGameComplete(false); }
                else {
                    gameStatus.textContent = "It's a Draw!";
                    showWinModal("It's a Draw!", "Well fought!");
                }
            }
        },
        findBestMove: (board) => {
            const validCols = getValidColumns(board);
            if (gameState.difficulty === 'Easy') return validCols[Math.floor(Math.random() * validCols.length)];
            let bestScore = -Infinity;
            let bestMove = -1;
            for (const col of validCols) {
                let tempBoard = [...board];
                connectGame.dropPiece(tempBoard, col, AI);
                let score = connectGame.scorePosition(tempBoard, AI);
                if (score > bestScore) { bestScore = score; bestMove = col; }
            }
            return bestMove !== -1 ? bestMove : validCols[0];
        },
        scorePosition: (board, player) => {
            let score = 0;
            const oppPlayer = player === AI ? HUMAN : AI;
            let centerCount = 0;
            for (let r = 0; r < 6; r++) if (board[r * 7 + 3] === player) centerCount++;
            score += centerCount * 3;
            for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) score += connectGame.evaluateWindow([board[r*7+c], board[r*7+c+1], board[r*7+c+2], board[r*7+c+3]], player, oppPlayer);
            for (let c = 0; c < 7; c++) for (let r = 0; r < 3; r++) score += connectGame.evaluateWindow([board[r*7+c], board[(r+1)*7+c], board[(r+2)*7+c], board[(r+3)*7+c]], player, oppPlayer);
            for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) score += connectGame.evaluateWindow([board[r*7+c], board[(r+1)*7+c+1], board[(r+2)*7+c+2], board[(r+3)*7+c+3]], player, oppPlayer);
            for (let r = 3; r < 6; r++) for (let c = 0; c < 4; c++) score += connectGame.evaluateWindow([board[r*7+c], board[(r-1)*7+c+1], board[(r-2)*7+c+2], board[(r-3)*7+c+3]], player, oppPlayer);
            return score;
        },
        evaluateWindow: (window, player, oppPlayer) => {
            let score = 0;
            const playerCount = window.filter(p => p === player).length;
            const emptyCount = window.filter(p => p === EMPTY).length;
            const oppCount = window.filter(p => p === oppPlayer).length;
            if (playerCount === 4) score += 100;
            else if (playerCount === 3 && emptyCount === 1) score += 5;
            else if (playerCount === 2 && emptyCount === 2) score += 2;
            if (oppCount === 3 && emptyCount === 1) score -= 80;
            if (oppCount === 4) score -= 1000;
            return score;
        },
        dropPiece: (board, col, player) => {
            for (let r = 5; r >= 0; r--) if (board[r * 7 + col] === EMPTY) { board[r * 7 + col] = player; return; }
        },
        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('.light');
            lights.forEach((light, i) => {
                light.className = 'light';
                if (gameState.board[i] === HUMAN) light.classList.add('is-player-1');
                else if (gameState.board[i] === AI) light.classList.add('is-player-2');
                else light.classList.add('is-empty');
            });
        }
    };

    const lineDrawGame = {
        setup: () => {
            const size = currentMode.gridSize;
            const puzzle = lineDrawGame.generatePuzzle(size);
            gameState = { size, board: Array(size * size).fill(0), pairs: puzzle.pairs, paths: {}, isDrawing: false, currentColor: 0, startNode: -1 };
            puzzle.pairs.forEach(p => { gameState.paths[p.c] = []; });
            lineDrawGame.updateBoard();
            gameBoard.addEventListener('mousedown', lineDrawGame.handleMouseDown);
            window.addEventListener('mousemove', lineDrawGame.handleMouseMove);
            window.addEventListener('mouseup', lineDrawGame.handleMouseUp);
            gameBoard.addEventListener('touchstart', lineDrawGame.handleMouseDown, {passive: false});
            window.addEventListener('touchmove', lineDrawGame.handleMouseMove, {passive: false});
            window.addEventListener('touchend', lineDrawGame.handleMouseUp, {passive: false});
        },
        generatePuzzle: (size) => {
            let grid, pairs;
            let attempts = 0;
            while (attempts < 50) {
                grid = Array(size * size).fill(0);
                pairs = [];
                let color = 1;
                let unvisited = Array.from({length: size * size}, (_, i) => i).sort(() => Math.random() - 0.5);
                while(unvisited.length > 0) {
                    let startCell = -1;
                    while(unvisited.length > 0) {
                        let potentialStart = unvisited.pop();
                        if (grid[potentialStart] === 0) { startCell = potentialStart; break; }
                    }
                    if (startCell === -1) break;
                    let path = [startCell];
                    grid[startCell] = color;
                    let currentCell = startCell;
                    while(true) {
                        const neighbors = getSliderNeighbors(currentCell, size).filter(n => grid[n] === 0);
                        if (neighbors.length === 0) break;
                        const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
                        grid[nextCell] = color;
                        path.push(nextCell);
                        currentCell = nextCell;
                        unvisited = unvisited.filter(i => i !== nextCell);
                    }
                    if (path.length > 1) {
                         pairs.push({ c: color, s: path[0], e: path[path.length-1] });
                         color++;
                    } else {
                        grid[path[0]] = 0;
                    }
                }
                if (!grid.includes(0)) return { pairs };
                attempts++;
            }
            return lineDrawGame.generatePuzzle(size);
        },
        handleMouseDown: (e) => {
            e.preventDefault();
            const target = e.target.closest('.light');
            if (!target) return;
            const index = parseInt(target.dataset.index);
            const pair = gameState.pairs.find(p => p.s === index || p.e === index);
            if (pair) {
                const oldPath = gameState.paths[pair.c];
                if (oldPath) oldPath.forEach(i => { if (!gameState.pairs.some(p => p.s === i || p.e === i)) gameState.board[i] = 0; });
                gameState.isDrawing = true;
                gameState.currentColor = pair.c;
                gameState.startNode = index;
                gameState.paths[pair.c] = [index];
                gameState.board[index] = pair.c;
                playSound(notes[(pair.c - 1) % notes.length]);
                lineDrawGame.updateBoard();
            }
        },
        handleMouseMove: (e) => {
            if (!gameState.isDrawing) return;
            e.preventDefault();
            const x = e.clientX || e.touches[0].clientX;
            const y = e.clientY || e.touches[0].clientY;
            const element = document.elementFromPoint(x, y);
            if (!element || !element.matches('.light')) return;
            const index = parseInt(element.dataset.index);
            const currentPath = gameState.paths[gameState.currentColor];
            const lastIndex = currentPath[currentPath.length - 1];
            if (index === lastIndex) return;
            if (currentPath.length > 1 && index === currentPath[currentPath.length - 2]) {
                gameState.board[lastIndex] = 0;
                currentPath.pop();
                const note = notes[(gameState.currentColor - 1) % notes.length];
                const noteName = note.slice(0, -1);
                const octave = parseInt(note.slice(-1));
                playSound(`${noteName}${octave - 1}`);
                lineDrawGame.updateBoard();
                return;
            }
            const isAdjacent = getSliderNeighbors(lastIndex, gameState.size).includes(index);
            const isEndpointOfCurrentColor = gameState.pairs.some(p => p.c === gameState.currentColor && (p.s === index || p.e === index));
            const isValidMove = isAdjacent && (gameState.board[index] === 0 || isEndpointOfCurrentColor);
            if (isValidMove) {
                currentPath.push(index);
                gameState.board[index] = gameState.currentColor;
                playSound(notes[(gameState.currentColor - 1) % notes.length]);
                lineDrawGame.updateBoard();
            }
        },
        handleMouseUp: (e) => {
            if (!gameState.isDrawing) return;
            const color = gameState.currentColor;
            const path = gameState.paths[color];
            const pair = gameState.pairs.find(p => p.c === color);
            const startNode = gameState.startNode;
            const endNode = path[path.length - 1];
            const targetEndNode = (pair.s === startNode) ? pair.e : pair.s;
            if (endNode !== targetEndNode) {
                path.forEach(i => { if (!gameState.pairs.some(p => p.s === i || p.e === i)) gameState.board[i] = 0; });
                gameState.paths[color] = [];
                playSound('C3');
            } else {
                 playSound('G4');
            }
            gameState.isDrawing = false;
            lineDrawGame.updateBoard();
            lineDrawGame.checkWin();
        },
        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('.light');
            lights.forEach((light, i) => {
                light.className = 'light';
                const pair = gameState.pairs.find(p => p.s === i || p.e === i);
                const pathColor = gameState.board[i];
                if (pair) light.classList.add(`color-${pair.c}`, 'line-dot');
                if (pathColor) light.classList.add(`path-${pathColor}`);
            });
        },
        checkWin: () => {
            const allPaired = gameState.pairs.every(p => {
                const path = gameState.paths[p.c];
                if (!path || path.length < 2) return false;
                const ends = [path[0], path[path.length-1]].sort((a,b)=>a-b);
                const pairEnds = [p.s, p.e].sort((a,b)=>a-b);
                return ends[0] === pairEnds[0] && ends[1] === pairEnds[1];
            });
            if (allPaired && !gameState.board.includes(0)) {
                if (gauntlet.isActive) { gauntlet.onGameComplete(true); }
                else { showWinModal('You Win!', 'You connected all the dots!'); }
            }
        }
    };

    const lightMatchGame = {
        setup: () => {
            const size = 8;
            const numColors = 6;
            gameState = {
                size,
                numColors,
                board: [],
                selected: null,
                isAnimating: false,
                score: 0
            };
            gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            gameBoard.classList.add('large-grid');

            const fragment = document.createDocumentFragment();
            for (let i = 0; i < size * size; i++) {
                const light = document.createElement('div');
                light.classList.add('light');
                light.dataset.index = i;
                fragment.appendChild(light);
            }
            gameBoard.appendChild(fragment);

            do {
                for (let i = 0; i < size * size; i++) {
                    gameState.board[i] = Math.floor(Math.random() * numColors) + 1;
                }
            } while (lightMatchGame.findMatches().length > 0);

            lightMatchGame.updateBoard();
            updateStats(`Score: 0`);
        },

        handler: (e) => {
            if (gameState.isAnimating) return;
            const index = parseInt(e.target.dataset.index);

            if (gameState.selected === null) {
                gameState.selected = index;
                e.target.classList.add('is-selected');
            } else {
                const first = gameState.selected;
                const second = index;
                const firstEl = gameBoard.querySelector(`[data-index='${first}']`);
                if(firstEl) firstEl.classList.remove('is-selected');
                
                gameState.selected = null;

                const isAdjacent = Math.abs(first % 8 - second % 8) + Math.abs(Math.floor(first / 8) - Math.floor(second / 8)) === 1;

                if (isAdjacent) {
                    lightMatchGame.attemptSwap(first, second);
                }
            }
        },

        attemptSwap: async (index1, index2) => {
            gameState.isAnimating = true;
            await lightMatchGame.animateSwap(index1, index2);
            
            const matches = lightMatchGame.findMatches();
            if (matches.length > 0) {
                await lightMatchGame.resolveBoard();
            } else {
                await delay(100);
                await lightMatchGame.animateSwap(index1, index2); 
            }
            gameState.isAnimating = false;

            if (!lightMatchGame.hasPossibleMoves()) {
                if (gauntlet.isActive) {
                    gauntlet.onGameComplete(gameState.score >= 1000);
                } else {
                    showWinModal("No More Moves!", `Final Score: ${gameState.score}`);
                }
            }
        },
        
        animateSwap: async (index1, index2) => {
            [gameState.board[index1], gameState.board[index2]] = [gameState.board[index2], gameState.board[index1]];
            lightMatchGame.updateBoard();
            await delay(200);
        },

        resolveBoard: async () => {
            let chain = 1;
            while (true) {
                const matches = lightMatchGame.findMatches();
                if (matches.length === 0) break;
                
                playSound(notes[chain % notes.length], '4n');
                gameState.score += matches.length * 10 * chain;
                updateStats(`Score: ${gameState.score}`);

                await lightMatchGame.animateRemoval(matches);
                await lightMatchGame.animateDrop();
                await lightMatchGame.animateRefill();
                chain++;

                if(gauntlet.isActive && gameState.score >= 1000){
                    gauntlet.onGameComplete(true);
                    return;
                }
            }
        },

        findMatches: () => {
            const matches = new Set();
            const { size, board } = gameState;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size - 2; c++) {
                    const i = r * size + c;
                    if (board[i] && board[i] === board[i+1] && board[i] === board[i+2]) {
                        matches.add(i); matches.add(i+1); matches.add(i+2);
                    }
                }
            }
            for (let c = 0; c < size; c++) {
                for (let r = 0; r < size - 2; r++) {
                    const i = r * size + c;
                    if (board[i] && board[i] === board[i + size] && board[i] === board[i + 2 * size]) {
                        matches.add(i); matches.add(i + size); matches.add(i + 2 * size);
                    }
                }
            }
            return [...matches];
        },

        animateRemoval: async (matches) => {
            matches.forEach(index => {
                const el = gameBoard.querySelector(`[data-index='${index}']`);
                if (el) el.classList.add('is-removing');
            });
            await delay(200);
            
            matches.forEach(index => {
                gameState.board[index] = 0;
            });
            lightMatchGame.updateBoard();
        },

        animateDrop: async () => {
            const { size } = gameState;
            for (let c = 0; c < size; c++) {
                let emptyRow = size - 1;
                for (let r = size - 1; r >= 0; r--) {
                    const index = r * size + c;
                    if (gameState.board[index] !== 0) {
                        const fallToIndex = emptyRow * size + c;
                        if (index !== fallToIndex) {
                            [gameState.board[index], gameState.board[fallToIndex]] = [gameState.board[fallToIndex], gameState.board[index]];
                        }
                        emptyRow--;
                    }
                }
            }
            await delay(100);
            lightMatchGame.updateBoard();
        },

        animateRefill: async () => {
            const { size, numColors } = gameState;
            for (let i = 0; i < size * size; i++) {
                if (gameState.board[i] === 0) {
                    gameState.board[i] = Math.floor(Math.random() * numColors) + 1;
                }
            }
            await delay(100);
            lightMatchGame.updateBoard();
        },

        updateBoard: () => {
            const lights = gameBoard.querySelectorAll('[data-index]');
            lights.forEach((light, i) => {
                const color = gameState.board[i];
                light.className = 'light';
                if (color > 0) {
                    light.classList.add(`color-${color}`);
                } else {
                    light.classList.add('is-off');
                }
            });
        },

        hasPossibleMoves: () => {
            const { size, board } = gameState;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size - 1; c++) {
                    const i1 = r * size + c;
                    const i2 = r * size + c + 1;
                    [board[i1], board[i2]] = [board[i2], board[i1]];
                    if (lightMatchGame.findMatches().length > 0) {
                        [board[i1], board[i2]] = [board[i2], board[i1]];
                        return true;
                    }
                    [board[i1], board[i2]] = [board[i2], board[i1]];
                }
            }
            for (let c = 0; c < size; c++) {
                for (let r = 0; r < size - 1; r++) {
                    const i1 = r * size + c;
                    const i2 = (r + 1) * size + c;
                    [board[i1], board[i2]] = [board[i2], board[i1]];
                    if (lightMatchGame.findMatches().length > 0) {
                        [board[i1], board[i2]] = [board[i2], board[i1]];
                        return true;
                    }
                    [board[i1], board[i2]] = [board[i2], board[i1]];
                }
            }
            return false;
        }
    };

    // --- Game Definitions ---
    const gameModes = {
        lightPuzzle: { name: 'lightPuzzle', title: 'LIGHT PUZZLE', rules: 'Turn all the lights off.', gridSize: 5, setup: lightsOutGame.setup, handler: lightsOutGame.handler, color: '#ef4444', shadow: '#f87171' },
        magicSquare: { name: 'magicSquare', title: 'MAGIC SQUARE', rules: 'Make a square of lights around the edge.', gridSize: 3, setup: magicSquareGame.setup, handler: magicSquareGame.handler, color: '#8b5cf6', shadow: '#a78bfa' },
        ticTacToe: { name: 'ticTacToe', title: 'TIC-TAC-TOE', rules: 'Get three in a row.', gridSize: 3, setup: ticTacToeGame.setup, handler: ticTacToeGame.handler, color: '#3b82f6', shadow: '#60a5fa' },
        sequence: { name: 'sequence', title: 'SEQUENCE', rules: 'Repeat the sequence. Survive for 1 minute!', gridSize: 3, setup: echoGame.setup, handler: echoGame.handler, color: '#22c55e', shadow: '#4ade80' },
        wordGuess: { name: 'wordGuess', title: 'WORD GUESS', rules: 'Guess the 5-letter word.', gridRows: 6, gridCols: 5, setup: wordleGame.setup, handler: wordleGame.handler, color: '#f97316', shadow: '#fb923c' },
        blackjack: { name: 'blackjack', title: 'BLACKJACK', rules: 'Get 21, or survive for 1 minute!', gridRows: 4, gridCols: 4, setup: blackjackGame.setup, handler: () => {}, color: '#06b6d4', shadow: '#22d3ee' },
        lightMatch: { name: 'lightMatch', title: 'LIGHT MATCH', rules: 'Match 3+ lights. Score 1000 to win!', gridSize: 8, setup: lightMatchGame.setup, handler: lightMatchGame.handler, color: '#f43f5e', shadow: '#fb7185' },
        musicMachine: { name: 'musicMachine', title: 'MUSIC MACHINE', rules: 'Compose a tune.', gridSize: 3, setup: musicMachineGame.setup, handler: musicMachineGame.handler, color: '#d946ef', shadow: '#e879f9' },
        sliderPuzzle: { name: 'sliderPuzzle', title: 'SLIDER PUZZLE', rules: 'Order the tiles from 1 to 8.', gridSize: 3, setup: sliderPuzzleGame.setup, handler: sliderPuzzleGame.handler, color: '#ec4899', shadow: '#f472b6' },
        minefield: { name: 'minefield', title: 'MINEFIELD', rules: 'Clear the board without hitting a mine.', setup: minefieldGame.setup, handler: minefieldGame.handler, color: '#6b7280', shadow: '#9ca3af' },
        fourInARow: { name: 'fourInARow', title: 'FOUR IN A ROW', rules: 'Get four in a row against the AI.', gridRows: 6, gridCols: 7, setup: connectGame.setup, handler: connectGame.handler, color: '#ec4899', shadow: '#f472b6' },
        colorConnect: { name: 'colorConnect', title: 'COLOR CONNECT', rules: 'Connect matching colors without crossing.', gridSize: 6, setup: lineDrawGame.setup, handler: () => {}, color: '#14b8a6', shadow: '#2dd4bf' },
        gauntlet: { name: 'gauntlet', title: 'GAUNTLET', rules: 'Survive as long as you can!', setup: () => gauntlet.start(), handler: () => {}, color: '#facc15', shadow: '#fde047'}
    };

    // --- Utility Functions ---
    function updateStats(text) { statsContainer.textContent = text; }
    function getNeighbors(i, rows, cols) {
        const neighbors = [];
        const r = Math.floor(i / cols), c = i % cols;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) neighbors.push(nr * cols + nc);
        }
        return neighbors;
    }
    function getSliderNeighbors(index, size) {
        const neighbors = [];
        const row = Math.floor(index / size), col = index % size;
        if (row > 0) neighbors.push(index - size);
        if (row < size - 1) neighbors.push(index + size);
        if (col > 0) neighbors.push(index - 1);
        if (col < size - 1) neighbors.push(index + 1);
        return neighbors;
    }
    function isDraw(board) { return !board.includes(EMPTY); }
    function checkWin(board, player, winLines) {
        const line = winLines.find(line => line.every(index => board[index] === player));
        return line ? { line } : null;
    }
    function getValidColumns(board) {
        const W = 7;
        const validCols = [];
        for (let c = 0; c < W; c++) {
            if (board[c] === EMPTY) {
                validCols.push(c);
            }
        }
        return validCols;
    }
    function checkConnectWin(board, player) {
        const W = 7, H = 6;
        for (let r = 0; r < H; r++) {
            for (let c = 0; c <= W - 4; c++) {
                if (board[r*W+c] === player && board[r*W+c+1] === player && board[r*W+c+2] === player && board[r*W+c+3] === player) return true;
            }
        }
        for (let r = 0; r <= H - 4; r++) {
            for (let c = 0; c < W; c++) {
                if (board[r*W+c] === player && board[(r+1)*W+c] === player && board[(r+2)*W+c] === player && board[(r+3)*W+c] === player) return true;
            }
        }
        for (let r = 0; r <= H - 4; r++) {
            for (let c = 0; c <= W - 4; c++) {
                if (board[r*W+c] === player && board[(r+1)*W+c+1] === player && board[(r+2)*W+c+2] === player && board[(r+3)*W+c+3] === player) return true;
            }
        }
        for (let r = 3; r < H; r++) {
            for (let c = 0; c <= W - 4; c++) {
                if (board[r*W+c] === player && board[(r-1)*W+c+1] === player && board[(r-2)*W+c+2] === player && board[(r-3)*W+c+3] === player) return true;
            }
        }
        return false;
    }
    
<<<<<<< HEAD
<<<<<<< HEAD
});
>>>>>>> c183d2a (First commit)
=======
    // Initial setup of the main board listeners
=======
    // Initial setup
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
    gameBoard.addEventListener('click', handleBoardClick);
    gameBoard.addEventListener('contextmenu', handleBoardContextMenu);
});
>>>>>>> ec8738a (Optimization change)
