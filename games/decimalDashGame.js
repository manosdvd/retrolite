const decimalDashGame = {
    // --- PROPERTIES ---
    targetDecimal: 0,
    currentCondition: '', // 'greater', 'less', 'equal'
    score: 0,
    round: 0,
    maxRounds: 10,
    timer: null,
    timeRemaining: 0,
    roundDuration: 15, // seconds per round

    // --- METHODS ---
    setup: function() {
        gameBoard.innerHTML = `
            <div id="decimal-dash-display" class="w-full text-center p-4">
                <div class="mb-2 text-xl text-gray-400">Find numbers that are</div>
                <div id="condition-text" class="text-3xl font-bold text-purple-400 mb-2"></div>
                <div id="target-decimal-text" class="text-5xl font-bold text-yellow-300">0.00</div>
                <div id="timer-text" class="text-2xl text-gray-300 mt-4">Time: ${this.roundDuration}s</div>
            </div>
        `;
        // Override default grid styles for a custom layout
        gameBoard.className = 'grid grid-cols-3 gap-3 p-4';
        
        // Use the keyboard container for our number tiles
        keyboardContainer.className = 'grid grid-cols-3 gap-3 w-full max-w-sm';

        this.newGame();

        const newGameButton = createControlButton('New Game', 'btn-blue', () => this.newGame(), 'refresh');
        buttonContainer.prepend(newGameButton);
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
        this.timeRemaining = this.roundDuration;
        this.generateProblem();
        this.render();
        this.startTimer();
        gameStatus.textContent = `Round ${this.round} of ${this.maxRounds}`;
    },

    generateProblem: function() {
        this.targetDecimal = parseFloat((Math.random() * 10).toFixed(2)); // e.g., 0.00 to 9.99
        const conditions = ['greater', 'less', 'equal'];
        this.currentCondition = conditions[Math.floor(Math.random() * conditions.length)];

        document.getElementById('target-decimal-text').textContent = this.targetDecimal.toFixed(2);
        document.getElementById('condition-text').textContent = `${this.currentCondition} than`;

        this.options = [];
        // Generate a mix of correct and incorrect options
        for (let i = 0; i < 9; i++) { // 9 options for a 3x3 grid
            let option;
            let isCorrect;
            do {
                option = parseFloat((Math.random() * 10).toFixed(2));
                isCorrect = this.checkCondition(option);
            } while (i < 3 && !isCorrect); // Ensure at least 3 correct options
            this.options.push(option);
        }
        this.options = utils.shuffleArray(this.options);
    },

    render: function() {
        keyboardContainer.innerHTML = '';
        this.options.forEach(decimal => {
            const button = document.createElement('button');
            button.className = 'control-button btn-orange';
            button.textContent = decimal.toFixed(2);
            button.onclick = () => this.handleDecimalClick(decimal, button);
            keyboardContainer.appendChild(button);
        });
    },

    handleDecimalClick: function(clickedDecimal, button) {
        if (this.checkCondition(clickedDecimal)) {
            this.score++;
            audioManager.playSound('positive', 'C5', '8n'); // Correct sound
            button.classList.add('btn-green');
        } else {
            this.score = Math.max(0, this.score - 1); // Deduct score for incorrect
            audioManager.playSound('negative', 'C3', '8n'); // Incorrect sound
            button.classList.add('btn-red');
        }
        updateStats(`Score: ${this.score}`);
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    },

    checkCondition: function(value) {
        switch (this.currentCondition) {
            case 'greater': return value > this.targetDecimal;
            case 'less': return value < this.targetDecimal;
            case 'equal': return value === this.targetDecimal;
            default: return false;
        }
    },

    startTimer: function() {
        clearInterval(this.timer);
        const timerTextEl = document.getElementById('timer-text');
        timerTextEl.textContent = `Time: ${this.timeRemaining}s`;

        this.timer = setInterval(() => {
            this.timeRemaining--;
            timerTextEl.textContent = `Time: ${this.timeRemaining}s`;
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.startRound(); // Move to next round when time runs out
            }
        }, 1000);
    },

    endGame: function() {
        clearInterval(this.timer);
        showWinModal('Game Over!', `Your final score is: ${this.score} out of ${this.maxRounds} rounds!`);
    },

    cleanup: function() {
        clearInterval(this.timer);
    }
};