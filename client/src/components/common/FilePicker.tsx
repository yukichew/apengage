import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import IconButton from './IconButton';

type Props = {
  file: any;
  setFile: (file: any) => void;
};

const FilePicker = ({ file, setFile }: Props) => {
  const pickImage = async () => {
    const result = await DocumentPicker.pick({
      type: [types.images],
    });
    setFile(result[0]);

    if (DocumentPicker.isCancel(result)) {
      Toast.show({
        type: 'error',
        text1: 'Failed to pick image',
        text2: 'Image selection canceled',
        position: 'top',
        topOffset: 60,
      });
    }
  };

  return (
    <>
      <TouchableOpacity onPress={pickImage} style={styles.container}>
        <IconButton icon='upload' iconLibrary='Octicons' style={styles.icon} />
        <Text style={styles.input}>Upload File</Text>
      </TouchableOpacity>

      {file && (
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            paddingLeft: 6,
            color: 'green',
            marginBottom: 5,
          }}
        >
          Selected file: {file.name}
        </Text>
      )}
    </>
  );
};

export default FilePicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    height: 50,
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
    color: 'rgba(0, 0, 0, 0.2)',
  },
  icon: {
    fontSize: 22,
    color: 'rgba(0, 0, 0, 0.5)',
  },
});
