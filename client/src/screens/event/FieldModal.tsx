import React, { useState } from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import IconButton from '../../components/common/IconButton';
import { Field } from '../../constants/types';

const FieldModal = ({
  field,
  onSave,
  visible,
  onClose,
}: {
  field: Field;
  onSave: (field: Field) => void;
  visible: boolean;
  onClose: () => void;
}) => {
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState('');

  const saveChanges = () => {
    const fieldToSave = {
      ...field,
      label,
      placeholder,
      required,
      options: options.split(',').map((opt) => opt.trim()),
    };
    onSave(fieldToSave);
  };

  return (
    <Modal visible={visible} animationType='slide' transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <IconButton
            icon='close'
            iconLibrary='Ionicons'
            onPress={onClose}
            style={{ alignSelf: 'flex-end' }}
          />
          <Text style={styles.title}>Field Configuration</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder='Enter Label'
            style={styles.input}
          />
          {field.type === 'checkbox' ||
          field.type === 'dropdown' ||
          field.type === 'mcq' ? (
            <TextInput
              value={options}
              onChangeText={setOptions}
              placeholder='Enter options separated by commas'
              style={styles.input}
            />
          ) : field.type === 'file' ? null : (
            <TextInput
              value={placeholder}
              onChangeText={setPlaceholder}
              placeholder='Enter Placeholder'
              style={styles.input}
            />
          )}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Required</Text>
            <Switch value={required} onValueChange={setRequired} />
          </View>
          <Button title='Save' onPress={saveChanges} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    marginBottom: 10,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.8)',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 14,
    left: 5,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.8)',
  },
});

export default FieldModal;
