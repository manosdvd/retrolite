const lineDrawGame = {
    setup: () => {
        const size = currentMode.gridSize;
        const puzzle = lineDrawGame.generatePuzzle(size);
        // Add completedPaths to the gameState object to track completed lines
        gameState = { 
            size, 
            board: Array(size * size).fill(0), 
            pairs: puzzle.pairs, 
            paths: {}, 
            isDrawing: false, 
            currentColor: 0, 
            startNode: -1,
            gameOver: false,
            completedPaths: new Set() 
        };
        puzzle.pairs.forEach(p => { gameState.paths[p.c] = []; });

        // --- FIX: Dynamically create the grid elements ---
        gameBoard.innerHTML = ''; // Clear existing content
        gameBoard.className = 'game-grid'; // Ensure base grid styling
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const light = document.createElement('div');
            light.classList.add('light');
            light.dataset.index = i;
            gameBoard.appendChild(light);
        }
        // --- END FIX ---

        lineDrawGame.updateBoard();
        gameBoard.addEventListener('mousedown', lineDrawGame.handleMouseDown);
        window.addEventListener('mousemove', lineDrawGame.handleMouseMove);
        window.addEventListener('mouseup', lineDrawGame.handleMouseUp);
        gameBoard.addEventListener('touchstart', lineDrawGame.handleMouseDown, {passive: false});
        window.addEventListener('touchmove', lineDrawGame.handleMouseMove, {passive: false});
        window.addEventListener('touchend', lineDrawGame.handleMouseUp, {passive: false});
    },
    generatePuzzle: (size) => {
        let grid, pairs;
        let attempts = 0;
        while (attempts < 50) {
            grid = Array(size * size).fill(0);
            pairs = [];
            let color = 1;
            let unvisited = Array.from({length: size * size}, (_, i) => i).sort(() => Math.random() - 0.5);
            while(unvisited.length > 0) {
                let startCell = -1;
                while(unvisited.length > 0) {
                    let potentialStart = unvisited.pop();
                    if (grid[potentialStart] === 0) { startCell = potentialStart; break; }
                }
                if (startCell === -1) break;
                let path = [startCell];
                grid[startCell] = color;
                let currentCell = startCell;
                while(true) {
                    const neighbors = utils.getSliderNeighbors(currentCell, size).filter(n => grid[n] === 0);
                    if (neighbors.length === 0) break;
                    const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
                    grid[nextCell] = color;
                    path.push(nextCell);
                    currentCell = nextCell;
                    unvisited = unvisited.filter(i => i !== nextCell);
                }
                if (path.length > 1) {
                     pairs.push({ c: color, s: path[0], e: path[path.length-1] });
                     color++;
                } else {
                    grid[path[0]] = 0;
                }
            }
            if (!grid.includes(0)) return { pairs };
            attempts++;
        }
        return lineDrawGame.generatePuzzle(size);
    },
    handleMouseDown: (e) => {
        if (gameState.gameOver) return; // Add this line
        e.preventDefault();
        const target = e.target.closest('.light');
        if (!target) return;
        const index = parseInt(target.dataset.index);
        const pair = gameState.pairs.find(p => p.s === index || p.e === index);
        if (pair) {
            // If this path was completed, remove it from the set before redrawing
            if (gameState.completedPaths.has(pair.c)) {
                gameState.completedPaths.delete(pair.c);
            }
            
            const oldPath = gameState.paths[pair.c];
            if (oldPath) oldPath.forEach(i => { if (!gameState.pairs.some(p => p.s === i || p.e === i)) gameState.board[i] = 0; });
            
            gameState.isDrawing = true;
            gameState.currentColor = pair.c;
            gameState.startNode = index;
            gameState.paths[pair.c] = [index];
            gameState.board[index] = pair.c;
            
            playSound(notes[(pair.c - 1) % notes.length]);
            lineDrawGame.updateBoard();
        }
    },
    handleMouseMove: (e) => {
        if (gameState.gameOver || !gameState.isDrawing) return; // Add gameOver check
        e.preventDefault();
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        const element = document.elementFromPoint(x, y);
        if (!element || !element.matches('.light')) return;
        const index = parseInt(element.dataset.index);
        const currentPath = gameState.paths[gameState.currentColor];
        const lastIndex = currentPath[currentPath.length - 1];
        if (index === lastIndex) return;
        if (currentPath.length > 1 && index === currentPath[currentPath.length - 2]) {
            gameState.board[lastIndex] = 0;
            currentPath.pop();
            const note = notes[(gameState.currentColor - 1) % notes.length];
            const noteName = note.slice(0, -1);
            const octave = parseInt(note.slice(-1));
            playSound(`${noteName}${octave - 1}`);
            lineDrawGame.updateBoard();
            return;
        }
        const isAdjacent = utils.getSliderNeighbors(lastIndex, gameState.size).includes(index);
        const isEndpointOfCurrentColor = gameState.pairs.some(p => p.c === gameState.currentColor && (p.s === index || p.e === index));
        const isValidMove = isAdjacent && (gameState.board[index] === 0 || isEndpointOfCurrentColor);
        if (isValidMove) {
            currentPath.push(index);
            gameState.board[index] = gameState.currentColor;
            playSound(notes[(gameState.currentColor - 1) % notes.length]);
            lineDrawGame.updateBoard();
        }
    },
    handleMouseUp: (e) => {
        if (!gameState.isDrawing) return;
        
        const color = gameState.currentColor;
        const path = gameState.paths[color];
        const pair = gameState.pairs.find(p => p.c === color);
        const startNode = gameState.startNode;
        const endNode = path[path.length - 1];
        const targetEndNode = (pair.s === startNode) ? pair.e : pair.s;

        if (endNode !== targetEndNode) {
            // Path is invalid, so erase it
            path.forEach(i => { if (!gameState.pairs.some(p => p.s === i || p.e === i)) gameState.board[i] = 0; });
            gameState.paths[color] = [];
            playSound('C3');
        } else {
            // Path is valid! Add its color to the completed set.
            gameState.completedPaths.add(color);
            playSound('G4');
        }

        gameState.isDrawing = false;
        lineDrawGame.updateBoard(); // Update the board to show the new glow
        lineDrawGame.checkWin();    // Check if the whole puzzle is solved
    },
    updateBoard: () => {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            light.className = 'light'; // Reset classes
            const pair = gameState.pairs.find(p => p.s === i || p.e === i);
            const pathColor = gameState.board[i];
            
            if (pair) light.classList.add(`color-${pair.c}`, 'line-dot');
            
            if (pathColor) {
                light.classList.add(`path-${pathColor}`);
                // If this path's color is in the completed set, make it glow
                if (gameState.completedPaths.has(pathColor)) {
                    light.classList.add('is-highlight');
                }
            }
        });
    },
    checkWin: () => {
        if (gameState.gameOver) return; // Prevent re-checking if already won

        const allPaired = gameState.pairs.every(p => {
            const path = gameState.paths[p.c];
            if (!path || path.length < 2) return false;
            const ends = [path[0], path[path.length - 1]].sort((a, b) => a - b);
            const pairEnds = [p.s, p.e].sort((a, b) => a - b);
            return ends[0] === pairEnds[0] && ends[1] === pairEnds[1];
        });

        const isBoardFull = !gameState.board.includes(0);

        if (allPaired && isBoardFull) {
            gameState.gameOver = true;    // Set the win state
            lineDrawGame.updateBoard();   // Redraw the board immediately with the glow
            showWinModal('You Win!', 'You connected all the dots!');
        }
    },
    cleanup: () => {
        gameBoard.removeEventListener('mousedown', lineDrawGame.handleMouseDown);
        window.removeEventListener('mousemove', lineDrawGame.handleMouseMove);
        window.removeEventListener('mouseup', lineDrawGame.handleMouseUp);
        gameBoard.removeEventListener('touchstart', lineDrawGame.handleMouseDown);
        window.removeEventListener('touchmove', lineDrawGame.handleMouseMove);
        window.removeEventListener('touchend', lineDrawGame.handleMouseUp);
    }
};