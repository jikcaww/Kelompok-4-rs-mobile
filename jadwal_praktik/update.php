<?php
header('Access-Control-Allow-Origin: *'); // XML
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';


$id         = $_GET['id'] ?? null;
$dokter_id  = $_GET['dokter_id'] ?? null;
$poli_id    = $_GET['poli_id'] ?? null;
$hari       = $_GET['hari'] ?? null;
$jam_mulai  = $_GET['jam_mulai'] ?? null;
$jam_selesai = $_GET['jam_selesai'] ?? null;
$kuota      = $_GET['kuota'] ?? null;

if (empty($id) || empty($dokter_id)) {
    sendResponse('error', 'Id Dokter wajib diisi', null, 400);
}

$pdo    = getConnection();
$cek    = $pdo->prepare("SELECT id FROM jadwal_praktik WHERE id = ?");
$cek->execute([$id]);
if (!$cek->fetch()) {
    sendResponse('error', 'Data jadwal praktik tidak ditemukan', null, 404);
}


$stmt   = $pdo->prepare("UPDATE jadwal_praktik SET dokter_id=?,poli_id=?,hari=?,jam_mulai=?,jam_selesai=?,kuota=? WHERE id=?");
$stmt->execute([$dokter_id, $poli_id, $hari, $jam_mulai, $jam_selesai, $kuota, $id]);

sendResponse('success', 'Data Jadwal Praktik Berhasil diperbarui', [
    'id'        => $id,
    'dokter_id' => $dokter_id,
    'poli_id'   => $poli_id,
    'hari'      => $hari,
    'jam_mulai' => $jam_mulai,
    'jam_selesai' => $jam_selesai,
    'kuota'     => $kuota
], 201);
