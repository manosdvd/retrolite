// main.js

// --- Game Manager ---
// This is the new central registry for all games.
// We attach it to the window object so that individual game files can access it
// to register themselves. This is the only global variable we will use.
window.gameManager = {
    _gameConstructors: {},

    /**
     * Game files call this function to register themselves with the main application.
     * @param {string} id - A unique identifier for the game (e.g., 'ticTacToeGame').
     * @param {Function} constructor - The class or constructor function for the game.
     */
    registerGame(id, constructor) {
        if (typeof id !== 'string' || !id) {
            console.error('Game registration failed: ID must be a non-empty string.');
            return;
        }
        if (typeof constructor !== 'function') {
            console.error(`Game registration failed for "${id}": The provided constructor is not a function.`);
            return;
        }
        console.log(`Successfully registered game: ${id}`);
        this._gameConstructors[id] = constructor;
    },

    /**
     * Retrieves a game constructor from the registry.
     * @param {string} id - The ID of the game to retrieve.
     * @returns {Function|undefined} The game constructor, or undefined if not found.
     */
    getGameConstructor(id) {
        return this._gameConstructors[id];
    },

    /**
     * Defines the master list of all games that the application should try to load.
     * This is the single source of truth for the game menu.
     * @returns {string[]} A list of game IDs.
     */
    getGameList() {
        return [
            'ticTacToeGame', 'connectGame', 'minefieldGame', 'wordleGame',
            'echoGame', 'lightsOutGame', 'sliderPuzzleGame', 'decryptGame',
            'spellingBeeGame', 'blackjackGame', 'anxietyGame', 'lightMatchGame',
            'lineDrawGame', 'musicMachineGame', 'musicStudioGame', 'numberCrunchGame',
            'patternPaloozaGame', 'magicSquareGame', 'shapeSurveyorGame', 'measureMasterGame',
            'decimalDashGame', 'fractionFlipperGame', 'linePlotLearnerGame'
        ];
    }
};


// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameListContainer = document.getElementById('game-list');
    const mainMenu = document.getElementById('main-menu');
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const keyboardContainer = document.getElementById('keyboard-container');
    const buttonContainer = document.getElementById('button-container');
    const resetButton = document.getElementById('reset-button');
    const exitButton = document.getElementById('exit-button');
    
    // Error Modal Elements
    const errorOverlay = document.getElementById('error-overlay');
    const errorText = document.getElementById('error-text');
    const errorCloseButton = document.getElementById('error-close-button');

    let currentGameInstance = null;
    let currentMode = null;
    let gameState = {};
    let keyboard = null;

    // Constants for game logic
    const EMPTY = 0;
    const HUMAN = 1;
    const AI = -1;
    const P1 = 1;
    const P2 = -1;

    // Musical notes for audio feedback
    const notes = [
        'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5',
        'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4'
    ];

    // Utility functions (can be moved to a separate utils.js later)
    const utils = {
        shuffleArray: (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        checkWin: (board, player, winLines) => {
            for (let i = 0; i < winLines.length; i++) {
                const [a, b, c] = winLines[i];
                if (board[a] === player && board[b] === player && board[c] === player) {
                    return { player, line: winLines[i] };
                }
            }
            return null;
        },
        isDraw: (board) => {
            return board.every(cell => cell !== EMPTY);
        },
        getNeighbors: (index, rows, cols) => {
            const neighbors = [];
            const r = Math.floor(index / cols);
            const c = index % cols;
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            directions.forEach(([dr, dc]) => {
                const newR = r + dr;
                const newC = c + dc;
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                    neighbors.push(newR * cols + newC);
                }
            });
            return neighbors;
        },
        getSliderNeighbors: (index, size) => {
            const neighbors = [];
            const row = Math.floor(index / size);
            const col = index % size;

            // Check left
            if (col > 0) neighbors.push(index - 1);
            // Check right
            if (col < size - 1) neighbors.push(index + 1);
            // Check up
            if (row > 0) neighbors.push(index - size);
            // Check down
            if (row < size - 1) neighbors.push(index + size);

            return neighbors;
        }
    };

    // Audio Manager (simplified for now)
    const audioManager = {
        _audioContext: null,
        _oscillators: {},

        init: function() {
            if (!this._audioContext) {
                this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        },

        playSound: function(type, note, duration = '8n') {
            this.init();
            const osc = this._audioContext.createOscillator();
            const gainNode = this._audioContext.createGain();

            osc.connect(gainNode);
            gainNode.connect(this._audioContext.destination);

            if (type === 'game' || type === 'positive' || type === 'negative' || type === 'ui') {
                osc.type = 'sine';
                osc.frequency.value = Tone.Midi(note).hz; // Use Tone.js for note to frequency conversion
                gainNode.gain.setValueAtTime(0.5, this._audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this._audioContext.currentTime + Tone.Time(duration).toSeconds());
            }

            osc.start(this._audioContext.currentTime);
            osc.stop(this._audioContext.currentTime + Tone.Time(duration).toSeconds());
        }
    };

    // Word list for Wordle and Spelling Bee (truncated for brevity)
    const expandedWordList = ["apple", "baker", "crane", "drain", "eagle", "flame", "grape", "house", "igloo", "jolly", "karma", "lemon", "mango", "night", "ocean", "piano", "queen", "river", "snake", "table", "unity", "vowel", "whale", "xerox", "yacht", "zebra"];

    // --- UI Utility Functions ---
    function createControlButton(text, colorClass, onClick, iconName = null) {
        const button = document.createElement('button');
        button.className = `control-button-icon ${colorClass}`;
        button.onclick = onClick;
        if (iconName) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined';
            iconSpan.textContent = iconName;
            button.appendChild(iconSpan);
        }
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        button.appendChild(textSpan);
        return button;
    }

    function updateStats(text) {
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.textContent = text;
        }
    }

    function showWinModal(title, message) {
        const modal = document.createElement('div');
        modal.id = 'win-modal';
        modal.className = 'win-modal';
        modal.innerHTML = `
            <div class="win-modal-content">
                <div class="confetti-container"></div>
                <h2 class="win-modal-title">${title}</h2>
                <p class="win-modal-message">${message}</p>
                <button id="play-again-button" class="control-button-icon btn-green"><span class="material-symbols-outlined">refresh</span><span>Play Again</span></button>
            </div>
        `;
        document.body.appendChild(modal);

        // Add confetti
        const confettiContainer = modal.querySelector('.confetti-container');
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confettiContainer.appendChild(confetti);
        }

        document.getElementById('play-again-button').onclick = () => {
            modal.remove();
            startGame(currentMode);
        };

        setTimeout(() => modal.classList.add('is-visible'), 10);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Keyboard class (simplified, assumes a basic structure)
    class Keyboard {
        constructor(keyLayout, onKeyPress) {
            this.keyLayout = keyLayout;
            this.onKeyPress = onKeyPress;
            this.keyboardContainer = document.getElementById('keyboard-container');
            this.render();
        }

        render() {
            this.keyboardContainer.innerHTML = '';
            this.keyLayout.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'keyboard-row';
                row.forEach(key => {
                    const button = document.createElement('button');
                    button.className = 'keyboard-button';
                    button.textContent = key;
                    button.dataset.key = key.toLowerCase();
                    button.onclick = () => this.onKeyPress(key);
                    rowDiv.appendChild(button);
                });
                this.keyboardContainer.appendChild(rowDiv);
            });
        }

        enableKey(key, enable) {
            const button = this.keyboardContainer.querySelector(`[data-key="${key.toLowerCase()}"]`);
            if (button) {
                button.disabled = !enable;
                button.classList.toggle('is-disabled', !enable);
            }
        }

        updateKey(key, colorClass) {
            const button = this.keyboardContainer.querySelector(`[data-key="${key.toLowerCase()}"]`);
            if (button) {
                button.classList.remove('wordle-correct', 'wordle-present', 'wordle-absent');
                button.classList.add(colorClass);
            }
        }
    }

    // Tone.js (simplified, assumes basic functionality)
    const Tone = {
        context: { state: 'running', resume: () => {} },
        Transport: { bpm: { value: 120 }, start: () => {}, stop: () => {}, cancel: () => {}, state: 'stopped' },
        Midi: (note) => ({ hz: 440 }), // Placeholder
        Time: (duration) => ({ toSeconds: () => 0.5 }), // Placeholder
        Draw: { schedule: (fn, time) => fn() }, // Placeholder
        PolySynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        FMSynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        PluckSynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        AMSynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        MonoSynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        Synth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        MembraneSynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        NoiseSynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        MetalSynth: function() { this.toDestination = () => this; this.triggerAttackRelease = () => {}; this.dispose = () => {}; },
        Sequence: function(callback, events, subdivision) { this.start = () => {}; this.stop = () => {}; this.dispose = () => {}; },
    };

    // --- Game Loading and Lifecycle ---

    /**
     * Dynamically loads a game's script file by creating a <script> tag.
     * @param {string} gameId - The ID of the game to load.
     * @returns {Promise<void>} A promise that resolves on script load or rejects on error.
     */
    function loadGameScript(gameId) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `games/${gameId}.js`;
            script.onload = () => {
                console.log(`Script loaded: ${gameId}.js`);
                resolve();
            };
            script.onerror = () => {
                // This catches network errors, 404s, etc.
                reject(new Error(`Network error or file not found for ${gameId}.js.`));
            };
            document.body.appendChild(script);
        });
    }

    /**
     * Starts a game after verifying its integrity.
     * @param {string} gameId - The ID of the game to start.
     */
    async function startGame(gameId) {
        try {
            const GameConstructor = window.gameManager.getGameConstructor(gameId);
            if (!GameConstructor) {
                throw new Error(`Game "${gameId}" is not registered. Check the game file for errors or missing registration call.`);
            }

            // If validation passes, create the actual instance for the game.
            mainMenu.style.display = 'none';
            gameContainer.style.display = 'block';
            
            currentGameInstance = GameConstructor;
            currentMode = gameModes[gameId];
            currentGameInstance.setup();

            // The main app remains in control of the reset/exit buttons.
            // This ensures a consistent UI and experience across all games.
            resetButton.onclick = () => startGame(currentMode);
            exitButton.onclick = () => exitGame();

        } catch (error) {
            showError(`Could not start game "${gameId}": ${error.message}`);
            exitGame(); // Return to the main menu if starting fails.
        }
    }

    /**
     * Exits the current game and returns to the main menu.
     */
    function exitGame() {
        if (currentGameInstance && typeof currentGameInstance.cleanup === 'function') {
            try {
                currentGameInstance.cleanup();
            } catch (e) {
                console.error(`Error during ${currentGameInstance.constructor.name}.cleanup():`, e);
            }
        }
        currentGameInstance = null;
        mainMenu.style.display = 'block';
        gameContainer.style.display = 'none';
    }

    // --- Application Initialization ---
    /**
     * Loads all game scripts and then builds the main menu,
     * disabling any games that failed to load or register correctly.
     */
    async function initialize() {
        const gameIds = window.gameManager.getGameList();
        // Create a loading promise for each game script.
        const loadingPromises = gameIds.map(id => loadGameScript(id).catch(err => err));

        // Wait for all scripts to either load or fail.
        await Promise.all(loadingPromises);

        console.log("All game scripts processed. Building menu.");

        // Now, build the menu based on which games successfully registered themselves.
        for (const gameId of gameIds) {
            const GameCtor = window.gameManager.getGameConstructor(gameId);
            const gameButton = document.createElement('button');
            // Create a user-friendly name from the camelCase ID.
            const friendlyName = gameId.replace(/([A-Z])/g, ' $1').replace(/Game$/, '').trim();
            gameButton.textContent = friendlyName;

            if (GameCtor) {
                // If the game is loaded and valid, enable its button.
                gameButton.onclick = () => startGame(gameId);
            } else {
                // If the game failed to load or register, disable its button.
                gameButton.disabled = true;
                gameButton.title = `This game could not be loaded. Check console for errors.`;
                gameButton.style.textDecoration = 'line-through';
                gameButton.style.opacity = '0.5';
                console.warn(`Game "${gameId}" will be disabled as it did not register correctly.`);
            }
            gameListContainer.appendChild(gameButton);
        }
    }

    initialize();
});

