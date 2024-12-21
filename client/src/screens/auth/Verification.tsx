import { StackActions } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { verifyEmail } from '../../api/auth';
import Title from '../../components/common/Title';
import { Navigation } from '../../navigation/types';

type Props = {
  route: {
    params: {
      profile: {
        id: string;
      };
    };
  };
  navigation: Navigation;
};

const Verification = ({ route, navigation }: Props) => {
  const { profile } = route.params;
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [otp, setOtp] = useState(Array(6).fill(''));
  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus(); // Move to the next input if current has value
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move to the previous input if backspace is pressed on an empty input
    }
  };

  const isObjValid = (obj: { [key: number]: string }) => {
    return Object.values(obj).every((item) => item !== '');
  };

  const submitOtp = async () => {
    Keyboard.dismiss();
    if (isObjValid(otp)) {
      const val = Object.values(otp).join('');

      const res = await verifyEmail({ otp: val, userId: profile.id });

      if (!res.success) {
        Toast.show({
          type: 'error',
          text1: 'Verification Error',
          text2: res.error,
          position: 'top',
          topOffset: 60,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful',
        text2: 'Welcome to the app!',
        position: 'top',
        topOffset: 60,
      });

      navigation.dispatch(
        StackActions.replace('HomeScreen', { profile: res.user })
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Title text='Verification' />
      <Text style={styles.heading}>OTP has been sent to your email.</Text>
      <View style={styles.inputContainer}>
        {otp.map((_, index) => (
          <TextInput
            value={otp[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            placeholder='-'
            key={index.toString()}
            style={styles.input}
            keyboardType='number-pad'
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitOtp}>
        <AntDesign name='check' size={25} style={{ color: 'white' }} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get('window');
const inputWidth = Math.round(width / 8);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    marginTop: -15,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    width: inputWidth,
    height: inputWidth,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default Verification;
