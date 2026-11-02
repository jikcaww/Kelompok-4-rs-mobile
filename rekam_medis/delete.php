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
    sendResponse('error', 'ID rekam medis tidak valid', null, 400);
}

try {
    $pdo = getConnection();
    $check = $pdo->prepare("SELECT id FROM rekam_medis WHERE id = ?");
    $check->execute([$id]);
    if (!$check->fetchColumn()) {
        sendResponse('error', 'Data rekam medis tidak ditemukan', null, 404);
    }

    $stmt = $pdo->prepare("DELETE FROM rekam_medis WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse('success', 'Data rekam medis berhasil dihapus', ['id' => $id]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        sendResponse(
            'error',
            'Rekam medis tidak dapat dihapus karena masih digunakan oleh data lain.',
            null,
            409
        );
    }
    sendResponse('error', 'Gagal menghapus data rekam medis', null, 500);
}
