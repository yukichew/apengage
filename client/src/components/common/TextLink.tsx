import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

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
    color: '#2A29FF',
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
  },
});

export default TextLink;
