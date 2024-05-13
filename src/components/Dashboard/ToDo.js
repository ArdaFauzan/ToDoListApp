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

const ToDo = ({
  onGet,
  onEdit,
  onSave,
  isEditing,
  isDeleteMode,
  onActivateDeleteMode,
  checkedIds,
  setCheckedIds,
}) => {
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();
  const list = globalState.todos;
  const [state, setState] = useState({
    completed: list.completed,
    editText: list.todo,
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

    updateCompleted(list.id);
  };

  const updateCompleted = async id => {
    const data = {
      todo: list.todo,
      completed: state.completed,
    };
    try {
      await Axios.put(`${BASE_API}/updatetodo/${id}`, data);
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };

  const handleLongPress = () => {
    const DURATION = 100;
    Vibration.vibrate(DURATION);
    onActivateDeleteMode();
  };

  const checkBoxHandler = (id, isChecked) => {
    if (isChecked) {
      setCheckedIds(prevIds => [...prevIds, id]);
    } else {
      setCheckedIds(prevIds => prevIds.filter(checkedId => checkedId !== id));
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

      {isEditing ? (
        <>
          <View style={styles.containerIsEditing}>
            <TextInput
              value={state.editText}
              onChangeText={value => updateState('setEditText', value)}
              style={styles.toDoTextInput}
            />

            <View style={styles.wrappingHandlerEdit}>
              <TouchableOpacity onPress={() => onSave(list.id, state.editText)}>
                <Check height={20} width={20} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onEdit(null)}
                style={styles.close}>
                <Close height={20} width={20} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.toDoListWrapping}>
          <TouchableOpacity
            onPress={() => onEdit(list.id)}
            onLongPress={handleLongPress}>
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

          {isDeleteMode && (
            <View style={styles.checkBoxWrapping}>
              <CheckBox
                value={checkedIds.includes(list.id)}
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
