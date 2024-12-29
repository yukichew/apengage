import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
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
    <GestureHandlerRootView style={[styles.container]}>
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

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: height * 0.28,
    width: width - 55,
    alignSelf: 'center',
  },
});

export default StackCarousel;
