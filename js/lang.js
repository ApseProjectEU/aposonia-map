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
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function applyTranslations(lang) {
  if (!window.translations) return;
  const t = window.translations[lang] || window.translations['en'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = getNestedKey(t, el.dataset.i18n);
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = getNestedKey(t, el.dataset.i18nHtml);
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = getNestedKey(t, el.dataset.i18nPlaceholder);
    if (val !== undefined) el.placeholder = val;
  });
}

function getNestedKey(obj, keyPath) {
  return keyPath.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function t(key) {
  if (!window.translations) return key;
  const trans = window.translations[currentLang] || window.translations['en'];
  return getNestedKey(trans, key) || key;
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
