const musicMachineGame = {
    controller: null,
    setup: () => {
        if (musicMachineGame.controller) {
            musicMachineGame.controller.abort();
        }
        musicMachineGame.controller = new AbortController();

        gameState = { sequence: [], isPlaying: false };
        musicMachineGame.updateBoard();
        const playButton = createControlButton('Play Song', 'btn-green', musicMachineGame.playSequence, 'play_circle');
        const clearButton = createControlButton('Clear', 'btn-yellow', () => {
            gameState.sequence = [];
            musicMachineGame.updateBoard();
        }, 'delete');
        buttonContainer.prepend(clearButton);
        buttonContainer.prepend(playButton);
    },
    handler: async (e) => {
        const index = parseInt(e.target.dataset.index);
        gameState.sequence.push(index);
        audioManager.playSound('game', notes[index]);
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        const light = e.target;
        light.classList.add('is-highlight', `echo-${index+1}`);
        setTimeout(() => light.classList.remove('is-highlight', `echo-${index+1}`), 300);
    },
    playSequence: async () => {
        if (gameState.isPlaying) return;
        gameState.isPlaying = true;
        const { signal } = musicMachineGame.controller;

        for (const noteIndex of gameState.sequence) {
            if (signal.aborted) {
                break; 
            }
            const light = gameBoard.querySelector(`[data-index='${noteIndex}']`);
            if (light) {
                light.classList.add('is-highlight', `echo-${noteIndex+1}`);
                audioManager.playSound('game', notes[noteIndex]);
                await delay(300);
                light.classList.remove('is-highlight', `echo-${noteIndex+1}`);
            }
        }
        gameState.isPlaying = false;
    },
    updateBoard: () => {},
    cleanup: () => {
        if (musicMachineGame.controller) {
            musicMachineGame.controller.abort();
        }
        gameState.isPlaying = false;
    }
};