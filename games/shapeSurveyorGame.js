const shapeSurveyorGame = {
    // --- PROPERTIES ---
    shape: {}, // Stores type, dimensions, and correct answer
    questionType: '', // 'area' or 'perimeter'
    score: 0,
    round: 0,
    maxRounds: 10,
    inputField: null,
    submitButton: null,

    // --- METHODS ---
    setup: function() {
        gameBoard.innerHTML = `
            <div id="shape-display" class="w-full flex flex-col items-center justify-center p-4">
                <div id="shape-drawing" class="w-48 h-48 border-4 border-blue-400 flex items-center justify-center text-white text-lg font-bold relative">
                    <span id="side-a" class="absolute -left-8 top-1/2 -translate-y-1/2"></span>
                    <span id="side-b" class="absolute -bottom-8 left-1/2 -translate-x-1/2"></span>
                </div>
                <div id="question-text" class="text-2xl font-bold text-yellow-300 mt-4"></div>
                <input type="number" id="answer-input" class="mt-4 bg-gray-800 border border-gray-600 rounded-md p-2 w-32 text-center text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Answer">
            </div>
        `;
        // Override default grid styles for a custom layout
        gameBoard.className = 'flex flex-col items-center justify-start gap-4 p-4';
        keyboardContainer.innerHTML = ''; // No keyboard needed for this game

        this.inputField = document.getElementById('answer-input');
        this.submitButton = createControlButton('Submit', 'btn-green', () => this.handleSubmit(), 'check');
        buttonContainer.prepend(this.submitButton);

        this.newGame();
    },

    newGame: function() {
        this.score = 0;
        this.round = 0;
        updateStats(`Score: ${this.score}`);
        this.startRound();
    },

    startRound: function() {
        if (this.round >= this.maxRounds) {
            this.endGame();
            return;
        }

        this.round++;
        this.generateProblem();
        this.render();
        gameStatus.textContent = `Round ${this.round} of ${this.maxRounds}`;
        this.inputField.value = '';
        this.inputField.focus();
    },

    generateProblem: function() {
        const shapeType = Math.random() < 0.5 ? 'rectangle' : 'square';
        let sideA = Math.floor(Math.random() * 10) + 2; // 2 to 11
        let sideB = sideA; // For square
        if (shapeType === 'rectangle') {
            do {
                sideB = Math.floor(Math.random() * 10) + 2;
            } while (sideB === sideA); // Ensure different sides for rectangle
        }

        const questionTypes = ['area', 'perimeter'];
        this.questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let correctAnswer;
        if (this.questionType === 'area') {
            correctAnswer = sideA * sideB;
        } else { // perimeter
            correctAnswer = 2 * (sideA + sideB);
        }

        this.shape = {
            type: shapeType,
            sideA: sideA,
            sideB: sideB,
            correctAnswer: correctAnswer
        };
    },

    render: function() {
        const shapeDrawing = document.getElementById('shape-drawing');
        const sideAEl = document.getElementById('side-a');
        const sideBEl = document.getElementById('side-b');
        const questionTextEl = document.getElementById('question-text');

        shapeDrawing.style.width = `${this.shape.sideA * 10 + 50}px`; // Scale drawing
        shapeDrawing.style.height = `${this.shape.sideB * 10 + 50}px`;
        shapeDrawing.style.borderRadius = this.shape.type === 'square' ? '5px' : '0';

        sideAEl.textContent = `${this.shape.sideA} units`;
        sideBEl.textContent = `${this.shape.sideB} units`;

        questionTextEl.textContent = `What is the ${this.questionType} of this ${this.shape.type}?`;
    },

    handleSubmit: function() {
        const userAnswer = parseInt(this.inputField.value);
        if (isNaN(userAnswer)) {
            gameStatus.textContent = "Please enter a number.";
            return;
        }

        if (userAnswer === this.shape.correctAnswer) {
            this.score++;
            audioManager.playSound('positive', 'C5', '8n'); // Correct sound
            gameStatus.textContent = "Correct!";
        } else {
            this.score = Math.max(0, this.score - 1); // Deduct score for incorrect
            audioManager.playSound('negative', 'C3', '8n'); // Incorrect sound
            gameStatus.textContent = `Incorrect. The answer was ${this.shape.correctAnswer}.`;
        }
        updateStats(`Score: ${this.score}`);
        this.startRound();
    },

    endGame: function() {
        showWinModal('Game Over!', `Your final score is: ${this.score} out of ${this.maxRounds} rounds!`);
    },

    cleanup: function() {
        // No specific intervals or listeners to clear for this game
    }
};

// --- Game Registration ---
// Instead of polluting the global scope, we now explicitly register
// the game with the gameManager.
if (window.gameManager) {
    window.gameManager.registerGame('shapeSurveyorGame', shapeSurveyorGame);
} else {
    // This error will appear if a game script is loaded without main.js,
    // which can be helpful for debugging.
    console.error("Fatal Error: gameManager is not available.");
}