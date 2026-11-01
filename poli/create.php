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

$nama_poli = trim($input['nama_poli'] ?? '');
$lokasi    = trim($input['lokasi'] ?? '');

if ($nama_poli === '') {
    sendResponse('error', 'Nama poli wajib diisi', null, 400);
}
if (mb_strlen($nama_poli, 'UTF-8') > 100) {
    sendResponse('error', 'Nama poli maksimal 100 karakter', null, 400);
}
if (mb_strlen($lokasi, 'UTF-8') > 150) {
    sendResponse('error', 'Lokasi maksimal 150 karakter', null, 400);
}

try {
    $pdo  = getConnection();
    $cek = $pdo->prepare("SELECT id FROM poli WHERE LOWER(TRIM(nama_poli)) = LOWER(TRIM(?)) LIMIT 1");
    $cek->execute([$nama_poli]);
    if ($cek->fetch()) {
        sendResponse('error', 'Nama poli sudah digunakan', null, 409);
    }

    $stmt = $pdo->prepare("INSERT INTO poli (nama_poli, lokasi) VALUES (?, ?)");
    $stmt->execute([$nama_poli, $lokasi]);

    sendResponse('success', 'Data Poli Berhasil Ditambahkan', [
        'id'        => $pdo->lastInsertId(),
        'nama_poli' => $nama_poli,
        'lokasi'    => $lokasi
    ], 201);
} catch (PDOException $e) {
    sendResponse('error', 'Gagal menyimpan data', null, 500);
}
