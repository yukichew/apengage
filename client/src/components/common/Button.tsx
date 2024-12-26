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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Semibold',
    letterSpacing: 2,
  },
});

export default Button;
