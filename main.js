import { Keyboard } from './utils/keyboard.js';
import { AudioManager } from './utils/audioManager.js';

// --- Globally Scoped Variables, Constants, and Game Objects ---
//
// NOTE:
// This application dynamically imports individual game modules which expect to
// reference various stateful objects (gameBoard, gameState, etc.) and helper
// functions (updateStats, createControlButton, etc.) without explicitly
// importing them. When `main.js` is loaded as an ES module these variables
// are scoped to the module and are not automatically exposed on the global
// `window` object. As a result, the game modules would throw `ReferenceError`
// when trying to access these identifiers. To preserve backwards
// compatibility with the existing game modules we define the variables as
// usual and then mirror them onto `window` after they have been created.

let gameBoard, buttonContainer, statsContainer, gameStatus, keyboardContainer,
    modalContainer, gameTitle, gameRules, root, mainMenu, gameContainer;
// gameState stores per‑game state; exported onto the global object below.
let gameState = {};
let currentMode = null;
<<<<<<< Updated upstream
=======
// Musical notes used by several games.
>>>>>>> Stashed changes
const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'];
// Player constants used by various board games.
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
        for (let r = 0; r < H; r++) for (let c = 0; c <= W - 4; c++) { const line = [r*W+c, r*W+c+1, r*W+c+2, r*W+c+3]; if (line.every(index => board[index] === player)) return line; }
        for (let r = 0; r <= H - 4; r++) for (let c = 0; c < W; c++) { const line = [r*W+c, (r+1)*W+c, (r+2)*W+c, (r+3)*W+c]; if (line.every(index => board[index] === player)) return line; }
        for (let r = 0; r <= H - 4; r++) for (let c = 0; c <= W - 4; c++) { const line = [r*W+c, (r+1)*W+c+1, (r+2)*W+c+2, (r+3)*W+c+3]; if (line.every(index => board[index] === player)) return line; }
        for (let r = 3; r < H; r++) for (let c = 0; c <= W - 4; c++) { const line = [r*W+c, (r-1)*W+c+1, (r-2)*W+c+2, (r-3)*W+c+3]; if (line.every(index => board[index] === player)) return line; }
        return null;
    }
};

