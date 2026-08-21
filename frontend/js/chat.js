/**
 * NyayMitra AI Legal Chatbot, Voice Assistant & Text-to-Speech
 */

class LegalChatController {
  constructor() {
    this.history = [];
    this.currentLanguage = window.i18n ? window.i18n.getLanguage() : 'English';
    this.isRecording = false;
    this.recognition = null;
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isSpeaking = false;
    
    this.initElements();
    this.initSpeechRecognition();
    this.bindEvents();

    if (window.i18n) {
      window.i18n.onLanguageChange((lang) => {
        this.currentLanguage = lang;
      });
    }
  }

  initElements() {
    this.chatContainer = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.voiceBtn = document.getElementById('chat-voice-btn');
    this.clearBtn = document.getElementById('chat-clear-btn');
    this.quickChipsContainer = document.getElementById('quick-prompt-chips');
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      
      this.recognition.onstart = () => {
        this.isRecording = true;
        if (this.voiceBtn) {
          this.voiceBtn.classList.add('listening-pulse');
          this.voiceBtn.title = "Listening... Speak your legal query now";
        }
        window.nyayMitra?.showToast("🎙️ Listening... Speak now");
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.chatInput) {
          this.chatInput.value = transcript;
          this.handleSendMessage();
        }
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
      alert("Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }
    if (this.isRecording) {
      this.recognition.stop();
    } else {
      const langCode = window.i18n ? window.i18n.getSpeechLangCode() : 'en-IN';
      this.recognition.lang = langCode;
      try {
        this.recognition.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
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

    // Quick prompt chip delegates
    if (this.quickChipsContainer) {
      this.quickChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.quick-chip');
        if (chip) {
          const prompt = chip.getAttribute('data-prompt');
          if (prompt && this.chatInput) {
            this.chatInput.value = prompt;
            this.handleSendMessage();
          }
        }
      });
    }

    // Delegate Speech (Text-to-Speech) / Copy buttons inside chat
    if (this.chatContainer) {
      this.chatContainer.addEventListener('click', (e) => {
        const ttsBtn = e.target.closest('.chat-tts-btn');
        if (ttsBtn) {
          const text = ttsBtn.getAttribute('data-text');
          this.speakText(text, ttsBtn);
          return;
        }

        const copyBtn = e.target.closest('.chat-copy-msg-btn');
        if (copyBtn) {
          const text = copyBtn.getAttribute('data-text');
          if (text) {
            navigator.clipboard.writeText(text);
            window.nyayMitra?.showToast("Message copied to clipboard!");
          }
          return;
        }
      });
    }
  }

  speakText(text, buttonEl) {
    if (!this.synth) {
      alert("Text to speech is not supported in this browser.");
      return;
    }

    if (this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      document.querySelectorAll('.chat-tts-btn').forEach(btn => {
        btn.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i> <span>Listen</span>`;
      });
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/[*#_`~\[\]]/g, '')
      .replace(/\(http[^\)]+\)/g, '')
      .replace(/<[^>]*>/g, '');

    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    const speechLang = window.i18n ? window.i18n.getSpeechLangCode() : 'en-IN';
    this.currentUtterance.lang = speechLang;
    this.currentUtterance.rate = 1.0;

    this.currentUtterance.onstart = () => {
      this.isSpeaking = true;
      if (buttonEl) {
        buttonEl.innerHTML = `<i data-lucide="square" class="w-3.5 h-3.5 text-rose-400"></i> <span>Stop</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    };

    this.currentUtterance.onend = () => {
      this.isSpeaking = false;
      if (buttonEl) {
        buttonEl.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i> <span>Listen</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    };

    this.currentUtterance.onerror = () => {
      this.isSpeaking = false;
      if (buttonEl) {
        buttonEl.innerHTML = `<i data-lucide="volume-2" class="w-3.5 h-3.5"></i> <span>Listen</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    };

    this.synth.speak(this.currentUtterance);
  }

  async handleSendMessage() {
    const text = this.chatInput ? this.chatInput.value.trim() : '';
    if (!text) return;

    this.appendUserMessage(text);
    if (this.chatInput) {
      this.chatInput.value = '';
      this.chatInput.focus();
    }

    const typingId = this.showTypingIndicator();

    try {
      const activeLang = window.i18n ? window.i18n.getLanguage() : 'English';
      const response = await window.NyayMitraAPI.sendChatMessage(
        text,
        this.history,
        activeLang
      );

      this.removeTypingIndicator(typingId);

      if (response && response.reply) {
        this.appendBotMessage(response.reply, response.statute_references, response.model_used);
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
    if (!this.chatContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex justify-end mb-4 animate-fade-in';
    msgDiv.innerHTML = `
      <div class="chat-bubble-user">
        <p class="whitespace-pre-wrap">${this.escapeHtml(text)}</p>
      </div>
    `;
    this.chatContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  appendBotMessage(markdownContent, statuteRefs = [], modelUsed = '') {
    if (!this.chatContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex items-start gap-3 mb-6 animate-fade-in';
    
    const parsedHtml = window.marked ? window.marked.parse(markdownContent) : markdownContent;
    
    let statutesHtml = '';
    if (statuteRefs && statuteRefs.length > 0) {
      statutesHtml = `
        <div class="mt-3.5 pt-3 border-t border-slate-700/60 flex flex-wrap gap-2 items-center">
          <span class="text-xs text-amber-400 font-bold flex items-center gap-1">
            <i data-lucide="scale" class="w-3.5 h-3.5"></i> Cited Statutes:
          </span>
          ${statuteRefs.map(st => `
            <span class="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950/80 border border-slate-800 text-slate-200">
              ⚖️ ${st.bns_section || st.ipc_section} (${st.title})
            </span>
          `).join('')}
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md font-bold text-xs mt-1">
        NM
      </div>
      <div class="chat-bubble-bot flex-1">
        <div class="prose-legal">${parsedHtml}</div>
        ${statutesHtml}
        
        <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span class="font-mono text-[10px] text-slate-500">${modelUsed || 'NyayMitra AI'}</span>
          <div class="flex items-center gap-2">
            <button 
              class="chat-tts-btn px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 text-[11px] font-semibold transition-all flex items-center gap-1"
              data-text="${this.escapeHtml(markdownContent)}"
            >
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>Listen</span>
            </button>
            <button 
              class="chat-copy-msg-btn px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 text-[11px] font-semibold transition-all flex items-center gap-1"
              data-text="${this.escapeHtml(markdownContent)}"
            >
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.chatContainer.appendChild(msgDiv);
    if (window.lucide) window.lucide.createIcons();
    this.scrollToBottom();
  }

  showTypingIndicator() {
    if (!this.chatContainer) return null;
    const typingDiv = document.createElement('div');
    const id = 'typing-' + Date.now();
    typingDiv.id = id;
    typingDiv.className = 'flex items-start gap-3 mb-4 animate-fade-in';
    typingDiv.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 text-xs">
        <i data-lucide="sparkles" class="w-4 h-4 animate-spin"></i>
      </div>
      <div class="chat-bubble-bot py-3 px-4 flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
        <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" style="animation-delay: 0.2s"></span>
        <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" style="animation-delay: 0.4s"></span>
        <span class="ml-2 text-slate-300">Formulating statutory legal counsel...</span>
      </div>
    `;
    this.chatContainer.appendChild(typingDiv);
    if (window.lucide) window.lucide.createIcons();
    this.scrollToBottom();
    return id;
  }

  removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  clearChat() {
    this.history = [];
    if (this.synth) this.synth.cancel();
    if (this.chatContainer) {
      this.chatContainer.innerHTML = `
        <div class="flex items-start gap-3 mb-6">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 flex-shrink-0 shadow-md font-bold text-xs mt-1">
            NM
          </div>
          <div class="chat-bubble-bot flex-1">
            <h3 class="text-amber-400 font-bold text-base mb-1" data-i18n="chat.welcome.heading">Namaste! I am NyayMitra (न्यायमित्र) ⚖️</h3>
            <p class="text-sm text-slate-300 mb-2 leading-relaxed" data-i18n="chat.welcome.text1">
              I am your AI Legal Assistant, trained on Indian jurisprudence, the new <strong>Bharatiya Nyaya Sanhita (BNS 2023)</strong>, Consumer Protection Act, RTI, and citizen rights.
            </p>
            <p class="text-xs text-slate-400" data-i18n="chat.welcome.text2">
              You can ask questions in English, हिन्दी (Hindi), Marathi, Bengali, Tamil, Telugu, Gujarati, or Hinglish.
            </p>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      if (window.i18n) window.i18n.translateDOM(this.chatContainer);
    }
    window.nyayMitra?.showToast("Started new consultation session");
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
  }

  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

window.LegalChatController = LegalChatController;
