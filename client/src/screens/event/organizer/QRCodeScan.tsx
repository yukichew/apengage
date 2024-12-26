import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { markAttendance } from '../../../api/event';
import AppContainer from '../../../components/containers/AppContainer';
import { Props } from '../../../constants/types';

const QRCodeScan = ({ navigation }: Props) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const device = useCameraDevice('back');

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    return frame;
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: async (codes) => {
      const qrCodeData = codes[0]?.value;
      if (!qrCodeData) {
        Toast.show({
          type: 'error',
          text1: 'Invalid QR Code',
          text2: 'No data found in the QR code',
          position: 'top',
          topOffset: 60,
        });
        return;
      }

      const res = await markAttendance({ qrCodeData });
      if (!res.success) {
        return Toast.show({
          type: 'error',
          text1: 'Failed to mark attendance',
          text2: res.error,
          position: 'top',
          topOffset: 60,
        });
      }

      Toast.show({
        type: 'success',
        text1: res.data.message,
      });
    },
  });

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    };

    requestCameraPermission();
  }, []);

  useEffect(() => {
    setRefresh(!refresh);
  }, [device, hasPermission]);

  if (device == null || !hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Camera permission is required to scan QR codes.
        </Text>
      </View>
    );
  }

  return (
    <AppContainer navigation={navigation} showBackButton>
      <Camera
        frameProcessor={frameProcessor}
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </AppContainer>
  );
};

export default QRCodeScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
