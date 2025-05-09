import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import TransportItem from '../../../components/custom/TransportItem';

type Props = {
  bookings: any[];
  loading: boolean;
  refreshEvents: (category: string) => void;
};

const TransportBooking = ({ bookings, loading, refreshEvents }: Props) => {
  if (loading) {
    return <ActivityIndicator size='large' color='rgba(0,0,0,0.5)' />;
  }

  const renderItem = ({ item }: { item: any }) => <TransportItem item={item} />;

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
              onRefresh={() => refreshEvents('transport')}
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
            No transport booking found
          </Text>
        </View>
      )}
    </>
  );
};

export default TransportBooking;
