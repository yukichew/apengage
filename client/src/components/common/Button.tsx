import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({ title, onPress, containerStyle, textStyle }: Props) => {
  return (
    <Pressable onPress={onPress} style={[styles.btnContainer, containerStyle]}>
      <Text style={[styles.btnText, textStyle]}>{title.toUpperCase()}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    marginVertical: 10,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'Poppins-Semibold',
    letterSpacing: 2,
  },
});

export default Button;
