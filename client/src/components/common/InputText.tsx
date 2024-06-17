import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Props = {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  iconName: string;
  iconLibrary:
    | 'FontAwesome'
    | 'AntDesign'
    | 'MaterialIcons'
    | 'Ionicons'
    | 'Fontisto'
    | 'Entypo'
    | 'Feather'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'FontAwesome5Icon';
};

const InputText = ({
  value,
  placeholder,
  iconName,
  iconLibrary,
  onChangeText,
  ...props
}: Props) => {
  const renderIcon = () => {
    switch (iconLibrary) {
      case 'FontAwesome5Icon':
        return <FontAwesome5Icon name={iconName} style={styles.icon} />;
      case 'AntDesign':
        return <AntDesign name={iconName} style={styles.icon} />;
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} style={styles.icon} />;
      case 'Ionicons':
        return <Ionicons name={iconName} style={styles.icon} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName} style={styles.icon} />;
      case 'Entypo':
        return <Entypo name={iconName} style={styles.icon} />;
      case 'Feather':
        return <Feather name={iconName} style={styles.icon} />;
      case 'FontAwesome':
        return <FontAwesome name={iconName} style={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.field}>
      {renderIcon()}
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.input}
        {...props}
      />
    </View>
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
});

export default InputText;
