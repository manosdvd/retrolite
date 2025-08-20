export const lightsOutGame = {
    setup: () => {
        Object.assign(gameState, { board: Array(25).fill(0), moves: 0 });
        // Ensure a solvable board by starting from a solved state and pressing buttons
        for (let i = 0; i < 15; i++) {
            const randomIndex = Math.floor(Math.random() * 25);
            lightsOutGame.toggle(randomIndex, 5, gameState.board);
        }
        
        const solveButton = createControlButton('Solve', 'btn-yellow', lightsOutGame.solve, 'emoji_objects');
        buttonContainer.prepend(solveButton);
        
        lightsOutGame.updateBoard();
        updateStats(`Moves: 0`);
    },
    handler: (e) => {
        if (gameState.isSolving) return;
        const index = parseInt(e.target.dataset.index);
        audioManager.playSound('game', notes[index % 9]);
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        lightsOutGame.toggle(index, 5, gameState.board);
        gameState.moves++;
        lightsOutGame.updateBoard();
        updateStats(`Moves: ${gameState.moves}`);
        if (gameState.board.every(light => light === 0)) {
            showWinModal('You Win!', `You solved it in ${gameState.moves} moves.`);
        }
    },
    toggle: (index, size, board) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const positions = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
        positions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const i = newRow * size + newCol;
                board[i] = 1 - board[i];
            }
        });
    },
    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            light.classList.toggle('is-on', gameState.board[i] === 1);
            light.classList.toggle('is-off', gameState.board[i] === 0);
        });
    },
    solve: async () => {
        // This is a complex algorithm (Gaussian elimination) and remains unchanged.
        if (gameState.isSolving) return;
        gameState.isSolving = true;
        document.querySelector('.btn-yellow').disabled = true;
        let matrix = [];
        for (let i = 0; i < 25; i++) {
            let row = Array(26).fill(0);
            row[i] = 1;
            let r = Math.floor(i / 5), c = i % 5;
            if (r > 0) row[i - 5] = 1; if (r < 4) row[i + 5] = 1;
            if (c > 0) row[i - 1] = 1; if (c < 4) row[i + 1] = 1;
            row[25] = gameState.board[i];
            matrix.push(row);
        }
        for (let i = 0; i < 25; i++) {
            let pivot = i;
            while (pivot < 25 && matrix[pivot][i] === 0) pivot++;
            if (pivot < 25) {
                [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];
                for (let j = i + 1; j < 25; j++) {
                    if (matrix[j][i] === 1) {
                        for (let k = i; k <= 25; k++) matrix[j][k] = (matrix[j][k] + matrix[i][k]) % 2;
                    }
                }
            }
        }
        let solution = Array(25).fill(0);
        for (let i = 24; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < 25; j++) sum = (sum + matrix[i][j] * solution[j]) % 2;
            solution[i] = (matrix[i][25] + sum) % 2;
        }
        const presses = solution.map((p, i) => p === 1 ? i : -1).filter(i => i !== -1);
        for (const pressIndex of presses) {
            const light = gameBoard.querySelector(`[data-index='${pressIndex}']`);
            light.classList.add('is-highlight');
            await delay(200);
            lightsOutGame.toggle(pressIndex, 5, gameState.board);
            lightsOutGame.updateBoard();
            audioManager.playSound('positive', notes[pressIndex % 9], '16n');
            await delay(200);
            light.classList.remove('is-highlight');
        }
        gameState.isSolving = false;
        document.querySelector('.btn-yellow').disabled = false;
        gameStatus.textContent = "Solved!";
    },
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
};