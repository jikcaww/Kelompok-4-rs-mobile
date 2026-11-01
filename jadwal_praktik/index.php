<?php
header('Access-Control-Allow-Origin: *');
require_once '../config/database.php';
require_once '../helpers/response.php';

$id     = $_GET['id'] ?? null;
$pdo    = getConnection();

if ($id) {
    $stmt   = $pdo->prepare("SELECT
    a.id,
    a.dokter_id,
    a.poli_id,
    b.nama_poli,
    c.nama as nama_dokter
    FROM jadwal_praktik a
    LEFT JOIN poli b ON a.poli_id = b.id
    left join dokter c on a.dokter_id = c.id
    WHERE b.nama_poli LIKE ?");
    $stmt->execute([$id]);
    $data   = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        sendResponse('error', 'Data jadwal praktik tidak ditemukan', null, 404);
    }
    sendResponse('success', 'Data jadwal praktik ditemukan', $data);
} else {
    $stmt   = $pdo->query("SELECT
    a.id,
    a.dokter_id,
    a.poli_id,
    a.hari,
    a.jam_mulai,
    a.jam_selesai,
    a.kuota,
    b.nama_poli,
    c.nama as nama_dokter
    FROM jadwal_praktik a
    left join poli b on a.poli_id = b.id
    left join dokter c on a.dokter_id = c.id
    ORDER BY id ASC");
    $data   = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendResponse('success', 'Daftar jadwal praktik berhasil diambil', $data);
}
