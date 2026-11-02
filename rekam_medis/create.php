<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';

// Preflight CORS: balas lalu hentikan eksekusi
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Tolak semua method selain POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse('error', 'Method harus POST', null, 405);
}

// Ambil input: JSON body dulu, fallback ke form-data
$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$pendaftaran_id = trim($input['pendaftaran_id'] ?? '');
$dokter_id    = trim($input['dokter_id'] ?? '');
$diagnosa   =  trim($input['diagnosa'] ?? '');
$catatan   =  trim($input['catatan'] ?? '');

if ($pendaftaran_id === '' || $dokter_id === '' || $diagnosa === '') {
    sendResponse('error', 'Pendaftaran, dokter, dan diagnosa wajib diisi', null, 400);
}

if (!ctype_digit($pendaftaran_id) || !ctype_digit($dokter_id)) {
    sendResponse('error', 'Pendaftaran atau dokter tidak valid', null, 400);
}

try {
    $pdo  = getConnection();
    $stmt = $pdo->prepare(
        "INSERT INTO rekam_medis (pendaftaran_id, dokter_id, diagnosa, catatan, tanggal)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)"
    );
    $stmt->execute([$pendaftaran_id, $dokter_id, $diagnosa, $catatan]);

    sendResponse('success', 'Data rekam medis Berhasil Ditambahkan', [
        'id'        => $pdo->lastInsertId(),
        'diagnosa' => $diagnosa,
    ], 201);
} catch (PDOException $e) {
    $message = $e->getCode() === '23000'
        ? 'Pendaftaran atau dokter tidak ditemukan, atau rekam medis untuk pendaftaran ini sudah ada.'
        : 'Gagal menyimpan data rekam medis: ' . $e->getMessage();
    sendResponse('error', $message, null, 500);
}
