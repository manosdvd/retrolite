export const minefieldGame = {
    setup: () => {
        const newGameButton = createControlButton('New Game', 'btn-green', () => {
            startGame(currentMode); // Restart the game
        }, 'refresh');
        buttonContainer.prepend(newGameButton);
        minefieldGame.start(8, 8, 10);
    },
    start: (width, height, mines) => {
        if (mines >= width * height) { gameStatus.textContent = "Too many mines!"; return; }
        
        gameState = { firstClick: true, width, height, mines, flagged: 0, gameOver: false };
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        gameBoard.classList.toggle('large-grid', width > 5 || height > 5);

        const fragment = document.createDocumentFragment();
        for(let i = 0; i < width * height; i++) {
            const light = document.createElement('div');
            light.className = 'light is-hidden';
            light.dataset.index = i;
            fragment.appendChild(light);
        }
        gameBoard.appendChild(fragment); // Appends all lights at once

        statsContainer.innerHTML = `Mines: <span id="mine-count">${mines}</span>`;
        gameStatus.textContent = "Click any cell to begin.";
    },
    finishSetup: (firstClickIndex) => {
         const { width, height, mines } = gameState;
        gameState.board = Array(width * height).fill(0);
        gameState.revealed = Array(width * height).fill(false);
        gameState.flagged = Array(width * height).fill(false);
        const safeZone = [firstClickIndex, ...utils.getNeighbors(firstClickIndex, height, width)];
        let minesPlaced = 0;
        while (minesPlaced < mines) {
            const index = Math.floor(Math.random() * width * height);
            if (gameState.board[index] !== 'M' && !safeZone.includes(index)) {
                gameState.board[index] = 'M';
                minesPlaced++;
            }
        }
        for (let i = 0; i < width * height; i++) {
            if (gameState.board[i] !== 'M') {
                gameState.board[i] = utils.getNeighbors(i, height, width).filter(n => gameState.board[n] === 'M').length;
            }
        }
        gameState.firstClick = false;
    },
    handler: (e, eventType) => {
        const index = parseInt(e.target.dataset.index);
        if (gameState.gameOver || !e.target.matches('.light')) return;

        // --- FIX: Check for 'click' or undefined eventType for normal clicks ---
        if (eventType === 'click' || eventType === undefined) {
            if (gameState.firstClick) minefieldGame.finishSetup(index);
            if (gameState.flagged[index]) return;
            if (gameState.board[index] === 'M') {
                gameState.gameOver = true;
                minefieldGame.revealAllMines();
                gameStatus.textContent = "Game Over!";
                showWinModal('BOOM!', 'You hit a mine.');
                return;
            }
            minefieldGame.revealCell(index);
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } else if (eventType === 'contextmenu') {
            if (gameState.revealed[index] && gameState.board[index] > 0) {
                minefieldGame.chord(index);
            } else if (!gameState.revealed[index]) {
                gameState.flagged[index] = !gameState.flagged[index];
            }
        }
        minefieldGame.updateBoard();
        minefieldGame.checkWin();
    },
    chord: (index) => {
        const neighbors = utils.getNeighbors(index, gameState.height, gameState.width);
        const flaggedNeighbors = neighbors.filter(n => gameState.flagged[n]).length;
        if (flaggedNeighbors === gameState.board[index]) {
            neighbors.forEach(n => {
                if (!gameState.flagged[n] && !gameState.revealed[n]) {
                    minefieldGame.revealCell(n);
                }
            });
        }
    },
    revealCell: (index) => {
        const { height, width } = gameState;
        const stack = [index];
        while(stack.length > 0) {
            const current = stack.pop();
            if (current < 0 || current >= height * width || gameState.revealed[current] || gameState.flagged[current]) continue;
            gameState.revealed[current] = true;
            if (gameState.board[current] === 0) {
                stack.push(...utils.getNeighbors(current, height, width));
            }
        }
    },
    revealAllMines: () => {
        gameState.board.forEach((cell, i) => { if (cell === 'M') gameState.revealed[i] = true; });
        minefieldGame.updateBoard();
    },
    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        const flaggedCount = gameState.flagged ? gameState.flagged.filter(Boolean).length : 0;
        document.getElementById('mine-count').textContent = gameState.mines - flaggedCount;
        lights.forEach((light, i) => {
            light.className = 'light'; light.textContent = ''; light.style.color = '';
            if (gameState.flagged[i]) {
                light.classList.add('is-flagged');
            } else if (gameState.revealed[i]) {
                light.classList.add('is-revealed');
                const val = gameState.board[i];
                if (val === 'M') light.classList.add('is-mine');
                else if (val > 0) {
                    light.textContent = val;
                    const colors = ['var(--color-9)', 'var(--color-2)', 'var(--color-3)', 'var(--color-1)', 'var(--color-5)', 'var(--color-8)'];
                    light.style.color = colors[val];
                }
            } else {
                light.classList.add('is-hidden');
            }
        });
    },
    checkWin: () => {
        if (!gameState.board) return; // Guard against checking before setup
        const revealedCount = gameState.revealed ? gameState.revealed.filter(Boolean).length : 0;
        const totalNonMines = gameState.board.length - gameState.mines;
        if (revealedCount === totalNonMines) {
            gameState.gameOver = true;
            showWinModal('You Win!', 'You cleared the minefield!');
        }
    },
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
};
