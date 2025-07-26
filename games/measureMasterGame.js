const measureMasterGame = {
    // --- PROPERTIES ---
    question: {}, // Stores the measurement, target unit, and correct answer
    score: 0,
    round: 0,
    maxRounds: 10,
    inputField: null,
    submitButton: null,

    // --- METHODS ---
    setup: function() {
        gameBoard.innerHTML = `
            <div id="measure-master-display" class="w-full flex flex-col items-center justify-center p-4">
                <div id="question-text" class="text-2xl font-bold text-yellow-300 text-center mb-4"></div>
                <input type="number" id="answer-input" class="mt-2 bg-gray-800 border border-gray-600 rounded-md p-2 w-32 text-center text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Answer">
                <div id="unit-text" class="text-xl text-gray-400 mt-2"></div>
            </div>
        `;
        // Override default grid styles for a custom layout
        gameBoard.className = 'flex flex-col items-center justify-start gap-4 p-4';
        keyboardContainer.innerHTML = ''; // No keyboard needed for this game

        this.inputField = document.getElementById('answer-input');
        this.submitButton = createControlButton('Submit', 'btn-green', () => this.handleSubmit());
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
        const conversions = [
            { from: 'feet', to: 'inches', factor: 12, min: 1, max: 10 },
            { from: 'yards', to: 'feet', factor: 3, min: 1, max: 10 },
            { from: 'gallons', to: 'quarts', factor: 4, min: 1, max: 10 },
            { from: 'pounds', to: 'ounces', factor: 16, min: 1, max: 10 },
            { from: 'meters', to: 'centimeters', factor: 100, min: 1, max: 10 },
            { from: 'kilograms', to: 'grams', factor: 1000, min: 1, max: 5 },
        ];

        const conversion = conversions[Math.floor(Math.random() * conversions.length)];
        const value = Math.floor(Math.random() * (conversion.max - conversion.min + 1)) + conversion.min;
        const correctAnswer = value * conversion.factor;

        this.question = {
            value: value,
            fromUnit: conversion.from,
            toUnit: conversion.to,
            correctAnswer: correctAnswer
        };
    },

    render: function() {
        document.getElementById('question-text').textContent = `Convert ${this.question.value} ${this.question.fromUnit} to ${this.question.toUnit}.`;
        document.getElementById('unit-text').textContent = `(in ${this.question.toUnit})`;
    },

    handleSubmit: function() {
        const userAnswer = parseInt(this.inputField.value);
        if (isNaN(userAnswer)) {
            gameStatus.textContent = "Please enter a number.";
            return;
        }

        if (userAnswer === this.question.correctAnswer) {
            this.score++;
            audioManager.playSound('positive', 'C5', '8n'); // Correct sound
            gameStatus.textContent = "Correct!";
        } else {
            this.score = Math.max(0, this.score - 1); // Deduct score for incorrect
            audioManager.playSound('negative', 'C3', '8n'); // Incorrect sound
            gameStatus.textContent = `Incorrect. The answer was ${this.question.correctAnswer}.`;
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