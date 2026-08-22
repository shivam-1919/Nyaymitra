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
        buttonEl.innerHTML = `<i data-lucide="square" class="w-3.5 h-3.5 text-rose-600"></i> <span>Stop</span>`;
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
      <div class="chat-bubble-user max-w-[80%] px-4 py-3 rounded-2xl bg-blue-600 text-white text-xs sm:text-sm font-medium shadow-md">
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
        <div class="mt-3.5 pt-3 border-t border-slate-200 flex flex-wrap gap-2 items-center">
          <span class="text-xs text-blue-700 font-bold flex items-center gap-1">
            <i data-lucide="scale" class="w-3.5 h-3.5"></i> Cited Statutes:
          </span>
          ${statuteRefs.map(st => `
            <span class="px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-50 border border-blue-200 text-blue-900 font-semibold">
              ⚖️ ${st.bns_section || st.ipc_section} (${st.title})
            </span>
          `).join('')}
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md font-bold text-xs mt-1">
        NM
      </div>
      <div class="chat-bubble-bot flex-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-800 text-xs sm:text-sm">
        <div class="prose-legal">${parsedHtml}</div>
        ${statutesHtml}
        
        <div class="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span class="font-mono text-[10px] text-slate-400">${modelUsed || 'NyayMitra AI'}</span>
          <div class="flex items-center gap-2">
            <button 
              class="chat-tts-btn px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-all flex items-center gap-1"
              data-text="${this.escapeHtml(markdownContent)}"
            >
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-blue-600"></i>
              <span>Listen</span>
            </button>
            <button 
              class="chat-copy-msg-btn px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-all flex items-center gap-1"
              data-text="${this.escapeHtml(markdownContent)}"
            >
              <i data-lucide="copy" class="w-3.5 h-3.5 text-slate-500"></i>
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
      <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md font-bold text-xs mt-1">
        NM
      </div>
      <div class="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-75"></span>
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150"></span>
        <span class="text-slate-600 font-medium ml-1">Analyzing statutory provisions &amp; case precedents...</span>
      </div>
    `;
    this.chatContainer.appendChild(typingDiv);
    this.scrollToBottom();
    return id;
  }

  removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  clearChat() {
    this.history = [];
    if (this.chatContainer) {
      this.chatContainer.innerHTML = `
        <div class="flex items-start gap-2.5">
          <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
            <i data-lucide="scale" class="w-3.5 h-3.5"></i>
          </div>
          <div class="chat-bubble-bot p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm space-y-2 shadow-sm">
            <p class="font-bold text-xs text-blue-700">Namaste! I am your NyayMitra Legal Guide.</p>
            <p>You can ask me about consumer disputes, cheque bounce notices, police FIR procedures, property partition, tenancy eviction rules, or matrimonial rights under Indian law.</p>
            <div id="quick-prompt-chips" class="flex flex-wrap gap-1.5 pt-1">
              <button class="quick-chip text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors" data-prompt="What should I do if a builder delays flat possession by 2 years?">
                🏢 Builder Possession Delay
              </button>
              <button class="quick-chip text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors" data-prompt="Can police arrest someone without a warrant in a bailable offence?">
                👮 Police Arrest Rights (BNSS)
              </button>
              <button class="quick-chip text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors" data-prompt="How do I get free legal aid from NALSA / DLSA?">
                ⚖️ Free Legal Aid Guide
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
    window.nyayMitra?.showToast("Chat cleared.");
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

window.LegalChatController = LegalChatController;
