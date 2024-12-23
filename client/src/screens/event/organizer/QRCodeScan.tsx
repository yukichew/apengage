import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Props } from '../../../constants/types';

const QRCodeScan = ({ navigation }: Props) => {
  const onSuccess = async (e: { data: string }) => {
    const qrCodeData = e.data;
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        topContent={
          <Text style={styles.text}>Scan the QR Code to mark attendance</Text>
        }
        bottomContent={
          <Text style={styles.instructions}>
            Align the QR code within the frame
          </Text>
        }
        showMarker
      />
    </View>
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
  instructions: {
    fontSize: 14,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
});
