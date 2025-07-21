const decryptGame = {
    canvas: null,
    ctx: null,
    messageBox: null,
    hintButton: null,
    newGameButton: null,
    puzzleTitleEl: null, // This can remain, but will not be used to display puzzle-specific titles
    gameContainerEl: null,

    currentQuote: '',
    cipherMap: {},
    encryptedQuote: '',
    userMappings: {},
    revealedKeys: new Set(),
    activeCipherChar: null,
    isSolved: false,

    puzzleLayout: [],
    keyboardLayout: {},
    puzzleHeight: 0,
    lineSpacing: 0,
    puzzles: decryptQuotes,
    puzzleDeck: [],

    boundHandleCanvasClick: null,

    setupCanvas: function() {
        decryptGame.canvas.width = decryptGame.gameContainerEl.offsetWidth;
        decryptGame.canvas.height = 400;
    },

    resizeCanvas: function() {
        decryptGame.setupCanvas();
        decryptGame.calculateLayouts();
        decryptGame.drawGame();
    },

    newGame: function() {
        if (decryptGame.puzzleDeck.length === 0) {
            decryptGame.puzzleDeck = [...decryptQuotes]; // Use decryptQuotes directly
            // Shuffle the puzzles for random order
            for (let i = decryptGame.puzzleDeck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [decryptGame.puzzleDeck[i], decryptGame.puzzleDeck[j]] = [decryptGame.puzzleDeck[j], decryptGame.puzzleDeck[i]];
            }
        }
        const puzzle = decryptGame.puzzleDeck.pop();

        decryptGame.currentQuote = puzzle.quote.toUpperCase();
        // Removed: gameTitle.textContent = decryptGame.titleCase(puzzle.title);
        // Removed: gameRules.textContent = puzzle.notes;
        decryptGame.cipherMap = decryptGame.generateCipherMap();
        decryptGame.encryptedQuote = decryptGame.encrypt(decryptGame.currentQuote, decryptGame.cipherMap);
        decryptGame.userMappings = {};
        decryptGame.revealedKeys.clear();
        decryptGame.activeCipherChar = null;
        decryptGame.isSolved = false;
        decryptGame.displayMessage('New puzzle loaded.');
        decryptGame.calculateLayouts();
        decryptGame.drawGame();
    },

    titleCase: function(str) {
        return str.toLowerCase().split(' ').map(function(word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    },

    calculateLayouts: function() {
        decryptGame.calculatePuzzleLayout();
        decryptGame.calculateKeyboardLayout(decryptGame.puzzleHeight, decryptGame.lineSpacing);
    },

    calculatePuzzleLayout: function() {
        const maxWidth = decryptGame.canvas.width - 40;
        decryptGame.ctx.font = '24px monospace';
        const words = decryptGame.encryptedQuote.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine === '' ? '' : ' ') + word;
            const metrics = decryptGame.ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine.trim());

        decryptGame.puzzleLayout = [];
        decryptGame.lineSpacing = 35;
        let y = 60;
        lines.forEach(line => {
            const lineWidth = decryptGame.ctx.measureText(line).width;
            const x = (decryptGame.canvas.width - lineWidth) / 2;
            decryptGame.puzzleLayout.push({ text: line, x, y });
            y += decryptGame.lineSpacing * 2;
        });
        decryptGame.puzzleHeight = y;
    },

    calculateKeyboardLayout: function(pHeight, lSpacing) {
        const keyboardStartY = pHeight + lSpacing * 2;
        const keyOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const keysPerRow = 10;
        const keyDiameter = Math.min(35, (decryptGame.canvas.width - 60) / keysPerRow - 5);
        const keyPadding = 5;
        const rowWidth = (keyDiameter + keyPadding) * keysPerRow - keyPadding;

        const startX = (decryptGame.canvas.width - rowWidth) / 2;

        decryptGame.keyboardLayout = {};
        for (let i = 0; i < keyOrder.length; i++) {
            const char = keyOrder[i];
            const row = Math.floor(i / keysPerRow);
            const col = i % keysPerRow;
            const x = startX + col * (keyDiameter + keyPadding);
            const y = keyboardStartY + row * (keyDiameter + keyPadding);
            decryptGame.keyboardLayout[char] = { x, y, size: keyDiameter };
        }
    },

    drawGame: function() {
        decryptGame.drawBackground();
        decryptGame.drawPuzzle();
        decryptGame.drawKeyboard();
    },

    drawBackground: function() {
        decryptGame.ctx.fillStyle = '#2a2a2a';
        decryptGame.ctx.fillRect(0, 0, decryptGame.canvas.width, decryptGame.canvas.height);
    },

    drawPuzzle: function() {
        decryptGame.ctx.font = '24px monospace';
        decryptGame.puzzleLayout.forEach(line => {
            let currentX = line.x;
            for (const char of line.text) {
                const userGuess = decryptGame.userMappings[char] || '';
                const charWidth = decryptGame.ctx.measureText(char).width;

                decryptGame.ctx.fillStyle = decryptGame.activeCipherChar === char ? '#f9a825' : '#e0e0e0';
                decryptGame.ctx.fillText(char, currentX, line.y);

                decryptGame.ctx.fillStyle = '#4caf50';
                decryptGame.ctx.fillText(userGuess, currentX, line.y + decryptGame.lineSpacing * 0.7);

                decryptGame.ctx.strokeStyle = '#606060';
                decryptGame.ctx.beginPath();
                decryptGame.ctx.moveTo(currentX, line.y + decryptGame.lineSpacing);
                decryptGame.ctx.lineTo(currentX + charWidth, line.y + decryptGame.lineSpacing);
                decryptGame.ctx.stroke();

                currentX += charWidth;
            }
        });
    },

    drawKeyboard: function() {
        decryptGame.ctx.font = '18px monospace';
        for (const char in decryptGame.keyboardLayout) {
            const key = decryptGame.keyboardLayout[char];
            const centerX = key.x + key.size / 2;
            const centerY = key.y + key.size / 2;
            const radius = key.size / 2;

            decryptGame.ctx.beginPath();
            decryptGame.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
            decryptGame.ctx.fillStyle = '#4b5563';
            decryptGame.ctx.fill();
            decryptGame.ctx.strokeStyle = '#0f0c29';
            decryptGame.ctx.lineWidth = 2;
            decryptGame.ctx.stroke();

            decryptGame.ctx.fillStyle = '#ffffff';
            decryptGame.ctx.textAlign = 'center';
            decryptGame.ctx.textBaseline = 'middle';
            decryptGame.ctx.fillText(char, centerX, centerY);
        }
    },

    handleCanvasClick: function(event) {
        const rect = decryptGame.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        let clickedOnPuzzle = false;
        decryptGame.puzzleLayout.forEach(line => {
            let currentX = line.x;
            for (const char of line.text) {
                const charWidth = decryptGame.ctx.measureText(char).width;
                if (x >= currentX && x <= currentX + charWidth && y >= line.y - 20 && y <= line.y + decryptGame.lineSpacing + 10) {
                    decryptGame.activeCipherChar = char;
                    clickedOnPuzzle = true;
                    decryptGame.drawGame();
                    return;
                }
                currentX += charWidth;
            }
        });

        if (!clickedOnPuzzle) {
            for (const char in decryptGame.keyboardLayout) {
                const key = decryptGame.keyboardLayout[char];
                const distance = Math.sqrt(Math.pow(x - (key.x + key.size / 2), 2) + Math.pow(y - (key.y + key.size / 2), 2));
                if (distance <= key.size / 2) {
                    if (decryptGame.activeCipherChar) {
                        decryptGame.userMappings[decryptGame.activeCipherChar] = char;
                        decryptGame.checkSolution();
                        decryptGame.drawGame();
                    }
                    return;
                }
            }
        }
    },

    celebrate: function() {
        decryptGame.displayMessage('Congratulations! You cracked the code!', 'success');
    },

    generateCipherMap: function() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
        const map = {};
        alphabet.forEach((char, i) => {
            map[char] = shuffled[i];
        });

        let hasSelfMap = true;
        let attempts = 0;
        while(hasSelfMap && attempts < 100) {
            hasSelfMap = false;
            for (const char of alphabet) {
                if (map[char] === char) {
                    hasSelfMap = true;
                    const newShuffled = [...alphabet].sort(() => Math.random() - 0.5);
                    alphabet.forEach((c, i) => {
                        map[c] = newShuffled[i];
                    });
                    break;
                }
            }
            attempts++;
        }
        
        return map;
    },

    encrypt: function(text, map) {
        return text.split('').map(char => map[char] || char).join('');
    },

    checkSolution: function() {
        const decrypted = decryptGame.encryptedQuote.split('').map(char => {
            if (!char.match(/[A-Z]/)) {
                return char;
            }
            return decryptGame.userMappings[char] || ' ';
        }).join('');

        if (decrypted.replace(/\s/g, '') === decryptGame.currentQuote.replace(/\s/g, '')) {
            decryptGame.isSolved = true;
            decryptGame.celebrate();
        }
    },

    giveHint: function() {
        const unmappedOriginalChars = [...new Set(decryptGame.currentQuote.replace(/[^A-Z]/g, ''))].filter(originalChar => {
            const encryptedChar = Object.keys(decryptGame.cipherMap).find(key => decryptGame.cipherMap[key] === originalChar);
            return !decryptGame.userMappings[encryptedChar] || decryptGame.userMappings[encryptedChar] !== originalChar;
        });

        if (unmappedOriginalChars.length > 0) {
            const hintOriginalChar = unmappedOriginalChars[Math.floor(Math.random() * unmappedOriginalChars.length)];
            const encryptedHintChar = Object.keys(decryptGame.cipherMap).find(key => decryptGame.cipherMap[key] === hintOriginalChar);
            
            decryptGame.userMappings[encryptedHintChar] = hintOriginalChar;
            decryptGame.revealedKeys.add(encryptedHintChar);
            decryptGame.drawGame();
            decryptGame.checkSolution();
        } else {
            decryptGame.displayMessage('No more hints available!', 'info');
        }
    },

    setup: function() {
        gameBoard.innerHTML = '';

        // Clear global game title and rules specifically for Decrypt game
        gameTitle.textContent = ''; // Clear the main game title
        gameRules.textContent = ''; // Clear game rules/notes

        decryptGame.canvas = document.createElement('canvas');
        decryptGame.canvas.id = 'decrypt-canvas';
        gameBoard.appendChild(decryptGame.canvas);
        decryptGame.ctx = decryptGame.canvas.getContext('2d');

        decryptGame.puzzleTitleEl = gameTitle;
        decryptGame.gameContainerEl = document.getElementById('game-container');

        decryptGame.setupCanvas();

        decryptGame.boundHandleCanvasClick = decryptGame.handleCanvasClick.bind(decryptGame);

        decryptGame.canvas.addEventListener('click', decryptGame.boundHandleCanvasClick);
        decryptGame.canvas.addEventListener('touchstart', decryptGame.boundHandleCanvasClick, {passive: false});

        // Updated button texts
        decryptGame.hintButton = createControlButton('Hint', 'btn-blue', decryptGame.giveHint.bind(decryptGame));
        decryptGame.newGameButton = createControlButton('New', 'btn-green', decryptGame.newGame.bind(decryptGame));
        buttonContainer.appendChild(decryptGame.hintButton);
        buttonContainer.appendChild(decryptGame.newGameButton);
        
        decryptGame.newGame();
        decryptGame.resizeCanvas();
    },

    cleanup: function() {
        if (decryptGame.canvas && decryptGame.boundHandleCanvasClick) {
            decryptGame.canvas.removeEventListener('click', decryptGame.boundHandleCanvasClick);
            decryptGame.canvas.removeEventListener('touchstart', decryptGame.boundHandleCanvasClick);
        }
        decryptGame.canvas = null;
        decryptGame.ctx = null;
    },

    displayMessage: function(m, t = 'info') {
        gameStatus.textContent = m;
        gameStatus.className = 'text-center text-lg h-7 mb-2';
        if (t === 'success') {
            gameStatus.classList.add('text-green-400');
        } else if (t === 'error') {
            gameStatus.classList.add('text-red-400');
        } else {
            gameStatus.classList.add('text-yellow-300');
        }
    }
};