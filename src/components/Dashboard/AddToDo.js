import React, {useContext, useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import Axios from 'axios';
import Check from '../../assets/check.svg';
import Close from '../../assets/close.svg';
import {BASE_API} from '@env';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TimeInput from '../time/TimeInput';
import DateInput from '../date/DateInput';

const AddToDo = ({onGet, onClose}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const globalState = useSelector(state => state.DashboardReducer);
  const [newToDo, setNewToDo] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const postData = async () => {
    if (!newToDo || !date || !time) {
      Alert.alert('Warning!', 'Fill out all fields!');
    }

    const completed = 0;
    const data = {
      todo: newToDo,
      completed,
      date: date
        ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        : null,
      time: time
        ? `${String(time.getHours()).padStart(2, '0')}:${String(
            time.getMinutes(),
          ).padStart(2, '0')}`
        : null,
    };

    try {
      await Axios.post(`${BASE_API}/createtodo/${globalState.user_id}`, data, {
        headers: {
          Authorization: `Bearer ${globalState.token}`,
        },
      });
      setNewToDo('');
      onGet(globalState.user_id, globalState.token);
    } catch (error) {
      console.error('Error posting data: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={[styles.toDoTextInput, {color: activeColors.text}]}
          placeholder="Add new todo"
          placeholderTextColor={activeColors.text}
          onChangeText={text => setNewToDo(text)}
          value={newToDo}
          multiline
          onSubmitEditing={postData}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: wp('7.5%'),
            gap: wp('5%'),
          }}>
          <DateInput date={date} setDate={setDate} />
          <TimeInput time={time} setTime={setTime} />
        </View>
      </View>

      <View style={styles.wrappingHandlerAdd}>
        <TouchableOpacity onPress={postData}>
          <Check height={20} width={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={styles.close}>
          <Close height={20} width={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  toDoTextInput: {
    height: 'auto',
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingLeft: 4,
    marginLeft: wp('7%'),
    width: 160,
  },
  wrappingHandlerAdd: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
  },
  close: {
    marginLeft: wp('4%'),
  },
});

export default AddToDo;
