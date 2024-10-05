import React from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  text: string;
};

const Title = ({ text }: Props) => {
  return <Text style={styles.title}>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    // fontWeight: 'bold',
    fontSize: 27,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Poppins-Bold',
  },
});

export default Title;
