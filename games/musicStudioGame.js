const musicStudioGame = {
    synth: null,
    drumKit: null,
    sequencer: null,
    gridSize: { cols: 16, rows: 8 },
    activeTrack: 'melody',
    gameState: {},

    setup: function() {
        // Initialize instruments with synthesized sounds
        musicStudioGame.drumKit = {}; // Initialize the drumKit object
        musicStudioGame.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'fatsawtooth' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.5 }
        }).toDestination();

        musicStudioGame.drumKit.kick = new Tone.MembraneSynth({
            pitchDecay: 0.05, octaves: 10, oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' }
        }).toDestination();
        
        musicStudioGame.drumKit.snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 }
        }).toDestination();
        
        musicStudioGame.drumKit.clap = new Tone.NoiseSynth({
            noise: { type: 'pink' },
            envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.1, attackCurve: 'linear' }
        }).toDestination();

        musicStudioGame.drumKit.closedHat = new Tone.MetalSynth({
            frequency: 350, envelope: { attack: 0.001, decay: 0.03, release: 0.01 },
            harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5
        }).toDestination();

        musicStudioGame.drumKit.openHat = new Tone.MetalSynth({
            frequency: 350, envelope: { attack: 0.001, decay: 0.2, release: 0.1 },
            harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5
        }).toDestination();
        
        musicStudioGame.drumKit.lowTom = new Tone.MembraneSynth({
            pitchDecay: 0.08, octaves: 4, oscillator: {type: 'sine'},
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.01, release: 0.5}
        }).toDestination();
        
        musicStudioGame.drumKit.midTom = new Tone.MembraneSynth({
            pitchDecay: 0.07, octaves: 6, oscillator: {type: 'sine'},
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.01, release: 0.5}
        }).toDestination();
        
        musicStudioGame.drumKit.highTom = new Tone.MembraneSynth({
            pitchDecay: 0.06, octaves: 8, oscillator: {type: 'sine'},
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.01, release: 0.4}
        }).toDestination();
        
        // Initialize game state
        musicStudioGame.gameState = {
            melody: Array(musicStudioGame.gridSize.rows).fill(0).map(() => Array(musicStudioGame.gridSize.cols).fill(0)),
            drums: Array(musicStudioGame.gridSize.rows).fill(0).map(() => Array(musicStudioGame.gridSize.cols).fill(0)), // Expanded to 8 rows
            tempo: 120,
            octave: 4,
            isPlaying: false,
            currentStep: -1,
        };

        musicStudioGame.setupUI();

        // Setup Sequencer
        musicStudioGame.sequencer = new Tone.Sequence(musicStudioGame.playStep.bind(musicStudioGame),
            Array.from(Array(musicStudioGame.gridSize.cols).keys()), '16n');
        Tone.Transport.bpm.value = musicStudioGame.gameState.tempo;

        musicStudioGame.updateBoard();
    },

    setupUI: function() {
        gameBoard.innerHTML = '';
        gameBoard.className = 'music-studio-grid';
        gameBoard.style.gridTemplateColumns = `repeat(${musicStudioGame.gridSize.cols}, 1fr)`;

        for (let i = 0; i < musicStudioGame.gridSize.rows * musicStudioGame.gridSize.cols; i++) {
            const cell = document.createElement('div');
            cell.className = 'light';
            cell.dataset.index = i;
            gameBoard.appendChild(cell);
        }

        const playButton = createControlButton('Play', 'btn-green', () => musicStudioGame.togglePlayback(), 'play_arrow');
        const clearButton = createControlButton('Clear', 'btn-red', () => musicStudioGame.clearSequence(), 'delete');
        const tempoUpButton = createControlButton('Tempo+', 'btn-blue', () => musicStudioGame.changeTempo(10), 'arrow_upward');
        const tempoDownButton = createControlButton('Tempo-', 'btn-blue', () => musicStudioGame.changeTempo(-10), 'arrow_downward');
        const octaveUpButton = createControlButton('Octave+', 'btn-yellow', () => musicStudioGame.changeOctave(1), 'add');
        const octaveDownButton = createControlButton('Octave-', 'btn-yellow', () => musicStudioGame.changeOctave(-1), 'remove');
        const switchTrackButton = createControlButton('Drums', 'btn-pink', () => musicStudioGame.switchTrack(), 'music_note');

        buttonContainer.prepend(switchTrackButton);
        buttonContainer.prepend(octaveDownButton);
        buttonContainer.prepend(octaveUpButton);
        buttonContainer.prepend(tempoDownButton);
        buttonContainer.prepend(tempoUpButton);
        buttonContainer.prepend(clearButton);
        buttonContainer.prepend(playButton);

        updateStats(`Tempo: ${musicStudioGame.gameState.tempo} | Octave: ${musicStudioGame.gameState.octave}`);
    },

    handler: function(e) {
        const index = parseInt(e.target.dataset.index);
        const col = index % musicStudioGame.gridSize.cols;
        const row = Math.floor(index / musicStudioGame.gridSize.cols);

        if (musicStudioGame.activeTrack === 'melody') {
            musicStudioGame.gameState.melody[row][col] = musicStudioGame.gameState.melody[row][col] ? 0 : 1;
            if (musicStudioGame.gameState.melody[row][col]) {
                const note = musicStudioGame.getNote(row);
                musicStudioGame.synth.triggerAttackRelease(note, '8n');
            }
        } else { // Drums
            musicStudioGame.gameState.drums[row][col] = musicStudioGame.gameState.drums[row][col] ? 0 : 1;
            if (musicStudioGame.gameState.drums[row][col]) {
                musicStudioGame.playDrumSound(row);
            }
        }
        musicStudioGame.updateBoard();
    },
    
    playDrumSound(row, time) {
         switch(row) {
            case 0: musicStudioGame.drumKit.kick.triggerAttackRelease('C1', '8n', time); break;
            case 1: musicStudioGame.drumKit.snare.triggerAttackRelease('8n', time); break;
            case 2: musicStudioGame.drumKit.clap.triggerAttackRelease('8n', time); break;
            case 3: musicStudioGame.drumKit.closedHat.triggerAttackRelease('16n', time, 0.6); break;
            case 4: musicStudioGame.drumKit.openHat.triggerAttackRelease('8n', time, 0.3); break;
            case 5: musicStudioGame.drumKit.lowTom.triggerAttackRelease('A1', '8n', time); break;
            case 6: musicStudioGame.drumKit.midTom.triggerAttackRelease('D2', '8n', time); break;
            case 7: musicStudioGame.drumKit.highTom.triggerAttackRelease('G2', '8n', time); break;
        }
    },

    togglePlayback: function() {
        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }
        musicStudioGame.gameState.isPlaying = !musicStudioGame.gameState.isPlaying;
        if (musicStudioGame.gameState.isPlaying) {
            musicStudioGame.gameState.currentStep = -1;
            Tone.Transport.start();
            musicStudioGame.sequencer.start(0);
        } else {
            Tone.Transport.stop();
            musicStudioGame.sequencer.stop();
            musicStudioGame.gameState.currentStep = -1;
            requestAnimationFrame(() => musicStudioGame.updateBoard());
        }
        const playButton = buttonContainer.querySelector('.btn-green .material-symbols-outlined');
        playButton.textContent = musicStudioGame.gameState.isPlaying ? 'pause' : 'play_arrow';
    },

    playStep: function(time, step) {
        // Play melody
        for (let row = 0; row < musicStudioGame.gridSize.rows; row++) {
            if (musicStudioGame.gameState.melody[row][step]) {
                const note = musicStudioGame.getNote(row);
                musicStudioGame.synth.triggerAttackRelease(note, '16n', time);
            }
        }
        // Play drums
        for (let row = 0; row < musicStudioGame.gridSize.rows; row++) {
            if (musicStudioGame.gameState.drums[row][step]) {
                musicStudioGame.playDrumSound(row, time);
            }
        }
        Tone.Draw.schedule(() => {
            musicStudioGame.gameState.currentStep = step;
            musicStudioGame.updateBoard();
        }, time);
    },
    
    getNote: function(row) {
        const scale = ['B', 'A', 'G', 'F', 'E', 'D', 'C', 'B']; // Reversed for intuitive top-down layout
        const note = scale[row % scale.length];
        const octave = musicStudioGame.gameState.octave - Math.floor(row / scale.length);
        return `${note}${octave}`;
    },

    updateBoard: function() {
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            const col = i % musicStudioGame.gridSize.cols;
            const row = Math.floor(i / musicStudioGame.gridSize.cols);
            light.className = 'light';
            if (musicStudioGame.activeTrack === 'melody') {
                if (musicStudioGame.gameState.melody[row][col]) light.classList.add('is-player-1');
            } else {
                if (musicStudioGame.gameState.drums[row][col]) light.classList.add('is-player-2');
            }
            if (col === musicStudioGame.gameState.currentStep && musicStudioGame.gameState.isPlaying) {
                light.classList.add('is-highlight');
            }
        });
    },
    
    clearSequence: function() {
        musicStudioGame.gameState.melody = Array(musicStudioGame.gridSize.rows).fill(0).map(() => Array(musicStudioGame.gridSize.cols).fill(0));
        musicStudioGame.gameState.drums = Array(musicStudioGame.gridSize.rows).fill(0).map(() => Array(musicStudioGame.gridSize.cols).fill(0));
        musicStudioGame.updateBoard();
    },

    changeTempo: function(change) {
        musicStudioGame.gameState.tempo += change;
        if (musicStudioGame.gameState.tempo < 40) musicStudioGame.gameState.tempo = 40;
        if (musicStudioGame.gameState.tempo > 240) musicStudioGame.gameState.tempo = 240;
        Tone.Transport.bpm.value = musicStudioGame.gameState.tempo;
        updateStats(`Tempo: ${musicStudioGame.gameState.tempo} | Octave: ${musicStudioGame.gameState.octave}`);
    },

    changeOctave: function(change) {
        musicStudioGame.gameState.octave += change;
        if (musicStudioGame.gameState.octave < 1) musicStudioGame.gameState.octave = 1;
        if (musicStudioGame.gameState.octave > 7) musicStudioGame.gameState.octave = 7;
        updateStats(`Tempo: ${musicStudioGame.gameState.tempo} | Octave: ${musicStudioGame.gameState.octave}`);
    },
    
    switchTrack: function() {
        musicStudioGame.activeTrack = musicStudioGame.activeTrack === 'melody' ? 'drums' : 'melody';
        const switchTrackButton = buttonContainer.querySelector('.btn-pink');
        const icon = switchTrackButton.querySelector('.material-symbols-outlined');
        const rules = document.getElementById('game-rules');
        if (musicStudioGame.activeTrack === 'melody') {
            icon.textContent = 'grid_on';
            switchTrackButton.setAttribute('aria-label', 'Switch to Drums');
            rules.textContent = 'Melody Mode: Top is high, bottom is low.';
        } else {
            icon.textContent = 'music_note';
            switchTrackButton.setAttribute('aria-label', 'Switch to Melody');
            rules.textContent = 'Drums: Kick, Snare, Clap, Closed Hat, Open Hat, Low/Mid/High Toms';
        }
        musicStudioGame.updateBoard();
    },

    cleanup: function() {
        if (musicStudioGame.sequencer) {
            musicStudioGame.sequencer.stop();
            musicStudioGame.sequencer.dispose();
        }
        if (Tone.Transport.state === 'started') {
            Tone.Transport.stop();
            Tone.Transport.cancel();
        }
        musicStudioGame.gameState.isPlaying = false;
    }
};