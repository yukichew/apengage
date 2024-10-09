import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
};

const SearchBar = ({ value, ...props }: Props) => {
  return (
    <View style={styles.field}>
      <Feather name='search' style={styles.icon} />
      <TextInput
        value={value}
        placeholder='Search'
        style={styles.input}
        {...props}
      />
      <AntDesign name='close' style={styles.icon} />
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  field: {
    width: '100%',
    marginVertical: 12,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 37, 37, 0.1)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width - 40,
    alignSelf: 'center',
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },
  icon: {
    fontSize: 22,
    color: 'rgba(37, 37, 37, 0.6)',
  },
});

export default SearchBar;
