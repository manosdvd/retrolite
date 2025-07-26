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
    const gameCanvas = document.getElementById('game-canvas');
    const resetButton = document.getElementById('reset-button');
    const exitButton = document.getElementById('exit-button');
    
    // Error Modal Elements
    const errorOverlay = document.getElementById('error-overlay');
    const errorText = document.getElementById('error-text');
    const errorCloseButton = document.getElementById('error-close-button');

    let currentGameInstance = null;

    // --- Error Handling ---
    /**
     * Displays a user-friendly error message in a modal overlay.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        console.error(message); // Also log to console for developers
        errorText.textContent = message;
        errorOverlay.style.display = 'flex';
    }

    // Close the error modal when the button is clicked.
    errorCloseButton.onclick = () => {
        errorOverlay.style.display = 'none';
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

            // --- Validate the Game's "Contract" ---
            // We create a temporary instance just to check for required methods.
            // This ensures any game we try to run will respond to the main controls.
            const tempInstance = new GameConstructor(gameCanvas);
            if (typeof tempInstance.start !== 'function') {
                throw new Error(`Game "${gameId}" is invalid: It must have a 'start()' method.`);
            }
            if (typeof tempInstance.reset !== 'function') {
                throw new Error(`Game "${gameId}" is invalid: It must have a 'reset()' method.`);
            }
            // destroy() is optional, so we don't strictly check for it.

            // If validation passes, create the actual instance for the game.
            mainMenu.style.display = 'none';
            gameContainer.style.display = 'block';
            
            currentGameInstance = new GameConstructor(gameCanvas);
            currentGameInstance.start();

            // The main app remains in control of the reset/exit buttons.
            // This ensures a consistent UI and experience across all games.
            resetButton.onclick = () => currentGameInstance.reset();
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
        if (currentGameInstance && typeof currentGameInstance.destroy === 'function') {
            try {
                currentGameInstance.destroy();
            } catch (e) {
                console.error(`Error during ${currentGameInstance.constructor.name}.destroy():`, e);
            }
        }
        currentGameInstance = null;
        gameCanvas.innerHTML = ''; // Clear the game canvas
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
