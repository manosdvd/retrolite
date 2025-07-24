const echoGame = {
    setup: () => {
        gameState = { sequence: [], playerSequence: [], level: 1, state: 'WATCH' };
        gameBoard.querySelectorAll('.light').forEach(light => light.classList.add('is-off'));
        const startButton = createControlButton('Start', 'btn-green', () => {
            if (gameState.state === 'WATCH') {
                startButton.remove();
                echoGame.nextSequence();
            }
        });
        buttonContainer.prepend(startButton);
        updateStats(`Level: 1`);
        gameStatus.textContent = "Press Start";
    },
    nextSequence: () => {
        gameState.state = 'WATCH';
        updateStats(`Level: ${gameState.level}`);
        const nextIndex = Math.floor(Math.random() * 9);
        gameState.sequence.push(nextIndex);
        echoGame.playSequence();
    },
    playSequence: async () => {
        gameState.state = 'WATCH';
        gameStatus.textContent = "Watch carefully...";
        gameBoard.style.pointerEvents = 'none';
        for (const index of gameState.sequence) {
            const light = gameBoard.querySelector(`[data-index='${index}']`);
            light.classList.add(`echo-${index+1}`);
            light.classList.remove('is-off');
            playSound(notes[index]);
            await delay(400);
            light.classList.add('is-off');
            light.classList.remove(`echo-${index+1}`);
            await delay(200);
        }
        gameState.state = 'PLAY';
        gameStatus.textContent = "Your turn!";
        gameState.playerSequence = [];
        gameBoard.style.pointerEvents = 'auto';
    },
    handler: (e) => {
        if (gameState.state !== 'PLAY') return;
        const index = parseInt(e.target.dataset.index);
        
        const light = e.target;
        light.classList.add(`echo-${index+1}`);
        light.classList.remove('is-off');
        playSound(notes[index]);
        setTimeout(() => {
            light.classList.add('is-off');
            light.classList.remove(`echo-${index+1}`);
        }, 300);
        
        gameState.playerSequence.push(index);
        const currentMoveIndex = gameState.playerSequence.length - 1;

        if (gameState.playerSequence[currentMoveIndex] !== gameState.sequence[currentMoveIndex]) {
            gameStatus.textContent = "Wrong! Game Over.";
            playSound('C3', '4n');
            showWinModal('Game Over', `You reached level ${gameState.level}.`);
            gameState.state = 'WATCH';
            return;
        }

        if (gameState.playerSequence.length === gameState.sequence.length) {
            gameState.level++;
            gameState.state = 'WATCH';
            setTimeout(echoGame.nextSequence, 1000);
        }
    },
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
};