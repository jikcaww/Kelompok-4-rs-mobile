<?php
header('Access-Control-Allow-Origin: *');
require_once '../config/database.php';
require_once '../helpers/response.php';

$id     = $_GET['id'] ?? null;
$pdo    = getConnection();

if ($id) {
    $stmt = $pdo->prepare("SELECT id, nama, email, role FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $data   = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        sendResponse('error', 'Data users tidak ditemukan', null, 404);
    }
    sendResponse('success', 'Data users ditemukan', $data);
} else {
    $stmt = $pdo->query("SELECT id, nama, email, role FROM users ORDER BY nama ASC");
    $data   = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendResponse('success', 'Daftar users berhasil diambil', $data);
}
