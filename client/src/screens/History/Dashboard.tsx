import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import XLSX from 'xlsx';
import { getAttendees } from '../../api/event';
import { getFeedbacks } from '../../api/feedback';
import { getForm } from '../../api/form';
import AppContainer from '../../components/containers/AppContainer';
import { Field } from '../../constants/types';
import { Navigation } from '../../navigation/types';

type Props = {
  route: { params: { eventId: string } };
  navigation: Navigation;
};

type Registration = {
  response: { [key: string]: string };
};

const Dashboard = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Field[]>([]);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const res = await getAttendees({ eventId });
      if (!res.success) {
        setLoading(false);
        return Toast.show({
          type: 'error',
          text1: 'Failed to fetch dashboard data',
          text2: res.error,
          position: 'top',
          topOffset: 60,
        });
      }
      setData(res.data);

      const res2 = await getForm({ eventId });
      if (!res2.success) {
        setLoading(false);
        return Toast.show({
          type: 'error',
          text1: 'Failed to fetch form',
          text2: res2.error,
          position: 'top',
          topOffset: 60,
        });
      }
      setForm(res2.data.form.fields);

      const res3 = await getFeedbacks({ id: eventId });
      if (!res2.success) {
        setLoading(false);
        return Toast.show({
          type: 'error',
          text1: 'Failed to fetch form',
          text2: res2.error,
          position: 'top',
          topOffset: 60,
        });
      }
      setFeedback(res3.data);
      setLoading(false);
    };

    fetchDashboardData();
  }, [eventId]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [data, form]);

  const attendancePieData = [
    {
      value: data?.attended || 0,
      color: '#4caf50',
      gradientCenterColor: '#087f23',
      text: 'Attended',
      focused: true,
    },
    {
      value: data?.notAttended || 0,
      color: '#f44336',
      gradientCenterColor: '#b71c1c',
      text: 'Absent',
    },
  ];

  const colors = [
    '#4caf50',
    '#ff9800',
    '#f44336',
    '#2196f3',
    '#9c27b0',
    '#ffeb3b',
  ];

  const ratingBarData = Object.keys(feedback?.ratingDistribution || {}).map(
    (key, index) => ({
      value: feedback.ratingDistribution[key],
      label: key,
      frontColor: colors[index % colors.length],
      topLabelComponent: () => (
        <Text style={{ color: 'black', fontSize: 12, marginBottom: 6 }}>
          {feedback.ratingDistribution[key]}
        </Text>
      ),
    })
  );

  const renderLegend = () => {
    return (
      <View style={styles.legendContainer}>
        {attendancePieData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.pieSubText}>
              {item.text}: {item.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = () => {
    const headers = form?.map((field: Field) => field.label) ?? [];

    return (
      <>
        <View style={{ padding: 20 }}>
          <Text style={styles.title}>Dashboard</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <View style={{ alignSelf: 'center' }}>
              <View style={styles.textContainer}>
                <Text style={styles.subtitle}>Total Participants</Text>
                <Text style={styles.text}>{data?.totalParticipants ?? 0}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.subtitle}>Average Rating</Text>
                <Text style={styles.text}>{feedback?.averageRating ?? 0}</Text>
              </View>
            </View>

            <View style={{ alignItems: 'center' }}>
              <PieChart
                data={attendancePieData}
                donut
                radius={65}
                innerRadius={45}
                showGradient
                sectionAutoFocus
                focusOnPress
                centerLabelComponent={() => (
                  <View style={styles.pieCenter}>
                    <Text style={styles.pieCenterText}>
                      {data?.attendanceRate ?? 0}%
                    </Text>
                    <Text style={styles.pieSubText}>Attendance</Text>
                  </View>
                )}
              />
              {renderLegend()}
            </View>
          </View>

          <View>
            <Text style={styles.chartTitle}>Rating Distribution</Text>
            <BarChart
              data={ratingBarData}
              hideRules
              barWidth={35}
              noOfSections={5}
              barBorderRadius={5}
              yAxisThickness={1}
              xAxisThickness={1}
              xAxisLabelTextStyle={{ fontSize: 12 }}
              showYAxisIndices
              isAnimated
            />
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
              }}
            >
              Participant Responses
            </Text>
            <TouchableOpacity onPress={exportToExcel}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-SemiBold',
                  color: 'blue',
                  textDecorationLine: 'underline',
                }}
              >
                Export to Excel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tableHeader}>
            {headers.map((header: string, index: number) => (
              <Text key={index} style={styles.tableHeaderText}>
                {header}
              </Text>
            ))}
          </View>
        </View>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.tableContainer}>
        <Text style={styles.chartTitle}>Feedback Comments</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>No.</Text>
          <Text style={styles.tableHeaderText}>Rating</Text>
          <Text style={styles.tableHeaderText}>Comment</Text>
          <Text style={styles.tableHeaderText}>Posted By</Text>
        </View>
        {feedback?.feedbacks.map(
          (
            item: { rating: number; comment: string; createdBy: string },
            index: number
          ) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{item.rating}</Text>
              <Text style={styles.tableCell}>{item.comment}</Text>
              <Text style={styles.tableCell}>{item.createdBy}</Text>
            </View>
          )
        )}
      </View>
    );
  };

  const exportToExcel = async () => {
    try {
      const headers = form.map((field) => field.label);
      const rows = data?.registrations.map((item: Registration) =>
        form.map((field) => item.response[field.id] || '-')
      );

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');

      const filePath = `${RNFS.DocumentDirectoryPath}/responses.xlsx`;
      const excelData = XLSX.write(workbook, {
        type: 'binary',
        bookType: 'xlsx',
      });

      await RNFS.writeFile(filePath, excelData, 'ascii');

      const shareOptions = {
        title: 'Exported Responses',
        url: `file://${filePath}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      Share.open(shareOptions).then((res) => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Data exported successfully.',
        });
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while exporting data.',
      });
    }
  };

  return (
    <AppContainer navigation={navigation} showBackButton>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size='large' color='rgba(0, 0, 0, 0.5)' />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          data={data?.registrations || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.tableRow, { marginHorizontal: 20 }]}>
              {form?.map((field) => (
                <Text key={field.id} style={styles.tableCell}>
                  {item.response[field.id] || '-'}
                </Text>
              )) || null}
            </View>
          )}
        />
      )}
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  pieCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieCenterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  pieSubText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  text: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    fontFamily: 'Poppins-Regular',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  tableHeaderText: {
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 5,
  },
});

export default Dashboard;
