export const sliderPuzzleGame = {
    setup: () => {
        gameState = { board: [1, 2, 3, 4, 5, 6, 7, 8, EMPTY], emptyIndex: 8, moves: 0 };
        sliderPuzzleGame.shuffle();
        const shuffleButton = createControlButton('Shuffle', 'btn-yellow', () => {
            sliderPuzzleGame.shuffle();
            gameState.moves = 0;
            updateStats(`Moves: 0`);
        }, 'shuffle');
        buttonContainer.prepend(shuffleButton);
        updateStats(`Moves: 0`);
    },
    shuffle: () => {
        for (let i = 0; i < 300; i++) {
            const neighbors = utils.getSliderNeighbors(gameState.emptyIndex, 3);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            sliderPuzzleGame.swapTiles(randomNeighbor, gameState.emptyIndex, true);
        }
        sliderPuzzleGame.updateBoard();
    },
    handler: (e) => {
        const index = parseInt(e.target.dataset.index);
        const neighbors = utils.getSliderNeighbors(gameState.emptyIndex, 3);
        if (neighbors.includes(index)) {
            audioManager.playSound('game', notes[index % 9]);
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            sliderPuzzleGame.swapTiles(index, gameState.emptyIndex);
            gameState.moves++;
            sliderPuzzleGame.updateBoard();
            updateStats(`Moves: ${gameState.moves}`);
            sliderPuzzleGame.checkWin();
        }
    },
    swapTiles: (index1, index2, isShuffling = false) => {
        [gameState.board[index1], gameState.board[index2]] = [gameState.board[index2], gameState.board[index1]];
        gameState.emptyIndex = (gameState.emptyIndex === index1) ? index2 : index1;
    },
    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            const value = gameState.board[i];
            light.textContent = value === EMPTY ? '' : value;
            light.classList.toggle('is-empty', value === EMPTY);
            light.classList.toggle('is-on', value !== EMPTY);
        });
    },
    checkWin: () => {
        const winState = [1, 2, 3, 4, 5, 6, 7, 8, EMPTY];
        if (gameState.board.every((val, i) => val === winState[i])) {
            showWinModal('You Win!', `Solved in ${gameState.moves} moves!`);
        }
    },
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
};