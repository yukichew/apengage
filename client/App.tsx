import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import TabNavigator from './src/navigation/TabNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'white' },
};

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <TabNavigator />
      <Toast />
    </NavigationContainer>
  );
};

export default App;
