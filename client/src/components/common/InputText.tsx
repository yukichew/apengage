import { useFormikContext } from 'formik';
import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import Icons from '../../constants/icons';

type Props = {
  value?: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  leftIcon?: string;
  rightIcon?: string;
  leftIconLibrary?: keyof typeof Icons;
  rightIconLibrary?: keyof typeof Icons;
  name: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  label?: string;
};

const renderIcon = (iconName: string, iconLibrary?: keyof typeof Icons) => {
  if (!iconLibrary) {
    return null;
  }
  const IconComponent = Icons[iconLibrary];
  return <IconComponent name={iconName} style={styles.icon} />;
};

const InputText = ({
  placeholder,
  leftIcon,
  rightIcon,
  leftIconLibrary,
  rightIconLibrary,
  name,
  ...props
}: Props) => {
  const { handleChange, values, errors, touched, handleBlur } =
    useFormikContext<any>();
  const handleBlurWrapper = handleBlur(name) as (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => void;
  const value = values[name];
  const error = errors[name] as string;
  const isInputTouched = touched[name];

  return (
    <>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <View style={[styles.field, props.multiline && styles.multilineField]}>
        {leftIcon && renderIcon(leftIcon, leftIconLibrary)}
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={'rgba(0, 0, 0, 0.4)'}
          onChangeText={handleChange(name)}
          onBlur={handleBlurWrapper}
          style={[styles.input, leftIcon ? { marginLeft: 10 } : null]}
          multiline={props.multiline}
          numberOfLines={props.multiline ? props.numberOfLines : 1}
          autoCapitalize='none'
          keyboardType={props.keyboardType || 'default'}
          {...props}
        />
        {rightIcon && renderIcon(rightIcon, rightIconLibrary)}
      </View>
      {error && isInputTouched ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    width: '100%',
    marginVertical: 7,
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
  },
  multilineField: {
    minHeight: 70,
    height: 'auto',
    paddingVertical: 5,
  },
  icon: {
    fontSize: 22,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  errorMessage: {
    color: 'red',
    paddingVertical: 3,
    fontFamily: 'Poppins-Regular',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 5,
  },
});

export default InputText;
