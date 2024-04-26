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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Fixing UI : https://stackoverflow.com/questions/65109669/how-to-make-a-react-native-app-suitable-for-all-dimensions
/*
Trashnya belum muncul
Cara buat klik trash terus ngapus
*/
const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [showAddToDo, setShowAddToDo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null)
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
    setShowAddToDo(!showAddToDo);
  };

  // const toggleDeleteMode = () => {
  //   setIsDeleteMode(!isDeleteMode);
  // };

  const handleEdit = id => {
    setEditingId(id);
  };

  const handleDelete = id => {
    setDeleteId(id);
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

  const handleIconPress = () => {
    if (isDeleteMode) {
      setIsDeleteMode(!isDeleteMode); // Exit delete mode
    } else {
      setShowAddToDo(!showAddToDo); // Toggle the Add ToDo form
    }
  };

  const renderItem = ({item}) => (
    <ToDo
      list={item}
      onGet={getData}
      onEdit={handleEdit}
      onSave={handleSave}
      isEditing={editingId === item.id}
      onDelete={handleDelete}
      isDelete={deleteId === item.id}
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
                {isDeleteMode ? 'Pilih Item' : 'Daily Tasks'}
              </Text>

              <TouchableOpacity
                onPress={handleIconPress}
                style={styles.plusWrapping}>
                {isDeleteMode ? (
                  <Trash width={25} height={25} />
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
    marginTop: hp('2%'),
  },
  userImage: {
    height: 110,
    width: 110,
    borderRadius: 55,
    marginTop: hp('12%'),
  },
  welcomeText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 'bold',
    marginTop: hp('1%'),
  },
  greetingTextWrapping: {
    alignSelf: 'flex-end',
    marginTop: hp('2%'),
    marginRight: wp('3%'),
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
    marginTop: hp('1%'),
    marginLeft: wp('4%'),
  },
  toDoContainer: {
    backgroundColor: '#ECECEC',
    width: 303,
    height: 270,
    borderRadius: 8,
    marginTop: hp('0.1%'),
    marginHorizontal: wp('7%'),
  },
  dailyTaskWrapping: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: wp('4%'),
    marginTop: hp('1%'),
  },
  dailyTaskText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
  },
  plusWrapping: {
    marginRight: wp('4%'),
    marginTop: hp('1%'),
  },
  toDoWrapping: {
    marginLeft: wp('10%'),
    marginTop: hp('0.1%'),
    marginBottom: hp('6%'),
  },
});

export default Dashboard;
