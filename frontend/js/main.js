/* ────────────────────────────────────────────────────────────────────────────
   main.js — Ova Vanilla
   Navigation, scroll, menu mobile, animations IntersectionObserver
   ──────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Navigation — comportement au scroll ──────────────────────────────── */

  const nav = document.getElementById('nav');

  function gererNavScroll() {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', gererNavScroll, { passive: true });
  gererNavScroll(); /* Initialisation au chargement */


  /* ── Menu mobile — burger ────────────────────────────────────────────── */

  const burger     = document.getElementById('nav-burger');
  const menuMobile = document.getElementById('nav-mobile');

  function ouvrirMenu() {
    menuMobile.classList.add('nav__mobile--open');
    burger.classList.add('nav__burger--open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    /* Focus sur le premier lien pour l'accessibilité clavier */
    const premierLien = menuMobile.querySelector('a');
    if (premierLien) premierLien.focus();
  }

  function fermerMenu() {
    menuMobile.classList.remove('nav__mobile--open');
    burger.classList.remove('nav__burger--open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }

  if (burger && menuMobile) {
    burger.addEventListener('click', function () {
      const estOuvert = menuMobile.classList.contains('nav__mobile--open');
      estOuvert ? fermerMenu() : ouvrirMenu();
    });

    /* Fermeture au clic sur un lien */
    menuMobile.querySelectorAll('a').forEach(function (lien) {
      lien.addEventListener('click', fermerMenu);
    });

    /* Fermeture avec la touche Échap */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuMobile.classList.contains('nav__mobile--open')) {
        fermerMenu();
      }
    });
  }


  /* ── Animations au scroll — IntersectionObserver ─────────────────────── */

  var elementsFadeUp = document.querySelectorAll('.fade-up');

  if (elementsFadeUp.length > 0) {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add('fade-up--visible');
          observateur.unobserve(entree.target); /* Ne déclencher qu'une fois */
        }
      });
    }, {
      threshold:  0.10,
      rootMargin: '0px 0px -40px 0px'
    });

    elementsFadeUp.forEach(function (el) {
      observateur.observe(el);
    });
  }


  /* ── Marquer le lien actif dans la navigation ────────────────────────── */

  var cheminCourant = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__link').forEach(function (lien) {
    var href = lien.getAttribute('href').split('/').pop();
    if (href === cheminCourant) {
      lien.classList.add('nav__link--active');
      lien.setAttribute('aria-current', 'page');
    }
  });


  /* ── Smooth scroll sur les ancres internes ────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(function (ancre) {
    ancre.addEventListener('click', function (e) {
      var cible = document.querySelector(this.getAttribute('href'));
      if (!cible) return;
      e.preventDefault();
      var offsetNav = nav ? nav.offsetHeight : 0;
      var positionY = cible.getBoundingClientRect().top + window.scrollY - offsetNav - 20;
      window.scrollTo({ top: positionY, behavior: 'smooth' });
    });
  });


  /* ── Smooth scroll sur les ancres inter-pages (professionnels.html#devis) */
  /* Déclenché au chargement si l'URL contient un # */

  if (window.location.hash) {
    setTimeout(function () {
      var cible = document.querySelector(window.location.hash);
      if (cible && nav) {
        var positionY = cible.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 20;
        window.scrollTo({ top: positionY, behavior: 'smooth' });
      }
    }, 100);
  }

})();
