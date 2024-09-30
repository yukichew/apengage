import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AuthNavigator from './src/navigation/AuthNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#fff' },
};

const App = () => {
  return (
    <NavigationContainer theme={theme}>
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default App;
