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
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    marginVertical: 12,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 50,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 2,
  },
});

export default SubmitButton;
