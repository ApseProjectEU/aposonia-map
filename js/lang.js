class LanguageController {
  constructor() {
    this.currentLang = localStorage.getItem('aposoniaLang') || 'en';
    this.translations = {};
    this.init();
  }
  async init() {
    try {
      await this.loadTranslations();
      this.applyLanguage(this.currentLang);
      this.attachEventListeners();
    } catch (error) {
      console.error('Error initializing language controller:', error);
    }
  }
  async loadTranslations() {
    const response = await fetch('translations.json');
    if (!response.ok) throw new Error('Failed to load translations');
    this.translations = await response.json();
  }
  applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key, lang);
      if (translation) element.innerHTML = translation;
    });
    localStorage.setItem('aposoniaLang', lang);
    this.currentLang = lang;
    this.updateActiveButton(lang);
  }
  getTranslation(key, lang) {
    const keys = key.split('.');
    let value = this.translations[lang];
    for (const k of keys) {
      if (value && typeof value === 'object') value = value[k];
      else return null;
    }
    return value || null;
  }
  attachEventListeners() {
    document.querySelectorAll('.language-switcher button').forEach(button => {
      button.addEventListener('click', () => this.applyLanguage(button.getAttribute('data-lang')));
    });
  }
  updateActiveButton(lang) {
    document.querySelectorAll('.language-switcher button').forEach(button => {
      button.classList.toggle('active', button.getAttribute('data-lang') === lang);
    });
  }
}
document.addEventListener('DOMContentLoaded', () => { new LanguageController(); });
