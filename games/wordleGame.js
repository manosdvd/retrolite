const wordleGame = {
    // Controller to manage event listeners
    controller: null,
    availableWords: [],

    // Creates a single cell for the Wordle grid
    createCell: (index) => {
        const cell = document.createElement('div');
        cell.className = 'light wordle-cell';
        // The cell has a front and back for the flipping animation
        cell.innerHTML = `<div class="wordle-cell-inner"><div class="wordle-cell-front"></div><div class="wordle-cell-back"></div></div>`;
        return cell;
    },

    // Sets up a new game
    setup: () => {
        // Abort any previous game listeners to prevent duplicates
        if (wordleGame.controller) wordleGame.controller.abort();
        wordleGame.controller = new AbortController();
        const { signal } = wordleGame.controller;

        // If the list of available words is empty, refill and shuffle it
        if (wordleGame.availableWords.length === 0) {
            wordleGame.availableWords = utils.shuffleArray([...expandedWordList]);
        }

        const { gridRows, gridCols } = currentMode;
        // Initialize the game state
        gameState = {
            // Pop a word from the shuffled list
            secretWord: wordleGame.availableWords.pop(),
            currentRow: 0,
            currentCol: 0,
            board: Array(gridRows).fill().map(() => Array(gridCols).fill('')),
            gameOver: false,
            keyColors: {} // Stores the color status of each keyboard key
        };

        gameBoard.classList.add('wordle-grid');
        
        // Define the on-screen keyboard layout
        const keyLayout = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
        ];
        
        keyboard = new Keyboard(keyLayout, (key) => wordleGame.handler({ key: key }));

        // --- ADD THESE TWO LINES ---
        const submitButton = createControlButton('Submit', 'btn-green', wordleGame.submitGuess, 'check');
        buttonContainer.prepend(submitButton);
        // --- END OF ADDITION ---

        // Listen for physical keyboard presses
        window.addEventListener('keydown', wordleGame.handler, { signal });
        setTimeout(wordleGame.scrollActiveRowIntoView, 100);
    },

    cleanup: () => {
        if (wordleGame.controller) {
            wordleGame.controller.abort();
        }
    },

    handler: (e) => {
    // This check ensures we only process keyboard events and ignore mouse clicks.
    if (!e.key) return; 

    if (gameState.gameOver) return;
    const { key } = e;

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

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
        if (gameState.currentCol < currentMode.gridCols) {
            gameStatus.textContent = "Not enough letters";
            setTimeout(() => gameStatus.textContent = '', 2000);
            return;
        }
        const guess = gameState.board[gameState.currentRow].join('');
        
        if (!expandedWordList.includes(guess)) {
            gameStatus.textContent = "Not in word list";
            const rowCells = Array.from(gameBoard.children).slice(gameState.currentRow * 5, gameState.currentRow * 5 + 5);
            rowCells.forEach(cell => cell.classList.add('shake'));
            setTimeout(() => {
                rowCells.forEach(cell => cell.classList.remove('shake'));
                gameStatus.textContent = '';
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
                if(gameState.keyColors[guess[i]] !== 'wordle-correct') {
                    gameState.keyColors[guess[i]] = 'wordle-present';
                }
            }
        }
        for(let i=0; i<5; i++) {
            if(feedback[i] === '') {
                feedback[i] = 'absent';
                if(!gameState.keyColors[guess[i]]) {
                    gameState.keyColors[guess[i]] = 'wordle-absent';
                }
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
            showWinModal('You Win!', `You guessed it in ${gameState.currentRow + 1} tries!`);
        } else if (gameState.currentRow === 5) {
            gameState.gameOver = true;
            showWinModal('Game Over', `The word was: ${secret.toUpperCase()}`);
        } else {
            gameState.currentRow++;
            gameState.currentCol = 0;
            wordleGame.scrollActiveRowIntoView();
        }
    },
    
    updateKeyboard: () => {
        for (const key in gameState.keyColors) {
            if (gameState.keyColors.hasOwnProperty(key)) {
                keyboard.updateKey(key, gameState.keyColors[key]);
            }
        }
    },

    scrollActiveRowIntoView: () => {
        if (!currentMode || currentMode.name !== 'wordle' || !gameBoard.children.length) return;
        const activeCell = gameBoard.children[gameState.currentRow * 5];
        if (activeCell) {
            activeCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
};