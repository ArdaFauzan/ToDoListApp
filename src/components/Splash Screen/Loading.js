import React, {useContext, useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Splash1 from '../../assets/splashtodolist.svg';
import Splash2 from '../../assets/splashchecklist.svg';
import {getDataAsync} from '../Utils/AsyncStorage';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import LoginToast from '../Toast/LoginToast';
import Toast from 'react-native-root-toast';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loading = ({navigation}) => {
  const {theme, updateTheme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const globalState = useSelector(state => state.DashboardReducer);
  const dispatch = useDispatch();

  const updateState = (key, value, isGlobal = false) => {
    if (isGlobal) {
      dispatch({type: key, inputValue: value});
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await getDataAsync('token');
        const user_id = await getDataAsync('user_id');
        const timer = setTimeout(() => {
          if (userToken !== null) {
            updateState('SET_USER_ID', user_id, true);
            updateState('SET_TOKEN', userToken, true);
            showCustomToast();
            navigation.navigate('Dashboard');
          } else {
            navigation.navigate('SlashPage');
          }
        }, 2000);

        return () => clearTimeout(timer);
      } catch (e) {
        console.log('Restoring token failed: ', e);
      }
    };

    const fetchTheme = async () => {
      try {
        const getData = await getDataAsync('theme');
        const getTheme = JSON.parse(getData);

        if (getTheme) {
          updateTheme(getTheme);
        }
      } catch (error) {
        console.log('Restoring theme failed: ', error);
      }
    };

    const showCustomToast = () => {
      const toast = Toast.show(<LoginToast message="Hello, Welcome Back" />, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        containerStyle: {
          backgroundColor: '#50C2C9',
          borderRadius: 30,
          width: 210,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        },
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
        shadowStyle: {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.8,
          shadowRadius: 2,
        },
      });

      setTimeout(() => {
        Toast.hide(toast);
      }, 3000);
    };

    const handleLogOut = async () => {
      if (globalState.loggedOut) {
        await AsyncStorage.clear();
      }
    };

    handleLogOut();
    checkLoginStatus();
    fetchTheme();
  }, [navigation]);

  return (
    <View style={[styles.container, {backgroundColor: activeColors.primary}]}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'light' ? 'dark-content' : activeColors.text}
        backgroundColor={'transparent'}
      />

      <View style={styles.contentWrapping}>
        <View style={styles.splash1}>
          <Splash1 width={57} height={57} />
        </View>

        <Splash2 width={156} height={168} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapping: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  splash1: {
    marginBottom: hp('20%'),
  },
});

export default Loading;
