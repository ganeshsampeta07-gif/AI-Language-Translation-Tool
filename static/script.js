document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    const sourceLang = document.getElementById('source-lang');
    const targetLang = document.getElementById('target-lang');
    const swapBtn = document.getElementById('swap-btn');
    const translateBtn = document.getElementById('translate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const charCountValue = document.getElementById('char-count-value');
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorToast = document.getElementById('error-message');
    const historyContainer = document.getElementById('history-container');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const statusMsg = document.getElementById('status-msg');
    
    const ttsSourceBtn = document.getElementById('tts-source-btn');
    const ttsTargetBtn = document.getElementById('tts-target-btn');

    const MAX_CHARS = 5000;
    const HISTORY_KEY = 'translator_history';
    const THEME_KEY = 'translator_theme';

    // Initialize Theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        body.classList.add('light-mode');
    }

    // Initialize History
    renderHistory();

    // Event Listeners
    sourceText.addEventListener('input', updateCharCount);
    
    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        targetText.value = '';
        updateCharCount();
        statusMsg.textContent = '';
    });

    swapBtn.addEventListener('click', () => {
        const tempLang = sourceLang.value;
        if (tempLang !== 'auto') {
            sourceLang.value = targetLang.value;
            targetLang.value = tempLang;
            
            const tempText = sourceText.value;
            sourceText.value = targetText.value;
            targetText.value = tempText;
            updateCharCount();
        } else {
            showError("Cannot swap when 'Auto Detect' is selected.");
        }
    });

    copyBtn.addEventListener('click', () => {
        if (!targetText.value) return;
        navigator.clipboard.writeText(targetText.value).then(() => {
            statusMsg.textContent = 'Copied to clipboard!';
            setTimeout(() => statusMsg.textContent = '', 2000);
        }).catch(err => {
            showError('Failed to copy text.');
        });
    });

    translateBtn.addEventListener('click', performTranslation);
    
    // Allow Ctrl+Enter to translate
    sourceText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            performTranslation();
        }
    });

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem(THEME_KEY, 'light');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem(THEME_KEY, 'dark');
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    });

    // Text to Speech logic
    ttsSourceBtn.addEventListener('click', () => speak(sourceText.value, sourceLang.value));
    ttsTargetBtn.addEventListener('click', () => speak(targetText.value, targetLang.value));

    // Functions
    function updateCharCount() {
        const length = sourceText.value.length;
        charCountValue.textContent = length;
        if (length > MAX_CHARS) {
            charCountValue.style.color = 'var(--danger-color)';
            sourceText.value = sourceText.value.substring(0, MAX_CHARS);
            charCountValue.textContent = MAX_CHARS;
        } else {
            charCountValue.style.color = '';
        }
    }

    async function performTranslation() {
        const text = sourceText.value.trim();
        const src = sourceLang.value;
        const tgt = targetLang.value;

        if (!text) {
            showError('Please enter some text to translate.');
            return;
        }

        if (src !== 'auto' && src === tgt) {
            showError('Source and target languages cannot be the same.');
            return;
        }

        loadingOverlay.classList.remove('hidden');
        errorToast.classList.add('hidden');
        statusMsg.textContent = '';

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    source_language: src,
                    target_language: tgt
                })
            });

            const data = await response.json();

            if (data.success) {
                targetText.value = data.translated_text;
                saveToHistory(text, data.translated_text, src, tgt);
                statusMsg.textContent = 'Translation successful';
                setTimeout(() => statusMsg.textContent = '', 2000);
            } else {
                showError(data.error || 'An error occurred during translation.');
            }
        } catch (error) {
            showError('Failed to connect to the server. Is it running?');
            console.error(error);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    function showError(message) {
        errorToast.textContent = message;
        errorToast.classList.remove('hidden');
        setTimeout(() => {
            errorToast.classList.add('hidden');
        }, 4000);
    }

    function getLanguageName(code) {
        const selector = document.querySelector(`#source-lang option[value="${code}"]`);
        return selector ? selector.textContent : code.toUpperCase();
    }

    function saveToHistory(srcText, tgtText, srcLang, tgtLang) {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        
        const newItem = {
            id: Date.now(),
            srcText,
            tgtText,
            srcLang,
            tgtLang,
            timestamp: new Date().toISOString()
        };

        history.unshift(newItem); // Add to beginning
        
        // Keep only last 10
        if (history.length > 10) {
            history.pop();
        }

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 1rem;">No history yet.</div>';
            return;
        }

        historyContainer.innerHTML = history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-langs">
                    ${getLanguageName(item.srcLang)} <i class="fa-solid fa-arrow-right"></i> ${getLanguageName(item.tgtLang)}
                </div>
                <div class="history-text">
                    <div class="source-txt">${item.srcText}</div>
                    <div class="target-txt">${item.tgtText}</div>
                </div>
            </div>
        `).join('');

        // Add click listeners to history items
        document.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.getAttribute('data-id'));
                const item = history.find(h => h.id === id);
                if (item) {
                    sourceLang.value = item.srcLang;
                    targetLang.value = item.tgtLang;
                    sourceText.value = item.srcText;
                    targetText.value = item.tgtText;
                    updateCharCount();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    function speak(text, langCode) {
        if (!text) return;
        if (!('speechSynthesis' in window)) {
            showError("Text-to-Speech is not supported in this browser.");
            return;
        }

        window.speechSynthesis.cancel(); // Stop any current speech
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Basic mapping for TTS languages if 'auto' or specific codes
        if (langCode === 'auto') {
            utterance.lang = 'en-US';
        } else {
            utterance.lang = langCode;
        }
        
        window.speechSynthesis.speak(utterance);
    }
});
