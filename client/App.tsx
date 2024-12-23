import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { navigationRef } from './src/navigation/RootNavigator';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'white' },
};

const App = () => {
  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <GestureHandlerRootView>
        {/* <CustomForm /> */}
        <AppNavigator />
        <Toast />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default App;
