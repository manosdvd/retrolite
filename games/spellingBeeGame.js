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
        const action = spellingBeeGame.actionButton.textContent;
        if (action === 'Submit') {
            spellingBeeGame.handleSubmitWord();
        } else { // Handles 'Next Word' and 'Play Again'
            spellingBeeGame.handleNextWordClick();
        }
    },

    handleDocumentKeydown: function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Trigger the action button's current function
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

        spellingBeeGame.createVoiceSelector();
        gameBoard.appendChild(spellingBeeGame.voiceSelectorContainer);

        spellingBeeGame.wordInput = document.createElement('input');
        spellingBeeGame.wordInput.type = 'text';
        spellingBeeGame.wordInput.id = 'wordInput';
        spellingBeeGame.wordInput.placeholder = 'Type the word here...';
        spellingBeeGame.wordInput.classList.add('bg-gray-800', 'border', 'border-gray-600', 'rounded-md', 'p-3', 'w-full', 'max-w-sm', 'text-center', 'text-2xl', 'font-bold', 'text-white', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
        spellingBeeGame.wordInput.readOnly = true;
        gameBoard.appendChild(spellingBeeGame.wordInput);

        spellingBeeGame.messageBox = document.createElement('div');
        spellingBeeGame.messageBox.id = 'message';
        spellingBeeGame.messageBox.className = 'message-box hidden h-24';
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

        spellingBeeGame.speakWordBtn = createControlButton('Hear Word', 'btn-blue', () => spellingBeeGame.handleSpeakWord());
        spellingBeeGame.actionButton = createControlButton('Submit', 'btn-green', spellingBeeGame.handleActionClick);
        
        buttonContainer.appendChild(spellingBeeGame.speakWordBtn);
        buttonContainer.appendChild(spellingBeeGame.actionButton);

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
        spellingBeeGame.wordInput.readOnly = true;

        spellingBeeGame.actionButton.textContent = 'Submit';
        spellingBeeGame.actionButton.disabled = true;
        spellingBeeGame.actionButton.className = 'control-button btn-green'; // Reset classes
        spellingBeeGame.speakWordBtn.disabled = false;

        spellingBeeGame.hideMessage();
        spellingBeeGame.showMessage('Click to hear the word!', 'info');
        spellingBeeGame.enableKeyboard(false);
    },

    endGame: function() {
        spellingBeeGame.showMessage(`Game Over! You scored ${spellingBeeGame.score} out of ${spellingBeeGame.totalWordsToPlay}.`, 'info');
        spellingBeeGame.speakWordBtn.disabled = true;
        spellingBeeGame.wordInput.readOnly = true;
        
        spellingBeeGame.actionButton.textContent = 'Play Again';
        spellingBeeGame.actionButton.className = 'control-button btn-yellow'; // Change color
        spellingBeeGame.actionButton.disabled = false;
        
        spellingBeeGame.enableKeyboard(false);
    },

    handleSpeakWord: function() {
        spellingBeeGame.speakWordBtn.disabled = true;
        spellingBeeGame.showMessage('Listen carefully...', 'info');
        spellingBeeGame.speakWord(spellingBeeGame.currentWord.word, () => {
            spellingBeeGame.wordInput.readOnly = false;
            spellingBeeGame.actionButton.disabled = false;
            spellingBeeGame.enableKeyboard(true);
            spellingBeeGame.wordInput.focus();
            spellingBeeGame.showMessage(`Spell the word. Hint: ${spellingBeeGame.currentWord.definition}`, 'info');
            spellingBeeGame.speakWordBtn.disabled = false;
        });
    },

    handleSubmitWord: function() {
        if (spellingBeeGame.actionButton.disabled) return;

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
        spellingBeeGame.enableKeyboard(false);
        spellingBeeGame.actionButton.disabled = false;
        spellingBeeGame.speakWordBtn.disabled = true;

        const nextActionText = (spellingBeeGame.wordsAttempted < spellingBeeGame.totalWordsToPlay) ? 'Next Word' : 'Play Again';
        spellingBeeGame.actionButton.textContent = nextActionText;
        spellingBeeGame.actionButton.className = 'control-button btn-yellow';
    },

    handleNextWordClick: function() {
        if (spellingBeeGame.actionButton.textContent === 'Play Again') {
            spellingBeeGame.resetGame();
        } else {
            spellingBeeGame.startGame();
        }
    },

    handleKeyboardInput: function(key) {
        if (spellingBeeGame.wordInput.readOnly) return;
        let currentValue = spellingBeeGame.wordInput.value;
        if (navigator.vibrate) navigator.vibrate(50);

        if (key === 'Backspace') {
            spellingBeeGame.wordInput.value = currentValue.slice(0, -1);
            playSound('C3', '8n');
        } else if (key.match(/^[a-zA-Z]$/)) {
            spellingBeeGame.wordInput.value += key.toLowerCase();
            const note = spellingBeeGame.noteMap[key.toLowerCase()];
            if (note) playSound(note, '16n');
        }
    },

    updateStats: function() {
        updateStats(`Score: ${spellingBeeGame.score} / ${spellingBeeGame.wordsAttempted} of ${spellingBeeGame.totalWordsToPlay}`);
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
        if (!spellingBeeGame.speechSynthesis) return;
        const populate = () => {
            spellingBeeGame.voices = spellingBeeGame.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
            if (spellingBeeGame.voices.length > 0) {
                const defaultVoice =
                    spellingBeeGame.voices.find(v => v.name.includes('Google') && v.lang === 'en-US') ||
                    spellingBeeGame.voices.find(v => v.default && v.lang === 'en-US') ||
                    spellingBeeGame.voices.find(v => v.lang === 'en-US');
                spellingBeeGame.selectedVoiceURI = defaultVoice ? defaultVoice.voiceURI : spellingBeeGame.voices[0].voiceURI;
                spellingBeeGame.populateVoiceSelector();
            } else {
                spellingBeeGame.showMessage('No English text-to-speech voices found.', 'error');
            }
        };
        if (spellingBeeGame.speechSynthesis.getVoices().length > 0) {
            populate();
        } else {
            spellingBeeGame.speechSynthesis.onvoiceschanged = populate;
        }
    },

    createVoiceSelector: function() {
        spellingBeeGame.voiceSelectorContainer = document.createElement('div');
        spellingBeeGame.voiceSelectorContainer.className = 'w-full max-w-sm mb-2';
        const label = document.createElement('label');
        label.textContent = 'Speech Voice:';
        label.htmlFor = 'voice-selector';
        label.className = 'block text-sm font-medium text-gray-300 mb-1';
        spellingBeeGame.voiceSelector = document.createElement('select');
        spellingBeeGame.voiceSelector.id = 'voice-selector';
        spellingBeeGame.voiceSelector.className = 'bg-gray-700 border border-gray-600 rounded-md p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500';
        spellingBeeGame.voiceSelector.addEventListener('change', (e) => {
            spellingBeeGame.selectedVoiceURI = e.target.value;
        });
        spellingBeeGame.voiceSelectorContainer.appendChild(label);
        spellingBeeGame.voiceSelectorContainer.appendChild(spellingBeeGame.voiceSelector);
    },

    populateVoiceSelector: function() {
        if (!spellingBeeGame.voiceSelector) return;
        spellingBeeGame.voiceSelector.innerHTML = '';
        spellingBeeGame.voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.voiceURI;
            if (voice.voiceURI === spellingBeeGame.selectedVoiceURI) {
                option.selected = true;
            }
            spellingBeeGame.voiceSelector.appendChild(option);
        });
    },

    speakWord: function(wordText, callback) {
        if (!spellingBeeGame.speechSynthesis) {
            spellingBeeGame.showMessage('Text-to-speech not supported.', 'error');
            if (callback) callback();
            return;
        }
        spellingBeeGame.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(wordText);
        const selectedVoice = spellingBeeGame.voices.find(v => v.voiceURI === spellingBeeGame.selectedVoiceURI);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.onend = callback;
        utterance.onerror = (e) => {
            console.error('SpeechSynthesis Error', e);
            spellingBeeGame.showMessage('Error playing audio.', 'error');
            if (callback) callback();
        };
        spellingBeeGame.speechSynthesis.speak(utterance);
    },

    showMessage: function(msg, type = 'info') {
        spellingBeeGame.messageBox.innerHTML = '';
        const messageTextSpan = document.createElement('span');
        messageTextSpan.textContent = msg;
        spellingBeeGame.messageBox.appendChild(messageTextSpan);
        spellingBeeGame.messageBox.classList.remove('hidden', 'success', 'error', 'info');
        spellingBeeGame.messageBox.classList.add('message-box', type);
    },

    hideMessage: function() {
        spellingBeeGame.messageBox.classList.add('hidden');
    }
};