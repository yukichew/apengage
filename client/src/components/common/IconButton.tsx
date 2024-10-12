import React from 'react';
import { Pressable, StyleSheet, TextStyle } from 'react-native';
import Icons from '../../constants/icons';

type Props = {
  icon: string;
  iconLibrary: keyof typeof Icons;
  onPress?: () => void;
  style?: TextStyle;
};

const IconButton = ({ icon, iconLibrary, onPress, style }: Props) => {
  const IconComponent = Icons[iconLibrary];
  return (
    <Pressable onPress={onPress}>
      <IconComponent name={icon} style={[styles.iconBtn, style]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 22,
  },
});

export default IconButton;
