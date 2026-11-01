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

$user_id = trim($input['user_id'] ?? '');
$nik   = trim($input['nik'] ?? '');
$no_rm   = trim($input['no_rm'] ?? '');
$nama   = trim($input['nama'] ?? '');
$tgl_lahir = trim($input['tgl_lahir'] ?? '');
$jenis_kelamin = trim($input['jenis_kelamin'] ?? '');
$alamat = trim($input['alamat'] ?? '');

if (!ctype_digit($user_id) || (int)$user_id <= 0) {
    sendResponse('error', 'ID User wajib berupa angka dan harus memilih akun yang valid', null, 400);
}

if ($nik === '' || $nama === '' || $tgl_lahir === '' || $jenis_kelamin === '') {
    sendResponse('error', 'NIK, nama, tanggal lahir, dan jenis kelamin wajib diisi', null, 400);
}

if ($no_rm === '') {
    sendResponse('error', 'Nomor RM wajib diisi', null, 400);
}

try {
    $pdo  = getConnection();

    $userStmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $userStmt->execute([$user_id]);
    if (!$userStmt->fetchColumn()) {
        sendResponse('error', 'ID User tidak ditemukan. Buat akun pada menu Users terlebih dahulu.', null, 400);
    }

    $stmt = $pdo->prepare("INSERT INTO pasien (user_id, nik, no_rm, nama, tgl_lahir, jenis_kelamin, alamat) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $nik, $no_rm, $nama, $tgl_lahir, $jenis_kelamin, $alamat]);

    sendResponse('success', 'Data Pasien Berhasil Ditambahkan', [
        'id'        => $pdo->lastInsertId(),
        'no_rm'     => $no_rm,
        'nama'      => $nama
    ], 201);
} catch (PDOException $e) {
    $message = $e->getCode() === '23000'
        ? 'Data pasien tidak dapat disimpan karena User sudah dipakai, NIK/No. RM sudah terdaftar, atau data pengguna tidak valid.'
        : 'Gagal menyimpan data pasien: ' . $e->getMessage();

    sendResponse('error', $message, null, 500);
}
