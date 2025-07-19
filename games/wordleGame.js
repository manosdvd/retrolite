<<<<<<< HEAD
<<<<<<< HEAD
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
=======
export const wordleGame = {
=======
const wordleGame = {
>>>>>>> d91859e (Added some games)
    setup: () => {
        const { gridRows, gridCols } = currentMode;
        gameState = {
            secretWord: wordList[Math.floor(Math.random() * wordList.length)],
>>>>>>> ec8738a (Optimization change)
            currentRow: 0,
            currentCol: 0,
            board: Array(gridRows).fill().map(() => Array(gridCols).fill('')),
            gameOver: false,
<<<<<<< HEAD
            keyColors: {} // Stores the color status of each keyboard key
        };

        gameBoard.classList.add('wordle-grid');
        
        // Define the on-screen keyboard layout
        const keyLayout = [
=======
            keyColors: {}
        };

        gameBoard.classList.add('wordle-grid');
        for(let i=0; i < gridRows * gridCols; i++) {
            const cell = document.createElement('div');
            cell.className = 'light wordle-cell';
            cell.innerHTML = `<div class="wordle-cell-inner"><div class="wordle-cell-front"></div><div class="wordle-cell-back"></div></div>`;
            gameBoard.appendChild(cell);
        }
        wordleGame.createKeyboard();
        window.addEventListener('keydown', wordleGame.handler);
        setTimeout(wordleGame.scrollActiveRowIntoView, 100);
    },
    createKeyboard: () => {
        const keys = [
>>>>>>> ec8738a (Optimization change)
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
        ];
<<<<<<< HEAD
        
        keyboard = new Keyboard(keyLayout, (key) => wordleGame.handler({ key: key }));

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

=======
        keys.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                keyDiv.textContent = key;
                keyDiv.dataset.key = key;
                if (key === 'Enter' || key === 'Backspace') {
                    keyDiv.classList.add('key-large');
                }
                keyDiv.addEventListener('click', () => wordleGame.handler({key}));
                rowDiv.appendChild(keyDiv);
            });
            keyboardContainer.appendChild(rowDiv);
        });
    },
    handler: (e) => {
        if (gameState.gameOver) return;
        const { key } = e;
>>>>>>> ec8738a (Optimization change)
        if (key === 'Enter') {
            wordleGame.submitGuess();
        } else if (key === 'Backspace' || key === 'del') {
            wordleGame.deleteLetter();
        } else if (key.match(/^[a-z]$/i) && gameState.currentCol < currentMode.gridCols) {
            wordleGame.typeLetter(key.toLowerCase());
        }
    },
<<<<<<< HEAD

=======
>>>>>>> ec8738a (Optimization change)
    typeLetter: (letter) => {
        if (gameState.currentCol >= currentMode.gridCols) return;
        gameState.board[gameState.currentRow][gameState.currentCol] = letter;
        const cellIndex = gameState.currentRow * currentMode.gridCols + gameState.currentCol;
        const cell = gameBoard.children[cellIndex].querySelector('.wordle-cell-front');
        cell.textContent = letter;
        gameState.currentCol++;
    },
<<<<<<< HEAD

=======
>>>>>>> ec8738a (Optimization change)
    deleteLetter: () => {
        if (gameState.currentCol > 0) {
            gameState.currentCol--;
            gameState.board[gameState.currentRow][gameState.currentCol] = '';
            const cellIndex = gameState.currentRow * currentMode.gridCols + gameState.currentCol;
            const cell = gameBoard.children[cellIndex].querySelector('.wordle-cell-front');
            cell.textContent = '';
        }
    },
<<<<<<< HEAD

    submitGuess: async () => {
        if (gameState.currentCol < currentMode.gridCols) {
=======
    submitGuess: async () => {
        if (gameState.gameOver || gameState.currentCol < currentMode.gridCols) {
>>>>>>> ec8738a (Optimization change)
            gameStatus.textContent = "Not enough letters";
            setTimeout(() => gameStatus.textContent = '', 2000);
            return;
        }
        const guess = gameState.board[gameState.currentRow].join('');
<<<<<<< HEAD
        
        if (!expandedWordList.includes(guess)) {
=======
        if (!wordList.includes(guess)) {
>>>>>>> ec8738a (Optimization change)
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
<<<<<<< HEAD

=======
>>>>>>> ec8738a (Optimization change)
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
<<<<<<< HEAD
                if(gameState.keyColors[guess[i]] !== 'wordle-correct') {
                    gameState.keyColors[guess[i]] = 'wordle-present';
                }
=======
                if(gameState.keyColors[guess[i]] !== 'wordle-correct') gameState.keyColors[guess[i]] = 'wordle-present';
>>>>>>> ec8738a (Optimization change)
            }
        }
        for(let i=0; i<5; i++) {
            if(feedback[i] === '') {
                feedback[i] = 'absent';
<<<<<<< HEAD
                if(!gameState.keyColors[guess[i]]) {
                    gameState.keyColors[guess[i]] = 'wordle-absent';
                }
=======
                if(!gameState.keyColors[guess[i]]) gameState.keyColors[guess[i]] = 'wordle-absent';
>>>>>>> ec8738a (Optimization change)
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
<<<<<<< HEAD
    
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
=======
    updateKeyboard: () => {
        document.querySelectorAll('.key').forEach(keyEl => {
            const key = keyEl.dataset.key;
            if (gameState.keyColors[key]) {
                keyEl.classList.remove('wordle-correct', 'wordle-present', 'wordle-absent');
                keyEl.classList.add(gameState.keyColors[key]);
            }
        });
    },
    scrollActiveRowIntoView: () => {
        if (!currentMode || currentMode.name !== 'wordle' || !gameBoard.children.length) return;
        const activeCell = gameBoard.children[gameState.currentRow * 5];
        if (activeCell) activeCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
>>>>>>> ec8738a (Optimization change)
    }
};