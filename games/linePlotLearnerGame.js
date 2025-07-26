const linePlotLearnerGame = {
    // --- PROPERTIES ---
    dataset: [], // The data points for the line plot
    numberLineRange: { min: 0, max: 5, step: 0.5 },
    plotPoints: {}, // Stores counts for each point on the line plot
    question: {}, // The current question and its correct answer
    score: 0,
    round: 0,
    maxRounds: 10,
    inputField: null,
    submitButton: null,
    canvas: null,
    ctx: null,

    // --- METHODS ---
    setup: function() {
        gameBoard.innerHTML = `
            <div id="line-plot-display" class="w-full flex flex-col items-center justify-center p-4">
                <canvas id="plot-canvas" width="400" height="250" class="bg-gray-700 rounded-lg mb-4"></canvas>
                <div id="question-text" class="text-xl font-bold text-yellow-300 text-center mb-4"></div>
                <input type="number" id="answer-input" class="mt-2 bg-gray-800 border border-gray-600 rounded-md p-2 w-32 text-center text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Answer">
            </div>
        `;
        // Override default grid styles for a custom layout
        gameBoard.className = 'flex flex-col items-center justify-start gap-4 p-4';
        keyboardContainer.innerHTML = ''; // No keyboard needed for this game

        this.inputField = document.getElementById('answer-input');
        this.submitButton = createControlButton('Submit', 'btn-green', () => this.handleSubmit());
        buttonContainer.prepend(this.submitButton);

        this.canvas = document.getElementById('plot-canvas');
        this.ctx = this.canvas.getContext('2d');

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
        this.renderPlot();
        this.renderQuestion();
        gameStatus.textContent = `Round ${this.round} of ${this.maxRounds}`;
        this.inputField.value = '';
        this.inputField.focus();
    },

    generateProblem: function() {
        this.dataset = [];
        this.plotPoints = {};
        const numDataPoints = Math.floor(Math.random() * 6) + 5; // 5 to 10 data points

        for (let i = 0; i < numDataPoints; i++) {
            const value = (Math.floor(Math.random() * ((this.numberLineRange.max - this.numberLineRange.min) / this.numberLineRange.step + 1)) * this.numberLineRange.step + this.numberLineRange.min).toFixed(1);
            this.dataset.push(parseFloat(value));
            this.plotPoints[value] = (this.plotPoints[value] || 0) + 1;
        }

        const questionTypes = ['total', 'mostFrequent', 'leastFrequent', 'countAtValue'];
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let questionText = '';
        let correctAnswer;

        const dataValues = Object.values(this.data);
        const dataKeys = Object.keys(this.data);

        switch (type) {
            case 'total':
                questionText = 'How many data points are there in total?';
                correctAnswer = this.dataset.length;
                break;
            case 'mostFrequent':
                let maxCount = 0;
                let mostFrequentValue = '';
                for (const val in this.plotPoints) {
                    if (this.plotPoints[val] > maxCount) {
                        maxCount = this.plotPoints[val];
                        mostFrequentValue = val;
                    }
                }
                questionText = `What is the most frequent value?`;
                correctAnswer = parseFloat(mostFrequentValue);
                break;
            case 'leastFrequent':
                let minCount = Infinity;
                let leastFrequentValue = '';
                for (const val in this.plotPoints) {
                    if (this.plotPoints[val] < minCount) {
                        minCount = this.plotPoints[val];
                        leastFrequentValue = val;
                    }
                }
                questionText = `What is the least frequent value?`;
                correctAnswer = parseFloat(leastFrequentValue);
                break;
            case 'countAtValue':
                const randomValue = Object.keys(this.plotPoints)[Math.floor(Math.random() * Object.keys(this.plotPoints).length)];
                questionText = `How many 'X's are above ${randomValue}?`;
                correctAnswer = this.plotPoints[randomValue];
                break;
        }

        this.question = {
            text: questionText,
            answer: correctAnswer
        };
    },

    renderPlot: function() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const plotWidth = canvas.width - 2 * padding;
        const plotHeight = canvas.height - 2 * padding;
        const yAxisStart = canvas.height - padding;

        // Draw number line
        ctx.beginPath();
        ctx.moveTo(padding, yAxisStart);
        ctx.lineTo(canvas.width - padding, yAxisStart);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw tick marks and labels
        const numSteps = (this.numberLineRange.max - this.numberLineRange.min) / this.numberLineRange.step;
        const tickSpacing = plotWidth / numSteps;

        ctx.font = '14px Orbitron';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (let i = 0; i <= numSteps; i++) {
            const value = (this.numberLineRange.min + i * this.numberLineRange.step).toFixed(1);
            const xPos = padding + i * tickSpacing;
            ctx.beginPath();
            ctx.moveTo(xPos, yAxisStart);
            ctx.lineTo(xPos, yAxisStart + 10);
            ctx.stroke();
            ctx.fillText(value, xPos, yAxisStart + 15);
        }

        // Draw 'X's
        ctx.font = '20px Orbitron';
        ctx.fillStyle = '#fde047'; // Yellow for X's
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        for (const value in this.plotPoints) {
            const count = this.plotPoints[value];
            const xPos = padding + ((parseFloat(value) - this.numberLineRange.min) / this.numberLineRange.step) * tickSpacing;
            for (let i = 0; i < count; i++) {
                ctx.fillText('X', xPos, yAxisStart - 15 - (i * 20)); // Stack X's
            }
        }
    },

    renderQuestion: function() {
        document.getElementById('question-text').textContent = this.question.text;
    },

    handleSubmit: function() {
        const userAnswer = parseFloat(this.inputField.value);
        if (isNaN(userAnswer)) {
            gameStatus.textContent = "Please enter a number.";
            return;
        }

        if (userAnswer === this.question.answer) {
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