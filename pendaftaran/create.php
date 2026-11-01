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

$pasien_id = trim($input['pasien_id'] ?? '');
$jadwal_id   = trim($input['jadwal_id'] ?? '');
$tanggal_kunjungan = trim($input['tanggal_kunjungan'] ?? '');
$no_antrian = trim($input['no_antrian'] ?? '');
$status = trim($input['status'] ?? '');

if ($pasien_id === '' || $jadwal_id === '') {
    sendResponse('error', 'Pasien dan jadwal praktik wajib dipilih', null, 400);
}

if (!ctype_digit($pasien_id) || !ctype_digit($jadwal_id)) {
    sendResponse('error', 'Data pasien belum dipilih', null, 400);
}

try {
    $pdo  = getConnection();

    $pasienStmt = $pdo->prepare("SELECT id FROM pasien WHERE id = ?");
    $pasienStmt->execute([$pasien_id]);
    if (!$pasienStmt->fetchColumn()) {
        sendResponse('error', 'Pasien tidak ditemukan', null, 400);
    }

    $jadwalStmt = $pdo->prepare("SELECT id FROM jadwal_praktik WHERE id = ?");
    $jadwalStmt->execute([$jadwal_id]);
    if (!$jadwalStmt->fetchColumn()) {
        sendResponse('error', 'Jadwal praktik tidak ditemukan', null, 400);
    }

    if ($tanggal_kunjungan === '' || !ctype_digit($no_antrian)) {
        sendResponse('error', 'Tanggal kunjungan dan nomor antrean wajib diisi dengan benar', null, 400);
    }

    $queueStmt = $pdo->prepare(
        "SELECT COUNT(*) FROM pendaftaran
         WHERE jadwal_id = ? AND tanggal_kunjungan = ? AND no_antrian = ?"
    );
    $queueStmt->execute([$jadwal_id, $tanggal_kunjungan, $no_antrian]);
    if ((int)$queueStmt->fetchColumn() > 0) {
        $nextStmt = $pdo->prepare(
            "SELECT COALESCE(MAX(no_antrian), 0) + 1 FROM pendaftaran
             WHERE jadwal_id = ? AND tanggal_kunjungan = ?"
        );
        $nextStmt->execute([$jadwal_id, $tanggal_kunjungan]);
        $no_antrian = (string)$nextStmt->fetchColumn();
    }

    $stmt = $pdo->prepare("INSERT INTO pendaftaran (pasien_id, jadwal_id, tanggal_kunjungan, no_antrian, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$pasien_id, $jadwal_id, $tanggal_kunjungan, $no_antrian, $status]);

    sendResponse('success', 'Data Pendaftaran Berhasil Ditambahkan', [
        'id'        => $pdo->lastInsertId(),
        'pasien_id' => $pasien_id,
        'no_antrian' => $no_antrian,
    ], 201);
} catch (PDOException $e) {
    $message = $e->getCode() === '23000'
        ? 'Data tidak dapat disimpan. Pastikan pasien dan jadwal praktik sudah tersedia.'
        : 'Gagal menyimpan data pendaftaran: ' . $e->getMessage();
    sendResponse('error', $message, null, 500);
}
