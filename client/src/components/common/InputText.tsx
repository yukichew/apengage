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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
};

const Icons = {
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome5Icon,
  MaterialCommunityIcons,
  Entypo,
  Feather,
  FontAwesome,
  Fontisto,
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
      {error && isInputTouched ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : null}
      <View style={styles.field}>
        {leftIcon && renderIcon(leftIcon, leftIconLibrary)}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={handleChange(name)}
          onBlur={handleBlurWrapper}
          style={styles.input}
          {...props}
        />
        {rightIcon && renderIcon(rightIcon, rightIconLibrary)}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    width: '100%',
    marginVertical: 12,
    height: 50,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 20,
    flex: 1,
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
  },
  errorMessage: {
    color: 'red',
    paddingVertical: 3,
  },
});

export default InputText;