// Game Modes (for games that need different configurations)
const gameModes = {
    ticTacToeGame: { name: 'ticTacToe', gridCols: 3, gridRows: 3 },
    connectGame: { name: 'connect4', gridCols: 7, gridRows: 6 },
    minefieldGame: { name: 'minefield', gridCols: 8, gridRows: 8 },
    wordleGame: { name: 'wordle', gridCols: 5, gridRows: 6 },
    echoGame: { name: 'echo', gridCols: 3, gridRows: 3 },
    lightsOutGame: { name: 'lightsOut', gridCols: 5, gridRows: 5 },
    sliderPuzzleGame: { name: 'sliderPuzzle', gridCols: 3, gridRows: 3 },
    decryptGame: { name: 'decrypt', gridCols: 1, gridRows: 1 }, // Not grid-based
    spellingBeeGame: { name: 'spellingBee', gridCols: 1, gridRows: 1 }, // Not grid-based
    blackjackGame: { name: 'blackjack', gridCols: 4, gridRows: 4 },
    anxietyGame: { name: 'anxiety', gridCols: 10, gridRows: 12 },
    lightMatchGame: { name: 'lightMatch', gridCols: 8, gridRows: 8 },
    lineDrawGame: { name: 'lineDraw', gridCols: 5, gridRows: 5 },
    musicMachineGame: { name: 'musicMachine', gridCols: 3, gridRows: 3 },
    musicStudioGame: { name: 'musicStudio', gridCols: 32, gridRows: 8 },
    numberCrunchGame: { name: 'numberCrunch', gridCols: 4, gridRows: 4 },
    patternPaloozaGame: { name: 'patternPalooza', gridCols: 1, gridRows: 1 },
    magicSquareGame: { name: 'magicSquare', gridCols: 3, gridRows: 3 },
    shapeSurveyorGame: { name: 'shapeSurveyor', gridCols: 1, gridRows: 1 },
    measureMasterGame: { name: 'measureMaster', gridCols: 1, gridRows: 1 },
    decimalDashGame: { name: 'decimalDash', gridCols: 3, gridRows: 3 },
    fractionFlipperGame: { name: 'fractionFlipper', gridCols: 4, gridRows: 2 },
    linePlotLearnerGame: { name: 'linePlotLearner', gridCols: 1, gridRows: 1 },
};