const gameModes = {
    lightPuzzle: { name: 'lightPuzzle', title: 'DOPAMINE SWITCH', rules: 'Turn all the lights off.', gridSize: 5, module: './games/lightsOutGame.js', color: '#ef4444', shadow: '#f87171' },
    magicSquare: { name: 'magicSquare', title: 'HYPER FOCUS', rules: 'Make a square of lights around the edge.', gridSize: 3, module: './games/magicSquareGame.js', color: '#8b5cf6', shadow: '#a78bfa' },
    ticTacToe: { name: 'ticTacToe', title: 'PARALLEL PLAY', rules: 'Get three in a row.', gridSize: 3, module: './games/ticTacToeGame.js', color: '#3b82f6', shadow: '#60a5fa' },
    sequence: { name: 'sequence', title: 'WORKING MEMORY', rules: 'Repeat the sequence. Survive for 1 minute!', gridSize: 3, module: './games/echoGame.js', color: '#22c55e', shadow: '#4ade80' },
    wordGuess: { name: 'wordGuess', title: 'REJECTION SENSITIVITY', rules: 'Guess the 5-letter word.', gridRows: 6, gridCols: 5, module: './games/wordleGame.js', color: '#f97316', shadow: '#fb923c' },
    blackjack: { name: 'blackjack', title: 'DOPAMINE CHASE', rules: 'Get 21, or survive for 1 minute!', gridRows: 4, gridCols: 4, module: './games/blackjackGame.js', color: '#06b6d4', shadow: '#22d3ee' },
    lightMatch: { name: 'lightMatch', title: 'DOPAMINE HIT', rules: 'Match 3+ lights. Form special combos for bombs!', gridSize: 8, module: './games/lightMatchGame.js', color: '#f43f5e', shadow: '#fb7185' },
    musicMachine: { name: 'musicMachine', title: 'AUDIO STIM', rules: 'Compose a tune.', gridSize: 3, module: './games/musicMachineGame.js', color: '#d946ef', shadow: '#e879f9' },
    sliderPuzzle: { name: 'sliderPuzzle', title: 'TASK SWITCH', rules: 'Order the tiles from 1 to 8.', gridSize: 3, module: './games/sliderPuzzleGame.js', color: '#ec4899', shadow: '#f472b6' },
    minefield: { name: 'minefield', title: 'OVER STIMULATION', rules: 'Clear the board without hitting a mine.', module: './games/minefieldGame.js', color: '#6b7280', shadow: '#9ca3af' },
    fourInARow: { name: 'fourInARow', title: 'BODY DOUBLE', rules: 'Get four in a row against the AI.', gridRows: 6, gridCols: 7, module: './games/connectGame.js', color: '#ec4899', shadow: '#f472b6' },
    colorConnect: { name: 'colorConnect', title: 'FLOW STATE', rules: 'Connect matching colors without crossing.', gridSize: 6, module: './games/lineDrawGame.js', color: '#14b8a6', shadow: '#2dd4bf' },
    
    spellingBee: { name: 'spellingBee', title: 'AUDITORY PROCESS', rules: 'Listen to the word and type it correctly.', module: './games/spellingBeeGame.js', color: '#4f46e5', shadow: '#6366f1' },
    decryptGame: { name: 'decryptGame', title: 'UNMASK', module: './games/decryptGame.js', color: '#3d342a', shadow: '#5c5248' },
    numberCrunch: { name: 'numberCrunch', title: 'EXECUTIVE FUNCTION', rules: 'Use the numbers and operators to hit the target number.', gridSize: 4, module: './games/numberCrunchGame.js', color: '#9C27B0', shadow: '#c039d9' },
    fractionFlipper: { name: 'fractionFlipper', title: 'TASK INITIATION', rules: 'Add fractions to match the target value.', module: './games/fractionFlipperGame.js', color: '#10b981', shadow: '#34d399' },
    gauntlet: { name: 'gauntlet', title: 'SURVIVAL MODE', rules: 'Survive as long as you can!', setup: () => gauntlet.start(), handler: null, color: '#facc15', shadow: '#fde047', cleanup: () => gauntlet.end() },
    musicStudio: { 
        name: 'musicStudio', 
        title: 'MUSIC STUDIO', 
        rules: 'Create melodies and drum beats.', 
        module: './games/musicStudioGame.js', 
        color: '#673ab7', 
        shadow: '#9575cd'
    },
    anxietyLevelUp: {
        name: 'anxietyLevelUp',
        title: 'Anxiety 2',
        rules: 'Match 3+ colors. Don\'t let the grid fill up!',
        module: './games/anxietyLevelUpGame.js',
        color: '#ff3860',
        shadow: '#ff6b81'
    },
    wordFall: {
        name: 'wordFall',
        title: 'Dyslexia',
        rules: 'Find words of 3+ letters to score points.',
        module: './games/wordFallGame.js',
        color: '#4f46e5',
        shadow: '#a5b4fc'
    }
};

