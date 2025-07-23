/**
 * anxietyGame.js
 *
 * This file contains the complete logic for the "Anxiety" game,
 * a fast-paced, match-3 game with a relentless "pusher" row mechanic.
 * It includes the main game class and the audio manager.
 */

class AudioManager {
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }
        }).toDestination();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            this.isInitialized = true;
            console.log("Audio context started.");
        } catch (e) {
            console.error("Could not start audio context: ", e);
        }
    }

    playMatchSound(combo) {
        if (!this.isInitialized) return;
        const baseNote = 150;
        const note = baseNote + (combo * 25);
        this.synth.triggerAttackRelease(note, '8n');
    }

    playPushSound() {
        if (!this.isInitialized) return;
        this.synth.triggerAttackRelease('C2', '8n');
    }

    playGameOverSound() {
        if (!this.isInitialized) return;
        this.synth.triggerAttackRelease(['C2', 'E2', 'G2'], '1n');
    }
}

class AnxietyGame {
    constructor(ctx, canvas, audioManager) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.audioManager = audioManager;
        // Dynamic properties will be set by resize()
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.BLOCK_SIZE = 0;
        this.gridX = 0;
        this.gridY = 0;

        // Game constants
        this.GRID_WIDTH = 10;
        this.GRID_HEIGHT = 12;
        this.BLOCK_SIZE = 40;
        this.gridX = (this.canvasWidth - this.GRID_WIDTH * this.BLOCK_SIZE) / 2;
        this.gridY = (this.canvasHeight - (this.GRID_HEIGHT + 1) * this.BLOCK_SIZE) / 2;
        this.DRAG_THRESHOLD = 15;
        this.DRAG_SCALE = 1.5;

        this.COLORS = ['#FF4136', '#FF851B', '#FFDC00', '#2ECC40', '#0074D9', '#B10DC9'];
        this.INITIAL_SPAWN_INTERVAL = 750;
        this.MIN_SPAWN_INTERVAL = 250;
        this.ROW_SURVIVAL_BONUS = 500;

