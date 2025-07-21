import React, {useContext, useState, useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, Text, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Clock from '../../assets/clockOn.svg';
import ClockDark from '../../assets/clockDarkOn.svg';
import {ThemeContext} from '../Context/ThemeContext';
import {colors} from '../config/theme';

const TimeInput = ({time, setTime}) => {
  const {theme} = useContext(ThemeContext);
  const isDarkMode = theme.mode === 'dark';
  let activeColors = colors[theme.mode];
  const [showPicker, setShowPicker] = useState(false);

  const showTimePicker = () => setShowPicker(true);

  const formatTimeForDisplay = d => {
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return ': Select';
    }
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onChange = (event, selectedValue) => {
    setShowPicker(false);

    if (selectedValue) {
      setTime(selectedValue);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inputButton} onPress={showTimePicker}>
        {isDarkMode ? <ClockDark /> : <Clock />}
        <Text style={[styles.text, {color: activeColors.text}]}>
          {formatTimeForDisplay(time)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="timePicker"
          value={
            time instanceof Date && !isNaN(time.getTime()) ? time : new Date()
          }
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: hp(10),
  },
  inputButton: {
    marginTop: hp('1%'),
    flexDirection: 'row',
    gap: wp('1%'),
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default TimeInput;
