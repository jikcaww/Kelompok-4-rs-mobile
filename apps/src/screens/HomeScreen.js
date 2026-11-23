import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { menuForRole } from '../navigation/menu';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const menu = menuForRole(user?.role);

  return (
    <ScrollView style={s.container}>
      <View style={s.greetingContainer}>
        <Text style={s.greeting}>Halo, {user?.nama ?? '-'} ({user?.role ?? '-'})</Text>
      </View>
      {menu.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={s.item}
          onPress={() => navigation.navigate(item.route)}>
          <Text style={s.text}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  greetingContainer: { marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#111827' },
  item: { backgroundColor: '#fff', padding: 18, borderRadius: 10, marginBottom: 12, elevation: 2 },
  text: { fontSize: 16, fontWeight: '600' },
});
