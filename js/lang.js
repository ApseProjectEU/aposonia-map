const LANG_KEY = 'aposonia_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  applyTranslations(lang);
}

function applyTranslations(lang) {
  if (!window.translations) return;
  const t = window.translations[lang] || window.translations['en'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = getKey(t, el.dataset.i18n);
    if (val) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = getKey(t, el.dataset.i18nHtml);
    if (val) el.innerHTML = val;
  });
}

function getKey(obj, path) {
  return path.split('.').reduce((acc, k) => acc && acc[k], obj);
}

function initLang() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  fetch('translations.json')
    .then(r => r.json())
    .then(data => {
      window.translations = data;
      setLanguage(currentLang);
    })
    .catch(() => setLanguage('en'));
}

document.addEventListener('DOMContentLoaded', initLang);
