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

$rekam_medis_id = trim($input['rekam_medis_id'] ?? '');
$nama_obat    = trim($input['nama_obat'] ?? '');
$dosis   =  trim($input['dosis'] ?? '');
$jumlah    =  trim($input['jumlah'] ?? '');

if ($nama_obat === '') {
    sendResponse('error', 'Nama obat wajib diisi', null, 400);
}

if (!ctype_digit($rekam_medis_id) || !ctype_digit($jumlah) || (int)$jumlah < 1) {
    sendResponse('error', 'Rekam medis dan jumlah resep harus valid', null, 400);
}

try {
    $pdo = getConnection();
    $check = $pdo->prepare("SELECT id FROM rekam_medis WHERE id = ?");
    $check->execute([$rekam_medis_id]);
    if (!$check->fetchColumn()) {
        sendResponse('error', 'Rekam medis yang dipilih tidak ditemukan', null, 404);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO resep_obat (rekam_medis_id, nama_obat, dosis, jumlah) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$rekam_medis_id, $nama_obat, $dosis, $jumlah]);

    sendResponse('success', 'Data resep obat Berhasil Ditambahkan', [
        'id'        => $pdo->lastInsertId(),
        'rekam_medis_id' => $rekam_medis_id,
        'nama_obat' => $nama_obat,
        'dosis'    => $dosis,
        'jumlah' => $jumlah,
    ], 201);
} catch (PDOException $e) {
    $driverMessage = $e->errorInfo[2] ?? $e->getMessage();
    if (stripos($driverMessage, 'foreign key constraint fails') !== false) {
        $message = 'ID rekam medis tidak cocok dengan relasi database. Pastikan rekam medis yang dipilih masih ada.';
    } elseif (stripos($driverMessage, 'Duplicate entry') !== false) {
        $message = 'Data resep duplikat menurut aturan unik database. Periksa indeks unik pada tabel resep_obat.';
    } else {
        $message = 'Gagal menyimpan resep obat: ' . $driverMessage;
    }
    sendResponse('error', $message, null, 500);
}
