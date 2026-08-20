/**
 * NyayMitra API Client
 * Clean interface to FastAPI backend endpoints.
 */

const API = {
  baseURL: '',

  async checkHealth() {
    try {
      const res = await fetch(`${this.baseURL}/api/health`);
      return await res.json();
    } catch (err) {
      console.error('Health check failed:', err);
      return { status: 'offline', gemini_configured: false };
    }
  },

  async updateConfig(apiKey, model = null) {
    const res = await fetch(`${this.baseURL}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemini_api_key: apiKey, gemini_model: model })
    });
    return await res.json();
  },

  async testConfig(apiKey = null, model = null) {
    const res = await fetch(`${this.baseURL}/api/config/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemini_api_key: apiKey, gemini_model: model })
    });
    return await res.json();
  },


  async getTemplates() {
    const res = await fetch(`${this.baseURL}/api/templates`);
    return await res.json();
  },

  async sendChatMessage(message, history = [], language = 'English') {
    const res = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Chat query failed');
    }
    return await res.json();
  },

  async generateDraft(templateId, formData) {
    const res = await fetch(`${this.baseURL}/api/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: templateId, form_data: formData })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Document drafting failed');
    }
    return await res.json();
  },

  async analyzeText(text, documentName = 'Pasted Text') {
    const res = await fetch(`${this.baseURL}/api/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, document_name: documentName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Document text analysis failed');
    }
    return await res.json();
  },

  async analyzeFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${this.baseURL}/api/analyze/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Document upload analysis failed');
    }
    return await res.json();
  },

  async getStatutes(query = '', category = 'All') {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);
    
    const res = await fetch(`${this.baseURL}/api/statutes?${params.toString()}`);
    return await res.json();
  },

  async getCitizenRights() {
    const res = await fetch(`${this.baseURL}/api/rights`);
    return await res.json();
  },

  // NyayaSetu Civic Engine APIs
  async analyzeCivicProblem(problemText) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/analyze-problem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_text: problemText })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Civic problem analysis failed');
    }
    return await res.json();
  },

  async generateActionPack(problemText, answers, authority) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/generate-action-pack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_text: problemText, answers, authority })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Action pack generation failed');
    }
    return await res.json();
  },

  async generateFirstAppeal(appealData) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/generate-first-appeal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appealData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'First appeal generation failed');
    }
    return await res.json();
  },

  async checkSchemes(profileData) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/schemes/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Scheme check failed');
    }
    return await res.json();
  },

  async getSchemesList() {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/schemes/list`);
    return await res.json();
  }
};

window.NyayMitraAPI = API;

