const musicStudioGame = {
    // --- PROPERTIES ---
    synth: null,
    drumKit: null,
    sequencer: null,
    gridSize: { cols: 32, rows: 8 },
    activeTrack: 'melody',
    instrumentPresets: {
        'Synth Lead':     { synth: Tone.Synth,    options: { oscillator: { type: 'fatsawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.5 } }, colorClass: 'instrument-synth-lead' },
        'Electric Piano': { synth: Tone.FMSynth,  options: { harmonicity: 3, modulationIndex: 14, envelope: { attack: 0.02, decay: 0.3, sustain: 0.1, release: 0.8 } }, colorClass: 'instrument-electric-piano' },
        'Synth Strings':  { synth: Tone.AMSynth,  options: { harmonicity: 1.5, envelope: { attack: 0.1, decay: 0.5, sustain: 0.3, release: 1.2 } }, colorClass: 'instrument-synth-strings' },
        'Brass Ensemble': { synth: Tone.FMSynth,  options: { harmonicity: 1.2, modulationIndex: 10, envelope: { attack: 0.05, decay: 0.4, sustain: 0.2, release: 0.7 } }, colorClass: 'instrument-brass-ensemble' },
        'Synth Bass':     { synth: Tone.MonoSynth,options: { oscillator: { type: 'square' }, filter: { Q: 2, type: 'lowpass', rolloff: -24 }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.6 } }, colorClass: 'instrument-synth-bass' }
    },
    gameState: {},

    // --- METHODS ---
    setup: function() {
        // Initialize all audio components first
        this.drumKit = {
            kick: new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 10, oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' } }).toDestination(),
            snare: new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 } }).toDestination(),
            clap: new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.1, attackCurve: 'linear' } }).toDestination(),
            closedHat: new Tone.MetalSynth({ frequency: 350, envelope: { attack: 0.001, decay: 0.03, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination(),
            openHat: new Tone.MetalSynth({ frequency: 350, envelope: { attack: 0.001, decay: 0.2, release: 0.1 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination(),
            lowTom: new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 4, oscillator: {type: 'sine'}, envelope: { attack: 0.01, decay: 0.3, sustain: 0.01, release: 0.5} }).toDestination(),
            midTom: new Tone.MembraneSynth({ pitchDecay: 0.07, octaves: 6, oscillator: {type: 'sine'}, envelope: { attack: 0.01, decay: 0.3, sustain: 0.01, release: 0.5} }).toDestination(),
            highTom: new Tone.MembraneSynth({ pitchDecay: 0.06, octaves: 8, oscillator: {type: 'sine'}, envelope: { attack: 0.01, decay: 0.2, sustain: 0.01, release: 0.4} }).toDestination()
        };
        
        // Initialize the game's state, including the data structure for instrument colors
        this.gameState = {
            melody: Array(this.gridSize.rows).fill(0).map(() => Array(this.gridSize.cols).fill(0)),
            drums: Array(this.gridSize.rows).fill(0).map(() => Array(this.gridSize.cols).fill(0)),
            tempo: 120, octave: 4, isPlaying: false, currentStep: -1, currentInstrument: 'Synth Lead'
        };

        // Set up the initial melody synth and then build the UI
        this.switchInstrument(this.gameState.currentInstrument, true);
        this.setupUI();

        // Configure and start the master sequencer
        this.sequencer = new Tone.Sequence(this.playStep.bind(this), Array.from(Array(this.gridSize.cols).keys()), '16n');
        Tone.Transport.bpm.value = this.gameState.tempo;

        this.updateBoard();
    },

    setupUI: function() {
        // This function is now fully self-contained and builds its own interface
        const wrapper = document.getElementById('game-board-wrapper');
        
        const mainContainer = document.createElement('div');
        mainContainer.className = 'music-studio-main-container';
        
        const labelsContainer = document.createElement('div');
        labelsContainer.id = 'note-labels-container';
        labelsContainer.className = 'note-labels-container';
        
        // It's crucial that this script creates and manages its own gameBoard element
        gameBoard = document.createElement('div');
        gameBoard.id = 'game-board';
        gameBoard.className = 'music-studio-grid';
        gameBoard.style.gridTemplateColumns = `repeat(${this.gridSize.cols}, 1fr)`;

        // Populate the grid with cells
        for (let i = 0; i < this.gridSize.rows * this.gridSize.cols; i++) {
            const cell = document.createElement('div');
            const row = Math.floor(i / this.gridSize.cols);
            cell.className = `light note-row-${row}`;
            cell.dataset.index = i;
            gameBoard.appendChild(cell);
        }

        // Assemble the final layout
        mainContainer.appendChild(labelsContainer);
        mainContainer.appendChild(gameBoard);
        wrapper.appendChild(mainContainer);

        this.setupLabels(labelsContainer);

        // Create all control buttons
        const playButton = createControlButton('Play', 'btn-green', () => this.togglePlayback(), 'play_arrow');
        const clearButton = createControlButton('Clear', 'btn-red', () => this.clearSequence(), 'delete');
        const tempoUpButton = createControlButton('Tempo+', 'btn-blue', () => this.changeTempo(10), 'arrow_upward');
        const tempoDownButton = createControlButton('Tempo-', 'btn-blue', () => this.changeTempo(-10), 'arrow_downward');
        const octaveUpButton = createControlButton('Octave+', 'btn-yellow', () => this.changeOctave(1), 'add');
        const octaveDownButton = createControlButton('Octave-', 'btn-yellow', () => this.changeOctave(-1), 'remove');
        const switchTrackButton = createControlButton('Drums', 'btn-pink', () => this.switchTrack(), 'music_note');
        const switchInstrumentButton = createControlButton('Instrument', 'btn-purple', () => this.switchInstrument(), 'piano');

        buttonContainer.prepend(switchInstrumentButton, switchTrackButton, octaveDownButton, octaveUpButton, tempoDownButton, tempoUpButton, clearButton, playButton);
        
        this.updateStats();
    },

    setupLabels: function(container) {
        const scale = ['B', 'A', 'G', 'F', 'E', 'D', 'C', 'B'];
        container.innerHTML = '';
        for(let i=0; i < this.gridSize.rows; i++) {
            const label = document.createElement('div');
            label.className = `note-label note-row-${i}`;
            label.textContent = scale[i % scale.length];
            container.appendChild(label);
        }
    },

    updateStats: function() {
        updateStats(`Tempo: ${this.gameState.tempo} | Octave: ${this.gameState.octave} | Inst: ${this.gameState.currentInstrument}`);
    },

    handler: function(e) {
        // This now correctly receives the full event object 'e' from main.js
        const lightElement = e.target.closest('.light');
        if (!lightElement) return; // Exit if the click was not on a light cell

        const index = parseInt(lightElement.dataset.index);
        const col = index % this.gridSize.cols;
        const row = Math.floor(index / this.gridSize.cols);

        if (this.activeTrack === 'melody') {
            // If the cell is active, turn it off.
            if (this.gameState.melody[row][col]) {
                this.gameState.melody[row][col] = 0; 
            } else {
                // Otherwise, activate it and store the current instrument's name.
                this.gameState.melody[row][col] = this.gameState.currentInstrument;
                const note = this.getNote(row);
                this.synth.triggerAttackRelease(note, '8n');
            }
        } else { // Handle the drum track
            this.gameState.drums[row][col] = this.gameState.drums[row][col] ? 0 : 1;
            if (this.gameState.drums[row][col]) {
                this.playDrumSound(row);
            }
        }
        this.updateBoard();
    },
    
    playDrumSound(row, time) {
         switch(row) {
            case 0: this.drumKit.kick.triggerAttackRelease('C1', '8n', time); break;
            case 1: this.drumKit.snare.triggerAttackRelease('8n', time); break;
            case 2: this.drumKit.clap.triggerAttackRelease('8n', time); break;
            case 3: this.drumKit.closedHat.triggerAttackRelease('16n', time, 0.6); break;
            case 4: this.drumKit.openHat.triggerAttackRelease('8n', time, 0.3); break;
            case 5: this.drumKit.lowTom.triggerAttackRelease('A1', '8n', time); break;
            case 6: this.drumKit.midTom.triggerAttackRelease('D2', '8n', time); break;
            case 7: this.drumKit.highTom.triggerAttackRelease('G2', '8n', time); break;
        }
    },

    togglePlayback: function() {
        if (Tone.context.state !== 'running') { Tone.context.resume(); }
        this.gameState.isPlaying = !this.gameState.isPlaying;
        if (this.gameState.isPlaying) {
            this.gameState.currentStep = -1;
            Tone.Transport.start();
            this.sequencer.start(0);
        } else {
            Tone.Transport.stop();
            this.sequencer.stop();
            this.gameState.currentStep = -1;
            requestAnimationFrame(() => this.updateBoard());
        }
        const playButton = buttonContainer.querySelector('.btn-green .material-symbols-outlined');
        playButton.textContent = this.gameState.isPlaying ? 'pause' : 'play_arrow';
    },

    playStep: function(time, step) {
        // Play melody notes
        for (let row = 0; row < this.gridSize.rows; row++) {
            if (this.gameState.melody[row][step]) {
                const note = this.getNote(row);
                this.synth.triggerAttackRelease(note, '16n', time);
            }
        }
        // Play drum sounds
        for (let row = 0; row < this.gridSize.rows; row++) {
            if (this.gameState.drums[row][step]) {
                this.playDrumSound(row, time);
            }
        }
        // Schedule a visual update to sync with the audio
        Tone.Draw.schedule(() => {
            this.gameState.currentStep = step;
            this.updateBoard();
        }, time);
    },
    
    getNote: function(row) {
        const scale = ['B', 'A', 'G', 'F', 'E', 'D', 'C', 'B'];
        const note = scale[row % scale.length];
        const octave = this.gameState.octave - Math.floor(row / scale.length);
        return `${note}${octave}`;
    },

    updateBoard: function() {
        if (!gameBoard) return; // Safety check
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            const col = i % this.gridSize.cols;
            const row = Math.floor(i / this.gridSize.cols);
            
            // Reset classes to just the base row color
            light.className = `light note-row-${row}`; 
            
            if (this.activeTrack === 'melody') {
                const instrumentName = this.gameState.melody[row][col];
                if (instrumentName) {
                    light.classList.add('is-player-1');
                    // Add the specific color class for the stored instrument
                    const colorClass = this.instrumentPresets[instrumentName]?.colorClass;
                    if (colorClass) {
                        light.classList.add(colorClass);
                    }
                }
            } else { // Drums
                if (this.gameState.drums[row][col]) {
                    light.classList.add('is-player-2');
                }
            }

            // Highlight the current playback column
            if (col === this.gameState.currentStep && this.gameState.isPlaying) {
                light.classList.add('is-highlight');
            }
        });
        const labelsContainer = document.getElementById('note-labels-container');
        if (labelsContainer) {
            labelsContainer.style.display = (this.activeTrack === 'melody') ? 'flex' : 'none';
        }
    },
    
    clearSequence: function() {
        this.gameState.melody = Array(this.gridSize.rows).fill(0).map(() => Array(this.gridSize.cols).fill(0));
        this.gameState.drums = Array(this.gridSize.rows).fill(0).map(() => Array(this.gridSize.cols).fill(0));
        this.updateBoard();
    },

    changeTempo: function(change) {
        this.gameState.tempo = Math.max(40, Math.min(240, this.gameState.tempo + change));
        Tone.Transport.bpm.value = this.gameState.tempo;
        this.updateStats();
    },

    changeOctave: function(change) {
        this.gameState.octave = Math.max(1, Math.min(7, this.gameState.octave + change));
        this.updateStats();
    },
    
    switchTrack: function() {
        this.activeTrack = this.activeTrack === 'melody' ? 'drums' : 'melody';
        const switchTrackButton = buttonContainer.querySelector('.btn-pink');
        const icon = switchTrackButton.querySelector('.material-symbols-outlined');
        const rules = document.getElementById('game-rules');
        if (this.activeTrack === 'melody') {
            icon.textContent = 'grid_on';
            switchTrackButton.setAttribute('aria-label', 'Switch to Drums');
            rules.textContent = 'Melody Mode: Top is high, bottom is low.';
        } else {
            icon.textContent = 'music_note';
            switchTrackButton.setAttribute('aria-label', 'Switch to Melody');
            rules.textContent = 'Drums: Kick, Snare, Clap, Closed Hat, Open Hat, Low/Mid/High Toms';
        }
        this.updateBoard();
    },

    switchInstrument: function(instrumentName, isInitial = false) {
        if (this.synth) { this.synth.dispose(); }

        const instrumentKeys = Object.keys(this.instrumentPresets);
        let nextInstrumentName = instrumentName;

        if (!isInitial) {
            const currentIndex = instrumentKeys.indexOf(this.gameState.currentInstrument);
            nextInstrumentName = instrumentKeys[(currentIndex + 1) % instrumentKeys.length];
        }
        
        const preset = this.instrumentPresets[nextInstrumentName];
        this.synth = new Tone.PolySynth(preset.synth, preset.options).toDestination();
        this.gameState.currentInstrument = nextInstrumentName;
        
        if (!isInitial) {
            this.updateStats();
            playSound('C5', '8n');
        }
    },

    cleanup: function() {
        // Gracefully dispose of all Tone.js objects to prevent memory leaks
        if (this.sequencer) { this.sequencer.stop(); this.sequencer.dispose(); this.sequencer = null; }
        if (this.synth) { this.synth.dispose(); this.synth = null; }
        if (this.drumKit) { Object.values(this.drumKit).forEach(synth => synth.dispose()); this.drumKit = null; }
        if (Tone.Transport.state === 'started') { Tone.Transport.stop(); Tone.Transport.cancel(); }
        if (this.gameState) { this.gameState.isPlaying = false; }
    }
};
