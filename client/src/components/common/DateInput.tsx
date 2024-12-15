import { useField } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import IconButton from './IconButton';

type Props = {
  placeholder: string;
  name: string;
};

const DateInput = ({ placeholder, name }: Props) => {
  const [field, meta, helpers] = useField(name);
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.container}>
        <IconButton
          icon='calendar-outline'
          iconLibrary='Ionicons'
          style={styles.icon}
        />
        <Text style={styles.input}>
          {field.value ? new Date(field.value).toLocaleString() : placeholder}
        </Text>
        <DatePicker
          modal
          open={open}
          date={field.value ? new Date(field.value) : new Date()}
          onConfirm={(date) => {
            setOpen(false);
            helpers.setValue(date.toISOString());
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        {meta.touched && meta.error && (
          <Text style={styles.errorText}>{meta.error}</Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default DateInput;

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
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
});
