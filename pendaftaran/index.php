<?php
header('Access-Control-Allow-Origin: *');
require_once '../config/database.php';
require_once '../helpers/response.php';

$id     = $_GET['id'] ?? null;
$pdo    = getConnection();

if ($id) {
    $stmt   = $pdo->prepare("SELECT * FROM pendaftaran WHERE id = ?");
    $stmt->execute([$id]);
    $data   = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        sendResponse('error', 'Data pendaftaran tidak ditemukan', null, 404);
    }
    sendResponse('success', 'Data pendaftaran ditemukan', $data);
} else {
    $stmt   = $pdo->query(
        "SELECT pendaftaran.*,
                pasien.nama AS nama_pasien,
                pasien.no_rm,
                poli.nama_poli,
                dokter.nama AS nama_dokter
         FROM pendaftaran
         LEFT JOIN pasien ON pasien.id = pendaftaran.pasien_id
         LEFT JOIN jadwal_praktik ON jadwal_praktik.id = pendaftaran.jadwal_id
         LEFT JOIN poli ON poli.id = jadwal_praktik.poli_id
         LEFT JOIN dokter ON dokter.id = jadwal_praktik.dokter_id
         ORDER BY tanggal_kunjungan DESC, no_antrian ASC"
    );
    $data   = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendResponse('success', 'Daftar pendaftaran berhasil diambil', $data);
}
