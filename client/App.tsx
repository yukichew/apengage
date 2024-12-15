import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'white' },
};

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <GestureHandlerRootView>
        <AppNavigator />
        <Toast />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
