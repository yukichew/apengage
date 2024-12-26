import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating-widget';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { createFeedback } from '../../api/feedback';
import CustomFormik from '../common/CustomFormik';
import InputText from '../common/InputText';
import SubmitButton from '../common/SubmitButton';

type Props = {
  visible: boolean;
  onClose: () => void;
  registrationId: string;
};

const FeedbackModal = ({ visible, onClose, registrationId }: Props) => {
  const [rating, setRating] = useState(0);
  const initialValues = {
    comment: '',
  };

  const validationSchema = yup.object({
    comment: yup.string().required('Comment is required'),
  });

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const res = await createFeedback({
      ...values,
      rating,
      registration: registrationId,
    });
    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to submit feedback',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      onClose();
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Successfully submitted feedback',
    });
    formikActions.resetForm();
    setRating(0);
    onClose();
  };

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationY > 100) {
      onClose();
    }
  };

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (
      event.nativeEvent.state === State.END &&
      event.nativeEvent.translationY > 100
    ) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType='slide' transparent={true}>
      <GestureHandlerRootView style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <KeyboardAvoidingView
            style={styles.modalContentContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalContent}>
              <Text style={styles.title}>Leave a Review</Text>
              <Text style={styles.subtitle}>Please give a rating with us</Text>
              <CustomFormik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                <View>
                  <StarRating rating={rating} onChange={setRating} />
                  <InputText placeholder='Add A Comment' name='comment' />
                  <SubmitButton title='SAVE' />
                </View>
              </CustomFormik>
            </View>
          </KeyboardAvoidingView>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default FeedbackModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    flex: 1,
    width: '100%',
  },
  modalContentContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: '62%',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
