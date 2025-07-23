const decryptGame = {
    // --- PROPERTIES ---
    puzzleContainer: null,
    keyboardContainer: null,
    
    // Game State
    puzzles: decryptQuotes,
    currentQuote: '',
    cipherMap: {},
    encryptedQuote: '',
    userMappings: {},
    activeCipherChar: null,
    isSolved: false,
    
    // The AbortController is a modern way to reliably manage event listeners.
    controller: null,

    // --- METHODS ---
    setup: function() {
        // abort any leftover listeners from a previous game
        if (this.controller) this.controller.abort();

        // 1. Create a new AbortController for this game instance.
        // This controller will manage all of this round's event listeners.
        this.controller = new AbortController();
        const { signal } = this.controller;

        // 2. Prepare the DOM
        gameBoard.innerHTML = '';
        keyboardContainer.innerHTML = '';
        gameTitle.textContent = 'CIPHER';
        gameRules.textContent = 'Decode the quote. Click a cell to select a letter.';
        document.getElementById('game-container').classList.add('cryptogram-active');

        this.puzzleContainer = document.createElement('div');
        this.puzzleContainer.id = 'cryptogram-puzzle';
        this.puzzleContainer.className = 'cryptogram-puzzle-container';
        gameBoard.appendChild(this.puzzleContainer);

        this.keyboardContainer = document.getElementById('keyboard-container');
        
        const keyLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
        ];

        keyboard = new Keyboard(keyLayout, (key) => {
            if (key === 'Backspace') {
                this.setUserMapping(this.activeCipherChar, '');
            } else if (key.match(/^[a-zA-Z]$/)) {
                this.setUserMapping(this.activeCipherChar, key.toUpperCase());
            }
        });
        
        buttonContainer.appendChild(createControlButton('Hint', 'btn-blue', this.giveHint.bind(this)));
        buttonContainer.appendChild(createControlButton('Source', 'btn-pink', this.giveSourceHint.bind(this)));
        buttonContainer.appendChild(createControlButton('New Puzzle', 'btn-green', () => {
            this.cleanup();
            startGame(gameModes.decryptGame);
        }));

        // 3. Add all event listeners using the controller's signal.
        // When the controller aborts, these are all removed automatically.
        this.puzzleContainer.addEventListener('click', this.handleInputClick.bind(this), { signal });
        window.addEventListener('keydown', this.handlePhysicalKeyboard.bind(this), { signal });

        // 4. Start the first puzzle
        this.newGame();
    },

    cleanup: function() {
        // --- THE DEFINITIVE FIX ---
        // This single line tells the controller to remove all event listeners
        // that were created with its signal. It's a foolproof way to prevent
        // listeners from carrying over between rounds.
        if (this.controller) {
            this.controller.abort();
        }
    },

    newGame: function() {
        // Resets the state for a new puzzle
        this.currentQuote = this.puzzles[Math.floor(Math.random() * this.puzzles.length)].quote.toUpperCase();
        this.cipherMap = this.generateCipherMap();
        this.encryptedQuote = this.encrypt(this.currentQuote, this.cipherMap);
        this.userMappings = {};
        this.activeCipherChar = null;
        this.isSolved = false;

        this.renderPuzzle();
        
        // Use a timeout to ensure the DOM is ready for hints
        setTimeout(() => {
            this.applyInitialHints();
            this.updatePuzzleDisplay();
            this.updateKeyboard();
            this.selectFirstOpenCell();
        }, 10);
    },
    
    applyInitialHints: function() {
        const allCipherChars = [...new Set(this.encryptedQuote.match(/[A-Z]/g) || [])];
        const invertedCipherMap = Object.fromEntries(Object.entries(this.cipherMap).map(([plain, cipher]) => [cipher, plain]));

        for (let i = 0; i < 3; i++) {
            const unmappedChars = allCipherChars.filter(char => !this.userMappings[char]);
            if (unmappedChars.length === 0) break;
            
            const cipherToReveal = unmappedChars[Math.floor(Math.random() * unmappedChars.length)];
            if (invertedCipherMap[cipherToReveal]) {
                this.userMappings[cipherToReveal] = invertedCipherMap[cipherToReveal];
            }
        }
    },

    setUserMapping: function(cipherChar, plainChar) {
        if (!cipherChar || this.isSolved) return;

        if (plainChar) {
            for (const key in this.userMappings) {
                if (this.userMappings[key] === plainChar) {
                    this.userMappings[key] = '';
                }
            }
        }
        this.userMappings[cipherChar] = plainChar;
        
        this.updatePuzzleDisplay();
        this.updateKeyboard();

        if (this.checkSolution()) return;
        
        if (plainChar) {
            this.selectNextOpenCell();
        }
    },

    selectFirstOpenCell: function() {
        const allCells = this.puzzleContainer.querySelectorAll('.cryptogram-cell[data-cipher]');
        for (const cell of allCells) {
            if (!this.userMappings[cell.dataset.cipher]) {
                this.setActiveCipherChar(cell.dataset.cipher);
                return;
            }
        }
    },

    selectNextOpenCell: function() {
        const allCells = Array.from(this.puzzleContainer.querySelectorAll('.cryptogram-cell[data-cipher]'));
        const currentIndex = allCells.findIndex(cell => cell.dataset.cipher === this.activeCipherChar);
        
        if (currentIndex === -1) {
            this.selectFirstOpenCell();
            return;
        }

        for (let i = 1; i <= allCells.length; i++) {
            const nextIndex = (currentIndex + i) % allCells.length;
            const nextCell = allCells[nextIndex];
            if (!this.userMappings[nextCell.dataset.cipher]) {
                this.setActiveCipherChar(nextCell.dataset.cipher);
                return;
            }
        }
        this.setActiveCipherChar(null);
    },

    handleInputClick: function(e) {
        const cell = e.target.closest('.cryptogram-cell[data-cipher]');
        if (cell) this.setActiveCipherChar(cell.dataset.cipher);
    },

    setActiveCipherChar: function(cipherChar) {
        this.activeCipherChar = cipherChar;
        document.querySelectorAll('.cryptogram-cell').forEach(cell => {
            cell.classList.toggle('active', cell.dataset.cipher === cipherChar);
        });
    },

    handlePhysicalKeyboard: function(e) {
        if (!this.activeCipherChar || this.isSolved) return;
        if (e.key.match(/^[a-zA-Z]$/)) {
            e.preventDefault();
            this.setUserMapping(this.activeCipherChar, e.key.toUpperCase());
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            this.setUserMapping(this.activeCipherChar, '');
        }
    },
    
    renderPuzzle: function() {
        this.puzzleContainer.innerHTML = '';
        const words = this.encryptedQuote.split(' ');
        words.forEach(word => {
            const wordContainer = document.createElement('div');
            wordContainer.className = 'cryptogram-word';
            word.split('').forEach(char => {
                wordContainer.appendChild(this.createLetterCell(char));
            });
            this.puzzleContainer.appendChild(wordContainer);
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
            const mappedChar = this.userMappings[cipher] || '';
            el.textContent = mappedChar;
        });
    },

    

    updateKeyboard: function() {
        const mappedPlainChars = Object.values(this.userMappings);
        for (const row of keyboard.keyLayout) {
            for (const key of row) {
                const isUsed = mappedPlainChars.includes(key);
                keyboard.enableKey(key, !isUsed);
                if (isUsed) {
                    keyboard.updateKey(key, 'used');
                }
            }
        }
    },

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

    encrypt: function(text, map) {
        return text.split('').map(char => map[char] || char).join('');
    },

    checkSolution: function() {
        const decryptedQuote = this.encryptedQuote.split('').map(char => {
            return this.userMappings[char] || (char.match(/[A-Z]/) ? ' ' : char);
        }).join('');
    
        if (decryptedQuote === this.currentQuote) {
            this.isSolved = true;
            this.setActiveCipherChar(null);
            const puzzleInfo = this.puzzles.find(p => p.quote.toUpperCase() === this.currentQuote);
            const title = puzzleInfo ? puzzleInfo.title : "You Cracked the Code!";
            let message = `<p class="mb-2">The quote was:</p><p class="text-amber-300">"${this.currentQuote}"</p>`;
            if (puzzleInfo && puzzleInfo.source) message += `<p class="mt-4 text-sm">Source: ${puzzleInfo.source}</p>`;
            
            gameStatus.textContent = "Congratulations! You solved it!";
            showWinModal(title, message);
    
            document.querySelectorAll('.cryptogram-cell[data-cipher]').forEach(cell => cell.classList.add('correct'));
            return true;
        }
        return false;
    },

    giveSourceHint: function() {
        gameRules.textContent = '';
        const puzzleInfo = this.puzzles.find(p => p.quote.toUpperCase() === this.currentQuote);
        if (puzzleInfo && puzzleInfo.source) {
            gameStatus.textContent = `Source: ${puzzleInfo.source}`;
        } else {
            gameStatus.textContent = "No source information is available.";
        }
    },

    giveHint: function() {
        gameRules.textContent = '';
        const puzzleInfo = this.puzzles.find(p => p.quote.toUpperCase() === this.currentQuote);
        
        if (puzzleInfo && puzzleInfo.notes && gameStatus.textContent.indexOf(puzzleInfo.notes) === -1) {
            gameStatus.textContent = `Hint: ${puzzleInfo.notes}`;
            return;
        }
        
        const allCipherChars = [...new Set(this.encryptedQuote.match(/[A-Z]/g) || [])];
        const unmappedChars = allCipherChars.filter(char => !this.userMappings[char]);

        if (unmappedChars.length === 0) {
            gameStatus.textContent = "No more hints available!";
            return;
        }
        
        const invertedCipherMap = Object.fromEntries(Object.entries(this.cipherMap).map(([plain, cipher]) => [cipher, plain]));
        const cipherToReveal = unmappedChars[Math.floor(Math.random() * unmappedChars.length)];
        
        if (invertedCipherMap[cipherToReveal]) {
            this.setUserMapping(cipherToReveal, invertedCipherMap[cipherToReveal]);
        }
    }
};