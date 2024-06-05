import React, {useContext, useState} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import Axios from 'axios';
import Check from '../../assets/check.svg';
import Close from '../../assets/close.svg';
import {BASE_API} from '../Utils/API';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AddToDo = ({onGet, onClose}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const globalState = useSelector(state => state.DashboardReducer);
  const [newToDo, setNewToDo] = useState('');

  const postData = async () => {
    const completed = 0;
    const data = {
      todo: newToDo,
      completed,
    };

    if (newToDo) {
      try {
        await Axios.post(
          `${BASE_API}/createtodo/${globalState.user_id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${globalState.token}`,
            },
          },
        );
        setNewToDo('');
        onGet(globalState.user_id, globalState.token);
      } catch (error) {
        console.error('Error posting data: ', error);
      }
    } else {
      console.warn('Input your task!');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.toDoTextInput, {color: activeColors.text}]}
        placeholder="Add new todo"
        placeholderTextColor={activeColors.text}
        onChangeText={text => setNewToDo(text)}
        value={newToDo}
      />

      <View style={styles.wrappingHandlerAdd}>
        <TouchableOpacity onPress={() => postData()}>
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
  },
  toDoTextInput: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingRight: 2,
    paddingLeft: 6,
    marginRight: 100,
    marginLeft: 35,
    marginTop: 2,
    width: '50%',
  },
  wrappingHandlerAdd: {
    position: 'absolute',
    right: 30,
    flexDirection: 'row',
  },
  close: {
    marginLeft: 20,
  },
});

export default AddToDo;
