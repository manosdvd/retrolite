const connectGame = {
    setup: () => {
        gameState = { board: Array(42).fill(EMPTY), currentPlayer: HUMAN, gameOver: false, difficulty: 'Hard' };
        const easyBtn = createControlButton('Easy', 'btn-green', () => { gameState.difficulty = 'Easy'; gameStatus.textContent = 'Difficulty: Easy'; });
        const hardBtn = createControlButton('Hard', 'btn-blue', () => { gameState.difficulty = 'Hard'; gameStatus.textContent = 'Difficulty: Hard'; });
        buttonContainer.prepend(hardBtn);
        buttonContainer.prepend(easyBtn);
        connectGame.updateBoard();
        gameStatus.textContent = "Your Turn";
    },
    handler: (e) => {
        if (gameState.gameOver || gameState.currentPlayer === AI) return;
        const index = parseInt(e.target.dataset.index);
        const col = index % 7;
        let landingIndex = -1;
        for (let row = 5; row >= 0; row--) {
            const i = row * 7 + col;
            if (gameState.board[i] === EMPTY) {
                landingIndex = i;
                break;
            }
        }
        if (landingIndex === -1) return;
        connectGame.makeMove(landingIndex, HUMAN);
        if (gameState.gameOver) return;
        gameState.currentPlayer = AI;
        gameStatus.textContent = "AI is thinking...";
        setTimeout(connectGame.aiMove, 500);
    },
    aiMove: () => {
        if (gameState.gameOver) return;
        const bestMoveCol = connectGame.findBestMove(gameState.board);
        if (bestMoveCol === -1) return;
        let landingIndex = -1;
        for (let row = 5; row >= 0; row--) {
            const i = row * 7 + bestMoveCol;
            if (gameState.board[i] === EMPTY) { landingIndex = i; break; }
        }
        connectGame.makeMove(landingIndex, AI);
        if (!gameState.gameOver) {
            gameState.currentPlayer = HUMAN;
            gameStatus.textContent = "Your Turn";
        }
    },
    makeMove: (index, player) => {
        gameState.board[index] = player;
        audioManager.playSound('game', player === HUMAN ? 'C4' : 'G3');
        connectGame.updateBoard();
        const winLine = utils.checkConnectWin(gameState.board, player);
        if (winLine) {
            gameState.gameOver = true;
            gameStatus.textContent = player === HUMAN ? "You Win!" : "AI Wins!";
            winLine.forEach(index => {
                const light = gameBoard.querySelector(`[data-index="${index}"]`);
                if (light) {
                    light.classList.add('is-win-light');
                }
            });
            connectGame.addNewGameButton();
        } else if (utils.isDraw(gameState.board)) {
            gameState.gameOver = true;
            gameStatus.textContent = "It's a Draw!";
            connectGame.addNewGameButton();
        }
    },
    addNewGameButton: () => {
        const newGameButton = createControlButton('New Game', 'btn-green', () => startGame(currentMode), 'refresh');
        buttonContainer.appendChild(newGameButton);
    },
    findBestMove: (board) => {
        // AI logic remains complex and unchanged
        const validCols = getValidColumns(board);
        if (gameState.difficulty === 'Easy') return validCols[Math.floor(Math.random() * validCols.length)];
        let bestScore = -Infinity;
        let bestMove = -1;
        for (const col of validCols) {
            let tempBoard = [...board];
            connectGame.dropPiece(tempBoard, col, AI);
            let score = connectGame.scorePosition(tempBoard, AI);
            if (score > bestScore) { bestScore = score; bestMove = col; }
        }
        return bestMove !== -1 ? bestMove : validCols[0];
    },
    scorePosition: (board, player) => {
        let score = 0;
        const oppPlayer = player === AI ? HUMAN : AI;
        let centerCount = 0;
        for (let r = 0; r < 6; r++) if (board[r * 7 + 3] === player) centerCount++;
        score += centerCount * 3;
        for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) score += connectGame.evaluateWindow([board[r*7+c], board[r*7+c+1], board[r*7+c+2], board[r*7+c+3]], player, oppPlayer);
        for (let c = 0; c < 7; c++) for (let r = 0; r < 3; r++) score += connectGame.evaluateWindow([board[r*7+c], board[(r+1)*7+c], board[(r+2)*7+c], board[(r+3)*7+c]], player, oppPlayer);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) score += connectGame.evaluateWindow([board[r*7+c], board[(r+1)*7+c+1], board[(r+2)*7+c+2], board[(r+3)*7+c+3]], player, oppPlayer);
        for (let r = 3; r < 6; r++) for (let c = 0; c < 4; c++) score += connectGame.evaluateWindow([board[r*7+c], board[(r-1)*7+c+1], board[(r-2)*7+c+2], board[(r-3)*7+c+3]], player, oppPlayer);
        return score;
    },
    evaluateWindow: (window, player, oppPlayer) => {
        let score = 0;
        const playerCount = window.filter(p => p === player).length;
        const emptyCount = window.filter(p => p === EMPTY).length;
        const oppCount = window.filter(p => p === oppPlayer).length;
        if (playerCount === 4) score += 100;
        else if (playerCount === 3 && emptyCount === 1) score += 5;
        else if (playerCount === 2 && emptyCount === 2) score += 2;
        if (oppCount === 3 && emptyCount === 1) score -= 80;
        if (oppCount === 4) score -= 1000;
        return score;
    },
    dropPiece: (board, col, player) => {
        for (let r = 5; r >= 0; r--) if (board[r * 7 + col] === EMPTY) { board[r * 7 + col] = player; return; }
    },
    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            light.className = 'light';
            if (gameState.board[i] === HUMAN) light.classList.add('is-player-1');
            else if (gameState.board[i] === AI) light.classList.add('is-player-2');
            else light.classList.add('is-empty');
        });
    },
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
};

// --- Game Registration ---
// Instead of polluting the global scope, we now explicitly register
// the game with the gameManager.
if (window.gameManager) {
    window.gameManager.registerGame('connectGame', connectGame);
} else {
    // This error will appear if a game script is loaded without main.js,
    // which can be helpful for debugging.
    console.error("Fatal Error: gameManager is not available.");
}