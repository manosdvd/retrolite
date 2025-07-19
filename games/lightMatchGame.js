const lightMatchGame = {
<<<<<<< HEAD
    controller: null,

    setup: () => {
        if (lightMatchGame.controller) lightMatchGame.controller.abort();
        lightMatchGame.controller = new AbortController();
        const { signal } = lightMatchGame.controller;

        const size = 8;
        const numColors = 6;
        gameState = {
            size, numColors, board: [], selected: null, isAnimating: false, score: 0,
            touchStartIndex: null, touchStartX: 0, touchStartY: 0,
        };
        
        gameBoard.classList.add('large-grid');

=======
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

<<<<<<< HEAD
        // Fill board and ensure no initial matches
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
>>>>>>> d91859e (Added some games)
        do {
            for (let i = 0; i < size * size; i++) {
                gameState.board[i] = Math.floor(Math.random() * numColors) + 1;
            }
<<<<<<< HEAD
<<<<<<< HEAD
        } while (lightMatchGame.findMatchData(gameState.board, []).cellsToClear.size > 0);

        lightMatchGame.updateBoard();
        updateStats(`Score: 0`);

        gameBoard.addEventListener('mousedown', lightMatchGame.handleInteractionStart, { signal });
        gameBoard.addEventListener('touchstart', lightMatchGame.handleInteractionStart, { passive: false, signal });
    },

    cleanup: () => {
        if (lightMatchGame.controller) {
            lightMatchGame.controller.abort();
        }
    },

    handleInteractionStart: (e) => {
        if (gameState.isAnimating) return;
        e.preventDefault();
        const target = e.target.closest('.light');
        if (!target) return;
        
        gameState.touchStartIndex = parseInt(target.dataset.index);
        gameState.touchStartX = e.clientX || e.touches[0].clientX;
        gameState.touchStartY = e.clientY || e.touches[0].clientY;

        // Use the AbortController's signal to manage these listeners
        const { signal } = lightMatchGame.controller;
        window.addEventListener('mouseup', lightMatchGame.handleInteractionEnd, { signal });
        window.addEventListener('touchend', lightMatchGame.handleInteractionEnd, { signal });
    },

    handleInteractionEnd: async (e) => {
        // Immediately remove the "end" listeners so they don't fire multiple times
        window.removeEventListener('mouseup', lightMatchGame.handleInteractionEnd);
        window.removeEventListener('touchend', lightMatchGame.handleInteractionEnd);

        if (gameState.touchStartIndex === null) return;
        
        const endX = e.clientX || e.changedTouches[0].clientX;
        const endY = e.clientY || e.changedTouches[0].clientY;

        const dx = endX - gameState.touchStartX;
        const dy = endY - gameState.touchStartY;
        const threshold = 20; // Drag distance threshold

        if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
            // This was a click, not a drag
            lightMatchGame.handleClick(gameState.touchStartIndex);
        } else {
            // This was a drag/swipe
            let targetIndex = -1;
            const startIndex = gameState.touchStartIndex;
            const { size } = gameState;

            if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
                targetIndex = (dx > 0) ? startIndex + 1 : startIndex - 1;
                if (Math.floor(startIndex / size) !== Math.floor(targetIndex / size)) {
                    targetIndex = -1; // Invalid swipe across rows
                }
            } else { // Vertical swipe
                targetIndex = (dy > 0) ? startIndex + size : startIndex - size;
            }

            if (targetIndex >= 0 && targetIndex < size * size) {
                // This 'await' is crucial. The function will pause here until the swap is fully done.
                await lightMatchGame.attemptSwap(startIndex, targetIndex);
            }
        }
        
        // Reset the starting touch index after the action is complete
        gameState.touchStartIndex = null;
    },

    handleClick: (index) => {
        const target = gameBoard.querySelector(`[data-index='${index}']`);
        if (!target) return;

        if (gameState.selected === null) {
            // Nothing is selected, so select this piece
            gameState.selected = index;
            target.classList.add('is-selected');
        } else {
            const first = gameState.selected;
            const second = index;
            
            // Remove the highlight from the previously selected piece
=======
        } while (lightMatchGame.findMatches().length > 0);
=======
        } while (lightMatchGame.findMatchesInBoard(gameState.board).length > 0);
>>>>>>> d91859e (Added some games)

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
<<<<<<< HEAD
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
            
>>>>>>> d91859e (Added some games)
            const firstEl = gameBoard.querySelector(`[data-index='${first}']`);
            if(firstEl) firstEl.classList.remove('is-selected');
            
            gameState.selected = null;

