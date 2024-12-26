import { useFormikContext } from 'formik';
import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
};

const SubmitButton = ({ title, onPress }: Props) => {
  const { handleSubmit, isSubmitting } = useFormikContext(); // prevent the unused import error
  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress();
    } else {
      handleSubmit();
    }
  };
  return (
    <Pressable
      onPress={isSubmitting ? null : handlePress}
      style={[
        styles.btnContainer,
        { backgroundColor: isSubmitting ? 'gray' : 'black' },
      ]}
    >
      <Text style={styles.btnText}>{title.toUpperCase()}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    marginVertical: 10,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'Poppins-Semibold',
    letterSpacing: 2,
  },
});

export default SubmitButton;
