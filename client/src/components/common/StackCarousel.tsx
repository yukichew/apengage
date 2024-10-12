import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import Card from './Card';

type Props = {
  data: any;
  maxVisibleItem: number;
};

const StackCarousel = ({ data, maxVisibleItem }: Props) => {
  const animatedValue = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);

  return (
    <GestureHandlerRootView style={styles.container}>
      {data.map((item: any, index: number) => {
        return (
          <Card
            key={index}
            item={item}
            index={index}
            animatedValue={animatedValue}
            currentIndex={currentIndex}
            prevIndex={prevIndex}
            dataLength={data.length}
            maxVisibleItem={maxVisibleItem}
          />
        );
      })}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default StackCarousel;