<<<<<<< HEAD
<<<<<<< HEAD
            // Check if the second click is adjacent to the first
            const isAdjacent = Math.abs(first % gameState.size - second % gameState.size) + Math.abs(Math.floor(first / gameState.size) - Math.floor(second / gameState.size)) === 1;

            if (isAdjacent && first !== second) {
                // If adjacent, attempt the swap
=======
            // Check if the selected tiles are adjacent
            const isAdjacent = Math.abs(first % 8 - second % 8) + Math.abs(Math.floor(first / 8) - Math.floor(second / 8)) === 1;

            if (isAdjacent) {
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
            const isAdjacent = Math.abs(first % 8 - second % 8) + Math.abs(Math.floor(first / 8) - Math.floor(second / 8)) === 1;

            if (isAdjacent && first !== second) {
>>>>>>> d91859e (Added some games)
                lightMatchGame.attemptSwap(first, second);
            }
        }
    },

<<<<<<< HEAD
    attemptSwap: async function(index1, index2) {
    if (gameState.isAnimating) return;
    gameState.isAnimating = true;

    // --- THIS IS THE FIX ---
    try {
        // All the logic for swapping, checking matches, and resolving the board
        await this.animateSwap(index1, index2, true);

        const board = gameState.board;
        const originalType1 = board[index1];
        const originalType2 = board[index2];
        const BOMB = 7;

        [board[index1], board[index2]] = [board[index2], board[index1]];

        let bombExploded = false;
        if (originalType1 === BOMB) {
            await this.handleBombExplosion(index2);
            bombExploded = true;
        } else if (originalType2 === BOMB) {
            await this.handleBombExplosion(index1);
            bombExploded = true;
        }

        if (bombExploded) {
            await this.resolveBoard();
        } else {
            const matches = this.findMatchData(board, [index1, index2]).cellsToClear;
            if (matches.size > 0) {
                await this.resolveBoard([index1, index2]);
            } else {
                await delay(150);
                await this.animateSwap(index1, index2, false);
                [board[index1], board[index2]] = [board[index2], board[index1]];
            }
        }

    } finally {
        // This 'finally' block ensures the game always unlocks, fixing the issue.
        gameState.isAnimating = false;
    }
    // --- END OF FIX ---

    if (!this.hasPossibleMoves()) {
        showWinModal("No More Moves!", `Final Score: ${gameState.score}`);
    }
},
    
    handleBombExplosion: async function(bombIndex) {
        playSound('G5', '2n');
        const cellsToClear = new Set([bombIndex]);
        utils.getNeighbors(bombIndex, gameState.size, gameState.size).forEach(n => cellsToClear.add(n));

        gameState.score += cellsToClear.size * 10;
        updateStats(`Score: ${gameState.score}`);

        await this.animateRemoval([...cellsToClear]);
        await this.animateDrop();
        await this.animateRefill();
    },

    animateSwap: async (index1, index2, forward) => {
        if(forward) playSound('C4', '16n');
        else playSound('C3', '16n');
        
=======
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
    
<<<<<<< HEAD
    animateSwap: async (index1, index2) => {
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
    animateSwap: async (index1, index2, forward) => {
        if(forward) playSound('C4', '16n');
        else playSound('C3', '16n');
        
>>>>>>> d91859e (Added some games)
        const el1 = gameBoard.querySelector(`[data-index='${index1}']`);
        const el2 = gameBoard.querySelector(`[data-index='${index2}']`);
        if (!el1 || !el2) return;

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d91859e (Added some games)
        const el1Color = el1.className;
        const el2Color = el2.className;

        el1.className = el2Color;
        el2.className = el1Color;
<<<<<<< HEAD
=======
        // Swap the colors in the board state first
        [gameState.board[index1], gameState.board[index2]] = [gameState.board[index2], gameState.board[index1]];
        
        // Animate the visual swap
        el1.className = `light color-${gameState.board[index1]}`;
        el2.className = `light color-${gameState.board[index2]}`;
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
>>>>>>> d91859e (Added some games)
        
        el1.style.transform = 'scale(0.8)';
        el2.style.transform = 'scale(1.2)';
        await delay(150);
        el1.style.transform = 'scale(1)';
        el2.style.transform = 'scale(1)';
    },

<<<<<<< HEAD
    resolveBoard: async function(swappedIndices = []) {
        let chain = 1;
        while (true) {
            let matchData = this.findMatchData(gameState.board, swappedIndices);
            let cellsToClear = matchData.cellsToClear;
            
            if (cellsToClear.size === 0) break;
            
            playSound(notes[chain % notes.length], '8n');
            gameState.score += cellsToClear.size * 10 * chain;
            updateStats(`Score: ${gameState.score}`);

            const bombsToCreate = matchData.bombsToCreate;

            await this.animateRemoval([...cellsToClear]);

            bombsToCreate.forEach(index => {
                if (cellsToClear.has(index)) {
                    gameState.board[index] = 7;
                }
            });
            
            await this.animateDrop();
            await this.animateRefill();
            
            swappedIndices = [];
            chain++;
        }
    },

    findMatchData: (board, swappedIndices) => {
        const { size } = gameState;
        const cellsToClear = new Set();
        const bombsToCreate = [];
        const runs = [];
        const BOMB = 7;

        const checkRun = (indices, type) => {
            if (indices.some(i => board[i] === 0)) return;
            const nonBombs = indices.map(i => board[i]).filter(c => c !== BOMB);
            if (nonBombs.length === 0) return; // All bombs, no match
            const dominantColor = nonBombs[0];
            if (nonBombs.every(c => c === dominantColor)) {
                runs.push({ indices, type });
            }
        };

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (c <= size - 3) checkRun([r*size+c, r*size+c+1, r*size+c+2], 'h');
                if (c <= size - 4) checkRun([r*size+c, r*size+c+1, r*size+c+2, r*size+c+3], 'h');
                if (c <= size - 5) checkRun([r*size+c, r*size+c+1, r*size+c+2, r*size+c+3, r*size+c+4], 'h');
                if (r <= size - 3) checkRun([r*size+c, (r+1)*size+c, (r+2)*size+c], 'v');
                if (r <= size - 4) checkRun([r*size+c, (r+1)*size+c, (r+2)*size+c, (r+3)*size+c], 'v');
                if (r <= size - 5) checkRun([r*size+c, (r+1)*size+c, (r+2)*size+c, (r+3)*size+c, (r+4)*size+c], 'v');
            }
        }
        
        if (runs.length === 0) return { cellsToClear, bombsToCreate };

        const bombCandidates = new Set();
        runs.forEach(run => {
            run.indices.forEach(i => cellsToClear.add(i));
            if (run.indices.length >= 4) {
                run.indices.forEach(i => bombCandidates.add(i));
            }
        });

        for (let i = 0; i < runs.length; i++) {
            for (let j = i + 1; j < runs.length; j++) {
                if (runs[i].type === runs[j].type) continue;
                const intersection = runs[i].indices.find(idx => runs[j].indices.includes(idx));
                if (intersection) bombCandidates.add(intersection);
            }
        }
        
        const preferredBombLoc = swappedIndices.find(idx => bombCandidates.has(idx) && cellsToClear.has(idx));
        if (preferredBombLoc) {
            bombsToCreate.push(preferredBombLoc);
        } else if (bombCandidates.size > 0) {
            const potentialSpots = [...bombCandidates].filter(idx => cellsToClear.has(idx));
            if(potentialSpots.length > 0) bombsToCreate.push(potentialSpots[0]);
        }

        return { cellsToClear, bombsToCreate };
=======
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
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
    },

    animateRemoval: async (matches) => {
        matches.forEach(index => {
            const el = gameBoard.querySelector(`[data-index='${index}']`);
            if (el) el.classList.add('is-removing');
<<<<<<< HEAD
            gameState.board[index] = 0;
        });
        await delay(200);
        lightMatchGame.updateBoard();
    },

    animateDrop: async () => {
        const { size, board } = gameState;
=======
        });
        await delay(200);
        
        matches.forEach(index => {
            gameState.board[index] = 0; // Mark as empty in the state
        });
        lightMatchGame.updateBoard(); // Visually remove them
    },

    animateDrop: async () => {
        const { size } = gameState;
<<<<<<< HEAD
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
        const board = gameState.board;
>>>>>>> d91859e (Added some games)
        for (let c = 0; c < size; c++) {
            let emptyRow = size - 1;
            for (let r = size - 1; r >= 0; r--) {
                const index = r * size + c;
<<<<<<< HEAD
<<<<<<< HEAD
                if (board[index] !== 0) {
                    const fallToIndex = emptyRow * size + c;
                    if (index !== fallToIndex) {
                        [board[index], board[fallToIndex]] = [board[fallToIndex], board[index]];
=======
                if (gameState.board[index] !== 0) {
                    const fallToIndex = emptyRow * size + c;
                    if (index !== fallToIndex) {
                        [gameState.board[index], gameState.board[fallToIndex]] = [gameState.board[fallToIndex], gameState.board[index]];
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
                if (board[index] !== 0) {
                    const fallToIndex = emptyRow * size + c;
                    if (index !== fallToIndex) {
                        [board[index], board[fallToIndex]] = [board[fallToIndex], board[index]];
>>>>>>> d91859e (Added some games)
                    }
                    emptyRow--;
                }
            }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        await delay(200);
=======
        await delay(100);
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
        await delay(200);
>>>>>>> d91859e (Added some games)
        lightMatchGame.updateBoard();
    },

    animateRefill: async () => {
<<<<<<< HEAD
        const { size, numColors, board } = gameState;
        let changed = false;
        for (let i = 0; i < size * size; i++) {
            if (board[i] === 0) {
                changed = true;
                board[i] = Math.floor(Math.random() * numColors) + 1;
                const el = gameBoard.querySelector(`[data-index='${i}']`);
                if(el) el.classList.add('is-appearing');
            }
        }
        if (changed) {
            await delay(200);
            lightMatchGame.updateBoard();
        }
=======
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
<<<<<<< HEAD
        await delay(100);
        lightMatchGame.updateBoard();
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
        if (changed) {
            await delay(200);
            lightMatchGame.updateBoard();
        }
>>>>>>> d91859e (Added some games)
    },

    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('[data-index]');
<<<<<<< HEAD
<<<<<<< HEAD
        lights.forEach(light => {
            const index = parseInt(light.dataset.index);
            const color = gameState.board[index];
            const isBomb = color === 7;
            const currentClasses = `light color-${color} ${isBomb ? 'bomb' : ''}`;
            
            if (light.className !== currentClasses) {
                light.className = 'light';
=======
        lights.forEach(light => {
            const index = parseInt(light.dataset.index);
            const color = gameState.board[index];
            const currentClasses = `light color-${color}`;
            
            // Only update class if it's different to avoid interrupting animations
            if (light.className !== currentClasses) {
                light.className = 'light'; // Reset
>>>>>>> d91859e (Added some games)
                if (color > 0) {
                    light.classList.add(`color-${color}`);
                } else {
                    light.classList.add('is-off');
                }
            }
<<<<<<< HEAD
            if (gameState.selected === index) {
                light.classList.add('is-selected');
            } else {
                light.classList.remove('is-selected');
=======
        lights.forEach((light, i) => {
            const color = gameState.board[i];
            light.className = 'light'; // Reset
            if (color > 0) {
                light.classList.add(`color-${color}`);
            } else {
                light.classList.add('is-off');
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
            // Ensure selection highlight is correct
            if (gameState.selected === index) {
                light.classList.add('is-selected');
            } else {
                light.classList.remove('is-selected');
>>>>>>> d91859e (Added some games)
            }
        });
    },

    hasPossibleMoves: () => {
        const { size, board } = gameState;
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
        const tempBoard = [...board];
>>>>>>> d91859e (Added some games)
        // Check for horizontal swaps
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size - 1; c++) {
                const i1 = r * size + c;
                const i2 = r * size + c + 1;
<<<<<<< HEAD
<<<<<<< HEAD
                const tempBoard = [...board];
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]];
                if (lightMatchGame.findMatchData(tempBoard, []).cellsToClear.size > 0) return true;
            }
        }
=======
                [board[i1], board[i2]] = [board[i2], board[i1]]; // Swap
                if (lightMatchGame.findMatches().length > 0) {
                    [board[i1], board[i2]] = [board[i2], board[i1]]; // Swap back
                    return true;
=======
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap
                if (lightMatchGame.findMatchesInBoard(tempBoard).length > 0) {
                    return true; // Found a move
>>>>>>> d91859e (Added some games)
                }
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap back
            }
        }
        // Check for vertical swaps
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
        for (let c = 0; c < size; c++) {
            for (let r = 0; r < size - 1; r++) {
                const i1 = r * size + c;
                const i2 = (r + 1) * size + c;
<<<<<<< HEAD
<<<<<<< HEAD
                const tempBoard = [...board];
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]];
                if (lightMatchGame.findMatchData(tempBoard, []).cellsToClear.size > 0) return true;
=======
                [board[i1], board[i2]] = [board[i2], board[i1]]; // Swap
                if (lightMatchGame.findMatches().length > 0) {
                    [board[i1], board[i2]] = [board[i2], board[i1]]; // Swap back
                    return true;
                }
                [board[i1], board[i2]] = [board[i2], board[i1]]; // Swap back
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap
                if (lightMatchGame.findMatchesInBoard(tempBoard).length > 0) {
                    return true; // Found a move
                }
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]]; // Swap back
>>>>>>> d91859e (Added some games)
            }
        }
        return false;
    }
<<<<<<< HEAD
<<<<<<< HEAD
};
=======
};
>>>>>>> 8ba1d5f (Added a Bejeweled style game)
=======
};
>>>>>>> d91859e (Added some games)
