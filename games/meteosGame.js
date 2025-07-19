// retrogame/games/meteosGame.js

const meteosGame = {
    // --- CONSTANTS ---
    GRAVITY: 0.4, // The force pulling launching blocks down
    LAUNCH_MULTIPLIER: 6, // Determines the initial power of a launch

    setup: () => {
        const width = 7;
        const height = 10;
        gameBoard.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        gameBoard.classList.add('large-grid');

        gameState = {
            width: width,
            height: height,
            board: [],
            numColors: 5,
            score: 0,
            isAnimating: false,
            gameInterval: null,
            timeUntilNextBlocks: 4000, 
            lastBlockTime: Date.now(),
        };

        // Initialize board with enhanced Block objects
        for (let i = 0; i < gameState.width * gameState.height; i++) {
            gameState.board[i] = {
                color: 0, // 0 is empty
                isLaunching: false,
                yOffset: 0,
                velocityY: 0, // For launch physics
                launchPower: 0,
            };
        }

        // Create the lights (cells) for the board
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < gameState.width * gameState.height; i++) {
            const light = document.createElement('div');
            light.classList.add('light', 'is-off');
            light.dataset.index = i;
            const inner = document.createElement('div');
            inner.classList.add('light-inner');
            light.appendChild(inner);
            fragment.appendChild(light);
        }
        gameBoard.appendChild(fragment);

        // Add event listeners for dragging
        gameBoard.addEventListener('mousedown', meteosGame.handleDragStart);
        gameBoard.addEventListener('touchstart', meteosGame.handleDragStart, { passive: false });
        
        meteosGame.prepopulateBoard();
        meteosGame.updateBoard();

        gameState.gameInterval = setInterval(meteosGame.gameTick, 33); // ~30 FPS for smoother animations
        updateStats(`Score: 0`);
        gameStatus.textContent = "Match 3+ to launch blocks!";
    },

    prepopulateBoard: () => {
        const { width, height, board, numColors } = gameState;
        const startRows = 5;
        for (let r = height - 1; r >= height - startRows; r--) {
            for (let c = 0; c < width; c++) {
                const index = r * width + c;
                let newColor;
                do {
                    newColor = Math.floor(Math.random() * numColors) + 1;
                } while (
                    (c > 1 && board[index - 1].color === newColor && board[index - 2].color === newColor) ||
                    (r < height - 2 && board[(r + 1) * width + c].color === newColor && board[(r + 2) * width + c].color === newColor)
                );
                board[index].color = newColor;
            }
        }
    },

    cleanup: () => {
        if (gameState.gameInterval) {
            clearInterval(gameState.gameInterval);
        }
        window.removeEventListener('mouseup', meteosGame.handleDragEnd);
        window.removeEventListener('touchend', meteosGame.handleDragEnd);
        window.removeEventListener('mousemove', meteosGame.handleDragMove);
        window.removeEventListener('touchmove', meteosGame.handleDragMove);
    },

    gameTick: async () => {
        if (gameState.isAnimating) return;
        gameState.isAnimating = true;

        const now = Date.now();
        if (now - gameState.lastBlockTime > gameState.timeUntilNextBlocks) {
            meteosGame.spawnNewRow();
            gameState.lastBlockTime = now;
        }
        
        // Order is important: handle launches, then apply gravity to settled blocks
        await meteosGame.handleLaunches();
        await meteosGame.applyGravity();
        
        meteosGame.updateBoard();

        if (meteosGame.isGameOver()) {
            clearInterval(gameState.gameInterval);
            showWinModal("Game Over", `Final Score: ${gameState.score}`);
            gameState.isAnimating = false;
            return;
        }
        gameState.isAnimating = false;
    },

    spawnNewRow: () => {
        const { width, board, numColors } = gameState;
        for (let c = 0; c < width; c++) {
            if (board[c].color === 0) {
                board[c].color = Math.floor(Math.random() * numColors) + 1;
            }
        }
    },

    handleDragStart: (e) => {
        if (gameState.isAnimating) return;
        e.preventDefault();
        const target = e.target.closest('.light');
        if (!target) return;

        const index = parseInt(target.dataset.index);
        if (gameState.board[index].color === 0) return;

        gameState.dragStart = {
            index: index,
            x: e.clientX || e.touches[0].clientX,
            y: e.clientY || e.touches[0].clientY,
        };

        window.addEventListener('mousemove', meteosGame.handleDragMove);
        window.addEventListener('touchmove', meteosGame.handleDragMove, { passive: false });
        window.addEventListener('mouseup', meteosGame.handleDragEnd, { once: true });
        window.addEventListener('touchend', meteosGame.handleDragEnd, { once: true });
    },

    handleDragMove: (e) => {
        if (!gameState.dragStart) return;
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        const dx = x - gameState.dragStart.x;
        const dy = y - gameState.dragStart.y;
        const threshold = gameBoard.querySelector('.light').offsetHeight * 0.5;

        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
            let direction;
            if (Math.abs(dx) > Math.abs(dy)) {
                direction = dx > 0 ? 'right' : 'left';
            } else {
                direction = dy > 0 ? 'down' : 'up';
            }
            meteosGame.slideBlock(gameState.dragStart.index, direction);
            meteosGame.handleDragEnd();
        }
    },

    handleDragEnd: () => {
        window.removeEventListener('mousemove', meteosGame.handleDragMove);
        window.removeEventListener('touchmove', meteosGame.handleDragMove);
        gameState.dragStart = null;
        meteosGame.findAndLaunch();
    },

    slideBlock: (index, direction) => {
        const { width, height, board } = gameState;
        let targetIndex;
        const r = Math.floor(index / width);

        switch (direction) {
            case 'up': targetIndex = index - width; if (r === 0) return; break;
            case 'down': targetIndex = index + width; if (r === height - 1) return; break;
            case 'left': targetIndex = index - 1; if (index % width === 0) return; break;
            case 'right': targetIndex = index + 1; if (index % width === width - 1) return; break;
        }

        if (targetIndex >= 0 && targetIndex < width * height) {
            [board[index], board[targetIndex]] = [board[targetIndex], board[index]];
            playSound('C3', '32n');
            meteosGame.updateBoard();
        }
    },

    findAndLaunch: async () => {
        let matchedIndices = meteosGame.findMatches();
        if (matchedIndices.size > 0) {
            gameState.score += matchedIndices.size * 10;
            updateStats(`Score: ${gameState.score}`);

            meteosGame.initiateLaunch(matchedIndices);

            for (const index of matchedIndices) {
                gameState.board[index].color = 0;
            }
            // A small delay to let the visual update of removed blocks happen
            await delay(50); 
        }
    },

    findMatches: () => {
        const { width, height, board } = gameState;
        const matches = new Set();
        const checkMatch = (indices) => {
            const firstColor = board[indices[0]].color;
            if (firstColor === 0) return;
            if (indices.every(i => board[i].color === firstColor && !board[i].isLaunching)) {
                indices.forEach(i => matches.add(i));
            }
        };

        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width - 2; c++) {
                checkMatch([r * width + c, r * width + c + 1, r * width + c + 2]);
            }
        }
        for (let c = 0; c < width; c++) {
            for (let r = 0; r < height - 2; r++) {
                checkMatch([r * width + c, (r + 1) * width + c, (r + 2) * width + c]);
            }
        }
        return matches;
    },

    initiateLaunch: (matchedIndices) => {
        const { width, board } = gameState;
        const columnsData = new Map();

        for (const index of matchedIndices) {
            const col = index % width;
            const row = Math.floor(index / width);
            if (!columnsData.has(col)) {
                columnsData.set(col, { launchPower: 0, highestMatchRow: gameState.height });
            }
            columnsData.get(col).launchPower++;
            columnsData.get(col).highestMatchRow = Math.min(columnsData.get(col).highestMatchRow, row);
        }

        for (const [col, data] of columnsData.entries()) {
            const blocksToLaunch = [];
            for (let r = data.highestMatchRow - 1; r >= 0; r--) {
                const blockIndex = r * width + col;
                if (board[blockIndex].color !== 0) {
                    blocksToLaunch.push(board[blockIndex]);
                }
            }

            const stackWeight = blocksToLaunch.length;
            if (data.launchPower >= stackWeight && stackWeight > 0) {
                playSound('A4', '8n');
                for (const block of blocksToLaunch) {
                    block.isLaunching = true;
                    // Give a strong initial upward velocity
                    block.velocityY = -data.launchPower * meteosGame.LAUNCH_MULTIPLIER;
                }
            } else if (stackWeight > 0) {
                playSound('C2', '8n');
            }
        }
    },
    
    applyGravity: async () => {
        const { width, height, board } = gameState;
        let boardChanged = false;

        for (let c = 0; c < width; c++) {
            let lowestEmptyRow = -1;
            for (let r = height - 1; r >= 0; r--) {
                const block = board[r * width + c];
                if (block.color === 0 && !block.isLaunching) {
                    lowestEmptyRow = r;
                    break;
                }
            }

            if (lowestEmptyRow === -1) continue;

            for (let r = lowestEmptyRow - 1; r >= 0; r--) {
                const currentIndex = r * width + c;
                const currentBlock = board[currentIndex];

                if (currentBlock.color !== 0 && !currentBlock.isLaunching) {
                    const targetIndex = lowestEmptyRow * width + c;
                    board[targetIndex] = currentBlock;
                    board[currentIndex] = { color: 0, isLaunching: false, yOffset: 0, velocityY: 0, launchPower: 0 };
                    boardChanged = true;
                    lowestEmptyRow--;
                }
            }
        }
        if (boardChanged) {
            await delay(50); // Short delay for animation
            await meteosGame.applyGravity();
        }
    },

    handleLaunches: async () => {
        const { board, width, height } = gameState;
        const blockHeight = gameBoard.querySelector('.light').offsetHeight;

        for (let i = 0; i < board.length; i++) {
            const block = board[i];
            if (block.isLaunching) {
                // Apply gravity to the block's velocity
                block.velocityY += meteosGame.GRAVITY;
                // Update the block's visual offset
                block.yOffset += block.velocityY;

                // If block flies off the top of the screen, remove it
                if (block.yOffset < -blockHeight) {
                    Object.assign(board[i], { color: 0, isLaunching: false, yOffset: 0, velocityY: 0, launchPower: 0 });
                    gameState.score += 50;
                    updateStats(`Score: ${gameState.score}`);
                    playSound('A5', '16n');
                }
                // If the block is falling back down and hits the "floor" or another block
                else if (block.velocityY > 0 && block.yOffset >= 0) {
                    block.isLaunching = false;
                    block.yOffset = 0;
                    block.velocityY = 0;
                    // The main applyGravity function will handle settling it into the grid.
                }
            }
        }
    },

    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            const block = gameState.board[i];
            const inner = light.querySelector('.light-inner');
            
            const newClassName = `light-inner color-${block.color}`;
            if (inner.className !== newClassName) {
                inner.className = newClassName;
            }

            inner.style.transform = `translateY(${block.yOffset}px)`;
        });
    },

    isGameOver: () => {
        const { width, height, board } = gameState;
        for (let c = 0; c < width; c++) {
            let isColumnFull = true;
            for (let r = 0; r < height; r++) {
                const block = board[r * width + c];
                // A column is only "full" if all blocks are settled
                if (block.color === 0 || block.isLaunching) {
                    isColumnFull = false;
                    break;
                }
            }
            if (isColumnFull) {
                return true;
            }
        }
        return false;
    }
};
