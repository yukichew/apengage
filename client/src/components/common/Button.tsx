import React from 'react';
import {Pressable, StyleSheet, Text, TextInputBase, View} from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

const Button = ({title, onPress}: Props) => {
  return (
    <Pressable onPress={onPress} style={styles.btnContainer}>
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    marginVertical: 12,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 50,
    fontWeight: 'bold',
  },
});

export default Button;
