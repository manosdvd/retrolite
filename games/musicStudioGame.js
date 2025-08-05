const musicStudioGame = {
    // --- PROPERTIES ---
    synth: null,
    drumKit: null,
    sequencer: null,
    gridSize: { cols: 32, rows: 8 },
    activeTrack: 'melody',
    instrumentPresets: {
        // --- EXPANDED INSTRUMENT PALETTE WITH EMOJIS ---
        'Piano':    { synth: Tone.FMSynth,  options: { harmonicity: 3, modulationIndex: 14, envelope: { attack: 0.02, decay: 0.3, sustain: 0.1, release: 0.8 } }, colorClass: 'instrument-electric-piano', emoji: '🎹' },
        'Pluck':    { synth: Tone.PluckSynth, options: { attackNoise: 0.5, dampening: 4000, resonance: 0.9 }, colorClass: 'instrument-pluck', emoji: '🎸' },
        'Bell':     { synth: Tone.FMSynth,  options: { harmonicity: 2, modulationIndex: 10, modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.8 } }, colorClass: 'instrument-bell', emoji: '🔔' },
        'Strings':  { synth: Tone.AMSynth,  options: { harmonicity: 1.5, envelope: { attack: 0.1, decay: 0.5, sustain: 0.3, release: 1.2 } }, colorClass: 'instrument-synth-strings', emoji: '🎻' },
        'Brass':    { synth: Tone.FMSynth,  options: { harmonicity: 1.2, modulationIndex: 10, envelope: { attack: 0.05, decay: 0.4, sustain: 0.2, release: 0.7 } }, colorClass: 'instrument-brass-ensemble', emoji: '🎺' },
        'Bass':     { synth: Tone.MonoSynth,options: { oscillator: { type: 'square' }, filter: { Q: 2, type: 'lowpass', rolloff: -24 }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.6 } }, colorClass: 'instrument-synth-bass', emoji: '🔊' },
        'Lead':     { synth: Tone.Synth,    options: { oscillator: { type: 'fatsawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.5 } }, colorClass: 'instrument-synth-lead', emoji: '✨' },
        'Gameboy':  { synth: Tone.MonoSynth,options: { oscillator: { type: 'pulse', width: 0.4 }, filter: { Q: 1, type: 'lowpass', rolloff: -12 }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.8 } }, colorClass: 'instrument-gameboy', emoji: '👾' },
        'Laser':    { synth: Tone.Synth,    options: { oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 } }, pitchShift: -0.5, colorClass: 'instrument-laser', emoji: '🔫' },
        'Click':    { synth: Tone.Synth,    options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 } }, colorClass: 'instrument-click', emoji: '🖱️' },
    },
    gameState: {},
    ui: {}, // To hold references to UI elements

    // --- METHODS ---
    setup: function() {
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
        
        this.gameState = {
            melody: Array(this.gridSize.rows).fill(0).map(() => Array(this.gridSize.cols).fill(null)),
            drums: Array(this.gridSize.rows).fill(0).map(() => Array(this.gridSize.cols).fill(0)),
            tempo: 120, octave: 4, isPlaying: false, currentStep: -1, currentInstrument: 'Piano'
        };

        this.setupUI();
        this.setInstrument('Piano', true); 

        this.sequencer = new Tone.Sequence(this.playStep.bind(this), Array.from(Array(this.gridSize.cols).keys()), '16n');
        Tone.Transport.bpm.value = this.gameState.tempo;

        this.updateBoard();
    },

    setupUI: function() {
        const wrapper = document.getElementById('game-board-wrapper');
        
        const mainContainer = document.createElement('div');
        mainContainer.className = 'music-studio-main-container';
        
        const labelsContainer = document.createElement('div');
        labelsContainer.id = 'note-labels-container';
        labelsContainer.className = 'note-labels-container';
        
        gameBoard = document.createElement('div');
        gameBoard.id = 'game-board';
        gameBoard.className = 'music-studio-grid';
        gameBoard.style.gridTemplateColumns = `repeat(${this.gridSize.cols}, 1fr)`;

        for (let i = 0; i < this.gridSize.rows * this.gridSize.cols; i++) {
            const cell = document.createElement('div');
            const row = Math.floor(i / this.gridSize.cols);
            cell.className = `light note-row-${row}`;
            cell.dataset.index = i;
            gameBoard.appendChild(cell);
        }

        mainContainer.appendChild(labelsContainer);
        mainContainer.appendChild(gameBoard);
        wrapper.appendChild(mainContainer);

        this.setupLabels(labelsContainer);

        this.ui.instrumentButtons = {};
        const instrumentPalette = document.createElement('div');
        instrumentPalette.className = 'instrument-palette';

        // Create emoji buttons for each instrument
        for (const instrumentName in this.instrumentPresets) {
            const preset = this.instrumentPresets[instrumentName];
            const button = document.createElement('button');
            button.className = 'instrument-emoji-button';
            button.textContent = preset.emoji;
            button.title = instrumentName;
            button.onclick = () => this.setInstrument(instrumentName);
            instrumentPalette.appendChild(button);
            this.ui.instrumentButtons[instrumentName] = button;
        }

        // Create emoji button for the drum kit
        this.ui.drumButton = document.createElement('button');
        this.ui.drumButton.className = 'instrument-emoji-button';
        this.ui.drumButton.textContent = '🥁';
        this.ui.drumButton.title = 'Drums';
        this.ui.drumButton.onclick = () => this.setTrack('drums');
        instrumentPalette.appendChild(this.ui.drumButton);

        this.ui.playButton = createControlButton('Play', 'btn-green', () => this.togglePlayback(), 'play_arrow');
        this.ui.clearButton = createControlButton('Clear', 'btn-red', () => this.clearSequence(), 'delete');
        this.ui.tempoUpButton = createControlButton('Tempo+', 'btn-blue', () => this.changeTempo(10), 'arrow_upward');
        this.ui.tempoDownButton = createControlButton('Tempo-', 'btn-blue', () => this.changeTempo(-10), 'arrow_downward');
        this.ui.octaveUpButton = createControlButton('Octave+', 'btn-yellow', () => this.changeOctave(1), 'add');
        this.ui.octaveDownButton = createControlButton('Octave-', 'btn-yellow', () => this.changeOctave(-1), 'remove');
        
        buttonContainer.prepend(
            instrumentPalette,
            this.ui.octaveDownButton, 
            this.ui.octaveUpButton, 
            this.ui.tempoDownButton, 
            this.ui.tempoUpButton, 
            this.ui.clearButton, 
            this.ui.playButton
        );
        
        this.updateStats();
    },
    
    setInstrument: function(instrumentName, isInitial = false) {
        this.activeTrack = 'melody';
        
        for (const name in this.ui.instrumentButtons) {
            this.ui.instrumentButtons[name].classList.toggle('is-active', name === instrumentName);
        }
        this.ui.drumButton.classList.remove('is-active');

        this.ui.octaveUpButton.style.display = 'flex';
        this.ui.octaveDownButton.style.display = 'flex';

        this._loadInstrument(instrumentName, isInitial);
        
        const rules = document.getElementById('game-rules');
        rules.textContent = 'Melody Mode: Top is high, bottom is low.';
        
        this.updateBoard();
    },

    setTrack: function(trackName) {
        if (trackName !== 'drums') return;
        this.activeTrack = 'drums';

        for (const name in this.ui.instrumentButtons) {
            this.ui.instrumentButtons[name].classList.remove('is-active');
        }
        this.ui.drumButton.classList.add('is-active');
        
        this.ui.octaveUpButton.style.display = 'none';
        this.ui.octaveDownButton.style.display = 'none';
        
        const rules = document.getElementById('game-rules');
        rules.textContent = 'Drums: Kick, Snare, Clap, Closed Hat, Open Hat, Low/Mid/High Toms';

        this.updateBoard();
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
        updateStats(`Tempo: ${this.gameState.tempo} | Octave: ${this.gameState.octave}`);
    },

    handler: function(e) {
        const lightElement = e.target.closest('.light');
        if (!lightElement) return;

        const index = parseInt(lightElement.dataset.index);
        const col = index % this.gridSize.cols;
        const row = Math.floor(index / this.gridSize.cols);

        if (this.activeTrack === 'melody') {
            if (this.gameState.melody[row][col]) {
                this.gameState.melody[row][col] = null; 
            } else {
                this.gameState.melody[row][col] = this.gameState.currentInstrument;
                const note = this.getNote(row);
                if (this.instrumentPresets[this.gameState.currentInstrument].pitchShift) {
                    this.synth.set({ detune: -1200 });
                    this.synth.triggerAttackRelease(note, '8n');
                    this.synth.set({ detune: 0 });
                } else {
                    this.synth.triggerAttackRelease(note, '8n');
                }
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        } else {
            this.gameState.drums[row][col] = this.gameState.drums[row][col] ? 0 : 1;
            if (this.gameState.drums[row][col]) {
                this.playDrumSound(row);
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
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
        const playButton = this.ui.playButton.querySelector('.material-symbols-outlined');
        playButton.textContent = this.gameState.isPlaying ? 'pause' : 'play_arrow';
    },

    playStep: function(time, step) {
        for (let row = 0; row < this.gridSize.rows; row++) {
            const instrumentName = this.gameState.melody[row][step];
            if (instrumentName) {
                const note = this.getNote(row);
                // Trigger visual feedback
                Tone.Draw.schedule(() => {
                    const light = gameBoard.querySelector(`[data-index='${row * this.gridSize.cols + step}']`);
                    if (light) {
                        light.classList.add('is-playing-note');
                        setTimeout(() => light.classList.remove('is-playing-note'), 150);
                    }
                }, time);
                // Trigger audio
                if (this.instrumentPresets[instrumentName].pitchShift) {
                    this.synth.set({ detune: -1200 });
                    this.synth.triggerAttackRelease(note, '16n', time);
                    this.synth.set({ detune: 0 });
                } else {
                    this.synth.triggerAttackRelease(note, '16n', time);
                }
            }
            if (this.gameState.drums[row][step]) {
                this.playDrumSound(row, time);
            }
        }
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
        if (!gameBoard) return;
        const lights = gameBoard.querySelectorAll('.light');
        lights.forEach((light, i) => {
            const col = i % this.gridSize.cols;
            const row = Math.floor(i / this.gridSize.cols);
            
            light.className = `light note-row-${row}`; 
            
            const instrumentName = this.gameState.melody[row][col];
            if (instrumentName) {
                const colorClass = this.instrumentPresets[instrumentName]?.colorClass;
                if (colorClass) {
                    light.classList.add(colorClass);
                }
                // Display emoji on the note
                light.textContent = this.instrumentPresets[instrumentName]?.emoji || '';
            } else {
                light.textContent = ''; // Clear emoji if note is removed
            }

            if (this.gameState.drums[row][col]) {
                light.classList.add('is-player-2');
                light.textContent = '🥁';
            }

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
        this.gameState.melody = Array(this.gridSize.rows).fill(0).map(() => Array(this.gridSize.cols).fill(null));
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

    _loadInstrument: function(instrumentName, isInitial = false) {
        if (this.synth) { this.synth.dispose(); }
        
        const preset = this.instrumentPresets[instrumentName];
        if (!preset) {
            console.error(`Instrument preset "${instrumentName}" not found.`);
            return;
        }
        this.synth = new Tone.PolySynth(preset.synth, preset.options).toDestination();
        this.gameState.currentInstrument = instrumentName;
        
        if (!isInitial) {
            this.updateStats();
            audioManager.playSound('ui', 'C5', '8n');
        }
    },

    cleanup: function() {
        if (this.sequencer) { this.sequencer.stop(); this.sequencer.dispose(); this.sequencer = null; }
        if (this.synth) { this.synth.dispose(); this.synth = null; }
        if (this.drumKit) { Object.values(this.drumKit).forEach(synth => synth.dispose()); this.drumKit = null; }
        if (Tone.Transport.state === 'started') { Tone.Transport.stop(); Tone.Transport.cancel(); }
        if (this.gameState) { this.gameState.isPlaying = false; }
    }
};
