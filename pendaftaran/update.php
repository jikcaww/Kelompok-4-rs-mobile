<?php
header('Access-Control-Allow-Origin: *'); // XML
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';


$id         = $_GET['id'] ?? null;
$pasien_id  = $_GET['pasien_id'] ?? null;
$jadwal_id  = $_GET['jadwal_id'] ?? null;
$tanggal_kunjungan  = $_GET['tanggal_kunjungan'] ?? null;
$no_antrian  = $_GET['no_antrian'] ?? null;
$status  = $_GET['status'] ?? null;

if (
    empty($id) || empty($pasien_id) || empty($jadwal_id)
    || $tanggal_kunjungan === null || $no_antrian === null
) {
    sendResponse('error', 'ID, pasien, jadwal, tanggal kunjungan, dan nomor antrean wajib diisi', null, 400);
}

if (!in_array($status, ['menunggu', 'dipanggil', 'selesai', 'batal'], true)) {
    sendResponse('error', 'Status pendaftaran tidak valid', null, 400);
}

try {
    $pdo = getConnection();
    $cek = $pdo->prepare("SELECT id FROM pendaftaran WHERE id = ?");
    $cek->execute([$id]);
    if (!$cek->fetch()) {
        sendResponse('error', 'Data pendaftaran tidak ditemukan', null, 404);
    }

    $stmt = $pdo->prepare(
        "UPDATE pendaftaran
         SET pasien_id = ?, jadwal_id = ?, tanggal_kunjungan = ?, no_antrian = ?, status = ?
         WHERE id = ?"
    );
    $stmt->execute([$pasien_id, $jadwal_id, $tanggal_kunjungan, $no_antrian, $status, $id]);

    sendResponse('success', 'Status pendaftaran berhasil diperbarui', [
        'id' => $id,
        'pasien_id' => $pasien_id,
        'jadwal_id' => $jadwal_id,
        'tanggal_kunjungan' => $tanggal_kunjungan,
        'no_antrian' => $no_antrian,
        'status' => $status,
    ]);
} catch (PDOException $e) {
    $message = $e->getCode() === '23000'
        ? 'Nomor antrean sudah digunakan untuk jadwal dan tanggal tersebut.'
        : 'Gagal memperbarui pendaftaran: ' . $e->getMessage();
    sendResponse('error', $message, null, 500);
}
