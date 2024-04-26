import React, {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Pressable,
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
  onChecked,
  onDelete,
  isChecked,
}) => {
  const [completed, setCompleted] = useState(list.completed);
  const [editText, setEditText] = useState(list.todo);
  const [checked, setChecked] = useState(false);

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
          <Pressable
            onPress={() => onEdit(list.id)}
            onLongPress={() => onChecked(list.id)}>
            <Text
              style={{
                color: completed ? 'gray' : '#000000',
                fontSize: 14,
                fontWeight: '400',
                textDecorationLine: completed ? 'line-through' : 'none',
              }}>
              {list.todo}
            </Text>
          </Pressable>

          <View style={{position: 'absolute', right: 10, left: 160}}>
            <CheckBox
              value={checked}
              onValueChange={newValue => setChecked(newValue)}
              tintColors={{true: '#787878', false: '#494949'}}
            />
          </View>
        </View>
      )}

      {isChecked && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable onLongPress={() => onChecked(list.id)}>
            <Text
              style={{
                color: completed ? 'gray' : '#000000',
                fontSize: 14,
                fontWeight: '400',
                textDecorationLine: completed ? 'line-through' : 'none',
              }}>
              {list.todo}
            </Text>
          </Pressable>

          <CheckBox
            value={checked}
            onValueChange={newValue => {
              setChecked(newValue);
              if (newValue) {
                onDelete(list.id);
              }
            }}
            tintColors={{true: '#787878', false: '#494949'}}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
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
