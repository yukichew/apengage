import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { navigationRef } from './src/navigation/RootNavigator';

LogBox.ignoreAllLogs(true);

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'white' },
};

const App = () => {
  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <GestureHandlerRootView>
        <AppNavigator />
        <Toast />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
