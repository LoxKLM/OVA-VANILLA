<?php
/**
 * webhook.php — Ova Vanilla
 * Reçoit les webhooks GitHub (push sur main) et déclenche deploy.sh
 *
 * Configuration :
 *   1. Dans GitHub → Settings → Webhooks → Add webhook :
 *      - Payload URL : https://ovavanilla.fr/webhook.php
 *      - Content type : application/json
 *      - Secret : même valeur que WEBHOOK_SECRET ci-dessous
 *      - Events : Just the push event
 *   2. Remplacer VOTRE_SECRET_ICI par une chaîne aléatoire longue (openssl rand -hex 32)
 *   3. S'assurer que deploy.sh est exécutable (chmod +x deploy.sh)
 */

define('WEBHOOK_SECRET', 'VOTRE_SECRET_ICI');
define('DEPLOY_SCRIPT', __DIR__ . '/deploy.sh');
define('LOG_FILE',      __DIR__ . '/webhook.log');
define('ALLOWED_BRANCH', 'refs/heads/main');

// ── Fonctions utilitaires ────────────────────────────────────────────────────

function log_event(string $message): void
{
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL;
    file_put_contents(LOG_FILE, $line, FILE_APPEND | LOCK_EX);
}

function abort(int $code, string $message): never
{
    http_response_code($code);
    log_event("ABORT $code — $message");
    echo json_encode(['error' => $message]);
    exit;
}

// ── Lecture et vérification ──────────────────────────────────────────────────

header('Content-Type: application/json');

// Méthode POST uniquement
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    abort(405, 'Method not allowed');
}

$raw_payload = file_get_contents('php://input');
if ($raw_payload === false || $raw_payload === '') {
    abort(400, 'Empty payload');
}

// Vérification signature HMAC GitHub
$sig_header = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
if (empty($sig_header)) {
    abort(403, 'Missing signature header');
}

$expected_sig = 'sha256=' . hash_hmac('sha256', $raw_payload, WEBHOOK_SECRET);
if (!hash_equals($expected_sig, $sig_header)) {
    abort(403, 'Invalid signature');
}

// Décoder le payload
$payload = json_decode($raw_payload, true);
if (!is_array($payload)) {
    abort(400, 'Invalid JSON');
}

// Ignorer les événements hors branche main
$ref = $payload['ref'] ?? '';
if ($ref !== ALLOWED_BRANCH) {
    log_event("Ignored push on ref=$ref");
    echo json_encode(['ok' => true, 'info' => 'Branch ignored']);
    exit;
}

// ── Déclenchement du déploiement ────────────────────────────────────────────

if (!is_file(DEPLOY_SCRIPT) || !is_executable(DEPLOY_SCRIPT)) {
    abort(500, 'deploy.sh not found or not executable');
}

$output = [];
$exit_code = 0;
exec(escapeshellcmd(DEPLOY_SCRIPT) . ' 2>&1', $output, $exit_code);

$pusher = $payload['pusher']['name'] ?? 'unknown';
$commit = substr($payload['after'] ?? '', 0, 7);
log_event("Deploy triggered by $pusher (commit $commit) — exit_code=$exit_code");

if ($exit_code !== 0) {
    log_event('Deploy error: ' . implode(' | ', array_slice($output, -5)));
    abort(500, 'Deploy script failed');
}

echo json_encode(['ok' => true, 'commit' => $commit]);
