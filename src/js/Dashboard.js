import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Modal,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Clock from './Clock';
import Axios from 'axios';
import Plus from '../assets/plus.svg';
import Trash from '../assets/trash.svg';
import Camera from '../assets/camerauser.svg';
import ToDo from './ToDo';
import AddToDo from './AddToDo';
import * as Progress from 'react-native-progress';
import AddPhoto from './AddPhoto';
import {BASE_API} from './API';

const Dashboard = ({route}) => {
  const [todos, setTodos] = useState([]);
  const [showAddToDo, setShowAddToDo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userImageUri, setUserImageUri] = useState('');

  const {email} = route.params;

  const onBackPress = useCallback(() => {
    if (isDeleteMode) {
      setIsDeleteMode(false);
      return true;
    }

    return false;
  }, [isDeleteMode]);

  useEffect(() => {
    getNameHandler();
    if (name) {
      getData();
    }

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [onBackPress, name]);

  const getData = async () => {
    try {
      await Axios.get(`${BASE_API}/gettodo/${name}`).then(res => {
        setTodos(res.data.data);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const toggleShowAddToDo = () => setShowAddToDo(prev => !prev);

  const handleEdit = id => setEditingId(id);

  const handleSave = async (id, updatedText) => {
    const data = {
      todo: updatedText,
      completed: todos.find(todo => todo.id === id)?.completed || false,
    };

    try {
      await Axios.put(`${BASE_API}/updatetodo/${id}`, data);
      getData();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };

  const deleteCheckedHandler = async () => {
    if (checkedIds.length > 0) {
      try {
        await Promise.all(
          checkedIds.map(id => Axios.delete(`${BASE_API}/deletetodo/${id}`)),
        );
        getData();
        setIsDeleteMode(false);
        setCheckedIds([]);
      } catch (error) {
        console.error('Error deleting todos: ', error);
      }
    }
  };

  const renderItem = ({item}) => (
    <ToDo
      list={item} //v
      onGet={getData} //v
      onEdit={handleEdit}
      onSave={handleSave}
      isEditing={editingId === item.id}
      isDeleteMode={isDeleteMode}
      onActivateDeleteMode={() => setIsDeleteMode(true)}
      checkedIds={checkedIds} //v
      setCheckedIds={setCheckedIds}
    />
  );

  const getNameHandler = async () => {
    try {
      const res = await Axios.get(`${BASE_API}/getusername/${email}`);
      const [user] = res.data.data;
      setName(user.name);
    } catch (err) {
      console.error('Error fetching name:', err);
    }
  };

  const handleCameraClick = () => {
    setModalVisible(true);
  };

  // const getPhotoUser = () => {
  //   Axios.get(
  //     `https://to-do-list-app-back-end.vercel.app/todo/getphoto/${name}`,
  //   ).then(res => {
  //     console.log(res);
  //     setUserImageUri(res.imageurl);
  //   });
  // };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <AddPhoto
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          setUserImageUri={setUserImageUri}
        />
      </Modal>

      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent'}
      />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.CircleSnail thickness={8} size={100} color={'#50C2C9'} />
        </View>
      ) : (
        <KeyboardAvoidingView behavior="position">
          <ImageBackground
            source={require('../assets/bgdashboard.png')}
            style={styles.background}>
            <View style={styles.welcomeWrapping}>
              <View>
                <Image
                  source={
                    userImageUri
                      ? {uri: userImageUri}
                      : require('../assets/user.png')
                  }
                  style={styles.userImage}
                />

                <TouchableOpacity
                  onPress={handleCameraClick}
                  style={{position: 'absolute', right: 30, top: 70, left: 80}}>
                  <Camera height={35} width={35} />
                </TouchableOpacity>
              </View>
              <Text style={styles.welcomeText}>Welcome {name}!</Text>
            </View>
          </ImageBackground>

          <View>
            <Text style={styles.greetingText}>Good Morning</Text>
            <Clock />
            <Text style={styles.taskListText}>Tasks List</Text>

            <View style={styles.toDoContainer}>
              <View style={styles.dailyTaskWrapping}>
                <Text style={styles.dailyTaskText}>
                  {isDeleteMode ? 'Choose Item' : 'Daily Tasks'}
                </Text>

                <TouchableOpacity
                  style={styles.plusWrapping}
                  onPress={
                    isDeleteMode ? deleteCheckedHandler : toggleShowAddToDo
                  }>
                  {isDeleteMode ? (
                    <Trash width={28} height={28} />
                  ) : (
                    <Plus width={29} height={28} />
                  )}
                </TouchableOpacity>
              </View>

              <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={styles.toDo}
                ListHeaderComponent={
                  showAddToDo ? (
                    <AddToDo
                      onGet={getData}
                      onClose={toggleShowAddToDo}
                      name={name}
                    />
                  ) : null
                }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: 360,
    height: 230,
  },
  welcomeWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('9%'),
  },
  userImage: {
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  welcomeText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 'bold',
    marginTop: hp('1%'),
  },
  greetingText: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: wp('5%'),
    marginTop: hp('1%'),
  },
  taskListText: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: hp('1%'),
    marginLeft: wp('7%'),
  },
  toDoContainer: {
    backgroundColor: '#ECECEC',
    width: 306,
    height: 290,
    borderRadius: 8,
    marginTop: hp('1%'),
    marginHorizontal: wp('8%'),
  },
  dailyTaskWrapping: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dailyTaskText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
  },
  plusWrapping: {
    marginRight: wp('5%'),
    marginTop: hp('1%'),
    alignSelf: 'center',
  },
  toDo: {
    marginLeft: wp('10%'),
    marginBottom: hp('1%'),
    marginTop: hp('0.7%'),
  },
});

export default Dashboard;
