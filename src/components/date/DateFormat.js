import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CalendarOn from '../../assets/calendarOn.svg';
import CalendarDarkOn from '../../assets/calendarDarkOn.svg';
import CalendarOff from '../../assets/calendarOff.svg';
import {ThemeContext} from '../Context/ThemeContext';
import {colors} from '../config/theme';

const DateFormat = ({date, completed}) => {
  const {theme} = useContext(ThemeContext);
  const isDarkMode = theme.mode === 'dark';
  let activeColors = colors[theme.mode];

  const formatDate = d => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const parts = d.split('-');
    if (parts.length === 3) {
      const day = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const year = parts[2];

      return `${day} ${months[monthIndex]} ${year}`;
    }
    return;
  };

  return (
    <View style={styles.container}>
      {completed ? (
        <CalendarOff />
      ) : isDarkMode ? (
        <CalendarDarkOn />
      ) : (
        <CalendarOn />
      )}

      <Text
        style={[styles.text, {color: completed ? 'gray' : activeColors.text}]}>
        {formatDate(date)}
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

export default DateFormat;
