import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import FacilityItem from '../../../components/custom/FacilityItem';

type Props = {
  bookings: any[];
  loading: boolean;
  refreshEvents: (category: string) => void;
};

const FacilityBooking = ({ bookings, loading, refreshEvents }: Props) => {
  if (loading) {
    return <ActivityIndicator size='large' color='rgba(0,0,0,0.5)' />;
  }

  const renderItem = ({ item }: { item: any }) => <FacilityItem item={item} />;

  return (
    <>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refreshEvents('facility')}
            />
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
              color: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            No facility booking found
          </Text>
        </View>
      )}
    </>
  );
};

export default FacilityBooking;
