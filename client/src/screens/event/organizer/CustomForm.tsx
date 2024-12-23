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
import DocumentPicker, { types } from 'react-native-document-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { createForm } from '../../../api/form';
import Checkbox from '../../../components/common/Checkbox';
import CustomFormik from '../../../components/common/CustomFormik';
import IconButton from '../../../components/common/IconButton';
import InputText from '../../../components/common/InputText';
import SubmitButton from '../../../components/common/SubmitButton';
import AppContainer from '../../../components/containers/AppContainer';
import useFormFields from '../../../components/custom/EventHook';
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
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<string>('');

  const initialValues = {};
  const validationSchema = yup.object({});
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    formFields,
    selectedField,
    isModalVisible,
    addFormField,
    saveField,
    closeModal,
    openModal,
  } = useFormFields();

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
        />
      )}
      {item.type === 'file' && (
        <TouchableOpacity
          key={item.id}
          style={styles.uploadButton}
          onPress={async () => {
            try {
              const result = await DocumentPicker.pick({
                type: [types.allFiles],
              });
              setSelectedFile(result);
              console.log('Selected File:', result);
            } catch (err) {
              if (DocumentPicker.isCancel(err)) {
                console.log('File selection canceled');
              } else {
                console.error('Unknown Error: ', err);
              }
            }
          }}
        >
          <Text style={styles.uploadText}>Upload File</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [formFields]);

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const data = {
      eventId,
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
            // order: field.order || 0,
            options: field.options || [],
            selectedOptions: field.selectedOptions || [],
          };
        }

        return {
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required || false,
          placeholder: field.placeholder || '',
          defaultValue: field.defaultValue || '',
          // order: field.order || 0,
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
      console.error(res.error);
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Form created successfully!',
    });

    navigation.dispatch(StackActions.replace('Tabs'));
    formikActions.resetForm();
  };

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

          <SubmitButton title='Save' />
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
      width: 2,
      height: 3,
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
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
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
});
