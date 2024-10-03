import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import AuthNavigator from './src/navigation/AuthNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#fff' },
};

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <AuthNavigator />
      <Toast />
    </NavigationContainer>
  );
};

export default App;
