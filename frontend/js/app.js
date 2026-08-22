/**
 * NyayMitra Main Application Controller
 * Manages Navigation, Global Theme, Settings, Multilingual i18n Sync, and Subcontrollers.
 */

class NyayMitraApp {
  constructor() {
    this.currentTab = 'nyayasetu';
    this.init();
  }

  async init() {
    this.initLanguage();
    this.initTheme();
    this.initNavigation();
    this.initSettingsModal();
    this.initSubControllers();
    await this.checkSystemHealth();
  }

  initLanguage() {
    const langSelect = document.getElementById('language-select');
    const savedLang = localStorage.getItem('nyaymitra_language') || 'English';

    if (langSelect) {
      langSelect.value = savedLang;
      langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        if (window.i18n) {
          window.i18n.setLanguage(newLang);
        }
        this.showToast(`Language set to: ${newLang}`);
      });
    }

    if (window.i18n) {
      window.i18n.onLanguageChange((lang) => {
        if (langSelect && langSelect.value !== lang) {
          langSelect.value = lang;
        }
      });
      window.i18n.setLanguage(savedLang);
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('nyaymitra_theme') || 'dark';
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-toggle-icon');

    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
      if (themeBtn) themeBtn.title = 'Switch to Night Mode';
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
      if (themeBtn) themeBtn.title = 'Switch to Day Mode';
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('nyaymitra_theme', newTheme);
        
        if (themeIcon) {
          themeIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        }
        themeBtn.title = isLight ? 'Switch to Night Mode' : 'Switch to Day Mode';
        
        if (window.lucide) window.lucide.createIcons();
        this.showToast(`Switched to ${isLight ? 'Day (Light)' : 'Night (Dark)'} Mode`);
      });
    }
  }

  initNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Handle hash in URL if present
    const hash = window.location.hash.replace('#', '');
    if (hash && ['nyayasetu', 'chat', 'drafter', 'analyzer', 'schemes', 'statutes', 'rights'].includes(hash)) {
      this.switchTab(hash);
    } else {
      this.switchTab('nyayasetu');
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    window.location.hash = tabId;

    // Update active nav button
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show active tab view
    document.querySelectorAll('.tab-view').forEach(view => {
      if (view.id === `view-${tabId}`) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });

    // Scroll smoothly to top on tab switch (especially helpful for phone screens)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) window.lucide.createIcons();
  }

  initSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('settings-open-btn');
    const closeBtn = document.getElementById('settings-close-btn');
    const saveBtn = document.getElementById('settings-save-btn');
    const testBtn = document.getElementById('settings-test-btn');
    const apiKeyInput = document.getElementById('settings-api-key');
    const modelSelect = document.getElementById('settings-model-select');
    
    const statusDot = document.getElementById('modal-status-dot');
    const statusText = document.getElementById('modal-status-text');
    const maskedKeyText = document.getElementById('modal-masked-key');
    const modelBadge = document.getElementById('modal-model-badge');
    const testStatusBox = document.getElementById('settings-test-status');

    const refreshModalStatus = async () => {
      try {
        const health = await window.NyayMitraAPI.checkHealth();
        if (health) {
          if (statusDot) {
            statusDot.className = health.gemini_configured ? 'w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50' : 'w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50';
          }
          if (statusText) {
            statusText.textContent = health.gemini_configured ? 'Gemini AI Active' : 'Offline Knowledge Engine Active';
          }
          if (maskedKeyText) {
            maskedKeyText.textContent = health.gemini_configured ? `Key: ${health.masked_key || 'Configured in .env'}` : 'No API key set (Running Offline Engine)';
          }
          if (modelBadge) {
            modelBadge.textContent = health.default_model || 'gemini-3.7-flash';
          }
          if (modelSelect && health.default_model) {
            modelSelect.value = health.default_model;
          }
        }
      } catch (e) {
        console.warn('Error fetching status for modal:', e);
      }
    };

    if (openBtn && modal) {
      openBtn.addEventListener('click', async () => {
        if (testStatusBox) testStatusBox.classList.add('hidden');
        await refreshModalStatus();
        modal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }

    // Test API Key Connection
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        const newKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        const model = modelSelect ? modelSelect.value : 'gemini-3.7-flash';

        testBtn.disabled = true;
        testBtn.innerHTML = `<span class="inline-block w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span> Testing...`;

        try {
          const res = await window.NyayMitraAPI.testConfig(newKey || null, model);
          if (testStatusBox) {
            testStatusBox.classList.remove('hidden');
            if (res.success) {
              testStatusBox.className = 'p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs';
              testStatusBox.innerHTML = `
                <div class="flex items-center gap-1.5 font-bold mb-1">
                  <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> ${res.message}
                </div>
                <div class="text-[11px] text-emerald-200/80 font-mono">Response: "${res.sample_response || 'OK'}"</div>
              `;
            } else {
              testStatusBox.className = 'p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs';
              testStatusBox.innerHTML = `
                <div class="flex items-center gap-1.5 font-bold mb-1">
                  <i data-lucide="alert-circle" class="w-4 h-4 text-rose-400"></i> Connection Test Failed
                </div>
                <div class="text-[11px] text-rose-200/80">${res.message}</div>
              `;
            }
            if (window.lucide) window.lucide.createIcons();
          }
        } catch (e) {
          if (testStatusBox) {
            testStatusBox.classList.remove('hidden');
            testStatusBox.className = 'p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs';
            testStatusBox.textContent = 'Test error: ' + e.message;
          }
        } finally {
          testBtn.disabled = false;
          testBtn.innerHTML = `<i data-lucide="zap" class="w-3.5 h-3.5 text-amber-400"></i> <span>Test Connection</span>`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // Save Settings
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const newKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        const model = modelSelect ? modelSelect.value : 'gemini-3.7-flash';

        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";

        try {
          const res = await window.NyayMitraAPI.updateConfig(newKey || null, model);
          if (res.success) {
            this.showToast("Gemini configuration saved!");
            if (apiKeyInput) apiKeyInput.value = '';
            await refreshModalStatus();
            await this.checkSystemHealth();
            modal.classList.add('hidden');
          }
        } catch (e) {
          alert("Failed to update config: " + e.message);
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> <span>Save Configuration</span>`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }
  }

  showToast(msg) {
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }, 3200);
    }
  }

  async checkSystemHealth() {
    try {
      const data = await window.NyayMitraAPI.checkHealth();
      const statusPill = document.getElementById('ai-status-pill');
      const statusText = document.getElementById('ai-status-text');
      const statusDot = document.getElementById('ai-status-dot');

      if (data && data.gemini_configured) {
        if (statusDot) {
          statusDot.className = 'status-dot active';
        }
        if (statusText) {
          statusText.textContent = `Gemini AI Active (${data.default_model || 'gemini-3.7-flash'})`;
        }
      } else {
        if (statusDot) {
          statusDot.className = 'status-dot offline';
        }
        if (statusText) {
          statusText.textContent = 'NyayaSetu Civic Engine (Active)';
        }
      }
    } catch (e) {
      console.warn('Health check error:', e);
    }
  }

  initSubControllers() {
    try {
      if (window.NyayaSetuController) {
        this.nyayasetuCtrl = new window.NyayaSetuController();
      }
      if (window.WelfareSchemesController) {
        this.schemesCtrl = new window.WelfareSchemesController();
      }
      if (window.LegalChatController) {
        this.chatCtrl = new window.LegalChatController();
      }
      if (window.LegalDrafterController) {
        this.drafterCtrl = new window.LegalDrafterController();
      }
      if (window.LegalAnalyzerController) {
        this.analyzerCtrl = new window.LegalAnalyzerController();
      }
      if (window.StatutesController) {
        this.statutesCtrl = new window.StatutesController();
      }
      if (window.CitizenRightsController) {
        this.rightsCtrl = new window.CitizenRightsController();
      }
    } catch (err) {
      console.error("Subcontroller initialization error:", err);
    }
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  window.nyayMitra = new NyayMitraApp();
});
