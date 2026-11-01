<?php
header('Access-Control-Allow-Origin: *'); // XML
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';


$id         = $_GET['id'] ?? null;

if (empty($id)) {
    sendResponse('error', 'Id wajib diisi', null, 400);
}

$pdo    = getConnection();
$cek    = $pdo->prepare("SELECT id FROM poli WHERE id = ?");
$cek->execute([$id]);
if (!$cek->fetch()) {
    sendResponse('error', 'Data poli tidak ditemukan', null, 404);
}

$ref = $pdo->prepare("SELECT COUNT(*) AS jumlah FROM jadwal_praktik WHERE poli_id = ?");
$ref->execute([$id]);
$dependensi = (int)$ref->fetchColumn();
if ($dependensi > 0) {
    sendResponse('error', "Poli tidak dapat dihapus karena masih digunakan oleh {$dependensi} jadwal praktik", null, 409);
}

try {
    $stmt   = $pdo->prepare("DELETE FROM poli WHERE id=?");
    $stmt->execute([$id]);
} catch (PDOException $e) {
    sendResponse('error', 'Poli tidak dapat dihapus karena masih digunakan data lain', null, 409);
}

sendResponse('success', 'Data Poli Berhasil dihapus', [
    'id'        => $id
], 201);
