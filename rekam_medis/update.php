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
$pendaftaran_id = $_GET['pendaftaran_id'] ?? null;
$dokter_id = $_GET['dokter_id'] ?? null;
$diagnosa = trim($_GET['diagnosa'] ?? '');
$catatan = $_GET['catatan'] ?? null;

if (
    empty($id) || empty($pendaftaran_id) || empty($dokter_id)
    || $diagnosa === ''
) {
    sendResponse('error', 'ID, pendaftaran, dokter, dan diagnosa wajib diisi', null, 400);
}

if (
    !ctype_digit((string)$id)
    || !ctype_digit((string)$pendaftaran_id)
    || !ctype_digit((string)$dokter_id)
) {
    sendResponse('error', 'ID, pendaftaran, atau dokter tidak valid', null, 400);
}

try {
    $pdo = getConnection();
    $check = $pdo->prepare("SELECT id FROM rekam_medis WHERE id = ?");
    $check->execute([$id]);
    if (!$check->fetchColumn()) {
        sendResponse('error', 'Data rekam medis tidak ditemukan', null, 404);
    }

    $stmt = $pdo->prepare(
        "UPDATE rekam_medis
         SET pendaftaran_id = ?, dokter_id = ?, diagnosa = ?, catatan = ?
         WHERE id = ?"
    );
    $stmt->execute([$pendaftaran_id, $dokter_id, $diagnosa, $catatan, $id]);

    sendResponse('success', 'Data rekam medis berhasil diperbarui', [
        'id' => $id,
        'pendaftaran_id' => $pendaftaran_id,
        'dokter_id' => $dokter_id,
        'diagnosa' => $diagnosa,
        'catatan' => $catatan,
    ]);
} catch (PDOException $e) {
    $message = $e->getCode() === '23000'
        ? 'Pendaftaran atau dokter tidak ditemukan, atau pendaftaran tersebut sudah memiliki rekam medis.'
        : 'Gagal memperbarui rekam medis: ' . $e->getMessage();
    sendResponse('error', $message, null, 500);
}
