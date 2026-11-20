import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPoli, searchPoli, deletePoli } from '../services/poliService';
import { showAlert, confirmDialog } from '../utils/dialog';

export default function PoliListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      setData(await getPoli());
    } catch (e) {
      showAlert('Gagal memuat', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Dipanggil setiap layar ini tampil kembali (mis. setelah simpan data)
  useFocusEffect(useCallback(() => { loadData(); }, []));

  const handleSearch = async () => {
    if (keyword.trim() === '') return loadData();
    setLoading(true);
    try {
      const hasil = await searchPoli(keyword.trim());
      setData([hasil]); // API mengembalikan satu objek
    } catch (e) {
      setData([]); // 404 = tidak ditemukan
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    confirmDialog('Hapus Poli', `Yakin menghapus "${item.nama_poli}"?`, async () => {
      try {
        await deletePoli(item.id);
        loadData();
      } catch (e) {
        showAlert('Gagal menghapus', e.message);
      }
    });
  };

  const renderItem = ({ item }) => (
    <View style={s.card}>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{item.nama_poli}</Text>
        <Text style={s.sub}>📍 {item.lokasi || '-'}</Text>
      </View>
      <TouchableOpacity
        style={[s.btn, { backgroundColor: '#f59e0b' }]}
        onPress={() => navigation.navigate('PoliForm', { item })}>
        <Text style={s.btnText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.btn, { backgroundColor: '#ef4444' }]}
        onPress={() => handleDelete(item)}>
        <Text style={s.btnText}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.searchRow}>
        <TextInput
          style={s.input}
          placeholder="Cari nama poli..."
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={[s.btn, { backgroundColor: '#2563eb' }]} onPress={handleSearch}>
          <Text style={s.btnText}>Cari</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#2563eb" />}

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={loadData}
        ListEmptyComponent={!loading && <Text style={s.empty}>Data poli tidak ditemukan</Text>}
      />

      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('PoliForm')}>
        <Text style={s.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f3f4f6' },
  searchRow: { flexDirection: 'row', marginBottom: 10 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 8,
    paddingHorizontal: 12, marginRight: 8, borderWidth: 1, borderColor: '#d1d5db',
  },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 14, borderRadius: 10, marginBottom: 10, elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  sub: { color: '#6b7280', marginTop: 2 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginLeft: 6 },
  btnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 30, color: '#6b7280' },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: '#16a34a', alignItems: 'center',
    justifyContent: 'center', elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 28, marginTop: -2 },
});
