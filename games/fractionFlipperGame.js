const fractionFlipperGame = {
    // --- PROPERTIES ---
    targetFraction: { num: 0, den: 0 },
    selectedFractions: [],
    options: [],
    maxDenominator: 12,

    // --- METHODS ---
    setup: function() {
        // Defines the main layout for the game board
        gameBoard.innerHTML = `
            <div id="fraction-display" class="w-full grid grid-cols-2 gap-4 p-4">
                <div class="flex flex-col items-center">
                    <div class="mb-2 text-lg text-gray-400">Your Sum</div>
                    <canvas id="current-sum-canvas" width="120" height="120"></canvas>
                    <div id="current-sum-text" class="text-3xl font-bold text-amber-300 mt-2 h-10 flex items-center justify-center">0</div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="mb-2 text-lg text-gray-400">Match This Target</div>
                    <canvas id="target-fraction-canvas" width="120" height="120"></canvas>
                    <div id="target-fraction-text" class="text-3xl font-bold text-cyan-400 mt-2 h-10 flex items-center justify-center">?/?</div>
                </div>
            </div>
        `;
        gameBoard.className = 'flex flex-col items-center justify-start gap-4 p-4';
        keyboardContainer.className = 'grid grid-cols-4 gap-3 w-full max-w-md';

        // Correctly call newRound on the object itself
        fractionFlipperGame.newRound();

        const newRoundButton = createControlButton('New Target', 'btn-blue', () => fractionFlipperGame.newRound());
        buttonContainer.prepend(newRoundButton);
    },

    newRound: function() {
        this.selectedFractions = [];
        this.generateProblem();
        this.render();
        updateStats(`Find the combination!`);
    },

    generateProblem: function() {
        // This function's logic remains the same.
        let solutionFound = false;
        let attempts = 0;
        while (!solutionFound && attempts < 100) {
            this.options = [];
            const targetDen = this.getRandomDenominator();
            const targetNum = Math.floor(Math.random() * (targetDen - 1)) + 1;
            this.targetFraction = this.simplifyFraction(targetNum, targetDen);

            let f1 = { num: 0, den: 1 }, f2 = { num: 0, den: 1 };
            let innerAttempts = 0;
            while (innerAttempts < 50) {
                const den1 = this.getRandomDenominator();
                const num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
                f1 = this.simplifyFraction(num1, den1);
                const remaining = this.subtractFractions(this.targetFraction, f1);
                if (remaining.num > 0) {
                    f2 = this.simplifyFraction(remaining.num, remaining.den);
                    if (f2.num > 0 && f2.den > 0 && !(f1.num === f2.num && f1.den === f2.den) &&
                        !(f1.num === this.targetFraction.num && f1.den === this.targetFraction.den) &&
                        !(f2.num === this.targetFraction.num && f2.den === this.targetFraction.den)) {
                        solutionFound = true;
                        break;
                    }
                }
                innerAttempts++;
            }

            if (solutionFound) {
                this.options.push(f1, f2);
                while (this.options.length < 8) {
                    const randDen = this.getRandomDenominator();
                    const randNum = Math.floor(Math.random() * (randDen - 1)) + 1;
                    const newFraction = this.simplifyFraction(randNum, randDen);
                    if (!this.options.some(opt => opt.num === newFraction.num && opt.den === newFraction.den) &&
                        !(newFraction.num === this.targetFraction.num && newFraction.den === this.targetFraction.den)) {
                        this.options.push(newFraction);
                    }
                }
            }
            attempts++;
        }
        if (!solutionFound) { // Fallback if no clean solution is found
            const den = this.getRandomDenominator();
            const num = Math.floor(Math.random() * (den - 1)) + 1;
            this.targetFraction = this.simplifyFraction(num, den);
            this.options = [];
            while (this.options.length < 8) {
                const randDen = this.getRandomDenominator();
                const randNum = Math.floor(Math.random() * (randDen - 1)) + 1;
                const newFraction = this.simplifyFraction(randNum, randDen);
                if (!this.options.some(opt => opt.num === newFraction.num && opt.den === newFraction.den) &&
                    !(newFraction.num === this.targetFraction.num && newFraction.den === this.targetFraction.den)) {
                    this.options.push(newFraction);
                }
            }
        }
        this.options = utils.shuffleArray(this.options);
    },

    render: function() {
        document.getElementById('target-fraction-text').textContent = `${this.targetFraction.num} / ${this.targetFraction.den}`;
        this.drawPieChart(document.getElementById('target-fraction-canvas'), this.targetFraction.num, this.targetFraction.den, '#00BCD4'); // Cyan
        this.updateCurrentSumDisplay();

        keyboardContainer.innerHTML = '';
        this.options.forEach(fraction => {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-gray-800 cursor-pointer transition-transform hover:scale-105';
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            const text = document.createElement('span');
            text.className = 'font-bold text-white';
            text.textContent = `${fraction.num} / ${fraction.den}`;
            buttonContainer.append(canvas, text);
            this.drawPieChart(canvas, fraction.num, fraction.den); // Uses default green color
            
            // --- FIX: Attach the click handler correctly ---
            buttonContainer.onclick = () => this.handleFractionClick(fraction, buttonContainer);
            keyboardContainer.appendChild(buttonContainer);
        });
    },

    handleFractionClick: function(fraction, button) {
        const index = this.selectedFractions.findIndex(f => f.num === fraction.num && f.den === fraction.den);

        if (index > -1) {
            // Fraction is already selected, so UNSELECT it.
            this.selectedFractions.splice(index, 1);
            button.classList.remove('opacity-50'); // Make it look active again
            playSound('C3', '8n'); // Sound for removal
        } else {
            // Fraction is not selected, so SELECT it.
            this.selectedFractions.push(fraction);
            button.classList.add('opacity-50'); // Make it look selected
            playSound('C4', '8n');
        }

        this.updateCurrentSumDisplay();
        this.checkWin();
    },

    checkWin: function() {
        let totalSum = this.selectedFractions.reduce((sum, f) => this.addFractions(sum, f), { num: 0, den: 1 });
        const simpleSum = this.simplifyFraction(totalSum.num, totalSum.den);
        if (simpleSum.num === this.targetFraction.num && simpleSum.den === this.targetFraction.den) {
            playSound('G5', '4n');
            showWinModal("Target Matched!", `You found a combination for ${this.targetFraction.num} / ${this.targetFraction.den}!`);
            setTimeout(() => this.newRound(), 500);
        }
    },

    updateCurrentSumDisplay: function() {
        let totalSum = this.selectedFractions.reduce((sum, f) => this.addFractions(sum, f), { num: 0, den: 1 });
        const simpleSum = this.simplifyFraction(totalSum.num, totalSum.den);
        const textEl = document.getElementById('current-sum-text');
        const canvasEl = document.getElementById('current-sum-canvas');

        textEl.textContent = (simpleSum.num === 0) ? '0' : `${simpleSum.num} / ${simpleSum.den}`;
        this.drawPieChart(canvasEl, simpleSum.num, simpleSum.den, '#FF9800'); // Orange
    },

    drawPieChart: function(canvas, num, den, color = '#4CAF50') {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.9;
        const startAngle = -0.5 * Math.PI;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#4B5563';
        ctx.fill();

        if (num > 0 && den > 0) {
            const sliceAngle = (num / den) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }
    },

    getRandomDenominator: function() {
        const possibleDenominators = [2, 3, 4, 5, 6, 8, 10, 12];
        return possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
    },

    // --- Fraction Math Helpers ---
    gcd: (a, b) => b === 0 ? a : fractionFlipperGame.gcd(b, a % b),
    simplifyFraction: function(num, den) {
        if (num === 0) return { num: 0, den: 1 };
        const commonDivisor = this.gcd(num, den);
        return { num: num / commonDivisor, den: den / commonDivisor };
    },
    addFractions: function(f1, f2) {
        const newNum = f1.num * f2.den + f2.num * f1.den;
        const newDen = f1.den * f2.den;
        return this.simplifyFraction(newNum, newDen);
    },
    subtractFractions: function(f1, f2) {
        const newNum = f1.num * f2.den - f2.num * f1.den;
        const newDen = f1.den * f2.den;
        return this.simplifyFraction(newNum, newDen);
    },

    cleanup: function() {}
};