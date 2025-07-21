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
        // Shuffle deck
        for (let i = gameState.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
        }

        const hitButton = createControlButton('Hit', 'btn-blue', blackjackGame.hit);
        const standButton = createControlButton('Stand', 'btn-yellow', blackjackGame.stand);
        gameState.hitButton = hitButton; // Store button in gameState
        gameState.standButton = standButton;
        buttonContainer.prepend(standButton);
        buttonContainer.prepend(hitButton);
        hitButton.disabled = true; standButton.disabled = true;

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
        updateStats(`Your Score: 0`);
    },
    calculateHandValue: (hand) => {
        let score = hand.reduce((sum, card) => sum + card, 0);
        let aceCount = hand.filter(card => card === 1).length;
        while (score <= 11 && aceCount > 0) {
            score += 10; // Treat an Ace as 11 if it doesn't bust the hand
            aceCount--;
        }
        return score;
    },
    dealCard: async (player, isHidden = false) => {
        if (gameState.deck.length === 0) return Promise.resolve();
        const card = gameState.deck.pop();
        
        if (player === HUMAN) gameState.playerHand.push(card);
        else gameState.cpuHand.push({ card, hidden: isHidden });
        
        playSound(notes[card] || 'C4');
        blackjackGame.updateBoardAndScores();
        return Promise.resolve();
    },
    updateBoardAndScores: () => {
        const playerScore = blackjackGame.calculateHandValue(gameState.playerHand);
        const cpuVisibleScore = blackjackGame.calculateHandValue(gameState.cpuHand.filter(c => !c.hidden).map(c => c.card));
        
        if (gameState.playerTurn) {
            updateStats(`Your Score: ${playerScore} | CPU Shows: ${cpuVisibleScore}`);
        } else {
            const finalCpuScore = blackjackGame.calculateHandValue(gameState.cpuHand.map(c => c.card));
            updateStats(`Your Score: ${playerScore} | CPU: ${finalCpuScore}`);
        }

        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach(light => { light.textContent = ''; light.className = 'light is-off'; });
        
        gameState.cpuHand.forEach((c, index) => {
            if (lights[index]) {
                lights[index].textContent = c.hidden ? '?' : (c.card === 1 ? 'A' : c.card);
                lights[index].classList.remove('is-off');
                lights[index].classList.add('is-player-2');
            }
        });
        gameState.playerHand.forEach((card, index) => {
            const playerGridIndex = 8 + index;
            if (lights[playerGridIndex]) {
                lights[playerGridIndex].textContent = card === 1 ? 'A' : card;
                lights[playerGridIndex].classList.remove('is-off');
                lights[playerGridIndex].classList.add('is-player-1');
            }
        });
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
            playSound('E4', '4n');
        }
        
        blackjackGame.updateBoardAndScores();
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
    }
};