const decryptGame = {
    // --- PROPERTIES ---
    puzzleContainer: null,
    keyboardContainer: null,
    controller: null,
    availablePuzzles: [], // Holds the list of puzzles for the current cycle

    // Game State
    puzzles: decryptQuotes,
    currentQuote: '',
    cipherMap: {},
    encryptedQuote: '',
    userMappings: {},
    activeCipherChar: null,
    isSolved: false,

    // --- METHODS ---
    setup: function() {
        if (decryptGame.controller) decryptGame.controller.abort();
        decryptGame.controller = new AbortController();
        const { signal } = decryptGame.controller;

        gameBoard.innerHTML = '';
        keyboardContainer.innerHTML = '';
        gameTitle.textContent = 'CIPHER';
        gameRules.textContent = 'Decode the quote. Click a cell to select a letter.';
        document.getElementById('game-container').classList.add('cryptogram-active');
        document.getElementById('game-board-wrapper').classList.add('scroll-indicator-wrapper');

        decryptGame.puzzleContainer = document.createElement('div');
        decryptGame.puzzleContainer.id = 'cryptogram-puzzle';
        decryptGame.puzzleContainer.className = 'cryptogram-puzzle-container';
        gameBoard.appendChild(decryptGame.puzzleContainer);

        decryptGame.keyboardContainer = document.getElementById('keyboard-container');

        const keyLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
        ];

        keyboard = new Keyboard(keyLayout, (key) => {
            if (key === 'Backspace') {
                decryptGame.setUserMapping(decryptGame.activeCipherChar, '');
            } else if (key.match(/^[a-zA-Z]$/)) {
                decryptGame.setUserMapping(decryptGame.activeCipherChar, key.toUpperCase());
            }
        });

        buttonContainer.appendChild(createControlButton('Hint', 'btn-blue', decryptGame.giveHint));
        buttonContainer.appendChild(createControlButton('Source', 'btn-pink', decryptGame.giveSourceHint));
        buttonContainer.appendChild(createControlButton('New Puzzle', 'btn-green', () => {
            decryptGame.cleanup();
            startGame(gameModes.decryptGame);
        }, 'refresh'));

        decryptGame.puzzleContainer.addEventListener('click', decryptGame.handleInputClick, { signal });
        window.addEventListener('keydown', decryptGame.handlePhysicalKeyboard, { signal });
        window.addEventListener('resize', decryptGame.updateScrollIndicator, { signal });

        decryptGame.newGame();
    },

    cleanup: function() {
        document.getElementById('game-board-wrapper').classList.remove('scroll-indicator-wrapper', 'has-overflow');
        if (decryptGame.controller) {
            decryptGame.controller.abort();
        }
    },

    newGame: function() {
        // If the list of available puzzles is empty, refill and shuffle it.
        // This ensures each puzzle is seen once before any repeats occur.
        if (decryptGame.availablePuzzles.length === 0) {
            // The 'utils' object with shuffleArray is in main.js
            decryptGame.availablePuzzles = utils.shuffleArray([...decryptGame.puzzles]);
        }
        
        // Pull the next unique puzzle from the shuffled list.
        const puzzleInfo = decryptGame.availablePuzzles.pop();

        decryptGame.currentQuote = puzzleInfo.quote.toUpperCase();
        decryptGame.cipherMap = decryptGame.generateCipherMap();
        decryptGame.encryptedQuote = decryptGame.encrypt(decryptGame.currentQuote, decryptGame.cipherMap);
        decryptGame.userMappings = {};
        decryptGame.activeCipherChar = null;
        decryptGame.isSolved = false;
        
        gameStatus.textContent = '';

        decryptGame.renderPuzzle();

        setTimeout(() => {
            decryptGame.applyInitialHints();
            decryptGame.updatePuzzleDisplay();
            decryptGame.updateKeyboard();
            decryptGame.selectFirstOpenCell();
            decryptGame.updateScrollIndicator();
        }, 10);
    },

    updateScrollIndicator: function() {
        const wrapper = document.getElementById('game-board-wrapper');
        if (wrapper) {
            const hasOverflow = wrapper.scrollHeight > wrapper.clientHeight;
            wrapper.classList.toggle('has-overflow', hasOverflow);
        }
    },

    applyInitialHints: function() {
        const allCipherChars = [...new Set(decryptGame.encryptedQuote.match(/[A-Z]/g) || [])];
        const invertedCipherMap = Object.fromEntries(Object.entries(decryptGame.cipherMap).map(([plain, cipher]) => [cipher, plain]));

        for (let i = 0; i < 3; i++) {
            const unmappedChars = allCipherChars.filter(char => !decryptGame.userMappings[char]);
            if (unmappedChars.length === 0) break;

            const cipherToReveal = unmappedChars[Math.floor(Math.random() * unmappedChars.length)];
            if (invertedCipherMap[cipherToReveal]) {
                decryptGame.userMappings[cipherToReveal] = invertedCipherMap[cipherToReveal];
            }
        }
    },

    setUserMapping: function(cipherChar, plainChar) {
        if (!cipherChar || decryptGame.isSolved) return;

        if (plainChar) {
            for (const key in decryptGame.userMappings) {
                if (decryptGame.userMappings[key] === plainChar) {
                    decryptGame.userMappings[key] = '';
                }
            }
        }
        decryptGame.userMappings[cipherChar] = plainChar;

        decryptGame.updatePuzzleDisplay();
        decryptGame.updateKeyboard();

        if (decryptGame.checkSolution()) return;

        if (plainChar) {
            decryptGame.selectNextOpenCell();
        }
    },

    selectFirstOpenCell: function() {
        const allCells = decryptGame.puzzleContainer.querySelectorAll('.cryptogram-cell[data-cipher]');
        for (const cell of allCells) {
            if (!decryptGame.userMappings[cell.dataset.cipher]) {
                decryptGame.setActiveCipherChar(cell.dataset.cipher);
                return;
            }
        }
    },

    selectNextOpenCell: function() {
        const allCells = Array.from(decryptGame.puzzleContainer.querySelectorAll('.cryptogram-cell[data-cipher]'));
        const currentIndex = allCells.findIndex(cell => cell.dataset.cipher === decryptGame.activeCipherChar);

        if (currentIndex === -1) {
            decryptGame.selectFirstOpenCell();
            return;
        }

        for (let i = 1; i <= allCells.length; i++) {
            const nextIndex = (currentIndex + i) % allCells.length;
            const nextCell = allCells[nextIndex];
            if (!decryptGame.userMappings[nextCell.dataset.cipher]) {
                decryptGame.setActiveCipherChar(nextCell.dataset.cipher);
                return;
            }
        }
        decryptGame.setActiveCipherChar(null);
    },

    handleInputClick: function(e) {
        const cell = e.target.closest('.cryptogram-cell[data-cipher]');
        if (cell) decryptGame.setActiveCipherChar(cell.dataset.cipher);
    },

    setActiveCipherChar: function(cipherChar) {
        decryptGame.activeCipherChar = cipherChar;
        document.querySelectorAll('.cryptogram-cell').forEach(cell => {
            cell.classList.toggle('active', cell.dataset.cipher === cipherChar);
        });
    },

    handlePhysicalKeyboard: function(e) {
        if (!decryptGame.activeCipherChar || decryptGame.isSolved) return;
        if (e.key.match(/^[a-zA-Z]$/)) {
            e.preventDefault();
            decryptGame.setUserMapping(decryptGame.activeCipherChar, e.key.toUpperCase());
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            decryptGame.setUserMapping(decryptGame.activeCipherChar, '');
        }
    },

    renderPuzzle: function() {
        decryptGame.puzzleContainer.innerHTML = '';
        const words = decryptGame.encryptedQuote.split(' ');
        words.forEach(word => {
            const wordContainer = document.createElement('div');
            wordContainer.className = 'cryptogram-word';
            word.split('').forEach(char => {
                wordContainer.appendChild(decryptGame.createLetterCell(char));
            });
            decryptGame.puzzleContainer.appendChild(wordContainer);
        });
    },

    createLetterCell: function(char) {
        const cell = document.createElement('div');
        cell.className = 'cryptogram-cell';
        if (char.match(/[A-Z]/)) {
            cell.dataset.cipher = char;
            cell.innerHTML = `<div class="cipher-char">${char}</div><div class="plain-char" data-plain="${char}"></div>`;
        } else {
            cell.textContent = char;
            cell.classList.add('punctuation');
        }
        return cell;
    },

    updatePuzzleDisplay: function() {
        document.querySelectorAll('.plain-char').forEach(el => {
            const cipher = el.dataset.plain;
            const mappedChar = decryptGame.userMappings[cipher] || '';
            el.textContent = mappedChar;
        });
    },

    updateKeyboard: function() {
        const mappedPlainChars = Object.values(decryptGame.userMappings);
        for (const row of keyboard.keyLayout) {
            for (const key of row) {
                const isUsed = mappedPlainChars.includes(key);
                keyboard.enableKey(key, !isUsed);
                const keyEl = keyboard.keyboardContainer.querySelector(`[data-key="${key.toLowerCase()}"]`);
                if (keyEl) {
                    keyEl.classList.toggle('used', isUsed);
                }
            }
        }
    },

    generateCipherMap: function() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        let shuffled;
        while (true) {
            shuffled = [...alphabet].sort(() => Math.random() - 0.5);
            if (shuffled.every((char, i) => char !== alphabet[i])) break;
        }
        return alphabet.reduce((map, char, i) => ({...map, [char]: shuffled[i] }), {});
    },

    encrypt: function(text, map) {
        return text.split('').map(char => map[char] || char).join('');
    },

    checkSolution: function() {
        const decryptedQuote = decryptGame.encryptedQuote.split('').map(char => {
            return decryptGame.userMappings[char] || (char.match(/[A-Z]/) ? ' ' : char);
        }).join('');

        if (decryptedQuote === decryptGame.currentQuote) {
            decryptGame.isSolved = true;
            decryptGame.setActiveCipherChar(null);
            const puzzleInfo = decryptGame.puzzles.find(p => p.quote.toUpperCase() === decryptGame.currentQuote);
            const title = puzzleInfo ? puzzleInfo.title : "You Cracked the Code!";
            let message = `<p class="mb-2">The quote was:</p><p class="font-bold" style="color: var(--md-sys-color-primary);">"${decryptGame.currentQuote}"</p>`;
            if (puzzleInfo && puzzleInfo.source) message += `<p class="mt-4 text-sm">Source: ${puzzleInfo.source}</p>`;

            gameRules.textContent = "Congratulations! You solved it!";
            showWinModal(title, message);

            document.querySelectorAll('.cryptogram-cell[data-cipher]').forEach(cell => cell.classList.add('correct'));
            return true;
        }
        return false;
    },

    giveSourceHint: function() {
        const puzzleInfo = decryptGame.puzzles.find(p => p.quote.toUpperCase() === decryptGame.currentQuote);
        if (puzzleInfo && puzzleInfo.source) {
            gameStatus.textContent = `Source: ${puzzleInfo.source}`;
        } else {
            gameStatus.textContent = "No source information is available.";
        }
    },

    giveHint: function() {
        gameRules.textContent = '';
        const puzzleInfo = decryptGame.puzzles.find(p => p.quote.toUpperCase() === decryptGame.currentQuote);

        if (puzzleInfo && puzzleInfo.notes && gameStatus.textContent.indexOf(puzzleInfo.notes) === -1) {
            gameStatus.textContent = `Hint: ${puzzleInfo.notes}`;
            return;
        }

        const letterFrequencies = {};
        decryptGame.encryptedQuote.split('').forEach(char => {
            if (char.match(/[A-Z]/) && !decryptGame.userMappings[char]) {
                letterFrequencies[char] = (letterFrequencies[char] || 0) + 1;
            }
        });
        
        const unmappedChars = Object.keys(letterFrequencies);
        if (unmappedChars.length === 0) {
            gameRules.textContent = "No more hints available!";
            return;
        }

        const cipherToReveal = unmappedChars.sort((a, b) => letterFrequencies[b] - letterFrequencies[a])[0];
        
        const invertedCipherMap = Object.fromEntries(Object.entries(decryptGame.cipherMap).map(([plain, cipher]) => [cipher, plain]));
        
        if (invertedCipherMap[cipherToReveal]) {
            decryptGame.setUserMapping(cipherToReveal, invertedCipherMap[cipherToReveal]);
            audioManager.playSound('positive', 'E5', '8n');
        }
    }
};

// --- Game Registration ---
// Instead of polluting the global scope, we now explicitly register
// the game with the gameManager.
if (window.gameManager) {
    window.gameManager.registerGame('decryptGame', decryptGame);
} else {
    // This error will appear if a game script is loaded without main.js,
    // which can be helpful for debugging.
    console.error("Fatal Error: gameManager is not available.");
}