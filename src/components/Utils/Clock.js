import React from 'react';
import {StyleSheet, View} from 'react-native';
import AnalogClock from 'react-native-clock-analog';
import {colors} from '../config/theme';

const Clock = () => {
  const theme = {mode: 'light'};
  let activeColors = colors[theme.mode];

  return (
    <View style={styles.container}>
      <AnalogClock
        colorClock={activeColors.secondary}
        colorNumber="#37A6AC"
        colorCenter="#C9C1C1"
        colorHour="#3DA8AE"
        colorMinutes="#3DA8AE"
        colorSeconds="#A8BEBF"
        size={150}
        autostart={true}
        showSeconds
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 100,
    },
    shadowOpacity: 1.9,
    shadowRadius: 40,
    elevation: 20,
  },
});

export default Clock;
