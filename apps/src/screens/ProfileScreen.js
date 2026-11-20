import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { confirmDialog } from '../utils/dialog';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    confirmDialog(
      'Konfirmasi keluar',
      'Apakah Anda yakin ingin keluar dari sesi simulasi?',
      logout,
    );
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Akun / Profile</Text>
      <View style={s.details}>
        <Text style={s.label}>Nama</Text>
        <Text style={s.value}>{user?.nama ?? '-'}</Text>
        <Text style={s.label}>Role</Text>
        <Text style={s.value}>{user?.role ?? '-'}</Text>
      </View>
      <TouchableOpacity
        style={s.button}
        onPress={handleLogout}
        accessibilityRole="button">
        <Text style={s.buttonText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  details: { marginTop: 20, padding: 16, backgroundColor: '#f3f4f6', borderRadius: 10 },
  label: { color: '#6b7280', fontSize: 14, marginBottom: 4 },
  value: { color: '#111827', fontSize: 16, fontWeight: '600', marginBottom: 14 },
  button: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
