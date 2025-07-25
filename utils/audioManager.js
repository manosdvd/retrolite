/**
 * AudioManager.js
 *
 * A centralized audio manager for the Retro Game Collection to handle
 * all sound effects and music using Tone.js. This ensures a reliable
 * and consistent audio experience across all games.
 */
class AudioManager {
    constructor() {
        // A collection of synthesizers for different sound categories.
        // Using PolySynth allows multiple sounds to play at once without cutting each other off.
        this.synths = {
            // For general UI feedback like button clicks
            ui: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
            }).toDestination(),

            // For positive feedback (correct answers, winning)
            positive: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 },
            }).toDestination(),

            // For negative feedback (incorrect answers, errors)
            negative: new Tone.PolySynth(Tone.FMSynth, {
                harmonicity: 1.5,
                modulationIndex: 5,
                envelope: { attack: 0.05, decay: 0.3, sustain: 0, release: 0.3 },
            }).toDestination(),

            // For game-specific actions (e.g., piece drops, toggles)
            game: new Tone.PolySynth(Tone.AMSynth, {
                harmonicity: 1.2,
                envelope: { attack: 0.02, decay: 0.15, sustain: 0, release: 0.2 },
            }).toDestination(),
        };

        // A flag to ensure the audio context is only started once.
        this.isInitialized = false;
    }

    /**
     * Initializes the Tone.js audio context.
     * This must be called after a user interaction (e.g., a click).
     */
    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            this.isInitialized = true;
            console.log("Audio Manager: Context started successfully.");
        } catch (e) {
            console.error("Audio Manager: Could not start audio context.", e);
        }
    }

    /**
     * Plays a sound using one of the predefined synth types.
     * @param {('ui'|'positive'|'negative'|'game')} type - The category of sound to play.
     * @param {string|string[]} note - The musical note(s) to play (e.g., 'C4', ['C4', 'E4']).
     * @param {string} [duration='8n'] - The duration of the note.
     */
    playSound(type, note, duration = '8n') {
        if (!this.isInitialized) {
            console.warn("Audio Manager: Audio not initialized. Ignoring playSound request.");
            return;
        }
        if (this.synths[type]) {
            this.synths[type].triggerAttackRelease(note, duration);
        } else {
            console.error(`Audio Manager: Unknown synth type "${type}".`);
        }
    }
}
