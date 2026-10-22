<?php
/**
 * QADCO contact form mailer for Bluehost (the PHP twin of src/app/api/contact/route.ts).
 * Sends each request by email through Resend (resend.com).
 *
 * Settings live in qadco-config.php ONE LEVEL ABOVE public_html, so they are never
 * downloadable. Copy deploy/bluehost/qadco-config.example.php there and fill it in:
 *   RESEND_API_KEY  required
 *   CONTACT_TO      who receives requests
 *   CONTACT_FROM    sender; must be on a domain verified in Resend (or Resend's test sender)
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function reply($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'reason' => 'method']);

$config = __DIR__ . '/../qadco-config.php';
if (!is_file($config)) reply(503, ['ok' => false, 'reason' => 'not-configured']);
require $config;
$key = defined('RESEND_API_KEY') ? trim(RESEND_API_KEY) : '';
if ($key === '') reply(503, ['ok' => false, 'reason' => 'not-configured']);

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) reply(400, ['ok' => false, 'reason' => 'invalid']);

// Bots: a hidden field people never fill, or a form sent in under 2.5 seconds. Pretend success.
if (!empty($body['website']) || (isset($body['elapsed']) && is_numeric($body['elapsed']) && $body['elapsed'] < 2500)) {
    reply(200, ['ok' => true]);
}

// A light per-address limit: at most 5 requests in 10 minutes.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$store = sys_get_temp_dir() . '/qadco-contact-' . md5($ip);
$now = time();
$hits = is_file($store) ? array_filter(array_map('intval', explode(',', (string) file_get_contents($store))), function ($t) use ($now) {
    return $now - $t < 600;
}) : [];
$hits[] = $now;
@file_put_contents($store, implode(',', $hits));
if (count($hits) > 5) reply(429, ['ok' => false, 'reason' => 'rate-limited']);

$limits = ['name' => 120, 'company' => 160, 'phone' => 40, 'email' => 160, 'type' => 80, 'location' => 160, 'message' => 4000];
$data = [];
foreach ($limits as $field => $max) {
    $data[$field] = mb_substr(trim((string) ($body[$field] ?? '')), 0, $max);
}
$digits = preg_replace('/\D/', '', $data['phone']);
if ($data['name'] === '' || strlen($digits) < 8 || $data['type'] === '' || ($data['email'] !== '' && !filter_var($data['email'], FILTER_VALIDATE_EMAIL))) {
    reply(400, ['ok' => false, 'reason' => 'invalid']);
}

$to = defined('CONTACT_TO') && CONTACT_TO ? CONTACT_TO : 'qadco-1@qatar.net.qa';
$from = defined('CONTACT_FROM') && CONTACT_FROM ? CONTACT_FROM : 'QADCO Website <onboarding@resend.dev>';
$language = (($body['lang'] ?? '') === 'ar') ? 'Arabic' : 'English';

$rows = [
    'Name' => $data['name'],
    'Company' => $data['company'],
    'Phone' => $data['phone'],
    'Email' => $data['email'],
    'Needs' => $data['type'],
    'Location' => $data['location'],
    'Site language' => $language,
];
$e = function ($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); };
$text = '';
$cells = '';
foreach ($rows as $k => $v) {
    if ($v === '') continue;
    $text .= "$k: $v\n";
    $cells .= '<tr><td style="padding:6px 16px 6px 0;color:#5A6378">' . $k . '</td><td style="padding:6px 0"><strong>' . $e($v) . '</strong></td></tr>';
}
if ($data['message'] !== '') $text .= "\nAbout the project:\n" . $data['message'];
$html = '<h2 style="font-family:Arial,sans-serif;color:#14215A">New request from the website</h2>'
    . '<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">' . $cells . '</table>'
    . ($data['message'] !== '' ? '<p style="font-family:Arial,sans-serif;font-size:15px;white-space:pre-wrap;margin-top:16px">' . $e($data['message']) . '</p>' : '')
    . '<p style="font-family:Arial,sans-serif;font-size:13px;color:#5A6378;margin-top:24px">Sent from the contact form on the QADCO website. Reply to this email to answer the visitor'
    . ($data['email'] === '' ? ' (no email given: call them)' : '') . '.</p>';

$payload = [
    'from' => $from,
    'to' => [$to],
    'subject' => 'Website request: ' . $data['type'] . ' from ' . $data['name'],
    'text' => $text,
    'html' => $html,
];
if ($data['email'] !== '') $payload['reply_to'] = $data['email'];

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);
$result = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($result === false || $status < 200 || $status >= 300) {
    error_log('[qadco contact] Resend error ' . $status . ' ' . $result);
    reply(502, ['ok' => false, 'reason' => 'send-failed']);
}
reply(200, ['ok' => true]);
