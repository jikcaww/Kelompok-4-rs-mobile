import makeListScreen from '../components/makeListScreen';
import makeFormScreen from '../components/makeFormScreen';
import {
  dokterApi, poliApi, pasienApi, pendaftaranApi, jadwalPraktikApi, rekamMedisApi, resepApi, usersApi,
} from '../services/apis';
import { exactDigits, isDate, positiveInt } from '../utils/validators';
import { showAlert } from '../utils/dialog';

// ---------- Pemuat pilihan untuk field select ----------
const pasienOptions = async () =>
  (await pasienApi.list()).map((p) => ({ value: p.id, label: `${p.no_rm} - ${p.nama}` }));
const dokterOptions = async () =>
  (await dokterApi.list()).map((d) => ({ value: d.id, label: `${d.nama} (${d.spesialisasi || '-'})` }));
const pendaftaranOptions = async () =>
  (await pendaftaranApi.list()).map((p) => ({
    value: p.id, label: `#${p.id} antrian ${p.no_antrian} (${p.tanggal_kunjungan})`,
  }));
const jadwalOptions = async () =>
  (await jadwalPraktikApi.list()).map((j) => ({
    value: j.id,
    label: `${j.nama_poli || `Poli #${j.poli_id}`} - ${j.nama_dokter || `Dokter #${j.dokter_id}`} - ${j.hari || '-'}`,
  }));
const poliOptions = async () =>
  (await poliApi.list()).map((p) => ({ value: p.id, label: p.nama_poli }));

// ---------- JADWAL PRAKTIK ----------
export const JadwalPraktikList = makeListScreen({
  api: jadwalPraktikApi, formRoute: 'JadwalPraktikForm',
  titleOf: (j) => `${j.nama_poli || `Poli #${j.poli_id}`} - ${j.hari}`,
  subOf: (j) => `${j.nama_dokter || `Dokter #${j.dokter_id}`} | ${j.jam_mulai || '-'}-${j.jam_selesai || '-'} | Kuota: ${j.kuota || 20}`,
});
export const JadwalPraktikForm = makeFormScreen({
  api: jadwalPraktikApi,
  fields: [
    { name: 'dokter_id', label: 'Dokter', type: 'select', required: true, loadOptions: dokterOptions },
    { name: 'poli_id', label: 'Poli', type: 'select', required: true, loadOptions: poliOptions },
    { name: 'hari', label: 'Hari', required: true, placeholder: 'Contoh: Senin' },
    { name: 'jam_mulai', label: 'Jam Mulai', required: true, placeholder: '08:00' },
    { name: 'jam_selesai', label: 'Jam Selesai', required: true, placeholder: '12:00' },
    { name: 'kuota', label: 'Kuota', type: 'number', required: true, default: '20', validate: [positiveInt('Kuota')] },
  ],
});
const userOptions = async () =>
  (await usersApi.list()).map((u) => ({
    value: u.id, label: `${u.nama} - ${u.email} (ID: ${u.id})`,
  }));

// ---------- DOKTER ----------
export const DokterList = makeListScreen({
  api: dokterApi, formRoute: 'DokterForm',
  titleOf: (d) => d.nama,
  subOf: (d) => `${d.spesialisasi || '-'} | SIP: ${d.no_sip || '-'}`,
});
export const DokterForm = makeFormScreen({
  api: dokterApi,
  fields: [
    { name: 'nama', label: 'Nama Dokter', required: true, maxLength: 100 },
    { name: 'spesialisasi', label: 'Spesialisasi', maxLength: 100 },
    { name: 'no_sip', label: 'No. SIP', maxLength: 50 },
  ],
});

// ---------- PASIEN ----------
export const PasienList = makeListScreen({
  api: pasienApi, formRoute: 'PasienForm',
  titleOf: (p) => p.nama,
  subOf: (p) => `RM ${p.no_rm} | NIK ${p.nik} | ${p.jenis_kelamin} | ${p.tgl_lahir}`,
});
export const PasienForm = makeFormScreen({
  api: pasienApi,
  fields: [
    {
      name: 'user_id', label: 'Akun User (wajib sudah ada)', type: 'select', required: true,
      loadOptions: userOptions,
    },
    { name: 'nik', label: 'NIK', type: 'number', required: true, maxLength: 16, validate: [exactDigits('NIK', 16)] },
    { name: 'no_rm', label: 'No. Rekam Medis', required: true, maxLength: 20 },
    { name: 'nama', label: 'Nama Lengkap', required: true, maxLength: 100 },
    { name: 'tgl_lahir', label: 'Tanggal Lahir', type: 'date', required: true, validate: [isDate('Tanggal lahir')] },
    {
      name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', required: true,
      options: [{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }],
    },
    { name: 'alamat', label: 'Alamat', type: 'multiline' },
  ],
});

