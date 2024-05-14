import React, {useState} from 'react';
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
import {BASE_API} from '../Utils/API';
import {useDispatch, useSelector} from 'react-redux';

const ToDo = ({list, onGet}) => {
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

  const updateToDo = async (id, completed) => {
    const data = {
      todo: state.editText,
      completed: completed,
    };
    try {
      await Axios.put(`${BASE_API}/updatetodo/${id}`, data);
      onGet();
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

  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

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
              style={styles.toDoTextInput}
              onSubmitEditing={handleSave}
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
                  color: state.completed ? 'gray' : '#000000',
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
    marginBottom: 19,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedImage: {
    height: 24,
    width: 24,
    marginRight: 15,
  },
  toDoTextInput: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingRight: 2,
    color: '#000000',
    paddingLeft: 6,
    marginRight: 100,
    width: '50%',
  },
  containerIsEditing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrappingHandlerEdit: {
    position: 'absolute',
    right: 30,
    flexDirection: 'row',
  },
  close: {
    marginLeft: 20,
  },
  toDoListWrapping: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toDoList: {
    fontSize: 14,
    fontWeight: '400',
  },
  checkBoxWrapping: {
    position: 'absolute',
    right: 10,
    left: 190,
    bottom: 26,
  },
  checkBox: {
    position: 'absolute',
    right: 10,
  },
});

export default ToDo;
