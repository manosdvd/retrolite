const magicSquareGame = {
    setup: () => {
        const merlinToggles = [
            [0, 1, 3], [0, 1, 2, 4], [1, 2, 5], [0, 3, 4, 6], [1, 3, 4, 5, 7],
            [2, 4, 5, 8], [5, 7, 8], [4, 6, 7, 8], [5, 7, 8]
        ];
        gameState = { board: [1, 1, 1, 1, 0, 1, 1, 1, 1], moves: 0, toggles: merlinToggles };
        const scrambleMoves = Math.floor(Math.random() * 5) + 5;
        for (let i = 0; i < scrambleMoves; i++) {
            const randomIndex = Math.floor(Math.random() * 9);
            gameState.toggles[randomIndex].forEach(toggleIndex => {
                gameState.board[toggleIndex] = 1 - gameState.board[toggleIndex];
            });
        }
        magicSquareGame.updateBoard();
        updateStats(`Moves: 0`);
    },
    handler: (e) => {
        const index = parseInt(e.target.dataset.index);
        audioManager.playSound('game', notes[index % 9]);
        gameState.toggles[index].forEach(toggleIndex => {
            gameState.board[toggleIndex] = 1 - gameState.board[toggleIndex];
        });
        gameState.moves++;
        magicSquareGame.updateBoard();
        updateStats(`Moves: ${gameState.moves}`);
        magicSquareGame.checkWin();
    },
    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            light.classList.toggle('is-on', gameState.board[i] === 1);
            light.classList.toggle('is-off', gameState.board[i] === 0);
            light.classList.remove('is-center-inactive');
        });
    },
    checkWin: () => {
        const winState = [1, 1, 1, 1, 0, 1, 1, 1, 1];
        if (gameState.board.every((val, i) => val === winState[i])) {
            showWinModal('You Win!', `You solved Merlin's puzzle in ${gameState.moves} moves!`);
        }
    },
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
};

// --- Game Registration ---
// Instead of polluting the global scope, we now explicitly register
// the game with the gameManager.
if (window.gameManager) {
    window.gameManager.registerGame('magicSquareGame', magicSquareGame);
} else {
    // This error will appear if a game script is loaded without main.js,
    // which can be helpful for debugging.
    console.error("Fatal Error: gameManager is not available.");
}