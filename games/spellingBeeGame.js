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

        // Removed speakWordBtn from here
        spellingBeeGame.submitWordBtn = createControlButton('Submit', 'btn-green', () => spellingBeeGame.handleSubmitWord());
        spellingBeeGame.nextWordBtn = createControlButton('Next Word', 'btn-yellow', () => spellingBeeGame.handleNextWordClick());
        
        buttonContainer.appendChild(spellingBeeGame.submitWordBtn);
        buttonContainer.appendChild(spellingBeeGame.nextWordBtn);

        window.addEventListener('keydown', spellingBeeGame.handleDocumentKeydown);
        gameBoard.addEventListener('touchstart', spellingBeeGame.handleDocumentTouchStart, { passive: false });
        keyboardContainer.addEventListener('touchstart', spellingBeeGame.handleDocumentTouchStart, { passive: false });

        spellingBeeGame.resetGame();
    },

    cleanup: function() {
        window.removeEventListener('keydown', spellingBeeGame.handleDocumentKeydown);
        gameBoard.removeEventListener('touchstart', spellingBeeGame.handleDocumentTouchStart);
        keyboardContainer.removeEventListener('touchstart', spellingBeeGame.handleDocumentTouchStart);
        
        if (spellingBeeGame.wordInput) {
            spellingBeeGame.wordInput.style.caretColor = '';
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
        // spellingBeeGame.speakWordBtn.disabled = false; // Removed
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
        // spellingBeeGame.speakWordBtn.disabled = false; // Removed
        spellingBeeGame.nextWordBtn.classList.add('hidden');
        spellingBeeGame.hideMessage();
        // Modified showMessage to include the button
        spellingBeeGame.showMessage('Click to hear the word!', 'info', true);
        spellingBeeGame.enableKeyboard(false);
    },

    endGame: function() {
        spellingBeeGame.showMessage(`Game Over! You scored ${spellingBeeGame.score} out of ${spellingBeeGame.totalWordsToPlay}.`, 'info');
        // spellingBeeGame.speakWordBtn.disabled = true; // Removed
        spellingBeeGame.wordInput.readOnly = true;
        spellingBeeGame.submitWordBtn.disabled = true;
        spellingBeeGame.nextWordBtn.textContent = 'Play Again';
        spellingBeeGame.nextWordBtn.classList.remove('hidden');
        spellingBeeGame.enableKeyboard(false);
    },

    handleSpeakWord: function() {
        spellingBeeGame.speakWord(spellingBeeGame.currentWord.word, () => {
            spellingBeeGame.wordInput.readOnly = false;
            spellingBeeGame.submitWordBtn.disabled = false;
            spellingBeeGame.enableKeyboard(true);
            spellingBeeGame.wordInput.focus();
            spellingBeeGame.showMessage(`Spell the word. Hint: ${spellingBeeGame.currentWord.definition}`, 'info');
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
        // spellingBeeGame.speakWordBtn.disabled = true; // Removed
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
        } else if (key === 'Clear') {
            spellingBeeGame.wordInput.value = '';
        } else {
            spellingBeeGame.wordInput.value += key.toLowerCase();
        }
    },

    updateStats: function() {
        updateStats(`Score: ${spellingBeeGame.score} / ${spellingBeeGame.wordsAttempted} of ${spellingBeeGame.totalWordsToPlay}`);
    },

    createKeyboard: function() {
        // Clear any existing keyboard elements
        keyboardContainer.innerHTML = ''; 

        // Define keyboard layout
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
                keyDiv.className = 'key'; // Use the standardized 'key' class
                keyDiv.textContent = key;
                keyDiv.dataset.key = key.length > 1 ? key : key.toLowerCase();
                if (key.length > 1) {
                    keyDiv.classList.add('key-large'); // Apply 'key-large' for wider keys
                }
                // Attach click listener
                keyDiv.addEventListener('click', () => spellingBeeGame.handleKeyboardInput(key)); 
                rowDiv.appendChild(keyDiv);
            });
            keyboardContainer.appendChild(rowDiv);
        });
    },

    enableKeyboard: function(enable) {
        keyboardContainer.querySelectorAll('.key').forEach(b => b.disabled = !enable);
    },

    speakWord: function(wordText, callback) {
        if (!('speechSynthesis' in window)) {
            spellingBeeGame.showMessage('Text-to-speech not supported in this browser.', 'error');
            if (callback) callback();
            return;
        }

        window.speechSynthesis.cancel();

        let callbackFired = false;
        const ensureCallback = () => {
            if (!callbackFired) {
                callbackFired = true;
                if (callback) callback();
            }
        };

        const utterance = new SpeechSynthesisUtterance(wordText);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.onend = ensureCallback;
        utterance.onerror = (e) => {
            console.error('SpeechSynthesis Error', e);
            spellingBeeGame.showMessage('Error playing audio.', 'error');
            ensureCallback();
        };

        const performSpeech = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const preferredVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.default));
                utterance.voice = preferredVoice || voices.find(v => v.lang === 'en-US');
                window.speechSynthesis.speak(utterance);
            } else {
                spellingBeeGame.showMessage('Could not find voices for speech. Please try a different browser or ensure voices are enabled.', 'error');
                ensureCallback();
            }
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            performSpeech();
        } else {
            const voicesLoadedListener = () => {
                window.speechSynthesis.removeEventListener('voiceschanged', voicesLoadedListener);
                performSpeech();
            };
            window.speechSynthesis.addEventListener('voiceschanged', voicesLoadedListener);

            setTimeout(() => {
                if (!callbackFired && !window.speechSynthesis.speaking) {
                    window.speechSynthesis.removeEventListener('voiceschanged', voicesLoadedListener);
                    spellingBeeGame.showMessage('Speech voices took too long to load or are unavailable.', 'error');
                    ensureCallback();
                }
            }, 3000);
        }
    },

    showMessage: function(msg, type = 'info', includeSpeakButton = false) {
        spellingBeeGame.messageBox.innerHTML = ''; // Clear previous content
        
        const messageTextSpan = document.createElement('span');
        messageTextSpan.textContent = msg;
        spellingBeeGame.messageBox.appendChild(messageTextSpan);

        if (includeSpeakButton) {
            const speakButton = document.createElement('button');
            speakButton.textContent = 'Hear Word';
            speakButton.classList.add('control-button', 'btn-blue', 'ml-2'); // Add some margin
            speakButton.onclick = () => spellingBeeGame.handleSpeakWord();
            spellingBeeGame.messageBox.appendChild(speakButton);
        }

        spellingBeeGame.messageBox.classList.remove('hidden', 'success', 'error', 'info');
        spellingBeeGame.messageBox.classList.add('message-box', type);
    },

    hideMessage: function() {
        spellingBeeGame.messageBox.classList.add('hidden');
    }
};