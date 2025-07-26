const numberCrunchGame = {
    setup: () => {
        // A new element is added to hold the equation string
        gameStatus.innerHTML = `
            <div class="flex justify-between w-full">
                <span>Target: <span id="target-num" class="text-yellow-300"></span></span>
                <span>Equation: <span id="eq-str" class="text-cyan-400">0</span></span>
            </div>
        `;
        gameState = {
            targetNumber: 0,
            firstOperand: null,
            currentOperator: null,
            moves: 0
        };
        numberCrunchGame.newRound();
        updateStats(`Moves: 0`);
    },

    newRound: () => {
        gameState.targetNumber = Math.floor(Math.random() * 99) + 2; // Target between 2 and 100
        gameState.firstOperand = null;
        gameState.currentOperator = null;
        gameState.moves = 0;

        document.getElementById('target-num').textContent = gameState.targetNumber;
        document.getElementById('eq-str').textContent = '0';

        numberCrunchGame.updateBoard();
        updateStats(`Moves: 0`);
    },

    handler: (e) => {
        if (gameState.gameOver) return;

        const value = e.target.textContent;
        const isNumber = !isNaN(parseInt(value));
        const eqStrEl = document.getElementById('eq-str');

        if (isNumber) {
            const number = parseInt(value);
            // Case 1: This is the very first number selected.
            if (gameState.firstOperand === null) {
                gameState.firstOperand = number;
                eqStrEl.textContent = number;
            }
            // Case 2: We have a first number and an operator, so this is the second number.
            else if (gameState.currentOperator) {
                let result;
                const secondOperand = number;
                // Perform the calculation
                switch (gameState.currentOperator) {
                    case '+': result = gameState.firstOperand + secondOperand; break;
                    case '−': result = gameState.firstOperand - secondOperand; break; // Use minus sign
                    case '×': result = gameState.firstOperand * secondOperand; break;
                    case '÷': result = gameState.firstOperand / secondOperand; break;
                }
                // Display the full operation and its result
                eqStrEl.textContent = `${gameState.firstOperand} ${gameState.currentOperator} ${secondOperand} = ${result}`;
                // The result becomes the first number for the next operation
                gameState.firstOperand = result;
                gameState.currentOperator = null;
            }
        } else { // It's an operator
            // Handle the 'Clear' button
            if (value === 'C') {
                gameState.firstOperand = null;
                gameState.currentOperator = null;
                eqStrEl.textContent = '0';
            }
            // Set the operator if a first number has been chosen
            else if (gameState.firstOperand !== null) {
                gameState.currentOperator = value;
                eqStrEl.textContent = `${gameState.firstOperand} ${value}`;
            }
        }

        gameState.moves++;
        updateStats(`Moves: ${gameState.moves}`);

        // Check for a win if the current result matches the target
        if (gameState.firstOperand === gameState.targetNumber) {
            showWinModal('You Win!', `You hit the target in ${gameState.moves} moves!`);
            numberCrunchGame.newRound();
        }
    },

    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        // Operator list now uses the correct minus sign
        const operators = ['+', '−', '×', '÷'];
        const numbers = [];
        // Generate a wider range of useful numbers
        for(let i=0; i<12; i++) {
            numbers.push(Math.floor(Math.random() * 9) + 1);
        }

        const boardValues = [...numbers, ...operators, 'C'].slice(0, 16);
        utils.shuffleArray(boardValues);

        lights.forEach((light, i) => {
            if (boardValues[i]) {
                light.textContent = boardValues[i];
                light.classList.add(!isNaN(boardValues[i]) ? 'is-on' : 'is-player-2');
            } else {
                light.textContent = '';
                light.classList.remove('is-on', 'is-player-2');
            }
        });
    },

    // checkWin is now integrated into the handler to check after each calculation
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
};

// --- Game Registration ---
// Instead of polluting the global scope, we now explicitly register
// the game with the gameManager.
if (window.gameManager) {
    window.gameManager.registerGame('numberCrunchGame', numberCrunchGame);
} else {
    // This error will appear if a game script is loaded without main.js,
    // which can be helpful for debugging.
    console.error("Fatal Error: gameManager is not available.");
}