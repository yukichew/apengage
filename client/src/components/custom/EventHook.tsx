import { useState } from 'react';
import { Field } from '../../constants/types';

const useFormFields = (initialFields: Field[] = []) => {
  const [formFields, setFormFields] = useState<Field[]>(initialFields);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = (field: Field | null) => {
    setSelectedField(field);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedField(null);
    setModalVisible(false);
  };

  const addFormField = (
    type: 'short_ans' | 'long_ans' | 'dropdown' | 'mcq' | 'checkbox' | 'file'
  ) => {
    const newField: Field =
      type === 'mcq' || type === 'dropdown' || type === 'checkbox'
        ? {
            id: Date.now().toString(),
            type,
            label: '',
            placeholder: '',
            required: false,
            options: [],
            selectedOptions: type === 'mcq' ? [] : undefined,
            defaultValue: '',
          }
        : {
            id: Date.now().toString(),
            type,
            label: '',
            placeholder: '',
            required: false,
          };

    openModal(newField);
  };

  const saveField = (updatedField: Field) => {
    setFormFields((prevFields) =>
      prevFields.some((field) => field.id === updatedField.id)
        ? prevFields.map((field) =>
            field.id === updatedField.id ? updatedField : field
          )
        : [...prevFields, updatedField]
    );
    closeModal();
  };

  const deleteField = (fieldId: string) => {
    const updatedFields = formFields.filter((field) => field.id !== fieldId);
    setFormFields(updatedFields);
  };

  return {
    formFields,
    selectedField,
    isModalVisible,
    addFormField,
    deleteField,
    saveField,
    openModal,
    closeModal,
  };
};

export default useFormFields;