const gauntlet = {
    isActive: false, score: 0, timerInterval: null, availableGames: [],
    startTimer: function(duration, onEnd) { let timeLeft = duration; const timerEl = document.getElementById('gauntlet-timer'); const updateTimer = () => { if (timerEl) timerEl.textContent = `TIME: ${timeLeft}`; if (timeLeft <= 0) { clearInterval(this.timerInterval); onEnd(); } timeLeft--; }; updateTimer(); this.timerInterval = setInterval(updateTimer, 1000); },
    clearTimer: function() { clearInterval(this.timerInterval); },
    start: function() { this.isActive = true; this.score = 0; this.availableGames = Object.keys(gameModes).filter(k => k !== 'musicMachine' && k !== 'gauntlet' && k !== 'musicStudio'); utils.shuffleArray(this.availableGames); this.nextGame(); },
    shuffleGames: function() { utils.shuffleArray(this.availableGames); },
        nextGame: async function() { 
        if (!this.isActive) return; 
        if (this.availableGames.length === 0) this.shuffleGames(); 
        const nextGameKey = this.availableGames.pop(); 
        const gameMode = gameModes[nextGameKey];
        try {
            const module = await import(gameMode.module);
            const game = Object.values(module)[0];
            const mode = { ...gameMode, ...game };
            startGame(mode);
        } catch (error) {
            console.error(`Failed to load game module: ${gameMode.module}`, error);
        }
    },
    onGameComplete: function(isSuccess) { if (!this.isActive) return; this.clearTimer(); if (isSuccess) { this.score++; audioManager.playSound('positive', 'G5', '8n'); const successModal = createModal('success-modal', 'SUCCESS!', `<p class="text-2xl">Score: ${this.score}</p>`, 'Next Game', () => { successModal.remove(); this.nextGame(); }, 'arrow_forward', 'btn-green'); setTimeout(() => successModal.classList.add('is-visible'), 10); } else { audioManager.playSound('negative', 'C3', '2n'); this.end(); } },
    end: function() { const finalScore = this.score; this.isActive = false; this.score = 0; this.clearTimer(); const endModal = createModal('gauntlet-over-modal', 'Gauntlet Over', `<p class="text-2xl">Your final score is ${finalScore}.</p>`, 'Main Menu', () => { endModal.remove(); document.getElementById('game-container').classList.add('hidden'); document.getElementById('main-menu').classList.remove('hidden'); currentMode = null; }, 'menu', 'btn-red'); setTimeout(() => endModal.classList.add('is-visible'), 10); }
};

function updateStats(text) { if (statsContainer) statsContainer.textContent = text; }
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function createControlButton(text, colorClass, onClick, iconName = null) { const button = document.createElement('button'); button.setAttribute('aria-label', text); if (iconName) { button.className = `control-button-icon ${colorClass}`; const icon = document.createElement('span'); icon.className = 'material-symbols-outlined'; icon.textContent = iconName; button.appendChild(icon); } else { button.textContent = text; button.classList.add('control-button', colorClass); } button.addEventListener('click', onClick); return button; }
let currentlyFocusedElement = null;
const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

function createModal(id, title, content, buttonText, onButtonClick, iconName = null, buttonColor = 'btn-green') {
    currentlyFocusedElement = document.activeElement; // Save the currently focused element

    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal-backdrop';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `${id}-title`);

    let buttonHtml;
    if (iconName) {
        buttonHtml = `<button id="${id}-button" class="control-button-icon ${buttonColor}" aria-label="${buttonText}"><span class="material-symbols-outlined">${iconName}</span></button>`;
    } else {
        buttonHtml = `<button id="${id}-button" class="menu-button" style="width: auto; background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary);">${buttonText}</button>`;
    }

    modal.innerHTML = `<div class="modal-content" style="background-color: var(--md-sys-color-surface-container-high); color: var(--md-sys-color-on-surface);"><div class="confetti-container"></div><h2 id="${id}-title" class="text-4xl font-bold mb-4">${title}</h2><div id="${id}-content" class="text-lg mb-6">${content}</div>${buttonHtml}</div>`;
    modalContainer.appendChild(modal);

    const modalButton = document.getElementById(`${id}-button`);
    modalButton.addEventListener('click', () => {
        onButtonClick();
        if (currentlyFocusedElement) {
            currentlyFocusedElement.focus(); // Restore focus to the element that opened the modal
        }
    });

    // Focus trapping
    const focusableElements = modal.querySelectorAll(focusableElementsString);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function(e) {
        const isTabPressed = (e.key === 'Tab' || e.keyCode === 9);

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { // if shift key pressed for shift + tab combination
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus(); // add focus to the last focusable element
                e.preventDefault();
            }
        } else { // if tab key is pressed
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus(); // add focus to the first focusable element
                e.preventDefault();
            }
        }
    });

    // Set initial focus
    setTimeout(() => {
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        } else {
            modalButton.focus(); // Fallback to the modal's primary button if no other focusable elements
        }
    }, 0);

    return modal;
}
function showWinModal(title, message) { const winModal = createModal('win-modal', title, `<p>${message}</p>`, 'Play Again', () => { winModal.remove(); if (currentMode) startGame(currentMode); const confettiContainer = winModal.querySelector('.confetti-container'); if (confettiContainer) confettiContainer.innerHTML = ''; }, 'refresh', 'btn-green'); if(title.toLowerCase().includes('win')) { const confettiContainer = winModal.querySelector('.confetti-container'); for (let i = 0; i < 50; i++) { const confetti = document.createElement('div'); confetti.className = 'confetti'; confetti.style.left = `${Math.random() * 100}%`; confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; confetti.style.animationDuration = `${Math.random() * 3 + 2}s`; confetti.style.animationDelay = `${Math.random() * 2}s`; confettiContainer.appendChild(confetti); } } else { winModal.querySelector('.modal-content').classList.add('shake'); } setTimeout(() => winModal.classList.add('is-visible'), 10); }
function getValidColumns(board) { const W = 7; const validCols = []; for (let c = 0; c < W; c++) { if (board[c] === EMPTY) { validCols.push(c); } } return validCols; }

