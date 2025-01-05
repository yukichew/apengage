import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { createForm } from '../../../api/form';
import Button from '../../../components/common/Button';
import Checkbox from '../../../components/common/Checkbox';
import CustomFormik from '../../../components/common/CustomFormik';
import DateInput from '../../../components/common/DateInput';
import IconButton from '../../../components/common/IconButton';
import InputText from '../../../components/common/InputText';
import SubmitButton from '../../../components/common/SubmitButton';
import AppContainer from '../../../components/containers/AppContainer';
import useFormFields from '../../../components/custom/EventHook';
import defaultFields from '../../../constants/fields';
import { fieldTypes } from '../../../constants/items';
import { Field } from '../../../constants/types';
import { Navigation } from '../../../navigation/types';
import FieldModal from './FieldModal';

type Props = {
  route: { params: { eventId: string } };
  navigation: Navigation;
};

const CustomForm = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  const initialValues = {
    deadline: '',
    capacity: '',
  };

  const validationSchema = yup.object({
    deadline: yup.string().trim().required('Registration deadline is missing'),
    capacity: yup
      .string()
      .trim()
      .required('Registration capacity is missing')
      .matches(/^[0-9]+$/, 'Capacity must be a number'),
  });

  const scrollViewRef = useRef<ScrollView>(null);

  const {
    formFields,
    selectedField,
    isModalVisible,
    addFormField,
    saveField,
    closeModal,
    openModal,
    deleteField,
  } = useFormFields(defaultFields);

  const handleSelectField = (type: string) => {
    addFormField(
      type as
        | 'short_ans'
        | 'long_ans'
        | 'dropdown'
        | 'mcq'
        | 'checkbox'
        | 'file'
    );
    setShowDropdown(false);
  };

  const renderItem = ({ item }: { item: Field }) => (
    <>
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          key={item.id}
          style={styles.container}
          onPress={() => {
            openModal(item);
          }}
        >
          <Text style={{ fontFamily: 'Poppins-Regular', paddingBottom: 5 }}>
            {item.label}
          </Text>
          {item.desc && (
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                color: 'rgba(0, 0, 0, 0.5)',
                paddingBottom: 5,
              }}
            >
              {item.desc}
            </Text>
          )}
          {item.type === 'short_ans' && (
            <InputText
              key={item.id}
              placeholder={item.placeholder || ''}
              name={item.id}
            />
          )}
          {item.type === 'long_ans' && (
            <InputText
              key={item.id}
              placeholder={item.placeholder || ''}
              name={item.id}
              multiline
              numberOfLines={4}
            />
          )}
          {item.type === 'checkbox' && (
            <Checkbox
              key={item.id}
              options={item.options || []}
              selectedOptions={item.selectedOptions || []}
              onChange={(selected) => {
                const updatedField = { ...item, selectedOptions: selected };
                saveField(updatedField);
              }}
            />
          )}
          {item.type === 'mcq' && (
            <Checkbox
              key={item.id}
              options={item.options || []}
              selectedOptions={item.selectedOptions || []}
              onChange={(selected) => {
                const updatedField = { ...item, selectedOptions: selected };
                saveField(updatedField);
              }}
              multiple={false}
            />
          )}
          {item.type === 'dropdown' && (
            <SelectList
              key={item.id}
              setSelected={(val: string) => setSelected(val)}
              data={item.options || []}
              save='value'
              boxStyles={{ width: '100%', marginVertical: 7, minHeight: 50 }}
              inputStyles={{
                color: 'rgba(0, 0, 0, 0.5)',
                fontSize: 16,
              }}
              dropdownStyles={{ width: '100%' }}
            />
          )}
          {item.type === 'file' && (
            <Button
              title='Upload File'
              containerStyle={{ width: width - 80 }}
            />
          )}
        </TouchableOpacity>
      </Swipeable>
    </>
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [formFields]);

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const data = {
      eventId,
      deadline: values.deadline,
      fields: formFields.map((field) => {
        if (
          field.type === 'mcq' ||
          field.type === 'dropdown' ||
          field.type === 'checkbox'
        ) {
          return {
            id: field.id,
            type: field.type,
            label: field.label,
            required: field.required || false,
            placeholder: field.placeholder || '',
            defaultValue: field.defaultValue || '',
            options: field.options || [],
            selectedOptions: field.selectedOptions || [],
            defaultField: field.defaultField || false,
            desc: field.desc || '',
            normalizedLabel:
              field.normalizedLabel ||
              field.label.toLowerCase().replace(/\s+/g, '_'),
          };
        }

        return {
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required || false,
          placeholder: field.placeholder || '',
          defaultValue: field.defaultValue || '',
          defaultField: field.defaultField || false,
          desc: field.desc || '',
          normalizedLabel:
            field.normalizedLabel ||
            field.label.toLowerCase().replace(/\s+/g, '_'),
        };
      }),
    };

    const res = await createForm(data);
    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to create form',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Form created successfully!',
    });

    navigation.dispatch(StackActions.replace('Tabs'));
    formikActions.resetForm();
  };

  const handleDeleteField = (fieldId: string) => {
    deleteField(fieldId);
  };

  const renderRightActions = (fieldId: string) => (
    <View style={styles.hiddenActionContainer}>
      <IconButton
        icon='trash-outline'
        iconLibrary='Ionicons'
        style={{ fontSize: 25, color: 'red' }}
        onPress={() => handleDeleteField(fieldId)}
      />
    </View>
  );

  return (
    <AppContainer navigation={navigation} showBackButton>
      <CustomFormik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 18,
              marginTop: 6,
              marginBottom: 4,
            }}
          >
            Create Registration Form
          </Text>

          {currentStep === 1 && (
            <>
              <DateInput
                placeholder='Registration Deadline'
                name='deadline'
                minimumDate={new Date()}
              />
              <InputText placeholder='Registration Capacity' name='capacity' />
              <Button
                title='Next'
                onPress={() => setCurrentStep(2)}
                containerStyle={{ marginTop: 20 }}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                Click to edit field, swipe right to delete
              </Text>

              {formFields.map((field) => renderItem({ item: field }))}
              <FieldModal
                field={
                  selectedField || {
                    id: Date.now().toString(),
                    type: 'short_ans',
                    label: '',
                    placeholder: '',
                  }
                }
                onSave={saveField}
                visible={isModalVisible}
                onClose={closeModal}
              />
              <TouchableOpacity
                style={styles.addFieldContainer}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <IconButton
                  icon='add-circle-outline'
                  iconLibrary='Ionicons'
                  style={{ fontSize: 25 }}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Add Field
                </Text>
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdown}>
                  {fieldTypes.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectField(type.key)}
                    >
                      <Text style={styles.dropdownText}>{type.value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View
                style={{
                  marginTop: 10,
                }}
              >
                <Button title='Back' onPress={() => setCurrentStep(1)} />
                <SubmitButton title='Save' />
              </View>
            </>
          )}
        </ScrollView>
      </CustomFormik>
    </AppContainer>
  );
};

export default CustomForm;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 8,
    alignSelf: 'center',
    padding: 10,
    borderLeftColor: '#2A29FF',
    borderLeftWidth: 5,
    marginHorizontal: 6,
  },
  addFieldContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dropdown: {
    elevation: 5,
    borderRadius: 5,
    width: 180,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 12,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownText: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  hiddenActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
