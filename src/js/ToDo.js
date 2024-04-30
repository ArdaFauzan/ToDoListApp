import React, {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import BoxFull from '../assets/box_full.png';
import Box from '../assets/box.png';
import Axios from 'axios';
import Check from '../assets/check.svg';
import Close from '../assets/close.svg';
import CheckBox from '@react-native-community/checkbox';

const ToDo = ({
  list,
  onGet,
  onEdit,
  onSave,
  isEditing,
  isDeleteMode,
  onActivateDeleteMode,
  checkedIds,
  setCheckedIds,
}) => {
  const [completed, setCompleted] = useState(list.completed);
  const [editText, setEditText] = useState(list.todo);

  const putCompleted = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    updateTodo(newCompleted);
  };

  const updateTodo = newCompleted => {
    const data = {
      todo: editText,
      completed: newCompleted,
    };

    Axios.put(
      `https://to-do-list-app-back-end.vercel.app/todo/${list.id}`,
      data,
    ).then(() => {
      onGet();
    });
  };

  const handleLongPress = () => {
    onActivateDeleteMode();
  };

  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      setCheckedIds(prevIds => [...prevIds, id]);
    } else {
      setCheckedIds(prevIds => prevIds.filter(checkedId => checkedId !== id));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={putCompleted}>
        <Image
          source={completed ? BoxFull : Box}
          style={styles.completedImage}
        />
      </TouchableOpacity>

      {isEditing ? (
        <>
          <View style={styles.containerIsEditing}>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              style={styles.toDoTextInput}
            />

            <View style={styles.wrappingHandlerEdit}>
              <TouchableOpacity onPress={() => onSave(list.id, editText)}>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => onEdit(list.id)}
            onLongPress={handleLongPress}>
            <Text
              style={{
                color: completed ? 'gray' : '#000000',
                fontSize: 14,
                fontWeight: '400',
                textDecorationLine: completed ? 'line-through' : 'none',
              }}>
              {list.todo}
            </Text>
          </TouchableOpacity>

          {isDeleteMode && (
            <View
              style={{position: 'absolute', right: 10, left: 190, bottom: 26}}>
              <CheckBox
                value={checkedIds.includes(list.id)}
                onValueChange={newValue =>
                  handleCheckboxChange(list.id, newValue)
                }
                tintColors={('#787878', '#494949')}
                style={{position: 'absolute', right: 10}}
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
});

export default ToDo;
