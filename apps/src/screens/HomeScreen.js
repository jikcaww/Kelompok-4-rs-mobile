import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MENU = [
  { label: 'Data Poli', route: 'PoliList' },
  { label: 'Data Dokter', route: 'DokterList' },
  { label: 'Data Jadwal Praktik', route: 'JadwalPraktikList' },
  { label: 'Data Pasien', route: 'PasienList' },
  { label: 'Pendaftaran Antrian', route: 'PendaftaranList' },
  { label: 'Rekam Medis (dan Resep)', route: 'RekamMedisList' },
   { label: 'Data user', route: 'UsersList' },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={s.container}>
      {MENU.map((m) => (
        <TouchableOpacity key={m.route} style={s.item} onPress={() => navigation.navigate(m.route)}>
          <Text style={s.text}>{m.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  item: { backgroundColor: '#fff', padding: 18, borderRadius: 10, marginBottom: 12, elevation: 2 },
  text: { fontSize: 16, fontWeight: '600' },
});