        // Bind event listeners
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragMove = this.handleDragMove.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.resize = this.resize.bind(this);
        this.gameLoopId = null;
    }

    init() {
        this.grid = Array(this.GRID_HEIGHT).fill(null).map(() => Array(this.GRID_WIDTH).fill(null));
        this.score = 0;
        this.rowsPushed = 0;
        this.gameOver = false;
        this.floatingScores = [];
        this.effects = [];

        this.previewRow = Array(this.GRID_WIDTH).fill(null);
        this.previewRowProgress = 0;
        this.blockSpawnInterval = this.INITIAL_SPAWN_INTERVAL;
        this.lastBlockSpawnTime = performance.now();

        this.resetDragState();

        for (let y = this.GRID_HEIGHT - 5; y < this.GRID_HEIGHT; y++) {
            for (let x = 0; x < this.GRID_WIDTH; x++) {
                this.grid[y][x] = { color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)] };
            }
        }

        this.processMatchesAndGravity(true);
        this.addEventListeners();
        this.resize(); // Call resize after initializing the grid and adding event listeners
    }

    stop() {
        // This method stops the game loop and removes event listeners.
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = null; // Clear the loop ID
        }
        this.removeEventListeners();
    }

    start() {
        // This method will start the game's update loop.
        if (this.gameLoopId) return; // Don't start if already running

        let lastTime = performance.now();
        const gameLoop = (timestamp) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            this.update(timestamp);
            this.draw();

            if (!this.gameOver) {
                // Continue the loop
                this.gameLoopId = requestAnimationFrame(gameLoop);
            }
        };
        // Kick off the first frame
        this.gameLoopId = requestAnimationFrame(gameLoop);
    }
    
    addEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleDragStart);
        this.canvas.addEventListener('mousemove', this.handleDragMove);
        this.canvas.addEventListener('mouseup', this.handleDragEnd);
        this.canvas.addEventListener('mouseleave', this.handleDragEnd);
        this.canvas.addEventListener('touchstart', this.handleDragStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleDragMove, { passive: false });
        this.canvas.addEventListener('touchend', this.handleDragEnd);
        this.canvas.addEventListener('touchcancel', this.handleDragEnd);
        window.addEventListener('resize', this.resize);
    }

    removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.handleDragStart);
        this.canvas.removeEventListener('mousemove', this.handleDragMove);
        this.canvas.removeEventListener('mouseup', this.handleDragEnd);
        this.canvas.removeEventListener('mouseleave', this.handleDragEnd);
        this.canvas.removeEventListener('touchstart', this.handleDragStart);
        this.canvas.removeEventListener('touchmove', this.handleDragMove);
        this.canvas.removeEventListener('touchend', this.handleDragEnd);
        this.canvas.removeEventListener('touchcancel', this.handleDragEnd);
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        // Reserve top 60px for score text, use the rest for the game grid
        const availableHeight = this.canvasHeight - 60;
        // The +1 in height is for the pusher row preview area
        this.BLOCK_SIZE = Math.floor(Math.min(this.canvasWidth / this.GRID_WIDTH, availableHeight / (this.GRID_HEIGHT + 1)));

        const gridWidthPixels = this.GRID_WIDTH * this.BLOCK_SIZE;
        const gridHeightPixels = this.GRID_HEIGHT * this.BLOCK_SIZE;

        this.gridX = (this.canvasWidth - gridWidthPixels) / 2;
        // Center the grid vertically in the available space below the score area
        this.gridY = 60 + (availableHeight - (gridHeightPixels + this.BLOCK_SIZE)) / 2;
    }


    resetDragState() {
        this.isDragging = false;
        this.dragDirection = null;
        this.dragOffset = 0;
        this.dragStartCoords = { x: 0, y: 0 };
        this.dragStartBlock = { col: 0, row: 0 };
    }

    update(currentTime) {
        if (this.gameOver) return;

        this.updateFloatingScores();
        this.updateEffects();

        if (currentTime - this.lastBlockSpawnTime > this.blockSpawnInterval) {
            this.lastBlockSpawnTime = currentTime;
            this.spawnNextPreviewBlock();
        }
    }

    updateEffects() {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.life--;
            if (effect.type === 'shrink') {
                effect.scale = Math.max(0, effect.life / 10);
            }
            if (effect.life <= 0) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    updateFloatingScores() {
        for (let i = this.floatingScores.length - 1; i >= 0; i--) {
            const fs = this.floatingScores[i];
            fs.life--;
            fs.y -= 0.5;
            fs.alpha = Math.max(0, fs.life / 60);
            if (fs.life <= 0) {
                this.floatingScores.splice(i, 1);
            }
        }
    }

    spawnNextPreviewBlock() {
        if (this.previewRowProgress < this.GRID_WIDTH) {
            this.previewRow[this.previewRowProgress] = { color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)] };
            this.previewRowProgress++;
        } else {
            this.pushStack();
        }
    }

    pushStack() {
        for (let x = 0; x < this.GRID_WIDTH; x++) {
            if (this.grid[0][x] !== null) {
                this.gameOver = true;
                this.audioManager.playGameOverSound();
                return;
            }
        }
        this.audioManager.playPushSound();
        for (let y = 0; y < this.GRID_HEIGHT - 1; y++) { this.grid[y] = this.grid[y + 1]; }
        this.grid[this.GRID_HEIGHT - 1] = this.previewRow;
        this.rowsPushed++;
        this.previewRow = Array(this.GRID_WIDTH).fill(null);
        this.previewRowProgress = 0;
        this.blockSpawnInterval = Math.max(this.MIN_SPAWN_INTERVAL, this.blockSpawnInterval - 10);
        this.processMatchesAndGravity();
    }

    async processMatchesAndGravity(isInitialSetup = false) {
        let comboMultiplier = 1;
        let matchesFound;
        do {
            const toRemove = this.checkForMatches();
            if (toRemove.size > 0) {
                matchesFound = true;
                this.removeMatches(toRemove, isInitialSetup, comboMultiplier);
                this.applyGravity();
                comboMultiplier++;
            } else {
                matchesFound = false;
            }
        } while (matchesFound);
    }
    
    checkForMatches() {
        const toRemove = new Set();
        const checkLine = (x, y, dx, dy) => {
            if (!this.grid[y] || !this.grid[y][x]) return [];
            const color = this.grid[y][x].color;
            let line = [{x, y}];
            let currentX = x + dx;
            let currentY = y + dy;
            while(currentY >= 0 && currentY < this.GRID_HEIGHT && currentX >= 0 && currentX < this.GRID_WIDTH && this.grid[currentY] && this.grid[currentY][currentX] && this.grid[currentY][currentX].color === color) {
                line.push({x: currentX, y: currentY});
                currentX += dx;
                currentY += dy;
            }
            return line;
        };
        for (let y = 0; y < this.GRID_HEIGHT; y++) {
            for (let x = 0; x < this.GRID_WIDTH; x++) {
                if (this.grid[y][x]) {
                    let hLine = checkLine(x, y, 1, 0);
                    if (hLine.length >= 3) hLine.forEach(p => toRemove.add(`${p.x},${p.y}`));
                    let vLine = checkLine(x, y, 0, 1);
                    if (vLine.length >= 3) vLine.forEach(p => toRemove.add(`${p.x},${p.y}`));
                }
            }
        }
        return toRemove;
    }

    removeMatches(matchedSet, isInitialSetup, comboMultiplier) {
        if (!isInitialSetup) {
            this.audioManager.playMatchSound(comboMultiplier);
            const matchSize = matchedSet.size;
            let baseScore = matchSize * 10;
            if (matchSize > 3) baseScore += (matchSize - 3) * 15;
            const finalScore = baseScore * comboMultiplier;
            this.score += finalScore;

            let totalX = 0, totalY = 0;
            matchedSet.forEach(coord => { const [x, y] = coord.split(',').map(Number); totalX += x; totalY += y; });
            const centerX = totalX / matchSize;
            const centerY = totalY / matchSize;
            
            this.floatingScores.push({ text: `+${finalScore}`, x: this.gridX + (centerX + 0.5) * this.BLOCK_SIZE, y: this.gridY + (centerY + 0.5) * this.BLOCK_SIZE, life: 60, alpha: 1 });
        }
        
         matchedSet.forEach(coord => {
            const [x, y] = coord.split(',').map(Number);
            if (this.grid[y] && this.grid[y][x]) {
                if (isInitialSetup) {
                    this.grid[y][x].color = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
                } else {
                    this.effects.push({ type: 'shrink', x, y, color: this.grid[y][x].color, life: 10, scale: 1 });
                    this.grid[y][x] = null;
                }
            }
        });
    }
    
    applyGravity() {
        for (let x = 0; x < this.GRID_WIDTH; x++) {
            let writeRow = this.GRID_HEIGHT - 1;
            for (let y = this.GRID_HEIGHT - 1; y >= 0; y--) {
                if (this.grid[y][x]) {
                    if (writeRow !== y) {
                        this.grid[writeRow][x] = this.grid[y][x];
                        this.grid[y][x] = null;
                    }
                    writeRow--;
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        this.ctx.fillStyle = '#101010';
        this.ctx.fillRect(this.gridX, this.gridY, this.GRID_WIDTH * this.BLOCK_SIZE, this.GRID_HEIGHT * this.BLOCK_SIZE);

        for (let y = 0; y < this.GRID_HEIGHT; y++) {
            for (let x = 0; x < this.GRID_WIDTH; x++) {
                if (this.isDragging && this.dragDirection === 'horizontal' && y === this.dragStartBlock.row) continue;
                if (this.isDragging && this.dragDirection === 'vertical' && x === this.dragStartBlock.col) continue;
                if (this.grid[y][x]) this.drawBlock(x, y, this.grid[y][x].color);
            }
        }
        
        if (this.isDragging && this.dragDirection) {
            this.drawSlidingPreview();
        }
        
        this.effects.forEach(effect => {
            if (effect.type === 'shrink') {
                this.drawBlock(effect.x, effect.y, effect.color, effect.scale);
            }
        });

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.GRID_WIDTH; i++) { this.ctx.beginPath(); this.ctx.moveTo(this.gridX + i * this.BLOCK_SIZE, this.gridY); this.ctx.lineTo(this.gridX + i * this.BLOCK_SIZE, this.gridY + this.GRID_HEIGHT * this.BLOCK_SIZE); this.ctx.stroke(); }
        for (let i = 0; i <= this.GRID_HEIGHT; i++) { this.ctx.beginPath(); this.ctx.moveTo(this.gridX, this.gridY + i * this.BLOCK_SIZE); this.ctx.lineTo(this.gridX + this.GRID_WIDTH * this.BLOCK_SIZE, this.gridY + i * this.BLOCK_SIZE); this.ctx.stroke(); }

        this.drawPusherRow(performance.now());

        this.floatingScores.forEach(fs => { this.ctx.font = '24px VT323'; this.ctx.fillStyle = `rgba(255, 255, 0, ${fs.alpha})`; this.ctx.textAlign = 'center'; this.ctx.fillText(fs.text, fs.x, fs.y); });

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '30px VT323';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Rows Survived: ${this.rowsPushed}`, this.canvasWidth - 20, 40);

        if (this.gameOver) {
            const survivalBonus = this.rowsPushed * this.ROW_SURVIVAL_BONUS;
            const finalScore = this.score + survivalBonus;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.fillStyle = '#FF4136';
            this.ctx.font = '80px VT323';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvasWidth / 2, this.canvasHeight / 2 - 80);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '30px VT323';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`Match Score:`, this.canvasWidth / 2 - 10, this.canvasHeight / 2 - 10);
            this.ctx.fillText(`Survival Bonus:`, this.canvasWidth / 2 - 10, this.canvasHeight / 2 + 20);
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${this.score}`, this.canvasWidth / 2 + 10, this.canvasHeight / 2 - 10);
            this.ctx.fillText(`${this.rowsPushed} x ${this.ROW_SURVIVAL_BONUS} = ${survivalBonus}`, this.canvasWidth / 2 + 10, this.canvasHeight / 2 + 20);
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvasWidth / 2 - 150, this.canvasHeight / 2 + 40);
            this.ctx.lineTo(this.canvasWidth / 2 + 150, this.canvasHeight / 2 + 40);
            this.ctx.stroke();
            this.ctx.font = '50px VT323';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Total: ${finalScore}`, this.canvasWidth / 2, this.canvasHeight / 2 + 80);
        }
    }

    drawPusherRow(currentTime) {
        const pusherY = this.gridY + this.GRID_HEIGHT * this.BLOCK_SIZE;
        this.ctx.fillStyle = '#252525';
        this.ctx.fillRect(this.gridX, pusherY, this.GRID_WIDTH * this.BLOCK_SIZE, this.BLOCK_SIZE);
        const timeSinceSpawn = currentTime - this.lastBlockSpawnTime;
        const progressPercent = (this.previewRowProgress * this.blockSpawnInterval + timeSinceSpawn) / (this.blockSpawnInterval * this.GRID_WIDTH);
        this.ctx.fillStyle = '#FF4136';
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillRect(this.gridX, pusherY, this.GRID_WIDTH * this.BLOCK_SIZE * progressPercent, this.BLOCK_SIZE);
        this.ctx.globalAlpha = 1.0;
        this.ctx.strokeStyle = '#FF4136';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.gridX, pusherY, this.GRID_WIDTH * this.BLOCK_SIZE, this.BLOCK_SIZE);
        for (let x = 0; x < this.previewRowProgress; x++) {
            if (this.previewRow[x]) {
                this.drawBlock(x, this.GRID_HEIGHT, this.previewRow[x].color);
            }
        }
    }

    drawBlock(gridX, gridY, color, scale = 1, isGhost = false) {
        const size = this.BLOCK_SIZE * scale;
        const margin = (this.BLOCK_SIZE - size) / 2;
        let yPos = (gridY === this.GRID_HEIGHT) ? this.gridY + this.GRID_HEIGHT * this.BLOCK_SIZE : this.gridY + gridY * this.BLOCK_SIZE;
        this.ctx.fillStyle = color;
        if (isGhost) this.ctx.globalAlpha = 0.5;
        this.ctx.fillRect(this.gridX + gridX * this.BLOCK_SIZE + margin + 1, yPos + margin + 1, size - 2, size - 2);
        this.ctx.globalAlpha = 1.0;
    }

    drawSlidingPreview() {
        const { col, row } = this.dragStartBlock;
        const offset = this.dragOffset;
        let draggedBlock, targetIndex;
        if (this.dragDirection === 'horizontal') {
            const tempRow = [...this.grid[row]];
            draggedBlock = tempRow[col];
            targetIndex = col + offset;
            tempRow.splice(col, 1);
            tempRow.splice(targetIndex, 0, draggedBlock);
            for (let x = 0; x < this.GRID_WIDTH; x++) {
                if (tempRow[x] && x !== targetIndex) {
                    this.drawBlock(x, row, tempRow[x].color, 1, true);
                }
            }
            this.drawBlock(targetIndex, row, draggedBlock.color, this.DRAG_SCALE);
        } else {
            const tempCol = this.grid.map(r => r[col]);
            draggedBlock = tempCol[row];
            targetIndex = row + offset;
            tempCol.splice(row, 1);
            tempCol.splice(targetIndex, 0, draggedBlock);
            for (let y = 0; y < this.GRID_HEIGHT; y++) {
                if (tempCol[y] && y !== targetIndex) {
                    this.drawBlock(col, y, tempCol[y].color, 1, true);
                }
            }
            this.drawBlock(col, targetIndex, draggedBlock.color, this.DRAG_SCALE);
        }
    }
    
    // --- Input Handling ---
    getCoordsFromEvent(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    handleDragStart(event) {
        if (this.gameOver) return;
        event.preventDefault();
        const coords = this.getCoordsFromEvent(event);
        const col = Math.floor((coords.x - this.gridX) / this.BLOCK_SIZE);
        const row = Math.floor((coords.y - this.gridY) / this.BLOCK_SIZE);
        if (col >= 0 && col < this.GRID_WIDTH && row >= 0 && row < this.GRID_HEIGHT && this.grid[row][col]) {
            this.isDragging = true;
            this.dragStartCoords = coords;
            this.dragStartBlock = { col, row };
        }
    }

    handleDragMove(event) {
        if (!this.isDragging) return;
        event.preventDefault();
        const coords = this.getCoordsFromEvent(event);
        const dx = coords.x - this.dragStartCoords.x;
        const dy = coords.y - this.dragStartCoords.y;
        if (!this.dragDirection) {
            if (Math.abs(dx) > this.DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
                this.dragDirection = 'horizontal';
            } else if (Math.abs(dy) > this.DRAG_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
                this.dragDirection = 'vertical';
            }
        }
        if (this.dragDirection) {
            let rawOffset = 0;
            if (this.dragDirection === 'horizontal') {
                rawOffset = Math.round(dx / this.BLOCK_SIZE);
            } else {
                rawOffset = Math.round(dy / this.BLOCK_SIZE);
            }
            this.dragOffset = this.clampOffset(rawOffset);
        }
    }

    handleDragEnd(event) {
        if (!this.isDragging) return;
        event.preventDefault();
        if (this.dragOffset !== 0) {
            this.performSlide();
            this.processMatchesAndGravity();
        }
        this.resetDragState();
    }

    clampOffset(offset) {
        const { col, row } = this.dragStartBlock;
        if (this.dragDirection === 'horizontal') {
            let min = -col;
            let max = this.GRID_WIDTH - 1 - col;
            for (let i = col - 1; i >= 0; i--) { if (!this.grid[row][i]) { min = i - col + 1; break; } }
            for (let i = col + 1; i < this.GRID_WIDTH; i++) { if (!this.grid[row][i]) { max = i - col - 1; break; } }
            return Math.max(min, Math.min(max, offset));
        } else {
            let min = -row;
            let max = this.GRID_HEIGHT - 1 - row;
            for (let i = row - 1; i >= 0; i--) { if (!this.grid[i][col]) { min = i - row + 1; break; } }
            for (let i = row + 1; i < this.GRID_HEIGHT; i++) { if (!this.grid[i][col]) { max = i - row - 1; break; } }
            return Math.max(min, Math.min(max, offset));
        }
    }

    performSlide() {
        const { col, row } = this.dragStartBlock;
        const blockToMove = this.grid[row][col];
        if (this.dragDirection === 'horizontal') {
            const targetCol = col + this.dragOffset;
            if (this.dragOffset > 0) { for (let i = col; i < targetCol; i++) { this.grid[row][i] = this.grid[row][i + 1]; } }
            else { for (let i = col; i > targetCol; i--) { this.grid[row][i] = this.grid[row][i - 1]; } }
            this.grid[row][targetCol] = blockToMove;
        } else {
            const targetRow = row + this.dragOffset;
            if (this.dragOffset > 0) { for (let i = row; i < targetRow; i++) { this.grid[i][col] = this.grid[i + 1][col]; } }
            else { for (let i = row; i > targetRow; i--) { this.grid[i][col] = this.grid[i - 1][col]; } }
            this.grid[targetRow][col] = blockToMove;
        }
    }
}
