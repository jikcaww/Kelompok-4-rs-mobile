import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { createPoli, updatePoli } from '../services/poliService';
import { showAlert } from '../utils/dialog';

export default function PoliFormScreen({ route, navigation }) {
  const poli = route.params?.item;      // undefined = mode tambah
  const isEdit = !!poli;

  const [namaPoli, setNamaPoli] = useState(poli?.nama_poli ?? '');
  const [lokasi, setLokasi] = useState(poli?.lokasi ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Validasi input (Sub-CPMK 6)
    if (namaPoli.trim() === '') {
      setError('Nama poli wajib diisi');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = isEdit
        ? await updatePoli(poli.id, namaPoli.trim(), lokasi.trim())
        : await createPoli(namaPoli.trim(), lokasi.trim());
      // goBack dijalankan setelah OK ditekan (berlaku di web maupun mobile)
      showAlert('Berhasil', res.message, () => navigation.goBack());
    } catch (e) {
      showAlert('Gagal menyimpan', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.label}>Nama Poli *</Text>
      <TextInput
        style={[s.input, error && s.inputError]}
        placeholder="Contoh: Poli Gigi"
        value={namaPoli}
        onChangeText={setNamaPoli}
      />
      {!!error && <Text style={s.error}>{error}</Text>}

      <Text style={s.label}>Lokasi</Text>
      <TextInput
        style={s.input}
        placeholder="Contoh: Gedung A Lantai 1"
        value={lokasi}
        onChangeText={setLokasi}
      />

      <TouchableOpacity style={s.btn} onPress={handleSave} disabled={saving}>
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={s.btnText}>{isEdit ? 'Perbarui' : 'Simpan'}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: '600', marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginTop: 4 },
  btn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, marginTop: 24, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
