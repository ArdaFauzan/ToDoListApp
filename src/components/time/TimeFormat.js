import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ClockOn from '../../assets/clockOn.svg';
import ClockDarkOn from '../../assets/clockDarkOn.svg';
import ClockOff from '../../assets/clockOff.svg';
import {ThemeContext} from '../Context/ThemeContext';
import {colors} from '../config/theme';

const TimeFormat = ({time, completed}) => {
  const {theme} = useContext(ThemeContext);
  const isDarkMode = theme.mode === 'dark';
  let activeColors = colors[theme.mode];

  return (
    <View style={styles.container}>
      {completed ? <ClockOff /> : isDarkMode ? <ClockDarkOn /> : <ClockOn />}

      <Text
        style={[styles.text, {color: completed ? 'gray' : activeColors.text}]}>
        {time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp('1%'),
    flexDirection: 'row',
    gap: wp('1%'),
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default TimeFormat;