// --- CLICK HANDLER FIX ---
function handleBoardClick(e) {
    if (e.target.closest('.light') && currentMode && currentMode.handler) {
        // Pass the event and a 'click' identifier to the handler
        currentMode.handler(e, 'click');
    }
}

function handleBoardContextMenu(e) {
    e.preventDefault();
    if (e.target.closest('.light') && currentMode && currentMode.handler) {
        currentMode.handler(e, 'contextmenu');
    }
}

function initialize() {
    mainMenu = document.getElementById('main-menu');
    gameContainer = document.getElementById('game-container');
    gameTitle = document.getElementById('game-title');
    gameStatus = document.getElementById('game-status');
    gameRules = document.getElementById('game-rules');
    modalContainer = document.getElementById('modal-container');
    statsContainer = document.getElementById('stats-container');
    buttonContainer = document.getElementById('button-container');
    keyboardContainer = document.getElementById('keyboard-container');
    root = document.documentElement;

    // Expose core DOM references on the global object so they can be
    // referenced by dynamically loaded game modules. See top‑level comment
    // for more context.
    Object.assign(window, {
        mainMenu,
        gameContainer,
        gameTitle,
        gameStatus,
        gameRules,
        modalContainer,
        statsContainer,
        buttonContainer,
        keyboardContainer,
        root
    });

    const clockElement = document.getElementById('digital-clock');
    function updateClock() { if (!clockElement) return; const now = new Date(); const hours = String(now.getHours()).padStart(2, '0'); const minutes = String(now.getMinutes()).padStart(2, '0'); const seconds = String(now.getSeconds()).padStart(2, '0'); clockElement.textContent = `${hours}:${minutes}:${seconds}`; }
    updateClock();
    setInterval(updateClock, 1000);

    // --- MENU CLICK HANDLER ---
    async function handleMenuClick(e) {
        const button = e.target.closest('[data-mode]');
        if (!button) return;

        const modeKey = button.dataset.mode;
        const gameMode = gameModes[modeKey];

        if (gameMode) {
            // Initialize audio on the first user interaction
            if (!audioManager.isInitialized) {
                audioManager.init();
            }
            audioManager.playSound('ui', 'C4', '16n');

            mainMenu.classList.add('hidden');
            gameContainer.classList.remove('hidden');

            if (modeKey === 'gauntlet') {
                gauntlet.start();
            } else {
                gauntlet.isActive = false;
                try {
                    const module = await import(gameMode.module);
                    const game = Object.values(module)[0];
                    const mode = { ...gameMode, ...game };
                    startGame(mode);
                } catch (error) {
                    console.error(`Failed to load game module: ${gameMode.module}`, error);
                }
            }
        }
    }

    // Attach the event listener to the main menu
    mainMenu.addEventListener('click', handleMenuClick);

    // --- FULLSCREEN TOGGLE ---
    const fullscreenButton = document.getElementById('fullscreen-toggle-button');
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', initialize);

window.startGame = function(mode) {
    if (currentMode && typeof currentMode.cleanup === 'function') {
        currentMode.cleanup();
    }

    // --- Universal Cleanup ---
    const gameBoardWrapper = document.getElementById('game-board-wrapper');
    gameBoardWrapper.innerHTML = ''; // Clear previous game's special layout
    keyboardContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    statsContainer.innerHTML = '';
    modalContainer.innerHTML = '';
    gameStatus.textContent = '';
    
    currentMode = mode;
    // Expose currentMode on the global object so modules can read it
    window.currentMode = currentMode;
    
    // --- Set container classes for styling ---
    const keyboardGames = ['wordGuess', 'spellingBee', 'decryptGame'];
    gameContainer.classList.toggle('keyboard-active', keyboardGames.includes(mode.name));
    gameContainer.classList.toggle('music-studio-active', mode.name === 'musicStudio');

    // --- Set titles and theme colors ---
    gameTitle.textContent = mode.title;
    gameRules.textContent = mode.rules;
    root.style.setProperty('--theme-color', mode.color);
    root.style.setProperty('--theme-shadow-color', mode.shadow);
    gameTitle.style.color = mode.color;
    gameTitle.style.textShadow = `0 0 10px ${mode.shadow}`;

    // --- LAZY LOADING FIX ---
    // Always create a gameBoard element. The game-specific setup function
    // is responsible for populating it. This ensures the element exists
    // when the setup function is called, fixing the "cannot set innerHTML" error.
    gameBoard = document.createElement('div');
    gameBoard.id = 'game-board';
    gameBoardWrapper.appendChild(gameBoard);
    // Expose the new gameBoard so game modules can access it
    window.gameBoard = gameBoard;

    const selfContainedGames = ['musicStudio', 'anxietyLevelUp', 'wordFall'];
    if (!selfContainedGames.includes(mode.name)) {
        gameBoard.className = 'game-grid mb-2';
        if (mode.gridSize || (mode.gridRows && mode.gridCols)) {
            const rows = mode.gridRows || mode.gridSize;
            const cols = mode.gridCols || mode.gridSize;
            gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < rows * cols; i++) {
                let cell = (typeof mode.createCell === 'function') ? mode.createCell(i) : document.createElement('div');
                if (!cell.classList.contains('light')) cell.classList.add('light');
                cell.dataset.index = i;
                fragment.appendChild(cell);
            }
            gameBoard.appendChild(fragment);
        }
    }
    // --- END OF FIX ---
    
    // --- Add Back Button ---
    const backButton = createControlButton('Menu', 'btn-red', () => {
        if (currentMode && typeof currentMode.cleanup === 'function') {
            currentMode.cleanup();
        }
        gameContainer.classList.remove('keyboard-active', 'music-studio-active');
        gameContainer.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        currentMode = null;
    }, 'arrow_back');
    backButton.classList.add('global-back-button');
    buttonContainer.appendChild(backButton);

    // --- Call the game's specific setup function ---
    mode.setup();

    // --- Add event listeners ---
    const gameBoardWrapperRef = document.getElementById('game-board-wrapper');
    gameBoardWrapperRef.addEventListener('click', handleBoardClick);
    gameBoardWrapperRef.addEventListener('contextmenu', handleBoardContextMenu);
}

