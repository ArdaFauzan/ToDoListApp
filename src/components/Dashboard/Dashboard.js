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
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Clock from './Clock';
import Axios from 'axios';
import Plus from '../../assets/plus.svg';
import Trash from '../../assets/trash.svg';
import Camera from '../../assets/camerauser.svg';
import ToDo from './ToDo';
import AddToDo from './AddToDo';
import * as Progress from 'react-native-progress';
import AddPhoto from './AddPhoto';
import {BASE_API} from '../Utils/API';
import {useSelector, useDispatch} from 'react-redux';
import {getDataAsync} from '../Utils/AsyncStorage';

const Dashboard = ({navigation}) => {
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    loading: true,
    showAddToDo: false,
    showModal: false,
    name: '',
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

  const onBackPress = useCallback(() => {
    if (globalState.isDeleteMode) {
      updateState('SET_DELETEMODE', false, true);
      return true;
    }

    return false;
  }, [globalState.isDeleteMode]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const user_id = await getDataAsync('user_id');
        const token = await getDataAsync('token');
        if (user_id && token) {
          await Promise.all([
            getData(user_id, token),
            getNameHandler(user_id, token),
            getUserPhoto(user_id, token),
          ]);
        } else {
          Alert.alert('Warning!', 'You are logged out, please Log In again', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SignInPage'),
            },
          ]);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert(
          'Error',
          'An error occurred while initializing the dashboard. Please try again.',
        );
      }
    };

    initializeDashboard();
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [onBackPress]);

  // const checkLoginStatus = async () => {
  //   const user_id = await getDataAsync('user_id');
  //   const token = await getDataAsync('token');
  //   try {
  //     if (user_id && token) {
  //       getData();
  //       getNameHandler(user_id, token);
  //       getUserPhoto(user_id, token);
  //     } else {
  //       Alert.alert('Warning!', 'You are logged out, please Log In again', [
  //         {
  //           text: 'OK',
  //           onPress: () => navigation.navigate('SignInPage'),
  //         },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.error('Error checking login status:', error);
  //   }
  // };

  const getData = async () => {
    const user_id = await getDataAsync('user_id');
    const token = await getDataAsync('token');

    try {
      const res = await Axios.get(`${BASE_API}/gettodo/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      updateState('SET_TODOS', res.data.data, true);
      updateState('loading', false);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const toggleShowAddToDo = () =>
    updateState('showAddToDo', !state.showAddToDo);

  const deleteCheckedHandler = async () => {
    const token = await getDataAsync('token');

    if (globalState.checkedIds.length > 0) {
      try {
        await Promise.all(
          globalState.checkedIds.map(id =>
            Axios.delete(`${BASE_API}/deletetodo/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ),
        );
        await getData();
        updateState('CLEAR_CHECKED_IDS', [], true);
      } catch (error) {
        console.error('Error deleting todos: ', error);
      }
    }
  };

  const renderItem = ({item}) => (
    <ToDo key={item.id} list={item} onGet={getData} />
  );

  const getNameHandler = async (user_id, token) => {
    try {
      const res = await Axios.get(`${BASE_API}/getusername/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const [user] = res.data.data;
      updateState('name', user.name);
    } catch (err) {
      console.error('Error fetching name:', err);
    }
  };

  const handleCameraClick = () => {
    updateState('showModal', true);
  };

  const getUserPhoto = async (user_id, token) => {
    try {
      const res = await Axios.get(`${BASE_API}/getphoto/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.url[0];
      updateState('SET_IMAGE_URI', user.imageurl, true);
    } catch (error) {
      console.error('Error fetching photo: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={state.showModal}
        onRequestClose={() => updateState('showModal', false)}>
        <AddPhoto
          isVisible={state.showModal}
          onClose={() => updateState('showModal', false)}
        />
      </Modal>

      <StatusBar
        translucent
        barStyle={'dark-content'}
        backgroundColor={state.showModal ? 'rgba(0, 0, 0, 0.5)' : 'transparent'}
      />

      {state.loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.CircleSnail thickness={8} size={100} color={'#50C2C9'} />
        </View>
      ) : (
        <KeyboardAvoidingView behavior="position">
          <ImageBackground
            source={require('../../assets/bgdashboard.png')}
            style={styles.background}>
            <View style={styles.welcomeWrapping}>
              <View>
                <Image
                  source={
                    globalState.imageUri
                      ? {uri: globalState.imageUri}
                      : require('../../assets/user.png')
                  }
                  style={styles.userImage}
                />

                <TouchableOpacity
                  onPress={handleCameraClick}
                  style={{position: 'absolute', right: 30, top: 70, left: 80}}>
                  <Camera height={35} width={35} />
                </TouchableOpacity>
              </View>
              <Text style={styles.welcomeText}>Welcome {state.name}!</Text>
            </View>
          </ImageBackground>

          <View>
            <Text style={styles.greetingText}>Good Morning</Text>
            <Clock />
            <Text style={styles.taskListText}>Tasks List</Text>

            <View style={styles.toDoContainer}>
              <View style={styles.dailyTaskWrapping}>
                <Text style={styles.dailyTaskText}>
                  {globalState.isDeleteMode ? 'Choose Item' : 'Daily Tasks'}
                </Text>

                <TouchableOpacity
                  style={styles.plusWrapping}
                  onPress={
                    globalState.isDeleteMode
                      ? deleteCheckedHandler
                      : toggleShowAddToDo
                  }>
                  {globalState.isDeleteMode ? (
                    <Trash width={28} height={28} />
                  ) : (
                    <Plus width={29} height={28} />
                  )}
                </TouchableOpacity>
              </View>

              <FlatList
                data={globalState.todos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={styles.toDo}
                ListHeaderComponent={
                  state.showAddToDo ? (
                    <AddToDo onGet={getData} onClose={toggleShowAddToDo} />
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
