import { Text } from 'react-native';

export const fieldTypes = [
  { key: 'short_ans', value: 'Short Answer' },
  { key: 'long_ans', value: 'Paragraph' },
  { key: 'dropdown', value: 'Dropdown' },
  { key: 'mcq', value: 'Multiple Choice' },
  { key: 'checkbox', value: 'Checkbox' },
  { key: 'file', value: 'File Upload' },
];

export const gender = [
  { key: '1', value: 'Female' },
  { key: '2', value: 'Male' },
];

export const mode = [
  { key: '1', value: 'online' },
  { key: '2', value: 'oncampus' },
  { key: '3', value: 'offcampus' },
];

export const eventType = [
  { key: '1', value: 'private' },
  { key: '2', value: 'public' },
];

export const transportType = [
  { key: '1', value: 'Bus (44)' },
  { key: '2', value: 'Van (20)' },
];

export const location = [
  { key: '1', value: 'APU Campus' },
  { key: '2', value: 'Fortune Park' },
  { key: '2', value: 'LRT Bukit Jalil' },
];

export const terms = [
  {
    key: '1',
    value: (
      <>
        Private event is an internal event which does
        <Text style={{ fontFamily: 'Poppins-Bold' }}> NOT</Text> require
        participants to register and is invisible to the users. (e.g., Club
        Meeting)
      </>
    ),
  },
  {
    key: '2',
    value: (
      <>
        Public event is an event which requires participants to register and is
        <Text style={{ fontFamily: 'Poppins-Bold' }}> visible</Text> to every
        user. (e.g., Hackathon)
      </>
    ),
  },
  {
    key: '3',
    value: (
      <>
        If you create an event 48 hours before the event, the status of the
        event will be set to{' '}
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: 'green' }}>
          "Approved"
        </Text>{' '}
        automatically, otherwise it will be set to{' '}
        <Text style={{ fontFamily: 'Poppins-SemiBold', color: 'red' }}>
          "Pending"
        </Text>
        .
      </>
    ),
  },
];