export { updateStats, delay, createControlButton, createModal, showWinModal, getValidColumns, handleBoardClick, handleBoardContextMenu, notes, P1, P2, EMPTY, AI, HUMAN };

const audioManager = new AudioManager();
<<<<<<< Updated upstream
let keyboard;
=======
let keyboard;

// -----------------------------------------------------------------------------
// Expose key variables and helpers on the global object.  Many of the game
// modules are dynamically imported and refer to these identifiers without
// importing them, assuming they live on the global scope.  Without these
// assignments the application would throw `ReferenceError` when a game
// module attempted to access (for example) `updateStats` or `gameState`.
//
// Note: assignment happens after creation of audioManager so that it too is
// available globally.  Variables like `gameBoard` are set during
// `initialize()`/`startGame()` and are updated there (see the assignments
// inside those functions).
Object.assign(window, {
    // game state and mode tracking
    gameState,
    currentMode,
    gauntlet,
    // audio manager
    audioManager,
    // helper functions exported from this module
    updateStats,
    delay,
    createControlButton,
    createModal,
    showWinModal,
    getValidColumns,
    handleBoardClick,
    handleBoardContextMenu,
    // constants used by games
    notes,
    P1,
    P2,
    EMPTY,
    AI,
    HUMAN
});
>>>>>>> Stashed changes
