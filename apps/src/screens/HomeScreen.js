import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { menuForRole } from '../navigation/menu';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const menu = menuForRole(user?.role);

  return (
    <ScrollView style={s.container}>
      <Text style={s.hello}>
        Halo, {user?.nama ?? '-'} ({user?.role ?? '-'})
      </Text>
      {menu.map((m) => (
        <TouchableOpacity key={m.route} style={s.item} onPress={() => navigation.navigate(m.route)}>
          <Text style={s.text}>{m.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  hello: { fontSize: 16, color: '#374151', marginBottom: 12 },
  item: { backgroundColor: '#fff', padding: 18, borderRadius: 10, marginBottom: 12, elevation: 2 },
  text: { fontSize: 16, fontWeight: '600' },
});
