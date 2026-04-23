# CLAUDE.md — Ova Vanilla

Développé par **AM Talents** · Marseille

---

## Projet

Site vitrine B2B pour **Ova Vanilla**, maison de négoce de vanille Gourmet de Madagascar, basée à Marseille.
Objectif : générer des demandes de devis et d'échantillons de la part de professionnels de la restauration et de l'agroalimentaire.

## Stack technique

- **Frontend** : HTML5 / CSS3 / JavaScript vanilla — zéro framework
- **Serveur** : Apache (Hostinger shared hosting) — headers de sécurité via `.htaccess`
- **Hébergement** : Hostinger — mode Apache statique
- **Déploiement** : Git + auto-deploy via `webhook.php` → `deploy.sh`
- **Formulaires** : EmailJS (client-side) — credentials dans `.env`

---

## Charte graphique — NE JAMAIS MODIFIER

```css
/* Source de vérité absolue — frontend/css/variables.css */

--cream:  #F0E6D2   /* Crème Bourbon — couleur dominante */
--ink:    #1F3528   /* Vert Forêt — couleur secondaire */
--gold:   #B8935A   /* Or Discret — accent */
--paper:  #F7F1E5   /* Blanc Cassé — fond */
--deep:   #0F1A13   /* Encre Profonde — texte */

/* Typographies */
Font titres   : Cormorant Garamond (Regular 400, Medium 500, Italic)
Font corps    : Inter (Light 300, Regular 400)
Source        : Google Fonts — chargement via preconnect dans <head>
```

---

## Identité de marque — NE JAMAIS DÉRIVER

- **Ton** : mesuré, précis, éditorial — jamais tropical, jamais ostentatoire
- **Registre** : négoce fin — vocabulaire autorisé : lot, récolte, grade, origine, sélection, taux d'humidité, calibre, coopérative
- **À proscrire absolument** : emojis, points d'exclamation, adjectifs superlatifs creux ("incroyable", "exceptionnel"), registre exotique/touristique
- **Tagline immuable** : "De la Sava aux maisons de bouche."

---

## Ce que Claude ne doit PAS faire

- Modifier les codes HEX sans instruction explicite du client
- Changer les fonts Cormorant/Inter pour autre chose
- Ajouter des dépendances JS (React, Vue, Alpine, GSAP…) sans validation
- Exposer des credentials dans le code source
- Modifier le contenu éditorial sans instruction
- Ajouter des animations parallax agressives ou effets flashy
- Utiliser des images stock génériques (marchés tropicaux, mains tenant épices…)
- Écrire des commentaires en anglais (commentaires en français obligatoire)
- Utiliser des chemins absolus hardcodés

---

## Structure du projet

```
ova-vanilla/
├── CLAUDE.md              ← Ce fichier
├── README.md
├── .gitignore
├── .htaccess              ← Headers de sécurité Apache + routage vers frontend/
├── .env.example           ← Credentials à copier dans .env (non versionné)
│
├── frontend/              ← Site statique complet (racine web effective)
│   ├── index.html
│   ├── nos-vanilles.html
│   ├── origines.html
│   ├── la-maison.html
│   ├── professionnels.html
│   ├── contact.html
│   ├── mentions-legales.html
│   ├── en/                ← Version EN (structure miroir, contenu placeholder)
│   ├── css/               ← CSS modulaire (BEM)
│   │   ├── reset.css
│   │   ├── variables.css  ← Source de vérité charte graphique
│   │   ├── typography.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── pages/
│   ├── js/                ← Modules JS vanilla
│   ├── data/              ← JSON de données
│   └── assets/            ← Médias (photos, icônes, logo)
│
├── templates/emails/      ← Templates EmailJS de référence
├── robots.txt
├── sitemap.xml
├── deploy.sh
└── webhook.php            ← Auto-deploy GitHub → Hostinger
```

---

## SEO — Préserver systématiquement

- Balises `<title>` et `<meta name="description">` uniques sur chaque page
- Schema.org `LocalBusiness` sur toutes les pages (dans `<head>`)
- Attribut `alt` descriptif sur chaque `<img>`
- `<link rel="canonical">` sur chaque page
- Sitemap XML à jour après chaque nouvelle page

---

## Sécurité — Ne jamais compromettre

- Headers de sécurité actifs via `.htaccess` Apache (X-Frame-Options, CSP, HSTS, etc.)
- Rate limiting client-side via localStorage sur les formulaires
- Honeypot anti-spam présent sur tous les formulaires
- Fichier `.env` non versionné (dans `.gitignore`)
- Accès aux logs et à `deploy.sh` bloqué par `.htaccess` (règle `[F]`)

---

## Déploiement

1. Push sur `main` → GitHub envoie un webhook POST à `https://ovavanilla.fr/webhook.php`
2. `webhook.php` vérifie la signature HMAC-SHA256 et exécute `deploy.sh`
3. `deploy.sh` fait `git fetch origin main` + `git reset --hard origin/main`
4. Apache sert immédiatement les nouveaux fichiers (aucun redémarrage nécessaire)
