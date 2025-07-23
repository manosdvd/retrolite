const meteosGame = {
    setup: () => {
        // 1. Inject custom HTML for the game
        gameBoard.innerHTML = `
            <div id="game-wrapper">
                <div id="game-info" class="w-full mx-auto flex flex-col items-center gap-2 p-2 pt-4">
                    <div class="w-full flex justify-between items-center px-2">
                        <div class="text-xl sm:text-2xl font-semibold">Score: <span id="score">0</span></div>
                    </div>
                    <div id="preview-bar" class="w-full mt-2"></div>
                </div>
                <div id="grid-container"></div>
            </div>
            <div id="animation-pool"></div>
        `;

        // The modal will be created and appended to the modalContainer, not the gameBoard
        modalContainer.innerHTML = `
            <div id="game-over-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 pointer-events-none transform scale-95 p-4">
                <div class="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg text-center border-2 border-cyan-500">
                    <h2 class="text-4xl sm:text-5xl font-bold mb-4 text-red-500">Game Over</h2>
                    <p class="text-xl sm:text-2xl mb-2">Final Score: <span id="final-score">0</span></p>
                    <button id="restart-button" class="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg sm:text-xl">
                        Play Again
                    </button>
                </div>
            </div>
        `;


        

        // 3. Run the game's script
        meteosGame.runGameScript();
    },

    cleanup: () => {
        // Remove the custom style when the game is exited
        const style = document.getElementById('meteos-game-style');
        if (style) {
            style.remove();
        }
        // Clear any intervals from the game
        if (meteosGame.previewTimer) {
            clearInterval(meteosGame.previewTimer);
        }
        // Clear the modal container
        modalContainer.innerHTML = '';
    },

    runGameScript: () => {
        // --- GAME CONFIGURATION ---
        const GRID_WIDTH = 8;
        const GRID_HEIGHT = 12;
        const INITIAL_PREVIEW_INTERVAL = 750;
        const MIN_PREVIEW_INTERVAL = 250;
        const INTERVAL_DECREMENT = 50;
        const COLORS = [
            'var(--color-1)', 'var(--color-2)', 'var(--color-3)',
            'var(--color-4)', 'var(--color-5)', 'var(--color-6)'
        ];
        const ANIMATION_DELAY = 200;
        const FALL_ANIMATION_DURATION = 400;
        const DRAG_LOCK_THRESHOLD = 20; // Increased threshold

        // --- DOM ELEMENT CACHE ---
        const gridContainer = document.getElementById('grid-container');
        const scoreDisplay = document.getElementById('score');
        const previewBar = document.getElementById('preview-bar');
        const gameOverModal = document.getElementById('game-over-modal');
        const finalScoreDisplay = document.getElementById('final-score');
        const restartButton = document.getElementById('restart-button');
        const animationPoolContainer = document.getElementById('animation-pool');

        // --- GAME STATE ---
        let grid = [];
        let score = 0;
        let isGameOver = false;
        let isProcessing = false;
        let previewRow = [];
        let previewIndex = 0;
        let previewTimer;
        let previewBlockIntervalMs;
        let dragState = {};
        let animationPool = [];
        let cellWidth, cellHeight;

        // --- AUDIO SYNTHS ---
        let matchSynth, slideSynth, gameOverSynth, dropSynth;

        // --- UTILITY FUNCTIONS ---
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const requestNextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
        const lockGame = () => isProcessing = true;
        const unlockGame = () => isProcessing = false;

        // --- INITIALIZATION ---
        function init() {
            lockGame();
            isGameOver = false;
            score = 0;
            previewBlockIntervalMs = INITIAL_PREVIEW_INTERVAL;
            updateScore();
            createInitialGrid();
            renderGrid();
            setupPreviewBar();
            if (gameOverModal) {
                gameOverModal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            }
            startPreviewTimer();
            unlockGame();
        }

        function setupAudio() {
            if (typeof Tone === 'undefined') return;
            if (Tone.context.state !== 'running') Tone.start();
            matchSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'fmsine' }, envelope: { attack: 0.01, decay: 0.2, release: 0.1 } }).toDestination();
            slideSynth = new Tone.Synth({ oscillator: { type: 'sine' }, volume: -10, envelope: { attack: 0.01, decay: 0.1, release: 0.1 } }).toDestination();
            gameOverSynth = new Tone.Synth({ oscillator: { type: 'fatsawtooth' }, envelope: { attack: 0.1, decay: 0.5, release: 1 } }).toDestination();
            dropSynth = new Tone.MembraneSynth({ envelope: { attack: 0.01, decay: 0.3, release: 0.2 } }).toDestination();
        }

        function createInitialGrid() {
            grid = [];
            const startRow = Math.floor(GRID_HEIGHT * 2 / 3);
            for (let y = 0; y < GRID_HEIGHT; y++) {
                const row = [];
                for (let x = 0; x < GRID_WIDTH; x++) {
                    row.push(y >= startRow ? getRandomColor() : null);
                }
                grid.push(row);
            }
            while (true) {
                const matches = findMatches();
                if (matches.length === 0) break;
                matches.forEach(({x, y}) => {
                    let newColor;
                    do { newColor = getRandomColor(); } while (newColor === grid[y][x]);
                    grid[y][x] = newColor;
                });
            }
        }
        
        function createAnimationPool() {
            if (!animationPoolContainer) return;
            animationPoolContainer.innerHTML = '';
            animationPool = [];
            for (let i = 0; i < GRID_WIDTH; i++) {
                const block = document.createElement('div');
                block.className = 'block falling-block';
                animationPoolContainer.appendChild(block);
                animationPool.push(block);
            }
        }

        function getRandomColor() {
            return COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        // --- RENDERING & UI ---
        function renderGrid() {
            if (!gridContainer) return;
            gridContainer.innerHTML = '';
            const gridRect = gridContainer.getBoundingClientRect();
            cellWidth = (gridRect.width - (GRID_WIDTH + 1) * 4) / GRID_WIDTH;
            cellHeight = (gridRect.height - (GRID_HEIGHT + 1) * 4) / GRID_HEIGHT;
            
            grid.forEach((row, y) => {
                row.forEach((color, x) => {
                    if (color) {
                        const block = document.createElement('div');
                        block.classList.add('block');
                        block.style.backgroundColor = color;
                        block.style.width = `${cellWidth}px`;
                        block.style.height = `${cellHeight}px`;
                        block.style.transform = `translate(${x * (cellWidth + 4)}px, ${y * (cellHeight + 4)}px)`;
                        block.dataset.x = x;
                        block.dataset.y = y;
                        block.addEventListener('mousedown', handleDragStart);
                        block.addEventListener('touchstart', handleDragStart, { passive: false });
                        gridContainer.appendChild(block);
                    }
                });
            });
        }

        function setupPreviewBar() {
            if (!previewBar) return;
            previewBar.innerHTML = '';
            previewBar.style.gridTemplateColumns = `repeat(${GRID_WIDTH}, 1fr)`;
            previewRow = Array(GRID_WIDTH).fill(null);
            previewIndex = 0;
            for (let i = 0; i < GRID_WIDTH; i++) {
                const block = document.createElement('div');
                block.classList.add('preview-block');
                previewBar.appendChild(block);
            }
        }

        function updatePreviewBar() {
            if (!previewBar) return;
            const previewBlocks = previewBar.children;
            for (let i = 0; i < GRID_WIDTH; i++) {
                if(previewBlocks[i]) {
                    previewBlocks[i].style.backgroundColor = previewRow[i] || '#4a5568';
                }
            }
        }

        // --- DRAG AND SLIDE LOGIC (TACTILE COLOR SWAP) ---
        function handleDragStart(e) {
            if (isProcessing || isGameOver) return;
            e.preventDefault();
            lockGame();

            const element = e.target;
            const startX = parseInt(element.dataset.x);
            const startY = parseInt(element.dataset.y);
            
            const allBlocks = gridContainer.querySelectorAll('.block');
            allBlocks.forEach(el => el.style.transition = 'transform 0.2s ease, opacity 0.25s ease');
            
            dragState = {
                element,
                startX,
                startY,
                gridRect: gridContainer.getBoundingClientRect(),
                lock: null,
                lastTargetX: startX,
                lastTargetY: startY,
            };

            element.classList.add('dragging-origin');
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('touchmove', handleDragMove, { passive: false });
            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchend', handleDragEnd);
        }

        function handleDragMove(e) {
            if (!dragState.element) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            // Determine lock if not already set
            if (!dragState.lock) {
                // Calculate initial direction and set lock
                const dx = clientX - (dragState.gridRect.left + (dragState.startX + 0.5) * (cellWidth + 4));
                const dy = clientY - (dragState.gridRect.top + (dragState.startY + 0.5) * (cellHeight + 4));

                if (Math.abs(dx) > DRAG_LOCK_THRESHOLD || Math.abs(dy) > DRAG_LOCK_THRESHOLD) {
                    dragState.lock = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
                }
            }

            // --- OPTIMIZATION ---
            // Instead of updating visuals here, we just calculate the target
            // and store it. The actual move logic happens in handleDragEnd.
            const { gridRect, startX, startY, lock } = dragState;
            let targetX = Math.round((clientX - gridRect.left) / (cellWidth + 4));
            let targetY = Math.round((clientY - gridRect.top) / (cellHeight + 4));
            targetX = Math.max(0, Math.min(GRID_WIDTH - 1, targetX));
            targetY = Math.max(0, Math.min(GRID_HEIGHT - 1, targetY));

            if (lock === 'horizontal') {
                dragState.lastTargetX = targetX;
                dragState.lastTargetY = startY; // Ensure Y is locked
            } else if (lock === 'vertical') {
                dragState.lastTargetX = startX; // Ensure X is locked
                dragState.lastTargetY = targetY;
            }
            updateVisualSwap(clientX, clientY);
        }
        
        function updateVisualSwap(clientX, clientY) {
            const { gridRect, startX, startY, lock, lastTargetX, lastTargetY } = dragState;
            
            let targetX = Math.round((clientX - gridRect.left) / (cellWidth + 4));
            let targetY = Math.round((clientY - gridRect.top) / (cellHeight + 4));
            targetX = Math.max(0, Math.min(GRID_WIDTH - 1, targetX));
            targetY = Math.max(0, Math.min(GRID_HEIGHT - 1, targetY));

            if (lock === 'horizontal') {
                targetY = startY;
                let leftOfStack = 0;
                while(grid[startY][leftOfStack] === null && leftOfStack < GRID_WIDTH -1) leftOfStack++;
                let rightOfStack = GRID_WIDTH - 1;
                while(grid[startY][rightOfStack] === null && rightOfStack > 0) rightOfStack--;
                targetX = Math.max(leftOfStack, Math.min(targetX, rightOfStack));
            } else if (lock === 'vertical') {
                targetX = startX;
                let topOfStack = 0;
                while(grid[topOfStack][startX] === null && topOfStack < GRID_HEIGHT -1) topOfStack++;
                let bottomOfStack = GRID_HEIGHT - 1;
                while(grid[bottomOfStack][startX] === null && bottomOfStack > 0) bottomOfStack--;
                targetY = Math.max(topOfStack, Math.min(targetY, bottomOfStack));
            } else {
                return;
            }

            if (targetX === lastTargetX && targetY === lastTargetY) return;
            dragState.lastTargetX = targetX;
            dragState.lastTargetY = targetY;

            if (lock === 'horizontal') {
                const rowElements = Array.from(gridContainer.querySelectorAll(`[data-y='${startY}']`))
                    .sort((a,b) => parseInt(a.dataset.x) - parseInt(b.dataset.x));
                const rowData = grid[startY].filter(Boolean);
                const leftOfStack = parseInt(rowElements[0].dataset.x);

                const tempColors = [...rowData];
                const movedColor = tempColors.splice(startX - leftOfStack, 1)[0];
                tempColors.splice(targetX - leftOfStack, 0, movedColor);
                rowElements.forEach((el, index) => {
                    el.style.backgroundColor = tempColors[index];
                });
            } else if (lock === 'vertical') {
                const columnElements = Array.from(gridContainer.querySelectorAll(`[data-x='${startX}']`))
                    .sort((a, b) => parseInt(a.dataset.y) - parseInt(b.dataset.y));
                const columnData = grid.map(row => row[startX]).filter(Boolean);
                const topOfStack = parseInt(columnElements[0].dataset.y);
                
                const tempColors = [...columnData];
                const movedColor = tempColors.splice(startY - topOfStack, 1)[0];
                tempColors.splice(targetY - topOfStack, 0, movedColor);
                columnElements.forEach((el, index) => {
                    el.style.backgroundColor = tempColors[index];
                });
            }
        }

        async function handleDragEnd() {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('touchmove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchend', handleDragEnd);

            const { element, startX, startY, lastTargetX, lastTargetY, lock } = dragState;
            if (element) element.classList.remove('dragging-origin');

            if (lock && (startX !== lastTargetX || startY !== lastTargetY)) {
                await processMove(startX, startY, lastTargetX, lastTargetY, lock);
            } else {
                renderGrid();
            }
            unlockGame();
            dragState = {}; // Clear drag state
        }

        // --- CORE GAME LOGIC ---
        async function processMove(x1, y1, x2, y2, lock) {
            if (slideSynth) slideSynth.triggerAttackRelease('C4', '8n');

            if (lock === 'horizontal') {
                const movedColor = grid[y1][x1];
                let rowData = grid[y1];
                rowData.splice(x1, 1);
                rowData.splice(x2, 0, movedColor);
            } else if (lock === 'vertical') {
                const movedColor = grid[y1][x1];
                let columnData = grid.map(row => row[x1]);
                columnData.splice(y1, 1);
                columnData.splice(y2, 0, movedColor);
                columnData.forEach((c, i) => grid[i][x1] = c);
            }

            renderGrid();
            await requestNextFrame();
            await handleMatches();
        }

        async function handleMatches() {
            let chain = 0;
            while (true) {
                const matches = findMatches();
                if (matches.length === 0) break;
                
                chain++;
                score += matches.length * 10 * chain;
                updateScore();
                if (matchSynth) matchSynth.triggerAttackRelease(Tone.Frequency('C4').transpose(chain * 2).toNote(), '8n');

                matches.forEach(({ x, y }) => {
                    const blockEl = gridContainer.querySelector(`[data-x='${x}'][data-y='${y}']`);
                    if (blockEl) blockEl.classList.add('collapsing');
                    grid[y][x] = null;
                });
                
                await wait(ANIMATION_DELAY);
                applyGravity();
                renderGrid();
                await wait(ANIMATION_DELAY);
            }
        }

        function findMatches() {
            const toRemove = new Set();
            for (let y = 0; y < GRID_HEIGHT; y++) for (let x = 0; x < GRID_WIDTH - 2; x++) {
                const c = grid[y][x]; if (c && c === grid[y][x+1] && c === grid[y][x+2]) {
                let i=x; while(i<GRID_WIDTH && grid[y][i]===c) toRemove.add(`${i++},${y}`); }}
            for (let x = 0; x < GRID_WIDTH; x++) for (let y = 0; y < GRID_HEIGHT - 2; y++) {
                const c = grid[y][x]; if (c && c === grid[y+1][x] && c === grid[y+2][x]) {
                let i=y; while(i<GRID_HEIGHT && grid[i][x]===c) toRemove.add(`${x},${i++}`); }}
            return Array.from(toRemove).map(s => ({ x: parseInt(s.split(',')[0]), y: parseInt(s.split(',')[1]) }));
        }

        function applyGravity() {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const column = grid.map(row => row[x]).filter(Boolean);
                for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                    grid[y][x] = (GRID_HEIGHT - 1 - y < column.length) ? column[column.length - (GRID_HEIGHT - y)] : null;
                }
            }
        }

        // --- TIMERS AND BLOCK DROPPING ---
        function startPreviewTimer() {
            clearInterval(meteosGame.previewTimer);
            meteosGame.previewTimer = setInterval(addBlockToPreview, previewBlockIntervalMs);
        }

        function addBlockToPreview() {
            if (isGameOver || isProcessing) return;
            if (previewIndex >= GRID_WIDTH) {
                clearInterval(meteosGame.previewTimer);
                requestAnimationFrame(dropPreviewRow);
                return;
            }
            
            previewRow[previewIndex] = getRandomColor();
            updatePreviewBar();
            previewIndex++;
        }

        async function dropPreviewRow() {
            if (isProcessing || isGameOver) return;
            lockGame();
            
            if (grid[0].some(cell => cell !== null)) {
                endGame();
                unlockGame();
                return;
            }
            
            if (dropSynth) dropSynth.triggerAttackRelease('G2', '8n');

            const fallingBlocks = [];
            
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (!previewRow[x]) continue;

                const block = animationPool[x];
                if (!block || !gridContainer) continue;
                gridContainer.appendChild(block);
                
                const initialX = x * (cellWidth + 4);
                block.style.backgroundColor = previewRow[x];
                block.style.width = `${cellWidth}px`;
                block.style.height = `${cellHeight}px`;
                block.style.transform = `translate(${initialX}px, -${cellHeight}px)`;
                
                let targetY = GRID_HEIGHT - 1;
                while(grid[targetY][x] !== null && targetY > 0) {
                    targetY--;
                }
                fallingBlocks.push({ element: block, targetX: initialX, targetY: targetY * (cellHeight + 4) });
            }
            
            await requestNextFrame();

            fallingBlocks.forEach(fb => {
                fb.element.style.transform = `translate(${fb.targetX}px, ${fb.targetY}px)`;
            });
            
            await wait(FALL_ANIMATION_DURATION);
            
            fallingBlocks.forEach(fb => animationPoolContainer.appendChild(fb.element));

            for (let x = 0; x < GRID_WIDTH; x++) {
                if (previewRow[x]) {
                    let landingY = -1;
                    for(let y = GRID_HEIGHT - 1; y >= 0; y--) {
                        if(grid[y][x] === null) {
                            landingY = y;
                            break;
                        }
                    }
                    if (landingY !== -1) {
                        grid[landingY][x] = previewRow[x];
                    }
                }
            }
            
            renderGrid();
            setupPreviewBar();
            
            if (previewBlockIntervalMs > MIN_PREVIEW_INTERVAL) {
                previewBlockIntervalMs -= INTERVAL_DECREMENT;
            }

            await handleMatches();
            
            if (!isGameOver) {
                startPreviewTimer();
            }
            unlockGame();
        }

        // --- GAME STATE MANAGEMENT ---
        function updateScore() { if(scoreDisplay) scoreDisplay.textContent = score; }

        function endGame() {
            if (isGameOver) return;
            isGameOver = true;
            if (gameOverSynth) gameOverSynth.triggerAttackRelease('C2', '1n');
            clearInterval(meteosGame.previewTimer);
            if(finalScoreDisplay) finalScoreDisplay.textContent = score;
            if(gameOverModal) gameOverModal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
        }

        if (restartButton) {
            restartButton.addEventListener('click', () => {
                if (typeof Tone !== 'undefined' && Tone.context.state !== 'running') Tone.context.resume();
                init();
            });
        }
        
        // --- INITIAL LOAD ---
        setupAudio();
        createAnimationPool();
        init();
    }
};