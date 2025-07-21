const lightMatchGame = {
    setup: () => {
        const size = 8;
        const numColors = 6;
        gameState = {
            size, numColors, board: [], selected: null, isAnimating: false, score: 0,
            touchStartIndex: null, touchStartX: 0, touchStartY: 0,
        };
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gameBoard.classList.add('large-grid');

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < size * size; i++) {
            const light = document.createElement('div');
            light.classList.add('light');
            light.dataset.index = i;
            fragment.appendChild(light);
        }
        gameBoard.appendChild(fragment);

        do {
            for (let i = 0; i < size * size; i++) {
                gameState.board[i] = Math.floor(Math.random() * numColors) + 1;
            }
        } while (lightMatchGame.findMatchesInBoard(gameState.board).length > 0);

        lightMatchGame.updateBoard();
        updateStats(`Score: 0`);

        gameBoard.addEventListener('mousedown', lightMatchGame.handleInteractionStart);
        gameBoard.addEventListener('touchstart', lightMatchGame.handleInteractionStart, { passive: false });
    },

    cleanup: () => {
        window.removeEventListener('mouseup', lightMatchGame.handleInteractionEnd);
        window.removeEventListener('touchend', lightMatchGame.handleInteractionEnd);
    },

    handleInteractionStart: (e) => {
        if (gameState.isAnimating) return;
        e.preventDefault();
        const target = e.target.closest('.light');
        if (!target) return;
        
        gameState.touchStartIndex = parseInt(target.dataset.index);
        gameState.touchStartX = e.clientX || e.touches[0].clientX;
        gameState.touchStartY = e.clientY || e.touches[0].clientY;

        window.addEventListener('mouseup', lightMatchGame.handleInteractionEnd);
        window.addEventListener('touchend', lightMatchGame.handleInteractionEnd);
    },

    handleInteractionEnd: (e) => {
        if (gameState.touchStartIndex === null) return;
        
        const endX = e.clientX || e.changedTouches[0].clientX;
        const endY = e.clientY || e.changedTouches[0].clientY;

        const dx = endX - gameState.touchStartX;
        const dy = endY - gameState.touchStartY;
        const threshold = 20; // Min distance for a swipe

        if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
            // It's a click, not a swipe
            lightMatchGame.handleClick(gameState.touchStartIndex);
        } else {
            // It's a swipe
            let targetIndex = -1;
            const startIndex = gameState.touchStartIndex;
            const { size } = gameState;

            if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
                targetIndex = (dx > 0) ? startIndex + 1 : startIndex - 1;
                // Prevent wrapping rows
                if (Math.floor(startIndex / size) !== Math.floor(targetIndex / size)) {
                    targetIndex = -1;
                }
            } else { // Vertical swipe
                targetIndex = (dy > 0) ? startIndex + size : startIndex - size;
            }

            if (targetIndex >= 0 && targetIndex < size * size) {
                lightMatchGame.attemptSwap(startIndex, targetIndex);
            }
        }
        
        gameState.touchStartIndex = null;
        lightMatchGame.cleanup();
    },

    handleClick: (index) => {
        const target = gameBoard.querySelector(`[data-index='${index}']`);
        if (!target) return;

        if (gameState.selected === null) {
            gameState.selected = index;
            target.classList.add('is-selected');
        } else {
            const first = gameState.selected;
            const second = index;
            
            const firstEl = gameBoard.querySelector(`[data-index='${first}']`);
            if(firstEl) firstEl.classList.remove('is-selected');
            
            gameState.selected = null;

            const isAdjacent = Math.abs(first % 8 - second % 8) + Math.abs(Math.floor(first / 8) - Math.floor(second / 8)) === 1;

            if (isAdjacent && first !== second) {
                lightMatchGame.attemptSwap(first, second);
            }
        }
    },

    attemptSwap: async (index1, index2) => {
        if (gameState.isAnimating) return;
        gameState.isAnimating = true;

        await lightMatchGame.animateSwap(index1, index2, true);
        
        const tempBoard = [...gameState.board];
        [tempBoard[index1], tempBoard[index2]] = [tempBoard[index2], tempBoard[index1]];
        
        const matches = lightMatchGame.findMatchesInBoard(tempBoard);
        if (matches.length > 0) {
            gameState.board = tempBoard;
            await lightMatchGame.resolveBoard();
        } else {
            await delay(150);
            await lightMatchGame.animateSwap(index1, index2, false); // Swap back
        }
        gameState.isAnimating = false;

        if (!lightMatchGame.hasPossibleMoves()) {
            if (gauntlet.isActive) {
                gauntlet.onGameComplete(gameState.score >= 1000);
            } else {
                showWinModal("No More Moves!", `Final Score: ${gameState.score}`);
            }
        }
    },
    
    animateSwap: async (index1, index2, forward) => {
        if(forward) playSound('C4', '16n');
        else playSound('C3', '16n');
        
        const el1 = gameBoard.querySelector(`[data-index='${index1}']`);
        const el2 = gameBoard.querySelector(`[data-index='${index2}']`);
        if (!el1 || !el2) return;

        const el1Color = el1.className;
        const el2Color = el2.className;

        el1.className = el2Color;
        el2.className = el1Color;
        
        el1.style.transform = 'scale(0.8)';
        el2.style.transform = 'scale(1.2)';
        await delay(150);
        el1.style.transform = 'scale(1)';
        el2.style.transform = 'scale(1)';
    },

    resolveBoard: async () => {
        let chain = 1;
        while (true) {
            const matches = lightMatchGame.findMatchesInBoard(gameState.board);
            if (matches.length === 0) break;
            
            playSound(notes[chain % notes.length], '8n');
            gameState.score += matches.length * 10 * chain;
            updateStats(`Score: ${gameState.score}`);

            await lightMatchGame.animateRemoval(matches);
            await lightMatchGame.animateDrop();
            await lightMatchGame.animateRefill();
            chain++;

            if(gauntlet.isActive && gameState.score >= 1000){
                gauntlet.onGameComplete(true);
                return;
            }
        }
    },

    findMatchesInBoard: (board) => {
        const matches = new Set();
        const { size } = gameState;
        // Horizontal matches
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size - 2; c++) {
                const i = r * size + c;
                if (board[i] && board[i] === board[i+1] && board[i] === board[i+2]) {
                    matches.add(i); matches.add(i+1); matches.add(i+2);
                }
            }
        }
        // Vertical matches
        for (let c = 0; c < size; c++) {
            for (let r = 0; r < size - 2; r++) {
                const i = r * size + c;
                if (board[i] && board[i] === board[i + size] && board[i] === board[i + 2 * size]) {
                    matches.add(i); matches.add(i + size); matches.add(i + 2 * size);
                }
            }
        }
        return [...matches];
    },

    animateRemoval: async (matches) => {
        matches.forEach(index => {
            const el = gameBoard.querySelector(`[data-index='${index}']`);
            if (el) el.classList.add('is-removing');
        });
        await delay(200);
        
        matches.forEach(index => {
            gameState.board[index] = 0; // Mark as empty in the state
        });
        lightMatchGame.updateBoard(); // Visually remove them
    },

    animateDrop: async () => {
        const { size } = gameState;
        const board = gameState.board;
        for (let c = 0; c < size; c++) {
            let emptyRow = size - 1;
            for (let r = size - 1; r >= 0; r--) {
                const index = r * size + c;
                if (board[index] !== 0) {
                    const fallToIndex = emptyRow * size + c;
                    if (index !== fallToIndex) {
                        [board[index], board[fallToIndex]] = [board[fallToIndex], board[index]];
                    }
                    emptyRow--;
                }
            }
        }
        await delay(200);
        lightMatchGame.updateBoard();
    },

    animateRefill: async () => {
        const { size, numColors } = gameState;
        let changed = false;
        for (let i = 0; i < size * size; i++) {
            if (gameState.board[i] === 0) {
                changed = true;
                gameState.board[i] = Math.floor(Math.random() * numColors) + 1;
                const el = gameBoard.querySelector(`[data-index='${i}']`);
                if(el) el.classList.add('is-appearing');
            }
        }
        if (changed) {
            await delay(200);
            lightMatchGame.updateBoard();
        }
    },

    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('[data-index]');
        lights.forEach(light => {
            const index = parseInt(light.dataset.index);
            const color = gameState.board[index];
            const currentClasses = `light color-${color}`;
            
            // Only update class if it's different to avoid interrupting animations
            if (light.className !== currentClasses) {
                light.className = 'light'; // Reset
                if (color > 0) {
                    light.classList.add(`color-${color}`);
                } else {
                    light.classList.add('is-off');
                }
            }
            // Ensure selection highlight is correct
            if (gameState.selected === index) {
                light.classList.add('is-selected');
            } else {
                light.classList.remove('is-selected');
            }
        });
    },

    hasPossibleMoves: () => {
        const { size, board } = gameState;
        const tempBoard = [...board];
        // Check for horizontal swaps
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size - 1; c++) {
                const i1 = r * size + c;
                const i2 = r * size + c + 1;
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap
                if (lightMatchGame.findMatchesInBoard(tempBoard).length > 0) {
                    return true; // Found a move
                }
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap back
            }
        }
        // Check for vertical swaps
        for (let c = 0; c < size; c++) {
            for (let r = 0; r < size - 1; r++) {
                const i1 = r * size + c;
                const i2 = (r + 1) * size + c;
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap
                if (lightMatchGame.findMatchesInBoard(tempBoard).length > 0) {
                    return true; // Found a move
                }
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap back
            }
        }
        return false;
    }
};