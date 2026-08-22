/**
 * NyayMitra Main Application Controller
 * Manages Navigation, Citizen Authentication, Global Theme, Settings, Multilingual Sync & Subcontrollers.
 */

class NyayMitraApp {
  constructor() {
    this.currentTab = 'nyayasetu';
    this.currentUser = JSON.parse(localStorage.getItem('nyaymitra_user') || 'null');
    this.init();
  }

  async init() {
    this.initTheme();
    this.initLanguage();
    this.initNavigation();
    this.initAuth();
    this.initSettingsModal();
    this.initSubControllers();
    await this.checkSystemHealth();
  }

  /* ========================================== */
  /* THEME MANAGEMENT (Light by default) */
  /* ========================================== */
  initTheme() {
    const savedTheme = localStorage.getItem('nyaymitra_theme') || 'light';
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-toggle-icon');

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
      if (themeBtn) themeBtn.title = 'Switch to Day (Light) Mode';
    } else {
      document.body.classList.remove('dark-theme');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
      if (themeBtn) themeBtn.title = 'Switch to Night (Dark) Mode';
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        const newTheme = isDark ? 'dark' : 'light';
        localStorage.setItem('nyaymitra_theme', newTheme);
        
        if (themeIcon) {
          themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        }
        themeBtn.title = isDark ? 'Switch to Day Mode' : 'Switch to Night Mode';
        
        if (window.lucide) window.lucide.createIcons();
        this.showToast(`Switched to ${isDark ? 'Night (Dark)' : 'Day (Light)'} Mode`);
      });
    }
  }

  /* ========================================== */
  /* MULTILINGUAL I18N SYNC */
  /* ========================================== */
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

  /* ========================================== */
  /* CITIZEN AUTHENTICATION (Phone OTP / Guest) */
  /* ========================================== */
  initAuth() {
    const authModal = document.getElementById('auth-modal');
    const authOpenBtns = document.querySelectorAll('.auth-open-btn');
    const authCloseBtn = document.getElementById('auth-close-btn');
    const sendOtpBtn = document.getElementById('auth-send-otp-btn');
    const verifyOtpBtn = document.getElementById('auth-verify-otp-btn');
    const guestBtn = document.getElementById('auth-guest-btn');
    const logoutBtn = document.getElementById('auth-logout-btn');
    
    const phoneInput = document.getElementById('auth-phone-input');
    const nameInput = document.getElementById('auth-name-input');
    const otpInput = document.getElementById('auth-otp-input');
    const otpStepDiv = document.getElementById('auth-otp-step');
    const phoneStepDiv = document.getElementById('auth-phone-step');

    // Update UI for logged-in user
    this.updateUserUI();

    authOpenBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (authModal) authModal.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
      });
    });

    if (authCloseBtn && authModal) {
      authCloseBtn.addEventListener('click', () => {
        authModal.classList.add('hidden');
      });
    }

    // Step 1: Send OTP
    if (sendOtpBtn) {
      sendOtpBtn.addEventListener('click', async () => {
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const name = nameInput ? nameInput.value.trim() : 'Citizen';
        if (!phone || phone.length < 8) {
          alert('Please enter a valid 10-digit mobile number or email.');
          return;
        }

        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending OTP...';

        try {
          const res = await window.NyayMitraAPI.sendOtp(phone, name);
          if (res.success) {
            if (phoneStepDiv) phoneStepDiv.classList.add('hidden');
            if (otpStepDiv) otpStepDiv.classList.remove('hidden');
            if (otpInput) otpInput.value = res.demo_otp || '123456';
            this.showToast(res.message);
          }
        } catch (err) {
          alert('Failed: ' + err.message);
        } finally {
          sendOtpBtn.disabled = false;
          sendOtpBtn.textContent = 'Send Verification OTP';
        }
      });
    }

    // Step 2: Verify OTP
    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', async () => {
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const name = nameInput ? nameInput.value.trim() : 'Citizen User';
        const otp = otpInput ? otpInput.value.trim() : '';

        if (!otp) {
          alert('Please enter the OTP sent to your phone.');
          return;
        }

        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = 'Verifying...';

        try {
          const res = await window.NyayMitraAPI.verifyOtp(phone, otp, name);
          if (res.success) {
            this.currentUser = res.user;
            localStorage.setItem('nyaymitra_user', JSON.stringify(res.user));
            this.updateUserUI();
            this.showToast(`Welcome back, ${res.user.name}!`);
            if (authModal) authModal.classList.add('hidden');
          }
        } catch (err) {
          alert('Verification Failed: ' + err.message);
        } finally {
          verifyOtpBtn.disabled = false;
          verifyOtpBtn.textContent = 'Verify & Sign In';
        }
      });
    }

    // Guest Mode Login
    if (guestBtn) {
      guestBtn.addEventListener('click', () => {
        const guestUser = {
          name: 'Guest Citizen',
          phone_or_email: 'guest@nyaymitra.in',
          role: 'Guest',
          authenticated: true,
          dockets_count: 0
        };
        this.currentUser = guestUser;
        localStorage.setItem('nyaymitra_user', JSON.stringify(guestUser));
        this.updateUserUI();
        this.showToast('Logged in as Guest Citizen');
        if (authModal) authModal.classList.add('hidden');
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('nyaymitra_user');
        this.currentUser = null;
        this.updateUserUI();
        this.showToast('You have been signed out.');
      });
    }
  }

  updateUserUI() {
    const userAvatarText = document.getElementById('header-user-name');
    const userAvatarPill = document.getElementById('header-user-pill');
    const userStatusText = document.getElementById('auth-status-display');
    const profileNameInput = document.getElementById('profile-name-input');

    if (this.currentUser && this.currentUser.name) {
      if (userAvatarText) userAvatarText.textContent = this.currentUser.name;
      if (userAvatarPill) {
        userAvatarPill.title = `Signed in as ${this.currentUser.name} (${this.currentUser.phone_or_email || 'Verified'})`;
      }
      if (userStatusText) {
        userStatusText.innerHTML = `<span class="text-emerald-600 font-bold">● Active:</span> ${this.currentUser.name}`;
      }
      if (profileNameInput) {
        profileNameInput.value = this.currentUser.name;
      }
    } else {
      if (userAvatarText) userAvatarText.textContent = 'Sign In';
      if (userStatusText) {
        userStatusText.innerHTML = `<span class="text-slate-400">● Guest Mode</span>`;
      }
    }
  }

  /* ========================================== */
  /* NAVIGATION & TAB ROUTING */
  /* ========================================== */
  initNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });

    // Horizontal Scroll Arrows for 100% full screen access
    const navTrack = document.getElementById('nav-tabs-track');
    const scrollLeftBtn = document.getElementById('nav-scroll-left');
    const scrollRightBtn = document.getElementById('nav-scroll-right');

    if (navTrack && scrollLeftBtn) {
      scrollLeftBtn.addEventListener('click', () => {
        navTrack.scrollBy({ left: -220, behavior: 'smooth' });
      });
    }

    if (navTrack && scrollRightBtn) {
      scrollRightBtn.addEventListener('click', () => {
        navTrack.scrollBy({ left: 220, behavior: 'smooth' });
      });
    }

    // Handle hash in URL if present
    const hash = window.location.hash.replace('#', '');
    if (hash && ['nyayasetu', 'chat', 'drafter', 'analyzer', 'schemes', 'statutes', 'rights', 'library', 'profile'].includes(hash)) {
      this.switchTab(hash);
    } else {
      this.switchTab('nyayasetu');
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    window.location.hash = tabId;

    // Update all active nav buttons across header, subnav, and mobile bottom bar
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
        // Smoothly bring active button into center view in scrollable track
        try {
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (e) {}
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

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) window.lucide.createIcons();
  }

  /* ========================================== */
  /* GEMINI CONFIGURATION MODAL */
  /* ========================================== */
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
            statusDot.className = health.gemini_configured ? 'w-2.5 h-2.5 rounded-full bg-emerald-500' : 'w-2.5 h-2.5 rounded-full bg-amber-500';
          }
          if (statusText) {
            statusText.textContent = health.gemini_configured ? 'Gemini AI Active' : 'Offline Civic Engine Active';
          }
          if (maskedKeyText) {
            maskedKeyText.textContent = health.gemini_configured ? `Key: ${health.masked_key || 'Configured in .env'}` : 'No API key set (Running Offline Database)';
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
        testBtn.innerHTML = `<span class="inline-block w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> Testing...`;

        try {
          const res = await window.NyayMitraAPI.testConfig(newKey || null, model);
          if (testStatusBox) {
            testStatusBox.classList.remove('hidden');
            if (res.success) {
              testStatusBox.className = 'p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs';
              testStatusBox.innerHTML = `
                <div class="flex items-center gap-1.5 font-bold mb-1">
                  <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> ${res.message}
                </div>
                <div class="text-[11px] text-emerald-700 font-mono">Response: "${res.sample_response || 'OK'}"</div>
              `;
            } else {
              testStatusBox.className = 'p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs';
              testStatusBox.innerHTML = `
                <div class="flex items-center gap-1.5 font-bold mb-1">
                  <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600"></i> Connection Failed
                </div>
                <div class="text-[11px] text-rose-700">${res.message}</div>
              `;
            }
            if (window.lucide) window.lucide.createIcons();
          }
        } catch (e) {
          if (testStatusBox) {
            testStatusBox.classList.remove('hidden');
            testStatusBox.className = 'p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs';
            testStatusBox.textContent = 'Test error: ' + e.message;
          }
        } finally {
          testBtn.disabled = false;
          testBtn.innerHTML = `<i data-lucide="zap" class="w-3.5 h-3.5 text-amber-600"></i> <span>Test Connection</span>`;
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
        saveBtn.textContent = 'Saving...';

        try {
          const res = await window.NyayMitraAPI.updateConfig(newKey || null, model);
          if (res.success) {
            this.showToast('Gemini configuration saved!');
            if (apiKeyInput) apiKeyInput.value = '';
            await refreshModalStatus();
            await this.checkSystemHealth();
            modal.classList.add('hidden');
          }
        } catch (e) {
          alert('Failed to update config: ' + e.message);
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
      const statusText = document.getElementById('ai-status-text');
      const statusDot = document.getElementById('ai-status-dot');

      if (data && data.gemini_configured) {
        if (statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
        if (statusText) statusText.textContent = `AI Ready (${data.default_model || 'gemini-3.7-flash'})`;
      } else {
        if (statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-amber-500';
        if (statusText) statusText.textContent = 'NyayaSetu Civic Engine (Active)';
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
      console.error('Subcontroller initialization error:', err);
    }
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  window.nyayMitra = new NyayMitraApp();
});
