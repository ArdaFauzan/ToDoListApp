import React, {useContext, useState, useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, Text, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Calendar from '../../assets/calendarOn.svg';
import CalendarDark from '../../assets/calendarDarkOn.svg';
import {ThemeContext} from '../Context/ThemeContext';
import {colors} from '../config/theme';

const DateInput = ({date, setDate}) => {
  const {theme} = useContext(ThemeContext);
  const isDarkMode = theme.mode === 'dark';
  let activeColors = colors[theme.mode];
  const [showPicker, setShowPicker] = useState(false);

  // Fungsi untuk menampilkan date picker
  const showDatePicker = () => setShowPicker(true);

  // Fungsi yang dipanggil saat tanggal di DatePicker berubah
  const onChange = (event, selectedValue) => {
    setShowPicker(false); // Tutup picker setelah memilih

    if (selectedValue && event.type !== 'dismissed') {
      // Buat Date object baru dengan nilai yang dipilih untuk menghindari timezone issues
      const newDate = new Date(
        selectedValue.getFullYear(),
        selectedValue.getMonth(),
        selectedValue.getDate(),
      );

      setDate(newDate);
    }
  };

  // Fungsi untuk memformat tanggal untuk ditampilkan
  const formatDateForDisplay = d => {
    // Jika `d` bukan objek Date yang valid atau NaN, tampilkan "Select"
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return ': Select';
    }

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

    // Gunakan getDate(), getMonth(), getFullYear() untuk konsistensi
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inputButton} onPress={showDatePicker}>
        {isDarkMode ? (
          <CalendarDark height={20} width={20} />
        ) : (
          <Calendar height={20} width={20} />
        )}
        <Text style={[styles.text, {color: activeColors.text}]}>
          {formatDateForDisplay(date)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          // Jika date object valid Date(), gunakan date, jika tidak, gunakan Date()
          value={
            date instanceof Date && !isNaN(date.getTime()) ? date : new Date()
          }
          mode="date"
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
    flexDirection: 'row',
    gap: wp('1%'),
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default DateInput;
