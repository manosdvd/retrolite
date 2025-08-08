const blackjackGame = {
    setup: () => {
        gameState = {
            deck: [], playerHand: [], cpuHand: [], gameOver: false, playerTurn: true,
        };
        // 1 is Ace, 2-10 are numbers, 10 is J/Q/K
        for (let s = 0; s < 4; s++) { // 4 suits
            for (let i = 1; i <= 10; i++) gameState.deck.push(i);
            gameState.deck.push(10, 10, 10); // J, Q, K
        }
        utils.shuffleArray(gameState.deck);

        const hitButton = createControlButton('Hit', 'btn-blue', blackjackGame.hit, 'add');
        const standButton = createControlButton('Stand', 'btn-yellow', blackjackGame.stand, 'check');
        gameState.hitButton = hitButton;
        gameState.standButton = standButton;
        buttonContainer.prepend(standButton);
        buttonContainer.prepend(hitButton);
        hitButton.disabled = true; standButton.disabled = true;

        blackjackGame.updateBoardAndScores(); // Initial empty board render

        const deal = async () => {
            await blackjackGame.dealCard(HUMAN); await delay(400);
            await blackjackGame.dealCard(AI, true); await delay(400);
            await blackjackGame.dealCard(HUMAN); await delay(400);
            await blackjackGame.dealCard(AI);
            
            hitButton.disabled = false; standButton.disabled = false;
            gameStatus.textContent = "Your turn. Hit or Stand?";

            if (blackjackGame.calculateHandValue(gameState.playerHand) === 21) {
                gameStatus.textContent = "Blackjack!";
                setTimeout(blackjackGame.stand, 1000);
            }
        };
        deal();
    },
    calculateHandValue: (hand) => {
        let score = hand.reduce((sum, card) => sum + card, 0);
        let aceCount = hand.filter(card => card === 1).length;
        while (score <= 11 && aceCount > 0) {
            score += 10;
            aceCount--;
        }
        return score;
    },
    dealCard: async (player, isHidden = false) => {
        if (gameState.deck.length === 0) return;
        const card = gameState.deck.pop();
        
        if (player === HUMAN) {
            gameState.playerHand.push(card);
        } else {
            gameState.cpuHand.push({ card, hidden: isHidden });
        }
        
        audioManager.playSound('game', notes[card] || 'C4', '16n');
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        await blackjackGame.updateBoardAndScores();
    },
    updateBoardAndScores: async () => {
        const lights = gameBoard.querySelectorAll('.light');
        
        const updateCard = (cardEl, cardValue, playerClass, isHidden) => {
            if (!cardEl.querySelector('.blackjack-card-inner')) {
                cardEl.innerHTML = `
                    <div class="blackjack-card-inner">
                        <div class="blackjack-card-front"></div>
                        <div class="blackjack-card-back"></div>
                    </div>
                `;
            }
            
            const cardBack = cardEl.querySelector('.blackjack-card-back');
            cardBack.textContent = cardValue === 1 ? 'A' : cardValue;
            
            // Apply playerClass to the main card element (cardEl)
            if (!cardEl.classList.contains(playerClass)) {
                cardEl.classList.add(playerClass);
            }
            cardBack.classList.add('blackjack-card-back'); // Ensure this class is always present
            
            if (!isHidden && !cardEl.classList.contains('is-flipped')) {
                cardEl.classList.add('is-flipped');
            }
        };

        // Update CPU hand
        gameState.cpuHand.forEach((c, index) => {
            const cardEl = lights[index];
            if (cardEl) {
                cardEl.classList.add('blackjack-card');
                updateCard(cardEl, c.card, 'is-player-2', c.hidden);
            }
        });

        // Update Player hand
        gameState.playerHand.forEach((card, index) => {
            const playerGridIndex = 8 + index;
            const cardEl = lights[playerGridIndex];
            if (cardEl) {
                cardEl.classList.add('blackjack-card');
                updateCard(cardEl, card, 'is-player-1', false);
            }
        });

        const playerScore = blackjackGame.calculateHandValue(gameState.playerHand);
        const cpuVisibleScore = blackjackGame.calculateHandValue(gameState.cpuHand.filter(c => !c.hidden).map(c => c.card));
        
        if (gameState.playerTurn) {
            updateStats(`Your Score: ${playerScore} | CPU Shows: ${cpuVisibleScore}`);
        } else {
            const finalCpuScore = blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card));
            updateStats(`Your Score: ${playerScore} | CPU: ${finalCpuScore}`);
        }
    },
    hit: async () => {
        if (gameState.gameOver || !gameState.playerTurn) return;
        await blackjackGame.dealCard(HUMAN);
        const playerScore = blackjackGame.calculateHandValue(gameState.playerHand);
        if (playerScore > 21) {
            blackjackGame.end("Bust! CPU wins.");
        } else if (playerScore === 21) {
            blackjackGame.stand();
        }
    },
    stand: async () => {
        if (gameState.gameOver || !gameState.playerTurn) return;
        gameState.playerTurn = false;
        gameState.hitButton.disabled = true;
        gameState.standButton.disabled = true;
        gameStatus.textContent = "CPU's Turn...";

        const hiddenCard = gameState.cpuHand.find(c => c.hidden);
        if (hiddenCard) {
            hiddenCard.hidden = false;
            audioManager.playSound('positive', 'E4', '4n');
        }
        
        await blackjackGame.updateBoardAndScores();
        await delay(1000);

        while (blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card)) < 17 && gameState.deck.length > 0) {
            await delay(800);
            await blackjackGame.dealCard(AI);
        }

        const finalPlayerScore = blackjackGame.calculateHandValue(gameState.playerHand);
        const finalCpuScore = blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card));
        
        if (finalCpuScore > 21) {
            blackjackGame.end("CPU Busts! You Win!");
        } else if (finalCpuScore > finalPlayerScore) {
            blackjackGame.end("CPU Wins!");
        } else if (finalPlayerScore > finalCpuScore) {
            blackjackGame.end("You Win!");
        } else {
            blackjackGame.end("It's a Push (Tie)!");
        }
    },
    end: (message) => {
        if (gameState.gameOver) return;
        gameState.gameOver = true;
        gameState.playerTurn = false;
        gameState.cpuHand.forEach(c => c.hidden = false);
        blackjackGame.updateBoardAndScores();
        gameStatus.textContent = message;
        const finalPlayerScore = blackjackGame.calculateHandValue(gameState.playerHand);
        const finalCpuScore = blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card));
        showWinModal(message, `Final Scores - You: ${finalPlayerScore}, CPU: ${finalCpuScore}`);
    },
    cleanup: () => {
        if (blackjackGame.controller) {
            blackjackGame.controller.abort();
        }
    }
};