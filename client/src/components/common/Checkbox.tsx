import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icons from '../../constants/icons';

type Props = {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
};

const Checkbox = ({
  options,
  selectedOptions,
  onChange,
  multiple = true,
}: Props) => {
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(multiple ? selectedOptions.filter((o) => o !== option) : []);
    } else {
      onChange(multiple ? [...selectedOptions, option] : [option]);
    }
  };

  return (
    <View>
      {options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.optionContainer}
          onPress={() => toggleOption(option)}
        >
          {selectedOptions.includes(option) ? (
            <Icons.MaterialCommunityIcons
              name={multiple ? 'checkbox-outline' : 'radiobox-marked'}
              size={18}
            />
          ) : (
            <Icons.MaterialCommunityIcons
              name={multiple ? 'checkbox-blank-outline' : 'radiobox-blank'}
              size={18}
            />
          )}
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  optionText: {
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
});

export default Checkbox;
