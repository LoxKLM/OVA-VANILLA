/* ────────────────────────────────────────────────────────────────────────────
   lang.js — Ova Vanilla
   Sélecteur de langue FR / EN
   Stockage de la préférence dans localStorage
   ──────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var CLE_LANG = 'ov_lang';

  /* Table de correspondance des pages FR → EN */
  var PAGES_EN = {
    'index.html':           'en/index.html',
    '':                     'en/index.html',
    'nos-vanilles.html':    'en/our-vanillas.html',
    'origines.html':        'en/origins.html',
    'la-maison.html':       'en/about.html',
    'professionnels.html':  'en/professionals.html',
    'contact.html':         'en/contact.html',
    'mentions-legales.html':'en/legal.html'
  };

  /* Table de correspondance EN → FR */
  var PAGES_FR = {
    'index.html':         'index.html',
    'our-vanillas.html':  'nos-vanilles.html',
    'origins.html':       'origines.html',
    'about.html':         'la-maison.html',
    'professionals.html': 'professionnels.html',
    'contact.html':       'contact.html',
    'legal.html':         'mentions-legales.html'
  };

  /* ── Détecter la langue courante ──────────────────────────────────────── */

  function getLangCourante() {
    var chemin = window.location.pathname;
    /* Si l'URL contient /en/ → langue EN */
    if (chemin.indexOf('/en/') !== -1 || chemin.endsWith('/en')) {
      return 'en';
    }
    return 'fr';
  }

  /* ── Basculer vers une autre langue ──────────────────────────────────── */

  function switchLang(langue) {
    localStorage.setItem(CLE_LANG, langue);

    var nomFichier = window.location.pathname.split('/').pop() || 'index.html';
    var nouvelleURL;

    if (langue === 'en') {
      var cibleEN = PAGES_EN[nomFichier];
      nouvelleURL = cibleEN ? ('../' + cibleEN) : '../en/index.html';
      /* Si on est déjà dans /en/ on reste */
      if (getLangCourante() === 'en') return;
    } else {
      /* Langue FR */
      var nomSansPrefixe = nomFichier;
      var cibleFR = PAGES_FR[nomSansPrefixe];
      nouvelleURL = cibleFR ? ('../' + cibleFR) : '../index.html';
      if (getLangCourante() === 'fr') return;
    }

    window.location.href = nouvelleURL;
  }

  /* ── Exposer switchLang globalement (appelé depuis les boutons HTML) ─── */
  window.switchLang = switchLang;

  /* ── Mettre à jour le style des boutons selon la langue courante ──────── */

  var langCourante = getLangCourante();

  document.querySelectorAll('.nav__lang').forEach(function (btn) {
    var lang = btn.getAttribute('onclick');
    if (!lang) return;

    /* Extraire 'fr' ou 'en' depuis onclick="switchLang('fr')" */
    var match = lang.match(/switchLang\('(\w+)'\)/);
    if (!match) return;

    if (match[1] === langCourante) {
      btn.classList.add('nav__lang--active');
      btn.setAttribute('aria-current', 'true');
    } else {
      btn.classList.remove('nav__lang--active');
      btn.removeAttribute('aria-current');
    }
  });

})();
