const fractionFlipperGame = {
    // --- PROPERTIES ---
    targetFraction: { num: 0, den: 0 },
    selectedFractions: [], // Changed from currentSum to selectedFractions array
    options: [],
    maxDenominator: 12,

    // --- METHODS ---
    setup: function() {
        // Updated HTML to include canvases for the main displays
        gameBoard.innerHTML = `
            <div id="fraction-display" class="w-full grid grid-cols-2 gap-4 p-4 text-center">
                <div>
                    <div class="mb-2 text-xl text-gray-400">Your Sum</div>
                    <canvas id="current-sum-canvas" width="120" height="120" class="mx-auto bg-gray-700 rounded-full"></canvas>
                    <div id="current-sum-text" class="text-3xl font-bold text-amber-300 mt-2">0</div>
                </div>
                <div>
                    <div class="mb-2 text-xl text-gray-400">Match This Target</div>
                    <canvas id="target-fraction-canvas" width="120" height="120" class="mx-auto bg-gray-700 rounded-full"></canvas>
                    <div id="target-fraction-text" class="text-3xl font-bold text-cyan-400 mt-2">?/?</div>
                </div>
            </div>
        `;
        gameBoard.className = 'flex flex-col items-center justify-start gap-4 p-4';
        keyboardContainer.className = 'grid grid-cols-4 gap-3 w-full max-w-md'; // Wider for better layout

        this.newRound();

        const newRoundButton = createControlButton('New Target', 'btn-blue', () => this.newRound());
        buttonContainer.prepend(newRoundButton);
    },

    newRound: function() {
        this.selectedFractions = []; // Reset selected fractions
        this.generateProblem();
        this.render(); // This will also handle the initial drawing
        updateStats(`Find the combination!`);
        
        // Ensure all buttons are re-enabled and their appearance reset
        keyboardContainer.querySelectorAll('.control-button').forEach(button => {
            button.classList.remove('opacity-50', 'cursor-not-allowed', 'hover:scale-100');
            button.disabled = false;
        });
    },

    generateProblem: function() {
        let solutionFound = false;
        let attempts = 0;
        while (!solutionFound && attempts < 100) { // Limit attempts to prevent infinite loops
            this.options = [];

            // 1. Generate a target fraction
            const targetDen = this.getRandomDenominator();
            const targetNum = Math.floor(Math.random() * (targetDen - 1)) + 1;
            this.targetFraction = this.simplifyFraction(targetNum, targetDen);

            // 2. Generate two fractions that sum to the target
            let f1 = { num: 0, den: 1 };
            let f2 = { num: 0, den: 1 };
            
            // Try to find two fractions that sum to the target
            let innerAttempts = 0;
            while (innerAttempts < 50) { // Limit inner attempts
                const den1 = this.getRandomDenominator();
                const num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
                f1 = this.simplifyFraction(num1, den1);

                const remaining = this.subtractFractions(this.targetFraction, f1);
                if (remaining.num > 0) { // Ensure remaining is positive
                    f2 = this.simplifyFraction(remaining.num, remaining.den);
                    // Check if f2 is a valid fraction (num > 0, den > 0) and not the same as f1
                    // Also, ensure f1 and f2 are not equal to the target fraction themselves
                    if (f2.num > 0 && f2.den > 0 &&
                        !(f1.num === f2.num && f1.den === f2.den) &&
                        !(f1.num === this.targetFraction.num && f1.den === this.targetFraction.den) &&
                        !(f2.num === this.targetFraction.num && f2.den === this.targetFraction.den)
                    ) {
                        solutionFound = true;
                        break;
                    }
                }
                innerAttempts++;
            }

            if (solutionFound) {
                this.options.push(f1, f2);
                // Add distractors
                while (this.options.length < 8) {
                    const randDen = this.getRandomDenominator();
                    const randNum = Math.floor(Math.random() * (randDen - 1)) + 1;
                    const newFraction = this.simplifyFraction(randNum, randDen);
                    // Ensure we don't add duplicate fractions, solution components, or the target fraction itself
                    if (!this.options.some(opt => opt.num === newFraction.num && opt.den === newFraction.den) &&
                        !(newFraction.num === this.targetFraction.num && newFraction.den === this.targetFraction.den)
                    ) {
                        this.options.push(newFraction);
                    }
                }
            }
            attempts++;
        }
        // If after many attempts, no solution is found, fall back to a simpler problem or throw error
        if (!solutionFound) {
            console.warn("Could not generate a 2-piece solution. Falling back to a simpler problem.");
            // Fallback: just generate a target and some random fractions, might not have a 2-piece solution
            const den = this.getRandomDenominator();
            const num = Math.floor(Math.random() * (den - 1)) + 1;
            this.targetFraction = this.simplifyFraction(num, den);
            this.options = [];
            while (this.options.length < 8) {
                const randDen = this.getRandomDenominator();
                const randNum = Math.floor(Math.random() * (randDen - 1)) + 1;
                const newFraction = this.simplifyFraction(randNum, randDen);
                // Ensure the fallback also doesn't add the target fraction as an option
                if (!this.options.some(opt => opt.num === newFraction.num && opt.den === newFraction.den) &&
                    !(newFraction.num === this.targetFraction.num && newFraction.den === this.targetFraction.den)
                ) {
                    this.options.push(newFraction);
                }
            }
        }

        // Shuffle the final options
        this.options = utils.shuffleArray(this.options);
    },
    
    createSolutionPath: function(target) {
        let solution = [];
        let remaining = { ...target };
        const numPieces = Math.floor(Math.random() * 2) + 2; // 2 to 3 pieces

        for (let i = 0; i < numPieces - 1; i++) {
             if (remaining.num === 0) break;
            const pieceDen = this.getRandomDenominator();
            const maxNum = Math.floor((remaining.num / remaining.den) * pieceDen) - 1;

            if (maxNum > 0) {
                const pieceNum = Math.floor(Math.random() * maxNum) + 1;
                const piece = this.simplifyFraction(pieceNum, pieceDen);
                
                solution.push(piece);
                remaining = this.subtractFractions(remaining, piece);
            }
        }
        if (remaining.num > 0) {
            solution.push(this.simplifyFraction(remaining.num, remaining.den));
        }
        return solution.filter(f => f.num > 0);
    },

    render: function() {
        // Render the main displays first
        document.getElementById('target-fraction-text').textContent = `${this.targetFraction.num} / ${this.targetFraction.den}`;
        this.drawPieChart(document.getElementById('target-fraction-canvas'), this.targetFraction.num, this.targetFraction.den, '#06b6d4');
        this.updateCurrentSumDisplay();

        // Render the fraction options
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
            
            buttonContainer.appendChild(canvas);
            buttonContainer.appendChild(text);
            
            this.drawPieChart(canvas, fraction.num, fraction.den);

            buttonContainer.onclick = () => this.handleFractionClick(fraction, buttonContainer);
            keyboardContainer.appendChild(buttonContainer);
        });
    },

    handleFractionClick: function(fraction, button) {
        // Check if the fraction is already selected
        const index = this.selectedFractions.findIndex(f => f.num === fraction.num && f.den === fraction.den);

        if (index > -1) {
            // Fraction is already selected, so unselect it
            this.selectedFractions.splice(index, 1); // Remove from array
            button.classList.remove('opacity-50', 'cursor-not-allowed', 'hover:scale-100');
            button.disabled = false; // Re-enable the button
            playSound('C3', '8n'); // A sound for unselecting
        } else {
            // Fraction is not selected, so select it
            this.selectedFractions.push(fraction);
            button.classList.add('opacity-50', 'cursor-not-allowed', 'hover:scale-100');
            button.disabled = true; // Disable the button
            playSound('C4', '8n'); // A sound for selecting
        }

        this.updateCurrentSumDisplay();
        this.checkWin();
    },

    checkWin: function() {
        let totalSum = { num: 0, den: 1 };
        this.selectedFractions.forEach(f => {
            totalSum = this.addFractions(totalSum, f);
        });
        const simpleSum = this.simplifyFraction(totalSum.num, totalSum.den);
        if (simpleSum.num === this.targetFraction.num && simpleSum.den === this.targetFraction.den) {
            playSound('G5', '4n');
            showWinModal("Target Matched!", `You found a combination for ${this.targetFraction.num} / ${this.targetFraction.den}!`);
            setTimeout(() => this.newRound(), 500);
        }
    },

    updateCurrentSumDisplay: function() {
        let totalSum = { num: 0, den: 1 };
        this.selectedFractions.forEach(f => {
            totalSum = this.addFractions(totalSum, f);
        });

        const simpleSum = this.simplifyFraction(totalSum.num, totalSum.den);
        const textEl = document.getElementById('current-sum-text');
        const canvasEl = document.getElementById('current-sum-canvas');

        if (simpleSum.num === 0) {
            textEl.textContent = '0';
        } else {
            textEl.textContent = `${simpleSum.num} / ${simpleSum.den}`;
        }
        this.drawPieChart(canvasEl, simpleSum.num, simpleSum.den, '#f59e0b');
    },

    drawPieChart: function(canvas, num, den, color = '#22c55e') {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.9;
        const startAngle = -0.5 * Math.PI;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#374151';
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
    gcd: function(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    },
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
    }
};