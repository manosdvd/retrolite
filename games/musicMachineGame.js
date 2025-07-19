<<<<<<< HEAD
<<<<<<< HEAD
const musicMachineGame = {
=======
export const musicMachineGame = {
>>>>>>> ec8738a (Optimization change)
=======
const musicMachineGame = {
>>>>>>> d91859e (Added some games)
    setup: () => {
        gameState = { sequence: [] };
        musicMachineGame.updateBoard();
        const playButton = createControlButton('Play Song', 'btn-green', musicMachineGame.playSequence);
        const clearButton = createControlButton('Clear', 'btn-yellow', () => {
            gameState.sequence = [];
            musicMachineGame.updateBoard();
        });
        buttonContainer.prepend(clearButton);
        buttonContainer.prepend(playButton);
    },
    handler: async (e) => {
        const index = parseInt(e.target.dataset.index);
        gameState.sequence.push(index);
        playSound(notes[index]);
        const light = e.target;
        light.classList.add('is-highlight', `echo-${index+1}`);
        setTimeout(() => light.classList.remove('is-highlight', `echo-${index+1}`), 300);
    },
    playSequence: async () => {
        if (gameState.isPlaying) return;
        gameState.isPlaying = true;
        for (const noteIndex of gameState.sequence) {
            const light = gameBoard.querySelector(`[data-index='${noteIndex}']`);
            light.classList.add('is-highlight', `echo-${noteIndex+1}`);
            playSound(notes[noteIndex]);
            await delay(300);
            light.classList.remove('is-highlight', `echo-${noteIndex+1}`);
        }
        gameState.isPlaying = false;
    },
<<<<<<< HEAD
    updateBoard: () => {},
    cleanup: () => {
        // No specific cleanup needed as event listeners are managed by main.js
    }
=======
    updateBoard: () => {}
>>>>>>> ec8738a (Optimization change)
};