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
    submitWordBtn: null,
    nextWordBtn: null,
    voiceSelectorContainer: null, // To hold the voice selector dropdown
    voiceSelector: null,

    // TTS State
    voices: [],
    selectedVoiceURI: null,
    speechSynthesis: window.speechSynthesis, // Cache the synthesis object

    // Musical note mapping for keyboard input
    noteMap: {
        'a': 'C4', 'b': 'D4', 'c': 'E4', 'd': 'F4', 'e': 'G4', 'f': 'A4', 'g': 'B4', 
        'h': 'C5', 'i': 'D5', 'j': 'E5', 'k': 'F5', 'l': 'G5', 'm': 'A5', 'n': 'B5',
        'o': 'C6', 'p': 'D6', 'q': 'E6', 'r': 'F6', 's': 'G6', 't': 'A6', 'u': 'B6',
        'v': 'C7', 'w': 'D7', 'x': 'E7', 'y': 'F7', 'z': 'G7'
    },

    // Event handler for physical keyboard input
    handleDocumentKeydown: function(e) {
        if (spellingBeeGame.wordInput.readOnly) {
            e.preventDefault();
            return;
        }
        const key = e.key;
        if (key.length === 1 && key.match(/[a-zA-Z]/)) {
            spellingBeeGame.handleKeyboardInput(key);
            e.preventDefault();
        } else if (key === 'Enter') {
            spellingBeeGame.handleSubmitWord();
            e.preventDefault();
        } else if (key === 'Backspace') {
            spellingBeeGame.handleKeyboardInput(key);
            e.preventDefault();
        }
    },
    
    // Event handler to prevent mobile keyboard from appearing
    handleDocumentTouchStart: function(e) {
        if (e.target === spellingBeeGame.wordInput) {
            e.preventDefault();
        }
    },

    // --- Core Game Flow ---
    setup: function() {
        gameBoard.innerHTML = '';
        keyboardContainer.innerHTML = '';

        gameBoard.className = 'flex flex-col items-center justify-center gap-4 p-4';

        // --- Create and add the voice selector ---
        this.createVoiceSelector();
        gameBoard.appendChild(this.voiceSelectorContainer);

        spellingBeeGame.wordInput = document.createElement('input');
        spellingBeeGame.wordInput.type = 'text';
        spellingBeeGame.wordInput.id = 'wordInput';
        spellingBeeGame.wordInput.placeholder = 'Type the word here...';
        spellingBeeGame.wordInput.classList.add('bg-gray-800', 'border', 'border-gray-600', 'rounded-md', 'p-3', 'w-full', 'max-w-sm', 'text-center', 'text-2xl', 'font-bold', 'text-white', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
        
        spellingBeeGame.wordInput.readOnly = true;
        spellingBeeGame.wordInput.setAttribute('inputmode', 'none');
        spellingBeeGame.wordInput.setAttribute('readonly', 'readonly'); 
        spellingBeeGame.wordInput.style.caretColor = 'transparent';
        gameBoard.appendChild(spellingBeeGame.wordInput);

        spellingBeeGame.messageBox = document.createElement('div');
        spellingBeeGame.messageBox.id = 'message';
        spellingBeeGame.messageBox.className = 'message-box hidden h-24';
        gameBoard.appendChild(spellingBeeGame.messageBox);

        spellingBeeGame.createKeyboard();

        spellingBeeGame.speakWordBtn = createControlButton('Hear Word', 'btn-blue', () => spellingBeeGame.handleSpeakWord());
        spellingBeeGame.submitWordBtn = createControlButton('Submit', 'btn-green', () => spellingBeeGame.handleSubmitWord());
        spellingBeeGame.nextWordBtn = createControlButton('Next Word', 'btn-yellow', () => spellingBeeGame.handleNextWordClick());
        
        buttonContainer.appendChild(spellingBeeGame.speakWordBtn);
        buttonContainer.appendChild(spellingBeeGame.submitWordBtn);
        buttonContainer.appendChild(spellingBeeGame.nextWordBtn);

        window.addEventListener('keydown', spellingBeeGame.handleDocumentKeydown);
        gameBoard.addEventListener('touchstart', this.handleDocumentTouchStart, { passive: false });
        keyboardContainer.addEventListener('touchstart', this.handleDocumentTouchStart, { passive: false });

        this.loadVoices();
        spellingBeeGame.resetGame();
    },

    cleanup: function() {
        window.removeEventListener('keydown', spellingBeeGame.handleDocumentKeydown);
        gameBoard.removeEventListener('touchstart', this.handleDocumentTouchStart);
        keyboardContainer.removeEventListener('touchstart', this.handleDocumentTouchStart);
        
        if (spellingBeeGame.wordInput) {
            spellingBeeGame.wordInput.style.caretColor = '';
        }
        // Important: clear the onvoiceschanged handler to prevent memory leaks
        if (this.speechSynthesis) {
            this.speechSynthesis.onvoiceschanged = null;
        }
    },

    resetGame: function() {
        spellingBeeGame.score = 0;
        spellingBeeGame.wordsAttempted = 0;
        spellingBeeGame.updateStats();
        spellingBeeGame.hideMessage();
        spellingBeeGame.wordInput.value = '';
        spellingBeeGame.wordInput.readOnly = true;
        spellingBeeGame.submitWordBtn.disabled = true;
        spellingBeeGame.nextWordBtn.classList.add('hidden');
        spellingBeeGame.speakWordBtn.disabled = false;
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
        spellingBeeGame.wordInput.readOnly = true;
        spellingBeeGame.submitWordBtn.disabled = true;
        spellingBeeGame.speakWordBtn.disabled = false;
        spellingBeeGame.nextWordBtn.classList.add('hidden');
        spellingBeeGame.hideMessage();
        spellingBeeGame.showMessage('Click to hear the word!', 'info');
        spellingBeeGame.enableKeyboard(false);
    },

    endGame: function() {
        spellingBeeGame.showMessage(`Game Over! You scored ${spellingBeeGame.score} out of ${spellingBeeGame.totalWordsToPlay}.`, 'info');
        spellingBeeGame.speakWordBtn.disabled = true;
        spellingBeeGame.wordInput.readOnly = true;
        spellingBeeGame.submitWordBtn.disabled = true;
        spellingBeeGame.nextWordBtn.textContent = 'Play Again';
        spellingBeeGame.nextWordBtn.classList.remove('hidden');
        spellingBeeGame.enableKeyboard(false);
    },

    handleSpeakWord: function() {
        spellingBeeGame.speakWordBtn.disabled = true; // Disable while speaking
        spellingBeeGame.showMessage('Listen carefully...', 'info');
        spellingBeeGame.speakWord(spellingBeeGame.currentWord.word, () => {
            spellingBeeGame.wordInput.readOnly = false;
            spellingBeeGame.submitWordBtn.disabled = false;
            spellingBeeGame.enableKeyboard(true);
            spellingBeeGame.wordInput.focus();
            spellingBeeGame.showMessage(`Spell the word. Hint: ${spellingBeeGame.currentWord.definition}`, 'info');
            spellingBeeGame.speakWordBtn.disabled = false; // Re-enable after speaking
        });
    },

    handleSubmitWord: function() {
        if (spellingBeeGame.submitWordBtn.disabled) return;

        const userAnswer = spellingBeeGame.wordInput.value.trim().toLowerCase();
        const correctAnswer = spellingBeeGame.currentWord.word.toLowerCase();

        spellingBeeGame.wordsAttempted++;
        let messageText = "";
        let messageType = "info";

        if (userAnswer === correctAnswer) {
            spellingBeeGame.score++;
            messageText = `Correct! The word was "${spellingBeeGame.currentWord.word}".`;
            messageType = 'success';
            playSound('C5', '8n');
        } else {
            messageText = `Incorrect. The correct word was "${spellingBeeGame.currentWord.word}".`;
            messageType = 'error';
            playSound('C3', '8n');
        }
        spellingBeeGame.showMessage(messageText, messageType);
        spellingBeeGame.updateStats();

        spellingBeeGame.wordInput.readOnly = true;
        spellingBeeGame.submitWordBtn.disabled = true;
        spellingBeeGame.speakWordBtn.disabled = false; // Re-enable after submission
        spellingBeeGame.nextWordBtn.classList.remove('hidden');
        spellingBeeGame.nextWordBtn.textContent = (spellingBeeGame.wordsAttempted < spellingBeeGame.totalWordsToPlay) ? 'Next Word' : 'Play Again';
        spellingBeeGame.enableKeyboard(false);
    },

    handleNextWordClick: function() {
        if (spellingBeeGame.nextWordBtn.textContent === 'Play Again') {
            spellingBeeGame.resetGame();
        } else {
            spellingBeeGame.startGame();
        }
    },

    handleKeyboardInput: function(key) {
        if (spellingBeeGame.wordInput.readOnly) return;
        let currentValue = spellingBeeGame.wordInput.value;
        if (key === 'Backspace') {
            spellingBeeGame.wordInput.value = currentValue.slice(0, -1);
            playSound('C3', '8n'); // Play a low tone for backspace
        } else if (key === 'Clear') {
            spellingBeeGame.wordInput.value = '';
        } else {
            spellingBeeGame.wordInput.value += key.toLowerCase();
            const note = spellingBeeGame.noteMap[key.toLowerCase()];
            if (note) playSound(note, '16n');
        }
    },

    updateStats: function() {
        updateStats(`Score: ${spellingBeeGame.score} / ${spellingBeeGame.wordsAttempted} of ${spellingBeeGame.totalWordsToPlay}`);
    },

    createKeyboard: function() {
        keyboardContainer.innerHTML = ''; 
        const keys = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
        ];
        keys.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                let displayText = key;
                if (key === 'Enter') {
                    displayText = '⏎';
                } else if (key === 'Backspace') {
                    displayText = '⌫';
                }
                keyDiv.textContent = displayText;
                keyDiv.dataset.key = key;
                if (key === 'Enter' || key === 'Backspace') {
                    keyDiv.classList.add('key-large');
                }
                if (key === 'Enter') {
                    keyDiv.addEventListener('click', () => spellingBeeGame.handleSubmitWord());
                } else {
                    keyDiv.addEventListener('click', () => spellingBeeGame.handleKeyboardInput(key));
                }
                rowDiv.appendChild(keyDiv);
            });
            keyboardContainer.appendChild(rowDiv);
        });
    },

    enableKeyboard: function(enable) {
        keyboardContainer.querySelectorAll('.key').forEach(b => b.disabled = !enable);
    },

    // --- NEW AND UPDATED TTS FUNCTIONS ---

    loadVoices: function() {
        if (!this.speechSynthesis) return;

        const populate = () => {
            this.voices = this.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
            if (this.voices.length > 0) {
                // Try to find a high-quality default voice
                const defaultVoice = 
                    this.voices.find(v => v.name.includes('Google') && v.lang === 'en-US') ||
                    this.voices.find(v => v.default && v.lang === 'en-US') ||
                    this.voices.find(v => v.lang === 'en-US');

                this.selectedVoiceURI = defaultVoice ? defaultVoice.voiceURI : this.voices[0].voiceURI;
                this.populateVoiceSelector();
            } else {
                this.showMessage('No English text-to-speech voices found.', 'error');
            }
        };

        // Voices often load asynchronously.
        if (this.speechSynthesis.getVoices().length > 0) {
            populate();
        } else {
            this.speechSynthesis.onvoiceschanged = populate;
        }
    },

    createVoiceSelector: function() {
        this.voiceSelectorContainer = document.createElement('div');
        this.voiceSelectorContainer.className = 'w-full max-w-sm mb-2';
        
        const label = document.createElement('label');
        label.textContent = 'Speech Voice:';
        label.htmlFor = 'voice-selector';
        label.className = 'block text-sm font-medium text-gray-300 mb-1';

        this.voiceSelector = document.createElement('select');
        this.voiceSelector.id = 'voice-selector';
        this.voiceSelector.className = 'bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

        this.voiceSelector.addEventListener('change', (e) => {
            this.selectedVoiceURI = e.target.value;
        });
        
        this.voiceSelectorContainer.appendChild(label);
        this.voiceSelectorContainer.appendChild(this.voiceSelector);
    },

    populateVoiceSelector: function() {
        if (!this.voiceSelector) return;
        this.voiceSelector.innerHTML = '';
        this.voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.voiceURI;
            if (voice.voiceURI === this.selectedVoiceURI) {
                option.selected = true;
            }
            this.voiceSelector.appendChild(option);
        });
    },

    speakWord: function(wordText, callback) {
        if (!this.speechSynthesis) {
            this.showMessage('Text-to-speech not supported in this browser.', 'error');
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