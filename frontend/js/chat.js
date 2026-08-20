/**
 * NyayMitra AI Legal Chatbot & Voice Assistant
 */

class LegalChatController {
  constructor() {
    this.history = [];
    this.currentLanguage = 'English';
    this.isRecording = false;
    this.recognition = null;
    this.synth = window.speechSynthesis;
    this.speakingUtterance = null;
    
    this.initElements();
    this.initSpeechRecognition();
    this.bindEvents();
  }

  initElements() {
    this.chatContainer = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.voiceBtn = document.getElementById('chat-voice-btn');
    this.clearBtn = document.getElementById('chat-clear-btn');
    this.quickChipsContainer = document.getElementById('quick-prompt-chips');
    this.languageSelect = document.getElementById('language-select');
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      
      this.recognition.onstart = () => {
        this.isRecording = true;
        this.voiceBtn.classList.add('listening-pulse');
        this.voiceBtn.title = "Listening... Speak your legal query now";
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.chatInput.value = transcript;
        this.handleSendMessage();
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.stopVoiceInput();
      };

      this.recognition.onend = () => {
        this.stopVoiceInput();
      };
    } else if (this.voiceBtn) {
      this.voiceBtn.title = "Speech recognition not supported in this browser";
    }
  }

  toggleVoiceInput() {
    if (!this.recognition) {
      alert("Voice input is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }
    if (this.isRecording) {
      this.recognition.stop();
    } else {
      // Set language code based on selected language
      const langMap = {
        'English': 'en-IN',
        'Hindi': 'hi-IN',
        'Hinglish': 'hi-IN',
        'Bengali': 'bn-IN',
        'Marathi': 'mr-IN',
        'Tamil': 'ta-IN',
        'Telugu': 'te-IN',
        'Gujarati': 'gu-IN'
      };
      this.recognition.lang = langMap[this.currentLanguage] || 'en-IN';
      try {
        this.recognition.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  }

  stopVoiceInput() {
    this.isRecording = false;
    if (this.voiceBtn) {
      this.voiceBtn.classList.remove('listening-pulse');
      this.voiceBtn.title = "Click to ask with voice";
    }
  }

  bindEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    }

    if (this.chatInput) {
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearChat());
    }

    if (this.languageSelect) {
      this.languageSelect.addEventListener('change', (e) => {
        this.currentLanguage = e.target.value;
      });
    }

    // Quick prompt chip delegates
    if (this.quickChipsContainer) {
      this.quickChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.quick-chip');
        if (chip) {
          const prompt = chip.getAttribute('data-prompt');
          if (prompt) {
            this.chatInput.value = prompt;
            this.handleSendMessage();
          }
        }
      });
    }
  }

  async handleSendMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    // Append user message
    this.appendUserMessage(text);
    this.chatInput.value = '';
    this.chatInput.focus();

    // Show loading typing indicator
    const typingId = this.showTypingIndicator();

    try {
      const response = await window.NyayMitraAPI.sendChatMessage(
        text,
        this.history,
        this.currentLanguage
      );

      this.removeTypingIndicator(typingId);

      if (response && response.reply) {
        this.appendBotMessage(response.reply, response.statute_references, response.model_used);
        // Add to history
        this.history.push({ role: 'user', content: text });
        this.history.push({ role: 'assistant', content: response.reply });
      } else {
        this.appendBotMessage("I apologize, but I could not generate a response at this moment. Please try again.");
      }
    } catch (err) {
      this.removeTypingIndicator(typingId);
      this.appendBotMessage(`⚠️ **Error retrieving legal counsel:** ${err.message || 'Unable to connect to NyayMitra server.'}`);
    }
  }

  appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex justify-end mb-4 animate-fade-in';
    msgDiv.innerHTML = `
      <div class="chat-bubble-user">
        <p class="text-sm md:text-base whitespace-pre-wrap">${this.escapeHtml(text)}</p>
      </div>
    `;
    this.chatContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  appendBotMessage(markdownContent, statuteRefs = [], modelUsed = '') {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex items-start gap-3 mb-6 animate-fade-in';
    
    // Parse markdown safely
    const parsedHtml = window.marked ? window.marked.parse(markdownContent) : markdownContent;
    
    let statutesHtml = '';
    if (statuteRefs && statuteRefs.length > 0) {
      statutesHtml = `
        <div class="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap gap-2 items-center">
          <span class="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <i data-lucide="scale" class="w-3.5 h-3.5"></i> Cited Statutes:
          </span>
          ${statuteRefs.map(s => `
            <span class="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20" title="${s.title}">
              ${s.bns_section} (${s.ipc_reference})
            </span>
          `).join('')}
        </div>
      `;
    }

    const uniqueId = 'bot_msg_' + Date.now();
    
    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md font-bold text-xs mt-1">
        NM
      </div>
      <div class="chat-bubble-bot flex-1" id="${uniqueId}">
        <div class="prose-legal">
          ${parsedHtml}
        </div>
        ${statutesHtml}
        <div class="mt-3 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span class="text-slate-400 font-mono text-[11px]">Powered by ${modelUsed || 'NyayMitra AI'}</span>
          <div class="flex items-center gap-2">
            <button class="btn-tts hover:text-amber-400 transition-colors p-1" title="Listen to response">
              <i data-lucide="volume-2" class="w-4 h-4"></i>
            </button>
            <button class="btn-copy hover:text-amber-400 transition-colors p-1" title="Copy response">
              <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    this.chatContainer.appendChild(msgDiv);
    
    // Bind TTS and Copy actions for this bubble
    const ttsBtn = msgDiv.querySelector('.btn-tts');
    const copyBtn = msgDiv.querySelector('.btn-copy');

    if (ttsBtn) {
      ttsBtn.addEventListener('click', () => {
        this.speakText(markdownContent, ttsBtn);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(markdownContent);
        copyBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>`;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          copyBtn.innerHTML = `<i data-lucide="copy" class="w-4 h-4"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      });
    }

    if (window.lucide) window.lucide.createIcons();
    this.scrollToBottom();
  }

  speakText(text, buttonElement) {
    if (!this.synth) return;
    
    if (this.synth.speaking) {
      this.synth.cancel();
      if (buttonElement) {
        buttonElement.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i>`;
        if (window.lucide) window.lucide.createIcons();
      }
      return;
    }

    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[#*`_\[\]()]/g, '').replace(/<[^>]*>/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    if (buttonElement) {
      buttonElement.innerHTML = `<i data-lucide="volume-x" class="w-4 h-4 text-rose-400"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }

    utterance.onend = () => {
      if (buttonElement) {
        buttonElement.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4"></i>`;
        if (window.lucide) window.lucide.createIcons();
      }
    };

    this.synth.speak(utterance);
  }

  showTypingIndicator() {
    const id = 'typing_' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'flex items-start gap-3 mb-4 animate-fade-in';
    typingDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 flex-shrink-0 font-bold text-xs">
        NM
      </div>
      <div class="chat-bubble-bot flex items-center gap-1.5 py-3 px-4">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 0s;"></span>
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 0.2s;"></span>
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 0.4s;"></span>
        <span class="text-xs text-amber-200 ml-2 font-medium">NyayMitra is evaluating Indian statutes...</span>
      </div>
    `;
    this.chatContainer.appendChild(typingDiv);
    this.scrollToBottom();
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  clearChat() {
    this.history = [];
    if (this.synth && this.synth.speaking) this.synth.cancel();
    this.chatContainer.innerHTML = `
      <div class="flex items-start gap-3 mb-6 animate-fade-in">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md font-bold text-xs mt-1">
          NM
        </div>
        <div class="chat-bubble-bot flex-1">
          <h3 class="text-amber-400 font-bold text-base mb-1">Namaste! I am NyayMitra (न्यायमित्र) ⚖️</h3>
          <p class="text-sm text-slate-300 mb-2">
            Your trusted AI Legal Companion grounded in the Indian Legal System, Bharatiya Nyaya Sanhita (BNS 2023), Consumer Protection Act, and citizen fundamental rights.
          </p>
          <p class="text-xs text-slate-400">
            How can I assist you with your legal query, dispute, or rights today? You can type below or tap the microphone to speak.
          </p>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

window.LegalChatController = LegalChatController;
