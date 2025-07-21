const ticTacToeGame = {
    setup: () => {
        gameState = { 
            board: Array(9).fill(EMPTY), 
            currentPlayer: P1, 
            gameOver: false,
            mode: gameState.mode || 'CPU',
            winLines: [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
                [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
            ]
        };
        const modeButton = createControlButton(`Mode: ${gameState.mode}`, 'btn-blue', () => {
            gameState.mode = gameState.mode === 'CPU' ? '2P' : 'CPU';
            startGame(currentMode);
        });
        buttonContainer.prepend(modeButton);
        ticTacToeGame.updateBoard();
        gameStatus.textContent = "Player 1's Turn";
    },
    handler: (e) => {
        if (gameState.gameOver) return;
        if (gameState.mode === 'CPU' && gameState.currentPlayer === AI) return;
        
        const index = parseInt(e.target.dataset.index);
        if (gameState.board[index] !== EMPTY) return;

        ticTacToeGame.makeMove(index, gameState.currentPlayer);
        
        if (!gameState.gameOver && gameState.mode === 'CPU') {
            gameStatus.textContent = "CPU's Turn...";
            setTimeout(ticTacToeGame.aiMove, 500);
        }
    },
    makeMove: (index, player) => {
        gameState.board[index] = player;
        playSound(player === HUMAN ? 'C4' : 'G3');
        ticTacToeGame.updateBoard();
        const winInfo = checkWin(gameState.board, player, gameState.winLines);
        if (winInfo) {
            ticTacToeGame.end(`${player === P1 ? 'Player 1' : 'CPU'} Wins!`, winInfo.line);
        } else if (isDraw(gameState.board)) {
            ticTacToeGame.end("It's a Draw!");
        } else {
            gameState.currentPlayer *= -1;
            gameStatus.textContent = `Player ${gameState.currentPlayer === P1 ? 1 : 2}'s Turn`;
        }
    },
    aiMove: () => {
        if (gameState.gameOver) return;
        const bestMove = ticTacToeGame.findBestMove(gameState.board);
        ticTacToeGame.makeMove(bestMove, AI);
    },
    findBestMove: (board) => {
        let bestVal = -Infinity;
        let move = -1;
        for (let i = 0; i < 9; i++) {
            if (board[i] === EMPTY) {
                board[i] = AI;
                let moveVal = ticTacToeGame.minimax(board, 0, false);
                board[i] = EMPTY;
                if (moveVal > bestVal) {
                    move = i;
                    bestVal = moveVal;
                }
            }
        }
        return move;
    },
    minimax: (board, depth, isMax) => {
        const score = ticTacToeGame.evaluate(board);
        if (score === 10) return score - depth;
        if (score === -10) return score + depth;
        if (isDraw(board)) return 0;

        if (isMax) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === EMPTY) {
                    board[i] = AI;
                    best = Math.max(best, ticTacToeGame.minimax(board, depth + 1, !isMax));
                    board[i] = EMPTY;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === EMPTY) {
                    board[i] = HUMAN;
                    best = Math.min(best, ticTacToeGame.minimax(board, depth + 1, !isMax));
                    board[i] = EMPTY;
                }
            }
            return best;
        }
    },
    evaluate: (board) => {
        for (const line of gameState.winLines) {
            if (line.every(i => board[i] === AI)) return 10;
            if (line.every(i => board[i] === HUMAN)) return -10;
        }
        return 0;
    },
    end: (message, winLine = null) => {
        gameState.gameOver = true;
        gameStatus.textContent = message;
        if (winLine) {
            ticTacToeGame.drawWinLine(winLine);
        }
        showWinModal(message, "A classic battle.");
    },
    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            light.className = 'light';
            if (gameState.board[i] === P1) light.classList.add('is-player-1');
            else if (gameState.board[i] === P2) light.classList.add('is-player-2');
            else light.classList.add('is-empty');
        });
    },
    drawWinLine: (line) => {
        const startCell = gameBoard.children[line[0]];
        const endCell = gameBoard.children[line[2]];
        const boardRect = gameBoard.getBoundingClientRect();
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();

        const lineEl = document.createElement('div');
        lineEl.classList.add('win-line');
        
        const startX = startRect.left + startRect.width / 2 - boardRect.left;
        const startY = startRect.top + startRect.height / 2 - boardRect.top;
        const endX = endRect.left + endRect.width / 2 - boardRect.left;
        const endY = endRect.top + endRect.height / 2 - boardRect.top;

        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

        lineEl.style.width = `${length}px`;
        lineEl.style.top = `${startY}px`;
        lineEl.style.left = `${startX}px`;
        lineEl.style.transform = `rotate(${angle}deg)`;
        
        gameBoard.appendChild(lineEl);
    }
};