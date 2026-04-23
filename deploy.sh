#!/usr/bin/env bash
# deploy.sh — Ova Vanilla
# Déploiement automatique sur Hostinger, déclenché par webhook.php.
# Doit être exécutable : chmod +x deploy.sh
#
# Prérequis Hostinger :
#   - Dépôt Git cloné dans le dossier racine du site
#   - Variable SECRET dans webhook.php configurée

set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$DEPLOY_DIR/deploy.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
MAX_LOG_LINES=500

echo "[$TIMESTAMP] ── Déploiement démarré ──" >> "$LOG_FILE"

cd "$DEPLOY_DIR"

# Récupérer les dernières modifications depuis GitHub
git fetch origin main >> "$LOG_FILE" 2>&1
git reset --hard origin/main >> "$LOG_FILE" 2>&1

echo "[$TIMESTAMP] Déploiement terminé avec succès" >> "$LOG_FILE"

# Rotation du log (garder les MAX_LOG_LINES dernières lignes)
if [ "$(wc -l < "$LOG_FILE")" -gt "$MAX_LOG_LINES" ]; then
    tail -n "$MAX_LOG_LINES" "$LOG_FILE" > "${LOG_FILE}.tmp"
    mv "${LOG_FILE}.tmp" "$LOG_FILE"
fi
