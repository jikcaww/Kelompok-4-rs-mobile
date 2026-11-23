import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import PoliListScreen from '../screens/PoliListScreen';
import PoliFormScreen from '../screens/PoliFormScreen';
import {
  DokterList,
  DokterForm,
  JadwalPraktikList,
  JadwalPraktikForm,
  PasienList,
  PasienForm,
  PendaftaranList,
  PendaftaranForm,
  RekamMedisList,
  RekamMedisForm,
  ResepList,
  ResepForm,
  UsersList,
  UsersForm,
} from '../screens/entityScreens';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const listOptions = (title) => ({ title });
const formOptions = (title) => ({ route }) => ({
  title: `${route.params?.item ? 'Ubah' : 'Tambah'} ${title}`,
});

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="PoliList" component={PoliListScreen} options={listOptions('Data Poli')} />
          <Stack.Screen name="PoliForm" component={PoliFormScreen} options={formOptions('Poli')} />
          <Stack.Screen name="DokterList" component={DokterList} options={listOptions('Data Dokter')} />
          <Stack.Screen name="DokterForm" component={DokterForm} options={formOptions('Dokter')} />
          <Stack.Screen
            name="JadwalPraktikList"
            component={JadwalPraktikList}
            options={listOptions('Data Jadwal Praktik')}
          />
          <Stack.Screen
            name="JadwalPraktikForm"
            component={JadwalPraktikForm}
            options={formOptions('Jadwal Praktik')}
          />
          <Stack.Screen name="PasienList" component={PasienList} options={listOptions('Data Pasien')} />
          <Stack.Screen name="PasienForm" component={PasienForm} options={formOptions('Pasien')} />
          <Stack.Screen
            name="PendaftaranList"
            component={PendaftaranList}
            options={listOptions('Pendaftaran')}
          />
          <Stack.Screen
            name="PendaftaranForm"
            component={PendaftaranForm}
            options={formOptions('Pendaftaran')}
          />
          <Stack.Screen
            name="RekamMedisList"
            component={RekamMedisList}
            options={listOptions('Rekam Medis')}
          />
          <Stack.Screen
            name="RekamMedisForm"
            component={RekamMedisForm}
            options={formOptions('Rekam Medis')}
          />
          <Stack.Screen name="ResepList" component={ResepList} options={listOptions('Resep Obat')} />
          <Stack.Screen name="ResepForm" component={ResepForm} options={formOptions('Resep')} />
          <Stack.Screen name="UsersList" component={UsersList} options={listOptions('Data User')} />
          <Stack.Screen name="UsersForm" component={UsersForm} options={formOptions('User')} />
        </>
      )}
    </Stack.Navigator>
  );
}
