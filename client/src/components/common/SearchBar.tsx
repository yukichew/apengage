import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import IconButton from './IconButton';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  onSubmitEditing: () => void;
  placeholder: string;
  onClear?: () => void;
};

const SearchBar = ({
  value,
  placeholder,
  onClear,
  onSubmitEditing,
  ...props
}: Props) => {
  return (
    <View style={styles.field}>
      <IconButton icon='search' iconLibrary='Feather' />
      <TextInput
        value={value}
        placeholder={placeholder}
        onSubmitEditing={onSubmitEditing}
        style={styles.input}
        placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
        {...props}
      />
      {value ? (
        <IconButton icon='close' iconLibrary='AntDesign' onPress={onClear} />
      ) : null}
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
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
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
});

export default SearchBar;
