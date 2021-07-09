import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RoomsScreen } from '../features/rooms';
import { UserScreen } from '../features/user';
import { BottomTabParamList, RoomsTabParamsList, UserTabParamsList } from '../types';
import { useGetFirebaseUser } from '../features/firebase/useGetFirebaseUser'

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  useGetFirebaseUser()

  return (
    <BottomTab.Navigator
      initialRouteName="RoomsTab"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="RoomsTab"
        component={RoomsTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-list" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="UserTab"
        component={UserTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-person" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const TabBarIcon = (props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) => {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const RoomsTabStack = createStackNavigator<RoomsTabParamsList>();

const RoomsTabNavigator = () => {
  return (
    <RoomsTabStack.Navigator>
      <RoomsTabStack.Screen
        name="RoomsScreen"
        component={RoomsScreen}
        options={{ headerTitle: 'Rooms' }}
      />
    </RoomsTabStack.Navigator>
  );
}

const UserTabStack = createStackNavigator<UserTabParamsList>();

const UserTabNavigator = () => {
  return (
    <UserTabStack.Navigator>
      <UserTabStack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{ headerTitle: 'User' }}
      />
    </UserTabStack.Navigator>
  );
}
