import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  item: any;
  index: number;
  animatedValue: SharedValue<number>;
  currentIndex: SharedValue<number>;
  prevIndex: SharedValue<number>;
  dataLength: number;
  maxVisibleItem: number;
};

const Card = ({
  item,
  index,
  animatedValue,
  currentIndex,
  prevIndex,
  dataLength,
  maxVisibleItem,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [30, 1, 30]
    );

    const translateX2 = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [200, 1, -200]
    );

    const scale = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [0.9, 1, 1.1]
    );

    const opacity = interpolate(
      animatedValue.value,
      [index - 1, index, index + 1],
      [1, 1, 0]
    );

    return {
      transform: [
        { translateX: index === prevIndex.value ? translateX2 : translateX },
        { scale },
      ],
      opacity:
        index < currentIndex.value + maxVisibleItem - 1
          ? opacity
          : index === currentIndex.value + maxVisibleItem - 1
          ? withTiming(1)
          : withTiming(0),
    };
  });
  return (
    <FlingGestureHandler
      key={'right'}
      direction={Directions.RIGHT}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (currentIndex.value !== 0) {
            animatedValue.value = withTiming((currentIndex.value -= 1));
            prevIndex.value = currentIndex.value - 1;
          }
        }
      }}
    >
      <FlingGestureHandler
        key={'left'}
        direction={Directions.LEFT}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (currentIndex.value !== dataLength - 1) {
              animatedValue.value = withTiming((currentIndex.value += 1));
              prevIndex.value = currentIndex.value;
            }
          }
        }}
      >
        <Animated.Image
          source={{ uri: item.thumbnail }}
          style={[styles.image, animatedStyle, { zIndex: dataLength - index }]}
        />
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    borderRadius: 20,
    width: width - 75,
    height: 250,
  },
});

export default Card;
