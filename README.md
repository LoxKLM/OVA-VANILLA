# Ova Vanilla — Site Vitrine

Développé par **AM Talents** · Marseille  
Client : Ova Vanilla · ovavanilla.fr

---

## Prérequis

- Python 3.10+
- Git

---

## Installation

```bash
git clone [REPO_URL] ova-vanilla
cd ova-vanilla
python -m venv venv

# Mac / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env
# Ouvrir .env et remplir les vraies valeurs
```

---

## Lancer en développement

```bash
cd backend
python app.py
# → http://localhost:5000
```

---

## Variables d'environnement (`.env`)

| Variable | Description |
|---|---|
| `EMAILJS_PUBLIC_KEY` | Clé publique EmailJS (compte AM Talents) |
| `EMAILJS_SERVICE_ID` | ID du service EmailJS |
| `EMAILJS_TEMPLATE_DEVIS` | ID du template devis |
| `EMAILJS_TEMPLATE_ECHANTILLON` | ID du template échantillon |
| `WEBHOOK_SECRET` | Secret HMAC partagé avec GitHub |
| `FLASK_ENV` | `development` ou `production` |

---

## Déploiement Hostinger

1. Configurer les variables `.env` dans le panel Hostinger → Python
2. Ajouter le webhook GitHub : `https://ovavanilla.fr/webhook.php`
3. Secret webhook = valeur de `WEBHOOK_SECRET` dans `.env`
4. Premier déploiement manuel : `git clone [REPO] .` depuis SSH
5. Déploiements suivants : automatiques via push sur `main`

---

## Informations à compléter avant livraison

Remplacer tous les placeholders suivants dans les fichiers HTML :

| Placeholder | Valeur |
|---|---|
| `[NOM_RESPONSABLE]` | Nom du responsable |
| `[ADRESSE_MARSEILLE]` | Adresse complète |
| `[CODE_POSTAL]` | Code postal |
| `[TELEPHONE]` | Numéro de téléphone |
| `[EMAIL_PRO]` | Email professionnel |
| `[SIRET]` | Numéro SIRET |
| `[HOSTINGER_USER_ID]` | ID utilisateur Hostinger (pour deploy.sh) |

---

## Structure

Voir `CLAUDE.md` pour la documentation complète du projet.
