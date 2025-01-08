import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { editEvent, getEvent } from '../../api/event';
import CustomFormik from '../../components/common/CustomFormik';
import InputText from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import AppContainer from '../../components/containers/AppContainer';
import { Navigation } from '../../navigation/types';

type Props = {
  route: { params: { eventId: string } };
  navigation: Navigation;
};

const EventHistoryForm = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: '',
    desc: '',
  });
  98;
  const validationSchema = yup.object({
    name: yup.string().trim().required('Event name is missing'),
    desc: yup.string().trim().required('Event description is missing'),
  });

  const fetchEvent = async () => {
    setLoading(true);
    const res = await getEvent({ id: eventId });
    if (!res.success) {
      setLoading(false);
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch event',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setInitialValues({
      name: res.data.event.name,
      desc: res.data.event.desc,
    });
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvent();
    }, [])
  );

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const res = await editEvent(eventId, values);
    formikActions.setSubmitting(false);
    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to edit event',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }
    Toast.show({
      type: 'success',
      text1: 'Successfully edited event',
    });
    navigation.navigate('EventHistory', { event: res.data.event });
    formikActions.resetForm();
  };

  return (
    <AppContainer navigation={navigation} showBackButton>
      <View style={{ paddingHorizontal: 20 }}>
        <CustomFormik
          key={JSON.stringify(initialValues)}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 18,
              marginTop: 6,
              marginBottom: 4,
            }}
          >
            Edit Event
          </Text>
          <InputText
            placeholder='Event Name'
            name='name'
            leftIcon='title'
            leftIconLibrary='MaterialIcons'
          />
          <InputText
            placeholder='Event Description'
            name='desc'
            multiline
            numberOfLines={4}
            leftIcon='file-text'
            leftIconLibrary='Feather'
          />
          <SubmitButton title='save' />
        </CustomFormik>
      </View>
    </AppContainer>
  );
};

export default EventHistoryForm;
