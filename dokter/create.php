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

$nama       = trim($input['nama'] ?? '');
$spesialisasi  = trim($input['spesialisasi'] ?? '');
$no_sip     = trim($input['no_sip'] ?? '');

if ($nama === '') {
    sendResponse('error', 'Nama dokter wajib diisi', null, 400);
}

try {
    $pdo  = getConnection();
    $stmt = $pdo->prepare("INSERT INTO dokter (nama, spesialisasi, no_sip) VALUES (?, ?, ?)");
    $stmt->execute([$nama, $spesialisasi, $no_sip]);

    sendResponse('success', 'Data Dokter Berhasil Ditambahkan', [
        'id'            => $pdo->lastInsertId(),
        'nama'          => $nama,
        'spesialisasi'   => $spesialisasi,
        'no_sip'        => $no_sip
    ], 201);
} catch (PDOException $e) {
    sendResponse('error', 'Gagal menyimpan dokter: ' . $e->getMessage(), null, 500);
}
