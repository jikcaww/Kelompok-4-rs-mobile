<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$id = $_GET['id'] ?? null;
if (empty($id) || !ctype_digit((string)$id)) {
    sendResponse('error', 'ID resep tidak valid', null, 400);
}

try {
    $pdo = getConnection();
    $check = $pdo->prepare("SELECT id FROM resep_obat WHERE id = ?");
    $check->execute([$id]);
    if (!$check->fetchColumn()) {
        sendResponse('error', 'Data resep tidak ditemukan', null, 404);
    }

    $stmt = $pdo->prepare("DELETE FROM resep_obat WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse('success', 'Data resep berhasil dihapus', ['id' => $id]);
} catch (PDOException $e) {
    sendResponse('error', 'Gagal menghapus resep obat: ' . $e->getMessage(), null, 500);
}
