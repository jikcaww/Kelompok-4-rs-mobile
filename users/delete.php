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
    sendResponse('error', 'ID pengguna tidak valid', null, 400);
}

try {
    $pdo = getConnection();
    $check = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $check->execute([$id]);
    if (!$check->fetchColumn()) {
        sendResponse('error', 'Data pengguna tidak ditemukan', null, 404);
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse('success', 'Data pengguna berhasil dihapus', ['id' => $id]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        sendResponse(
            'error',
            'Pengguna tidak dapat dihapus karena masih terhubung dengan data pasien atau dokter.',
            null,
            409
        );
    }
    sendResponse('error', 'Gagal menghapus pengguna', null, 500);
}
