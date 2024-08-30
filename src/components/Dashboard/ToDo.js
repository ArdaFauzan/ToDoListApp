import React, {useContext, useState} from 'react';
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

const ToDo = ({list, onGet}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    completed: list.completed,
    editText: list.todo,
    isEditing: false,
  });

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

  const updateToDo = async (todo_id, completed) => {
    const data = {
      todo: state.editText,
      completed: completed,
    };
    try {
      await Axios.put(`${BASE_API}/updatetodo/${todo_id}`, data, {
        headers: {
          Authorization: `Bearer ${globalState.token}`,
        },
      });
      onGet(globalState.user_id, globalState.token);
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };

  const handleEdit = () => {
    updateState('isEditing', true);
  };

  const handleSave = async () => {
    updateState('isEditing', false);
    updateToDo(list.id, state.completed);
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
            <TextInput
              value={state.editText}
              onChangeText={value => updateState('editText', value)}
              style={[styles.toDoTextInput, {color: activeColors.text}]}
              onSubmitEditing={handleSave}
              multiline
            />

            <View style={styles.wrappingHandlerEdit}>
              <TouchableOpacity onPress={() => handleSave(list.id)}>
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
          <TouchableOpacity onPress={handleEdit} onLongPress={handleLongPress}>
            <Text
              style={[
                styles.toDoList,
                {
                  color: state.completed ? 'gray' : activeColors.text,
                  textDecorationLine: state.completed ? 'line-through' : 'none',
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedImage: {
    height: 24,
    width: 24,
    marginRight: 15,
  },
  containerIsEditing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toDoTextInput: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingRight: 2,
    paddingLeft: 6,
    marginRight: wp('20%'),
    width: '54%',
  },
  wrappingHandlerEdit: {
    position: 'absolute',
    right: 35,
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
    fontSize: 14,
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
