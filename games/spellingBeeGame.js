// retrogame/games/spellingBeeGame.js

const spellingBeeGame = {
    words: spellingWords,
    currentWord: null,
    score: 0,
    wordsAttempted: 0,
    totalWordsToPlay: 5,

    // UI Elements
    wordInput: null,
    messageBox: null,
    speakWordBtn: null,
    actionButton: null, // Single button for Submit/Next/Play Again
    voiceSelectorContainer: null,
    voiceSelector: null,

    // TTS State
    voices: [],
    selectedVoiceURI: null,
    speechSynthesis: window.speechSynthesis,

    // Musical note mapping
    noteMap: {
        'a': 'C3', 'b': 'D3', 'c': 'E3', 'd': 'F3', 'e': 'G3', 'f': 'A3', 'g': 'B3',
        'h': 'C4', 'i': 'D4', 'j': 'E4', 'k': 'F4', 'l': 'G4', 'm': 'A4', 'n': 'B4',
        'o': 'C4', 'p': 'D4', 'q': 'E4', 'r': 'F4', 's': 'G4', 't': 'A4', 'u': 'B4',
        'v': 'C4', 'w': 'D4', 'x': 'E4', 'y': 'F4', 'z': 'G4'
    },

    // --- Event Handlers ---
    handleActionClick: function() {
        const action = spellingBeeGame.actionButton.getAttribute('aria-label');
        if (action === 'Submit') {
            spellingBeeGame.handleSubmitWord();
        } else { // Handles 'Next Word' and 'Play Again'
            spellingBeeGame.handleNextWordClick();
        }
    },

    handleDocumentKeydown: function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            spellingBeeGame.handleActionClick();
            return;
        }

        if (spellingBeeGame.wordInput.readOnly || !e.key.match(/^[a-zA-Z]$/) && e.key !== 'Backspace') {
            return;
        }
        
        e.preventDefault();
        spellingBeeGame.handleKeyboardInput(e.key);
    },

    // --- Core Game Flow ---
    setup: function() {
        gameBoard.innerHTML = '';
        keyboardContainer.innerHTML = '';
        gameBoard.className = 'flex flex-col items-center justify-center gap-4 p-4';

        spellingBeeGame.speakWordBtn = createControlButton('Hear Word', 'btn-blue', () => spellingBeeGame.handleSpeakWord(), 'volume_up');
        gameBoard.appendChild(spellingBeeGame.speakWordBtn);

        spellingBeeGame.wordInput = document.createElement('input');
        spellingBeeGame.wordInput.type = 'text';
        spellingBeeGame.wordInput.id = 'wordInput';
        spellingBeeGame.wordInput.inputMode = 'none';
        spellingBeeGame.wordInput.placeholder = 'Type the word here...';
        spellingBeeGame.wordInput.setAttribute('autocomplete', 'off');
        spellingBeeGame.wordInput.classList.add('bg-gray-800', 'border', 'border-gray-600', 'rounded-md', 'p-3', 'w-full', 'max-w-sm', 'text-center', 'text-2xl', 'font-bold', 'text-white', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
        gameBoard.appendChild(spellingBeeGame.wordInput);

        spellingBeeGame.messageBox = document.createElement('div');
        spellingBeeGame.messageBox.id = 'message';
        spellingBeeGame.messageBox.className = 'message-box hidden h-12 text-center';
        gameBoard.appendChild(spellingBeeGame.messageBox);

        const keyLayout = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
        ];
        keyboard = new Keyboard(keyLayout, (key) => {
             if (key === 'Enter') {
                spellingBeeGame.handleActionClick();
            } else {
                spellingBeeGame.handleKeyboardInput(key);
            }
        });

        spellingBeeGame.actionButton = createControlButton('Submit', 'btn-green', spellingBeeGame.handleActionClick, 'check');
        const chooseVoiceBtn = createControlButton('Choose Voice', 'btn-pink', spellingBeeGame.showVoiceModal, 'record_voice_over');
        
        buttonContainer.appendChild(spellingBeeGame.actionButton);
        buttonContainer.appendChild(chooseVoiceBtn);

        window.addEventListener('keydown', spellingBeeGame.handleDocumentKeydown);
        spellingBeeGame.loadVoices();
        spellingBeeGame.resetGame();
    },

    cleanup: function() {
        window.removeEventListener('keydown', spellingBeeGame.handleDocumentKeydown);
        if (spellingBeeGame.speechSynthesis) {
            spellingBeeGame.speechSynthesis.onvoiceschanged = null;
        }
    },

    showVoiceModal: function() {
        const selectId = 'voice-selector-modal';
        let modalContent = `
            <div class="w-full max-w-sm mb-2">
                <label for="${selectId}" class="block text-sm font-medium mb-2" style="color: var(--md-sys-color-on-surface-variant);">Select a speech voice:</label>
                <select id="${selectId}" class="bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                </select>
            </div>
        `;

        const voiceModal = createModal(
            'voice-select-modal', 'Choose Voice', modalContent, 'Done', 
            () => voiceModal.remove(), 'done', 'btn-green'
        );
        
        const selector = document.getElementById(selectId);
        spellingBeeGame.voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.voiceURI;
            if (voice.voiceURI === spellingBeeGame.selectedVoiceURI) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        selector.addEventListener('change', (e) => {
            spellingBeeGame.selectedVoiceURI = e.target.value;
        });

        setTimeout(() => voiceModal.classList.add('is-visible'), 10);
    },
    
    updateActionButton: function(icon, colorClass, label) {
        const button = this.actionButton;
        if (!button) return;

        // Update icon
        const iconSpan = button.querySelector('.material-symbols-outlined');
        if (iconSpan) {
            iconSpan.textContent = icon;
        }
        // Update color
        button.className = `control-button-icon ${colorClass}`;
        // Update accessibility label, which we now use to track the state
        button.setAttribute('aria-label', label);
    },

    resetGame: function() {
        spellingBeeGame.score = 0;
        spellingBeeGame.wordsAttempted = 0;
        spellingBeeGame.updateStats();
        spellingBeeGame.hideMessage();
        spellingBeeGame.wordInput.value = '';
        spellingBeeGame.wordInput.readOnly = true;
        spellingBeeGame.enableKeyboard(false);
        spellingBeeGame.startGame();
    },

    startGame: function() {
        if (spellingBeeGame.wordsAttempted >= spellingBeeGame.totalWordsToPlay) {
            spellingBeeGame.endGame();
            return;
        }
        spellingBeeGame.currentWord = spellingBeeGame.words[Math.floor(Math.random() * spellingBeeGame.words.length)];
        spellingBeeGame.wordInput.value = '';

        this.updateActionButton('check', 'btn-green', 'Submit');
        spellingBeeGame.actionButton.disabled = true;
        
        spellingBeeGame.speakWordBtn.disabled = false;

        spellingBeeGame.hideMessage();
        spellingBeeGame.showMessage('Click "Hear Word" to begin!', 'info');
        spellingBeeGame.enableKeyboard(false);
    },

    endGame: function() {
        showWinModal('Game Over!', `You scored ${spellingBeeGame.score} out of ${spellingBeeGame.totalWordsToPlay}.`);
        // We use the main win modal which already has a "Play Again" button.
    },

    handleSpeakWord: function() {
        if (!spellingBeeGame.currentWord) return;

        if (spellingBeeGame.voices.length === 0) {
            spellingBeeGame.showMessage('Speech voices loading, please wait...', 'info');
            spellingBeeGame.loadVoices();
            return;
        }

        spellingBeeGame.speakWordBtn.disabled = true;
        spellingBeeGame.hideMessage();
        spellingBeeGame.speakWord(spellingBeeGame.currentWord.word, () => {
            spellingBeeGame.wordInput.readOnly = false;
            spellingBeeGame.actionButton.disabled = false;
            spellingBeeGame.enableKeyboard(true);
            spellingBeeGame.wordInput.focus();
            spellingBeeGame.showMessage(`Hint: ${spellingBeeGame.currentWord.definition}`, 'info');
            spellingBeeGame.speakWordBtn.disabled = false;
        });
    },

    handleSubmitWord: function() {
        if (this.actionButton.disabled) return;

        const userAnswer = this.wordInput.value.trim().toLowerCase();
        const correctAnswer = this.currentWord.word.toLowerCase();
        
        this.wordsAttempted++;

        if (userAnswer === correctAnswer) {
            this.score++;
            playSound('G5', '4n');

            // --- THIS IS THE NEW LOGIC ---
            // Create a custom modal for a correct answer
            const correctModal = createModal(
                'correct-word-modal',
                'Correct!',
                `<p class="text-xl">The word was:</p><p class="text-3xl font-bold" style="color: var(--md-sys-color-primary);">${this.currentWord.word}</p>`,
                'Next Word',
                () => {
                    correctModal.remove();
                    this.handleNextWordClick(); // Proceed to next word/end game
                },
                'arrow_forward',
                'btn-green'
            );

            // Add confetti just like the main win modal
            const confettiContainer = correctModal.querySelector('.confetti-container');
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                confettiContainer.appendChild(confetti);
            }

            setTimeout(() => correctModal.classList.add('is-visible'), 10);
            
            this.actionButton.disabled = true;
            this.speakWordBtn.disabled = true;

        } else {
            // Logic for an incorrect answer remains the same
            playSound('C3', '8n');
            this.showMessage(`Incorrect. The correct word was "${this.currentWord.word}".`, 'error');
            this.enableKeyboard(false);
            this.actionButton.disabled = false;
            this.speakWordBtn.disabled = true;
            
            const nextActionText = (this.wordsAttempted < this.totalWordsToPlay) ? 'Next Word' : 'Play Again';
            this.updateActionButton((nextActionText === 'Next Word' ? 'arrow_forward' : 'refresh'), 'btn-yellow', nextActionText);
        }

        this.updateStats();
    },

    handleNextWordClick: function() {
        if (this.wordsAttempted >= this.totalWordsToPlay) {
            this.endGame();
        } else {
            this.startGame();
        }
    },
    
    handleKeyboardInput: function(key) {
        if (this.wordInput.readOnly) return;
        let currentValue = this.wordInput.value;
        if (navigator.vibrate) navigator.vibrate(50);

        if (key === 'Backspace') {
            this.wordInput.value = currentValue.slice(0, -1);
            playSound('C3', '8n');
        } else if (key.match(/^[a-zA-Z]$/)) {
            this.wordInput.value += key.toLowerCase();
            const note = this.noteMap[key.toLowerCase()];
            if (note) playSound(note, '16n');
        }
    },

    updateStats: function() {
        updateStats(`Score: ${this.score} / ${this.wordsAttempted} of ${this.totalWordsToPlay}`);
    },

    enableKeyboard: function(enable) {
        if (!keyboard) return;
        for (const row of keyboard.keyLayout) {
            for (const key of row) {
                keyboard.enableKey(key, enable);
            }
        }
    },

    loadVoices: function() {
        if (!this.speechSynthesis) return;
        const populate = () => {
            this.voices = this.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
            if (this.voices.length > 0) {
                const defaultVoice =
                    this.voices.find(v => v.name.includes('Google') && v.lang === 'en-US') ||
                    this.voices.find(v => v.default && v.lang === 'en-US') ||
                    this.voices.find(v => v.lang === 'en-US');
                this.selectedVoiceURI = defaultVoice ? defaultVoice.voiceURI : this.voices[0].voiceURI;
            } else {
                this.showMessage('No English text-to-speech voices found.', 'error');
            }
        };

        if (this.speechSynthesis.getVoices().length > 0) {
            populate();
        } else {
            this.speechSynthesis.onvoiceschanged = populate;
        }
    },

    speakWord: function(wordText, callback) {
        if (!this.speechSynthesis) {
            this.showMessage('Text-to-speech not supported.', 'error');
            if (callback) callback();
            return;
        }
        this.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(wordText);
        const selectedVoice = this.voices.find(v => v.voiceURI === this.selectedVoiceURI);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.onend = callback;
        utterance.onerror = (e) => {
            console.error('SpeechSynthesis Error', e);
            this.showMessage('Error playing audio.', 'error');
            if (callback) callback();
        };
        this.speechSynthesis.speak(utterance);
    },

    showMessage: function(msg, type = 'info') {
        this.messageBox.innerHTML = '';
        const messageTextSpan = document.createElement('span');
        messageTextSpan.textContent = msg;
        this.messageBox.appendChild(messageTextSpan);
        this.messageBox.classList.remove('hidden', 'success', 'error', 'info');
        this.messageBox.classList.add('message-box', type);
    },

    hideMessage: function() {
        this.messageBox.classList.add('hidden');
    }
};