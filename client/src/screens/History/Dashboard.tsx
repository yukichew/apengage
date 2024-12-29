import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import Toast from 'react-native-toast-message';
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

  const genderBarData = [
    {
      value:
        data?.genderDistribution.find((g: any) => g.gender === 'Male')?.count ||
        0,
      label: 'Male',
      frontColor: '#2A29FF',
      topLabelComponent: () => (
        <Text style={{ color: 'black', fontSize: 12, marginBottom: 6 }}>
          {data?.genderDistribution.find((g: any) => g.gender === 'Male')
            ?.count || 0}
        </Text>
      ),
    },
    {
      value:
        data?.genderDistribution.find((g: any) => g.gender === 'Female')
          ?.count || 0,
      label: 'Female',
      frontColor: 'rgba(222, 118, 190, 0.8)',
      topLabelComponent: () => (
        <Text style={{ color: 'black', fontSize: 12, marginBottom: 6 }}>
          {data?.genderDistribution.find((g: any) => g.gender === 'Female')
            ?.count || 0}
        </Text>
      ),
    },
  ];

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
            <View style={styles.textContainer}>
              <Text style={styles.subtitle}>Total Participants</Text>
              <Text style={styles.text}>{data?.totalParticipants ?? 0}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.subtitle}>Average Rating</Text>
              <Text style={styles.text}>{feedback?.averageRating ?? 0}</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <View>
              <Text style={styles.chartTitle}>Attendance Rate</Text>
              <PieChart
                data={attendancePieData}
                donut
                radius={90}
                innerRadius={60}
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
            <View>
              <Text style={styles.chartTitle}>Gender Distribution</Text>
              <BarChart
                data={genderBarData}
                hideRules
                barWidth={30}
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
        </View>
        <View style={styles.tableContainer}>
          <Text style={styles.chartTitle}>Participant Responses</Text>
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

  return (
    <AppContainer navigation={navigation} showBackButton>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size='large' color='rgba(0, 0, 0, 0.5)' />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={data?.registrations || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
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
    padding: 20,
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
    marginVertical: 10,
  },
  chartContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  pieCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieCenterText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  pieSubText: {
    fontSize: 14,
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
    width: '48%',
  },
  tableContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
});

export default Dashboard;
