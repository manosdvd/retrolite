const patternPaloozaGame = {
    // --- PROPERTIES ---
    pattern: [], // The current pattern sequence
    question: {}, // The question about the pattern
    score: 0,
    round: 0,
    maxRounds: 10,
    inputField: null,
    submitButton: null,

    // --- METHODS ---
    setup: function() {
        gameBoard.innerHTML = `
            <div id="pattern-display" class="w-full flex flex-col items-center justify-center p-4">
                <div id="pattern-sequence" class="flex flex-wrap justify-center items-center gap-3 mb-4"></div>
                <div id="question-text" class="text-xl font-bold text-yellow-300 text-center mb-4"></div>
                <input type="number" id="answer-input" class="mt-2 bg-gray-800 border border-gray-600 rounded-md p-2 w-32 text-center text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Answer">
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
        const patternTypes = ['arithmetic', 'geometric'];
        const type = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        let start = Math.floor(Math.random() * 10) + 1; // 1 to 10
        let commonDiffOrRatio;
        let sequenceLength = 5; // Number of elements to show

        this.pattern = [];
        if (type === 'arithmetic') {
            commonDiffOrRatio = Math.floor(Math.random() * 5) + 1; // 1 to 5
            if (Math.random() < 0.5) commonDiffOrRatio *= -1; // Can be negative
            for (let i = 0; i < sequenceLength; i++) {
                this.pattern.push(start + i * commonDiffOrRatio);
            }
        } else { // geometric
            commonDiffOrRatio = Math.floor(Math.random() * 3) + 2; // 2 to 4
            for (let i = 0; i < sequenceLength; i++) {
                this.pattern.push(start * Math.pow(commonDiffOrRatio, i));
            }
        }

        // Determine the question
        const questionOptions = ['next', 'rule'];
        const questionType = questionOptions[Math.floor(Math.random() * questionOptions.length)];

        let questionText = '';
        let correctAnswer;

        if (questionType === 'next') {
            questionText = 'What is the next number in the sequence?';
            if (type === 'arithmetic') {
                correctAnswer = this.pattern[sequenceLength - 1] + commonDiffOrRatio;
            } else {
                correctAnswer = this.pattern[sequenceLength - 1] * commonDiffOrRatio;
            }
        } else { // rule
            questionText = 'What is the rule for this pattern? (e.g., +5, -2, x3)';
            if (type === 'arithmetic') {
                correctAnswer = commonDiffOrRatio > 0 ? `+${commonDiffOrRatio}` : `${commonDiffOrRatio}`;
            } else {
                correctAnswer = `x${commonDiffOrRatio}`;
            }
            // For rule questions, the input field will be text, not number
            this.inputField.type = 'text';
        }

        this.question = {
            text: questionText,
            answer: correctAnswer
        };
    },

    render: function() {
        const sequenceDisplay = document.getElementById('pattern-sequence');
        sequenceDisplay.innerHTML = '';
        this.pattern.forEach(num => {
            const span = document.createElement('span');
            span.className = 'text-3xl font-bold text-white bg-gray-700 px-4 py-2 rounded-lg';
            span.textContent = num;
            sequenceDisplay.appendChild(span);
        });
        document.getElementById('question-text').textContent = this.question.text;
        this.inputField.type = (typeof this.question.answer === 'number') ? 'number' : 'text';
    },

    handleSubmit: function() {
        let userAnswer;
        if (this.inputField.type === 'number') {
            userAnswer = parseInt(this.inputField.value);
            if (isNaN(userAnswer)) {
                gameStatus.textContent = "Please enter a number.";
                return;
            }
        } else {
            userAnswer = this.inputField.value.trim();
        }

        if (userAnswer == this.question.answer) { // Use == for type coercion with numbers/strings
            this.score++;
            audioManager.playSound('positive', 'C5', '8n'); // Correct sound
            gameStatus.textContent = "Correct!";
        } else {
            this.score = Math.max(0, this.score - 1); // Deduct score for incorrect
            audioManager.playSound('negative', 'C3', '8n'); // Incorrect sound
            gameStatus.textContent = `Incorrect. The answer was ${this.question.answer}.`;
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
    window.gameManager.registerGame('patternPaloozaGame', patternPaloozaGame);
} else {
    // This error will appear if a game script is loaded without main.js,
    // which can be helpful for debugging.
    console.error("Fatal Error: gameManager is not available.");
}