// ---------- PENDAFTARAN ----------
const STATUS_COLOR = { dipanggil: '#2563eb', selesai: '#16a34a', batal: '#6b7280' };

export const PendaftaranList = makeListScreen({
  api: pendaftaranApi, formRoute: 'PendaftaranForm',
  titleOf: (p) => `Antrian ${p.no_antrian} - ${p.tanggal_kunjungan}`,
  subOf: (p) => `${p.nama_pasien || `Pasien #${p.pasien_id}`} | ${p.nama_poli || `Jadwal #${p.jadwal_id}`} | Status: ${p.status}`,
  // Tombol ubah status (alur: menunggu -> dipanggil -> selesai / batal)
  actions: (item, { reload }) =>
    ['dipanggil', 'selesai', 'batal']
      .filter((st) => st !== item.status)
      .map((st) => ({
        label: st, color: STATUS_COLOR[st],
        onPress: async () => {
          try {
            await pendaftaranApi.update(item.id, {
              pasien_id: item.pasien_id, jadwal_id: item.jadwal_id,
              tanggal_kunjungan: item.tanggal_kunjungan, no_antrian: item.no_antrian,
              status: st,
            });
            reload();
          } catch (e) {
            showAlert('Gagal ubah status', e.message);
          }
        },
      })),
});
export const PendaftaranForm = makeFormScreen({
  api: pendaftaranApi,
  fields: [
    { name: 'pasien_id', label: 'Pasien', type: 'select', required: true, loadOptions: pasienOptions },
    { name: 'jadwal_id', label: 'Jadwal Praktik', type: 'select', required: true, loadOptions: jadwalOptions },
    { name: 'tanggal_kunjungan', label: 'Tanggal Kunjungan', type: 'date', required: true, validate: [isDate('Tanggal kunjungan')] },
    { name: 'no_antrian', label: 'No. Antrian', type: 'number', required: true, validate: [positiveInt('No. antrian')] },
    {
      name: 'status', label: 'Status', type: 'select', required: true, default: 'menunggu',
      options: ['menunggu', 'dipanggil', 'selesai', 'batal'].map((v) => ({ value: v, label: v })),
    },
  ],
});

// ---------- REKAM MEDIS ----------
export const RekamMedisList = makeListScreen({
  api: rekamMedisApi, formRoute: 'RekamMedisForm',
  titleOf: (r) => `Rekam Medis #${r.id} (Pendaftaran #${r.pendaftaran_id})`,
  subOf: (r) => `Dokter #${r.dokter_id} | Diagnosa: ${r.diagnosa}`,
  actions: (item, { navigation }) => [{
    label: 'Resep', color: '#7c3aed',
    onPress: () => navigation.navigate('ResepList', { rekam_medis_id: item.id }),
  }],
});
export const RekamMedisForm = makeFormScreen({
  api: rekamMedisApi,
  fields: [
    { name: 'pendaftaran_id', label: 'Pendaftaran', type: 'select', required: true, loadOptions: pendaftaranOptions },
    { name: 'dokter_id', label: 'Dokter Pemeriksa', type: 'select', required: true, loadOptions: dokterOptions },
    { name: 'diagnosa', label: 'Diagnosa', type: 'multiline', required: true },
    { name: 'catatan', label: 'Catatan', type: 'multiline' },
  ],
});

// ---------- RESEP OBAT (data anak dari rekam medis) ----------
export const ResepList = makeListScreen({
  api: resepApi, formRoute: 'ResepForm', filterBy: 'rekam_medis_id',
  titleOf: (r) => `${r.nama_obat} x${r.jumlah}`,
  subOf: (r) => `Dosis: ${r.dosis || '-'}`,
});
export const ResepForm = makeFormScreen({
  api: resepApi,
  fields: [
    { name: 'rekam_medis_id', type: 'hidden' },
    { name: 'nama_obat', label: 'Nama Obat', required: true, maxLength: 150 },
    { name: 'dosis', label: 'Dosis (mis. 3 x 1 sehari)', maxLength: 100 },
    { name: 'jumlah', label: 'Jumlah', type: 'number', required: true, default: '1', validate: [positiveInt('Jumlah')] },
  ],
});


// ---------- Users ----------
export const UsersList = makeListScreen({
  api: usersApi, formRoute: 'UsersForm',
  titleOf: (p) => p.nama,
  subOf: (p) => `${p.email}`,
});
export const UsersForm = makeFormScreen({
  api: usersApi,
  fields: [
    { name: 'nama', label: 'Nama Lengkap', required: true, maxLength: 100 },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    {
      name: 'role', label: 'Role', type: 'select', default: 'pasien',
      options: [
        { value: 'pasien', label: 'Pasien' },
        { value: 'dokter', label: 'Dokter' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  ],
});
