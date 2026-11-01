<?php
header('Access-Control-Allow-Origin: *'); // XML
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Method harus POST', null, 405);
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = array_merge($_GET, $_POST);
}

$id         = $input['id'] ?? $_GET['id'] ?? null;
$nama_poli  = trim($input['nama_poli'] ?? $_GET['nama_poli'] ?? '');
$lokasi     = trim($input['lokasi'] ?? $_GET['lokasi'] ?? '');
if (empty($id) || $nama_poli === '') {
    sendResponse('error', 'Id dan Nama poli wajib diisi', null, 400);
}
if (mb_strlen($nama_poli, 'UTF-8') > 100) {
    sendResponse('error', 'Nama poli maksimal 100 karakter', null, 400);
}
if (mb_strlen($lokasi, 'UTF-8') > 150) {
    sendResponse('error', 'Lokasi maksimal 150 karakter', null, 400);
}

$pdo    = getConnection();
$cek    = $pdo->prepare("SELECT id FROM poli WHERE id = ?");
$cek->execute([$id]);
if (!$cek->fetch()) {
    sendResponse('error', 'Data poli tidak ditemukan', null, 404);
}

$cekNama = $pdo->prepare("SELECT id FROM poli WHERE LOWER(TRIM(nama_poli)) = LOWER(TRIM(?)) AND id <> ? LIMIT 1");
$cekNama->execute([$nama_poli, $id]);
if ($cekNama->fetch()) {
    sendResponse('error', 'Nama poli sudah digunakan', null, 409);
}

$stmt   = $pdo->prepare("UPDATE poli SET nama_poli=?,lokasi=? WHERE id=?");
$stmt->execute([$nama_poli, $lokasi, $id]);

sendResponse('success', 'Data Poli Berhasil diperbarui', [
    'id'        => $id,
    'nama_poli' => $nama_poli,
    'lokasi'    => $lokasi
], 201);
