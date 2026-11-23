import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { PendaftaranList } from '../screens/entityScreens';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{
          title: 'Beranda',
          tabBarLabel: 'Beranda',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="AntrianTab"
        component={PendaftaranList}
        options={{
          title: 'Antrian',
          tabBarLabel: 'Antrian',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Akun"
        component={ProfileScreen}
        options={{
          title: 'Akun',
          tabBarLabel: 'Akun',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
