const decryptGame = {
    // UI Elements
    puzzleContainer: null,
    keyboardContainer: null,
    hintButton: null,
    sourceHintButton: null,
    newGameButton: null,
    scrollIndicator: null,

    // Game State
    currentQuote: '',
    cipherMap: {},
    encryptedQuote: '',
    userMappings: {},
    activeCipherChar: null,
    isSolved: false,
    puzzles: decryptQuotes,
    puzzleDeck: [],
    hintStep: 0,
    sourceRevealed: false,

    // Event handlers
    boundHandleInputClick: null,
    boundHandleKeyboardClick: null,
    boundHandlePhysicalKeyboard: null,
    boundCheckScroll: null,

    setup: function() {
        // Clear board and containers
        gameBoard.innerHTML = '';
        keyboardContainer.innerHTML = '';
        gameTitle.textContent = 'CIPHER';
        gameRules.textContent = 'Decode the quote. Click a cell to select a letter.';

        document.getElementById('game-container').classList.add('cryptogram-active');

        // Create puzzle container
        this.puzzleContainer = document.createElement('div');
        this.puzzleContainer.id = 'cryptogram-puzzle';
        this.puzzleContainer.className = 'cryptogram-puzzle-container';
        gameBoard.appendChild(this.puzzleContainer);

        // Create scroll indicator
        this.scrollIndicator = document.createElement('div');
        this.scrollIndicator.className = 'scroll-indicator';
        gameBoard.appendChild(this.scrollIndicator);

        // Create keyboard
        this.keyboardContainer = document.getElementById('keyboard-container');
        this.createKeyboard();

        // --- FIX: This button now calls the main startGame function ---
        this.hintButton = createControlButton('Hint', 'btn-blue', this.giveHint.bind(this));
        this.sourceHintButton = createControlButton('Source', 'btn-pink', this.giveSourceHint.bind(this));
        this.newGameButton = createControlButton('New Puzzle', 'btn-green', () => startGame(gameModes.decryptGame));
        buttonContainer.appendChild(this.hintButton);
        buttonContainer.appendChild(this.sourceHintButton);
        buttonContainer.appendChild(this.newGameButton);

        // Bind event handlers
        this.boundHandleInputClick = this.handleInputClick.bind(this);
        this.boundHandleKeyboardClick = this.handleKeyboardClick.bind(this);
        this.boundHandlePhysicalKeyboard = this.handlePhysicalKeyboard.bind(this);
        this.boundCheckScroll = this.checkScroll.bind(this);

        // Add event listeners
        this.puzzleContainer.addEventListener('click', this.boundHandleInputClick);
        this.keyboardContainer.addEventListener('click', this.boundHandleKeyboardClick);
        window.addEventListener('keydown', this.boundHandlePhysicalKeyboard);
        gameBoard.addEventListener('scroll', this.boundCheckScroll);
        window.addEventListener('resize', this.boundCheckScroll);

        this.newGame();
    },

    cleanup: function() {
        // This function is called by main.js when switching games.
        // It properly removes window-level listeners.
        window.removeEventListener('keydown', this.boundHandlePhysicalKeyboard);
        window.removeEventListener('resize', this.boundCheckScroll);
    },

    newGame: function() {
        // This function now only sets up the puzzle state, without touching listeners.
        if (this.puzzleDeck.length === 0) {
            this.puzzleDeck = [...this.puzzles].sort(() => 0.5 - Math.random());
        }
        const puzzle = this.puzzleDeck.pop();

        this.currentQuote = puzzle.quote.toUpperCase();
        this.cipherMap = this.generateCipherMap();
        this.encryptedQuote = this.encrypt(this.currentQuote, this.cipherMap);
        this.userMappings = {};
        this.activeCipherChar = null;
        this.isSolved = false;
        this.hintStep = 0;
        this.sourceRevealed = false;

        this.renderPuzzle();

        for (let i = 0; i < 3; i++) {
            this.giveLetterHint();
        }

        this.updateKeyboard();
        gameStatus.textContent = "New puzzle loaded. 3 letters revealed.";

        // Select first open letter
        const firstOpenCell = document.querySelector('.cryptogram-cell[data-cipher]:not(.has-mapping)');
        if (firstOpenCell) {
            this.setActiveCipherChar(firstOpenCell.dataset.cipher);
        }
    },
    
    // --- OPTIMIZATION: More robust cipher generation ---
    generateCipherMap: function() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        let shuffled;
        while (true) {
            shuffled = [...alphabet].sort(() => Math.random() - 0.5);
            let isDerangement = true;
            for (let i = 0; i < alphabet.length; i++) {
                if (alphabet[i] === shuffled[i]) {
                    isDerangement = false;
                    break;
                }
            }
            if (isDerangement) break;
        }
        const map = {};
        alphabet.forEach((char, i) => { map[char] = shuffled[i]; });
        return map;
    },
    
    renderPuzzle: function() {
        this.puzzleContainer.innerHTML = '';
        const words = this.encryptedQuote.split(' ');

        words.forEach(word => {
            const wordContainer = document.createElement('div');
            wordContainer.className = 'cryptogram-word';
            for (const char of word) {
                const letterCell = this.createLetterCell(char);
                wordContainer.appendChild(letterCell);
            }
            this.puzzleContainer.appendChild(wordContainer);
        });
        setTimeout(this.checkScroll.bind(this), 100);
    },

    createLetterCell: function(char) {
        const cell = document.createElement('div');
        cell.className = 'cryptogram-cell';

        if (char.match(/[A-Z]/)) {
            cell.dataset.cipher = char;
            const cipherText = document.createElement('div');
            cipherText.className = 'cipher-char';
            cipherText.textContent = char;
            const plainText = document.createElement('div');
            plainText.className = 'plain-char';
            plainText.dataset.plain = char;
            cell.appendChild(cipherText);
            cell.appendChild(plainText);
        } else {
            cell.textContent = char;
            cell.classList.add('punctuation');
        }
        return cell;
    },

    handleInputClick: function(e) {
        const cell = e.target.closest('.cryptogram-cell');
        if (!cell || !cell.dataset.cipher) return;
        this.setActiveCipherChar(cell.dataset.cipher);
    },

    setActiveCipherChar: function(cipherChar) {
        this.activeCipherChar = cipherChar;
        document.querySelectorAll('.cryptogram-cell').forEach(cell => {
            cell.classList.toggle('active', cell.dataset.cipher === cipherChar);
        });
        this.updateKeyboard();
    },

    handleKeyboardClick: function(e) {
        const key = e.target.closest('.key');
        if (!key || !this.activeCipherChar) return;
        const plainChar = key.dataset.key;
        if (plainChar === 'Backspace') {
            this.setUserMapping(this.activeCipherChar, '');
        } else if (plainChar.match(/^[A-Z]$/)) {
            this.setUserMapping(this.activeCipherChar, plainChar);
        }
    },

    handlePhysicalKeyboard: function(e) {
        if (!this.activeCipherChar) return;
        if (e.key.match(/^[a-zA-Z]$/)) {
            this.setUserMapping(this.activeCipherChar, e.key.toUpperCase());
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            this.setUserMapping(this.activeCipherChar, '');
        }
    },

    setUserMapping: function(cipherChar, plainChar) {
        if (!cipherChar) return;

        for (const key in this.userMappings) {
            if (this.userMappings[key] === plainChar) {
                this.userMappings[key] = '';
            }
        }
        this.userMappings[cipherChar] = plainChar;
        this.updatePuzzleDisplay();
        this.updateKeyboard();
        this.checkSolution();

        // Auto-progress
        if (plainChar !== '') {
            const allLetterCells = Array.from(document.querySelectorAll('.cryptogram-cell[data-cipher]'));
            const currentCellIndex = allLetterCells.findIndex(cell => cell.dataset.cipher === cipherChar);
            if (currentCellIndex !== -1) {
                for (let i = 1; i <= allLetterCells.length; i++) {
                    const nextCell = allLetterCells[(currentCellIndex + i) % allLetterCells.length];
                    const nextCipher = nextCell.dataset.cipher;
                    if (!this.userMappings[nextCipher]) {
                        this.setActiveCipherChar(nextCipher);
                        return;
                    }
                }
            }
            this.setActiveCipherChar(null); // All cells are filled
        }
    },

    updatePuzzleDisplay: function() {
        document.querySelectorAll('.plain-char').forEach(el => {
            const cipher = el.dataset.plain;
            const mappedChar = this.userMappings[cipher] || '';
            el.textContent = mappedChar;
            el.closest('.cryptogram-cell').classList.toggle('has-mapping', !!mappedChar);
        });
    },

    checkScroll: function() {
        const board = document.getElementById('game-board');
        if (!this.scrollIndicator || !board) return;
        const isScrollable = board.scrollHeight > board.clientHeight;
        this.scrollIndicator.style.display = isScrollable ? 'block' : 'none';
    },

    createKeyboard: function() {
        if (!this.keyboardContainer) return;
        this.keyboardContainer.innerHTML = '';
        const keys = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
        ];
        keys.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const keyDiv = document.createElement('button');
                keyDiv.className = 'key';
                let dataKey = key;
                if (key === '⌫') {
                    dataKey = 'Backspace';
                }
                keyDiv.textContent = key;
                keyDiv.dataset.key = dataKey;
                 if (key.length > 1 || key === '⌫') keyDiv.classList.add('key-large');
                rowDiv.appendChild(keyDiv);
            });
            this.keyboardContainer.appendChild(rowDiv);
        });
    },

    updateKeyboard: function() {
        const mappedPlainChars = Object.values(this.userMappings);
        document.querySelectorAll('#keyboard-container .key').forEach(key => {
            const plainChar = key.dataset.key;
            if (mappedPlainChars.includes(plainChar)) {
                key.classList.add('used');
                key.disabled = true;
            } else {
                key.classList.remove('used');
                key.disabled = false;
            }
        });
    },

    encrypt: function(text, map) {
        return text.split('').map(char => map[char] || char).join('');
    },

    checkSolution: function() {
        const decryptedQuote = this.encryptedQuote.split('').map(char => {
            if (this.userMappings[char] === undefined || this.userMappings[char] === '') return ' ';
            return this.userMappings[char];
        }).join('');
    
        if (decryptedQuote === this.currentQuote) {
            this.isSolved = true;
            this.activeCipherChar = null; // Deactivate selection
            const puzzleInfo = this.puzzles.find(p => p.quote.toUpperCase() === this.currentQuote);
            const title = puzzleInfo ? puzzleInfo.title : "You Cracked the Code!";
            let message = `<p class="mb-2">The quote was:</p><p class="text-amber-300">"${this.currentQuote}"</p>`;
            if (puzzleInfo && puzzleInfo.source) {
                message += `<p class="mt-4 text-sm">Source: ${puzzleInfo.source}</p>`;
            }
    
            gameStatus.textContent = "Congratulations! You solved the puzzle!";
            showWinModal(title, message);
    
            document.querySelectorAll('.cryptogram-cell').forEach(cell => {
                cell.classList.remove('active');
                if (cell.dataset.cipher) {
                    cell.classList.add('correct');
                }
            });
        }
    },

    giveSourceHint: function() {
        gameRules.textContent = '';
        if (this.sourceRevealed) return;

        const puzzleInfo = this.puzzles.find(p => p.quote.toUpperCase() === this.currentQuote);
        if (puzzleInfo && puzzleInfo.source) {
            gameStatus.textContent = `Source: ${puzzleInfo.source}`;
            this.sourceRevealed = true;
            this.sourceHintButton.disabled = true;
        } else {
            gameStatus.textContent = "No source information is available for this puzzle.";
        }
    },

    giveLetterHint: function() {
        const allCipherChars = [...new Set(this.encryptedQuote.match(/[A-Z]/g))];
        const unmappedCipherChars = allCipherChars.filter(char => !this.userMappings[char]);
    
        if (unmappedCipherChars.length === 0) {
            gameStatus.textContent = "No more hints available!";
            return;
        }
    
        const cipherCharToReveal = unmappedCipherChars[Math.floor(Math.random() * unmappedCipherChars.length)];
        const invertedCipherMap = Object.fromEntries(
            Object.entries(this.cipherMap).map(([plain, cipher]) => [cipher, plain])
        );
        const correctPlainChar = invertedCipherMap[cipherCharToReveal];
    
        if (correctPlainChar) {
            this.setUserMapping(cipherCharToReveal, correctPlainChar);
        }
    },

    giveHint: function() {
        gameRules.textContent = '';
        if (this.hintStep === 0) {
            const puzzleInfo = this.puzzles.find(p => p.quote.toUpperCase() === this.currentQuote);
            if (puzzleInfo && puzzleInfo.notes) {
                gameStatus.textContent = `Hint: ${puzzleInfo.notes}`;
                this.hintStep = 1;
            } else {
                this.giveLetterHint();
                this.hintStep = 2; // Skip to letter hints if no text hint
            }
        } else {
            this.giveLetterHint();
        }
    }
};