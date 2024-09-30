import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Navigation } from '../../navigation/types';

type Props = {
  onPress: () => void;
};

const BackButton = ({ onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
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
