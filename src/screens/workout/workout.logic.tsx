/**
*
* Workout
*
*/

import React, { useCallback, useEffect, useState } from "react";
import { StackNavigationProp } from '@react-navigation/stack';
import { useTimer } from "use-timer";
import { NavigationPropList, NavigationScreens } from "../../models";
import { getElapsedTime, getTimeElapsedFromStart, getNextSetDescription, getRemainingSetsDescription } from "./util";
import WorkoutLayout from "./workout.layout";
import { WorkoutProps } from ".";
import { Alert, AlertButton } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { triggerNotification, cancelAllTriggerNotifications } from '../../utils/notifications';

type WorkoutNavigationProps = StackNavigationProp<NavigationPropList, NavigationScreens.Workout>;

type Props = {
  route: { params: WorkoutProps };
  navigation: WorkoutNavigationProps;
};

const WorkoutLogic = ({ route: { params: { workout: { rest, sets } } } }: Props) => {
  const navigation = useNavigation();
  const startDate = new Date();
  const [elapsedTime, setElapsedTime] = useState(0);
  const { start, pause, time } = useTimer();
  const [currentSet, setCurrentSet] = useState(1);
  const [resting, setResting] = useState(false);

  useEffect(() => {
    const time = getTimeElapsedFromStart(startDate);
    setElapsedTime(time);
  }, [time, startDate, getTimeElapsedFromStart]);

  useEffect(() => {
    start()
  }, [start]);

  useEffect(() => {
    if (resting) {
      triggerNotification("Next round! - NShape Sets", `Go! You're on Set #${currentSet + 1}`, rest + 1);
    }
  }, [resting, rest, currentSet]);

  const onRestEnd = useCallback(() => {
    setResting(false);
    setCurrentSet(set => set + 1);
  }, []);

  const onBackPressed = useCallback(() => {
    const doneButton: AlertButton = {
      text: "Done!",
      onPress: () => {
        cancelAllTriggerNotifications();
        navigation.goBack();
      },
      style: "destructive"
    }
    const continueButton: AlertButton = {
      text: "Keep going!",
      style: "default"
    }
    Alert.alert("Are you done?", undefined, [continueButton, doneButton]);
  }, [navigation]);

  const onWorkoutEnd = useCallback(() => {
    pause();
    const formattedTime = getTimeElapsedFromStart(startDate);
    const button: AlertButton = {
      text: "Done!",
      onPress: () => navigation.goBack()
    }
    Alert.alert("Done!", `You completed all sets in ${formattedTime}.`, [button]);
  }, [pause, navigation, startDate]);

  const onSetEnd = useCallback(() => {
    if (currentSet >= sets) {
      // Workout is over
      onWorkoutEnd();
    } else {
      setResting(true);
    }
  }, [currentSet, onWorkoutEnd, sets]);

  return <WorkoutLayout
    currentSet={currentSet}
    remainingSetsDescription={getRemainingSetsDescription(currentSet, sets)}
    totalSets={sets}
    nextSetsDescription={getNextSetDescription(currentSet, sets)}
    elapsedTime={elapsedTime}
    restSeconds={rest}
    resting={resting}
    onRestEnd={onRestEnd}
    onSetEnd={onSetEnd}
    onBackPressed={onBackPressed}
  />
};

export default WorkoutLogic;