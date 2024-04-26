import React from 'react';
import {StyleSheet, View} from 'react-native';
import AnalogClock from 'react-native-clock-analog';

const Clock = () => {
  return (
    <View style={styles.container}>
      <AnalogClock
        colorClock="#ECECEC"
        colorNumber="#37A6AC"
        colorCenter="#C9C1C1"
        colorHour="#3DA8AE"
        colorMinutes="#3DA8AE"
        colorSeconds="#A8BEBF"
        size={148}
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
  },
});

export default Clock;
