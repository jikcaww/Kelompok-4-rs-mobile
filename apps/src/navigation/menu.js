// Menu ini hanya mengatur tampilan; otorisasi tetap menjadi tanggung jawab server.
export const MENU = [
  { label: 'Data Poli', route: 'PoliList', roles: ['admin', 'dokter'] },
  { label: 'Data Dokter', route: 'DokterList', roles: ['admin'] },
  {
    label: 'Data Jadwal Praktik',
    route: 'JadwalPraktikList',
    roles: ['admin', 'dokter', 'pasien'],
  },
  { label: 'Data Pasien', route: 'PasienList', roles: ['admin', 'dokter'] },
  {
    label: 'Pendaftaran Antrian',
    route: 'PendaftaranList',
    roles: ['admin', 'dokter', 'pasien'],
  },
  {
    label: 'Rekam Medis (dan Resep)',
    route: 'RekamMedisList',
    roles: ['admin', 'dokter'],
  },
  { label: 'Data user', route: 'UsersList', roles: ['admin'] },
];

export const menuForRole = (role) =>
  MENU.filter((menu) => menu.roles.includes(role));
