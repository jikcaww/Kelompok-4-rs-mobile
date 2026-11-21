import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PendaftaranList } from '../screens/entityScreens';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const icon = (glyph) => ({ focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{glyph}</Text>
);

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#2563eb' }}>
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{
          title: 'SIMRS',
          tabBarLabel: 'Beranda',
          tabBarIcon: icon('🏠'),
        }}
      />
      <Tab.Screen
        name="AntrianTab"
        component={PendaftaranList}
        options={{
          title: 'Antrian',
          tabBarLabel: 'Antrian',
          tabBarIcon: icon('📋'),
        }}
      />
      <Tab.Screen
        name="Akun"
        component={ProfileScreen}
        options={{
          title: 'Akun',
          tabBarLabel: 'Akun',
          tabBarIcon: icon('👤'),
        }}
      />
    </Tab.Navigator>
  );
}
