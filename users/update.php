<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';

// Menangkap metode OPTIONS untuk preflight request pada aplikasi mobile/frontend
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = [];
}

$id       = $input['id'] ?? $_POST['id'] ?? $_GET['id'] ?? null;
$nama     = trim($input['nama'] ?? $_POST['nama'] ?? $_GET['nama'] ?? '');
$email    = trim($input['email'] ?? $_POST['email'] ?? $_GET['email'] ?? '');
$role     = $input['role'] ?? $_POST['role'] ?? $_GET['role'] ?? '';
$password = $input['password'] ?? $_POST['password'] ?? $_GET['password'] ?? '';

// Validasi kelengkapan data
if (empty($id) || $nama === '' || $email === '' || $role === '') {
    sendResponse('error', 'ID, nama, email, dan role wajib diisi', null, 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse('error', 'Format email tidak valid', null, 400);
}

if ($password !== '' && strlen($password) < 6) {
    sendResponse('error', 'Password minimal 6 karakter', null, 400);
}

// Validasi enum role berdasarkan skema database
$allowed_roles = ['admin', 'dokter', 'pasien'];
if (!in_array($role, $allowed_roles)) {
    sendResponse('error', 'Role tidak valid. Gunakan: admin, dokter, atau pasien', null, 400);
}

try {
    $pdo = getConnection();
    // Pengecekan eksistensi data user
    $cek = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $cek->execute([$id]);
    if (!$cek->fetch()) {
        sendResponse('error', 'Data user tidak ditemukan', null, 404);
    }

    // Pengecekan duplikasi email untuk menjaga integritas data (kolom is_unique)
    $cekEmail = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $cekEmail->execute([$email, $id]);
    if ($cekEmail->fetch()) {
        sendResponse('error', 'Email sudah terdaftar pada pengguna lain', null, 409);
    }

    // Eksekusi pembaruan data
    if ($password !== '') {
        $stmt = $pdo->prepare(
            "UPDATE users SET nama = ?, email = ?, role = ?, password_hash = ? WHERE id = ?"
        );
        $stmt->execute([$nama, $email, $role, password_hash($password, PASSWORD_DEFAULT), $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?");
        $stmt->execute([$nama, $email, $role, $id]);
    }

    sendResponse('success', 'Data User berhasil diperbarui', [
        'id'    => $id,
        'nama'  => $nama,
        'email' => $email,
        'role'  => $role
    ], 200);

} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        sendResponse('error', 'Email sudah terdaftar pada pengguna lain', null, 409);
    }
    sendResponse('error', 'Terjadi kesalahan saat memperbarui pengguna', null, 500);
}