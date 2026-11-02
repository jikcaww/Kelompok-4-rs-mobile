import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ============================================================
// KONFIGURASI SERVER API  (satu-satunya berkas yang perlu diubah)
// ============================================================

// Nama folder API di htdocs XAMPP  ->  http://<host>/<API_FOLDER>/poli/index.php
const API_FOLDER = 'Kelompok-4-rs-mobile';

// Port Apache. Kosongkan ('') bila memakai port 80 bawaan XAMPP.
const API_PORT = '';

// Isi bila deteksi otomatis gagal, mis. '192.168.1.10' (IP LAN komputer Anda).
// Cek dengan: ipconfig (Windows) atau ifconfig / ip a (Mac/Linux).
const MANUAL_HOST = '';

// ------------------------------------------------------------
// Deteksi otomatis alamat komputer:
//  - Browser (web)        : localhost
//  - Expo Go / emulator   : IP komputer yang menjalankan "expo start"
//                           (komputer yang sama dengan XAMPP)
//  - Emulator Android tanpa info IP : 10.0.2.2
// ------------------------------------------------------------
function detectHost() {
  if (MANUAL_HOST) return MANUAL_HOST;
  if (Platform.OS === 'web') return 'localhost';
  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost;
  if (hostUri) return hostUri.split(':')[0];
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

const HOST = detectHost();
export const BASE_URL = `http://${HOST}${API_PORT ? ':' + API_PORT : ''}/${API_FOLDER}`;
