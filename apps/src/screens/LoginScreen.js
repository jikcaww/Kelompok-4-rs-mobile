import React, { useState } from 'react';
import {
  ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, View,
} from 'react-native';
import { ROLES, useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [nama, setNama] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [error, setError] = useState('');

  const handleLogin = () => {
    const namaTrimmed = nama.trim();
    if (!namaTrimmed) {
      setError('Nama wajib diisi.');
      return;
    }
    setError('');
    login(namaTrimmed, role);
  };

  return (
    <ScrollView
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Masuk</Text>
      <Text style={s.description}>Login simulasi untuk praktikum, bukan autentikasi sungguhan.</Text>

      <Text style={s.label}>Nama</Text>
      <TextInput
        style={[s.input, error && s.inputError]}
        placeholder="Masukkan nama"
        value={nama}
        onChangeText={(value) => {
          setNama(value);
          if (error) setError('');
        }}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
        accessibilityLabel="Nama"
      />
      {!!error && <Text style={s.error}>{error}</Text>}

      <Text style={s.label}>Pilih role</Text>
      <View style={s.roleRow}>
        {ROLES.map((option) => {
          const selected = role === option;
          return (
            <TouchableOpacity
              key={option}
              style={[s.roleOption, selected && s.roleOptionSelected]}
              onPress={() => setRole(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}>
              <Text style={[s.roleText, selected && s.roleTextSelected]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={s.button} onPress={handleLogin} accessibilityRole="button">
        <Text style={s.buttonText}>Masuk</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  description: { color: '#6b7280', marginTop: 8, marginBottom: 12 },
  label: { fontWeight: '600', marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginTop: 4 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap' },
  roleOption: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  roleOptionSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  roleText: { color: '#111827' },
  roleTextSelected: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
