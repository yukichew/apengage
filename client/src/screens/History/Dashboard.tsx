import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import Toast from 'react-native-toast-message';
import { getAttendees } from '../../api/event';
import AppContainer from '../../components/containers/AppContainer';
import { Navigation } from '../../navigation/types';

type Props = {
  route: { params: { eventId: string } };
  navigation: Navigation;
};

const Dashboard = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const barData =
    data?.sessionData?.map((session: any) => ({
      value: session.attendees,
      label: session.name,
    })) || [];

  return (
    <AppContainer navigation={navigation} showBackButton>
      <ScrollView style={styles.container}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size='large' color='rgba(0, 0, 0, 0.5)' />
          </View>
        ) : data ? (
          <>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Total Participants: {data.totalParticipants}
            </Text>
            <Text style={styles.subtitle}>
              Attendance Rate: {data.attendanceRate}%
            </Text>
            <Text style={styles.chartTitle}>Attendance</Text>
            <BarChart
              data={barData}
              barWidth={30}
              noOfSections={5}
              barBorderRadius={5}
              frontColor='#4caf50'
              backgroundColor='#e0e0e0'
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisLabelTextStyle={{ fontSize: 12 }}
            />
          </>
        ) : (
          <View style={styles.center}>
            <Text>No data found.</Text>
          </View>
        )}
      </ScrollView>
    </AppContainer>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;
