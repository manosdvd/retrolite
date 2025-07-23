const lightMatchGame = {
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

        do {
            for (let i = 0; i < size * size; i++) {
                gameState.board[i] = Math.floor(Math.random() * numColors) + 1;
            }
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

        const { signal } = lightMatchGame.controller;
        window.addEventListener('mouseup', lightMatchGame.handleInteractionEnd, { signal });
        window.addEventListener('touchend', lightMatchGame.handleInteractionEnd, { signal });
    },

    handleInteractionEnd: (e) => {
        if (gameState.touchStartIndex === null) return;
        
        const endX = e.clientX || e.changedTouches[0].clientX;
        const endY = e.clientY || e.changedTouches[0].clientY;

        const dx = endX - gameState.touchStartX;
        const dy = endY - gameState.touchStartY;
        const threshold = 20;

        if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
            lightMatchGame.handleClick(gameState.touchStartIndex);
        } else {
            let targetIndex = -1;
            const startIndex = gameState.touchStartIndex;
            const { size } = gameState;

            if (Math.abs(dx) > Math.abs(dy)) {
                targetIndex = (dx > 0) ? startIndex + 1 : startIndex - 1;
                if (Math.floor(startIndex / size) !== Math.floor(targetIndex / size)) {
                    targetIndex = -1;
                }
            } else {
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

    attemptSwap: async function(index1, index2) {
        if (gameState.isAnimating) return;
        gameState.isAnimating = true;

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

        gameState.isAnimating = false;
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
    },

    animateRemoval: async (matches) => {
        matches.forEach(index => {
            const el = gameBoard.querySelector(`[data-index='${index}']`);
            if (el) el.classList.add('is-removing');
            gameState.board[index] = 0;
        });
        await delay(200);
        lightMatchGame.updateBoard();
    },

    animateDrop: async () => {
        const { size, board } = gameState;
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
    },

    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('[data-index]');
        lights.forEach(light => {
            const index = parseInt(light.dataset.index);
            const color = gameState.board[index];
            const isBomb = color === 7;
            const currentClasses = `light color-${color} ${isBomb ? 'bomb' : ''}`;
            
            if (light.className !== currentClasses) {
                light.className = 'light';
                if (color > 0) {
                    light.classList.add(`color-${color}`);
                } else {
                    light.classList.add('is-off');
                }
            }
            if (gameState.selected === index) {
                light.classList.add('is-selected');
            } else {
                light.classList.remove('is-selected');
            }
        });
    },

    hasPossibleMoves: () => {
        const { size, board } = gameState;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size - 1; c++) {
                const i1 = r * size + c;
                const i2 = r * size + c + 1;
                const tempBoard = [...board];
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]];
                if (lightMatchGame.findMatchData(tempBoard, []).cellsToClear.size > 0) return true;
            }
        }
        for (let c = 0; c < size; c++) {
            for (let r = 0; r < size - 1; r++) {
                const i1 = r * size + c;
                const i2 = (r + 1) * size + c;
                const tempBoard = [...board];
                [tempBoard[i1], tempBoard[i2]] = [tempBoard[i2], tempBoard[i1]];
                if (lightMatchGame.findMatchData(tempBoard, []).cellsToClear.size > 0) return true;
            }
        }
        return false;
    }
};