import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddPhoto from './AddPhoto';
import ToDo from './ToDo';
import Axios from 'axios';
import {BASE_API} from '@env';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import {getDataAsync} from '../Utils/AsyncStorage';
import Toast from 'react-native-root-toast';
import LoginToast from '../Toast/LoginToast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Clock from '../Utils/Clock';
import DrawerMenu from '../../assets/drawer.svg';
import Camera from '../../assets/camerauser.svg';
import Trash from '../../assets/trash.svg';
import DarkTrash from '../../assets/trashdark.svg';
import Plus from '../../assets/plus.svg';
import AddToDo from './AddToDo';

const Dashboard2 = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    showAddToDo: false,
    showModal: false,
    userName: '',
    greeting: '',
    showExitAlert: false,
    backPressedOnce: false,
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

    if (state.backPressedOnce) {
      BackHandler.exitApp();
      return true;
    } else {
      updateState('backPressedOnce', true);
      showCustomToast();
      setTimeout(() => {
        updateState('backPressedOnce', false);
      }, 2000);
      return true;
    }
  }, [state.backPressedOnce, globalState.isDeleteMode]);

  useEffect(() => {
    initializeDashboard();
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [onBackPress]);

  const initializeDashboard = async () => {
    try {
      const getName = await getDataAsync('name');

      await Promise.all([
        updateState('userName', getName),
        getData(globalState.user_id, globalState.token),
        getUserPhoto(globalState.user_id, globalState.token),
        setGreetingMessage(),
      ]);
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert(
        'Error',
        'An error occurred while initializing the dashboard. Please try again.',
      );
    }
  };

  const showCustomToast = () => {
    const toast = Toast.show(
      <LoginToast message="Press again to close the app" />,
      {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        containerStyle: {
          backgroundColor: '#50C2C9',
          borderRadius: 30,
          width: 250,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        },
        shadowStyle: {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.8,
          shadowRadius: 2,
        },
      },
    );

    setTimeout(() => {
      Toast.hide(toast);
    }, 1000); // Duration in milliseconds (3.5 seconds)
  };

  const setGreetingMessage = () => {
    const currentHour = new Date().getHours();
    let greeting = 'Good Night';

    if (currentHour >= 6 && currentHour < 12) {
      greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      greeting = 'Good Afternoon';
    } else if (currentHour >= 18 && currentHour < 21) {
      greeting = 'Good Evening';
    }

    updateState('greeting', greeting);
  };

  const getData = async (user_id, token) => {
    try {
      const res = await Axios.get(`${BASE_API}/gettodo/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      updateState('SET_TODOS', res.data.data, true);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const toggleShowAddToDo = () =>
    updateState('showAddToDo', !state.showAddToDo);

  const deleteCheckedHandler = async () => {
    if (globalState.checkedIds.length > 0) {
      try {
        await Promise.all(
          globalState.checkedIds.map(id =>
            Axios.delete(`${BASE_API}/deletetodo/${id}`, {
              headers: {
                Authorization: `Bearer ${globalState.token}`,
              },
            }),
          ),
        );
        await getData(globalState.user_id, globalState.token);
        updateState('CLEAR_CHECKED_IDS', [], true);
      } catch (error) {
        console.error('Error deleting todos: ', error);
      }
    }
  };

  const renderItem = ({item}) => (
    <ToDo key={item.id} list={item} onGet={getData} />
  );

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
      const user = res.data.url;
      updateState('SET_IMAGE_URI', user, true);
    } catch (error) {
      updateState('SET_IMAGE_URI', error.response.data.url, true);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeColors.primary,
        },
      ]}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'light' ? 'dark-content' : activeColors.text}
        backgroundColor={'transparent'}
      />

      <KeyboardAvoidingView behavior="position">
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

        <ImageBackground
          source={
            theme.mode === 'dark'
              ? require('../../assets/bgdashboarddark.png')
              : require('../../assets/bgdashboard.png')
          }
          style={styles.background}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawer}>
            <DrawerMenu height={43} width={39} />
          </TouchableOpacity>

          <View style={styles.userWrapping}>
            <View style={styles.userImageWrapping}>
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
                style={styles.camera}>
                <Camera height={32} width={32} />
              </TouchableOpacity>
            </View>

            <Text style={styles.welcomeText}>Welcome {state.userName}!</Text>
          </View>
        </ImageBackground>

        <Clock />
        <Text style={[styles.greetingText, {color: activeColors.text}]}>
          {state.greeting}
        </Text>

        <View
          style={[
            styles.toDoWrapping,
            {backgroundColor: activeColors.secondary},
          ]}>
          <View style={styles.toDoHeader}>
            <Text style={[styles.toDoText, {color: activeColors.text}]}>
              {globalState.isDeleteMode ? 'Choose Item' : 'Tasks List'}
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={
                globalState.isDeleteMode
                  ? deleteCheckedHandler
                  : toggleShowAddToDo
              }>
              {globalState.isDeleteMode ? (
                theme.mode === 'light' ? (
                  <Trash width={28} height={28} />
                ) : (
                  <DarkTrash width={28} height={28} />
                )
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
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: 220,
  },
  drawer: {
    marginTop: hp('3%'),
    marginLeft: wp('8%'),
  },
  userWrapping: {
    alignItems: 'center',
  },
  userImageWrapping: {
    position: 'relative',
  },
  userImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  camera: {
    position: 'absolute',
    left: 90,
    bottom: 10,
    right: 0,
  },
  welcomeText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 'bold',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: hp('1%'),
    marginLeft: wp('3%'),
    textAlign: 'center',
  },
  toDoWrapping: {
    alignSelf: 'center',
    width: '90%',
    height: 337,
    borderRadius: 8,
    marginTop: hp('0.9%'),
  },
  toDoHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  toDoText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
  },
  actionButton: {
    marginRight: wp('5%'),
    marginTop: hp('1%'),
    alignSelf: 'center',
  },
  toDo: {
    marginLeft: wp('10%'),
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),
  },
});

export default Dashboard2;
