import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import VenueItem from '../../../components/custom/VenueItem';

type Props = {
  bookings: any[];
  loading: boolean;
  refreshEvents: (category: string) => void;
};

const VenueBooking = ({ bookings, loading, refreshEvents }: Props) => {
  if (loading) {
    return <ActivityIndicator size='large' color='rgba(0,0,0,0.5)' />;
  }

  const renderItem = ({ item }: { item: any }) => (
    <VenueItem
      item={item}
      onPress={() =>
        console.log('VenueBooking.tsx: VenueBooking: onPress: item:', item)
      }
    />
  );

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
              onRefresh={() => refreshEvents('venue')}
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
            No events found
          </Text>
        </View>
      )}
    </>
  );
};

export default VenueBooking;
