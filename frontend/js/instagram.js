/* ────────────────────────────────────────────────────────────────────────────
   instagram.js — Ova Vanilla
   Gestion du comportement des posts Instagram simulés statiques
   Ouvre le profil @ovavanilla au clic ou à la touche Entrée
   ──────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var URL_INSTAGRAM = 'https://www.instagram.com/ovavanilla';

  var posts = document.querySelectorAll('.insta-post');

  if (!posts.length) return;

  posts.forEach(function (post) {

    /* Ouverture au clic */
    post.addEventListener('click', function () {
      window.open(URL_INSTAGRAM, '_blank', 'noopener,noreferrer');
    });

    /* Accessibilité clavier */
    post.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(URL_INSTAGRAM, '_blank', 'noopener,noreferrer');
      }
    });

  });

})();
