import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Event from '../screens/event/Event';
import EventForm from '../screens/event/EventForm';
import History from '../screens/History';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import { RootStackNavigatorParamsList } from './types';

const Tab = createBottomTabNavigator<RootStackNavigatorParamsList>();

const TabNavigator: FC = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          borderRadius: 15,
          height: 62,
          backgroundColor: 'white',
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabScreenContainer}>
              <Octicons
                name='home'
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 23,
                }}
              />
              <Text
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Event'
        component={Event}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabScreenContainer}>
              <Ionicons
                name='newspaper-outline'
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 23,
                }}
              />
              <Text
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                Event
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='AddEvent'
        component={EventForm}
        options={{
          tabBarIcon: () => (
            <View
              style={{
                top: -7,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                borderRadius: 35,
                width: 50,
                height: 50,
                ...styles.shadow,
              }}
            >
              <MaterialIcons
                name='add-box'
                style={{
                  fontSize: 23,
                  color: 'white',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='History'
        component={History}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabScreenContainer}>
              <MaterialIcons
                name='history'
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 23,
                }}
              />
              <Text
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                History
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabScreenContainer}>
              <FontAwesome6
                name='circle-user'
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 23,
                }}
              />
              <Text
                style={{
                  color: focused ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  tabScreenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 15,
  },
});

export default TabNavigator;
