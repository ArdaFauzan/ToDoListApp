import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
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
import Toast from 'react-native-root-toast';
import LoginToast from '../Toast/LoginToast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DrawerMenu from '../../assets/drawer.svg';
import Camera from '../../assets/camerauser.svg';
import Plus from '../../assets/plus.svg';
import AddToDo from './AddToDo';
import {useFocusEffect} from '@react-navigation/native';
import ToDoCalendar from '../calendar/ToDoCalendar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SafeImage = ({source, style, defaultSource, onError, ...props}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = error => {
    console.log('SafeImage error:', error);
    setHasError(true);
    if (onError) {
      onError(error);
    }
  };

  const getValidSource = () => {
    if (hasError) {
      return defaultSource;
    }

    if (!source) {
      return defaultSource;
    }

    if (typeof source === 'number') {
      return source;
    }

    if (typeof source === 'object' && source.uri) {
      const uri = source.uri;
      if (
        uri &&
        uri.trim() &&
        uri !== 'null' &&
        uri !== 'undefined' &&
        (uri.startsWith('http') ||
          uri.startsWith('file://') ||
          uri.startsWith('content://') || // Android content URI
          uri.startsWith('ph://') || // iOS Photos URI
          uri.startsWith('/')) // Absolute path
      ) {
        return source;
      }
    }

    return defaultSource;
  };

  const validSource = getValidSource();

  return validSource ? (
    <Image
      source={validSource}
      style={style}
      onError={handleError}
      resizeMode="cover"
      {...props}
    />
  ) : (
    <View
      style={[
        style,
        {
          backgroundColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <Text style={{color: '#666', fontSize: 24}}>👤</Text>
    </View>
  );
};

const Dashboard = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();
  const hasLoadedTodos = useRef(false);

  const [state, setState] = useState({
    showModal: false,
    userName: '',
    greeting: '',
    backPressedOnce: false,
    showAddToDoModal: false,
    isEditMode: false,
    todoToEdit: null,
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
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [onBackPress]);

  useEffect(() => {
    if (!hasLoadedTodos.current) {
      return;
    }

    saveTodosToStorage(globalState.todos);
  }, [globalState.todos]);

  const getTodosFromStorage = async () => {
    try {
      dispatch({type: 'SET_LOADING', inputValue: true});

      const storedTodos = await AsyncStorage.getItem('todos');

      if (storedTodos && storedTodos !== 'null' && storedTodos !== '[]') {
        try {
          const parsedTodos = JSON.parse(storedTodos);

          if (Array.isArray(parsedTodos) && parsedTodos.length > 0) {
            const validatedTodos = parsedTodos.map(todo => ({
              id: todo.id || Date.now() + Math.random(),
              title: todo.title || '',
              date: todo.date || '',
              time: todo.time || '',
              completed: todo.completed || 0,
            }));

            dispatch({type: 'SET_TODOS', inputValue: validatedTodos});
          } else {
            dispatch({type: 'SET_TODOS', inputValue: []});
          }
        } catch (parseError) {
          console.log('Error parsing todos from storage:', parseError);
          dispatch({type: 'SET_TODOS', inputValue: []});
        }
      } else {
        dispatch({type: 'SET_TODOS', inputValue: []});
      }

      hasLoadedTodos.current = true;
    } catch (error) {
      console.log('Error getting todos from storage: ', error);
      dispatch({type: 'SET_TODOS', inputValue: []});
      hasLoadedTodos.current = true;
    } finally {
      dispatch({type: 'SET_LOADING', inputValue: false});
    }
  };

  const saveTodosToStorage = async todos => {
    try {
      const jsonTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', jsonTodos);
    } catch (error) {
      console.log('Error saving todos to storage: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedTodos.current) {
        getTodosFromStorage();
      }
      initializeDashboard();

      return () => {
        console.log('Dashboard blurring...');
      };
    }, [initializeDashboard]),
  );

  const initializeDashboard = useCallback(async () => {
    try {
      const getName = await AsyncStorage.getItem('name');
      await Promise.all([
        updateState('userName', getName),
        getPhotoUrlFromStorage(), // Load foto dari AsyncStorage dulu
        setGreetingMessage(),
      ]);

      // Kemudian sync dengan server (opsional)
      if (globalState.user_id && globalState.token) {
        getUserPhoto(globalState.user_id, globalState.token);
      }
    } catch (error) {
      console.log('Initialization error:', error);
    }
  }, [globalState.user_id, globalState.token]);

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
    }, 1000);
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

  const openAddToDoModal = () =>
    setState(s => ({
      ...s,
      showAddToDoModal: true,
      isEditMode: false,
      todoToEdit: null,
    }));

  const closeAddToDoModal = () =>
    setState(s => ({
      ...s,
      showAddToDoModal: false,
      isEditMode: false,
      todoToEdit: null,
    }));

  // Fungsi untuk menangani edit
  const handleEdit = item => {
    // Pastikan item memiliki semua data yang diperlukan
    const todoData = {
      id: item.id,
      title: item.title || '',
      date: item.date || '',
      time: item.time || '',
      completed: item.completed || 0,
    };

    setState(s => ({
      ...s,
      showAddToDoModal: true,
      isEditMode: true,
      todoToEdit: todoData,
    }));
  };

  const deleteCheckedHandler = async () => {
    if (globalState.checkedIds.length > 0) {
      dispatch({type: 'DELETE_CHECKED_TODOS'});
    }
  };

  const renderItem = ({item}) => <ToDo key={item.id} list={item} />;

  const handleCameraClick = () => {
    updateState('showModal', true);
  };

  const getUserPhoto = async () => {
    await getPhotoUrlFromStorage();
  };

  const getPhotoUrlFromStorage = async () => {
    try {
      // Coba ambil dengan user-specific key dulu
      let photoUri = null;

      if (globalState.user_id) {
        photoUri = await AsyncStorage.getItem(
          `userPhoto_${globalState.user_id}`,
        );
      }

      // Jika tidak ada, coba dengan key umum
      if (!photoUri || photoUri === 'null' || photoUri === 'undefined') {
        photoUri = await AsyncStorage.getItem('userPhotoUrl');
      }

      if (photoUri && photoUri !== 'null' && photoUri !== 'undefined') {
        updateState('SET_IMAGE_URI', photoUri, true);
      } else {
        updateState('SET_IMAGE_URI', '', true);
      }
    } catch (error) {
      console.log('Error getting photo URI from AsyncStorage:', error);
      updateState('SET_IMAGE_URI', '', true);
    }
  };

  const addTodoHandler = async newTodoData => {
    const newTodo = {
      id: Date.now() + Math.random(),
      title: newTodoData.title || '',
      date: newTodoData.date || '',
      time: newTodoData.time || '',
      completed: 0,
    };

    dispatch({type: 'ADD_TODO', inputValue: newTodo});
    closeAddToDoModal();
  };

  const updateTodoHandler = async (id, updatedTodoData) => {
    try {
      // Dispatch update
      dispatch({
        type: 'UPDATE_TODO',
        payload: {id, updatedTodo: updatedTodoData},
      });

      // Close modal dengan slight delay untuk memastikan update selesai
      setTimeout(() => {
        closeAddToDoModal();
      }, 100);
    } catch (error) {
      console.log('Error updating todo:', error);
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const avatarSource = (() => {
    if (
      typeof globalState.imageUri === 'string' &&
      globalState.imageUri.trim() &&
      globalState.imageUri !== 'null' &&
      globalState.imageUri !== 'undefined' &&
      globalState.imageUri.length > 0
    ) {
      return {uri: globalState.imageUri};
    }

    return require('../../assets/user.png');
  })();

  return (
    <View style={[styles.container, {backgroundColor: activeColors.primary}]}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
      />

      <ImageBackground
        source={
          theme.mode === 'dark'
            ? require('../../assets/bgdashboarddark.png')
            : require('../../assets/bgdashboard.png')
        }
        style={styles.headerBackground}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawer}>
          <DrawerMenu height={43} width={39} />
        </TouchableOpacity>

        <View style={styles.userSection}>
          <View style={styles.avatarWrapper}>
            <SafeImage
              source={avatarSource}
              style={styles.userImage}
              defaultSource={require('../../assets/user.png')}
              onError={error => {
                console.warn('Avatar image error, fallback to default');
                updateState('SET_IMAGE_URI', '', true);
              }}
            />
            <TouchableOpacity
              onPress={handleCameraClick}
              style={styles.cameraButton}>
              <Camera height={32} width={32} />
            </TouchableOpacity>
          </View>
          <Text style={styles.welcomeText}>Welcome {state.userName}!</Text>
        </View>
      </ImageBackground>

      <View
        style={[
          styles.calendarContainer,
          {backgroundColor: activeColors.secondary},
        ]}>
        <ToDoCalendar onEdit={handleEdit} />
      </View>

      <TouchableOpacity style={styles.fab} onPress={openAddToDoModal}>
        <Plus height={15} width={15} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={state.showModal}
        animationType="slide"
        onRequestClose={() => setState(s => ({...s, showModal: false}))}>
        <AddPhoto
          isVisible={state.showModal}
          onClose={() => setState(s => ({...s, showModal: false}))}
        />
      </Modal>

      <Modal
        transparent
        visible={state.showAddToDoModal}
        animationType="slide"
        onRequestClose={closeAddToDoModal}>
        <AddToDo
          onClose={closeAddToDoModal}
          onAdd={addTodoHandler}
          onUpdate={updateTodoHandler}
          isEditMode={state.isEditMode}
          todoToEdit={state.todoToEdit}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    width: '100%',
    height: 220,
    paddingTop: hp('3%'),
  },
  drawer: {
    position: 'absolute',
    top: hp('3%'),
    left: wp('6%'),
  },
  userSection: {
    alignItems: 'center',
    marginTop: hp('6%'),
  },
  avatarWrapper: {
    position: 'relative',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    right: -5,
    bottom: 0,
  },
  welcomeText: {
    marginTop: 8,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: hp('1%'),
  },
  calendarContainer: {
    flex: 1,
  },
  toDoListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#50C2C9',
  },
});

export default Dashboard;
