/* ────────────────────────────────────────────────────────────────────────────
   forms.js — Ova Vanilla
   Gestion EmailJS : formulaire devis + formulaire échantillon
   Anti-spam : honeypot + rate limiting localStorage
   ──────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Credentials EmailJS — à remplacer avec les vraies valeurs ───────────
     Les valeurs sont lues depuis les attributs data- sur le script
     ou depuis les constantes ci-dessous (remplir après génération).
     ──────────────────────────────────────────────────────────────────────── */

  var CONFIG = {
    publicKey:          '[EMAILJS_PUBLIC_KEY]',
    serviceId:          '[EMAILJS_SERVICE_ID]',
    templateDevis:      '[EMAILJS_TEMPLATE_DEVIS]',
    templateEchantillon:'[EMAILJS_TEMPLATE_ECHANTILLON]'
  };

  /* Initialisation EmailJS */
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: CONFIG.publicKey });
  }


  /* ── Rate limiting — anti-spam côté client ───────────────────────────── */

  var CLE_RATE_LIMIT   = 'ov_last_submit';
  var DELAI_LIMITE_MS  = 60 * 1000; /* 60 secondes entre deux envois */

  function verifierRateLimit() {
    var dernier = localStorage.getItem(CLE_RATE_LIMIT);
    if (dernier && (Date.now() - parseInt(dernier, 10)) < DELAI_LIMITE_MS) {
      return false; /* Bloqué */
    }
    return true; /* Autorisé */
  }

  function enregistrerRateLimit() {
    localStorage.setItem(CLE_RATE_LIMIT, Date.now().toString());
  }


  /* ── Vérification honeypot — anti-bot ────────────────────────────────── */

  function verifierHoneypot(formulaire) {
    var champ = formulaire.querySelector('[name="website"]');
    return !champ || champ.value === ''; /* True = pas un bot */
  }


  /* ── Validation d'un champ obligatoire ───────────────────────────────── */

  function validerChamp(champ) {
    var valeur = champ.value.trim();
    var groupe = champ.closest('.form__group');
    var erreur = groupe ? groupe.querySelector('.form__error') : null;

    if (!valeur) {
      if (erreur) erreur.classList.add('form__error--visible');
      champ.style.borderColor = '#b94040';
      return false;
    }

    /* Validation email */
    if (champ.type === 'email') {
      var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(valeur)) {
        if (erreur) {
          erreur.textContent = 'Adresse email invalide.';
          erreur.classList.add('form__error--visible');
        }
        champ.style.borderColor = '#b94040';
        return false;
      }
    }

    if (erreur) erreur.classList.remove('form__error--visible');
    champ.style.borderColor = '';
    return true;
  }

  function validerFormulaire(formulaire) {
    var champsObligatoires = formulaire.querySelectorAll('[required]');
    var estValide = true;
    champsObligatoires.forEach(function (champ) {
      if (!validerChamp(champ)) estValide = false;
    });
    return estValide;
  }


  /* ── État du bouton de soumission ────────────────────────────────────── */

  function bloquerBouton(btn, texte) {
    btn.disabled = true;
    btn.dataset.texteOriginal = btn.textContent;
    btn.textContent = texte;
  }

  function debloquerBouton(btn) {
    btn.disabled = false;
    btn.textContent = btn.dataset.texteOriginal || 'Envoyer';
  }

  function afficherSucces(formulaire) {
    var messageSucces = formulaire.querySelector('.form__success');
    if (messageSucces) {
      messageSucces.classList.add('form__success--visible');
      messageSucces.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }


  /* ════════════════════════════════════════════════════════════════════════
     FORMULAIRE DEVIS
     ════════════════════════════════════════════════════════════════════════ */

  var formDevis = document.getElementById('form-devis');

  if (formDevis) {
    formDevis.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Vérification honeypot */
      if (!verifierHoneypot(formDevis)) return;

      /* Vérification rate limit */
      if (!verifierRateLimit()) {
        var btnRL = formDevis.querySelector('[type="submit"]');
        if (btnRL) {
          btnRL.textContent = 'Veuillez patienter avant de renvoyer.';
          setTimeout(function () { debloquerBouton(btnRL); }, 5000);
        }
        return;
      }

      /* Validation des champs */
      if (!validerFormulaire(formDevis)) return;

      var btn = formDevis.querySelector('[type="submit"]');
      bloquerBouton(btn, 'Envoi en cours…');

      /* Collecte des paramètres pour EmailJS */
      var params = {
        nom:     (document.getElementById('devis-nom')     || {}).value || '',
        prenom:  (document.getElementById('devis-prenom')  || {}).value || '',
        email:   (document.getElementById('devis-email')   || {}).value || '',
        tel:     (document.getElementById('devis-tel')     || {}).value || '',
        societe: (document.getElementById('devis-societe') || {}).value || '',
        metier:  (document.getElementById('devis-metier')  || {}).value || '',
        volume:  (document.getElementById('devis-volume')  || {}).value || '',
        grade:   (document.getElementById('devis-grade')   || {}).value || '',
        message: (document.getElementById('devis-message') || {}).value || ''
      };

      if (typeof emailjs === 'undefined') {
        /* Mode développement sans EmailJS — simuler le succès */
        console.log('[DEV] Envoi devis simulé :', params);
        enregistrerRateLimit();
        afficherSucces(formDevis);
        formDevis.reset();
        debloquerBouton(btn);
        return;
      }

      emailjs.send(CONFIG.serviceId, CONFIG.templateDevis, params)
        .then(function () {
          enregistrerRateLimit();
          afficherSucces(formDevis);
          formDevis.reset();
          debloquerBouton(btn);
        })
        .catch(function (erreur) {
          console.error('EmailJS erreur :', erreur);
          btn.textContent = 'Erreur — réessayez ou contactez-nous par email.';
          btn.disabled = false;
        });
    });
  }


  /* ════════════════════════════════════════════════════════════════════════
     FORMULAIRE ÉCHANTILLON
     ════════════════════════════════════════════════════════════════════════ */

  var formEchantillon = document.getElementById('form-echantillon');

  if (formEchantillon) {
    formEchantillon.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!verifierHoneypot(formEchantillon)) return;

      if (!verifierRateLimit()) {
        var btnRL = formEchantillon.querySelector('[type="submit"]');
        if (btnRL) {
          btnRL.textContent = 'Veuillez patienter avant de renvoyer.';
          setTimeout(function () { debloquerBouton(btnRL); }, 5000);
        }
        return;
      }

      if (!validerFormulaire(formEchantillon)) return;

      var btn = formEchantillon.querySelector('[type="submit"]');
      bloquerBouton(btn, 'Envoi en cours…');

      var params = {
        nom:      (document.getElementById('ech-nom')      || {}).value || '',
        email:    (document.getElementById('ech-email')    || {}).value || '',
        societe:  (document.getElementById('ech-societe')  || {}).value || '',
        adresse:  (document.getElementById('ech-adresse')  || {}).value || '',
        grade:    (document.getElementById('ech-grade')    || {}).value || '',
        message:  (document.getElementById('ech-message')  || {}).value || ''
      };

      if (typeof emailjs === 'undefined') {
        console.log('[DEV] Envoi échantillon simulé :', params);
        enregistrerRateLimit();
        afficherSucces(formEchantillon);
        formEchantillon.reset();
        debloquerBouton(btn);
        return;
      }

      emailjs.send(CONFIG.serviceId, CONFIG.templateEchantillon, params)
        .then(function () {
          enregistrerRateLimit();
          afficherSucces(formEchantillon);
          formEchantillon.reset();
          debloquerBouton(btn);
        })
        .catch(function (erreur) {
          console.error('EmailJS erreur :', erreur);
          btn.textContent = 'Erreur — réessayez ou contactez-nous par email.';
          btn.disabled = false;
        });
    });
  }


  /* ════════════════════════════════════════════════════════════════════════
     FORMULAIRE CONTACT GÉNÉRAL (contact.html)
     ════════════════════════════════════════════════════════════════════════ */

  var formContact = document.getElementById('form-contact');

  if (formContact) {
    formContact.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!verifierHoneypot(formContact)) return;
      if (!verifierRateLimit()) {
        alert('Merci de patienter avant de renvoyer un message.');
        return;
      }
      if (!validerFormulaire(formContact)) return;

      var btn = formContact.querySelector('[type="submit"]');
      bloquerBouton(btn, 'Envoi en cours…');

      var params = {
        nom:     (document.getElementById('contact-nom')     || {}).value || '',
        email:   (document.getElementById('contact-email')   || {}).value || '',
        tel:     (document.getElementById('contact-tel')     || {}).value || '',
        objet:   (document.getElementById('contact-objet')   || {}).value || '',
        message: (document.getElementById('contact-message') || {}).value || ''
      };

      /* Réutilise le template devis pour le contact général */
      if (typeof emailjs === 'undefined') {
        console.log('[DEV] Envoi contact simulé :', params);
        enregistrerRateLimit();
        afficherSucces(formContact);
        formContact.reset();
        debloquerBouton(btn);
        return;
      }

      emailjs.send(CONFIG.serviceId, CONFIG.templateDevis, params)
        .then(function () {
          enregistrerRateLimit();
          afficherSucces(formContact);
          formContact.reset();
          debloquerBouton(btn);
        })
        .catch(function (erreur) {
          console.error('EmailJS erreur :', erreur);
          btn.textContent = 'Erreur — réessayez ou contactez-nous directement.';
          btn.disabled = false;
        });
    });
  }

})();
