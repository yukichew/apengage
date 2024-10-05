import { DefaultTheme } from '@react-navigation/native';
import React from 'react';
import Home from './src/screens/Home';
// import Toast from 'react-native-toast-message';
// import AuthNavigator from './src/navigation/AuthNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#fff' },
};

const App = () => {
  return (
    // <NavigationContainer theme={theme}>
    //   <AuthNavigator />
    //   <Toast />
    // </NavigationContainer>
    <Home />
  );
};

export default App;
