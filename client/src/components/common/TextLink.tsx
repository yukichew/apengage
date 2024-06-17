import React from 'react';
import {Pressable, StyleSheet, Text, TextInputBase, View} from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
};

const TextLink = ({text, onPress}: Props) => {
  return (
    <View style={styles.linkContainer}>
      <Pressable onPress={onPress}>
        <Text>{text}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'blue',
  },
});

export default TextLink;
