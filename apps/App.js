import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import PoliListScreen from './src/screens/PoliListScreen';
import PoliFormScreen from './src/screens/PoliFormScreen';
import {
  DokterList, DokterForm, PasienList, PasienForm, PendaftaranList,
  PendaftaranForm, RekamMedisList, RekamMedisForm, ResepList, ResepForm, UsersList, UsersForm,
  JadwalPraktikList, JadwalPraktikForm
} from './src/screens/entityScreens';

const Stack = createNativeStackNavigator();

const listOpt = (title) => ({ title });
const formOpt = (nama) => ({ route }) => ({
  title: `${route.params?.item ? 'Ubah' : 'Tambah'} ${nama}`,
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={listOpt('SIMRS')} />
        <Stack.Screen name="PoliList" component={PoliListScreen} options={listOpt('Data Poli')} />
        <Stack.Screen name="PoliForm" component={PoliFormScreen} options={formOpt('Poli')} />
        <Stack.Screen name="DokterList" component={DokterList} options={listOpt('Data Dokter')} />
        <Stack.Screen name="DokterForm" component={DokterForm} options={formOpt('Dokter')} />
        <Stack.Screen name="JadwalPraktikList" component={JadwalPraktikList} options={listOpt('Data Jadwal Praktik')} />
        <Stack.Screen name="JadwalPraktikForm" component={JadwalPraktikForm} options={formOpt('Jadwal Praktik')} />
        <Stack.Screen name="PasienList" component={PasienList} options={listOpt('Data Pasien')} />
        <Stack.Screen name="PasienForm" component={PasienForm} options={formOpt('Pasien')} />
        <Stack.Screen name="PendaftaranList" component={PendaftaranList} options={listOpt('Pendaftaran')} />
        <Stack.Screen name="PendaftaranForm" component={PendaftaranForm} options={formOpt('Pendaftaran')} />
        <Stack.Screen name="RekamMedisList" component={RekamMedisList} options={listOpt('Rekam Medis')} />
        <Stack.Screen name="RekamMedisForm" component={RekamMedisForm} options={formOpt('Rekam Medis')} />
        <Stack.Screen name="ResepList" component={ResepList} options={listOpt('Resep Obat')} />
        <Stack.Screen name="ResepForm" component={ResepForm} options={formOpt('Resep')} />
        
        <Stack.Screen name="UsersList" component={UsersList} options={listOpt('Data User')} />
        <Stack.Screen name="UsersForm" component={UsersForm} options={formOpt('User')} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
