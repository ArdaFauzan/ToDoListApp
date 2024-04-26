import React, {useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import {deviceHeight, deviceWidth} from './Dimension';
import Clock from './Clock';
import Axios from 'axios';
import ToDo from './ToDo';
import Plus from '../assets/plus.svg';
import AddToDo from './AddToDo';
import Trash from '../assets/trash.svg';

//Fixing UI : https://stackoverflow.com/questions/65109669/how-to-make-a-react-native-app-suitable-for-all-dimensions

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [showAddToDo, setShowAddToDo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Axios.get('https://to-do-list-app-back-end.vercel.app/todo')
      .then(res => {
        setTodos(res.data.data);
      })
      .catch(error => console.error('Error fetching data: ', error));
  };

  const toggleShowAddToDo = () => {
    setShowAddToDo(prevState => !prevState);
  };

  const handleEdit = id => {
    setEditingId(id);
  };

  const handleDelete = id => {
    setDeletedId(id);
  };

  const handleDeleteMode = () => {
    setIsDeleteMode(true);
  };

  const handleSave = (id, updatedText) => {
    const data = {
      todo: updatedText,
      completed: todos.find(todo => todo.id === id).completed,
    };

    Axios.put(`https://to-do-list-app-back-end.vercel.app/todo/${id}`, data)
      .then(() => {
        getData();
        setEditingId(null);
      })
      .catch(error => console.error('Error updating data: ', error));
  };

  const deleteToDo = id => {
    Axios.delete(`https://to-do-list-app-back-end.vercel.app/todo/${id}`)
      .then(() => {
        getData();
        setDeletedId(null);
      })
      .catch(error => console.error('Error deleting data: ', error));
  };

  const renderItem = ({item}) => (
    <ToDo
      list={item}
      onGet={getData}
      onEdit={handleEdit}
      onSave={handleSave}
      isEditing={editingId === item.id}
      onChecked={handleChecked}
      onDelete={handleDelete}
      isChecked={isSelectMode}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView nestedScrollEnabled contentContainerStyle={{flexGrow: 1}}>
        <StatusBar
          translucent
          barStyle={'dark-content'}
          backgroundColor={'transparent'}
        />
        <ImageBackground
          source={require('../assets/bgdashboard.png')}
          style={styles.background}>
          <View style={styles.welcomeWrapping}>
            <Image
              source={require('../assets/photo.jpeg')}
              style={styles.userImage}
            />
            <Text style={styles.welcomeText}>Welcome Arda!</Text>
          </View>

          <View style={styles.greetingTextWrapping}>
            <Text style={styles.greetingText}>Good Morning</Text>
          </View>

          <View>
            <Clock />
            <Text style={styles.tasksListText}>Tasks List</Text>
          </View>

          <View style={styles.toDoContainer}>
            <View style={styles.dailyTaskWrapping}>
              <Text style={styles.dailyTaskText}>
                {isSelectMode ? 'Pilih Item' : 'Daily Tasks'}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  isSelectMode ? setIsSelectMode(false) : setShowAddToDo(true)
                }>
                {isSelectMode ? (
                  <Trash width={25} height={21} />
                ) : (
                  <Plus width={25} height={21} />
                )}
              </TouchableOpacity>
            </View>

            <View>
              <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={styles.toDoWrapping}
                nestedScrollEnabled
                ListHeaderComponent={
                  showAddToDo ? (
                    <AddToDo onGet={getData} onClose={toggleShowAddToDo} />
                  ) : null
                }
              />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: deviceWidth,
    height: deviceHeight,
  },
  welcomeWrapping: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: (deviceHeight / 3) * 0.09,
  },
  userImage: {
    height: 110,
    width: 110,
    borderRadius: 55,
    marginTop: (deviceHeight / 2) * 0.2,
  },
  welcomeText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 'bold',
    marginTop: (deviceHeight / 3) * 0.05,
  },
  greetingTextWrapping: {
    alignSelf: 'flex-end',
    marginTop: (deviceHeight / 2) * 0.05,
    marginRight: (deviceWidth / 2) * 0.1,
  },
  greetingText: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: 'bold',
  },
  tasksListText: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: (deviceHeight / 2) * 0.03,
    marginLeft: (deviceWidth / 2) * 0.1,
  },
  toDoContainer: {
    backgroundColor: '#ECECEC',
    width: 303,
    height: 270,
    borderRadius: 8,
    marginTop: (deviceHeight / 2) * 0.01,
    marginHorizontal: (deviceWidth / 2) * 0.2,
  },
  dailyTaskWrapping: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: (deviceWidth / 2) * 0.1,
    marginTop: (deviceHeight / 2) * 0.02,
  },
  dailyTaskText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
  },
  plusWrapping: {
    marginRight: (deviceWidth / 2) * 0.1,
    marginTop: (deviceHeight / 3) * 0.01,
  },
  toDoWrapping: {
    marginLeft: (deviceWidth / 2) * 0.2,
    marginTop: (deviceHeight / 3) * 0.01,
    marginBottom: (deviceHeight / 4) * 0.2,
  },
});

export default Dashboard;
