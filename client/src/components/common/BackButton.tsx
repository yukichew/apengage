import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Navigation } from '../../navigation/types';

type Props = {
  navigation: Navigation;
};

const BackButton = ({ navigation }: Props) => {
  return (
    <Pressable onPress={() => navigation.goBack()}>
      <Icon name='arrow-back' style={styles.backBtn} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    color: 'black',
    fontSize: 24,
  },
});

export default BackButton;
