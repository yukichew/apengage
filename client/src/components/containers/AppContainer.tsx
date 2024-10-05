import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../common/Footer';
import Header from '../common/Header';
type Props = {
  children: React.ReactNode;
};

const AppContainer = () => {
  return (
    <SafeAreaView>
      <Header />
      <Footer />
    </SafeAreaView>
  );
};

export default AppContainer;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({});
