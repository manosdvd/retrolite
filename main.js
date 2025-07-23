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
    lightPuzzle: { name: 'lightPuzzle', title: 'LIGHTS OUT', rules: 'Turn all the lights off.', gridSize: 5, setup: lightsOutGame.setup, handler: lightsOutGame.handler, color: '#ef4444', shadow: '#f87171', cleanup: lightsOutGame.cleanup },
    magicSquare: { name: 'magicSquare', title: 'MAGIC SQUARE', rules: 'Make a square of lights around the edge.', gridSize: 3, setup: magicSquareGame.setup, handler: magicSquareGame.handler, color: '#8b5cf6', shadow: '#a78bfa', cleanup: magicSquareGame.cleanup },
    ticTacToe: { name: 'ticTacToe', title: 'TIC-TAC-TOE', rules: 'Get three in a row.', gridSize: 3, setup: ticTacToeGame.setup, handler: ticTacToeGame.handler, color: '#3b82f6', shadow: '#60a5fa', cleanup: ticTacToeGame.cleanup },
    sequence: { name: 'sequence', title: 'ECHO', rules: 'Repeat the sequence. Survive for 1 minute!', gridSize: 3, setup: echoGame.setup, handler: echoGame.handler, color: '#22c55e', shadow: '#4ade80', cleanup: echoGame.cleanup },
    wordGuess: { 
        name: 'wordGuess', 
        title: 'WORDLE', 
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
    blackjack: { name: 'blackjack', title: '21', rules: 'Get 21, or survive for 1 minute!', gridRows: 4, gridCols: 4, setup: blackjackGame.setup, handler: null, color: '#06b6d4', shadow: '#22d3ee', cleanup: blackjackGame.cleanup },
    lightMatch: { name: 'lightMatch', title: 'LIGHT MATCH', rules: 'Match 3+ lights. Form special combos for bombs!', gridSize: 8, setup: lightMatchGame.setup, handler: null, color: '#f43f5e', shadow: '#fb7185', cleanup: lightMatchGame.cleanup },
    musicMachine: { name: 'musicMachine', title: 'MUSIC BOX', rules: 'Compose a tune.', gridSize: 3, setup: musicMachineGame.setup, handler: musicMachineGame.handler, color: '#d946ef', shadow: '#e879f9', cleanup: musicMachineGame.cleanup },
    sliderPuzzle: { name: 'sliderPuzzle', title: 'SLIDER', rules: 'Order the tiles from 1 to 8.', gridSize: 3, setup: sliderPuzzleGame.setup, handler: sliderPuzzleGame.handler, color: '#ec4899', shadow: '#f472b6', cleanup: sliderPuzzleGame.cleanup },
    minefield: { name: 'minefield', title: 'MINEFIELD', rules: 'Clear the board without hitting a mine.', setup: minefieldGame.setup, handler: minefieldGame.handler, color: '#6b7280', shadow: '#9ca3af', cleanup: minefieldGame.cleanup },
    fourInARow: { name: 'fourInARow', title: 'CONNECT 4', rules: 'Get four in a row against the AI.', gridRows: 6, gridCols: 7, setup: connectGame.setup, handler: connectGame.handler, color: '#ec4899', shadow: '#f472b6', cleanup: connectGame.cleanup },
    colorConnect: { name: 'colorConnect', title: 'COLOR LINK', rules: 'Connect matching colors without crossing.', gridSize: 6, setup: lineDrawGame.setup, handler: null, color: '#14b8a6', shadow: '#2dd4bf', cleanup: lineDrawGame.cleanup },
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
    spellingBee: { name: 'spellingBee', title: 'SPELLING', rules: 'Listen to the word and type it correctly.', setup: spellingBeeGame.setup, handler: null, cleanup: spellingBeeGame.cleanup, color: '#4f46e5', shadow: '#6366f1' },
    decryptGame: { name: 'decryptGame', title: 'CIPHER', setup: decryptGame.setup, handler: null, cleanup: decryptGame.cleanup, color: '#3d342a', shadow: '#5c5248' },
    numberCrunch: { 
        name: 'numberCrunch', 
        title: 'NUMBER CRUNCH', 
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
        title: 'FRACTION FLIPPER', 
        rules: 'Add fractions to match the target value.', 
        setup: fractionFlipperGame.setup, 
        handler: null, 
        color: '#10b981', 
        shadow: '#34d399', 
        cleanup: fractionFlipperGame.cleanup
    },
    
    gauntlet: { name: 'gauntlet', title: 'GAUNTLET', rules: 'Survive as long as you can!', setup: () => gauntlet.start(), handler: null, color: '#facc15', shadow: '#fde047', cleanup: () => gauntlet.end() }
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
    if (currentMode && typeof currentMode.cleanup === 'function') {
        currentMode.cleanup();
    }
    gameBoard.innerHTML = '';
    currentMode = mode;

    const keyboardGames = ['wordGuess', 'spellingBee', 'decryptGame'];
    if (keyboardGames.includes(mode.name)) {
        gameContainer.classList.add('keyboard-active');
    } else {
        gameContainer.classList.remove('keyboard-active');
    }

    gameTitle.textContent = mode.title;
    gameRules.textContent = mode.rules;
    root.style.setProperty('--theme-color', mode.color);
    root.style.setProperty('--theme-shadow-color', mode.shadow);
    gameTitle.style.color = mode.color;
    gameTitle.style.textShadow = `0 0 10px ${mode.shadow}`;

    keyboardContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    statsContainer.innerHTML = '';
    modalContainer.innerHTML = '';
    gameStatus.textContent = '';
    gameBoard.className = 'game-grid mb-2';

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
        if (currentMode && typeof currentMode.cleanup === 'function') {
            currentMode.cleanup();
        }
        gameContainer.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        currentMode = null;
    });
    buttonContainer.appendChild(backButton);

    mode.setup();

    gameBoard.addEventListener('click', handleBoardClick);
    gameBoard.addEventListener('contextmenu', handleBoardContextMenu);
}
