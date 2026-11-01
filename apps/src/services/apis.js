import { createCrudService } from './crudService';

export const dokterApi = createCrudService('dokter');
export const poliApi = createCrudService('poli');
export const pasienApi = createCrudService('pasien');
export const pendaftaranApi = createCrudService('pendaftaran');
export const jadwalPraktikApi = createCrudService('jadwal_praktik');
export const rekamMedisApi = createCrudService('rekam_medis');
export const resepApi = createCrudService('resep_obat');
export const usersApi = createCrudService('users');
