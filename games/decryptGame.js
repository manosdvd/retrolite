const decryptGame = {
    // --- PROPERTIES ---
    puzzleContainer: null,
    keyboardContainer: null,
    controller: null,
    availablePuzzles: [], // Holds the list of puzzles for the current cycle
    useAPI: false, // Flag to determine quote source

    // Game State
    puzzles: decryptQuotes,
    currentQuote: '',
    currentSource: '',
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
        // This initial text will be overwritten by newGame()
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

        const apiButton = createControlButton(decryptGame.useAPI ? 'API Mode' : 'Local Mode', decryptGame.useAPI ? 'btn-purple' : 'btn-blue', () => {
            decryptGame.useAPI = !decryptGame.useAPI;
            apiButton.textContent = decryptGame.useAPI ? 'API Mode' : 'Local Mode';
            apiButton.classList.toggle('btn-purple', decryptGame.useAPI);
            apiButton.classList.toggle('btn-blue', !decryptGame.useAPI);
            decryptGame.newGame();
        });
        buttonContainer.appendChild(apiButton);

        buttonContainer.appendChild(createControlButton('Hint', 'btn-yellow', decryptGame.giveHint));
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

    fetchQuote: async function() {
        gameRules.textContent = 'Fetching new quote from API...';
        try {
            const response = await fetch('https://api.quotable.io/random');
            if (!response.ok) {
                // This handles errors from the API, like '404 Not Found' or '500 Server Error'
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            decryptGame.currentQuote = data.content.toUpperCase();
            decryptGame.currentSource = data.author;
            gameRules.textContent = `Source: ${decryptGame.currentSource}`;
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
        } catch (error) {
            // This catches network failures (offline) or the error thrown above
            console.error('Failed to fetch quote:', error);
            // Provide a clear, direct alert to the user
            alert('Could not fetch a quote from the API. This may be due to your network connection or the API service being temporarily down. Switching to local mode.');
            
            gameStatus.textContent = 'API fetch failed. Switched to local mode.';
            decryptGame.useAPI = false; // Revert to local mode on failure
            const apiButton = buttonContainer.querySelector('.btn-purple, .btn-blue');
            if (apiButton) {
                apiButton.textContent = 'Local Mode';
                apiButton.classList.remove('btn-purple');
                apiButton.classList.add('btn-blue');
            }
            // Load a local game as a fallback
            setTimeout(decryptGame.newGame, 100);
        }
    },

    cleanup: function() {
        document.getElementById('game-container').classList.remove('cryptogram-active');
        document.getElementById('game-board-wrapper').classList.remove('scroll-indicator-wrapper', 'has-overflow');
        if (decryptGame.controller) {
            decryptGame.controller.abort();
        }
    },

    newGame: function() {
        if (decryptGame.useAPI) {
            decryptGame.fetchQuote();
            return;
        }

        if (decryptGame.availablePuzzles.length === 0) {
            decryptGame.availablePuzzles = utils.shuffleArray([...decryptGame.puzzles]);
        }
        
        const puzzleInfo = decryptGame.availablePuzzles.pop();

        decryptGame.currentQuote = puzzleInfo.quote.toUpperCase(); //
        decryptGame.currentSource = puzzleInfo.source; //
        // Display the source by default
        gameRules.textContent = `Source: ${decryptGame.currentSource}`; //
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
            const title = puzzleInfo ? puzzleInfo.title : "You Cracked the Code!"; //
            let message = `<p class="mb-2">The quote was:</p><p class="font-bold" style="color: var(--md-sys-color-primary);">"${decryptGame.currentQuote}"</p>`;
            
            if (decryptGame.currentSource) {
                 message += `<p class="mt-4 text-sm">Source: ${decryptGame.currentSource}</p>`;
            }

            gameStatus.textContent = "Congratulations! You solved it!";
            showWinModal(title, message);

            document.querySelectorAll('.cryptogram-cell[data-cipher]').forEach(cell => cell.classList.add('correct'));
            return true;
        }
        return false;
    },

    giveSourceHint: function() {
        if (decryptGame.currentSource) {
            gameStatus.textContent = `Source: ${decryptGame.currentSource}`;
        } else {
            gameStatus.textContent = "No source information is available.";
        }
    },

    giveHint: function() {
        gameStatus.textContent = '';
        if (decryptGame.useAPI) {
            gameStatus.textContent = 'Hints are disabled for API quotes.';
            return;
        }

        const puzzleInfo = decryptGame.puzzles.find(p => p.quote.toUpperCase() === decryptGame.currentQuote); //

        if (puzzleInfo && puzzleInfo.notes && gameStatus.textContent.indexOf(puzzleInfo.notes) === -1) { //
            gameStatus.textContent = `Hint: ${puzzleInfo.notes}`; //
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
            gameStatus.textContent = "No more hints available!";
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
