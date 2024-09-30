import React from 'react';
import { Pressable, StyleSheet, Text, TextInputBase, View } from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
};

const TextLink = ({ text, onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.linkText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  linkText: {
    color: 'blue',
    fontWeight: '500',
  },
});

export default TextLink;
