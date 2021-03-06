/**
*
* CircleTimer
*
*/

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useColorStore } from "../../stores";
import styles from "./styles";

type Props = {
  timeInSeconds: number;
  startCountdown?: boolean;
  onCountdownComplete?: () => void;
};

const CircleTimer = ({ timeInSeconds, startCountdown = true, onCountdownComplete }: Props) => {
  const { colors } = useColorStore();
  const circleRef = useRef<AnimatedCircularProgress>();
  const [callTimeUp, setCallTimeUp] = useState(false);

  useEffect(() => {
    if (startCountdown) {
      setTimeout(() => {
        setCallTimeUp(true);
        const toValue = startCountdown ? 0 : 100;
        circleRef?.current?.animate(
          toValue,
          timeInSeconds * 1000,
          (value) => value // linear
        );
      }, 500); // wait for the animation to end before starting the countdown animation
    }
  }, [startCountdown, timeInSeconds]);

  const onTimeUp = useCallback(() => {
    onCountdownComplete ? onCountdownComplete() : null;
  }, [onCountdownComplete]);

  const onAnimationDone = useCallback(() => {
    if (callTimeUp) {
      onTimeUp();
    }
  }, [callTimeUp, onTimeUp]);

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        ref={circleRef}
        size={70}
        width={3}
        fill={100}
        prefill={100}
        tintColor={colors.secondary}
        backgroundColor={colors.primary}
        rotation={180}
        onAnimationComplete={onAnimationDone}
      >
        {(fill) => (
          <Text style={[styles.text, { color: colors.text }]}>{Math.round(timeInSeconds * (fill / 100))}</Text>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default CircleTimer;
