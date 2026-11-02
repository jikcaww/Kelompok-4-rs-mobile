<?php
header('Access-Control-Allow-Origin: *'); // XML
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';


$id         = $_GET['id'] ?? null;
$rekam_medis_id  = $_GET['rekam_medis_id'] ?? null;
$nama_obat     = $_GET['nama_obat'] ?? null;
$dosis     = $_GET['dosis'] ?? null;
$jumlah     = $_GET['jumlah'] ?? null;

if (empty($id) || empty($nama_obat) || $jumlah === null || !ctype_digit($jumlah) || (int)$jumlah < 1) {
    sendResponse('error', 'ID, nama obat, dan jumlah valid wajib diisi', null, 400);
}

try {
    $pdo = getConnection();
    $cek = $pdo->prepare("SELECT id FROM resep_obat WHERE id = ?");
    $cek->execute([$id]);
    if (!$cek->fetch()) {
        sendResponse('error', 'Data resep tidak ditemukan', null, 404);
    }

    $stmt = $pdo->prepare(
        "UPDATE resep_obat SET nama_obat = ?, dosis = ?, jumlah = ? WHERE id = ?"
    );
    $stmt->execute([$nama_obat, $dosis, $jumlah, $id]);

    sendResponse('success', 'Data resep obat berhasil diperbarui', [
        'id' => $id,
        'nama_obat' => $nama_obat,
        'dosis' => $dosis,
        'jumlah' => $jumlah,
    ]);
} catch (PDOException $e) {
    sendResponse('error', 'Gagal memperbarui resep obat: ' . $e->getMessage(), null, 500);
}
