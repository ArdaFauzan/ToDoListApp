import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Vibration,
} from 'react-native';
import BoxFull from '../../assets/box_full.png';
import Box from '../../assets/box.png';
import Axios from 'axios';
import Check from '../../assets/check.svg';
import Close from '../../assets/close.svg';
import CheckBox from '@react-native-community/checkbox';
import {BASE_API} from '@env';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateInput from '../date/DateInput';
import DateFormat from '../date/DateFormat';
import TimeFormat from '../time/TimeFormat';
import TimeInput from '../time/TimeInput';

const ToDo = ({list, onGet}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

  // Format date string menjadi Date object
  const parseDateString = dateString => {
    if (!dateString || typeof dateString !== 'string') {
      return new Date();
    }
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // Perhatikan urutan: YYYY, MM-1, DD
      return new Date(
        parseInt(parts[2]),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0]),
      );
    }
    return new Date();
  };

  // Format time string menjadi Date object
  const parseTimeString = (timeString, baseDate = new Date()) => {
    if (!timeString || typeof timeString !== 'string') {
      return baseDate;
    }
    const parts = timeString.split(':');
    if (parts.length === 2) {
      const newDate = new Date(baseDate);
      newDate.setHours(parseInt(parts[0], 10));
      newDate.setMinutes(parseInt(parts[1], 10));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      return newDate;
    }
    return baseDate;
  };

  const [state, setState] = useState(() => {
    const initialEditDate = parseDateString(list.date);
    const initialEditTime = parseTimeString(list.time, initialEditDate);
    return {
      completed: list.completed,
      editText: list.todo,
      isEditing: false,
      date: list.date,
      time: list.time,
      editDate: initialEditDate,
      editTime: initialEditTime,
    };
  });

  useEffect(() => {
    const parsedDate = parseDateString(list.date);
    setState(prevState => ({
      ...prevState,
      completed: list.completed,
      editText: list.todo,
      editDate: parsedDate,
      editTime: parseTimeString(list.time, parsedDate),
      isEditing: false,
      date: list.date,
      time: list.time,
    }));
  }, [list.todo, list.completed, list.date, list.time]);

  const updateState = (key, value, isGlobal = false) => {
    if (isGlobal) {
      dispatch({type: key, inputValue: value});
    } else {
      setState(prevState => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  const completedHandler = () => {
    const newCompleted = !state.completed;
    updateState('completed', newCompleted);
    updateToDo(list.id, newCompleted);
  };

  const formatDateForApi = dateObj => {
    if (!(dateObj instanceof Date)) return '';
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTimeForApi = dateObj => {
    if (!(dateObj instanceof Date)) return '';
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const updateToDo = async (todo_id, completed) => {
    const data = {
      todo: state.editText,
      completed: completed,
      date: formatDateForApi(state.editDate),
      time: formatTimeForApi(state.editTime),
    };

    try {
      await Axios.put(`${BASE_API}/updatetodo/${todo_id}`, data, {
        headers: {
          Authorization: `Bearer ${globalState.token}`,
        },
      });

      onGet(globalState.user_id, globalState.token);
    } catch (error) {
      console.log('Error updating data: ', error);
    }
  };

  const handleEdit = () => {
    updateState('isEditing', true);
  };

  const handleSave = async () => {
    await updateToDo(list.id, state.completed);
  };

  const handleLongPress = () => {
    const DURATION = 100;
    Vibration.vibrate(DURATION);
    updateState('SET_DELETEMODE', true, true);
  };

  const checkBoxHandler = (id, isChecked) => {
    if (isChecked) {
      // Menambahkan ID ke checkedIds
      updateState('ADD_CHECKED_ID', id, true);
    } else {
      // Menghapus ID dari checkedIds
      updateState('REMOVE_CHECKED_ID', id, true);
    }
  };
  return (
    <View style={{marginBottom: hp('2%')}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={completedHandler}>
          <Image
            source={state.completed ? BoxFull : Box}
            style={styles.completedImage}
          />
        </TouchableOpacity>

        {state.isEditing ? (
          <>
            <View style={styles.containerIsEditing}>
              <View style={{}}>
                <TextInput
                  value={state.editText}
                  onChangeText={value => updateState('editText', value)}
                  style={[styles.toDoTextInput, {color: activeColors.text}]}
                  onSubmitEditing={handleSave}
                  multiline
                />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: wp('1.5%'),
                    gap: wp('5%'),
                  }}>
                  <DateInput
                    date={state.editDate}
                    setDate={value => updateState('editDate', value)}
                  />
                  <TimeInput
                    time={state.editTime}
                    setTime={value => updateState('editTime', value)}
                  />
                </View>
              </View>

              <View style={styles.wrappingHandlerEdit}>
                <TouchableOpacity onPress={handleSave}>
                  <Check height={20} width={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => updateState('isEditing', false)}
                  style={styles.close}>
                  <Close height={20} width={20} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.toDoListWrapping}>
            <TouchableOpacity
              onPress={handleEdit}
              onLongPress={handleLongPress}>
              <Text
                style={[
                  styles.toDoList,
                  {
                    color: state.completed ? 'gray' : activeColors.text,
                    textDecorationLine: state.completed
                      ? 'line-through'
                      : 'none',
                  },
                ]}>
                {list.todo}
              </Text>
            </TouchableOpacity>

            {globalState.isDeleteMode && (
              <View style={styles.checkBoxWrapping}>
                <CheckBox
                  value={globalState.checkedIds.includes(list.id)}
                  onValueChange={newValue => checkBoxHandler(list.id, newValue)}
                  tintColors={('#787878', '#494949')}
                  style={styles.checkBox}
                />
              </View>
            )}
          </View>
        )}
      </View>
      {!state.isEditing && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: wp('7%'),
            gap: wp('5%'),
          }}>
          <DateFormat date={list.date} completed={state.completed} />
          <TimeFormat time={list.time} completed={state.completed} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedImage: {
    height: 17,
    width: 17,
    marginRight: 10,
  },
  containerIsEditing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toDoTextInput: {
    height: 'auto',
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingLeft: 6,
    marginRight: wp('20%'),
    width: 155,
  },
  wrappingHandlerEdit: {
    position: 'absolute',
    right: 0,
    top: 12,
    flexDirection: 'row',
  },
  close: {
    marginLeft: wp('4%'),
  },
  toDoListWrapping: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('8%'),
    justifyContent: 'space-between',
    flex: 1,
  },
  toDoList: {
    fontSize: 15,
    fontWeight: '400',
    paddingRight: 50,
  },
  checkBoxWrapping: {
    position: 'absolute',
    left: 250,
    justifyContent: 'center',
  },
  checkBox: {
    position: 'absolute',
    right: 40,
  },
});

export default ToDo;
