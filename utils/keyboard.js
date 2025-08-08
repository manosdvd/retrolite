export class Keyboard {
    constructor(keyLayout, onKeyPress) {
        this.keyLayout = keyLayout;
        this.onKeyPress = onKeyPress;
        this.keyboardContainer = document.getElementById('keyboard-container');
        this.init();
    }

    init() {
        this.keyboardContainer.innerHTML = '';
        this.keyboardContainer.className = 'keyboard';

        this.keyLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const keyEl = document.createElement('button');
                keyEl.className = 'key';
                let displayText = key;
                let dataKey = key.toLowerCase();

                if (key === 'Enter') { displayText = '⏎'; }
                if (key === 'Backspace') { displayText = '⌫'; }

                keyEl.textContent = displayText;
                keyEl.dataset.key = dataKey;
                keyEl.setAttribute('aria-label', key === 'Enter' ? 'Enter key' : key === 'Backspace' ? 'Backspace key' : `Key ${key}`);

                if (key === 'Enter' || key === 'Backspace') {
                    keyEl.classList.add('key-large');
                }
                keyEl.addEventListener('click', () => this.onKeyPress(key));
                rowDiv.appendChild(keyEl);
            });
            this.keyboardContainer.appendChild(rowDiv);
        });
    }

    updateKey(key, className) {
        const keyEl = this.keyboardContainer.querySelector(`[data-key="${key.toLowerCase()}"]`);
        if (keyEl) {
            keyEl.classList.add(className);
        }
    }

    enableKey(key, enabled) {
        const keyEl = this.keyboardContainer.querySelector(`[data-key="${key.toLowerCase()}"]`);
        if (keyEl) {
            keyEl.disabled = !enabled;
        }
    }
}
